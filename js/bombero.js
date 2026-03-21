// ==========================================
// BOMBEROS - Mini-juegos interactivos
// ==========================================

function startBombero(subtype) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    ui.style.pointerEvents = 'auto';

    switch (subtype) {
        case 'extincion': bomberoExtincion(ui, controls); break;
        case 'rescate': bomberoRescate(ui, controls); break;
        case 'conduccion': bomberoConduccion(ui, controls); break;
        case 'forestal': bomberoForestal(ui, controls); break;
    }
}

// ============================================================
// 1. EXTINCION - Grid firefighting with water jets + animations
// ============================================================
function bomberoExtincion(ui, controls) {
    const GRID = 5;
    const grid = [];
    let fires = 0;
    let totalFires = 0;
    let waterLeft = 15;
    let splashEffects = []; // {r, c, age}

    for (let r = 0; r < GRID; r++) {
        grid[r] = [];
        for (let c = 0; c < GRID; c++) {
            const hasFire = Math.random() < 0.4;
            grid[r][c] = { fire: hasFire, extinguished: false };
            if (hasFire) { fires++; totalFires++; }
        }
    }

    function render() {
        ui.innerHTML = `
            <div style="padding: 10px; text-align: center;">
                <div style="display: flex; justify-content: center; gap: 16px; font-size: 0.85rem; color: #aaa;">
                    <span>💧 Agua: <b style="color: ${waterLeft <= 5 ? '#ff6b6b' : '#4fc3f7'}">${waterLeft}</b></span>
                    <span>🔥 Fuegos: <b style="color: ${fires <= 3 ? '#43e97b' : '#ff9800'}">${fires}</b></span>
                </div>
                <div style="height: 4px; background: rgba(255,255,255,0.08); border-radius: 4px; margin: 8px 20px 0;">
                    <div style="height: 100%; width: ${((totalFires - fires) / Math.max(totalFires, 1)) * 100}%; background: linear-gradient(90deg, #4fc3f7, #43e97b); border-radius: 4px; transition: width 0.3s;"></div>
                </div>
            </div>
            <div class="game-grid" id="fire-grid" style="grid-template-columns: repeat(${GRID}, 1fr); padding: 16px; height: auto; flex: 1;"></div>
        `;

        const gridEl = document.getElementById('fire-grid');
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.fontSize = '2rem';
                cell.style.minHeight = '60px';
                cell.style.transition = 'all 0.3s ease';
                cell.style.position = 'relative';

                if (grid[r][c].fire && !grid[r][c].extinguished) {
                    cell.innerHTML = '<span class="fire-emoji" style="animation: fireFlicker 0.4s ease-in-out infinite alternate;">🔥</span>';
                    cell.style.background = 'rgba(255, 80, 50, 0.2)';
                    cell.style.borderColor = 'rgba(255, 80, 50, 0.4)';
                    cell.style.boxShadow = '0 0 12px rgba(255, 80, 50, 0.2)';
                } else if (grid[r][c].extinguished) {
                    cell.textContent = '💨';
                    cell.style.background = 'rgba(100, 200, 255, 0.1)';
                    cell.style.animation = 'fadeIn 0.3s ease';
                } else {
                    cell.textContent = '🏢';
                    cell.style.opacity = '0.5';
                }

                // Splash effect
                const splash = splashEffects.find(s => s.r === r && s.c === c);
                if (splash && splash.age < 1) {
                    const overlay = document.createElement('div');
                    overlay.style.cssText = `position:absolute; top:0; left:0; right:0; bottom:0; background: radial-gradient(circle, rgba(100,200,255,${0.4 * (1 - splash.age)}) 0%, transparent 70%); border-radius: inherit; pointer-events: none;`;
                    cell.style.position = 'relative';
                    cell.appendChild(overlay);
                }

                cell.onclick = () => extinguish(r, c);
                gridEl.appendChild(cell);
            }
        }

        if (fires === 0) {
            addScore(50);
            showResult('Incendio apagado!', score + ' pts',
                `Has usado ${15 - waterLeft} chorros de agua para apagar ${totalFires} fuegos.`,
                () => bomberoExtincion(ui, controls));
        }
        if (waterLeft <= 0 && fires > 0) {
            showResult('Sin agua!', score + ' pts',
                `Te has quedado sin agua. Quedaban ${fires} fuegos.`,
                () => bomberoExtincion(ui, controls));
        }
    }

    function extinguish(r, c) {
        if (waterLeft <= 0) return;
        if (!grid[r][c].fire || grid[r][c].extinguished) return;
        waterLeft--;
        grid[r][c].extinguished = true;
        fires--;
        addScore(10);
        splashEffects.push({ r, c, age: 0 });
        render();

        // Animate splash fade
        let anim = setInterval(() => {
            const fx = splashEffects.find(s => s.r === r && s.c === c);
            if (fx) { fx.age += 0.1; if (fx.age >= 1) clearInterval(anim); }
            else clearInterval(anim);
        }, 50);
    }

    let cursorR = 0, cursorC = 0;
    const kbHandler = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { cursorR = Math.max(0, cursorR - 1); highlightCursor(); }
        else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { cursorR = Math.min(GRID - 1, cursorR + 1); highlightCursor(); }
        else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { cursorC = Math.max(0, cursorC - 1); highlightCursor(); }
        else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { cursorC = Math.min(GRID - 1, cursorC + 1); highlightCursor(); }
        else if (e.key === 'Enter' || e.code === 'Space') { e.preventDefault(); extinguish(cursorR, cursorC); }
    };
    function highlightCursor() {
        const gridEl = document.getElementById('fire-grid');
        if (!gridEl) return;
        gridEl.querySelectorAll('.grid-cell').forEach((c, i) => { c.style.outline = ''; c.style.transform = ''; });
        const idx = cursorR * GRID + cursorC;
        if (gridEl.children[idx]) {
            gridEl.children[idx].style.outline = '3px solid #00d2ff';
            gridEl.children[idx].style.transform = 'scale(1.05)';
        }
    }
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = `
        <div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">
            Toca los fuegos para apagarlos 💧
        </div>
        <div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">WASD/Flechas: mover | Enter/Espacio: apagar</div>
    `;

    render();
    currentGame = { cleanup: () => { document.removeEventListener('keydown', kbHandler); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ============================================================
// 2. RESCATE - Building floor exploration with timer + animations
// ============================================================
function bomberoRescate(ui, controls) {
    const FLOORS = 5;
    const people = [];
    let rescued = 0;
    let timeLeft = 30;
    let timer = null;
    let shakeFloor = -1;

    for (let i = 0; i < FLOORS; i++) {
        const hasPerson = Math.random() < 0.6;
        people.push({ floor: i, hasPerson, rescued: false, checked: false });
    }
    const totalPeople = people.filter(p => p.hasPerson).length;

    function render() {
        const urgency = timeLeft <= 10 ? 'rgba(255,80,50,0.05)' : 'transparent';
        ui.innerHTML = `
            <div style="padding: 10px; text-align: center;">
                <div style="display: flex; justify-content: center; gap: 16px; font-size: 0.85rem; color: #aaa;">
                    <span>⏱️ <b style="color: ${timeLeft <= 10 ? '#ff6b6b' : '#ffc107'}">${timeLeft}s</b></span>
                    <span>🧑 Rescatados: <b style="color: #43e97b">${rescued}</b>/${totalPeople}</span>
                </div>
                <div style="height: 4px; background: rgba(255,255,255,0.08); border-radius: 4px; margin: 8px 20px 0;">
                    <div style="height: 100%; width: ${(rescued / Math.max(totalPeople, 1)) * 100}%; background: linear-gradient(90deg, #ffc107, #43e97b); border-radius: 4px; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="display: flex; flex-direction: column-reverse; gap: 8px; padding: 16px; flex: 1; justify-content: center; background: ${urgency}; transition: background 0.5s;" id="building-floors">
            </div>
        `;

        const floorsEl = document.getElementById('building-floors');
        for (let i = 0; i < FLOORS; i++) {
            const p = people[i];
            const floor = document.createElement('div');
            const isShaking = shakeFloor === i;
            floor.style.cssText = `display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent;${isShaking ? ' animation: shake 0.3s ease;' : ''}`;

            if (p.checked && p.hasPerson && !p.rescued) {
                floor.style.background = 'rgba(255, 200, 50, 0.15)';
                floor.style.border = '1px solid rgba(255, 200, 50, 0.3)';
                floor.style.boxShadow = '0 0 10px rgba(255, 200, 50, 0.1)';
            } else if (p.rescued) {
                floor.style.background = 'rgba(67, 233, 123, 0.15)';
                floor.style.border = '1px solid rgba(67, 233, 123, 0.3)';
            }

            const label = p.rescued ? '✅ Rescatado!' : p.checked ? (p.hasPerson ? '🧑 Persona encontrada! (Toca para rescatar)' : '✔️ Vacio - seguro') : '❓ Sin explorar';
            const icon = p.rescued ? '🏠' : p.checked && p.hasPerson ? '🧑' : p.checked ? '🏠' : '🔒';
            const iconAnim = p.checked && p.hasPerson && !p.rescued ? 'animation: pulse 1s ease-in-out infinite;' : '';

            floor.innerHTML = `
                <div style="font-size: 1.5rem; width: 40px; text-align: center; ${iconAnim}">${icon}</div>
                <div style="flex:1;">
                    <div style="font-weight: 700; font-size: 0.9rem;">Piso ${i + 1}</div>
                    <div style="font-size: 0.75rem; color: #aaa;">${label}</div>
                </div>
                <div style="font-size: 0.7rem; color: #555;">Toca</div>
            `;

            floor.onclick = () => {
                if (p.rescued) return;
                if (!p.checked) {
                    p.checked = true;
                    addScore(5);
                    shakeFloor = i;
                    setTimeout(() => { shakeFloor = -1; render(); }, 300);
                } else if (p.hasPerson && !p.rescued) {
                    p.rescued = true;
                    rescued++;
                    addScore(20);
                }
                render();
                checkWin();
            };

            floorsEl.appendChild(floor);
        }
    }

    function checkWin() {
        if (rescued >= totalPeople) {
            clearInterval(timer);
            addScore(timeLeft * 2);
            showResult('Rescate completado!', score + ' pts',
                `Has rescatado a ${rescued} personas con ${timeLeft}s de sobra!`,
                () => bomberoRescate(ui, controls));
        }
    }

    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResult('Tiempo agotado!', score + ' pts',
                `Rescataste ${rescued} de ${totalPeople} personas.`,
                () => bomberoRescate(ui, controls));
        }
        render();
    }, 1000);

    let cursorFloor = 0;
    const kbHandler = (e) => {
        const num = parseInt(e.key);
        if (num >= 1 && num <= FLOORS) {
            const idx = num - 1;
            const p = people[idx];
            if (!p.rescued) {
                if (!p.checked) { p.checked = true; addScore(5); }
                else if (p.hasPerson && !p.rescued) { p.rescued = true; rescued++; addScore(20); }
                render(); checkWin();
            }
        }
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') cursorFloor = Math.min(FLOORS - 1, cursorFloor + 1);
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') cursorFloor = Math.max(0, cursorFloor - 1);
        if (e.key === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            const p = people[cursorFloor];
            if (!p.rescued) {
                if (!p.checked) { p.checked = true; addScore(5); }
                else if (p.hasPerson && !p.rescued) { p.rescued = true; rescued++; addScore(20); }
                render(); checkWin();
            }
        }
    };
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Explora cada piso y rescata a las personas</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">1-${FLOORS}: piso directo | Flechas: mover | Enter: explorar/rescatar</div>`;
    render();

    currentGame = { cleanup: () => { clearInterval(timer); document.removeEventListener('keydown', kbHandler); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// ============================================================
// 3. CONDUCCION - Canvas fire truck driving (improved visuals)
// ============================================================
function bomberoConduccion(ui, controls) {
    const canvas = document.getElementById('game-canvas');
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = canvas.width;
    const H = canvas.height;

    let truckX = W / 2;
    const truckY = H - 80;
    let obstacles = [];
    let gameSpeed = 3;
    let running = true;
    let distance = 0;
    let frame = 0;
    let siren = 0;
    let particles = [];

    function spawnObstacle() {
        const lanes = [W * 0.2, W * 0.4, W * 0.6, W * 0.8];
        obstacles.push({
            x: randomFrom(lanes),
            y: -40,
            type: randomFrom(['🚗', '🚕', '🚌', '🌳', '🚧'])
        });
    }

    function draw() {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        // Road
        const roadGrad = ctx.createLinearGradient(W * 0.1, 0, W * 0.9, 0);
        roadGrad.addColorStop(0, '#222244');
        roadGrad.addColorStop(0.05, '#2d2d4e');
        roadGrad.addColorStop(0.95, '#2d2d4e');
        roadGrad.addColorStop(1, '#222244');
        ctx.fillStyle = roadGrad;
        ctx.fillRect(W * 0.1, 0, W * 0.8, H);

        // Road edge lines
        ctx.strokeStyle = '#ffc107';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(W * 0.1, 0); ctx.lineTo(W * 0.1, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W * 0.9, 0); ctx.lineTo(W * 0.9, H); ctx.stroke();

        // Road lane lines
        ctx.strokeStyle = '#555';
        ctx.setLineDash([20, 20]);
        ctx.lineWidth = 2;
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            for (let y = (frame * 3) % 40 - 20; y < H; y += 40) {
                ctx.moveTo(W * 0.1 + (W * 0.8 / 4) * i, y);
                ctx.lineTo(W * 0.1 + (W * 0.8 / 4) * i, y + 20);
            }
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Speed particles
        particles = particles.filter(p => p.y < H);
        particles.forEach(p => {
            p.y += gameSpeed * 2;
            ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.fillRect(p.x, p.y, 1, 4);
        });
        if (frame % 3 === 0) {
            particles.push({ x: W * 0.1 + Math.random() * W * 0.8, y: -5, alpha: 0.1 + Math.random() * 0.2 });
        }

        // Truck with siren glow
        siren += 0.15;
        const sirenColor = Math.sin(siren) > 0 ? 'rgba(255,50,50,0.15)' : 'rgba(50,100,255,0.15)';
        ctx.fillStyle = sirenColor;
        ctx.beginPath();
        ctx.arc(truckX, truckY - 10, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '40px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🚒', truckX, truckY);

        // Obstacles
        ctx.font = '35px serif';
        obstacles.forEach(o => {
            ctx.fillText(o.type, o.x, o.y);
        });

        // HUD
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, W, 40);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Distancia: ${distance}m`, 10, 26);
        ctx.textAlign = 'right';
        const speedLabel = gameSpeed < 4 ? 'Normal' : gameSpeed < 6 ? 'Rapido' : 'Muy rapido!';
        ctx.fillStyle = gameSpeed >= 6 ? '#ff6b6b' : '#ffc107';
        ctx.fillText(speedLabel, W - 10, 26);
    }

    function update() {
        if (!running) return;
        frame++;
        distance = Math.floor(frame / 5);

        if (frame % 40 === 0) spawnObstacle();
        if (frame % 200 === 0) gameSpeed += 0.5;

        obstacles.forEach(o => o.y += gameSpeed);

        obstacles.forEach(o => {
            if (Math.abs(o.x - truckX) < 30 && Math.abs(o.y - truckY) < 30) {
                running = false;
                setScore(distance);
                showResult('Choque!', distance + 'm',
                    'Has recorrido ' + distance + ' metros sin chocar.',
                    () => bomberoConduccion(ui, controls));
            }
        });

        obstacles = obstacles.filter(o => o.y < H + 50);
        setScore(distance);
    }

    let animId;
    function loop() {
        update();
        draw();
        if (running) animId = requestAnimationFrame(loop);
    }

    controls.innerHTML = `
        <button class="control-btn" id="drive-left" style="flex:1; font-size: 1.5rem;">⬅️</button>
        <button class="control-btn" id="drive-right" style="flex:1; font-size: 1.5rem;">➡️</button>
    `;

    const moveAmount = 15;
    document.getElementById('drive-left').addEventListener('mousedown', () => { truckX = Math.max(W * 0.15, truckX - 50); });
    document.getElementById('drive-right').addEventListener('mousedown', () => { truckX = Math.min(W * 0.85, truckX + 50); });
    document.getElementById('drive-left').addEventListener('touchstart', (e) => { e.preventDefault(); truckX = Math.max(W * 0.15, truckX - 50); });
    document.getElementById('drive-right').addEventListener('touchstart', (e) => { e.preventDefault(); truckX = Math.min(W * 0.85, truckX + 50); });

    let leftInterval, rightInterval;
    const startLeft = () => { leftInterval = setInterval(() => { truckX = Math.max(W * 0.15, truckX - moveAmount); }, 50); };
    const startRight = () => { rightInterval = setInterval(() => { truckX = Math.min(W * 0.85, truckX + moveAmount); }, 50); };
    const stopLeft = () => clearInterval(leftInterval);
    const stopRight = () => clearInterval(rightInterval);

    const lBtn = document.getElementById('drive-left');
    const rBtn = document.getElementById('drive-right');
    lBtn.addEventListener('mousedown', startLeft); lBtn.addEventListener('mouseup', stopLeft); lBtn.addEventListener('mouseleave', stopLeft);
    lBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startLeft(); }); lBtn.addEventListener('touchend', stopLeft);
    rBtn.addEventListener('mousedown', startRight); rBtn.addEventListener('mouseup', stopRight); rBtn.addEventListener('mouseleave', stopRight);
    rBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startRight(); }); rBtn.addEventListener('touchend', stopRight);

    let kbLInt, kbRInt;
    const kbDown = (e) => {
        if ((e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') && !kbLInt) { truckX = Math.max(W * 0.15, truckX - 50); kbLInt = setInterval(() => { truckX = Math.max(W * 0.15, truckX - moveAmount); }, 50); }
        if ((e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') && !kbRInt) { truckX = Math.min(W * 0.85, truckX + 50); kbRInt = setInterval(() => { truckX = Math.min(W * 0.85, truckX + moveAmount); }, 50); }
    };
    const kbUp = (e) => {
        if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') { clearInterval(kbLInt); kbLInt = null; }
        if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') { clearInterval(kbRInt); kbRInt = null; }
    };
    document.addEventListener('keydown', kbDown);
    document.addEventListener('keyup', kbUp);
    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">A/← Izq | D/→ Der</div>');

    loop();

    currentGame = {
        cleanup: () => {
            running = false;
            cancelAnimationFrame(animId);
            clearInterval(leftInterval);
            clearInterval(rightInterval);
            clearInterval(kbLInt);
            clearInterval(kbRInt);
            document.removeEventListener('keydown', kbDown);
            document.removeEventListener('keyup', kbUp);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

// ============================================================
// 4. FORESTAL - Forest fire with spreading + improved visuals
// ============================================================
function bomberoForestal(ui, controls) {
    const GRID = 6;
    const grid = [];
    let waterDrops = 20;
    let fires = 0;
    let totalFires = 0;
    let spreadTimer = null;
    let spreadCount = 0;

    for (let r = 0; r < GRID; r++) {
        grid[r] = [];
        for (let c = 0; c < GRID; c++) {
            const type = Math.random() < 0.25 ? 'fire' : 'tree';
            grid[r][c] = { type, extinguished: false };
            if (type === 'fire') { fires++; totalFires++; }
        }
    }

    function render() {
        const treesLeft = countTrees();
        const dangerLevel = fires > 8 ? 'CRITICO' : fires > 5 ? 'ALTO' : fires > 2 ? 'MEDIO' : 'BAJO';
        const dangerColor = fires > 8 ? '#ff4444' : fires > 5 ? '#ff9800' : fires > 2 ? '#ffc107' : '#43e97b';

        ui.innerHTML = `
            <div style="padding: 10px; text-align: center;">
                <div style="display: flex; justify-content: center; gap: 12px; font-size: 0.8rem; color: #aaa; flex-wrap: wrap;">
                    <span>💧 <b style="color: ${waterDrops <= 8 ? '#ff6b6b' : '#4fc3f7'}">${waterDrops}</b></span>
                    <span>🔥 <b style="color: ${dangerColor}">${fires}</b></span>
                    <span>🌲 <b style="color: #43e97b">${treesLeft}</b></span>
                    <span style="color: ${dangerColor}; font-weight: bold;">Peligro: ${dangerLevel}</span>
                </div>
                <div style="font-size: 0.7rem; color: #ff6b6b; margin-top: 4px; animation: pulse 1s ease-in-out infinite;">El fuego se propaga! Date prisa</div>
            </div>
            <div class="game-grid" id="forest-grid" style="grid-template-columns: repeat(${GRID}, 1fr); padding: 12px; flex: 1;"></div>
        `;

        const gridEl = document.getElementById('forest-grid');
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.fontSize = '1.8rem';
                cell.style.transition = 'all 0.3s ease';

                if (grid[r][c].type === 'fire') {
                    cell.innerHTML = '<span class="fire-emoji" style="animation: fireFlicker 0.3s ease-in-out infinite alternate;">🔥</span>';
                    cell.style.background = 'rgba(255, 80, 50, 0.2)';
                    cell.style.boxShadow = '0 0 8px rgba(255, 80, 50, 0.15)';
                    // Adjacent trees in danger
                    const neighbors = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
                    neighbors.forEach(([nr, nc]) => {
                        if (nr >= 0 && nr < GRID && nc >= 0 && nc < GRID && grid[nr][nc].type === 'tree') {
                            // will be styled when that cell is rendered
                        }
                    });
                } else if (grid[r][c].extinguished) {
                    cell.textContent = '💨';
                    cell.style.background = 'rgba(100, 200, 255, 0.06)';
                } else {
                    // Check if tree is in danger (adjacent to fire)
                    const isInDanger = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].some(([nr, nc]) =>
                        nr >= 0 && nr < GRID && nc >= 0 && nc < GRID && grid[nr][nc].type === 'fire'
                    );
                    cell.textContent = '🌲';
                    cell.style.background = isInDanger ? 'rgba(255, 200, 50, 0.1)' : 'rgba(67, 233, 123, 0.1)';
                    if (isInDanger) cell.style.borderColor = 'rgba(255, 200, 50, 0.3)';
                }

                cell.onclick = () => {
                    if (grid[r][c].type !== 'fire' || waterDrops <= 0) return;
                    waterDrops--;
                    grid[r][c].type = 'saved';
                    grid[r][c].extinguished = true;
                    fires--;
                    addScore(10);
                    render();
                    if (fires === 0) {
                        clearInterval(spreadTimer);
                        addScore(waterDrops * 3 + countTrees() * 5);
                        showResult('Bosque salvado!', score + ' pts',
                            `Has salvado ${countTrees()} arboles con ${waterDrops} gotas de agua de sobra.`,
                            () => bomberoForestal(ui, controls));
                    }
                };
                gridEl.appendChild(cell);
            }
        }

        if (waterDrops <= 0 && fires > 0) {
            clearInterval(spreadTimer);
            showResult('Sin agua!', score + ' pts', `Quedaban ${fires} fuegos. Salvaste ${countTrees()} arboles.`,
                () => bomberoForestal(ui, controls));
        }
    }

    function countTrees() {
        let count = 0;
        for (let r = 0; r < GRID; r++)
            for (let c = 0; c < GRID; c++)
                if (grid[r][c].type === 'tree') count++;
        return count;
    }

    function spreadFire() {
        spreadCount++;
        const newFires = [];
        // Spread rate increases over time
        const spreadChance = Math.min(0.5, 0.25 + spreadCount * 0.02);
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                if (grid[r][c].type === 'fire') {
                    const neighbors = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
                    neighbors.forEach(([nr, nc]) => {
                        if (nr >= 0 && nr < GRID && nc >= 0 && nc < GRID && grid[nr][nc].type === 'tree' && Math.random() < spreadChance) {
                            newFires.push([nr, nc]);
                        }
                    });
                }
            }
        }
        newFires.forEach(([r, c]) => { grid[r][c].type = 'fire'; fires++; });
        if (newFires.length > 0) render();
        if (countTrees() === 0) {
            clearInterval(spreadTimer);
            showResult('Bosque destruido', score + ' pts', 'El fuego ha arrasado todo el bosque.',
                () => bomberoForestal(ui, controls));
        }
    }

    spreadTimer = setInterval(spreadFire, 2500);

    let cursorR = 0, cursorC = 0;
    const kbHandler = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { cursorR = Math.max(0, cursorR - 1); highlightCursor(); }
        else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { cursorR = Math.min(GRID - 1, cursorR + 1); highlightCursor(); }
        else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { cursorC = Math.max(0, cursorC - 1); highlightCursor(); }
        else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { cursorC = Math.min(GRID - 1, cursorC + 1); highlightCursor(); }
        else if (e.key === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            if (grid[cursorR][cursorC].type === 'fire' && waterDrops > 0) {
                waterDrops--;
                grid[cursorR][cursorC].type = 'saved';
                grid[cursorR][cursorC].extinguished = true;
                fires--;
                addScore(10);
                render();
                highlightCursor();
                if (fires === 0) {
                    clearInterval(spreadTimer);
                    addScore(waterDrops * 3 + countTrees() * 5);
                    showResult('Bosque salvado!', score + ' pts', `Has salvado ${countTrees()} arboles.`, () => bomberoForestal(ui, controls));
                }
            }
        }
    };
    function highlightCursor() {
        const gridEl = document.getElementById('forest-grid');
        if (!gridEl) return;
        gridEl.querySelectorAll('.grid-cell').forEach(c => { c.style.outline = ''; c.style.transform = ''; });
        const idx = cursorR * GRID + cursorC;
        if (gridEl.children[idx]) {
            gridEl.children[idx].style.outline = '3px solid #00d2ff';
            gridEl.children[idx].style.transform = 'scale(1.05)';
        }
    }
    document.addEventListener('keydown', kbHandler);

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Apaga los fuegos antes de que se propaguen!</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">WASD/Flechas: mover | Enter/Espacio: apagar</div>`;
    render();

    currentGame = { cleanup: () => { clearInterval(spreadTimer); document.removeEventListener('keydown', kbHandler); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}
