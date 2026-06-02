function buildBoard(container, store, onClick) {
    for (let i = 0; i < 25; i += 1) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = String(i);
        if (onClick) {
            cell.addEventListener("click", () => onClick(i));
        }
        container.appendChild(cell);
        store.push(cell);
    }
}

function buildLayoutButtons() {
    if (!ui.layoutList) return;
    ui.layoutList.innerHTML = "";
    layoutButtons.length = 0;
    const allLayouts = [...PRESET_LAYOUTS];
    const customLayouts = JSON.parse(localStorage.getItem("customLayouts") || "[]");
    customLayouts.forEach(c => allLayouts.push(c.board));

    allLayouts.forEach((layout, index) => {
        const btn = document.createElement("button");
        btn.className = "layout-btn";
        const isCustom = index >= PRESET_LAYOUTS.length;
        btn.textContent = isCustom ? customLayouts[index - PRESET_LAYOUTS.length].name : `Preset ${index + 1}`;
        btn.dataset.layoutId = String(index);
        btn.addEventListener("click", () => applyLayout(index, layout));
        ui.layoutList.appendChild(btn);
        layoutButtons.push(btn);
    });
}

function applyLayout(layoutId, layoutArr) {
    if (!roomId || !playerSlot) {
        showToast("Create or join a room first.");
        return;
    }
    if (serverState && serverState.status !== "setup") return;
    if (localState.ready) return;

    const oppSlot = playerSlot === "A" ? "B" : "A";
    const oppLayoutId = serverState?.layoutIds?.[oppSlot];
    if (oppLayoutId === layoutId) {
        showToast("Opponent already uses this layout.");
        return;
    }
    if (!layoutArr) return;
    localState.board = layoutArr.slice();
    localState.next = 26;
    localState.layoutId = layoutId;
    ui.nextNumber.textContent = "done";
    ui.readyBtn.disabled = false;
    ui.saveLayoutBtn.classList.add("is-hidden");
    renderPlayerBoard(localState.board, new Set(serverState?.calledNumbers || []));
    renderLayoutButtons(oppSlot);
}

function handleCellClick(index) {
    if (serverState && serverState.status === "playing") {
        const number = serverState.boards?.[playerSlot]?.[index];
        if (number) handleCall(number);
        return;
    }
    handlePlayerPlacement(index);
}

function handlePlayerPlacement(index) {
    if (!roomId || !playerSlot) {
        showToast("Create or join a room first.");
        return;
    }
    if (serverState && serverState.status !== "setup") return;
    if (localState.ready || localState.next > 25) return;
    if (localState.board[index] !== null) {
        sfxInvalidAction();
        return;
    }

    if (localState.layoutId !== null) {
        localState.layoutId = null;
    }
    localState.board[index] = localState.next;
    localState.next += 1;
    ui.nextNumber.textContent = localState.next <= 25 ? String(localState.next) : "done";
    ui.readyBtn.disabled = localState.next <= 25;
    if (localState.next > 25) {
        ui.saveLayoutBtn.classList.remove("is-hidden");
    }
    sfxNumberMarked();
    renderPlayerBoard(localState.board, new Set());
}

function handleCall(number) {
    if (!socket || !roomId || !serverState) return;
    if (serverState.status !== "playing") return;
    if (serverState.turn !== playerSlot) {
        sfxInvalidAction();
        return;
    }
    if ((serverState.calledNumbers || []).includes(number)) {
        sfxInvalidAction();
        return;
    }
    const board = serverState.boards?.[playerSlot];
    if (!Array.isArray(board) || !board.includes(number)) return;
    socket.emit("callNumber", { number });
}

function resetLocalBoard() {
    localState.board = Array(25).fill(null);
    localState.next = 1;
    localState.ready = false;
    localState.layoutId = null;
    localState.selectedChopHand = null;
    ui.nextNumber.textContent = "1";
    ui.readyBtn.disabled = true;
    ui.saveLayoutBtn.classList.add("is-hidden");
}

function renderBoard(cells, board, calledSet, locked, isOpponent = false) {
    if (!cells || cells.length === 0) return;
    const container = cells[0].parentNode;

    const isMarkedArr = Array(25).fill(false);
    for (let i = 0; i < 25; i += 1) {
        const cell = cells[i];
        const value = board ? board[i] : null;
        cell.textContent = (value && !isOpponent) ? String(value) : "";
        const isMarked = value ? calledSet.has(value) : false;
        isMarkedArr[i] = isMarked;
        cell.classList.toggle("marked", isMarked);
        cell.classList.toggle("locked", locked);
    }

    if (!board) return;

    const activeLineIds = new Set();

    function drawLine(type, cellsInLine, lineId) {
        let line = container.querySelector(`.strike-line[data-line-id="${lineId}"]`);
        if (line) return; // Line already drawn, do not re-render

        line = document.createElement("div");
        line.className = "strike-line";
        line.dataset.lineId = lineId;
        line.style.position = "absolute";
        
        if (isOpponent) {
            line.style.backgroundColor = "#a0a3a8";
            line.style.border = "3px solid #4a4e54";
            line.style.boxShadow = "2px 2px 0 0 #4a4e54";
        } else {
            line.style.backgroundColor = "var(--yellow)";
            line.style.border = "3px solid var(--dark)";
            line.style.boxShadow = "2px 2px 0 0 var(--dark)";
        }
        
        line.style.zIndex = "5";
        line.style.pointerEvents = "none";
        line.style.borderRadius = "8px";
        line.style.height = "14px";

        const first = cellsInLine[0];
        const last = cellsInLine[4];

        // Ensure elements are rendered to get accurate offsets
        const x1 = first.offsetLeft + first.offsetWidth / 2;
        const y1 = first.offsetTop + first.offsetHeight / 2;
        const x2 = last.offsetLeft + last.offsetWidth / 2;
        const y2 = last.offsetTop + last.offsetHeight / 2;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        
        // Extend past the center of the first/last cells by 40% of cell width
        const padding = first.offsetWidth * 0.4;
        
        const startX = x1 - Math.cos(angle) * padding;
        const startY = y1 - Math.sin(angle) * padding;

        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        line.style.transformOrigin = "0 50%";
        line.style.transform = `translateY(-50%) rotate(${angle}rad)`;
        
        // Use animation to draw line
        line.style.width = "0px";
        line.style.transition = "width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

        container.appendChild(line);

        // Trigger reflow to start transition
        line.getBoundingClientRect();
        line.style.width = `${length + padding * 2}px`;
    }

    for (let r = 0; r < 5; r++) {
        if (isMarkedArr.slice(r * 5, r * 5 + 5).every(Boolean)) {
            const id = `row-${r}`;
            activeLineIds.add(id);
            drawLine("row", cells.slice(r * 5, r * 5 + 5), id);
        }
    }
    for (let c = 0; c < 5; c++) {
        const colIndices = [c, c+5, c+10, c+15, c+20];
        if (colIndices.every(i => isMarkedArr[i])) {
            const id = `col-${c}`;
            activeLineIds.add(id);
            drawLine("col", colIndices.map(i => cells[i]), id);
        }
    }
    const diag1 = [0, 6, 12, 18, 24];
    if (diag1.every(i => isMarkedArr[i])) {
        activeLineIds.add("diag1");
        drawLine("diag1", diag1.map(i => cells[i]), "diag1");
    }
    
    const diag2 = [4, 8, 12, 16, 20];
    if (diag2.every(i => isMarkedArr[i])) {
        activeLineIds.add("diag2");
        drawLine("diag2", diag2.map(i => cells[i]), "diag2");
    }

    // Remove any lines that are no longer valid (e.g., on board reset)
    const existingLines = container.querySelectorAll(".strike-line");
    existingLines.forEach(line => {
        if (!activeLineIds.has(line.dataset.lineId)) {
            line.remove();
        }
    });
}

function renderPlayerBoard(board, calledSet) {
    renderBoard(playerCells, board, calledSet, localState.ready && serverState?.status === "setup", false);
}

function renderLayoutButtons(oppSlot) {
    if (!ui.layoutList || layoutButtons.length === 0) return;
    const oppLayoutId = oppSlot ? serverState?.layoutIds?.[oppSlot] : null;
    const disableAll = !serverState || serverState.status !== "setup" || localState.ready;
    layoutButtons.forEach((btn, index) => {
        const blocked = oppLayoutId === index;
        btn.classList.toggle("layout-btn--active", localState.layoutId === index);
        btn.classList.toggle("layout-btn--disabled", disableAll || blocked);
        btn.disabled = disableAll || blocked;
    });
    if (ui.clearLayoutBtn) {
        ui.clearLayoutBtn.disabled = disableAll;
    }
}