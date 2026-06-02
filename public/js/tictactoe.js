function buildTTTBoard(container, onClick) {
    container.innerHTML = "";
    tttCells.length = 0;
    for (let i = 0; i < 9; i += 1) {
        const cell = document.createElement("div");
        cell.className = "ttt-cell";
        cell.dataset.index = String(i);
        if (onClick) {
            cell.addEventListener("click", () => onClick(i));
        }
        container.appendChild(cell);
        tttCells.push(cell);
    }
}

function handleTTTCellClick(index) {
    if (!socket || !roomId || !serverState) return;
    if (serverState.gameType !== "tictactoe") return;
    if (serverState.status !== "playing") return;
    if (serverState.turn !== playerSlot) {
        sfxInvalidAction();
        return;
    }
    if (serverState.tttBoard?.[index] !== null) {
        sfxInvalidAction();
        return;
    }
    socket.emit("makeTTTMove", { index });
}