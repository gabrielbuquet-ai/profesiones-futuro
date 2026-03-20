// ==========================================
// ARQUITECTURA - Mini-juegos
// ==========================================

const ARQ_BUILDINGS = {
    urbanismo: [
        { icon: '🏠', name: 'Casa' },
        { icon: '🏢', name: 'Oficina' },
        { icon: '🏫', name: 'Escuela' },
        { icon: '🏥', name: 'Hospital' },
        { icon: '🛒', name: 'Super' },
        { icon: '🌳', name: 'Parque' },
        { icon: '⛪', name: 'Iglesia' },
        { icon: '🏟️', name: 'Estadio' },
        { icon: '🅿️', name: 'Parking' },
        { icon: '🚏', name: 'Parada' },
        { icon: '🏪', name: 'Tienda' },
        { icon: '📚', name: 'Biblioteca' }
    ],
    interiores: [
        { icon: '🛋️', name: 'Sofa' },
        { icon: '🪑', name: 'Silla' },
        { icon: '🛏️', name: 'Cama' },
        { icon: '🖥️', name: 'Escritorio' },
        { icon: '📺', name: 'TV' },
        { icon: '🪴', name: 'Planta' },
        { icon: '🖼️', name: 'Cuadro' },
        { icon: '💡', name: 'Lampara' },
        { icon: '🪞', name: 'Espejo' },
        { icon: '📖', name: 'Estante' }
    ],
    paisajismo: [
        { icon: '🌳', name: 'Arbol' },
        { icon: '🌷', name: 'Flores' },
        { icon: '⛲', name: 'Fuente' },
        { icon: '🪨', name: 'Rocas' },
        { icon: '🌿', name: 'Setos' },
        { icon: '🪵', name: 'Banco' },
        { icon: '💧', name: 'Estanque' },
        { icon: '🏮', name: 'Farol' },
        { icon: '🌻', name: 'Girasol' },
        { icon: '🍄', name: 'Setas' }
    ],
    sostenible: [
        { icon: '☀️', name: 'Solar' },
        { icon: '💨', name: 'Eolica' },
        { icon: '🌱', name: 'Jardin V.' },
        { icon: '💧', name: 'Reciclaje Agua' },
        { icon: '🔋', name: 'Bateria' },
        { icon: '🏗️', name: 'Bambu' },
        { icon: '🪟', name: 'Vidrio Eco' },
        { icon: '♻️', name: 'Reciclaje' },
        { icon: '🌡️', name: 'Aislante' },
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
    const buildings = ARQ_BUILDINGS[subtype] || ARQ_BUILDINGS.urbanismo;
    const goal = ARQ_GOALS[subtype] || '';
    const GRID_SIZE = 6;
    const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    let selectedTool = null;
    let placedCount = 0;

    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');

    // Goal text
    ui.innerHTML = `
        <div style="padding: 10px 14px; font-size: 0.75rem; color: #aaa; text-align: center;">
            ${goal}
        </div>
        <div class="game-grid" id="arq-grid" style="grid-template-columns: repeat(${GRID_SIZE}, 1fr);"></div>
    `;
    ui.style.pointerEvents = 'auto';

    const gridEl = document.getElementById('arq-grid');

    // Create grid cells
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => placeItem(r, c, cell);
            gridEl.appendChild(cell);
        }
    }

    // Toolbar
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

    // Add eraser
    const eraser = document.createElement('div');
    eraser.className = 'tool-item';
    eraser.innerHTML = `<span class="tool-icon">🗑️</span><span class="tool-label">Borrar</span>`;
    eraser.onclick = () => {
        document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('selected'));
        eraser.classList.add('selected');
        selectedTool = { icon: '', name: 'eraser' };
    };
    toolbar.appendChild(eraser);

    // Add finish button
    const finishBtn = document.createElement('div');
    finishBtn.className = 'tool-item';
    finishBtn.style.background = 'linear-gradient(135deg, #43e97b44, #38f9d744)';
    finishBtn.style.borderColor = '#43e97b';
    finishBtn.innerHTML = `<span class="tool-icon">✅</span><span class="tool-label">Terminar</span>`;
    finishBtn.onclick = () => finishDesign();
    toolbar.appendChild(finishBtn);

    function placeItem(r, c, cell) {
        if (!selectedTool) return;
        if (selectedTool.name === 'eraser') {
            if (grid[r][c]) {
                grid[r][c] = null;
                cell.textContent = '';
                cell.classList.remove('occupied');
                placedCount--;
                addScore(-5);
            }
            return;
        }
        if (grid[r][c]) return; // Already occupied
        grid[r][c] = selectedTool;
        cell.textContent = selectedTool.icon;
        cell.classList.add('occupied');
        placedCount++;
        addScore(10);
    }

    function finishDesign() {
        const uniqueTypes = new Set();
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c]) uniqueTypes.add(grid[r][c].name);
            }
        }

        let bonus = uniqueTypes.size * 15;
        addScore(bonus);

        let stars = placedCount >= 12 ? 5 : placedCount >= 8 ? 4 : placedCount >= 5 ? 3 : placedCount >= 3 ? 2 : 1;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            starsHtml += `<span class="star ${i < stars ? 'filled' : 'empty'}">★</span>`;
        }

        let msg = `Has colocado ${placedCount} elementos con ${uniqueTypes.size} tipos diferentes.`;
        showResult(
            `Diseno completado`,
            `<div class="stars">${starsHtml}</div>`,
            msg,
            () => startArquitectura(subtype)
        );
    }

    currentGame = {
        cleanup: () => {
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}
