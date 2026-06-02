// soloEngine/connect5.js
window.soloBots = window.soloBots || {};

window.soloBots.connect5 = {
    // Check if player has scored/formed new lines
    checkNewCombos: function(board, player, col, row, scoredCombos) {
        const newCombos = [];
        const directions = [
            { dc: 1, dr: 0, name: "horizontal" },
            { dc: 0, dr: 1, name: "vertical" },
            { dc: 1, dr: 1, name: "diagonal_up" },
            { dc: 1, dr: -1, name: "diagonal_down" }
        ];

        for (const dir of directions) {
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
                    const sortedCells = [...cells].sort((a, b) => {
                        if (a.col !== b.col) return a.col - b.col;
                        return a.row - b.row;
                    });
                    const comboId = sortedCells.map(cell => `${cell.col},${cell.row}`).join(":");

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
                        const newComboObj = { id: comboId, dir: dir.name, cells: sortedCells };
                        scoredCombos.push(newComboObj);
                        newCombos.push(newComboObj);
                    }
                }
            }
        }
        return newCombos;
    },

    // Choose move
    getBestMove: function(board, scoredB, scoredA) {
        let bestCol = -1;

        // 1. Bot can score combo?
        for (let c = 0; c < 7; c++) {
            if (board[c][6] !== null) continue;
            let targetRow = board[c].indexOf(null);
            board[c][targetRow] = "B";
            const tempScored = JSON.parse(JSON.stringify(scoredB));
            const combos = this.checkNewCombos(board, "B", c, targetRow, tempScored);
            board[c][targetRow] = null;
            if (combos.length > 0) {
                bestCol = c;
                break;
            }
        }

        // 2. Block player combo?
        if (bestCol === -1) {
            for (let c = 0; c < 7; c++) {
                if (board[c][6] !== null) continue;
                let targetRow = board[c].indexOf(null);
                board[c][targetRow] = "A";
                const tempScored = JSON.parse(JSON.stringify(scoredA));
                const combos = this.checkNewCombos(board, "A", c, targetRow, tempScored);
                board[c][targetRow] = null;
                if (combos.length > 0) {
                    bestCol = c;
                    break;
                }
            }
        }

        const openCols = [];
        for (let c = 0; c < 7; c++) {
            if (board[c][6] === null) openCols.push(c);
        }

        // 3. Fallback/Noise
        if (bestCol === -1 || (Math.random() < 0.15 && openCols.length > 0)) {
            const colPreferences = [3, 2, 4, 1, 5, 0, 6];
            for (const c of colPreferences) {
                if (openCols.includes(c)) {
                    bestCol = c;
                    break;
                }
            }
            if (bestCol === -1 && openCols.length > 0) {
                bestCol = openCols[Math.floor(Math.random() * openCols.length)];
            }
        }

        return bestCol;
    }
};
