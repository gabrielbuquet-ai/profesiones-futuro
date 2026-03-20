// ==========================================
// PINTURA - Modos de pintura interactivos
// (Acuarela, Oleo, Graffiti, Dibujo)
// ==========================================

function startPintura(subtypeId) {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('game-container');
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');

    canvas.style.display = 'block';
    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    ctx.setTransform(2, 0, 0, 2, 0, 0);

    const W = container.clientWidth;
    const H = container.clientHeight;

    switch (subtypeId) {
        case 'acuarela': pinturaAcuarela(canvas, ctx, W, H, ui, controls); break;
        case 'oleo': pinturaOleo(canvas, ctx, W, H, ui, controls); break;
        case 'graffiti': pinturaGraffiti(canvas, ctx, W, H, ui, controls); break;
        case 'dibujo': pinturaDibujo(canvas, ctx, W, H, ui, controls); break;
    }
}

// ==========================================
// SHARED UTILITIES
// ==========================================

function _pinturaCreateEngine(canvas, ctx, W, H, ui, controls, config) {
    // --- State ---
    const TOOLBAR_H = 64;
    const CANVAS_H = H - TOOLBAR_H;
    let painting = false;
    let lastX = 0, lastY = 0;
    let currentColor = config.colors[0].hex;
    let currentColorName = config.colors[0].name;
    let brushSize = config.brushSizes[1]; // medium default
    let brushSizeIdx = 1;
    let opacity = config.defaultOpacity || 1.0;
    let activeTool = config.defaultTool || 'brush';
    let undoStack = [];
    const MAX_UNDO = 20;
    let strokeCount = 0;
    let colorsUsed = new Set();

    // --- Save initial state ---
    function saveUndo() {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        undoStack.push(data);
        if (undoStack.length > MAX_UNDO) undoStack.shift();
    }

    function undo() {
        if (undoStack.length > 0) {
            const data = undoStack.pop();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.putImageData(data, 0, 0);
            ctx.setTransform(2, 0, 0, 2, 0, 0);
        }
    }

    // --- Clear with background ---
    function clearCanvas() {
        ctx.save();
        ctx.setTransform(2, 0, 0, 2, 0, 0);
        if (config.drawBackground) {
            config.drawBackground(ctx, W, CANVAS_H);
        } else {
            ctx.fillStyle = config.bgColor || '#ffffff';
            ctx.fillRect(0, 0, W, CANVAS_H);
        }
        ctx.restore();
        strokeCount = 0;
        colorsUsed.clear();
    }

    // --- Gallery rating ---
    function showGallery() {
        // Analyze canvas for rating
        const imgData = ctx.getImageData(0, 0, canvas.width, Math.floor(CANVAS_H * 2));
        const pixels = imgData.data;
        let nonBgPixels = 0;
        const totalPixels = imgData.width * imgData.height;
        const bgR = parseInt((config.bgColor || '#ffffff').slice(1, 3), 16);
        const bgG = parseInt((config.bgColor || '#ffffff').slice(3, 5), 16);
        const bgB = parseInt((config.bgColor || '#ffffff').slice(5, 7), 16);

        for (let i = 0; i < pixels.length; i += 16) { // sample every 4th pixel
            const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
            if (Math.abs(r - bgR) > 20 || Math.abs(g - bgG) > 20 || Math.abs(b - bgB) > 20) {
                nonBgPixels++;
            }
        }

        const coverage = nonBgPixels / (totalPixels / 4);
        const colorCount = colorsUsed.size;

        let stars = 1;
        if (coverage > 0.05) stars = 2;
        if (coverage > 0.15 && colorCount >= 3) stars = 3;
        if (coverage > 0.30 && colorCount >= 5) stars = 4;
        if (coverage > 0.45 && colorCount >= 7 && strokeCount >= 20) stars = 5;

        const starStr = '★'.repeat(stars) + '☆'.repeat(5 - stars);
        const pts = stars * 20;
        setScore(pts);

        // Create overlay showing the artwork
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;';

        // Snapshot of canvas
        const snap = document.createElement('canvas');
        snap.width = canvas.width;
        snap.height = Math.floor(CANVAS_H * 2);
        const snapCtx = snap.getContext('2d');
        snapCtx.drawImage(canvas, 0, 0, canvas.width, Math.floor(CANVAS_H * 2), 0, 0, snap.width, snap.height);

        const img = document.createElement('img');
        img.src = snap.toDataURL();
        img.style.cssText = 'max-width:80%;max-height:55%;border:4px solid #fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);';

        const title = document.createElement('div');
        title.style.cssText = 'color:#fff;font-size:22px;font-weight:bold;margin:12px 0 6px;';
        title.textContent = 'Tu Obra de Arte';

        const rating = document.createElement('div');
        rating.style.cssText = 'color:#ffd700;font-size:36px;margin:8px 0;';
        rating.textContent = starStr;

        const info = document.createElement('div');
        info.style.cssText = 'color:#ccc;font-size:14px;margin:4px 0 16px;';
        info.textContent = `${colorCount} colores usados | ${strokeCount} trazos | ${Math.round(coverage * 100)}% cobertura | ${pts} pts`;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Volver a Pintar';
        closeBtn.style.cssText = 'padding:10px 28px;font-size:16px;border:none;border-radius:8px;background:#4CAF50;color:#fff;cursor:pointer;';
        closeBtn.onclick = () => overlay.remove();

        overlay.appendChild(title);
        overlay.appendChild(img);
        overlay.appendChild(rating);
        overlay.appendChild(info);
        overlay.appendChild(closeBtn);
        ui.appendChild(overlay);
    }

    // --- Pointer helpers ---
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width;
        const scaleY = H / rect.height;
        let cx, cy;
        if (e.touches) {
            cx = (e.touches[0].clientX - rect.left) * scaleX;
            cy = (e.touches[0].clientY - rect.top) * scaleY;
        } else {
            cx = (e.clientX - rect.left) * scaleX;
            cy = (e.clientY - rect.top) * scaleY;
        }
        return { x: cx, y: cy };
    }

    // --- Build toolbar ---
    function buildToolbar() {
        controls.innerHTML = '';
        controls.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:4px 8px;justify-content:center;';

        // Color palette (compact)
        const colorWrap = document.createElement('div');
        colorWrap.style.cssText = 'display:flex;gap:2px;flex-wrap:wrap;max-width:200px;';
        const initialColors = config.colors.slice(0, 10);
        const extraColors = config.colors.slice(10);
        let showingExtra = false;

        function renderColors(list) {
            colorWrap.innerHTML = '';
            list.forEach(c => {
                const btn = document.createElement('div');
                btn.title = c.name;
                btn.style.cssText = `width:22px;height:22px;border-radius:50%;background:${c.hex};cursor:pointer;border:2px solid ${c.hex === currentColor ? '#fff' : 'transparent'};box-shadow:${c.hex === currentColor ? '0 0 4px #fff' : 'none'};`;
                btn.onclick = () => {
                    currentColor = c.hex;
                    currentColorName = c.name;
                    activeTool = config.defaultTool || 'brush';
                    colorLabel.textContent = c.name;
                    renderColors(showingExtra ? config.colors : initialColors);
                };
                colorWrap.appendChild(btn);
            });
            if (extraColors.length > 0) {
                const moreBtn = document.createElement('div');
                moreBtn.style.cssText = 'width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,red,yellow,green,blue);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:bold;';
                moreBtn.textContent = showingExtra ? '-' : '+';
                moreBtn.title = showingExtra ? 'Menos colores' : 'Mas colores';
                moreBtn.onclick = () => {
                    showingExtra = !showingExtra;
                    renderColors(showingExtra ? config.colors : initialColors);
                };
                colorWrap.appendChild(moreBtn);
            }
        }
        renderColors(initialColors);
        controls.appendChild(colorWrap);

        // Color label
        const colorLabel = document.createElement('span');
        colorLabel.textContent = currentColorName;
        colorLabel.style.cssText = 'font-size:11px;color:#fff;min-width:50px;text-align:center;';
        controls.appendChild(colorLabel);

        // Separator
        const sep = () => { const s = document.createElement('div'); s.style.cssText = 'width:1px;height:28px;background:#555;margin:0 4px;'; return s; };
        controls.appendChild(sep());

        // Brush sizes
        config.brushSizes.forEach((sz, i) => {
            const btn = document.createElement('div');
            const dotSz = Math.min(sz * 1.5, 20);
            btn.style.cssText = `width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:6px;background:${i === brushSizeIdx ? '#555' : 'transparent'};`;
            const dot = document.createElement('div');
            dot.style.cssText = `width:${dotSz}px;height:${dotSz}px;border-radius:50%;background:#fff;`;
            btn.appendChild(dot);
            btn.title = ['Pequeno', 'Mediano', 'Grande'][i];
            btn.onclick = () => {
                brushSizeIdx = i;
                brushSize = sz;
                buildToolbar();
            };
            controls.appendChild(btn);
        });

        controls.appendChild(sep());

        // Opacity slider (if mode uses it)
        if (config.showOpacity) {
            const opSlider = document.createElement('input');
            opSlider.type = 'range';
            opSlider.min = '10';
            opSlider.max = '100';
            opSlider.value = Math.round(opacity * 100);
            opSlider.style.cssText = 'width:60px;cursor:pointer;';
            opSlider.title = 'Opacidad';
            opSlider.oninput = () => { opacity = opSlider.value / 100; };
            controls.appendChild(opSlider);
            controls.appendChild(sep());
        }

        // Mode-specific tools
        if (config.extraTools) {
            config.extraTools.forEach(tool => {
                const btn = document.createElement('button');
                btn.textContent = tool.icon;
                btn.title = tool.name;
                btn.style.cssText = `padding:4px 8px;font-size:16px;border:none;border-radius:6px;cursor:pointer;background:${activeTool === tool.id ? '#4CAF50' : '#333'};color:#fff;`;
                btn.onclick = () => {
                    activeTool = tool.id;
                    buildToolbar();
                    if (tool.onActivate) tool.onActivate();
                };
                controls.appendChild(btn);
            });
            controls.appendChild(sep());
        }

        // Eraser
        const eraserBtn = document.createElement('button');
        eraserBtn.textContent = '🧹';
        eraserBtn.title = 'Borrador (E)';
        eraserBtn.style.cssText = `padding:4px 8px;font-size:16px;border:none;border-radius:6px;cursor:pointer;background:${activeTool === 'eraser' ? '#4CAF50' : '#333'};color:#fff;`;
        eraserBtn.onclick = () => { activeTool = 'eraser'; buildToolbar(); };
        controls.appendChild(eraserBtn);

        // Undo
        const undoBtn = document.createElement('button');
        undoBtn.textContent = '↩';
        undoBtn.title = 'Deshacer (Ctrl+Z)';
        undoBtn.style.cssText = 'padding:4px 8px;font-size:16px;border:none;border-radius:6px;cursor:pointer;background:#333;color:#fff;';
        undoBtn.onclick = undo;
        controls.appendChild(undoBtn);

        // Clear
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🗑️';
        clearBtn.title = 'Borrar todo';
        clearBtn.style.cssText = 'padding:4px 8px;font-size:16px;border:none;border-radius:6px;cursor:pointer;background:#333;color:#fff;';
        clearBtn.onclick = () => {
            if (confirm('Borrar todo el lienzo?')) {
                saveUndo();
                clearCanvas();
            }
        };
        controls.appendChild(clearBtn);

        // Gallery
        const galleryBtn = document.createElement('button');
        galleryBtn.textContent = '🖼️';
        galleryBtn.title = 'Galeria';
        galleryBtn.style.cssText = 'padding:4px 10px;font-size:16px;border:none;border-radius:6px;cursor:pointer;background:#6a1b9a;color:#fff;';
        galleryBtn.onclick = showGallery;
        controls.appendChild(galleryBtn);
    }

    // --- Keyboard ---
    function onKeyDown(e) {
        if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); return; }
        if (e.key === 'e' || e.key === 'E') { activeTool = 'eraser'; buildToolbar(); return; }
        if (e.key === 'b' || e.key === 'B') { activeTool = config.defaultTool || 'brush'; buildToolbar(); return; }
        if (e.key >= '1' && e.key <= '9') {
            const idx = parseInt(e.key) - 1;
            if (idx < config.colors.length) {
                currentColor = config.colors[idx].hex;
                currentColorName = config.colors[idx].name;
                activeTool = config.defaultTool || 'brush';
                buildToolbar();
            }
            return;
        }
        if (e.key === '+' || e.key === '=') {
            brushSizeIdx = Math.min(brushSizeIdx + 1, config.brushSizes.length - 1);
            brushSize = config.brushSizes[brushSizeIdx];
            buildToolbar();
            return;
        }
        if (e.key === '-') {
            brushSizeIdx = Math.max(brushSizeIdx - 1, 0);
            brushSize = config.brushSizes[brushSizeIdx];
            buildToolbar();
            return;
        }
        // Pass to mode-specific handler
        if (config.onKey) config.onKey(e);
    }

    document.addEventListener('keydown', onKeyDown);

    // --- Draw initial bg ---
    clearCanvas();
    saveUndo();
    buildToolbar();

    // --- Cleanup ---
    function cleanup() {
        document.removeEventListener('keydown', onKeyDown);
        canvas.onpointerdown = null;
        canvas.onpointermove = null;
        canvas.onpointerup = null;
        canvas.onpointerleave = null;
        canvas.style.touchAction = '';
    }

    return {
        TOOLBAR_H, CANVAS_H,
        getPos, saveUndo, undo, clearCanvas,
        get painting() { return painting; },
        set painting(v) { painting = v; },
        get lastX() { return lastX; },
        set lastX(v) { lastX = v; },
        get lastY() { return lastY; },
        set lastY(v) { lastY = v; },
        get currentColor() { return currentColor; },
        get brushSize() { return brushSize; },
        get opacity() { return opacity; },
        get activeTool() { return activeTool; },
        set activeTool(v) { activeTool = v; buildToolbar(); },
        get strokeCount() { return strokeCount; },
        set strokeCount(v) { strokeCount = v; },
        colorsUsed,
        cleanup,
        buildToolbar
    };
}

// ==========================================
// 1. ACUARELA - Watercolor
// ==========================================

function pinturaAcuarela(canvas, ctx, W, H, ui, controls) {
    const colors = [
        { hex: '#e74c3c', name: 'Rojo' },
        { hex: '#e67e22', name: 'Naranja' },
        { hex: '#f1c40f', name: 'Amarillo' },
        { hex: '#2ecc71', name: 'Verde' },
        { hex: '#1abc9c', name: 'Turquesa' },
        { hex: '#3498db', name: 'Azul' },
        { hex: '#9b59b6', name: 'Morado' },
        { hex: '#e84393', name: 'Rosa' },
        { hex: '#795548', name: 'Marron' },
        { hex: '#2c3e50', name: 'Gris oscuro' },
        // Extra colors
        { hex: '#fd79a8', name: 'Rosa claro' },
        { hex: '#a29bfe', name: 'Lavanda' },
        { hex: '#55efc4', name: 'Menta' },
        { hex: '#ffeaa7', name: 'Crema' },
        { hex: '#dfe6e9', name: 'Gris claro' },
        { hex: '#636e72', name: 'Pizarra' }
    ];

    const eng = _pinturaCreateEngine(canvas, ctx, W, H, ui, controls, {
        colors,
        brushSizes: [6, 14, 28],
        defaultOpacity: 0.3,
        showOpacity: true,
        bgColor: '#faf8f5',
        defaultTool: 'brush',
        drawBackground: (ctx, w, h) => {
            // Watercolor paper texture
            ctx.fillStyle = '#faf8f5';
            ctx.fillRect(0, 0, w, h);
            ctx.globalAlpha = 0.03;
            for (let i = 0; i < 200; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#d4c5a9' : '#e8dcc8';
                ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 30 + 5, Math.random() * 3 + 1);
            }
            ctx.globalAlpha = 1;
        }
    });

    function drawWatercolor(x, y, lx, ly) {
        const dist = Math.sqrt((x - lx) ** 2 + (y - ly) ** 2);
        const steps = Math.max(Math.floor(dist / 2), 1);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const cx = lx + (x - lx) * t;
            const cy = ly + (y - ly) * t;

            // Soft blending multiple circles
            for (let j = 0; j < 3; j++) {
                const offsetX = (Math.random() - 0.5) * eng.brushSize * 0.6;
                const offsetY = (Math.random() - 0.5) * eng.brushSize * 0.6;
                const r = eng.brushSize * (0.6 + Math.random() * 0.5);

                ctx.globalAlpha = eng.opacity * (0.1 + Math.random() * 0.15);
                ctx.beginPath();
                ctx.arc(cx + offsetX, cy + offsetY, r, 0, Math.PI * 2);
                ctx.fillStyle = eng.currentColor;
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    function eraseAt(x, y, lx, ly) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = eng.brushSize * 2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
    }

    // --- Pointer events ---
    canvas.style.touchAction = 'none';

    canvas.onpointerdown = (e) => {
        const pos = eng.getPos(e);
        if (pos.y > eng.CANVAS_H) return;
        eng.saveUndo();
        eng.painting = true;
        eng.lastX = pos.x;
        eng.lastY = pos.y;
        eng.strokeCount++;
        eng.colorsUsed.add(eng.currentColor);
        addScore(1);

        if (eng.activeTool === 'brush') {
            drawWatercolor(pos.x, pos.y, pos.x, pos.y);
        }
    };

    canvas.onpointermove = (e) => {
        if (!eng.painting) return;
        const pos = eng.getPos(e);
        if (pos.y > eng.CANVAS_H) return;

        if (eng.activeTool === 'eraser') {
            eraseAt(pos.x, pos.y, eng.lastX, eng.lastY);
        } else {
            drawWatercolor(pos.x, pos.y, eng.lastX, eng.lastY);
        }
        eng.lastX = pos.x;
        eng.lastY = pos.y;
    };

    canvas.onpointerup = () => { eng.painting = false; };
    canvas.onpointerleave = () => { eng.painting = false; };

    currentGame = { cleanup: eng.cleanup };
}

// ==========================================
// 2. OLEO - Oil Painting
// ==========================================

function pinturaOleo(canvas, ctx, W, H, ui, controls) {
    const colors = [
        { hex: '#c0392b', name: 'Rojo cadmio' },
        { hex: '#e67e22', name: 'Naranja' },
        { hex: '#f39c12', name: 'Ocre' },
        { hex: '#d4ac0d', name: 'Oro viejo' },
        { hex: '#27ae60', name: 'Verde bosque' },
        { hex: '#1a5276', name: 'Azul prusia' },
        { hex: '#2e86c1', name: 'Azul cobalto' },
        { hex: '#6c3483', name: 'Violeta' },
        { hex: '#784212', name: 'Siena tostada' },
        { hex: '#1c2833', name: 'Negro marfil' },
        // Extra
        { hex: '#f5b7b1', name: 'Rosa carne' },
        { hex: '#abebc6', name: 'Verde claro' },
        { hex: '#a9cce3', name: 'Azul cielo' },
        { hex: '#fad7a0', name: 'Amarillo napoles' },
        { hex: '#ecf0f1', name: 'Blanco titanio' },
        { hex: '#5d4e37', name: 'Tierra sombra' },
        { hex: '#8e44ad', name: 'Magenta' },
        { hex: '#a04000', name: 'Rojo oxido' }
    ];

    // Smear buffer for palette knife
    let smearColor = null;

    const eng = _pinturaCreateEngine(canvas, ctx, W, H, ui, controls, {
        colors,
        brushSizes: [4, 10, 22],
        defaultOpacity: 0.85,
        showOpacity: true,
        bgColor: '#f5f0e8',
        defaultTool: 'brush',
        drawBackground: (ctx, w, h) => {
            // Linen canvas texture
            ctx.fillStyle = '#f5f0e8';
            ctx.fillRect(0, 0, w, h);
            ctx.globalAlpha = 0.06;
            ctx.strokeStyle = '#c8b89a';
            ctx.lineWidth = 0.5;
            for (let y = 0; y < h; y += 4) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y + (Math.random() - 0.5) * 2);
                ctx.stroke();
            }
            for (let x = 0; x < w; x += 4) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x + (Math.random() - 0.5) * 2, h);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        },
        extraTools: [
            {
                id: 'knife',
                icon: '🔪',
                name: 'Espatula (mezclar)',
                onActivate: () => { smearColor = null; }
            }
        ]
    });

    function drawOilStroke(x, y, lx, ly) {
        const dist = Math.sqrt((x - lx) ** 2 + (y - ly) ** 2);
        const steps = Math.max(Math.floor(dist), 1);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const cx = lx + (x - lx) * t;
            const cy = ly + (y - ly) * t;

            // Varying width for oil texture
            const widthVar = eng.brushSize * (0.8 + Math.random() * 0.4);

            ctx.globalAlpha = eng.opacity * (0.7 + Math.random() * 0.3);
            ctx.beginPath();
            ctx.arc(cx + (Math.random() - 0.5) * 2, cy + (Math.random() - 0.5) * 2, widthVar / 2, 0, Math.PI * 2);
            ctx.fillStyle = eng.currentColor;
            ctx.fill();

            // Thick impasto highlight
            if (Math.random() > 0.7) {
                ctx.globalAlpha = eng.opacity * 0.3;
                ctx.beginPath();
                ctx.arc(cx - 1, cy - 1, widthVar * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    function smearAt(x, y, lx, ly) {
        // Read color under pointer to blend
        const px = Math.floor(x * 2);
        const py = Math.floor(y * 2);
        const sampleData = ctx.getImageData(px, py, 1, 1).data;
        const sampledColor = `rgba(${sampleData[0]},${sampleData[1]},${sampleData[2]},${sampleData[3] / 255})`;

        if (smearColor) {
            // Blend smear color with sampled
            ctx.globalAlpha = 0.4;
            const dist = Math.sqrt((x - lx) ** 2 + (y - ly) ** 2);
            const steps = Math.max(Math.floor(dist), 1);
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const cx = lx + (x - lx) * t;
                const cy = ly + (y - ly) * t;
                const r = eng.brushSize * (0.7 + Math.random() * 0.3);
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fillStyle = smearColor;
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        smearColor = sampledColor;
    }

    function eraseAt(x, y, lx, ly) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = eng.brushSize * 2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
    }

    canvas.style.touchAction = 'none';

    canvas.onpointerdown = (e) => {
        const pos = eng.getPos(e);
        if (pos.y > eng.CANVAS_H) return;
        eng.saveUndo();
        eng.painting = true;
        eng.lastX = pos.x;
        eng.lastY = pos.y;
        eng.strokeCount++;
        eng.colorsUsed.add(eng.currentColor);
        addScore(1);

        if (eng.activeTool === 'brush') {
            drawOilStroke(pos.x, pos.y, pos.x, pos.y);
        } else if (eng.activeTool === 'knife') {
            smearColor = null;
            smearAt(pos.x, pos.y, pos.x, pos.y);
        }
    };

    canvas.onpointermove = (e) => {
        if (!eng.painting) return;
        const pos = eng.getPos(e);
        if (pos.y > eng.CANVAS_H) return;

        if (eng.activeTool === 'eraser') {
            eraseAt(pos.x, pos.y, eng.lastX, eng.lastY);
        } else if (eng.activeTool === 'knife') {
            smearAt(pos.x, pos.y, eng.lastX, eng.lastY);
        } else {
            drawOilStroke(pos.x, pos.y, eng.lastX, eng.lastY);
        }
        eng.lastX = pos.x;
        eng.lastY = pos.y;
    };

    canvas.onpointerup = () => { eng.painting = false; smearColor = null; };
    canvas.onpointerleave = () => { eng.painting = false; smearColor = null; };

    currentGame = { cleanup: eng.cleanup };
}

// ==========================================
// 3. GRAFFITI - Street Art / Spray
// ==========================================

function pinturaGraffiti(canvas, ctx, W, H, ui, controls) {
    const colors = [
        { hex: '#ff0040', name: 'Rojo neon' },
        { hex: '#ff6600', name: 'Naranja neon' },
        { hex: '#ffff00', name: 'Amarillo neon' },
        { hex: '#00ff41', name: 'Verde neon' },
        { hex: '#00ffff', name: 'Cyan neon' },
        { hex: '#0080ff', name: 'Azul electrico' },
        { hex: '#bf00ff', name: 'Violeta neon' },
        { hex: '#ff00ff', name: 'Magenta neon' },
        { hex: '#ff69b4', name: 'Rosa neon' },
        { hex: '#ffffff', name: 'Blanco' },
        // Extra
        { hex: '#c0c0c0', name: 'Plata' },
        { hex: '#ffd700', name: 'Oro' },
        { hex: '#ff1493', name: 'Rosa fuerte' },
        { hex: '#7cfc00', name: 'Verde lima' },
        { hex: '#00ced1', name: 'Turquesa' },
        { hex: '#ff4500', name: 'Rojo fuego' }
    ];

    let activeStencil = null;
    const stencils = [
        { id: 'star', name: 'Estrella', icon: '⭐' },
        { id: 'heart', name: 'Corazon', icon: '❤️' },
        { id: 'arrow', name: 'Flecha', icon: '➡️' },
        { id: 'smiley', name: 'Cara feliz', icon: '😊' }
    ];

    const eng = _pinturaCreateEngine(canvas, ctx, W, H, ui, controls, {
        colors,
        brushSizes: [8, 18, 35],
        defaultOpacity: 0.6,
        showOpacity: false,
        bgColor: '#2c2c2c',
        defaultTool: 'spray',
        drawBackground: (ctx, w, h) => {
            // Dark brick wall
            ctx.fillStyle = '#2c2c2c';
            ctx.fillRect(0, 0, w, h);
            // Brick pattern
            ctx.globalAlpha = 0.08;
            const bw = 40, bh = 20;
            for (let row = 0; row < Math.ceil(h / bh); row++) {
                const offset = (row % 2) * (bw / 2);
                for (let col = -1; col < Math.ceil(w / bw) + 1; col++) {
                    ctx.strokeStyle = '#555';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(col * bw + offset, row * bh, bw - 2, bh - 2);
                }
            }
            // Random dirt/marks
            for (let i = 0; i < 50; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#222' : '#383838';
                ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 20 + 3, Math.random() * 8 + 2);
            }
            ctx.globalAlpha = 1;
        },
        extraTools: stencils.map(s => ({
            id: 'stencil_' + s.id,
            icon: s.icon,
            name: 'Plantilla: ' + s.name,
            onActivate: () => { activeStencil = s.id; }
        }))
    });

    function sprayAt(x, y) {
        const radius = eng.brushSize;
        const density = Math.floor(radius * 1.5);

        for (let i = 0; i < density; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius;
            const px = x + Math.cos(angle) * dist;
            const py = y + Math.sin(angle) * dist;
            const dotSize = Math.random() * 2 + 0.5;

            // More particles near center (gaussian-ish)
            const falloff = 1 - (dist / radius);
            ctx.globalAlpha = falloff * 0.5 * (0.3 + Math.random() * 0.4);
            ctx.fillStyle = eng.currentColor;
            ctx.beginPath();
            ctx.arc(px, py, dotSize, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function drawStencil(x, y, stencilId) {
        const sz = eng.brushSize * 3;
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = eng.currentColor;

        switch (stencilId) {
            case 'star': {
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const px = x + Math.cos(angle) * sz;
                    const py = y + Math.sin(angle) * sz;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                // Spray effect over stencil
                for (let i = 0; i < 60; i++) {
                    const a = Math.random() * Math.PI * 2;
                    const d = Math.random() * sz * 0.8;
                    ctx.globalAlpha = Math.random() * 0.3;
                    ctx.beginPath();
                    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 1 + Math.random() * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            }
            case 'heart': {
                ctx.beginPath();
                const topY = y - sz * 0.5;
                ctx.moveTo(x, y + sz);
                ctx.bezierCurveTo(x - sz * 1.5, y - sz * 0.2, x - sz * 0.8, topY - sz * 0.6, x, topY + sz * 0.2);
                ctx.bezierCurveTo(x + sz * 0.8, topY - sz * 0.6, x + sz * 1.5, y - sz * 0.2, x, y + sz);
                ctx.fill();
                break;
            }
            case 'arrow': {
                ctx.beginPath();
                ctx.moveTo(x + sz, y);
                ctx.lineTo(x + sz * 0.4, y - sz * 0.5);
                ctx.lineTo(x + sz * 0.4, y - sz * 0.2);
                ctx.lineTo(x - sz, y - sz * 0.2);
                ctx.lineTo(x - sz, y + sz * 0.2);
                ctx.lineTo(x + sz * 0.4, y + sz * 0.2);
                ctx.lineTo(x + sz * 0.4, y + sz * 0.5);
                ctx.closePath();
                ctx.fill();
                break;
            }
            case 'smiley': {
                // Face
                ctx.beginPath();
                ctx.arc(x, y, sz, 0, Math.PI * 2);
                ctx.fill();
                // Eyes and mouth in black
                ctx.fillStyle = '#000';
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(x - sz * 0.35, y - sz * 0.25, sz * 0.12, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + sz * 0.35, y - sz * 0.25, sz * 0.12, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y + sz * 0.1, sz * 0.45, 0.1, Math.PI - 0.1);
                ctx.lineWidth = sz * 0.08;
                ctx.strokeStyle = '#000';
                ctx.stroke();
                break;
            }
        }
        ctx.restore();
    }

    function eraseAt(x, y, lx, ly) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = eng.brushSize * 2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
    }

    canvas.style.touchAction = 'none';

    canvas.onpointerdown = (e) => {
        const pos = eng.getPos(e);
        if (pos.y > eng.CANVAS_H) return;
        eng.saveUndo();
        eng.painting = true;
        eng.lastX = pos.x;
        eng.lastY = pos.y;
        eng.strokeCount++;
        eng.colorsUsed.add(eng.currentColor);
        addScore(1);

        if (eng.activeTool.startsWith('stencil_')) {
            const sid = eng.activeTool.replace('stencil_', '');
            drawStencil(pos.x, pos.y, sid);
            eng.painting = false; // Stencil is single-click
        } else if (eng.activeTool === 'spray') {
            sprayAt(pos.x, pos.y);
        }
    };

    canvas.onpointermove = (e) => {
        if (!eng.painting) return;
        const pos = eng.getPos(e);
        if (pos.y > eng.CANVAS_H) return;

        if (eng.activeTool === 'eraser') {
            eraseAt(pos.x, pos.y, eng.lastX, eng.lastY);
        } else if (eng.activeTool === 'spray') {
            sprayAt(pos.x, pos.y);
        }
        eng.lastX = pos.x;
        eng.lastY = pos.y;
    };

    canvas.onpointerup = () => { eng.painting = false; };
    canvas.onpointerleave = () => { eng.painting = false; };

    currentGame = { cleanup: eng.cleanup };
}

// ==========================================
// 4. DIBUJO - Drawing / Sketch
// ==========================================

function pinturaDibujo(canvas, ctx, W, H, ui, controls) {
    const colors = [
        { hex: '#333333', name: 'Grafito' },
        { hex: '#1a1a1a', name: 'Negro' },
        { hex: '#666666', name: 'Gris medio' },
        { hex: '#999999', name: 'Gris claro' },
        { hex: '#4a2c17', name: 'Sepia' },
        { hex: '#c0392b', name: 'Rojo' },
        { hex: '#2e86c1', name: 'Azul' },
        { hex: '#27ae60', name: 'Verde' },
        { hex: '#8e44ad', name: 'Violeta' },
        { hex: '#e67e22', name: 'Naranja' },
        // Extra
        { hex: '#f39c12', name: 'Ocre' },
        { hex: '#1abc9c', name: 'Turquesa' },
        { hex: '#e84393', name: 'Rosa' },
        { hex: '#fdcb6e', name: 'Amarillo' },
        { hex: '#b2bec3', name: 'Plata' },
        { hex: '#2d3436', name: 'Carbon' }
    ];

    let showGrid = false;
    let rulerStart = null; // {x, y} or null
    let rulerMode = false;

    const eng = _pinturaCreateEngine(canvas, ctx, W, H, ui, controls, {
        colors,
        brushSizes: [1, 3, 6],
        defaultOpacity: 0.9,
        showOpacity: false,
        bgColor: '#fdfbf7',
        defaultTool: 'pencil',
        drawBackground: (ctx, w, h) => {
            // Paper texture
            ctx.fillStyle = '#fdfbf7';
            ctx.fillRect(0, 0, w, h);
            ctx.globalAlpha = 0.03;
            for (let i = 0; i < 300; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#e0d5c0' : '#d8cdb8';
                const rx = Math.random() * w;
                const ry = Math.random() * h;
                ctx.fillRect(rx, ry, Math.random() * 6 + 1, Math.random() * 6 + 1);
            }
            ctx.globalAlpha = 1;
        },
        extraTools: [
            {
                id: 'pencil',
                icon: '✏️',
                name: 'Lapiz'
            },
            {
                id: 'charcoal',
                icon: '🖤',
                name: 'Carbon (trazos gruesos)'
            },
            {
                id: 'ruler',
                icon: '📏',
                name: 'Regla (lineas rectas)'
            },
            {
                id: 'grid_toggle',
                icon: '📐',
                name: 'Cuadricula',
                onActivate: () => {
                    showGrid = !showGrid;
                    drawGridOverlay();
                    // Revert tool to previous drawing tool
                    eng.activeTool = 'pencil';
                }
            }
        ],
        onKey: (e) => {
            if (e.key === 'g' || e.key === 'G') {
                showGrid = !showGrid;
                drawGridOverlay();
            }
        }
    });

    let gridCanvas = null;

    function drawGridOverlay() {
        if (!gridCanvas) {
            gridCanvas = document.createElement('canvas');
            gridCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:5;';
            gridCanvas.width = canvas.width;
            gridCanvas.height = Math.floor(eng.CANVAS_H * 2);
            // Insert relative to container
            const container = document.getElementById('game-container');
            container.style.position = 'relative';
            container.appendChild(gridCanvas);
        }

        const gc = gridCanvas.getContext('2d');
        gc.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

        if (showGrid) {
            gridCanvas.style.display = 'block';
            const step = 40; // grid spacing in CSS pixels
            gc.strokeStyle = 'rgba(100,150,200,0.25)';
            gc.lineWidth = 1;

            for (let x = 0; x < W; x += step) {
                gc.beginPath();
                gc.moveTo(x * 2, 0);
                gc.lineTo(x * 2, eng.CANVAS_H * 2);
                gc.stroke();
            }
            for (let y = 0; y < eng.CANVAS_H; y += step) {
                gc.beginPath();
                gc.moveTo(0, y * 2);
                gc.lineTo(W * 2, y * 2);
                gc.stroke();
            }

            // Vanishing point guides (perspective)
            gc.strokeStyle = 'rgba(200,100,100,0.15)';
            gc.lineWidth = 1;
            const cx = W, cy = eng.CANVAS_H * 0.3 * 2;
            for (let angle = 0; angle < Math.PI; angle += Math.PI / 8) {
                gc.beginPath();
                gc.moveTo(cx, cy);
                gc.lineTo(cx + Math.cos(angle) * W * 2, cy + Math.sin(angle) * eng.CANVAS_H * 2);
                gc.stroke();
                gc.beginPath();
                gc.moveTo(cx, cy);
                gc.lineTo(cx - Math.cos(angle) * W * 2, cy + Math.sin(angle) * eng.CANVAS_H * 2);
                gc.stroke();
            }
        } else {
            gridCanvas.style.display = 'none';
        }
    }

    // Ruler preview line
    let rulerPreview = null;

    function drawPencil(x, y, lx, ly) {
        ctx.save();
        ctx.globalAlpha = eng.opacity;
        ctx.strokeStyle = eng.currentColor;
        ctx.lineWidth = eng.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Slight jitter for pencil feel
        const jitter = eng.brushSize * 0.15;
        ctx.beginPath();
        ctx.moveTo(lx + (Math.random() - 0.5) * jitter, ly + (Math.random() - 0.5) * jitter);
        ctx.lineTo(x + (Math.random() - 0.5) * jitter, y + (Math.random() - 0.5) * jitter);
        ctx.stroke();
        ctx.restore();
    }

    function drawCharcoal(x, y, lx, ly) {
        const dist = Math.sqrt((x - lx) ** 2 + (y - ly) ** 2);
        const steps = Math.max(Math.floor(dist), 1);
        const charcoalSize = eng.brushSize * 3;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const cx = lx + (x - lx) * t;
            const cy = ly + (y - ly) * t;

            // Main soft stroke
            ctx.globalAlpha = 0.15 + Math.random() * 0.15;
            ctx.fillStyle = eng.currentColor;
            ctx.beginPath();
            ctx.ellipse(
                cx + (Math.random() - 0.5) * charcoalSize * 0.3,
                cy + (Math.random() - 0.5) * charcoalSize * 0.3,
                charcoalSize * (0.4 + Math.random() * 0.3),
                charcoalSize * (0.2 + Math.random() * 0.2),
                Math.random() * Math.PI,
                0, Math.PI * 2
            );
            ctx.fill();

            // Scattered particles
            if (Math.random() > 0.5) {
                for (let j = 0; j < 3; j++) {
                    ctx.globalAlpha = Math.random() * 0.1;
                    ctx.beginPath();
                    ctx.arc(
                        cx + (Math.random() - 0.5) * charcoalSize * 1.5,
                        cy + (Math.random() - 0.5) * charcoalSize * 1.5,
                        Math.random() * 2,
                        0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }
        ctx.globalAlpha = 1;
    }

    function drawRulerLine(x1, y1, x2, y2) {
        ctx.save();
        ctx.globalAlpha = eng.opacity;
        ctx.strokeStyle = eng.currentColor;
        ctx.lineWidth = eng.brushSize;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    function eraseAt(x, y, lx, ly) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = eng.brushSize * 3;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
    }

    // Ruler preview overlay
    function createRulerOverlay() {
        if (rulerPreview) return;
        rulerPreview = document.createElement('canvas');
        rulerPreview.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:6;';
        rulerPreview.width = canvas.width;
        rulerPreview.height = canvas.height;
        const container = document.getElementById('game-container');
        container.appendChild(rulerPreview);
    }

    function updateRulerPreview(x, y) {
        if (!rulerPreview || !rulerStart) return;
        const rc = rulerPreview.getContext('2d');
        rc.clearRect(0, 0, rulerPreview.width, rulerPreview.height);
        rc.setTransform(2, 0, 0, 2, 0, 0);
        rc.strokeStyle = eng.currentColor;
        rc.globalAlpha = 0.4;
        rc.lineWidth = eng.brushSize;
        rc.setLineDash([6, 6]);
        rc.lineCap = 'round';
        rc.beginPath();
        rc.moveTo(rulerStart.x, rulerStart.y);
        rc.lineTo(x, y);
        rc.stroke();
        rc.setLineDash([]);
        rc.setTransform(1, 0, 0, 1, 0, 0);
    }

    function clearRulerPreview() {
        if (!rulerPreview) return;
        const rc = rulerPreview.getContext('2d');
        rc.clearRect(0, 0, rulerPreview.width, rulerPreview.height);
    }

    canvas.style.touchAction = 'none';

    canvas.onpointerdown = (e) => {
        const pos = eng.getPos(e);
        if (pos.y > eng.CANVAS_H) return;

        if (eng.activeTool === 'ruler') {
            if (!rulerStart) {
                // First click: set start
                rulerStart = { x: pos.x, y: pos.y };
                createRulerOverlay();
                rulerMode = true;
            } else {
                // Second click: draw line
                eng.saveUndo();
                drawRulerLine(rulerStart.x, rulerStart.y, pos.x, pos.y);
                eng.strokeCount++;
                eng.colorsUsed.add(eng.currentColor);
                addScore(2);
                rulerStart = null;
                rulerMode = false;
                clearRulerPreview();
            }
            return;
        }

        // Reset ruler if switching tools
        rulerStart = null;
        rulerMode = false;
        clearRulerPreview();

        eng.saveUndo();
        eng.painting = true;
        eng.lastX = pos.x;
        eng.lastY = pos.y;
        eng.strokeCount++;
        eng.colorsUsed.add(eng.currentColor);
        addScore(1);
    };

    canvas.onpointermove = (e) => {
        const pos = eng.getPos(e);

        // Ruler preview
        if (eng.activeTool === 'ruler' && rulerStart) {
            updateRulerPreview(pos.x, pos.y);
            return;
        }

        if (!eng.painting) return;
        if (pos.y > eng.CANVAS_H) return;

        if (eng.activeTool === 'eraser') {
            eraseAt(pos.x, pos.y, eng.lastX, eng.lastY);
        } else if (eng.activeTool === 'charcoal') {
            drawCharcoal(pos.x, pos.y, eng.lastX, eng.lastY);
        } else {
            drawPencil(pos.x, pos.y, eng.lastX, eng.lastY);
        }
        eng.lastX = pos.x;
        eng.lastY = pos.y;
    };

    canvas.onpointerup = () => { eng.painting = false; };
    canvas.onpointerleave = () => { eng.painting = false; };

    // Override cleanup to also remove grid/ruler overlays
    const baseCleanup = eng.cleanup;
    currentGame = {
        cleanup: () => {
            baseCleanup();
            if (gridCanvas && gridCanvas.parentNode) gridCanvas.parentNode.removeChild(gridCanvas);
            if (rulerPreview && rulerPreview.parentNode) rulerPreview.parentNode.removeChild(rulerPreview);
        }
    };
}
