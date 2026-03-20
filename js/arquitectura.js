// ==========================================
// ARQUITECTURA - Mini-juegos
// ==========================================

// --- 3D Isometric building definitions for Urbanismo ---
const ISO_BUILDINGS = [
    { name: 'Casa', w: 1, h: 1, floors: 2, roofType: 'gable', baseColor: '#e8c170', roofColor: '#c0392b', windows: true, icon: '🏠' },
    { name: 'Oficina', w: 1, h: 1, floors: 5, roofType: 'flat', baseColor: '#5dade2', roofColor: '#2e86c1', windows: true, icon: '🏢' },
    { name: 'Escuela', w: 1, h: 1, floors: 3, roofType: 'flat', baseColor: '#f5b041', roofColor: '#d4a03c', windows: true, icon: '🏫' },
    { name: 'Hospital', w: 1, h: 1, floors: 4, roofType: 'flat', baseColor: '#ecf0f1', roofColor: '#bdc3c7', windows: true, cross: true, icon: '🏥' },
    { name: 'Super', w: 1, h: 1, floors: 1, roofType: 'flat', baseColor: '#27ae60', roofColor: '#1e8449', windows: false, icon: '🛒' },
    { name: 'Parque', w: 1, h: 1, floors: 0, roofType: 'tree', baseColor: '#27ae60', roofColor: '#1e8449', windows: false, icon: '🌳' },
    { name: 'Iglesia', w: 1, h: 1, floors: 3, roofType: 'spire', baseColor: '#f0e6d3', roofColor: '#8e6f4e', windows: true, icon: '⛪' },
    { name: 'Estadio', w: 1, h: 1, floors: 2, roofType: 'dome', baseColor: '#aeb6bf', roofColor: '#707b7c', windows: false, icon: '🏟️' },
    { name: 'Parking', w: 1, h: 1, floors: 1, roofType: 'flat', baseColor: '#566573', roofColor: '#2c3e50', windows: false, icon: '🅿️' },
    { name: 'Parada', w: 1, h: 1, floors: 0, roofType: 'busstop', baseColor: '#3498db', roofColor: '#2980b9', windows: false, icon: '🚏' },
    { name: 'Tienda', w: 1, h: 1, floors: 1, roofType: 'awning', baseColor: '#e74c3c', roofColor: '#c0392b', windows: true, icon: '🏪' },
    { name: 'Biblioteca', w: 1, h: 1, floors: 3, roofType: 'gable', baseColor: '#d5a97a', roofColor: '#6d4c2e', windows: true, icon: '📚' }
];

// Other subtypes keep emoji style
const ARQ_BUILDINGS = {
    interiores: [
        { icon: '🛋️', name: 'Sofa' }, { icon: '🪑', name: 'Silla' }, { icon: '🛏️', name: 'Cama' },
        { icon: '🖥️', name: 'Escritorio' }, { icon: '📺', name: 'TV' }, { icon: '🪴', name: 'Planta' },
        { icon: '🖼️', name: 'Cuadro' }, { icon: '💡', name: 'Lampara' }, { icon: '🪞', name: 'Espejo' },
        { icon: '📖', name: 'Estante' }
    ],
    paisajismo: [
        { icon: '🌳', name: 'Arbol' }, { icon: '🌷', name: 'Flores' }, { icon: '⛲', name: 'Fuente' },
        { icon: '🪨', name: 'Rocas' }, { icon: '🌿', name: 'Setos' }, { icon: '🪵', name: 'Banco' },
        { icon: '💧', name: 'Estanque' }, { icon: '🏮', name: 'Farol' }, { icon: '🌻', name: 'Girasol' },
        { icon: '🍄', name: 'Setas' }
    ],
    sostenible: [
        { icon: '☀️', name: 'Solar' }, { icon: '💨', name: 'Eolica' }, { icon: '🌱', name: 'Jardin V.' },
        { icon: '💧', name: 'Reciclaje Agua' }, { icon: '🔋', name: 'Bateria' }, { icon: '🏗️', name: 'Bambu' },
        { icon: '🪟', name: 'Vidrio Eco' }, { icon: '♻️', name: 'Reciclaje' }, { icon: '🌡️', name: 'Aislante' },
        { icon: '🚲', name: 'Bici Park' }
    ]
};

const ARQ_GOALS = {
    urbanismo: 'Disena una ciudad completa. Necesitas: casas, una escuela, un hospital, un parque y un supermercado minimo.',
    interiores: 'Decora el salon perfecto. Coloca muebles en la habitacion.',
    paisajismo: 'Disena un jardin bonito. Usa arboles, flores, fuentes y bancos.',
    sostenible: 'Crea un edificio 100% ecologico con energia renovable y materiales reciclados.'
};

function startArquitectura(subtype) {
    if (subtype === 'urbanismo') {
        startUrbanismo3D();
        return;
    }
    // --- Emoji grid mode for other subtypes ---
    const buildings = ARQ_BUILDINGS[subtype];
    const goal = ARQ_GOALS[subtype] || '';
    const GRID_SIZE = 6;
    const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    let selectedTool = null;
    let placedCount = 0;

    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');

    ui.innerHTML = `
        <div style="padding: 10px 14px; font-size: 0.75rem; color: #aaa; text-align: center;">${goal}</div>
        <div class="game-grid" id="arq-grid" style="grid-template-columns: repeat(${GRID_SIZE}, 1fr);"></div>
    `;
    ui.style.pointerEvents = 'auto';

    const gridEl = document.getElementById('arq-grid');
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.onclick = () => placeItem(r, c, cell);
            gridEl.appendChild(cell);
        }
    }

    controls.innerHTML = '<div class="toolbar" id="arq-toolbar"></div>';
    const toolbar = document.getElementById('arq-toolbar');
    buildings.forEach(b => {
        const item = document.createElement('div');
        item.className = 'tool-item';
        item.innerHTML = `<span class="tool-icon">${b.icon}</span><span class="tool-label">${b.name}</span>`;
        item.onclick = () => {
            document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('selected'));
            item.classList.add('selected');
            selectedTool = b;
        };
        toolbar.appendChild(item);
    });

    const eraser = document.createElement('div');
    eraser.className = 'tool-item';
    eraser.innerHTML = `<span class="tool-icon">🗑️</span><span class="tool-label">Borrar</span>`;
    eraser.onclick = () => {
        document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('selected'));
        eraser.classList.add('selected');
        selectedTool = { icon: '', name: 'eraser' };
    };
    toolbar.appendChild(eraser);

    const finishBtn = document.createElement('div');
    finishBtn.className = 'tool-item';
    finishBtn.style.background = 'linear-gradient(135deg, #43e97b44, #38f9d744)';
    finishBtn.style.borderColor = '#43e97b';
    finishBtn.innerHTML = `<span class="tool-icon">✅</span><span class="tool-label">Terminar</span>`;
    finishBtn.onclick = () => finishDesignEmoji();
    toolbar.appendChild(finishBtn);

    function placeItem(r, c, cell) {
        if (!selectedTool) return;
        if (selectedTool.name === 'eraser') {
            if (grid[r][c]) { grid[r][c] = null; cell.textContent = ''; cell.classList.remove('occupied'); placedCount--; addScore(-5); }
            return;
        }
        if (grid[r][c]) return;
        grid[r][c] = selectedTool;
        cell.textContent = selectedTool.icon;
        cell.classList.add('occupied');
        placedCount++;
        addScore(10);
    }

    function finishDesignEmoji() {
        const uniqueTypes = new Set();
        for (let r = 0; r < GRID_SIZE; r++)
            for (let c = 0; c < GRID_SIZE; c++)
                if (grid[r][c]) uniqueTypes.add(grid[r][c].name);
        addScore(uniqueTypes.size * 15);
        let stars = placedCount >= 12 ? 5 : placedCount >= 8 ? 4 : placedCount >= 5 ? 3 : placedCount >= 3 ? 2 : 1;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) starsHtml += `<span class="star ${i < stars ? 'filled' : 'empty'}">★</span>`;
        showResult('Diseno completado', `<div class="stars">${starsHtml}</div>`,
            `Has colocado ${placedCount} elementos con ${uniqueTypes.size} tipos diferentes.`,
            () => startArquitectura(subtype));
    }

    currentGame = { cleanup: () => { ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

// =========================================================
// URBANISMO 3D ISOMETRICO
// =========================================================

function startUrbanismo3D() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('game-container');
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');

    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    canvas.style.display = 'block';
    ctx.scale(2, 2); // Retina
    const W = container.clientWidth;
    const H = container.clientHeight;

    const GRID = 8;
    const TILE_W = 56;
    const TILE_H = 28;
    const grid = Array(GRID).fill(null).map(() => Array(GRID).fill(null));
    let selectedTool = null;
    let hoverR = -1, hoverC = -1;
    let placedCount = 0;
    let animFrame;

    // Origin point (center-top of the iso grid)
    const originX = W / 2;
    const originY = 60;

    function toIso(r, c) {
        const x = originX + (c - r) * (TILE_W / 2);
        const y = originY + (c + r) * (TILE_H / 2);
        return { x, y };
    }

    function fromScreen(mx, my) {
        // Inverse isometric
        const dx = mx - originX;
        const dy = my - originY;
        const c = (dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2;
        const r = (dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2;
        const ri = Math.floor(r);
        const ci = Math.floor(c);
        if (ri >= 0 && ri < GRID && ci >= 0 && ci < GRID) return { r: ri, c: ci };
        return null;
    }

    // --- Drawing functions ---

    function drawGround() {
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
        skyGrad.addColorStop(0, '#87CEEB');
        skyGrad.addColorStop(0.3, '#B0E0E6');
        skyGrad.addColorStop(0.6, '#90EE90');
        skyGrad.addColorStop(1, '#228B22');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H);

        // Draw sun
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(W - 60, 35, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF8DC';
        ctx.beginPath();
        ctx.arc(W - 60, 35, 16, 0, Math.PI * 2);
        ctx.fill();

        // Clouds
        drawCloud(50, 25, 0.7);
        drawCloud(W * 0.4, 15, 0.5);
        drawCloud(W * 0.7, 35, 0.6);

        // Distant hills
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.moveTo(0, originY - 5);
        for (let x = 0; x <= W; x += 30) {
            ctx.lineTo(x, originY - 5 + Math.sin(x * 0.02) * 8 - 10);
        }
        ctx.lineTo(W, originY + 50);
        ctx.lineTo(0, originY + 50);
        ctx.fill();
    }

    function drawCloud(cx, cy, scale) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(cx, cy, 15 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 18 * scale, cy - 5 * scale, 12 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 32 * scale, cy, 14 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 14 * scale, cy + 4 * scale, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawTile(r, c, color, borderColor, isHover) {
        const { x, y } = toIso(r, c);
        const hw = TILE_W / 2;
        const hh = TILE_H / 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + hw, y + hh);
        ctx.lineTo(x, y + TILE_H);
        ctx.lineTo(x - hw, y + hh);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = isHover ? 2 : 0.5;
        ctx.stroke();
    }

    function drawGrassTile(r, c, isHover) {
        const baseGreen = isHover ? '#66BB6A' : '#4CAF50';
        const darkGreen = isHover ? '#558B2F' : '#388E3C';
        drawTile(r, c, baseGreen, darkGreen, isHover);

        // Grass detail
        if (!isHover && Math.random() > 0.6) {
            const { x, y } = toIso(r, c);
            ctx.fillStyle = '#66BB6A';
            ctx.fillRect(x - 3 + Math.random() * 6, y + TILE_H / 2 - 3, 1.5, 3);
        }
    }

    function drawRoad(r, c) {
        drawTile(r, c, '#757575', '#616161', false);
        // Road markings
        const { x, y } = toIso(r, c);
        ctx.fillStyle = '#FFD54F';
        ctx.fillRect(x - 2, y + TILE_H / 2 - 1, 4, 2);
    }

    function darkenColor(hex, amount) {
        let num = parseInt(hex.replace('#', ''), 16);
        let rr = Math.max(0, (num >> 16) - amount);
        let gg = Math.max(0, ((num >> 8) & 0xFF) - amount);
        let bb = Math.max(0, (num & 0xFF) - amount);
        return `rgb(${rr},${gg},${bb})`;
    }

    function lightenColor(hex, amount) {
        let num = parseInt(hex.replace('#', ''), 16);
        let rr = Math.min(255, (num >> 16) + amount);
        let gg = Math.min(255, ((num >> 8) & 0xFF) + amount);
        let bb = Math.min(255, (num & 0xFF) + amount);
        return `rgb(${rr},${gg},${bb})`;
    }

    function drawBuilding3D(r, c, building) {
        const { x, y } = toIso(r, c);
        const hw = TILE_W / 2;
        const hh = TILE_H / 2;
        const floorH = 14;
        const totalH = building.floors * floorH;
        const base = building.baseColor;
        const roof = building.roofColor;

        if (building.roofType === 'tree') {
            // Park: draw trees and grass
            drawTile(r, c, '#66BB6A', '#388E3C', false);
            // Tree trunk
            ctx.fillStyle = '#795548';
            ctx.fillRect(x - 2, y - 25, 4, 20);
            // Tree canopy
            ctx.fillStyle = '#2E7D32';
            ctx.beginPath();
            ctx.arc(x, y - 32, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#388E3C';
            ctx.beginPath();
            ctx.arc(x - 6, y - 28, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#43A047';
            ctx.beginPath();
            ctx.arc(x + 5, y - 27, 9, 0, Math.PI * 2);
            ctx.fill();
            // Small flowers
            ctx.fillStyle = '#FF7043';
            ctx.beginPath(); ctx.arc(x - 10, y + 2, 2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFD54F';
            ctx.beginPath(); ctx.arc(x + 8, y + 4, 2, 0, Math.PI * 2); ctx.fill();
            return;
        }

        if (building.roofType === 'busstop') {
            // Bus stop: small shelter
            drawTile(r, c, '#90A4AE', '#607D8B', false);
            // Pole
            ctx.fillStyle = '#37474F';
            ctx.fillRect(x - 1, y - 18, 2, 18);
            // Sign
            ctx.fillStyle = '#1976D2';
            ctx.beginPath();
            ctx.arc(x, y - 22, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 7px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('B', x, y - 20);
            // Shelter roof
            ctx.fillStyle = '#455A64';
            ctx.fillRect(x - 12, y - 14, 24, 3);
            return;
        }

        // === Standard building ===

        // Front face (left side)
        ctx.beginPath();
        ctx.moveTo(x - hw, y + hh);
        ctx.lineTo(x, y + TILE_H);
        ctx.lineTo(x, y + TILE_H - totalH);
        ctx.lineTo(x - hw, y + hh - totalH);
        ctx.closePath();
        ctx.fillStyle = darkenColor(base, 25);
        ctx.fill();
        ctx.strokeStyle = darkenColor(base, 50);
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Right face
        ctx.beginPath();
        ctx.moveTo(x, y + TILE_H);
        ctx.lineTo(x + hw, y + hh);
        ctx.lineTo(x + hw, y + hh - totalH);
        ctx.lineTo(x, y + TILE_H - totalH);
        ctx.closePath();
        ctx.fillStyle = darkenColor(base, 45);
        ctx.fill();
        ctx.strokeStyle = darkenColor(base, 70);
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Top face
        ctx.beginPath();
        ctx.moveTo(x, y + TILE_H - totalH);
        ctx.lineTo(x + hw, y + hh - totalH);
        ctx.lineTo(x, y - totalH);
        ctx.lineTo(x - hw, y + hh - totalH);
        ctx.closePath();
        ctx.fillStyle = lightenColor(base, 20);
        ctx.fill();

        // Windows
        if (building.windows && building.floors >= 2) {
            for (let f = 0; f < building.floors; f++) {
                const fy = y + TILE_H - totalH + f * floorH + 3;
                // Left face windows
                ctx.fillStyle = f % 2 === 0 ? '#BBDEFB' : '#90CAF9';
                for (let w = 0; w < 2; w++) {
                    const wx = x - hw + 6 + w * 12;
                    const wy = fy + (w * 2);
                    ctx.fillRect(wx, wy, 5, 5);
                    ctx.strokeStyle = '#64B5F6';
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(wx, wy, 5, 5);
                }
                // Right face windows
                for (let w = 0; w < 2; w++) {
                    const wx = x + 5 + w * 12;
                    const wy = fy + 4 - (w * 2);
                    ctx.fillRect(wx, wy, 5, 5);
                    ctx.strokeStyle = '#64B5F6';
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(wx, wy, 5, 5);
                }
            }
        }

        // Door on front face
        if (building.floors >= 1) {
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(x - 5, y + TILE_H - 10, 5, 8);
        }

        // Red cross for hospital
        if (building.cross) {
            ctx.fillStyle = '#E53935';
            ctx.fillRect(x - 2, y + TILE_H - totalH + 4, 4, 12);
            ctx.fillRect(x - 6, y + TILE_H - totalH + 8, 12, 4);
        }

        // Roof types
        if (building.roofType === 'gable') {
            // Pointed roof
            const roofBase = y - totalH;
            const roofPeak = roofBase - 14;
            // Front
            ctx.beginPath();
            ctx.moveTo(x - hw - 2, roofBase + hh);
            ctx.lineTo(x, roofPeak);
            ctx.lineTo(x, roofBase + TILE_H);
            ctx.closePath();
            ctx.fillStyle = roof;
            ctx.fill();
            ctx.strokeStyle = darkenColor(roof, 30);
            ctx.lineWidth = 0.5;
            ctx.stroke();
            // Back
            ctx.beginPath();
            ctx.moveTo(x, roofBase + TILE_H);
            ctx.lineTo(x, roofPeak);
            ctx.lineTo(x + hw + 2, roofBase + hh);
            ctx.closePath();
            ctx.fillStyle = darkenColor(roof, 20);
            ctx.fill();
            ctx.stroke();
        } else if (building.roofType === 'spire') {
            // Church spire
            const roofBase = y - totalH;
            ctx.fillStyle = roof;
            ctx.beginPath();
            ctx.moveTo(x, roofBase - 22);
            ctx.lineTo(x - 6, roofBase + hh);
            ctx.lineTo(x + 6, roofBase + hh);
            ctx.closePath();
            ctx.fill();
            // Cross on top
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x - 1, roofBase - 28, 2, 8);
            ctx.fillRect(x - 3, roofBase - 26, 6, 2);
        } else if (building.roofType === 'dome') {
            // Stadium dome
            const roofBase = y - totalH;
            ctx.fillStyle = roof;
            ctx.beginPath();
            ctx.ellipse(x, roofBase + hh, hw, 16, 0, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = lightenColor(roof, 30);
            ctx.beginPath();
            ctx.ellipse(x, roofBase + hh, hw - 4, 12, 0, Math.PI, 0);
            ctx.fill();
        } else if (building.roofType === 'awning') {
            // Shop awning
            const roofBase = y - totalH;
            ctx.fillStyle = '#E53935';
            ctx.fillRect(x - hw - 3, roofBase + hh - 2, hw + 3, 4);
            ctx.fillStyle = '#fff';
            for (let s = 0; s < 4; s++) {
                ctx.fillRect(x - hw - 3 + s * 8, roofBase + hh - 2, 4, 4);
            }
            ctx.fillStyle = darkenColor(roof, 10);
            ctx.fillRect(x + 1, roofBase + hh - 2, hw + 1, 4);
        }

        // Label shadow text
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = 'bold 7px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(building.name, x, y + TILE_H + 8);
    }

    function render() {
        ctx.clearRect(0, 0, W, H);

        // Draw background
        drawGround();

        // Draw tiles and buildings (back to front for correct overlap)
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const isHover = (r === hoverR && c === hoverC && selectedTool);

                if (grid[r][c]) {
                    // Road under buildings
                    drawTile(r, c, '#A5D6A7', '#388E3C', false);
                    drawBuilding3D(r, c, grid[r][c]);
                } else {
                    drawGrassTile(r, c, isHover);
                    // Show ghost preview
                    if (isHover && selectedTool && selectedTool.name !== 'eraser') {
                        ctx.globalAlpha = 0.4;
                        drawBuilding3D(r, c, selectedTool);
                        ctx.globalAlpha = 1;
                    }
                    if (isHover && selectedTool && selectedTool.name === 'eraser') {
                        const { x: ex, y: ey } = toIso(r, c);
                        ctx.fillStyle = 'rgba(255,0,0,0.3)';
                        ctx.font = '18px serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('🗑️', ex, ey + TILE_H / 2 + 5);
                    }
                }
            }
        }

        animFrame = requestAnimationFrame(render);
    }

    // --- Input ---
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width;
        const scaleY = H / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    canvas.addEventListener('mousemove', (e) => {
        const pos = getMousePos(e);
        const cell = fromScreen(pos.x, pos.y);
        if (cell) { hoverR = cell.r; hoverC = cell.c; }
        else { hoverR = -1; hoverC = -1; }
    });

    canvas.addEventListener('click', (e) => {
        const pos = getMousePos(e);
        const cell = fromScreen(pos.x, pos.y);
        if (!cell || !selectedTool) return;
        const { r, c } = cell;

        if (selectedTool.name === 'eraser') {
            if (grid[r][c]) {
                grid[r][c] = null;
                placedCount--;
                addScore(-5);
            }
            return;
        }
        if (grid[r][c]) return;
        grid[r][c] = selectedTool;
        placedCount++;
        addScore(10);
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const pos = getMousePos(e);
        const cell = fromScreen(pos.x, pos.y);
        if (!cell || !selectedTool) return;
        const { r, c } = cell;

        if (selectedTool.name === 'eraser') {
            if (grid[r][c]) { grid[r][c] = null; placedCount--; addScore(-5); }
            return;
        }
        if (grid[r][c]) return;
        grid[r][c] = selectedTool;
        placedCount++;
        addScore(10);
    });

    // --- Toolbar ---
    controls.innerHTML = '<div class="toolbar" id="arq-toolbar"></div>';
    const toolbar = document.getElementById('arq-toolbar');

    ISO_BUILDINGS.forEach(b => {
        const item = document.createElement('div');
        item.className = 'tool-item';
        item.innerHTML = `<span class="tool-icon">${b.icon}</span><span class="tool-label">${b.name}</span>`;
        item.onclick = () => {
            document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('selected'));
            item.classList.add('selected');
            selectedTool = b;
        };
        toolbar.appendChild(item);
    });

    const eraser = document.createElement('div');
    eraser.className = 'tool-item';
    eraser.innerHTML = `<span class="tool-icon">🗑️</span><span class="tool-label">Borrar</span>`;
    eraser.onclick = () => {
        document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('selected'));
        eraser.classList.add('selected');
        selectedTool = { name: 'eraser' };
    };
    toolbar.appendChild(eraser);

    const finishBtn = document.createElement('div');
    finishBtn.className = 'tool-item';
    finishBtn.style.background = 'linear-gradient(135deg, #43e97b44, #38f9d744)';
    finishBtn.style.borderColor = '#43e97b';
    finishBtn.innerHTML = `<span class="tool-icon">✅</span><span class="tool-label">Terminar</span>`;
    finishBtn.onclick = () => {
        const uniqueTypes = new Set();
        for (let r = 0; r < GRID; r++)
            for (let c = 0; c < GRID; c++)
                if (grid[r][c]) uniqueTypes.add(grid[r][c].name);
        addScore(uniqueTypes.size * 15);
        let stars = placedCount >= 15 ? 5 : placedCount >= 10 ? 4 : placedCount >= 6 ? 3 : placedCount >= 3 ? 2 : 1;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) starsHtml += `<span class="star ${i < stars ? 'filled' : 'empty'}">★</span>`;
        cancelAnimationFrame(animFrame);
        showResult('Ciudad completada!', `<div class="stars">${starsHtml}</div>`,
            `Has construido ${placedCount} edificios con ${uniqueTypes.size} tipos diferentes.`,
            () => startUrbanismo3D());
    };
    toolbar.appendChild(finishBtn);

    // Goal banner
    ui.innerHTML = `<div style="padding: 8px 14px; font-size: 0.7rem; color: rgba(255,255,255,0.8); text-align: center; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px);">
        ${ARQ_GOALS.urbanismo}
    </div>`;
    ui.style.pointerEvents = 'none';

    render();

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
