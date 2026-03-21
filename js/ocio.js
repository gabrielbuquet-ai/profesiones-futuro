// ==========================================
// OCIO - Juegos de mesa contra IA
// ==========================================

function startOcio(subtypeId) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    const canvas = document.getElementById('game-canvas');
    ui.style.pointerEvents = 'auto';

    switch (subtypeId) {
        case 'serpientes': ocioSerpientes(ui, controls, canvas); break;
        case 'oca': ocioOca(ui, controls, canvas); break;
        case 'tres_en_raya': ocioTresEnRaya(ui, controls, canvas); break;
        case 'conecta4': ocioConecta4(ui, controls, canvas); break;
        case 'memory': ocioMemory(ui, controls, canvas); break;
        case 'plataformas': ocioPlataformas(ui, controls, canvas); break;
    }
}

// ===================== SERPIENTES Y ESCALERAS =====================

function ocioSerpientes(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Board layout
    const boardSize = Math.min(W - 20, H - 100);
    const cellSize = boardSize / 10;
    const boardX = (W - boardSize) / 2;
    const boardY = 50;

    // Snakes and ladders
    const ladders = { 4: 25, 13: 46, 27: 53, 42: 63, 56: 84, 72: 91 };
    const snakes = { 33: 9, 49: 11, 62: 19, 75: 51, 89: 68, 95: 24, 99: 78 };

    let playerPos = 0;
    let aiPos = 0;
    let currentTurn = 'player'; // 'player' or 'ai'
    let diceValue = 0;
    let rolling = false;
    let rollAnim = 0;
    let moving = false;
    let moveTarget = 0;
    let moveProgress = 0;
    let gameOver = false;
    let animId;
    let slideAnim = null; // {from, to, progress, type: 'ladder'|'snake'}
    let message = 'Pulsa ESPACIO para tirar el dado';

    function squareToXY(sq) {
        if (sq <= 0) return { x: boardX + cellSize / 2, y: boardY + boardSize - cellSize / 2 };
        var s = sq - 1;
        var row = Math.floor(s / 10);
        var col = s % 10;
        if (row % 2 === 1) col = 9 - col;
        return {
            x: boardX + col * cellSize + cellSize / 2,
            y: boardY + boardSize - (row + 1) * cellSize + cellSize / 2
        };
    }

    function drawBoard() {
        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        // Draw board squares
        for (var i = 0; i < 100; i++) {
            var row = Math.floor(i / 10);
            var col = i % 10;
            if (row % 2 === 1) col = 9 - col;
            var x = boardX + col * cellSize;
            var y = boardY + boardSize - (row + 1) * cellSize;

            var sqNum = i + 1;
            var isLadderBase = ladders[sqNum] !== undefined;
            var isSnakeHead = snakes[sqNum] !== undefined;

            if (isLadderBase) {
                ctx.fillStyle = '#d4edda';
            } else if (isSnakeHead) {
                ctx.fillStyle = '#f8d7da';
            } else {
                ctx.fillStyle = (row + (row % 2 === 0 ? col : 9 - col)) % 2 === 0 ? '#e8d5f5' : '#f0e6fa';
            }
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.strokeStyle = '#9b59b6';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x, y, cellSize, cellSize);

            // Number
            ctx.fillStyle = '#4a235a';
            ctx.font = (cellSize * 0.25) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(sqNum, x + cellSize / 2, y + 2);
        }

        // Draw ladders
        ctx.lineWidth = 3;
        for (var base in ladders) {
            var from = squareToXY(parseInt(base));
            var to = squareToXY(ladders[base]);
            ctx.strokeStyle = '#27ae60';
            ctx.beginPath();
            ctx.moveTo(from.x - 4, from.y);
            ctx.lineTo(to.x - 4, to.y);
            ctx.moveTo(from.x + 4, from.y);
            ctx.lineTo(to.x + 4, to.y);
            ctx.stroke();
            // Rungs
            var dist = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
            var steps = Math.floor(dist / (cellSize * 0.6));
            for (var r = 1; r < steps; r++) {
                var t = r / steps;
                var rx = from.x + (to.x - from.x) * t;
                var ry = from.y + (to.y - from.y) * t;
                ctx.beginPath();
                ctx.moveTo(rx - 4, ry);
                ctx.lineTo(rx + 4, ry);
                ctx.stroke();
            }
        }

        // Draw snakes
        ctx.lineWidth = 4;
        for (var head in snakes) {
            var from = squareToXY(parseInt(head));
            var to = squareToXY(snakes[head]);
            ctx.strokeStyle = '#e74c3c';
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            // Wavy line
            var dx = to.x - from.x;
            var dy = to.y - from.y;
            var segs = 6;
            for (var s = 1; s <= segs; s++) {
                var t = s / segs;
                var mx = from.x + dx * t + Math.sin(t * Math.PI * 3) * cellSize * 0.3;
                var my = from.y + dy * t;
                ctx.lineTo(mx, my);
            }
            ctx.stroke();
            // Snake head emoji
            ctx.font = (cellSize * 0.35) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🐍', from.x, from.y);
        }

        // Slide animation
        if (slideAnim) {
            var from = squareToXY(slideAnim.from);
            var to = squareToXY(slideAnim.to);
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = slideAnim.type === 'ladder' ? '#2ecc71' : '#e74c3c';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(
                from.x + (to.x - from.x) * slideAnim.progress,
                from.y + (to.y - from.y) * slideAnim.progress
            );
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Draw tokens
        var pPos = moving && currentTurn === 'player' ? moveProgress : playerPos;
        var aPos = moving && currentTurn === 'ai' ? moveProgress : aiPos;

        if (slideAnim) {
            var animPos = squareToXY(slideAnim.from);
            var animTo = squareToXY(slideAnim.to);
            var sx = animPos.x + (animTo.x - animPos.x) * slideAnim.progress;
            var sy = animPos.y + (animTo.y - animPos.y) * slideAnim.progress;
            if (slideAnim.who === 'player') {
                drawToken(ctx, sx, sy - 3, '#3498db', '😊', cellSize);
                if (aiPos > 0) { var ap = squareToXY(aiPos); drawToken(ctx, ap.x, ap.y + 3, '#e74c3c', '🤖', cellSize); }
            } else {
                if (playerPos > 0) { var pp = squareToXY(playerPos); drawToken(ctx, pp.x, pp.y - 3, '#3498db', '😊', cellSize); }
                drawToken(ctx, sx, sy + 3, '#e74c3c', '🤖', cellSize);
            }
        } else {
            if (pPos > 0) { var pp = squareToXY(pPos); drawToken(ctx, pp.x, pp.y - 3, '#3498db', '😊', cellSize); }
            if (aPos > 0) { var ap = squareToXY(aPos); drawToken(ctx, ap.x, ap.y + 3, '#e74c3c', '🤖', cellSize); }
        }

        // Dice
        var diceX = W / 2;
        var diceY = boardY + boardSize + 25;
        var diceSize = 28;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        var rx = diceX - diceSize / 2;
        var ry = diceY - diceSize / 2;
        ctx.beginPath();
        ctx.roundRect(rx, ry, diceSize, diceSize, 4);
        ctx.fill();
        ctx.stroke();

        var showVal = rolling ? Math.floor(Math.random() * 6) + 1 : diceValue;
        if (showVal > 0) {
            ctx.fillStyle = '#333';
            ctx.font = 'bold ' + (diceSize * 0.55) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(showVal, diceX, diceY);
        }

        // Message
        ctx.fillStyle = '#e0e7ff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, W / 2, boardY + boardSize + 55);

        // Score display
        ctx.font = '12px Arial';
        ctx.fillStyle = '#8b8ba0';
        ctx.fillText('Tu: casilla ' + playerPos + '  |  IA: casilla ' + aiPos, W / 2, boardY + boardSize + 72);
    }

    function drawToken(ctx, x, y, color, emoji, cs) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, cs * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = (cs * 0.3) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, x, y);
    }

    function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function animateMove(who, from, to, callback) {
        moving = true;
        var step = from;
        var timer = setInterval(function() {
            step++;
            if (step > 100) step = 100;
            moveProgress = step;
            if (step >= to || step >= 100) {
                clearInterval(timer);
                moving = false;
                callback(Math.min(to, 100));
            }
        }, 120);
    }

    function checkSpecial(who, pos, callback) {
        if (ladders[pos]) {
            message = (who === 'player' ? '!Escalera!' : 'IA sube escalera!') + ' De ' + pos + ' a ' + ladders[pos];
            slideAnim = { from: pos, to: ladders[pos], progress: 0, who: who, type: 'ladder' };
            var slideTimer = setInterval(function() {
                slideAnim.progress += 0.05;
                if (slideAnim.progress >= 1) {
                    clearInterval(slideTimer);
                    slideAnim = null;
                    callback(ladders[pos]);
                }
            }, 30);
        } else if (snakes[pos]) {
            message = (who === 'player' ? '!Serpiente!' : 'IA baja serpiente!') + ' De ' + pos + ' a ' + snakes[pos];
            slideAnim = { from: pos, to: snakes[pos], progress: 0, who: who, type: 'snake' };
            var slideTimer = setInterval(function() {
                slideAnim.progress += 0.05;
                if (slideAnim.progress >= 1) {
                    clearInterval(slideTimer);
                    slideAnim = null;
                    callback(snakes[pos]);
                }
            }, 30);
        } else {
            callback(pos);
        }
    }

    function doTurn() {
        if (gameOver) return;
        rolling = true;
        rollAnim = 0;
        var rollTimer = setInterval(function() {
            rollAnim++;
            if (rollAnim >= 15) {
                clearInterval(rollTimer);
                rolling = false;
                diceValue = rollDice();

                if (currentTurn === 'player') {
                    var newPos = Math.min(playerPos + diceValue, 100);
                    message = 'Sacaste ' + diceValue + '! Moviendo...';
                    animateMove('player', playerPos, newPos, function(finalPos) {
                        playerPos = finalPos;
                        if (playerPos >= 100) {
                            gameOver = true;
                            message = '!HAS GANADO!';
                            addScore(100);
                            setTimeout(function() {
                                showResult('!Victoria!', score + ' pts', '!Has llegado primero a la casilla 100!', function() {
                                    ocioSerpientes(ui, controls, canvas);
                                });
                            }, 500);
                            return;
                        }
                        checkSpecial('player', playerPos, function(newPos) {
                            playerPos = newPos;
                            currentTurn = 'ai';
                            message = 'Turno de la IA...';
                            setTimeout(doTurn, 800);
                        });
                    });
                } else {
                    var newPos = Math.min(aiPos + diceValue, 100);
                    message = 'IA saco ' + diceValue + '! Moviendo...';
                    animateMove('ai', aiPos, newPos, function(finalPos) {
                        aiPos = finalPos;
                        if (aiPos >= 100) {
                            gameOver = true;
                            message = 'La IA ha ganado...';
                            addScore(Math.max(10, Math.floor(playerPos / 2)));
                            setTimeout(function() {
                                showResult('Derrota', score + ' pts', 'La IA llego primero. !Intentalo de nuevo!', function() {
                                    ocioSerpientes(ui, controls, canvas);
                                });
                            }, 500);
                            return;
                        }
                        checkSpecial('ai', aiPos, function(newPos) {
                            aiPos = newPos;
                            currentTurn = 'player';
                            message = 'Pulsa ESPACIO para tirar el dado';
                        });
                    });
                }
            }
        }, 60);
    }

    function handleKey(e) {
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault();
            if (!rolling && !moving && !gameOver && currentTurn === 'player' && !slideAnim) {
                doTurn();
            }
        }
    }

    function handleClick(e) {
        if (!rolling && !moving && !gameOver && currentTurn === 'player' && !slideAnim) {
            doTurn();
        }
    }

    document.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);

    function gameLoop() {
        drawBoard();
        animId = requestAnimationFrame(gameLoop);
    }
    gameLoop();

    currentGame = {
        cleanup: function() {
            cancelAnimationFrame(animId);
            document.removeEventListener('keydown', handleKey);
            canvas.removeEventListener('click', handleClick);
        }
    };
}

// ===================== LA OCA =====================

function ocioOca(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    const W = container.clientWidth;
    const H = container.clientHeight;

    const totalSquares = 63;
    // Special squares
    const gooseSquares = [5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59];
    const bridges = [6, 12]; // jump between these
    const inns = [19, 43]; // lose a turn
    const wells = [31]; // stuck until other lands
    const jail = [56]; // lose 2 turns
    const death = [58]; // back to start
    const end = 63;

    let playerPos = 0;
    let aiPos = 0;
    let currentTurn = 'player';
    let diceValues = [0, 0];
    let rolling = false;
    let gameOver = false;
    let animId;
    let message = 'Pulsa ESPACIO para tirar los dados';
    let playerStuck = 0; // turns stuck
    let aiStuck = 0;
    let moving = false;

    // Spiral layout for 63 squares
    function squareToXY(sq) {
        if (sq <= 0) {
            return { x: W / 2, y: H / 2 };
        }
        // Create a spiral from outside in
        var boardW = W - 40;
        var boardH = H - 120;
        var cx = W / 2;
        var cy = 50 + boardH / 2;

        // Calculate spiral position
        var totalCells = 63;
        var angle = (sq / totalCells) * Math.PI * 4 + Math.PI; // 2 full rotations
        var maxRadius = Math.min(boardW, boardH) / 2 - 15;
        var radius = maxRadius * (1 - sq / (totalCells + 5));

        return {
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius
        };
    }

    function getSquareColor(sq) {
        if (gooseSquares.includes(sq)) return '#ffd700';
        if (bridges.includes(sq)) return '#8b4513';
        if (inns.includes(sq)) return '#ff6b6b';
        if (wells.includes(sq)) return '#4ecdc4';
        if (jail.includes(sq)) return '#95a5a6';
        if (death.includes(sq)) return '#2c3e50';
        if (sq === end) return '#2ecc71';
        return '#e8d5f5';
    }

    function getSquareEmoji(sq) {
        if (gooseSquares.includes(sq)) return '🪿';
        if (bridges.includes(sq)) return '🌉';
        if (inns.includes(sq)) return '🏨';
        if (wells.includes(sq)) return '🕳️';
        if (jail.includes(sq)) return '🔒';
        if (death.includes(sq)) return '💀';
        if (sq === end) return '🏆';
        return '';
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        // Title
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('La Oca', W / 2, 18);

        // Draw squares along spiral
        var cellR = Math.min(W, H) * 0.032;
        for (var i = 1; i <= totalSquares; i++) {
            var pos = squareToXY(i);
            ctx.fillStyle = getSquareColor(i);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, cellR, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#9b59b6';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Number
            ctx.fillStyle = '#333';
            ctx.font = (cellR * 0.65) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var emoji = getSquareEmoji(i);
            if (emoji) {
                ctx.fillText(emoji, pos.x, pos.y);
            } else {
                ctx.fillText(i, pos.x, pos.y);
            }
        }

        // Draw connections
        ctx.strokeStyle = 'rgba(155, 89, 182, 0.2)';
        ctx.lineWidth = 1;
        for (var i = 1; i < totalSquares; i++) {
            var a = squareToXY(i);
            var b = squareToXY(i + 1);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        // Draw tokens
        if (playerPos > 0) {
            var pp = squareToXY(playerPos);
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.arc(pp.x - cellR * 0.4, pp.y - cellR * 0.4, cellR * 0.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = (cellR * 0.45) + 'px Arial';
            ctx.fillText('😊', pp.x - cellR * 0.4, pp.y - cellR * 0.4);
        }
        if (aiPos > 0) {
            var ap = squareToXY(aiPos);
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(ap.x + cellR * 0.4, ap.y + cellR * 0.4, cellR * 0.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = (cellR * 0.45) + 'px Arial';
            ctx.fillText('🤖', ap.x + cellR * 0.4, ap.y + cellR * 0.4);
        }

        // Dice area
        var diceY = H - 40;
        for (var d = 0; d < 2; d++) {
            var dx = W / 2 + (d === 0 ? -20 : 20);
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(dx - 12, diceY - 12, 24, 24, 3);
            ctx.fill();
            ctx.stroke();
            var val = rolling ? Math.floor(Math.random() * 6) + 1 : diceValues[d];
            if (val > 0) {
                ctx.fillStyle = '#333';
                ctx.font = 'bold 13px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(val, dx, diceY);
            }
        }

        // Message
        ctx.fillStyle = '#e0e7ff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, W / 2, H - 10);
    }

    function rollTwoDice() {
        return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    }

    function applySpecialSquare(who, pos, diceTotal, callback) {
        if (pos > 63) pos = 63;
        if (pos === 63) {
            callback(pos, false);
            return;
        }

        if (gooseSquares.includes(pos)) {
            message = (who === 'player' ? '!De oca a oca!' : 'IA: de oca a oca!');
            var next = pos + diceTotal;
            if (next > 63) next = 63;
            setTimeout(function() {
                if (who === 'player') playerPos = next; else aiPos = next;
                applySpecialSquare(who, next, diceTotal, callback);
            }, 600);
            return;
        }
        if (bridges.includes(pos)) {
            var other = bridges[0] === pos ? bridges[1] : bridges[0];
            message = (who === 'player' ? '!Puente! Saltas a ' : 'IA: puente a ') + other;
            setTimeout(function() { callback(other, false); }, 600);
            return;
        }
        if (inns.includes(pos)) {
            message = (who === 'player' ? '!Posada! Pierdes un turno' : 'IA en posada');
            if (who === 'player') playerStuck = 1; else aiStuck = 1;
            callback(pos, false);
            return;
        }
        if (wells.includes(pos)) {
            message = (who === 'player' ? '!Pozo! Atrapado 2 turnos' : 'IA en el pozo');
            if (who === 'player') playerStuck = 2; else aiStuck = 2;
            callback(pos, false);
            return;
        }
        if (jail.includes(pos)) {
            message = (who === 'player' ? '!Carcel! Pierdes 2 turnos' : 'IA en carcel');
            if (who === 'player') playerStuck = 2; else aiStuck = 2;
            callback(pos, false);
            return;
        }
        if (death.includes(pos)) {
            message = (who === 'player' ? '!Muerte! Vuelves al inicio' : 'IA vuelve al inicio');
            setTimeout(function() { callback(1, false); }, 600);
            return;
        }
        callback(pos, false);
    }

    function doTurn() {
        if (gameOver || rolling || moving) return;

        if (currentTurn === 'player' && playerStuck > 0) {
            playerStuck--;
            message = 'Sigues atrapado! (' + (playerStuck + 1) + ' turno' + (playerStuck > 0 ? 's' : '') + ')';
            currentTurn = 'ai';
            setTimeout(doTurn, 800);
            return;
        }
        if (currentTurn === 'ai' && aiStuck > 0) {
            aiStuck--;
            message = 'IA sigue atrapada';
            currentTurn = 'player';
            setTimeout(function() { message = 'Pulsa ESPACIO para tirar'; }, 500);
            return;
        }

        rolling = true;
        var rollCount = 0;
        var rollTimer = setInterval(function() {
            rollCount++;
            if (rollCount >= 12) {
                clearInterval(rollTimer);
                rolling = false;
                diceValues = rollTwoDice();
                var total = diceValues[0] + diceValues[1];

                if (currentTurn === 'player') {
                    var newPos = Math.min(playerPos + total, 63);
                    message = 'Sacaste ' + total + '!';
                    playerPos = newPos;
                    applySpecialSquare('player', newPos, total, function(finalPos) {
                        playerPos = finalPos;
                        if (playerPos >= 63) {
                            gameOver = true;
                            addScore(120);
                            setTimeout(function() {
                                showResult('!Victoria!', score + ' pts', '!Has llegado a la casilla 63!', function() {
                                    ocioOca(ui, controls, canvas);
                                });
                            }, 500);
                            return;
                        }
                        currentTurn = 'ai';
                        message = 'Turno de la IA...';
                        setTimeout(doTurn, 800);
                    });
                } else {
                    var newPos = Math.min(aiPos + total, 63);
                    message = 'IA saco ' + total;
                    aiPos = newPos;
                    applySpecialSquare('ai', newPos, total, function(finalPos) {
                        aiPos = finalPos;
                        if (aiPos >= 63) {
                            gameOver = true;
                            addScore(Math.max(10, Math.floor(playerPos)));
                            setTimeout(function() {
                                showResult('Derrota', score + ' pts', 'La IA llego primero', function() {
                                    ocioOca(ui, controls, canvas);
                                });
                            }, 500);
                            return;
                        }
                        currentTurn = 'player';
                        message = 'Pulsa ESPACIO para tirar';
                    });
                }
            }
        }, 50);
    }

    function handleKey(e) {
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault();
            if (currentTurn === 'player' && !rolling && !gameOver) doTurn();
        }
    }
    function handleClick() {
        if (currentTurn === 'player' && !rolling && !gameOver) doTurn();
    }

    document.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);

    function gameLoop() {
        draw();
        animId = requestAnimationFrame(gameLoop);
    }
    gameLoop();

    currentGame = {
        cleanup: function() {
            cancelAnimationFrame(animId);
            document.removeEventListener('keydown', handleKey);
            canvas.removeEventListener('click', handleClick);
        }
    };
}

// ===================== TRES EN RAYA =====================

function ocioTresEnRaya(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    const W = container.clientWidth;
    const H = container.clientHeight;

    const gridSize = Math.min(W - 40, H - 160);
    const cellSize = gridSize / 3;
    const gridX = (W - gridSize) / 2;
    const gridY = 60;

    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0=empty, 1=player(X), 2=ai(O)
    let cursorPos = 4;
    let gameActive = true;
    let animId;
    let playerScore = 0;
    let aiScore = 0;
    let round = 1;
    let totalRounds = 5;
    let message = 'Tu turno! (X)';
    let winLine = null;
    let playerTurn = true;

    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        // Score
        ctx.fillStyle = '#e0e7ff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Ronda ' + round + '/' + totalRounds + '  |  Tu: ' + playerScore + '  IA: ' + aiScore, W / 2, 25);

        // Draw grid lines
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 3;
        for (var i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(gridX + i * cellSize, gridY);
            ctx.lineTo(gridX + i * cellSize, gridY + gridSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(gridX, gridY + i * cellSize);
            ctx.lineTo(gridX + gridSize, gridY + i * cellSize);
            ctx.stroke();
        }

        // Draw pieces
        for (var i = 0; i < 9; i++) {
            var row = Math.floor(i / 3);
            var col = i % 3;
            var cx = gridX + col * cellSize + cellSize / 2;
            var cy = gridY + row * cellSize + cellSize / 2;
            var r = cellSize * 0.32;

            if (board[i] === 1) {
                // X - Blue
                ctx.strokeStyle = '#3498db';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(cx - r, cy - r);
                ctx.lineTo(cx + r, cy + r);
                ctx.moveTo(cx + r, cy - r);
                ctx.lineTo(cx - r, cy + r);
                ctx.stroke();
            } else if (board[i] === 2) {
                // O - Red
                ctx.strokeStyle = '#e74c3c';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // Cursor highlight
        if (gameActive && playerTurn) {
            var row = Math.floor(cursorPos / 3);
            var col = cursorPos % 3;
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(gridX + col * cellSize + 4, gridY + row * cellSize + 4, cellSize - 8, cellSize - 8);
        }

        // Win line
        if (winLine) {
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 5;
            ctx.beginPath();
            var s = winLine[0], e = winLine[2];
            var sx = gridX + (s % 3) * cellSize + cellSize / 2;
            var sy = gridY + Math.floor(s / 3) * cellSize + cellSize / 2;
            var ex = gridX + (e % 3) * cellSize + cellSize / 2;
            var ey = gridY + Math.floor(e / 3) * cellSize + cellSize / 2;
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.stroke();
        }

        // Message
        ctx.fillStyle = '#e0e7ff';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, W / 2, gridY + gridSize + 30);

        // Controls hint
        ctx.fillStyle = '#8b8ba0';
        ctx.font = '11px Arial';
        ctx.fillText('Flechas + Enter o Click para jugar', W / 2, gridY + gridSize + 50);
    }

    var winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    function checkWin(b, player) {
        for (var i = 0; i < winPatterns.length; i++) {
            var p = winPatterns[i];
            if (b[p[0]] === player && b[p[1]] === player && b[p[2]] === player) return p;
        }
        return null;
    }

    function isFull(b) {
        return b.every(function(c) { return c !== 0; });
    }

    // Minimax AI
    function minimax(b, isMax, depth) {
        var wAI = checkWin(b, 2);
        if (wAI) return 10 - depth;
        var wP = checkWin(b, 1);
        if (wP) return depth - 10;
        if (isFull(b)) return 0;

        if (isMax) {
            var best = -Infinity;
            for (var i = 0; i < 9; i++) {
                if (b[i] === 0) {
                    b[i] = 2;
                    best = Math.max(best, minimax(b, false, depth + 1));
                    b[i] = 0;
                }
            }
            return best;
        } else {
            var best = Infinity;
            for (var i = 0; i < 9; i++) {
                if (b[i] === 0) {
                    b[i] = 1;
                    best = Math.min(best, minimax(b, true, depth + 1));
                    b[i] = 0;
                }
            }
            return best;
        }
    }

    function aiMove() {
        // Sometimes make mistakes (30% chance of random move)
        if (Math.random() < 0.3) {
            var empty = [];
            for (var i = 0; i < 9; i++) { if (board[i] === 0) empty.push(i); }
            return empty[Math.floor(Math.random() * empty.length)];
        }

        var bestScore = -Infinity;
        var bestMove = -1;
        for (var i = 0; i < 9; i++) {
            if (board[i] === 0) {
                board[i] = 2;
                var s = minimax(board, false, 0);
                board[i] = 0;
                if (s > bestScore) { bestScore = s; bestMove = i; }
            }
        }
        return bestMove;
    }

    function makeMove(pos) {
        if (!gameActive || !playerTurn || board[pos] !== 0) return;
        board[pos] = 1;
        playerTurn = false;

        var win = checkWin(board, 1);
        if (win) {
            winLine = win;
            playerScore++;
            addScore(30);
            message = '!Has ganado esta ronda!';
            gameActive = false;
            setTimeout(nextRound, 1500);
            return;
        }
        if (isFull(board)) {
            message = 'Empate!';
            gameActive = false;
            addScore(10);
            setTimeout(nextRound, 1500);
            return;
        }

        message = 'Turno de la IA...';
        setTimeout(function() {
            var move = aiMove();
            if (move >= 0) board[move] = 2;

            var win = checkWin(board, 2);
            if (win) {
                winLine = win;
                aiScore++;
                message = 'La IA gano esta ronda';
                gameActive = false;
                setTimeout(nextRound, 1500);
                return;
            }
            if (isFull(board)) {
                message = 'Empate!';
                gameActive = false;
                addScore(10);
                setTimeout(nextRound, 1500);
                return;
            }
            playerTurn = true;
            message = 'Tu turno! (X)';
        }, 500);
    }

    function nextRound() {
        round++;
        if (round > totalRounds) {
            var title = playerScore > aiScore ? '!Victoria!' : playerScore < aiScore ? 'Derrota' : 'Empate';
            var msg = 'Resultado final: Tu ' + playerScore + ' - ' + aiScore + ' IA';
            showResult(title, score + ' pts', msg, function() {
                ocioTresEnRaya(ui, controls, canvas);
            });
            return;
        }
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        winLine = null;
        gameActive = true;
        playerTurn = true;
        cursorPos = 4;
        message = 'Ronda ' + round + '! Tu turno (X)';
    }

    function handleKey(e) {
        if (!gameActive || !playerTurn) return;
        var row = Math.floor(cursorPos / 3);
        var col = cursorPos % 3;
        switch (e.key) {
            case 'ArrowUp': if (row > 0) cursorPos -= 3; e.preventDefault(); break;
            case 'ArrowDown': if (row < 2) cursorPos += 3; e.preventDefault(); break;
            case 'ArrowLeft': if (col > 0) cursorPos--; e.preventDefault(); break;
            case 'ArrowRight': if (col < 2) cursorPos++; e.preventDefault(); break;
            case 'Enter': case ' ': makeMove(cursorPos); e.preventDefault(); break;
        }
    }

    function handleClick(e) {
        var rect = canvas.getBoundingClientRect();
        var mx = (e.clientX - rect.left) * (canvas.width / rect.width) / 2;
        var my = (e.clientY - rect.top) * (canvas.height / rect.height) / 2;
        var col = Math.floor((mx - gridX) / cellSize);
        var row = Math.floor((my - gridY) / cellSize);
        if (col >= 0 && col < 3 && row >= 0 && row < 3) {
            cursorPos = row * 3 + col;
            makeMove(cursorPos);
        }
    }

    document.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);

    function gameLoop() {
        draw();
        animId = requestAnimationFrame(gameLoop);
    }
    gameLoop();

    currentGame = {
        cleanup: function() {
            cancelAnimationFrame(animId);
            document.removeEventListener('keydown', handleKey);
            canvas.removeEventListener('click', handleClick);
        }
    };
}

// ===================== CONECTA 4 =====================

function ocioConecta4(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    const W = container.clientWidth;
    const H = container.clientHeight;

    const cols = 7, rows = 6;
    const cellSize = Math.min((W - 20) / cols, (H - 120) / (rows + 1));
    const boardW = cols * cellSize;
    const boardH = rows * cellSize;
    const boardX = (W - boardW) / 2;
    const boardY = 50;
    const pieceR = cellSize * 0.38;

    let grid = []; // grid[row][col], 0=empty, 1=player(red), 2=ai(yellow)
    for (var r = 0; r < rows; r++) { grid[r] = []; for (var c = 0; c < cols; c++) grid[r][c] = 0; }

    let selectedCol = 3;
    let playerTurn = true;
    let gameActive = true;
    let animId;
    let message = 'Elige columna y pulsa ESPACIO';
    let winCells = null;
    let dropAnim = null; // {col, row, player, y, targetY}
    let flashTimer = 0;

    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        // Board background
        ctx.fillStyle = '#1a3a8a';
        ctx.beginPath();
        ctx.roundRect(boardX - 5, boardY - 5, boardW + 10, boardH + 10, 10);
        ctx.fill();

        // Draw cells
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var cx = boardX + c * cellSize + cellSize / 2;
                var cy = boardY + r * cellSize + cellSize / 2;

                // Hole
                ctx.fillStyle = '#0a1628';
                ctx.beginPath();
                ctx.arc(cx, cy, pieceR + 2, 0, Math.PI * 2);
                ctx.fill();

                var val = grid[r][c];
                if (dropAnim && dropAnim.col === c && dropAnim.row === r) {
                    // Animating piece
                    ctx.fillStyle = dropAnim.player === 1 ? '#e74c3c' : '#f1c40f';
                    ctx.beginPath();
                    ctx.arc(cx, dropAnim.y, pieceR, 0, Math.PI * 2);
                    ctx.fill();
                } else if (val !== 0) {
                    var isWin = winCells && winCells.some(function(w) { return w[0] === r && w[1] === c; });
                    if (isWin && Math.floor(flashTimer / 15) % 2 === 0) {
                        ctx.fillStyle = '#ffd700';
                    } else {
                        ctx.fillStyle = val === 1 ? '#e74c3c' : '#f1c40f';
                    }
                    ctx.beginPath();
                    ctx.arc(cx, cy, pieceR, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Column selector
        if (gameActive && playerTurn && !dropAnim) {
            var scx = boardX + selectedCol * cellSize + cellSize / 2;
            ctx.fillStyle = 'rgba(231, 76, 60, 0.6)';
            ctx.beginPath();
            ctx.arc(scx, boardY - 18, pieceR * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('▼', scx, boardY - 18);
        }

        // Message
        ctx.fillStyle = '#e0e7ff';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, W / 2, boardY + boardH + 25);

        ctx.fillStyle = '#8b8ba0';
        ctx.font = '11px Arial';
        ctx.fillText('Flechas + Espacio o Click', W / 2, boardY + boardH + 42);

        if (winCells) flashTimer++;
    }

    function getLowestRow(col) {
        for (var r = rows - 1; r >= 0; r--) {
            if (grid[r][col] === 0) return r;
        }
        return -1;
    }

    function checkWinAll(player) {
        // Horizontal
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c <= cols - 4; c++) {
                if (grid[r][c] === player && grid[r][c+1] === player && grid[r][c+2] === player && grid[r][c+3] === player) {
                    return [[r,c],[r,c+1],[r,c+2],[r,c+3]];
                }
            }
        }
        // Vertical
        for (var c = 0; c < cols; c++) {
            for (var r = 0; r <= rows - 4; r++) {
                if (grid[r][c] === player && grid[r+1][c] === player && grid[r+2][c] === player && grid[r+3][c] === player) {
                    return [[r,c],[r+1,c],[r+2,c],[r+3,c]];
                }
            }
        }
        // Diagonal \
        for (var r = 0; r <= rows - 4; r++) {
            for (var c = 0; c <= cols - 4; c++) {
                if (grid[r][c] === player && grid[r+1][c+1] === player && grid[r+2][c+2] === player && grid[r+3][c+3] === player) {
                    return [[r,c],[r+1,c+1],[r+2,c+2],[r+3,c+3]];
                }
            }
        }
        // Diagonal /
        for (var r = 3; r < rows; r++) {
            for (var c = 0; c <= cols - 4; c++) {
                if (grid[r][c] === player && grid[r-1][c+1] === player && grid[r-2][c+2] === player && grid[r-3][c+3] === player) {
                    return [[r,c],[r-1,c+1],[r-2,c+2],[r-3,c+3]];
                }
            }
        }
        return null;
    }

    function isBoardFull() {
        for (var c = 0; c < cols; c++) { if (grid[0][c] === 0) return false; }
        return true;
    }

    function aiSelectCol() {
        // Check if AI can win
        for (var c = 0; c < cols; c++) {
            var r = getLowestRow(c);
            if (r >= 0) {
                grid[r][c] = 2;
                if (checkWinAll(2)) { grid[r][c] = 0; return c; }
                grid[r][c] = 0;
            }
        }
        // Block player win
        for (var c = 0; c < cols; c++) {
            var r = getLowestRow(c);
            if (r >= 0) {
                grid[r][c] = 1;
                if (checkWinAll(1)) { grid[r][c] = 0; return c; }
                grid[r][c] = 0;
            }
        }
        // Prefer center
        var prefs = [3, 2, 4, 1, 5, 0, 6];
        for (var i = 0; i < prefs.length; i++) {
            if (getLowestRow(prefs[i]) >= 0) return prefs[i];
        }
        return 0;
    }

    function dropPiece(col, player, callback) {
        var row = getLowestRow(col);
        if (row < 0) { callback(false); return; }
        grid[row][col] = player;
        var targetY = boardY + row * cellSize + cellSize / 2;
        dropAnim = { col: col, row: row, player: player, y: boardY - cellSize, targetY: targetY };

        var dropTimer = setInterval(function() {
            dropAnim.y += 8;
            if (dropAnim.y >= dropAnim.targetY) {
                dropAnim.y = dropAnim.targetY;
                clearInterval(dropTimer);
                dropAnim = null;
                callback(true);
            }
        }, 20);
    }

    function playerDrop() {
        if (!gameActive || !playerTurn || dropAnim) return;
        playerTurn = false;
        dropPiece(selectedCol, 1, function(ok) {
            if (!ok) { playerTurn = true; return; }
            var win = checkWinAll(1);
            if (win) {
                winCells = win;
                gameActive = false;
                message = '!HAS GANADO!';
                addScore(80);
                setTimeout(function() {
                    showResult('!Victoria!', score + ' pts', '!Conecta 4!', function() {
                        ocioConecta4(ui, controls, canvas);
                    });
                }, 1500);
                return;
            }
            if (isBoardFull()) {
                gameActive = false;
                message = 'Empate!';
                addScore(30);
                setTimeout(function() {
                    showResult('Empate', score + ' pts', 'Tablero lleno', function() {
                        ocioConecta4(ui, controls, canvas);
                    });
                }, 1000);
                return;
            }
            message = 'Turno de la IA...';
            setTimeout(function() {
                var aiCol = aiSelectCol();
                dropPiece(aiCol, 2, function() {
                    var win = checkWinAll(2);
                    if (win) {
                        winCells = win;
                        gameActive = false;
                        message = 'La IA ha ganado!';
                        addScore(10);
                        setTimeout(function() {
                            showResult('Derrota', score + ' pts', 'La IA conecto 4', function() {
                                ocioConecta4(ui, controls, canvas);
                            });
                        }, 1500);
                        return;
                    }
                    if (isBoardFull()) {
                        gameActive = false;
                        message = 'Empate!';
                        addScore(30);
                        setTimeout(function() {
                            showResult('Empate', score + ' pts', 'Tablero lleno', function() {
                                ocioConecta4(ui, controls, canvas);
                            });
                        }, 1000);
                        return;
                    }
                    playerTurn = true;
                    message = 'Tu turno! Elige columna';
                });
            }, 600);
        });
    }

    function handleKey(e) {
        if (!gameActive || !playerTurn || dropAnim) return;
        switch (e.key) {
            case 'ArrowLeft': if (selectedCol > 0) selectedCol--; e.preventDefault(); break;
            case 'ArrowRight': if (selectedCol < cols - 1) selectedCol++; e.preventDefault(); break;
            case ' ': case 'Enter': playerDrop(); e.preventDefault(); break;
        }
    }

    function handleClick(e) {
        var rect = canvas.getBoundingClientRect();
        var mx = (e.clientX - rect.left) * (canvas.width / rect.width) / 2;
        var col = Math.floor((mx - boardX) / cellSize);
        if (col >= 0 && col < cols) {
            selectedCol = col;
            playerDrop();
        }
    }

    document.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);

    function gameLoop() {
        draw();
        animId = requestAnimationFrame(gameLoop);
    }
    gameLoop();

    currentGame = {
        cleanup: function() {
            cancelAnimationFrame(animId);
            document.removeEventListener('keydown', handleKey);
            canvas.removeEventListener('click', handleClick);
        }
    };
}

// ===================== MEMORY =====================

function ocioMemory(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    const W = container.clientWidth;
    const H = container.clientHeight;

    const gridCols = 4, gridRows = 4;
    const allEmojis = ['🐶', '🐱', '🐸', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮', '🐷', '🐵'];
    var pairs = allEmojis.slice(0, 8);
    var cards = shuffleArray(pairs.concat(pairs));

    var cardW = Math.min((W - 50) / gridCols, (H - 140) / gridRows) * 0.85;
    var cardH = cardW * 1.2;
    var gap = 8;
    var totalW = gridCols * (cardW + gap) - gap;
    var totalH = gridRows * (cardH + gap) - gap;
    var startX = (W - totalW) / 2;
    var startY = 55;

    let revealed = new Array(16).fill(false);
    let matched = new Array(16).fill(false);
    let selected = [];
    let cursorPos = 0;
    let moves = 0;
    let matchCount = 0;
    let startTime = Date.now();
    let animId;
    let locked = false;
    let flipAnims = {}; // index -> {progress, direction}
    let message = 'Encuentra las parejas!';

    function cardRect(i) {
        var row = Math.floor(i / gridCols);
        var col = i % gridCols;
        return {
            x: startX + col * (cardW + gap),
            y: startY + row * (cardH + gap),
            w: cardW,
            h: cardH
        };
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        // Stats
        var elapsed = Math.floor((Date.now() - startTime) / 1000);
        ctx.fillStyle = '#e0e7ff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Movimientos: ' + moves + '  |  Tiempo: ' + elapsed + 's  |  Parejas: ' + matchCount + '/8', W / 2, 22);

        // Draw cards
        for (var i = 0; i < 16; i++) {
            var r = cardRect(i);
            var isRevealed = revealed[i] || matched[i];
            var flip = flipAnims[i];

            if (matched[i]) {
                // Matched - dim green
                ctx.fillStyle = 'rgba(46, 204, 113, 0.2)';
                ctx.beginPath();
                ctx.roundRect(r.x, r.y, r.w, r.h, 8);
                ctx.fill();
                ctx.font = (cardW * 0.45) + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.globalAlpha = 0.4;
                ctx.fillText(cards[i], r.x + r.w / 2, r.y + r.h / 2);
                ctx.globalAlpha = 1;
            } else if (flip) {
                // Flip animation
                var scale = Math.abs(Math.cos(flip.progress * Math.PI));
                var cx = r.x + r.w / 2;
                ctx.save();
                ctx.translate(cx, 0);
                ctx.scale(scale, 1);
                ctx.translate(-cx, 0);
                if (flip.progress > 0.5 !== isRevealed) {
                    // Back of card
                    ctx.fillStyle = '#7c3aed';
                    ctx.beginPath();
                    ctx.roundRect(r.x, r.y, r.w, r.h, 8);
                    ctx.fill();
                    ctx.fillStyle = '#fff';
                    ctx.font = (cardW * 0.35) + 'px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('?', r.x + r.w / 2, r.y + r.h / 2);
                } else {
                    // Face
                    ctx.fillStyle = '#e8d5f5';
                    ctx.beginPath();
                    ctx.roundRect(r.x, r.y, r.w, r.h, 8);
                    ctx.fill();
                    ctx.font = (cardW * 0.45) + 'px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(cards[i], r.x + r.w / 2, r.y + r.h / 2);
                }
                ctx.restore();
            } else if (isRevealed) {
                ctx.fillStyle = '#e8d5f5';
                ctx.beginPath();
                ctx.roundRect(r.x, r.y, r.w, r.h, 8);
                ctx.fill();
                ctx.font = (cardW * 0.45) + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(cards[i], r.x + r.w / 2, r.y + r.h / 2);
            } else {
                ctx.fillStyle = '#7c3aed';
                ctx.beginPath();
                ctx.roundRect(r.x, r.y, r.w, r.h, 8);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = (cardW * 0.35) + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', r.x + r.w / 2, r.y + r.h / 2);
            }

            // Cursor
            if (i === cursorPos && !locked && !matched[i]) {
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(r.x - 2, r.y - 2, r.w + 4, r.h + 4, 10);
                ctx.stroke();
            }
        }

        // Message
        ctx.fillStyle = '#e0e7ff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, W / 2, startY + totalH + 25);

        // Update flip animations
        for (var idx in flipAnims) {
            flipAnims[idx].progress += 0.06;
            if (flipAnims[idx].progress >= 1) {
                delete flipAnims[idx];
            }
        }
    }

    function selectCard(idx) {
        if (locked || matched[idx] || revealed[idx] || selected.length >= 2) return;

        revealed[idx] = true;
        flipAnims[idx] = { progress: 0 };
        selected.push(idx);

        if (selected.length === 2) {
            moves++;
            locked = true;
            var a = selected[0], b = selected[1];

            if (cards[a] === cards[b]) {
                // Match!
                matchCount++;
                addScore(15);
                message = '!Pareja encontrada!';
                setTimeout(function() {
                    matched[a] = true;
                    matched[b] = true;
                    selected = [];
                    locked = false;
                    message = 'Encuentra las parejas!';

                    if (matchCount >= 8) {
                        var elapsed = Math.floor((Date.now() - startTime) / 1000);
                        var bonus = Math.max(0, 100 - elapsed - moves * 2);
                        addScore(bonus);
                        setTimeout(function() {
                            showResult('!Completado!', score + ' pts', moves + ' movimientos en ' + elapsed + 's', function() {
                                ocioMemory(ui, controls, canvas);
                            });
                        }, 500);
                    }
                }, 600);
            } else {
                message = 'No coinciden...';
                setTimeout(function() {
                    flipAnims[a] = { progress: 0 };
                    flipAnims[b] = { progress: 0 };
                    revealed[a] = false;
                    revealed[b] = false;
                    selected = [];
                    locked = false;
                    message = 'Encuentra las parejas!';
                }, 800);
            }
        }
    }

    function handleKey(e) {
        if (locked) return;
        var row = Math.floor(cursorPos / gridCols);
        var col = cursorPos % gridCols;
        switch (e.key) {
            case 'ArrowUp': if (row > 0) cursorPos -= gridCols; e.preventDefault(); break;
            case 'ArrowDown': if (row < gridRows - 1) cursorPos += gridCols; e.preventDefault(); break;
            case 'ArrowLeft': if (col > 0) cursorPos--; e.preventDefault(); break;
            case 'ArrowRight': if (col < gridCols - 1) cursorPos++; e.preventDefault(); break;
            case 'Enter': case ' ': selectCard(cursorPos); e.preventDefault(); break;
        }
    }

    function handleClick(e) {
        var rect = canvas.getBoundingClientRect();
        var mx = (e.clientX - rect.left) * (canvas.width / rect.width) / 2;
        var my = (e.clientY - rect.top) * (canvas.height / rect.height) / 2;
        for (var i = 0; i < 16; i++) {
            var r = cardRect(i);
            if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                cursorPos = i;
                selectCard(i);
                return;
            }
        }
    }

    document.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);

    function gameLoop() {
        draw();
        animId = requestAnimationFrame(gameLoop);
    }
    gameLoop();

    currentGame = {
        cleanup: function() {
            cancelAnimationFrame(animId);
            document.removeEventListener('keydown', handleKey);
            canvas.removeEventListener('click', handleClick);
        }
    };
}

// ===================== PLATAFORMAS =====================

function ocioPlataformas(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    const W = container.clientWidth;
    const H = container.clientHeight;

    const GRAVITY = 0.5;
    const JUMP_FORCE = -10;
    const MOVE_SPEED = 4;
    const TILE = 28;

    let level = 1;
    let maxLevel = 5;
    let coins = 0;
    let lives = 3;
    let animId;
    let gameOver = false;

    // Player
    let player = { x: 40, y: 0, vx: 0, vy: 0, w: 20, h: 24, onGround: false, facingRight: true };
    let keys = {};
    let cameraX = 0;

    // Level data
    let platforms = [];
    let coinList = [];
    let spikes = [];
    let flagPos = { x: 0, y: 0 };
    let levelWidth = 0;

    function generateLevel(lvl) {
        platforms = [];
        coinList = [];
        spikes = [];
        levelWidth = W * (3 + lvl);

        // Ground with gaps
        var x = 0;
        while (x < levelWidth) {
            var segLen = 80 + Math.random() * 120;
            if (x > 100 && Math.random() < 0.15 + lvl * 0.03) {
                // Gap
                var gapLen = 40 + lvl * 8 + Math.random() * 20;
                // Spike at bottom of gap
                if (Math.random() < 0.4) {
                    spikes.push({ x: x + gapLen / 2 - 10, y: H - 15, w: 20, h: 15 });
                }
                x += gapLen;
            }
            platforms.push({ x: x, y: H - TILE, w: segLen, h: TILE });
            x += segLen;
        }

        // Floating platforms
        var numPlats = 8 + lvl * 4;
        for (var i = 0; i < numPlats; i++) {
            var px = 100 + Math.random() * (levelWidth - 200);
            var py = H - TILE * 2 - Math.random() * (H * 0.5);
            var pw = 50 + Math.random() * 60;
            platforms.push({ x: px, y: py, w: pw, h: TILE * 0.6 });

            // Coin on platform
            if (Math.random() < 0.7) {
                coinList.push({ x: px + pw / 2, y: py - 20, collected: false });
            }
        }

        // Extra coins along the ground
        for (var i = 0; i < 10 + lvl * 3; i++) {
            coinList.push({
                x: 80 + Math.random() * (levelWidth - 160),
                y: H - TILE - 25 - Math.random() * 30,
                collected: false
            });
        }

        // Spikes on some platforms
        if (lvl >= 2) {
            for (var i = 0; i < lvl * 2; i++) {
                var sx = 200 + Math.random() * (levelWidth - 300);
                spikes.push({ x: sx, y: H - TILE - 12, w: 18, h: 12 });
            }
        }

        // Flag at end
        flagPos = { x: levelWidth - 60, y: H - TILE - 40 };

        // Reset player
        player.x = 40;
        player.y = H - TILE - player.h - 5;
        player.vx = 0;
        player.vy = 0;
        cameraX = 0;
    }

    function drawCharacter(px, py) {
        // Simple pixel-art character
        ctx.fillStyle = '#3498db'; // Body
        ctx.fillRect(px + 4, py + 8, 12, 12);
        ctx.fillStyle = '#f1c40f'; // Head
        ctx.fillRect(px + 5, py, 10, 10);
        ctx.fillStyle = '#2c3e50'; // Eyes
        if (player.facingRight) {
            ctx.fillRect(px + 11, py + 3, 3, 3);
        } else {
            ctx.fillRect(px + 6, py + 3, 3, 3);
        }
        // Legs
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(px + 4, py + 20, 5, 4);
        ctx.fillRect(px + 11, py + 20, 5, 4);
    }

    function update() {
        if (gameOver) return;

        // Input
        if (keys['ArrowLeft'] || keys['KeyA']) {
            player.vx = -MOVE_SPEED;
            player.facingRight = false;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            player.vx = MOVE_SPEED;
            player.facingRight = true;
        } else {
            player.vx = 0;
        }

        if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.onGround) {
            player.vy = JUMP_FORCE;
            player.onGround = false;
        }

        // Physics
        player.vy += GRAVITY;
        player.x += player.vx;
        player.y += player.vy;

        // Clamp
        if (player.x < 0) player.x = 0;
        if (player.x > levelWidth - player.w) player.x = levelWidth - player.w;

        // Platform collisions
        player.onGround = false;
        for (var i = 0; i < platforms.length; i++) {
            var p = platforms[i];
            if (player.x + player.w > p.x && player.x < p.x + p.w) {
                if (player.y + player.h >= p.y && player.y + player.h <= p.y + p.h + 8 && player.vy >= 0) {
                    player.y = p.y - player.h;
                    player.vy = 0;
                    player.onGround = true;
                }
            }
        }

        // Fall off screen
        if (player.y > H + 50) {
            lives--;
            if (lives <= 0) {
                gameOver = true;
                addScore(coins * 5);
                setTimeout(function() {
                    showResult('Game Over', score + ' pts', 'Nivel ' + level + ' - ' + coins + ' monedas', function() {
                        ocioPlataformas(ui, controls, canvas);
                    });
                }, 300);
                return;
            }
            player.x = 40;
            player.y = H - TILE - player.h - 5;
            player.vx = 0;
            player.vy = 0;
            cameraX = 0;
        }

        // Spike collision
        for (var i = 0; i < spikes.length; i++) {
            var s = spikes[i];
            if (player.x + player.w > s.x + 3 && player.x < s.x + s.w - 3 &&
                player.y + player.h > s.y + 3 && player.y < s.y + s.h) {
                lives--;
                if (lives <= 0) {
                    gameOver = true;
                    addScore(coins * 5);
                    setTimeout(function() {
                        showResult('Game Over', score + ' pts', 'Nivel ' + level + ' - ' + coins + ' monedas', function() {
                            ocioPlataformas(ui, controls, canvas);
                        });
                    }, 300);
                    return;
                }
                player.x = 40;
                player.y = H - TILE - player.h - 5;
                player.vx = 0;
                player.vy = 0;
                cameraX = 0;
                break;
            }
        }

        // Coin collection
        for (var i = 0; i < coinList.length; i++) {
            var c = coinList[i];
            if (!c.collected) {
                var dx = (player.x + player.w / 2) - c.x;
                var dy = (player.y + player.h / 2) - c.y;
                if (Math.sqrt(dx * dx + dy * dy) < 18) {
                    c.collected = true;
                    coins++;
                    addScore(10);
                }
            }
        }

        // Flag (level complete)
        var dx = (player.x + player.w / 2) - flagPos.x;
        var dy = (player.y + player.h / 2) - flagPos.y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
            if (level >= maxLevel) {
                gameOver = true;
                addScore(coins * 5 + level * 50);
                setTimeout(function() {
                    showResult('!Completado!', score + ' pts', '!Has superado los 5 niveles!', function() {
                        ocioPlataformas(ui, controls, canvas);
                    });
                }, 300);
            } else {
                level++;
                addScore(level * 20);
                generateLevel(level);
            }
        }

        // Camera
        var targetCam = player.x - W / 3;
        cameraX += (targetCam - cameraX) * 0.1;
        if (cameraX < 0) cameraX = 0;
        if (cameraX > levelWidth - W) cameraX = levelWidth - W;
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Sky gradient
        var grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#1a1a3e');
        grad.addColorStop(1, '#2d1b69');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Stars in background
        ctx.fillStyle = '#fff';
        for (var i = 0; i < 30; i++) {
            var sx = ((i * 137 + 50) % (levelWidth * 0.5)) - cameraX * 0.3;
            var sy = (i * 73 + 20) % (H * 0.6);
            if (sx >= -5 && sx <= W + 5) {
                ctx.fillRect(sx, sy, 2, 2);
            }
        }

        ctx.save();
        ctx.translate(-cameraX, 0);

        // Platforms
        for (var i = 0; i < platforms.length; i++) {
            var p = platforms[i];
            if (p.x + p.w < cameraX - 50 || p.x > cameraX + W + 50) continue;
            if (p.y >= H - TILE) {
                // Ground
                ctx.fillStyle = '#27ae60';
                ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(p.x, p.y, p.w, 4);
                // Grass tufts
                ctx.fillStyle = '#2ecc71';
                for (var g = p.x; g < p.x + p.w; g += 12) {
                    ctx.fillRect(g, p.y - 3, 4, 3);
                }
            } else {
                // Floating platform
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.fillStyle = '#a0522d';
                ctx.fillRect(p.x, p.y, p.w, 3);
            }
        }

        // Spikes
        for (var i = 0; i < spikes.length; i++) {
            var s = spikes[i];
            if (s.x + s.w < cameraX - 10 || s.x > cameraX + W + 10) continue;
            ctx.fillStyle = '#c0392b';
            ctx.beginPath();
            ctx.moveTo(s.x, s.y + s.h);
            ctx.lineTo(s.x + s.w / 2, s.y);
            ctx.lineTo(s.x + s.w, s.y + s.h);
            ctx.fill();
        }

        // Coins
        var time = Date.now() / 300;
        for (var i = 0; i < coinList.length; i++) {
            var c = coinList[i];
            if (c.collected) continue;
            if (c.x < cameraX - 20 || c.x > cameraX + W + 20) continue;
            var bob = Math.sin(time + i) * 3;
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(c.x, c.y + bob, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f39c12';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', c.x, c.y + bob);
        }

        // Flag
        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(flagPos.x, flagPos.y, 4, 40);
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(flagPos.x + 4, flagPos.y);
        ctx.lineTo(flagPos.x + 24, flagPos.y + 10);
        ctx.lineTo(flagPos.x + 4, flagPos.y + 20);
        ctx.fill();

        // Player
        drawCharacter(player.x, player.y);

        ctx.restore();

        // HUD
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, W, 28);
        ctx.fillStyle = '#e0e7ff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Nivel ' + level + '/' + maxLevel, 10, 18);
        ctx.textAlign = 'center';
        ctx.fillText('🪙 ' + coins, W / 2, 18);
        ctx.textAlign = 'right';
        ctx.fillText('❤️'.repeat(lives), W - 10, 18);
    }

    function handleKeyDown(e) {
        keys[e.code] = true;
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }
    }
    function handleKeyUp(e) {
        keys[e.code] = false;
    }

    // Touch controls
    let touchLeft = false, touchRight = false, touchJump = false;
    function handleTouchStart(e) {
        e.preventDefault();
        for (var i = 0; i < e.touches.length; i++) {
            var tx = e.touches[i].clientX;
            var ty = e.touches[i].clientY;
            var rect = canvas.getBoundingClientRect();
            var rx = (tx - rect.left) / rect.width;
            var ry = (ty - rect.top) / rect.height;
            if (ry > 0.7) {
                if (rx < 0.3) touchLeft = true;
                else if (rx > 0.7) touchRight = true;
                else touchJump = true;
            } else {
                touchJump = true;
            }
        }
        keys['ArrowLeft'] = touchLeft;
        keys['ArrowRight'] = touchRight;
        if (touchJump) keys['Space'] = true;
    }
    function handleTouchEnd(e) {
        touchLeft = false; touchRight = false; touchJump = false;
        keys['ArrowLeft'] = false;
        keys['ArrowRight'] = false;
        keys['Space'] = false;
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    generateLevel(1);

    function gameLoop() {
        update();
        draw();
        if (!gameOver) {
            animId = requestAnimationFrame(gameLoop);
        }
    }
    animId = requestAnimationFrame(gameLoop);

    currentGame = {
        cleanup: function() {
            gameOver = true;
            cancelAnimationFrame(animId);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchend', handleTouchEnd);
        }
    };
}
