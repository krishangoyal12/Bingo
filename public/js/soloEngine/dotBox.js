// soloEngine/dotBox.js
window.soloBots = window.soloBots || {};

window.soloBots.dotBox = {
    getBestMove: function(state) {
        const hMoves = [];
        const vMoves = [];

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 8; c++) {
                if (!state.hLines[r][c]) hMoves.push({ type: "h", r, c });
            }
        }
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 9; c++) {
                if (!state.vLines[r][c]) vMoves.push({ type: "v", r, c });
            }
        }

        const allMoves = [...hMoves, ...vMoves];
        if (allMoves.length === 0) return null;

        const getBoxLineCounts = (br, bc) => {
            if (br < 0 || br >= 8 || bc < 0 || bc >= 8) return 0;
            let count = 0;
            if (state.hLines[br][bc]) count++;
            if (state.hLines[br+1][bc]) count++;
            if (state.vLines[br][bc]) count++;
            if (state.vLines[br][bc+1]) count++;
            return count;
        };

        const scoreMove = (mv) => {
            let score = 0;
            let adjacentBoxes = [];

            if (mv.type === "h") {
                adjacentBoxes.push({ r: mv.r - 1, c: mv.c });
                adjacentBoxes.push({ r: mv.r, c: mv.c });
            } else {
                adjacentBoxes.push({ r: mv.r, c: mv.c - 1 });
                adjacentBoxes.push({ r: mv.r, c: mv.c });
            }

            let willCompleteBox = false;
            let willSetPlayerUp = false;

            for (const box of adjacentBoxes) {
                if (box.r < 0 || box.r >= 8 || box.c < 0 || box.c >= 8) continue;
                if (state.boxes[box.r][box.c] !== null) continue;

                const lines = getBoxLineCounts(box.r, box.c);
                if (lines === 3) {
                    willCompleteBox = true;
                } else if (lines === 2) {
                    willSetPlayerUp = true;
                }
            }

            if (willCompleteBox) {
                score = 100;
            } else if (!willSetPlayerUp) {
                score = 10;
            } else {
                score = 1;
            }

            return score + Math.random() * 2;
        };

        allMoves.sort((a, b) => scoreMove(b) - scoreMove(a));
        return allMoves[0];
    }
};
