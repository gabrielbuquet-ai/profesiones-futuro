// ==========================================
// COCINA - Interactive Physical Cooking Game
// ==========================================

function startCocina(subtypeId) {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('game-container');
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');

    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    canvas.style.display = 'block';
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    const W = container.clientWidth;
    const H = container.clientHeight;

    // ---- Recipes ----
    const RECIPES = {
        espanola: {
            name: 'Tortilla Espanola',
            emoji: '🥘',
            steps: [
                { type: 'CrackEgg', label: 'Cascar huevos', desc: 'Pulsa ESPACIO rapidamente para cascar el huevo' },
                { type: 'CutVegetable', label: 'Cortar patatas', desc: 'Pulsa ESPACIO con ritmo para cortar', vegName: 'patata', vegColor: '#F5DEB3', innerColor: '#FFFDE7' },
                { type: 'MixBowl', label: 'Batir huevos con patata', desc: 'Alterna A y D para remover' },
                { type: 'CookStove', label: 'Cuajar la tortilla', desc: 'Usa flechas ARRIBA/ABAJO para controlar el fuego' },
                { type: 'FlipPan', label: 'Dar la vuelta', desc: 'Pulsa ESPACIO en la zona verde para voltear' },
                { type: 'ServePlate', label: 'Servir en plato', desc: 'Pulsa ESPACIO para emplatar' }
            ]
        },
        italiana: {
            name: 'Pizza Margherita',
            emoji: '🍕',
            steps: [
                { type: 'KneadDough', label: 'Amasar la masa', desc: 'Alterna A y D para amasar' },
                { type: 'PourLiquid', label: 'Echar salsa de tomate', desc: 'Manten ESPACIO para verter, suelta en la zona verde', liquidName: 'salsa', liquidColor: '#D32F2F' },
                { type: 'SeasonFood', label: 'Poner mozzarella', desc: 'Pulsa ESPACIO para anadir queso, para en la zona verde', seasonName: 'queso', seasonColor: '#FFFDE7' },
                { type: 'CookStove', label: 'Hornear la pizza', desc: 'Usa flechas ARRIBA/ABAJO para controlar el horno', ovenMode: true },
                { type: 'ServePlate', label: 'Servir caliente', desc: 'Pulsa ESPACIO para emplatar' }
            ]
        },
        japonesa: {
            name: 'Sushi Maki',
            emoji: '🍣',
            steps: [
                { type: 'CookStove', label: 'Cocer el arroz', desc: 'Usa flechas ARRIBA/ABAJO para controlar el fuego' },
                { type: 'CutVegetable', label: 'Cortar el pescado', desc: 'Pulsa ESPACIO con ritmo para cortar', vegName: 'salmon', vegColor: '#FF8A65', innerColor: '#FFAB91' },
                { type: 'SeasonFood', label: 'Anadir salsa de soja', desc: 'Pulsa ESPACIO para anadir, para en la zona verde', seasonName: 'soja', seasonColor: '#4E342E' },
                { type: 'MixBowl', label: 'Enrollar el maki', desc: 'Alterna A y D para enrollar' },
                { type: 'ServePlate', label: 'Emplatar el sushi', desc: 'Pulsa ESPACIO para emplatar' }
            ]
        },
        pasteleria: {
            name: 'Tarta de Chocolate',
            emoji: '🎂',
            steps: [
                { type: 'CrackEgg', label: 'Cascar huevos', desc: 'Pulsa ESPACIO rapidamente para cascar el huevo' },
                { type: 'PourLiquid', label: 'Echar leche', desc: 'Manten ESPACIO para verter, suelta en la zona verde', liquidName: 'leche', liquidColor: '#FAFAFA' },
                { type: 'MixBowl', label: 'Mezclar ingredientes', desc: 'Alterna A y D para remover' },
                { type: 'KneadDough', label: 'Trabajar la masa', desc: 'Alterna A y D para amasar' },
                { type: 'CookStove', label: 'Hornear la tarta', desc: 'Usa flechas ARRIBA/ABAJO para controlar el horno', ovenMode: true },
                { type: 'ServePlate', label: 'Decorar y servir', desc: 'Pulsa ESPACIO para emplatar' }
            ]
        }
    };

    const recipe = RECIPES[subtypeId] || RECIPES.espanola;
    let currentStepIdx = 0;
    let totalScore = 0;
    let animFrame = null;
    let stepState = {};
    let transitioning = false;

    // Event listener tracking for cleanup
    const listeners = [];
    function addListener(target, event, fn) {
        target.addEventListener(event, fn);
        listeners.push({ target, event, fn });
    }
    function removeAllListeners() {
        listeners.forEach(l => l.target.removeEventListener(l.event, l.fn));
        listeners.length = 0;
    }

    // Keys state
    const keys = {};
    function onKeyDown(e) {
        keys[e.code] = true;
        if (['Space', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD'].includes(e.code)) {
            e.preventDefault();
        }
    }
    function onKeyUp(e) {
        keys[e.code] = false;
    }
    addListener(document, 'keydown', onKeyDown);
    addListener(document, 'keyup', onKeyUp);

    // Touch/click as Space
    let pointerDown = false;
    function onPointerDown(e) {
        pointerDown = true;
        keys['Space'] = true;
        e.preventDefault();
    }
    function onPointerUp(e) {
        pointerDown = false;
        keys['Space'] = false;
    }
    addListener(canvas, 'pointerdown', onPointerDown);
    addListener(canvas, 'pointerup', onPointerUp);
    addListener(canvas, 'pointerleave', onPointerUp);

    // ---- Drawing helpers ----
    function drawKitchenBg() {
        // Wall
        const wallGrad = ctx.createLinearGradient(0, 0, 0, H * 0.45);
        wallGrad.addColorStop(0, '#FFF8E1');
        wallGrad.addColorStop(1, '#FFECB3');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, W, H * 0.45);

        // Tile backsplash
        ctx.strokeStyle = '#FFE082';
        ctx.lineWidth = 0.5;
        for (let tx = 0; tx < W; tx += 25) {
            for (let ty = H * 0.3; ty < H * 0.45; ty += 18) {
                ctx.strokeRect(tx, ty, 25, 18);
            }
        }

        // Countertop
        const counterY = H * 0.45;
        const counterGrad = ctx.createLinearGradient(0, counterY, 0, counterY + 14);
        counterGrad.addColorStop(0, '#BDBDBD');
        counterGrad.addColorStop(1, '#9E9E9E');
        ctx.fillStyle = counterGrad;
        ctx.fillRect(0, counterY, W, 14);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillRect(0, counterY, W, 2);

        // Cabinets
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(0, counterY + 14, W, H * 0.3);
        for (let cx = 8; cx < W - 8; cx += W / 3) {
            ctx.fillStyle = '#795548';
            ctx.fillRect(cx + 4, counterY + 22, W / 3 - 16, H * 0.3 - 16);
            ctx.strokeStyle = '#8D6E63';
            ctx.lineWidth = 1;
            ctx.strokeRect(cx + 4, counterY + 22, W / 3 - 16, H * 0.3 - 16);
            ctx.fillStyle = '#BDBDBD';
            ctx.fillRect(cx + W / 6 - 6, counterY + 42, 10, 3);
        }

        // Floor
        const floorY = counterY + 14 + H * 0.3;
        ctx.fillStyle = '#D7CCC8';
        ctx.fillRect(0, floorY, W, H - floorY);
        ctx.strokeStyle = '#BCAAA4';
        ctx.lineWidth = 0.5;
        for (let fx = 0; fx < W; fx += 35) {
            for (let fy = floorY; fy < H; fy += 35) {
                ctx.strokeRect(fx, fy, 35, 35);
            }
        }
    }

    function drawProgressBar() {
        const steps = recipe.steps;
        const barY = 8;
        const barH = 6;
        const pad = 20;
        const totalW = W - pad * 2;

        // Background bar
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        roundRect(ctx, pad, barY, totalW, barH, 3);
        ctx.fill();

        // Step segments
        const segW = totalW / steps.length;
        for (let i = 0; i < steps.length; i++) {
            if (i < currentStepIdx) {
                ctx.fillStyle = '#43e97b';
            } else if (i === currentStepIdx) {
                ctx.fillStyle = '#667eea';
            } else {
                continue;
            }
            roundRect(ctx, pad + i * segW + 1, barY, segW - 2, barH, 3);
            ctx.fill();
        }

        // Recipe name
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Poppins, Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(recipe.emoji + ' ' + recipe.name, pad, barY + barH + 14);

        // Step counter
        ctx.textAlign = 'right';
        ctx.font = '10px Poppins, Arial, sans-serif';
        ctx.fillStyle = '#ccc';
        ctx.fillText('Paso ' + (currentStepIdx + 1) + '/' + steps.length, W - pad, barY + barH + 14);
        ctx.textAlign = 'left';
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function drawActionLabel(text) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.font = 'bold 13px Poppins, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, W / 2, 44);
        ctx.fillStyle = '#fff';
        ctx.fillText(text, W / 2 - 0.5, 43.5);
        ctx.textAlign = 'left';
    }

    function drawMeter(x, y, w, h, value, greenMin, greenMax, label) {
        // Background
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        roundRect(ctx, x, y, w, h, 4);
        ctx.fill();

        // Green zone
        const gx = x + w * greenMin;
        const gw = w * (greenMax - greenMin);
        ctx.fillStyle = 'rgba(67, 233, 123, 0.35)';
        ctx.fillRect(gx, y, gw, h);

        // Fill
        const fw = w * Math.max(0, Math.min(1, value));
        const inGreen = value >= greenMin && value <= greenMax;
        ctx.fillStyle = inGreen ? '#43e97b' : (value > greenMax ? '#ff5252' : '#ffab40');
        roundRect(ctx, x, y, fw, h, 4);
        ctx.fill();

        // Green zone border
        ctx.strokeStyle = '#43e97b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(gx, y - 1, gw, h + 2);

        // Label
        if (label) {
            ctx.fillStyle = '#fff';
            ctx.font = '9px Poppins, Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + w / 2, y - 4);
            ctx.textAlign = 'left';
        }
    }

    function drawScorePopup(text, x, y, alpha) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#43e97b';
        ctx.font = 'bold 14px Poppins, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
    }

    // ---- Particles system ----
    let particles = [];
    function spawnParticles(x, y, color, count, sizeMin, sizeMax) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 4,
                vy: -(1 + Math.random() * 3),
                life: 1,
                color,
                size: sizeMin + Math.random() * (sizeMax - sizeMin)
            });
        }
    }
    function updateAndDrawParticles() {
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08;
            p.life -= 0.02;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    // ---- Score popups ----
    let scorePopups = [];
    function addScorePopup(pts, x, y) {
        scorePopups.push({ text: (pts >= 0 ? '+' : '') + pts, x, y, life: 1.5 });
    }
    function updateAndDrawScorePopups(dt) {
        scorePopups = scorePopups.filter(s => s.life > 0);
        scorePopups.forEach(s => {
            s.y -= 30 * dt;
            s.life -= dt;
            drawScorePopup(s.text, s.x, s.y, Math.min(1, s.life * 2));
        });
    }

    // ---- Transition screen ----
    let transTimer = 0;
    let transText = '';
    function showTransition(text, callback) {
        transitioning = true;
        transText = text;
        transTimer = 1.5;
        transCallback = callback;
    }
    let transCallback = null;

    // ---- Mini-action implementations ----
    // Each returns { init(), update(dt), draw(), isDone(), getScore() }

    function createCrackEgg() {
        let crack = 0; // 0 to 1
        let cracked = false;
        let spaceWasUp = true;
        let yolkY = 0;
        let yolkFall = false;
        let doneTimer = 0;
        const cx = W / 2, cy = H * 0.28;
        let crackLines = [];
        let shakeX = 0;

        return {
            init() { crack = 0; cracked = false; crackLines = []; },
            update(dt) {
                if (cracked) {
                    if (yolkFall) {
                        yolkY += 200 * dt;
                        if (yolkY > 80) yolkY = 80;
                    }
                    doneTimer += dt;
                    return;
                }
                if (keys['Space'] && spaceWasUp) {
                    crack += 0.08 + Math.random() * 0.04;
                    shakeX = (Math.random() - 0.5) * 6;
                    if (crack < 1 && crackLines.length < 12) {
                        crackLines.push({
                            x: (Math.random() - 0.5) * 30,
                            y: (Math.random() - 0.5) * 40,
                            len: 5 + Math.random() * 15,
                            angle: Math.random() * Math.PI * 2
                        });
                    }
                    spaceWasUp = false;
                    if (crack >= 1) {
                        cracked = true;
                        yolkFall = true;
                        spawnParticles(cx, cy, '#FFECB3', 12, 2, 5);
                        spawnParticles(cx, cy, '#FFF9C4', 8, 1, 3);
                    }
                }
                if (!keys['Space']) spaceWasUp = true;
                shakeX *= 0.85;
            },
            draw() {
                // Bowl below
                ctx.fillStyle = '#E0E0E0';
                ctx.beginPath();
                ctx.ellipse(cx, cy + 85, 45, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#EEEEEE';
                ctx.beginPath();
                ctx.ellipse(cx, cy + 82, 38, 17, 0, 0, Math.PI * 2);
                ctx.fill();

                // Yolk in bowl
                if (yolkFall) {
                    const yy = cy + 10 + yolkY;
                    ctx.fillStyle = '#FFF9C4';
                    ctx.beginPath();
                    ctx.ellipse(cx, Math.min(yy, cy + 80), 22, 8, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#FFC107';
                    ctx.beginPath();
                    ctx.arc(cx, Math.min(yy - 2, cy + 78), 8, 0, Math.PI * 2);
                    ctx.fill();
                }

                if (!cracked) {
                    // Egg
                    ctx.save();
                    ctx.translate(cx + shakeX, cy);
                    ctx.fillStyle = '#FFF8E1';
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 22, 30, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#D7CCC8';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 22, 30, 0, 0, Math.PI * 2);
                    ctx.stroke();

                    // Crack lines
                    ctx.strokeStyle = '#8D6E63';
                    ctx.lineWidth = 1.5;
                    crackLines.forEach(cl => {
                        ctx.beginPath();
                        ctx.moveTo(cl.x, cl.y);
                        ctx.lineTo(cl.x + Math.cos(cl.angle) * cl.len, cl.y + Math.sin(cl.angle) * cl.len);
                        ctx.stroke();
                    });
                    ctx.restore();

                    // Crack meter
                    drawMeter(cx - 50, cy + 55, 100, 10, crack, 0.9, 1.0, 'Grieta');
                } else {
                    // Broken shell halves
                    ctx.fillStyle = '#FFF8E1';
                    ctx.beginPath();
                    ctx.ellipse(cx - 18, cy - 8, 14, 18, -0.2, Math.PI, 0);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(cx + 18, cy - 8, 14, 18, 0.2, Math.PI, 0);
                    ctx.fill();
                }

                drawActionLabel('Cascar el huevo');
            },
            isDone() { return cracked && doneTimer > 1.2; },
            getScore() { return cracked ? 15 : 0; }
        };
    }

    function createCutVegetable(step) {
        const vegName = (step && step.vegName) || 'patata';
        const vegColor = (step && step.vegColor) || '#F5DEB3';
        const innerColor = (step && step.innerColor) || '#FFFDE7';
        const cx = W / 2, cy = H * 0.28;
        let cuts = 0;
        const totalCuts = 8;
        let knifeY = 0;
        let spaceWasUp = true;
        let cutAnim = 0;
        let pieces = [];
        let done = false;
        let doneTimer = 0;

        return {
            init() { cuts = 0; pieces = []; },
            update(dt) {
                if (done) { doneTimer += dt; return; }
                cutAnim *= 0.85;
                if (keys['Space'] && spaceWasUp) {
                    knifeY = 12;
                    cuts++;
                    cutAnim = 1;
                    spaceWasUp = false;
                    pieces.push({
                        x: cx - 30 + pieces.length * 8 + (Math.random() - 0.5) * 6,
                        y: cy + 25 + (Math.random() - 0.5) * 4,
                        w: 6 + Math.random() * 4,
                        h: 5 + Math.random() * 3
                    });
                    if (cuts >= totalCuts) {
                        done = true;
                        spawnParticles(cx, cy, vegColor, 10, 2, 4);
                    }
                }
                if (!keys['Space']) { spaceWasUp = true; knifeY *= 0.7; }
            },
            draw() {
                // Cutting board
                ctx.fillStyle = '#A1887F';
                roundRect(ctx, cx - 55, cy - 5, 110, 35, 4);
                ctx.fill();
                ctx.fillStyle = '#BCAAA4';
                ctx.fillRect(cx - 55, cy - 5, 110, 4);

                // Vegetable (shrinks as we cut)
                const remaining = Math.max(0, 1 - cuts / totalCuts);
                if (remaining > 0) {
                    ctx.fillStyle = vegColor;
                    roundRect(ctx, cx - 10, cy + 5, 40 * remaining, 18, 4);
                    ctx.fill();
                    ctx.fillStyle = innerColor;
                    roundRect(ctx, cx - 8, cy + 7, 36 * remaining, 14, 3);
                    ctx.fill();
                }

                // Cut pieces
                pieces.forEach(p => {
                    ctx.fillStyle = vegColor;
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                    ctx.fillStyle = innerColor;
                    ctx.fillRect(p.x + 1, p.y + 1, p.w - 2, p.h - 2);
                });

                // Knife
                const kx = cx + 35 * remaining;
                const ky = cy - 15 + knifeY + cutAnim * 10;
                ctx.fillStyle = '#BDBDBD';
                ctx.fillRect(kx, ky, 4, 25);
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(kx - 2, ky - 8, 8, 10);

                // Progress
                drawMeter(cx - 50, cy + 50, 100, 10, cuts / totalCuts, 0.9, 1.0, 'Cortar ' + vegName);

                drawActionLabel('Cortar ' + vegName);
            },
            isDone() { return done && doneTimer > 0.8; },
            getScore() { return done ? 15 : 0; }
        };
    }

    function createMixBowl() {
        const cx = W / 2, cy = H * 0.28;
        let progress = 0;
        let speed = 0;
        let spoonAngle = 0;
        let lastKey = '';
        let done = false;
        let doneTimer = 0;

        return {
            init() { progress = 0; speed = 0; },
            update(dt) {
                if (done) { doneTimer += dt; return; }
                // Alternate A and D
                if (keys['KeyA'] && lastKey !== 'A') {
                    speed = Math.min(1, speed + 0.12);
                    lastKey = 'A';
                }
                if (keys['KeyD'] && lastKey !== 'D') {
                    speed = Math.min(1, speed + 0.12);
                    lastKey = 'D';
                }
                speed = Math.max(0, speed - 0.3 * dt);
                spoonAngle += speed * 6 * dt;
                progress += speed * dt * 0.5;
                if (progress >= 1) {
                    done = true;
                    progress = 1;
                    spawnParticles(cx, cy, '#FFF9C4', 10, 2, 4);
                }
            },
            draw() {
                // Bowl
                ctx.fillStyle = '#E0E0E0';
                ctx.beginPath();
                ctx.ellipse(cx, cy + 10, 48, 28, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#EEEEEE';
                ctx.beginPath();
                ctx.ellipse(cx, cy + 6, 40, 22, 0, 0, Math.PI * 2);
                ctx.fill();

                // Mixture inside
                const mixColor = `rgba(255, 235, 150, ${0.3 + progress * 0.5})`;
                ctx.fillStyle = mixColor;
                ctx.beginPath();
                ctx.ellipse(cx, cy + 8, 36, 18, 0, 0, Math.PI * 2);
                ctx.fill();

                // Spoon
                ctx.save();
                ctx.translate(cx, cy + 6);
                ctx.rotate(spoonAngle);
                ctx.fillStyle = '#8D6E63';
                ctx.fillRect(-2, -35, 4, 35);
                ctx.beginPath();
                ctx.ellipse(0, -38, 6, 10, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#A1887F';
                ctx.fill();
                ctx.restore();

                // Speed meter
                const inGreen = speed > 0.3 && speed < 0.8;
                drawMeter(cx - 50, cy + 48, 100, 8, speed, 0.3, 0.8, 'Velocidad');

                // Progress
                drawMeter(cx - 50, cy + 65, 100, 10, progress, 0.9, 1.0, 'Mezcla');

                drawActionLabel('Remover la mezcla');
            },
            isDone() { return done && doneTimer > 0.6; },
            getScore() { return done ? 15 : 0; }
        };
    }

    function createFlipPan() {
        const cx = W / 2, cy = H * 0.28;
        let markerPos = 0; // 0-1 oscillates
        let markerDir = 1;
        let markerSpeed = 1.2;
        let flipped = false;
        let flipResult = 0; // 0=none, 1=perfect, 2=ok, 3=bad
        let flipAnim = 0;
        let doneTimer = 0;
        let spaceWasUp = true;
        const greenMin = 0.4, greenMax = 0.6;

        return {
            init() {},
            update(dt) {
                if (flipped) {
                    flipAnim += dt * 3;
                    doneTimer += dt;
                    return;
                }
                markerPos += markerDir * markerSpeed * dt;
                if (markerPos >= 1) { markerPos = 1; markerDir = -1; }
                if (markerPos <= 0) { markerPos = 0; markerDir = 1; }

                if (keys['Space'] && spaceWasUp) {
                    spaceWasUp = false;
                    flipped = true;
                    if (markerPos >= greenMin && markerPos <= greenMax) {
                        flipResult = 1;
                    } else if (markerPos >= greenMin - 0.15 && markerPos <= greenMax + 0.15) {
                        flipResult = 2;
                    } else {
                        flipResult = 3;
                    }
                    spawnParticles(cx, cy, flipResult === 1 ? '#43e97b' : '#ffab40', 8, 2, 4);
                }
                if (!keys['Space']) spaceWasUp = true;
            },
            draw() {
                // Pan
                ctx.save();
                ctx.translate(cx, cy + 5);
                if (flipped && flipAnim < Math.PI) {
                    ctx.scale(1, Math.cos(flipAnim));
                }
                ctx.fillStyle = '#424242';
                ctx.beginPath();
                ctx.ellipse(0, 0, 50, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.ellipse(0, -2, 44, 16, 0, 0, Math.PI * 2);
                ctx.fill();
                // Food in pan
                ctx.fillStyle = '#FFD54F';
                ctx.beginPath();
                ctx.ellipse(0, -3, 30, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                // Pan handle
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(50, -4, 30, 8);
                ctx.restore();

                if (!flipped) {
                    // Timing bar
                    const barW = 120, barH = 14;
                    const barX = cx - barW / 2, barY = cy + 50;
                    ctx.fillStyle = 'rgba(0,0,0,0.4)';
                    roundRect(ctx, barX, barY, barW, barH, 4);
                    ctx.fill();
                    // Green zone
                    ctx.fillStyle = 'rgba(67, 233, 123, 0.4)';
                    ctx.fillRect(barX + barW * greenMin, barY, barW * (greenMax - greenMin), barH);
                    // Marker
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(barX + barW * markerPos - 2, barY - 2, 4, barH + 4);
                    ctx.fillStyle = '#fff';
                    ctx.font = '9px Poppins, Arial, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('Pulsa en la zona verde', cx, barY - 6);
                    ctx.textAlign = 'left';
                } else {
                    const label = flipResult === 1 ? 'Perfecto!' : flipResult === 2 ? 'Bien!' : 'Casi...';
                    ctx.fillStyle = flipResult === 1 ? '#43e97b' : flipResult === 2 ? '#ffab40' : '#ff5252';
                    ctx.font = 'bold 16px Poppins, Arial, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(label, cx, cy + 55);
                    ctx.textAlign = 'left';
                }

                drawActionLabel('Dar la vuelta');
            },
            isDone() { return flipped && doneTimer > 1.2; },
            getScore() { return flipResult === 1 ? 20 : flipResult === 2 ? 12 : 5; }
        };
    }

    function createPourLiquid(step) {
        const liquidName = (step && step.liquidName) || 'liquido';
        const liquidColor = (step && step.liquidColor) || '#42A5F5';
        const cx = W / 2, cy = H * 0.22;
        let amount = 0;
        let pouring = false;
        let done = false;
        let doneTimer = 0;
        let pourAnim = 0;
        const greenMin = 0.55, greenMax = 0.75;
        let spaceWasUp = true;
        let released = false;

        return {
            init() { amount = 0; },
            update(dt) {
                if (done) { doneTimer += dt; return; }
                pouring = !!keys['Space'];
                if (pouring && !released) {
                    amount = Math.min(1, amount + dt * 0.35);
                    pourAnim += dt * 8;
                }
                if (!keys['Space'] && amount > 0.05 && !released) {
                    released = true;
                    done = true;
                    spawnParticles(cx, cy + 60, liquidColor, 8, 2, 4);
                }
            },
            draw() {
                // Bottle
                const bottleX = cx - 10;
                const bottleTilt = pouring ? -0.3 : 0;
                ctx.save();
                ctx.translate(cx, cy - 20);
                ctx.rotate(bottleTilt);
                ctx.fillStyle = '#78909C';
                roundRect(ctx, -10, -30, 20, 35, 4);
                ctx.fill();
                ctx.fillStyle = liquidColor;
                roundRect(ctx, -8, -10, 16, 16, 3);
                ctx.fill();
                // Neck
                ctx.fillStyle = '#78909C';
                ctx.fillRect(-5, -40, 10, 12);
                ctx.restore();

                // Pour stream
                if (pouring && !released) {
                    ctx.strokeStyle = liquidColor;
                    ctx.lineWidth = 3 + Math.sin(pourAnim) * 1;
                    ctx.beginPath();
                    ctx.moveTo(cx - 3, cy - 10);
                    ctx.quadraticCurveTo(cx + 2, cy + 20, cx, cy + 50);
                    ctx.stroke();
                }

                // Cup/container below
                ctx.fillStyle = '#E0E0E0';
                roundRect(ctx, cx - 25, cy + 40, 50, 35, 4);
                ctx.fill();
                // Liquid level
                const fillH = 30 * amount;
                ctx.fillStyle = liquidColor;
                roundRect(ctx, cx - 23, cy + 73 - fillH, 46, fillH, 3);
                ctx.fill();

                // Meter
                drawMeter(cx - 55, cy + 85, 110, 10, amount, greenMin, greenMax, 'Cantidad de ' + liquidName);

                drawActionLabel('Verter ' + liquidName);
            },
            isDone() { return done && doneTimer > 0.8; },
            getScore() {
                if (amount >= greenMin && amount <= greenMax) return 20;
                if (amount >= greenMin - 0.1 && amount <= greenMax + 0.1) return 12;
                return 5;
            }
        };
    }

    function createSeasonFood(step) {
        const seasonName = (step && step.seasonName) || 'especias';
        const seasonColor = (step && step.seasonColor) || '#FFC107';
        const cx = W / 2, cy = H * 0.25;
        let amount = 0;
        let done = false;
        let doneTimer = 0;
        let spaceWasUp = true;
        let shakeAnim = 0;
        const greenMin = 0.5, greenMax = 0.7;
        let seasonParticles = [];

        return {
            init() { amount = 0; },
            update(dt) {
                if (done) { doneTimer += dt; return; }
                if (keys['Space'] && spaceWasUp) {
                    amount = Math.min(1, amount + 0.06);
                    shakeAnim = 1;
                    spaceWasUp = false;
                    seasonParticles.push({
                        x: cx + (Math.random() - 0.5) * 30,
                        y: cy + 25,
                        vy: 1 + Math.random() * 2,
                        life: 1
                    });
                }
                if (!keys['Space']) spaceWasUp = true;
                shakeAnim *= 0.85;

                // Stop button (press Enter or wait for key release after enough amount)
                if (amount > 0.3 && keys['Enter']) {
                    done = true;
                    spawnParticles(cx, cy + 30, seasonColor, 6, 2, 3);
                }

                // Auto-done if full
                if (amount >= 1) { done = true; }

                seasonParticles = seasonParticles.filter(p => p.life > 0);
                seasonParticles.forEach(p => {
                    p.y += p.vy;
                    p.life -= 0.03;
                });
            },
            draw() {
                // Plate below
                ctx.fillStyle = '#FAFAFA';
                ctx.beginPath();
                ctx.ellipse(cx, cy + 35, 45, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#E0E0E0';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(cx, cy + 35, 40, 17, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Food on plate
                ctx.fillStyle = '#FFD54F';
                ctx.beginPath();
                ctx.ellipse(cx, cy + 33, 28, 10, 0, 0, Math.PI * 2);
                ctx.fill();

                // Season particles falling
                seasonParticles.forEach(p => {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = seasonColor;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.globalAlpha = 1;

                // Seasoning container
                const shakeOff = Math.sin(shakeAnim * 10) * shakeAnim * 4;
                ctx.save();
                ctx.translate(cx + shakeOff, cy - 25);
                ctx.fillStyle = '#8D6E63';
                roundRect(ctx, -10, -20, 20, 25, 5);
                ctx.fill();
                ctx.fillStyle = '#A1887F';
                roundRect(ctx, -8, -18, 16, 6, 2);
                ctx.fill();
                // Holes on top
                ctx.fillStyle = '#5D4037';
                for (let i = -4; i <= 4; i += 4) {
                    ctx.beginPath();
                    ctx.arc(i, -22, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();

                // Meter
                drawMeter(cx - 55, cy + 65, 110, 10, amount, greenMin, greenMax, seasonName);

                // Hint
                ctx.fillStyle = '#aaa';
                ctx.font = '8px Poppins, Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('ESPACIO para anadir, ENTER para parar', cx, cy + 85);
                ctx.textAlign = 'left';

                drawActionLabel('Anadir ' + seasonName);
            },
            isDone() { return done && doneTimer > 0.6; },
            getScore() {
                if (amount >= greenMin && amount <= greenMax) return 20;
                if (amount >= greenMin - 0.12 && amount <= greenMax + 0.12) return 12;
                return 5;
            }
        };
    }

    function createCookStove(step) {
        const ovenMode = step && step.ovenMode;
        const cx = W / 2, cy = H * 0.26;
        let temp = 0.5; // 0-1
        let timeInZone = 0;
        const targetTime = 4;
        let done = false;
        let doneTimer = 0;
        const greenMin = 0.4, greenMax = 0.65;
        let flameAnim = 0;

        return {
            init() { temp = 0.5; timeInZone = 0; },
            update(dt) {
                if (done) { doneTimer += dt; return; }
                flameAnim += dt * 5;
                if (keys['ArrowUp']) temp = Math.min(1, temp + dt * 0.4);
                if (keys['ArrowDown']) temp = Math.max(0, temp - dt * 0.4);
                // Drift
                temp += (Math.random() - 0.5) * 0.01;
                temp = Math.max(0, Math.min(1, temp));

                if (temp >= greenMin && temp <= greenMax) {
                    timeInZone += dt;
                    if (timeInZone >= targetTime) {
                        done = true;
                        spawnParticles(cx, cy, '#FF9800', 10, 2, 5);
                    }
                } else {
                    timeInZone = Math.max(0, timeInZone - dt * 0.5);
                }
            },
            draw() {
                if (ovenMode) {
                    // Oven
                    ctx.fillStyle = '#455A64';
                    roundRect(ctx, cx - 50, cy - 30, 100, 70, 6);
                    ctx.fill();
                    // Window
                    const glow = (temp >= greenMin && temp <= greenMax) ? 0.6 : temp > greenMax ? 0.9 : 0.2;
                    ctx.fillStyle = `rgba(255, ${180 - temp * 100}, 50, ${glow})`;
                    roundRect(ctx, cx - 38, cy - 20, 76, 40, 4);
                    ctx.fill();
                    // Door handle
                    ctx.fillStyle = '#BDBDBD';
                    ctx.fillRect(cx - 30, cy + 24, 60, 4);
                    // Knobs
                    for (let k = 0; k < 3; k++) {
                        ctx.fillStyle = '#CFD8DC';
                        ctx.beginPath();
                        ctx.arc(cx - 25 + k * 25, cy - 35, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else {
                    // Stovetop
                    ctx.fillStyle = '#37474F';
                    roundRect(ctx, cx - 55, cy - 10, 110, 40, 6);
                    ctx.fill();
                    // Burner
                    ctx.strokeStyle = '#616161';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(cx, cy + 10, 22, 10, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    // Flames
                    for (let f = 0; f < 8; f++) {
                        const angle = (f / 8) * Math.PI * 2 + flameAnim;
                        const fx = cx + Math.cos(angle) * 16;
                        const fy = cy + 10 + Math.sin(angle) * 7;
                        const fh = 4 + temp * 12 + Math.sin(flameAnim + f) * 3;
                        ctx.fillStyle = `rgba(255, ${180 - temp * 130}, 0, ${0.4 + temp * 0.4})`;
                        ctx.beginPath();
                        ctx.moveTo(fx - 3, fy);
                        ctx.quadraticCurveTo(fx, fy - fh, fx + 3, fy);
                        ctx.fill();
                    }
                    // Pot on stove
                    ctx.fillStyle = '#78909C';
                    roundRect(ctx, cx - 20, cy - 8, 40, 20, 3);
                    ctx.fill();
                    ctx.fillStyle = '#90A4AE';
                    ctx.beginPath();
                    ctx.ellipse(cx, cy - 8, 22, 8, 0, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Temperature gauge (vertical, right side)
                const gaugeX = cx + 70, gaugeY = cy - 30, gaugeH = 80, gaugeW = 14;
                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                roundRect(ctx, gaugeX, gaugeY, gaugeW, gaugeH, 4);
                ctx.fill();
                // Green zone
                const gzTop = gaugeY + gaugeH * (1 - greenMax);
                const gzH = gaugeH * (greenMax - greenMin);
                ctx.fillStyle = 'rgba(67, 233, 123, 0.35)';
                ctx.fillRect(gaugeX, gzTop, gaugeW, gzH);
                ctx.strokeStyle = '#43e97b';
                ctx.lineWidth = 1;
                ctx.strokeRect(gaugeX, gzTop, gaugeW, gzH);
                // Needle
                const needleY = gaugeY + gaugeH * (1 - temp);
                const inZone = temp >= greenMin && temp <= greenMax;
                ctx.fillStyle = inZone ? '#43e97b' : (temp > greenMax ? '#ff5252' : '#42A5F5');
                ctx.beginPath();
                ctx.moveTo(gaugeX - 4, needleY);
                ctx.lineTo(gaugeX + 2, needleY - 4);
                ctx.lineTo(gaugeX + 2, needleY + 4);
                ctx.closePath();
                ctx.fill();
                ctx.fillRect(gaugeX, needleY - 1.5, gaugeW, 3);

                // Labels
                ctx.fillStyle = '#ff5252';
                ctx.font = '8px Poppins, Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText('MAX', gaugeX + gaugeW + 3, gaugeY + 8);
                ctx.fillStyle = '#42A5F5';
                ctx.fillText('MIN', gaugeX + gaugeW + 3, gaugeY + gaugeH);

                // Time in zone progress
                drawMeter(cx - 55, cy + 50, 110, 10, timeInZone / targetTime, 0.9, 1.0, 'Tiempo cocinando');

                // Burned/raw indicators
                if (temp > greenMax + 0.1) {
                    ctx.fillStyle = '#ff5252';
                    ctx.font = 'bold 11px Poppins, Arial, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('Demasiado caliente!', cx, cy + 72);
                    ctx.textAlign = 'left';
                } else if (temp < greenMin - 0.1) {
                    ctx.fillStyle = '#42A5F5';
                    ctx.font = 'bold 11px Poppins, Arial, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('Muy frio!', cx, cy + 72);
                    ctx.textAlign = 'left';
                }

                drawActionLabel(ovenMode ? 'Controlar el horno' : 'Controlar el fuego');
            },
            isDone() { return done && doneTimer > 0.8; },
            getScore() {
                if (done) return 20;
                return 5;
            }
        };
    }

    function createKneadDough() {
        const cx = W / 2, cy = H * 0.28;
        let progress = 0;
        let lastKey = '';
        let doughSquish = 0;
        let done = false;
        let doneTimer = 0;

        return {
            init() { progress = 0; },
            update(dt) {
                if (done) { doneTimer += dt; return; }
                if (keys['KeyA'] && lastKey !== 'A') {
                    progress += 0.04;
                    doughSquish = -1;
                    lastKey = 'A';
                }
                if (keys['KeyD'] && lastKey !== 'D') {
                    progress += 0.04;
                    doughSquish = 1;
                    lastKey = 'D';
                }
                doughSquish *= 0.9;
                if (progress >= 1) {
                    done = true;
                    progress = 1;
                    spawnParticles(cx, cy, '#FFF8E1', 10, 2, 4);
                }
            },
            draw() {
                // Surface
                ctx.fillStyle = '#BCAAA4';
                ctx.fillRect(cx - 60, cy + 15, 120, 6);

                // Dough ball deforming
                const squishX = 1 + doughSquish * 0.15;
                const squishY = 1 - Math.abs(doughSquish) * 0.1;
                ctx.save();
                ctx.translate(cx, cy + 5);
                ctx.scale(squishX, squishY);

                // Dough gets smoother as progress increases
                const smooth = progress;
                ctx.fillStyle = `rgb(${245 - smooth * 20}, ${222 - smooth * 10}, ${179 - smooth * 10})`;
                ctx.beginPath();
                ctx.ellipse(0, 0, 35 + progress * 8, 20 - progress * 3, 0, 0, Math.PI * 2);
                ctx.fill();
                // Texture dots (fewer as smoother)
                const dots = Math.floor((1 - smooth) * 12);
                ctx.fillStyle = 'rgba(160,120,80,0.2)';
                for (let d = 0; d < dots; d++) {
                    const dx = Math.sin(d * 1.7) * 22;
                    const dy = Math.cos(d * 2.3) * 12;
                    ctx.beginPath();
                    ctx.arc(dx, dy, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                // Highlight
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.beginPath();
                ctx.ellipse(-8, -6, 12, 6, -0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // Hands hint
                const handOff = doughSquish * 15;
                ctx.fillStyle = '#FFCCBC';
                ctx.beginPath();
                ctx.ellipse(cx - 20 + handOff, cy - 8, 10, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(cx + 20 + handOff, cy - 8, 10, 8, 0, 0, Math.PI * 2);
                ctx.fill();

                // Progress
                drawMeter(cx - 55, cy + 35, 110, 10, progress, 0.9, 1.0, 'Amasado');

                drawActionLabel('Amasar la masa');
            },
            isDone() { return done && doneTimer > 0.6; },
            getScore() { return done ? 15 : 0; }
        };
    }

    function createServePlate() {
        const cx = W / 2, cy = H * 0.28;
        let served = false;
        let serveAnim = 0;
        let doneTimer = 0;
        let spaceWasUp = true;

        return {
            init() { served = false; },
            update(dt) {
                if (served) {
                    serveAnim = Math.min(1, serveAnim + dt * 2);
                    doneTimer += dt;
                    return;
                }
                if (keys['Space'] && spaceWasUp) {
                    served = true;
                    spaceWasUp = false;
                    spawnParticles(cx, cy, '#43e97b', 15, 2, 5);
                    spawnParticles(cx - 20, cy - 10, '#FFD700', 5, 2, 4);
                    spawnParticles(cx + 20, cy - 10, '#FFD700', 5, 2, 4);
                }
                if (!keys['Space']) spaceWasUp = true;
            },
            draw() {
                // Plate
                ctx.fillStyle = '#FAFAFA';
                ctx.beginPath();
                ctx.ellipse(cx, cy + 10, 52, 25, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#E0E0E0';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(cx, cy + 10, 46, 21, 0, 0, Math.PI * 2);
                ctx.stroke();
                // Decorative rim
                ctx.strokeStyle = '#BDBDBD';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.ellipse(cx, cy + 10, 50, 23, 0, 0, Math.PI * 2);
                ctx.stroke();

                if (!served) {
                    // Food hovering above plate
                    const hoverY = cy - 25 + Math.sin(Date.now() * 0.004) * 4;
                    ctx.font = '32px serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(recipe.emoji, cx, hoverY);
                    ctx.textAlign = 'left';

                    // Arrow
                    ctx.fillStyle = '#667eea';
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - 8);
                    ctx.lineTo(cx - 6, cy - 15);
                    ctx.lineTo(cx + 6, cy - 15);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Food on plate with scale animation
                    const s = Math.min(1, serveAnim * 1.5);
                    ctx.save();
                    ctx.translate(cx, cy + 5);
                    ctx.scale(s, s);
                    ctx.font = '36px serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(recipe.emoji, 0, 8);
                    ctx.textAlign = 'left';
                    ctx.restore();

                    // Stars
                    if (serveAnim > 0.5) {
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '14px serif';
                        ctx.textAlign = 'center';
                        const starAlpha = Math.min(1, (serveAnim - 0.5) * 3);
                        ctx.globalAlpha = starAlpha;
                        ctx.fillText('★', cx - 30, cy - 15);
                        ctx.fillText('★', cx + 30, cy - 15);
                        ctx.fillText('★', cx, cy - 25);
                        ctx.globalAlpha = 1;
                        ctx.textAlign = 'left';
                    }
                }

                drawActionLabel(served ? 'Plato listo!' : 'Emplatar');
            },
            isDone() { return served && doneTimer > 1.5; },
            getScore() { return 10; }
        };
    }

    // ---- Step factory ----
    function createStep(stepDef) {
        switch (stepDef.type) {
            case 'CrackEgg': return createCrackEgg();
            case 'CutVegetable': return createCutVegetable(stepDef);
            case 'MixBowl': return createMixBowl();
            case 'FlipPan': return createFlipPan();
            case 'PourLiquid': return createPourLiquid(stepDef);
            case 'SeasonFood': return createSeasonFood(stepDef);
            case 'CookStove': return createCookStove(stepDef);
            case 'KneadDough': return createKneadDough();
            case 'ServePlate': return createServePlate();
            default: return createServePlate();
        }
    }

    // ---- Game loop ----
    let currentAction = null;
    let lastTime = performance.now();

    function startStep() {
        if (currentStepIdx >= recipe.steps.length) {
            finishGame();
            return;
        }
        const stepDef = recipe.steps[currentStepIdx];
        showTransition(stepDef.label, () => {
            currentAction = createStep(stepDef);
            currentAction.init();
            updateControls();
        });
    }

    function updateControls() {
        if (currentStepIdx >= recipe.steps.length) return;
        const stepDef = recipe.steps[currentStepIdx];
        let hint = '';
        switch (stepDef.type) {
            case 'CrackEgg':
            case 'CutVegetable':
                hint = '<b>ESPACIO</b> / Toca pantalla = Golpear';
                break;
            case 'MixBowl':
            case 'KneadDough':
                hint = '<b>A</b> y <b>D</b> = Alternar movimiento';
                break;
            case 'FlipPan':
                hint = '<b>ESPACIO</b> / Toca = Voltear en zona verde';
                break;
            case 'PourLiquid':
                hint = '<b>Mantener ESPACIO</b> / Toca = Verter. Suelta en zona verde';
                break;
            case 'SeasonFood':
                hint = '<b>ESPACIO</b> = Anadir. <b>ENTER</b> = Parar en zona verde';
                break;
            case 'CookStove':
                hint = '<b>ARRIBA</b>/<b>ABAJO</b> = Subir/Bajar temperatura';
                break;
            case 'ServePlate':
                hint = '<b>ESPACIO</b> / Toca = Emplatar';
                break;
        }
        controls.innerHTML = `
            <div style="padding: 8px; text-align: center; font-size: 0.75rem; color: #ccc; line-height: 1.6;">
                <div style="color: #667eea; font-weight: 700; margin-bottom: 4px;">${stepDef.label}</div>
                <div>${hint}</div>
            </div>
        `;
    }

    function finishGame() {
        cancelAnimationFrame(animFrame);
        animFrame = null;
        setScore(totalScore);
        const maxScore = recipe.steps.length * 20;
        const pct = totalScore / maxScore;
        const stars = pct >= 0.9 ? 5 : pct >= 0.7 ? 4 : pct >= 0.5 ? 3 : pct >= 0.3 ? 2 : 1;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) starsHtml += `<span class="star ${i < stars ? 'filled' : 'empty'}">★</span>`;
        showResult(
            recipe.name + ' lista!',
            `<div class="stars">${starsHtml}</div>`,
            `Has cocinado ${recipe.name}. Puntuacion: ${totalScore}`,
            () => startCocina(subtypeId)
        );
    }

    function gameLoop(timestamp) {
        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        ctx.setTransform(2, 0, 0, 2, 0, 0);
        ctx.clearRect(0, 0, W, H);

        drawKitchenBg();
        drawProgressBar();

        if (transitioning) {
            transTimer -= dt;
            // Transition overlay
            const alpha = transTimer > 1 ? (1.5 - transTimer) * 2 : transTimer < 0.5 ? transTimer * 2 : 1;
            ctx.fillStyle = `rgba(0,0,0,${0.6 * Math.min(1, alpha)})`;
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Poppins, Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.globalAlpha = Math.min(1, alpha);
            ctx.fillText(transText, W / 2, H * 0.4);
            ctx.font = '10px Poppins, Arial, sans-serif';
            ctx.fillStyle = '#aaa';
            ctx.fillText('Preparate...', W / 2, H * 0.4 + 22);
            ctx.textAlign = 'left';
            ctx.globalAlpha = 1;

            if (transTimer <= 0) {
                transitioning = false;
                if (transCallback) transCallback();
            }
        } else if (currentAction) {
            currentAction.update(dt);
            currentAction.draw();

            if (currentAction.isDone()) {
                const pts = currentAction.getScore();
                totalScore += pts;
                addScore(pts);
                addScorePopup(pts, W / 2, H * 0.15);
                currentAction = null;
                currentStepIdx++;
                startStep();
            }
        }

        updateAndDrawParticles();
        updateAndDrawScorePopups(dt);

        animFrame = requestAnimationFrame(gameLoop);
    }

    // ---- UI setup ----
    ui.innerHTML = '';
    ui.style.pointerEvents = 'none';

    // ---- Start ----
    lastTime = performance.now();
    animFrame = requestAnimationFrame(gameLoop);
    startStep();

    // ---- Cleanup ----
    currentGame = {
        cleanup: () => {
            if (animFrame) cancelAnimationFrame(animFrame);
            animFrame = null;
            removeAllListeners();
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}
