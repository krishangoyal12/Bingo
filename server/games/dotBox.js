function checkDotBoxWin(dotBox) {
    let totalBoxes = 0;
    let countA = 0;
    let countB = 0;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (dotBox.boxes[r][c] !== null) {
                totalBoxes++;
                if (dotBox.boxes[r][c] === "A") countA++;
                if (dotBox.boxes[r][c] === "B") countB++;
            }
        }
    }
    
    if (totalBoxes === 81) {
        if (countA > countB) return "A";
        if (countB > countA) return "B";
        return "TIE";
    }
    return null;
}

function registerDotBoxEvents(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer) {
    socket.on("makeDotBoxMove", ({ type, r, c }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.gameType !== "dotBox") return;
        if (room.status !== "playing") {
            socket.emit("errorMessage", "Game not active.");
            return;
        }
        if (room.turn !== slot) {
            socket.emit("errorMessage", "Not your turn.");
            return;
        }

        const state = room.dotBox;
        if (!state) return;

        let isValid = false;
        if (type === "h") {
            if (r >= 0 && r < 10 && c >= 0 && c < 9 && !state.hLines[r][c]) {
                state.hLines[r][c] = true;
                isValid = true;
            }
        } else if (type === "v") {
            if (r >= 0 && r < 9 && c >= 0 && c < 10 && !state.vLines[r][c]) {
                state.vLines[r][c] = true;
                isValid = true;
            }
        }

        if (!isValid) {
            socket.emit("errorMessage", "Invalid move.");
            return;
        }

        // Check for completed boxes
        let boxesCompleted = 0;

        // Helper to check a box
        const checkBox = (br, bc) => {
            if (br < 0 || br >= 9 || bc < 0 || bc >= 9) return false;
            if (state.boxes[br][bc] !== null) return false; // already claimed

            if (state.hLines[br][bc] && state.hLines[br + 1][bc] &&
                state.vLines[br][bc] && state.vLines[br][bc + 1]) {
                state.boxes[br][bc] = slot;
                room.score[slot]++;
                return true;
            }
            return false;
        };

        if (type === "h") {
            // Horizontal line affects box above (r-1) and below (r)
            if (checkBox(r - 1, c)) boxesCompleted++;
            if (checkBox(r, c)) boxesCompleted++;
        } else {
            // Vertical line affects box left (c-1) and right (c)
            if (checkBox(r, c - 1)) boxesCompleted++;
            if (checkBox(r, c)) boxesCompleted++;
        }

        if (boxesCompleted > 0) {
            // Player gets a bonus turn
            socket.emit("bonusTurn", { count: boxesCompleted });
        } else {
            // Switch turn
            room.turn = room.turn === "A" ? "B" : "A";
        }

        startTurnTimer(roomId); // Reset turn timer on valid move

        const winResult = checkDotBoxWin(state);
        if (winResult) {
            room.status = "finished";
            clearTurnTimer(room);
        }

        broadcastState(roomId);
    });
}

module.exports = registerDotBoxEvents;
