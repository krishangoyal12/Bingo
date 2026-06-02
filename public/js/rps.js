let lastRpsState = null;
let rpsTicker = null;
let lastRpsRevealing = false;

function renderRPS() {
    if (!serverState || serverState.gameType !== "rps") return;
    const state = serverState.rps;
    if (!state) return;

    const you = playerSlot;
    const opp = you === "A" ? "B" : "A";
    const youInfo = serverState.players?.[you] || {};
    const oppInfo = serverState.players?.[opp] || {};

    // Setup format dropdown listeners once
    if (ui.rpsFormatSelect && !ui.rpsFormatSelect.dataset.listener) {
        ui.rpsFormatSelect.addEventListener("change", (e) => {
            sfxButtonClick();
            socket.emit("setRpsFormat", { format: e.target.value });
        });
        ui.rpsFormatSelect.dataset.listener = "true";
    }

    // Bind selection button click listeners once
    ["rock", "paper", "scissors"].forEach(choice => {
        const btn = document.getElementById(`rpsBtn${choice.charAt(0).toUpperCase() + choice.slice(1)}`);
        if (btn && !btn.dataset.listener) {
            btn.addEventListener("click", () => handleRpsChoice(choice));
            btn.dataset.listener = "true";
        }
    });

    // 1. Setup Phase Handling
    if (serverState.status === "setup") {
        ui.rpsFormatSelect.classList.remove("is-hidden");
        ui.rpsFormatSelect.disabled = false;
        ui.rpsFormatDisplay.classList.add("is-hidden");
        ui.rpsTurnIndicator.textContent = "Tap Ready to start duel";
        ui.rpsStatus.textContent = "Choose Match Type";
        ui.rpsCountdown.textContent = "";

        // Set select value based on state target wins
        const matchFormat = state.targetWins === 2 ? "3" : (state.targetWins === 6 ? "11" : "5");
        ui.rpsFormatSelect.value = matchFormat;

        // Clear trackers
        ui.rpsPlayDots.innerHTML = "";
        ui.rpsOppDots.innerHTML = "";
        ui.rpsOppCard.className = "rps-card opponent-card face-down is-hidden";
        
        // Remove selections
        document.querySelectorAll(".rps-choices button").forEach(b => b.className = "rps-card player-card");
        
        // Cancel timer loop
        if (rpsTicker) {
            clearInterval(rpsTicker);
            rpsTicker = null;
        }
        lastRpsRevealing = false;
        lastRpsState = null;
        return;
    }

    // 2. Play Phase Sizing & Header
    ui.rpsFormatSelect.classList.add("is-hidden");
    ui.rpsFormatDisplay.classList.remove("is-hidden");
    const formatName = state.targetWins === 2 ? "Best of 3" : (state.targetWins === 6 ? "Best of 11" : "Best of 5");
    ui.rpsFormatDisplay.textContent = formatName;

    // Names
    ui.rpsPlayName.textContent = `${youInfo.name || "You"}:`;
    ui.rpsOppName.textContent = `${oppInfo.name || "Opponent"}:`;

    // Render Dot trackers
    renderDotTrackers(ui.rpsPlayDots, state.scores[you], state.targetWins);
    renderDotTrackers(ui.rpsOppDots, state.scores[opp], state.targetWins);

    // Get current round status
    const myMove = state.moves[you];
    const oppMove = state.moves[opp];

    // Status turn texts
    if (serverState.status === "playing") {
        if (!state.revealing) {
            if (myMove) {
                ui.rpsTurnIndicator.textContent = "MOVE LOCKED";
                ui.rpsStatus.textContent = "Waiting for opponent...";
            } else {
                ui.rpsTurnIndicator.textContent = "CHOOSE YOUR MOVE";
                ui.rpsStatus.textContent = "Round " + state.round;
            }
        } else {
            ui.rpsTurnIndicator.textContent = "REVEALING MOVES";
            ui.rpsStatus.textContent = "Match faceoff!";
        }
    } else if (serverState.status === "finished") {
        ui.rpsTurnIndicator.textContent = "MATCH FINISHED";
        ui.rpsStatus.textContent = serverState.winner === you ? "VICTORY!" : "DEFEAT";
    }

    // Highlight selected player card
    ["rock", "paper", "scissors"].forEach(choice => {
        const btn = document.getElementById(`rpsBtn${choice.charAt(0).toUpperCase() + choice.slice(1)}`);
        if (btn) {
            btn.className = "rps-card player-card";
            if (myMove === choice) {
                btn.classList.add("selected");
            }
            // Disable interactions during reveal or setup
            btn.disabled = state.revealing || myMove !== null || serverState.status !== "playing";
        }
    });

    // Opponent card state
    ui.rpsOppCard.classList.remove("is-hidden");
    if (!state.revealing) {
        ui.rpsOppCard.className = "rps-card opponent-card face-down";
        if (oppMove) {
            ui.rpsOppCard.classList.add("locked"); // visual indicator opponent chose
        }
    }

    // 3. Countdown Ticker
    if (serverState.status === "playing" && !state.revealing && !myMove) {
        if (!rpsTicker) {
            lastCountdownVal = 0;
            rpsTicker = setInterval(tickRpsCountdown, 200);
        }
    } else {
        if (rpsTicker) {
            clearInterval(rpsTicker);
            rpsTicker = null;
        }
        ui.rpsCountdown.textContent = "";
    }

    // 4. Reveal & Outcome Animations triggers
    if (state.revealing && !lastRpsRevealing) {
        lastRpsRevealing = true;
        triggerRevealSequence(myMove, oppMove, state.history[state.history.length - 1]);
    } else if (!state.revealing) {
        lastRpsRevealing = false;
        // Clean arena styles unless active reveal is running
        if (!document.querySelector(".rps-arena").classList.contains("animating")) {
            ui.rpsOppCardFront.textContent = "";
        }
    }

    lastRpsState = JSON.parse(JSON.stringify(state));
}

let lastCountdownVal = 0;
function tickRpsCountdown() {
    if (!serverState || serverState.gameType !== "rps" || serverState.status !== "playing" || !serverState.rps || serverState.rps.revealing) return;
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((serverState.rps.roundDeadline - now) / 1000));
    if (remaining !== lastCountdownVal) {
        lastCountdownVal = remaining;
        ui.rpsCountdown.textContent = remaining > 0 ? remaining : "";
        if (remaining > 0 && remaining <= 3) {
            const ctx = getAudioCtx();
            const t = ctx.currentTime;
            const pitch = 440 + (3 - remaining) * 220; // 440, 660, 880 Hz
            playNote(pitch, 0.15, t, 0.08, "triangle");
        }
    }
}

function handleRpsChoice(choice) {
    if (!serverState || serverState.gameType !== "rps" || serverState.status !== "playing") return;
    if (serverState.rps.moves[playerSlot]) return;
    if (serverState.rps.revealing) return;

    // Lock move sound
    sfxLockMove();
    socket.emit("makeRpsMove", { move: choice });
}

function sfxLockMove() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(220, 0.3, t, 0.1, "sine");
    playNote(110, 0.25, t + 0.05, 0.15, "triangle");
}

function sfxWhoosh() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const bufLen = ctx.sampleRate * 0.18;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 4);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = "peaking";
    filt.frequency.setValueAtTime(800, t);
    filt.frequency.exponentialRampToValueAtTime(100, t + 0.15);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    src.connect(filt).connect(g).connect(ctx.destination);
    src.start(t);
}

function renderDotTrackers(container, score, targetWins) {
    container.innerHTML = "";
    for (let i = 0; i < targetWins; i++) {
        const dot = document.createElement("span");
        dot.className = "score-dot" + (i < score ? " filled" : "");
        container.appendChild(dot);
    }
}

const svgMap = {
    rock: `<svg class="rps-icon rps-icon-rock" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 50px; height: 50px;">
              <path d="M12 40 L20 20 L44 20 L52 40 L44 52 L20 52 Z" fill="var(--dark)" />
              <path d="M10 38 L18 18 L42 18 L50 38 L42 50 L18 50 Z" fill="#90A4AE" stroke="var(--dark)" stroke-width="4" stroke-linejoin="round" />
              <path d="M18 18 L28 32 L10 38" stroke="var(--dark)" stroke-width="4" stroke-linejoin="round" />
              <path d="M42 18 L36 32 L50 38" stroke="var(--dark)" stroke-width="4" stroke-linejoin="round" />
              <path d="M28 32 L36 32 L42 50" stroke="var(--dark)" stroke-width="4" stroke-linejoin="round" />
              <path d="M28 32 L18 50" stroke="var(--dark)" stroke-width="4" stroke-linejoin="round" />
              <circle cx="24" cy="24" r="2" fill="#FFFFFF" opacity="0.6" />
            </svg>`,
    paper: `<svg class="rps-icon rps-icon-paper" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 50px; height: 50px;">
              <rect x="18" y="14" width="32" height="42" rx="4" fill="var(--dark)" />
              <rect x="14" y="10" width="32" height="42" rx="4" fill="#E0F2F1" stroke="var(--dark)" stroke-width="4" stroke-linejoin="round" />
              <line x1="20" y1="20" x2="40" y2="20" stroke="var(--dark)" stroke-width="4" stroke-linecap="round" />
              <line x1="20" y1="28" x2="40" y2="28" stroke="var(--dark)" stroke-width="4" stroke-linecap="round" />
              <line x1="20" y1="36" x2="34" y2="36" stroke="var(--dark)" stroke-width="4" stroke-linecap="round" />
              <path d="M38 10 L46 18 L38 18 Z" fill="#B2DFDB" stroke="var(--dark)" stroke-width="4" stroke-linejoin="round" />
            </svg>`,
    scissors: `<svg class="rps-icon rps-icon-scissors" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 50px; height: 50px;">
                  <path d="M20 40 L48 16 L52 20 L24 44 Z" fill="#CFD8DC" stroke="var(--dark)" stroke-width="4" stroke-linejoin="round" />
                  <path d="M20 24 L48 48 L52 44 L24 20 Z" fill="#CFD8DC" stroke="var(--dark)" stroke-width="4" stroke-linejoin="round" />
                  <circle cx="16" cy="20" r="10" fill="#FF7043" stroke="var(--dark)" stroke-width="4" />
                  <circle cx="16" cy="20" r="4" fill="#FFFFFF" stroke="var(--dark)" stroke-width="4" />
                  <circle cx="16" cy="44" r="10" fill="#FF7043" stroke="var(--dark)" stroke-width="4" />
                  <circle cx="16" cy="44" r="4" fill="#FFFFFF" stroke="var(--dark)" stroke-width="4" />
                  <circle cx="22" cy="32" r="3" fill="#FFFFFF" stroke="var(--dark)" stroke-width="3" />
                </svg>`
};

function triggerRevealSequence(myMove, oppMove, historyRecord) {
    if (!historyRecord) return;
    const you = playerSlot;
    const opp = you === "A" ? "B" : "A";

    const arena = document.getElementById("rpsArena");
    arena.classList.add("animating");
    ui.rpsCountdown.classList.add("is-hidden");

    // Play card flip sound
    sfxWhoosh();

    // Reveal opponent card
    ui.rpsOppCardFront.innerHTML = svgMap[oppMove];
    ui.rpsOppCard.className = "rps-card opponent-card face-up flip-anim";

    setTimeout(() => {
        ui.rpsFaceoff.classList.remove("is-hidden");
        ui.fighterLeft.innerHTML = svgMap[myMove];
        ui.fighterRight.innerHTML = svgMap[oppMove];
        
        // Hide base cards during faceoff to focus on the battle
        ui.rpsOppCard.classList.add("is-hidden");

        const outcome = historyRecord.winner; // "A", "B", or "TIE"
        const isTie = outcome === "TIE";
        const isLeftWinner = outcome === you;

        let animClass = "";
        let winnerMove = "";
        if (isTie) {
            animClass = "faceoff-tie";
        } else {
            winnerMove = outcome === "A" ? historyRecord.moves.A : historyRecord.moves.B;
            const winnerDir = isLeftWinner ? "left" : "right";
            animClass = `faceoff-${winnerMove}-wins-${winnerDir}`;
        }

        ui.rpsFaceoff.className = "rps-faceoff " + animClass;

        const ctx = getAudioCtx();
        const t = ctx.currentTime;

        if (isTie) {
            playNote(400, 0.2, t, 0.08, "triangle");
            playNote(400, 0.2, t + 0.1, 0.08, "triangle");
        } else {
            if (winnerMove === "rock") {
                playNote(150, 0.35, t, 0.25, "triangle");
            } else if (winnerMove === "scissors") {
                playNote(800, 0.18, t, 0.05, "sine");
                playNote(1200, 0.15, t + 0.05, 0.1, "sine");
            } else if (winnerMove === "paper") {
                playNote(300, 0.25, t, 0.2, "sine");
            }

            // Ding for point earn after impact
            setTimeout(() => {
                const innerCtx = getAudioCtx();
                const it = innerCtx.currentTime;
                if (isLeftWinner) {
                    playNote(988, 0.25, it, 0.08, "sine"); // Ding
                }
            }, 500);
        }

        // Clean up classes after animation completes (2.2 seconds)
        setTimeout(() => {
            ui.rpsFaceoff.classList.add("is-hidden");
            ui.rpsFaceoff.className = "rps-faceoff is-hidden";
            ui.rpsOppCard.classList.remove("is-hidden");
            ui.rpsCountdown.classList.remove("is-hidden");
            arena.classList.remove("animating");
        }, 2200);

    }, 600);
}
