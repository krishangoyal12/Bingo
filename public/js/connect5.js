let lastConnect5State = null;
let lastAnimatedMoveKey = null;

function renderConnect5() {
    if (!serverState || serverState.gameType !== "connect5") return;
    const state = serverState.connect5 || {
        board: Array(7).fill(null).map(() => Array(7).fill(null)),
        scores: { A: 0, B: 0 },
        lastMove: null
    };

    const you = playerSlot;
    const opp = you === "A" ? "B" : "A";
    const youInfo = serverState.players?.[you] || {};
    const oppInfo = serverState.players?.[opp] || {};

    const isYourTurn = serverState.status === "playing" && serverState.turn === you;

    // 1. Update Player Labels
    ui.c5PlayerAName.textContent = serverState.players?.A?.name || "Player A";
    ui.c5PlayerBName.textContent = serverState.players?.B?.name || "Player B";

    // 2. Render Score Stars (First to 5 stars wins)
    const scoreA = state.scores.A || 0;
    const scoreB = state.scores.B || 0;
    
    const renderSvgStars = (score, isPlayerA) => {
        let html = "";
        const color = isPlayerA ? "#FFB300" : "var(--blue)"; // Rich gold and blue fills
        const stroke = "var(--dark)";
        for (let i = 0; i < 5; i++) {
            const filled = i < score;
            const fillColor = filled ? color : "#FFFFFF";
            html += `<svg class="c5-star-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style="margin: 0 2px; filter: drop-shadow(1.5px 1.5px 0 var(--dark)); display: inline-block; vertical-align: middle;">
                       <path d="M12 17.27 L18.18 21 L16.54 13.97 L22 9.24 L14.81 8.63 L12 2 L9.19 8.63 L2 9.24 L7.46 13.97 L5.82 21 Z" fill="${fillColor}" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round" />
                     </svg>`;
        }
        return html;
    };

    ui.c5PlayerAStars.innerHTML = renderSvgStars(scoreA, true);
    ui.c5PlayerBStars.innerHTML = renderSvgStars(scoreB, false);

    // 3. Build Board Slots if not already done
    const boardFrame = ui.c5Board;
    if (boardFrame.children.length === 0) {
        boardFrame.innerHTML = "";
        // Grid is 7 columns by 7 rows. Render from row 6 (top) down to row 0 (bottom)
        for (let r = 6; r >= 0; r--) {
            for (let c = 0; c < 7; c++) {
                const slot = document.createElement("div");
                slot.className = "c5-slot";
                slot.dataset.col = c;
                slot.dataset.row = r;

                // Mouse hover/leave to highlight the entire column
                slot.addEventListener("mouseenter", () => handleC5ColumnHover(c, true));
                slot.addEventListener("mouseleave", () => handleC5ColumnHover(c, false));
                slot.addEventListener("click", () => handleC5Click(c));

                boardFrame.appendChild(slot);
            }
        }

        // Add hover/click events to ghost row slots
        const ghostSlots = ui.c5GhostRow.querySelectorAll(".c5-ghost-slot");
        ghostSlots.forEach(slot => {
            const c = parseInt(slot.dataset.col);
            slot.addEventListener("mouseenter", () => handleC5ColumnHover(c, true));
            slot.addEventListener("mouseleave", () => handleC5ColumnHover(c, false));
            slot.addEventListener("click", () => handleC5Click(c));
        });
    }

    // 4. Update Board State Grid
    const slots = boardFrame.querySelectorAll(".c5-slot");
    const board = state.board;

    slots.forEach(slot => {
        const c = parseInt(slot.dataset.col);
        const r = parseInt(slot.dataset.row);
        const val = board[c][r];

        // Clear existing tokens unless they are actively animating
        const token = slot.querySelector(".c5-token");
        if (val) {
            if (!token) {
                const tokenDiv = document.createElement("div");
                tokenDiv.className = `c5-token player-${val.toLowerCase()}`;
                slot.appendChild(tokenDiv);
            } else {
                // Ensure proper class in case of rematch resets
                token.className = `c5-token player-${val.toLowerCase()}`;
            }
        } else {
            if (token) token.remove();
            slot.classList.remove("combo-pulse");
        }
    });

    // 5. Trigger Turn/Action status messages
    if (serverState.status === "setup") {
        ui.c5StatusBar.textContent = "WAITING IN LOBBY - READY UP!";
    } else if (serverState.status === "playing") {
        ui.c5StatusBar.textContent = isYourTurn ? "YOUR TURN: Select a column to drop token" : "Waiting for opponent...";
    } else if (serverState.status === "finished") {
        ui.c5StatusBar.textContent = "GAME OVER";
    }

    // 6. Handle New Token Placement and Combo Animations
    const lastMove = state.lastMove;
    if (lastMove) {
        const moveKey = `${lastMove.player}-${lastMove.col}-${lastMove.row}`;
        if (lastAnimatedMoveKey !== moveKey) {
            lastAnimatedMoveKey = moveKey;
            triggerC5DropAnimation(lastMove);
        }
    } else {
        lastAnimatedMoveKey = null;
    }

    lastConnect5State = JSON.parse(JSON.stringify(state));
}

function handleC5ColumnHover(colIndex, isHover) {
    if (!serverState || serverState.gameType !== "connect5" || serverState.status !== "playing") return;
    const isYourTurn = serverState.turn === playerSlot;
    
    // Toggle highlight classes on column slots
    const slots = ui.c5Board.querySelectorAll(".c5-slot");
    slots.forEach(slot => {
        const c = parseInt(slot.dataset.col);
        slot.classList.toggle("column-highlight", isHover && c === colIndex);
    });

    // Toggle ghost token in ghost row
    const ghostSlots = ui.c5GhostRow.querySelectorAll(".c5-ghost-slot");
    ghostSlots.forEach(slot => {
        const c = parseInt(slot.dataset.col);
        slot.innerHTML = "";
        if (isHover && c === colIndex && isYourTurn) {
            const ghost = document.createElement("div");
            ghost.className = `c5-ghost-token player-${playerSlot.toLowerCase()}`;
            slot.appendChild(ghost);
        }
    });
}

function handleC5Click(colIndex) {
    if (!serverState || serverState.gameType !== "connect5" || serverState.status !== "playing") return;
    if (serverState.turn !== playerSlot) {
        sfxInvalidAction();
        return;
    }

    // Validate if column is full
    const board = serverState.connect5.board;
    if (board[colIndex][6] !== null) {
        sfxInvalidAction();
        return;
    }

    // Emit move
    socket.emit("makeConnect5Move", { col: colIndex });
    
    // Clear hover previews immediately
    handleC5ColumnHover(colIndex, false);
}

function triggerC5DropAnimation(lastMove) {
    const { player, col, row, pointsEarned, newCombos } = lastMove;
    
    // Find the slot element
    const slot = Array.from(ui.c5Board.querySelectorAll(".c5-slot")).find(s => 
        parseInt(s.dataset.col) === col && parseInt(s.dataset.row) === row
    );

    if (!slot) return;

    // Create the token in the slot for animation
    slot.innerHTML = "";
    const token = document.createElement("div");
    token.className = `c5-token player-${player.toLowerCase()} falling`;
    token.style.setProperty("--fall-dist", 7 - row);
    slot.appendChild(token);

    // 1. Play drop slide sound
    sfxC5Drop();

    // 2. Play land bounce
    setTimeout(() => {
        token.classList.remove("falling");
        token.classList.add("landed");
        sfxC5Land();

        // 3. Trigger combo highlights & floating text if scored
        if (pointsEarned > 0) {
            triggerC5ComboEffects(slot, pointsEarned, newCombos);
        }
    }, 380); // matches tokenFall animation duration
}

function triggerC5ComboEffects(landingSlot, points, combos) {
    // 1. Play victory chimes
    sfxC5Combo(points);

    // 2. Spawn floating points popup
    const rect = landingSlot.getBoundingClientRect();
    const floating = document.createElement("div");
    floating.className = "c5-floating-score";
    floating.textContent = `+${points}`;
    
    // Center it relative to the landing slot
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    floating.style.left = `${rect.left + scrollLeft + rect.width / 2 - 20}px`;
    floating.style.top = `${rect.top + scrollTop - 10}px`;
    
    document.body.appendChild(floating);
    setTimeout(() => floating.remove(), 1200);

    // 3. Highlight combo slots
    combos.forEach(combo => {
        combo.cells.forEach(cell => {
            const slotEl = Array.from(ui.c5Board.querySelectorAll(".c5-slot")).find(s => 
                parseInt(s.dataset.col) === cell.col && parseInt(s.dataset.row) === cell.row
            );
            if (slotEl) {
                slotEl.classList.add("combo-pulse");
            }
        });
    });

    // Clear highlights after pulse animation completes
    setTimeout(() => {
        ui.c5Board.querySelectorAll(".c5-slot").forEach(s => s.classList.remove("combo-pulse"));
    }, 2000);
}

// ── CONNECT 5 AUDIO SYNTHESIS ──
function sfxC5Drop() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    
    // Descending whoosh pitch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(250, t + 0.35);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
}

function sfxC5Land() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    
    // Short hollow boop on impact
    playNote(220, 0.1, t, 0.02, "triangle");
    playNote(110, 0.12, t + 0.02, 0.04, "sine");
}

function sfxC5Combo(points) {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    
    // Play celebratory ascending chimes
    playNote(523.25, 0.15, t, 0.04, "sine"); // C5
    playNote(659.25, 0.15, t + 0.1, 0.04, "sine"); // E5
    playNote(783.99, 0.22, t + 0.2, 0.06, "sine"); // G5
    
    if (points > 1) {
        // Double combo gets a DING!
        playNote(1046.50, 0.35, t + 0.3, 0.12, "sine"); // C6
    }
}
