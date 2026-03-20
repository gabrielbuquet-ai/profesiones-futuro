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
        { name: 'Sofa', floors: 0, roofType: 'sofa', baseColor: '#8e44ad', roofColor: '#6c3483', icon: '🛋️' },
        { name: 'Silla', floors: 0, roofType: 'chair', baseColor: '#d35400', roofColor: '#a04000', icon: '🪑' },
        { name: 'Cama', floors: 0, roofType: 'bed', baseColor: '#2980b9', roofColor: '#1a5276', icon: '🛏️' },
        { name: 'Escritorio', floors: 0, roofType: 'desk', baseColor: '#795548', roofColor: '#5d4037', icon: '🖥️' },
        { name: 'TV', floors: 0, roofType: 'tv', baseColor: '#2c3e50', roofColor: '#1a252f', icon: '📺' },
        { name: 'Planta', floors: 0, roofType: 'plant', baseColor: '#27ae60', roofColor: '#1e8449', icon: '🪴' },
        { name: 'Cuadro', floors: 0, roofType: 'painting', baseColor: '#f39c12', roofColor: '#d68910', icon: '🖼️' },
        { name: 'Lampara', floors: 0, roofType: 'lamp', baseColor: '#f1c40f', roofColor: '#d4ac0d', icon: '💡' },
        { name: 'Estante', floors: 0, roofType: 'shelf', baseColor: '#a0522d', roofColor: '#8b4513', icon: '📖' },
        { name: 'Alfombra', floors: 0, roofType: 'rug', baseColor: '#c0392b', roofColor: '#922b21', icon: '🟥' }
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
        { name: 'Solar', floors: 0, roofType: 'solar', baseColor: '#1565c0', roofColor: '#0d47a1', icon: '☀️' },
        { name: 'Eolica', floors: 0, roofType: 'windmill', baseColor: '#eceff1', roofColor: '#b0bec5', icon: '💨' },
        { name: 'Jardin V.', floors: 2, roofType: 'greenroof', baseColor: '#6d4c41', roofColor: '#4caf50', windows: true, icon: '🌱' },
        { name: 'Agua', floors: 0, roofType: 'watertank', baseColor: '#0097a7', roofColor: '#00838f', icon: '💧' },
        { name: 'Bateria', floors: 1, roofType: 'flat', baseColor: '#43a047', roofColor: '#2e7d32', icon: '🔋' },
        { name: 'Bambu', floors: 3, roofType: 'flat', baseColor: '#a5d6a7', roofColor: '#81c784', windows: true, icon: '🏗️' },
        { name: 'Eco Casa', floors: 2, roofType: 'gable', baseColor: '#c8e6c9', roofColor: '#66bb6a', windows: true, icon: '🏡' },
        { name: 'Reciclaje', floors: 0, roofType: 'recycle', baseColor: '#4caf50', roofColor: '#388e3c', icon: '♻️' },
        { name: 'Huerto', floors: 0, roofType: 'garden', baseColor: '#795548', roofColor: '#4caf50', icon: '🌱' },
        { name: 'Bici Park', floors: 0, roofType: 'bikepark', baseColor: '#78909c', roofColor: '#546e7a', icon: '🚲' }
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

    const originX = W / 2;
    const originY = 60;

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
        // Room interior: walls + wooden floor perspective
        ctx.fillStyle = '#f5e6ca'; ctx.fillRect(0, 0, W, H); // Back wall
        // Wall details
        ctx.fillStyle = '#e8d5b0'; ctx.fillRect(0, 0, W, originY - 10);
        // Wainscoting
        ctx.fillStyle = '#d4c4a8'; ctx.fillRect(0, originY - 30, W, 20);
        ctx.strokeStyle = '#c9b896'; ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, originY-30); ctx.lineTo(x, originY-10); ctx.stroke(); }
        // Window on wall
        ctx.fillStyle = '#87CEEB'; ctx.fillRect(W/2-30, 10, 60, 35);
        ctx.strokeStyle = '#f0e6d3'; ctx.lineWidth = 4; ctx.strokeRect(W/2-30, 10, 60, 35);
        ctx.strokeStyle = '#f0e6d3'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(W/2, 10); ctx.lineTo(W/2, 45); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W/2-30, 27); ctx.lineTo(W/2+30, 27); ctx.stroke();
        // Curtains
        ctx.fillStyle = '#c0392b44'; ctx.fillRect(W/2-38, 8, 12, 40); ctx.fillRect(W/2+26, 8, 12, 40);
        // Floor area gradient
        const floorG = ctx.createLinearGradient(0, originY, 0, H);
        floorG.addColorStop(0, '#deb887'); floorG.addColorStop(1, '#c49a6c');
        ctx.fillStyle = floorG; ctx.fillRect(0, originY - 10, W, H);
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
        // === INTERIORES ITEMS ===
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

    // ---------- INTERIORES ----------
    function drawInterioresItem(x, y, hw, hh, item) {
        const rt = item.roofType;
        if (rt === 'sofa') {
            // 3D sofa
            drawBox(x, y, TILE_W, 10, item.baseColor);
            // Backrest
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.fillRect(x - hw, y + hh - 16, hw * 0.4, 8);
            // Cushions
            ctx.fillStyle = lighten(item.baseColor, 30);
            const top = y - 10;
            ctx.beginPath(); ctx.moveTo(x, top+TILE_H); ctx.lineTo(x+hw, top+hh); ctx.lineTo(x, top); ctx.lineTo(x-hw, top+hh); ctx.closePath();
            ctx.fill();
        } else if (rt === 'chair') {
            // Legs
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(x-8, y+2, 2, 12); ctx.fillRect(x+6, y+2, 2, 12);
            // Seat
            drawBox(x, y, TILE_W * 0.6, 6, item.baseColor);
            // Back
            ctx.fillStyle = darken(item.baseColor, 20);
            ctx.fillRect(x - 10, y + hh - 20, 3, 14);
        } else if (rt === 'bed') {
            drawBox(x, y, TILE_W, 8, '#ecf0f1'); // Mattress
            // Pillow
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.ellipse(x - 8, y + hh - 10, 8, 4, -0.4, 0, Math.PI * 2); ctx.fill();
            // Blanket
            ctx.fillStyle = item.baseColor;
            const top = y - 8;
            ctx.beginPath(); ctx.moveTo(x+5, top+TILE_H); ctx.lineTo(x+hw, top+hh+4); ctx.lineTo(x+5, top+6); ctx.lineTo(x-hw+10, top+hh+4); ctx.closePath();
            ctx.fill();
        } else if (rt === 'desk') {
            // Table top
            drawBox(x, y, TILE_W, 10, item.baseColor);
            // Monitor
            ctx.fillStyle = '#2c3e50'; ctx.fillRect(x-6, y+hh-22, 12, 10);
            ctx.fillStyle = '#3498db'; ctx.fillRect(x-5, y+hh-21, 10, 8);
            ctx.fillStyle = '#455A64'; ctx.fillRect(x-1, y+hh-12, 2, 4);
        } else if (rt === 'tv') {
            // TV stand
            drawBox(x, y, TILE_W * 0.8, 6, '#5d4037');
            // TV screen
            ctx.fillStyle = '#1a1a2e'; ctx.fillRect(x-14, y+hh-24, 28, 16);
            ctx.fillStyle = '#2196F3'; ctx.fillRect(x-12, y+hh-22, 24, 12);
            ctx.fillStyle = '#455A64'; ctx.fillRect(x-1, y+hh-8, 2, 3);
        } else if (rt === 'plant') {
            // Pot
            ctx.fillStyle = '#8D6E63';
            ctx.beginPath(); ctx.moveTo(x-6, y+4); ctx.lineTo(x+6, y+4); ctx.lineTo(x+4, y+14); ctx.lineTo(x-4, y+14); ctx.closePath(); ctx.fill();
            // Plant
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath(); ctx.arc(x, y-4, 10, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.arc(x-4, y-1, 7, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(x+5, y-2, 6, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'painting') {
            // Frame on wall - show as standing frame
            ctx.fillStyle = '#8D6E63'; ctx.fillRect(x-12, y+hh-20, 24, 18);
            ctx.fillStyle = item.baseColor; ctx.fillRect(x-10, y+hh-18, 20, 14);
            // Little landscape inside
            ctx.fillStyle = '#81D4FA'; ctx.fillRect(x-9, y+hh-17, 18, 7);
            ctx.fillStyle = '#66BB6A'; ctx.fillRect(x-9, y+hh-10, 18, 5);
            ctx.fillStyle = '#FFD54F'; ctx.beginPath(); ctx.arc(x+4, y+hh-14, 2, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'lamp') {
            // Pole
            ctx.fillStyle = '#616161'; ctx.fillRect(x-1, y-8, 2, 22);
            // Base
            ctx.fillStyle = '#424242'; ctx.beginPath(); ctx.ellipse(x, y+14, 6, 3, 0, 0, Math.PI*2); ctx.fill();
            // Shade
            ctx.fillStyle = item.baseColor;
            ctx.beginPath(); ctx.moveTo(x-8, y-6); ctx.lineTo(x+8, y-6); ctx.lineTo(x+5, y-14); ctx.lineTo(x-5, y-14); ctx.closePath(); ctx.fill();
            // Glow
            ctx.fillStyle = 'rgba(255,241,118,0.3)'; ctx.beginPath(); ctx.arc(x, y-10, 12, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'shelf') {
            // Bookshelf
            drawBox(x, y, TILE_W * 0.8, 28, '#795548');
            // Books
            const colors = ['#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa'];
            for (let i = 0; i < 5; i++) {
                ctx.fillStyle = colors[i]; ctx.fillRect(x - 10 + i*4, y+hh-26, 3, 8);
                ctx.fillRect(x - 10 + i*4, y+hh-16, 3, 8);
            }
        } else if (rt === 'rug') {
            // Flat rug on floor
            ctx.globalAlpha = 0.7;
            drawDiamond(x, y, item.baseColor, darken(item.baseColor, 30), false);
            // Pattern
            ctx.fillStyle = lighten(item.baseColor, 40);
            ctx.beginPath();
            ctx.moveTo(x, y+4); ctx.lineTo(x+hw*0.4, y+hh); ctx.lineTo(x, y+TILE_H-4); ctx.lineTo(x-hw*0.4, y+hh); ctx.closePath();
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

    // ---------- SOSTENIBLE ----------
    function drawSostenibleItem(x, y, hw, hh, floorH, totalH, item) {
        const rt = item.roofType;
        if (rt === 'solar') {
            // Solar panel angled
            ctx.fillStyle = '#0D47A1';
            ctx.beginPath(); ctx.moveTo(x-hw+4,y+hh); ctx.lineTo(x+hw-4,y+hh-4); ctx.lineTo(x+hw-4,y+hh-14); ctx.lineTo(x-hw+4,y+hh-10); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#1565C0';
            ctx.beginPath(); ctx.moveTo(x-hw+4,y+hh-10); ctx.lineTo(x+hw-4,y+hh-14); ctx.lineTo(x, y-12); ctx.lineTo(x-hw+8,y+hh-12); ctx.closePath(); ctx.fill();
            // Grid lines
            ctx.strokeStyle = '#42A5F5'; ctx.lineWidth = 0.5;
            for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x-hw+4+i*6, y+hh-10); ctx.lineTo(x-hw+4+i*8, y-4); ctx.stroke(); }
            // Shine
            ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(x-4, y+hh-12, 10, 4);
        } else if (rt === 'windmill') {
            // Tower
            ctx.fillStyle = '#ECEFF1'; ctx.fillRect(x-3, y-30, 6, 34);
            ctx.fillStyle = '#B0BEC5'; ctx.fillRect(x-5, y+2, 10, 4);
            // Blades
            ctx.strokeStyle = '#CFD8DC'; ctx.lineWidth = 2;
            const cx = x, cy = y - 30;
            for (let a = 0; a < 3; a++) {
                const angle = a * (Math.PI * 2 / 3) + Date.now() * 0.002;
                ctx.beginPath(); ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(angle) * 18, cy + Math.sin(angle) * 18); ctx.stroke();
            }
            ctx.fillStyle = '#455A64'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'greenroof') {
            drawBox(x, y, TILE_W, totalH, item.baseColor);
            if (item.windows) {
                for (let f = 0; f < item.floors; f++) {
                    ctx.fillStyle = '#BBDEFB';
                    const fy = y + TILE_H - totalH + f*floorH + 3;
                    ctx.fillRect(x-hw+6, fy, 5, 5); ctx.fillRect(x+5, fy+4, 5, 5);
                }
            }
            // Green roof top
            ctx.fillStyle = '#4CAF50';
            const top = y - totalH;
            ctx.beginPath(); ctx.moveTo(x, top+TILE_H); ctx.lineTo(x+hw, top+hh); ctx.lineTo(x, top); ctx.lineTo(x-hw, top+hh); ctx.closePath(); ctx.fill();
            // Little plants on top
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.arc(x-5, top+hh-2, 3, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(x+4, top+hh-1, 2.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(x, top+4, 3, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'watertank') {
            // Cylinder tank
            ctx.fillStyle = '#00838F';
            ctx.fillRect(x-10, y-8, 20, 18);
            ctx.fillStyle = '#0097A7';
            ctx.beginPath(); ctx.ellipse(x, y-8, 10, 5, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#00ACC1';
            ctx.beginPath(); ctx.ellipse(x, y-8, 8, 4, 0, 0, Math.PI*2); ctx.fill();
            // Water drops
            ctx.fillStyle = '#4FC3F7'; ctx.font = '8px serif'; ctx.textAlign = 'center'; ctx.fillText('💧', x, y-2);
        } else if (rt === 'recycle') {
            // Recycle bins
            drawBox(x, y, TILE_W * 0.5, 14, '#4CAF50');
            ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('♻', x, y+4);
            // Second bin
            ctx.fillStyle = darken('#2196F3', 25);
            ctx.fillRect(x+8, y+hh-12, 10, 12);
            ctx.fillStyle = '#2196F3';
            ctx.fillRect(x+8, y+hh-14, 10, 3);
        } else if (rt === 'garden') {
            // Raised garden bed
            drawBox(x, y, TILE_W * 0.9, 6, '#795548');
            // Soil
            ctx.fillStyle = '#5D4037';
            const top = y - 6;
            ctx.beginPath(); ctx.moveTo(x, top+TILE_H); ctx.lineTo(x+hw*0.9, top+hh); ctx.lineTo(x, top); ctx.lineTo(x-hw*0.9, top+hh); ctx.closePath(); ctx.fill();
            // Plants growing
            ctx.fillStyle = '#66BB6A';
            for (let i = 0; i < 5; i++) {
                const px = x - 10 + i*5, py = top + hh - 2;
                ctx.fillRect(px, py - 6, 1.5, 6);
                ctx.beginPath(); ctx.arc(px+0.5, py-7, 2.5, 0, Math.PI*2); ctx.fill();
            }
        } else if (rt === 'bikepark') {
            // Bike rack
            ctx.fillStyle = '#78909C'; ctx.fillRect(x-14, y+4, 28, 2);
            ctx.fillStyle = '#546E7A';
            for (let i = 0; i < 4; i++) ctx.fillRect(x-12+i*8, y-2, 2, 8);
            // Bike
            ctx.strokeStyle = '#37474F'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(x-4, y+2, 5, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(x+6, y+2, 5, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x-4, y+2); ctx.lineTo(x+1, y-4); ctx.lineTo(x+6, y+2); ctx.stroke();
        } else if (rt === 'gable' || rt === 'flat') {
            // Generic eco building
            drawBox(x, y, TILE_W, totalH, item.baseColor);
            if (item.windows) {
                for (let f = 0; f < item.floors; f++) {
                    ctx.fillStyle = '#BBDEFB';
                    const fy = y + TILE_H - totalH + f*floorH + 3;
                    ctx.fillRect(x-hw+6, fy, 5, 5); ctx.fillRect(x+5, fy+4, 5, 5);
                }
            }
            if (item.floors >= 1) { ctx.fillStyle = '#5D4037'; ctx.fillRect(x-5, y+TILE_H-10, 5, 8); }
            if (rt === 'gable') {
                const rb = y - totalH, rp = rb - 14;
                ctx.beginPath(); ctx.moveTo(x-hw-2, rb+hh); ctx.lineTo(x, rp); ctx.lineTo(x, rb+TILE_H); ctx.closePath();
                ctx.fillStyle = item.roofColor; ctx.fill();
                ctx.beginPath(); ctx.moveTo(x, rb+TILE_H); ctx.lineTo(x, rp); ctx.lineTo(x+hw+2, rb+hh); ctx.closePath();
                ctx.fillStyle = darken(item.roofColor, 20); ctx.fill();
            }
        }
    }

    // ========== RENDER LOOP ==========
    function render() {
        ctx.clearRect(0, 0, W, H);
        bgDrawers[subtype]();

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
                    if (isHover && selectedTool && selectedTool.name !== 'eraser') {
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
    }

    canvas.addEventListener('mousemove', (e) => {
        const pos = getMousePos(e);
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
