function startRpsRound(roomId, rooms, io, broadcastState) {
    const room = rooms.get(roomId);
    if (!room) return;

    room.rps.moves = { A: null, B: null };
    room.rps.roundStartTime = Date.now();
    room.rps.roundDeadline = Date.now() + 3000;
    room.rps.revealing = false;
    room.status = "playing";

    if (room.rpsTimer) {
        clearTimeout(room.rpsTimer);
        room.rpsTimer = null;
    }

    room.rpsTimer = setTimeout(() => {
        const r = rooms.get(roomId);
        if (!r || r.status !== "playing" || r.gameType !== "rps") return;

        const choices = ["rock", "paper", "scissors"];
        if (!r.rps.moves.A) r.rps.moves.A = choices[Math.floor(Math.random() * 3)];
        if (!r.rps.moves.B) r.rps.moves.B = choices[Math.floor(Math.random() * 3)];

        resolveRpsRound(roomId, rooms, io, broadcastState);
    }, 3500); // 3s countdown + 500ms grace period

    broadcastState(roomId);
}

function resolveRpsRound(roomId, rooms, io, broadcastState) {
    const room = rooms.get(roomId);
    if (!room) return;

    const moveA = room.rps.moves.A;
    const moveB = room.rps.moves.B;

    let winner = null; // "A", "B", or "TIE"
    if (moveA === moveB) {
        winner = "TIE";
    } else if (
        (moveA === "rock" && moveB === "scissors") ||
        (moveA === "scissors" && moveB === "paper") ||
        (moveA === "paper" && moveB === "rock")
    ) {
        winner = "A";
        room.rps.scores.A++;
    } else {
        winner = "B";
        room.rps.scores.B++;
    }

    // Save to history
    room.rps.history.push({
        round: room.rps.round,
        moves: { A: moveA, B: moveB },
        winner
    });

    const target = room.rps.targetWins || 3;
    if (room.rps.scores.A >= target) {
        room.status = "finished";
        room.winner = "A";
    } else if (room.rps.scores.B >= target) {
        room.status = "finished";
        room.winner = "B";
    }

    room.rps.revealing = true;
    broadcastState(roomId);

    if (room.rpsTimer) {
        clearTimeout(room.rpsTimer);
    }

    room.rpsTimer = setTimeout(() => {
        const r = rooms.get(roomId);
        if (!r || r.gameType !== "rps") return;

        r.rps.revealing = false;

        if (r.status === "finished") {
            broadcastState(roomId);
        } else {
            r.rps.round++;
            startRpsRound(roomId, rooms, io, broadcastState);
        }
    }, 3500); // Allow flip and outcome animation time
}

function registerRPSEvents(io, socket, rooms, broadcastState) {
    socket.on("setRpsFormat", ({ format }) => {
        const roomId = socket.data.roomId;
        const room = rooms.get(roomId);
        if (!room) return;
        if (room.status !== "setup") return;

        let target = 3; // best of 5 (first to 3)
        if (format === "3") target = 2; // best of 3 (first to 2)
        if (format === "11") target = 6; // best of 11 (first to 6)

        room.rpsTargetWins = target;
        
        // Broadcast setup updates
        broadcastState(roomId);
    });

    socket.on("makeRpsMove", ({ move }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.gameType !== "rps") return;
        if (room.status !== "playing") return;
        if (room.rps.revealing) return; // cannot move during reveal

        if (move !== "rock" && move !== "paper" && move !== "scissors") return;

        room.rps.moves[slot] = move;

        if (room.rps.moves.A && room.rps.moves.B) {
            resolveRpsRound(roomId, rooms, io, broadcastState);
        } else {
            broadcastState(roomId);
        }
    });
}

module.exports = {
    registerRPSEvents,
    startRpsRound
};
