# Bingo Duel - Application Context

## Overview

**Bingo Duel** is a real-time multiplayer online bingo game with **integrated WebRTC voice chat**, featuring two players competing to cancel 5 lines (horizontal, vertical, or diagonal) on their 5×5 grids first. The game includes a premium audio design system with 21+ context-aware sound effects, session persistence, turn timers, and glassmorphic UI.

## Game Rules

- **Board**: 5×5 grid containing numbers 1–25
- **Setup**: Each player places 25 numbers on their grid:
  - Manual sequential placement (click cells 1→25)
  - Select a preset layout (5 built-in options)
  - Load a custom saved layout
- **Turn System**:
  - Players alternate calling numbers from their own board (30-second limit per turn)
  - Can only call numbers present on their own board
  - Turn auto-skips if no call within 30 seconds
- **Marking**: When a number is called, it's marked on both boards
- **Win Condition**: First player to complete 5 lines wins
  - A "line" is any complete row, column, or diagonal (12 possible lines total)
  - If both players hit 5 lines on the same call → tie
- **Layout Restriction**: Both players cannot use the same preset/custom layout by ID; if identical boards detected → rejection
- **Voice Chat**: WebRTC peer-to-peer audio (optional, mutable)

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla ES6+)
- **Backend**: Node.js with Express + Socket.IO
- **Real-time**: WebSocket (Socket.IO) for game state, WebRTC for voice
- **Audio**: Web Audio API (oscillators, noise filters, synthesized SFX)
- **Persistence**: localStorage for sessionId + custom layouts
- **Styling**: Glassmorphic design, CSS animations, responsive layout, dark theme

## Project Structure

```
Bingo/
├── index.html          # Main UI markup (lobby + game + audio controls)
├── style.css           # Glassmorphic design, animations, responsive
├── app.js              # Client logic (Socket.IO, rendering, audio synthesis, WebRTC)
├── server.js           # Game state, room mgmt, turn logic, signaling relay
├── package.json        # Dependencies (express, socket.io)
└── CONTEXT.md          # This file
```

## File Descriptions

### index.html

- **Top Navigation**:
  - Logo + BINGO DUEL branding
  - Connection status badge
  - Room code + player name displays
  - Audio controls (mute mic, deafen, mute game sounds, hidden until game starts)
  - Leave/disconnect button
  - Remote audio element (`<audio id="remoteAudio">`) for WebRTC voice

- **Lobby Section**:
  - Display name input
  - Create room button
  - Join room input + button

- **Game Section** (hidden until game starts):
  - **Left Panel**: Your board (hero board with BINGO letters B-I-N-G-O above grid)
  - **Right Panel**: Opponent board (ghosted, same letter display)
  - **Top headers**: Turn indicator badge, line counts (you vs opponent)
  - **Bottom Action Area**:
    - Turn timer bar (visual countdown, color-coded)
    - Layout buttons (preset + custom)
    - Clear/Save layout buttons
    - "Next number" badge
    - Ready button
  - **Toast**: Toast notifications for errors/feedback
  - **Winner overlay**: Victory/defeat/tie modal with rematch button

### style.css

Key Design Elements:

- **Glassmorphic Design**: `.glass-card`, `.glass-badge` (frosted glass effect with blur)
- **Color Palette**: Dark backgrounds (#0b1226, #131b33), neon accents (#ffb347, #1ee3cf, #ff5f6d)
- **Animations**: Smooth transitions, mark stamps, confetti on win

Key Classes:

- `.cell` – individual grid cell (marked with gradient + "X" stamp animation when called)
- `.hero-board` – board container with BINGO letters displayed above
- `.bingo-letter` – B-I-N-G-O letter styling
- `.layout-btn` – layout selection buttons (`.layout-btn--active`, `.layout-btn--disabled`)
- `.btn--primary` – primary action (neon gradient)
- `.btn--ghost` – secondary action (dashed border, transparent)
- `.timer-bar` – turn timer visual (`.warn` yellow, `.danger` red)
- `.confetti-container` + `.confetti-piece` – victory animation
- `.status-indicator` – player connection status dot
- Responsive: single-column mobile, dual-column on desktop

### app.js

**Key Variables**:

- `sessionId` – Unique per-browser ID stored in localStorage (enables reconnection)
- `localState` – Tracks player's board, next number, ready status, selected layout ID
- `PRESET_LAYOUTS` – 5 hardcoded 5×25 number arrangements
- `audioCtx` – Web Audio API context for sound synthesis
- `gameSoundsMuted` – Flag to mute all game sounds
- `timerAnimFrame` – Animation frame ID for turn timer
- `lastSoundTime`, `lastOppLineCount`, `lastTurn`, `lastStatus` – Sound trigger prevention

**Audio System (21 Sound Effects)**:

Synthesized using Web Audio API (oscillators, filters, noise):

1. `sfxHover()` – Soft tick on hover (10%)
2. `sfxButtonClick()` – Tactile click (20%)
3. `sfxNumberMarked()` – Soft pop when number called (25%)
4. `sfxInvalidAction()` – Low-pitch beep (20%)
5. `sfxLayoutSelected()` – Light confirmation (20%)
6. `sfxRoomCreated()` – Positive chime (30%)
7. `sfxOpponentJoined()` – Arrival pop (30%)
8. `sfxReadyPressed()` – Strong clack (35%)
9. `sfxMatchStart()` – Whoosh + bright chime (40%)
10. `sfxYourTurn()` – Notification ping (30%)
11. `sfxOpponentTurn()` – Transition swoosh (20%)
12. `sfxLineComplete()` – Ascending C→E→G (50%)
13. `sfxOppLineComplete()` – Descending G→E→C (40%)
14. `sfxMatchPoint()` – Enhanced success chime (60%)
15. `sfxOppMatchPoint()` – Tension warning (55%)
16. `sfxVictory()` – Victory fanfare (80-100%)
17. `sfxDefeat()` – Descending loss tone (50%)
18. `sfxTie()` – Double chime (70%)
19. `sfxOpponentDisconnect()` – Soft disconnect tone (40%)
20. `sfxRematch()` – Refresh whoosh (40%)
21. Helper: `playNote(freq, vol, start, dur, type)` – Play sine/square/triangle wave
22. Helper: `playNoiseBurst(vol, start, dur)` – Filtered noise

**Key Functions**:

- `buildBoard(container, store, onClick)` – Creates 25 grid cells
- `buildLayoutButtons()` – Creates preset + custom layout buttons (reads from localStorage)
- `applyLayout(layoutId, layoutArr)` – Applies layout, validates opponent check
- `handleCellClick(index)` – Context-aware: during setup = place number, during play = call number
- `handlePlayerPlacement(index)` – Sequential number placement (1→25)
- `handleCall(number)` – Validates and emits call (checks board, turn, timing)
- `renderBoard(cells, board, calledSet, locked)` – Updates cell display (value + marked state)
- `renderLayoutButtons(oppSlot)` – Updates button states based on opponent/readiness
- `render()` – Main UI loop: lobby/game, status badges, timer, turn indicator
- `startTimerAnimation()` – Animates countdown bar with color transitions
- `launchConfetti()` – Creates 150 animated confetti pieces on win
- `getAudioCtx()` – Lazy-loads and resumes Web Audio context on first use

**Socket Events (Received)**:

- `connect` – Connected to server
- `roomCreated` – { roomId, playerSlot: "A" }
- `roomJoined` – { roomId, playerSlot: "B" }
- `state` – Full game state broadcast (60+ properties)
- `errorMessage` – Toast notification
- `opponentLeft` – Opponent disconnected notification
- `webrtc-offer`, `webrtc-answer`, `webrtc-ice-candidate` – Voice chat signaling

**Socket Events (Emitted)**:

- `createRoom` – { name, sessionId }
- `joinRoom` – { roomId, name, sessionId }
- `rejoinRoom` – { roomId, sessionId } [on reconnect]
- `setBoard` – { board: [25 numbers], ready: boolean, layoutId: number or null }
- `callNumber` – { number: 1-25 }
- `resetGame` – () [rematch]
- `leaveRoom` – ()
- `webrtc-offer`, `webrtc-answer`, `webrtc-ice-candidate` – Voice chat signaling

**Custom Layout Support**:

- Read from `localStorage.customLayouts` (JSON array of `{name, board}`)
- Save button appears after manual placement to save current board
- Both preset and custom layouts appear in layout buttons

### server.js

**Global Constants**:

- `TURN_TIME_MS = 30000` – 30-second turn limit

**Room State Object**:

```js
{
  id: roomId,                      // 5-char code (e.g., "K2R9X")
  players: {
    A: { id, sessionId, name, connected },
    B: { id, sessionId, name, connected }
  },
  boards: { A: [...], B: [...] },  // 25-element arrays
  layoutIds: { A: number|null, B: number|null },
  ready: { A: false, B: false },
  called: Set([...]),              // Numbers called so far
  turn: "A" | "B",                 // Current player
  status: "setup" | "playing" | "finished",
  winner: null | "A" | "B" | "TIE",
  round: number,
  turnTimer: NodeJS.Timeout,       // Timeout handle for auto-skip
  turnDeadline: number             // Timestamp when turn expires (milliseconds)
}
```

**Key Functions**:

- `createRoomId()` – Generates 5-char room code from alphanumeric
- `isValidBoard(board)` – Validates 25 unique integers 1–25
- `boardsEqual(first, second)` – Compares boards element-wise
- `countLines(board, calledSet)` – Counts complete rows/cols/diagonals
- `buildState(roomId)` – Computes full state (includes turnDeadline for timer sync)
- `broadcastState(roomId)` – Sends state to both players in room
- `clearTurnTimer(room)` – Clears timeout, resets deadline
- `startTurnTimer(roomId)` – Sets 30-second timer, auto-skips on timeout
- `checkAutoWin(roomId)` – Checks line counts, ends game if win/tie detected
- `resetRoom(room)` – Clears timer, resets boards/ready/called for rematch
- `removePlayer(roomId, slot)` – Broadcasts disconnect, cleans up room

**Listeners**:

- `connection` – New player connected
- `createRoom` – { name, sessionId } → Creates room, assigns slot A
- `joinRoom` – { roomId, name, sessionId } → Joins as slot B (rejects if full)
- `rejoinRoom` – { roomId, sessionId } → Reconnect by sessionId (preserves slot/game state)
- `setBoard` – { board, ready, layoutId } → Validates, checks layout collision, starts game if both ready
- `callNumber` – { number } → Validates turn/board/number, marks, checks win, switches turn
- `resetGame` – () → Rematch (reset but keep players)
- `leaveRoom` – () → Player disconnecting
- `webrtc-offer`, `webrtc-answer`, `webrtc-ice-candidate` – Relay WebRTC signals to opponent
- `disconnect` – Socket disconnected (may be temporary; sessionId allows rejoin)

## Layout System

### Preset Layouts

- 5 hardcoded 5×25 number permutations (0–4 indexed) in `PRESET_LAYOUTS`
- Identical arrays in both app.js and server-side (for validation)
- Server prevents both players from using same layout ID or identical boards
- Labeled as "Preset 1–5" in UI

### Custom Layouts

- Stored in `localStorage.customLayouts` as JSON array: `[{ name: "My Layout", board: [...] }, ...]`
- "Save Layout" button appears after manual board setup
- Can be loaded via layout buttons (labeled with custom names)
- Supported layout ID range: 0–4 (presets) + 5+ (custom)

### Layout Selection Rules

- During setup, click a layout button to instantly populate board
- Server validates that opponent is not using same layout ID
- If boards are identical (via `boardsEqual`), also rejected as "Opponent already uses this layout"
- Can clear and return to manual placement
- Layout ID sent with `setBoard` event for tracking

## Game Flow

### Lobby

1. Player enters display name (optional, defaults to "Player A/B")
2. Creates room (generates 5-char code) or joins with room code
3. sessionId auto-generated and stored in localStorage (for reconnects)

### Setup Phase

1. Both players in room, waiting area displays names
2. Each player chooses:
   - **Manual placement**: Click cells sequentially, numbers placed 1→25
   - **Preset layout**: Click a layout button
   - **Custom layout**: Click a saved layout
   - **Clear**: Reset board to empty
3. After placement, click "Ready"
4. Game starts when both players ready

### Playing Phase

1. Player A starts (turn indicator shows who's active)
2. Active player has 30 seconds per turn (visual timer bar counts down, color: green → yellow → red)
3. On each turn, active player clicks a number on their board cell
4. Server:
   - Marks number for both players
   - Recomputes line counts (checks 12 possible lines)
   - Advances turn
   - Restarts timer
5. If turn time expires without call, auto-skips to opponent
6. Game ends when one/both reach 5 lines

### End Game / Win Conditions

- **Win**: One player reaches 5 lines → victory animation plays, confetti launches
- **Tie**: Both hit 5 lines on same call → tie animation plays, confetti launches
- **Defeat**: Opponent reaches 5 lines → defeat overlay
- **Disconnect**: Opponent leaves during game → game ends with notification
- Winner overlay shows result with "Play again" button

### Rematch

- Click "Play again"
- Both players remain in room, layouts/names preserved
- Game resets to setup phase, both unready
- New round begins when both ready again

## Key Design Decisions

### Layout Restriction

- **Why**: Prevents strategic imbalance; ensures fair gameplay
- **How**: Server tracks `layoutIds[A]` and `layoutIds[B]`; validates on `setBoard`
- **Validation**: Checks exact layout ID match AND `boardsEqual()` for manual boards
- **Result**: Both players get unique board configurations

### Own-Board Calling

- **Why**: Strategic depth—players balance offensive vs. defensive calls
- **Implementation**: Client disables numbers not on player's board; server also validates
- **Benefit**: Encourages board planning during setup

### Server-Side Line Counting

- **Why**: Prevents cheating; authoritative win detection
- **How**: `countLines(board, calledSet)` scans all 12 lines (5 rows + 5 cols + 2 diagonals)
- **Efficiency**: O(25) operation, runs after each call

### Turn Timer (30 seconds)

- **Why**: Prevents stalling, maintains game pace
- **How**: Server sets deadline on `startTurnTimer()`; auto-skips if no call by deadline
- **Client**: Visual bar syncs with server deadline (requestAnimationFrame loop)
- **Sound**: Context-aware audio cues (turn change, time warning)

### WebRTC Voice Chat

- **Why**: Enhance multiplayer experience with live voice
- **How**: Peer-to-peer audio stream via WebRTC; Socket.IO relays signaling (offer/answer/ICE)
- **Mutable**: Audio controls in header (mute mic, deafen, mute game sounds)
- **Optional**: Can play without voice enabled

### Premium Audio Design

- **Why**: Gamification—contextual audio cues enhance feedback
- **How**: 21 synthesized sound effects triggered on game events
- **Implementation**: Web Audio API (oscillators, noise, filters) for portable, size-efficient audio
- **Control**: Single `gameSoundsMuted` flag mutes all

### Session Persistence

- **Why**: Allow player to reconnect if connection drops
- **How**: `sessionId` stored in localStorage, sent on room creation/join
- **Server**: `rejoinRoom` event allows reconnect by sessionId with same slot
- **Game State**: Preserved unless opponent disconnects (auto-ends game)

### Glassmorphic UI

- **Why**: Modern, polished aesthetic
- **How**: Semi-transparent backgrounds with CSS backdrop-filter blur
- **Colors**: Dark theme with neon accents (#ffb347, #1ee3cf, #ff5f6d)
- **Responsive**: Single-column on mobile, dual-column on desktop

### Real-Time State Broadcasting

- **Why**: Both players always see live board state
- **How**: `broadcastState(roomId)` sent after every meaningful action
- **Payload**: Includes boards, turn, lines, deadline, ready status, etc.

## Running the Application

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
npm start
```

Server runs on `http://localhost:3000`

### Access Game

**Same Device (Hot-Seat)**:

1. Open `http://localhost:3000` in two browser tabs/windows
2. Player 1: Enter name → "Create Room"
3. Share room code with Player 2 (shown in sidebar)
4. Player 2: Enter name → "Join" → paste room code
5. Both: Select layout or manually place numbers → "Ready"
6. Game starts (Player A goes first)

**Different Devices (Network)**:

1. Ensure both devices on same network (or public server)
2. Player 1: Opens `http://<server-ip>:3000` (or hostname)
3. Create room, share code
4. Player 2: Opens same URL, joins code
5. Proceed as above

**Voice Chat Setup** (Optional):

- When both players ready, WebRTC will attempt peer connection
- Browser will ask permission to access microphone → accept
- Audio controls appear in top-right (mute/deafen buttons)
- Speak to communicate; opponent hears voice

**Handling Disconnection**:

- If disconnected, refresh browser
- sessionId preserved in localStorage
- Click "Create Room" again with same name
- Server recognizes sessionId, restores to same room/slot
- If opponent was still waiting, game continues; if playing, game ends

## Important Notes

### Browser Compatibility

- **ES6 Support**: Arrow functions, const/let, template literals, destructuring
- **Web Audio API**: Supported in all modern browsers
- **WebRTC**: Requires browser support for peer connections (Chrome, Firefox, Safari, Edge)
- **Socket.IO Client**: Loaded from `/socket.io/socket.io.js` (Express auto-serves)
- **localStorage**: Required for sessionId persistence

### Performance Considerations

- **Sound Synthesis**: Web Audio context lazy-loads on first use; subsequent calls are instant
- **Timer Animation**: `requestAnimationFrame` ensures smooth 60fps countdown bar
- **State Broadcast**: Limited to meaningful events, avoids overhead
- **Line Counting**: O(25) per call, negligible overhead

### Network Assumptions

- Assumes low-latency connection (<100ms)
- WebRTC audio requires NAT traversal (STUN servers); may fail on some networks
- Socket.IO handles reconnection/buffering automatically

### Scaling Considerations (for Production)

- **Current**: In-memory rooms (lost on server restart)
- **Needed for Scale**:
  - Persistent database (MongoDB, PostgreSQL) for room history
  - Room cleanup (TTL for abandoned games)
  - Load balancer + multiple server instances (Socket.IO adapter: Redis/Kafka)
  - STUN/TURN servers for WebRTC
  - CDN for static assets
  - SSL/TLS encryption (WSS for WebSocket)

### Debugging Tips

- **Browser Console**: Check Socket.IO connection status and events
- **Server Logs**: Monitor room creation, player joins, turns, game ends
- **Network Tab**: Monitor WebSocket frames in DevTools
- **Add Logging**: Insert console.log() in Socket.IO listeners
- **Test Disconnection**: Disable network or force-close socket
- **Audio Issues**: Check browser permissions, mute state, audio context
- **Layout Testing**: Verify preset and custom layouts load correctly

### Known Limitations

- No spectator mode
- No persistent player profiles / rankings
- No replay / game recording
- No text chat
- Sound synthesis varies by browser (slight pitch/timing differences possible)
- WebRTC may not work behind strict corporate firewalls

## Future Enhancements

- **Social**: Persistent accounts, player profiles, statistics (win rate, ELO ranking)
- **Gameplay**: Difficulty modes (faster timers, larger grids, power-ups)
- **Features**: Spectator mode, game replay, text chat backup, rematch queue
- **UI**: Mobile app (React Native), dark/light theme toggle, accessibility
- **Performance**: Server-side board generation, pre-computed layout validation
- **Analytics**: Game telemetry (move timing, layout popularity, win rate by layout)
