// ==========================================
// BOMBEROS - Mini-juegos
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

function bomberoExtincion(ui, controls) {
    const GRID = 5;
    const grid = [];
    let fires = 0;
    let totalFires = 0;
    let waterLeft = 15;

    // Generate building with fires
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
                <div style="font-size: 0.8rem; color: #aaa;">💧 Agua: ${waterLeft} | 🔥 Fuegos: ${fires}</div>
            </div>
            <div class="game-grid" id="fire-grid" style="grid-template-columns: repeat(${GRID}, 1fr); padding: 16px; height: auto; flex: 1;">
            </div>
        `;

        const gridEl = document.getElementById('fire-grid');
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.fontSize = '2rem';
                cell.style.minHeight = '60px';

                if (grid[r][c].fire && !grid[r][c].extinguished) {
                    cell.innerHTML = '<span class="fire-emoji">🔥</span>';
                    cell.style.background = 'rgba(255, 80, 50, 0.2)';
                    cell.style.borderColor = 'rgba(255, 80, 50, 0.4)';
                } else if (grid[r][c].extinguished) {
                    cell.textContent = '💨';
                    cell.style.background = 'rgba(100, 200, 255, 0.1)';
                } else {
                    cell.textContent = '🏢';
                    cell.style.opacity = '0.5';
                }

                cell.onclick = () => extinguish(r, c);
                gridEl.appendChild(cell);
            }
        }

        if (fires === 0) {
            addScore(50);
            const pct = Math.round(((totalFires) / (totalFires)) * 100);
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
        render();
    }

    controls.innerHTML = `
        <div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">
            Toca los fuegos para apagarlos 💧
        </div>
    `;

    render();
    currentGame = { cleanup: () => { ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function bomberoRescate(ui, controls) {
    const FLOORS = 5;
    const people = [];
    let rescued = 0;
    let timeLeft = 30;
    let timer = null;

    for (let i = 0; i < FLOORS; i++) {
        const hasPerson = Math.random() < 0.6;
        people.push({ floor: i, hasPerson, rescued: false, checked: false });
    }
    const totalPeople = people.filter(p => p.hasPerson).length;

    function render() {
        ui.innerHTML = `
            <div style="padding: 10px; text-align: center;">
                <div style="font-size: 0.8rem; color: #aaa;">⏱️ Tiempo: ${timeLeft}s | 🧑 Rescatados: ${rescued}/${totalPeople}</div>
            </div>
            <div style="display: flex; flex-direction: column-reverse; gap: 8px; padding: 16px; flex: 1; justify-content: center;" id="building-floors">
            </div>
        `;

        const floorsEl = document.getElementById('building-floors');
        for (let i = 0; i < FLOORS; i++) {
            const p = people[i];
            const floor = document.createElement('div');
            floor.style.cssText = 'display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.2s;';

            if (p.checked && p.hasPerson && !p.rescued) {
                floor.style.background = 'rgba(255, 200, 50, 0.15)';
                floor.style.border = '1px solid rgba(255, 200, 50, 0.3)';
            } else if (p.rescued) {
                floor.style.background = 'rgba(67, 233, 123, 0.15)';
                floor.style.border = '1px solid rgba(67, 233, 123, 0.3)';
            }

            const label = p.rescued ? '✅ Rescatado' : p.checked ? (p.hasPerson ? '🧑 ¡Persona encontrada! (Toca para rescatar)' : '✔️ Vacio') : '❓ Sin explorar';
            floor.innerHTML = `
                <div style="font-size: 1.5rem; width: 40px; text-align: center;">${p.rescued ? '🏠' : p.checked && p.hasPerson ? '🧑' : p.checked ? '🏠' : '🔒'}</div>
                <div>
                    <div style="font-weight: 700; font-size: 0.9rem;">Piso ${i + 1}</div>
                    <div style="font-size: 0.75rem; color: #aaa;">${label}</div>
                </div>
            `;

            floor.onclick = () => {
                if (p.rescued) return;
                if (!p.checked) {
                    p.checked = true;
                    addScore(5);
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

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Explora cada piso y rescata a las personas</div>`;
    render();

    currentGame = { cleanup: () => { clearInterval(timer); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function bomberoConduccion(ui, controls) {
    // Simple driving game - avoid obstacles
    const canvas = document.getElementById('game-canvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    let truckX = W / 2;
    const truckY = H - 80;
    let obstacles = [];
    let gameSpeed = 3;
    let running = true;
    let distance = 0;
    let frame = 0;

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
        ctx.fillStyle = '#2d2d4e';
        ctx.fillRect(W * 0.1, 0, W * 0.8, H);

        // Road lines
        ctx.strokeStyle = '#444';
        ctx.setLineDash([20, 20]);
        ctx.lineWidth = 2;
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(W * 0.1 + (W * 0.8 / 4) * i, (frame * 3) % 40 - 20);
            for (let y = (frame * 3) % 40 - 20; y < H; y += 40) {
                ctx.moveTo(W * 0.1 + (W * 0.8 / 4) * i, y);
                ctx.lineTo(W * 0.1 + (W * 0.8 / 4) * i, y + 20);
            }
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Truck
        ctx.font = '40px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🚒', truckX, truckY);

        // Obstacles
        ctx.font = '35px serif';
        obstacles.forEach(o => {
            ctx.fillText(o.type, o.x, o.y);
        });

        // HUD
        ctx.fillStyle = '#fff';
        ctx.font = '16px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Distancia: ${distance}m`, 10, 30);
    }

    function update() {
        if (!running) return;
        frame++;
        distance = Math.floor(frame / 5);

        if (frame % 40 === 0) spawnObstacle();
        if (frame % 200 === 0) gameSpeed += 0.5;

        obstacles.forEach(o => o.y += gameSpeed);

        // Collision
        obstacles.forEach(o => {
            if (Math.abs(o.x - truckX) < 30 && Math.abs(o.y - truckY) < 30) {
                running = false;
                setScore(distance);
                showResult('Choque!', distance + 'm',
                    'Has recorrido ' + distance + ' metros.',
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

    // Touch / click controls
    controls.innerHTML = `
        <button class="control-btn" id="drive-left" style="flex:1; font-size: 1.5rem;">⬅️</button>
        <button class="control-btn" id="drive-right" style="flex:1; font-size: 1.5rem;">➡️</button>
    `;

    const moveAmount = 15;
    document.getElementById('drive-left').addEventListener('mousedown', () => { truckX = Math.max(W * 0.15, truckX - 50); });
    document.getElementById('drive-right').addEventListener('mousedown', () => { truckX = Math.min(W * 0.85, truckX + 50); });
    document.getElementById('drive-left').addEventListener('touchstart', (e) => { e.preventDefault(); truckX = Math.max(W * 0.15, truckX - 50); });
    document.getElementById('drive-right').addEventListener('touchstart', (e) => { e.preventDefault(); truckX = Math.min(W * 0.85, truckX + 50); });

    // Continuous movement with hold
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

    loop();

    currentGame = {
        cleanup: () => {
            running = false;
            cancelAnimationFrame(animId);
            clearInterval(leftInterval);
            clearInterval(rightInterval);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

function bomberoForestal(ui, controls) {
    const GRID = 6;
    const grid = [];
    let waterDrops = 20;
    let fires = 0;
    let totalFires = 0;
    let spreadTimer = null;

    for (let r = 0; r < GRID; r++) {
        grid[r] = [];
        for (let c = 0; c < GRID; c++) {
            const type = Math.random() < 0.25 ? 'fire' : 'tree';
            grid[r][c] = { type, extinguished: false };
            if (type === 'fire') { fires++; totalFires++; }
        }
    }

    function render() {
        ui.innerHTML = `
            <div style="padding: 10px; text-align: center;">
                <div style="font-size: 0.8rem; color: #aaa;">💧 Agua: ${waterDrops} | 🔥 Fuegos: ${fires} | 🌲 Arboles: ${countTrees()}</div>
                <div style="font-size: 0.7rem; color: #ff6b6b; margin-top: 4px;">¡El fuego se propaga! Date prisa</div>
            </div>
            <div class="game-grid" id="forest-grid" style="grid-template-columns: repeat(${GRID}, 1fr); padding: 12px; flex: 1;"></div>
        `;

        const gridEl = document.getElementById('forest-grid');
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.fontSize = '1.8rem';

                if (grid[r][c].type === 'fire') {
                    cell.innerHTML = '<span class="fire-emoji">🔥</span>';
                    cell.style.background = 'rgba(255, 80, 50, 0.2)';
                } else if (grid[r][c].extinguished) {
                    cell.textContent = '💨';
                } else {
                    cell.textContent = '🌲';
                    cell.style.background = 'rgba(67, 233, 123, 0.1)';
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
                            `Has salvado ${countTrees()} arboles.`,
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
        const newFires = [];
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                if (grid[r][c].type === 'fire') {
                    const neighbors = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
                    neighbors.forEach(([nr, nc]) => {
                        if (nr >= 0 && nr < GRID && nc >= 0 && nc < GRID && grid[nr][nc].type === 'tree' && Math.random() < 0.3) {
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

    controls.innerHTML = `<div style="text-align: center; width: 100%; color: #aaa; font-size: 0.8rem;">Toca los fuegos rapidamente antes de que se propaguen!</div>`;
    render();

    currentGame = { cleanup: () => { clearInterval(spreadTimer); ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}
