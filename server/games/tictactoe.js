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

module.exports = function registerTTTEvents(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer) {
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
};

module.exports.checkTTTWin = checkTTTWin;
