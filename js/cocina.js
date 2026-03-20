// ==========================================
// COCINA - Cocina visual de verdad
// ==========================================

const RECIPES = {
    espanola: [
        {
            name: 'Tortilla Espanola', emoji: '🥘',
            steps: [
                { text: 'Pelar y cortar patatas', tool: 'knife', action: 'cut', ingredient: '🥔', result: '🥔✂️' },
                { text: 'Freir patatas en aceite', tool: 'pan', action: 'fry', ingredient: '🥔', result: '🍳' },
                { text: 'Batir huevos', tool: 'bowl', action: 'mix', ingredient: '🥚', result: '🥣' },
                { text: 'Mezclar patatas con huevo', tool: 'bowl', action: 'mix', ingredient: '🥔+🥚', result: '🥣' },
                { text: 'Cuajar en sarten', tool: 'pan', action: 'cook', ingredient: '🥣', result: '🍳' },
                { text: 'Dar la vuelta', tool: 'pan', action: 'flip', ingredient: '🍳', result: '🔄' },
                { text: 'Servir en plato', tool: 'plate', action: 'serve', ingredient: '🍳', result: '🥘' }
            ],
            ingredients: ['🥔 Patatas','🥚 Huevos','🫒 Aceite','🧅 Cebolla','🧂 Sal']
        },
        {
            name: 'Paella Valenciana', emoji: '🥘',
            steps: [
                { text: 'Sofreir pollo', tool: 'pan', action: 'fry', ingredient: '🍗', result: '🍗🔥' },
                { text: 'Anadir judia verde', tool: 'pan', action: 'add', ingredient: '🫘', result: '🫘' },
                { text: 'Anadir tomate rallado', tool: 'pan', action: 'add', ingredient: '🍅', result: '🍅' },
                { text: 'Verter agua y hervir', tool: 'pot', action: 'boil', ingredient: '💧', result: '♨️' },
                { text: 'Anadir arroz', tool: 'pan', action: 'add', ingredient: '🍚', result: '🍚' },
                { text: 'Cocer 18 minutos', tool: 'pan', action: 'cook', ingredient: '⏱️', result: '🔥' },
                { text: 'Dejar reposar y servir', tool: 'plate', action: 'serve', ingredient: '🥘', result: '🥘' }
            ],
            ingredients: ['🍗 Pollo','🍚 Arroz','🫘 Judias','🍅 Tomate','🧂 Sal']
        }
    ],
    italiana: [
        {
            name: 'Pizza Margherita', emoji: '🍕',
            steps: [
                { text: 'Preparar la masa', tool: 'bowl', action: 'mix', ingredient: '🌾+💧', result: '🥣' },
                { text: 'Estirar la masa', tool: 'board', action: 'roll', ingredient: '🫓', result: '⭕' },
                { text: 'Anadir salsa de tomate', tool: 'board', action: 'spread', ingredient: '🍅', result: '🔴' },
                { text: 'Colocar mozzarella', tool: 'board', action: 'add', ingredient: '🧀', result: '⚪' },
                { text: 'Anadir albahaca', tool: 'board', action: 'add', ingredient: '🌿', result: '🟢' },
                { text: 'Hornear a 250 grados', tool: 'oven', action: 'bake', ingredient: '🍕', result: '🔥' },
                { text: 'Servir caliente', tool: 'plate', action: 'serve', ingredient: '🍕', result: '🍕' }
            ],
            ingredients: ['🫓 Masa','🍅 Tomate','🧀 Mozzarella','🌿 Albahaca','🫒 Aceite']
        },
        {
            name: 'Pasta Carbonara', emoji: '🍝',
            steps: [
                { text: 'Hervir agua con sal', tool: 'pot', action: 'boil', ingredient: '💧+🧂', result: '♨️' },
                { text: 'Cocer espaguetis', tool: 'pot', action: 'cook', ingredient: '🍝', result: '🍝' },
                { text: 'Freir panceta', tool: 'pan', action: 'fry', ingredient: '🥓', result: '🥓🔥' },
                { text: 'Mezclar huevo con queso', tool: 'bowl', action: 'mix', ingredient: '🥚+🧀', result: '🥣' },
                { text: 'Escurrir pasta', tool: 'pot', action: 'drain', ingredient: '🍝', result: '🍝' },
                { text: 'Mezclar todo', tool: 'pan', action: 'mix', ingredient: '🍝+🥓+🥣', result: '🍝' },
                { text: 'Servir con pimienta', tool: 'plate', action: 'serve', ingredient: '🌶️', result: '🍝' }
            ],
            ingredients: ['🍝 Espaguetis','🥓 Panceta','🥚 Huevo','🧀 Queso','🌶️ Pimienta']
        }
    ],
    japonesa: [
        {
            name: 'Sushi Maki', emoji: '🍣',
            steps: [
                { text: 'Cocer arroz para sushi', tool: 'pot', action: 'cook', ingredient: '🍚', result: '🍚' },
                { text: 'Anadir vinagre de arroz', tool: 'bowl', action: 'mix', ingredient: '🫗', result: '🍚' },
                { text: 'Colocar alga nori', tool: 'board', action: 'place', ingredient: '🟢', result: '🟩' },
                { text: 'Extender arroz sobre nori', tool: 'board', action: 'spread', ingredient: '🍚', result: '⬜' },
                { text: 'Colocar salmon y aguacate', tool: 'board', action: 'add', ingredient: '🐟+🥑', result: '🟠🟢' },
                { text: 'Enrollar con esterilla', tool: 'board', action: 'roll', ingredient: '🍣', result: '🌀' },
                { text: 'Cortar en piezas', tool: 'knife', action: 'cut', ingredient: '🍣', result: '🍣🍣🍣' }
            ],
            ingredients: ['🍚 Arroz','🐟 Salmon','🥑 Aguacate','🟢 Wasabi','🫗 Vinagre']
        },
        {
            name: 'Ramen', emoji: '🍜',
            steps: [
                { text: 'Preparar caldo dashi', tool: 'pot', action: 'boil', ingredient: '🫗', result: '♨️' },
                { text: 'Cocer fideos ramen', tool: 'pot', action: 'cook', ingredient: '🍜', result: '🍜' },
                { text: 'Preparar huevo marinado', tool: 'pot', action: 'cook', ingredient: '🥚', result: '🥚' },
                { text: 'Cortar cerdo', tool: 'knife', action: 'cut', ingredient: '🍖', result: '🍖✂️' },
                { text: 'Montar bowl con fideos', tool: 'bowl', action: 'place', ingredient: '🍜', result: '🍜' },
                { text: 'Anadir caldo caliente', tool: 'pot', action: 'pour', ingredient: '♨️', result: '🍜♨️' },
                { text: 'Decorar con nori y cebolleta', tool: 'bowl', action: 'add', ingredient: '🧅', result: '🍜' }
            ],
            ingredients: ['🍜 Fideos','🍖 Cerdo','🥚 Huevo','🧅 Cebolleta','🫗 Caldo']
        }
    ],
    pasteleria: [
        {
            name: 'Tarta de Chocolate', emoji: '🎂',
            steps: [
                { text: 'Derretir chocolate', tool: 'pot', action: 'melt', ingredient: '🍫', result: '🟤' },
                { text: 'Mezclar mantequilla con azucar', tool: 'bowl', action: 'mix', ingredient: '🧈+🍬', result: '🥣' },
                { text: 'Anadir huevos uno a uno', tool: 'bowl', action: 'add', ingredient: '🥚', result: '🥣' },
                { text: 'Incorporar harina', tool: 'bowl', action: 'mix', ingredient: '🌾', result: '🥣' },
                { text: 'Anadir chocolate derretido', tool: 'bowl', action: 'pour', ingredient: '🟤', result: '🟤' },
                { text: 'Hornear 30 min a 180 grados', tool: 'oven', action: 'bake', ingredient: '🎂', result: '🔥' },
                { text: 'Decorar con ganache', tool: 'plate', action: 'decorate', ingredient: '🍫', result: '🎂' }
            ],
            ingredients: ['🍫 Chocolate','🧈 Mantequilla','🥚 Huevos','🌾 Harina','🍬 Azucar']
        },
        {
            name: 'Galletas', emoji: '🍪',
            steps: [
                { text: 'Mezclar mantequilla y azucar', tool: 'bowl', action: 'mix', ingredient: '🧈+🍬', result: '🥣' },
                { text: 'Anadir huevo y vainilla', tool: 'bowl', action: 'add', ingredient: '🥚', result: '🥣' },
                { text: 'Incorporar harina y levadura', tool: 'bowl', action: 'mix', ingredient: '🌾', result: '🥣' },
                { text: 'Anadir chips de chocolate', tool: 'bowl', action: 'add', ingredient: '🍫', result: '🥣' },
                { text: 'Formar bolitas en bandeja', tool: 'board', action: 'shape', ingredient: '🍪', result: '⚪⚪⚪' },
                { text: 'Hornear 12 min a 180 grados', tool: 'oven', action: 'bake', ingredient: '🍪', result: '🔥' },
                { text: 'Dejar enfriar', tool: 'plate', action: 'serve', ingredient: '🍪', result: '🍪' }
            ],
            ingredients: ['🧈 Mantequilla','🍬 Azucar','🥚 Huevo','🌾 Harina','🍫 Chips choc']
        }
    ]
};

function startCocina(subtype) {
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

    const recipeList = RECIPES[subtype] || RECIPES.espanola;
    const recipe = randomFrom(recipeList);
    let currentStep = 0;
    let animFrame;
    let actionAnim = 0; // 0-1 animation progress
    let actionActive = ''; // current action name
    let particles = [];
    let ovenGlow = 0;
    let steamTime = 0;

    // Kitchen layout
    const kitchenY = H * 0.35; // Counter top line
    const floorY = H * 0.75;

    function drawKitchen() {
        // Wall
        const wallGrad = ctx.createLinearGradient(0, 0, 0, kitchenY);
        wallGrad.addColorStop(0, '#FFF8E1');
        wallGrad.addColorStop(1, '#FFECB3');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, W, kitchenY);

        // Wall tiles
        ctx.strokeStyle = '#FFE082';
        ctx.lineWidth = 0.5;
        for (let tx = 0; tx < W; tx += 30) {
            for (let ty = kitchenY - 80; ty < kitchenY; ty += 20) {
                ctx.strokeRect(tx, ty, 30, 20);
            }
        }

        // Shelf on wall
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(W * 0.6, kitchenY - 70, W * 0.3, 6);
        // Jars on shelf
        ctx.font = '16px serif';
        ctx.fillText('🫙', W * 0.65, kitchenY - 74);
        ctx.fillText('🫙', W * 0.73, kitchenY - 74);
        ctx.fillText('🧂', W * 0.81, kitchenY - 74);

        // Kitchen hood
        ctx.fillStyle = '#78909C';
        ctx.fillRect(W * 0.15, kitchenY - 65, W * 0.35, 15);
        ctx.fillStyle = '#607D8B';
        ctx.beginPath();
        ctx.moveTo(W * 0.12, kitchenY - 50);
        ctx.lineTo(W * 0.53, kitchenY - 50);
        ctx.lineTo(W * 0.5, kitchenY - 40);
        ctx.lineTo(W * 0.15, kitchenY - 40);
        ctx.closePath();
        ctx.fill();

        // Countertop
        const counterGrad = ctx.createLinearGradient(0, kitchenY, 0, kitchenY + 12);
        counterGrad.addColorStop(0, '#BDBDBD');
        counterGrad.addColorStop(1, '#9E9E9E');
        ctx.fillStyle = counterGrad;
        ctx.fillRect(0, kitchenY, W, 12);
        // Counter edge shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillRect(0, kitchenY, W, 2);

        // Cabinets below counter
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(0, kitchenY + 12, W, floorY - kitchenY - 12);
        // Cabinet doors
        ctx.fillStyle = '#6D4C41';
        for (let cx = 10; cx < W - 10; cx += W / 4) {
            ctx.fillStyle = '#795548';
            ctx.fillRect(cx + 4, kitchenY + 18, W / 4 - 18, floorY - kitchenY - 36);
            ctx.strokeStyle = '#8D6E63';
            ctx.lineWidth = 1;
            ctx.strokeRect(cx + 4, kitchenY + 18, W / 4 - 18, floorY - kitchenY - 36);
            // Handle
            ctx.fillStyle = '#BDBDBD';
            ctx.fillRect(cx + W / 8 - 6, kitchenY + 40, 8, 3);
        }

        // Floor
        ctx.fillStyle = '#D7CCC8';
        ctx.fillRect(0, floorY, W, H - floorY);
        // Floor tiles
        ctx.strokeStyle = '#BCAAA4';
        ctx.lineWidth = 0.5;
        for (let fx = 0; fx < W; fx += 40) {
            for (let fy = floorY; fy < H; fy += 40) {
                ctx.strokeRect(fx, fy, 40, 40);
            }
        }

        // === Cooking stations on counter ===
        const cy = kitchenY - 5; // items sit on counter

        // Stove / Burners (left area)
        ctx.fillStyle = '#37474F';
        ctx.fillRect(W * 0.05, cy - 30, W * 0.25, 30);
        ctx.fillStyle = '#455A64';
        ctx.fillRect(W * 0.05, cy - 33, W * 0.25, 5);
        // Burner rings
        for (let b = 0; b < 2; b++) {
            const bx = W * 0.1 + b * W * 0.12;
            ctx.strokeStyle = '#616161';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(bx, cy - 16, 14, 6, 0, 0, Math.PI * 2);
            ctx.stroke();
            // Flame if cooking
            if (actionActive === 'fry' || actionActive === 'cook' || actionActive === 'melt') {
                ctx.fillStyle = `rgba(255, ${100 + Math.random() * 100}, 0, ${0.6 + Math.random() * 0.3})`;
                for (let f = 0; f < 5; f++) {
                    ctx.beginPath();
                    ctx.arc(bx - 8 + f * 4, cy - 18 - Math.random() * 6, 2 + Math.random() * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Pan on stove
        ctx.fillStyle = '#424242';
        ctx.beginPath();
        ctx.ellipse(W * 0.1, cy - 16, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.ellipse(W * 0.1, cy - 17, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Pan handle
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(W * 0.1 + 16, cy - 19, 18, 4);

        // Pot on stove
        ctx.fillStyle = '#78909C';
        ctx.fillRect(W * 0.2, cy - 28, 22, 16);
        ctx.fillStyle = '#90A4AE';
        ctx.beginPath();
        ctx.ellipse(W * 0.2 + 11, cy - 28, 13, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Pot handles
        ctx.fillStyle = '#546E7A';
        ctx.fillRect(W * 0.2 - 4, cy - 22, 4, 5);
        ctx.fillRect(W * 0.2 + 22, cy - 22, 4, 5);

        // Steam from pot
        if (actionActive === 'boil' || actionActive === 'cook' || actionActive === 'pour') {
            steamTime += 0.05;
            ctx.fillStyle = 'rgba(200,200,200,0.4)';
            for (let s = 0; s < 4; s++) {
                const sx = W * 0.2 + 8 + s * 5;
                const sy = cy - 34 - Math.sin(steamTime + s) * 8 - s * 4;
                ctx.beginPath();
                ctx.arc(sx, sy, 3 + Math.sin(steamTime + s * 0.5) * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Cutting board (center)
        ctx.fillStyle = '#A1887F';
        ctx.fillRect(W * 0.38, cy - 20, 50, 18);
        ctx.fillStyle = '#BCAAA4';
        ctx.fillRect(W * 0.38, cy - 22, 50, 3);
        // Knife next to board
        ctx.fillStyle = '#BDBDBD';
        ctx.fillRect(W * 0.38 + 54, cy - 14, 16, 2);
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(W * 0.38 + 54, cy - 18, 6, 6);

        // Mixing bowl (center-right)
        ctx.fillStyle = '#E0E0E0';
        ctx.beginPath();
        ctx.ellipse(W * 0.68, cy - 10, 18, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#EEEEEE';
        ctx.beginPath();
        ctx.ellipse(W * 0.68, cy - 12, 15, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Oven (right)
        ctx.fillStyle = '#455A64';
        ctx.fillRect(W * 0.82, cy - 35, W * 0.16, 35);
        ctx.fillStyle = '#37474F';
        ctx.fillRect(W * 0.83, cy - 30, W * 0.14, 20);
        // Oven window
        ctx.fillStyle = ovenGlow > 0 ? `rgba(255, ${150 + ovenGlow * 50}, 50, ${0.5 + ovenGlow * 0.3})` : '#263238';
        ctx.fillRect(W * 0.85, cy - 27, W * 0.1, 14);
        // Oven handle
        ctx.fillStyle = '#BDBDBD';
        ctx.fillRect(W * 0.85, cy - 8, W * 0.1, 3);
        // Oven knobs
        for (let k = 0; k < 3; k++) {
            ctx.fillStyle = '#CFD8DC';
            ctx.beginPath();
            ctx.arc(W * 0.85 + k * 15 + 8, cy - 33, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Plate area
        ctx.fillStyle = '#FAFAFA';
        ctx.beginPath();
        ctx.ellipse(W * 0.52, cy - 8, 16, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(W * 0.52, cy - 8, 14, 7, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawCurrentIngredient() {
        if (currentStep >= recipe.steps.length) return;
        const step = recipe.steps[currentStep];
        const cy = kitchenY - 5;

        // Highlight active area
        let highlightX = 0, highlightW = 0;
        switch (step.tool) {
            case 'pan': highlightX = W * 0.03; highlightW = W * 0.16; break;
            case 'pot': highlightX = W * 0.17; highlightW = W * 0.16; break;
            case 'knife': case 'board': highlightX = W * 0.36; highlightW = W * 0.2; break;
            case 'bowl': highlightX = W * 0.58; highlightW = W * 0.2; break;
            case 'oven': highlightX = W * 0.8; highlightW = W * 0.18; break;
            case 'plate': highlightX = W * 0.42; highlightW = W * 0.2; break;
        }

        // Glow around active station
        ctx.fillStyle = 'rgba(102, 126, 234, 0.15)';
        ctx.fillRect(highlightX, cy - 40, highlightW, 45);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(highlightX, cy - 40, highlightW, 45);
        ctx.setLineDash([]);

        // Arrow pointing to station
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 10px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▼ AQUI', highlightX + highlightW / 2, cy - 44);

        // Show ingredient floating
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        const floatY = cy - 55 + Math.sin(Date.now() * 0.004) * 4;
        ctx.fillText(step.ingredient, highlightX + highlightW / 2, floatY);

        // Show completed items on plate
        if (currentStep > 0) {
            ctx.font = '14px serif';
            for (let i = 0; i < currentStep && i < 6; i++) {
                const px = W * 0.48 + (i % 3) * 10 - 10;
                const py = cy - 12 + Math.floor(i / 3) * 8;
                ctx.fillText(recipe.steps[i].result.charAt(0), px, py);
            }
        }
    }

    function drawParticles() {
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.02; p.vy -= 0.1;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.font = `${p.size}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText(p.text, p.x, p.y);
            ctx.globalAlpha = 1;
        });
    }

    function spawnParticles(x, y, text, color, count) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: -(1 + Math.random() * 3),
                life: 1,
                text: text,
                color: color,
                size: 10 + Math.random() * 8
            });
        }
    }

    function render() {
        ctx.clearRect(0, 0, W, H);
        drawKitchen();
        drawCurrentIngredient();
        drawParticles();

        // Oven glow animation
        if (actionActive === 'bake') {
            ovenGlow = Math.min(1, ovenGlow + 0.02);
        } else {
            ovenGlow = Math.max(0, ovenGlow - 0.02);
        }

        animFrame = requestAnimationFrame(render);
    }

    // --- UI Overlay ---
    function updateUI() {
        if (currentStep >= recipe.steps.length) {
            addScore(30);
            const stars = score >= 100 ? 5 : score >= 70 ? 4 : score >= 40 ? 3 : 2;
            let starsHtml = '';
            for (let i = 0; i < 5; i++) starsHtml += `<span class="star ${i < stars ? 'filled' : 'empty'}">★</span>`;
            cancelAnimationFrame(animFrame);
            showResult('Plato completado!', `<div class="stars">${starsHtml}</div>`,
                `Has preparado ${recipe.name} correctamente.`, () => startCocina(subtype));
            return;
        }

        const step = recipe.steps[currentStep];
        const remaining = recipe.steps.filter((_, i) => i >= currentStep);
        const options = shuffleArray(remaining.map(s => s.text)).slice(0, Math.min(4, remaining.length));

        // Step progress bar at top
        ui.innerHTML = `
            <div style="padding: 8px 12px; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.3rem;">${recipe.emoji}</span>
                    <span style="font-weight: 700; font-size: 0.85rem;">${recipe.name}</span>
                    <span style="margin-left: auto; font-size: 0.7rem; color: #aaa;">Paso ${currentStep + 1}/${recipe.steps.length}</span>
                </div>
                <div style="display: flex; gap: 3px;">
                    ${recipe.steps.map((_, i) => `<div style="flex:1; height: 4px; border-radius: 2px; background: ${i < currentStep ? '#43e97b' : i === currentStep ? '#667eea' : 'rgba(255,255,255,0.15)'};"></div>`).join('')}
                </div>
            </div>
        `;
        ui.style.pointerEvents = 'none';

        controls.innerHTML = `
            <div style="width: 100%; display: flex; flex-direction: column; gap: 6px; padding: 4px;">
                <div style="font-size: 0.75rem; color: #667eea; text-align: center; font-weight: 600;">¿Que haces ahora?</div>
                <div id="cook-options" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>
        `;

        const optionsEl = document.getElementById('cook-options');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'control-btn';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.style.fontSize = '0.8rem';
            btn.style.padding = '10px 14px';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === step.text) {
                    addScore(15);
                    btn.style.background = 'linear-gradient(135deg, #43e97b88, #38f9d788)';

                    // Trigger action animation
                    actionActive = step.action;
                    const cy = kitchenY - 20;
                    spawnParticles(W / 2, cy, step.result, '#fff', 5);
                    if (step.action === 'bake') ovenGlow = 0.5;

                    optionsEl.querySelectorAll('button').forEach(b => b.disabled = true);

                    setTimeout(() => {
                        actionActive = '';
                        currentStep++;
                        updateUI();
                    }, 800);
                } else {
                    btn.style.background = 'linear-gradient(135deg, #ff512f88, #f0932288)';
                    addScore(-5);
                    setTimeout(() => { btn.style.background = ''; }, 500);
                }
            };
            optionsEl.appendChild(btn);
        });
    }

    render();
    updateUI();

    currentGame = {
        cleanup: () => {
            cancelAnimationFrame(animFrame);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}
