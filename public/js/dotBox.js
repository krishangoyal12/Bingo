let lastDotBoxState = null;

function renderDotBoxBoard() {
    if (!serverState || serverState.gameType !== "dotBox") return;
    const state = serverState.dotBox;
    if (!state) return;

    const isYourTurn = serverState.turn === playerSlot;
    
    if (serverState.status === "playing") {
        ui.tttTurnIndicator.textContent = isYourTurn ? "YOUR TURN" : "OPPONENT'S TURN";
    } else if (serverState.status === "finished") {
        ui.tttTurnIndicator.textContent = "GAME OVER";
    } else {
        ui.tttTurnIndicator.textContent = "WAITING...";
    }

    // Update Scores and Players in reused tttPanel
    if (ui.tttScoreX && ui.tttScoreO && serverState.score) {
        ui.tttScoreX.textContent = serverState.score.A || 0;
        ui.tttScoreO.textContent = serverState.score.B || 0;
    }
    if (ui.tttPlayerXName && ui.tttPlayerOName && serverState.players) {
        ui.tttPlayerXName.textContent = serverState.players.A?.name || "Player A";
        ui.tttPlayerOName.textContent = serverState.players.B?.name || "Player B";
    }
    if (ui.tttPlayerXLabel && ui.tttPlayerOLabel) {
        ui.tttPlayerXLabel.textContent = "Player A";
        ui.tttPlayerOLabel.textContent = "Player B";
    }
    if (ui.tttPlayerXBadge && ui.tttPlayerOBadge) {
        ui.tttPlayerXBadge.style.borderColor = serverState.turn === "A" && serverState.status === "playing" ? "var(--blue)" : "";
        ui.tttPlayerOBadge.style.borderColor = serverState.turn === "B" && serverState.status === "playing" ? "var(--red)" : "";
    }

    // Check for new boxes and score changes for animation
    if (lastDotBoxState) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (state.boxes[r][c] !== null && lastDotBoxState.boxes[r][c] === null) {
                    if (state.boxes[r][c] === playerSlot) {
                        sfxLineComplete();
                    } else {
                        sfxOppLineComplete();
                    }
                    animateBoxCapture(r, c, state.boxes[r][c]);
                }
            }
        }
    }

    // Build grid if not already built
    if (ui.dotboxContainer.children.length === 0) {
        buildDotBoxGrid();
    }

    // Update lines
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
            const line = document.getElementById(`box-h-${r}-${c}`);
            if (line) {
                line.classList.toggle("claimed", !!state.hLines[r][c]);
                line.classList.toggle("interactable", !state.hLines[r][c] && isYourTurn && serverState.status === "playing");
            }
        }
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 10; c++) {
            const line = document.getElementById(`box-v-${r}-${c}`);
            if (line) {
                line.classList.toggle("claimed", !!state.vLines[r][c]);
                line.classList.toggle("interactable", !state.vLines[r][c] && isYourTurn && serverState.status === "playing");
            }
        }
    }

    // Update boxes
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const box = document.getElementById(`box-c-${r}-${c}`);
            if (box) {
                if (state.boxes[r][c] === "A") {
                    box.classList.add("claimed-a");
                    box.classList.remove("claimed-b");
                    box.textContent = (serverState.players?.A?.name || "A").charAt(0).toUpperCase();
                } else if (state.boxes[r][c] === "B") {
                    box.classList.add("claimed-b");
                    box.classList.remove("claimed-a");
                    box.textContent = (serverState.players?.B?.name || "B").charAt(0).toUpperCase();
                } else {
                    box.classList.remove("claimed-a", "claimed-b");
                    box.textContent = "";
                }
            }
        }
    }

    lastDotBoxState = JSON.parse(JSON.stringify(state));
}

function buildDotBoxGrid() {
    ui.dotboxContainer.innerHTML = "";
    
    // 19 rows x 19 cols
    for (let r = 0; r < 19; r++) {
        for (let c = 0; c < 19; c++) {
            const isDotRow = r % 2 === 0;
            const isDotCol = c % 2 === 0;

            const el = document.createElement("div");

            if (isDotRow && isDotCol) {
                // Dot
                el.className = "box-dot";
            } else if (isDotRow && !isDotCol) {
                // H-Line
                el.className = "box-hline";
                const row = r / 2;
                const col = (c - 1) / 2;
                el.id = `box-h-${row}-${col}`;
                el.addEventListener("click", () => handleLineClick("h", row, col));
            } else if (!isDotRow && isDotCol) {
                // V-Line
                el.className = "box-vline";
                const row = (r - 1) / 2;
                const col = c / 2;
                el.id = `box-v-${row}-${col}`;
                el.addEventListener("click", () => handleLineClick("v", row, col));
            } else {
                // Box
                el.className = "box-cell";
                const row = (r - 1) / 2;
                const col = (c - 1) / 2;
                el.id = `box-c-${row}-${col}`;
            }

            ui.dotboxContainer.appendChild(el);
        }
    }
}

function handleLineClick(type, r, c) {
    if (!serverState || serverState.gameType !== "dotBox" || serverState.status !== "playing") return;
    if (serverState.turn !== playerSlot) return;

    const state = serverState.dotBox;
    if (type === "h" && state.hLines[r][c]) return;
    if (type === "v" && state.vLines[r][c]) return;

    sfxButtonClick(); // Soft click
    socket.emit("makeDotBoxMove", { type, r, c });
}

function animateBoxCapture(r, c, owner) {
    const box = document.getElementById(`box-c-${r}-${c}`);
    if (!box) return;
    
    box.classList.remove("pop-anim");
    void box.offsetWidth; // trigger reflow
    box.classList.add("pop-anim");

    // Show floating +1
    const popup = document.createElement("div");
    popup.className = "box-score-popup";
    popup.textContent = "+1";
    popup.style.color = owner === "A" ? "var(--accent)" : "var(--blue)";
    box.appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentElement) popup.remove();
    }, 1000);
}
