// soloEngine/rps.js
window.soloBots = window.soloBots || {};

window.soloBots.rps = {
    getBestMove: function(history) {
        const counts = { rock: 0, paper: 0, scissors: 0 };
        for (const item of history) {
            counts[item.moves.A]++;
        }

        let botChoice = "rock";
        const total = counts.rock + counts.paper + counts.scissors;

        if (total === 0 || Math.random() < 0.25) {
            const choices = ["rock", "paper", "scissors"];
            botChoice = choices[Math.floor(Math.random() * choices.length)];
        } else {
            const r = counts.rock / total;
            const p = counts.paper / total;
            const s = counts.scissors / total;

            const rand = Math.random();
            if (rand < r) {
                botChoice = "paper";
            } else if (rand < r + p) {
                botChoice = "scissors";
            } else {
                botChoice = "rock";
            }
        }

        return botChoice;
    }
};
