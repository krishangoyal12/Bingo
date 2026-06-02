// soloEngine.js
// Client-side simulation of Room and Game States for offline play vs Bot.

window.soloEngine = (function() {
    let mockState = null;
    let botThinkTimeout = null;

    // Helper: Random shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Initialize mock serverState for solo room
    function initRoom(playerName, difficulty = "medium") {
        const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        mockState = {
            roomId: "SOLO_ROOM",
            status: "setup",
            turn: "A",
            winner: null,
            round: 1,
            botDifficulty: difficulty,
            calledNumbers: [],
            layoutIds: { A: null, B: null },
            turnDeadline: null,
            gameType: "bingo", // Default
            tttBoard: Array(9).fill(null),
            chopsticks: { A: { left: 1, right: 1 }, B: { left: 1, right: 1 } },
            dotBox: {
                hLines: Array(10).fill(null).map(() => Array(9).fill(false)),
                vLines: Array(9).fill(null).map(() => Array(10).fill(false)),
                boxes: Array(9).fill(null).map(() => Array(9).fill(null))
            },
            rps: null,
            connect5: {
                board: Array(7).fill(null).map(() => Array(7).fill(null)),
                scores: { A: 0, B: 0 },
                scored: { A: [], B: [] },
                lastMove: null
            },
            score: { A: 0, B: 0 },
            players: {
                A: { name: playerName || "You", ready: false, connected: true, socketId: "human" },
                B: { name: `RetroBot 👾 (${diffLabel})`, ready: true, connected: true, socketId: "bot" }
            },
            boards: { A: null, B: null },
            lines: { A: 0, B: 0 }
        };
        broadcastState();
    }

    function broadcastState() {
        if (window.soloCallbacks && window.soloCallbacks.state) {
            const cloned = JSON.parse(JSON.stringify(mockState));
            localStorage.setItem("solo_mockState", JSON.stringify(mockState));
            window.soloCallbacks.state(cloned);
        }
    }

    function sendError(msg) {
        if (window.soloCallbacks && window.soloCallbacks.errorMessage) {
            window.soloCallbacks.errorMessage(msg);
        }
    }

    function handleEvent(event, data) {
        if (!mockState) return;

        if (event === "setBotDifficulty") {
            mockState.botDifficulty = data.difficulty;
            const diffLabel = data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1);
            mockState.players.B.name = `RetroBot 👾 (${diffLabel})`;
            broadcastState();
            return;
        }

        if (event === "setGameType") {
            if (mockState.status === "playing") return;
            mockState.gameType = data.gameType;
            mockState.status = "setup";
            mockState.winner = null;
            mockState.players.A.ready = false;
            mockState.players.B.ready = true;
            resetGameTypeState(data.gameType);
            broadcastState();
            return;
        }

        if (event === "setReady") {
            mockState.players.A.ready = data.ready;
            checkAllReady();
            return;
        }

        if (event === "setBoard") {
            mockState.boards.A = data.board;
            mockState.layoutIds.A = data.layoutId;
            mockState.players.A.ready = true;

            const botNums = Array.from({ length: 25 }, (_, i) => i + 1);
            shuffleArray(botNums);
            mockState.boards.B = botNums;
            mockState.layoutIds.B = 999;
            mockState.players.B.ready = true;

            checkAllReady();
            return;
        }

        if (event === "resetGame") {
            const isTTTRematch = mockState.gameType === "tictactoe" && (mockState.status === "finished" || mockState.score.A > 0 || mockState.score.B > 0);
            const isChopRematch = mockState.gameType === "chopsticks" && (mockState.status === "finished" || mockState.score.A > 0 || mockState.score.B > 0);
            const isDotBoxRematch = mockState.gameType === "dotBox" && (mockState.status === "finished" || mockState.score.A > 0 || mockState.score.B > 0);
            const isRpsRematch = mockState.gameType === "rps" && (mockState.status === "finished" || mockState.score.A > 0 || mockState.score.B > 0);
            const isConnect5Rematch = mockState.gameType === "connect5" && (mockState.status === "finished" || mockState.score.A > 0 || mockState.score.B > 0);
            
            const isRematch = isTTTRematch || isChopRematch || isDotBoxRematch || isRpsRematch || isConnect5Rematch;

            mockState.winner = null;
            mockState.calledNumbers = [];
            mockState.round++;
            
            resetGameTypeState(mockState.gameType, isRematch);

            if (isRematch) {
                mockState.players.A.ready = true;
                mockState.players.B.ready = true;
                mockState.status = "playing";
                
                if (mockState.gameType === "rps") {
                    mockState.rps = {
                        moves: { A: null, B: null },
                        round: 1,
                        scores: { A: 0, B: 0 },
                        history: [],
                        revealing: false,
                        roundStartTime: 0,
                        roundDeadline: 0
                    };
                    startRpsRound();
                } else if (mockState.gameType === "connect5") {
                    mockState.connect5 = {
                        board: Array(7).fill(null).map(() => Array(7).fill(null)),
                        scores: { A: 0, B: 0 },
                        scored: { A: [], B: [] },
                        lastMove: null
                    };
                } else {
                    // Alternate starting player based on round
                    mockState.turn = mockState.round % 2 === 1 ? "A" : "B";
                }
            } else {
                mockState.status = "setup";
                mockState.turn = "A";
                mockState.players.A.ready = false;
                mockState.players.B.ready = true;
            }
            
            broadcastState();
            if (mockState.status === "playing" && mockState.turn === "B") {
                triggerBotMove();
            }
            return;
        }

        if (event === "forfeitGame") {
            mockState.status = "finished";
            mockState.winner = "B";
            broadcastState();
            return;
        }

        if (event === "leaveRoom") {
            if (botThinkTimeout) clearTimeout(botThinkTimeout);
            window.roomId = null;
            window.playerSlot = null;
            window.serverState = null;
            mockState = null;
            localStorage.removeItem("solo_mockState");
            if (window.render) window.render();
            return;
        }

        if (mockState.status !== "playing") return;

        if (event === "makeConnect5Move") {
            if (mockState.turn !== "A") return;
            handleConnect5Move(data.col, "A");
        } else if (event === "makeTTTMove") {
            if (mockState.turn !== "A") return;
            handleTTTMove(data.index, "A");
        } else if (event === "makeChopsticksAttack") {
            if (mockState.turn !== "A") return;
            handleChopsticksAttack(data.fromHand, data.toHand, "A");
        } else if (event === "makeChopsticksRedistribute") {
            if (mockState.turn !== "A") return;
            handleChopsticksRedistribute(data.left, data.right, "A");
        } else if (event === "makeDotBoxMove") {
            if (mockState.turn !== "A") return;
            handleDotBoxMove(data.type, data.r, data.c, "A");
        } else if (event === "setRpsFormat") {
            let target = 3;
            if (data.format === "3") target = 2;
            if (data.format === "11") target = 6;
            mockState.rpsTargetWins = target;
            broadcastState();
        } else if (event === "makeRpsMove") {
            handleRpsMove(data.move, "A");
        } else if (event === "callNumber") {
            if (mockState.turn !== "A") return;
            handleBingoCall(data.number, "A");
        }
    }

    function resetGameTypeState(gameType, keepScore = false) {
        if (gameType === "tictactoe") {
            mockState.tttBoard = Array(9).fill(null);
            if (!keepScore) mockState.score = { A: 0, B: 0 };
        } else if (gameType === "chopsticks") {
            mockState.chopsticks = { A: { left: 1, right: 1 }, B: { left: 1, right: 1 } };
            if (!keepScore) mockState.score = { A: 0, B: 0 };
        } else if (gameType === "dotBox") {
            mockState.dotBox = {
                hLines: Array(10).fill(null).map(() => Array(9).fill(false)),
                vLines: Array(9).fill(null).map(() => Array(10).fill(false)),
                boxes: Array(9).fill(null).map(() => Array(9).fill(null))
            };
            if (!keepScore) mockState.score = { A: 0, B: 0 };
        } else if (gameType === "rps") {
            mockState.rps = {
                moves: { A: null, B: null },
                round: 1,
                scores: { A: 0, B: 0 },
                history: [],
                revealing: false,
                roundStartTime: 0,
                roundDeadline: 0
            };
            mockState.rpsTargetWins = mockState.rpsTargetWins || 3;
        } else if (gameType === "connect5") {
            mockState.connect5 = {
                board: Array(7).fill(null).map(() => Array(7).fill(null)),
                scores: { A: 0, B: 0 },
                scored: { A: [], B: [] },
                lastMove: null
            };
        } else if (gameType === "bingo") {
            mockState.calledNumbers = [];
            mockState.boards = { A: null, B: null };
            mockState.lines = { A: 0, B: 0 };
        }
    }

    function checkAllReady() {
        if (mockState.players.A.ready && mockState.players.B.ready) {
            mockState.status = "playing";
            mockState.turn = "A";
            if (mockState.gameType === "rps") {
                startRpsRound();
            }
        }
        broadcastState();
    }

    function shouldNerf() {
        const diff = mockState.botDifficulty || "medium";
        const chance = diff === "easy" ? 0.33 : (diff === "medium" ? 0.18 : 0.0);
        return Math.random() < chance;
    }

    function triggerBotMove() {
        if (mockState.status !== "playing") return;
        const delay = mockState.gameType === "rps" ? 0 : 800 + Math.random() * 300;
        
        botThinkTimeout = setTimeout(() => {
            if (mockState.status !== "playing" || mockState.turn !== "B") return;
            
            try {
                if (mockState.gameType === "connect5") {
                    botPlayConnect5();
                } else if (mockState.gameType === "tictactoe") {
                    botPlayTTT();
                } else if (mockState.gameType === "chopsticks") {
                    botPlayChopsticks();
                } else if (mockState.gameType === "dotBox") {
                    botPlayDotBox();
                } else if (mockState.gameType === "bingo") {
                    botPlayBingo();
                }
            } catch (err) {
                console.error("Bot error: ", err);
            }
        }, delay);
    }

    // ==========================================
    // game 1: CONNECT 4 (connect5) SIMULATION
    // ==========================================
    function handleConnect5Move(colIndex, player) {
        const board = mockState.connect5.board;
        if (colIndex < 0 || colIndex >= 7 || board[colIndex][6] !== null) {
            sendError("Invalid column.");
            return;
        }

        let targetRow = -1;
        for (let r = 0; r < 7; r++) {
            if (board[colIndex][r] === null) {
                targetRow = r;
                break;
            }
        }

        board[colIndex][targetRow] = player;
        const botObj = window.soloBots.connect5;
        const newCombos = botObj.checkNewCombos(board, player, colIndex, targetRow, mockState.connect5.scored[player]);
        const points = newCombos.length;
        mockState.connect5.scores[player] += points;

        mockState.connect5.lastMove = {
            player,
            col: colIndex,
            row: targetRow,
            pointsEarned: points,
            newCombos
        };

        if (mockState.connect5.scores[player] >= 5) {
            mockState.status = "finished";
            mockState.winner = player;
        } else {
            let totalTokens = 0;
            for (let c = 0; c < 7; c++) {
                for (let r = 0; r < 7; r++) {
                    if (board[c][r] !== null) totalTokens++;
                }
            }
            if (totalTokens >= 49) {
                mockState.status = "finished";
                const scoreA = mockState.connect5.scores.A;
                const scoreB = mockState.connect5.scores.B;
                mockState.winner = scoreA > scoreB ? "A" : (scoreB > scoreA ? "B" : "TIE");
            } else {
                mockState.turn = player === "A" ? "B" : "A";
            }
        }

        broadcastState();
        if (mockState.turn === "B") triggerBotMove();
    }

    function botPlayConnect5() {
        const board = mockState.connect5.board;
        const botScored = mockState.connect5.scored.B;
        const playerScored = mockState.connect5.scored.A;
        const botObj = window.soloBots.connect5;

        let targetCol = -1;
        if (shouldNerf()) {
            const validCols = [];
            for (let col = 0; col < 7; col++) {
                if (board[col][6] === null) validCols.push(col);
            }
            if (validCols.length > 0) {
                targetCol = validCols[Math.floor(Math.random() * validCols.length)];
            }
        }
        if (targetCol === -1) {
            targetCol = botObj.getBestMove(board, botScored, playerScored);
        }
        if (targetCol !== -1) {
            handleConnect5Move(targetCol, "B");
        }
    }

    // ==========================================
    // game 2: TIC TAC TOE SIMULATION
    // ==========================================
    function handleTTTMove(index, player) {
        if (mockState.tttBoard[index] !== null) return;
        mockState.tttBoard[index] = player;

        const botObj = window.soloBots.tictactoe;
        const winner = botObj.checkWin(mockState.tttBoard);
        if (winner) {
            mockState.status = "finished";
            mockState.winner = winner;
            mockState.score[winner]++;
        } else if (mockState.tttBoard.every(cell => cell !== null)) {
            mockState.status = "finished";
            mockState.winner = "TIE";
        } else {
            mockState.turn = player === "A" ? "B" : "A";
        }
        broadcastState();
        if (mockState.turn === "B") triggerBotMove();
    }

    function botPlayTTT() {
        const botObj = window.soloBots.tictactoe;
        let index = -1;
        if (shouldNerf()) {
            const emptyIndices = [];
            for (let i = 0; i < 9; i++) {
                if (mockState.tttBoard[i] === null) emptyIndices.push(i);
            }
            if (emptyIndices.length > 0) {
                index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            }
        }
        if (index === -1) {
            index = botObj.getBestMove(mockState.tttBoard);
        }
        if (index !== -1) {
            handleTTTMove(index, "B");
        }
    }

    // ==========================================
    // game 3: CHOPSTICKS SIMULATION
    // ==========================================
    function handleChopsticksAttack(fromHand, toHand, player) {
        const opp = player === "A" ? "B" : "A";
        const attackerVal = mockState.chopsticks[player][fromHand];
        const defenderVal = mockState.chopsticks[opp][toHand];

        if (attackerVal <= 0 || defenderVal <= 0) return;

        mockState.chopsticks[opp][toHand] = (attackerVal + defenderVal) % 5;

        const botObj = window.soloBots.chopsticks;
        const winner = botObj.checkWin(mockState.chopsticks);
        if (winner) {
            mockState.status = "finished";
            mockState.winner = winner;
            mockState.score[winner]++;
        } else {
            mockState.turn = opp;
        }
        broadcastState();
        if (mockState.turn === "B") triggerBotMove();
    }

    function handleChopsticksRedistribute(left, right, player) {
        mockState.chopsticks[player].left = left;
        mockState.chopsticks[player].right = right;
        mockState.turn = player === "A" ? "B" : "A";
        broadcastState();
        if (mockState.turn === "B") triggerBotMove();
    }

    function botPlayChopsticks() {
        const botObj = window.soloBots.chopsticks;
        const selected = botObj.getBestMove(mockState.chopsticks);

        if (selected) {
            if (selected.type === "attack") {
                handleChopsticksAttack(selected.fromHand, selected.toHand, "B");
            } else {
                handleChopsticksRedistribute(selected.left, selected.right, "B");
            }
        }
    }

    // ==========================================
    // game 4: BOXES (dotBox) SIMULATION
    // ==========================================
    function handleDotBoxMove(type, r, c, player) {
        const state = mockState.dotBox;
        if (type === "h") {
            state.hLines[r][c] = true;
        } else {
            state.vLines[r][c] = true;
        }

        let completed = 0;
        const checkBox = (br, bc) => {
            if (br < 0 || br >= 9 || bc < 0 || bc >= 9) return false;
            if (state.boxes[br][bc] !== null) return false;

            if (state.hLines[br][bc] && state.hLines[br+1][bc] &&
                state.vLines[br][bc] && state.vLines[br][bc+1]) {
                state.boxes[br][bc] = player;
                mockState.score[player]++;
                return true;
            }
            return false;
        };

        if (type === "h") {
            if (checkBox(r - 1, c)) completed++;
            if (checkBox(r, c)) completed++;
        } else {
            if (checkBox(r, c - 1)) completed++;
            if (checkBox(r, c)) completed++;
        }

        // Check win
        let total = 0;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (state.boxes[row][col] !== null) total++;
            }
        }
        const isGameOver = (total === 81);
        if (isGameOver) {
            const scoreA = mockState.score.A;
            const scoreB = mockState.score.B;
            mockState.winner = scoreA > scoreB ? "A" : (scoreB > scoreA ? "B" : "TIE");
            mockState.status = "finished";
        } else {
            if (completed > 0) {
                if (window.soloCallbacks && window.soloCallbacks.bonusTurn) {
                    window.soloCallbacks.bonusTurn({ count: completed });
                }
            } else {
                mockState.turn = player === "A" ? "B" : "A";
            }
        }

        broadcastState();
        if (mockState.turn === "B" && !isGameOver) triggerBotMove();
    }

    function botPlayDotBox() {
        const botObj = window.soloBots.dotBox;
        let chosen = null;
        if (shouldNerf()) {
            const hMoves = [];
            const vMoves = [];
            for (let r = 0; r < 10; r++) {
                for (let c = 0; c < 9; c++) {
                    if (!mockState.dotBox.hLines[r][c]) hMoves.push({ type: "h", r, c });
                }
            }
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 10; c++) {
                    if (!mockState.dotBox.vLines[r][c]) vMoves.push({ type: "v", r, c });
                }
            }
            const allMoves = [...hMoves, ...vMoves];
            if (allMoves.length > 0) {
                chosen = allMoves[Math.floor(Math.random() * allMoves.length)];
            }
        }
        if (!chosen) {
            chosen = botObj.getBestMove(mockState.dotBox);
        }
        if (chosen) {
            handleDotBoxMove(chosen.type, chosen.r, chosen.c, "B");
        }
    }

    // ==========================================
    // game 5: ROCK PAPER SCISSORS SIMULATION
    // ==========================================
    function startRpsRound() {
        mockState.rps.moves = { A: null, B: null };
        mockState.rps.revealing = false;
        mockState.rps.roundStartTime = Date.now();
        mockState.rps.roundDeadline = Date.now() + 3000;
        mockState.status = "playing";
        broadcastState();

        if (botThinkTimeout) clearTimeout(botThinkTimeout);
    }

    function resolveRpsRound() {
        const moveA = mockState.rps.moves.A;
        const moveB = mockState.rps.moves.B;

        let winner = null;
        if (moveA === moveB) {
            winner = "TIE";
        } else if (
            (moveA === "rock" && moveB === "scissors") ||
            (moveA === "scissors" && moveB === "paper") ||
            (moveA === "paper" && moveB === "rock")
        ) {
            winner = "A";
            mockState.rps.scores.A++;
        } else {
            winner = "B";
            mockState.rps.scores.B++;
        }

        mockState.rps.history.push({
            round: mockState.rps.round,
            moves: { A: moveA, B: moveB },
            winner
        });

        const target = mockState.rpsTargetWins;
        if (mockState.rps.scores.A >= target) {
            mockState.status = "finished";
            mockState.winner = "A";
        } else if (mockState.rps.scores.B >= target) {
            mockState.status = "finished";
            mockState.winner = "B";
        }

        mockState.rps.revealing = true;
        broadcastState();

        setTimeout(() => {
            if (!mockState || mockState.gameType !== "rps") return;
            mockState.rps.revealing = false;

            if (mockState.status === "finished") {
                broadcastState();
            } else {
                mockState.rps.round++;
                startRpsRound();
            }
        }, 3500);
    }

    function handleRpsMove(move, player) {
        if (mockState.rps.revealing) return;
        mockState.rps.moves[player] = move;

        if (player === "A") {
            const botObj = window.soloBots.rps;
            mockState.rps.moves.B = botObj.getBestMove(mockState.rps.history);
        }

        if (mockState.rps.moves.A && mockState.rps.moves.B) {
            resolveRpsRound();
        } else {
            broadcastState();
        }
    }

    // ==========================================
    // game 6: BINGO SIMULATION
    // ==========================================
    function handleBingoCall(number, player) {
        const value = Number(number);
        if (mockState.calledNumbers.includes(value)) return;

        mockState.calledNumbers.push(value);

        const botObj = window.soloBots.bingo;
        const calledSet = new Set(mockState.calledNumbers);
        const linesA = botObj.countLines(mockState.boards.A, calledSet);
        const linesB = botObj.countLines(mockState.boards.B, calledSet);

        mockState.lines.A = linesA;
        mockState.lines.B = linesB;

        let gameFinished = false;
        if (linesA >= 5 && linesB >= 5) {
            mockState.status = "finished";
            mockState.winner = "TIE";
            gameFinished = true;
        } else if (linesA >= 5) {
            mockState.status = "finished";
            mockState.winner = "A";
            gameFinished = true;
        } else if (linesB >= 5) {
            mockState.status = "finished";
            mockState.winner = "B";
            gameFinished = true;
        }

        if (gameFinished) {
            broadcastState();
            return;
        }

        mockState.turn = player === "A" ? "B" : "A";
        broadcastState();
        if (mockState.turn === "B") triggerBotMove();
    }

    function botPlayBingo() {
        const botObj = window.soloBots.bingo;
        const chosenNum = botObj.getBestMove(mockState.boards.B, mockState.calledNumbers);
        if (chosenNum !== null) {
            handleBingoCall(chosenNum, "B");
        }
    }

    function restore() {
        const saved = localStorage.getItem("solo_mockState");
        if (saved) {
            mockState = JSON.parse(saved);
            broadcastState();
            if (mockState.status === "playing" && mockState.turn === "B") {
                triggerBotMove();
            }
        }
    }

    return {
        init: initRoom,
        handleEvent,
        restore
    };
})();
