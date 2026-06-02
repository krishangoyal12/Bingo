// soloEngine/tictactoe.js
window.soloBots = window.soloBots || {};

window.soloBots.tictactoe = {
    checkWin: function(board) {
        const wins = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        for (const [a, b, c] of wins) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    },

    getBestMove: function(board) {
        let index = -1;

        // 1. Bot can win immediately?
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = "B";
                if (this.checkWin(board) === "B") {
                    index = i;
                }
                board[i] = null;
                if (index !== -1) break;
            }
        }

        // 2. Block player immediate win?
        if (index === -1) {
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = "A";
                    if (this.checkWin(board) === "A") {
                        index = i;
                    }
                    board[i] = null;
                    if (index !== -1) break;
                }
            }
        }

        // 3. Play Center
        if (index === -1 && board[4] === null) {
            index = 4;
        }

        // 4. Play Corners
        if (index === -1) {
            const corners = [0, 2, 6, 8].filter(c => board[c] === null);
            if (corners.length > 0) {
                index = corners[Math.floor(Math.random() * corners.length)];
            }
        }

        // 5. Fallback random
        const open = board.map((c, idx) => c === null ? idx : null).filter(c => c !== null);
        if (index === -1 || (Math.random() < 0.15 && open.length > 0)) {
            index = open[Math.floor(Math.random() * open.length)];
        }

        return index;
    }
};
