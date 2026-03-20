// ==========================================
// ARQUITECTURA - Todos los modos en 3D Isometrico
// ==========================================

// ============ DEFINICIONES 3D POR MODO ============

const ISO_ITEMS = {
    urbanismo: [
        { name: 'Casa', floors: 2, roofType: 'gable', baseColor: '#e8c170', roofColor: '#c0392b', windows: true, icon: '🏠' },
        { name: 'Oficina', floors: 5, roofType: 'flat', baseColor: '#5dade2', roofColor: '#2e86c1', windows: true, icon: '🏢' },
        { name: 'Escuela', floors: 3, roofType: 'flat', baseColor: '#f5b041', roofColor: '#d4a03c', windows: true, icon: '🏫' },
        { name: 'Hospital', floors: 4, roofType: 'flat', baseColor: '#ecf0f1', roofColor: '#bdc3c7', windows: true, cross: true, icon: '🏥' },
        { name: 'Super', floors: 1, roofType: 'awning', baseColor: '#27ae60', roofColor: '#1e8449', windows: false, icon: '🛒' },
        { name: 'Parque', floors: 0, roofType: 'tree', baseColor: '#27ae60', roofColor: '#1e8449', icon: '🌳' },
        { name: 'Iglesia', floors: 3, roofType: 'spire', baseColor: '#f0e6d3', roofColor: '#8e6f4e', windows: true, icon: '⛪' },
        { name: 'Estadio', floors: 2, roofType: 'dome', baseColor: '#aeb6bf', roofColor: '#707b7c', icon: '🏟️' },
        { name: 'Parking', floors: 1, roofType: 'flat', baseColor: '#566573', roofColor: '#2c3e50', icon: '🅿️' },
        { name: 'Parada', floors: 0, roofType: 'busstop', baseColor: '#3498db', roofColor: '#2980b9', icon: '🚏' },
        { name: 'Tienda', floors: 1, roofType: 'awning', baseColor: '#e74c3c', roofColor: '#c0392b', windows: true, icon: '🏪' },
        { name: 'Biblioteca', floors: 3, roofType: 'gable', baseColor: '#d5a97a', roofColor: '#6d4c2e', windows: true, icon: '📚' }
    ],
    interiores: [
        // Floor items
        { name: 'Sofa', floors: 0, roofType: 'modern_sofa', baseColor: '#7c8a9e', roofColor: '#5a6578', icon: '🛋️', wall: false },
        { name: 'TV Stand', floors: 0, roofType: 'flat_tv', baseColor: '#2c3e50', roofColor: '#1a252f', icon: '📺', wall: false },
        { name: 'Mesa', floors: 0, roofType: 'coffee_table', baseColor: '#d4a574', roofColor: '#b8895c', icon: '☕', wall: false },
        { name: 'Lampara', floors: 0, roofType: 'floor_lamp', baseColor: '#f5c542', roofColor: '#d4a832', icon: '💡', wall: false },
        { name: 'Comedor', floors: 0, roofType: 'dining_table', baseColor: '#ecf0f1', roofColor: '#bdc3c7', icon: '🍽️', wall: false },
        { name: 'Cama', floors: 0, roofType: 'modern_bed', baseColor: '#5b7fa5', roofColor: '#3d5a7c', icon: '🛏️', wall: false },
        { name: 'Escritorio', floors: 0, roofType: 'desk_computer', baseColor: '#8e8e8e', roofColor: '#6e6e6e', icon: '🖥️', wall: false },
        { name: 'Libreria', floors: 0, roofType: 'bookshelf', baseColor: '#d4a574', roofColor: '#b8895c', icon: '📚', wall: false },
        { name: 'Planta', floors: 0, roofType: 'modern_plant', baseColor: '#4CAF50', roofColor: '#388E3C', icon: '🪴', wall: false },
        { name: 'Alfombra', floors: 0, roofType: 'modern_rug', baseColor: '#e8c9a0', roofColor: '#c9a87c', icon: '🟫', wall: false },
        // Wall items
        { name: 'Cuadro', floors: 0, roofType: 'wall_painting', baseColor: '#e74c3c', roofColor: '#c0392b', icon: '🖼️', wall: true },
        { name: 'Estante', floors: 0, roofType: 'wall_shelf', baseColor: '#d4a574', roofColor: '#b8895c', icon: '📖', wall: true },
        { name: 'Reloj', floors: 0, roofType: 'wall_clock', baseColor: '#ecf0f1', roofColor: '#bdc3c7', icon: '🕐', wall: true },
        { name: 'Espejo', floors: 0, roofType: 'wall_mirror', baseColor: '#d5e8f0', roofColor: '#a8c8d8', icon: '🪞', wall: true },
        { name: 'TV Mural', floors: 0, roofType: 'wall_tv', baseColor: '#1a1a2e', roofColor: '#0d0d1a', icon: '📺', wall: true },
        { name: 'Aplique', floors: 0, roofType: 'wall_sconce', baseColor: '#f5c542', roofColor: '#d4a832', icon: '🔆', wall: true }
    ],
    paisajismo: [
        { name: 'Arbol', floors: 0, roofType: 'bigtree', baseColor: '#2e7d32', roofColor: '#1b5e20', icon: '🌳' },
        { name: 'Flores', floors: 0, roofType: 'flowers', baseColor: '#e91e63', roofColor: '#c2185b', icon: '🌷' },
        { name: 'Fuente', floors: 0, roofType: 'fountain', baseColor: '#90a4ae', roofColor: '#607d8b', icon: '⛲' },
        { name: 'Rocas', floors: 0, roofType: 'rocks', baseColor: '#78909c', roofColor: '#546e7a', icon: '🪨' },
        { name: 'Setos', floors: 0, roofType: 'hedge', baseColor: '#388e3c', roofColor: '#2e7d32', icon: '🌿' },
        { name: 'Banco', floors: 0, roofType: 'bench', baseColor: '#795548', roofColor: '#5d4037', icon: '🪵' },
        { name: 'Estanque', floors: 0, roofType: 'pond', baseColor: '#0288d1', roofColor: '#01579b', icon: '💧' },
        { name: 'Farol', floors: 0, roofType: 'streetlamp', baseColor: '#424242', roofColor: '#212121', icon: '🏮' },
        { name: 'Girasol', floors: 0, roofType: 'sunflower', baseColor: '#fdd835', roofColor: '#f9a825', icon: '🌻' },
        { name: 'Camino', floors: 0, roofType: 'path', baseColor: '#d7ccc8', roofColor: '#bcaaa4', icon: '🟫' }
    ],
    sostenible: [
        { name: 'Solar', floors: 0, roofType: 'solar_array', baseColor: '#1565c0', roofColor: '#0d47a1', icon: '☀️' },
        { name: 'Eolica', floors: 0, roofType: 'wind_turbine', baseColor: '#eceff1', roofColor: '#b0bec5', icon: '💨' },
        { name: 'Techo V.', floors: 0, roofType: 'green_roof', baseColor: '#6d4c41', roofColor: '#4caf50', icon: '🌱' },
        { name: 'Cargador', floors: 0, roofType: 'ev_charger', baseColor: '#43a047', roofColor: '#2e7d32', icon: '🔌' },
        { name: 'Agua', floors: 0, roofType: 'rain_tank', baseColor: '#0097a7', roofColor: '#00838f', icon: '💧' },
        { name: 'Compost', floors: 0, roofType: 'compost', baseColor: '#795548', roofColor: '#5d4037', icon: '🍂' },
        { name: 'Abejas', floors: 0, roofType: 'bee_hotel', baseColor: '#ffb300', roofColor: '#ff8f00', icon: '🐝' },
        { name: 'LED', floors: 0, roofType: 'smart_lamp', baseColor: '#90caf9', roofColor: '#42a5f5', icon: '💡' },
        { name: 'Reciclaje', floors: 0, roofType: 'recycle_station', baseColor: '#4caf50', roofColor: '#388e3c', icon: '♻️' },
        { name: 'Jardin V.', floors: 0, roofType: 'vertical_garden', baseColor: '#66bb6a', roofColor: '#43a047', icon: '🌿' }
    ]
};

const ARQ_GOALS = {
    urbanismo: 'Disena una ciudad completa. Necesitas: casas, una escuela, un hospital, un parque y un supermercado minimo.',
    interiores: 'Decora el salon perfecto. Coloca muebles para crear un hogar acogedor.',
    paisajismo: 'Disena un jardin bonito. Usa arboles, flores, fuentes y bancos.',
    sostenible: 'Crea una comunidad 100% ecologica con energia renovable y espacios verdes.'
};

const ARQ_FINISH_MSG = {
    urbanismo: 'Ciudad completada!',
    interiores: 'Habitacion decorada!',
    paisajismo: 'Jardin completado!',
    sostenible: 'Comunidad ecologica lista!'
};

// ============ LANZADOR ============

function startArquitectura(subtype) {
    startIso3D(subtype);
}

// ============ MOTOR ISOMETRICO GENERICO ============

function startIso3D(subtype) {
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

    const GRID = 8;
    const TILE_W = 56;
    const TILE_H = 28;
    const grid = Array(GRID).fill(null).map(() => Array(GRID).fill(null));
    const items = ISO_ITEMS[subtype] || ISO_ITEMS.urbanismo;
    let selectedTool = null;
    let hoverR = -1, hoverC = -1;
    let placedCount = 0;
    let animFrame;

    // For interiores wall items, we use a separate wall grid
    const WALL_SLOTS = 8; // number of wall placement slots
    const wallGrid = Array(WALL_SLOTS).fill(null);
    let hoverWall = -1;

    const originX = W / 2;
    const originY = subtype === 'interiores' ? 90 : 60;

    // Wall region for interiores (the back wall area)
    const wallTop = 15;
    const wallBottom = originY - 12;
    const wallLeft = 20;
    const wallRight = W - 20;

    function toIso(r, c) {
        return { x: originX + (c - r) * (TILE_W / 2), y: originY + (c + r) * (TILE_H / 2) };
    }

    function fromScreen(mx, my) {
        const dx = mx - originX, dy = my - originY;
        const c = (dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2;
        const r = (dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2;
        const ri = Math.floor(r), ci = Math.floor(c);
        if (ri >= 0 && ri < GRID && ci >= 0 && ci < GRID) return { r: ri, c: ci };
        return null;
    }

    // Wall slot positioning for interiores
    function getWallSlotPos(index) {
        const slotW = (wallRight - wallLeft) / WALL_SLOTS;
        const cx = wallLeft + slotW * index + slotW / 2;
        const cy = (wallTop + wallBottom) / 2;
        return { x: cx, y: cy };
    }

    function fromScreenWall(mx, my) {
        if (my < wallTop || my > wallBottom + 5) return -1;
        if (mx < wallLeft || mx > wallRight) return -1;
        const slotW = (wallRight - wallLeft) / WALL_SLOTS;
        const idx = Math.floor((mx - wallLeft) / slotW);
        if (idx >= 0 && idx < WALL_SLOTS) return idx;
        return -1;
    }

    // ========== COLOR UTILS ==========
    function darken(hex, amt) {
        let n = parseInt(hex.replace('#', ''), 16);
        let r = Math.max(0, (n >> 16) - amt), g = Math.max(0, ((n >> 8) & 0xFF) - amt), b = Math.max(0, (n & 0xFF) - amt);
        return `rgb(${r},${g},${b})`;
    }
    function lighten(hex, amt) {
        let n = parseInt(hex.replace('#', ''), 16);
        let r = Math.min(255, (n >> 16) + amt), g = Math.min(255, ((n >> 8) & 0xFF) + amt), b = Math.min(255, (n & 0xFF) + amt);
        return `rgb(${r},${g},${b})`;
    }

    // ========== TILE DRAWING ==========
    function drawDiamond(x, y, color, border, hover) {
        const hw = TILE_W / 2, hh = TILE_H / 2;
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + hw, y + hh); ctx.lineTo(x, y + TILE_H); ctx.lineTo(x - hw, y + hh);
        ctx.closePath();
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = border; ctx.lineWidth = hover ? 2 : 0.5; ctx.stroke();
    }

    function drawCloud(cx, cy, s) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(cx, cy, 15*s, 0, Math.PI*2);
        ctx.arc(cx+18*s, cy-5*s, 12*s, 0, Math.PI*2);
        ctx.arc(cx+32*s, cy, 14*s, 0, Math.PI*2);
        ctx.arc(cx+14*s, cy+4*s, 10*s, 0, Math.PI*2);
        ctx.fill();
    }

    // ========== BACKGROUNDS ==========
    function drawBgUrbanismo() {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#87CEEB'); g.addColorStop(0.3, '#B0E0E6'); g.addColorStop(0.6, '#90EE90'); g.addColorStop(1, '#228B22');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(W-60, 35, 22, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFF8DC'; ctx.beginPath(); ctx.arc(W-60, 35, 16, 0, Math.PI*2); ctx.fill();
        drawCloud(50, 25, 0.7); drawCloud(W*0.4, 15, 0.5); drawCloud(W*0.7, 35, 0.6);
        ctx.fillStyle = '#4CAF50'; ctx.beginPath(); ctx.moveTo(0, originY-5);
        for (let x = 0; x <= W; x += 30) ctx.lineTo(x, originY-5+Math.sin(x*0.02)*8-10);
        ctx.lineTo(W, originY+50); ctx.lineTo(0, originY+50); ctx.fill();
    }

    function drawBgInteriores() {
        // === IMMERSIVE ROOM VIEW ===
        // Ceiling
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, 0, W, 12);

        // Back wall - main surface
        const wallGrad = ctx.createLinearGradient(0, 0, 0, wallBottom);
        wallGrad.addColorStop(0, '#f0ebe3');
        wallGrad.addColorStop(0.5, '#e8e0d4');
        wallGrad.addColorStop(1, '#ddd5c8');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 8, W, wallBottom - 8);

        // Subtle wall texture - horizontal lines
        ctx.strokeStyle = 'rgba(200, 190, 175, 0.15)';
        ctx.lineWidth = 0.5;
        for (let yy = 15; yy < wallBottom; yy += 12) {
            ctx.beginPath();
            ctx.moveTo(0, yy);
            ctx.lineTo(W, yy);
            ctx.stroke();
        }

        // Subtle vertical panel lines on wall
        ctx.strokeStyle = 'rgba(190, 180, 165, 0.1)';
        ctx.lineWidth = 0.5;
        for (let xx = 0; xx < W; xx += 60) {
            ctx.beginPath();
            ctx.moveTo(xx, 10);
            ctx.lineTo(xx, wallBottom);
            ctx.stroke();
        }

        // Window on back wall with light effect
        const winX = W / 2 - 40;
        const winY = 18;
        const winW = 80;
        const winH = 48;

        // Window light glow behind
        const glowGrad = ctx.createRadialGradient(winX + winW/2, winY + winH/2, 10, winX + winW/2, winY + winH/2, 80);
        glowGrad.addColorStop(0, 'rgba(255, 248, 220, 0.25)');
        glowGrad.addColorStop(1, 'rgba(255, 248, 220, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(winX - 40, winY - 20, winW + 80, winH + 60);

        // Window frame outer
        ctx.fillStyle = '#e0d8cc';
        ctx.fillRect(winX - 4, winY - 4, winW + 8, winH + 8);

        // Window sky
        const skyGrad = ctx.createLinearGradient(0, winY, 0, winY + winH);
        skyGrad.addColorStop(0, '#87CEEB');
        skyGrad.addColorStop(0.6, '#B0E0E6');
        skyGrad.addColorStop(1, '#c8e6c9');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(winX, winY, winW, winH);

        // Window frame dividers
        ctx.fillStyle = '#d8d0c4';
        ctx.fillRect(winX + winW/2 - 1.5, winY, 3, winH); // vertical
        ctx.fillRect(winX, winY + winH/2 - 1.5, winW, 3); // horizontal

        // Light rays from window onto floor
        ctx.fillStyle = 'rgba(255, 248, 220, 0.08)';
        ctx.beginPath();
        ctx.moveTo(winX, winY + winH);
        ctx.lineTo(winX - 30, originY + 60);
        ctx.lineTo(winX + winW + 30, originY + 60);
        ctx.lineTo(winX + winW, winY + winH);
        ctx.closePath();
        ctx.fill();

        // Curtains
        ctx.fillStyle = 'rgba(120, 130, 150, 0.2)';
        // Left curtain
        ctx.beginPath();
        ctx.moveTo(winX - 8, winY - 6);
        ctx.quadraticCurveTo(winX - 14, winY + winH/2, winX - 6, winY + winH + 4);
        ctx.lineTo(winX - 2, winY + winH + 4);
        ctx.quadraticCurveTo(winX - 8, winY + winH/2, winX - 2, winY - 6);
        ctx.closePath();
        ctx.fill();
        // Right curtain
        ctx.beginPath();
        ctx.moveTo(winX + winW + 8, winY - 6);
        ctx.quadraticCurveTo(winX + winW + 14, winY + winH/2, winX + winW + 6, winY + winH + 4);
        ctx.lineTo(winX + winW + 2, winY + winH + 4);
        ctx.quadraticCurveTo(winX + winW + 8, winY + winH/2, winX + winW + 2, winY - 6);
        ctx.closePath();
        ctx.fill();

        // Curtain rod
        ctx.fillStyle = '#b0a898';
        ctx.fillRect(winX - 16, winY - 8, winW + 32, 2.5);
        // Rod ends
        ctx.beginPath(); ctx.arc(winX - 16, winY - 7, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(winX + winW + 16, winY - 7, 2.5, 0, Math.PI * 2); ctx.fill();

        // Baseboard (where wall meets floor)
        ctx.fillStyle = '#c8bfb0';
        ctx.fillRect(0, wallBottom - 2, W, 8);
        // Baseboard shadow
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, wallBottom + 6, W, 2);

        // Floor - modern light wood / grey tiles
        const floorG = ctx.createLinearGradient(0, wallBottom + 6, 0, H);
        floorG.addColorStop(0, '#d4c4a8');
        floorG.addColorStop(0.3, '#c9b898');
        floorG.addColorStop(1, '#b8a585');
        ctx.fillStyle = floorG;
        ctx.fillRect(0, wallBottom + 6, W, H - wallBottom - 6);

        // Floor plank lines (perspective effect)
        ctx.strokeStyle = 'rgba(160, 140, 110, 0.2)';
        ctx.lineWidth = 0.5;
        // Horizontal plank lines
        for (let yy = wallBottom + 16; yy < H; yy += 14) {
            ctx.beginPath();
            ctx.moveTo(0, yy);
            ctx.lineTo(W, yy);
            ctx.stroke();
        }
        // Vertical plank lines with perspective convergence
        const vanishX = W / 2;
        const vanishY = wallBottom - 20;
        ctx.strokeStyle = 'rgba(160, 140, 110, 0.12)';
        for (let xx = 0; xx < W; xx += 30) {
            ctx.beginPath();
            ctx.moveTo(xx, H);
            // Lines converge slightly toward vanishing point
            const targetX = xx + (vanishX - xx) * 0.15;
            ctx.lineTo(targetX, wallBottom + 6);
            ctx.stroke();
        }

        // Wall slot indicators (subtle) for wall items
        ctx.strokeStyle = 'rgba(180, 170, 155, 0.0)'; // invisible unless hovering
        // We draw hover indicators in the render loop instead
    }

    function drawBgPaisajismo() {
        // Garden / park background
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#4FC3F7'); g.addColorStop(0.25, '#81D4FA'); g.addColorStop(0.4, '#A5D6A7'); g.addColorStop(1, '#2E7D32');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // Sun
        ctx.fillStyle = '#FFF176'; ctx.beginPath(); ctx.arc(60, 30, 20, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFEE58'; ctx.beginPath(); ctx.arc(60, 30, 14, 0, Math.PI*2); ctx.fill();
        drawCloud(W*0.5, 20, 0.6); drawCloud(W*0.8, 30, 0.4);
        // Distant trees
        ctx.fillStyle = '#388E3C';
        for (let x = 0; x < W; x += 25) {
            const th = 12 + Math.sin(x*0.1)*5;
            ctx.beginPath(); ctx.arc(x, originY - 8, th, 0, Math.PI*2); ctx.fill();
        }
        // Ground
        ctx.fillStyle = '#43A047';
        ctx.fillRect(0, originY - 5, W, H);
    }

    function drawBgSostenible() {
        // Eco / green futuristic
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#E0F7FA'); g.addColorStop(0.3, '#B2EBF2'); g.addColorStop(0.5, '#C8E6C9'); g.addColorStop(1, '#1B5E20');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // Sun with rays
        ctx.fillStyle = '#FFB300'; ctx.beginPath(); ctx.arc(W-50, 30, 18, 0, Math.PI*2); ctx.fill();
        for (let a = 0; a < Math.PI*2; a += 0.5) {
            ctx.strokeStyle = '#FFD54F'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(W-50+Math.cos(a)*22, 30+Math.sin(a)*22);
            ctx.lineTo(W-50+Math.cos(a)*30, 30+Math.sin(a)*30); ctx.stroke();
        }
        drawCloud(40, 20, 0.5); drawCloud(W*0.4, 12, 0.4);
        // Rolling hills
        ctx.fillStyle = '#4CAF50'; ctx.beginPath(); ctx.moveTo(0, originY);
        for (let x = 0; x <= W; x += 20) ctx.lineTo(x, originY - 3 + Math.sin(x*0.03)*6);
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    }

    const bgDrawers = { urbanismo: drawBgUrbanismo, interiores: drawBgInteriores, paisajismo: drawBgPaisajismo, sostenible: drawBgSostenible };

    // ========== TILE STYLE PER MODE ==========
    function getTileColors(isHover) {
        switch (subtype) {
            case 'interiores': return { base: isHover ? '#d4a76a' : '#c49a6c', border: isHover ? '#a0724a' : '#b8906088' };
            case 'paisajismo': return { base: isHover ? '#66BB6A' : '#4CAF50', border: isHover ? '#2E7D32' : '#388E3C' };
            case 'sostenible': return { base: isHover ? '#81C784' : '#66BB6A', border: isHover ? '#2E7D32' : '#43A047' };
            default: return { base: isHover ? '#66BB6A' : '#4CAF50', border: isHover ? '#558B2F' : '#388E3C' };
        }
    }

    function getOccupiedTileColor() {
        switch (subtype) {
            case 'interiores': return '#c49a6c';
            case 'paisajismo': return '#A5D6A7';
            case 'sostenible': return '#A5D6A7';
            default: return '#A5D6A7';
        }
    }

    // ========== 3D BOX HELPER ==========
    function drawBox(x, y, bw, bh, color) {
        const hw = TILE_W / 2, hh = TILE_H / 2;
        // Left
        ctx.beginPath(); ctx.moveTo(x-hw, y+hh); ctx.lineTo(x, y+TILE_H); ctx.lineTo(x, y+TILE_H-bh); ctx.lineTo(x-hw, y+hh-bh); ctx.closePath();
        ctx.fillStyle = darken(color, 25); ctx.fill(); ctx.strokeStyle = darken(color, 50); ctx.lineWidth = 0.5; ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(x, y+TILE_H); ctx.lineTo(x+hw, y+hh); ctx.lineTo(x+hw, y+hh-bh); ctx.lineTo(x, y+TILE_H-bh); ctx.closePath();
        ctx.fillStyle = darken(color, 45); ctx.fill(); ctx.strokeStyle = darken(color, 70); ctx.lineWidth = 0.5; ctx.stroke();
        // Top
        ctx.beginPath(); ctx.moveTo(x, y+TILE_H-bh); ctx.lineTo(x+hw, y+hh-bh); ctx.lineTo(x, y-bh); ctx.lineTo(x-hw, y+hh-bh); ctx.closePath();
        ctx.fillStyle = lighten(color, 20); ctx.fill();
    }

    // ========== ITEM RENDERERS ==========
    function drawItem3D(r, c, item) {
        const { x, y } = toIso(r, c);
        const hw = TILE_W / 2, hh = TILE_H / 2;
        const floorH = 14;
        const totalH = (item.floors || 0) * floorH;

        // === URBANISMO ITEMS ===
        if (subtype === 'urbanismo') {
            drawUrbanismoItem(x, y, hw, hh, floorH, totalH, item);
        }
        // === INTERIORES ITEMS (floor only) ===
        else if (subtype === 'interiores') {
            drawInterioresItem(x, y, hw, hh, item);
        }
        // === PAISAJISMO ITEMS ===
        else if (subtype === 'paisajismo') {
            drawPaisajismoItem(x, y, hw, hh, item);
        }
        // === SOSTENIBLE ITEMS ===
        else if (subtype === 'sostenible') {
            drawSostenibleItem(x, y, hw, hh, floorH, totalH, item);
        }

        // Label
        ctx.fillStyle = subtype === 'interiores' ? 'rgba(80,50,20,0.85)' : 'rgba(255,255,255,0.85)';
        ctx.font = 'bold 7px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.name, x, y + TILE_H + 8);
    }

    // Draw wall item at a wall slot position
    function drawWallItem(index, item) {
        const { x, y } = getWallSlotPos(index);
        const rt = item.roofType;

        if (rt === 'wall_painting') {
            // Modern art painting with frame
            const pw = 30, ph = 22;
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(x - pw/2 + 2, y - ph/2 + 2, pw, ph);
            // Frame
            ctx.fillStyle = '#3e3e3e';
            ctx.fillRect(x - pw/2 - 2, y - ph/2 - 2, pw + 4, ph + 4);
            // Canvas
            ctx.fillStyle = '#f5f0e8';
            ctx.fillRect(x - pw/2, y - ph/2, pw, ph);
            // Abstract art - colored blocks
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(x - pw/2 + 2, y - ph/2 + 2, pw/2 - 2, ph/2 - 2);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x, y - ph/2 + 2, pw/2 - 2, ph/2 - 2);
            ctx.fillStyle = '#f39c12';
            ctx.fillRect(x - pw/2 + 2, y, pw/2 - 2, ph/2 - 2);
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(x, y, pw/2 - 2, ph/2 - 2);
        } else if (rt === 'wall_shelf') {
            // Floating shelf with items
            const sw = 36, sh = 3;
            // Shelf bracket
            ctx.fillStyle = '#8a7a6a';
            ctx.fillRect(x - 8, y + 2, 2, 6);
            ctx.fillRect(x + 6, y + 2, 2, 6);
            // Shelf
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(x - sw/2, y, sw, sh);
            ctx.fillStyle = darken(item.baseColor, 20);
            ctx.fillRect(x - sw/2, y + sh, sw, 1);
            // Items on shelf: small vase, book, candle
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(x - 12, y - 8, 5, 8); // vase
            ctx.beginPath(); ctx.arc(x - 9.5, y - 8, 3, Math.PI, 0); ctx.fill();
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(x - 2, y - 6, 3, 6); // book
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x + 2, y - 7, 3, 7); // book
            ctx.fillStyle = '#f5c542';
            ctx.fillRect(x + 10, y - 5, 2, 5); // candle
            ctx.fillStyle = '#ff9800';
            ctx.beginPath(); ctx.arc(x + 11, y - 6, 1.5, 0, Math.PI * 2); ctx.fill(); // flame
        } else if (rt === 'wall_clock') {
            // Modern round clock
            const r = 12;
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.beginPath(); ctx.arc(x + 1, y + 1, r + 1, 0, Math.PI * 2); ctx.fill();
            // Clock body
            ctx.fillStyle = item.baseColor;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            // Rim
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
            // Inner face
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(x, y, r - 2, 0, Math.PI * 2); ctx.fill();
            // Hour markers
            ctx.fillStyle = '#333';
            for (let i = 0; i < 12; i++) {
                const a = i * Math.PI / 6;
                const mx = x + Math.cos(a) * (r - 4);
                const my = y + Math.sin(a) * (r - 4);
                ctx.beginPath(); ctx.arc(mx, my, 0.8, 0, Math.PI * 2); ctx.fill();
            }
            // Hands
            ctx.strokeStyle = '#333'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 4, y - 6); ctx.stroke(); // hour
            ctx.strokeStyle = '#555'; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 2, y - 8); ctx.stroke(); // minute
            // Center dot
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
        } else if (rt === 'wall_mirror') {
            // Modern rectangular mirror
            const mw = 22, mh = 30;
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(x - mw/2 + 2, y - mh/2 + 2, mw, mh);
            // Frame - thin modern
            ctx.fillStyle = '#555';
            ctx.fillRect(x - mw/2 - 1.5, y - mh/2 - 1.5, mw + 3, mh + 3);
            // Mirror surface
            const mirGrad = ctx.createLinearGradient(x - mw/2, y - mh/2, x + mw/2, y + mh/2);
            mirGrad.addColorStop(0, '#e8f4f8');
            mirGrad.addColorStop(0.3, '#d0e8f0');
            mirGrad.addColorStop(0.5, '#c0dce8');
            mirGrad.addColorStop(0.7, '#d5eaf2');
            mirGrad.addColorStop(1, '#e0f0f5');
            ctx.fillStyle = mirGrad;
            ctx.fillRect(x - mw/2, y - mh/2, mw, mh);
            // Shine streak
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.moveTo(x - mw/2 + 3, y - mh/2);
            ctx.lineTo(x - mw/2 + 7, y - mh/2);
            ctx.lineTo(x - mw/2 + 3, y + mh/2);
            ctx.lineTo(x - mw/2, y + mh/2);
            ctx.closePath();
            ctx.fill();
        } else if (rt === 'wall_tv') {
            // Large wall-mounted flat screen TV
            const tw = 44, th = 26;
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.fillRect(x - tw/2 + 2, y - th/2 + 2, tw, th);
            // TV body
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(x - tw/2, y - th/2, tw, th);
            // Screen
            const scrGrad = ctx.createLinearGradient(x - tw/2 + 2, y - th/2 + 2, x + tw/2 - 2, y + th/2 - 2);
            scrGrad.addColorStop(0, '#1a237e');
            scrGrad.addColorStop(0.5, '#283593');
            scrGrad.addColorStop(1, '#1a237e');
            ctx.fillStyle = scrGrad;
            ctx.fillRect(x - tw/2 + 2, y - th/2 + 2, tw - 4, th - 4);
            // Screen content - abstract gradient
            ctx.fillStyle = 'rgba(100, 180, 255, 0.15)';
            ctx.fillRect(x - tw/2 + 4, y - th/2 + 4, tw - 8, th/2 - 4);
            ctx.fillStyle = 'rgba(50, 200, 100, 0.12)';
            ctx.fillRect(x - tw/2 + 4, y, tw - 8, th/2 - 4);
            // Wall mount bracket (small)
            ctx.fillStyle = '#444';
            ctx.fillRect(x - 3, y + th/2, 6, 3);
        } else if (rt === 'wall_sconce') {
            // Wall sconce light
            // Mounting plate
            ctx.fillStyle = '#888';
            ctx.fillRect(x - 3, y - 2, 6, 10);
            // Arm
            ctx.fillStyle = '#777';
            ctx.fillRect(x - 1, y - 6, 2, 6);
            // Shade
            ctx.fillStyle = '#f5f0e0';
            ctx.beginPath();
            ctx.moveTo(x - 8, y - 6);
            ctx.lineTo(x + 8, y - 6);
            ctx.lineTo(x + 5, y - 14);
            ctx.lineTo(x - 5, y - 14);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 0.5;
            ctx.stroke();
            // Glow
            const glowG = ctx.createRadialGradient(x, y - 10, 2, x, y - 10, 18);
            glowG.addColorStop(0, 'rgba(255, 241, 118, 0.35)');
            glowG.addColorStop(1, 'rgba(255, 241, 118, 0)');
            ctx.fillStyle = glowG;
            ctx.beginPath(); ctx.arc(x, y - 10, 18, 0, Math.PI * 2); ctx.fill();
        }

        // Label
        ctx.fillStyle = 'rgba(80,50,20,0.8)';
        ctx.font = 'bold 6px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.name, x, y + 20);
    }

    // ---------- URBANISMO ----------
    function drawUrbanismoItem(x, y, hw, hh, floorH, totalH, item) {
        if (item.roofType === 'tree') {
            ctx.fillStyle = '#795548'; ctx.fillRect(x-2, y-25, 4, 20);
            ctx.fillStyle = '#2E7D32'; ctx.beginPath(); ctx.arc(x, y-32, 14, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#388E3C'; ctx.beginPath(); ctx.arc(x-6, y-28, 10, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#43A047'; ctx.beginPath(); ctx.arc(x+5, y-27, 9, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#FF7043'; ctx.beginPath(); ctx.arc(x-10, y+2, 2, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#FFD54F'; ctx.beginPath(); ctx.arc(x+8, y+4, 2, 0, Math.PI*2); ctx.fill();
            return;
        }
        if (item.roofType === 'busstop') {
            ctx.fillStyle = '#37474F'; ctx.fillRect(x-1, y-18, 2, 18);
            ctx.fillStyle = '#1976D2'; ctx.beginPath(); ctx.arc(x, y-22, 6, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('B', x, y-20);
            ctx.fillStyle = '#455A64'; ctx.fillRect(x-12, y-14, 24, 3);
            return;
        }
        // Standard building box
        drawBox(x, y, TILE_W, totalH, item.baseColor);
        // Windows
        if (item.windows && item.floors >= 2) {
            for (let f = 0; f < item.floors; f++) {
                const fy = y + TILE_H - totalH + f*floorH + 3;
                ctx.fillStyle = f%2===0 ? '#BBDEFB' : '#90CAF9';
                for (let w = 0; w < 2; w++) { ctx.fillRect(x-hw+6+w*12, fy+w*2, 5, 5); ctx.fillRect(x+5+w*12, fy+4-w*2, 5, 5); }
            }
        }
        if (item.floors >= 1) { ctx.fillStyle = '#5D4037'; ctx.fillRect(x-5, y+TILE_H-10, 5, 8); }
        if (item.cross) { ctx.fillStyle = '#E53935'; ctx.fillRect(x-2, y+TILE_H-totalH+4, 4, 12); ctx.fillRect(x-6, y+TILE_H-totalH+8, 12, 4); }
        // Roofs
        if (item.roofType === 'gable') {
            const rb = y - totalH, rp = rb - 14;
            ctx.beginPath(); ctx.moveTo(x-hw-2, rb+hh); ctx.lineTo(x, rp); ctx.lineTo(x, rb+TILE_H); ctx.closePath();
            ctx.fillStyle = item.roofColor; ctx.fill();
            ctx.beginPath(); ctx.moveTo(x, rb+TILE_H); ctx.lineTo(x, rp); ctx.lineTo(x+hw+2, rb+hh); ctx.closePath();
            ctx.fillStyle = darken(item.roofColor, 20); ctx.fill();
        } else if (item.roofType === 'spire') {
            const rb = y - totalH;
            ctx.fillStyle = item.roofColor; ctx.beginPath(); ctx.moveTo(x, rb-22); ctx.lineTo(x-6, rb+hh); ctx.lineTo(x+6, rb+hh); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#FFD700'; ctx.fillRect(x-1, rb-28, 2, 8); ctx.fillRect(x-3, rb-26, 6, 2);
        } else if (item.roofType === 'dome') {
            const rb = y - totalH;
            ctx.fillStyle = item.roofColor; ctx.beginPath(); ctx.ellipse(x, rb+hh, hw, 16, 0, Math.PI, 0); ctx.fill();
            ctx.fillStyle = lighten(item.roofColor, 30); ctx.beginPath(); ctx.ellipse(x, rb+hh, hw-4, 12, 0, Math.PI, 0); ctx.fill();
        } else if (item.roofType === 'awning') {
            const rb = y - totalH;
            ctx.fillStyle = '#E53935'; ctx.fillRect(x-hw-3, rb+hh-2, hw+3, 4);
            ctx.fillStyle = '#fff'; for (let s=0;s<4;s++) ctx.fillRect(x-hw-3+s*8, rb+hh-2, 4, 4);
            ctx.fillStyle = darken(item.roofColor,10); ctx.fillRect(x+1, rb+hh-2, hw+1, 4);
        }
    }

    // ---------- INTERIORES (modern furniture) ----------
    function drawInterioresItem(x, y, hw, hh, item) {
        const rt = item.roofType;

        if (rt === 'modern_sofa') {
            // Modern sleek sofa with thin legs
            // Legs (thin metal)
            ctx.fillStyle = '#555';
            ctx.fillRect(x - hw + 4, y + TILE_H - 3, 2, 4);
            ctx.fillRect(x + hw - 6, y + TILE_H - 3, 2, 4);
            ctx.fillRect(x - hw + 4, y + hh + 3, 2, 4);
            ctx.fillRect(x + hw - 6, y + hh - 1, 2, 4);
            // Seat base
            drawBox(x, y, TILE_W, 8, item.baseColor);
            // Back cushion (left side isometric)
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.beginPath();
            ctx.moveTo(x - hw, y + hh - 8);
            ctx.lineTo(x - hw, y + hh - 18);
            ctx.lineTo(x, y - 18);
            ctx.lineTo(x, y - 8);
            ctx.closePath();
            ctx.fill();
            // Seat cushions on top (two)
            ctx.fillStyle = lighten(item.baseColor, 15);
            const top = y - 8;
            ctx.beginPath();
            ctx.moveTo(x, top + TILE_H);
            ctx.lineTo(x + hw, top + hh);
            ctx.lineTo(x, top);
            ctx.lineTo(x - hw, top + hh);
            ctx.closePath();
            ctx.fill();
            // Cushion divider line
            ctx.strokeStyle = darken(item.baseColor, 10);
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x - hw/2, top + hh/2);
            ctx.lineTo(x + hw/2, top + hh + hh/2);
            ctx.stroke();
            // Throw pillow
            ctx.fillStyle = '#e8c9a0';
            ctx.beginPath(); ctx.ellipse(x - hw + 10, top + hh + 2, 4, 3, -0.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'flat_tv') {
            // TV stand (low modern cabinet)
            drawBox(x, y, TILE_W, 6, '#5a4a3a');
            // Cabinet detail
            ctx.fillStyle = darken('#5a4a3a', 10);
            ctx.fillRect(x - 1, y + TILE_H - 6, 2, 4);
            // Thin flat screen TV on stand
            ctx.fillStyle = '#111';
            ctx.fillRect(x - 16, y + hh - 26, 32, 20);
            // Screen
            const scrG = ctx.createLinearGradient(x - 14, y + hh - 24, x + 14, y + hh - 8);
            scrG.addColorStop(0, '#1a237e');
            scrG.addColorStop(0.5, '#283593');
            scrG.addColorStop(1, '#1a237e');
            ctx.fillStyle = scrG;
            ctx.fillRect(x - 14, y + hh - 24, 28, 16);
            // Screen content shimmer
            ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
            ctx.fillRect(x - 12, y + hh - 22, 24, 6);
            // Stand neck
            ctx.fillStyle = '#333';
            ctx.fillRect(x - 1.5, y + hh - 6, 3, 3);

        } else if (rt === 'coffee_table') {
            // Minimalist coffee table - thin top, angled legs
            // Angled legs
            ctx.strokeStyle = '#8a7a6a';
            ctx.lineWidth = 1.5;
            // Back legs
            ctx.beginPath(); ctx.moveTo(x - hw + 6, y + hh + 6); ctx.lineTo(x - hw + 10, y + hh - 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + hw - 6, y + hh - 2); ctx.lineTo(x + hw - 10, y + hh + 6); ctx.stroke();
            // Front legs
            ctx.beginPath(); ctx.moveTo(x - 4, y + TILE_H + 4); ctx.lineTo(x - 8, y + TILE_H - 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + 4, y + TILE_H + 4); ctx.lineTo(x + 8, y + TILE_H - 2); ctx.stroke();
            // Thin table top
            drawBox(x, y, TILE_W * 0.85, 3, item.baseColor);
            // Magazine/book on table
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(x - 3, y + hh - 5, 6, 4);

        } else if (rt === 'floor_lamp') {
            // Modern floor lamp - thin pole with geometric shade
            // Base (circle)
            ctx.fillStyle = '#444';
            ctx.beginPath(); ctx.ellipse(x, y + TILE_H - 2, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
            // Thin pole
            ctx.fillStyle = '#555';
            ctx.fillRect(x - 1, y - 28, 2, 30);
            // Geometric shade (cylinder/drum shape)
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(x - 7, y - 36, 14, 10);
            ctx.fillStyle = lighten(item.baseColor, 20);
            ctx.beginPath(); ctx.ellipse(x, y - 36, 7, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = darken(item.baseColor, 10);
            ctx.beginPath(); ctx.ellipse(x, y - 26, 7, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            // Glow effect
            const glowG = ctx.createRadialGradient(x, y - 24, 2, x, y - 24, 20);
            glowG.addColorStop(0, 'rgba(255, 241, 180, 0.3)');
            glowG.addColorStop(1, 'rgba(255, 241, 180, 0)');
            ctx.fillStyle = glowG;
            ctx.beginPath(); ctx.arc(x, y - 24, 20, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'dining_table') {
            // Contemporary dining table with chairs suggestion
            // Table legs (thin angled)
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x - hw + 4, y + hh + 4); ctx.lineTo(x - hw + 8, y + hh - 4); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + hw - 4, y + hh - 4); ctx.lineTo(x + hw - 8, y + hh + 4); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x - 2, y + TILE_H + 2); ctx.lineTo(x - 6, y + TILE_H - 4); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + 2, y + TILE_H + 2); ctx.lineTo(x + 6, y + TILE_H - 4); ctx.stroke();
            // Table top (white/light)
            drawBox(x, y, TILE_W, 3, item.baseColor);
            // Plate
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.ellipse(x - 4, y + hh - 4, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.ellipse(x + 6, y + hh + 2, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'modern_bed') {
            // Modern bed with headboard
            // Bed frame
            drawBox(x, y, TILE_W, 7, '#8a7a6a');
            // Mattress
            const mTop = y - 7;
            ctx.fillStyle = '#f5f0e8';
            ctx.beginPath();
            ctx.moveTo(x, mTop + TILE_H);
            ctx.lineTo(x + hw, mTop + hh);
            ctx.lineTo(x, mTop);
            ctx.lineTo(x - hw, mTop + hh);
            ctx.closePath();
            ctx.fill();
            // Headboard (tall rectangle at back)
            ctx.fillStyle = '#5a4a3a';
            ctx.beginPath();
            ctx.moveTo(x - hw, mTop + hh);
            ctx.lineTo(x - hw, mTop + hh - 18);
            ctx.lineTo(x, mTop - 18);
            ctx.lineTo(x, mTop);
            ctx.closePath();
            ctx.fill();
            // Headboard right face
            ctx.fillStyle = darken('#5a4a3a', 15);
            ctx.beginPath();
            ctx.moveTo(x, mTop);
            ctx.lineTo(x, mTop - 18);
            ctx.lineTo(x + 3, mTop - 19);
            ctx.lineTo(x + 3, mTop - 1);
            ctx.closePath();
            ctx.fill();
            // Pillows
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.ellipse(x - hw + 10, mTop + hh - 4, 6, 3, -0.4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f0f0f0';
            ctx.beginPath(); ctx.ellipse(x - hw + 20, mTop + hh + 1, 6, 3, -0.4, 0, Math.PI * 2); ctx.fill();
            // Duvet
            ctx.fillStyle = item.baseColor;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.moveTo(x + 5, mTop + TILE_H);
            ctx.lineTo(x + hw, mTop + hh + 4);
            ctx.lineTo(x + 5, mTop + 6);
            ctx.lineTo(x - hw + 14, mTop + hh + 4);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;

        } else if (rt === 'desk_computer') {
            // Modern desk with computer
            // Desk legs
            ctx.fillStyle = '#666';
            ctx.fillRect(x - hw + 4, y + hh, 2, 10);
            ctx.fillRect(x + hw - 6, y + hh - 6, 2, 10);
            ctx.fillRect(x - 4, y + TILE_H - 2, 2, 8);
            ctx.fillRect(x + 2, y + TILE_H - 6, 2, 8);
            // Desk surface
            drawBox(x, y, TILE_W, 3, item.baseColor);
            // Monitor
            ctx.fillStyle = '#222';
            ctx.fillRect(x - 8, y + hh - 20, 16, 12);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x - 7, y + hh - 19, 14, 10);
            // Monitor stand
            ctx.fillStyle = '#444';
            ctx.fillRect(x - 1, y + hh - 8, 2, 4);
            ctx.fillRect(x - 4, y + hh - 4, 8, 1.5);
            // Keyboard
            ctx.fillStyle = '#555';
            ctx.fillRect(x - 6, y + hh + 2, 12, 3);
            ctx.fillStyle = '#666';
            ctx.fillRect(x - 5, y + hh + 2.5, 10, 2);

        } else if (rt === 'bookshelf') {
            // Tall modern bookshelf
            drawBox(x, y, TILE_W * 0.7, 32, item.baseColor);
            // Shelves and books
            const shelfColors = ['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#8e24aa', '#00acc1', '#f4511e'];
            for (let shelf = 0; shelf < 4; shelf++) {
                const sy = y + hh - 30 + shelf * 8;
                // Shelf line
                ctx.fillStyle = darken(item.baseColor, 10);
                ctx.fillRect(x - hw * 0.6, sy + 6, hw * 1.2, 1);
                // Books on shelf
                for (let b = 0; b < 4; b++) {
                    const bx = x - hw * 0.5 + b * 7;
                    const bh = 4 + Math.random() * 2;
                    ctx.fillStyle = shelfColors[(shelf * 4 + b) % shelfColors.length];
                    ctx.fillRect(bx, sy + 6 - bh, 5, bh);
                }
            }

        } else if (rt === 'modern_plant') {
            // Modern geometric pot with plant
            // Pot (geometric/angular)
            ctx.fillStyle = '#e0e0e0';
            ctx.beginPath();
            ctx.moveTo(x - 7, y + 4);
            ctx.lineTo(x + 7, y + 4);
            ctx.lineTo(x + 5, y + 14);
            ctx.lineTo(x - 5, y + 14);
            ctx.closePath();
            ctx.fill();
            // Pot rim
            ctx.fillStyle = '#ccc';
            ctx.fillRect(x - 8, y + 2, 16, 3);
            // Stem
            ctx.strokeStyle = '#388E3C';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x, y - 10); ctx.stroke();
            // Leaves (modern fiddle-leaf style)
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath(); ctx.ellipse(x - 6, y - 8, 5, 8, -0.3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.ellipse(x + 5, y - 12, 4, 7, 0.4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#43A047';
            ctx.beginPath(); ctx.ellipse(x - 2, y - 16, 4, 6, -0.1, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#81C784';
            ctx.beginPath(); ctx.ellipse(x + 3, y - 4, 3, 5, 0.6, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'modern_rug') {
            // Modern flat rug with pattern
            ctx.globalAlpha = 0.75;
            drawDiamond(x, y, item.baseColor, darken(item.baseColor, 20), false);
            // Inner border pattern
            ctx.strokeStyle = darken(item.baseColor, 30);
            ctx.lineWidth = 1;
            const inset = 0.7;
            ctx.beginPath();
            ctx.moveTo(x, y + 4);
            ctx.lineTo(x + hw * inset, y + hh);
            ctx.lineTo(x, y + TILE_H - 4);
            ctx.lineTo(x - hw * inset, y + hh);
            ctx.closePath();
            ctx.stroke();
            // Center geometric pattern
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.beginPath();
            ctx.moveTo(x, y + hh - 4);
            ctx.lineTo(x + 6, y + hh);
            ctx.lineTo(x, y + hh + 4);
            ctx.lineTo(x - 6, y + hh);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // ---------- PAISAJISMO ----------
    function drawPaisajismoItem(x, y, hw, hh, item) {
        const rt = item.roofType;
        if (rt === 'bigtree') {
            ctx.fillStyle = '#5D4037'; ctx.fillRect(x-3, y-30, 6, 28);
            ctx.fillStyle = '#1B5E20'; ctx.beginPath(); ctx.arc(x, y-40, 18, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#2E7D32'; ctx.beginPath(); ctx.arc(x-8, y-34, 13, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#388E3C'; ctx.beginPath(); ctx.arc(x+7, y-33, 12, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#43A047'; ctx.beginPath(); ctx.arc(x-3, y-46, 10, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'flowers') {
            // Flower bed
            const cols = ['#E91E63','#FF5722','#FF9800','#FFEB3B','#E040FB'];
            for (let i = 0; i < 7; i++) {
                const fx = x - 10 + Math.random()*20, fy = y - 2 + Math.random()*10;
                ctx.fillStyle = '#4CAF50'; ctx.fillRect(fx, fy, 1.5, 6);
                ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); ctx.arc(fx+0.5, fy-1, 3, 0, Math.PI*2); ctx.fill();
            }
        } else if (rt === 'fountain') {
            // Base
            ctx.fillStyle = '#90A4AE';
            ctx.beginPath(); ctx.ellipse(x, y+8, 16, 8, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#B0BEC5';
            ctx.beginPath(); ctx.ellipse(x, y+6, 14, 6, 0, 0, Math.PI*2); ctx.fill();
            // Water
            ctx.fillStyle = '#4FC3F7';
            ctx.beginPath(); ctx.ellipse(x, y+5, 11, 5, 0, 0, Math.PI*2); ctx.fill();
            // Pillar
            ctx.fillStyle = '#CFD8DC'; ctx.fillRect(x-2, y-12, 4, 16);
            // Water jet
            ctx.strokeStyle = '#29B6F6'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x, y-12); ctx.quadraticCurveTo(x-6, y-20, x-10, y-4); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x, y-12); ctx.quadraticCurveTo(x+6, y-20, x+10, y-4); ctx.stroke();
        } else if (rt === 'rocks') {
            ctx.fillStyle = '#78909C';
            ctx.beginPath(); ctx.ellipse(x-4, y+6, 8, 5, 0.2, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#90A4AE';
            ctx.beginPath(); ctx.ellipse(x+5, y+3, 6, 4, -0.3, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#607D8B';
            ctx.beginPath(); ctx.ellipse(x, y-1, 5, 3, 0, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'hedge') {
            // Rectangular hedge
            drawBox(x, y, TILE_W * 0.9, 12, '#388E3C');
            ctx.fillStyle = '#4CAF50';
            const top = y - 12;
            ctx.beginPath(); ctx.moveTo(x, top+TILE_H); ctx.lineTo(x+hw*0.9, top+hh); ctx.lineTo(x, top); ctx.lineTo(x-hw*0.9, top+hh); ctx.closePath(); ctx.fill();
        } else if (rt === 'bench') {
            // Legs
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(x-10, y+4, 2, 8); ctx.fillRect(x+8, y+4, 2, 8);
            // Seat
            ctx.fillStyle = '#8D6E63'; ctx.fillRect(x-12, y+2, 24, 3);
            // Back
            ctx.fillStyle = '#795548'; ctx.fillRect(x-12, y-4, 24, 3);
            ctx.fillRect(x-10, y-4, 2, 6); ctx.fillRect(x+8, y-4, 2, 6);
        } else if (rt === 'pond') {
            ctx.fillStyle = '#0277BD';
            ctx.beginPath(); ctx.ellipse(x, y+6, 18, 10, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#039BE5';
            ctx.beginPath(); ctx.ellipse(x, y+5, 15, 8, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#4FC3F7';
            ctx.beginPath(); ctx.ellipse(x-3, y+3, 6, 3, 0, 0, Math.PI*2); ctx.fill();
            // Lily pad
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.ellipse(x+6, y+7, 4, 2.5, 0.3, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'streetlamp') {
            ctx.fillStyle = '#424242'; ctx.fillRect(x-1.5, y-24, 3, 28);
            ctx.fillStyle = '#616161'; ctx.beginPath(); ctx.ellipse(x, y+4, 5, 2.5, 0, 0, Math.PI*2); ctx.fill();
            // Lamp head
            ctx.fillStyle = '#212121'; ctx.fillRect(x-5, y-26, 10, 3);
            ctx.fillStyle = '#FFF176'; ctx.beginPath(); ctx.arc(x, y-23, 4, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = 'rgba(255,241,118,0.2)'; ctx.beginPath(); ctx.arc(x, y-20, 14, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'sunflower') {
            ctx.fillStyle = '#4CAF50'; ctx.fillRect(x-1, y-18, 2, 20);
            // Leaves
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.ellipse(x+5, y-4, 5, 2.5, 0.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(x-5, y-10, 5, 2.5, -0.5, 0, Math.PI*2); ctx.fill();
            // Petals
            for (let a = 0; a < Math.PI*2; a += 0.6) {
                ctx.fillStyle = '#FDD835';
                ctx.beginPath(); ctx.ellipse(x+Math.cos(a)*7, y-22+Math.sin(a)*7, 4, 2, a, 0, Math.PI*2); ctx.fill();
            }
            ctx.fillStyle = '#5D4037'; ctx.beginPath(); ctx.arc(x, y-22, 5, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'path') {
            drawDiamond(x, y, '#D7CCC8', '#BCAAA4', false);
            // Stones
            ctx.fillStyle = '#BDBDBD';
            ctx.beginPath(); ctx.ellipse(x-5, y+hh-2, 4, 2.5, 0.2, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(x+4, y+hh+1, 3.5, 2, -0.3, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(x, y+hh+4, 3, 2, 0, 0, Math.PI*2); ctx.fill();
        }
    }

    // ---------- SOSTENIBLE (modern eco items) ----------
    function drawSostenibleItem(x, y, hw, hh, floorH, totalH, item) {
        const rt = item.roofType;

        if (rt === 'solar_array') {
            // Modern solar panel array - multiple panels
            // Support structure
            ctx.fillStyle = '#78909C';
            ctx.fillRect(x - 2, y + 2, 4, 10);
            ctx.fillRect(x - hw + 6, y + hh, 2, 6);
            ctx.fillRect(x + hw - 8, y + hh - 4, 2, 6);
            // Panel surface (angled)
            ctx.fillStyle = '#0D47A1';
            ctx.beginPath();
            ctx.moveTo(x - hw + 2, y + hh - 2);
            ctx.lineTo(x + hw - 2, y + hh - 6);
            ctx.lineTo(x + hw - 2, y + hh - 16);
            ctx.lineTo(x - hw + 2, y + hh - 12);
            ctx.closePath();
            ctx.fill();
            // Top face
            ctx.fillStyle = '#1565C0';
            ctx.beginPath();
            ctx.moveTo(x - hw + 2, y + hh - 12);
            ctx.lineTo(x + hw - 2, y + hh - 16);
            ctx.lineTo(x, y - 14);
            ctx.lineTo(x - hw + 6, y + hh - 14);
            ctx.closePath();
            ctx.fill();
            // Grid lines on panel
            ctx.strokeStyle = '#42A5F5';
            ctx.lineWidth = 0.4;
            for (let i = 1; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(x - hw + 2 + i * 5, y + hh - 12);
                ctx.lineTo(x - hw + 2 + i * 7, y - 6);
                ctx.stroke();
            }
            // Shine effect
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fillRect(x - 4, y + hh - 14, 10, 4);

        } else if (rt === 'wind_turbine') {
            // Sleek modern wind turbine
            // Base
            ctx.fillStyle = '#B0BEC5';
            ctx.beginPath(); ctx.ellipse(x, y + TILE_H - 4, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
            // Tower (tapered)
            ctx.fillStyle = '#ECEFF1';
            ctx.beginPath();
            ctx.moveTo(x - 4, y + TILE_H - 4);
            ctx.lineTo(x + 4, y + TILE_H - 4);
            ctx.lineTo(x + 2, y - 34);
            ctx.lineTo(x - 2, y - 34);
            ctx.closePath();
            ctx.fill();
            // Nacelle
            ctx.fillStyle = '#CFD8DC';
            ctx.beginPath(); ctx.ellipse(x, y - 34, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            // Blades (3)
            ctx.strokeStyle = '#ECEFF1';
            ctx.lineWidth = 2.5;
            const cx = x, cy = y - 34;
            for (let a = 0; a < 3; a++) {
                const angle = a * (Math.PI * 2 / 3) + Date.now() * 0.002;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20);
                ctx.stroke();
                // Blade tip (thinner)
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(angle) * 18, cy + Math.sin(angle) * 18);
                ctx.lineTo(cx + Math.cos(angle) * 24, cy + Math.sin(angle) * 24);
                ctx.stroke();
                ctx.lineWidth = 2.5;
            }
            // Hub
            ctx.fillStyle = '#455A64';
            ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'green_roof') {
            // Green roof module
            drawBox(x, y, TILE_W, 10, '#8D6E63');
            // Roof top with green
            ctx.fillStyle = '#4CAF50';
            const top = y - 10;
            ctx.beginPath();
            ctx.moveTo(x, top + TILE_H);
            ctx.lineTo(x + hw, top + hh);
            ctx.lineTo(x, top);
            ctx.lineTo(x - hw, top + hh);
            ctx.closePath();
            ctx.fill();
            // Little plants
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.arc(x - 6, top + hh - 1, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 5, top + hh, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x, top + 5, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#81C784';
            ctx.beginPath(); ctx.arc(x + 2, top + hh + 3, 2, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ev_charger') {
            // Electric vehicle charger station
            // Post
            ctx.fillStyle = '#37474F';
            ctx.fillRect(x - 3, y - 20, 6, 24);
            // Charger head
            ctx.fillStyle = '#455A64';
            ctx.fillRect(x - 6, y - 24, 12, 8);
            // Screen
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(x - 4, y - 22, 8, 4);
            // Green indicator
            ctx.fillStyle = '#76FF03';
            ctx.beginPath(); ctx.arc(x, y - 16, 1.5, 0, Math.PI * 2); ctx.fill();
            // Cable
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x + 4, y - 16);
            ctx.quadraticCurveTo(x + 12, y - 8, x + 8, y + 4);
            ctx.stroke();
            // Plug end
            ctx.fillStyle = '#444';
            ctx.fillRect(x + 6, y + 2, 4, 3);
            // Base
            ctx.fillStyle = '#546E7A';
            ctx.fillRect(x - 5, y + 4, 10, 3);

        } else if (rt === 'rain_tank') {
            // Modern rainwater collection tank
            // Cylinder body
            ctx.fillStyle = '#00838F';
            ctx.fillRect(x - 10, y - 10, 20, 22);
            // Top ellipse
            ctx.fillStyle = '#0097A7';
            ctx.beginPath(); ctx.ellipse(x, y - 10, 10, 5, 0, 0, Math.PI * 2); ctx.fill();
            // Inner top
            ctx.fillStyle = '#00ACC1';
            ctx.beginPath(); ctx.ellipse(x, y - 10, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
            // Water level indicator
            ctx.fillStyle = '#4FC3F7';
            ctx.fillRect(x + 10, y - 4, 2, 10);
            ctx.fillStyle = '#00B0FF';
            ctx.fillRect(x + 10, y + 2, 2, 4);
            // Pipe in
            ctx.fillStyle = '#78909C';
            ctx.fillRect(x - 14, y - 8, 4, 2);

        } else if (rt === 'compost') {
            // Compost bin
            drawBox(x, y, TILE_W * 0.7, 14, '#795548');
            // Lid
            ctx.fillStyle = '#8D6E63';
            const top = y - 14;
            ctx.beginPath();
            ctx.moveTo(x, top + TILE_H);
            ctx.lineTo(x + hw * 0.7, top + hh);
            ctx.lineTo(x, top);
            ctx.lineTo(x - hw * 0.7, top + hh);
            ctx.closePath();
            ctx.fill();
            // Handle
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(x - 2, top + hh - 2, 4, 2);
            // Leaf decoration
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath(); ctx.ellipse(x + 4, top + hh + 2, 3, 2, 0.3, 0, Math.PI * 2); ctx.fill();
            // Ventilation holes
            ctx.fillStyle = darken('#795548', 20);
            ctx.beginPath(); ctx.arc(x - 4, y + 4, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 4, y + 2, 1.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'bee_hotel') {
            // Bee hotel / insect house
            // Frame
            ctx.fillStyle = '#8D6E63';
            ctx.fillRect(x - 10, y - 14, 20, 24);
            // Roof (small gable)
            ctx.fillStyle = '#6D4C41';
            ctx.beginPath();
            ctx.moveTo(x - 12, y - 14);
            ctx.lineTo(x, y - 22);
            ctx.lineTo(x + 12, y - 14);
            ctx.closePath();
            ctx.fill();
            // Compartments with different fills
            const fills = ['#D7CCC8', '#BCAAA4', '#A1887F', '#FFE0B2', '#C8E6C9'];
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const cx = x - 7 + col * 7;
                    const cy = y - 10 + row * 7;
                    ctx.fillStyle = fills[(row * 3 + col) % fills.length];
                    ctx.fillRect(cx, cy, 5, 5);
                    // Holes
                    ctx.fillStyle = darken('#795548', 30);
                    ctx.beginPath(); ctx.arc(cx + 2.5, cy + 2.5, 1.5, 0, Math.PI * 2); ctx.fill();
                }
            }
            // Small bee
            ctx.fillStyle = '#FFD54F';
            ctx.beginPath(); ctx.ellipse(x + 14, y - 8, 2.5, 1.5, 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#333';
            ctx.fillRect(x + 13, y - 9, 1, 3);
            ctx.fillRect(x + 15, y - 9, 1, 3);

        } else if (rt === 'smart_lamp') {
            // LED smart street lamp
            // Pole
            ctx.fillStyle = '#78909C';
            ctx.fillRect(x - 1.5, y - 28, 3, 32);
            // Base
            ctx.fillStyle = '#607D8B';
            ctx.beginPath(); ctx.ellipse(x, y + 4, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            // Solar panel on top
            ctx.fillStyle = '#1565C0';
            ctx.fillRect(x - 6, y - 32, 12, 3);
            // LED light head
            ctx.fillStyle = '#455A64';
            ctx.fillRect(x - 8, y - 28, 16, 3);
            // LED glow
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(x - 6, y - 25, 12, 2);
            // Glow effect
            const glow = ctx.createRadialGradient(x, y - 22, 2, x, y - 22, 16);
            glow.addColorStop(0, 'rgba(144, 202, 249, 0.35)');
            glow.addColorStop(1, 'rgba(144, 202, 249, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(x, y - 22, 16, 0, Math.PI * 2); ctx.fill();
            // Motion sensor
            ctx.fillStyle = '#B0BEC5';
            ctx.beginPath(); ctx.arc(x + 3, y - 26, 1.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'recycle_station') {
            // Modern recycling station with 3 bins
            const binW = 8;
            const colors = ['#4CAF50', '#2196F3', '#FFC107'];
            const labels = ['O', 'P', 'V'];
            for (let i = 0; i < 3; i++) {
                const bx = x - 14 + i * 10;
                const by = y + 2;
                // Bin body
                ctx.fillStyle = colors[i];
                ctx.fillRect(bx, by - 12, binW, 14);
                // Lid
                ctx.fillStyle = darken(colors[i], 20);
                ctx.fillRect(bx - 1, by - 14, binW + 2, 3);
                // Label
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 5px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(labels[i], bx + binW / 2, by - 4);
            }
            // Recycling symbol above
            ctx.fillStyle = '#388E3C';
            ctx.font = '8px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('♻', x, y - 14);

        } else if (rt === 'vertical_garden') {
            // Vertical garden module / green wall
            // Frame structure
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(x - 12, y - 18, 24, 28);
            // Plant grid
            const plantColors = ['#4CAF50', '#66BB6A', '#81C784', '#388E3C', '#43A047', '#2E7D32'];
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const px = x - 9 + col * 6;
                    const py = y - 14 + row * 6;
                    ctx.fillStyle = plantColors[(row * 4 + col) % plantColors.length];
                    ctx.beginPath(); ctx.arc(px + 2, py + 2, 2.5, 0, Math.PI * 2); ctx.fill();
                }
            }
            // Frame border
            ctx.strokeStyle = '#8D6E63';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x - 12, y - 18, 24, 28);
            // Drip system at top
            ctx.fillStyle = '#0097A7';
            ctx.fillRect(x - 10, y - 20, 20, 2);
        }
    }

    // ========== RENDER LOOP ==========
    function render() {
        ctx.clearRect(0, 0, W, H);
        bgDrawers[subtype]();

        // Draw wall items for interiores BEFORE floor grid (they're on the back wall)
        if (subtype === 'interiores') {
            // Draw wall slot hover indicators
            for (let i = 0; i < WALL_SLOTS; i++) {
                const { x, y } = getWallSlotPos(i);
                if (wallGrid[i]) {
                    drawWallItem(i, wallGrid[i]);
                } else if (i === hoverWall && selectedTool && selectedTool.wall) {
                    // Ghost preview on wall
                    ctx.globalAlpha = 0.4;
                    drawWallItem(i, selectedTool);
                    ctx.globalAlpha = 1;
                    // Hover indicator
                    ctx.strokeStyle = 'rgba(180, 170, 155, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x - 22, y - 18, 44, 36);
                } else if (selectedTool && selectedTool.wall) {
                    // Show available wall slots subtly
                    ctx.strokeStyle = 'rgba(180, 170, 155, 0.15)';
                    ctx.lineWidth = 0.5;
                    ctx.setLineDash([3, 3]);
                    ctx.strokeRect(x - 22, y - 18, 44, 36);
                    ctx.setLineDash([]);
                }
                // Eraser on wall items
                if (i === hoverWall && selectedTool && selectedTool.name === 'eraser' && wallGrid[i]) {
                    ctx.fillStyle = 'rgba(255,0,0,0.4)';
                    ctx.font = '18px serif'; ctx.textAlign = 'center';
                    ctx.fillText('🗑️', x, y + 5);
                }
            }
        }

        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const { x, y } = toIso(r, c);
                const isHover = (r === hoverR && c === hoverC && selectedTool);

                if (grid[r][c]) {
                    drawDiamond(x, y, getOccupiedTileColor(), darken(getOccupiedTileColor(), 30), false);
                    drawItem3D(r, c, grid[r][c]);
                } else {
                    const tc = getTileColors(isHover);
                    drawDiamond(x, y, tc.base, tc.border, isHover);
                    if (isHover && selectedTool && selectedTool.name !== 'eraser' && !selectedTool.wall) {
                        ctx.globalAlpha = 0.4;
                        drawItem3D(r, c, selectedTool);
                        ctx.globalAlpha = 1;
                    }
                    if (isHover && selectedTool && selectedTool.name === 'eraser') {
                        ctx.fillStyle = 'rgba(255,0,0,0.4)';
                        ctx.font = '18px serif'; ctx.textAlign = 'center';
                        ctx.fillText('🗑️', x, y + TILE_H / 2 + 5);
                    }
                }
            }
        }
        animFrame = requestAnimationFrame(render);
    }

    // ========== INPUT ==========
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const sx = W / rect.width, sy = H / rect.height;
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (cx - rect.left) * sx, y: (cy - rect.top) * sy };
    }

    function handlePlace(e) {
        const pos = getMousePos(e);

        // Check wall placement first (interiores only)
        if (subtype === 'interiores') {
            const wallIdx = fromScreenWall(pos.x, pos.y);
            if (wallIdx >= 0) {
                if (selectedTool && selectedTool.name === 'eraser') {
                    if (wallGrid[wallIdx]) { wallGrid[wallIdx] = null; placedCount--; addScore(-5); }
                    return;
                }
                if (selectedTool && selectedTool.wall) {
                    if (wallGrid[wallIdx]) return;
                    wallGrid[wallIdx] = selectedTool;
                    placedCount++;
                    addScore(10);
                    return;
                }
            }
        }

        const cell = fromScreen(pos.x, pos.y);
        if (!cell || !selectedTool) return;
        const { r, c } = cell;
        if (selectedTool.name === 'eraser') {
            if (grid[r][c]) { grid[r][c] = null; placedCount--; addScore(-5); }
            return;
        }
        // Don't place wall items on floor
        if (selectedTool.wall) return;
        if (grid[r][c]) return;
        grid[r][c] = selectedTool;
        placedCount++;
        addScore(10);
    }

    canvas.addEventListener('mousemove', (e) => {
        const pos = getMousePos(e);

        // Check wall hover (interiores only)
        if (subtype === 'interiores') {
            hoverWall = fromScreenWall(pos.x, pos.y);
        }

        const cell = fromScreen(pos.x, pos.y);
        if (cell) { hoverR = cell.r; hoverC = cell.c; } else { hoverR = -1; hoverC = -1; }
    });
    canvas.addEventListener('click', handlePlace);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePlace(e); });

    // ========== TOOLBAR ==========
    controls.innerHTML = '<div class="toolbar" id="arq-toolbar"></div>';
    const toolbar = document.getElementById('arq-toolbar');

    items.forEach(b => {
        const item = document.createElement('div');
        item.className = 'tool-item';
        const wallTag = b.wall ? ' <span style="font-size:0.5rem;opacity:0.6">PARED</span>' : '';
        item.innerHTML = `<span class="tool-icon">${b.icon}</span><span class="tool-label">${b.name}${wallTag}</span>`;
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
        // Also count wall items
        for (let i = 0; i < WALL_SLOTS; i++)
            if (wallGrid[i]) uniqueTypes.add(wallGrid[i].name);
        addScore(uniqueTypes.size * 15);
        let stars = placedCount >= 15 ? 5 : placedCount >= 10 ? 4 : placedCount >= 6 ? 3 : placedCount >= 3 ? 2 : 1;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) starsHtml += `<span class="star ${i < stars ? 'filled' : 'empty'}">★</span>`;
        cancelAnimationFrame(animFrame);
        showResult(ARQ_FINISH_MSG[subtype], `<div class="stars">${starsHtml}</div>`,
            `Has colocado ${placedCount} elementos con ${uniqueTypes.size} tipos diferentes.`,
            () => startIso3D(subtype));
    };
    toolbar.appendChild(finishBtn);

    // Goal
    ui.innerHTML = `<div style="padding: 8px 14px; font-size: 0.7rem; color: rgba(255,255,255,0.8); text-align: center; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px);">
        ${ARQ_GOALS[subtype]}
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
