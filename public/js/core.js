const byId = (id) => document.getElementById(id);

const ui = {
    lobby: byId("lobby"),
    game: byId("game"),
    actionArea: byId("actionArea"),
    connStatus: byId("connStatus"),
    roomCode: byId("roomCode"),
    nameInput: byId("nameInput"),
    roomInput: byId("roomInput"),
    createRoomBtn: byId("createRoomBtn"),
    joinRoomBtn: byId("joinRoomBtn"),
    playerBoard: byId("playerBoard"),
    nextNumber: byId("nextNumber"),
    readyBtn: byId("readyBtn"),
    readyChip: byId("readyChip"),
    youLines: byId("youLines"),
    oppLines: byId("oppLines"),
    youName: byId("youName"),
    oppName: byId("oppName"),
    oppStatus: byId("oppStatus"),
    opponentInfo: byId("opponentInfo"),
    oppBoardWrap: byId("oppBoardWrap"),
    oppBoard: byId("oppBoard"),
    turnIndicator: byId("turnIndicator"),
    timerBar: byId("timerBar"),
    timerBarFill: byId("timerBarFill"),
    turnTimerWrap: byId("turnTimerWrap"),
    toast: byId("toast"),
    winnerOverlay: byId("winnerOverlay"),
    winnerTitle: byId("winnerTitle"),
    winnerSub: byId("winnerSub"),
    playAgainBtn: byId("playAgainBtn"),
    layoutList: byId("layoutList"),
    layoutRow: byId("layoutRow"),
    clearLayoutBtn: byId("clearLayoutBtn"),
    saveLayoutBtn: byId("saveLayoutBtn"),
    disconnectBtn: byId("disconnectBtn"),
    forfeitBtn: byId("forfeitBtn"),
    forfeitOverlay: byId("forfeitOverlay"),
    cancelForfeitBtn: byId("cancelForfeitBtn"),
    confirmForfeitBtn: byId("confirmForfeitBtn"),
    audioControls: byId("audioControls"),
    muteMicBtn: byId("muteMicBtn"),
    deafenBtn: byId("deafenBtn"),
    muteGameBtn: byId("muteGameBtn"),
    remoteAudio: byId("remoteAudio"),
    // Added for Tic Tac Toe:
    gameSelector: byId("gameSelector"),
    btnBingoTab: byId("btnBingoTab"),
    btnTTTTab: byId("btnTTTTab"),
    btnChopsticksTab: byId("btnChopsticksTab"),
    btnDotBoxTab: byId("btnDotBoxTab"),
    btnRpsTab: byId("btnRpsTab"),
    btnConnect5Tab: byId("btnConnect5Tab"),
    connect5Panel: byId("connect5Panel"),
    c5Board: byId("c5Board"),
    c5GhostRow: byId("c5GhostRow"),
    c5TurnIndicator: byId("c5TurnIndicator"),
    c5PlayerAName: byId("c5PlayerAName"),
    c5PlayerBName: byId("c5PlayerBName"),
    c5PlayerAStars: byId("c5PlayerAStars"),
    c5PlayerBStars: byId("c5PlayerBStars"),
    c5StatusBar: byId("c5StatusBar"),
    btnLeave: byId("btnLeave"),
    tttPanel: byId("tttPanel"),
    tttBoard: byId("tttBoard"),
    tttTurnIndicator: byId("tttTurnIndicator"),
    tttScoreX: byId("tttScoreX"),
    tttScoreO: byId("tttScoreO"),
    tttPlayerXName: byId("tttPlayerXName"),
    tttPlayerOName: byId("tttPlayerOName"),
    bingoPlayerPanel: byId("bingoPlayerPanel"),
    tttPlayerXBadge: byId("tttPlayerXBadge"),
    tttPlayerOBadge: byId("tttPlayerOBadge"),
    tttPlayerXLabel: byId("tttPlayerXLabel"),
    tttPlayerOLabel: byId("tttPlayerOLabel"),
    dotBoxBoard: byId("dotBoxBoard"),
    dotboxContainer: byId("dotboxContainer"),
    infoBtn: byId("infoBtn"),
    infoOverlay: byId("infoOverlay"),
    closeRulesBtn: byId("closeRulesBtn"),
    rulesBody: byId("rulesBody"),
    rulesTitle: byId("rulesTitle"),
    // Added for Chopsticks:
    btnChopsticksTab: byId("btnChopsticksTab"),
    chopsticksPanel: byId("chopsticksPanel"),
    chopsticksTurnIndicator: byId("chopsticksTurnIndicator"),
    chopScoreA: byId("chopScoreA"),
    chopScoreB: byId("chopScoreB"),
    chopOppLabel: byId("chopOppLabel"),
    chopOppLeftHand: byId("chopOppLeftHand"),
    chopOppRightHand: byId("chopOppRightHand"),
    chopActionStatus: byId("chopActionStatus"),
    btnChopRedistribute: byId("btnChopRedistribute"),
    btnChopCancelAction: byId("btnChopCancelAction"),
    chopPlayLeftHand: byId("chopPlayLeftHand"),
    chopPlayRightHand: byId("chopPlayRightHand"),
    chopPlayLabel: byId("chopPlayLabel"),
    chopRedistributeOverlay: byId("chopRedistributeOverlay"),
    chopDistributionOptions: byId("chopDistributionOptions"),
    btnChopCloseRedistribute: byId("btnChopCloseRedistribute"),
    // Added for RPS:
    rpsPanel: byId("rpsPanel"),
    rpsTurnIndicator: byId("rpsTurnIndicator"),
    rpsFormatSelect: byId("rpsFormatSelect"),
    rpsFormatDisplay: byId("rpsFormatDisplay"),
    rpsOppCard: byId("rpsOppCard"),
    rpsOppCardFront: byId("rpsOppCardFront"),
    rpsStatus: byId("rpsStatus"),
    rpsCountdown: byId("rpsCountdown"),
    rpsChoices: byId("rpsChoices"),
    rpsPlayName: byId("rpsPlayName"),
    rpsOppName: byId("rpsOppName"),
    rpsPlayDots: byId("rpsPlayDots"),
    rpsOppDots: byId("rpsOppDots"),
    rpsFaceoff: byId("rpsFaceoff"),
    fighterLeft: byId("fighterLeft"),
    fighterRight: byId("fighterRight"),
    playSoloBtn: byId("playSoloBtn"),
    soloDifficultyWrap: byId("soloDifficultyWrap"),
    chatToggleBtn: byId("chatToggleBtn"),
    chatBadge: byId("chatBadge"),
    chatDrawer: byId("chatDrawer"),
    closeChatBtn: byId("closeChatBtn"),
    chatMessages: byId("chatMessages"),
    chatForm: byId("chatForm"),
    chatInput: byId("chatInput"),
    quickChats: byId("quickChats"),
    emojiToggleBtn: byId("emojiToggleBtn"),
    emojiPicker: byId("emojiPicker"),
    stickerToggleBtn: byId("stickerToggleBtn"),
    stickerPicker: byId("stickerPicker"),
    customStickerInput: byId("customStickerInput"),
    sendCustomStickerBtn: byId("sendCustomStickerBtn"),
};

const localState = {
    board: Array(25).fill(null),
    next: 1,
    ready: false,
    layoutId: null,
    selectedChopHand: null,
};

let lastChopsticksState = null;

let sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("sessionId", sessionId);
}

let socket = null;
let roomId = null;
let playerSlot = null;
let serverState = null;
let lastRound = null;
let lastCalledCount = 0;
let lastLineCount = 0;
let hasShownWinScreen = false;
let timerAnimFrame = null;

let lastRenderedChatCount = 0;
let isChatOpen = false;
let unreadChatCount = 0;

// ── Sound Effects (Premium Audio Design System) ──
const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

let gameSoundsMuted = false;

// Helper: create a note with specific waveform, frequency, volume, start, duration
function playNote(freq, vol, start, dur, type = "sine") {
    if (gameSoundsMuted) return;
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.01);
}

// Helper: create a noise burst (for clicks/pops)
function playNoiseBurst(vol, start, dur) {
    if (gameSoundsMuted) return;
    const ctx = getAudioCtx();
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3000;
    filter.Q.value = 1.5;
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(start);
    source.stop(start + dur + 0.01);
}

let lastSoundTime = 0;

// 2. Button Click – chunky tactile click (20%)
function sfxButtonClick() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNoiseBurst(0.2, t, 0.04);
    playNote(800, 0.08, t, 0.03, "square");
    playNote(400, 0.06, t + 0.01, 0.03, "square");
}

// 3. Number Marked / Cancelled – soft pop (25%)
function sfxNumberMarked() {
    const now = Date.now();
    if (now - lastSoundTime < 80) return;
    lastSoundTime = now;
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(880, 0.12, t, 0.08, "sine");
    playNote(1200, 0.10, t + 0.02, 0.06, "sine");
    playNoiseBurst(0.08, t, 0.03);
}

// 4. Invalid Action – muted low-pitch beep (20%)
function sfxInvalidAction() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(200, 0.12, t, 0.15, "sine");
    playNote(180, 0.08, t + 0.08, 0.12, "sine");
}

// 5. Layout Selected – light confirmation click (20%)
function sfxLayoutSelected() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(1100, 0.10, t, 0.05, "sine");
    playNote(1400, 0.08, t + 0.04, 0.06, "sine");
}

// 6. Room Created – short positive chime (30%)
function sfxRoomCreated() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(784, 0.15, t, 0.12, "sine");
    playNote(988, 0.15, t + 0.08, 0.12, "sine");
    playNote(1175, 0.18, t + 0.16, 0.18, "triangle");
}

// 7. Opponent Joined – friendly arrival pop (30%)
function sfxOpponentJoined() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNoiseBurst(0.12, t, 0.04);
    playNote(660, 0.15, t + 0.02, 0.10, "sine");
    playNote(880, 0.18, t + 0.08, 0.15, "triangle");
}

// 8. Ready Button – strong confirmation clack (35%)
function sfxReadyPressed() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNoiseBurst(0.25, t, 0.03);
    playNote(660, 0.15, t, 0.06, "square");
    playNote(880, 0.18, t + 0.04, 0.08, "triangle");
    playNote(1100, 0.20, t + 0.10, 0.12, "sine");
}

// 9. Both Players Ready / Match Start – whoosh + bright chime (40%)
function sfxMatchStart() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    // Whoosh (filtered noise sweep)
    const bufLen = ctx.sampleRate * 0.4;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 3);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.setValueAtTime(400, t);
    filt.frequency.exponentialRampToValueAtTime(4000, t + 0.3);
    filt.Q.value = 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    src.connect(filt).connect(g).connect(ctx.destination);
    src.start(t);
    src.stop(t + 0.45);
    // Bright start chime
    playNote(784, 0.20, t + 0.3, 0.12, "triangle");
    playNote(988, 0.22, t + 0.38, 0.12, "triangle");
    playNote(1320, 0.25, t + 0.48, 0.25, "sine");
}

// 10. Your Turn – notification ping (30%)
function sfxYourTurn() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(1047, 0.15, t, 0.10, "sine");
    playNote(1319, 0.18, t + 0.08, 0.15, "sine");
}

// 11. Opponent Turn – light transition swoosh (20%)
function sfxOpponentTurn() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const bufLen = ctx.sampleRate * 0.2;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 5);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = "highpass";
    filt.frequency.setValueAtTime(2000, t);
    filt.frequency.exponentialRampToValueAtTime(500, t + 0.15);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    src.connect(filt).connect(g).connect(ctx.destination);
    src.start(t);
    src.stop(t + 0.25);
}

// 12. Complete One Line – ascending C→E→G (50%)
function sfxLineComplete() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(523, 0.25, t, 0.15, "triangle");
    playNote(659, 0.28, t + 0.10, 0.15, "triangle");
    playNote(784, 0.30, t + 0.20, 0.25, "sine");
}

// 13. Opponent Completes Line – descending G→E→C (40%)
function sfxOppLineComplete() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(784, 0.18, t, 0.12, "sine");
    playNote(659, 0.16, t + 0.10, 0.12, "sine");
    playNote(523, 0.14, t + 0.20, 0.18, "sine");
}

// 14. Reach Four Lines (4/5) – enhanced success chime (60%)
function sfxMatchPoint() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(523, 0.28, t, 0.12, "triangle");
    playNote(659, 0.30, t + 0.09, 0.12, "triangle");
    playNote(784, 0.32, t + 0.18, 0.12, "triangle");
    playNote(1047, 0.35, t + 0.27, 0.30, "sine");
}

// 15. Opponent Reaches Four Lines – tension warning (55%)
function sfxOppMatchPoint() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(370, 0.25, t, 0.15, "sine");
    playNote(330, 0.28, t + 0.12, 0.20, "sine");
    playNote(294, 0.22, t + 0.25, 0.25, "triangle");
}

// 16. Final Winning Line + 17. Winner Overlay – victory fanfare (80-100%)
function sfxVictory() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    // Line completion chime
    playNote(523, 0.30, t, 0.12, "triangle");
    playNote(659, 0.32, t + 0.08, 0.12, "triangle");
    playNote(784, 0.35, t + 0.16, 0.20, "sine");
    // Small pause, then victory fanfare
    playNote(784, 0.35, t + 0.50, 0.10, "triangle");
    playNote(784, 0.35, t + 0.58, 0.10, "triangle");
    playNote(784, 0.35, t + 0.66, 0.15, "triangle");
    playNote(659, 0.30, t + 0.82, 0.12, "sine");
    playNote(784, 0.35, t + 0.94, 0.12, "triangle");
    playNote(988, 0.40, t + 1.06, 0.15, "triangle");
    playNote(1047, 0.45, t + 1.22, 0.50, "sine");
    // Warm pad underneath
    playNote(262, 0.12, t + 0.50, 1.3, "sine");
    playNote(330, 0.10, t + 0.50, 1.3, "sine");
    playNote(392, 0.10, t + 0.50, 1.3, "sine");
}

// 18. Defeat – gentle descending notes (50%)
function sfxDefeat() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(784, 0.22, t, 0.20, "sine");
    playNote(659, 0.20, t + 0.18, 0.20, "sine");
    playNote(523, 0.18, t + 0.36, 0.25, "sine");
    playNote(440, 0.15, t + 0.56, 0.35, "triangle");
}

// 19. Tie – friendly double chime (70%)
function sfxTie() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(784, 0.30, t, 0.15, "triangle");
    playNote(988, 0.32, t + 0.10, 0.15, "triangle");
    playNote(784, 0.28, t + 0.30, 0.15, "sine");
    playNote(988, 0.30, t + 0.40, 0.25, "sine");
}

// 20. Opponent Disconnects – soft disconnect tone (40%)
function sfxOpponentDisconnect() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(440, 0.20, t, 0.20, "sine");
    playNote(370, 0.18, t + 0.15, 0.25, "sine");
    playNote(330, 0.15, t + 0.30, 0.30, "triangle");
}

// 21. Rematch / New Round – refresh whoosh + small start chime (40%)
function sfxRematch() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    // Whoosh
    const bufLen = ctx.sampleRate * 0.25;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 4);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.setValueAtTime(600, t);
    filt.frequency.exponentialRampToValueAtTime(3000, t + 0.2);
    filt.Q.value = 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    src.connect(filt).connect(g).connect(ctx.destination);
    src.start(t);
    src.stop(t + 0.3);
    // Small chime
    playNote(880, 0.18, t + 0.20, 0.10, "triangle");
    playNote(1100, 0.20, t + 0.28, 0.15, "sine");
}

// State tracking for sound triggers
let lastOppLineCount = 0;
let lastTurn = null;
let lastStatus = null;
let wasOppConnected = false;
let lastTTTMoveCount = 0;

function sfxChopAttack() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(600, 0.12, t, 0.05, "sine");
    playNote(900, 0.10, t + 0.03, 0.08, "triangle");
    playNoiseBurst(0.08, t, 0.02);
}

function sfxChopRedistribute() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNoiseBurst(0.08, t, 0.02);
    playNoiseBurst(0.08, t + 0.05, 0.02);
    playNoiseBurst(0.08, t + 0.10, 0.02);
    playNote(400, 0.05, t, 0.03, "triangle");
    playNote(500, 0.05, t + 0.05, 0.03, "triangle");
    playNote(600, 0.05, t + 0.10, 0.03, "triangle");
}

// 1. Hover Interactive Element - Very soft tick (10%)
function sfxHover() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNoiseBurst(0.05, t, 0.015);
}

function sfxChatReceived() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(660, 0.12, t, 0.06, "sine");
    playNote(880, 0.12, t + 0.06, 0.08, "sine");
}

function sfxSticker() {
    if (gameSoundsMuted) return;
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playNote(523.25, 0.12, t, 0.05, "sine");
    playNote(659.25, 0.12, t + 0.05, 0.05, "sine");
    playNote(783.99, 0.12, t + 0.10, 0.05, "sine");
    playNote(1046.50, 0.15, t + 0.15, 0.18, "sine");
}

function syncChatHistory(chatHistory) {
    if (!chatHistory) return;
    const messagesContainer = ui.chatMessages;
    if (!messagesContainer) return;
    
    if (chatHistory.length < lastRenderedChatCount) {
        messagesContainer.innerHTML = "";
        lastRenderedChatCount = 0;
    }
    
    let playedSound = false;
    for (let i = lastRenderedChatCount; i < chatHistory.length; i++) {
        const msg = chatHistory[i];
        const msgEl = document.createElement("div");
        msgEl.className = `chat-msg ${msg.sender === playerSlot ? "chat-msg--self" : "chat-msg--opp"}`;
        
        const senderEl = document.createElement("span");
        senderEl.className = "chat-msg-sender";
        senderEl.textContent = msg.senderName;
        
        const textEl = document.createElement("span");
        textEl.className = "chat-msg-text";
        textEl.textContent = msg.message;
        
        const timeEl = document.createElement("span");
        timeEl.className = "chat-msg-time";
        const date = new Date(msg.timestamp);
        timeEl.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        msgEl.appendChild(senderEl);
        msgEl.appendChild(textEl);
        msgEl.appendChild(timeEl);
        
        messagesContainer.appendChild(msgEl);
        
        if (msg.sender !== playerSlot) {
            if (!playedSound) {
                sfxChatReceived();
                playedSound = true;
            }
            if (!isChatOpen) {
                unreadChatCount++;
                ui.chatBadge.textContent = String(unreadChatCount);
                ui.chatBadge.classList.remove("is-hidden");
            }
        }
    }
    
    if (chatHistory.length > lastRenderedChatCount) {
        lastRenderedChatCount = chatHistory.length;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Global Event Listeners for Audio
document.addEventListener("mouseover", (e) => {
    const target = e.target.closest("button, .cell");
    if (!target || target.disabled || target.classList.contains("locked") || target.classList.contains("marked")) return;
    
    // Ensure we only play once when entering the element, not when moving inside it
    if (!target.contains(e.relatedTarget)) {
        sfxHover();
    }
});

document.addEventListener("click", (e) => {
    const target = e.target;
    // Don't play default click for cells, they have their own logic/sounds
    if (target.closest(".cell")) return;
    
    const btn = target.closest("button");
    if (btn && !btn.disabled) {
        if (btn.id === "readyBtn") {
            sfxReadyPressed();
        } else if (btn.classList.contains("layout-btn")) {
            sfxLayoutSelected();
        } else if (btn.id === "createRoomBtn") {
            // will be handled by socket event if successful, but we can play a click here too
            sfxButtonClick();
        } else if (btn.id === "playAgainBtn") {
            sfxRematch();
        } else {
            sfxButtonClick();
        }
    }
});

// ── Confetti ──
// Removed old launchConfetti() in favor of GameEffects component in game-effects.js

// ── Turn Timer ──
function startTimerAnimation() {
    stopTimerAnimation();
    if (!serverState || serverState.status !== "playing" || !serverState.turnDeadline) {
        ui.timerBar.classList.add("is-hidden");
        return;
    }

    ui.timerBar.classList.remove("is-hidden");
    const deadline = serverState.turnDeadline;
    const duration = 30000; // 30 seconds

    function tick() {
        const now = Date.now();
        const remaining = Math.max(0, deadline - now);
        const fraction = remaining / duration;
        const percent = Math.max(0, Math.min(100, fraction * 100));

        ui.timerBarFill.style.width = `${percent}%`;

        // Color transitions: green > 60%, yellow 30-60%, red < 30%
        ui.timerBarFill.classList.remove("warn", "danger");
        if (fraction <= 0.3) {
            ui.timerBarFill.classList.add("danger");
        } else if (fraction <= 0.6) {
            ui.timerBarFill.classList.add("warn");
        }

        if (remaining > 0) {
            timerAnimFrame = requestAnimationFrame(tick);
        }
    }

    timerAnimFrame = requestAnimationFrame(tick);
}

function stopTimerAnimation() {
    if (timerAnimFrame) {
        cancelAnimationFrame(timerAnimFrame);
        timerAnimFrame = null;
    }
}

// ── Board ──
const playerCells = [];
const oppCells = [];
const layoutButtons = [];

const PRESET_LAYOUTS = [
    [1, 13, 25, 6, 19, 7, 22, 3, 14, 10, 18, 2, 9, 21, 4, 12, 5, 16, 24, 8, 23, 11, 15, 20, 17],
    [8, 17, 2, 24, 11, 20, 5, 13, 1, 22, 6, 19, 14, 9, 25, 3, 16, 7, 21, 12, 23, 10, 4, 18, 15],
    [12, 4, 21, 7, 18, 25, 9, 1, 15, 6, 10, 23, 2, 19, 14, 5, 17, 8, 24, 13, 16, 3, 22, 11, 20],
    [14, 6, 20, 2, 9, 11, 24, 5, 18, 1, 22, 8, 13, 25, 3, 7, 16, 10, 21, 4, 19, 12, 23, 15, 17],
    [5, 15, 9, 23, 2, 17, 1, 20, 12, 8, 24, 7, 18, 3, 14, 11, 21, 6, 25, 4, 10, 22, 16, 13, 19],
];

function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.remove("is-hidden");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => ui.toast.classList.add("is-hidden"), 2600);
}

function setConnectionStatus(online) {
    ui.connStatus.textContent = online ? "Online" : "Offline";
    ui.connStatus.style.borderColor = online ? "rgba(30, 227, 207, 0.5)" : "rgba(255, 95, 109, 0.5)";
}

const tttCells = [];

function render() {
    if (!serverState || !roomId) {
        ui.lobby.classList.remove("is-hidden");
        ui.game.classList.add("is-hidden");
        ui.gameSelector.classList.add("is-hidden");
        ui.soloDifficultyWrap.classList.add("is-hidden");
        ui.actionArea.classList.add("is-hidden");
        ui.disconnectBtn.classList.add("is-hidden");
        ui.forfeitBtn.classList.add("is-hidden");
        ui.forfeitOverlay.classList.add("is-hidden");
        ui.infoBtn.classList.add("is-hidden");
        ui.roomCode.textContent = "----";
        ui.youName.textContent = "-";
        ui.readyChip.classList.add("is-hidden");
        
        ui.chatToggleBtn.classList.add("is-hidden");
        ui.chatDrawer.classList.remove("open");
        isChatOpen = false;
        unreadChatCount = 0;
        ui.chatBadge.classList.add("is-hidden");
        ui.chatBadge.textContent = "0";
        lastRenderedChatCount = 0;
        ui.chatMessages.innerHTML = "";
        ui.emojiPicker.classList.add("is-hidden");
        ui.stickerPicker.classList.add("is-hidden");
        
        stopTimerAnimation();
        return;
    }

    ui.lobby.classList.add("is-hidden");
    ui.game.classList.remove("is-hidden");
    
    if (isChatOpen) {
        ui.chatToggleBtn.classList.add("is-hidden");
    } else {
        ui.chatToggleBtn.classList.remove("is-hidden");
    }
    if (ui.rpsPanel) ui.rpsPanel.classList.add("is-hidden");
    ui.actionArea.classList.remove("is-hidden");
    ui.disconnectBtn.classList.remove("is-hidden");
    ui.infoBtn.classList.remove("is-hidden");
    
    if (serverState.status === "playing") {
        ui.forfeitBtn.classList.remove("is-hidden");
    } else {
        ui.forfeitBtn.classList.add("is-hidden");
        ui.forfeitOverlay.classList.add("is-hidden");
    }
    
    ui.roomCode.textContent = roomId;
 
    const you = playerSlot;
    const opp = you === "A" ? "B" : "A";
    const youInfo = serverState.players?.[you] || {};
    const oppInfo = serverState.players?.[opp] || {};

    ui.youName.textContent = youInfo.name || playerSlot || "-";
    ui.readyChip.textContent = youInfo.ready ? "Ready" : "Not ready";
    
    if (serverState.status === "setup") {
        ui.readyChip.classList.remove("is-hidden");
    } else {
        ui.readyChip.classList.add("is-hidden");
    }

    // Opponent info
    const currentOppSocketId = oppInfo.socketId || null;
    if (lastOppSocketId !== null && currentOppSocketId !== null && lastOppSocketId !== currentOppSocketId) {
        console.log("WebRTC: Opponent socket ID changed. Re-initializing connection...");
        stopVoiceChat();
    }
    lastOppSocketId = currentOppSocketId;

    if (oppInfo.connected) {
        if (!wasOppConnected && lastStatus !== null) {
            sfxOpponentJoined();
        }
        ui.oppName.textContent = oppInfo.name || `Player ${opp}`;
        if (serverState.status === "setup") {
            ui.oppStatus.textContent = oppInfo.ready ? "✓ Ready" : "Setting up...";
            ui.oppStatus.className = `opp-status ${oppInfo.ready ? "ready" : "not-ready"}`;
        } else if (serverState.status === "playing") {
            ui.oppStatus.textContent = serverState.turn === opp ? "Their turn" : "Waiting";
            ui.oppStatus.className = "opp-status";
        } else {
            ui.oppStatus.textContent = "";
            ui.oppStatus.className = "opp-status";
        }
    } else {
        if (wasOppConnected && lastStatus !== null) {
            sfxOpponentDisconnect();
            stopVoiceChat();
        }
        ui.oppName.textContent = oppInfo.name ? `${oppInfo.name} (offline)` : "Waiting for opponent...";
        ui.oppStatus.textContent = oppInfo.connected === false && oppInfo.name ? "⚠ Disconnected" : "";
        ui.oppStatus.className = "opp-status disconnected";
    }
    wasOppConnected = !!oppInfo.connected;

    const isYourTurn = serverState.status === "playing" && serverState.turn === you;

    // Detect Turn Changes and Match Start
    if (serverState.status === "playing") {
        if (lastStatus === "setup") {
            sfxMatchStart();
        } else if (lastTurn !== serverState.turn) {
            if (serverState.turn === you) {
                sfxYourTurn();
            } else if (serverState.turn === opp) {
                sfxOpponentTurn();
            }
        }
    }
    lastTurn = serverState.turn;
    lastStatus = serverState.status;

    // Toggle panel visibility and Selector active states
    const isPlaying = serverState.status === "playing";
    ui.gameSelector.classList.remove("is-hidden"); // always visible once in a room
    ui.soloDifficultyWrap.classList.toggle("is-hidden", roomId !== "SOLO_ROOM");
    document.querySelectorAll(".btn-difficulty").forEach(btn => {
        btn.disabled = isPlaying;
    });
    ui.btnBingoTab.classList.toggle("active", serverState.gameType === "bingo");
    ui.btnTTTTab.classList.toggle("active", serverState.gameType === "tictactoe");
    ui.btnChopsticksTab.classList.toggle("active", serverState.gameType === "chopsticks");
    ui.btnDotBoxTab.classList.toggle("active", serverState.gameType === "dotBox");
    ui.btnRpsTab.classList.toggle("active", serverState.gameType === "rps");
    ui.btnConnect5Tab.classList.toggle("active", serverState.gameType === "connect5");
    // Lock non-active tabs while a game is in progress
    ui.btnBingoTab.classList.toggle("tab-locked", isPlaying && serverState.gameType !== "bingo");
    ui.btnTTTTab.classList.toggle("tab-locked", isPlaying && serverState.gameType !== "tictactoe");
    ui.btnChopsticksTab.classList.toggle("tab-locked", isPlaying && serverState.gameType !== "chopsticks");
    ui.btnDotBoxTab.classList.toggle("tab-locked", isPlaying && serverState.gameType !== "dotBox");
    ui.btnRpsTab.classList.toggle("tab-locked", isPlaying && serverState.gameType !== "rps");
    ui.btnConnect5Tab.classList.toggle("tab-locked", isPlaying && serverState.gameType !== "connect5");
    // Centralized visibility reset for all game panels and boards
    ui.bingoPlayerPanel.classList.add("is-hidden");
    ui.oppBoardWrap.classList.add("is-hidden");
    ui.tttPanel.classList.add("is-hidden");
    ui.chopsticksPanel.classList.add("is-hidden");
    ui.rpsPanel.classList.add("is-hidden");
    ui.connect5Panel.classList.add("is-hidden");
    if (ui.dotBoxBoard) ui.dotBoxBoard.classList.add("is-hidden");
    if (ui.tttBoard) ui.tttBoard.classList.add("is-hidden");

    if (serverState.gameType === "bingo") {
        ui.bingoPlayerPanel.classList.remove("is-hidden");
        ui.nextNumber.closest(".next-number-badge")?.classList.remove("is-hidden");

        // Called numbers and sounds
        const calledSet = new Set(serverState.calledNumbers || []);
        const currentCalledCount = calledSet.size;
        const currentLines = serverState.lines?.[you] || 0;
        const oppCurrentLines = serverState.lines?.[opp] || 0;

        if (currentCalledCount > lastCalledCount && serverState.status === "playing") {
            sfxNumberMarked();
        }
        lastCalledCount = currentCalledCount;

        // Detect Player Line completion
        if (currentLines > lastLineCount && serverState.status === "playing") {
            if (currentLines === 4) sfxMatchPoint();
            else if (currentLines < 5) sfxLineComplete();
        }
        lastLineCount = currentLines;

        // Detect Opponent Line completion
        if (oppCurrentLines > lastOppLineCount && serverState.status === "playing") {
            if (oppCurrentLines === 4) sfxOppMatchPoint();
            else if (oppCurrentLines < 5) sfxOppLineComplete();
        }
        lastOppLineCount = oppCurrentLines;

        // Board rendering
        if (serverState.status === "setup" && !youInfo.ready) {
            renderPlayerBoard(localState.board, calledSet);
        } else {
            renderPlayerBoard(serverState.boards?.[you], calledSet);
        }

        // Opponent Board rendering
        if (serverState.status === "playing" || serverState.status === "finished") {
            ui.oppBoardWrap.classList.remove("is-hidden");
            renderBoard(oppCells, serverState.boards?.[opp], calledSet, true, true);
        } else {
            ui.oppBoardWrap.classList.add("is-hidden");
        }

        ui.youLines.textContent = String(serverState.lines?.[you] || 0);
        ui.oppLines.textContent = String(serverState.lines?.[opp] || 0);

        // BINGO letters (You)
        const letters = ["B", "I", "N", "G", "O"];
        const lines = serverState.lines?.[you] || 0;
        letters.forEach((l, i) => {
            const el = document.getElementById(`letter-${l}`);
            if (el) el.classList.toggle("cancelled", i < lines);
        });

        // BINGO letters (Opponent)
        const oppLinesLetters = serverState.lines?.[opp] || 0;
        letters.forEach((l, i) => {
            const el = document.getElementById(`opp-letter-${l}`);
            if (el) el.classList.toggle("cancelled", i < oppLinesLetters);
        });

        renderLayoutButtons(opp);

        // Layout row visibility (hide during play)
        if (ui.layoutRow) {
            ui.layoutRow.classList.toggle("is-hidden", serverState.status !== "setup");
        }

        // Turn indicator and timer
        if (serverState.status === "setup") {
            ui.turnIndicator.textContent = "Place numbers and tap Ready";
            ui.timerBar.classList.add("is-hidden");
            stopTimerAnimation();
        } else if (serverState.status === "playing") {
            ui.turnIndicator.textContent = isYourTurn ? "⚡ Your turn to call!" : "⏳ Opponent is calling...";
            startTimerAnimation();
        } else if (serverState.status === "finished") {
            ui.turnIndicator.textContent = "Game finished";
            ui.timerBar.classList.add("is-hidden");
            stopTimerAnimation();
        }

        // Ready button
        ui.readyBtn.disabled = localState.next <= 25 || youInfo.ready;
        ui.readyBtn.classList.toggle("is-hidden", serverState.status !== "setup");
        localState.ready = !!youInfo.ready;
        ui.nextNumber.textContent = youInfo.ready ? "done" : String(localState.next);

    } else if (serverState.gameType === "tictactoe") {
        // Tic Tac Toe Mode
        ui.bingoPlayerPanel.classList.add("is-hidden");
        ui.oppBoardWrap.classList.add("is-hidden");
        ui.chopsticksPanel.classList.add("is-hidden");
        if (ui.dotBoxBoard) ui.dotBoxBoard.classList.add("is-hidden");
        ui.tttBoard.classList.remove("is-hidden"); // Ensure tttBoard is visible
        ui.nextNumber.closest(".next-number-badge")?.classList.add("is-hidden");
        if (ui.layoutRow) ui.layoutRow.classList.add("is-hidden");
        ui.tttPanel.classList.remove("is-hidden");

        // Moves and sounds
        const currentMoves = (serverState.tttBoard || []).filter(c => c !== null).length;
        if (currentMoves > lastTTTMoveCount && serverState.status === "playing") {
            sfxNumberMarked();
        }
        lastTTTMoveCount = currentMoves;

        // Render Tic Tac Toe Board
        const boardState = serverState.tttBoard || Array(9).fill(null);
        tttCells.forEach((cell, i) => {
            const val = boardState[i];
            cell.textContent = val ? (val === "A" ? "X" : "O") : "";
            
            // Clean classes
            cell.classList.remove("symbol-x", "symbol-o");
            if (val === "A") cell.classList.add("symbol-x", "ttt-symbol");
            else if (val === "B") cell.classList.add("symbol-o", "ttt-symbol");
            else cell.classList.remove("ttt-symbol");
            
            // Interactive state
            const cellLocked = serverState.status !== "playing" || !isYourTurn || val !== null;
            cell.classList.toggle("locked", cellLocked);
        });

        // Scores and Names
        ui.tttScoreX.textContent = serverState.score?.A || 0;
        ui.tttScoreO.textContent = serverState.score?.B || 0;
        ui.tttPlayerXName.textContent = serverState.players?.A?.name || "Player A";
        ui.tttPlayerOName.textContent = serverState.players?.B?.name || "Player B";
        if (ui.tttPlayerXLabel) ui.tttPlayerXLabel.textContent = "Player X (Starts)";
        if (ui.tttPlayerOLabel) ui.tttPlayerOLabel.textContent = "Player O";
        
        // Highlight active player symbol
        const playerXBadge = ui.tttPlayerXBadge;
        const playerOBadge = ui.tttPlayerOBadge;
        playerXBadge.style.borderColor = serverState.turn === "A" && serverState.status === "playing" ? "var(--blue)" : "";
        playerOBadge.style.borderColor = serverState.turn === "B" && serverState.status === "playing" ? "var(--red)" : "";

        // Turn indicator
        if (serverState.status === "setup") {
            ui.tttTurnIndicator.textContent = "Tap Ready to start duel";
            ui.timerBar.classList.add("is-hidden");
            stopTimerAnimation();
        } else if (serverState.status === "playing") {
            ui.tttTurnIndicator.textContent = isYourTurn ? "⚡ Your turn to place!" : "⏳ Opponent is thinking...";
            startTimerAnimation();
        } else if (serverState.status === "finished") {
            ui.tttTurnIndicator.textContent = "Game finished";
            ui.timerBar.classList.add("is-hidden");
            stopTimerAnimation();
        }

        // Ready button
        ui.readyBtn.disabled = !!youInfo.ready;
        ui.readyBtn.classList.toggle("is-hidden", serverState.status !== "setup");
        localState.ready = !!youInfo.ready;
        ui.nextNumber.textContent = youInfo.ready ? "done" : "play";
    } else if (serverState.gameType === "chopsticks") {
        // Reset dotbox state for animation diffing
        if (serverState.gameType !== "dotBox") lastDotBoxState = null;
        ui.bingoPlayerPanel.classList.add("is-hidden");
        ui.oppBoardWrap.classList.add("is-hidden");
        ui.tttPanel.classList.add("is-hidden");
        if (ui.dotBoxBoard) ui.dotBoxBoard.classList.add("is-hidden");
        ui.nextNumber.closest(".next-number-badge")?.classList.add("is-hidden");
        if (ui.layoutRow) ui.layoutRow.classList.add("is-hidden");
        ui.chopsticksPanel.classList.remove("is-hidden");

        renderChopsticks();
    } else if (serverState.gameType === "dotBox") {
        // DotBox Mode
        ui.bingoPlayerPanel.classList.add("is-hidden");
        ui.oppBoardWrap.classList.add("is-hidden");
        ui.chopsticksPanel.classList.add("is-hidden");
        ui.nextNumber.closest(".next-number-badge")?.classList.add("is-hidden");
        if (ui.layoutRow) ui.layoutRow.classList.add("is-hidden");
        ui.tttPanel.classList.remove("is-hidden"); // We reuse tttPanel for dotBox!
        
        // Hide tttBoard specifically since we're in dotBox
        ui.tttBoard.classList.add("is-hidden");
        
        // SHOW dotBoxBoard explicitly
        if (ui.dotBoxBoard) ui.dotBoxBoard.classList.remove("is-hidden");
        if (ui.bingoBoard) ui.bingoBoard.classList.add("is-hidden");
        if (ui.chopsticksBoard) ui.chopsticksBoard.classList.add("is-hidden");
        
        // Disable ready button state tracking like tictactoe
        ui.readyBtn.disabled = !!youInfo.ready;
        ui.readyBtn.classList.toggle("is-hidden", serverState.status !== "setup");
        localState.ready = !!youInfo.ready;
        ui.nextNumber.textContent = youInfo.ready ? "done" : "play";
        
        // Turn indicator logic for dotBox is in renderDotBoxBoard (via dotBox.js)
        if (serverState.status === "setup") {
            ui.tttTurnIndicator.textContent = "Tap Ready to start duel";
            ui.timerBar.classList.add("is-hidden");
            stopTimerAnimation();
        } else {
            ui.timerBar.classList.remove("is-hidden");
            if (serverState.status === "playing") startTimerAnimation();
            else stopTimerAnimation();
        }

        renderDotBoxBoard();
    } else if (serverState.gameType === "rps") {
        ui.bingoPlayerPanel.classList.add("is-hidden");
        ui.oppBoardWrap.classList.add("is-hidden");
        ui.chopsticksPanel.classList.add("is-hidden");
        ui.tttPanel.classList.add("is-hidden");
        if (ui.dotBoxBoard) ui.dotBoxBoard.classList.add("is-hidden");
        ui.nextNumber.closest(".next-number-badge")?.classList.add("is-hidden");
        if (ui.layoutRow) ui.layoutRow.classList.add("is-hidden");

        ui.rpsPanel.classList.remove("is-hidden");

        // Ready button
        ui.readyBtn.disabled = !!youInfo.ready;
        ui.readyBtn.classList.toggle("is-hidden", serverState.status !== "setup");
        localState.ready = !!youInfo.ready;
        ui.nextNumber.textContent = youInfo.ready ? "done" : "play";

        if (serverState.status === "setup") {
            ui.rpsTurnIndicator.textContent = "Tap Ready to start duel";
            ui.timerBar.classList.add("is-hidden");
            stopTimerAnimation();
        } else {
            ui.timerBar.classList.add("is-hidden");
            stopTimerAnimation();
        }

        renderRPS();
    } else if (serverState.gameType === "connect5") {
        ui.bingoPlayerPanel.classList.add("is-hidden");
        ui.tttPanel.classList.add("is-hidden");
        ui.chopsticksPanel.classList.add("is-hidden");
        if (ui.dotBoxBoard) ui.dotBoxBoard.classList.add("is-hidden");
        ui.rpsPanel.classList.add("is-hidden");
        ui.connect5Panel.classList.remove("is-hidden");
        if (ui.layoutRow) ui.layoutRow.classList.add("is-hidden");
        ui.oppBoardWrap.classList.add("is-hidden");
        
        ui.nextNumber.closest(".next-number-badge")?.classList.add("is-hidden");
        
        ui.readyBtn.disabled = !!youInfo.ready;
        ui.readyBtn.classList.toggle("is-hidden", serverState.status !== "setup");
        localState.ready = !!youInfo.ready;
        ui.nextNumber.textContent = youInfo.ready ? "done" : "play";
        
        if (serverState.status === "setup") {
            ui.c5TurnIndicator.textContent = "Tap Ready to start duel";
            ui.timerBar.classList.add("is-hidden");
            stopTimerAnimation();
        } else if (serverState.status === "playing") {
            ui.c5TurnIndicator.textContent = isYourTurn ? "⚡ Your turn to drop!" : "⏳ Opponent is deciding...";
            startTimerAnimation();
        } else {
            ui.timerBar.classList.add("is-hidden");
            stopTimerAnimation();
        }

        renderConnect5();
    }

    // Win screen
    if (serverState.status === "finished" && !hasShownWinScreen) {
        hasShownWinScreen = true;
        const winner = serverState.winner;
        const gameType = serverState.gameType;

        const winSubMap = {
            bingo: "You completed 5 lines first!",
            tictactoe: "You got 3 in a row!",
            chopsticks: "You eliminated both opponent hands!",
            dotBox: "You claimed the most boxes!",
            connect5: "You scored 5 combo points first!",
        };
        const loseSubMap = {
            bingo: "Opponent completed 5 lines first",
            tictactoe: "Opponent got 3 in a row",
            chopsticks: "Both your hands were eliminated",
            dotBox: "Opponent claimed more boxes",
            connect5: "Opponent scored 5 combo points first",
        };
        const tieSubMap = {
            bingo: "Both hit 5 lines at the same time",
            tictactoe: "No spaces left on the board",
            chopsticks: "It's a draw",
            dotBox: "It's a tie",
            connect5: "The board was filled!",
        };

        if (winner === "TIE") {
            ui.winnerTitle.textContent = "It's a tie!";
            ui.winnerSub.textContent = tieSubMap[gameType] || "Good game!";
            if (window.GameEffects) window.GameEffects.tie();
            sfxTie();
        } else if (winner === you) {
            ui.winnerTitle.textContent = "🎉 You won! 🎉";
            ui.winnerSub.textContent = winSubMap[gameType] || "You win!";
            if (window.GameEffects) window.GameEffects.win();
            sfxVictory();
        } else {
            ui.winnerTitle.textContent = "You lost";
            ui.winnerSub.textContent = loseSubMap[gameType] || "Better luck next time";
            if (window.GameEffects) window.GameEffects.lose();
            sfxDefeat();
        }
        ui.winnerOverlay.classList.remove("is-hidden");
    } else if (serverState.status !== "finished") {
        hasShownWinScreen = false;
        ui.winnerOverlay.classList.add("is-hidden");
        if (window.GameEffects) window.GameEffects.clear();
    }


    checkAndConnectVoice();
}

// ── Socket ──
function setupSocket() {
    window.soloCallbacks = window.soloCallbacks || {};

    if (typeof io === "undefined") {
        // Create dummy socket so offline mode works without running server
        socket = {
            on(event, cb) {
                window.soloCallbacks[event] = cb;
            },
            emit(event, data) {
                if (roomId === "SOLO_ROOM" && window.soloEngine) {
                    window.soloEngine.handleEvent(event, data);
                }
            }
        };
        window.socket = socket;
        return;
    }
    
    socket = io();

    // Intercept emit for solo room redirect
    const originalEmit = socket.emit;
    socket.emit = function(event, data) {
        if (roomId === "SOLO_ROOM" && window.soloEngine) {
            window.soloEngine.handleEvent(event, data);
        } else {
            originalEmit.apply(this, arguments);
        }
    };

    window.socket = socket;

    socket.on("connect", () => {
        setConnectionStatus(true);
        const savedRoomId = localStorage.getItem("roomId");
        if (savedRoomId && !roomId) {
            socket.emit("rejoinRoom", { roomId: savedRoomId, sessionId });
        }
    });

    socket.on("disconnect", () => setConnectionStatus(false));

    socket.on("roomCreated", (payload) => {
        roomId = payload.roomId;
        playerSlot = payload.playerSlot;
        localStorage.setItem("roomId", roomId);
        resetLocalBoard();
        sfxRoomCreated();
        voiceDenied = false;
        render();
    });

    socket.on("roomJoined", (payload) => {
        roomId = payload.roomId;
        playerSlot = payload.playerSlot;
        localStorage.setItem("roomId", roomId);
        resetLocalBoard();
        sfxRoomCreated();
        voiceDenied = false;
        render();
    });

    const onState = (state) => {
        serverState = state;
        if (lastRound !== state.round) {
            resetLocalBoard();
            lastRound = state.round;
            lastLineCount = 0;
            lastCalledCount = 0;
            lastOppLineCount = 0;
            lastTTTMoveCount = 0;
            lastChopsticksState = null;
            hasShownWinScreen = false;
        }
        if (roomId !== state.roomId) {
            roomId = state.roomId;
        }
        syncChatHistory(state.chatHistory);
        render();
    };
    socket.on("state", onState);
    window.soloCallbacks["state"] = onState;

    const onError = (message) => {
        showToast(message);
        sfxInvalidAction();
    };
    socket.on("errorMessage", onError);
    window.soloCallbacks["errorMessage"] = onError;
    
    const onBonus = (payload) => {
        const count = payload.count || 1;
        showToast(`BONUS TURN! (+${count})`);
    };
    socket.on("bonusTurn", onBonus);
    window.soloCallbacks["bonusTurn"] = onBonus;

    socket.on("webrtc-offer", async (offer) => {
        console.log("WebRTC socket: Received offer from opponent");
        if (!peerConnection) {
            console.log("WebRTC socket: PeerConnection null, initializing voice chat first...");
            await initVoiceChat();
        }
        if (peerConnection) {
            try {
                console.log("WebRTC socket: Setting remote description (offer)...");
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                console.log("WebRTC socket: Creating answer...");
                const answer = await peerConnection.createAnswer();
                console.log("WebRTC socket: Setting local description (answer)...");
                await peerConnection.setLocalDescription(answer);
                console.log("WebRTC socket: Emitting answer...");
                socket.emit("webrtc-answer", answer);
                
                console.log(`WebRTC socket: Processing ${pendingIceCandidates.length} buffered ICE candidates...`);
                pendingIceCandidates.forEach(c => peerConnection.addIceCandidate(new RTCIceCandidate(c)));
                pendingIceCandidates = [];
            } catch (e) { console.error("WebRTC offer error", e); }
        }
    });

    socket.on("webrtc-answer", async (answer) => {
        console.log("WebRTC socket: Received answer from opponent");
        if (peerConnection) {
            try {
                console.log("WebRTC socket: Setting remote description (answer)...");
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                console.log(`WebRTC socket: Processing ${pendingIceCandidates.length} buffered ICE candidates...`);
                pendingIceCandidates.forEach(c => peerConnection.addIceCandidate(new RTCIceCandidate(c)));
                pendingIceCandidates = [];
            } catch (e) { console.error("WebRTC answer error", e); }
        } else {
            console.warn("WebRTC socket: Received answer but peerConnection is null!");
        }
    });

    socket.on("webrtc-ice-candidate", async (candidate) => {
        console.log("WebRTC socket: Received ICE candidate from opponent");
        if (peerConnection && peerConnection.remoteDescription) {
            try {
                console.log("WebRTC socket: Adding ICE candidate to peer connection...");
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) { console.error("WebRTC ice error", e); }
        } else {
            console.log("WebRTC socket: PeerConnection or remoteDescription not ready. Buffering ICE candidate.");
            pendingIceCandidates.push(candidate);
        }
    });

    socket.on("opponentLeft", () => {
        roomId = null;
        playerSlot = null;
        serverState = null;
        localStorage.removeItem("roomId");
        localStorage.removeItem("sessionId");

        sessionId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem("sessionId", sessionId);

        resetLocalBoard();
        stopTimerAnimation();
        stopVoiceChat();
        ui.roomInput.value = "";
        render();
        showToast("Opponent left");
    });

    socket.on("stickerReceived", ({ sender, senderName, emoji }) => {
        const isSelf = sender === playerSlot;
        if (window.GameEffects && window.GameEffects.spawnSticker) {
            window.GameEffects.spawnSticker(emoji, senderName, isSelf);
        }
        sfxSticker();
    });
}

// ── Event Listeners ──
ui.createRoomBtn.addEventListener("click", () => {
    if (!socket) {
        showToast("Reconnecting...");
        setTimeout(() => window.location.reload(), 1000);
        return;
    }
    const name = ui.nameInput.value.trim();
    if (!name) {
        showToast("Please enter a display name.");
        return;
    }
    localStorage.setItem("displayName", name);
    socket.emit("createRoom", { name, sessionId });
});

ui.playSoloBtn.addEventListener("click", () => {
    const name = ui.nameInput.value.trim() || "You";
    localStorage.setItem("displayName", name);

    if (!socket) {
        setupSocket();
    }

    roomId = "SOLO_ROOM";
    playerSlot = "A";
    localStorage.setItem("roomId", roomId);

    if (window.soloEngine) {
        window.soloEngine.init(name, localState.botDifficulty || "medium");
    }
});

ui.joinRoomBtn.addEventListener("click", () => {
    if (!socket) {
        showToast("Reconnecting...");
        setTimeout(() => window.location.reload(), 1000);
        return;
    }
    const name = ui.nameInput.value.trim();
    if (!name) {
        showToast("Please enter a display name.");
        return;
    }
    const code = ui.roomInput.value.trim().toUpperCase();
    if (!code) {
        showToast("Enter a room code.");
        return;
    }
    localStorage.setItem("displayName", name);
    socket.emit("joinRoom", { roomId: code, name, sessionId });
});

ui.clearLayoutBtn.addEventListener("click", () => {
    if (!roomId || !playerSlot) {
        showToast("Create or join a room first.");
        return;
    }
    if (serverState && serverState.status !== "setup") return;
    resetLocalBoard();
    renderPlayerBoard(localState.board, new Set(serverState?.calledNumbers || []));
    renderLayoutButtons(playerSlot === "A" ? "B" : "A");
});

ui.readyBtn.addEventListener("click", () => {
    if (!roomId || !socket) return;
    sfxReadyPressed();
    if (serverState && serverState.gameType !== "bingo") {
        socket.emit("setReady", { ready: true });
        return;
    }
    if (localState.next <= 25) {
        showToast("Place all 25 numbers first.");
        return;
    }
    socket.emit("setBoard", { board: localState.board, ready: true, layoutId: localState.layoutId });
});

ui.playAgainBtn.addEventListener("click", () => {
    if (socket && roomId) {
        socket.emit("resetGame");
    }
});

ui.saveLayoutBtn.addEventListener("click", () => {
    const name = prompt("Enter a name for this custom layout:");
    if (!name) return;
    const customLayouts = JSON.parse(localStorage.getItem("customLayouts") || "[]");
    customLayouts.push({ name, board: localState.board.slice() });
    localStorage.setItem("customLayouts", JSON.stringify(customLayouts));
    showToast("Layout saved!");
    buildLayoutButtons();
});

ui.forfeitBtn.addEventListener("click", () => {
    sfxButtonClick();
    ui.forfeitOverlay.classList.remove("is-hidden");
});

ui.cancelForfeitBtn.addEventListener("click", () => {
    sfxButtonClick();
    ui.forfeitOverlay.classList.add("is-hidden");
});

ui.confirmForfeitBtn.addEventListener("click", () => {
    sfxButtonClick();
    ui.forfeitOverlay.classList.add("is-hidden");
    if (socket && roomId) {
        socket.emit("forfeitGame");
    }
});

ui.disconnectBtn.addEventListener("click", () => {
    sfxButtonClick();
    if (socket && roomId) {
        socket.emit("leaveRoom");
    }
    roomId = null;
    playerSlot = null;
    serverState = null;
    localStorage.removeItem("roomId");
    localStorage.removeItem("sessionId");

    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("sessionId", sessionId);

    resetLocalBoard();
    stopTimerAnimation();
    stopVoiceChat();
    ui.roomInput.value = "";
    ui.winnerOverlay.classList.add("is-hidden");
    ui.forfeitOverlay.classList.add("is-hidden");
    setupSocket(); // Re-establish real socket.io connection if in solo mode
    render();
    showToast("Left the room.");
});

const GAME_DISPLAY_NAMES = {
    bingo: "Bingo",
    tictactoe: "Tic Tac Toe",
    chopsticks: "Chopsticks",
    dotBox: "Boxes",
    rps: "RPS",
    connect5: "Connect 4"
};

function handleTabClick(targetGameType) {
    if (!socket || !roomId) return;
    if (serverState?.status === "playing") {
        const currentName = GAME_DISPLAY_NAMES[serverState.gameType] || serverState.gameType;
        const targetName = GAME_DISPLAY_NAMES[targetGameType] || targetGameType;
        sfxInvalidAction();
        showToast(`⚠ Complete the ${currentName} game first to switch to ${targetName}`);
        return;
    }
    sfxButtonClick();
    socket.emit("setGameType", { gameType: targetGameType });
}

ui.btnBingoTab.addEventListener("click", () => handleTabClick("bingo"));
ui.btnTTTTab.addEventListener("click", () => handleTabClick("tictactoe"));
ui.btnChopsticksTab.addEventListener("click", () => handleTabClick("chopsticks"));
ui.btnDotBoxTab.addEventListener("click", () => handleTabClick("dotBox"));
ui.btnRpsTab.addEventListener("click", () => handleTabClick("rps"));
ui.btnConnect5Tab.addEventListener("click", () => handleTabClick("connect5"));

ui.chopPlayLeftHand.addEventListener("click", () => handlePlayerHandClick("left"));
ui.chopPlayRightHand.addEventListener("click", () => handlePlayerHandClick("right"));
ui.chopOppLeftHand.addEventListener("click", () => handleOpponentHandClick("left"));
ui.chopOppRightHand.addEventListener("click", () => handleOpponentHandClick("right"));

ui.chopOppLeftHand.addEventListener("mouseenter", () => handleOpponentHandHover("left", true));
ui.chopOppLeftHand.addEventListener("mouseleave", () => handleOpponentHandHover("left", false));
ui.chopOppRightHand.addEventListener("mouseenter", () => handleOpponentHandHover("right", true));
ui.chopOppRightHand.addEventListener("mouseleave", () => handleOpponentHandHover("right", false));

ui.btnChopCancelAction.addEventListener("click", () => {
    sfxButtonClick();
    localState.selectedChopHand = null;
    renderChopsticks();
});

ui.btnChopRedistribute.addEventListener("click", () => {
    sfxButtonClick();
    if (!serverState || serverState.gameType !== "chopsticks" || serverState.status !== "playing") return;
    const you = playerSlot;
    const youHands = serverState.chopsticks[you] || { left: 1, right: 1 };
    
    const options = getRedistributeOptions(youHands.left, youHands.right);
    ui.chopDistributionOptions.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "dist-option-btn";
        btn.innerHTML = `${getHandDisplay(opt.left)} | ${getHandDisplay(opt.right)}`;
        btn.addEventListener("click", () => {
            sfxChopRedistribute();
            socket.emit("makeChopsticksRedistribute", { left: opt.left, right: opt.right });
            ui.chopRedistributeOverlay.classList.add("is-hidden");
        });
        ui.chopDistributionOptions.appendChild(btn);
    });
    
    ui.chopRedistributeOverlay.classList.remove("is-hidden");
});

ui.btnChopCloseRedistribute.addEventListener("click", () => {
    sfxButtonClick();
    ui.chopRedistributeOverlay.classList.add("is-hidden");
});

function showRules() {
    const gameType = serverState?.gameType || "bingo";
    const gt = gameType;
    if (gt === "tictactoe") {
        ui.rulesTitle.textContent = "Tic Tac Toe Rules";
        ui.rulesBody.innerHTML = `
            <h3>Objective</h3>
            <p>Place 3 of your symbols in a row (horizontal, vertical, or diagonal) on the 3x3 board.</p>
            
            <h3>Symbols</h3>
            <p><strong>Player A</strong> plays as <span style="color: var(--blue); font-weight: bold;">X (Cyan)</span>.<br><strong>Player B</strong> plays as <span style="color: var(--red); font-weight: bold;">O (Red)</span>.</p>
            
            <h3>Gameplay</h3>
            <ul>
                <li>Players take turns clicking empty grid squares to place their symbol.</li>
                <li>Each turn has a <strong>30-second time limit</strong>. If you run out of time, your turn is automatically skipped!</li>
            </ul>

            <h3>Match Play & Rematches</h3>
            <ul>
                <li>For the first game (score 0-0), both players must click <strong>READY</strong> to begin.</li>
                <li>For all subsequent rounds, clicking <strong>Play Again</strong> will instantly clear the board and start the next match, automatically alternating who goes first.</li>
            </ul>
        `;
    } else if (gt === "chopsticks") {
        ui.rulesTitle.textContent = "Chopsticks Duel Rules";
        ui.rulesBody.innerHTML = `
            <h3>Objective</h3>
            <p>Eliminate both of your opponent's hands by making their finger counts exactly <strong>0</strong>.</p>
            
            <h3>Setup Phase</h3>
            <ul>
                <li>Both players begin with <strong>1 finger</strong> on each hand: <code>● | ●</code></li>
                <li>For the first game (score 0-0), both players must click <strong>READY</strong> to begin.</li>
                <li>For subsequent rounds, clicking <strong>Play Again</strong> starts the match instantly, alternating who goes first.</li>
            </ul>
            
            <h3>Gameplay</h3>
            <p>On your turn, you must perform exactly <strong>one</strong> of the following actions:</p>
            <ul>
                <li><strong>Attack:</strong> Click one of your active hands, then click one of your opponent's active hands. The target hand's value increases by the attacking hand's value. <strong>Values modulo 5 apply:</strong> if a hand reaches 5 or more fingers, it is reduced modulo 5. A hand with 0 fingers is <strong>dead (☠)</strong>.</li>
                <li><strong>Redistribute:</strong> Click <strong>Redistribute</strong> to transfer fingers between your own two hands. The total sum of fingers must remain the same, and both hands must end up with between 0 and 4 fingers.</li>
            </ul>
            
            <h3>Winning</h3>
            <p>The first player to reduce both of the opponent's hands to 0 fingers wins the duel!</p>
        `;
    } else if (gt === "dotBox") {
        ui.rulesTitle.textContent = "Boxes Duel";
        ui.rulesBody.innerHTML = `
            <h3>Objective</h3>
            <p>Claim the most boxes by completing their fourth edge!</p>
            <h3>Setup Phase</h3>
            <ul>
              <li>For the first game (score 0-0), both players must click <strong>READY</strong> to begin.</li>
              <li>For subsequent rounds, clicking <strong>Play Again</strong> starts the match instantly.</li>
            </ul>
            <h3>Gameplay</h3>
            <ul>
              <li>On your turn, click any available line between two dots to draw an edge.</li>
              <li>If your line completes a 1x1 box (the 4th side), you claim it and score +1.</li>
              <li><strong>BONUS TURN:</strong> Whenever you complete one or more boxes, you immediately get another turn!</li>
              <li>The game ends when all 81 boxes are claimed. The highest score wins!</li>
            </ul>
        `;
    } else if (gt === "rps") {
        ui.rulesTitle.textContent = "RPS Duel Rules";
        ui.rulesBody.innerHTML = `
            <h3>Objective</h3>
            <p>Win more rounds than your opponent in Best of 3, 5, or 11 matches.</p>
            <h3>Setup Phase</h3>
            <ul>
              <li>Select match format from the Match Type dropdown (Best of 3, 5, or 11) in setup mode.</li>
              <li>Click <strong>READY</strong> to begin the match.</li>
            </ul>
            <h3>Gameplay</h3>
            <ul>
              <li>On each round start, a 3-second countdown begins. Choose <strong>Rock</strong>, <strong>Paper</strong>, or <strong>Scissors</strong> before the countdown expires.</li>
              <li>If you don't choose in time, a random move will be auto-selected.</li>
              <li>Once both players lock their moves, they are revealed simultaneously.</li>
              <li><strong>Rock</strong> beats <strong>Scissors</strong>, <strong>Scissors</strong> beats <strong>Paper</strong>, <strong>Paper</strong> beats <strong>Rock</strong>. Ties result in no points.</li>
              <li>First player to reach the required score (2 wins for best of 3, 3 wins for best of 5, 6 wins for best of 11) wins the duel!</li>
            </ul>
        `;
    } else {
        ui.rulesTitle.textContent = "Bingo Duel Rules";
        ui.rulesBody.innerHTML = `
            <h3>Objective</h3>
            <p>Complete <strong>5 lines</strong> (horizontal rows, vertical columns, or diagonals) on your 5x5 board before your opponent does.</p>
            
            <h3>Setup Phase</h3>
            <ul>
                <li>Configure your board by clicking cells to place numbers <strong>1 to 25</strong> in any order.</li>
                <li>You can also click any of the <strong>Preset</strong> layouts in the bottom bar to instantly fill your board.</li>
                <li>Click <strong>READY</strong> once your board is complete. The match starts when both players are ready.</li>
            </ul>

            <h3>Gameplay</h3>
            <ul>
                <li>On your turn, click a number on your board to <strong>call</strong> it.</li>
                <li>Called numbers are highlighted in red and crossed out on <strong>both</strong> players' boards.</li>
                <li>When a row, column, or diagonal is fully called, a strike-through line is completed.</li>
                <li>Turns alternate, each with a <strong>30-second limit</strong>. Running out of time skips your turn!</li>
            </ul>

            <h3>Winning</h3>
            <p>The first player to complete 5 lines wins. If both players reach 5 lines on the same turn, it results in a <strong>Tie</strong>.            </ul>
        `;
    }
    ui.infoOverlay.classList.remove("is-hidden");
}

ui.infoBtn.addEventListener("click", () => {
    sfxButtonClick();
    showRules();
});

ui.closeRulesBtn.addEventListener("click", () => {
    sfxButtonClick();
    ui.infoOverlay.classList.add("is-hidden");
});

ui.infoOverlay.addEventListener("click", (e) => {
    if (e.target === ui.infoOverlay) {
        sfxButtonClick();
        ui.infoOverlay.classList.add("is-hidden");
    }
});

// Resume audio on interaction (browser autoplay policy)
document.addEventListener("click", () => {
    getAudioCtx();
    if (ui.remoteAudio && ui.remoteAudio.srcObject && ui.remoteAudio.paused) {
        ui.remoteAudio.play().catch(err => console.warn("Failed to play remote audio on click:", err));
    }
});

window.addEventListener("beforeunload", () => {
    // Preserve session on reload
});

window.addEventListener("DOMContentLoaded", () => {
    buildBoard(ui.playerBoard, playerCells, handleCellClick);
    buildBoard(ui.oppBoard, oppCells, null);
    buildTTTBoard(ui.tttBoard, handleTTTCellClick);
    buildLayoutButtons();
});

const savedName = localStorage.getItem("displayName");
if (savedName) {
    ui.nameInput.value = savedName;
}

// Bot Difficulty Settings
localState.botDifficulty = localStorage.getItem("botDifficulty") || "medium";

function updateDifficultyUI(diff) {
    const easyBtn = document.getElementById("btnDiffEasy");
    const medBtn = document.getElementById("btnDiffMedium");
    const hardBtn = document.getElementById("btnDiffHard");
    if (!easyBtn || !medBtn || !hardBtn) return;
    
    easyBtn.classList.toggle("active", diff === "easy");
    medBtn.classList.toggle("active", diff === "medium");
    hardBtn.classList.toggle("active", diff === "hard");
}

document.querySelectorAll(".btn-difficulty").forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (serverState && serverState.status === "playing") {
            sfxInvalidAction();
            showToast("Cannot change difficulty mid-game.");
            return;
        }
        sfxButtonClick();
        const diff = e.currentTarget.getAttribute("data-diff");
        localState.botDifficulty = diff;
        localStorage.setItem("botDifficulty", diff);
        updateDifficultyUI(diff);
        if (socket && roomId === "SOLO_ROOM") {
            socket.emit("setBotDifficulty", { difficulty: diff });
        }
    });
});

// Initialize active difficulty UI on load
updateDifficultyUI(localState.botDifficulty);

// ── WebRTC Voice Chat ──
let peerConnection = null;
let localStream = null;
let isMicMuted = false;
let isDeafened = false;
let voiceInitPromise = null;
let voiceDenied = false;
let pendingIceCandidates = [];
let lastOppSocketId = null;

const iceServers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ],
    iceCandidatePoolSize: 10
};

async function initVoiceChat() {
    if (peerConnection) return;
    if (voiceInitPromise) return voiceInitPromise;

    // Check if the protocol is secure (WebRTC getUserMedia requires HTTPS or localhost)
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
        showToast("Voice chat requires HTTPS (secure context).");
        console.warn("navigator.mediaDevices is only available in Secure Contexts (HTTPS or localhost).");
    }

    voiceInitPromise = (async () => {
        try {
            console.log("Requesting microphone stream...");
            localStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: false
            });
            
            console.log("Microphone stream retrieved successfully. Creating RTCPeerConnection...");
            peerConnection = new RTCPeerConnection(iceServers);
            
            // Apply current mute state to the new stream tracks immediately
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !isMicMuted;
            });
            
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });

            peerConnection.ontrack = (event) => {
                console.log("WebRTC: Remote audio track received", event.streams[0]);
                if (ui.remoteAudio.srcObject !== event.streams[0]) {
                    ui.remoteAudio.srcObject = event.streams[0];
                    ui.remoteAudio.muted = isDeafened;
                    ui.remoteAudio.play().then(() => {
                        console.log("WebRTC: Remote audio playing successfully.");
                    }).catch(err => {
                        console.warn("WebRTC: Autoplay prevented or failed. Waiting for user interaction.", err);
                    });
                }
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && socket) {
                    console.log("WebRTC: Local ICE candidate generated, emitting to opponent...");
                    socket.emit("webrtc-ice-candidate", event.candidate);
                } else {
                    console.log("WebRTC: Local ICE candidate gathering complete (or null event)");
                }
            };
            
            peerConnection.onicegatheringstatechange = () => {
                console.log("WebRTC: ICE Gathering State changed to:", peerConnection.iceGatheringState);
            };

            peerConnection.onconnectionstatechange = () => {
                console.log("WebRTC: Connection State changed to:", peerConnection.connectionState);
                if (peerConnection.connectionState === "connected") {
                    showToast("Voice chat connected!");
                } else if (peerConnection.connectionState === "failed") {
                    showToast("Voice connection failed (TURN server may be required on this network).");
                    console.error("WebRTC connection failed. This typically happens when one or both players are behind symmetric NATs or strict firewalls. To resolve this, configure a TURN server in the iceServers list.");
                } else if (peerConnection.connectionState === "disconnected") {
                    showToast("Voice chat disconnected.");
                }
            };

            peerConnection.onsignalingstatechange = () => {
                console.log("WebRTC: Signaling State changed to:", peerConnection.signalingState);
            };
            
            ui.audioControls.classList.remove("is-hidden");
            voiceDenied = false;
        } catch (err) {
            console.warn("Could not access microphone:", err);
            showToast("Microphone access denied or unavailable.");
            voiceDenied = true;
            stopVoiceChat();
        } finally {
            voiceInitPromise = null;
        }
    })();

    return voiceInitPromise;
}

async function createVoiceOffer() {
    if (!peerConnection) return;
    try {
        console.log("WebRTC: Creating local offer...");
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        if (socket) socket.emit("webrtc-offer", offer);
    } catch (err) {
        console.error("Error creating WebRTC offer", err);
    }
}

function stopVoiceChat() {
    console.log("WebRTC: Stopping voice chat and cleaning up connections...");
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
        localStream = null;
    }
    ui.remoteAudio.srcObject = null;
    ui.audioControls.classList.add("is-hidden");
    voiceInitPromise = null;
    pendingIceCandidates = [];
    lastOppSocketId = null;
}

async function checkAndConnectVoice() {
    if (!serverState || !roomId) return;
    if (roomId === "SOLO_ROOM") return;
    const players = serverState.players || {};
    if (players.A && players.A.connected && players.B && players.B.connected) {
        if (!peerConnection && !voiceDenied) {
            console.log(`checkAndConnectVoice: Both players connected. My slot: ${playerSlot || "unknown"}. Initializing voice connection...`);
            await initVoiceChat();
            console.log(`checkAndConnectVoice: initVoiceChat complete. My slot: ${playerSlot || "unknown"}, peerConnection:`, !!peerConnection);
            if (peerConnection && playerSlot === "A") {
                console.log("checkAndConnectVoice: I am Player A, initiating voice offer...");
                await createVoiceOffer();
            } else {
                console.log("checkAndConnectVoice: I am Player B, waiting for offer from Player A...");
            }
        }
    }
}

// ── Audio Toggle Event Listeners ──

ui.muteMicBtn.addEventListener("click", () => {
    isMicMuted = !isMicMuted;
    if (localStream) {
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !isMicMuted;
        });
    }
    ui.muteMicBtn.classList.toggle("muted", isMicMuted);
    
    if (isMicMuted) {
        ui.muteMicBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-off"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>';
    } else {
        ui.muteMicBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-on"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>';
    }
});

ui.deafenBtn.addEventListener("click", () => {
    isDeafened = !isDeafened;
    ui.remoteAudio.muted = isDeafened;
    ui.deafenBtn.classList.toggle("muted", isDeafened);
    
    if (isDeafened) {
        ui.deafenBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
    } else {
        ui.deafenBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-on"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>';
    }
});

ui.muteGameBtn.addEventListener("click", () => {
    gameSoundsMuted = !gameSoundsMuted;
    ui.muteGameBtn.classList.toggle("muted", gameSoundsMuted);
    
    if (gameSoundsMuted) {
        ui.muteGameBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
    } else {
        ui.muteGameBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-on"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
    }
});

// Chat Toggler
ui.chatToggleBtn.addEventListener("click", () => {
    isChatOpen = true;
    unreadChatCount = 0;
    ui.chatBadge.classList.add("is-hidden");
    ui.chatBadge.textContent = "0";
    ui.chatDrawer.classList.add("open");
    ui.chatToggleBtn.classList.add("is-hidden");
    
    setTimeout(() => {
        ui.chatMessages.scrollTop = ui.chatMessages.scrollHeight;
        ui.chatInput.focus();
    }, 100);
});

// Chat Closer
ui.closeChatBtn.addEventListener("click", () => {
    isChatOpen = false;
    ui.chatDrawer.classList.remove("open");
    ui.chatToggleBtn.classList.remove("is-hidden");
    ui.emojiPicker.classList.add("is-hidden");
    ui.stickerPicker.classList.add("is-hidden");
});

// Chat Submit Form
ui.chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = ui.chatInput.value.trim();
    if (!text) return;
    
    if (roomId === "SOLO_ROOM") {
        if (window.soloEngine && window.soloEngine.handleEvent) {
            window.soloEngine.handleEvent("sendChatMessage", { message: text });
        }
    } else if (socket) {
        socket.emit("sendChatMessage", { message: text });
    }
    
    ui.chatInput.value = "";
    ui.chatInput.focus();
    ui.emojiPicker.classList.add("is-hidden");
    ui.stickerPicker.classList.add("is-hidden");
});

// Quick Chat Chips
ui.quickChats.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
        const text = chip.textContent.trim();
        if (roomId === "SOLO_ROOM") {
            if (window.soloEngine && window.soloEngine.handleEvent) {
                window.soloEngine.handleEvent("sendChatMessage", { message: text });
            }
        } else if (socket) {
            socket.emit("sendChatMessage", { message: text });
        }
    });
});

// Click outside chat box to close on smaller screens
document.addEventListener("click", (e) => {
    if (isChatOpen && window.innerWidth <= 768) {
        if (!ui.chatDrawer.contains(e.target) && !ui.chatToggleBtn.contains(e.target)) {
            isChatOpen = false;
            ui.chatDrawer.classList.remove("open");
            ui.chatToggleBtn.classList.remove("is-hidden");
            ui.emojiPicker.classList.add("is-hidden");
            ui.stickerPicker.classList.add("is-hidden");
        }
    }
});

// Emoji Toggler
ui.emojiToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    ui.emojiPicker.classList.toggle("is-hidden");
    ui.stickerPicker.classList.add("is-hidden");
});

// Emoji Items Selection
ui.emojiPicker.querySelectorAll(".emoji-item").forEach(item => {
    item.addEventListener("click", () => {
        const emoji = item.textContent.trim();
        ui.chatInput.value += emoji;
        ui.chatInput.focus();
        ui.emojiPicker.classList.add("is-hidden");
    });
});

// Close emoji picker if clicked outside
document.addEventListener("click", (e) => {
    if (!ui.emojiPicker.classList.contains("is-hidden")) {
        if (!ui.emojiPicker.contains(e.target) && !ui.emojiToggleBtn.contains(e.target)) {
            ui.emojiPicker.classList.add("is-hidden");
        }
    }
});

// Sticker Toggler
ui.stickerToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    ui.stickerPicker.classList.toggle("is-hidden");
    ui.emojiPicker.classList.add("is-hidden");
    ui.customStickerInput.value = ""; // Clear custom input when toggled
});

// Sticker Items Selection
ui.stickerPicker.querySelectorAll(".sticker-item").forEach(item => {
    item.addEventListener("click", () => {
        const emoji = item.getAttribute("data-emoji") || item.textContent.trim();
        if (roomId === "SOLO_ROOM") {
            if (window.GameEffects && window.GameEffects.spawnSticker) {
                window.GameEffects.spawnSticker(emoji, ui.youName.textContent || "You", true);
            }
            sfxSticker();
        } else if (socket) {
            socket.emit("sendSticker", { emoji });
        }
        ui.stickerPicker.classList.add("is-hidden");
    });
});

// Function to send custom sticker
function sendCustomSticker() {
    const val = ui.customStickerInput.value.trim();
    if (!val) return;
    if (roomId === "SOLO_ROOM") {
        if (window.GameEffects && window.GameEffects.spawnSticker) {
            window.GameEffects.spawnSticker(val, ui.youName.textContent || "You", true);
        }
        sfxSticker();
    } else if (socket) {
        socket.emit("sendSticker", { emoji: val });
    }
    ui.customStickerInput.value = "";
    ui.stickerPicker.classList.add("is-hidden");
}

// Send button click
ui.sendCustomStickerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sendCustomSticker();
});

// Keypress Enter inside custom input
ui.customStickerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        sendCustomSticker();
    }
});

// Close sticker picker if clicked outside
document.addEventListener("click", (e) => {
    if (!ui.stickerPicker.classList.contains("is-hidden")) {
        if (!ui.stickerPicker.contains(e.target) && !ui.stickerToggleBtn.contains(e.target) && !ui.customStickerInput.contains(e.target)) {
            ui.stickerPicker.classList.add("is-hidden");
        }
    }
});

window.addEventListener("DOMContentLoaded", () => {
    setupSocket();
    const savedRoomId = localStorage.getItem("roomId");
    if (savedRoomId === "SOLO_ROOM") {
        roomId = "SOLO_ROOM";
        playerSlot = "A";
        setTimeout(() => {
            if (window.soloEngine && window.soloEngine.restore) {
                window.soloEngine.restore();
            }
        }, 100);
    }
    render();
});
