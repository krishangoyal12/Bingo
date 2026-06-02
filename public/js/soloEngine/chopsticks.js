// soloEngine/chopsticks.js
window.soloBots = window.soloBots || {};

window.soloBots.chopsticks = {
    checkWin: function(cState) {
        if (cState.A.left === 0 && cState.A.right === 0) return "B";
        if (cState.B.left === 0 && cState.B.right === 0) return "A";
        return null;
    },

    getBestMove: function(cState) {
        const myHands = ["left", "right"].filter(h => cState.B[h] > 0);
        const oppHands = ["left", "right"].filter(h => cState.A[h] > 0);
        const moves = [];

        // attacks
        for (const mine of myHands) {
            for (const opp of oppHands) {
                const myVal = cState.B[mine];
                const oppVal = cState.A[opp];
                const newVal = (myVal + oppVal) % 5;
                
                let score = 0;
                if (newVal === 0) score = 100; // prioritize knockout
                else if ((newVal + myVal) % 5 === 0) score = -10; // avoid self-hazard
                else score = 10 + Math.random() * 5;

                moves.push({
                    type: "attack",
                    fromHand: mine,
                    toHand: opp,
                    score
                });
            }
        }

        // splits (redistribution)
        const sum = cState.B.left + cState.B.right;
        if (sum > 1 && !(cState.B.left === 0 && cState.B.right === 0)) {
            for (let l = 1; l < sum; l++) {
                const r = sum - l;
                if (l < 5 && r < 5) {
                    const oldMin = Math.min(cState.B.left, cState.B.right);
                    const oldMax = Math.max(cState.B.left, cState.B.right);
                    const newMin = Math.min(l, r);
                    const newMax = Math.max(l, r);

                    if (newMin !== oldMin || newMax !== oldMax) {
                        let score = 5;
                        const isRecovery = (cState.B.left === 0 || cState.B.right === 0);
                        if (isRecovery) {
                            score = 85; // High priority for recovering a dead hand
                        }
                        
                        // Safety check: Can the opponent immediately eliminate one of our hands?
                        let isUnsafe = false;
                        for (const opp of oppHands) {
                            const oppVal = cState.A[opp];
                            if ((l + oppVal) % 5 === 0 || (r + oppVal) % 5 === 0) {
                                isUnsafe = true;
                                break;
                            }
                        }
                        
                        if (isUnsafe) {
                            score = -50; // unsafe layout
                        }
                        moves.push({ type: "redistribute", left: l, right: r, score });
                    }
                }
            }
        }

        moves.sort((a, b) => b.score - a.score);
        const bestScore = moves[0]?.score || 0;
        const candidates = moves.filter(m => m.score >= bestScore - 5);
        return candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : moves[0];
    }
};
