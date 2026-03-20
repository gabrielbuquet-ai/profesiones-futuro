// ==========================================
// HOBBIES - Deportes, Conducir, Musica
// ==========================================

// ===================== DEPORTES =====================

function startDeporte(subtype) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    const canvas = document.getElementById('game-canvas');
    ui.style.pointerEvents = 'auto';

    switch (subtype) {
        case 'futbol': deporteFutbol(ui, controls, canvas); break;
        case 'baloncesto': deporteBaloncesto(ui, controls, canvas); break;
        case 'tenis': deporteTenis(ui, controls, canvas); break;
        case 'natacion': deporteNatacion(ui, controls, canvas); break;
        case 'atletismo': deporteAtletismo(ui, controls, canvas); break;
        case 'boxeo': deporteBoxeo(ui, controls); break;
    }
}

// ========== FUTBOL - Full Match ==========
function deporteFutbol(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let running = true;
    let animId;
    // Match state
    let phase = 'shoot'; // 'shoot' or 'defend'
    let playerGoals = 0;
    let aiGoals = 0;
    let round = 0; // 0-9 (5 shoots + 5 defends alternating)
    const totalRounds = 10;

    // Shoot phase state
    let crosshairX = W / 2;
    let crosshairY = H * 0.25;
    let charging = false;
    let power = 0;
    let ballFlying = false;
    let ball = { x: 0, y: 0 };
    let ballTarget = { x: 0, y: 0 };
    let ballProgress = 0;
    let gkDiveDir = 0;
    let gkDiveProgress = 0;
    let shotResult = '';
    let resultTimer = 0;

    // Defend phase state
    let diveDir = 0; // -1 left, 0 center, 1 right
    let aiShotDir = 0;
    let aiShotHeight = 0;
    let showIndicator = false;
    let indicatorTimer = 0;
    let aiShooting = false;
    let aiBallProgress = 0;
    let aiBall = { x: 0, y: 0 };
    let defendResult = '';
    let defendResultTimer = 0;

    // Goal dimensions
    const goalLeft = W * 0.2;
    const goalRight = W * 0.8;
    const goalTop = 30;
    const goalBottom = goalTop + H * 0.15;
    const goalCenterX = W / 2;
    const goalCenterY = (goalTop + goalBottom) / 2;

    // Crowd
    const crowdEmojis = [];
    for (let i = 0; i < 30; i++) {
        crowdEmojis.push({ x: Math.random() * W, y: Math.random() * (H * 0.12), e: randomFrom(['👏', '🎉', '⚽', '🙌', '🏟️']) });
    }

    let keys = {};

    function startNextRound() {
        if (round >= totalRounds) {
            running = false;
            let title, msg;
            if (playerGoals > aiGoals) { title = 'Victoria!'; msg = 'Has ganado el partido!'; }
            else if (playerGoals < aiGoals) { title = 'Derrota!'; msg = 'El rival ha ganado.'; }
            else { title = 'Empate!'; msg = 'Partido igualado!'; }
            const bonus = playerGoals > aiGoals ? 50 : playerGoals === aiGoals ? 20 : 0;
            addScore(bonus);
            showResult(title, `${playerGoals} - ${aiGoals}`, msg, () => deporteFutbol(ui, controls, canvas));
            return;
        }
        phase = round % 2 === 0 ? 'shoot' : 'defend';
        // Reset shoot state
        crosshairX = W / 2;
        crosshairY = H * 0.25;
        charging = false;
        power = 0;
        ballFlying = false;
        ballProgress = 0;
        gkDiveDir = 0;
        gkDiveProgress = 0;
        shotResult = '';
        resultTimer = 0;
        // Reset defend state
        diveDir = 0;
        aiShotDir = 0;
        aiShotHeight = 0;
        showIndicator = false;
        indicatorTimer = 0;
        aiShooting = false;
        aiBallProgress = 0;
        defendResult = '';
        defendResultTimer = 0;
        if (phase === 'defend') {
            // AI picks shot direction
            aiShotDir = (Math.random() - 0.5) * 2; // -1 to 1
            aiShotHeight = Math.random() * 0.6 + 0.2;
            // Show brief indicator
            showIndicator = true;
            indicatorTimer = 40; // frames of indicator
        }
    }

    function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Field
        ctx.fillStyle = '#1a5c2a';
        ctx.fillRect(0, 0, W, H);
        // Field lines
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, H * 0.15, 0, Math.PI * 2);
        ctx.stroke();

        // Crowd background
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, 0, W, goalTop - 5);
        crowdEmojis.forEach(c => {
            ctx.font = '14px serif';
            ctx.textAlign = 'center';
            ctx.fillText(c.e, c.x, c.y + 14);
        });

        // Goal
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.strokeRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);
        // Goal net
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        for (let x = goalLeft; x < goalRight; x += 12) {
            ctx.beginPath(); ctx.moveTo(x, goalTop); ctx.lineTo(x, goalBottom); ctx.stroke();
        }
        for (let y = goalTop; y < goalBottom; y += 12) {
            ctx.beginPath(); ctx.moveTo(goalLeft, y); ctx.lineTo(goalRight, y); ctx.stroke();
        }

        // Scoreboard
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(W / 2 - 80, H - 50, 160, 40);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Tu ${playerGoals} - ${aiGoals} IA`, W / 2, H - 25);
        ctx.font = '12px Poppins, sans-serif';
        ctx.fillText(`Ronda ${Math.min(round + 1, totalRounds)}/${totalRounds} | ${phase === 'shoot' ? 'DISPARAS' : 'DEFIENDES'}`, W / 2, H - 10);

        if (phase === 'shoot') {
            drawShootPhase();
        } else {
            drawDefendPhase();
        }
    }

    function drawShootPhase() {
        // Goalkeeper (AI)
        const gkX = goalCenterX + gkDiveDir * (goalRight - goalLeft) * 0.3 * gkDiveProgress;
        ctx.font = '35px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧤', gkX, goalBottom - 5);

        if (!ballFlying && shotResult === '') {
            // Crosshair
            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(crosshairX - 15, crosshairY); ctx.lineTo(crosshairX + 15, crosshairY);
            ctx.moveTo(crosshairX, crosshairY - 15); ctx.lineTo(crosshairX, crosshairY + 15);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(crosshairX, crosshairY, 10, 0, Math.PI * 2);
            ctx.stroke();

            // Power bar
            if (charging) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(W / 2 - 60, H * 0.65, 120, 16);
                const pColor = power < 30 ? '#ff4444' : power < 70 ? '#ffaa00' : '#44ff44';
                ctx.fillStyle = pColor;
                ctx.fillRect(W / 2 - 58, H * 0.65 + 2, (116 * power) / 100, 12);
                ctx.fillStyle = '#fff';
                ctx.font = '11px Poppins, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('FUERZA', W / 2, H * 0.65 - 4);
            }

            // Ball at feet
            ctx.font = '28px serif';
            ctx.fillText('⚽', W / 2, H * 0.75);
        }

        if (ballFlying) {
            ctx.font = `${28 - ballProgress * 10}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('⚽', ball.x, ball.y);
        }

        if (shotResult !== '') {
            ctx.fillStyle = shotResult === 'GOL!' ? '#44ff44' : '#ff4444';
            ctx.font = 'bold 36px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(shotResult, W / 2, H * 0.5);
        }
    }

    function drawDefendPhase() {
        // You as goalkeeper
        let gkEmoji = '🧤';
        let gkX = goalCenterX;
        if (diveDir === -1) gkX = goalLeft + (goalRight - goalLeft) * 0.2;
        else if (diveDir === 1) gkX = goalLeft + (goalRight - goalLeft) * 0.8;
        ctx.font = '40px serif';
        ctx.textAlign = 'center';
        ctx.fillText(gkEmoji, gkX, goalBottom - 5);

        // AI kicker
        if (!aiShooting && defendResult === '') {
            ctx.font = '30px serif';
            ctx.fillText('🏃', W / 2, H * 0.75);
            ctx.font = '28px serif';
            ctx.fillText('⚽', W / 2, H * 0.72);

            // Direction indicator (brief flash)
            if (showIndicator && indicatorTimer > 20) {
                ctx.strokeStyle = 'rgba(255,255,0,0.7)';
                ctx.lineWidth = 3;
                const arrowTipX = goalCenterX + aiShotDir * (goalRight - goalLeft) * 0.3;
                const arrowTipY = goalTop + (goalBottom - goalTop) * (1 - aiShotHeight);
                ctx.beginPath();
                ctx.moveTo(W / 2, H * 0.72);
                ctx.lineTo(arrowTipX, arrowTipY);
                ctx.stroke();
                // Arrow head
                ctx.beginPath();
                ctx.arc(arrowTipX, arrowTipY, 6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,0,0.7)';
                ctx.fill();
            }
        }

        if (aiShooting) {
            ctx.font = `${28 - aiBallProgress * 8}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('⚽', aiBall.x, aiBall.y);
        }

        if (defendResult !== '') {
            ctx.fillStyle = defendResult === 'PARADA!' ? '#44ff44' : '#ff4444';
            ctx.font = 'bold 36px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(defendResult, W / 2, H * 0.5);
        }

        // Dive hints
        if (!aiShooting && defendResult === '') {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '12px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(diveDir === -1 ? '< IZQ' : diveDir === 1 ? 'DER >' : 'CENTRO', goalCenterX, goalBottom + 20);
        }
    }

    function update() {
        if (!running) return;

        if (phase === 'shoot') {
            // Move crosshair
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) crosshairX = Math.max(goalLeft + 10, crosshairX - 3);
            if (keys['ArrowRight'] || keys['d'] || keys['D']) crosshairX = Math.min(goalRight - 10, crosshairX + 3);
            if (keys['ArrowUp'] || keys['w'] || keys['W']) crosshairY = Math.max(goalTop + 5, crosshairY - 2);
            if (keys['ArrowDown'] || keys['s'] || keys['S']) crosshairY = Math.min(goalBottom - 5, crosshairY + 2);

            if (charging) {
                power = Math.min(100, power + 2);
            }

            if (ballFlying) {
                ballProgress += 0.04;
                ball.x = W / 2 + (ballTarget.x - W / 2) * ballProgress;
                ball.y = H * 0.75 + (ballTarget.y - H * 0.75) * ballProgress - Math.sin(ballProgress * Math.PI) * 40 * (power / 100);
                gkDiveProgress = Math.min(1, gkDiveProgress + 0.06);

                if (ballProgress >= 1) {
                    ballFlying = false;
                    // Check goal
                    const gkX = goalCenterX + gkDiveDir * (goalRight - goalLeft) * 0.3;
                    const saved = Math.abs(ballTarget.x - gkX) < 35 && ballTarget.y > goalTop && ballTarget.y < goalBottom;
                    const onTarget = ballTarget.x > goalLeft + 5 && ballTarget.x < goalRight - 5 && ballTarget.y > goalTop && ballTarget.y < goalBottom;

                    if (onTarget && !saved) {
                        shotResult = 'GOL!';
                        playerGoals++;
                        addScore(15);
                    } else if (saved) {
                        shotResult = 'PARADO!';
                    } else {
                        shotResult = 'FUERA!';
                    }
                    resultTimer = 60;
                }
            }

            if (resultTimer > 0) {
                resultTimer--;
                if (resultTimer <= 0) {
                    round++;
                    startNextRound();
                }
            }
        }

        if (phase === 'defend') {
            if (indicatorTimer > 0) {
                indicatorTimer--;
                if (indicatorTimer <= 0) {
                    showIndicator = false;
                    // AI shoots after indicator
                    setTimeout(() => {
                        if (!running) return;
                        aiShooting = true;
                        aiBallProgress = 0;
                        const targetX = goalCenterX + aiShotDir * (goalRight - goalLeft) * 0.3;
                        const targetY = goalTop + (goalBottom - goalTop) * (1 - aiShotHeight);
                        aiBall = { x: W / 2, y: H * 0.72, tx: targetX, ty: targetY };
                    }, 300 + Math.random() * 400);
                }
            }

            if (aiShooting) {
                aiBallProgress += 0.05;
                aiBall.x = W / 2 + (aiBall.tx - W / 2) * aiBallProgress;
                aiBall.y = H * 0.72 + (aiBall.ty - H * 0.72) * aiBallProgress - Math.sin(aiBallProgress * Math.PI) * 30;

                if (aiBallProgress >= 1) {
                    aiShooting = false;
                    // Check if saved
                    let gkX = goalCenterX;
                    if (diveDir === -1) gkX = goalLeft + (goalRight - goalLeft) * 0.2;
                    else if (diveDir === 1) gkX = goalLeft + (goalRight - goalLeft) * 0.8;
                    const saved = Math.abs(aiBall.tx - gkX) < 45;
                    const onTarget = aiBall.tx > goalLeft + 5 && aiBall.tx < goalRight - 5;

                    if (onTarget && !saved) {
                        defendResult = 'GOL IA!';
                        aiGoals++;
                    } else if (saved) {
                        defendResult = 'PARADA!';
                        addScore(10);
                    } else {
                        defendResult = 'FUERA!';
                    }
                    defendResultTimer = 60;
                }
            }

            if (defendResultTimer > 0) {
                defendResultTimer--;
                if (defendResultTimer <= 0) {
                    round++;
                    startNextRound();
                }
            }
        }
    }

    function shoot() {
        if (ballFlying || shotResult !== '' || phase !== 'shoot') return;
        ballFlying = true;
        ballProgress = 0;
        // Add some inaccuracy based on power
        const inaccuracy = power > 85 ? 20 : power < 20 ? 25 : 5;
        ballTarget = {
            x: crosshairX + (Math.random() - 0.5) * inaccuracy,
            y: crosshairY + (Math.random() - 0.5) * inaccuracy * 0.5
        };
        ball = { x: W / 2, y: H * 0.75 };
        // GK dives to a random side (sometimes correct)
        const smartness = 0.4;
        if (Math.random() < smartness) {
            gkDiveDir = ballTarget.x < goalCenterX ? -1 : 1;
        } else {
            gkDiveDir = Math.random() < 0.5 ? -1 : 1;
        }
        gkDiveProgress = 0;
        charging = false;
        power = 0;
    }

    function loop() {
        if (!running) return;
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    const kbDown = (e) => {
        keys[e.key] = true;
        if (e.code === 'Space') {
            e.preventDefault();
            if (phase === 'shoot' && !ballFlying && shotResult === '') {
                charging = true;
            }
        }
        if (phase === 'defend' && !aiShooting && defendResult === '') {
            if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') diveDir = -1;
            if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') diveDir = 1;
        }
    };
    const kbUp = (e) => {
        keys[e.key] = false;
        if (e.code === 'Space' && phase === 'shoot') {
            e.preventDefault();
            if (charging) shoot();
        }
    };
    document.addEventListener('keydown', kbDown);
    document.addEventListener('keyup', kbUp);

    controls.innerHTML = `
        <div style="display:flex;gap:6px;width:100%;flex-wrap:wrap;justify-content:center;">
            <button class="control-btn" id="fb-left" style="flex:1;min-width:60px;">A / ←</button>
            <button class="control-btn" id="fb-center" style="flex:1;min-width:60px;">Centro</button>
            <button class="control-btn" id="fb-right" style="flex:1;min-width:60px;">D / →</button>
            <button class="control-btn" id="fb-shoot" style="flex:2;min-width:120px;background:linear-gradient(135deg,#ff512f44,#dd2476aa);">Mantener = Cargar / Soltar = Disparar</button>
        </div>
    `;

    // Touch controls for shoot phase
    let touchCharging = false;
    const shootBtn = document.getElementById('fb-shoot');
    shootBtn.addEventListener('mousedown', (e) => { e.preventDefault(); if (phase === 'shoot') { charging = true; touchCharging = true; } });
    shootBtn.addEventListener('mouseup', (e) => { e.preventDefault(); if (touchCharging) { shoot(); touchCharging = false; } });
    shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); if (phase === 'shoot') { charging = true; touchCharging = true; } });
    shootBtn.addEventListener('touchend', (e) => { e.preventDefault(); if (touchCharging) { shoot(); touchCharging = false; } });

    document.getElementById('fb-left').addEventListener('click', () => {
        if (phase === 'shoot') crosshairX = Math.max(goalLeft + 10, crosshairX - 20);
        if (phase === 'defend') diveDir = -1;
    });
    document.getElementById('fb-center').addEventListener('click', () => {
        if (phase === 'shoot') { crosshairX = W / 2; crosshairY = goalCenterY; }
        if (phase === 'defend') diveDir = 0;
    });
    document.getElementById('fb-right').addEventListener('click', () => {
        if (phase === 'shoot') crosshairX = Math.min(goalRight - 10, crosshairX + 20);
        if (phase === 'defend') diveDir = 1;
    });

    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">DISPARAR: ←/→ apuntar, Espacio mantener+soltar | DEFENDER: A/D elegir lado</div>');

    startNextRound();
    loop();
    currentGame = { cleanup: () => { running = false; cancelAnimationFrame(animId); document.removeEventListener('keydown', kbDown); document.removeEventListener('keyup', kbUp); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ========== BALONCESTO - 1v1 Match ==========
function deporteBaloncesto(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let running = true;
    let animId;
    let phase = 'attack'; // 'attack' or 'defend'
    let playerScore = 0;
    let aiScore = 0;
    let round = 0;
    const totalRounds = 10;

    // Attack state
    let aimAngle = 0; // -1 to 1
    let charging = false;
    let power = 0;
    let ball = null; // flying ball
    let ballStartX, ballStartY;

    // Defend state
    let defenderX = W / 2;
    let aiBall = null;
    let aiCharging = false;
    let aiPower = 0;
    let aiAim = 0;

    let resultText = '';
    let resultTimer = 0;

    // Court
    const hoopX = W / 2;
    const hoopY = H * 0.15;
    const hoopRadius = 22;
    const threePointLine = W * 0.35;

    let keys = {};

    function startNextRound() {
        if (round >= totalRounds) {
            running = false;
            let title, msg;
            if (playerScore > aiScore) { title = 'Victoria!'; msg = 'Has ganado el partido!'; }
            else if (playerScore < aiScore) { title = 'Derrota!'; msg = 'La IA ha ganado.'; }
            else { title = 'Empate!'; msg = 'Igualados!'; }
            addScore(playerScore > aiScore ? 40 : 10);
            showResult(title, `${playerScore} - ${aiScore}`, msg, () => deporteBaloncesto(ui, controls, canvas));
            return;
        }
        phase = round % 2 === 0 ? 'attack' : 'defend';
        ball = null;
        aiBall = null;
        charging = false;
        power = 0;
        aimAngle = 0;
        aiCharging = false;
        aiPower = 0;
        aiAim = 0;
        resultText = '';
        resultTimer = 0;
        defenderX = W / 2;
        if (phase === 'defend') {
            // AI shoots after a delay
            setTimeout(() => {
                if (!running) return;
                aiAim = (Math.random() - 0.5) * 1.2;
                aiPower = 50 + Math.random() * 40;
                launchAiBall();
            }, 800 + Math.random() * 600);
        }
    }

    function launchBall() {
        if (ball || phase !== 'attack') return;
        const startX = W / 2 + aimAngle * W * 0.25;
        const startY = H * 0.75;
        const speed = 3 + (power / 100) * 7;
        const angle = -Math.PI / 2 + aimAngle * 0.4;
        ball = {
            x: startX, y: startY,
            vx: Math.cos(angle) * speed + aimAngle * 2,
            vy: -speed,
            gravity: 0.15
        };
        charging = false;
        power = 0;
    }

    function launchAiBall() {
        if (aiBall || phase !== 'defend') return;
        const startX = W / 2 + aiAim * W * 0.2;
        const startY = H * 0.75;
        const speed = 4 + (aiPower / 100) * 5;
        aiBall = {
            x: startX, y: startY,
            vx: (hoopX - startX) * 0.03 + (Math.random() - 0.5) * 2,
            vy: -speed,
            gravity: 0.15
        };
    }

    function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Court background
        ctx.fillStyle = '#2d1810';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#c4882f';
        ctx.fillRect(0, H * 0.55, W, H * 0.45);
        // Court lines
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hoopX, hoopY + 20, threePointLine * 0.6, 0, Math.PI);
        ctx.stroke();
        // Free throw line
        ctx.beginPath();
        ctx.moveTo(W * 0.3, H * 0.4);
        ctx.lineTo(W * 0.7, H * 0.4);
        ctx.stroke();

        // Backboard
        ctx.fillStyle = '#fff';
        ctx.fillRect(hoopX - 35, hoopY - 40, 70, 45);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(hoopX - 35, hoopY - 40, 70, 45);
        // Hoop
        ctx.strokeStyle = '#ff4500';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(hoopX, hoopY + 5, hoopRadius, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Net lines
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        for (let i = -hoopRadius; i <= hoopRadius; i += 8) {
            ctx.beginPath();
            ctx.moveTo(hoopX + i, hoopY + 8);
            ctx.lineTo(hoopX + i * 0.5, hoopY + 30);
            ctx.stroke();
        }

        // Score
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(W / 2 - 80, H - 50, 160, 40);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Tu ${playerScore} - ${aiScore} IA`, W / 2, H - 25);
        ctx.font = '12px Poppins, sans-serif';
        ctx.fillText(`Ronda ${Math.min(round + 1, totalRounds)}/${totalRounds} | ${phase === 'attack' ? 'ATACAS' : 'DEFIENDES'}`, W / 2, H - 10);

        if (phase === 'attack') {
            // Player emoji at bottom
            ctx.font = '30px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🏀', W / 2 + aimAngle * W * 0.25, H * 0.72);
            ctx.fillText('🧑', W / 2 + aimAngle * W * 0.25, H * 0.78);

            // Aim indicator
            if (!ball && resultText === '') {
                ctx.strokeStyle = 'rgba(255,255,0,0.4)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(W / 2 + aimAngle * W * 0.25, H * 0.72);
                ctx.lineTo(hoopX + aimAngle * 40, hoopY);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Power bar
            if (charging) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(W / 2 - 50, H * 0.85, 100, 14);
                const pColor = power < 30 ? '#ff4444' : power < 70 ? '#ffaa00' : '#44ff44';
                ctx.fillStyle = pColor;
                ctx.fillRect(W / 2 - 48, H * 0.85 + 2, (96 * power) / 100, 10);
            }
        }

        if (phase === 'defend') {
            // Defender
            ctx.font = '35px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🙅', defenderX, H * 0.45);
            // AI shooter
            ctx.font = '28px serif';
            ctx.fillText('🤖', W / 2, H * 0.78);
        }

        // Flying balls
        if (ball) {
            ctx.font = '26px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🏀', ball.x, ball.y);
        }
        if (aiBall) {
            ctx.font = '26px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🏀', aiBall.x, aiBall.y);
        }

        // Result
        if (resultText) {
            ctx.fillStyle = resultText.includes('+') ? '#44ff44' : '#ff8844';
            ctx.font = 'bold 30px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(resultText, W / 2, H * 0.5);
        }
    }

    function update() {
        if (!running) return;

        if (phase === 'attack') {
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) aimAngle = Math.max(-1, aimAngle - 0.03);
            if (keys['ArrowRight'] || keys['d'] || keys['D']) aimAngle = Math.min(1, aimAngle + 0.03);
            if (charging) power = Math.min(100, power + 1.5);
        }

        if (phase === 'defend') {
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) defenderX = Math.max(W * 0.15, defenderX - 4);
            if (keys['ArrowRight'] || keys['d'] || keys['D']) defenderX = Math.min(W * 0.85, defenderX + 4);
        }

        // Ball physics (attack)
        if (ball) {
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vy += ball.gravity;
            // Check basket
            if (Math.abs(ball.x - hoopX) < hoopRadius && Math.abs(ball.y - (hoopY + 5)) < 12 && ball.vy > 0) {
                const dist = Math.abs(ball.x - hoopX);
                const pts = dist < 8 ? 3 : 2;
                playerScore += pts;
                addScore(pts * 5);
                resultText = `+${pts} puntos!`;
                ball = null;
                resultTimer = 60;
            } else if (ball.y > H + 30 || ball.x < -30 || ball.x > W + 30) {
                resultText = 'Fallaste!';
                ball = null;
                resultTimer = 60;
            }
        }

        // AI ball physics (defend)
        if (aiBall) {
            aiBall.x += aiBall.vx;
            aiBall.y += aiBall.vy;
            aiBall.vy += aiBall.gravity;
            // Block check - if defender is close when ball passes through defend zone
            if (aiBall.y < H * 0.5 && aiBall.y > H * 0.35 && Math.abs(aiBall.x - defenderX) < 35) {
                resultText = 'BLOQUEADO!';
                addScore(8);
                aiBall = null;
                resultTimer = 60;
            } else if (Math.abs(aiBall.x - hoopX) < hoopRadius && Math.abs(aiBall.y - (hoopY + 5)) < 12 && aiBall.vy > 0) {
                aiScore += 2;
                resultText = 'IA anota!';
                aiBall = null;
                resultTimer = 60;
            } else if (aiBall.y > H + 30 || aiBall.x < -30 || aiBall.x > W + 30) {
                resultText = 'IA falla!';
                addScore(3);
                aiBall = null;
                resultTimer = 60;
            }
        }

        if (resultTimer > 0) {
            resultTimer--;
            if (resultTimer <= 0) {
                round++;
                startNextRound();
            }
        }
    }

    function loop() {
        if (!running) return;
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    const kbDown = (e) => {
        keys[e.key] = true;
        if (e.code === 'Space') {
            e.preventDefault();
            if (phase === 'attack' && !ball && resultText === '') charging = true;
        }
    };
    const kbUp = (e) => {
        keys[e.key] = false;
        if (e.code === 'Space') {
            e.preventDefault();
            if (charging) launchBall();
        }
    };
    document.addEventListener('keydown', kbDown);
    document.addEventListener('keyup', kbUp);

    controls.innerHTML = `
        <div style="display:flex;gap:6px;width:100%;flex-wrap:wrap;justify-content:center;">
            <button class="control-btn" id="bk-left" style="flex:1;min-width:60px;">← Izq</button>
            <button class="control-btn" id="bk-shoot" style="flex:2;min-width:120px;background:linear-gradient(135deg,#ff450044,#ff8c0044);">Mantener = Cargar / Soltar = Lanzar</button>
            <button class="control-btn" id="bk-right" style="flex:1;min-width:60px;">Der →</button>
        </div>
    `;

    let bkCharging = false;
    document.getElementById('bk-shoot').addEventListener('mousedown', (e) => { e.preventDefault(); if (phase === 'attack' && !ball && resultText === '') { charging = true; bkCharging = true; } });
    document.getElementById('bk-shoot').addEventListener('mouseup', (e) => { e.preventDefault(); if (bkCharging) { launchBall(); bkCharging = false; } });
    document.getElementById('bk-shoot').addEventListener('touchstart', (e) => { e.preventDefault(); if (phase === 'attack' && !ball && resultText === '') { charging = true; bkCharging = true; } });
    document.getElementById('bk-shoot').addEventListener('touchend', (e) => { e.preventDefault(); if (bkCharging) { launchBall(); bkCharging = false; } });

    let lInt, rInt;
    document.getElementById('bk-left').addEventListener('mousedown', () => { const fn = () => { if (phase === 'attack') aimAngle = Math.max(-1, aimAngle - 0.05); else defenderX = Math.max(W * 0.15, defenderX - 6); }; fn(); lInt = setInterval(fn, 30); });
    document.getElementById('bk-left').addEventListener('mouseup', () => clearInterval(lInt));
    document.getElementById('bk-left').addEventListener('mouseleave', () => clearInterval(lInt));
    document.getElementById('bk-left').addEventListener('touchstart', (e) => { e.preventDefault(); const fn = () => { if (phase === 'attack') aimAngle = Math.max(-1, aimAngle - 0.05); else defenderX = Math.max(W * 0.15, defenderX - 6); }; fn(); lInt = setInterval(fn, 30); });
    document.getElementById('bk-left').addEventListener('touchend', () => clearInterval(lInt));

    document.getElementById('bk-right').addEventListener('mousedown', () => { const fn = () => { if (phase === 'attack') aimAngle = Math.min(1, aimAngle + 0.05); else defenderX = Math.min(W * 0.85, defenderX + 6); }; fn(); rInt = setInterval(fn, 30); });
    document.getElementById('bk-right').addEventListener('mouseup', () => clearInterval(rInt));
    document.getElementById('bk-right').addEventListener('mouseleave', () => clearInterval(rInt));
    document.getElementById('bk-right').addEventListener('touchstart', (e) => { e.preventDefault(); const fn = () => { if (phase === 'attack') aimAngle = Math.min(1, aimAngle + 0.05); else defenderX = Math.min(W * 0.85, defenderX + 6); }; fn(); rInt = setInterval(fn, 30); });
    document.getElementById('bk-right').addEventListener('touchend', () => clearInterval(rInt));

    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">ATAQUE: ←/→ apuntar, Espacio cargar+soltar | DEFENSA: A/D mover bloqueador</div>');

    startNextRound();
    loop();
    currentGame = { cleanup: () => { running = false; cancelAnimationFrame(animId); clearInterval(lInt); clearInterval(rInt); document.removeEventListener('keydown', kbDown); document.removeEventListener('keyup', kbUp); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ========== TENIS - Rally Match ==========
function deporteTenis(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let running = true;
    let animId;

    // Tennis scoring
    const pointNames = ['0', '15', '30', '40'];
    let playerPoints = 0;
    let aiPoints = 0;
    let playerGames = 0;
    let aiGames = 0;
    const gamesToWin = 3;

    // Court
    const courtLeft = W * 0.08;
    const courtRight = W * 0.92;
    const courtTop = 30;
    const courtBottom = H - 30;
    const netY = H / 2;

    // Paddles
    let playerX = W / 2;
    const playerY = courtBottom - 20;
    const paddleW = 50;
    let aiX = W / 2;
    const aiY = courtTop + 20;
    const aiSpeed = 3.5;

    // Ball
    let ball = { x: W / 2, y: netY, vx: 0, vy: 0, active: false, side: 'none' };
    let serving = true;
    let serverIsPlayer = true;
    let canSwing = false;
    let swingResult = '';
    let swingTimer = 0;

    let keys = {};

    function resetBall(server) {
        serving = true;
        serverIsPlayer = server;
        ball = {
            x: server ? playerX : aiX,
            y: server ? playerY - 20 : aiY + 20,
            vx: 0, vy: 0, active: false, side: 'none'
        };
        canSwing = false;
        swingResult = '';
        swingTimer = 0;
        // Auto-serve after a short delay
        setTimeout(() => {
            if (!running) return;
            serving = false;
            ball.active = true;
            if (serverIsPlayer) {
                ball.vy = -4 - Math.random() * 2;
                ball.vx = (Math.random() - 0.5) * 3;
                ball.side = 'going-up';
            } else {
                ball.vy = 4 + Math.random() * 2;
                ball.vx = (Math.random() - 0.5) * 3;
                ball.side = 'going-down';
            }
        }, 600);
    }

    function scorePoint(winner) {
        if (winner === 'player') {
            playerPoints++;
        } else {
            aiPoints++;
        }

        // Check game win (simplified: first to 4 with 2 ahead after deuce)
        let gameWon = false;
        if (playerPoints >= 4 && playerPoints - aiPoints >= 2) {
            playerGames++;
            playerPoints = 0;
            aiPoints = 0;
            gameWon = true;
        } else if (aiPoints >= 4 && aiPoints - playerPoints >= 2) {
            aiGames++;
            playerPoints = 0;
            aiPoints = 0;
            gameWon = true;
        }

        // Check match win
        if (playerGames >= gamesToWin) {
            running = false;
            addScore(60);
            showResult('Victoria!', `${playerGames}-${aiGames}`, 'Has ganado el partido de tenis!', () => deporteTenis(ui, controls, canvas));
            return;
        }
        if (aiGames >= gamesToWin) {
            running = false;
            addScore(10);
            showResult('Derrota!', `${playerGames}-${aiGames}`, 'La IA gana el partido.', () => deporteTenis(ui, controls, canvas));
            return;
        }

        swingResult = winner === 'player' ? 'Punto!' : 'Punto IA!';
        swingTimer = 50;
    }

    function getScoreText() {
        let pPts, aPts;
        if (playerPoints >= 3 && aiPoints >= 3) {
            if (playerPoints === aiPoints) return 'Deuce';
            return playerPoints > aiPoints ? 'Ventaja Tu' : 'Ventaja IA';
        }
        pPts = pointNames[Math.min(playerPoints, 3)];
        aPts = pointNames[Math.min(aiPoints, 3)];
        return `${pPts} - ${aPts}`;
    }

    function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Court
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(0, 0, W, H);
        // Court border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(courtLeft, courtTop, courtRight - courtLeft, courtBottom - courtTop);
        // Service boxes
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(courtLeft, netY); ctx.lineTo(courtRight, netY); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(W / 2, courtTop); ctx.lineTo(W / 2, courtBottom); ctx.stroke();
        // Net
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(courtLeft - 10, netY); ctx.lineTo(courtRight + 10, netY); ctx.stroke();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(courtLeft, netY); ctx.lineTo(courtRight, netY); ctx.stroke();
        ctx.setLineDash([]);

        // AI paddle
        ctx.font = '30px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏸', aiX, aiY);

        // Player paddle
        ctx.fillText('🏸', playerX, playerY);

        // Ball
        if (ball.active || serving) {
            ctx.font = '22px serif';
            ctx.fillText('🎾', ball.x, ball.y);
            // Ball shadow
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(ball.x, ball.y + 5, 8, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Score display
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, W, 26);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Games: Tu ${playerGames} - ${aiGames} IA  |  ${getScoreText()}`, W / 2, 18);

        // Result text
        if (swingResult) {
            ctx.fillStyle = swingResult.includes('IA') ? '#ff6666' : '#66ff66';
            ctx.font = 'bold 28px Poppins, sans-serif';
            ctx.fillText(swingResult, W / 2, H / 2);
        }
    }

    function update() {
        if (!running) return;

        // Player movement
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) playerX = Math.max(courtLeft + 20, playerX - 5);
        if (keys['ArrowRight'] || keys['d'] || keys['D']) playerX = Math.min(courtRight - 20, playerX + 5);

        // AI movement - track ball with some delay and occasional mistakes
        if (ball.active && ball.side === 'going-up') {
            const targetX = ball.x + ball.vx * 5;
            const diff = targetX - aiX;
            const moveSpeed = aiSpeed * (Math.random() > 0.05 ? 1 : 0); // occasionally freeze
            if (Math.abs(diff) > 5) aiX += Math.sign(diff) * Math.min(Math.abs(diff) * 0.08, moveSpeed);
            aiX = Math.max(courtLeft + 20, Math.min(courtRight - 20, aiX));
        }

        if (swingTimer > 0) {
            swingTimer--;
            if (swingTimer <= 0) {
                resetBall(!serverIsPlayer);
            }
            return;
        }

        if (!ball.active) return;

        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall bounce
        if (ball.x < courtLeft + 5) { ball.x = courtLeft + 5; ball.vx = Math.abs(ball.vx); }
        if (ball.x > courtRight - 5) { ball.x = courtRight - 5; ball.vx = -Math.abs(ball.vx); }

        // Player hit zone
        if (ball.side === 'going-down' && ball.y > playerY - 25 && ball.y < playerY + 5 && Math.abs(ball.x - playerX) < paddleW / 2) {
            canSwing = true;
        }

        // Auto-return for ball reaching player zone
        if (ball.side === 'going-down' && ball.y > playerY - 20 && ball.y < playerY + 5 && Math.abs(ball.x - playerX) < paddleW / 2) {
            if (keys[' '] || keys['Space']) {
                // Good timing swing
                ball.vy = -(5 + Math.random() * 2);
                ball.vx = (ball.x - playerX) * 0.15 + (Math.random() - 0.5) * 2;
                ball.side = 'going-up';
                canSwing = false;
                addScore(2);
            }
        }

        // Auto hit if ball just reaches player zone (don't let it pass without a chance)
        if (ball.side === 'going-down' && ball.y >= playerY - 5 && Math.abs(ball.x - playerX) < paddleW / 2 && !keys[' ']) {
            // Weak auto return
            ball.vy = -(3 + Math.random());
            ball.vx = (ball.x - playerX) * 0.1;
            ball.side = 'going-up';
            canSwing = false;
            addScore(1);
        }

        // AI hit zone
        if (ball.side === 'going-up' && ball.y < aiY + 15 && ball.y > aiY - 10 && Math.abs(ball.x - aiX) < paddleW / 2) {
            // AI returns - occasionally misses
            if (Math.random() > 0.12) {
                ball.vy = 4 + Math.random() * 2;
                ball.vx = (ball.x - aiX) * 0.15 + (Math.random() - 0.5) * 3;
                ball.side = 'going-down';
            }
        }

        // Player miss
        if (ball.y > courtBottom + 20) {
            ball.active = false;
            scorePoint('ai');
        }
        // AI miss
        if (ball.y < courtTop - 20) {
            ball.active = false;
            scorePoint('player');
        }
    }

    function loop() {
        if (!running) return;
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    const kbDown = (e) => {
        keys[e.key] = true;
        if (e.code === 'Space') { e.preventDefault(); keys[' '] = true; }
    };
    const kbUp = (e) => {
        keys[e.key] = false;
        if (e.code === 'Space') keys[' '] = false;
    };
    document.addEventListener('keydown', kbDown);
    document.addEventListener('keyup', kbUp);

    controls.innerHTML = `
        <button class="control-btn" style="flex:1;" id="tennis-left">← Izq</button>
        <button class="control-btn" style="flex:1.5;background:linear-gradient(135deg,#43e97b44,#38f9d744);" id="tennis-swing">Golpear (Espacio)</button>
        <button class="control-btn" style="flex:1;" id="tennis-right">Der →</button>
    `;

    let tLInt, tRInt;
    const ml = () => { playerX = Math.max(courtLeft + 20, playerX - 8); };
    const mr = () => { playerX = Math.min(courtRight - 20, playerX + 8); };
    document.getElementById('tennis-left').addEventListener('mousedown', () => { ml(); tLInt = setInterval(ml, 30); });
    document.getElementById('tennis-left').addEventListener('mouseup', () => clearInterval(tLInt));
    document.getElementById('tennis-left').addEventListener('mouseleave', () => clearInterval(tLInt));
    document.getElementById('tennis-left').addEventListener('touchstart', (e) => { e.preventDefault(); ml(); tLInt = setInterval(ml, 30); });
    document.getElementById('tennis-left').addEventListener('touchend', () => clearInterval(tLInt));
    document.getElementById('tennis-right').addEventListener('mousedown', () => { mr(); tRInt = setInterval(mr, 30); });
    document.getElementById('tennis-right').addEventListener('mouseup', () => clearInterval(tRInt));
    document.getElementById('tennis-right').addEventListener('mouseleave', () => clearInterval(tRInt));
    document.getElementById('tennis-right').addEventListener('touchstart', (e) => { e.preventDefault(); mr(); tRInt = setInterval(mr, 30); });
    document.getElementById('tennis-right').addEventListener('touchend', () => clearInterval(tRInt));

    document.getElementById('tennis-swing').addEventListener('mousedown', () => { keys[' '] = true; });
    document.getElementById('tennis-swing').addEventListener('mouseup', () => { keys[' '] = false; });
    document.getElementById('tennis-swing').addEventListener('touchstart', (e) => { e.preventDefault(); keys[' '] = true; });
    document.getElementById('tennis-swing').addEventListener('touchend', () => { keys[' '] = false; });

    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">A/← D/→ mover | Espacio: golpear (timing importa!)</div>');

    resetBall(true);
    loop();
    currentGame = { cleanup: () => { running = false; cancelAnimationFrame(animId); clearInterval(tLInt); clearInterval(tRInt); document.removeEventListener('keydown', kbDown); document.removeEventListener('keyup', kbUp); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ========== NATACION - Race vs AI ==========
function deporteNatacion(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let running = true;
    let animId;
    const target = 100;

    let playerDist = 0;
    let playerSpeed = 0;
    let taps = 0;

    let aiDist = 0;
    let aiSpeed = 0;
    let aiBaseSpeed = 0.6 + Math.random() * 0.3;
    let aiVariance = 0;

    let waveOffset = 0;
    let finished = false;

    function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Pool background
        ctx.fillStyle = '#0a3d6b';
        ctx.fillRect(0, 0, W, H);

        // Two lanes
        const laneH = H * 0.35;
        const lane1Y = H * 0.15;
        const lane2Y = H * 0.55;

        // Water wave effect
        waveOffset += 0.05;

        // Lane 1 - Player
        ctx.fillStyle = '#1a6faa';
        ctx.fillRect(0, lane1Y, W, laneH);
        // Wave lines
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        for (let y = lane1Y + 10; y < lane1Y + laneH; y += 15) {
            ctx.beginPath();
            for (let x = 0; x < W; x += 5) {
                ctx.lineTo(x, y + Math.sin(x * 0.05 + waveOffset + y * 0.1) * 3);
            }
            ctx.stroke();
        }
        // Lane divider
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, lane1Y + laneH); ctx.lineTo(W, lane1Y + laneH);
        ctx.stroke();
        ctx.setLineDash([]);

        // Lane 2 - AI
        ctx.fillStyle = '#155a8a';
        ctx.fillRect(0, lane2Y, W, laneH);
        for (let y = lane2Y + 10; y < lane2Y + laneH; y += 15) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            for (let x = 0; x < W; x += 5) {
                ctx.lineTo(x, y + Math.sin(x * 0.05 + waveOffset + y * 0.1 + 1) * 3);
            }
            ctx.stroke();
        }

        // Start/Finish lines
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(W * 0.05, lane1Y, 3, laneH * 2 + (lane2Y - lane1Y - laneH));
        ctx.fillRect(W * 0.95, lane1Y, 3, laneH * 2 + (lane2Y - lane1Y - laneH));

        // Lane labels
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('TU', 8, lane1Y + 18);
        ctx.fillText('IA', 8, lane2Y + 18);

        // Player swimmer position
        const playerPx = W * 0.05 + (W * 0.9) * (playerDist / target);
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏊', Math.min(playerPx, W * 0.95), lane1Y + laneH / 2 + 8);

        // AI swimmer position
        const aiPx = W * 0.05 + (W * 0.9) * (aiDist / target);
        ctx.fillText('🏊', Math.min(aiPx, W * 0.95), lane2Y + laneH / 2 + 8);

        // Splash effects near swimmers
        if (playerSpeed > 0.5) {
            ctx.font = '14px serif';
            ctx.fillText('💦', playerPx - 20, lane1Y + laneH / 2);
        }
        if (aiSpeed > 0.3) {
            ctx.font = '14px serif';
            ctx.fillText('💦', aiPx - 20, lane2Y + laneH / 2);
        }

        // HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, W, 30);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Tu: ${Math.floor(playerDist)}m  |  IA: ${Math.floor(aiDist)}m  |  Meta: ${target}m`, W / 2, 20);

        // Speed indicator
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(W / 2 - 50, H - 25, 100, 16);
        const sColor = playerSpeed > 1.2 ? '#44ff44' : playerSpeed > 0.5 ? '#ffaa00' : '#ff4444';
        ctx.fillStyle = sColor;
        ctx.fillRect(W / 2 - 48, H - 23, Math.min(96, (96 * playerSpeed) / 2), 12);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Poppins, sans-serif';
        ctx.fillText('Velocidad', W / 2, H - 5);
    }

    function update() {
        if (!running || finished) return;

        // Player friction
        playerSpeed *= 0.97;
        playerDist += playerSpeed * 0.15;

        // AI movement with variance
        aiVariance += (Math.random() - 0.5) * 0.1;
        aiVariance = Math.max(-0.3, Math.min(0.3, aiVariance));
        aiSpeed = Math.max(0, aiBaseSpeed + aiVariance + Math.sin(Date.now() * 0.002) * 0.15);
        aiDist += aiSpeed * 0.15;

        setScore(Math.floor(playerDist));

        // Check finish
        if (playerDist >= target && !finished) {
            finished = true;
            running = false;
            const won = playerDist >= target && aiDist < target;
            addScore(won ? 50 : 10);
            showResult(won ? 'Has ganado!' : 'Has perdido!', `${Math.floor(taps)} brazadas`,
                won ? 'Llegaste primero!' : 'La IA fue mas rapida',
                () => deporteNatacion(ui, controls, canvas));
        }
        if (aiDist >= target && !finished) {
            finished = true;
            running = false;
            addScore(10);
            showResult('Has perdido!', `${Math.floor(taps)} brazadas`, 'La IA llego primero!',
                () => deporteNatacion(ui, controls, canvas));
        }
    }

    function loop() {
        if (!running) return;
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    const swim = () => {
        if (finished) return;
        taps++;
        playerSpeed = Math.min(2.5, playerSpeed + 0.4);
    };

    const kbHandler = (e) => {
        if (e.code === 'Space') { e.preventDefault(); swim(); }
    };
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = `<button class="control-btn" style="flex:1; font-size: 1.3rem; padding: 20px;" id="swim-btn">🏊 NADAR (Espacio)</button>`;
    document.getElementById('swim-btn').addEventListener('mousedown', (e) => { e.preventDefault(); swim(); });
    document.getElementById('swim-btn').addEventListener('touchstart', (e) => { e.preventDefault(); swim(); });

    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">Pulsa Espacio o el boton lo mas rapido posible!</div>');

    loop();
    currentGame = { cleanup: () => { running = false; finished = true; cancelAnimationFrame(animId); document.removeEventListener('keydown', kbHandler); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ========== ATLETISMO - Race vs AI Runners ==========
function deporteAtletismo(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let running = true;
    let animId;
    const target = 200;

    // Player
    let playerDist = 0;
    let playerSpeed = 0;
    let jumping = false;
    let jumpY = 0;
    let jumpVel = 0;

    // AI Runners (3 of them)
    const aiRunners = [
        { dist: 0, speed: 0, baseSpeed: 0.5 + Math.random() * 0.2, emoji: '🏃', name: 'Runner A', jumpY: 0, jumping: false },
        { dist: 0, speed: 0, baseSpeed: 0.6 + Math.random() * 0.2, emoji: '🏃‍♀️', name: 'Runner B', jumpY: 0, jumping: false },
        { dist: 0, speed: 0, baseSpeed: 0.7 + Math.random() * 0.15, emoji: '🏃‍♂️', name: 'Runner C', jumpY: 0, jumping: false }
    ];

    // Obstacles (shared for all runners)
    let obstacles = [];
    for (let i = 25; i < target; i += 18 + Math.random() * 15) {
        obstacles.push({ pos: i, type: randomFrom(['🚧', '🪨', '🔶']) });
    }

    let cameraX = 0;
    let finished = false;

    // Track visual parameters
    const trackY = H * 0.3;
    const laneH = (H * 0.55) / 4; // 4 lanes

    function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, trackY);
        skyGrad.addColorStop(0, '#87ceeb');
        skyGrad.addColorStop(1, '#e0f0ff');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, trackY);
        // Clouds
        ctx.font = '20px serif';
        ctx.fillText('☁️', (W * 0.2 - cameraX * 0.1) % (W + 40) - 20, 25);
        ctx.fillText('☁️', (W * 0.6 - cameraX * 0.15) % (W + 40) - 20, 40);
        ctx.fillText('⛅', (W * 0.8 - cameraX * 0.08) % (W + 40) - 20, 20);

        // Track
        ctx.fillStyle = '#d4874a';
        ctx.fillRect(0, trackY, W, H - trackY);
        // Lane dividers
        for (let i = 0; i <= 4; i++) {
            const y = trackY + i * laneH;
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = i === 0 || i === 4 ? 3 : 1;
            ctx.setLineDash(i === 0 || i === 4 ? [] : [8, 8]);
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(W, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Distance markers on track
        const startPx = -cameraX;
        for (let m = 0; m <= target; m += 20) {
            const px = (m / target) * W * 3 + startPx;
            if (px > -20 && px < W + 20) {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.font = '10px Poppins, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`${m}m`, px, trackY + H * 0.58);
            }
        }

        // Obstacles
        obstacles.forEach(o => {
            const px = (o.pos / target) * W * 3 + startPx;
            if (px > -30 && px < W + 30) {
                for (let lane = 0; lane < 4; lane++) {
                    const oy = trackY + lane * laneH + laneH / 2 + 8;
                    ctx.font = '18px serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(o.type, px, oy);
                }
            }
        });

        // Draw runners
        const allRunners = [
            { dist: playerDist, jy: jumpY, emoji: '🧑‍🦰', lane: 0, isPlayer: true },
            ...aiRunners.map((r, i) => ({ dist: r.dist, jy: r.jumpY, emoji: r.emoji, lane: i + 1, isPlayer: false }))
        ];

        allRunners.forEach(r => {
            const px = (r.dist / target) * W * 3 + startPx;
            const py = trackY + r.lane * laneH + laneH / 2 + 8 - r.jy;
            if (px > -30 && px < W + 30) {
                ctx.font = '28px serif';
                ctx.textAlign = 'center';
                ctx.fillText(r.emoji, px, py);
                if (r.isPlayer) {
                    // Highlight player
                    ctx.strokeStyle = '#ffcc00';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(px, py - 8, 18, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        });

        // Finish line
        const finishPx = (target / target) * W * 3 + startPx;
        if (finishPx > 0 && finishPx < W + 20) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(finishPx, trackY, 4, H - trackY);
            ctx.font = '14px serif';
            ctx.fillText('🏁', finishPx, trackY - 5);
        }

        // HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, W, 28);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Tu: ${Math.floor(playerDist)}m | Meta: ${target}m | Vel: ${playerSpeed.toFixed(1)}`, W / 2, 19);

        // Jump indicator
        if (jumping) {
            ctx.fillStyle = '#ffcc00';
            ctx.font = '11px Poppins, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('SALTO!', W - 10, 19);
        }
    }

    function update() {
        if (!running || finished) return;

        // Player physics
        playerSpeed *= 0.97;
        playerDist += playerSpeed * 0.12;

        // Jump physics
        if (jumping) {
            jumpVel -= 1.5;
            jumpY += jumpVel;
            if (jumpY <= 0) { jumpY = 0; jumping = false; jumpVel = 0; }
        }

        // AI runners
        aiRunners.forEach(ai => {
            ai.speed = ai.baseSpeed + Math.sin(Date.now() * 0.003 + ai.baseSpeed * 10) * 0.15 + (Math.random() - 0.5) * 0.05;
            ai.dist += ai.speed * 0.12;

            // AI obstacle avoidance (jump automatically with some delay/miss chance)
            obstacles.forEach(o => {
                if (!o['cleared_' + ai.name] && Math.abs(ai.dist - o.pos) < 3) {
                    if (Math.random() > 0.25) {
                        ai.jumping = true;
                        ai.jumpY = 30;
                        o['cleared_' + ai.name] = true;
                    } else {
                        ai.speed = Math.max(0, ai.speed - 0.8);
                        o['cleared_' + ai.name] = true;
                    }
                }
            });
            if (ai.jumping) {
                ai.jumpY = Math.max(0, ai.jumpY - 2);
                if (ai.jumpY <= 0) ai.jumping = false;
            }
        });

        // Player obstacle check
        obstacles.forEach(o => {
            if (!o.playerCleared && Math.abs(playerDist - o.pos) < 2.5) {
                if (jumpY > 15) {
                    o.playerCleared = true;
                    addScore(10);
                } else {
                    playerSpeed = Math.max(0, playerSpeed - 1.5);
                    o.playerCleared = true;
                    addScore(-5);
                }
            }
        });

        // Camera follows player
        const playerPx = (playerDist / target) * W * 3;
        cameraX = Math.max(0, playerPx - W * 0.3);

        setScore(Math.floor(playerDist));

        // Check finish
        const allDists = [{ name: 'Tu', dist: playerDist, isPlayer: true }, ...aiRunners.map(r => ({ name: r.name, dist: r.dist, isPlayer: false }))];
        const anyFinished = allDists.some(d => d.dist >= target);
        if (anyFinished && !finished) {
            finished = true;
            running = false;
            allDists.sort((a, b) => b.dist - a.dist);
            const playerRank = allDists.findIndex(d => d.isPlayer) + 1;
            const won = playerRank === 1;
            addScore(won ? 50 : Math.max(0, (4 - playerRank) * 15));
            showResult(won ? 'Has ganado!' : `Posicion ${playerRank}`,
                `${Math.floor(playerDist)}m`,
                won ? 'Primero en llegar!' : `Quedaste en posicion ${playerRank} de 4`,
                () => deporteAtletismo(ui, controls, canvas));
        }
    }

    function loop() {
        if (!running) return;
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    const run = () => { if (!finished) playerSpeed = Math.min(2.5, playerSpeed + 0.5); };
    const jump = () => { if (!jumping && !finished) { jumping = true; jumpVel = 12; } };

    const kbHandler = (e) => {
        if (e.code === 'Space') { e.preventDefault(); run(); }
        if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') { e.preventDefault(); jump(); }
    };
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = `
        <button class="control-btn" style="flex:1; font-size: 1.1rem; padding: 18px;" id="run-btn">🏃 CORRER</button>
        <button class="control-btn" style="flex:1; font-size: 1.1rem; padding: 18px;" id="jump-btn">🦘 SALTAR</button>
    `;
    document.getElementById('run-btn').addEventListener('mousedown', (e) => { e.preventDefault(); run(); });
    document.getElementById('run-btn').addEventListener('touchstart', (e) => { e.preventDefault(); run(); });
    document.getElementById('jump-btn').addEventListener('mousedown', (e) => { e.preventDefault(); jump(); });
    document.getElementById('jump-btn').addEventListener('touchstart', (e) => { e.preventDefault(); jump(); });

    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">Espacio: correr | W/↑: saltar obstaculos | Compite contra 3 IA!</div>');

    loop();
    currentGame = { cleanup: () => { running = false; finished = true; cancelAnimationFrame(animId); document.removeEventListener('keydown', kbHandler); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ========== BOXEO - Saco Training (keep as-is) ==========
function deporteBoxeo(ui, controls) {
    // Entrenamiento con saco - sin violencia, solo practica de tecnica
    let combo = 0;
    let bestCombo = 0;
    let totalHits = 0;
    let timeLeft = 30;
    let timer = null;
    let sacoBounce = 0;

    // Secuencia que el saco pide (como Simon dice)
    let sequence = [];
    let sequenceIdx = 0;
    const moves = ['jab', 'cross', 'gancho', 'esquiva'];
    const moveIcons = { jab: '👊', cross: '🤛', gancho: '💪', esquiva: '🏃' };
    const moveColors = { jab: '#ff512f', cross: '#667eea', gancho: '#43e97b', esquiva: '#ffd700' };

    function generateSequence() {
        sequence = [];
        const len = Math.min(3 + Math.floor(totalHits / 10), 8);
        for (let i = 0; i < len; i++) sequence.push(randomFrom(moves));
        sequenceIdx = 0;
    }

    function render() {
        const currentMove = sequenceIdx < sequence.length ? sequence[sequenceIdx] : null;
        ui.innerHTML = `
            <div style="padding: 20px; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
                <div style="font-size: 0.8rem; color: #aaa;">⏱️ Tiempo: ${timeLeft}s</div>
                <div style="font-size: ${5 + sacoBounce * 0.5}rem; transition: font-size 0.1s; transform: rotate(${sacoBounce * 5}deg);">🥊</div>
                <div style="font-size: 0.7rem; color: #888;">Saco de entrenamiento</div>
                <div style="color: #667eea; font-size: 1.2rem; font-weight: 700;">Combo: x${combo}</div>
                <div style="color: #aaa; font-size: 0.8rem;">Mejor racha: x${bestCombo} | Total: ${totalHits}</div>
                ${currentMove ? `
                <div style="margin-top: 10px; padding: 12px 24px; background: ${moveColors[currentMove]}33; border: 2px solid ${moveColors[currentMove]}; border-radius: 16px;">
                    <span style="font-size: 1.5rem;">${moveIcons[currentMove]}</span>
                    <span style="font-weight: 700; margin-left: 8px; text-transform: uppercase;">${currentMove}</span>
                </div>
                <div style="font-size: 0.7rem; color: #888;">Secuencia: ${sequence.map((m, i) => i === sequenceIdx ? `<b style="color: #fff;">${moveIcons[m]}</b>` : (i < sequenceIdx ? `<span style="color: #43e97b;">✓</span>` : moveIcons[m])).join(' ')}</div>
                ` : '<div style="color: #43e97b; font-size: 1rem;">Secuencia completada! Preparando siguiente...</div>'}
            </div>
        `;
    }

    function hitSaco(move) {
        if (timeLeft <= 0) return;
        const expected = sequence[sequenceIdx];
        if (move === expected) {
            sequenceIdx++;
            combo++;
            totalHits++;
            sacoBounce = 2;
            setTimeout(() => { sacoBounce = 0; render(); }, 150);
            addScore(5 + combo);
            if (combo > bestCombo) bestCombo = combo;
            if (sequenceIdx >= sequence.length) {
                addScore(20);
                setTimeout(() => { generateSequence(); render(); }, 800);
            }
        } else {
            combo = 0;
            sacoBounce = 0;
        }
        render();
    }

    generateSequence();

    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResult('Entrenamiento completado!', score + ' pts',
                `${totalHits} golpes al saco. Mejor racha: x${bestCombo}`,
                () => deporteBoxeo(ui, controls));
        }
        render();
    }, 1000);

    controls.innerHTML = `
        <button class="control-btn" style="flex:1;" id="box-jab">👊 Jab</button>
        <button class="control-btn" style="flex:1;" id="box-cross">🤛 Cross</button>
        <button class="control-btn" style="flex:1;" id="box-gancho">💪 Gancho</button>
        <button class="control-btn" style="flex:1; background: linear-gradient(135deg, #ffd70044, #ffaa0044); border-color: #ffd700;" id="box-esquiva">🏃 Esquiva</button>
    `;

    document.getElementById('box-jab').onclick = () => hitSaco('jab');
    document.getElementById('box-cross').onclick = () => hitSaco('cross');
    document.getElementById('box-gancho').onclick = () => hitSaco('gancho');
    document.getElementById('box-esquiva').onclick = () => hitSaco('esquiva');

    const kbHandler = (e) => {
        if (e.key === 'a' || e.key === 'A') hitSaco('jab');
        else if (e.key === 's' || e.key === 'S') hitSaco('cross');
        else if (e.key === 'd' || e.key === 'D') hitSaco('gancho');
        else if (e.key === 'w' || e.key === 'W') hitSaco('esquiva');
    };
    document.addEventListener('keydown', kbHandler);
    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ A: Jab · S: Cross · D: Gancho · W: Esquiva</div>');

    render();
    currentGame = { cleanup: () => { clearInterval(timer); document.removeEventListener('keydown', kbHandler); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ===================== CONDUCIR - Canvas Road Simulator =====================

function startConducir(subtype) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    const canvas = document.getElementById('game-canvas');
    const container = document.getElementById('game-container');
    ui.style.pointerEvents = 'auto';

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let running = true;
    let animId;
    const isManual = subtype === 'manual' || subtype === 'moto';
    const isMoto = subtype === 'moto';
    const maxGear = isMoto ? 6 : 5;

    // Car state
    let carX = W / 2;
    let speed = 0; // km/h conceptual
    let rpm = 800;
    let gear = isManual ? 0 : 1; // 0=N, 1-5(6)=gears, -1=R
    let clutchPressed = false;
    let gasPressed = false;
    let brakePressed = false;
    let distance = 0;
    let smoothBonus = 0;
    let penalties = 0;
    let stalls = 0;

    // Road state
    let roadOffset = 0;
    let roadCurve = 0;
    let roadCurveTarget = 0;
    let roadCurveTimer = 0;

    // Traffic
    let trafficCars = [];
    let nextTrafficDist = 50;

    // Traffic lights
    let trafficLights = [];
    let nextLightDist = 80;

    // Speed limit zones
    let speedLimit = 60;
    let speedLimitChangeDist = 120;

    // Timer
    let timeLeft = 60;
    let gameTimer = null;
    let gameStarted = false;

    // Instruction overlay
    let showInstructions = true;
    let instructionTimer = 180; // 3 seconds at 60fps

    // Gear ratios for manual
    const gearRatios = [0, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8];
    const gearMaxSpeed = [0, 30, 55, 85, 120, 160, 190];

    let keys = {};

    // Generate initial traffic
    function spawnTraffic() {
        if (trafficCars.length > 5) return;
        const lane = Math.random() < 0.5 ? -1 : 1; // -1 = left lane, 1 = right lane
        const carSpeed = 20 + Math.random() * 40;
        trafficCars.push({
            lane: lane,
            relDist: 200 + Math.random() * 150, // distance ahead
            speed: carSpeed,
            emoji: randomFrom(['🚗', '🚙', '🚕', '🚐', '🚎']),
            color: randomFrom(['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'])
        });
    }

    function spawnLight() {
        trafficLights.push({
            relDist: 150 + Math.random() * 100,
            state: 'green',
            timer: 120 + Math.random() * 120, // frames until change
            stateTimer: 0
        });
    }

    // Initial spawns
    for (let i = 0; i < 3; i++) spawnTraffic();
    spawnLight();

    function drawRoad() {
        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.3);
        skyGrad.addColorStop(0, '#1a1a2e');
        skyGrad.addColorStop(1, '#16213e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H * 0.3);

        // Grass sides
        ctx.fillStyle = '#1a5c2a';
        ctx.fillRect(0, H * 0.3, W, H * 0.7);

        // Road
        const roadW = W * 0.5;
        const roadL = W / 2 - roadW / 2 + roadCurve;
        const roadR = W / 2 + roadW / 2 + roadCurve;

        ctx.fillStyle = '#333';
        ctx.fillRect(roadL, H * 0.3, roadW, H * 0.7);

        // Road edges
        ctx.fillStyle = '#fff';
        ctx.fillRect(roadL - 3, H * 0.3, 3, H * 0.7);
        ctx.fillRect(roadR, H * 0.3, 3, H * 0.7);

        // Lane markings (scrolling)
        ctx.fillStyle = '#ffcc00';
        const markSpacing = 50;
        const markOffset = roadOffset % markSpacing;
        for (let y = H * 0.3 - markOffset; y < H; y += markSpacing) {
            ctx.fillRect(W / 2 + roadCurve - 2, y, 4, 25);
        }

        // Road shoulder dashes
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let y = H * 0.3 - markOffset; y < H; y += markSpacing) {
            ctx.fillRect(roadL + 8, y, 12, 3);
            ctx.fillRect(roadR - 20, y, 12, 3);
        }
    }

    function drawTraffic() {
        const roadW = W * 0.5;
        const roadCenter = W / 2 + roadCurve;
        const laneOffset = roadW * 0.22;

        trafficCars.forEach(tc => {
            // Convert relative distance to screen Y position
            const screenY = H * 0.8 - (tc.relDist / 200) * H * 0.5;
            if (screenY < H * 0.2 || screenY > H) return;
            const tcX = roadCenter + tc.lane * laneOffset;
            const scale = Math.max(0.5, 1 - (H * 0.8 - screenY) / (H * 0.6));
            ctx.font = `${Math.floor(30 * scale)}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText(tc.emoji, tcX, screenY);
        });
    }

    function drawTrafficLights() {
        trafficLights.forEach(tl => {
            const screenY = H * 0.8 - (tl.relDist / 200) * H * 0.5;
            if (screenY < H * 0.2 || screenY > H) return;
            const roadCenter = W / 2 + roadCurve;
            const roadW = W * 0.5;
            // Draw light post on right side
            const lx = roadCenter + roadW / 2 + 20;
            ctx.fillStyle = '#555';
            ctx.fillRect(lx - 3, screenY - 30, 6, 30);
            // Light box
            ctx.fillStyle = '#222';
            ctx.fillRect(lx - 10, screenY - 50, 20, 30);
            // Light colors
            const colors = { red: '#ff3333', yellow: '#ffcc00', green: '#33ff33' };
            ['red', 'yellow', 'green'].forEach((c, i) => {
                ctx.beginPath();
                ctx.arc(lx, screenY - 43 + i * 10, 4, 0, Math.PI * 2);
                ctx.fillStyle = tl.state === c ? colors[c] : '#444';
                ctx.fill();
            });
            // Line on road
            if (tl.state === 'red' && tl.relDist < 30 && tl.relDist > -5) {
                ctx.fillStyle = 'rgba(255,0,0,0.3)';
                ctx.fillRect(roadCenter - roadW / 2, screenY, roadW, 4);
            }
        });
    }

    function drawCar() {
        const carEmoji = isMoto ? '🏍️' : '🚘';
        ctx.font = '40px serif';
        ctx.textAlign = 'center';
        ctx.fillText(carEmoji, carX, H * 0.82);
    }

    function drawDashboard() {
        const dashH = H * 0.18;
        const dashY = H - dashH;

        // Dashboard background
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, dashY, W, dashH);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, dashY); ctx.lineTo(W, dashY);
        ctx.stroke();

        // Speedometer dial
        const dialCX = W * 0.2;
        const dialCY = dashY + dashH * 0.55;
        const dialR = Math.min(dashH * 0.4, 35);

        ctx.strokeStyle = '#555';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(dialCX, dialCY, dialR, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();

        // Speed ticks
        for (let s = 0; s <= 180; s += 30) {
            const angle = Math.PI * 0.8 + (s / 180) * Math.PI * 1.4;
            const x1 = dialCX + Math.cos(angle) * (dialR - 5);
            const y1 = dialCY + Math.sin(angle) * (dialR - 5);
            const x2 = dialCX + Math.cos(angle) * dialR;
            const y2 = dialCY + Math.sin(angle) * dialR;
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        }

        // Speed needle
        const sAngle = Math.PI * 0.8 + (Math.min(speed, 180) / 180) * Math.PI * 1.4;
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dialCX, dialCY);
        ctx.lineTo(dialCX + Math.cos(sAngle) * (dialR - 8), dialCY + Math.sin(sAngle) * (dialR - 8));
        ctx.stroke();

        // Speed text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.floor(speed)}`, dialCX, dialCY + dialR + 14);
        ctx.font = '8px Poppins, sans-serif';
        ctx.fillText('km/h', dialCX, dialCY + dialR + 23);

        // RPM gauge (manual only)
        if (isManual) {
            const rpmCX = W * 0.42;
            const rpmCY = dialCY;
            const rpmR = Math.min(dashH * 0.35, 28);
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(rpmCX, rpmCY, rpmR, Math.PI * 0.8, Math.PI * 2.2);
            ctx.stroke();
            const rpmAngle = Math.PI * 0.8 + (Math.min(rpm, 8000) / 8000) * Math.PI * 1.4;
            ctx.strokeStyle = rpm > 6500 ? '#ff4444' : '#ffaa00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(rpmCX, rpmCY);
            ctx.lineTo(rpmCX + Math.cos(rpmAngle) * (rpmR - 5), rpmCY + Math.sin(rpmAngle) * (rpmR - 5));
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = '10px Poppins, sans-serif';
            ctx.fillText(`${Math.floor(rpm / 1000)}k RPM`, rpmCX, rpmCY + rpmR + 12);
        }

        // Gear indicator
        const gearX = isManual ? W * 0.6 : W * 0.45;
        ctx.fillStyle = '#222';
        ctx.fillRect(gearX - 18, dashY + 8, 36, 28);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.strokeRect(gearX - 18, dashY + 8, 36, 28);
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 16px Poppins, sans-serif';
        ctx.textAlign = 'center';
        const gearText = gear === -1 ? 'R' : gear === 0 ? 'N' : `${gear}`;
        ctx.fillText(gearText, gearX, dashY + 28);

        // Distance counter
        ctx.fillStyle = '#aaa';
        ctx.font = '11px Poppins, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${(distance / 1000).toFixed(1)} km`, W - 10, dashY + 18);

        // Time left
        ctx.fillStyle = timeLeft < 10 ? '#ff4444' : '#fff';
        ctx.font = 'bold 12px Poppins, sans-serif';
        ctx.fillText(`${timeLeft}s`, W - 10, dashY + 34);

        // Speed limit
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(W - 50, dashY + 26, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(W - 50, dashY + 26, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(speedLimit, W - 50, dashY + 30);

        // Penalties/bonus
        ctx.fillStyle = '#aaa';
        ctx.font = '9px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Bonus: +${smoothBonus} | Penalizaciones: -${penalties}`, 10, dashY + dashH - 5);

        // Clutch indicator (manual)
        if (isManual && clutchPressed) {
            ctx.fillStyle = '#667eea';
            ctx.font = '10px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('EMBRAGUE', W / 2, dashY + dashH - 5);
        }

        // RPM warning
        if (isManual && rpm > 6500) {
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 10px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('CAMBIA MARCHA!', W / 2, dashY + 15);
        }
    }

    function drawInstructions() {
        if (!showInstructions) return;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isMoto ? 'Simulador de Moto' : isManual ? 'Conduccion Manual' : 'Conduccion Automatica', W / 2, H * 0.12);

        ctx.font = '13px Poppins, sans-serif';
        ctx.fillStyle = '#ccc';
        let y = H * 0.22;
        const lines = [
            '← / → o A / D: Girar',
            'Espacio: Gas (mantener)',
            'Shift: Freno (mantener)',
        ];
        if (isManual) {
            lines.push('Z: Embrague (mantener)');
            lines.push(`1-${maxGear}: Marchas | R: Marcha atras | N: Neutro`);
            lines.push('Debes pisar embrague para cambiar marcha!');
        } else {
            lines.push('P: Parking | R: Reversa | D: Drive');
        }
        lines.push('');
        lines.push('Respeta semaforos (rojo = para)');
        lines.push('Respeta limites de velocidad');
        lines.push('Evita chocar con otros coches');
        lines.push('');
        lines.push('Pulsa cualquier tecla para empezar...');

        lines.forEach(l => {
            ctx.fillText(l, W / 2, y);
            y += 20;
        });
    }

    function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawRoad();
        drawTraffic();
        drawTrafficLights();
        drawCar();
        drawDashboard();
        if (showInstructions) drawInstructions();
    }

    function updatePhysics() {
        if (!gameStarted) return;

        // Steering
        const steerSpeed = Math.max(2, 5 - speed * 0.02);
        const roadW = W * 0.5;
        const roadCenter = W / 2 + roadCurve;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) carX = Math.max(roadCenter - roadW / 2 + 25, carX - steerSpeed);
        if (keys['ArrowRight'] || keys['d'] || keys['D']) carX = Math.min(roadCenter + roadW / 2 - 25, carX + steerSpeed);

        // Road curves
        roadCurveTimer--;
        if (roadCurveTimer <= 0) {
            roadCurveTarget = (Math.random() - 0.5) * W * 0.15;
            roadCurveTimer = 120 + Math.random() * 180;
        }
        roadCurve += (roadCurveTarget - roadCurve) * 0.01;

        if (isManual) {
            // Manual transmission physics
            if (gasPressed && gear !== 0 && !clutchPressed) {
                rpm = Math.min(8000, rpm + 180);
                const gearIdx = Math.abs(gear);
                if (gearIdx > 0 && gearIdx <= maxGear) {
                    const targetSpeed = (rpm / 8000) * gearMaxSpeed[gearIdx];
                    speed += (targetSpeed - speed) * 0.08 * (gear < 0 ? -1 : 1);
                }
            } else if (gasPressed && clutchPressed) {
                rpm = Math.min(8000, rpm + 250);
                speed *= 0.995;
            } else {
                rpm = Math.max(800, rpm - 100);
                speed *= 0.995;
            }

            if (brakePressed) {
                speed *= 0.95;
                if (Math.abs(speed) < 0.5) speed = 0;
            }

            // Engine stall
            if (!clutchPressed && gear > 0 && rpm < 600 && speed < 5) {
                rpm = 0;
                speed = 0;
                gear = 0;
                stalls++;
                penalties += 5;
                addScore(-5);
            }

            // RPM from speed when not clutched
            if (!clutchPressed && gear > 0) {
                const gearIdx = Math.abs(gear);
                const derivedRPM = (speed / Math.max(1, gearMaxSpeed[gearIdx])) * 7000;
                rpm = Math.max(800, rpm * 0.7 + derivedRPM * 0.3);
            }

            // Smooth shift bonus
            if (!clutchPressed && gear > 0 && rpm > 1500 && rpm < 4500) {
                smoothBonus += 0.01;
            }
        } else {
            // Automatic transmission
            if (gasPressed && gear > 0) {
                speed = Math.min(160, speed + 1.2);
            } else if (gasPressed && gear < 0) {
                speed = Math.min(30, speed + 0.5);
            } else {
                speed *= 0.995;
            }
            if (brakePressed) {
                speed *= 0.93;
                if (Math.abs(speed) < 0.5) speed = 0;
            }
            // Auto gear calculation for RPM display
            if (gear > 0) {
                if (speed < 25) rpm = 1000 + speed * 80;
                else if (speed < 50) rpm = 1200 + (speed - 25) * 60;
                else if (speed < 90) rpm = 1500 + (speed - 50) * 50;
                else rpm = 2000 + (speed - 90) * 40;
            } else {
                rpm = 800;
            }
        }

        speed = Math.max(0, speed);
        distance += speed * 0.05;
        roadOffset += speed * 0.3;

        // Scroll traffic relative to player
        trafficCars.forEach(tc => {
            tc.relDist -= (speed - tc.speed) * 0.05;
        });
        // Remove passed traffic and spawn new
        trafficCars = trafficCars.filter(tc => tc.relDist > -30 && tc.relDist < 300);
        if (distance > nextTrafficDist) {
            spawnTraffic();
            nextTrafficDist = distance + 40 + Math.random() * 60;
        }

        // Traffic lights
        trafficLights.forEach(tl => {
            tl.relDist -= speed * 0.05;
            tl.stateTimer++;
            if (tl.stateTimer > tl.timer) {
                tl.stateTimer = 0;
                if (tl.state === 'green') { tl.state = 'yellow'; tl.timer = 40; }
                else if (tl.state === 'yellow') { tl.state = 'red'; tl.timer = 100 + Math.random() * 60; }
                else { tl.state = 'green'; tl.timer = 120 + Math.random() * 100; }
            }
        });
        trafficLights = trafficLights.filter(tl => tl.relDist > -20);
        if (distance > nextLightDist) {
            spawnLight();
            nextLightDist = distance + 100 + Math.random() * 80;
        }

        // Speed limit changes
        if (distance > speedLimitChangeDist) {
            speedLimit = randomFrom([30, 50, 60, 80, 100]);
            speedLimitChangeDist = distance + 100 + Math.random() * 100;
        }

        // Collision check with traffic
        const roadW2 = W * 0.5;
        const roadCenter2 = W / 2 + roadCurve;
        const laneOffset = roadW2 * 0.22;
        trafficCars.forEach(tc => {
            if (tc.relDist > 0 && tc.relDist < 15) {
                const tcScreenX = roadCenter2 + tc.lane * laneOffset;
                if (Math.abs(carX - tcScreenX) < 30) {
                    // Bump!
                    speed = Math.max(0, speed - 20);
                    tc.relDist += 15;
                    penalties += 20;
                    addScore(-20);
                }
            }
        });

        // Red light penalty
        trafficLights.forEach(tl => {
            if (tl.state === 'red' && tl.relDist < 5 && tl.relDist > -3 && speed > 5) {
                if (!tl.penalized) {
                    penalties += 10;
                    addScore(-10);
                    tl.penalized = true;
                }
            }
        });

        // Speed limit penalty (continuous mild penalty)
        if (speed > speedLimit + 10) {
            penalties += 0.02;
        }

        setScore(Math.max(0, Math.floor(distance / 10 + smoothBonus - penalties)));
    }

    function loop() {
        if (!running) return;
        updatePhysics();
        draw();
        animId = requestAnimationFrame(loop);
    }

    // Keyboard handlers
    const kbDown = (e) => {
        keys[e.key] = true;
        if (showInstructions) {
            showInstructions = false;
            gameStarted = true;
            // Start game timer
            gameTimer = setInterval(() => {
                if (!running) return;
                timeLeft--;
                if (timeLeft <= 0) {
                    running = false;
                    clearInterval(gameTimer);
                    const finalScore = Math.max(0, Math.floor(distance / 10 + smoothBonus - penalties));
                    showResult('Conduccion terminada!', `${(distance / 1000).toFixed(1)} km`,
                        `Puntos: ${finalScore} | Bonus: +${Math.floor(smoothBonus)} | Penalizaciones: -${Math.floor(penalties)}`,
                        () => startConducir(subtype));
                }
            }, 1000);
            return;
        }
        if (e.code === 'Space') { e.preventDefault(); gasPressed = true; }
        if (e.key === 'Shift') { brakePressed = true; }
        if (isManual) {
            if (e.key === 'z' || e.key === 'Z') clutchPressed = true;
            const gearNum = parseInt(e.key);
            if (gearNum >= 1 && gearNum <= maxGear && (clutchPressed || speed <= 3)) {
                gear = gearNum;
            }
            if ((e.key === 'r' || e.key === 'R') && (clutchPressed || speed <= 3)) gear = -1;
            if ((e.key === 'n' || e.key === 'N')) gear = 0;
        } else {
            if (e.key === 'p' || e.key === 'P') gear = 0;
            if (e.key === 'r' || e.key === 'R') gear = -1;
            if (e.key === 'd' || e.key === 'D') gear = 1;
        }
    };
    const kbUp = (e) => {
        keys[e.key] = false;
        if (e.code === 'Space') { e.preventDefault(); gasPressed = false; }
        if (e.key === 'Shift') brakePressed = false;
        if (isManual && (e.key === 'z' || e.key === 'Z')) clutchPressed = false;
    };
    document.addEventListener('keydown', kbDown);
    document.addEventListener('keyup', kbUp);

    // Touch controls
    if (isManual) {
        controls.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:6px;width:100%;">
                <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                    <button class="control-btn" id="dr-steer-l" style="flex:1;min-width:40px;">←</button>
                    <button class="control-btn" id="dr-gas" style="flex:2;min-width:60px;background:linear-gradient(135deg,#43e97b44,#38f9d744);">GAS</button>
                    <button class="control-btn" id="dr-brake" style="flex:1.5;min-width:50px;background:linear-gradient(135deg,#ff512f44,#dd247644);">FRENO</button>
                    <button class="control-btn" id="dr-steer-r" style="flex:1;min-width:40px;">→</button>
                </div>
                <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                    <button class="control-btn" id="dr-clutch" style="flex:1;font-size:0.7rem;">EMB (Z)</button>
                    <button class="control-btn gear-btn" id="dr-gn" style="flex:0.7;">N</button>
                    ${Array.from({length: maxGear}, (_, i) => `<button class="control-btn gear-btn" id="dr-g${i+1}" style="flex:0.7;">${i+1}</button>`).join('')}
                    <button class="control-btn gear-btn" id="dr-gr" style="flex:0.7;">R</button>
                </div>
            </div>
        `;

        const setupHold = (id, onDown, onUp) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(); });
            el.addEventListener('mouseup', (e) => { e.preventDefault(); onUp(); });
            el.addEventListener('mouseleave', (e) => { onUp(); });
            el.addEventListener('touchstart', (e) => { e.preventDefault(); if (!gameStarted) { showInstructions = false; gameStarted = true; gameTimer = setInterval(() => { if (!running) return; timeLeft--; if (timeLeft <= 0) { running = false; clearInterval(gameTimer); const finalScore = Math.max(0, Math.floor(distance / 10 + smoothBonus - penalties)); showResult('Conduccion terminada!', `${(distance / 1000).toFixed(1)} km`, `Puntos: ${finalScore}`, () => startConducir(subtype)); } }, 1000); } onDown(); });
            el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
        };

        let steerLInt, steerRInt;
        const steerL = () => { const roadCenter = W / 2 + roadCurve; carX = Math.max(roadCenter - W * 0.25 + 25, carX - 5); };
        const steerR = () => { const roadCenter = W / 2 + roadCurve; carX = Math.min(roadCenter + W * 0.25 - 25, carX + 5); };
        document.getElementById('dr-steer-l').addEventListener('mousedown', () => { steerL(); steerLInt = setInterval(steerL, 30); });
        document.getElementById('dr-steer-l').addEventListener('mouseup', () => clearInterval(steerLInt));
        document.getElementById('dr-steer-l').addEventListener('mouseleave', () => clearInterval(steerLInt));
        document.getElementById('dr-steer-l').addEventListener('touchstart', (e) => { e.preventDefault(); steerL(); steerLInt = setInterval(steerL, 30); });
        document.getElementById('dr-steer-l').addEventListener('touchend', () => clearInterval(steerLInt));
        document.getElementById('dr-steer-r').addEventListener('mousedown', () => { steerR(); steerRInt = setInterval(steerR, 30); });
        document.getElementById('dr-steer-r').addEventListener('mouseup', () => clearInterval(steerRInt));
        document.getElementById('dr-steer-r').addEventListener('mouseleave', () => clearInterval(steerRInt));
        document.getElementById('dr-steer-r').addEventListener('touchstart', (e) => { e.preventDefault(); steerR(); steerRInt = setInterval(steerR, 30); });
        document.getElementById('dr-steer-r').addEventListener('touchend', () => clearInterval(steerRInt));

        setupHold('dr-gas', () => { gasPressed = true; }, () => { gasPressed = false; });
        setupHold('dr-brake', () => { brakePressed = true; }, () => { brakePressed = false; });
        setupHold('dr-clutch', () => { clutchPressed = true; }, () => { clutchPressed = false; });

        document.getElementById('dr-gn').onclick = () => { gear = 0; };
        document.getElementById('dr-gr').onclick = () => { if (clutchPressed || speed <= 3) gear = -1; };
        for (let i = 1; i <= maxGear; i++) {
            const el = document.getElementById(`dr-g${i}`);
            if (el) el.onclick = () => { if (clutchPressed || speed <= 3) gear = i; };
        }

        controls.insertAdjacentHTML('beforeend', `<div style="text-align:center;width:100%;color:#666;font-size:0.6rem;margin-top:2px;">←/→: girar | Espacio: gas | Shift: freno | Z: embrague | 1-${maxGear}/R/N: marchas</div>`);
    } else {
        controls.innerHTML = `
            <div style="display:flex;gap:4px;width:100%;justify-content:center;flex-wrap:wrap;">
                <button class="control-btn" id="dr-steer-l" style="flex:1;min-width:40px;">←</button>
                <button class="control-btn" id="dr-gas" style="flex:2;min-width:60px;background:linear-gradient(135deg,#43e97b44,#38f9d744);">GAS</button>
                <button class="control-btn" id="dr-brake" style="flex:1.5;min-width:50px;background:linear-gradient(135deg,#ff512f44,#dd247644);">FRENO</button>
                <button class="control-btn" id="dr-steer-r" style="flex:1;min-width:40px;">→</button>
                <div style="display:flex;gap:4px;">
                    <button class="control-btn" id="dr-gp" style="min-width:35px;">P</button>
                    <button class="control-btn" id="dr-gra" style="min-width:35px;">R</button>
                    <button class="control-btn" id="dr-gd" style="min-width:35px;">D</button>
                </div>
            </div>
        `;

        const setupHold = (id, onDown, onUp) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(); });
            el.addEventListener('mouseup', (e) => { e.preventDefault(); onUp(); });
            el.addEventListener('mouseleave', () => { onUp(); });
            el.addEventListener('touchstart', (e) => { e.preventDefault(); if (!gameStarted) { showInstructions = false; gameStarted = true; gameTimer = setInterval(() => { if (!running) return; timeLeft--; if (timeLeft <= 0) { running = false; clearInterval(gameTimer); const finalScore = Math.max(0, Math.floor(distance / 10 + smoothBonus - penalties)); showResult('Conduccion terminada!', `${(distance / 1000).toFixed(1)} km`, `Puntos: ${finalScore}`, () => startConducir(subtype)); } }, 1000); } onDown(); });
            el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
        };

        let steerLInt, steerRInt;
        const steerL = () => { const roadCenter = W / 2 + roadCurve; carX = Math.max(roadCenter - W * 0.25 + 25, carX - 5); };
        const steerR = () => { const roadCenter = W / 2 + roadCurve; carX = Math.min(roadCenter + W * 0.25 - 25, carX + 5); };
        document.getElementById('dr-steer-l').addEventListener('mousedown', () => { steerL(); steerLInt = setInterval(steerL, 30); });
        document.getElementById('dr-steer-l').addEventListener('mouseup', () => clearInterval(steerLInt));
        document.getElementById('dr-steer-l').addEventListener('mouseleave', () => clearInterval(steerLInt));
        document.getElementById('dr-steer-l').addEventListener('touchstart', (e) => { e.preventDefault(); steerL(); steerLInt = setInterval(steerL, 30); });
        document.getElementById('dr-steer-l').addEventListener('touchend', () => clearInterval(steerLInt));
        document.getElementById('dr-steer-r').addEventListener('mousedown', () => { steerR(); steerRInt = setInterval(steerR, 30); });
        document.getElementById('dr-steer-r').addEventListener('mouseup', () => clearInterval(steerRInt));
        document.getElementById('dr-steer-r').addEventListener('mouseleave', () => clearInterval(steerRInt));
        document.getElementById('dr-steer-r').addEventListener('touchstart', (e) => { e.preventDefault(); steerR(); steerRInt = setInterval(steerR, 30); });
        document.getElementById('dr-steer-r').addEventListener('touchend', () => clearInterval(steerRInt));

        setupHold('dr-gas', () => { gasPressed = true; }, () => { gasPressed = false; });
        setupHold('dr-brake', () => { brakePressed = true; }, () => { brakePressed = false; });

        document.getElementById('dr-gp').onclick = () => { gear = 0; };
        document.getElementById('dr-gra').onclick = () => { gear = -1; };
        document.getElementById('dr-gd').onclick = () => { gear = 1; };

        controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.6rem;margin-top:2px;">←/→: girar | Espacio: gas | Shift: freno | P/R/D: marchas</div>');
    }

    loop();
    currentGame = { cleanup: () => { running = false; cancelAnimationFrame(animId); if (gameTimer) clearInterval(gameTimer); document.removeEventListener('keydown', kbDown); document.removeEventListener('keyup', kbUp); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ===================== MUSICA =====================

function startMusica(subtype) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    ui.style.pointerEvents = 'auto';

    switch (subtype) {
        case 'bateria': musicaBateria(ui, controls); break;
        case 'piano': musicaPiano(ui, controls); break;
        case 'guitarra': musicaGuitarra(ui, controls); break;
        case 'dj': musicaDJ(ui, controls); break;
    }
}

function musicaBateria(ui, controls) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const drums = [
        { name: 'Bombo', color: '#ff512f', freq: 60, type: 'kick' },
        { name: 'Caja', color: '#667eea', freq: 200, type: 'snare' },
        { name: 'Hi-Hat', color: '#ffd700', freq: 800, type: 'hihat' },
        { name: 'Tom', color: '#43e97b', freq: 120, type: 'tom' },
        { name: 'Platillo', color: '#a18cd1', freq: 1000, type: 'crash' },
        { name: 'Ride', color: '#00d2ff', freq: 600, type: 'ride' }
    ];

    function playDrumSound(drum) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        switch (drum.type) {
            case 'kick':
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start(); osc.stop(audioCtx.currentTime + 0.3);
                break;
            case 'snare':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                osc.start(); osc.stop(audioCtx.currentTime + 0.15);
                // Noise for snare
                const noise = audioCtx.createBufferSource();
                const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
                noise.buffer = buf;
                const ng = audioCtx.createGain();
                ng.gain.setValueAtTime(0.5, audioCtx.currentTime);
                ng.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                noise.connect(ng); ng.connect(audioCtx.destination);
                noise.start(); noise.stop(audioCtx.currentTime + 0.1);
                break;
            case 'hihat':
                const hNoise = audioCtx.createBufferSource();
                const hBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
                const hData = hBuf.getChannelData(0);
                for (let i = 0; i < hData.length; i++) hData[i] = Math.random() * 2 - 1;
                hNoise.buffer = hBuf;
                const hg = audioCtx.createGain();
                hg.gain.setValueAtTime(0.3, audioCtx.currentTime);
                hg.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
                const hf = audioCtx.createBiquadFilter();
                hf.type = 'highpass'; hf.frequency.value = 5000;
                hNoise.connect(hf); hf.connect(hg); hg.connect(audioCtx.destination);
                hNoise.start(); hNoise.stop(audioCtx.currentTime + 0.05);
                osc.frequency.value = 800; gain.gain.setValueAtTime(0, audioCtx.currentTime);
                osc.start(); osc.stop(audioCtx.currentTime + 0.01);
                break;
            default:
                osc.frequency.setValueAtTime(drum.freq, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(drum.freq * 0.5, audioCtx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start(); osc.stop(audioCtx.currentTime + 0.3);
        }
    }

    ui.innerHTML = `
        <div class="drum-grid" id="drum-pads"></div>
    `;

    const padsEl = document.getElementById('drum-pads');
    drums.forEach(drum => {
        const pad = document.createElement('div');
        pad.className = 'drum-pad';
        pad.style.background = `radial-gradient(circle, ${drum.color}44 0%, ${drum.color}11 70%)`;
        pad.style.borderColor = drum.color;
        pad.innerHTML = `🥁<span class="pad-label">${drum.name}</span>`;

        const hitPad = (e) => {
            if (e) e.preventDefault();
            playDrumSound(drum);
            pad.style.transform = 'scale(0.9)';
            pad.style.filter = 'brightness(1.5)';
            addScore(1);
            setTimeout(() => {
                pad.style.transform = '';
                pad.style.filter = '';
            }, 100);
        };

        pad.addEventListener('mousedown', hitPad);
        pad.addEventListener('touchstart', hitPad);
        padsEl.appendChild(pad);
    });

    const drumKeys = ['q', 'w', 'e', 'a', 's', 'd'];
    const kbHandler = (e) => {
        const idx = drumKeys.indexOf(e.key.toLowerCase());
        if (idx >= 0 && idx < drums.length) {
            playDrumSound(drums[idx]);
            const pad = padsEl.children[idx];
            pad.style.transform = 'scale(0.9)';
            pad.style.filter = 'brightness(1.5)';
            addScore(1);
            setTimeout(() => { pad.style.transform = ''; pad.style.filter = ''; }, 100);
        }
    };
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Toca los pads para crear ritmos 🥁</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Q/W/E (fila arriba) · A/S/D (fila abajo)</div>`;
    currentGame = { cleanup: () => { document.removeEventListener('keydown', kbHandler); audioCtx.close(); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function musicaPiano(ui, controls) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [
        { note: 'Do', freq: 261.63, color: '#fff', black: false },
        { note: 'Re♭', freq: 277.18, color: '#333', black: true },
        { note: 'Re', freq: 293.66, color: '#fff', black: false },
        { note: 'Mi♭', freq: 311.13, color: '#333', black: true },
        { note: 'Mi', freq: 329.63, color: '#fff', black: false },
        { note: 'Fa', freq: 349.23, color: '#fff', black: false },
        { note: 'Sol♭', freq: 369.99, color: '#333', black: true },
        { note: 'Sol', freq: 392.00, color: '#fff', black: false },
        { note: 'La♭', freq: 415.30, color: '#333', black: true },
        { note: 'La', freq: 440.00, color: '#fff', black: false },
        { note: 'Si♭', freq: 466.16, color: '#333', black: true },
        { note: 'Si', freq: 493.88, color: '#fff', black: false },
        { note: 'Do2', freq: 523.25, color: '#fff', black: false }
    ];

    function playNote(freq) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
    }

    ui.innerHTML = `
        <div style="display: flex; height: 100%; align-items: flex-end; padding: 20px 10px; position: relative;" id="piano-keys"></div>
    `;

    const keysEl = document.getElementById('piano-keys');
    const whiteKeys = notes.filter(n => !n.black);
    const keyWidth = 100 / whiteKeys.length;

    // White keys first
    whiteKeys.forEach((n, i) => {
        const key = document.createElement('div');
        key.style.cssText = `
            width: ${keyWidth}%; height: 70%; background: linear-gradient(180deg, #eee 0%, #fff 100%);
            border: 1px solid #aaa; border-radius: 0 0 8px 8px; display: flex; align-items: flex-end;
            justify-content: center; padding-bottom: 10px; cursor: pointer; font-size: 0.6rem;
            color: #666; font-weight: 600; transition: background 0.1s; position: relative; z-index: 1;
        `;
        key.textContent = n.note;
        const play = (e) => {
            if (e) e.preventDefault();
            playNote(n.freq);
            key.style.background = 'linear-gradient(180deg, #ddd 0%, #ccc 100%)';
            addScore(1);
            setTimeout(() => { key.style.background = 'linear-gradient(180deg, #eee 0%, #fff 100%)'; }, 150);
        };
        key.addEventListener('mousedown', play);
        key.addEventListener('touchstart', play);
        keysEl.appendChild(key);
    });

    // Black keys overlay
    const blackNotes = notes.filter(n => n.black);
    const blackPositions = [0.7, 1.7, 3.7, 4.7, 5.7]; // relative to white keys
    blackNotes.forEach((n, i) => {
        const key = document.createElement('div');
        key.style.cssText = `
            position: absolute; width: ${keyWidth * 0.6}%; height: 45%;
            left: ${blackPositions[i] * keyWidth + keyWidth * 0.2}%; top: 20px;
            background: linear-gradient(180deg, #333 0%, #111 100%);
            border: 1px solid #000; border-radius: 0 0 6px 6px;
            cursor: pointer; z-index: 2; display: flex; align-items: flex-end;
            justify-content: center; padding-bottom: 6px; font-size: 0.5rem; color: #888;
        `;
        key.textContent = n.note;
        const play = (e) => {
            if (e) e.preventDefault();
            playNote(n.freq);
            key.style.background = 'linear-gradient(180deg, #555 0%, #333 100%)';
            addScore(1);
            setTimeout(() => { key.style.background = 'linear-gradient(180deg, #333 0%, #111 100%)'; }, 150);
        };
        key.addEventListener('mousedown', play);
        key.addEventListener('touchstart', play);
        keysEl.appendChild(key);
    });

    // Piano keyboard mapping: white keys = A S D F G H J K, black keys = W E T Y U
    const whiteKeyMap = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
    const blackKeyMap = ['w', 'e', 't', 'y', 'u'];
    const kbHandler = (e) => {
        const k = e.key.toLowerCase();
        let wIdx = whiteKeyMap.indexOf(k);
        if (wIdx >= 0 && wIdx < whiteKeys.length) {
            playNote(whiteKeys[wIdx].freq);
            const keyEl = keysEl.children[wIdx];
            keyEl.style.background = 'linear-gradient(180deg, #ddd 0%, #ccc 100%)';
            addScore(1);
            setTimeout(() => { keyEl.style.background = 'linear-gradient(180deg, #eee 0%, #fff 100%)'; }, 150);
            return;
        }
        let bIdx = blackKeyMap.indexOf(k);
        if (bIdx >= 0 && bIdx < blackNotes.length) {
            playNote(blackNotes[bIdx].freq);
            const keyEl = keysEl.children[whiteKeys.length + bIdx];
            keyEl.style.background = 'linear-gradient(180deg, #555 0%, #333 100%)';
            addScore(1);
            setTimeout(() => { keyEl.style.background = 'linear-gradient(180deg, #333 0%, #111 100%)'; }, 150);
        }
    };
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Toca las teclas para crear melodias 🎹</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Blancas: A S D F G H J K · Negras: W E T Y U</div>`;
    currentGame = { cleanup: () => { document.removeEventListener('keydown', kbHandler); audioCtx.close(); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function musicaGuitarra(ui, controls) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const chords = [
        { name: 'Do (C)', freqs: [261.63, 329.63, 392.00] },
        { name: 'Re (D)', freqs: [293.66, 369.99, 440.00] },
        { name: 'Mi (E)', freqs: [329.63, 415.30, 493.88] },
        { name: 'Sol (G)', freqs: [196.00, 246.94, 392.00] },
        { name: 'La (A)', freqs: [220.00, 277.18, 329.63] },
        { name: 'La menor (Am)', freqs: [220.00, 261.63, 329.63] },
        { name: 'Mi menor (Em)', freqs: [164.81, 246.94, 329.63] },
        { name: 'Re menor (Dm)', freqs: [293.66, 349.23, 440.00] }
    ];

    function playChord(chord) {
        chord.freqs.forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 1.5);
            }, i * 50);
        });
    }

    ui.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px; padding: 20px; height: 100%; overflow-y: auto;">
            <div style="text-align: center; font-size: 4rem;">🎸</div>
            <h3 style="text-align: center;">Toca acordes</h3>
            <div id="chord-buttons" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;"></div>
        </div>
    `;

    const btnsEl = document.getElementById('chord-buttons');
    const colors = ['#ff512f', '#667eea', '#43e97b', '#ffd700', '#a18cd1', '#00d2ff', '#fa709a', '#fcb69f'];
    chords.forEach((chord, i) => {
        const btn = document.createElement('button');
        btn.style.cssText = `
            padding: 20px 10px; border-radius: 16px; border: 2px solid ${colors[i]}88;
            background: ${colors[i]}22; color: #fff; font-family: 'Poppins', sans-serif;
            font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.15s;
        `;
        btn.textContent = chord.name;
        const play = (e) => {
            if (e) e.preventDefault();
            playChord(chord);
            btn.style.background = colors[i] + '55';
            addScore(2);
            setTimeout(() => { btn.style.background = colors[i] + '22'; }, 300);
        };
        btn.addEventListener('mousedown', play);
        btn.addEventListener('touchstart', play);
        btnsEl.appendChild(btn);
    });

    const kbHandler = (e) => {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 8 && num <= chords.length) {
            const idx = num - 1;
            playChord(chords[idx]);
            const btn = btnsEl.children[idx];
            btn.style.background = colors[idx] + '55';
            addScore(2);
            setTimeout(() => { btn.style.background = colors[idx] + '22'; }, 300);
        }
    };
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Pulsa los acordes para rasguear 🎸</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Teclas 1-8 para acordes</div>`;
    currentGame = { cleanup: () => { document.removeEventListener('keydown', kbHandler); audioCtx.close(); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function musicaDJ(ui, controls) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let bpm = 120;
    let playing = false;
    let beatInterval = null;
    let beat = 0;

    const tracks = [
        { name: 'Kick', pattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], freq: 60, type: 'kick' },
        { name: 'Snare', pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], freq: 200, type: 'snare' },
        { name: 'HiHat', pattern: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], freq: 800, type: 'hihat' },
        { name: 'Bass', pattern: [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0], freq: 80, type: 'bass' }
    ];

    function playSound(track) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        switch (track.type) {
            case 'kick':
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                break;
            case 'snare':
                osc.type = 'triangle';
                osc.frequency.value = 200;
                gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                break;
            case 'hihat':
                osc.type = 'square';
                osc.frequency.value = 800;
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
                break;
            case 'bass':
                osc.type = 'sawtooth';
                osc.frequency.value = 80;
                gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                break;
        }
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }

    function render() {
        ui.innerHTML = `
            <div style="padding: 16px; height: 100%; display: flex; flex-direction: column; gap: 12px; overflow-y: auto;">
                <div style="text-align: center;">
                    <span style="font-size: 2rem;">🎧</span>
                    <div style="color: #667eea; font-weight: 700;">${bpm} BPM</div>
                </div>
                ${tracks.map((track, ti) => `
                    <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 10px;">
                        <div style="font-size: 0.7rem; color: #aaa; margin-bottom: 6px;">${track.name}</div>
                        <div style="display: grid; grid-template-columns: repeat(16, 1fr); gap: 3px;" data-track="${ti}">
                            ${track.pattern.map((p, pi) => `
                                <div class="beat-cell" data-beat="${pi}" style="
                                    height: 28px; border-radius: 4px; cursor: pointer;
                                    background: ${p ? '#667eea' : 'rgba(255,255,255,0.08)'};
                                    ${pi === beat && playing ? 'box-shadow: 0 0 8px #fff;' : ''}
                                    transition: all 0.1s;
                                "></div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Click to toggle beats
        ui.querySelectorAll('[data-track]').forEach(trackEl => {
            const ti = parseInt(trackEl.dataset.track);
            trackEl.querySelectorAll('.beat-cell').forEach(cell => {
                cell.onclick = () => {
                    const bi = parseInt(cell.dataset.beat);
                    tracks[ti].pattern[bi] = tracks[ti].pattern[bi] ? 0 : 1;
                    render();
                };
            });
        });
    }

    function startBeat() {
        const interval = (60 / bpm / 4) * 1000;
        beatInterval = setInterval(() => {
            tracks.forEach(track => {
                if (track.pattern[beat]) playSound(track);
            });
            beat = (beat + 1) % 16;
            addScore(1);
            render();
        }, interval);
    }

    controls.innerHTML = `
        <button class="control-btn" id="dj-play" style="flex:1;">▶️ Play</button>
        <button class="control-btn" id="dj-stop" style="flex:1;">⏹ Stop</button>
        <button class="control-btn" id="dj-bpm-down" style="flex:0.5;">-</button>
        <span style="color: #fff; font-weight: 700; align-self: center;" id="dj-bpm-label">${bpm}</span>
        <button class="control-btn" id="dj-bpm-up" style="flex:0.5;">+</button>
    `;

    document.getElementById('dj-play').onclick = () => {
        if (playing) return;
        playing = true;
        startBeat();
    };
    document.getElementById('dj-stop').onclick = () => {
        playing = false;
        clearInterval(beatInterval);
        beat = 0;
        render();
    };
    document.getElementById('dj-bpm-down').onclick = () => {
        bpm = Math.max(60, bpm - 10);
        document.getElementById('dj-bpm-label').textContent = bpm;
        if (playing) { clearInterval(beatInterval); startBeat(); }
    };
    document.getElementById('dj-bpm-up').onclick = () => {
        bpm = Math.min(200, bpm + 10);
        document.getElementById('dj-bpm-label').textContent = bpm;
        if (playing) { clearInterval(beatInterval); startBeat(); }
    };

    const kbHandler = (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!playing) { playing = true; startBeat(); }
            else { playing = false; clearInterval(beatInterval); beat = 0; render(); }
        }
        if (e.key === '-' || e.key === '_') {
            bpm = Math.max(60, bpm - 10);
            const label = document.getElementById('dj-bpm-label');
            if (label) label.textContent = bpm;
            if (playing) { clearInterval(beatInterval); startBeat(); }
        }
        if (e.key === '+' || e.key === '=') {
            bpm = Math.min(200, bpm + 10);
            const label = document.getElementById('dj-bpm-label');
            if (label) label.textContent = bpm;
            if (playing) { clearInterval(beatInterval); startBeat(); }
        }
    };
    document.addEventListener('keydown', kbHandler);
    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Espacio: play/stop · -/+: BPM</div>');

    render();
    currentGame = { cleanup: () => { playing = false; clearInterval(beatInterval); document.removeEventListener('keydown', kbHandler); audioCtx.close(); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}