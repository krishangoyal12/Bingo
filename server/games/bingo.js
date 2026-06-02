function isValidBoard(board) {
    if (!Array.isArray(board) || board.length !== 25) return false;
    const set = new Set();
    for (const value of board) {
        if (!Number.isInteger(value) || value < 1 || value > 25) return false;
        set.add(value);
    }
    return set.size === 25;
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

function checkAutoWin(roomId, rooms, clearTurnTimer) {
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
function boardsEqual(first, second) {
    if (!Array.isArray(first) || !Array.isArray(second)) return false;
    if (first.length !== second.length) return false;
    for (let i = 0; i < first.length; i += 1) {
        if (first[i] !== second[i]) return false;
    }
    return true;
}

module.exports = function registerBingoEvents(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer) {
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
        if (checkAutoWin(roomId, rooms, clearTurnTimer)) {
            broadcastState(roomId);
            return;
        }

        room.turn = room.turn === "A" ? "B" : "A";
        startTurnTimer(roomId);

        broadcastState(roomId);
    });
};

module.exports.checkAutoWin = checkAutoWin;
module.exports.countLines = countLines;
