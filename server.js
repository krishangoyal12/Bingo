const registerBingoEvents = require('./server/games/bingo');
const registerTTTEvents = require('./server/games/tictactoe');
const registerChopsticksEvents = require('./server/games/chopsticks');
const registerDotBoxEvents = require('./server/games/dotBox');
const { registerRPSEvents, startRpsRound } = require('./server/games/rps');
const { registerConnect5Events, initConnect5Board } = require('./server/games/connect5');

const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
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


function boardsEqual(first, second) {
    if (!Array.isArray(first) || !Array.isArray(second)) return false;
    if (first.length !== second.length) return false;
    for (let i = 0; i < first.length; i += 1) {
        if (first[i] !== second[i]) return false;
    }
    return true;
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


function buildState(roomId) {
    const room = rooms.get(roomId);
    const linesA = registerBingoEvents.countLines(room.boards.A, room.called);
    const linesB = registerBingoEvents.countLines(room.boards.B, room.called);
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
        dotBox: room.dotBox || null,
        rps: room.rps || null,
        connect5: room.connect5 || null,
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
    room.connect5 = null;
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
            dotBox: {
                hLines: Array(10).fill(null).map(() => Array(9).fill(false)),
                vLines: Array(9).fill(null).map(() => Array(10).fill(false)),
                boxes: Array(9).fill(null).map(() => Array(9).fill(null))
            },
            rps: null,
            connect5: null,
            rpsTargetWins: 3, // Best of 5 (first to 3) by default
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

    
        registerBingoEvents(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer);
        registerTTTEvents(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer);
        registerChopsticksEvents(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer);
        registerDotBoxEvents(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer);
        registerRPSEvents(io, socket, rooms, broadcastState);
        registerConnect5Events(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer);

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

    
    
    socket.on("resetGame", () => {
        const roomId = socket.data.roomId;
        const room = rooms.get(roomId);
        if (!room) return;
        
        const isTTTRematch = room.gameType === "tictactoe" && (room.status === "finished" || room.score.A > 0 || room.score.B > 0);
        const isChopRematch = room.gameType === "chopsticks" && (room.status === "finished" || room.score.A > 0 || room.score.B > 0);
        const isDotBoxRematch = room.gameType === "dotBox" && (room.status === "finished" || room.score.A > 0 || room.score.B > 0);
        const isRpsRematch = room.gameType === "rps" && (room.status === "finished" || room.score.A > 0 || room.score.B > 0);
        const isConnect5Rematch = room.gameType === "connect5" && (room.status === "finished" || room.score.A > 0 || room.score.B > 0);
        
        if (isTTTRematch || isChopRematch || isDotBoxRematch || isRpsRematch || isConnect5Rematch) {
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
            
            if (room.gameType === "rps") {
                room.rps = {
                    round: 1,
                    moves: { A: null, B: null },
                    targetWins: room.rpsTargetWins || 3,
                    scores: { A: 0, B: 0 },
                    history: []
                };
                room.status = "playing";
                startRpsRound(roomId, rooms, io, broadcastState);
            } else if (room.gameType === "connect5") {
                room.connect5 = {
                    board: initConnect5Board(),
                    scores: { A: 0, B: 0 },
                    scored: { A: [], B: [] },
                    lastMove: null
                };
                room.status = "playing";
            } else {
                room.status = "playing";
                // Alternate starting player based on round
                room.turn = room.round % 2 === 1 ? "A" : "B";
                startTurnTimer(roomId);
            }
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
        if (gameType !== "bingo" && gameType !== "tictactoe" && gameType !== "chopsticks" && gameType !== "dotBox" && gameType !== "rps" && gameType !== "connect5") {
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
        room.rps = null;
        room.connect5 = null;
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
        if (room.gameType !== "tictactoe" && room.gameType !== "chopsticks" && room.gameType !== "dotBox" && room.gameType !== "rps" && room.gameType !== "connect5") {
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
            } else if (room.gameType === "dotBox") {
                room.dotBox = {
                    hLines: Array(10).fill(null).map(() => Array(9).fill(false)),
                    vLines: Array(9).fill(null).map(() => Array(10).fill(false)),
                    boxes: Array(9).fill(null).map(() => Array(9).fill(null))
                };
                startTurnTimer(roomId);
            } else if (room.gameType === "rps") {
                room.rps = {
                    round: 1,
                    moves: { A: null, B: null },
                    targetWins: room.rpsTargetWins || 3,
                    scores: { A: 0, B: 0 },
                    history: []
                };
                startRpsRound(roomId, rooms, io, broadcastState);
                return;
            } else if (room.gameType === "connect5") {
                room.connect5 = {
                    board: initConnect5Board(),
                    scores: { A: 0, B: 0 },
                    scored: { A: [], B: [] },
                    lastMove: null
                };
            }
            if (room.gameType !== "rps" && room.gameType !== "dotBox") {
                startTurnTimer(roomId);
            }
        }
        broadcastState(roomId);
    });

    
    
    
    socket.on("forfeitGame", () => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.status !== "playing") return;
        
        clearTurnTimer(room);
        if (room.rpsTimer) {
            clearTimeout(room.rpsTimer);
            room.rpsTimer = null;
        }
        
        room.status = "finished";
        room.winner = slot === "A" ? "B" : "A";
        
        if (room.score) {
            room.score[room.winner] = (room.score[room.winner] || 0) + 1;
        }
        
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
