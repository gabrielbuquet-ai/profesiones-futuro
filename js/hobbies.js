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

    // Helper: compute trajectory preview dots
    function getTrajectoryDots(startX, startY, currentPower, currentAim, numDots) {
        const dots = [];
        const speed = 3 + (currentPower / 100) * 7;
        const angle = -Math.PI / 2 + currentAim * 0.4;
        let sx = startX, sy = startY;
        let vx = Math.cos(angle) * speed + currentAim * 2;
        let vy = -speed;
        const gravity = 0.15;
        for (let i = 0; i < numDots; i++) {
            // Simulate several frames per dot for spacing
            for (let f = 0; f < 4; f++) {
                sx += vx;
                sy += vy;
                vy += gravity;
            }
            dots.push({ x: sx, y: sy });
            if (sy < -50 || sy > H + 50) break;
        }
        return dots;
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
            const playerBallX = W / 2 + aimAngle * W * 0.25;
            ctx.fillText('🏀', playerBallX, H * 0.72);
            ctx.fillText('🧑', playerBallX, H * 0.78);

            // Trajectory preview - dotted arc showing predicted path
            if (!ball && resultText === '') {
                const previewPower = charging ? power : 50;
                const dots = getTrajectoryDots(playerBallX, H * 0.72, previewPower, aimAngle, 18);
                for (let i = 0; i < dots.length; i++) {
                    const alpha = Math.max(0.05, 0.7 - i * 0.04);
                    const radius = Math.max(1.5, 4 - i * 0.15);
                    ctx.fillStyle = `rgba(255, 255, 100, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(dots[i].x, dots[i].y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Power bar - larger and more detailed
            if (charging) {
                const barX = W / 2 - 70;
                const barY = H * 0.84;
                const barW = 140;
                const barH = 22;
                // Background
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.beginPath();
                ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, 6);
                ctx.fill();

                // Sweetspot glow when power is 60-80%
                if (power >= 60 && power <= 80) {
                    const pulseAlpha = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
                    ctx.shadowColor = '#44ff44';
                    ctx.shadowBlur = 12 + Math.sin(Date.now() * 0.01) * 6;
                    ctx.strokeStyle = `rgba(68, 255, 68, ${pulseAlpha})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, 6);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }

                // Sweetspot zone marker (60-80% region)
                const ssLeft = barX + (barW * 0.60);
                const ssWidth = barW * 0.20;
                ctx.fillStyle = 'rgba(68, 255, 68, 0.15)';
                ctx.fillRect(ssLeft, barY, ssWidth, barH);

                // Power fill gradient
                const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
                grad.addColorStop(0, '#ff4444');
                grad.addColorStop(0.4, '#ffaa00');
                grad.addColorStop(0.6, '#44ff44');
                grad.addColorStop(0.8, '#44ff44');
                grad.addColorStop(1, '#ffaa00');
                ctx.fillStyle = grad;
                ctx.fillRect(barX, barY, (barW * power) / 100, barH);

                // Border
                ctx.strokeStyle = 'rgba(255,255,255,0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(barX, barY, barW, barH, 4);
                ctx.stroke();

                // Power percentage text
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 13px Poppins, sans-serif';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 3;
                ctx.fillText(`${Math.round(power)}%`, W / 2, barY + barH - 5);
                ctx.shadowBlur = 0;
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

        // Outer area - dark blue/gray surround
        ctx.fillStyle = '#1a2a3a';
        ctx.fillRect(0, 0, W, H);

        // Court surface - Australian Open blue
        const courtW = courtRight - courtLeft;
        const courtH = courtBottom - courtTop;
        ctx.fillStyle = '#0056A7';
        ctx.fillRect(courtLeft, courtTop, courtW, courtH);

        // Inner court lighter blue (service boxes area)
        const innerMargin = courtW * 0.08;
        ctx.fillStyle = '#1a73cc';
        ctx.fillRect(courtLeft + innerMargin, courtTop + courtH * 0.1, courtW - innerMargin * 2, courtH * 0.8);

        // Court lines with glow effect
        ctx.shadowColor = 'rgba(255,255,255,0.6)';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(courtLeft, courtTop, courtW, courtH);

        // Center service line
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(W / 2, courtTop); ctx.lineTo(W / 2, courtBottom); ctx.stroke();

        // Service line top
        const serviceTopY = courtTop + courtH * 0.28;
        ctx.beginPath();
        ctx.moveTo(courtLeft, serviceTopY); ctx.lineTo(courtRight, serviceTopY); ctx.stroke();

        // Service line bottom
        const serviceBotY = courtBottom - courtH * 0.28;
        ctx.beginPath();
        ctx.moveTo(courtLeft, serviceBotY); ctx.lineTo(courtRight, serviceBotY); ctx.stroke();

        // Center marks (small ticks at baseline centers)
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(W / 2, courtTop); ctx.lineTo(W / 2, courtTop + 12); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(W / 2, courtBottom); ctx.lineTo(W / 2, courtBottom - 12); ctx.stroke();

        // Reset shadow for non-line elements
        ctx.shadowBlur = 0;

        // Net shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(courtLeft - 14, netY + 2, courtW + 28, 5);

        // Net posts
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(courtLeft - 14, netY - 10, 8, 20);
        ctx.fillRect(courtRight + 6, netY - 10, 8, 20);
        // Post caps
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(courtLeft - 15, netY - 12, 10, 4);
        ctx.fillRect(courtRight + 5, netY - 12, 10, 4);

        // Net - main cable
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(courtLeft - 10, netY - 8); ctx.lineTo(courtRight + 10, netY - 8); ctx.stroke();

        // Net mesh pattern
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1;
        // Vertical mesh lines
        for (let x = courtLeft - 6; x <= courtRight + 6; x += 8) {
            ctx.beginPath();
            ctx.moveTo(x, netY - 7);
            ctx.lineTo(x, netY + 3);
            ctx.stroke();
        }
        // Horizontal mesh lines
        for (let dy = -4; dy <= 2; dy += 3) {
            ctx.beginPath();
            ctx.moveTo(courtLeft - 10, netY + dy);
            ctx.lineTo(courtRight + 10, netY + dy);
            ctx.stroke();
        }

        // AI paddle
        ctx.font = '30px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏸', aiX, aiY);

        // Player paddle
        ctx.fillText('🏸', playerX, playerY);

        // Ball
        if (ball.active || serving) {
            // Ball shadow - more visible
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath();
            ctx.ellipse(ball.x + 3, ball.y + 7, 10, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            // Ball
            ctx.font = '22px serif';
            ctx.fillText('🎾', ball.x, ball.y);
        }

        // Professional scoreboard
        const sbW = Math.min(280, W * 0.7);
        const sbH = 44;
        const sbX = (W - sbW) / 2;
        const sbY = 4;
        // Rounded dark background
        ctx.beginPath();
        ctx.roundRect(sbX, sbY, sbW, sbH, 8);
        ctx.fillStyle = 'rgba(10, 10, 30, 0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Scoreboard content
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Poppins, sans-serif';
        ctx.textAlign = 'center';
        // Set score (games)
        ctx.fillText(`SET: Tu ${playerGames} - ${aiGames} IA`, W / 2, sbY + 17);
        // Point score
        ctx.font = '12px Poppins, sans-serif';
        ctx.fillStyle = '#aaccff';
        ctx.fillText(`Puntos: ${getScoreText()}`, W / 2, sbY + 34);

        // Serving indicator
        ctx.fillStyle = '#ffdd44';
        ctx.font = '10px Poppins, sans-serif';
        if (serving) {
            const servX = serverIsPlayer ? W / 2 + sbW * 0.3 : W / 2 - sbW * 0.3;
            ctx.fillText('●', servX, sbY + 17);
        }

        // Result text
        if (swingResult) {
            // Glow background for result
            ctx.shadowColor = swingResult.includes('IA') ? '#ff4444' : '#44ff44';
            ctx.shadowBlur = 15;
            ctx.fillStyle = swingResult.includes('IA') ? '#ff6666' : '#66ff66';
            ctx.font = 'bold 28px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(swingResult, W / 2, H / 2);
            ctx.shadowBlur = 0;
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
                won ? 'Llegaste primero!' : 'La IA fue más rápida',
                () => deporteNatacion(ui, controls, canvas));
        }
        if (aiDist >= target && !finished) {
            finished = true;
            running = false;
            addScore(10);
            showResult('Has perdido!', `${Math.floor(taps)} brazadas`, 'La IA llegó primero!',
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

    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">Pulsa Espacio o el botón lo más rápido posible!</div>');

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

    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">Espacio: correr | W/↑: saltar obstáculos | Compite contra 3 IA!</div>');

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

    // Perspective constants
    const horizonY = H * 0.35;
    const dashH = H * 0.25;
    const dashY = H - dashH;
    const roadBottom = dashY;
    const vpX = W / 2; // vanishing point X (shifts with curves)

    // Car state
    let steerX = 0; // -1 to 1 steering position
    let speed = 0;
    let rpm = 800;
    let gear = isManual ? 0 : 1;
    let clutchPressed = false;
    let gasPressed = false;
    let brakePressed = false;
    let distance = 0;
    let smoothBonus = 0;
    let penalties = 0;
    let stalls = 0;
    let playerLane = 0; // -1 left, 0 center, 1 right

    // Road state
    let roadOffset = 0;
    let roadCurve = 0;
    let roadCurveTarget = 0;
    let roadCurveTimer = 0;

    // Screen shake
    let shakeX = 0, shakeY = 0, shakeDuration = 0;

    // Traffic
    let trafficCars = [];
    let nextTrafficDist = 50;

    // Traffic lights
    let trafficLights = [];
    let nextLightDist = 80;

    // Scenery objects (trees, posts)
    let sceneryObjects = [];
    let nextSceneryDist = 10;

    // Speed limit zones
    let speedLimit = 60;
    let speedLimitChangeDist = 120;

    // Timer
    let timeLeft = 60;
    let gameTimer = null;
    let gameStarted = false;

    // Instruction overlay
    let showInstructions = true;

    // Gear ratios for manual
    const gearRatios = [0, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8];
    const gearMaxSpeed = [0, 30, 55, 85, 120, 160, 190];

    let keys = {};

    // --- Perspective helpers ---
    // Convert a world Z distance (0=near, 1=at horizon) to screen Y
    function zToScreenY(z) {
        return horizonY + (roadBottom - horizonY) * (1 - z);
    }
    // Get road width at a given screen Y
    function roadWidthAtY(sy) {
        const t = (sy - horizonY) / (roadBottom - horizonY);
        return W * 0.06 + t * (W * 0.9 - W * 0.06);
    }
    // Get vanishing point X with curve offset
    function getVPX() {
        return W / 2 + roadCurve * 2;
    }
    // Get road center X at screen Y
    function roadCenterAtY(sy) {
        const t = (sy - horizonY) / (roadBottom - horizonY);
        const vp = getVPX();
        return vp + (W / 2 - vp) * (1 - t) * 0 + (W / 2) * 0 + vp * (1 - t) + (W / 2) * t;
    }

    // Simpler: road center interpolates from VPX at horizon to W/2 at bottom
    function getRoadCenterX(sy) {
        const t = (sy - horizonY) / (roadBottom - horizonY);
        return getVPX() * (1 - t) + (W / 2 + steerX * W * 0.02) * t;
    }

    // Spawn functions
    function spawnTraffic() {
        if (trafficCars.length > 5) return;
        const lane = Math.random() < 0.33 ? -1 : (Math.random() < 0.5 ? 0 : 1);
        const carSpeed = 20 + Math.random() * 40;
        trafficCars.push({
            lane: lane,
            relDist: 200 + Math.random() * 150,
            speed: carSpeed,
            color: randomFrom(['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c']),
            hit: false
        });
    }

    function spawnLight() {
        trafficLights.push({
            relDist: 150 + Math.random() * 100,
            state: 'green',
            timer: 120 + Math.random() * 120,
            stateTimer: 0
        });
    }

    function spawnScenery() {
        const side = Math.random() < 0.5 ? -1 : 1;
        const type = Math.random() < 0.6 ? 'tree' : (Math.random() < 0.5 ? 'post' : 'building');
        sceneryObjects.push({
            side: side,
            relDist: 180 + Math.random() * 100,
            type: type,
            height: type === 'building' ? 30 + Math.random() * 40 : (type === 'tree' ? 20 + Math.random() * 15 : 15),
            color: type === 'tree' ? randomFrom(['#1a7a2e', '#2d8a4e', '#0f5c1e', '#3a9d5c']) :
                   type === 'building' ? randomFrom(['#6b7b8d', '#8b7355', '#5a6a7a', '#7a6b5a']) : '#888'
        });
    }

    // Initial spawns
    for (let i = 0; i < 3; i++) spawnTraffic();
    spawnLight();
    for (let i = 0; i < 8; i++) {
        sceneryObjects.push({
            side: i % 2 === 0 ? -1 : 1,
            relDist: 30 + i * 25,
            type: Math.random() < 0.6 ? 'tree' : 'post',
            height: 20 + Math.random() * 15,
            color: randomFrom(['#1a7a2e', '#2d8a4e', '#0f5c1e', '#888'])
        });
    }

    // --- DRAWING ---

    function drawSkyAndHorizon() {
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        skyGrad.addColorStop(0, '#1a6dd4');
        skyGrad.addColorStop(0.6, '#5ba3e6');
        skyGrad.addColorStop(1, '#a8d8f0');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, horizonY + 5);

        // Mountains silhouette
        ctx.fillStyle = '#3a5a3a';
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        const mountainVPX = getVPX();
        for (let x = 0; x <= W; x += 3) {
            const baseH = 15 + Math.sin(x * 0.008 + distance * 0.00005) * 20 +
                          Math.sin(x * 0.02 + 1.5) * 8 + Math.sin(x * 0.005 + 3) * 12;
            ctx.lineTo(x, horizonY - baseH);
        }
        ctx.lineTo(W, horizonY);
        ctx.closePath();
        ctx.fill();

        // Distant mountain layer
        ctx.fillStyle = '#2a4a3a';
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        for (let x = 0; x <= W; x += 4) {
            const baseH = 8 + Math.sin(x * 0.012 + distance * 0.00002 + 2) * 15 +
                          Math.sin(x * 0.004) * 10;
            ctx.lineTo(x, horizonY - baseH);
        }
        ctx.lineTo(W, horizonY);
        ctx.closePath();
        ctx.fill();
    }

    function drawRoadPerspective() {
        const vx = getVPX();
        const numSegments = 80;

        // Draw ground (grass) with gradient
        const grassGrad = ctx.createLinearGradient(0, horizonY, 0, roadBottom);
        grassGrad.addColorStop(0, '#3a8a4a');
        grassGrad.addColorStop(0.3, '#2d7a3a');
        grassGrad.addColorStop(1, '#1a5a2a');
        ctx.fillStyle = grassGrad;
        ctx.fillRect(0, horizonY, W, roadBottom - horizonY);

        // Draw road segments from horizon to bottom for depth shading
        for (let i = 0; i < numSegments; i++) {
            const t0 = i / numSegments;
            const t1 = (i + 1) / numSegments;
            const y0 = horizonY + t0 * (roadBottom - horizonY);
            const y1 = horizonY + t1 * (roadBottom - horizonY);

            // Road width grows with perspective
            const w0 = W * 0.04 + t0 * t0 * W * 0.8;
            const w1 = W * 0.04 + t1 * t1 * W * 0.8;

            // Center X interpolates from vanishing point
            const cx0 = vx + (W / 2 - vx) * t0;
            const cx1 = vx + (W / 2 - vx) * t1;

            // Road surface with subtle per-segment texture variation
            const shade = Math.floor(38 + t0 * 22);
            const texVar = ((i * 7) % 3) - 1;
            ctx.fillStyle = `rgb(${shade + texVar},${shade + texVar},${shade + 5 + texVar})`;
            ctx.beginPath();
            ctx.moveTo(cx0 - w0 / 2, y0);
            ctx.lineTo(cx0 + w0 / 2, y0);
            ctx.lineTo(cx1 + w1 / 2, y1);
            ctx.lineTo(cx1 - w1 / 2, y1);
            ctx.closePath();
            ctx.fill();

            // Rumble strips (red-white alternating) on road edges
            const rumbleW0 = Math.max(1, t0 * t0 * W * 0.025);
            const rumbleW1 = Math.max(1, t1 * t1 * W * 0.025);
            const rumbleIdx = Math.floor((i + Math.floor(roadOffset * 0.08)) % 4);
            const rumbleColor = rumbleIdx < 2 ? 'rgba(220,40,40,0.8)' : 'rgba(255,255,255,0.8)';
            ctx.fillStyle = rumbleColor;
            // Left rumble
            ctx.beginPath();
            ctx.moveTo(cx0 - w0 / 2 - rumbleW0, y0);
            ctx.lineTo(cx0 - w0 / 2, y0);
            ctx.lineTo(cx1 - w1 / 2, y1);
            ctx.lineTo(cx1 - w1 / 2 - rumbleW1, y1);
            ctx.closePath();
            ctx.fill();
            // Right rumble
            ctx.beginPath();
            ctx.moveTo(cx0 + w0 / 2, y0);
            ctx.lineTo(cx0 + w0 / 2 + rumbleW0, y0);
            ctx.lineTo(cx1 + w1 / 2 + rumbleW1, y1);
            ctx.lineTo(cx1 + w1 / 2, y1);
            ctx.closePath();
            ctx.fill();

            // Road edge lines - yellow left, white right
            const edgeLineW = Math.max(1, t0 * 4);
            ctx.strokeStyle = 'rgba(255,200,0,0.9)';
            ctx.lineWidth = edgeLineW;
            ctx.beginPath();
            ctx.moveTo(cx0 - w0 / 2, y0);
            ctx.lineTo(cx1 - w1 / 2, y1);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255,255,255,0.9)';
            ctx.lineWidth = edgeLineW;
            ctx.beginPath();
            ctx.moveTo(cx0 + w0 / 2, y0);
            ctx.lineTo(cx1 + w1 / 2, y1);
            ctx.stroke();
        }

        // Lane divider dashes (left and right lane separators)
        const markWorldSpacing = 25;
        const scrollPhase = (roadOffset * 0.15) % markWorldSpacing;
        for (let laneDiv = -1; laneDiv <= 1; laneDiv += 2) {
            for (let d = -scrollPhase; d < 250; d += markWorldSpacing) {
                if (d < 0) continue;
                const z0 = Math.max(0, 1 - d / 250);
                const z1 = Math.max(0, 1 - (d + markWorldSpacing * 0.45) / 250);
                if (z0 <= 0 && z1 <= 0) continue;
                const t0m = 1 - z0;
                const t1m = 1 - z1;
                if (t0m < 0 || t1m > 1) continue;

                const y0 = horizonY + t0m * (roadBottom - horizonY);
                const y1 = horizonY + t1m * (roadBottom - horizonY);
                const cx0 = vx + (W / 2 - vx) * t0m;
                const cx1 = vx + (W / 2 - vx) * t1m;
                const rw0 = W * 0.04 + t0m * t0m * W * 0.8;
                const rw1 = W * 0.04 + t1m * t1m * W * 0.8;
                const laneOff0 = rw0 * 0.25 * laneDiv;
                const laneOff1 = rw1 * 0.25 * laneDiv;
                const mw0 = Math.max(1, t0m * 5);
                const mw1 = Math.max(1, t1m * 5);

                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.beginPath();
                ctx.moveTo(cx0 + laneOff0 - mw0 / 2, y0);
                ctx.lineTo(cx0 + laneOff0 + mw0 / 2, y0);
                ctx.lineTo(cx1 + laneOff1 + mw1 / 2, y1);
                ctx.lineTo(cx1 + laneOff1 - mw1 / 2, y1);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Center solid yellow double line
        for (let d = 0; d < 250; d += 2) {
            const z = Math.max(0.01, 1 - d / 250);
            const t = 1 - z;
            if (t < 0 || t > 1) continue;
            const y = horizonY + t * (roadBottom - horizonY);
            const cx = vx + (W / 2 - vx) * t;
            const mw = Math.max(1, t * 3);
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(cx - mw - 1, y, mw, 1);
            ctx.fillRect(cx + 1, y, mw, 1);
        }
    }

    function drawScenery() {
        const vx = getVPX();
        sceneryObjects.forEach(obj => {
            const z = Math.max(0.01, 1 - obj.relDist / 250);
            if (z <= 0.01 || z > 1) return;
            const t = 1 - z;
            const sy = horizonY + t * (roadBottom - horizonY);
            const cx = vx + (W / 2 - vx) * t;
            const rw = W * 0.04 + t * t * W * 0.8;
            const scale = t * t;
            const offsetX = obj.side * (rw / 2 + 20 * scale + 15);
            const treeX = cx + offsetX;

            if (obj.type === 'tree') {
                // Brown trunk rectangle
                const trunkW = Math.max(2, 6 * scale);
                const trunkH = Math.max(5, obj.height * scale * 1.5);
                ctx.fillStyle = '#5a3a1a';
                ctx.fillRect(treeX - trunkW / 2, sy - trunkH, trunkW, trunkH);
                // Trunk bark detail
                ctx.fillStyle = '#4a2a10';
                ctx.fillRect(treeX - trunkW * 0.15, sy - trunkH, trunkW * 0.3, trunkH);

                // Green triangle canopy (layered for depth)
                const canopyW = Math.max(6, 22 * scale);
                const canopyH = Math.max(8, 28 * scale);
                const canopyBaseY = sy - trunkH + 2;
                // Back layer (darker, wider)
                ctx.fillStyle = obj.color === '#1a7a2e' ? '#0f5c1e' : (obj.color === '#2d8a4e' ? '#1a6a2e' : '#0a4a15');
                ctx.beginPath();
                ctx.moveTo(treeX, canopyBaseY - canopyH * 1.1);
                ctx.lineTo(treeX - canopyW * 0.65, canopyBaseY);
                ctx.lineTo(treeX + canopyW * 0.65, canopyBaseY);
                ctx.closePath();
                ctx.fill();
                // Front layer (main color)
                ctx.fillStyle = obj.color;
                ctx.beginPath();
                ctx.moveTo(treeX, canopyBaseY - canopyH);
                ctx.lineTo(treeX - canopyW * 0.5, canopyBaseY - canopyH * 0.15);
                ctx.lineTo(treeX + canopyW * 0.5, canopyBaseY - canopyH * 0.15);
                ctx.closePath();
                ctx.fill();
                // Top smaller triangle
                ctx.fillStyle = obj.color === '#1a7a2e' ? '#2d9a4e' : (obj.color === '#2d8a4e' ? '#3daa5e' : '#2d8a3e');
                ctx.beginPath();
                ctx.moveTo(treeX, canopyBaseY - canopyH * 1.15);
                ctx.lineTo(treeX - canopyW * 0.3, canopyBaseY - canopyH * 0.5);
                ctx.lineTo(treeX + canopyW * 0.3, canopyBaseY - canopyH * 0.5);
                ctx.closePath();
                ctx.fill();
                // Shadow on ground
                if (scale > 0.05) {
                    ctx.fillStyle = 'rgba(0,30,0,0.2)';
                    ctx.beginPath();
                    ctx.ellipse(treeX + 3 * scale, sy + 1, canopyW * 0.4, Math.max(1, 3 * scale), 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (obj.type === 'post') {
                const postW = Math.max(1, 2 * scale);
                const postH = Math.max(4, 20 * scale);
                ctx.fillStyle = '#999';
                ctx.fillRect(treeX - postW / 2, sy - postH, postW, postH);
                // Reflector
                ctx.fillStyle = '#ff6600';
                ctx.fillRect(treeX - postW, sy - postH, postW * 2, Math.max(1, 3 * scale));
                // Reflector glow
                if (scale > 0.1) {
                    ctx.fillStyle = 'rgba(255,102,0,0.15)';
                    ctx.beginPath();
                    ctx.arc(treeX, sy - postH + 1, postW * 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (obj.type === 'building') {
                const bw = Math.max(10, 38 * scale);
                const bh = Math.max(12, obj.height * scale * 1.8);
                // Building shadow
                if (scale > 0.05) {
                    ctx.fillStyle = 'rgba(0,0,0,0.15)';
                    ctx.beginPath();
                    ctx.moveTo(treeX - bw / 2, sy);
                    ctx.lineTo(treeX + bw / 2, sy);
                    ctx.lineTo(treeX + bw / 2 + bh * 0.3, sy + Math.max(1, 3 * scale));
                    ctx.lineTo(treeX - bw / 2 + bh * 0.3, sy + Math.max(1, 3 * scale));
                    ctx.closePath();
                    ctx.fill();
                }
                // Main wall
                ctx.fillStyle = obj.color;
                ctx.fillRect(treeX - bw / 2, sy - bh, bw, bh);
                // Side wall shading (3D effect)
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
                ctx.fillRect(treeX + bw * 0.15, sy - bh, bw * 0.35, bh);
                // Roof
                ctx.fillStyle = 'rgba(60,50,40,0.8)';
                ctx.beginPath();
                ctx.moveTo(treeX - bw / 2 - 2, sy - bh);
                ctx.lineTo(treeX + bw / 2 + 2, sy - bh);
                ctx.lineTo(treeX + bw / 2, sy - bh - Math.max(2, 5 * scale));
                ctx.lineTo(treeX - bw / 2, sy - bh - Math.max(2, 5 * scale));
                ctx.closePath();
                ctx.fill();
                // Windows with frames
                const winSize = Math.max(2, 4 * scale);
                for (let wy = sy - bh + winSize * 2; wy < sy - winSize * 1.5; wy += winSize * 2.8) {
                    for (let wx = treeX - bw / 2 + winSize; wx < treeX + bw / 2 - winSize; wx += winSize * 2.2) {
                        // Window frame
                        ctx.fillStyle = 'rgba(40,40,40,0.5)';
                        ctx.fillRect(wx - 0.5, wy - 0.5, winSize + 1, winSize + 1);
                        // Window glass - yellowish if lit
                        const isLit = ((Math.floor(wx * 3 + wy * 7)) % 3) !== 0;
                        ctx.fillStyle = isLit ? 'rgba(255,240,150,0.7)' : 'rgba(100,140,180,0.5)';
                        ctx.fillRect(wx, wy, winSize, winSize);
                        // Window cross
                        if (winSize > 2.5) {
                            ctx.fillStyle = 'rgba(40,40,40,0.4)';
                            ctx.fillRect(wx + winSize * 0.45, wy, Math.max(0.5, winSize * 0.1), winSize);
                            ctx.fillRect(wx, wy + winSize * 0.45, winSize, Math.max(0.5, winSize * 0.1));
                        }
                    }
                }
                // Door
                if (scale > 0.08) {
                    const doorW = Math.max(3, 5 * scale);
                    const doorH = Math.max(5, 9 * scale);
                    ctx.fillStyle = '#3a2a1a';
                    ctx.fillRect(treeX - doorW / 2, sy - doorH, doorW, doorH);
                    ctx.fillStyle = '#ffcc00';
                    ctx.beginPath();
                    ctx.arc(treeX + doorW * 0.25, sy - doorH * 0.5, Math.max(0.5, scale), 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        });
    }

    function drawTrafficCars() {
        const vx = getVPX();
        // Sort by distance (far first) for proper layering
        const sorted = [...trafficCars].sort((a, b) => b.relDist - a.relDist);
        sorted.forEach(tc => {
            const z = Math.max(0, 1 - tc.relDist / 250);
            if (z <= 0 || z > 1) return;
            const t = 1 - z;
            const sy = horizonY + t * (roadBottom - horizonY);
            if (sy < horizonY || sy > roadBottom) return;

            const cx = vx + (W / 2 - vx) * t;
            const rw = W * 0.04 + t * t * W * 0.8;
            const laneOffset = rw * 0.25 * tc.lane;
            const carScreenX = cx + laneOffset;
            const scale = t * t;
            const carW = Math.max(6, 35 * scale);
            const carH = Math.max(4, 20 * scale);

            // Shadow on road beneath the car
            if (scale > 0.04) {
                ctx.fillStyle = 'rgba(0,0,0,0.25)';
                ctx.beginPath();
                ctx.ellipse(carScreenX + 2 * scale, sy + Math.max(1, 2 * scale), carW * 0.55, Math.max(1, 3 * scale), 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Car body with slight gradient
            const bodyR = Math.max(1, 3 * scale);
            ctx.fillStyle = tc.color;
            ctx.beginPath();
            ctx.moveTo(carScreenX - carW / 2 + bodyR, sy - carH);
            ctx.lineTo(carScreenX + carW / 2 - bodyR, sy - carH);
            ctx.quadraticCurveTo(carScreenX + carW / 2, sy - carH, carScreenX + carW / 2, sy - carH + bodyR);
            ctx.lineTo(carScreenX + carW / 2, sy - bodyR);
            ctx.quadraticCurveTo(carScreenX + carW / 2, sy, carScreenX + carW / 2 - bodyR, sy);
            ctx.lineTo(carScreenX - carW / 2 + bodyR, sy);
            ctx.quadraticCurveTo(carScreenX - carW / 2, sy, carScreenX - carW / 2, sy - bodyR);
            ctx.lineTo(carScreenX - carW / 2, sy - carH + bodyR);
            ctx.quadraticCurveTo(carScreenX - carW / 2, sy - carH, carScreenX - carW / 2 + bodyR, sy - carH);
            ctx.closePath();
            ctx.fill();
            // Highlight on top of car
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fillRect(carScreenX - carW * 0.3, sy - carH, carW * 0.6, carH * 0.2);

            // Windshield (rear view of car ahead)
            ctx.fillStyle = 'rgba(140,190,240,0.55)';
            const wsW = carW * 0.7;
            const wsH = carH * 0.35;
            ctx.fillRect(carScreenX - wsW / 2, sy - carH + 1, wsW, wsH);
            // Windshield glare
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(carScreenX - wsW * 0.1, sy - carH + 1, wsW * 0.3, wsH * 0.6);

            // Tail lights (red, glowing)
            if (scale > 0.1) {
                const tlS = Math.max(1.5, 4 * scale);
                // Left tail light
                ctx.fillStyle = '#ff2222';
                ctx.beginPath();
                ctx.arc(carScreenX - carW / 2 + tlS, sy - tlS * 0.8, tlS * 0.6, 0, Math.PI * 2);
                ctx.fill();
                // Right tail light
                ctx.beginPath();
                ctx.arc(carScreenX + carW / 2 - tlS, sy - tlS * 0.8, tlS * 0.6, 0, Math.PI * 2);
                ctx.fill();
                // Tail light glow
                ctx.fillStyle = 'rgba(255,30,30,0.15)';
                ctx.beginPath();
                ctx.arc(carScreenX - carW / 2 + tlS, sy - tlS * 0.8, tlS * 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(carScreenX + carW / 2 - tlS, sy - tlS * 0.8, tlS * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Headlights for oncoming appearance (small yellow circles at front)
            if (scale > 0.08) {
                const hlS = Math.max(1, 3 * scale);
                ctx.fillStyle = '#ffe866';
                ctx.beginPath();
                ctx.arc(carScreenX - carW * 0.35, sy - carH + 1, hlS * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(carScreenX + carW * 0.35, sy - carH + 1, hlS * 0.5, 0, Math.PI * 2);
                ctx.fill();
                // Headlight glow
                ctx.fillStyle = 'rgba(255,235,100,0.1)';
                ctx.beginPath();
                ctx.arc(carScreenX - carW * 0.35, sy - carH + 1, hlS * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(carScreenX + carW * 0.35, sy - carH + 1, hlS * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function drawTrafficLightsPerspective() {
        const vx = getVPX();
        trafficLights.forEach(tl => {
            const z = Math.max(0, 1 - tl.relDist / 250);
            if (z <= 0 || z > 1) return;
            const t = 1 - z;
            const sy = horizonY + t * (roadBottom - horizonY);
            if (sy < horizonY || sy > roadBottom) return;

            const cx = vx + (W / 2 - vx) * t;
            const rw = W * 0.04 + t * t * W * 0.8;
            const scale = t * t;

            // Post on right side of road
            const postX = cx + rw / 2 + 10 * scale;
            const postW = Math.max(1, 3 * scale);
            const postH = Math.max(8, 40 * scale);
            ctx.fillStyle = '#555';
            ctx.fillRect(postX - postW / 2, sy - postH, postW, postH);

            // Arm extending over road
            const armLen = Math.max(5, 20 * scale);
            ctx.fillRect(postX - armLen, sy - postH, armLen, Math.max(1, 2 * scale));

            // Light box
            const boxW = Math.max(4, 10 * scale);
            const boxH = Math.max(8, 24 * scale);
            const boxX = postX - armLen;
            const boxY = sy - postH - boxH;
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(boxX - boxW / 2, boxY, boxW, boxH);

            // Lights
            const lightR = Math.max(1.5, 3 * scale);
            const colors = { red: '#ff3333', yellow: '#ffcc00', green: '#33ff33' };
            ['red', 'yellow', 'green'].forEach((c, i) => {
                ctx.beginPath();
                ctx.arc(boxX, boxY + lightR + 1 + i * (lightR * 2 + 1), lightR, 0, Math.PI * 2);
                ctx.fillStyle = tl.state === c ? colors[c] : '#333';
                ctx.fill();
                // Glow effect for active light
                if (tl.state === c && scale > 0.2) {
                    ctx.beginPath();
                    ctx.arc(boxX, boxY + lightR + 1 + i * (lightR * 2 + 1), lightR * 2, 0, Math.PI * 2);
                    ctx.fillStyle = c === 'red' ? 'rgba(255,50,50,0.15)' : c === 'yellow' ? 'rgba(255,200,0,0.15)' : 'rgba(50,255,50,0.15)';
                    ctx.fill();
                }
            });

            // Stop line on road for red
            if (tl.state === 'red' && tl.relDist < 30 && tl.relDist > -5) {
                ctx.fillStyle = 'rgba(255,0,0,0.35)';
                ctx.fillRect(cx - rw / 2, sy - 1, rw, Math.max(2, 3 * scale));
            }
        });
    }

    function drawSpeedSign() {
        // Draw upcoming speed limit sign on right side
        const vx = getVPX();
        const signDist = 80;
        const z = Math.max(0, 1 - signDist / 250);
        if (z <= 0) return;
        const t = 1 - z;
        const sy = horizonY + t * (roadBottom - horizonY);
        const cx = vx + (W / 2 - vx) * t;
        const rw = W * 0.04 + t * t * W * 0.8;
        const scale = t * t;
        if (scale < 0.05) return;

        const signX = cx + rw / 2 + 25 * scale;
        const signR = Math.max(4, 12 * scale);

        // Post
        ctx.fillStyle = '#777';
        ctx.fillRect(signX - 1, sy - signR * 3, 2, signR * 3);

        // Sign circle
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(signX, sy - signR * 3, signR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = Math.max(1, 2 * scale);
        ctx.beginPath();
        ctx.arc(signX, sy - signR * 3, signR, 0, Math.PI * 2);
        ctx.stroke();
        if (scale > 0.1) {
            ctx.fillStyle = '#000';
            ctx.font = `bold ${Math.max(5, Math.floor(8 * scale))}px Poppins, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(speedLimit, signX, sy - signR * 3);
            ctx.textBaseline = 'alphabetic';
        }
    }

    function drawWindshieldFrame() {
        // Subtle dark border simulating windshield frame
        const frameW = 6;
        // Top frame
        ctx.fillStyle = 'rgba(15,15,15,0.7)';
        ctx.fillRect(0, 0, W, frameW);

        // Left A-pillar with gradient shadow
        const leftPillarGrad = ctx.createLinearGradient(0, 0, frameW * 5, 0);
        leftPillarGrad.addColorStop(0, 'rgba(10,10,10,0.85)');
        leftPillarGrad.addColorStop(0.5, 'rgba(15,15,15,0.5)');
        leftPillarGrad.addColorStop(1, 'rgba(20,20,20,0)');
        ctx.fillStyle = leftPillarGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(frameW * 5, 0);
        ctx.lineTo(frameW * 3, roadBottom);
        ctx.lineTo(0, roadBottom);
        ctx.closePath();
        ctx.fill();

        // Right A-pillar with gradient shadow
        const rightPillarGrad = ctx.createLinearGradient(W, 0, W - frameW * 5, 0);
        rightPillarGrad.addColorStop(0, 'rgba(10,10,10,0.85)');
        rightPillarGrad.addColorStop(0.5, 'rgba(15,15,15,0.5)');
        rightPillarGrad.addColorStop(1, 'rgba(20,20,20,0)');
        ctx.fillStyle = rightPillarGrad;
        ctx.beginPath();
        ctx.moveTo(W, 0);
        ctx.lineTo(W - frameW * 5, 0);
        ctx.lineTo(W - frameW * 3, roadBottom);
        ctx.lineTo(W, roadBottom);
        ctx.closePath();
        ctx.fill();

        // Sun glare effect (subtle, animated)
        const glarePhase = (Date.now() * 0.0003) % (Math.PI * 2);
        const glareIntensity = Math.max(0, Math.sin(glarePhase) * 0.5 + 0.1);
        if (glareIntensity > 0.15) {
            const glareX = W * 0.6 + Math.sin(glarePhase * 0.7) * W * 0.15;
            const glareY = horizonY * 0.3;
            const glareGrad = ctx.createRadialGradient(glareX, glareY, 0, glareX, glareY, W * 0.25);
            glareGrad.addColorStop(0, `rgba(255,250,220,${glareIntensity * 0.15})`);
            glareGrad.addColorStop(0.3, `rgba(255,245,200,${glareIntensity * 0.08})`);
            glareGrad.addColorStop(1, 'rgba(255,245,200,0)');
            ctx.fillStyle = glareGrad;
            ctx.fillRect(0, 0, W, roadBottom);
        }

        // Occasional rain drops on windshield (subtle streaks)
        const rainSeed = Math.floor(Date.now() * 0.004);
        for (let i = 0; i < 8; i++) {
            const rx = ((rainSeed * 31 + i * 137) % 1000) / 1000 * W;
            const ry = ((rainSeed * 17 + i * 89) % 1000) / 1000 * roadBottom * 0.8;
            const rLen = 3 + ((rainSeed + i * 43) % 5);
            const alpha = 0.08 + ((rainSeed + i * 67) % 10) / 100;
            ctx.strokeStyle = `rgba(200,220,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + 1, ry + rLen);
            ctx.stroke();
        }

        // Rear-view mirror at top center
        if (!isMoto) {
            const mirW = W * 0.12;
            const mirH = H * 0.06;
            const mirX = W / 2 - mirW / 2;
            const mirY = frameW + 2;
            // Mirror frame
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.moveTo(mirX + 4, mirY);
            ctx.lineTo(mirX + mirW - 4, mirY);
            ctx.quadraticCurveTo(mirX + mirW, mirY, mirX + mirW, mirY + 4);
            ctx.lineTo(mirX + mirW, mirY + mirH - 4);
            ctx.quadraticCurveTo(mirX + mirW, mirY + mirH, mirX + mirW - 4, mirY + mirH);
            ctx.lineTo(mirX + 4, mirY + mirH);
            ctx.quadraticCurveTo(mirX, mirY + mirH, mirX, mirY + mirH - 4);
            ctx.lineTo(mirX, mirY + 4);
            ctx.quadraticCurveTo(mirX, mirY, mirX + 4, mirY);
            ctx.closePath();
            ctx.fill();
            // Mirror glass
            const mgGrad = ctx.createLinearGradient(mirX, mirY, mirX + mirW, mirY + mirH);
            mgGrad.addColorStop(0, '#3a5a8a');
            mgGrad.addColorStop(0.5, '#5a8aba');
            mgGrad.addColorStop(1, '#3a5a8a');
            ctx.fillStyle = mgGrad;
            ctx.fillRect(mirX + 2, mirY + 2, mirW - 4, mirH - 4);
            // Stem
            ctx.fillStyle = '#333';
            ctx.fillRect(W / 2 - 2, mirY + mirH, 4, 6);
        } else {
            // Motorcycle mirrors - two small ones on sides
            const mirR = Math.min(W * 0.03, 12);
            // Left mirror
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.ellipse(frameW * 3 + mirR + 5, frameW + mirR + 10, mirR * 1.2, mirR, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#4a7aaa';
            ctx.beginPath();
            ctx.ellipse(frameW * 3 + mirR + 5, frameW + mirR + 10, mirR * 1 - 1, mirR - 1, -0.3, 0, Math.PI * 2);
            ctx.fill();
            // Right mirror
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.ellipse(W - frameW * 3 - mirR - 5, frameW + mirR + 10, mirR * 1.2, mirR, 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#4a7aaa';
            ctx.beginPath();
            ctx.ellipse(W - frameW * 3 - mirR - 5, frameW + mirR + 10, mirR * 1 - 1, mirR - 1, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawDashboard() {
        // Dashboard background with leather texture feel
        const dashGrad = ctx.createLinearGradient(0, dashY, 0, H);
        dashGrad.addColorStop(0, '#1e1e1e');
        dashGrad.addColorStop(0.15, '#282828');
        dashGrad.addColorStop(0.5, '#222');
        dashGrad.addColorStop(1, '#0e0e0e');
        ctx.fillStyle = dashGrad;
        ctx.fillRect(0, dashY, W, dashH);

        // Dashboard top edge highlight (chrome strip)
        const chromeGrad = ctx.createLinearGradient(0, dashY - 1, 0, dashY + 2);
        chromeGrad.addColorStop(0, '#666');
        chromeGrad.addColorStop(0.5, '#999');
        chromeGrad.addColorStop(1, '#444');
        ctx.fillStyle = chromeGrad;
        ctx.fillRect(0, dashY - 1, W, 3);

        // Padded area
        const padX = W * 0.03;
        const padY = dashY + 8;
        const innerH = dashH - 16;

        // --- Steering wheel (thick rim, 3 spokes) ---
        const wheelCX = W / 2;
        const wheelCY = dashY + dashH * 0.7;
        const wheelR = Math.min(dashH * 0.42, W * 0.14);
        const wheelAngle = steerX * 0.6;

        ctx.save();
        ctx.translate(wheelCX, wheelCY);
        ctx.rotate(wheelAngle);

        // Outer wheel rim shadow
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = Math.max(5, wheelR * 0.2) + 2;
        ctx.beginPath();
        ctx.arc(0, 2, wheelR, 0, Math.PI * 2);
        ctx.stroke();

        // Thick wheel rim
        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth = Math.max(5, wheelR * 0.2);
        ctx.beginPath();
        ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
        ctx.stroke();

        // Rim highlight (top)
        ctx.strokeStyle = 'rgba(100,100,100,0.3)';
        ctx.lineWidth = Math.max(2, wheelR * 0.08);
        ctx.beginPath();
        ctx.arc(0, 0, wheelR, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();

        // Grip texture on rim (small lines)
        ctx.strokeStyle = 'rgba(80,80,80,0.3)';
        ctx.lineWidth = 1;
        for (let g = 0; g < 36; g++) {
            const ga = (g / 36) * Math.PI * 2;
            const gr1 = wheelR - Math.max(2, wheelR * 0.09);
            const gr2 = wheelR + Math.max(2, wheelR * 0.09);
            ctx.beginPath();
            ctx.moveTo(Math.cos(ga) * gr1, Math.sin(ga) * gr1);
            ctx.lineTo(Math.cos(ga) * gr2, Math.sin(ga) * gr2);
            ctx.stroke();
        }

        // 3 spokes - thicker, positioned properly (left, right, bottom)
        const spokeW = Math.max(3, wheelR * 0.14);
        const spokeAngles = [Math.PI * 0.8, Math.PI * 0.2, Math.PI * 1.5]; // left, right, bottom
        spokeAngles.forEach(sa => {
            const sx = Math.cos(sa) * wheelR * 0.85;
            const sy = Math.sin(sa) * wheelR * 0.85;
            ctx.strokeStyle = '#444';
            ctx.lineWidth = spokeW;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(sx, sy);
            ctx.stroke();
            // Spoke highlight
            ctx.strokeStyle = 'rgba(100,100,100,0.2)';
            ctx.lineWidth = spokeW * 0.4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(sx * 0.9, sy * 0.9);
            ctx.stroke();
        });
        ctx.lineCap = 'butt';

        // Center hub with logo area
        const hubR = wheelR * 0.25;
        const hubGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, hubR);
        hubGrad.addColorStop(0, '#444');
        hubGrad.addColorStop(0.7, '#333');
        hubGrad.addColorStop(1, '#222');
        ctx.fillStyle = hubGrad;
        ctx.beginPath();
        ctx.arc(0, 0, hubR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Small logo circle
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, hubR * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        // --- Speedometer (left side) - proper analog dial ---
        const spdCX = padX + innerH * 0.5;
        const spdCY = padY + innerH * 0.5;
        const spdR = Math.min(innerH * 0.44, W * 0.11);

        // Gauge background with gradient
        const spdBgGrad = ctx.createRadialGradient(spdCX, spdCY, 0, spdCX, spdCY, spdR + 3);
        spdBgGrad.addColorStop(0, '#0a0a0a');
        spdBgGrad.addColorStop(0.85, '#111');
        spdBgGrad.addColorStop(1, '#333');
        ctx.fillStyle = spdBgGrad;
        ctx.beginPath();
        ctx.arc(spdCX, spdCY, spdR + 3, 0, Math.PI * 2);
        ctx.fill();

        // Chrome bezel
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(spdCX, spdCY, spdR + 1, 0, Math.PI * 2);
        ctx.stroke();

        // Gauge arc
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(spdCX, spdCY, spdR - 1, Math.PI * 0.75, Math.PI * 2.25);
        ctx.stroke();

        // Speed ticks and numbers (0, 40, 80, 120, 160, 200)
        const spdNumbers = [0, 40, 80, 120, 160, 200];
        for (let s = 0; s <= 200; s += 10) {
            const angle = Math.PI * 0.75 + (s / 200) * Math.PI * 1.5;
            const isMajor = spdNumbers.includes(s);
            const isMedium = s % 20 === 0;
            const inner = spdR - Math.max(3, spdR * (isMajor ? 0.2 : (isMedium ? 0.12 : 0.08)));
            const outer = spdR - 1;
            ctx.strokeStyle = isMajor ? '#ccc' : (isMedium ? '#777' : '#444');
            ctx.lineWidth = isMajor ? 2.5 : (isMedium ? 1.5 : 0.8);
            ctx.beginPath();
            ctx.moveTo(spdCX + Math.cos(angle) * inner, spdCY + Math.sin(angle) * inner);
            ctx.lineTo(spdCX + Math.cos(angle) * outer, spdCY + Math.sin(angle) * outer);
            ctx.stroke();
            if (isMajor && spdR > 18) {
                ctx.fillStyle = '#ddd';
                ctx.font = `bold ${Math.max(7, Math.floor(spdR * 0.22))}px Poppins, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const numR = inner - spdR * 0.12;
                ctx.fillText(s, spdCX + Math.cos(angle) * numR, spdCY + Math.sin(angle) * numR);
            }
        }

        // Speed needle (triangular, red)
        const spdAngle = Math.PI * 0.75 + (Math.min(Math.abs(speed), 200) / 200) * Math.PI * 1.5;
        const needleLen = spdR - 8;
        const needleW = Math.max(2, spdR * 0.06);
        ctx.fillStyle = '#ee2222';
        ctx.beginPath();
        ctx.moveTo(spdCX + Math.cos(spdAngle) * needleLen, spdCY + Math.sin(spdAngle) * needleLen);
        ctx.lineTo(spdCX + Math.cos(spdAngle + Math.PI / 2) * needleW, spdCY + Math.sin(spdAngle + Math.PI / 2) * needleW);
        ctx.lineTo(spdCX + Math.cos(spdAngle + Math.PI) * (needleLen * 0.15), spdCY + Math.sin(spdAngle + Math.PI) * (needleLen * 0.15));
        ctx.lineTo(spdCX + Math.cos(spdAngle - Math.PI / 2) * needleW, spdCY + Math.sin(spdAngle - Math.PI / 2) * needleW);
        ctx.closePath();
        ctx.fill();

        // Center cap
        ctx.fillStyle = '#cc1111';
        ctx.beginPath();
        ctx.arc(spdCX, spdCY, Math.max(3, spdR * 0.08), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(spdCX, spdCY, Math.max(1.5, spdR * 0.04), 0, Math.PI * 2);
        ctx.fill();

        // Digital speed readout
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(10, Math.floor(spdR * 0.32))}px Poppins, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(`${Math.floor(Math.abs(speed))}`, spdCX, spdCY + spdR * 0.5);
        ctx.font = `${Math.max(6, Math.floor(spdR * 0.16))}px Poppins, sans-serif`;
        ctx.fillStyle = '#777';
        ctx.fillText('km/h', spdCX, spdCY + spdR * 0.68);

        // --- RPM Gauge (right side) ---
        if (isManual) {
            const rpmCX = W - padX - innerH * 0.5;
            const rpmCY = padY + innerH * 0.5;
            const rpmR = Math.min(innerH * 0.4, W * 0.09);

            // Gauge background
            const rpmBgGrad = ctx.createRadialGradient(rpmCX, rpmCY, 0, rpmCX, rpmCY, rpmR + 3);
            rpmBgGrad.addColorStop(0, '#0a0a0a');
            rpmBgGrad.addColorStop(0.85, '#111');
            rpmBgGrad.addColorStop(1, '#333');
            ctx.fillStyle = rpmBgGrad;
            ctx.beginPath();
            ctx.arc(rpmCX, rpmCY, rpmR + 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(rpmCX, rpmCY, rpmR + 1, 0, Math.PI * 2);
            ctx.stroke();

            // Colored zone arcs (thicker, more visible)
            const zoneWidth = Math.max(3, rpmR * 0.16);
            // Green zone: 1000-4500
            ctx.strokeStyle = 'rgba(46,204,113,0.4)';
            ctx.lineWidth = zoneWidth;
            ctx.beginPath();
            ctx.arc(rpmCX, rpmCY, rpmR - zoneWidth * 0.5 - 1,
                Math.PI * 0.75 + (1000 / 8000) * Math.PI * 1.5,
                Math.PI * 0.75 + (4500 / 8000) * Math.PI * 1.5);
            ctx.stroke();
            // Yellow zone: 4500-6000
            ctx.strokeStyle = 'rgba(241,196,15,0.4)';
            ctx.beginPath();
            ctx.arc(rpmCX, rpmCY, rpmR - zoneWidth * 0.5 - 1,
                Math.PI * 0.75 + (4500 / 8000) * Math.PI * 1.5,
                Math.PI * 0.75 + (6000 / 8000) * Math.PI * 1.5);
            ctx.stroke();
            // Red zone: 6000-8000 (prominent red fill)
            ctx.strokeStyle = 'rgba(231,60,50,0.6)';
            ctx.lineWidth = zoneWidth + 1;
            ctx.beginPath();
            ctx.arc(rpmCX, rpmCY, rpmR - zoneWidth * 0.5 - 1,
                Math.PI * 0.75 + (6000 / 8000) * Math.PI * 1.5,
                Math.PI * 0.75 + Math.PI * 1.5);
            ctx.stroke();
            // Red zone diagonal hatch marks
            for (let rh = 6000; rh <= 8000; rh += 500) {
                const rhAngle = Math.PI * 0.75 + (rh / 8000) * Math.PI * 1.5;
                ctx.strokeStyle = 'rgba(200,30,20,0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(rpmCX + Math.cos(rhAngle) * (rpmR - zoneWidth - 2), rpmCY + Math.sin(rhAngle) * (rpmR - zoneWidth - 2));
                ctx.lineTo(rpmCX + Math.cos(rhAngle) * (rpmR - 1), rpmCY + Math.sin(rhAngle) * (rpmR - 1));
                ctx.stroke();
            }

            // Ticks with numbers
            for (let r = 0; r <= 8; r++) {
                const angle = Math.PI * 0.75 + (r / 8) * Math.PI * 1.5;
                const isMajor = true;
                ctx.strokeStyle = r >= 6 ? '#cc3333' : '#888';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(rpmCX + Math.cos(angle) * (rpmR - zoneWidth - 3), rpmCY + Math.sin(angle) * (rpmR - zoneWidth - 3));
                ctx.lineTo(rpmCX + Math.cos(angle) * (rpmR - 1), rpmCY + Math.sin(angle) * (rpmR - 1));
                ctx.stroke();
                // Numbers
                if (rpmR > 20) {
                    ctx.fillStyle = r >= 6 ? '#ee4444' : '#bbb';
                    ctx.font = `bold ${Math.max(6, Math.floor(rpmR * 0.2))}px Poppins, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const numR = rpmR - zoneWidth - Math.max(6, rpmR * 0.18);
                    ctx.fillText(r, rpmCX + Math.cos(angle) * numR, rpmCY + Math.sin(angle) * numR);
                }
            }

            // RPM needle (triangular)
            const rpmAngle = Math.PI * 0.75 + (Math.min(rpm, 8000) / 8000) * Math.PI * 1.5;
            const rpmNeedleLen = rpmR - 6;
            const rpmNeedleW = Math.max(1.5, rpmR * 0.05);
            ctx.fillStyle = rpm > 6000 ? '#ff3333' : '#ffaa00';
            ctx.beginPath();
            ctx.moveTo(rpmCX + Math.cos(rpmAngle) * rpmNeedleLen, rpmCY + Math.sin(rpmAngle) * rpmNeedleLen);
            ctx.lineTo(rpmCX + Math.cos(rpmAngle + Math.PI / 2) * rpmNeedleW, rpmCY + Math.sin(rpmAngle + Math.PI / 2) * rpmNeedleW);
            ctx.lineTo(rpmCX + Math.cos(rpmAngle + Math.PI) * (rpmNeedleLen * 0.12), rpmCY + Math.sin(rpmAngle + Math.PI) * (rpmNeedleLen * 0.12));
            ctx.lineTo(rpmCX + Math.cos(rpmAngle - Math.PI / 2) * rpmNeedleW, rpmCY + Math.sin(rpmAngle - Math.PI / 2) * rpmNeedleW);
            ctx.closePath();
            ctx.fill();

            // Center cap
            ctx.fillStyle = rpm > 6000 ? '#dd2222' : '#cc8800';
            ctx.beginPath();
            ctx.arc(rpmCX, rpmCY, Math.max(2, rpmR * 0.06), 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = `${Math.max(7, Math.floor(rpmR * 0.25))}px Poppins, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(`${(rpm / 1000).toFixed(1)}`, rpmCX, rpmCY + rpmR * 0.45);
            ctx.font = `${Math.max(5, Math.floor(rpmR * 0.17))}px Poppins, sans-serif`;
            ctx.fillStyle = '#777';
            ctx.fillText('x1000 RPM', rpmCX, rpmCY + rpmR * 0.65);
        }

        // --- Gear indicator (digital display, center, above steering wheel) ---
        const gearBoxW = Math.max(34, W * 0.07);
        const gearBoxH = Math.max(26, dashH * 0.24);
        const gearBoxX = W / 2 - gearBoxW / 2;
        const gearBoxY = padY;
        // Display background with glow
        ctx.fillStyle = '#050505';
        ctx.fillRect(gearBoxX - 1, gearBoxY - 1, gearBoxW + 2, gearBoxH + 2);
        const gearGlowColor = gear === -1 ? 'rgba(255,100,50,0.3)' : gear === 0 ? 'rgba(100,126,234,0.2)' : 'rgba(50,255,100,0.3)';
        ctx.fillStyle = gearGlowColor;
        ctx.fillRect(gearBoxX, gearBoxY, gearBoxW, gearBoxH);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(gearBoxX + 2, gearBoxY + 2, gearBoxW - 4, gearBoxH - 4);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.strokeRect(gearBoxX, gearBoxY, gearBoxW, gearBoxH);
        const gearText = gear === -1 ? 'R' : gear === 0 ? 'N' : `${gear}`;
        const gearColor = gear === -1 ? '#ff6644' : gear === 0 ? '#667eea' : '#44ff66';
        ctx.fillStyle = gearColor;
        ctx.font = `bold ${Math.max(14, Math.floor(gearBoxH * 0.75))}px Poppins, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(gearText, W / 2, gearBoxY + gearBoxH / 2);
        // "GEAR" label above
        ctx.fillStyle = '#555';
        ctx.font = `${Math.max(5, Math.floor(gearBoxH * 0.2))}px Poppins, sans-serif`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('GEAR', W / 2, gearBoxY - 2);

        // --- Distance counter (top right of dash) ---
        ctx.fillStyle = '#aaa';
        ctx.font = `${Math.max(9, Math.floor(innerH * 0.12))}px Poppins, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(`${(distance / 1000).toFixed(2)} km`, W - padX, padY + 14);

        // --- Timer (larger, more visible, with background) ---
        const timerFontSize = Math.max(13, Math.floor(innerH * 0.18));
        const timerText = `${timeLeft}s`;
        const timerX = W - padX;
        const timerY = padY + 32;
        // Timer background box
        ctx.fillStyle = timeLeft < 10 ? 'rgba(255,0,0,0.15)' : 'rgba(255,255,255,0.05)';
        const timerBoxW = timerFontSize * 2.5;
        ctx.fillRect(timerX - timerBoxW, timerY - timerFontSize + 2, timerBoxW + 4, timerFontSize + 4);
        ctx.strokeStyle = timeLeft < 10 ? '#ff4444' : '#555';
        ctx.lineWidth = 1;
        ctx.strokeRect(timerX - timerBoxW, timerY - timerFontSize + 2, timerBoxW + 4, timerFontSize + 4);
        ctx.fillStyle = timeLeft < 10 ? '#ff4444' : '#fff';
        ctx.font = `bold ${timerFontSize}px Poppins, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(timerText, timerX, timerY);
        // Blinking effect when low
        if (timeLeft < 10 && Math.floor(Date.now() / 500) % 2 === 0) {
            ctx.fillStyle = 'rgba(255,0,0,0.08)';
            ctx.fillRect(timerX - timerBoxW, timerY - timerFontSize + 2, timerBoxW + 4, timerFontSize + 4);
        }

        // --- Speed limit sign (HUD, larger, clearer) ---
        const slX = padX + spdR * 2 + 20;
        const slY = padY + 16;
        const slR = Math.max(10, innerH * 0.16);
        // Outer white circle
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(slX, slY, slR, 0, Math.PI * 2);
        ctx.fill();
        // Red border (thick)
        ctx.strokeStyle = '#dd0000';
        ctx.lineWidth = Math.max(2.5, slR * 0.2);
        ctx.beginPath();
        ctx.arc(slX, slY, slR - Math.max(1, slR * 0.1), 0, Math.PI * 2);
        ctx.stroke();
        // Inner white
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(slX, slY, slR - Math.max(2, slR * 0.22), 0, Math.PI * 2);
        ctx.fill();
        // Speed number
        ctx.fillStyle = '#111';
        ctx.font = `bold ${Math.max(8, Math.floor(slR * 0.85))}px Poppins, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(speedLimit, slX, slY);
        ctx.textBaseline = 'alphabetic';
        // Speeding flash on the sign
        if (Math.abs(speed) > speedLimit + 10) {
            ctx.strokeStyle = `rgba(255,0,0,${0.3 + Math.sin(Date.now() * 0.008) * 0.2})`;
            ctx.lineWidth = Math.max(3, slR * 0.25);
            ctx.beginPath();
            ctx.arc(slX, slY, slR + 3, 0, Math.PI * 2);
            ctx.stroke();
        }

        // --- Bonus/Penalties bar ---
        ctx.fillStyle = '#666';
        ctx.font = `${Math.max(7, Math.floor(innerH * 0.09))}px Poppins, sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText(`+${Math.floor(smoothBonus)} bonus  -${Math.floor(penalties)} pen.`, padX, dashY + dashH - 6);

        // --- Clutch indicator ---
        if (isManual && clutchPressed) {
            ctx.fillStyle = '#667eea';
            ctx.font = `bold ${Math.max(8, Math.floor(innerH * 0.1))}px Poppins, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('EMBRAGUE', W / 2, dashY + dashH - 6);
        }

        // --- RPM warning ---
        if (isManual && rpm > 6500) {
            ctx.fillStyle = '#ff4444';
            ctx.font = `bold ${Math.max(9, Math.floor(innerH * 0.12))}px Poppins, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('CAMBIA MARCHA!', W / 2, padY + gearBoxH + 16);
        }

        // --- Speeding warning ---
        if (Math.abs(speed) > speedLimit + 10) {
            ctx.fillStyle = 'rgba(255,0,0,0.7)';
            ctx.font = `bold ${Math.max(8, Math.floor(innerH * 0.1))}px Poppins, sans-serif`;
            ctx.textAlign = 'right';
            ctx.fillText('EXCESO VELOCIDAD', W - padX, padY + 50);
        }

        // --- Stall indicator ---
        if (isManual && rpm === 0 && gear === 0 && stalls > 0) {
            ctx.fillStyle = '#ff8800';
            ctx.font = `bold ${Math.max(9, Math.floor(innerH * 0.12))}px Poppins, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('MOTOR CALADO - Pulsa Espacio', W / 2, padY + gearBoxH + 16);
        }
    }

    function drawInstructions() {
        if (!showInstructions) return;
        ctx.fillStyle = 'rgba(0,0,0,0.88)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isMoto ? 'Simulador de Moto' : isManual ? 'Conducción Manual' : 'Conducción Automática', W / 2, H * 0.1);

        ctx.font = '12px Poppins, sans-serif';
        ctx.fillStyle = '#eee';
        ctx.fillText('Vista en primera persona', W / 2, H * 0.16);

        ctx.font = '13px Poppins, sans-serif';
        ctx.fillStyle = '#ccc';
        let y = H * 0.24;
        const lines = [
            '\u2190 / \u2192 o A / D: Girar',
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
        lines.push('Respeta semáforos (rojo = para)');
        lines.push('Respeta límites de velocidad');
        lines.push('Evita chocar con otros coches');
        lines.push('');
        lines.push('60 segundos - conduce lo más lejos posible!');
        lines.push('');
        lines.push('Pulsa cualquier tecla para empezar...');

        lines.forEach(l => {
            ctx.fillText(l, W / 2, y);
            y += 20;
        });
    }

    function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Apply screen shake
        if (shakeDuration > 0) {
            ctx.translate(shakeX, shakeY);
        }

        drawSkyAndHorizon();
        drawRoadPerspective();
        drawScenery();
        drawSpeedSign();
        drawTrafficCars();
        drawTrafficLightsPerspective();
        drawWindshieldFrame();

        // Reset transform for dashboard (no shake on dashboard)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawDashboard();

        if (showInstructions) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            drawInstructions();
        }
    }

    function updatePhysics() {
        if (!gameStarted) return;

        // Steering
        const steerSpeed = 0.04;
        const steerReturn = 0.03;
        const steerLeft = keys['ArrowLeft'] || (isManual && (keys['a'] || keys['A']));
        const steerRight = keys['ArrowRight'] || (isManual && (keys['d'] || keys['D']));
        if (steerLeft) {
            steerX = Math.max(-1, steerX - steerSpeed);
            playerLane = steerX < -0.3 ? -1 : (steerX > 0.3 ? 1 : 0);
        } else if (steerRight) {
            steerX = Math.min(1, steerX + steerSpeed);
            playerLane = steerX < -0.3 ? -1 : (steerX > 0.3 ? 1 : 0);
        } else {
            // Return to center
            if (Math.abs(steerX) < steerReturn) steerX = 0;
            else steerX += steerX > 0 ? -steerReturn : steerReturn;
            playerLane = steerX < -0.3 ? -1 : (steerX > 0.3 ? 1 : 0);
        }

        // Road curves
        roadCurveTimer--;
        if (roadCurveTimer <= 0) {
            roadCurveTarget = (Math.random() - 0.5) * W * 0.2;
            roadCurveTimer = 120 + Math.random() * 180;
        }
        roadCurve += (roadCurveTarget - roadCurve) * 0.008;

        // Screen shake decay
        if (shakeDuration > 0) {
            shakeDuration--;
            shakeX = (Math.random() - 0.5) * shakeDuration * 0.8;
            shakeY = (Math.random() - 0.5) * shakeDuration * 0.5;
        } else {
            shakeX = 0;
            shakeY = 0;
        }

        if (isManual) {
            // Manual transmission physics
            if (gasPressed && gear !== 0 && !clutchPressed) {
                rpm = Math.min(8000, rpm + 180);
                const gearIdx = Math.abs(gear);
                if (gearIdx > 0 && gearIdx <= maxGear) {
                    const targetSpeed = (rpm / 8000) * gearMaxSpeed[gearIdx];
                    if (gear < 0) {
                        // Reverse: speed goes negative
                        speed += (-targetSpeed * 0.3 - speed) * 0.08;
                    } else {
                        speed += (targetSpeed - speed) * 0.08;
                    }
                }
            } else if (gasPressed && clutchPressed) {
                rpm = Math.min(8000, rpm + 250);
                speed *= 0.995;
            } else {
                rpm = Math.max(800, rpm - 100);
                speed *= 0.995;
                if (Math.abs(speed) < 0.3) speed = 0;
            }

            if (brakePressed) {
                speed *= 0.95;
                if (Math.abs(speed) < 0.5) speed = 0;
            }

            // Engine stall (only forward gears)
            if (!clutchPressed && gear > 0 && rpm < 600 && Math.abs(speed) < 5) {
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
                const derivedRPM = (Math.abs(speed) / Math.max(1, gearMaxSpeed[gearIdx])) * 7000;
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
                // Reverse in automatic
                speed = Math.max(-25, speed - 0.6);
            } else {
                if (Math.abs(speed) < 0.3) speed = 0;
                else speed *= 0.995;
            }
            if (brakePressed) {
                speed *= 0.93;
                if (Math.abs(speed) < 0.5) speed = 0;
            }
            // Auto gear calculation for RPM display
            if (gear > 0) {
                const s = Math.abs(speed);
                if (s < 25) { rpm = 1000 + s * 80; gear = 1; }
                else if (s < 50) { rpm = 1200 + (s - 25) * 60; gear = 2; }
                else if (s < 90) { rpm = 1500 + (s - 50) * 50; gear = 3; }
                else { rpm = 2000 + (s - 90) * 40; gear = Math.min(5, 4 + Math.floor((s - 90) / 30)); }
            } else if (gear < 0) {
                rpm = 1000 + Math.abs(speed) * 60;
            } else {
                rpm = 800;
            }
        }

        // Allow negative speed (reverse) but clamp forward max
        speed = Math.max(-30, Math.min(200, speed));
        distance += Math.abs(speed) * 0.05;
        roadOffset += speed * 0.3;

        // Scroll traffic relative to player
        trafficCars.forEach(tc => {
            tc.relDist -= (speed - tc.speed) * 0.05;
        });
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

        // Scenery
        sceneryObjects.forEach(obj => {
            obj.relDist -= speed * 0.05;
        });
        sceneryObjects = sceneryObjects.filter(obj => obj.relDist > -10);
        if (distance > nextSceneryDist) {
            spawnScenery();
            nextSceneryDist = distance + 8 + Math.random() * 15;
        }

        // Speed limit changes
        if (distance > speedLimitChangeDist) {
            speedLimit = randomFrom([30, 50, 60, 80, 100]);
            speedLimitChangeDist = distance + 100 + Math.random() * 100;
        }

        // Collision check with traffic (perspective-based)
        trafficCars.forEach(tc => {
            if (tc.hit) return;
            if (tc.relDist > 0 && tc.relDist < 15) {
                // Check if player lane overlaps with traffic lane
                const laneDiff = Math.abs(playerLane - tc.lane);
                const steerOverlap = Math.abs(steerX - tc.lane * 0.5) < 0.5;
                if (laneDiff === 0 || steerOverlap) {
                    // Bump!
                    speed = Math.max(0, speed - 20);
                    tc.relDist += 15;
                    tc.hit = true;
                    penalties += 20;
                    addScore(-20);
                    shakeDuration = 15;
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
    function startGameTimer() {
        gameTimer = setInterval(() => {
            if (!running) return;
            timeLeft--;
            if (timeLeft <= 0) {
                running = false;
                clearInterval(gameTimer);
                const finalScore = Math.max(0, Math.floor(distance / 10 + smoothBonus - penalties));
                showResult('Conducción terminada!', `${(distance / 1000).toFixed(1)} km`,
                    `Puntos: ${finalScore} | Bonus: +${Math.floor(smoothBonus)} | Penalizaciones: -${Math.floor(penalties)}`,
                    () => startConducir(subtype));
            }
        }, 1000);
    }

    const kbDown = (e) => {
        keys[e.key] = true;
        if (showInstructions) {
            showInstructions = false;
            gameStarted = true;
            startGameTimer();
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
                    <button class="control-btn" id="dr-steer-l" style="flex:1;min-width:40px;">\u2190</button>
                    <button class="control-btn" id="dr-gas" style="flex:2;min-width:60px;background:linear-gradient(135deg,#43e97b44,#38f9d744);">GAS</button>
                    <button class="control-btn" id="dr-brake" style="flex:1.5;min-width:50px;background:linear-gradient(135deg,#ff512f44,#dd247644);">FRENO</button>
                    <button class="control-btn" id="dr-steer-r" style="flex:1;min-width:40px;">\u2192</button>
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
            el.addEventListener('touchstart', (e) => { e.preventDefault(); if (!gameStarted) { showInstructions = false; gameStarted = true; startGameTimer(); } onDown(); });
            el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
        };

        let steerLInt, steerRInt;
        const steerL = () => { steerX = Math.max(-1, steerX - 0.08); };
        const steerR = () => { steerX = Math.min(1, steerX + 0.08); };
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

        controls.insertAdjacentHTML('beforeend', `<div style="text-align:center;width:100%;color:#666;font-size:0.6rem;margin-top:2px;">\u2190/\u2192: girar | Espacio: gas | Shift: freno | Z: embrague | 1-${maxGear}/R/N: marchas</div>`);
    } else {
        controls.innerHTML = `
            <div style="display:flex;gap:4px;width:100%;justify-content:center;flex-wrap:wrap;">
                <button class="control-btn" id="dr-steer-l" style="flex:1;min-width:40px;">\u2190</button>
                <button class="control-btn" id="dr-gas" style="flex:2;min-width:60px;background:linear-gradient(135deg,#43e97b44,#38f9d744);">GAS</button>
                <button class="control-btn" id="dr-brake" style="flex:1.5;min-width:50px;background:linear-gradient(135deg,#ff512f44,#dd247644);">FRENO</button>
                <button class="control-btn" id="dr-steer-r" style="flex:1;min-width:40px;">\u2192</button>
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
            el.addEventListener('touchstart', (e) => { e.preventDefault(); if (!gameStarted) { showInstructions = false; gameStarted = true; startGameTimer(); } onDown(); });
            el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
        };

        let steerLInt, steerRInt;
        const steerL = () => { steerX = Math.max(-1, steerX - 0.08); };
        const steerR = () => { steerX = Math.min(1, steerX + 0.08); };
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

        controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.6rem;margin-top:2px;">\u2190/\u2192: girar | Espacio: gas | Shift: freno | P/R/D: marchas</div>');
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

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Toca las teclas para crear melodías 🎹</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Blancas: A S D F G H J K · Negras: W E T Y U</div>`;
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

// ===================== AJEDREZ =====================

function startAjedrez(subtypeId) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    const canvas = document.getElementById('game-canvas');
    ui.style.pointerEvents = 'none';

    switch (subtypeId) {
        case 'clasico': ajedrezClasico(ui, controls, canvas, false); break;
        case 'rapido': ajedrezRapido(ui, controls, canvas); break;
        case 'puzzle': ajedrezPuzzle(ui, controls, canvas); break;
    }
}

// ========== CHESS HELPERS ==========

function chessCreateBoard() {
    // Board is 8x8 array, row 0 = top (black side), row 7 = bottom (white side)
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    const backRow = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    for (let c = 0; c < 8; c++) {
        board[0][c] = { type: backRow[c], color: 'b' };
        board[1][c] = { type: 'P', color: 'b' };
        board[6][c] = { type: 'P', color: 'w' };
        board[7][c] = { type: backRow[c], color: 'w' };
    }
    return board;
}

function chessCloneBoard(board) {
    return board.map(row => row.map(cell => cell ? { ...cell } : null));
}

const CHESS_UNICODE = {
    wK: '\u2654', wQ: '\u2655', wR: '\u2656', wB: '\u2657', wN: '\u2658', wP: '\u2659',
    bK: '\u265A', bQ: '\u265B', bR: '\u265C', bB: '\u265D', bN: '\u265E', bP: '\u265F'
};

function chessPieceChar(piece) {
    if (!piece) return '';
    return CHESS_UNICODE[piece.color + piece.type] || '?';
}

function chessGetRawMoves(board, r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const moves = [];
    const color = piece.color;
    const enemy = color === 'w' ? 'b' : 'w';
    const dir = color === 'w' ? -1 : 1;
    const inBounds = (rr, cc) => rr >= 0 && rr < 8 && cc >= 0 && cc < 8;

    switch (piece.type) {
        case 'P': {
            const nr = r + dir;
            if (inBounds(nr, c) && !board[nr][c]) {
                moves.push([nr, c]);
                const startRow = color === 'w' ? 6 : 1;
                if (r === startRow && !board[r + 2 * dir][c]) moves.push([r + 2 * dir, c]);
            }
            for (const dc of [-1, 1]) {
                const nc = c + dc;
                if (inBounds(nr, nc) && board[nr][nc] && board[nr][nc].color === enemy) {
                    moves.push([nr, nc]);
                }
            }
            break;
        }
        case 'R': {
            for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
                for (let i = 1; i < 8; i++) {
                    const nr = r + dr * i, nc = c + dc * i;
                    if (!inBounds(nr, nc)) break;
                    if (board[nr][nc]) { if (board[nr][nc].color === enemy) moves.push([nr, nc]); break; }
                    moves.push([nr, nc]);
                }
            }
            break;
        }
        case 'B': {
            for (const [dr, dc] of [[1,1],[1,-1],[-1,1],[-1,-1]]) {
                for (let i = 1; i < 8; i++) {
                    const nr = r + dr * i, nc = c + dc * i;
                    if (!inBounds(nr, nc)) break;
                    if (board[nr][nc]) { if (board[nr][nc].color === enemy) moves.push([nr, nc]); break; }
                    moves.push([nr, nc]);
                }
            }
            break;
        }
        case 'Q': {
            for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]) {
                for (let i = 1; i < 8; i++) {
                    const nr = r + dr * i, nc = c + dc * i;
                    if (!inBounds(nr, nc)) break;
                    if (board[nr][nc]) { if (board[nr][nc].color === enemy) moves.push([nr, nc]); break; }
                    moves.push([nr, nc]);
                }
            }
            break;
        }
        case 'K': {
            for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]) {
                const nr = r + dr, nc = c + dc;
                if (inBounds(nr, nc) && (!board[nr][nc] || board[nr][nc].color === enemy)) moves.push([nr, nc]);
            }
            break;
        }
        case 'N': {
            for (const [dr, dc] of [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]) {
                const nr = r + dr, nc = c + dc;
                if (inBounds(nr, nc) && (!board[nr][nc] || board[nr][nc].color === enemy)) moves.push([nr, nc]);
            }
            break;
        }
    }
    return moves;
}

function chessFindKing(board, color) {
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++)
            if (board[r][c] && board[r][c].type === 'K' && board[r][c].color === color) return [r, c];
    return null;
}

function chessIsInCheck(board, color) {
    const king = chessFindKing(board, color);
    if (!king) return false;
    const enemy = color === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++)
            if (board[r][c] && board[r][c].color === enemy) {
                const moves = chessGetRawMoves(board, r, c);
                if (moves.some(m => m[0] === king[0] && m[1] === king[1])) return true;
            }
    return false;
}

function chessGetLegalMoves(board, r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const raw = chessGetRawMoves(board, r, c);
    const legal = [];
    for (const [tr, tc] of raw) {
        const clone = chessCloneBoard(board);
        clone[tr][tc] = clone[r][c];
        clone[r][c] = null;
        // Pawn promotion
        if (clone[tr][tc].type === 'P' && (tr === 0 || tr === 7)) clone[tr][tc].type = 'Q';
        if (!chessIsInCheck(clone, piece.color)) legal.push([tr, tc]);
    }
    return legal;
}

function chessAllLegalMoves(board, color) {
    const moves = [];
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++)
            if (board[r][c] && board[r][c].color === color)
                for (const [tr, tc] of chessGetLegalMoves(board, r, c))
                    moves.push({ from: [r, c], to: [tr, tc] });
    return moves;
}

function chessAIMove(board, aiDelay, callback) {
    const moves = chessAllLegalMoves(board, 'b');
    if (moves.length === 0) { callback(null); return; }
    // Weight captures higher
    const weighted = [];
    for (const m of moves) {
        const isCapture = board[m.to[0]][m.to[1]] !== null;
        const weight = isCapture ? 5 : 1;
        for (let i = 0; i < weight; i++) weighted.push(m);
    }
    const chosen = weighted[Math.floor(Math.random() * weighted.length)];
    setTimeout(() => callback(chosen), aiDelay);
}

// ========== CLASICO ==========

function ajedrezClasico(ui, controls, canvas, timed) {
    const container = document.getElementById('game-container');
    canvas.style.display = 'block';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let running = true;
    let animId;
    let board = chessCreateBoard();
    let turn = 'w'; // w = white (player), b = black (AI)
    let selected = null; // [r, c]
    let legalMoves = [];
    let captured = { w: [], b: [] }; // pieces captured BY each color
    let inCheck = false;
    let gameOver = false;
    let gameOverMsg = '';
    let cursorR = 7, cursorC = 4;

    // Timer for rapido mode
    let whiteTime = timed ? 300 : null; // 5 min in seconds
    let blackTime = timed ? 300 : null;
    let lastTick = timed ? Date.now() : null;
    let timerInterval = null;
    const aiDelay = timed ? 500 : 800;

    if (timed) {
        timerInterval = setInterval(() => {
            if (gameOver || !running) return;
            const now = Date.now();
            const dt = (now - lastTick) / 1000;
            lastTick = now;
            if (turn === 'w') whiteTime = Math.max(0, whiteTime - dt);
            else blackTime = Math.max(0, blackTime - dt);
            if (whiteTime <= 0) { gameOver = true; gameOverMsg = 'Tiempo agotado - Pierdes!'; showResult('Derrota!', '0:00', 'Se acabó tu tiempo', () => timed ? ajedrezRapido(ui, controls, canvas) : ajedrezClasico(ui, controls, canvas, false)); }
            if (blackTime <= 0) { gameOver = true; gameOverMsg = 'Tiempo agotado - ¡Ganas!'; showResult('Victoria!', '0:00', 'La IA se quedó sin tiempo', () => timed ? ajedrezRapido(ui, controls, canvas) : ajedrezClasico(ui, controls, canvas, false)); }
        }, 100);
    }

    const sqSize = Math.min(Math.floor(W / 10), Math.floor((H - 60) / 10));
    const boardPx = sqSize * 8;
    const offsetX = Math.floor((W - boardPx) / 2);
    const offsetY = Math.floor((H - boardPx) / 2) + (timed ? 15 : 0);

    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function render() {
        if (!running) return;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        // Turn / status
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + Math.max(11, sqSize * 0.22) + 'px sans-serif';
        ctx.textAlign = 'center';
        if (gameOver) {
            ctx.fillText(gameOverMsg, W / 2, offsetY - 8);
        } else {
            const turnTxt = turn === 'w' ? 'Tu turno (Blancas)' : 'IA pensando...';
            ctx.fillText(turnTxt, W / 2, offsetY - 8);
        }

        // Timers
        if (timed) {
            ctx.font = 'bold ' + Math.max(12, sqSize * 0.28) + 'px monospace';
            ctx.fillStyle = blackTime !== null && blackTime < 30 ? '#ff4444' : '#ccc';
            ctx.textAlign = 'left';
            ctx.fillText('⬛ ' + formatTime(blackTime), offsetX, offsetY - 22);
            ctx.fillStyle = whiteTime !== null && whiteTime < 30 ? '#ff4444' : '#ccc';
            ctx.textAlign = 'right';
            ctx.fillText('⬜ ' + formatTime(whiteTime), offsetX + boardPx, offsetY - 22);
        }

        // Board
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const x = offsetX + c * sqSize;
                const y = offsetY + r * sqSize;
                const isLight = (r + c) % 2 === 0;
                ctx.fillStyle = isLight ? '#F0D9B5' : '#B58863';

                // Highlights
                if (selected && selected[0] === r && selected[1] === c) ctx.fillStyle = '#f6f669';
                if (inCheck) {
                    const king = chessFindKing(board, turn);
                    if (king && king[0] === r && king[1] === c) ctx.fillStyle = '#ff4444';
                }
                ctx.fillRect(x, y, sqSize, sqSize);

                // Cursor
                if (cursorR === r && cursorC === c) {
                    ctx.strokeStyle = '#00ffff';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x + 1, y + 1, sqSize - 2, sqSize - 2);
                }

                // Legal move dots
                if (legalMoves.some(m => m[0] === r && m[1] === c)) {
                    ctx.fillStyle = 'rgba(0,200,0,0.5)';
                    if (board[r][c]) {
                        // Capture indicator - ring around square
                        ctx.strokeStyle = 'rgba(0,200,0,0.6)';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(x + 2, y + 2, sqSize - 4, sqSize - 4);
                    } else {
                        ctx.beginPath();
                        ctx.arc(x + sqSize / 2, y + sqSize / 2, sqSize * 0.15, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                // Piece
                const piece = board[r][c];
                if (piece) {
                    ctx.fillStyle = piece.color === 'w' ? '#fff' : '#222';
                    ctx.font = Math.floor(sqSize * 0.75) + 'px serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(chessPieceChar(piece), x + sqSize / 2, y + sqSize / 2 + 2);
                }
            }
        }

        // Captured pieces
        ctx.font = Math.max(10, sqSize * 0.35) + 'px serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const capY1 = offsetY + boardPx + 4;
        const capY2 = offsetY - (timed ? 40 : 24);
        ctx.fillStyle = '#ccc';
        const wCap = captured.w.map(p => chessPieceChar(p)).join('');
        const bCap = captured.b.map(p => chessPieceChar(p)).join('');
        ctx.fillText(wCap, offsetX, capY1);
        ctx.fillText(bCap, offsetX, capY2);

        animId = requestAnimationFrame(render);
    }

    function trySelect(r, c) {
        if (gameOver || turn !== 'w') return;
        if (selected) {
            // Try to move
            const mv = legalMoves.find(m => m[0] === r && m[1] === c);
            if (mv) {
                doMove(r, c);
                return;
            }
        }
        // Select a piece
        if (board[r][c] && board[r][c].color === 'w') {
            selected = [r, c];
            legalMoves = chessGetLegalMoves(board, r, c);
        } else {
            selected = null;
            legalMoves = [];
        }
    }

    function doMove(tr, tc) {
        const [sr, sc] = selected;
        if (board[tr][tc]) captured.w.push(board[tr][tc]);
        board[tr][tc] = board[sr][sc];
        board[sr][sc] = null;
        // Pawn promotion
        if (board[tr][tc].type === 'P' && tr === 0) board[tr][tc].type = 'Q';
        selected = null;
        legalMoves = [];
        addScore(1);

        // Check end conditions
        turn = 'b';
        if (timed) lastTick = Date.now();
        inCheck = chessIsInCheck(board, 'b');
        const aiMoves = chessAllLegalMoves(board, 'b');
        if (aiMoves.length === 0) {
            gameOver = true;
            if (inCheck) {
                gameOverMsg = '¡Jaque Mate! ¡Ganas!';
                addScore(50);
                showResult('Jaque Mate!', '♔', '¡Has ganado la partida!', () => timed ? ajedrezRapido(ui, controls, canvas) : ajedrezClasico(ui, controls, canvas, false));
            } else {
                gameOverMsg = 'Tablas (ahogado)';
                showResult('Tablas', '½-½', 'Rey ahogado', () => timed ? ajedrezRapido(ui, controls, canvas) : ajedrezClasico(ui, controls, canvas, false));
            }
            return;
        }

        // AI turn
        chessAIMove(board, aiDelay, (move) => {
            if (!running || gameOver) return;
            if (!move) return;
            if (board[move.to[0]][move.to[1]]) captured.b.push(board[move.to[0]][move.to[1]]);
            board[move.to[0]][move.to[1]] = board[move.from[0]][move.from[1]];
            board[move.from[0]][move.from[1]] = null;
            // Pawn promotion
            if (board[move.to[0]][move.to[1]].type === 'P' && move.to[0] === 7) board[move.to[0]][move.to[1]].type = 'Q';
            turn = 'w';
            if (timed) lastTick = Date.now();
            inCheck = chessIsInCheck(board, 'w');
            const pMoves = chessAllLegalMoves(board, 'w');
            if (pMoves.length === 0) {
                gameOver = true;
                if (inCheck) {
                    gameOverMsg = 'Jaque Mate - Pierdes';
                    showResult('Jaque Mate', '♚', 'La IA te ha ganado', () => timed ? ajedrezRapido(ui, controls, canvas) : ajedrezClasico(ui, controls, canvas, false));
                } else {
                    gameOverMsg = 'Tablas (ahogado)';
                    showResult('Tablas', '½-½', 'Rey ahogado', () => timed ? ajedrezRapido(ui, controls, canvas) : ajedrezClasico(ui, controls, canvas, false));
                }
            }
        });
    }

    // Click / touch
    function getSquare(ex, ey) {
        const rect = canvas.getBoundingClientRect();
        const mx = ex - rect.left;
        const my = ey - rect.top;
        const c = Math.floor((mx - offsetX) / sqSize);
        const r = Math.floor((my - offsetY) / sqSize);
        if (r >= 0 && r < 8 && c >= 0 && c < 8) return [r, c];
        return null;
    }

    const pointerHandler = (e) => {
        e.preventDefault();
        const sq = getSquare(e.clientX, e.clientY);
        if (sq) {
            cursorR = sq[0]; cursorC = sq[1];
            trySelect(sq[0], sq[1]);
        }
    };
    canvas.addEventListener('pointerdown', pointerHandler);

    // Keyboard
    const kbHandler = (e) => {
        if (gameOver) {
            if (e.code === 'KeyR') {
                if (timed) ajedrezRapido(ui, controls, canvas);
                else ajedrezClasico(ui, controls, canvas, false);
            }
            return;
        }
        switch (e.code) {
            case 'ArrowUp': e.preventDefault(); cursorR = Math.max(0, cursorR - 1); break;
            case 'ArrowDown': e.preventDefault(); cursorR = Math.min(7, cursorR + 1); break;
            case 'ArrowLeft': e.preventDefault(); cursorC = Math.max(0, cursorC - 1); break;
            case 'ArrowRight': e.preventDefault(); cursorC = Math.min(7, cursorC + 1); break;
            case 'Space': e.preventDefault(); trySelect(cursorR, cursorC); break;
            case 'KeyR': e.preventDefault();
                if (timed) ajedrezRapido(ui, controls, canvas);
                else ajedrezClasico(ui, controls, canvas, false);
                break;
        }
    };
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Flechas: mover cursor · Espacio: seleccionar/mover · R: reiniciar</div>';

    render();
    currentGame = { cleanup: () => { running = false; cancelAnimationFrame(animId); if (timerInterval) clearInterval(timerInterval); canvas.removeEventListener('pointerdown', pointerHandler); document.removeEventListener('keydown', kbHandler); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ========== RAPIDO ==========

function ajedrezRapido(ui, controls, canvas) {
    ajedrezClasico(ui, controls, canvas, true);
}

// ========== PUZZLE ==========

function ajedrezPuzzle(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.style.display = 'block';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let running = true;
    let animId;
    let score = 0;

    // Puzzles: each has a board setup, player color, and correct move
    const puzzles = [
        {
            name: 'Mate en 1 - Dama',
            setup: () => {
                const b = Array.from({ length: 8 }, () => Array(8).fill(null));
                b[0][4] = { type: 'K', color: 'b' };
                b[7][4] = { type: 'K', color: 'w' };
                b[4][3] = { type: 'Q', color: 'w' };
                b[1][0] = { type: 'R', color: 'w' };
                return b;
            },
            color: 'w',
            answer: { from: [4, 3], to: [1, 4] } // Qd5-e7 mate
        },
        {
            name: 'Mate en 1 - Torre',
            setup: () => {
                const b = Array.from({ length: 8 }, () => Array(8).fill(null));
                b[0][7] = { type: 'K', color: 'b' };
                b[0][6] = { type: 'P', color: 'b' };
                b[1][7] = { type: 'P', color: 'b' };
                b[7][4] = { type: 'K', color: 'w' };
                b[5][0] = { type: 'R', color: 'w' };
                return b;
            },
            color: 'w',
            answer: { from: [5, 0], to: [0, 0] } // Ra1# back rank mate
        },
        {
            name: 'Captura ganadora',
            setup: () => {
                const b = Array.from({ length: 8 }, () => Array(8).fill(null));
                b[0][4] = { type: 'K', color: 'b' };
                b[3][3] = { type: 'Q', color: 'b' };
                b[7][4] = { type: 'K', color: 'w' };
                b[5][5] = { type: 'N', color: 'w' };
                return b;
            },
            color: 'w',
            answer: { from: [5, 5], to: [3, 3] } // Knight takes queen (fork was prior)
        },
        {
            name: 'Fork - Caballo',
            setup: () => {
                const b = Array.from({ length: 8 }, () => Array(8).fill(null));
                b[0][4] = { type: 'K', color: 'b' };
                b[0][0] = { type: 'R', color: 'b' };
                b[7][4] = { type: 'K', color: 'w' };
                b[3][3] = { type: 'N', color: 'w' };
                return b;
            },
            color: 'w',
            answer: { from: [3, 3], to: [1, 2] } // Nc2 forks king and rook
        },
        {
            name: 'Mate en 1 - Alfil + Torre',
            setup: () => {
                const b = Array.from({ length: 8 }, () => Array(8).fill(null));
                b[0][6] = { type: 'K', color: 'b' };
                b[1][6] = { type: 'P', color: 'b' };
                b[1][7] = { type: 'P', color: 'b' };
                b[1][5] = { type: 'P', color: 'b' };
                b[7][4] = { type: 'K', color: 'w' };
                b[4][2] = { type: 'B', color: 'w' };
                b[5][7] = { type: 'R', color: 'w' };
                return b;
            },
            color: 'w',
            answer: { from: [5, 7], to: [0, 7] } // Rh1# with bishop covering escape
        },
        {
            name: 'Mate en 1 - Pasillo',
            setup: () => {
                const b = Array.from({ length: 8 }, () => Array(8).fill(null));
                b[0][5] = { type: 'K', color: 'b' };
                b[0][4] = { type: 'R', color: 'b' };
                b[1][5] = { type: 'P', color: 'b' };
                b[1][6] = { type: 'P', color: 'b' };
                b[7][4] = { type: 'K', color: 'w' };
                b[7][0] = { type: 'Q', color: 'w' };
                return b;
            },
            color: 'w',
            answer: { from: [7, 0], to: [0, 0] } // Qa8# corridor mate
        }
    ];

    let puzzleIdx = 0;
    let board = puzzles[0].setup();
    let selected = null;
    let legalMoves = [];
    let feedback = '';
    let feedbackTimer = 0;
    let cursorR = 7, cursorC = 4;

    const sqSize = Math.min(Math.floor(W / 10), Math.floor((H - 80) / 10));
    const boardPx = sqSize * 8;
    const offsetX = Math.floor((W - boardPx) / 2);
    const offsetY = Math.floor((H - boardPx) / 2) + 10;

    function loadPuzzle(idx) {
        if (idx >= puzzles.length) {
            setScore(score);
            showResult('Puzzles completos!', score + '/' + puzzles.length, '¡Bien hecho!', () => ajedrezPuzzle(ui, controls, canvas));
            return;
        }
        puzzleIdx = idx;
        board = puzzles[idx].setup();
        selected = null;
        legalMoves = [];
        feedback = '';
    }

    function render() {
        if (!running) return;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        // Title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + Math.max(11, sqSize * 0.24) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Puzzle ' + (puzzleIdx + 1) + '/' + puzzles.length + ': ' + puzzles[puzzleIdx].name, W / 2, offsetY - 14);
        ctx.font = Math.max(10, sqSize * 0.2) + 'px sans-serif';
        ctx.fillStyle = '#aaa';
        ctx.fillText('Encuentra la mejor jugada', W / 2, offsetY - 2);

        // Board
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const x = offsetX + c * sqSize;
                const y = offsetY + r * sqSize;
                const isLight = (r + c) % 2 === 0;
                ctx.fillStyle = isLight ? '#F0D9B5' : '#B58863';
                if (selected && selected[0] === r && selected[1] === c) ctx.fillStyle = '#f6f669';
                ctx.fillRect(x, y, sqSize, sqSize);

                // Cursor
                if (cursorR === r && cursorC === c) {
                    ctx.strokeStyle = '#00ffff';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x + 1, y + 1, sqSize - 2, sqSize - 2);
                }

                // Legal move dots
                if (legalMoves.some(m => m[0] === r && m[1] === c)) {
                    ctx.fillStyle = 'rgba(0,200,0,0.5)';
                    ctx.beginPath();
                    ctx.arc(x + sqSize / 2, y + sqSize / 2, sqSize * 0.15, 0, Math.PI * 2);
                    ctx.fill();
                }

                const piece = board[r][c];
                if (piece) {
                    ctx.fillStyle = piece.color === 'w' ? '#fff' : '#222';
                    ctx.font = Math.floor(sqSize * 0.75) + 'px serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(chessPieceChar(piece), x + sqSize / 2, y + sqSize / 2 + 2);
                }
            }
        }

        // Score
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold ' + Math.max(12, sqSize * 0.28) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Puntuación: ' + score + '/' + puzzles.length, W / 2, offsetY + boardPx + 20);

        // Feedback
        if (feedback) {
            ctx.fillStyle = feedback === '¡Correcto!' ? '#4CAF50' : '#ff4444';
            ctx.font = 'bold ' + Math.max(16, sqSize * 0.4) + 'px sans-serif';
            ctx.fillText(feedback, W / 2, offsetY + boardPx + 45);
            feedbackTimer--;
            if (feedbackTimer <= 0) {
                if (feedback === '¡Correcto!') {
                    loadPuzzle(puzzleIdx + 1);
                }
                feedback = '';
            }
        }

        animId = requestAnimationFrame(render);
    }

    function trySelect(r, c) {
        if (feedback) return;
        const pzl = puzzles[puzzleIdx];
        if (selected) {
            const mv = legalMoves.find(m => m[0] === r && m[1] === c);
            if (mv) {
                // Check if correct
                const ans = pzl.answer;
                if (selected[0] === ans.from[0] && selected[1] === ans.from[1] && r === ans.to[0] && c === ans.to[1]) {
                    // Correct!
                    board[r][c] = board[selected[0]][selected[1]];
                    board[selected[0]][selected[1]] = null;
                    feedback = '¡Correcto!';
                    feedbackTimer = 90;
                    score++;
                    addScore(10);
                } else {
                    feedback = '¡Intenta de nuevo!';
                    feedbackTimer = 60;
                }
                selected = null;
                legalMoves = [];
                return;
            }
        }
        if (board[r][c] && board[r][c].color === pzl.color) {
            selected = [r, c];
            legalMoves = chessGetLegalMoves(board, r, c);
        } else {
            selected = null;
            legalMoves = [];
        }
    }

    // Click / touch
    function getSquare(ex, ey) {
        const rect = canvas.getBoundingClientRect();
        const mx = ex - rect.left;
        const my = ey - rect.top;
        const col = Math.floor((mx - offsetX) / sqSize);
        const row = Math.floor((my - offsetY) / sqSize);
        if (row >= 0 && row < 8 && col >= 0 && col < 8) return [row, col];
        return null;
    }

    const pointerHandler = (e) => {
        e.preventDefault();
        const sq = getSquare(e.clientX, e.clientY);
        if (sq) { cursorR = sq[0]; cursorC = sq[1]; trySelect(sq[0], sq[1]); }
    };
    canvas.addEventListener('pointerdown', pointerHandler);

    const kbHandler = (e) => {
        switch (e.code) {
            case 'ArrowUp': e.preventDefault(); cursorR = Math.max(0, cursorR - 1); break;
            case 'ArrowDown': e.preventDefault(); cursorR = Math.min(7, cursorR + 1); break;
            case 'ArrowLeft': e.preventDefault(); cursorC = Math.max(0, cursorC - 1); break;
            case 'ArrowRight': e.preventDefault(); cursorC = Math.min(7, cursorC + 1); break;
            case 'Space': e.preventDefault(); trySelect(cursorR, cursorC); break;
            case 'KeyR': e.preventDefault(); loadPuzzle(puzzleIdx); break;
        }
    };
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Flechas: mover cursor · Espacio: seleccionar · R: reiniciar puzzle</div>';

    loadPuzzle(0);
    render();
    currentGame = { cleanup: () => { running = false; cancelAnimationFrame(animId); canvas.removeEventListener('pointerdown', pointerHandler); document.removeEventListener('keydown', kbHandler); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}