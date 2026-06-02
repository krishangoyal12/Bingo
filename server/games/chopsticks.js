function checkChopsticksWin(chopsticks) {
    if (chopsticks.A.left === 0 && chopsticks.A.right === 0) return "B"; // B wins
    if (chopsticks.B.left === 0 && chopsticks.B.right === 0) return "A"; // A wins
    return null;
}

module.exports = function registerChopsticksEvents(io, socket, rooms, broadcastState, startTurnTimer, clearTurnTimer) {
    socket.on("makeChopsticksAttack", ({ fromHand, toHand }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.gameType !== "chopsticks") return;
        if (room.status !== "playing") {
            socket.emit("errorMessage", "Game not active.");
            return;
        }
        if (room.turn !== slot) {
            socket.emit("errorMessage", "Not your turn.");
            return;
        }
        if (fromHand !== "left" && fromHand !== "right") return;
        if (toHand !== "left" && toHand !== "right") return;
        
        const otherSlot = slot === "A" ? "B" : "A";
        const attackerVal = room.chopsticks[slot][fromHand];
        const defenderVal = room.chopsticks[otherSlot][toHand];
        
        if (attackerVal <= 0) {
            socket.emit("errorMessage", "Attacking hand is dead.");
            return;
        }
        if (defenderVal <= 0) {
            socket.emit("errorMessage", "Defender hand is already dead.");
            return;
        }
        
        // Execute attack
        const newVal = (attackerVal + defenderVal) % 5;
        room.chopsticks[otherSlot][toHand] = newVal;
        
        // Check win
        const winnerSlot = checkChopsticksWin(room.chopsticks);
        if (winnerSlot) {
            room.status = "finished";
            room.winner = winnerSlot;
            room.score[winnerSlot] += 1;
            clearTurnTimer(room);
        } else {
            // Alternate turn
            room.turn = otherSlot;
            startTurnTimer(roomId);
        }
        
        broadcastState(roomId);
    });

    socket.on("makeChopsticksRedistribute", ({ left, right }) => {
        const roomId = socket.data.roomId;
        const slot = socket.data.playerSlot;
        const room = rooms.get(roomId);
        if (!room || !slot) return;
        if (room.gameType !== "chopsticks") return;
        if (room.status !== "playing") {
            socket.emit("errorMessage", "Game not active.");
            return;
        }
        if (room.turn !== slot) {
            socket.emit("errorMessage", "Not your turn.");
            return;
        }
        
        const l = Number(left);
        const r = Number(right);
        if (!Number.isInteger(l) || l < 0 || l > 4) return;
        if (!Number.isInteger(r) || r < 0 || r > 4) return;
        
        const oldLeft = room.chopsticks[slot].left;
        const oldRight = room.chopsticks[slot].right;
        
        const sumFingers = oldLeft + oldRight;
        
        // Cannot distribute if both hands are dead or sum is 1
        if (oldLeft === 0 && oldRight === 0) {
            socket.emit("errorMessage", "Both hands are dead.");
            return;
        }
        if (sumFingers <= 1) {
            socket.emit("errorMessage", "Need more than 1 finger total to redistribute.");
            return;
        }
        
        // Sum conservation
        if (l + r !== oldLeft + oldRight) {
            socket.emit("errorMessage", "Total fingers must remain unchanged.");
            return;
        }
        // State difference (unordered comparison)
        const oldMin = Math.min(oldLeft, oldRight);
        const oldMax = Math.max(oldLeft, oldRight);
        const newMin = Math.min(l, r);
        const newMax = Math.max(l, r);
        
        if (newMin === oldMin && newMax === oldMax) {
            socket.emit("errorMessage", "Must produce a different state.");
            return;
        }
        
        // Cannot suicide a hand (cannot distribute to create a 0)
        if (l === 0 || r === 0) {
            socket.emit("errorMessage", "Cannot redistribute to create a dead hand.");
            return;
        }

        // Update hands
        room.chopsticks[slot].left = l;
        room.chopsticks[slot].right = r;
        
        // Alternate turn
        room.turn = slot === "A" ? "B" : "A";
        startTurnTimer(roomId);
        
        broadcastState(roomId);
    });
};

module.exports.checkChopsticksWin = checkChopsticksWin;
