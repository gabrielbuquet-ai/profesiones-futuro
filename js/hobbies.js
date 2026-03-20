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
        case 'natacion': deporteNatacion(ui, controls); break;
        case 'atletismo': deporteAtletismo(ui, controls); break;
        case 'boxeo': deporteBoxeo(ui, controls); break;
    }
}

function deporteFutbol(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let goals = 0;
    let shots = 0;
    let maxShots = 10;
    let ball = { x: W / 2, y: H * 0.75, vx: 0, vy: 0, shooting: false };
    let goalkeeper = { x: W / 2, dir: 1 };
    let running = true;

    function draw() {
        // Field
        ctx.fillStyle = '#1a5c2a';
        ctx.fillRect(0, 0, W, H);

        // Goal
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.strokeRect(W * 0.2, 20, W * 0.6, H * 0.15);

        // Goal net pattern
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        for (let x = W * 0.2; x < W * 0.8; x += 15) {
            ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, 20 + H * 0.15); ctx.stroke();
        }
        for (let y = 20; y < 20 + H * 0.15; y += 15) {
            ctx.beginPath(); ctx.moveTo(W * 0.2, y); ctx.lineTo(W * 0.8, y); ctx.stroke();
        }

        // Goalkeeper
        ctx.font = '35px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧤', goalkeeper.x, 20 + H * 0.12);

        // Ball
        ctx.font = '30px serif';
        ctx.fillText('⚽', ball.x, ball.y);

        // HUD
        ctx.fillStyle = '#fff';
        ctx.font = '16px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Goles: ${goals}/${shots} | Tiros: ${maxShots - shots}`, 10, H - 15);
    }

    function update() {
        // Move goalkeeper
        goalkeeper.x += 3 * goalkeeper.dir;
        if (goalkeeper.x > W * 0.75) goalkeeper.dir = -1;
        if (goalkeeper.x < W * 0.25) goalkeeper.dir = 1;

        if (ball.shooting) {
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Check if ball reached goal area
            if (ball.y < 20 + H * 0.12) {
                shots++;
                // Check if goalkeeper caught it
                if (Math.abs(ball.x - goalkeeper.x) < 40) {
                    // Saved!
                    addScore(0);
                } else if (ball.x > W * 0.2 && ball.x < W * 0.8) {
                    // Goal!
                    goals++;
                    addScore(10);
                }
                resetBall();
                if (shots >= maxShots) {
                    running = false;
                    showResult('Partido terminado', `${goals}/${maxShots} goles`,
                        goals >= 7 ? 'Eres un crack!' : goals >= 4 ? 'Buen jugador!' : 'Sigue entrenando',
                        () => deporteFutbol(ui, controls, canvas));
                }
            }

            if (ball.y < -20 || ball.x < 0 || ball.x > W) {
                shots++;
                resetBall();
                if (shots >= maxShots) {
                    running = false;
                    showResult('Partido terminado', `${goals}/${maxShots} goles`,
                        goals >= 7 ? 'Eres un crack!' : goals >= 4 ? 'Buen jugador!' : 'Sigue entrenando',
                        () => deporteFutbol(ui, controls, canvas));
                }
            }
        }
    }

    function resetBall() {
        ball = { x: W / 2, y: H * 0.75, vx: 0, vy: 0, shooting: false };
    }

    function shoot(direction) {
        if (ball.shooting) return;
        ball.shooting = true;
        ball.vy = -12;
        ball.vx = direction * (3 + Math.random() * 4);
    }

    let animId;
    function loop() {
        if (!running) return;
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    controls.innerHTML = `
        <button class="control-btn" style="flex:1;" id="shoot-left">⬅️ Izquierda</button>
        <button class="control-btn" style="flex:1;" id="shoot-center">⬆️ Centro</button>
        <button class="control-btn" style="flex:1;" id="shoot-right">Derecha ➡️</button>
    `;
    document.getElementById('shoot-left').onclick = () => shoot(-1);
    document.getElementById('shoot-center').onclick = () => shoot(0);
    document.getElementById('shoot-right').onclick = () => shoot(1);

    loop();
    currentGame = { cleanup: () => { running = false; cancelAnimationFrame(animId); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function deporteBaloncesto(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let baskets = 0;
    let throws = 0;
    let maxThrows = 10;
    let power = 0;
    let charging = false;
    let ball = null;
    let running = true;
    const hoopX = W / 2;
    const hoopY = H * 0.2;

    function draw() {
        ctx.fillStyle = '#2d1810';
        ctx.fillRect(0, 0, W, H);

        // Court floor
        ctx.fillStyle = '#c4882f';
        ctx.fillRect(0, H * 0.6, W, H * 0.4);

        // Hoop
        ctx.strokeStyle = '#ff4500';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(hoopX, hoopY, 30, 8, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Backboard
        ctx.fillStyle = '#fff';
        ctx.fillRect(hoopX - 40, hoopY - 50, 80, 50);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(hoopX - 40, hoopY - 50, 80, 50);

        // Ball
        if (ball) {
            ctx.font = '30px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🏀', ball.x, ball.y);
        }

        // Power bar
        if (charging) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(W / 2 - 60, H * 0.85, 120, 20);
            const pColor = power < 40 ? '#ff4444' : power < 70 ? '#ffaa00' : '#44ff44';
            ctx.fillStyle = pColor;
            ctx.fillRect(W / 2 - 58, H * 0.85 + 2, (116 * power) / 100, 16);
        }

        // HUD
        ctx.fillStyle = '#fff';
        ctx.font = '16px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Canastas: ${baskets}/${throws} | Tiros: ${maxThrows - throws}`, 10, H - 15);
    }

    function throwBall() {
        if (ball) return;
        throws++;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
        const speed = 5 + (power / 100) * 10;
        ball = {
            x: W / 2,
            y: H * 0.7,
            vx: Math.cos(angle) * speed * (Math.random() - 0.5) * 2,
            vy: Math.sin(angle) * speed,
            gravity: 0.3
        };
    }

    let animId;
    let powerInterval;

    function update() {
        if (!running) return;
        if (ball) {
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vy += ball.gravity;

            // Check basket
            if (Math.abs(ball.x - hoopX) < 25 && Math.abs(ball.y - hoopY) < 15 && ball.vy > 0) {
                baskets++;
                addScore(15);
                ball = null;
                checkEnd();
                return;
            }

            if (ball.y > H + 50 || ball.x < -50 || ball.x > W + 50) {
                ball = null;
                checkEnd();
            }
        }
    }

    function checkEnd() {
        if (throws >= maxThrows) {
            running = false;
            showResult('Entrenamiento completado', `${baskets}/${maxThrows}`,
                baskets >= 6 ? 'MVP!' : baskets >= 3 ? 'Buen tirador' : 'Sigue practicando',
                () => deporteBaloncesto(ui, controls, canvas));
        }
    }

    function loop() {
        if (!running) return;
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    controls.innerHTML = `<button class="control-btn" style="flex:1; font-size: 1.2rem;" id="throw-btn">🏀 Mantener para cargar y soltar para lanzar</button>`;
    const btn = document.getElementById('throw-btn');

    const startCharge = (e) => {
        if (e) e.preventDefault();
        if (ball) return;
        charging = true;
        power = 0;
        powerInterval = setInterval(() => {
            power = Math.min(100, power + 3);
        }, 30);
    };
    const release = (e) => {
        if (e) e.preventDefault();
        if (!charging) return;
        charging = false;
        clearInterval(powerInterval);
        throwBall();
    };

    btn.addEventListener('mousedown', startCharge);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('touchstart', startCharge);
    btn.addEventListener('touchend', release);

    loop();
    currentGame = { cleanup: () => { running = false; cancelAnimationFrame(animId); clearInterval(powerInterval); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function deporteTenis(ui, controls, canvas) {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width, H = canvas.height;

    let playerX = W / 2;
    let ball = { x: W / 2, y: 50, vx: 3, vy: 4 };
    let points = 0;
    let misses = 0;
    let running = true;

    function draw() {
        // Court
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(0, 0, W, H);

        // Court lines
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(W * 0.1, 20, W * 0.8, H - 40);
        ctx.beginPath();
        ctx.moveTo(W * 0.1, H / 2);
        ctx.lineTo(W * 0.9, H / 2);
        ctx.stroke();

        // Ball
        ctx.font = '25px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎾', ball.x, ball.y);

        // Player racket
        ctx.font = '35px serif';
        ctx.fillText('🏸', playerX, H - 40);

        // HUD
        ctx.fillStyle = '#fff';
        ctx.font = '16px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Puntos: ${points} | Fallos: ${misses}/5`, 10, H - 10);
    }

    function update() {
        if (!running) return;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall bounce
        if (ball.x < W * 0.1 || ball.x > W * 0.9) ball.vx *= -1;
        if (ball.y < 20) ball.vy *= -1;

        // Player hit
        if (ball.y > H - 60 && Math.abs(ball.x - playerX) < 35 && ball.vy > 0) {
            ball.vy = -(4 + Math.random() * 2);
            ball.vx = (ball.x - playerX) * 0.15;
            points++;
            addScore(5);
        }

        // Miss
        if (ball.y > H + 20) {
            misses++;
            ball = { x: W / 2, y: 50, vx: (Math.random() - 0.5) * 6, vy: 4 };
            if (misses >= 5) {
                running = false;
                showResult('Partido terminado', points + ' pts',
                    points >= 20 ? 'Tenista profesional!' : points >= 10 ? 'Buen partido!' : 'Sigue practicando',
                    () => deporteTenis(ui, controls, canvas));
            }
        }
    }

    let animId;
    function loop() {
        if (!running) return;
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    controls.innerHTML = `
        <button class="control-btn" style="flex:1;" id="tennis-left">⬅️</button>
        <button class="control-btn" style="flex:1;" id="tennis-right">➡️</button>
    `;

    let lInt, rInt;
    const lBtn = document.getElementById('tennis-left');
    const rBtn = document.getElementById('tennis-right');

    const ml = () => { playerX = Math.max(W * 0.15, playerX - 15); };
    const mr = () => { playerX = Math.min(W * 0.85, playerX + 15); };

    lBtn.addEventListener('mousedown', () => { ml(); lInt = setInterval(ml, 30); });
    lBtn.addEventListener('mouseup', () => clearInterval(lInt));
    lBtn.addEventListener('mouseleave', () => clearInterval(lInt));
    lBtn.addEventListener('touchstart', (e) => { e.preventDefault(); ml(); lInt = setInterval(ml, 30); });
    lBtn.addEventListener('touchend', () => clearInterval(lInt));

    rBtn.addEventListener('mousedown', () => { mr(); rInt = setInterval(mr, 30); });
    rBtn.addEventListener('mouseup', () => clearInterval(rInt));
    rBtn.addEventListener('mouseleave', () => clearInterval(rInt));
    rBtn.addEventListener('touchstart', (e) => { e.preventDefault(); mr(); rInt = setInterval(mr, 30); });
    rBtn.addEventListener('touchend', () => clearInterval(rInt));

    loop();
    currentGame = { cleanup: () => { running = false; cancelAnimationFrame(animId); clearInterval(lInt); clearInterval(rInt); canvas.style.display = 'none'; ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function deporteNatacion(ui, controls) {
    let distance = 0;
    const target = 100;
    let taps = 0;
    let lastTap = 0;
    let speed = 0;
    let timer = null;

    function render() {
        const pct = Math.min(100, (distance / target) * 100);
        ui.innerHTML = `
            <div style="padding: 20px; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;">
                <div style="font-size: 4rem;">🏊</div>
                <h3>${Math.floor(distance)}m / ${target}m</h3>
                <div style="width: 80%; height: 30px; background: rgba(255,255,255,0.1); border-radius: 15px; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #00d2ff, #3a7bd5); border-radius: 15px; transition: width 0.1s;"></div>
                </div>
                <div style="color: #aaa; font-size: 0.8rem;">Velocidad: ${speed.toFixed(1)} m/s</div>
                <div style="color: #667eea; font-size: 0.9rem;">Toca rapido el boton para nadar!</div>
            </div>
        `;
    }

    timer = setInterval(() => {
        speed *= 0.95; // Friction
        distance += speed * 0.1;
        setScore(Math.floor(distance));
        render();
        if (distance >= target) {
            clearInterval(timer);
            showResult('Carrera completada!', Math.floor(taps) + ' brazadas',
                'Has completado ' + target + 'm!',
                () => deporteNatacion(ui, controls));
        }
    }, 100);

    controls.innerHTML = `<button class="control-btn" style="flex:1; font-size: 1.5rem; padding: 25px;" id="swim-btn">🏊 NADAR</button>`;
    document.getElementById('swim-btn').addEventListener('mousedown', () => {
        taps++;
        speed = Math.min(15, speed + 1.5);
    });
    document.getElementById('swim-btn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        taps++;
        speed = Math.min(15, speed + 1.5);
    });

    render();
    currentGame = { cleanup: () => { clearInterval(timer); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function deporteAtletismo(ui, controls) {
    let distance = 0;
    const target = 200;
    let speed = 0;
    let obstacles = [];
    let jumping = false;
    let jumpY = 0;
    let taps = 0;
    let running = true;
    let timer = null;

    // Generate obstacles
    for (let i = 30; i < target; i += 15 + Math.random() * 20) {
        obstacles.push({ pos: i, cleared: false });
    }

    function render() {
        const pct = Math.min(100, (distance / target) * 100);
        const nearObs = obstacles.find(o => o.pos > distance && o.pos < distance + 10);

        ui.innerHTML = `
            <div style="padding: 20px; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
                <div style="font-size: 0.8rem; color: #aaa;">${Math.floor(distance)}m / ${target}m</div>
                <div style="width: 90%; height: 24px; background: rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; position: relative;">
                    <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #fa709a, #fee140); border-radius: 12px; transition: width 0.1s;"></div>
                    ${obstacles.map(o => {
                        const oPct = (o.pos / target) * 100;
                        return `<div style="position: absolute; left: ${oPct}%; top: 0; width: 3px; height: 100%; background: ${o.cleared ? '#43e97b' : '#ff512f'};"></div>`;
                    }).join('')}
                </div>
                <div style="font-size: 4rem; transform: translateY(${-jumpY}px);">🏃</div>
                ${nearObs && !nearObs.cleared ? '<div style="font-size: 2rem;">🚧 OBSTACULO!</div>' : ''}
                <div style="color: #aaa; font-size: 0.8rem;">Velocidad: ${speed.toFixed(1)} m/s</div>
            </div>
        `;
    }

    timer = setInterval(() => {
        if (!running) return;
        speed *= 0.96;
        distance += speed * 0.1;

        // Jump physics
        if (jumping) {
            jumpY = Math.max(0, jumpY - 3);
            if (jumpY <= 0) jumping = false;
        }

        // Obstacle check
        obstacles.forEach(o => {
            if (!o.cleared && Math.abs(distance - o.pos) < 2) {
                if (jumpY > 10) {
                    o.cleared = true;
                    addScore(15);
                } else {
                    speed = Math.max(0, speed - 3);
                    o.cleared = true;
                    addScore(-5);
                }
            }
        });

        setScore(Math.floor(distance));
        render();
        if (distance >= target) {
            running = false;
            clearInterval(timer);
            showResult('Carrera completada!', score + ' pts', 'Has terminado los ' + target + 'm!',
                () => deporteAtletismo(ui, controls));
        }
    }, 100);

    controls.innerHTML = `
        <button class="control-btn" style="flex:1; font-size: 1.2rem; padding: 20px;" id="run-btn">🏃 CORRER</button>
        <button class="control-btn" style="flex:1; font-size: 1.2rem; padding: 20px;" id="jump-btn">🦘 SALTAR</button>
    `;

    document.getElementById('run-btn').addEventListener('mousedown', () => { speed = Math.min(12, speed + 1.5); });
    document.getElementById('run-btn').addEventListener('touchstart', (e) => { e.preventDefault(); speed = Math.min(12, speed + 1.5); });
    document.getElementById('jump-btn').addEventListener('mousedown', () => { if (!jumping) { jumping = true; jumpY = 40; } });
    document.getElementById('jump-btn').addEventListener('touchstart', (e) => { e.preventDefault(); if (!jumping) { jumping = true; jumpY = 40; } });

    render();
    currentGame = { cleanup: () => { running = false; clearInterval(timer); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

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

    render();
    currentGame = { cleanup: () => { clearInterval(timer); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ===================== CONDUCIR =====================

function startConducir(subtype) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    ui.style.pointerEvents = 'auto';

    let speed = 0;
    let gear = 0; // 0=N, 1-5=gears, -1=R
    let rpm = 0;
    let clutchPressed = false;
    let gasPressed = false;
    let brakePressed = false;
    let distance = 0;
    let running = true;
    let timer = null;
    const isManual = subtype === 'manual' || subtype === 'moto';
    const maxGear = subtype === 'moto' ? 6 : 5;

    const gearRatios = [0, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8];
    const optimalRPM = { min: 2000, max: 4000 };

    function render() {
        const rpmPct = Math.min(100, (rpm / 8000) * 100);
        const rpmColor = rpm > 6500 ? '#ff512f' : rpm > 4000 ? '#ffd700' : '#43e97b';

        ui.innerHTML = `
            <div class="gear-display">
                <div class="speedometer">
                    <div class="speed-value">${Math.floor(speed)}</div>
                    <div class="speed-unit">km/h</div>
                </div>
                <div class="gear-indicator">
                    ${isManual ? `Marcha: ${gear === -1 ? 'R' : gear === 0 ? 'N' : gear}` : `${gear === -1 ? 'R' : gear === 0 ? 'P' : 'D'}`}
                </div>
                ${isManual ? `
                <div style="width: 80%; height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden;">
                    <div style="width: ${rpmPct}%; height: 100%; background: ${rpmColor}; border-radius: 6px; transition: width 0.1s;"></div>
                </div>
                <div style="font-size: 0.7rem; color: #aaa;">${Math.floor(rpm)} RPM</div>
                ` : ''}
                <div style="font-size: 0.8rem; color: #888;">Distancia: ${(distance / 1000).toFixed(1)} km</div>
                ${clutchPressed ? '<div style="color: #667eea; font-size: 0.8rem;">Embrague pisado</div>' : ''}
                ${rpm > 6500 && isManual ? '<div style="color: #ff512f; font-size: 0.8rem; animation: pulse 0.5s infinite;">¡Cambia de marcha!</div>' : ''}
            </div>
        `;
    }

    timer = setInterval(() => {
        if (!running) return;

        if (isManual) {
            // Manual transmission
            if (gasPressed && gear !== 0) {
                if (clutchPressed) {
                    rpm = Math.min(8000, rpm + 300);
                } else {
                    rpm = Math.min(8000, rpm + 200);
                    const targetSpeed = rpm * gearRatios[Math.abs(gear)] * 0.015 * (gear < 0 ? -1 : 1);
                    speed += (targetSpeed - speed) * 0.1;
                }
            } else {
                rpm = Math.max(800, rpm - 150);
                speed *= 0.98;
            }

            if (brakePressed) {
                speed *= 0.9;
                if (Math.abs(speed) < 1) speed = 0;
            }

            // Engine stall
            if (!clutchPressed && gear !== 0 && rpm < 600) {
                rpm = 0;
                speed = 0;
                gear = 0;
            }

            // RPM based on speed when not clutched
            if (!clutchPressed && gear > 0) {
                rpm = Math.max(800, speed / (gearRatios[gear] * 0.015));
            }
        } else {
            // Automatic
            if (gasPressed && gear > 0) {
                speed = Math.min(200, speed + 2);
            } else if (gasPressed && gear < 0) {
                speed = Math.max(-30, speed - 1);
            } else {
                speed *= 0.98;
            }
            if (brakePressed) {
                speed *= 0.85;
                if (Math.abs(speed) < 1) speed = 0;
            }
        }

        distance += Math.abs(speed) * 0.1;
        setScore(Math.floor(distance / 10));
        render();
    }, 100);

    // Controls
    if (isManual) {
        controls.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                <div class="gear-shifter" style="display: flex; justify-content: center; gap: 6px; flex-wrap: wrap;">
                    <button class="gear-btn ${gear === -1 ? 'active-gear' : ''}" data-gear="-1">R</button>
                    <button class="gear-btn ${gear === 0 ? 'active-gear' : ''}" data-gear="0">N</button>
                    ${Array.from({length: maxGear}, (_, i) => `<button class="gear-btn ${gear === i+1 ? 'active-gear' : ''}" data-gear="${i+1}">${i+1}</button>`).join('')}
                </div>
                <div class="pedals" style="justify-content: center;">
                    <div class="pedal pedal-clutch" id="pedal-clutch">EMBRAGUE</div>
                    <div class="pedal pedal-brake" id="pedal-brake">FRENO</div>
                    <div class="pedal pedal-gas" id="pedal-gas">GAS</div>
                </div>
            </div>
        `;

        // Gear buttons
        controls.querySelectorAll('.gear-btn').forEach(btn => {
            btn.onclick = () => {
                if (!clutchPressed && speed > 5) return; // Must press clutch to change gear
                gear = parseInt(btn.dataset.gear);
                controls.querySelectorAll('.gear-btn').forEach(b => b.classList.remove('active-gear'));
                btn.classList.add('active-gear');
            };
        });

        // Pedals
        const setupPedal = (id, onDown, onUp) => {
            const el = document.getElementById(id);
            el.addEventListener('mousedown', onDown);
            el.addEventListener('mouseup', onUp);
            el.addEventListener('mouseleave', onUp);
            el.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); });
            el.addEventListener('touchend', onUp);
        };

        setupPedal('pedal-clutch', () => { clutchPressed = true; }, () => { clutchPressed = false; });
        setupPedal('pedal-brake', () => { brakePressed = true; }, () => { brakePressed = false; });
        setupPedal('pedal-gas', () => { gasPressed = true; }, () => { gasPressed = false; });
    } else {
        controls.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                <div style="display: flex; justify-content: center; gap: 8px;">
                    <button class="gear-btn" data-gear="0">P</button>
                    <button class="gear-btn" data-gear="-1">R</button>
                    <button class="gear-btn active-gear" data-gear="1">D</button>
                </div>
                <div class="pedals" style="justify-content: center;">
                    <div class="pedal pedal-brake" id="pedal-brake-auto">FRENO</div>
                    <div class="pedal pedal-gas" id="pedal-gas-auto">GAS</div>
                </div>
            </div>
        `;

        gear = 1;
        controls.querySelectorAll('.gear-btn').forEach(btn => {
            btn.onclick = () => {
                gear = parseInt(btn.dataset.gear);
                controls.querySelectorAll('.gear-btn').forEach(b => b.classList.remove('active-gear'));
                btn.classList.add('active-gear');
            };
        });

        const setupPedal = (id, onDown, onUp) => {
            const el = document.getElementById(id);
            el.addEventListener('mousedown', onDown);
            el.addEventListener('mouseup', onUp);
            el.addEventListener('mouseleave', onUp);
            el.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); });
            el.addEventListener('touchend', onUp);
        };

        setupPedal('pedal-brake-auto', () => { brakePressed = true; }, () => { brakePressed = false; });
        setupPedal('pedal-gas-auto', () => { gasPressed = true; }, () => { gasPressed = false; });
    }

    render();
    currentGame = { cleanup: () => { running = false; clearInterval(timer); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
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

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Toca los pads para crear ritmos 🥁</div>`;
    currentGame = { cleanup: () => { audioCtx.close(); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
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

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Toca las teclas para crear melodias 🎹</div>`;
    currentGame = { cleanup: () => { audioCtx.close(); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
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

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Pulsa los acordes para rasguear 🎸</div>`;
    currentGame = { cleanup: () => { audioCtx.close(); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
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

    render();
    currentGame = { cleanup: () => { playing = false; clearInterval(beatInterval); audioCtx.close(); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}
