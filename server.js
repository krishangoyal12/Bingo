const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const rooms = new Map();
const TURN_TIME_MS = 30000; // 30 seconds per turn

function createRoomId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i += 1) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function isValidBoard(board) {
    if (!Array.isArray(board) || board.length !== 25) return false;
    const set = new Set();
    for (const value of board) {
        if (!Number.isInteger(value) || value < 1 || value > 25) return false;
        set.add(value);
    }
    return set.size === 25;
}

function boardsEqual(first, second) {
    if (!Array.isArray(first) || !Array.isArray(second)) return false;
    if (first.length !== second.length) return false;
    for (let i = 0; i < first.length; i += 1) {
        if (first[i] !== second[i]) return false;
    }
    return true;
}

function countLines(board, calledSet) {
    if (!board || board.length !== 25) return 0;
    const marked = Array.from({ length: 5 }, () => Array(5).fill(false));
    for (let i = 0; i < 25; i += 1) {
        const r = Math.floor(i / 5);
        const c = i % 5;
        marked[r][c] = calledSet.has(board[i]);
    }
    let lines = 0;
    for (let r = 0; r < 5; r += 1) {
        if (marked[r].every(Boolean)) lines += 1;
    }
    for (let c = 0; c < 5; c += 1) {
        let ok = true;
        for (let r = 0; r < 5; r += 1) {
            if (!marked[r][c]) ok = false;
        }
        if (ok) lines += 1;
    }
    let diag1 = true;
    let diag2 = true;
    for (let i = 0; i < 5; i += 1) {
        if (!marked[i][i]) diag1 = false;
        if (!marked[i][4 - i]) diag2 = false;
    }
    if (diag1) lines += 1;
    if (diag2) lines += 1;
    return lines;
}

function checkTTTWin(board) {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (const [a, b, c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Returns "A" or "B"
        }
    }
    return null;
}

function checkChopsticksWin(chopsticks) {
    if (chopsticks.A.left === 0 && chopsticks.A.right === 0) return "B"; // B wins
    if (chopsticks.B.left === 0 && chopsticks.B.right === 0) return "A"; // A wins
    return null;
}

function clearTurnTimer(room) {
    if (room.turnTimer) {
        clearTimeout(room.turnTimer);
        room.turnTimer = null;
    }
    room.turnDeadline = null;
}

function startTurnTimer(roomId) {
    const room = rooms.get(roomId);
    if (!room || room.status !== "playing") return;

    clearTurnTimer(room);

    room.turnDeadline = Date.now() + TURN_TIME_MS;

    room.turnTimer = setTimeout(() => {
        const r = rooms.get(roomId);
        if (!r || r.status !== "playing") return;

        // Auto-skip turn
        r.turn = r.turn === "A" ? "B" : "A";
        startTurnTimer(roomId);
        broadcastState(roomId);
    }, TURN_TIME_MS);
}

function checkAutoWin(roomId) {
    const room = rooms.get(roomId);
    if (!room || room.status !== "playing") return false;

    const linesA = countLines(room.boards.A, room.called);
    const linesB = countLines(room.boards.B, room.called);

    if (linesA >= 5 && linesB >= 5) {
        room.status = "finished";
        room.winner = "TIE";
        clearTurnTimer(room);
        return true;
    } else if (linesA >= 5) {
        room.status = "finished";
        room.winner = "A";
        clearTurnTimer(room);
        return true;
    } else if (linesB >= 5) {
        room.status = "finished";
        room.winner = "B";
        clearTurnTimer(room);
        return true;
    }
    return false;
}

function buildState(roomId) {
    const room = rooms.get(roomId);
    const linesA = countLines(room.boards.A, room.called);
    const linesB = countLines(room.boards.B, room.called);
    return {
        roomId,
        status: room.status,
        turn: room.turn,
        winner: room.winner,
        round: room.round,
        calledNumbers: Array.from(room.called),
        layoutIds: room.layoutIds,
        turnDeadline: room.turnDeadline,
        gameType: room.gameType || "bingo",
        tttBoard: room.tttBoard || Array(9).fill(null),
        chopsticks: room.chopsticks || { A: { left: 1, right: 1 }, B: { left: 1, right: 1 } },
        score: room.score || { A: 0, B: 0 },
        players: {
            A: {
                name: room.players.A?.name || null,
                ready: room.ready.A,
                connected: !!room.players.A && room.players.A.connected,
                socketId: room.players.A?.id || null,
            },
            B: {
                name: room.players.B?.name || null,
                ready: room.ready.B,
                connected: !!room.players.B && room.players.B.connected,
                socketId: room.players.B?.id || null,
            },
        },
        boards: {
            A: room.boards.A,
            B: room.boards.B,
        },
        lines: {
            A: linesA,
            B: linesB,
        },
    };
}

function broadcastState(roomId) {
    const state = buildState(roomId);
    io.to(roomId).emit("state", state);
}

function resetRoom(room) {
    clearTurnTimer(room);
    room.ready.A = false;
    room.ready.B = false;
    room.boards.A = null;
    room.boards.B = null;
    room.layoutIds.A = null;
    room.layoutIds.B = null;
    room.called.clear();
    room.status = "setup";
    room.winner = null;
    room.turn = "A";
    room.round += 1;
    room.tttBoard = Array(9).fill(null);
    room.chopsticks = { A: { left: 1, right: 1 }, B: { left: 1, right: 1 } };
}

function removePlayer(roomId, slot) {
    const room = rooms.get(roomId);
    if (!room) return;
    
    room.players[slot] = null;
    const otherSlot = slot === "A" ? "B" : "A";
    const otherPlayer = room.players[otherSlot];
    if (otherPlayer && otherPlayer.id) {
        io.to(otherPlayer.id).emit("opponentLeft");
    }

    clearTurnTimer(room);
    rooms.delete(roomId);
}

io.on("connection", (socket) => {
    socket.on("createRoom", ({ name, sessionId }) => {
        let roomId = createRoomId();
        while (rooms.has(roomId)) {
            roomId = createRoomId();
        }

        const room = {
            id: roomId,
            players: {
                A: { id: socket.id, sessionId, name: name || "Player A", connected: true },
                B: null,
            },
            boards: { A: null, B: null },
            layoutIds: { A: null, B: null },
            ready: { A: false, B: false },
            called: new Set(),
            turn: "A",
            status: "setup",
            winner: null,
            round: 1,
            turnTimer: null,
            turnDeadline: null,
            gameType: "bingo",
            tttBoard: Array(9).fill(null),
            chopsticks: { A: { left: 1, right: 1 }, B: { left: 1, right: 1 } },
            score: { A: 0, B: 0 },
        };

        rooms.set(roomId, room);
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.playerSlot = "A";

        socket.emit("roomCreated", { roomId, playerSlot: "A" });
        broadcastState(roomId);
    });

    socket.on("joinRoom", ({ roomId, name, sessionId }) => {
        const room = rooms.get(roomId);
        if (!room) {
            socket.emit("errorMessage", "Room not found.");
            return;
        }
        let slot = null;
        if (!room.players.A) slot = "A";
        else if (!room.players.B) slot = "B";
        else {
            socket.emit("errorMessage", "Room is full.");
            return;
        }

        room.players[slot] = { id: socket.id, sessionId, name: name || `Player ${slot}`, connected: true };
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.playerSlot = slot;

        socket.emit("roomJoined", { roomId, playerSlot: slot });
        broadcastState(roomId);
    });

    socket.on("rejoinRoom", ({ roomId, sessionId }) => {
        const room = rooms.get(roomId);
        if (!room) {
            socket.emit("errorMessage", "Room not found.");
            return;
        }
        let slot = null;
        if (room.players.A && room.players.A.sessionId === sessionId) slot = "A";
        else if (room.players.B && room.players.B.sessionId === sessionId) slot = "B";

        if (!slot) {
            socket.emit("errorMessage", "Not part of this room.");
            return;
        }

        room.players[slot].id = socket.id;
        room.players[slot].connected = true;
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.playerSlot = slot;

        socket.emit("roomJoined", { roomId, playerSlot: slot });
        broadcastState(roomId);
    });

    socket.on("setBoard", ({ board, ready, layoutId: rawLayoutId }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.status !== "setup") {
            socket.emit("errorMessage", "Game already started.");
            return;
        }
        if (!isValidBoard(board)) {
            socket.emit("errorMessage", "Board must contain numbers 1-25 without duplicates.");
            return;
        }

        // Accept any non-negative integer layout ID (supports custom layouts)
        let layoutId = null;
        if (rawLayoutId !== null && rawLayoutId !== undefined) {
            const parsed = Number(rawLayoutId);
            if (!Number.isInteger(parsed) || parsed < 0) {
                socket.emit("errorMessage", "Invalid layout.");
                return;
            }
            layoutId = parsed;
        }

        const otherSlot = slot === "A" ? "B" : "A";
        if (layoutId !== null && room.layoutIds[otherSlot] === layoutId) {
            socket.emit("errorMessage", "Opponent already uses this layout.");
            return;
        }
        if (room.boards[otherSlot] && boardsEqual(board, room.boards[otherSlot])) {
            socket.emit("errorMessage", "Opponent already uses this layout.");
            return;
        }
        room.boards[slot] = board;
        room.layoutIds[slot] = layoutId;
        room.ready[slot] = ready === true;

        if (room.ready.A && room.ready.B) {
            room.status = "playing";
            room.turn = "A";
            startTurnTimer(roomId);
        }
        broadcastState(roomId);
    });

    socket.on("callNumber", ({ number }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.gameType !== "bingo") {
            socket.emit("errorMessage", "Not playing Bingo.");
            return;
        }
        if (room.status !== "playing") {
            socket.emit("errorMessage", "Game has not started yet.");
            return;
        }
        if (room.turn !== slot) {
            socket.emit("errorMessage", "Not your turn.");
            return;
        }
        const value = Number(number);
        if (!Number.isInteger(value) || value < 1 || value > 25) {
            socket.emit("errorMessage", "Invalid number.");
            return;
        }
        const board = room.boards[slot];
        if (!Array.isArray(board) || !board.includes(value)) {
            socket.emit("errorMessage", "You can only call numbers on your board.");
            return;
        }
        if (room.called.has(value)) {
            socket.emit("errorMessage", "Number already called.");
            return;
        }
        room.called.add(value);

        // Check for auto-win before switching turns
        if (checkAutoWin(roomId)) {
            broadcastState(roomId);
            return;
        }

        room.turn = room.turn === "A" ? "B" : "A";
        startTurnTimer(roomId);

        broadcastState(roomId);
    });

    socket.on("resetGame", () => {
        const roomId = socket.data.roomId;
        const room = rooms.get(roomId);
        if (!room) return;
        
        const isTTTRematch = room.gameType === "tictactoe" && (room.score.A > 0 || room.score.B > 0);
        const isChopRematch = room.gameType === "chopsticks" && (room.score.A > 0 || room.score.B > 0);
        
        if (isTTTRematch || isChopRematch) {
            clearTurnTimer(room);
            room.ready.A = true;
            room.ready.B = true;
            room.boards.A = null;
            room.boards.B = null;
            room.layoutIds.A = null;
            room.layoutIds.B = null;
            room.called.clear();
            room.winner = null;
            room.tttBoard = Array(9).fill(null);
            room.chopsticks = { A: { left: 1, right: 1 }, B: { left: 1, right: 1 } };
            room.round += 1;
            room.status = "playing";
            // Alternate starting player based on round
            room.turn = room.round % 2 === 1 ? "A" : "B";
            startTurnTimer(roomId);
        } else {
            resetRoom(room);
        }
        
        broadcastState(roomId);
    });

    socket.on("setGameType", ({ gameType }) => {
        const roomId = socket.data.roomId;
        const room = rooms.get(roomId);
        if (!room) return;
        if (room.status !== "setup" && room.status !== "finished") {
            socket.emit("errorMessage", "Cannot change game type mid-game.");
            return;
        }
        if (gameType !== "bingo" && gameType !== "tictactoe" && gameType !== "chopsticks") {
            socket.emit("errorMessage", "Invalid game type.");
            return;
        }
        
        const oldGameType = room.gameType;
        room.gameType = gameType;
        room.status = "setup";
        
        // Reset round setup
        room.ready.A = false;
        room.ready.B = false;
        room.boards.A = null;
        room.boards.B = null;
        room.layoutIds.A = null;
        room.layoutIds.B = null;
        room.called.clear();
        room.winner = null;
        room.tttBoard = Array(9).fill(null);
        room.chopsticks = { A: { left: 1, right: 1 }, B: { left: 1, right: 1 } };
        room.turn = "A";
        clearTurnTimer(room);
        
        // Reset score only if changing game type
        if (oldGameType !== gameType) {
            room.score.A = 0;
            room.score.B = 0;
        }
        
        broadcastState(roomId);
    });

    socket.on("setReady", ({ ready }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.status !== "setup") return;
        if (room.gameType !== "tictactoe" && room.gameType !== "chopsticks") {
            socket.emit("errorMessage", "Ready state only toggled directly in setup-free modes.");
            return;
        }
        
        room.ready[slot] = ready === true;
        if (room.ready.A && room.ready.B) {
            room.status = "playing";
            // Randomly choose starting player
            room.turn = Math.random() < 0.5 ? "A" : "B";
            if (room.gameType === "tictactoe") {
                room.tttBoard = Array(9).fill(null);
            } else if (room.gameType === "chopsticks") {
                room.chopsticks = { A: { left: 1, right: 1 }, B: { left: 1, right: 1 } };
            }
            startTurnTimer(roomId);
        }
        broadcastState(roomId);
    });

    socket.on("makeTTTMove", ({ index }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.gameType !== "tictactoe") return;
        if (room.status !== "playing") {
            socket.emit("errorMessage", "Game not active.");
            return;
        }
        if (room.turn !== slot) {
            socket.emit("errorMessage", "Not your turn.");
            return;
        }
        const idx = Number(index);
        if (!Number.isInteger(idx) || idx < 0 || idx > 8) {
            socket.emit("errorMessage", "Invalid move.");
            return;
        }
        if (room.tttBoard[idx] !== null) {
            socket.emit("errorMessage", "Cell is already occupied.");
            return;
        }
        
        // Make move
        room.tttBoard[idx] = slot;
        
        // Check win
        const winnerSymbol = checkTTTWin(room.tttBoard);
        if (winnerSymbol) {
            room.status = "finished";
            room.winner = winnerSymbol; // "A" or "B"
            room.score[winnerSymbol] += 1;
            clearTurnTimer(room);
        } else {
            // Check tie
            const isTie = room.tttBoard.every(cell => cell !== null);
            if (isTie) {
                room.status = "finished";
                room.winner = "TIE";
                clearTurnTimer(room);
            } else {
                // Alternate turn
                room.turn = slot === "A" ? "B" : "A";
                startTurnTimer(roomId);
            }
        }
        
        broadcastState(roomId);
    });

    socket.on("makeChopsticksAttack", ({ fromHand, toHand }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.gameType !== "chopsticks") return;
        if (room.status !== "playing") {
            socket.emit("errorMessage", "Game not active.");
            return;
        }
        if (room.turn !== slot) {
            socket.emit("errorMessage", "Not your turn.");
            return;
        }
        if (fromHand !== "left" && fromHand !== "right") return;
        if (toHand !== "left" && toHand !== "right") return;
        
        const otherSlot = slot === "A" ? "B" : "A";
        const attackerVal = room.chopsticks[slot][fromHand];
        const defenderVal = room.chopsticks[otherSlot][toHand];
        
        if (attackerVal <= 0) {
            socket.emit("errorMessage", "Attacking hand is dead.");
            return;
        }
        if (defenderVal <= 0) {
            socket.emit("errorMessage", "Defender hand is already dead.");
            return;
        }
        
        // Execute attack
        const newVal = (attackerVal + defenderVal) % 5;
        room.chopsticks[otherSlot][toHand] = newVal;
        
        // Check win
        const winnerSlot = checkChopsticksWin(room.chopsticks);
        if (winnerSlot) {
            room.status = "finished";
            room.winner = winnerSlot;
            room.score[winnerSlot] += 1;
            clearTurnTimer(room);
        } else {
            // Alternate turn
            room.turn = otherSlot;
            startTurnTimer(roomId);
        }
        
        broadcastState(roomId);
    });

    socket.on("makeChopsticksRedistribute", ({ left, right }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.gameType !== "chopsticks") return;
        if (room.status !== "playing") {
            socket.emit("errorMessage", "Game not active.");
            return;
        }
        if (room.turn !== slot) {
            socket.emit("errorMessage", "Not your turn.");
            return;
        }
        
        const l = Number(left);
        const r = Number(right);
        if (!Number.isInteger(l) || l < 0 || l > 4) return;
        if (!Number.isInteger(r) || r < 0 || r > 4) return;
        
        const oldLeft = room.chopsticks[slot].left;
        const oldRight = room.chopsticks[slot].right;
        
        const sumFingers = oldLeft + oldRight;
        
        // Cannot distribute if both hands are dead or sum is 1
        if (oldLeft === 0 && oldRight === 0) {
            socket.emit("errorMessage", "Both hands are dead.");
            return;
        }
        if (sumFingers <= 1) {
            socket.emit("errorMessage", "Need more than 1 finger total to redistribute.");
            return;
        }
        
        // Sum conservation
        if (l + r !== oldLeft + oldRight) {
            socket.emit("errorMessage", "Total fingers must remain unchanged.");
            return;
        }
        // State difference (unordered comparison)
        const oldMin = Math.min(oldLeft, oldRight);
        const oldMax = Math.max(oldLeft, oldRight);
        const newMin = Math.min(l, r);
        const newMax = Math.max(l, r);
        
        if (newMin === oldMin && newMax === oldMax) {
            socket.emit("errorMessage", "Must produce a different state.");
            return;
        }
        
        // Update hands
        room.chopsticks[slot].left = l;
        room.chopsticks[slot].right = r;
        
        // Alternate turn
        room.turn = slot === "A" ? "B" : "A";
        startTurnTimer(roomId);
        
        broadcastState(roomId);
    });

    socket.on("leaveRoom", () => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        if (roomId && slot) {
            removePlayer(roomId, slot);
        }
    });

    // --- WebRTC Signaling ---
    socket.on("webrtc-offer", (offer) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        if (!roomId || !slot) return;
        const room = rooms.get(roomId);
        if (!room) return;
        const otherSlot = slot === "A" ? "B" : "A";
        const otherPlayer = room.players[otherSlot];
        if (otherPlayer && otherPlayer.id) {
            io.to(otherPlayer.id).emit("webrtc-offer", offer);
        }
    });

    socket.on("webrtc-answer", (answer) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        if (!roomId || !slot) return;
        const room = rooms.get(roomId);
        if (!room) return;
        const otherSlot = slot === "A" ? "B" : "A";
        const otherPlayer = room.players[otherSlot];
        if (otherPlayer && otherPlayer.id) {
            io.to(otherPlayer.id).emit("webrtc-answer", answer);
        }
    });

    socket.on("webrtc-ice-candidate", (candidate) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        if (!roomId || !slot) return;
        const room = rooms.get(roomId);
        if (!room) return;
        const otherSlot = slot === "A" ? "B" : "A";
        const otherPlayer = room.players[otherSlot];
        if (otherPlayer && otherPlayer.id) {
            io.to(otherPlayer.id).emit("webrtc-ice-candidate", candidate);
        }
    });

    socket.on("disconnect", () => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        if (roomId && slot) {
            const room = rooms.get(roomId);
            if (room && room.players[slot]) {
                // Prevent race condition: only mark as offline if this socket is the current socket for the slot
                if (room.players[slot].id === socket.id) {
                    room.players[slot].connected = false;
                    broadcastState(roomId);
                }
            }
        }
    });
});

server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Bingo server running on http://localhost:${PORT}`);
});
