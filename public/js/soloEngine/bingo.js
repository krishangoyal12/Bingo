// soloEngine/bingo.js
window.soloBots = window.soloBots || {};

window.soloBots.bingo = {
    countLines: function(board, calledSet) {
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
    },

    getBestMove: function(board, calledNumbers) {
        const calledSet = new Set(calledNumbers);
        const uncalled = board.filter(n => !calledSet.has(n));
        if (uncalled.length === 0) return null;

        const scoreCell = (num) => {
            const index = board.indexOf(num);
            const r = Math.floor(index / 5);
            const c = index % 5;

            let score = 0;

            let rowCalls = 0;
            for (let i = 0; i < 5; i++) {
                if (calledSet.has(board[r * 5 + i])) rowCalls++;
            }
            score += Math.pow(rowCalls, 2);

            let colCalls = 0;
            for (let i = 0; i < 5; i++) {
                if (calledSet.has(board[i * 5 + c])) colCalls++;
            }
            score += Math.pow(colCalls, 2);

            if (r === c) {
                let diag1Calls = 0;
                for (let i = 0; i < 5; i++) {
                    if (calledSet.has(board[i * 5 + i])) diag1Calls++;
                }
                score += Math.pow(diag1Calls, 2);
            }

            if (r + c === 4) {
                let diag2Calls = 0;
                for (let i = 0; i < 5; i++) {
                    if (calledSet.has(board[i * 5 + (4 - i)])) diag2Calls++;
                }
                score += Math.pow(diag2Calls, 2);
            }

            return score;
        };

        const candidates = uncalled.map(n => ({ num: n, score: scoreCell(n) }));
        candidates.sort((a, b) => b.score - a.score);

        if (Math.random() < 0.15 && candidates.length > 0) {
            return candidates[Math.floor(Math.random() * candidates.length)].num;
        } else {
            return candidates[0].num;
        }
    }
};
