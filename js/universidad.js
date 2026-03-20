// ==========================================
// UNIVERSIDAD - Trabajos de estudiante
// ==========================================

function startUniversidad(subtypeId) {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('game-container');
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'block';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ui.style.pointerEvents = 'auto';

    switch (subtypeId) {
        case 'camarero': uniCamarero(canvas, ctx, ui, controls); break;
        case 'socorrista': uniSocorrista(canvas, ctx, ui, controls); break;
        case 'repartidor': uniRepartidor(canvas, ctx, ui, controls); break;
        case 'monitor': uniMonitor(canvas, ctx, ui, controls); break;
        case 'dependiente': uniDependiente(canvas, ctx, ui, controls); break;
        case 'tutor': uniTutor(canvas, ctx, ui, controls); break;
    }
}

// ========== CAMARERO (Waiter) ==========
function uniCamarero(canvas, ctx, ui, controls) {
    const W = canvas.width, H = canvas.height;
    let running = true;
    let animId;
    let timeLeft = 60;
    let timerInterval;

    const FOODS = [
        { emoji: '🍕', name: 'Pizza' },
        { emoji: '🍔', name: 'Hamburguesa' },
        { emoji: '🥗', name: 'Ensalada' },
        { emoji: '🍝', name: 'Pasta' },
        { emoji: '🍰', name: 'Tarta' },
        { emoji: '🥤', name: 'Bebida' }
    ];

    // Tables with customers
    const TABLES = [];
    const cols = 3, rows = 2;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            TABLES.push({
                x: W * 0.15 + c * (W * 0.7 / (cols - 1)),
                y: H * 0.12 + r * (H * 0.32),
                order: null,
                patience: 0,
                maxPatience: 0,
                served: false,
                happy: false,
                happyTimer: 0,
                angry: false,
                angryTimer: 0
            });
        }
    }

    let selectedFood = -1;
    let ordersServed = 0;
    let ordersMissed = 0;

    function spawnOrder() {
        const free = TABLES.filter(t => !t.order && !t.happy && !t.angry);
        if (free.length === 0) return;
        const table = free[Math.floor(Math.random() * free.length)];
        table.order = FOODS[Math.floor(Math.random() * FOODS.length)];
        table.patience = 100;
        table.maxPatience = 8000 + Math.random() * 4000;
        table.served = false;
    }

    // Spawn orders periodically
    spawnOrder();
    spawnOrder();
    const spawnInterval = setInterval(() => {
        if (!running) return;
        spawnOrder();
    }, 3000);

    timerInterval = setInterval(() => {
        if (!running) return;
        timeLeft--;
        if (timeLeft <= 0) {
            running = false;
            clearInterval(timerInterval);
            clearInterval(spawnInterval);
            const finalScore = score;
            showResult('Turno terminado!', finalScore + ' pts',
                `Has servido ${ordersServed} pedidos correctamente. Perdidos: ${ordersMissed}.`,
                () => { setScore(0); uniCamarero(canvas, ctx, ui, controls); });
        }
    }, 1000);

    // Tray area
    const trayY = H * 0.72;
    const trayH = H * 0.28;
    const foodW = W / FOODS.length;

    function tryServe(tableIdx) {
        const table = TABLES[tableIdx];
        if (!table.order || selectedFood < 0) return;
        if (FOODS[selectedFood].emoji === table.order.emoji) {
            addScore(10 + Math.round(table.patience / 10));
            ordersServed++;
            table.order = null;
            table.happy = true;
            table.happyTimer = 60;
        } else {
            table.angry = true;
            table.angryTimer = 40;
        }
        selectedFood = -1;
    }

    // Pointer events on canvas
    function onPointerDown(e) {
        if (!running) return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);

        // Check tray click
        if (my >= trayY) {
            const idx = Math.floor(mx / foodW);
            if (idx >= 0 && idx < FOODS.length) {
                selectedFood = idx;
            }
            return;
        }

        // Check table click
        for (let i = 0; i < TABLES.length; i++) {
            const t = TABLES[i];
            const dx = mx - t.x, dy = my - t.y;
            if (Math.abs(dx) < W * 0.12 && Math.abs(dy) < H * 0.1) {
                tryServe(i);
                return;
            }
        }
    }
    canvas.addEventListener('pointerdown', onPointerDown);

    // Keyboard
    function onKeyDown(e) {
        if (!running) return;
        const num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
            selectedFood = num - 1;
            e.preventDefault();
        }
    }
    document.addEventListener('keydown', onKeyDown);

    let lastTime = performance.now();
    function loop(now) {
        if (!running) return;
        const dt = now - lastTime;
        lastTime = now;

        // Update patience
        TABLES.forEach(t => {
            if (t.order && !t.served) {
                t.patience -= (dt / t.maxPatience) * 100;
                if (t.patience <= 0) {
                    t.order = null;
                    t.patience = 0;
                    ordersMissed++;
                    t.angry = true;
                    t.angryTimer = 40;
                }
            }
            if (t.happy) { t.happyTimer--; if (t.happyTimer <= 0) t.happy = false; }
            if (t.angry) { t.angryTimer--; if (t.angryTimer <= 0) t.angry = false; }
        });

        // Draw
        ctx.clearRect(0, 0, W, H);

        // Restaurant floor
        ctx.fillStyle = '#2D1B0E';
        ctx.fillRect(0, 0, W, trayY);

        // Checkerboard pattern
        const tileSize = 30;
        for (let ty = 0; ty < trayY; ty += tileSize) {
            for (let tx = 0; tx < W; tx += tileSize) {
                const checker = ((Math.floor(tx / tileSize) + Math.floor(ty / tileSize)) % 2 === 0);
                ctx.fillStyle = checker ? '#3D2B1E' : '#2D1B0E';
                ctx.fillRect(tx, ty, tileSize, tileSize);
            }
        }

        // Draw tables
        const fontSize = Math.max(14, Math.min(W * 0.05, 28));
        TABLES.forEach((t, i) => {
            // Table circle
            ctx.beginPath();
            ctx.arc(t.x, t.y, W * 0.08, 0, Math.PI * 2);
            ctx.fillStyle = '#8B4513';
            ctx.fill();
            ctx.strokeStyle = '#5C2E00';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Customer emoji
            ctx.font = fontSize + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (t.happy) {
                ctx.fillText('😊', t.x, t.y);
            } else if (t.angry) {
                ctx.fillText('😤', t.x, t.y);
            } else {
                ctx.fillText('🧑', t.x, t.y);
            }

            // Order bubble
            if (t.order) {
                const bx = t.x + W * 0.06;
                const by = t.y - H * 0.06;
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.beginPath();
                ctx.arc(bx, by, W * 0.04, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.font = (fontSize * 0.8) + 'px sans-serif';
                ctx.fillText(t.order.emoji, bx, by);

                // Patience bar
                const barW = W * 0.08;
                const barH = 4;
                const barX = t.x - barW / 2;
                const barY = t.y + W * 0.09;
                ctx.fillStyle = '#333';
                ctx.fillRect(barX, barY, barW, barH);
                const pct = Math.max(0, t.patience / 100);
                ctx.fillStyle = pct > 0.5 ? '#4CAF50' : pct > 0.25 ? '#FF9800' : '#F44336';
                ctx.fillRect(barX, barY, barW * pct, barH);
            }

            // Table number
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#aaa';
            ctx.fillText((i + 1), t.x, t.y + W * 0.065);
        });

        // Tray area
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, trayY, W, trayH);
        ctx.fillStyle = '#16213e';
        ctx.fillRect(0, trayY, W, 3);

        // Tray label
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText('BANDEJA', W / 2, trayY + 14);

        // Food items in tray
        FOODS.forEach((f, i) => {
            const fx = foodW * i + foodW / 2;
            const fy = trayY + trayH * 0.5;

            if (i === selectedFood) {
                ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
                ctx.fillRect(foodW * i, trayY + 20, foodW, trayH - 20);
                ctx.strokeStyle = '#4CAF50';
                ctx.lineWidth = 2;
                ctx.strokeRect(foodW * i + 1, trayY + 21, foodW - 2, trayH - 22);
            }

            ctx.font = (fontSize * 1.2) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(f.emoji, fx, fy);

            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#aaa';
            ctx.fillText((i + 1), fx, fy + fontSize * 0.9);
        });

        // HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, W, 24);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText('⏱ ' + timeLeft + 's', 8, 16);
        ctx.textAlign = 'right';
        ctx.fillText('✅ ' + ordersServed + '  ❌ ' + ordersMissed, W - 8, 16);

        animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Selecciona comida de la bandeja, luego toca la mesa para servir</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ 1-6: seleccionar comida · Click en mesa: servir</div>';

    currentGame = {
        cleanup: () => {
            running = false;
            cancelAnimationFrame(animId);
            clearInterval(timerInterval);
            clearInterval(spawnInterval);
            canvas.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

// ========== SOCORRISTA (Lifeguard) ==========
function uniSocorrista(canvas, ctx, ui, controls) {
    const W = canvas.width, H = canvas.height;
    let running = true;
    let animId;
    let timeLeft = 60;
    let timerInterval;
    let rescues = 0;
    let missed = 0;

    // Lifeguard position
    const guard = { x: W / 2, y: H / 2, speed: 3 };
    const keys = {};

    // Swimmers
    const swimmers = [];
    const MAX_SWIMMERS = 12;

    function spawnSwimmer() {
        if (swimmers.length >= MAX_SWIMMERS) return;
        const margin = W * 0.1;
        swimmers.push({
            x: margin + Math.random() * (W - margin * 2),
            y: H * 0.05 + Math.random() * (H * 0.75),
            drowning: false,
            drowningTimer: 0,
            maxDrowningTime: 5000 + Math.random() * 3000,
            rescued: false,
            rescuedTimer: 0,
            bobble: Math.random() * Math.PI * 2,
            bobbleSpeed: 0.02 + Math.random() * 0.02,
            wanderAngle: Math.random() * Math.PI * 2,
            wanderSpeed: 0.3 + Math.random() * 0.3
        });
    }

    // Initial swimmers
    for (let i = 0; i < 6; i++) spawnSwimmer();

    const spawnInterval = setInterval(() => {
        if (!running) return;
        spawnSwimmer();
    }, 3000);

    // Random drowning
    const drownInterval = setInterval(() => {
        if (!running) return;
        const safe = swimmers.filter(s => !s.drowning && !s.rescued);
        if (safe.length > 0) {
            const s = safe[Math.floor(Math.random() * safe.length)];
            s.drowning = true;
            s.drowningTimer = 0;
        }
    }, 2500);

    timerInterval = setInterval(() => {
        if (!running) return;
        timeLeft--;
        if (timeLeft <= 0) {
            running = false;
            clearInterval(timerInterval);
            clearInterval(spawnInterval);
            clearInterval(drownInterval);
            const finalScore = score;
            showResult('Turno terminado!', finalScore + ' pts',
                `Rescates: ${rescues} | Perdidos: ${missed}`,
                () => { setScore(0); uniSocorrista(canvas, ctx, ui, controls); });
        }
    }, 1000);

    function tryRescue() {
        const rescueRange = W * 0.06;
        for (let s of swimmers) {
            if (s.drowning && !s.rescued) {
                const dx = guard.x - s.x, dy = guard.y - s.y;
                if (Math.sqrt(dx * dx + dy * dy) < rescueRange) {
                    s.rescued = true;
                    s.drowning = false;
                    s.rescuedTimer = 50;
                    rescues++;
                    addScore(20);
                    return;
                }
            }
        }
    }

    function onKeyDown(e) {
        keys[e.code] = true;
        if (e.code === 'Space') { e.preventDefault(); tryRescue(); }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    }
    function onKeyUp(e) { keys[e.code] = false; }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Tap to rescue
    function onPointerDown(e) {
        if (!running) return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);
        // Move guard toward tap and try rescue near tap
        guard.x = mx;
        guard.y = my;
        tryRescue();
    }
    canvas.addEventListener('pointerdown', onPointerDown);

    let lastTime = performance.now();
    function loop(now) {
        if (!running) return;
        const dt = now - lastTime;
        lastTime = now;

        // Move guard
        const spd = guard.speed * (dt / 16);
        if (keys['ArrowLeft'] || keys['KeyA']) guard.x -= spd;
        if (keys['ArrowRight'] || keys['KeyD']) guard.x += spd;
        if (keys['ArrowUp'] || keys['KeyW']) guard.y -= spd;
        if (keys['ArrowDown'] || keys['KeyS']) guard.y += spd;
        guard.x = Math.max(10, Math.min(W - 10, guard.x));
        guard.y = Math.max(10, Math.min(H - 10, guard.y));

        // Update swimmers
        for (let i = swimmers.length - 1; i >= 0; i--) {
            const s = swimmers[i];
            s.bobble += s.bobbleSpeed * dt;

            if (s.rescued) {
                s.rescuedTimer--;
                if (s.rescuedTimer <= 0) swimmers.splice(i, 1);
                continue;
            }

            if (s.drowning) {
                s.drowningTimer += dt;
                if (s.drowningTimer >= s.maxDrowningTime) {
                    missed++;
                    addScore(-5);
                    swimmers.splice(i, 1);
                    continue;
                }
            } else {
                // Wander
                s.wanderAngle += (Math.random() - 0.5) * 0.1;
                s.x += Math.cos(s.wanderAngle) * s.wanderSpeed * (dt / 16);
                s.y += Math.sin(s.wanderAngle) * s.wanderSpeed * (dt / 16);
                s.x = Math.max(20, Math.min(W - 20, s.x));
                s.y = Math.max(20, Math.min(H * 0.8, s.y));
            }
        }

        // Draw
        ctx.clearRect(0, 0, W, H);

        // Water
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0077B6');
        grad.addColorStop(1, '#00B4D8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Water ripples
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (let wy = 0; wy < H; wy += 30) {
            ctx.beginPath();
            for (let wx = 0; wx < W; wx += 5) {
                const yy = wy + Math.sin(wx * 0.02 + now * 0.002 + wy * 0.1) * 4;
                if (wx === 0) ctx.moveTo(wx, yy); else ctx.lineTo(wx, yy);
            }
            ctx.stroke();
        }

        const fontSize = Math.max(16, Math.min(W * 0.05, 30));

        // Draw swimmers
        swimmers.forEach(s => {
            const bob = Math.sin(s.bobble) * 3;
            ctx.font = fontSize + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (s.rescued) {
                ctx.fillText('✅', s.x, s.y + bob);
            } else if (s.drowning) {
                // Red pulsing circle
                const urgency = s.drowningTimer / s.maxDrowningTime;
                const pulse = Math.sin(now * 0.01) * 5;
                ctx.beginPath();
                ctx.arc(s.x, s.y, fontSize * 0.8 + pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(244, 67, 54, ${0.2 + urgency * 0.4})`;
                ctx.fill();
                ctx.strokeStyle = '#F44336';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Waving arms
                const wave = Math.sin(now * 0.015) * 8;
                ctx.fillText('🙋', s.x + wave, s.y + bob);

                // SOS text
                ctx.font = 'bold 10px sans-serif';
                ctx.fillStyle = '#FF0000';
                ctx.fillText('SOS!', s.x, s.y - fontSize * 0.7);
            } else {
                ctx.fillText('🏊', s.x, s.y + bob);
            }
        });

        // Draw lifeguard
        ctx.font = (fontSize * 1.2) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🛟', guard.x, guard.y);

        // Rescue range indicator
        ctx.beginPath();
        ctx.arc(guard.x, guard.y, W * 0.06, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, W, 24);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText('⏱ ' + timeLeft + 's', 8, 16);
        ctx.textAlign = 'center';
        ctx.fillText('🛟 ' + rescues, W / 2, 16);
        ctx.textAlign = 'right';
        ctx.fillText('❌ ' + missed, W - 8, 16);

        animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Muevete hacia los nadadores en peligro y rescatalos</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Flechas/WASD: mover · Espacio: rescatar · Tap: mover y rescatar</div>';

    currentGame = {
        cleanup: () => {
            running = false;
            cancelAnimationFrame(animId);
            clearInterval(timerInterval);
            clearInterval(spawnInterval);
            clearInterval(drownInterval);
            canvas.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

// ========== REPARTIDOR (Delivery) ==========
function uniRepartidor(canvas, ctx, ui, controls) {
    const W = canvas.width, H = canvas.height;
    let running = true;
    let animId;
    let timeLeft = 60;
    let timerInterval;
    let deliveries = 0;

    const keys = {};

    // City grid
    const GRID = 12;
    const cellW = W / GRID;
    const cellH = H / GRID;

    // Map: 0=road, 1=building, 2=restaurant, 3=delivery target
    const map = [];
    for (let r = 0; r < GRID; r++) {
        map[r] = [];
        for (let c = 0; c < GRID; c++) {
            // Roads every 3 cells
            if (r % 3 === 0 || c % 3 === 0) {
                map[r][c] = 0;
            } else {
                map[r][c] = 1;
            }
        }
    }

    // Place restaurants
    const restaurants = [];
    const restSpots = [[1, 1], [1, 7], [7, 1], [7, 7], [4, 4]];
    restSpots.forEach(([r, c]) => {
        if (r < GRID && c < GRID) {
            map[r][c] = 2;
            restaurants.push({ r, c });
        }
    });

    // Delivery targets
    const houses = [];
    const houseSpots = [[1, 4], [4, 1], [4, 7], [7, 4], [1, 10], [10, 1], [10, 7], [7, 10]];
    houseSpots.forEach(([r, c]) => {
        if (r < GRID && c < GRID) {
            map[r][c] = 3;
            houses.push({ r, c });
        }
    });

    // Player
    const player = { r: 0, c: 0, carrying: false, targetHouse: null };

    // Active delivery
    let activePickup = null;
    let activeDelivery = null;

    function newDelivery() {
        activePickup = restaurants[Math.floor(Math.random() * restaurants.length)];
        activeDelivery = houses[Math.floor(Math.random() * houses.length)];
    }
    newDelivery();

    // Movement with arrow keys
    function movePlayer(dr, dc) {
        const nr = player.r + dr;
        const nc = player.c + dc;
        if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID) return;
        if (map[nr][nc] === 1) return; // Can't walk on buildings
        player.r = nr;
        player.c = nc;

        // Check pickup
        if (!player.carrying && activePickup && player.r === activePickup.r && player.c === activePickup.c) {
            player.carrying = true;
        }

        // Check delivery
        if (player.carrying && activeDelivery && player.r === activeDelivery.r && player.c === activeDelivery.c) {
            player.carrying = false;
            deliveries++;
            addScore(15);
            newDelivery();
        }
    }

    let moveDelay = 0;
    function onKeyDown(e) {
        keys[e.code] = true;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    }
    function onKeyUp(e) { keys[e.code] = false; }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Tap movement
    function onPointerDown(e) {
        if (!running) return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);
        const tc = Math.floor(mx / cellW);
        const tr = Math.floor(my / cellH);

        // Move toward tapped cell
        if (tc > player.c) movePlayer(0, 1);
        else if (tc < player.c) movePlayer(0, -1);
        else if (tr > player.r) movePlayer(1, 0);
        else if (tr < player.r) movePlayer(-1, 0);
    }
    canvas.addEventListener('pointerdown', onPointerDown);

    timerInterval = setInterval(() => {
        if (!running) return;
        timeLeft--;
        if (timeLeft <= 0) {
            running = false;
            clearInterval(timerInterval);
            const finalScore = score;
            showResult('Turno terminado!', finalScore + ' pts',
                `Has completado ${deliveries} entregas!`,
                () => { setScore(0); uniRepartidor(canvas, ctx, ui, controls); });
        }
    }, 1000);

    const BUILDING_COLORS = ['#5C6BC0', '#7E57C2', '#26A69A', '#EF5350', '#AB47BC', '#42A5F5'];

    let lastTime = performance.now();
    function loop(now) {
        if (!running) return;
        const dt = now - lastTime;
        lastTime = now;

        // Continuous movement
        moveDelay -= dt;
        if (moveDelay <= 0) {
            if (keys['ArrowUp'] || keys['KeyW']) { movePlayer(-1, 0); moveDelay = 120; }
            else if (keys['ArrowDown'] || keys['KeyS']) { movePlayer(1, 0); moveDelay = 120; }
            else if (keys['ArrowLeft'] || keys['KeyA']) { movePlayer(0, -1); moveDelay = 120; }
            else if (keys['ArrowRight'] || keys['KeyD']) { movePlayer(0, 1); moveDelay = 120; }
        }

        // Draw
        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = '#263238';
        ctx.fillRect(0, 0, W, H);

        const fontSize = Math.max(12, Math.min(cellW * 0.6, 24));

        // Draw grid
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const x = c * cellW;
                const y = r * cellH;

                if (map[r][c] === 0) {
                    // Road
                    ctx.fillStyle = '#546E7A';
                    ctx.fillRect(x, y, cellW, cellH);
                    // Road lines
                    ctx.strokeStyle = '#78909C';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 3]);
                    if (r % 3 === 0) {
                        ctx.beginPath();
                        ctx.moveTo(x, y + cellH / 2);
                        ctx.lineTo(x + cellW, y + cellH / 2);
                        ctx.stroke();
                    }
                    if (c % 3 === 0) {
                        ctx.beginPath();
                        ctx.moveTo(x + cellW / 2, y);
                        ctx.lineTo(x + cellW / 2, y + cellH);
                        ctx.stroke();
                    }
                    ctx.setLineDash([]);
                } else if (map[r][c] === 1) {
                    // Building
                    ctx.fillStyle = BUILDING_COLORS[(r * GRID + c) % BUILDING_COLORS.length];
                    ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
                    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);
                } else if (map[r][c] === 2) {
                    // Restaurant
                    ctx.fillStyle = '#FF8F00';
                    ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
                    ctx.font = fontSize + 'px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🍽️', x + cellW / 2, y + cellH / 2);
                } else if (map[r][c] === 3) {
                    // House
                    ctx.fillStyle = '#4CAF50';
                    ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
                    ctx.font = fontSize + 'px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🏠', x + cellW / 2, y + cellH / 2);
                }
            }
        }

        // Highlight active pickup / delivery
        if (activePickup && !player.carrying) {
            const x = activePickup.c * cellW;
            const y = activePickup.r * cellH;
            ctx.strokeStyle = '#FFD600';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, cellW, cellH);
            const pulse = Math.sin(now * 0.005) * 3;
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#FFD600';
            ctx.textAlign = 'center';
            ctx.fillText('RECOGER', x + cellW / 2, y - 4 + pulse);
        }

        if (activeDelivery && player.carrying) {
            const x = activeDelivery.c * cellW;
            const y = activeDelivery.r * cellH;
            ctx.strokeStyle = '#76FF03';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, cellW, cellH);
            const pulse = Math.sin(now * 0.005) * 3;
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#76FF03';
            ctx.textAlign = 'center';
            ctx.fillText('ENTREGAR', x + cellW / 2, y - 4 + pulse);
        }

        // Draw player
        const px = player.c * cellW + cellW / 2;
        const py = player.r * cellH + cellH / 2;
        ctx.font = (fontSize * 1.3) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.carrying ? '🛵📦' : '🛵', px, py);

        // HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, W, 24);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText('⏱ ' + timeLeft + 's', 8, 16);
        ctx.textAlign = 'center';
        ctx.fillText(player.carrying ? '📦 Entrega en curso' : '🍽️ Ve al restaurante', W / 2, 16);
        ctx.textAlign = 'right';
        ctx.fillText('📦 ' + deliveries, W - 8, 16);

        animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Recoge pedidos en restaurantes y lleva a las casas</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Flechas/WASD: mover · Tap: mover hacia punto</div>';

    currentGame = {
        cleanup: () => {
            running = false;
            cancelAnimationFrame(animId);
            clearInterval(timerInterval);
            canvas.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

// ========== MONITOR (Camp Counselor - Simon Says) ==========
function uniMonitor(canvas, ctx, ui, controls) {
    const W = canvas.width, H = canvas.height;
    let running = true;
    let animId;
    let round = 0;
    let totalRounds = 0;

    const DIRS = [
        { key: 'ArrowUp', label: '↑', color: '#4CAF50', name: 'Arriba' },
        { key: 'ArrowRight', label: '→', color: '#2196F3', name: 'Derecha' },
        { key: 'ArrowDown', label: '↓', color: '#FF9800', name: 'Abajo' },
        { key: 'ArrowLeft', label: '←', color: '#E91E63', name: 'Izquierda' }
    ];

    let sequence = [];
    let playerInput = [];
    let phase = 'showing'; // 'showing', 'input', 'success', 'fail', 'gameover'
    let showIdx = 0;
    let showTimer = 0;
    let flashDir = -1;
    let successTimer = 0;
    let failTimer = 0;
    let streak = 0;
    let lives = 3;

    // Kids
    const kids = [];
    for (let i = 0; i < 8; i++) {
        kids.push({
            x: W * 0.15 + (i % 4) * (W * 0.7 / 3),
            y: H * 0.55 + Math.floor(i / 4) * (H * 0.18),
            emoji: randomFrom(['👦', '👧', '🧒', '👶']),
            happy: false,
            sad: false
        });
    }

    function addToSequence() {
        sequence.push(Math.floor(Math.random() * 4));
    }

    function startRound() {
        round++;
        totalRounds++;
        addToSequence();
        playerInput = [];
        phase = 'showing';
        showIdx = 0;
        showTimer = 0;
        flashDir = -1;
    }

    startRound();

    function onKeyDown(e) {
        if (!running) return;
        if (phase !== 'input') return;

        let dirIdx = -1;
        if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') dirIdx = 0;
        else if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') dirIdx = 1;
        else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') dirIdx = 2;
        else if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dirIdx = 3;

        if (dirIdx >= 0) {
            e.preventDefault();
            handleInput(dirIdx);
        }
    }
    document.addEventListener('keydown', onKeyDown);

    // Tap on direction buttons
    function onPointerDown(e) {
        if (!running || phase !== 'input') return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);

        // Check button areas (drawn at bottom)
        const btnY = H * 0.82;
        const btnSize = W * 0.12;
        const btnPositions = [
            { x: W / 2, y: btnY - btnSize * 1.1 },          // Up
            { x: W / 2 + btnSize * 1.1, y: btnY },           // Right
            { x: W / 2, y: btnY + btnSize * 1.1 },           // Down
            { x: W / 2 - btnSize * 1.1, y: btnY }            // Left
        ];

        for (let i = 0; i < 4; i++) {
            const dx = mx - btnPositions[i].x;
            const dy = my - btnPositions[i].y;
            if (Math.sqrt(dx * dx + dy * dy) < btnSize * 0.7) {
                handleInput(i);
                return;
            }
        }
    }
    canvas.addEventListener('pointerdown', onPointerDown);

    function handleInput(dirIdx) {
        flashDir = dirIdx;
        setTimeout(() => { flashDir = -1; }, 200);

        playerInput.push(dirIdx);
        const idx = playerInput.length - 1;

        if (sequence[idx] !== dirIdx) {
            // Wrong!
            phase = 'fail';
            failTimer = 60;
            lives--;
            streak = 0;
            kids.forEach(k => k.sad = true);
            if (lives <= 0) {
                phase = 'gameover';
            }
            return;
        }

        if (playerInput.length === sequence.length) {
            // Success!
            phase = 'success';
            successTimer = 50;
            streak++;
            const bonus = streak >= 3 ? 10 : 0;
            addScore(10 * round + bonus);
            kids.forEach(k => k.happy = true);
        }
    }

    let lastTime = performance.now();
    function loop(now) {
        if (!running) return;
        const dt = now - lastTime;
        lastTime = now;

        // Phase logic
        if (phase === 'showing') {
            showTimer += dt;
            const interval = Math.max(400, 800 - round * 30);
            if (showTimer > interval) {
                showTimer = 0;
                flashDir = sequence[showIdx];
                showIdx++;
                if (showIdx > sequence.length) {
                    flashDir = -1;
                    phase = 'input';
                } else {
                    setTimeout(() => { if (phase === 'showing') flashDir = -1; }, interval * 0.6);
                }
            }
        } else if (phase === 'success') {
            successTimer--;
            if (successTimer <= 0) {
                kids.forEach(k => k.happy = false);
                startRound();
            }
        } else if (phase === 'fail') {
            failTimer--;
            if (failTimer <= 0) {
                kids.forEach(k => k.sad = false);
                sequence = [];
                round = 0;
                startRound();
            }
        } else if (phase === 'gameover') {
            running = false;
            const finalScore = score;
            showResult('Fin del juego!', finalScore + ' pts',
                `Completaste ${totalRounds - 1} rondas. Racha maxima: ${streak}`,
                () => { setScore(0); uniMonitor(canvas, ctx, ui, controls); });
            return;
        }

        // Draw
        ctx.clearRect(0, 0, W, H);

        // Background (park/field)
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#81C784');
        grad.addColorStop(1, '#4CAF50');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Some decorative trees
        ctx.font = '20px sans-serif';
        ctx.fillText('🌲', W * 0.05, H * 0.1);
        ctx.fillText('🌳', W * 0.9, H * 0.15);
        ctx.fillText('🌲', W * 0.95, H * 0.08);

        const fontSize = Math.max(14, Math.min(W * 0.05, 28));

        // Status
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText('Ronda: ' + round + '  |  Vidas: ' + '❤️'.repeat(lives) + '  |  Racha: ' + streak, W / 2, 20);

        // Show sequence hint
        if (phase === 'showing') {
            ctx.font = 'bold 16px sans-serif';
            ctx.fillStyle = '#FFF9C4';
            ctx.fillText('Observa la secuencia...', W / 2, H * 0.08);
        } else if (phase === 'input') {
            ctx.font = 'bold 16px sans-serif';
            ctx.fillStyle = '#FFF9C4';
            ctx.fillText('Tu turno! (' + playerInput.length + '/' + sequence.length + ')', W / 2, H * 0.08);
        } else if (phase === 'success') {
            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = '#FFEB3B';
            ctx.fillText('Correcto!', W / 2, H * 0.08);
        } else if (phase === 'fail') {
            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = '#F44336';
            ctx.fillText('Fallaste! Reintentando...', W / 2, H * 0.08);
        }

        // Sequence display (small dots)
        const dotY = H * 0.13;
        const dotSpacing = 14;
        const startX = W / 2 - (sequence.length * dotSpacing) / 2;
        for (let i = 0; i < sequence.length; i++) {
            ctx.beginPath();
            ctx.arc(startX + i * dotSpacing + 7, dotY, 5, 0, Math.PI * 2);
            if (phase === 'input' && i < playerInput.length) {
                ctx.fillStyle = DIRS[sequence[i]].color;
            } else if (phase === 'showing' && i < showIdx) {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
            }
            ctx.fill();
        }

        // Kids
        kids.forEach((k, i) => {
            ctx.font = (fontSize * 1.5) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (k.happy) {
                ctx.fillText('🥳', k.x, k.y);
            } else if (k.sad) {
                ctx.fillText('😕', k.x, k.y);
            } else {
                ctx.fillText(k.emoji, k.x, k.y);
            }
        });

        // Monitor/Counselor
        ctx.font = (fontSize * 1.8) + 'px sans-serif';
        ctx.fillText('🧑‍🏫', W / 2, H * 0.38);

        // Direction buttons
        const btnSize = W * 0.12;
        const btnY = H * 0.82;
        const btnPositions = [
            { x: W / 2, y: btnY - btnSize * 1.1, dir: 0 },
            { x: W / 2 + btnSize * 1.1, y: btnY, dir: 1 },
            { x: W / 2, y: btnY + btnSize * 1.1, dir: 2 },
            { x: W / 2 - btnSize * 1.1, y: btnY, dir: 3 }
        ];

        btnPositions.forEach(bp => {
            ctx.beginPath();
            ctx.arc(bp.x, bp.y, btnSize * 0.5, 0, Math.PI * 2);
            const isFlash = flashDir === bp.dir;
            ctx.fillStyle = isFlash ? DIRS[bp.dir].color : 'rgba(255,255,255,0.15)';
            ctx.fill();
            ctx.strokeStyle = DIRS[bp.dir].color;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.font = 'bold ' + (btnSize * 0.5) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isFlash ? '#fff' : DIRS[bp.dir].color;
            ctx.fillText(DIRS[bp.dir].label, bp.x, bp.y);
        });

        animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Memoriza la secuencia y repitela con las flechas</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Flechas: repetir secuencia · Toca los botones en pantalla</div>';

    currentGame = {
        cleanup: () => {
            running = false;
            cancelAnimationFrame(animId);
            canvas.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

// ========== DEPENDIENTE (Shop Assistant) ==========
function uniDependiente(canvas, ctx, ui, controls) {
    const W = canvas.width, H = canvas.height;
    let running = true;
    let animId;
    let timeLeft = 60;
    let timerInterval;
    let served = 0;
    let wrong = 0;

    const PRODUCTS = [
        { emoji: '👕', name: 'Camiseta' },
        { emoji: '👖', name: 'Pantalon' },
        { emoji: '👟', name: 'Zapatillas' },
        { emoji: '🧢', name: 'Gorra' },
        { emoji: '🎒', name: 'Mochila' },
        { emoji: '🧣', name: 'Bufanda' },
        { emoji: '🧤', name: 'Guantes' },
        { emoji: '👗', name: 'Vestido' },
        { emoji: '🧦', name: 'Calcetines' },
        { emoji: '👓', name: 'Gafas' },
        { emoji: '⌚', name: 'Reloj' },
        { emoji: '👜', name: 'Bolso' },
        { emoji: '🧥', name: 'Abrigo' },
        { emoji: '👒', name: 'Sombrero' },
        { emoji: '🩴', name: 'Chanclas' },
        { emoji: '🎀', name: 'Lazo' }
    ];

    // Grid of shelves
    const COLS = 4, ROWS = 4;
    const shelfX = W * 0.05;
    const shelfY = H * 0.2;
    const shelfW = W * 0.9;
    const shelfH = H * 0.55;
    const cellW = shelfW / COLS;
    const cellH = shelfH / ROWS;

    // Shuffle products on shelves
    let shelfProducts = shuffleArray(PRODUCTS).slice(0, COLS * ROWS);

    let cursor = { r: 0, c: 0 };
    let currentCustomer = null;
    let customerTimer = 0;
    let maxCustomerTime = 10000;
    let feedbackText = '';
    let feedbackTimer = 0;

    function newCustomer() {
        const product = shelfProducts[Math.floor(Math.random() * shelfProducts.length)];
        currentCustomer = {
            product: product,
            emoji: randomFrom(['🧑', '👩', '👨', '🧓', '👱'])
        };
        customerTimer = maxCustomerTime;
    }
    newCustomer();

    function selectProduct(r, c) {
        if (!currentCustomer) return;
        const idx = r * COLS + c;
        if (idx >= shelfProducts.length) return;

        if (shelfProducts[idx].emoji === currentCustomer.product.emoji) {
            served++;
            addScore(15 + Math.round(customerTimer / maxCustomerTime * 10));
            feedbackText = 'Correcto!';
            feedbackTimer = 30;
            // Shuffle for variety
            shelfProducts = shuffleArray(PRODUCTS).slice(0, COLS * ROWS);
            newCustomer();
            // Speed up slightly
            maxCustomerTime = Math.max(5000, maxCustomerTime - 200);
        } else {
            wrong++;
            addScore(-5);
            feedbackText = 'Ese no es!';
            feedbackTimer = 30;
        }
    }

    function onKeyDown(e) {
        if (!running) return;
        if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') { cursor.r = Math.max(0, cursor.r - 1); e.preventDefault(); }
        else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') { cursor.r = Math.min(ROWS - 1, cursor.r + 1); e.preventDefault(); }
        else if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { cursor.c = Math.max(0, cursor.c - 1); e.preventDefault(); }
        else if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') { cursor.c = Math.min(COLS - 1, cursor.c + 1); e.preventDefault(); }
        else if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); selectProduct(cursor.r, cursor.c); }
    }
    document.addEventListener('keydown', onKeyDown);

    function onPointerDown(e) {
        if (!running) return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);

        // Check shelf cells
        if (mx >= shelfX && mx <= shelfX + shelfW && my >= shelfY && my <= shelfY + shelfH) {
            const c = Math.floor((mx - shelfX) / cellW);
            const r = Math.floor((my - shelfY) / cellH);
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                cursor.r = r;
                cursor.c = c;
                selectProduct(r, c);
            }
        }
    }
    canvas.addEventListener('pointerdown', onPointerDown);

    timerInterval = setInterval(() => {
        if (!running) return;
        timeLeft--;
        if (timeLeft <= 0) {
            running = false;
            clearInterval(timerInterval);
            const finalScore = score;
            showResult('Turno terminado!', finalScore + ' pts',
                `Clientes atendidos: ${served} | Errores: ${wrong}`,
                () => { setScore(0); uniDependiente(canvas, ctx, ui, controls); });
        }
    }, 1000);

    let lastTime = performance.now();
    function loop(now) {
        if (!running) return;
        const dt = now - lastTime;
        lastTime = now;

        // Customer timer
        if (currentCustomer) {
            customerTimer -= dt;
            if (customerTimer <= 0) {
                wrong++;
                feedbackText = 'Muy lento!';
                feedbackTimer = 30;
                shelfProducts = shuffleArray(PRODUCTS).slice(0, COLS * ROWS);
                newCustomer();
            }
        }

        if (feedbackTimer > 0) feedbackTimer--;

        // Draw
        ctx.clearRect(0, 0, W, H);

        // Store background
        ctx.fillStyle = '#FFF8E1';
        ctx.fillRect(0, 0, W, H);

        // Store name
        ctx.fillStyle = '#5D4037';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TIENDA DE ROPA', W / 2, 16);

        // Customer area
        const custY = H * 0.03;
        if (currentCustomer) {
            // Speech bubble
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 2;
            const bubbleX = W / 2;
            const bubbleY = custY + H * 0.08;

            ctx.beginPath();
            ctx.roundRect(bubbleX - W * 0.25, bubbleY - 14, W * 0.5, 28, 10);
            ctx.fill();
            ctx.stroke();

            const fontSize = Math.max(14, Math.min(W * 0.04, 22));
            ctx.font = fontSize + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#333';
            ctx.fillText(currentCustomer.emoji + ' Quiero: ' + currentCustomer.product.emoji + ' ' + currentCustomer.product.name, bubbleX, bubbleY);

            // Customer timer bar
            const barW = W * 0.5;
            const barH = 5;
            const barX = W / 2 - barW / 2;
            const barY = bubbleY + 18;
            ctx.fillStyle = '#eee';
            ctx.fillRect(barX, barY, barW, barH);
            const pct = Math.max(0, customerTimer / maxCustomerTime);
            ctx.fillStyle = pct > 0.5 ? '#4CAF50' : pct > 0.25 ? '#FF9800' : '#F44336';
            ctx.fillRect(barX, barY, barW * pct, barH);
        }

        // Shelves
        const fontSize = Math.max(14, Math.min(cellW * 0.5, 28));
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const x = shelfX + c * cellW;
                const y = shelfY + r * cellH;
                const idx = r * COLS + c;

                // Shelf background
                ctx.fillStyle = (r + c) % 2 === 0 ? '#EFEBE9' : '#D7CCC8';
                ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

                // Shelf border
                ctx.strokeStyle = '#8D6E63';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

                // Product
                if (idx < shelfProducts.length) {
                    ctx.font = fontSize + 'px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(shelfProducts[idx].emoji, x + cellW / 2, y + cellH / 2 - 6);

                    ctx.font = '9px sans-serif';
                    ctx.fillStyle = '#666';
                    ctx.fillText(shelfProducts[idx].name, x + cellW / 2, y + cellH / 2 + fontSize * 0.5 + 2);
                }

                // Cursor
                if (r === cursor.r && c === cursor.c) {
                    ctx.strokeStyle = '#FF5722';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);
                }
            }
        }

        // Feedback
        if (feedbackTimer > 0 && feedbackText) {
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = feedbackText === 'Correcto!' ? '#4CAF50' : '#F44336';
            ctx.fillText(feedbackText, W / 2, shelfY + shelfH + 30);
        }

        // HUD
        ctx.fillStyle = 'rgba(93, 64, 55, 0.9)';
        ctx.fillRect(0, H - 24, W, 24);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText('⏱ ' + timeLeft + 's', 8, H - 8);
        ctx.textAlign = 'right';
        ctx.fillText('✅ ' + served + '  ❌ ' + wrong, W - 8, H - 8);

        animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Busca el producto que pide el cliente en las estanterias</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ Flechas: mover cursor · Espacio: seleccionar · Click/Tap en producto</div>';

    currentGame = {
        cleanup: () => {
            running = false;
            cancelAnimationFrame(animId);
            clearInterval(timerInterval);
            canvas.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

// ========== TUTOR (Private Tutor - Math) ==========
function uniTutor(canvas, ctx, ui, controls) {
    const W = canvas.width, H = canvas.height;
    let running = true;
    let animId;
    let timeLeft = 60;
    let timerInterval;
    let correct = 0;
    let wrong = 0;
    let streak = 0;
    let maxStreak = 0;
    let difficulty = 1; // 1-5

    let currentProblem = null;
    let options = [];
    let selectedOption = -1;
    let feedbackText = '';
    let feedbackTimer = 0;
    let inputText = '';

    function generateProblem() {
        let a, b, op, answer, text;

        if (difficulty <= 2) {
            // Addition / subtraction
            a = Math.floor(Math.random() * (10 * difficulty)) + 1;
            b = Math.floor(Math.random() * (10 * difficulty)) + 1;
            if (Math.random() < 0.5) {
                op = '+';
                answer = a + b;
            } else {
                if (a < b) { const tmp = a; a = b; b = tmp; }
                op = '-';
                answer = a - b;
            }
            text = a + ' ' + op + ' ' + b + ' = ?';
        } else if (difficulty <= 3) {
            // Multiplication
            a = Math.floor(Math.random() * 12) + 1;
            b = Math.floor(Math.random() * 12) + 1;
            op = '×';
            answer = a * b;
            text = a + ' × ' + b + ' = ?';
        } else if (difficulty <= 4) {
            // Division
            b = Math.floor(Math.random() * 10) + 2;
            answer = Math.floor(Math.random() * 12) + 1;
            a = b * answer;
            op = '÷';
            text = a + ' ÷ ' + b + ' = ?';
        } else {
            // Simple equations: a + x = c
            a = Math.floor(Math.random() * 20) + 1;
            answer = Math.floor(Math.random() * 20) + 1;
            const c = a + answer;
            text = a + ' + x = ' + c + '  →  x = ?';
        }

        // Generate wrong options
        const wrongOptions = new Set();
        while (wrongOptions.size < 3) {
            let w = answer + (Math.floor(Math.random() * 10) - 5);
            if (w !== answer && w >= 0) wrongOptions.add(w);
        }

        options = shuffleArray([answer, ...wrongOptions]);
        currentProblem = { text, answer };
        selectedOption = -1;
        inputText = '';
    }

    generateProblem();

    function checkAnswer(val) {
        if (val === currentProblem.answer) {
            correct++;
            streak++;
            if (streak > maxStreak) maxStreak = streak;
            const streakBonus = streak >= 5 ? 15 : streak >= 3 ? 10 : 5;
            addScore(streakBonus);
            feedbackText = streak >= 3 ? 'Racha x' + streak + '!' : 'Correcto!';
            feedbackTimer = 25;
            // Increase difficulty
            if (correct % 4 === 0 && difficulty < 5) difficulty++;
        } else {
            wrong++;
            streak = 0;
            feedbackText = 'La respuesta era ' + currentProblem.answer;
            feedbackTimer = 40;
        }
        setTimeout(() => {
            if (running) generateProblem();
        }, feedbackTimer * 16);
    }

    function onKeyDown(e) {
        if (!running) return;

        // Number keys for options
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4 && num <= options.length) {
            e.preventDefault();
            checkAnswer(options[num - 1]);
            return;
        }
    }
    document.addEventListener('keydown', onKeyDown);

    function onPointerDown(e) {
        if (!running) return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);

        // Check option buttons
        const optW = W * 0.35;
        const optH = H * 0.08;
        const startY = H * 0.55;
        const gap = optH + 10;

        for (let i = 0; i < options.length; i++) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const ox = W * 0.1 + col * (W * 0.4);
            const oy = startY + row * gap;

            if (mx >= ox && mx <= ox + optW && my >= oy && my <= oy + optH) {
                checkAnswer(options[i]);
                return;
            }
        }
    }
    canvas.addEventListener('pointerdown', onPointerDown);

    timerInterval = setInterval(() => {
        if (!running) return;
        timeLeft--;
        if (timeLeft <= 0) {
            running = false;
            clearInterval(timerInterval);
            const finalScore = score;
            showResult('Clase terminada!', finalScore + ' pts',
                `Correctas: ${correct} | Errores: ${wrong} | Mejor racha: ${maxStreak}`,
                () => { setScore(0); uniTutor(canvas, ctx, ui, controls); });
        }
    }, 1000);

    let lastTime = performance.now();
    function loop(now) {
        if (!running) return;
        const dt = now - lastTime;
        lastTime = now;
        if (feedbackTimer > 0) feedbackTimer -= dt / 16;

        // Draw
        ctx.clearRect(0, 0, W, H);

        // Whiteboard background
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(0, 0, W, H);

        // Whiteboard
        const boardMargin = W * 0.05;
        const boardY = H * 0.06;
        const boardH = H * 0.38;
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(boardMargin, boardY, W - boardMargin * 2, boardH);
        ctx.strokeStyle = '#8D6E63';
        ctx.lineWidth = 4;
        ctx.strokeRect(boardMargin, boardY, W - boardMargin * 2, boardH);

        // Problem text
        const fontSize = Math.max(18, Math.min(W * 0.07, 36));
        ctx.font = 'bold ' + fontSize + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';
        if (currentProblem) {
            ctx.fillText(currentProblem.text, W / 2, boardY + boardH * 0.4);
        }

        // Difficulty indicator
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'left';
        ctx.fillText('Nivel: ' + '⭐'.repeat(difficulty), boardMargin + 10, boardY + boardH - 10);

        // Streak
        if (streak >= 2) {
            ctx.textAlign = 'right';
            ctx.fillStyle = '#FF6F00';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText('Racha: ' + streak, W - boardMargin - 10, boardY + boardH - 10);
        }

        // Feedback on board
        if (feedbackTimer > 0 && feedbackText) {
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = feedbackText.includes('Correcto') || feedbackText.includes('Racha') ? '#4CAF50' : '#F44336';
            ctx.fillText(feedbackText, W / 2, boardY + boardH * 0.75);
        }

        // Option buttons
        const optW = W * 0.35;
        const optH = H * 0.08;
        const startY = H * 0.55;
        const gap = optH + 10;
        const optFontSize = Math.max(14, Math.min(optH * 0.5, 24));

        for (let i = 0; i < options.length; i++) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const ox = W * 0.1 + col * (W * 0.4);
            const oy = startY + row * gap;

            // Button
            ctx.fillStyle = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'][i];
            ctx.beginPath();
            ctx.roundRect(ox, oy, optW, optH, 8);
            ctx.fill();

            // Number label
            ctx.font = 'bold ' + optFontSize + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.fillText((i + 1) + ') ' + options[i], ox + optW / 2, oy + optH / 2);
        }

        // Student emoji
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧑‍🎓', W * 0.15, H * 0.9);
        ctx.fillText('📚', W * 0.85, H * 0.9);

        // HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, H - 24, W, 24);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText('⏱ ' + timeLeft + 's', 8, H - 8);
        ctx.textAlign = 'right';
        ctx.fillText('✅ ' + correct + '  ❌ ' + wrong, W - 8, H - 8);

        animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Resuelve problemas de matematicas lo mas rapido posible</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">⌨️ 1-4: elegir respuesta · Click/Tap en opcion</div>';

    currentGame = {
        cleanup: () => {
            running = false;
            cancelAnimationFrame(animId);
            clearInterval(timerInterval);
            canvas.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}
