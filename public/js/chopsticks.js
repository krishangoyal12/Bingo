function getHandDisplay(value) {
    if (value === 0) return "☠";
    return Array(value).fill("●").join(" ");
}

function getHandElement(slot, hand) {
    if (slot === playerSlot) {
        return hand === "left" ? ui.chopPlayLeftHand : ui.chopPlayRightHand;
    } else {
        return hand === "left" ? ui.chopOppLeftHand : ui.chopOppRightHand;
    }
}

function updateHandCard(el, value, isLocked) {
    const displayEl = el.querySelector(".hand-display");
    if (displayEl) {
        displayEl.textContent = getHandDisplay(value);
    }
    el.classList.toggle("dead", value === 0);
    el.classList.toggle("locked", isLocked);
}

function launchAttackAnimation(fromEl, toEl, newVal, callback) {
    const token = document.createElement("div");
    token.className = "flying-token";
    
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    
    const startX = fromRect.left + fromRect.width / 2 - 7;
    const startY = fromRect.top + fromRect.height / 2 - 7;
    
    const endX = toRect.left + toRect.width / 2 - 7;
    const endY = toRect.top + toRect.height / 2 - 7;
    
    token.style.left = `${startX}px`;
    token.style.top = `${startY}px`;
    
    document.body.appendChild(token);
    
    // Force reflow
    token.getBoundingClientRect();
    token.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
    
    sfxChopAttack();
    
    setTimeout(() => {
        token.remove();
        toEl.classList.add("bump-card");
        
        const displayEl = toEl.querySelector(".hand-display");
        if (displayEl) {
            displayEl.textContent = getHandDisplay(newVal);
        }
        toEl.classList.toggle("dead", newVal === 0);
        
        sfxNumberMarked();
        
        setTimeout(() => {
            toEl.classList.remove("bump-card");
            if (callback) callback();
        }, 400);
    }, 400);
}

function getRedistributeOptions(left, right) {
    const sum = left + right;
    const options = [];
    
    // Generate unique unordered combinations (e.g. 1+3 but not 3+1)
    const minCurrent = Math.min(left, right);
    const maxCurrent = Math.max(left, right);
    
    for (let l = 1; l <= Math.floor(sum / 2); l++) {
        const r = sum - l;
        if (l <= 4 && r <= 4) {
            // Avoid generating the same state (unordered)
            if (l !== minCurrent || r !== maxCurrent) {
                options.push({ left: Math.max(l, r), right: Math.min(l, r) });
            }
        }
    }
    return options;
}

function renderChopsticks() {
    if (!serverState || serverState.gameType !== "chopsticks") return;
    
    const you = playerSlot;
    const opp = you === "A" ? "B" : "A";
    const youHands = serverState.chopsticks[you] || { left: 1, right: 1 };
    const oppHands = serverState.chopsticks[opp] || { left: 1, right: 1 };
    const isYourTurn = serverState.status === "playing" && serverState.turn === you;
    
    // Calculate redistribution options
    const sumFingers = youHands.left + youHands.right;
    const bothDead = youHands.left === 0 && youHands.right === 0;
    const singleHandOne = sumFingers === 1;
    const canRedistribute = !bothDead && !singleHandOne;
    const options = canRedistribute ? getRedistributeOptions(youHands.left, youHands.right) : [];
    const onlyOneHandLeft = (youHands.left > 0 && youHands.right === 0) || (youHands.right > 0 && youHands.left === 0);
    
    // Auto-select player's hand if only one hand is left
    if (isYourTurn && localState.selectedChopHand === null) {
        const leftAlive = youHands.left > 0;
        const rightAlive = youHands.right > 0;
        if (leftAlive && !rightAlive) {
            localState.selectedChopHand = "left";
        } else if (rightAlive && !leftAlive) {
            localState.selectedChopHand = "right";
        }
        
        // Auto-attack at start of turn ONLY if opponent has only one hand left AND player has no redistribution options
        if (localState.selectedChopHand !== null && options.length === 0) {
            const oppLeftAlive = oppHands.left > 0;
            const oppRightAlive = oppHands.right > 0;
            let targetHand = null;
            if (oppLeftAlive && !oppRightAlive) targetHand = "left";
            else if (oppRightAlive && !oppLeftAlive) targetHand = "right";
            
            if (targetHand) {
                const stateKey = `chop-auto-${youHands.left}-${youHands.right}-${oppHands.left}-${oppHands.right}-${serverState.turn}`;
                if (localState.lastChopStateKey !== stateKey) {
                    localState.lastChopStateKey = stateKey;
                    socket.emit("makeChopsticksAttack", { fromHand: localState.selectedChopHand, toHand: targetHand });
                    localState.selectedChopHand = null;
                }
            }
        }
    }
    
    ui.chopScoreA.textContent = serverState.score?.A || 0;
    ui.chopScoreB.textContent = serverState.score?.B || 0;
    
    const youInfo = serverState.players?.[you] || {};
    const oppInfo = serverState.players?.[opp] || {};
    ui.chopPlayLabel.textContent = `${youInfo.name || "You"} (You)`;
    ui.chopOppLabel.textContent = `${oppInfo.name || "Opponent"} (Opponent)`;
    
    if (serverState.status === "setup") {
        ui.chopsticksTurnIndicator.textContent = "Tap Ready to start duel";
        ui.timerBar.classList.add("is-hidden");
        stopTimerAnimation();
    } else if (serverState.status === "playing") {
        ui.chopsticksTurnIndicator.textContent = isYourTurn ? "⚡ Your turn to move!" : "⏳ Opponent is deciding...";
        startTimerAnimation();
    } else if (serverState.status === "finished") {
        ui.chopsticksTurnIndicator.textContent = "Game finished";
        ui.timerBar.classList.add("is-hidden");
        stopTimerAnimation();
    }
    
    let animatedHand = null;
    if (lastChopsticksState && serverState.status === "playing") {
        let changedHands = [];
        const players = ["A", "B"];
        const hands = ["left", "right"];
        for (const p of players) {
            for (const h of hands) {
                const oldVal = lastChopsticksState[p]?.[h];
                const newVal = serverState.chopsticks[p]?.[h];
                if (oldVal !== undefined && oldVal !== newVal) {
                    changedHands.push({ player: p, hand: h, oldVal, newVal });
                }
            }
        }
        
        if (changedHands.length === 1) {
            const ch = changedHands[0];
            const defenderPlayer = ch.player;
            const defenderHand = ch.hand;
            const attackerPlayer = defenderPlayer === "A" ? "B" : "A";
            
            let attackerHand = "left";
            const oldDefenderVal = ch.oldVal;
            const newDefenderVal = ch.newVal;
            const attackerState = lastChopsticksState[attackerPlayer];
            
            if (attackerState) {
                if (attackerState.left > 0 && (attackerState.left + oldDefenderVal) % 5 === newDefenderVal) {
                    attackerHand = "left";
                } else if (attackerState.right > 0 && (attackerState.right + oldDefenderVal) % 5 === newDefenderVal) {
                    attackerHand = "right";
                }
            }
            
            const attackerEl = getHandElement(attackerPlayer, attackerHand);
            const defenderEl = getHandElement(defenderPlayer, defenderHand);
            
            animatedHand = defenderEl;
            
            const displayEl = defenderEl.querySelector(".hand-display");
            if (displayEl) {
                displayEl.textContent = getHandDisplay(ch.oldVal);
            }
            defenderEl.classList.toggle("dead", ch.oldVal === 0);
            
            launchAttackAnimation(attackerEl, defenderEl, ch.newVal);
        } else if (changedHands.length === 2) {
            sfxChopRedistribute();
        }
    }
    
    const hasSelection = localState.selectedChopHand !== null;
    
    const oppLeftLocked = !isYourTurn || !hasSelection || oppHands.left === 0;
    ui.chopOppLeftHand.classList.toggle("targetable", !oppLeftLocked);
    if (animatedHand !== ui.chopOppLeftHand) {
        updateHandCard(ui.chopOppLeftHand, oppHands.left, oppLeftLocked);
    } else {
        ui.chopOppLeftHand.classList.toggle("dead", lastChopsticksState[opp].left === 0);
        ui.chopOppLeftHand.classList.toggle("locked", oppLeftLocked);
    }
    
    const oppRightLocked = !isYourTurn || !hasSelection || oppHands.right === 0;
    ui.chopOppRightHand.classList.toggle("targetable", !oppRightLocked);
    if (animatedHand !== ui.chopOppRightHand) {
        updateHandCard(ui.chopOppRightHand, oppHands.right, oppRightLocked);
    } else {
        ui.chopOppRightHand.classList.toggle("dead", lastChopsticksState[opp].right === 0);
        ui.chopOppRightHand.classList.toggle("locked", oppRightLocked);
    }
    
    const playLeftLocked = !isYourTurn || youHands.left === 0;
    const playRightLocked = !isYourTurn || youHands.right === 0;
    
    if (animatedHand !== ui.chopPlayLeftHand) {
        updateHandCard(ui.chopPlayLeftHand, youHands.left, playLeftLocked);
    } else {
        ui.chopPlayLeftHand.classList.toggle("dead", lastChopsticksState[you].left === 0);
        ui.chopPlayLeftHand.classList.toggle("locked", playLeftLocked);
    }
    
    if (animatedHand !== ui.chopPlayRightHand) {
        updateHandCard(ui.chopPlayRightHand, youHands.right, playRightLocked);
    } else {
        ui.chopPlayRightHand.classList.toggle("dead", lastChopsticksState[you].right === 0);
        ui.chopPlayRightHand.classList.toggle("locked", playRightLocked);
    }
    
    ui.chopPlayLeftHand.classList.toggle("selected", localState.selectedChopHand === "left");
    ui.chopPlayRightHand.classList.toggle("selected", localState.selectedChopHand === "right");
    
    if (serverState.status === "setup") {
        ui.chopActionStatus.textContent = "Waiting for setup...";
        ui.btnChopRedistribute.classList.add("is-hidden");
        ui.btnChopCancelAction.classList.add("is-hidden");
    } else if (serverState.status === "playing") {
        if (isYourTurn) {
            if (localState.selectedChopHand === null) {
                ui.chopActionStatus.textContent = "YOUR TURN: Select a hand to attack or redistribute";
                ui.btnChopCancelAction.classList.add("is-hidden");
            } else {
                ui.chopActionStatus.textContent = "YOUR TURN: Select an opponent's hand to attack";
                ui.btnChopCancelAction.classList.toggle("is-hidden", onlyOneHandLeft);
            }
            ui.btnChopRedistribute.classList.toggle("is-hidden", options.length === 0 || (localState.selectedChopHand !== null && !onlyOneHandLeft));
        } else {
            ui.chopActionStatus.textContent = "OPPONENT'S TURN";
            ui.btnChopRedistribute.classList.add("is-hidden");
            ui.btnChopCancelAction.classList.add("is-hidden");
            ui.chopRedistributeOverlay.classList.add("is-hidden");
        }
    } else {
        ui.chopActionStatus.textContent = "GAME OVER";
        ui.btnChopRedistribute.classList.add("is-hidden");
        ui.btnChopCancelAction.classList.add("is-hidden");
    }
    
    ui.readyBtn.disabled = !!youInfo.ready;
    ui.readyBtn.classList.toggle("is-hidden", serverState.status !== "setup");
    localState.ready = !!youInfo.ready;
    ui.nextNumber.textContent = youInfo.ready ? "done" : "play";
    
    lastChopsticksState = JSON.parse(JSON.stringify(serverState.chopsticks));
}

function handlePlayerHandClick(hand) {
    if (!serverState || serverState.gameType !== "chopsticks" || serverState.status !== "playing") return;
    const you = playerSlot;
    const isYourTurn = serverState.turn === you;
    if (!isYourTurn) {
        sfxInvalidAction();
        return;
    }
    const handVal = serverState.chopsticks[you][hand];
    if (handVal === 0) {
        sfxInvalidAction();
        return;
    }
    sfxButtonClick();
    if (localState.selectedChopHand === hand) {
        localState.selectedChopHand = null;
    } else {
        localState.selectedChopHand = hand;
        
        // Auto-attack if opponent has only one hand left
        const opp = you === "A" ? "B" : "A";
        const oppHands = serverState.chopsticks[opp];
        const oppLeftAlive = oppHands.left > 0;
        const oppRightAlive = oppHands.right > 0;
        let targetHand = null;
        if (oppLeftAlive && !oppRightAlive) targetHand = "left";
        else if (oppRightAlive && !oppLeftAlive) targetHand = "right";
        
        if (targetHand) {
            socket.emit("makeChopsticksAttack", { fromHand: hand, toHand: targetHand });
            localState.selectedChopHand = null;
        }
    }
    renderChopsticks();
}

function handleOpponentHandClick(hand) {
    if (!serverState || serverState.gameType !== "chopsticks" || serverState.status !== "playing") return;
    const you = playerSlot;
    const isYourTurn = serverState.turn === you;
    if (!isYourTurn) {
        sfxInvalidAction();
        return;
    }
    if (localState.selectedChopHand === null) {
        sfxInvalidAction();
        return;
    }
    const opp = you === "A" ? "B" : "A";
    const targetVal = serverState.chopsticks[opp][hand];
    if (targetVal === 0) {
        sfxInvalidAction();
        return;
    }
    socket.emit("makeChopsticksAttack", { fromHand: localState.selectedChopHand, toHand: hand });
    localState.selectedChopHand = null;
}

function handleOpponentHandHover(hand, isEnter) {
    if (!serverState || serverState.gameType !== "chopsticks" || serverState.status !== "playing") return;
    const you = playerSlot;
    const isYourTurn = serverState.turn === you;
    if (!isYourTurn || localState.selectedChopHand === null) return;
    const opp = you === "A" ? "B" : "A";
    const targetVal = serverState.chopsticks[opp][hand];
    if (targetVal === 0) return;
    
    if (isEnter) {
        const attackerVal = serverState.chopsticks[you][localState.selectedChopHand];
        const newVal = (attackerVal + targetVal) % 5;
        ui.chopActionStatus.innerHTML = `ATTACK: ${attackerVal} + ${targetVal} &rarr; ${newVal}`;
    } else {
        ui.chopActionStatus.textContent = "YOUR TURN: Select an opponent's hand to attack";
    }
}