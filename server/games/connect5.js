function initConnect5Board() {
    const board = [];
    for (let c = 0; c < 7; c++) {
        board.push(Array(7).fill(null));
    }
    return board;
}

function checkNewCombos(board, player, col, row, scoredCombos) {
    const newCombos = [];
    const directions = [
        { dc: 1, dr: 0, name: "horizontal" }, // Horizontal
        { dc: 0, dr: 1, name: "vertical" },   // Vertical
        { dc: 1, dr: 1, name: "diagonal_up" }, // Diagonal ↗
        { dc: 1, dr: -1, name: "diagonal_down" } // Diagonal ↘
    ];

    for (const dir of directions) {
        // A window of 4 cells contains (col, row) if it starts at (col - i * dc, row - i * dr) for i in [0, 3]
        for (let i = 0; i < 4; i++) {
            const startCol = col - i * dir.dc;
            const startRow = row - i * dir.dr;

            const cells = [];
            let isValid = true;

            for (let j = 0; j < 4; j++) {
                const c = startCol + j * dir.dc;
                const r = startRow + j * dir.dr;

                if (c < 0 || c >= 7 || r < 0 || r >= 7) {
                    isValid = false;
                    break;
                }

                if (board[c][r] !== player) {
                    isValid = false;
                    break;
                }

                cells.push({ col: c, row: r });
            }

            if (isValid) {
                // Sort cells to create a stable unique ID for this combo line
                const sortedCells = [...cells].sort((a, b) => {
                    if (a.col !== b.col) return a.col - b.col;
                    return a.row - b.row;
                });

                const comboId = sortedCells.map(cell => `${cell.col},${cell.row}`).join(":");

                // Check if this window overlaps with any already-scored combo of the same direction
                let overlaps = false;
                for (const oldCombo of scoredCombos) {
                    if (oldCombo.dir === dir.name) {
                        const sharesCell = sortedCells.some(newCell => 
                            oldCombo.cells.some(oldCell => oldCell.col === newCell.col && oldCell.row === newCell.row)
                        );
                        if (sharesCell) {
                            overlaps = true;
                            break;
                        }
                    }
                }

                if (!overlaps) {
                    const newComboObj = {
                        id: comboId,
                        dir: dir.name,
                        cells: sortedCells
                    };
                    scoredCombos.push(newComboObj);
                    newCombos.push(newComboObj);
                }
            }
        }
    }

    return newCombos;
}

function registerConnect5Events(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer) {
    socket.on("makeConnect5Move", ({ col }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);

        if (!room || !slot) return;
        if (room.gameType !== "connect5") return;
        if (room.status !== "playing") return;
        if (room.turn !== slot) return;

        const board = room.connect5.board;
        const colIndex = parseInt(col);
        if (isNaN(colIndex) || colIndex < 0 || colIndex >= 7) return;

        // Find gravity landing position (first empty row from bottom (0) to top (6))
        let targetRow = -1;
        for (let r = 0; r < 7; r++) {
            if (board[colIndex][r] === null) {
                targetRow = r;
                break;
            }
        }

        // Column is full
        if (targetRow === -1) {
            socket.emit("errorMessage", "Column is full.");
            return;
        }

        clearTurnTimer(room);

        // Place token
        board[colIndex][targetRow] = slot;

        // Ensure scored lists exist
        if (!room.connect5.scored[slot]) {
            room.connect5.scored[slot] = [];
        }

        // Check for new combos
        const newCombos = checkNewCombos(board, slot, colIndex, targetRow, room.connect5.scored[slot]);
        
        // Award score
        const pointsEarned = newCombos.length;
        room.connect5.scores[slot] += pointsEarned;

        // Track last move details for frontend drop animation
        room.connect5.lastMove = {
            player: slot,
            col: colIndex,
            row: targetRow,
            pointsEarned,
            newCombos
        };

        // Check win condition (First to 5 points)
        if (room.connect5.scores[slot] >= 5) {
            room.status = "finished";
            room.winner = slot;
        } else {
            // Check if board is full (49 slots total)
            let totalTokens = 0;
            for (let c = 0; c < 7; c++) {
                for (let r = 0; r < 7; r++) {
                    if (board[c][r] !== null) totalTokens++;
                }
            }

            if (totalTokens >= 49) {
                room.status = "finished";
                const scoreA = room.connect5.scores.A;
                const scoreB = room.connect5.scores.B;
                if (scoreA > scoreB) room.winner = "A";
                else if (scoreB > scoreA) room.winner = "B";
                else room.winner = "TIE";
            } else {
                // Toggle turn
                room.turn = slot === "A" ? "B" : "A";
                startTurnTimer(roomId);
            }
        }

        broadcastState(roomId);
    });
}

module.exports = {
    registerConnect5Events,
    initConnect5Board
};
