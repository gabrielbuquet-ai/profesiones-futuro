// ==========================================
// ARQUITECTURA - Todos los modos en 3D Isometrico
// (Interiores usa vista primera persona estilo Minecraft)
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

// ============ ROOM TYPES CONFIG FOR INTERIORES ============

const ROOM_CONFIGS = {
    habitacion: {
        label: 'Dormitorio',
        wallColors: [
            { top: '#f5ede0', mid: '#f0e6d6', bot: '#e8dcc8' },
            { top: '#f2ebe0', mid: '#ede4d5', bot: '#e6dbc8' },
            { top: '#f5ede2', mid: '#f0e6d8', bot: '#e8dccc' },
            { top: '#f3ece0', mid: '#eee5d6', bot: '#e7dcc9' },
        ],
        ceilingColor: '#faf6f0',
        floorGradient: ['#c9a87a', '#b8965e', '#a88450'],
        floorLineColor: 'rgba(140,110,70,0.18)',
        floorLineColorH: 'rgba(140,110,70,0.13)',
        baseboardColor: '#b09878',
        windowWall: 0,
        windowStyle: 'standard',
    },
    salon: {
        label: 'Salon',
        wallColors: [
            { top: '#ede8e0', mid: '#e6e0d6', bot: '#ddd6ca' },
            { top: '#e0ebe8', mid: '#d6e4e0', bot: '#caddd6' },
            { top: '#ebe0e8', mid: '#e4d6e0', bot: '#ddcada' },
            { top: '#e8ebe0', mid: '#e0e4d6', bot: '#d6ddca' },
        ],
        ceilingColor: '#f2f0ec',
        floorGradient: ['#c9b898', '#c0ad8a', '#b5a078'],
        floorLineColor: 'rgba(150,132,100,0.18)',
        floorLineColorH: 'rgba(150,132,100,0.13)',
        baseboardColor: '#c4baa8',
        windowWall: 0,
        windowStyle: 'standard',
    },
    bano: {
        label: 'Bano',
        wallColors: [
            { top: '#e8f0f4', mid: '#dce8ee', bot: '#d0e0e8' },
            { top: '#e6eef2', mid: '#dae6ec', bot: '#cedee6' },
            { top: '#e8f0f4', mid: '#dce8ee', bot: '#d0e0e8' },
            { top: '#e6eef2', mid: '#dae6ec', bot: '#cedee6' },
        ],
        ceilingColor: '#f5f8fa',
        floorGradient: ['#d8dde0', '#ccd2d6', '#c0c8cc'],
        floorLineColor: 'rgba(150,165,175,0.22)',
        floorLineColorH: 'rgba(150,165,175,0.18)',
        baseboardColor: '#bcc4ca',
        tileWalls: true,
        windowWall: 0,
        windowStyle: 'small',
    },
    restaurante: {
        label: 'Restaurante',
        wallColors: [
            { top: '#f0dcc0', mid: '#e8d0b0', bot: '#dcc4a0' },
            { top: '#eedabc', mid: '#e6ceac', bot: '#dac29c' },
            { top: '#f0dcc0', mid: '#e8d0b0', bot: '#dcc4a0' },
            { top: '#eedabc', mid: '#e6ceac', bot: '#dac29c' },
        ],
        ceilingColor: '#2c2418',
        floorGradient: ['#5c3d1e', '#4e3318', '#402a14'],
        floorLineColor: 'rgba(80,50,20,0.22)',
        floorLineColorH: 'rgba(80,50,20,0.16)',
        baseboardColor: '#3e2a16',
        windowWall: -1,
        moodLighting: true,
    },
    cocina_int: {
        label: 'Cocina',
        wallColors: [
            { top: '#f5f5f0', mid: '#efefe8', bot: '#e8e8e0' },
            { top: '#f3f3ee', mid: '#edede6', bot: '#e6e6de' },
            { top: '#f5f5f0', mid: '#efefe8', bot: '#e8e8e0' },
            { top: '#f3f3ee', mid: '#edede6', bot: '#e6e6de' },
        ],
        ceilingColor: '#fafaf6',
        floorGradient: ['#d8ddd0', '#ccd2c6', '#c0c8bc'],
        floorLineColor: 'rgba(140,155,130,0.22)',
        floorLineColorH: 'rgba(140,155,130,0.16)',
        baseboardColor: '#c0bab0',
        tileBacksplash: true,
        windowWall: 0,
        windowStyle: 'standard',
    },
    colegio: {
        label: 'Aula',
        wallColors: [
            { top: '#f8f0d0', mid: '#f2e8c4', bot: '#ece0b8' },
            { top: '#f6eecc', mid: '#f0e6c0', bot: '#eadeb4' },
            { top: '#f8f0d0', mid: '#f2e8c4', bot: '#ece0b8' },
            { top: '#f6eecc', mid: '#f0e6c0', bot: '#eadeb4' },
        ],
        ceilingColor: '#f8f6f0',
        floorGradient: ['#c8c0a8', '#bcb498', '#b0a888'],
        floorLineColor: 'rgba(160,148,120,0.16)',
        floorLineColorH: 'rgba(160,148,120,0.12)',
        baseboardColor: '#b8b0a0',
        windowWall: 0,
        windowStyle: 'standard',
        bulletinBoard: true,
    },
    iglesia: {
        label: 'Iglesia',
        wallColors: [
            { top: '#d0c8b8', mid: '#c4bca8', bot: '#b8b098' },
            { top: '#cec6b6', mid: '#c2baa6', bot: '#b6ae96' },
            { top: '#d0c8b8', mid: '#c4bca8', bot: '#b8b098' },
            { top: '#cec6b6', mid: '#c2baa6', bot: '#b6ae96' },
        ],
        ceilingColor: '#c8c0b0',
        floorGradient: ['#a8a090', '#9c9484', '#908878'],
        floorLineColor: 'rgba(120,110,95,0.22)',
        floorLineColorH: 'rgba(120,110,95,0.16)',
        baseboardColor: '#908878',
        stoneWalls: true,
        windowWall: 0,
        windowStyle: 'stained_glass',
        archedCeiling: true,
    },
};

const ROOM_ITEMS = {
    habitacion: [
        { name: 'Cama', color: '#5b7fa5', icon: '🛏️', wall: false, roofType: 'modern_bed', baseColor: '#5b7fa5', roofColor: '#3d5a7c' },
        { name: 'Mesita', color: '#a0845c', icon: '🪑', wall: false, roofType: 'ri_nightstand', baseColor: '#a0845c', roofColor: '#8a6e46' },
        { name: 'Armario', color: '#8B6B4A', icon: '🚪', wall: false, roofType: 'ri_wardrobe', baseColor: '#8B6B4A', roofColor: '#6e5438' },
        { name: 'Escritorio', color: '#8e8e8e', icon: '🖥️', wall: false, roofType: 'desk_computer', baseColor: '#8e8e8e', roofColor: '#6e6e6e' },
        { name: 'Silla', color: '#6e6e6e', icon: '🪑', wall: false, roofType: 'ri_chair', baseColor: '#6e6e6e', roofColor: '#555555' },
        { name: 'Lampara', color: '#f5c542', icon: '💡', wall: false, roofType: 'floor_lamp', baseColor: '#f5c542', roofColor: '#d4a832' },
        { name: 'Alfombra', color: '#c9788e', icon: '🟫', wall: false, roofType: 'modern_rug', baseColor: '#c9788e', roofColor: '#a86070' },
        { name: 'Libreria', color: '#d4a574', icon: '📚', wall: false, roofType: 'bookshelf', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Poster', color: '#e74c3c', icon: '🖼️', wall: true, roofType: 'wall_painting', baseColor: '#e74c3c', roofColor: '#c0392b' },
        { name: 'Espejo', color: '#d5e8f0', icon: '🪞', wall: true, roofType: 'wall_mirror', baseColor: '#d5e8f0', roofColor: '#a8c8d8' },
        { name: 'Reloj', color: '#ecf0f1', icon: '🕐', wall: true, roofType: 'wall_clock', baseColor: '#ecf0f1', roofColor: '#bdc3c7' },
        { name: 'Estante', color: '#d4a574', icon: '📖', wall: true, roofType: 'wall_shelf', baseColor: '#d4a574', roofColor: '#b8895c' },
    ],
    salon: [
        { name: 'Sofa', color: '#7c8a9e', icon: '🛋️', wall: false, roofType: 'modern_sofa', baseColor: '#7c8a9e', roofColor: '#5a6578' },
        { name: 'TV Stand', color: '#2c3e50', icon: '📺', wall: false, roofType: 'flat_tv', baseColor: '#2c3e50', roofColor: '#1a252f' },
        { name: 'Mesa', color: '#d4a574', icon: '☕', wall: false, roofType: 'coffee_table', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Sillon', color: '#8B6B4A', icon: '🪑', wall: false, roofType: 'ri_armchair', baseColor: '#8B6B4A', roofColor: '#6e5438' },
        { name: 'Planta', color: '#4CAF50', icon: '🪴', wall: false, roofType: 'modern_plant', baseColor: '#4CAF50', roofColor: '#388E3C' },
        { name: 'Lampara', color: '#f5c542', icon: '💡', wall: false, roofType: 'floor_lamp', baseColor: '#f5c542', roofColor: '#d4a832' },
        { name: 'Alfombra', color: '#e8c9a0', icon: '🟫', wall: false, roofType: 'modern_rug', baseColor: '#e8c9a0', roofColor: '#c9a87c' },
        { name: 'Libreria', color: '#d4a574', icon: '📚', wall: false, roofType: 'bookshelf', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Cuadro', color: '#e74c3c', icon: '🖼️', wall: true, roofType: 'wall_painting', baseColor: '#e74c3c', roofColor: '#c0392b' },
        { name: 'Espejo', color: '#d5e8f0', icon: '🪞', wall: true, roofType: 'wall_mirror', baseColor: '#d5e8f0', roofColor: '#a8c8d8' },
        { name: 'TV Mural', color: '#1a1a2e', icon: '📺', wall: true, roofType: 'wall_tv', baseColor: '#1a1a2e', roofColor: '#0d0d1a' },
        { name: 'Estante', color: '#d4a574', icon: '📖', wall: true, roofType: 'wall_shelf', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Reloj', color: '#ecf0f1', icon: '🕐', wall: true, roofType: 'wall_clock', baseColor: '#ecf0f1', roofColor: '#bdc3c7' },
        { name: 'Aplique', color: '#f5c542', icon: '🔆', wall: true, roofType: 'wall_sconce', baseColor: '#f5c542', roofColor: '#d4a832' },
    ],
    bano: [
        { name: 'Banera', color: '#f0f0f0', icon: '🛁', wall: false, roofType: 'ri_bathtub', baseColor: '#f0f0f0', roofColor: '#d8d8d8' },
        { name: 'Inodoro', color: '#f5f5f5', icon: '🚽', wall: false, roofType: 'ri_toilet', baseColor: '#f5f5f5', roofColor: '#e0e0e0' },
        { name: 'Lavabo', color: '#e8e8e8', icon: '🚿', wall: false, roofType: 'ri_sink', baseColor: '#e8e8e8', roofColor: '#d0d0d0' },
        { name: 'Armario', color: '#d4a574', icon: '🗄️', wall: false, roofType: 'ri_cabinet', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Toallero', color: '#c0c0c0', icon: '🧺', wall: false, roofType: 'ri_towelrack', baseColor: '#c0c0c0', roofColor: '#a0a0a0' },
        { name: 'Alfombra', color: '#87CEEB', icon: '🟫', wall: false, roofType: 'modern_rug', baseColor: '#87CEEB', roofColor: '#5fa8c8' },
        { name: 'Estante', color: '#d4a574', icon: '📖', wall: false, roofType: 'ri_smallshelf', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Espejo', color: '#d5e8f0', icon: '🪞', wall: true, roofType: 'wall_mirror', baseColor: '#d5e8f0', roofColor: '#a8c8d8' },
        { name: 'Gancho', color: '#c0c0c0', icon: '🪝', wall: true, roofType: 'ri_towelhook', baseColor: '#c0c0c0', roofColor: '#a0a0a0' },
        { name: 'Estante P.', color: '#d4a574', icon: '📖', wall: true, roofType: 'wall_shelf', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Luz', color: '#f5c542', icon: '💡', wall: true, roofType: 'wall_sconce', baseColor: '#f5c542', roofColor: '#d4a832' },
    ],
    restaurante: [
        { name: 'Mesa Red.', color: '#d4a574', icon: '🍽️', wall: false, roofType: 'ri_roundtable', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Sillas', color: '#8B6B4A', icon: '🪑', wall: false, roofType: 'ri_chairs_pair', baseColor: '#8B6B4A', roofColor: '#6e5438' },
        { name: 'Barra', color: '#5c3d1e', icon: '🍸', wall: false, roofType: 'ri_barcounter', baseColor: '#5c3d1e', roofColor: '#3e2a14' },
        { name: 'Planta', color: '#4CAF50', icon: '🪴', wall: false, roofType: 'modern_plant', baseColor: '#4CAF50', roofColor: '#388E3C' },
        { name: 'Lampara', color: '#f5c542', icon: '✨', wall: false, roofType: 'ri_chandelier', baseColor: '#f5c542', roofColor: '#d4a832' },
        { name: 'Cuadro', color: '#8B4513', icon: '🖼️', wall: true, roofType: 'wall_painting', baseColor: '#8B4513', roofColor: '#6e3710' },
        { name: 'Menu', color: '#2c3e50', icon: '📋', wall: true, roofType: 'ri_menuboard', baseColor: '#2c3e50', roofColor: '#1a252f' },
        { name: 'Botellero', color: '#8B4513', icon: '🍇', wall: true, roofType: 'ri_winerack', baseColor: '#8B4513', roofColor: '#6e3710' },
        { name: 'Aplique', color: '#f5c542', icon: '🔆', wall: true, roofType: 'wall_sconce', baseColor: '#f5c542', roofColor: '#d4a832' },
    ],
    cocina_int: [
        { name: 'Isla', color: '#e0e0e0', icon: '🏝️', wall: false, roofType: 'ri_kitchenisland', baseColor: '#e0e0e0', roofColor: '#c8c8c8' },
        { name: 'Taburete', color: '#8B6B4A', icon: '🪑', wall: false, roofType: 'ri_stool', baseColor: '#8B6B4A', roofColor: '#6e5438' },
        { name: 'Nevera', color: '#d0d0d0', icon: '🧊', wall: false, roofType: 'ri_fridge', baseColor: '#d0d0d0', roofColor: '#b0b0b0' },
        { name: 'Horno', color: '#404040', icon: '🔥', wall: false, roofType: 'ri_oven', baseColor: '#404040', roofColor: '#2a2a2a' },
        { name: 'Fregadero', color: '#c0c0c0', icon: '🚰', wall: false, roofType: 'ri_sinkcounter', baseColor: '#c0c0c0', roofColor: '#a0a0a0' },
        { name: 'Mesa', color: '#d4a574', icon: '🍽️', wall: false, roofType: 'coffee_table', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Estante', color: '#d4a574', icon: '📖', wall: true, roofType: 'wall_shelf', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Reloj', color: '#ecf0f1', icon: '🕐', wall: true, roofType: 'wall_clock', baseColor: '#ecf0f1', roofColor: '#bdc3c7' },
        { name: 'Utensilios', color: '#808080', icon: '🍴', wall: true, roofType: 'ri_utensilrack', baseColor: '#808080', roofColor: '#606060' },
        { name: 'Cuadro', color: '#e74c3c', icon: '🖼️', wall: true, roofType: 'wall_painting', baseColor: '#e74c3c', roofColor: '#c0392b' },
    ],
    colegio: [
        { name: 'Pupitre', color: '#c9b898', icon: '📝', wall: false, roofType: 'ri_schooldesk', baseColor: '#c9b898', roofColor: '#b0a080' },
        { name: 'Prof. Mesa', color: '#8B6B4A', icon: '👩‍🏫', wall: false, roofType: 'ri_teacherdesk', baseColor: '#8B6B4A', roofColor: '#6e5438' },
        { name: 'Silla', color: '#4a90d9', icon: '🪑', wall: false, roofType: 'ri_chair', baseColor: '#4a90d9', roofColor: '#3570b0' },
        { name: 'Libreria', color: '#d4a574', icon: '📚', wall: false, roofType: 'bookshelf', baseColor: '#d4a574', roofColor: '#b8895c' },
        { name: 'Planta', color: '#4CAF50', icon: '🪴', wall: false, roofType: 'modern_plant', baseColor: '#4CAF50', roofColor: '#388E3C' },
        { name: 'Globo', color: '#4a90d9', icon: '🌍', wall: false, roofType: 'ri_globe', baseColor: '#4a90d9', roofColor: '#3570b0' },
        { name: 'Reloj', color: '#ecf0f1', icon: '🕐', wall: true, roofType: 'wall_clock', baseColor: '#ecf0f1', roofColor: '#bdc3c7' },
        { name: 'Pizarra', color: '#f5f5f0', icon: '📋', wall: true, roofType: 'ri_whiteboard', baseColor: '#f5f5f0', roofColor: '#e0e0d8' },
        { name: 'Mapa', color: '#a8d8a8', icon: '🗺️', wall: true, roofType: 'ri_wallmap', baseColor: '#a8d8a8', roofColor: '#88b888' },
        { name: 'Estante', color: '#d4a574', icon: '📖', wall: true, roofType: 'wall_shelf', baseColor: '#d4a574', roofColor: '#b8895c' },
    ],
    iglesia: [
        { name: 'Banco', color: '#8B6B4A', icon: '🪵', wall: false, roofType: 'ri_pew', baseColor: '#8B6B4A', roofColor: '#6e5438' },
        { name: 'Altar', color: '#f0e6d0', icon: '⛪', wall: false, roofType: 'ri_altar', baseColor: '#f0e6d0', roofColor: '#d8ccb0' },
        { name: 'Candelabro', color: '#DAA520', icon: '🕯️', wall: false, roofType: 'ri_candelabra', baseColor: '#DAA520', roofColor: '#b8860b' },
        { name: 'Planta', color: '#4CAF50', icon: '🪴', wall: false, roofType: 'modern_plant', baseColor: '#4CAF50', roofColor: '#388E3C' },
        { name: 'Podio', color: '#8B6B4A', icon: '🎤', wall: false, roofType: 'ri_podium', baseColor: '#8B6B4A', roofColor: '#6e5438' },
        { name: 'Cruz', color: '#DAA520', icon: '✝️', wall: true, roofType: 'ri_cross', baseColor: '#DAA520', roofColor: '#b8860b' },
        { name: 'Cuadro', color: '#8B4513', icon: '🖼️', wall: true, roofType: 'wall_painting', baseColor: '#8B4513', roofColor: '#6e3710' },
        { name: 'Vitral', color: '#4a90d9', icon: '🪟', wall: true, roofType: 'ri_stainedglass', baseColor: '#4a90d9', roofColor: '#3570b0' },
        { name: 'Aplique', color: '#f5c542', icon: '🔆', wall: true, roofType: 'wall_sconce', baseColor: '#f5c542', roofColor: '#d4a832' },
    ],
};

const ROOM_GOALS = {
    habitacion: 'Decora tu dormitorio ideal. Coloca la cama, muebles y decoración.',
    salon: 'Decora el salón perfecto. Coloca muebles para crear un hogar acogedor.',
    bano: 'Diseña un baño completo. Necesitas bañera, lavabo e inodoro.',
    restaurante: 'Crea un restaurante acogedor. Pon mesas, sillas y decoración.',
    cocina_int: 'Diseña tu cocina ideal. Coloca electrodomésticos y muebles.',
    colegio: 'Prepara un aula para aprender. Necesitas pupitres, pizarra y más.',
    iglesia: 'Decora el interior de una iglesia. Coloca bancos, altar y decoración.',
};

const ROOM_FINISH_MSG = {
    habitacion: 'Dormitorio decorado!',
    salon: 'Salón decorado!',
    bano: 'Baño completado!',
    restaurante: 'Restaurante listo!',
    cocina_int: 'Cocina terminada!',
    colegio: 'Aula preparada!',
    iglesia: 'Iglesia decorada!',
};

const ARQ_GOALS = {
    urbanismo: 'Diseña una ciudad completa. Necesitas: casas, una escuela, un hospital, un parque y un supermercado mínimo.',
    interiores: 'Decora el salón perfecto. Coloca muebles para crear un hogar acogedor.',
    paisajismo: 'Diseña un jardín bonito. Usa árboles, flores, fuentes y bancos.',
    sostenible: 'Crea una comunidad 100% ecológica con energía renovable y espacios verdes.'
};

const ARQ_FINISH_MSG = {
    urbanismo: 'Ciudad completada!',
    interiores: 'Habitación decorada!',
    paisajismo: 'Jardín completado!',
    sostenible: 'Comunidad ecológica lista!'
};

// ============ LANZADOR ============

function startArquitectura(subtype) {
    const interiorRoutes = {
        'interiores': 'salon',
        'int_habitacion': 'habitacion',
        'int_salon': 'salon',
        'int_bano': 'bano',
        'int_restaurante': 'restaurante',
        'int_cocina': 'cocina_int',
        'int_colegio': 'colegio',
        'int_iglesia': 'iglesia',
    };
    if (interiorRoutes[subtype] !== undefined) {
        startInterioresFP(interiorRoutes[subtype]);
    } else {
        startIso3D(subtype);
    }
}

// ============================================================
// INTERIORES - FIRST-PERSON MINECRAFT-STYLE ROOM VIEW
// ============================================================

function startInterioresFP(roomType) {
    roomType = roomType || 'salon';
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

    const roomCfg = ROOM_CONFIGS[roomType] || ROOM_CONFIGS.salon;
    const items = ROOM_ITEMS[roomType] || ROOM_ITEMS.salon;
    let selectedTool = null;
    let placedCount = 0;
    let animFrame;

    // --- View rotation (4 discrete views: 0=Norte, 1=Este, 2=Sur, 3=Oeste) ---
    let viewAngle = 0;
    const WALL_NAMES = ['Pared Norte', 'Pared Este', 'Pared Sur', 'Pared Oeste'];
    const WALL_COLORS = roomCfg.wallColors;

    // --- Vanishing-point perspective geometry ---
    const VPx = W / 2;
    const VPy = H * 0.38;

    // Back wall rectangle (where perspective lines converge to)
    const margin = 0.22;
    const BWL = W * margin;          // back wall left
    const BWR = W * (1 - margin);    // back wall right
    const BWT = H * 0.12;            // back wall top
    const BWB = H * 0.62;            // back wall bottom

    // Room outer corners (canvas edges, with slight inset)
    const RL = 0, RR = W, RT = 0, RB = H;

    // --- Floor grid (5 cols x 3 rows) ---
    const FLOOR_COLS = 5;
    const FLOOR_ROWS = 3;
    // Floor spans from BWB (back) to RB (front), BWL..BWR at back, RL..RR at front

    function getFloorSlotQuad(r, c) {
        // r=0 is nearest to back wall, r=FLOOR_ROWS-1 is nearest to viewer
        // Interpolate between back wall edge and screen edge
        const t0 = r / FLOOR_ROWS;
        const t1 = (r + 1) / FLOOR_ROWS;

        const y0 = BWB + (RB - BWB) * t0;
        const y1 = BWB + (RB - BWB) * t1;

        // At each y, the floor width expands from back-wall width to full screen width
        const lx0 = BWL + (RL - BWL) * t0;
        const rx0 = BWR + (RR - BWR) * t0;
        const lx1 = BWL + (RL - BWL) * t1;
        const rx1 = BWR + (RR - BWR) * t1;

        // Column subdivision
        const c0_frac = c / FLOOR_COLS;
        const c1_frac = (c + 1) / FLOOR_COLS;

        return [
            { x: lx0 + (rx0 - lx0) * c0_frac, y: y0 },  // top-left
            { x: lx0 + (rx0 - lx0) * c1_frac, y: y0 },  // top-right
            { x: lx1 + (rx1 - lx1) * c1_frac, y: y1 },  // bottom-right
            { x: lx1 + (rx1 - lx1) * c0_frac, y: y1 },  // bottom-left
        ];
    }

    function getFloorSlotCenter(r, c) {
        const q = getFloorSlotQuad(r, c);
        return { x: (q[0].x + q[1].x + q[2].x + q[3].x) / 4, y: (q[0].y + q[1].y + q[2].y + q[3].y) / 4 };
    }

    function getFloorSlotScale(r) {
        // Items near back wall (r=0) are smaller, near viewer (r=FLOOR_ROWS-1) are largest
        return 2.2 + 1.3 * ((r + 0.5) / FLOOR_ROWS);
    }

    // --- Back wall grid (4 cols x 2 rows) ---
    const BWALL_COLS = 4;
    const BWALL_ROWS = 2;

    function getBackWallSlotRect(r, c) {
        const padX = 16, padY = 12;
        const slotW = (BWR - BWL - padX * 2) / BWALL_COLS;
        const slotH = (BWB - BWT - padY * 2) / BWALL_ROWS;
        const x = BWL + padX + c * slotW;
        const y = BWT + padY + r * slotH;
        return { x, y, w: slotW, h: slotH, cx: x + slotW / 2, cy: y + slotH / 2 };
    }

    // --- Side wall slots (2 per side) ---
    const SIDE_SLOTS = 2; // per side

    function getLeftWallSlotQuad(index) {
        const t0 = 0.2 + index * 0.35;
        const t1 = t0 + 0.3;
        // Left wall is trapezoid from (RL,RT)-(BWL,BWT) top to (RL,RB)-(BWL,BWB) bottom
        // Parameterize vertically
        const yBack0 = BWT + (BWB - BWT) * t0;
        const yBack1 = BWT + (BWB - BWT) * t1;
        const yFront0 = RT + (RB - RT) * t0;
        const yFront1 = RT + (RB - RT) * t1;
        // Wall is between x=RL and x=BWL, use middle portion
        const inset = 0.25;
        return [
            { x: RL + (BWL - RL) * inset, y: yFront0 + (yBack0 - yFront0) * inset },
            { x: BWL - (BWL - RL) * 0.05, y: yBack0 },
            { x: BWL - (BWL - RL) * 0.05, y: yBack1 },
            { x: RL + (BWL - RL) * inset, y: yFront1 + (yBack1 - yFront1) * inset },
        ];
    }

    function getRightWallSlotQuad(index) {
        const t0 = 0.2 + index * 0.35;
        const t1 = t0 + 0.3;
        const yBack0 = BWT + (BWB - BWT) * t0;
        const yBack1 = BWT + (BWB - BWT) * t1;
        const yFront0 = RT + (RB - RT) * t0;
        const yFront1 = RT + (RB - RT) * t1;
        const inset = 0.25;
        return [
            { x: BWR + (RR - BWR) * 0.05, y: yBack0 },
            { x: RR - (RR - BWR) * inset, y: yFront0 + (yBack0 - yFront0) * inset },
            { x: RR - (RR - BWR) * inset, y: yFront1 + (yBack1 - yFront1) * inset },
            { x: BWR + (RR - BWR) * 0.05, y: yBack1 },
        ];
    }

    function getSideWallSlotCenter(quad) {
        return { x: (quad[0].x + quad[1].x + quad[2].x + quad[3].x) / 4, y: (quad[0].y + quad[1].y + quad[2].y + quad[3].y) / 4 };
    }

    // --- Grid data (per-wall for 4 views) ---
    const floorGrid = Array(FLOOR_ROWS).fill(null).map(() => Array(FLOOR_COLS).fill(null));
    // wallGrids[v] = { back: 2D array, left: array, right: array } for each view angle v
    const wallGrids = Array(4).fill(null).map(() => ({
        back: Array(BWALL_ROWS).fill(null).map(() => Array(BWALL_COLS).fill(null)),
        left: Array(SIDE_SLOTS).fill(null),
        right: Array(SIDE_SLOTS).fill(null),
    }));
    // Convenience accessors for current view
    function backWallGrid() { return wallGrids[viewAngle].back; }
    function leftWallGrid() { return wallGrids[viewAngle].left; }
    function rightWallGrid() { return wallGrids[viewAngle].right; }

    let hoverType = null; // 'floor', 'backwall', 'leftwall', 'rightwall'
    let hoverR = -1, hoverC = -1;

    // --- Point-in-quad test ---
    function pointInQuad(px, py, quad) {
        // Use cross product winding
        let inside = true;
        for (let i = 0; i < 4; i++) {
            const a = quad[i], b = quad[(i + 1) % 4];
            const cross = (b.x - a.x) * (py - a.y) - (b.y - a.y) * (px - a.x);
            if (cross < 0) { inside = false; break; }
        }
        if (inside) return true;
        // Try reverse winding
        inside = true;
        for (let i = 0; i < 4; i++) {
            const a = quad[i], b = quad[(i + 1) % 4];
            const cross = (b.x - a.x) * (py - a.y) - (b.y - a.y) * (px - a.x);
            if (cross > 0) { inside = false; break; }
        }
        return inside;
    }

    function pointInRect(px, py, rect) {
        return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
    }

    function hitTest(mx, my) {
        // Check back wall slots first
        for (let r = 0; r < BWALL_ROWS; r++) {
            for (let c = 0; c < BWALL_COLS; c++) {
                const rect = getBackWallSlotRect(r, c);
                if (pointInRect(mx, my, rect)) return { type: 'backwall', r, c };
            }
        }
        // Left wall
        for (let i = 0; i < SIDE_SLOTS; i++) {
            if (pointInQuad(mx, my, getLeftWallSlotQuad(i))) return { type: 'leftwall', r: i, c: 0 };
        }
        // Right wall
        for (let i = 0; i < SIDE_SLOTS; i++) {
            if (pointInQuad(mx, my, getRightWallSlotQuad(i))) return { type: 'rightwall', r: i, c: 0 };
        }
        // Floor slots (check back-to-front so front slots take priority)
        for (let r = 0; r < FLOOR_ROWS; r++) {
            for (let c = 0; c < FLOOR_COLS; c++) {
                if (pointInQuad(mx, my, getFloorSlotQuad(r, c))) return { type: 'floor', r, c };
            }
        }
        return null;
    }

    function getGridAt(type, r, c) {
        if (type === 'floor') return floorGrid[r][c];
        if (type === 'backwall') return backWallGrid()[r][c];
        if (type === 'leftwall') return leftWallGrid()[r];
        if (type === 'rightwall') return rightWallGrid()[r];
        return null;
    }
    function setGridAt(type, r, c, val) {
        if (type === 'floor') floorGrid[r][c] = val;
        else if (type === 'backwall') backWallGrid()[r][c] = val;
        else if (type === 'leftwall') leftWallGrid()[r] = val;
        else if (type === 'rightwall') rightWallGrid()[r] = val;
    }

    function canPlaceItem(item, slotType) {
        if (!item) return false;
        if (item.name === 'eraser') return true;
        if (item.wall) return slotType === 'backwall' || slotType === 'leftwall' || slotType === 'rightwall';
        return slotType === 'floor';
    }

    // --- Color helpers ---
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

    // ===================== ROOM DRAWING =====================

    function drawRoom() {
        // -- Ceiling trapezoid --
        ctx.fillStyle = roomCfg.ceilingColor;
        ctx.beginPath();
        ctx.moveTo(RL, RT); ctx.lineTo(RR, RT); ctx.lineTo(BWR, BWT); ctx.lineTo(BWL, BWT);
        ctx.closePath(); ctx.fill();

        // Arched ceiling for iglesia
        if (roomCfg.archedCeiling) {
            ctx.fillStyle = roomCfg.ceilingColor;
            ctx.beginPath();
            ctx.moveTo(BWL, BWT);
            ctx.quadraticCurveTo(VPx, BWT - (BWB - BWT) * 0.15, BWR, BWT);
            ctx.lineTo(BWR, BWT); ctx.lineTo(BWL, BWT);
            ctx.closePath(); ctx.fill();
            // Arch ribs
            ctx.strokeStyle = 'rgba(160,148,128,0.25)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const t = (i + 1) / 6;
                const ax = BWL + (BWR - BWL) * t;
                ctx.beginPath();
                ctx.moveTo(ax, BWT);
                ctx.quadraticCurveTo(VPx, BWT - (BWB - BWT) * 0.15 * (1 - Math.abs(t - 0.5) * 2), VPx, BWT - (BWB - BWT) * 0.08);
                ctx.stroke();
            }
        }

        // Ceiling subtle lines
        ctx.strokeStyle = 'rgba(200,195,185,0.18)';
        ctx.lineWidth = 0.5;
        for (let i = 1; i < 6; i++) {
            const t = i / 6;
            const y = RT + (BWT - RT) * t;
            const lx = RL + (BWL - RL) * t;
            const rx = RR + (BWR - RR) * t;
            ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(rx, y); ctx.stroke();
        }

        // -- Left wall trapezoid --
        const leftWallIdx = (viewAngle + 3) % 4;
        const leftWallC = WALL_COLORS[leftWallIdx];
        const leftWallGrad = ctx.createLinearGradient(RL, 0, BWL, 0);
        leftWallGrad.addColorStop(0, leftWallC.top);
        leftWallGrad.addColorStop(1, leftWallC.mid);
        ctx.fillStyle = leftWallGrad;
        ctx.beginPath();
        ctx.moveTo(RL, RT); ctx.lineTo(BWL, BWT); ctx.lineTo(BWL, BWB); ctx.lineTo(RL, RB);
        ctx.closePath(); ctx.fill();

        // Stone texture for iglesia walls
        if (roomCfg.stoneWalls) {
            drawStoneTexture(RL, RT, BWL, BWT, BWL, BWB, RL, RB);
        }
        // Tile texture for bano walls
        if (roomCfg.tileWalls) {
            drawTileWallTexture(RL, RT, BWL, BWT, BWL, BWB, RL, RB, 'left');
        }

        // Left wall panel lines
        ctx.strokeStyle = 'rgba(180,172,158,0.12)';
        ctx.lineWidth = 0.5;
        for (let i = 1; i < 4; i++) {
            const t = i / 4;
            const xTop = RL + (BWL - RL) * t;
            const xBot = RL + (BWL - RL) * t;
            const yTop = RT + (BWT - RT) * t;
            const yBot = RB + (BWB - RB) * t;
            ctx.beginPath(); ctx.moveTo(xTop, yTop); ctx.lineTo(xBot, yBot); ctx.stroke();
        }

        // -- Right wall trapezoid --
        const rightWallIdx = (viewAngle + 1) % 4;
        const rightWallC = WALL_COLORS[rightWallIdx];
        const rightWallGrad = ctx.createLinearGradient(BWR, 0, RR, 0);
        rightWallGrad.addColorStop(0, rightWallC.mid);
        rightWallGrad.addColorStop(1, rightWallC.top);
        ctx.fillStyle = rightWallGrad;
        ctx.beginPath();
        ctx.moveTo(BWR, BWT); ctx.lineTo(RR, RT); ctx.lineTo(RR, RB); ctx.lineTo(BWR, BWB);
        ctx.closePath(); ctx.fill();

        // Stone/tile texture on right wall
        if (roomCfg.stoneWalls) {
            drawStoneTexture(BWR, BWT, RR, RT, RR, RB, BWR, BWB);
        }
        if (roomCfg.tileWalls) {
            drawTileWallTexture(BWR, BWT, RR, RT, RR, RB, BWR, BWB, 'right');
        }

        // Right wall panel lines
        ctx.strokeStyle = 'rgba(180,172,158,0.12)';
        for (let i = 1; i < 4; i++) {
            const t = i / 4;
            const xTop = BWR + (RR - BWR) * t;
            const xBot = BWR + (RR - BWR) * t;
            const yTop = BWT + (RT - BWT) * t;
            const yBot = BWB + (RB - BWB) * t;
            ctx.beginPath(); ctx.moveTo(xTop, yTop); ctx.lineTo(xBot, yBot); ctx.stroke();
        }

        // -- Back wall --
        const backWallC = WALL_COLORS[viewAngle];
        const backGrad = ctx.createLinearGradient(0, BWT, 0, BWB);
        backGrad.addColorStop(0, backWallC.top);
        backGrad.addColorStop(0.5, backWallC.mid);
        backGrad.addColorStop(1, backWallC.bot);
        ctx.fillStyle = backGrad;
        ctx.fillRect(BWL, BWT, BWR - BWL, BWB - BWT);

        // Stone/tile texture on back wall
        if (roomCfg.stoneWalls) {
            drawStoneTextureRect(BWL, BWT, BWR - BWL, BWB - BWT);
        }
        if (roomCfg.tileWalls) {
            drawTileWallTextureRect(BWL, BWT, BWR - BWL, BWB - BWT);
        }
        // Tile backsplash for cocina
        if (roomCfg.tileBacksplash && viewAngle === 0) {
            ctx.fillStyle = 'rgba(200,210,200,0.3)';
            ctx.fillRect(BWL, BWB - (BWB - BWT) * 0.4, BWR - BWL, (BWB - BWT) * 0.4);
            drawTileWallTextureRect(BWL, BWB - (BWB - BWT) * 0.4, BWR - BWL, (BWB - BWT) * 0.4);
        }

        // Back wall subtle panel lines
        ctx.strokeStyle = 'rgba(190,182,168,0.13)';
        ctx.lineWidth = 0.5;
        const panelW = (BWR - BWL) / 5;
        for (let i = 1; i < 5; i++) {
            ctx.beginPath(); ctx.moveTo(BWL + i * panelW, BWT); ctx.lineTo(BWL + i * panelW, BWB); ctx.stroke();
        }
        ctx.beginPath(); ctx.moveTo(BWL, (BWT + BWB) / 2); ctx.lineTo(BWR, (BWT + BWB) / 2); ctx.stroke();

        // Bulletin board for colegio
        if (roomCfg.bulletinBoard && viewAngle === 2) {
            const bbW = (BWR - BWL) * 0.4;
            const bbH = (BWB - BWT) * 0.3;
            const bbX = VPx - bbW / 2;
            const bbY = BWT + (BWB - BWT) * 0.15;
            ctx.fillStyle = '#c49a6c';
            ctx.fillRect(bbX - 3, bbY - 3, bbW + 6, bbH + 6);
            ctx.fillStyle = '#d4a574';
            ctx.fillRect(bbX, bbY, bbW, bbH);
            // Push pins
            ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(bbX + 10, bbY + 8, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#3498db'; ctx.beginPath(); ctx.arc(bbX + bbW - 12, bbY + 10, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.arc(bbX + bbW / 2, bbY + bbH - 10, 3, 0, Math.PI * 2); ctx.fill();
            // Paper notes
            ctx.fillStyle = '#fffde7'; ctx.fillRect(bbX + 6, bbY + 14, 18, 14);
            ctx.fillStyle = '#e3f2fd'; ctx.fillRect(bbX + bbW - 28, bbY + 16, 18, 12);
            ctx.fillStyle = '#fce4ec'; ctx.fillRect(bbX + bbW / 2 - 8, bbY + 8, 16, 13);
        }

        // -- Window (room-type specific) --
        if (roomCfg.windowWall >= 0 && viewAngle === roomCfg.windowWall) {
            const wStyle = roomCfg.windowStyle || 'standard';
            if (wStyle === 'standard') {
                drawStandardWindow();
            } else if (wStyle === 'small') {
                drawSmallWindow();
            } else if (wStyle === 'stained_glass') {
                drawStainedGlassWindow();
            }
        }

        // Mood lighting for restaurante
        if (roomCfg.moodLighting) {
            const glow = ctx.createRadialGradient(VPx, VPy, 10, VPx, VPy, W * 0.6);
            glow.addColorStop(0, 'rgba(255,200,100,0.12)');
            glow.addColorStop(0.5, 'rgba(255,180,80,0.06)');
            glow.addColorStop(1, 'rgba(0,0,0,0.08)');
            ctx.fillStyle = glow;
            ctx.fillRect(RL, RT, RR - RL, RB - RT);
        }

        // -- Baseboard --
        ctx.fillStyle = roomCfg.baseboardColor;
        ctx.fillRect(BWL, BWB - 3, BWR - BWL, 6);
        ctx.beginPath();
        ctx.moveTo(RL, RB); ctx.lineTo(BWL, BWB - 3); ctx.lineTo(BWL, BWB + 3); ctx.lineTo(RL, RB);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(RR, RB); ctx.lineTo(BWR, BWB - 3); ctx.lineTo(BWR, BWB + 3); ctx.lineTo(RR, RB);
        ctx.closePath(); ctx.fill();

        // -- Floor trapezoid --
        const floorG = ctx.createLinearGradient(0, BWB, 0, RB);
        floorG.addColorStop(0, roomCfg.floorGradient[0]);
        floorG.addColorStop(0.4, roomCfg.floorGradient[1]);
        floorG.addColorStop(1, roomCfg.floorGradient[2]);
        ctx.fillStyle = floorG;
        ctx.beginPath();
        ctx.moveTo(BWL, BWB); ctx.lineTo(BWR, BWB); ctx.lineTo(RR, RB); ctx.lineTo(RL, RB);
        ctx.closePath(); ctx.fill();

        // Floor plank/tile lines
        ctx.strokeStyle = roomCfg.floorLineColor;
        ctx.lineWidth = 0.5;
        const plankCount = 12;
        for (let i = 0; i <= plankCount; i++) {
            const frac = i / plankCount;
            const botX = RL + (RR - RL) * frac;
            const topX = BWL + (BWR - BWL) * frac;
            ctx.beginPath(); ctx.moveTo(botX, RB); ctx.lineTo(topX, BWB); ctx.stroke();
        }
        ctx.strokeStyle = roomCfg.floorLineColorH;
        for (let i = 1; i < 8; i++) {
            const t = i / 8;
            const y = BWB + (RB - BWB) * t;
            const lx = BWL + (RL - BWL) * t;
            const rx = BWR + (RR - BWR) * t;
            ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(rx, y); ctx.stroke();
        }

        // -- Crown molding --
        ctx.strokeStyle = 'rgba(200,192,178,0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(BWL, BWT); ctx.lineTo(BWR, BWT); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(RL, RT); ctx.lineTo(BWL, BWT); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(BWR, BWT); ctx.lineTo(RR, RT); ctx.stroke();
    }

    // --- Room-specific helper drawing functions ---

    function drawStandardWindow() {
        const winW = (BWR - BWL) * 0.28;
        const winH = (BWB - BWT) * 0.52;
        const winX = VPx - winW / 2;
        const winY = BWT + (BWB - BWT) * 0.08;
        const glowG = ctx.createRadialGradient(VPx, winY + winH / 2, 10, VPx, winY + winH / 2, winW * 1.5);
        glowG.addColorStop(0, 'rgba(255,248,220,0.22)');
        glowG.addColorStop(1, 'rgba(255,248,220,0)');
        ctx.fillStyle = glowG;
        ctx.fillRect(winX - winW * 0.5, winY - winH * 0.3, winW * 2, winH * 1.8);
        ctx.fillStyle = '#d8d0c2';
        ctx.fillRect(winX - 4, winY - 4, winW + 8, winH + 8);
        const skyG = ctx.createLinearGradient(0, winY, 0, winY + winH);
        skyG.addColorStop(0, '#87CEEB'); skyG.addColorStop(0.6, '#B0E0E6'); skyG.addColorStop(1, '#c8e6c9');
        ctx.fillStyle = skyG;
        ctx.fillRect(winX, winY, winW, winH);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath(); ctx.arc(winX + winW * 0.3, winY + winH * 0.25, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(winX + winW * 0.4, winY + winH * 0.22, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#cec6b8';
        ctx.fillRect(VPx - 1.5, winY, 3, winH);
        ctx.fillRect(winX, winY + winH / 2 - 1.5, winW, 3);
        ctx.fillStyle = 'rgba(140,130,118,0.18)';
        ctx.beginPath(); ctx.moveTo(winX - 8, winY - 6);
        ctx.quadraticCurveTo(winX - 14, winY + winH / 2, winX - 6, winY + winH + 4);
        ctx.lineTo(winX - 2, winY + winH + 4);
        ctx.quadraticCurveTo(winX - 8, winY + winH / 2, winX - 2, winY - 6);
        ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(winX + winW + 8, winY - 6);
        ctx.quadraticCurveTo(winX + winW + 14, winY + winH / 2, winX + winW + 6, winY + winH + 4);
        ctx.lineTo(winX + winW + 2, winY + winH + 4);
        ctx.quadraticCurveTo(winX + winW + 8, winY + winH / 2, winX + winW + 2, winY - 6);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#b0a898';
        ctx.fillRect(winX - 16, winY - 8, winW + 32, 2.5);
        ctx.beginPath(); ctx.arc(winX - 16, winY - 7, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(winX + winW + 16, winY - 7, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,248,220,0.06)';
        ctx.beginPath(); ctx.moveTo(winX, BWB); ctx.lineTo(winX - 40, RB);
        ctx.lineTo(winX + winW + 40, RB); ctx.lineTo(winX + winW, BWB);
        ctx.closePath(); ctx.fill();
    }

    function drawSmallWindow() {
        const winW = (BWR - BWL) * 0.18;
        const winH = (BWB - BWT) * 0.3;
        const winX = VPx - winW / 2;
        const winY = BWT + (BWB - BWT) * 0.12;
        ctx.fillStyle = '#d8d0c2';
        ctx.fillRect(winX - 3, winY - 3, winW + 6, winH + 6);
        const skyG = ctx.createLinearGradient(0, winY, 0, winY + winH);
        skyG.addColorStop(0, '#87CEEB'); skyG.addColorStop(1, '#B0E0E6');
        ctx.fillStyle = skyG;
        ctx.fillRect(winX, winY, winW, winH);
        // Frosted glass effect
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillRect(winX, winY, winW, winH);
        ctx.fillStyle = '#cec6b8';
        ctx.fillRect(VPx - 1, winY, 2, winH);
        ctx.fillRect(winX, winY + winH / 2 - 1, winW, 2);
    }

    function drawStainedGlassWindow() {
        const winW = (BWR - BWL) * 0.3;
        const winH = (BWB - BWT) * 0.65;
        const winX = VPx - winW / 2;
        const winY = BWT + (BWB - BWT) * 0.04;
        // Arched top
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.moveTo(winX - 4, winY + winH + 4);
        ctx.lineTo(winX - 4, winY + winW / 2);
        ctx.arc(VPx, winY + winW / 2, winW / 2 + 4, Math.PI, 0);
        ctx.lineTo(winX + winW + 4, winY + winH + 4);
        ctx.closePath(); ctx.fill();
        // Stained glass colors
        const sgColors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(winX, winY + winH);
        ctx.lineTo(winX, winY + winW / 2);
        ctx.arc(VPx, winY + winW / 2, winW / 2, Math.PI, 0);
        ctx.lineTo(winX + winW, winY + winH);
        ctx.closePath(); ctx.clip();
        // Fill panes
        const paneW = winW / 3;
        const paneH = winH / 3;
        for (let pr = 0; pr < 3; pr++) {
            for (let pc = 0; pc < 3; pc++) {
                ctx.fillStyle = sgColors[(pr * 3 + pc) % sgColors.length];
                ctx.globalAlpha = 0.5;
                ctx.fillRect(winX + pc * paneW, winY + pr * paneH, paneW, paneH);
                ctx.globalAlpha = 1;
            }
        }
        // Lead lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        for (let i = 1; i < 3; i++) {
            ctx.beginPath(); ctx.moveTo(winX + i * paneW, winY); ctx.lineTo(winX + i * paneW, winY + winH); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(winX, winY + i * paneH); ctx.lineTo(winX + winW, winY + i * paneH); ctx.stroke();
        }
        ctx.restore();
        // Glow from stained glass
        const glow = ctx.createRadialGradient(VPx, winY + winH / 2, 5, VPx, winY + winH / 2, winW * 1.2);
        glow.addColorStop(0, 'rgba(255,220,100,0.15)');
        glow.addColorStop(1, 'rgba(255,220,100,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(winX - winW, winY - winH * 0.2, winW * 3, winH * 1.5);
    }

    function drawStoneTexture(x1, y1, x2, y2, x3, y3, x4, y4) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4);
        ctx.closePath(); ctx.clip();
        ctx.strokeStyle = 'rgba(100,90,75,0.15)';
        ctx.lineWidth = 0.5;
        const minX = Math.min(x1, x2, x3, x4);
        const maxX = Math.max(x1, x2, x3, x4);
        const minY = Math.min(y1, y2, y3, y4);
        const maxY = Math.max(y1, y2, y3, y4);
        for (let sy = minY; sy < maxY; sy += 12) {
            const offset = ((sy / 12) % 2) * 15;
            for (let sx = minX + offset; sx < maxX; sx += 30) {
                ctx.strokeRect(sx, sy, 28, 10);
            }
        }
        ctx.restore();
    }

    function drawStoneTextureRect(x, y, w, h) {
        ctx.strokeStyle = 'rgba(100,90,75,0.15)';
        ctx.lineWidth = 0.5;
        for (let sy = y; sy < y + h; sy += 12) {
            const offset = (Math.floor((sy - y) / 12) % 2) * 15;
            for (let sx = x + offset; sx < x + w; sx += 30) {
                ctx.strokeRect(sx, sy, 28, 10);
            }
        }
    }

    function drawTileWallTexture(x1, y1, x2, y2, x3, y3, x4, y4, side) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4);
        ctx.closePath(); ctx.clip();
        ctx.strokeStyle = 'rgba(180,200,210,0.25)';
        ctx.lineWidth = 0.5;
        const minX = Math.min(x1, x2, x3, x4);
        const maxX = Math.max(x1, x2, x3, x4);
        const minY = Math.min(y1, y2, y3, y4);
        const maxY = Math.max(y1, y2, y3, y4);
        for (let sy = minY; sy < maxY; sy += 16) {
            for (let sx = minX; sx < maxX; sx += 16) {
                ctx.strokeRect(sx, sy, 14, 14);
            }
        }
        ctx.restore();
    }

    function drawTileWallTextureRect(x, y, w, h) {
        ctx.strokeStyle = 'rgba(180,200,210,0.25)';
        ctx.lineWidth = 0.5;
        for (let sy = y; sy < y + h; sy += 16) {
            for (let sx = x; sx < x + w; sx += 16) {
                ctx.strokeRect(sx, sy, 14, 14);
            }
        }
    }

    // ===================== FLOOR GRID DRAWING =====================

    function drawFloorGrid() {
        for (let r = 0; r < FLOOR_ROWS; r++) {
            for (let c = 0; c < FLOOR_COLS; c++) {
                const quad = getFloorSlotQuad(r, c);
                const isHover = (hoverType === 'floor' && hoverR === r && hoverC === c);
                const occupied = floorGrid[r][c];

                // Draw grid cell outline
                if (!occupied) {
                    ctx.strokeStyle = isHover && selectedTool && !selectedTool.wall ? 'rgba(255,200,60,0.6)' : 'rgba(180,165,140,0.15)';
                    ctx.lineWidth = isHover ? 1.5 : 0.5;
                    if (!isHover) { ctx.setLineDash([3, 4]); }
                    ctx.beginPath();
                    ctx.moveTo(quad[0].x, quad[0].y);
                    for (let i = 1; i < 4; i++) ctx.lineTo(quad[i].x, quad[i].y);
                    ctx.closePath(); ctx.stroke();
                    ctx.setLineDash([]);

                    if (isHover && selectedTool && !selectedTool.wall && selectedTool.name !== 'eraser') {
                        // Highlight fill
                        ctx.fillStyle = 'rgba(255,220,100,0.12)';
                        ctx.beginPath();
                        ctx.moveTo(quad[0].x, quad[0].y);
                        for (let i = 1; i < 4; i++) ctx.lineTo(quad[i].x, quad[i].y);
                        ctx.closePath(); ctx.fill();
                    }
                }
            }
        }
    }

    function drawBackWallGrid() {
        for (let r = 0; r < BWALL_ROWS; r++) {
            for (let c = 0; c < BWALL_COLS; c++) {
                const rect = getBackWallSlotRect(r, c);
                const isHover = (hoverType === 'backwall' && hoverR === r && hoverC === c);
                const occupied = backWallGrid()[r][c];

                if (!occupied) {
                    if (selectedTool && selectedTool.wall) {
                        ctx.strokeStyle = isHover ? 'rgba(255,200,60,0.5)' : 'rgba(180,170,155,0.15)';
                        ctx.lineWidth = isHover ? 1.5 : 0.5;
                        if (!isHover) ctx.setLineDash([3, 3]);
                        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
                        ctx.setLineDash([]);
                    }
                    if (isHover && selectedTool && selectedTool.wall && selectedTool.name !== 'eraser') {
                        ctx.fillStyle = 'rgba(255,220,100,0.1)';
                        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
                    }
                }
            }
        }
    }

    function drawSideWallSlots() {
        for (let i = 0; i < SIDE_SLOTS; i++) {
            const lq = getLeftWallSlotQuad(i);
            const isLHover = (hoverType === 'leftwall' && hoverR === i);
            if (!leftWallGrid()[i] && selectedTool && selectedTool.wall) {
                ctx.strokeStyle = isLHover ? 'rgba(255,200,60,0.5)' : 'rgba(180,170,155,0.12)';
                ctx.lineWidth = isLHover ? 1.5 : 0.5;
                if (!isLHover) ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(lq[0].x, lq[0].y);
                for (let j = 1; j < 4; j++) ctx.lineTo(lq[j].x, lq[j].y);
                ctx.closePath(); ctx.stroke();
                ctx.setLineDash([]);
            }

            const rq = getRightWallSlotQuad(i);
            const isRHover = (hoverType === 'rightwall' && hoverR === i);
            if (!rightWallGrid()[i] && selectedTool && selectedTool.wall) {
                ctx.strokeStyle = isRHover ? 'rgba(255,200,60,0.5)' : 'rgba(180,170,155,0.12)';
                ctx.lineWidth = isRHover ? 1.5 : 0.5;
                if (!isRHover) ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(rq[0].x, rq[0].y);
                for (let j = 1; j < 4; j++) ctx.lineTo(rq[j].x, rq[j].y);
                ctx.closePath(); ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }

    // ===================== ITEM DRAWING (PERSPECTIVE) =====================

    function drawFloorItemAt(cx, cy, scale, item, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        // Draw item centered at 0,0
        drawFloorItemShape(item);
        ctx.restore();
    }

    function drawFloorItemShape(item) {
        const rt = item.roofType;

        if (rt === 'modern_sofa') {
            // Sofa from front view
            ctx.fillStyle = darken(item.baseColor, 15);
            // Back
            ctx.fillRect(-28, -22, 56, 12);
            // Seat
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-28, -10, 56, 14);
            // Cushion highlights
            ctx.fillStyle = lighten(item.baseColor, 15);
            ctx.fillRect(-26, -8, 24, 10);
            ctx.fillRect(2, -8, 24, 10);
            // Arm rests
            ctx.fillStyle = darken(item.baseColor, 20);
            ctx.fillRect(-32, -20, 5, 26);
            ctx.fillRect(27, -20, 5, 26);
            // Legs
            ctx.fillStyle = '#555';
            ctx.fillRect(-28, 4, 3, 6);
            ctx.fillRect(25, 4, 3, 6);
            // Pillow
            ctx.fillStyle = '#e8c9a0';
            ctx.beginPath(); ctx.ellipse(-18, -14, 6, 4, -0.2, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'flat_tv') {
            // TV on a stand
            ctx.fillStyle = '#4a3a2a';
            ctx.fillRect(-22, 0, 44, 10);
            // Legs
            ctx.fillStyle = '#555';
            ctx.fillRect(-18, 10, 3, 5);
            ctx.fillRect(15, 10, 3, 5);
            // TV screen
            ctx.fillStyle = '#111';
            ctx.fillRect(-20, -28, 40, 26);
            const scrG = ctx.createLinearGradient(-18, -26, 18, 0);
            scrG.addColorStop(0, '#1a237e');
            scrG.addColorStop(0.5, '#283593');
            scrG.addColorStop(1, '#1a237e');
            ctx.fillStyle = scrG;
            ctx.fillRect(-18, -26, 36, 22);
            // Screen shimmer
            ctx.fillStyle = 'rgba(100,200,255,0.12)';
            ctx.fillRect(-16, -24, 32, 8);
            // Stand neck
            ctx.fillStyle = '#333';
            ctx.fillRect(-2, -2, 4, 4);

        } else if (rt === 'coffee_table') {
            // Coffee table front view
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-20, -4, 40, 5);
            // Legs (angled)
            ctx.strokeStyle = '#8a7a6a';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(-16, 1); ctx.lineTo(-20, 14); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(16, 1); ctx.lineTo(20, 14); ctx.stroke();
            // Magazine
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(-5, -7, 10, 3);

        } else if (rt === 'floor_lamp') {
            // Base
            ctx.fillStyle = '#444';
            ctx.beginPath(); ctx.ellipse(0, 14, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
            // Pole
            ctx.fillStyle = '#555';
            ctx.fillRect(-1.5, -30, 3, 44);
            // Shade
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-10, -40, 20, 12);
            ctx.fillStyle = lighten(item.baseColor, 20);
            ctx.beginPath(); ctx.ellipse(0, -40, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
            // Glow
            const glow = ctx.createRadialGradient(0, -28, 2, 0, -28, 24);
            glow.addColorStop(0, 'rgba(255,241,180,0.35)');
            glow.addColorStop(1, 'rgba(255,241,180,0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(0, -28, 24, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'dining_table') {
            // Table top
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-24, -4, 48, 5);
            // Legs
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(-20, 1); ctx.lineTo(-22, 16); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(20, 1); ctx.lineTo(22, 16); ctx.stroke();
            // Plates
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.ellipse(-8, -7, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(8, -7, 5, 3, 0, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'modern_bed') {
            // Headboard
            ctx.fillStyle = '#5a4a3a';
            ctx.fillRect(-26, -28, 52, 18);
            // Mattress
            ctx.fillStyle = '#f5f0e8';
            ctx.fillRect(-26, -10, 52, 16);
            // Duvet
            ctx.fillStyle = item.baseColor;
            ctx.globalAlpha *= 0.7;
            ctx.fillRect(-24, -4, 48, 12);
            ctx.globalAlpha /= 0.7;
            // Pillows
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.ellipse(-12, -16, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f0f0f0';
            ctx.beginPath(); ctx.ellipse(10, -16, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
            // Legs
            ctx.fillStyle = '#444';
            ctx.fillRect(-26, 6, 3, 5);
            ctx.fillRect(23, 6, 3, 5);

        } else if (rt === 'desk_computer') {
            // Desk surface
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-22, -2, 44, 5);
            // Legs
            ctx.fillStyle = '#666';
            ctx.fillRect(-20, 3, 2, 12);
            ctx.fillRect(18, 3, 2, 12);
            // Monitor
            ctx.fillStyle = '#222';
            ctx.fillRect(-10, -22, 20, 16);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(-8, -20, 16, 12);
            // Stand
            ctx.fillStyle = '#444';
            ctx.fillRect(-1.5, -6, 3, 5);
            ctx.fillRect(-5, -2, 10, 2);
            // Keyboard
            ctx.fillStyle = '#555';
            ctx.fillRect(-8, 0, 16, 3);

        } else if (rt === 'bookshelf') {
            // Shelf frame
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-16, -36, 32, 48);
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.strokeStyle = darken(item.baseColor, 25);
            ctx.lineWidth = 0.5;
            ctx.strokeRect(-16, -36, 32, 48);
            // Shelves and books
            const shelfColors = ['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#8e24aa', '#00acc1', '#f4511e'];
            for (let shelf = 0; shelf < 4; shelf++) {
                const sy = -32 + shelf * 12;
                ctx.fillStyle = darken(item.baseColor, 10);
                ctx.fillRect(-14, sy + 9, 28, 2);
                for (let b = 0; b < 4; b++) {
                    const bx = -12 + b * 7;
                    const bh = 5 + (shelf * 3 + b) % 4;
                    ctx.fillStyle = shelfColors[(shelf * 4 + b) % shelfColors.length];
                    ctx.fillRect(bx, sy + 9 - bh, 5, bh);
                }
            }

        } else if (rt === 'modern_plant') {
            // Pot
            ctx.fillStyle = '#e0e0e0';
            ctx.beginPath();
            ctx.moveTo(-8, 4); ctx.lineTo(8, 4); ctx.lineTo(6, 16); ctx.lineTo(-6, 16);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ccc';
            ctx.fillRect(-9, 2, 18, 3);
            // Stem
            ctx.strokeStyle = '#388E3C';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(0, -12); ctx.stroke();
            // Leaves
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath(); ctx.ellipse(-7, -10, 6, 10, -0.3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.ellipse(6, -14, 5, 8, 0.4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#43A047';
            ctx.beginPath(); ctx.ellipse(-2, -20, 5, 7, -0.1, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'modern_rug') {
            // Flat rug (draw as perspective rectangle on floor)
            ctx.fillStyle = item.baseColor;
            ctx.globalAlpha *= 0.75;
            ctx.fillRect(-24, -6, 48, 12);
            ctx.strokeStyle = darken(item.baseColor, 30);
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-22, -4, 44, 8);
            ctx.fillStyle = darken(item.baseColor, 20);
            ctx.beginPath();
            ctx.moveTo(0, -4); ctx.lineTo(6, 0); ctx.lineTo(0, 4); ctx.lineTo(-6, 0);
            ctx.closePath(); ctx.fill();
            ctx.globalAlpha /= 0.75;

        // ===== NEW ROOM-TYPE ITEMS =====

        } else if (rt === 'ri_nightstand') {
            // Small bedside table with drawer
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-10, -8, 20, 14);
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.fillRect(-8, -4, 16, 5); // drawer
            ctx.fillStyle = '#c0c0c0';
            ctx.beginPath(); ctx.arc(0, -1, 1.5, 0, Math.PI * 2); ctx.fill(); // knob
            // Legs
            ctx.fillStyle = '#555';
            ctx.fillRect(-9, 6, 2, 5);
            ctx.fillRect(7, 6, 2, 5);

        } else if (rt === 'ri_wardrobe') {
            // Tall wardrobe with double doors
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-18, -38, 36, 48);
            ctx.fillStyle = darken(item.baseColor, 12);
            ctx.fillRect(-16, -36, 15, 44);
            ctx.fillRect(1, -36, 15, 44);
            ctx.fillStyle = '#c0c0c0';
            ctx.beginPath(); ctx.arc(-2, -14, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(2, -14, 1.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ri_chair') {
            // Simple chair
            ctx.fillStyle = item.baseColor;
            // Seat
            ctx.fillRect(-10, -2, 20, 4);
            // Back
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.fillRect(-10, -18, 20, 16);
            // Legs
            ctx.fillStyle = '#555';
            ctx.fillRect(-9, 2, 2, 10);
            ctx.fillRect(7, 2, 2, 10);

        } else if (rt === 'ri_armchair') {
            // Comfy armchair
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-18, -16, 36, 10); // back
            ctx.fillStyle = lighten(item.baseColor, 10);
            ctx.fillRect(-18, -6, 36, 12); // seat
            // Arms
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.fillRect(-22, -14, 5, 18);
            ctx.fillRect(17, -14, 5, 18);
            // Legs
            ctx.fillStyle = '#555';
            ctx.fillRect(-16, 6, 3, 5);
            ctx.fillRect(13, 6, 3, 5);
            // Cushion
            ctx.fillStyle = lighten(item.baseColor, 20);
            ctx.beginPath(); ctx.ellipse(0, -10, 10, 4, 0, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ri_bathtub') {
            // Bathtub from front
            ctx.fillStyle = item.baseColor;
            ctx.beginPath();
            ctx.moveTo(-28, 0); ctx.lineTo(28, 0); ctx.lineTo(24, 12); ctx.lineTo(-24, 12);
            ctx.closePath(); ctx.fill();
            // Inner
            ctx.fillStyle = '#e0f0f8';
            ctx.fillRect(-22, -6, 44, 8);
            // Water
            ctx.fillStyle = 'rgba(100,180,255,0.3)';
            ctx.fillRect(-20, -4, 40, 5);
            // Faucet
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(-2, -14, 4, 10);
            ctx.fillRect(-6, -14, 12, 3);
            // Feet
            ctx.fillStyle = '#888';
            ctx.fillRect(-24, 12, 4, 3);
            ctx.fillRect(20, 12, 4, 3);

        } else if (rt === 'ri_toilet') {
            // Toilet from front
            ctx.fillStyle = item.baseColor;
            // Tank
            ctx.fillRect(-8, -18, 16, 12);
            // Bowl
            ctx.beginPath();
            ctx.ellipse(0, 2, 10, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#e0e8f0';
            ctx.beginPath();
            ctx.ellipse(0, 2, 8, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            // Flush button
            ctx.fillStyle = '#c0c0c0';
            ctx.beginPath(); ctx.arc(0, -14, 2, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ri_sink') {
            // Bathroom sink
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-14, -2, 28, 4); // counter
            // Basin
            ctx.fillStyle = '#e0e8f0';
            ctx.beginPath(); ctx.ellipse(0, 2, 10, 5, 0, 0, Math.PI); ctx.fill();
            // Pedestal
            ctx.fillStyle = '#ddd';
            ctx.fillRect(-3, 4, 6, 12);
            // Faucet
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(-1, -10, 2, 8);
            ctx.fillRect(-4, -10, 8, 2);

        } else if (rt === 'ri_cabinet') {
            // Small bathroom cabinet
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-14, -16, 28, 26);
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.fillRect(-12, -14, 11, 10);
            ctx.fillRect(1, -14, 11, 10);
            ctx.fillRect(-12, -2, 24, 8);
            ctx.fillStyle = '#c0c0c0';
            ctx.beginPath(); ctx.arc(-6, -9, 1.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(6, -9, 1.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(0, 2, 1.2, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ri_towelrack') {
            // Standing towel rack
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(-1.5, -28, 3, 38);
            ctx.fillRect(-12, -28, 24, 2);
            ctx.fillRect(-12, -16, 24, 2);
            // Base
            ctx.beginPath(); ctx.ellipse(0, 12, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
            // Towels
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(-10, -26, 20, 8);
            ctx.fillStyle = '#fff';
            ctx.fillRect(-10, -14, 20, 6);

        } else if (rt === 'ri_smallshelf') {
            // Small bathroom shelf
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-12, -2, 24, 3);
            ctx.fillRect(-12, -16, 24, 3);
            // Sides
            ctx.fillRect(-12, -16, 2, 17);
            ctx.fillRect(10, -16, 2, 17);
            // Items on shelf
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(-8, -14, 5, 10);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, -14, 4, 10);
            ctx.fillStyle = '#f5c542';
            ctx.fillRect(5, -14, 4, 8);

        } else if (rt === 'ri_roundtable') {
            // Round dining table
            ctx.fillStyle = item.baseColor;
            ctx.beginPath(); ctx.ellipse(0, -2, 22, 8, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.beginPath(); ctx.ellipse(0, 0, 22, 8, 0, Math.PI * 0.8, Math.PI * 0.2, true); ctx.fill();
            // Center leg
            ctx.fillStyle = '#555';
            ctx.fillRect(-2, 4, 4, 10);
            ctx.beginPath(); ctx.ellipse(0, 14, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
            // Plates
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.ellipse(-8, -3, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(8, -3, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ri_chairs_pair') {
            // Two chairs side by side
            for (let dx of [-14, 10]) {
                ctx.fillStyle = item.baseColor;
                ctx.fillRect(dx, -2, 12, 3); // seat
                ctx.fillStyle = darken(item.baseColor, 15);
                ctx.fillRect(dx, -14, 12, 12); // back
                ctx.fillStyle = '#555';
                ctx.fillRect(dx, 1, 2, 8);
                ctx.fillRect(dx + 10, 1, 2, 8);
            }

        } else if (rt === 'ri_barcounter') {
            // Bar counter
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-28, -6, 56, 6); // top
            ctx.fillStyle = darken(item.baseColor, 10);
            ctx.fillRect(-26, 0, 52, 14); // front
            ctx.fillStyle = lighten(item.baseColor, 15);
            ctx.fillRect(-24, 2, 48, 2); // trim
            // Legs
            ctx.fillStyle = '#333';
            ctx.fillRect(-26, 14, 3, 3);
            ctx.fillRect(23, 14, 3, 3);

        } else if (rt === 'ri_chandelier') {
            // Chandelier (decorative ceiling light rendered as floor item displayed above)
            ctx.fillStyle = item.baseColor;
            // Chain
            ctx.fillStyle = '#888';
            ctx.fillRect(-1, -40, 2, 14);
            // Base plate
            ctx.fillStyle = '#a0a0a0';
            ctx.beginPath(); ctx.ellipse(0, -26, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
            // Arms and lights
            ctx.fillStyle = item.baseColor;
            for (let a = -2; a <= 2; a++) {
                const ax = a * 8;
                ctx.fillRect(ax - 1, -26, 2, 8);
                // Light bulb
                ctx.fillStyle = '#fffde0';
                ctx.beginPath(); ctx.arc(ax, -16, 3, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = item.baseColor;
            }
            // Glow
            const glow = ctx.createRadialGradient(0, -20, 3, 0, -20, 30);
            glow.addColorStop(0, 'rgba(255,241,180,0.25)');
            glow.addColorStop(1, 'rgba(255,241,180,0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(0, -20, 30, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ri_kitchenisland') {
            // Kitchen island
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-26, -6, 52, 6); // countertop
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.fillRect(-24, 0, 48, 14); // body
            // Drawers
            ctx.fillStyle = darken(item.baseColor, 5);
            ctx.fillRect(-22, 2, 20, 5);
            ctx.fillRect(2, 2, 20, 5);
            ctx.fillRect(-22, 8, 42, 5);
            // Knobs
            ctx.fillStyle = '#c0c0c0';
            ctx.beginPath(); ctx.arc(-12, 4.5, 1, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(12, 4.5, 1, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ri_stool') {
            // Bar stool
            ctx.fillStyle = item.baseColor;
            ctx.beginPath(); ctx.ellipse(0, -4, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
            // Legs (X pattern)
            ctx.strokeStyle = '#777';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(-6, 14); ctx.lineTo(0, -4); ctx.lineTo(6, 14); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(6, 14); ctx.lineTo(0, 2); ctx.lineTo(-6, 14); ctx.stroke();
            // Foot rest
            ctx.strokeStyle = '#888';
            ctx.beginPath(); ctx.moveTo(-5, 8); ctx.lineTo(5, 8); ctx.stroke();

        } else if (rt === 'ri_fridge') {
            // Refrigerator
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-14, -38, 28, 48);
            // Door split
            ctx.strokeStyle = darken(item.baseColor, 20);
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(14, -14); ctx.stroke();
            // Handles
            ctx.fillStyle = '#888';
            ctx.fillRect(8, -32, 2, 14);
            ctx.fillRect(8, -10, 2, 16);
            // Ice dispenser
            ctx.fillStyle = darken(item.baseColor, 10);
            ctx.fillRect(-6, -30, 10, 8);

        } else if (rt === 'ri_oven') {
            // Oven/stove
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-16, -18, 32, 28);
            // Oven door window
            ctx.fillStyle = '#222';
            ctx.fillRect(-12, -6, 24, 14);
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(-10, -4, 20, 10);
            // Stovetop
            ctx.fillStyle = darken(item.baseColor, 10);
            ctx.fillRect(-16, -22, 32, 6);
            // Burners
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(-6, -19, 4, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(6, -19, 4, 0, Math.PI * 2); ctx.stroke();
            // Handle
            ctx.fillStyle = '#888';
            ctx.fillRect(-8, -8, 16, 2);
            // Knobs
            ctx.fillStyle = '#666';
            for (let k = -2; k <= 2; k++) {
                ctx.beginPath(); ctx.arc(k * 5, -16, 1.5, 0, Math.PI * 2); ctx.fill();
            }

        } else if (rt === 'ri_sinkcounter') {
            // Kitchen sink counter
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-20, -4, 40, 5); // counter
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.fillRect(-18, 1, 36, 12); // cabinet
            // Sink basin
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(-10, -3, 20, 3);
            ctx.fillStyle = '#d0d8e0';
            ctx.fillRect(-8, -2, 16, 2);
            // Faucet
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(-1, -12, 2, 8);
            ctx.fillRect(-4, -12, 8, 2);
            // Cabinet doors
            ctx.strokeStyle = darken(item.baseColor, 25);
            ctx.lineWidth = 0.5;
            ctx.strokeRect(-16, 2, 15, 10);
            ctx.strokeRect(1, 2, 15, 10);

        } else if (rt === 'ri_schooldesk') {
            // School desk with attached chair feel
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-16, -4, 32, 4); // desk surface
            // Legs
            ctx.fillStyle = '#666';
            ctx.fillRect(-14, 0, 2, 12);
            ctx.fillRect(12, 0, 2, 12);
            // Book on desk
            ctx.fillStyle = '#3498db';
            ctx.fillRect(-8, -7, 10, 3);
            // Pencil
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(4, -6, 8, 1.5);
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(2, -6, 2, 1.5);

        } else if (rt === 'ri_teacherdesk') {
            // Larger teacher's desk
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-24, -4, 48, 5); // top
            ctx.fillStyle = darken(item.baseColor, 12);
            ctx.fillRect(-22, 1, 44, 12); // body
            // Drawers
            ctx.fillStyle = darken(item.baseColor, 5);
            ctx.fillRect(-20, 2, 18, 5);
            ctx.fillRect(-20, 8, 18, 4);
            ctx.fillStyle = '#c0c0c0';
            ctx.beginPath(); ctx.arc(-11, 4.5, 1, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(-11, 10, 1, 0, Math.PI * 2); ctx.fill();
            // Items on desk
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(8, -8, 8, 3); // book
            ctx.fillStyle = '#fff';
            ctx.fillRect(-4, -7, 6, 3); // papers

        } else if (rt === 'ri_globe') {
            // Globe on stand
            ctx.fillStyle = '#666';
            ctx.fillRect(-1, 0, 2, 10); // stand
            ctx.beginPath(); ctx.ellipse(0, 10, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
            // Globe sphere
            ctx.fillStyle = '#4a90d9';
            ctx.beginPath(); ctx.arc(0, -6, 10, 0, Math.PI * 2); ctx.fill();
            // Continents
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.ellipse(-4, -8, 4, 5, -0.3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(5, -4, 3, 4, 0.5, 0, Math.PI * 2); ctx.fill();
            // Stand arch
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(0, -6, 12, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();

        } else if (rt === 'ri_pew') {
            // Church pew (bench with backrest)
            ctx.fillStyle = item.baseColor;
            // Backrest
            ctx.fillRect(-28, -14, 56, 4);
            // Seat
            ctx.fillStyle = lighten(item.baseColor, 10);
            ctx.fillRect(-28, -6, 56, 5);
            // Arm ends
            ctx.fillStyle = darken(item.baseColor, 15);
            ctx.fillRect(-30, -14, 4, 16);
            ctx.fillRect(26, -14, 4, 16);
            // Legs
            ctx.fillStyle = '#555';
            ctx.fillRect(-26, -1, 3, 10);
            ctx.fillRect(23, -1, 3, 10);

        } else if (rt === 'ri_altar') {
            // Church altar table
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-22, -8, 44, 6); // top
            // Cloth draping
            ctx.fillStyle = '#fff';
            ctx.fillRect(-24, -10, 48, 4);
            ctx.fillStyle = '#DAA520';
            ctx.fillRect(-24, -7, 48, 1.5); // gold trim
            // Body
            ctx.fillStyle = darken(item.baseColor, 10);
            ctx.fillRect(-20, -2, 40, 12);
            // Cross decoration on front
            ctx.fillStyle = '#DAA520';
            ctx.fillRect(-1.5, 0, 3, 8);
            ctx.fillRect(-4, 2, 8, 2);
            // Candles on top
            ctx.fillStyle = '#fff';
            ctx.fillRect(-16, -16, 3, 8);
            ctx.fillRect(13, -16, 3, 8);
            ctx.fillStyle = '#f5c542';
            ctx.beginPath(); ctx.arc(-14.5, -17, 2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(14.5, -17, 2, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ri_candelabra') {
            // Standing candelabra
            ctx.fillStyle = item.baseColor;
            // Base
            ctx.beginPath(); ctx.ellipse(0, 12, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
            // Stem
            ctx.fillRect(-1.5, -20, 3, 32);
            // Arms
            ctx.fillRect(-14, -20, 28, 2);
            // Candles
            ctx.fillStyle = '#fff';
            for (let cx of [-12, -6, 0, 6, 12]) {
                ctx.fillRect(cx - 1.5, -30, 3, 10);
            }
            // Flames
            ctx.fillStyle = '#f5c542';
            for (let cx of [-12, -6, 0, 6, 12]) {
                ctx.beginPath();
                ctx.moveTo(cx, -34);
                ctx.quadraticCurveTo(cx + 2, -32, cx, -30);
                ctx.quadraticCurveTo(cx - 2, -32, cx, -34);
                ctx.fill();
            }

        } else if (rt === 'ri_podium') {
            // Church podium/lectern
            ctx.fillStyle = item.baseColor;
            // Stand body (trapezoidal)
            ctx.beginPath();
            ctx.moveTo(-10, -22); ctx.lineTo(10, -22);
            ctx.lineTo(14, 10); ctx.lineTo(-14, 10);
            ctx.closePath(); ctx.fill();
            // Slanted top
            ctx.fillStyle = lighten(item.baseColor, 10);
            ctx.beginPath();
            ctx.moveTo(-12, -22); ctx.lineTo(12, -22);
            ctx.lineTo(10, -30); ctx.lineTo(-10, -26);
            ctx.closePath(); ctx.fill();
            // Book on top
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(-8, -28, 16, 4);
            // Cross decoration
            ctx.fillStyle = '#DAA520';
            ctx.fillRect(-1, -16, 2, 10);
            ctx.fillRect(-4, -12, 8, 2);
        }

        // Label
        ctx.fillStyle = 'rgba(60,40,15,0.85)';
        ctx.font = 'bold 9px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.name, 0, 24);
    }

    // ---- Wall item drawing (back wall, centered in slot) ----
    function drawWallItemAt(cx, cy, slotW, slotH, item, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);
        const sc = Math.min(slotW / 28, slotH / 22);
        ctx.scale(sc, sc);
        drawWallItemShape(item);
        ctx.restore();
    }

    function drawWallItemShape(item) {
        const rt = item.roofType;

        if (rt === 'wall_painting') {
            const pw = 34, ph = 24;
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(-pw / 2 + 2, -ph / 2 + 2, pw, ph);
            ctx.fillStyle = '#3e3e3e';
            ctx.fillRect(-pw / 2 - 2, -ph / 2 - 2, pw + 4, ph + 4);
            ctx.fillStyle = '#f5f0e8';
            ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-pw / 2 + 2, -ph / 2 + 2, pw / 2 - 2, ph / 2 - 2);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(1, -ph / 2 + 2, pw / 2 - 2, ph / 2 - 2);
            ctx.fillStyle = '#f39c12';
            ctx.fillRect(-pw / 2 + 2, 1, pw / 2 - 2, ph / 2 - 2);
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(1, 1, pw / 2 - 2, ph / 2 - 2);

        } else if (rt === 'wall_shelf') {
            const sw = 40;
            ctx.fillStyle = '#8a7a6a';
            ctx.fillRect(-10, 2, 2, 8);
            ctx.fillRect(8, 2, 2, 8);
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-sw / 2, 0, sw, 3);
            ctx.fillStyle = darken(item.baseColor, 20);
            ctx.fillRect(-sw / 2, 3, sw, 1);
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(-14, -10, 6, 10);
            ctx.beginPath(); ctx.arc(-11, -10, 3.5, Math.PI, 0); ctx.fill();
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(-3, -8, 4, 8);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(2, -9, 4, 9);
            ctx.fillStyle = '#f5c542';
            ctx.fillRect(12, -6, 2, 6);
            ctx.fillStyle = '#ff9800';
            ctx.beginPath(); ctx.arc(13, -7, 1.8, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'wall_clock') {
            const rad = 14;
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.beginPath(); ctx.arc(1, 1, rad + 1, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = item.baseColor;
            ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(0, 0, rad - 2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#333';
            for (let i = 0; i < 12; i++) {
                const a = i * Math.PI / 6;
                ctx.beginPath(); ctx.arc(Math.cos(a) * (rad - 4), Math.sin(a) * (rad - 4), 1, 0, Math.PI * 2); ctx.fill();
            }
            ctx.strokeStyle = '#333'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(4, -7); ctx.stroke();
            ctx.strokeStyle = '#555'; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-2, -9); ctx.stroke();
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'wall_mirror') {
            const mw = 24, mh = 32;
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(-mw / 2 + 2, -mh / 2 + 2, mw, mh);
            ctx.fillStyle = '#555';
            ctx.fillRect(-mw / 2 - 1.5, -mh / 2 - 1.5, mw + 3, mh + 3);
            const mirG = ctx.createLinearGradient(-mw / 2, -mh / 2, mw / 2, mh / 2);
            mirG.addColorStop(0, '#e8f4f8');
            mirG.addColorStop(0.3, '#d0e8f0');
            mirG.addColorStop(0.7, '#d5eaf2');
            mirG.addColorStop(1, '#e0f0f5');
            ctx.fillStyle = mirG;
            ctx.fillRect(-mw / 2, -mh / 2, mw, mh);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.moveTo(-mw / 2 + 3, -mh / 2); ctx.lineTo(-mw / 2 + 7, -mh / 2);
            ctx.lineTo(-mw / 2 + 3, mh / 2); ctx.lineTo(-mw / 2, mh / 2);
            ctx.closePath(); ctx.fill();

        } else if (rt === 'wall_tv') {
            const tw = 48, th = 28;
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.fillRect(-tw / 2 + 2, -th / 2 + 2, tw, th);
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(-tw / 2, -th / 2, tw, th);
            const scrG = ctx.createLinearGradient(-tw / 2 + 2, -th / 2 + 2, tw / 2 - 2, th / 2 - 2);
            scrG.addColorStop(0, '#1a237e');
            scrG.addColorStop(0.5, '#283593');
            scrG.addColorStop(1, '#1a237e');
            ctx.fillStyle = scrG;
            ctx.fillRect(-tw / 2 + 2, -th / 2 + 2, tw - 4, th - 4);
            ctx.fillStyle = 'rgba(100,180,255,0.15)';
            ctx.fillRect(-tw / 2 + 4, -th / 2 + 4, tw - 8, th / 2 - 4);
            ctx.fillStyle = 'rgba(50,200,100,0.12)';
            ctx.fillRect(-tw / 2 + 4, 0, tw - 8, th / 2 - 4);
            ctx.fillStyle = '#444';
            ctx.fillRect(-3, th / 2, 6, 3);

        } else if (rt === 'wall_sconce') {
            ctx.fillStyle = '#888';
            ctx.fillRect(-3, -2, 6, 10);
            ctx.fillStyle = '#777';
            ctx.fillRect(-1, -8, 2, 8);
            ctx.fillStyle = '#f5f0e0';
            ctx.beginPath();
            ctx.moveTo(-9, -8); ctx.lineTo(9, -8); ctx.lineTo(6, -16); ctx.lineTo(-6, -16);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 0.5; ctx.stroke();
            const glow = ctx.createRadialGradient(0, -12, 2, 0, -12, 20);
            glow.addColorStop(0, 'rgba(255,241,118,0.35)');
            glow.addColorStop(1, 'rgba(255,241,118,0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(0, -12, 20, 0, Math.PI * 2); ctx.fill();

        // ===== NEW WALL ITEMS =====

        } else if (rt === 'ri_towelhook') {
            // Towel hook with towel
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(-2, -6, 4, 4); // mount
            ctx.beginPath();
            ctx.moveTo(0, -2);
            ctx.quadraticCurveTo(6, 0, 4, 6);
            ctx.lineWidth = 2; ctx.strokeStyle = '#c0c0c0'; ctx.stroke();
            // Towel hanging
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(-4, 4, 12, 14);
            ctx.fillStyle = lighten('#87CEEB', 20);
            ctx.fillRect(-2, 4, 8, 2);

        } else if (rt === 'ri_menuboard') {
            // Menu board (chalkboard style)
            const bw = 36, bh = 26;
            ctx.fillStyle = '#5d4037'; // frame
            ctx.fillRect(-bw / 2 - 2, -bh / 2 - 2, bw + 4, bh + 4);
            ctx.fillStyle = '#2c3e50'; // board
            ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
            // Text lines
            ctx.fillStyle = '#fff';
            ctx.fillRect(-14, -10, 28, 1.5);
            ctx.fillRect(-12, -5, 20, 1);
            ctx.fillRect(-12, -1, 24, 1);
            ctx.fillRect(-12, 3, 18, 1);
            ctx.fillRect(-12, 7, 22, 1);
            // Title
            ctx.fillStyle = '#f1c40f';
            ctx.font = 'bold 6px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MENU', 0, -10);

        } else if (rt === 'ri_winerack') {
            // Decorative bottle rack (kid-friendly: grape juice)
            const rw = 30, rh = 28;
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(-rw / 2, -rh / 2, rw, rh);
            ctx.fillStyle = darken('#5d4037', 10);
            // Horizontal dividers
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(-rw / 2, -rh / 2 + i * 10, rw, 1.5);
            }
            // Bottles (circles representing ends)
            const bottleColors = ['#8B4513', '#2E7D32', '#DAA520', '#800020', '#4a90d9', '#8B4513'];
            let bi = 0;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    ctx.fillStyle = bottleColors[bi % bottleColors.length];
                    ctx.beginPath();
                    ctx.arc(-rw / 2 + 6 + col * 10, -rh / 2 + 5 + row * 10, 3.5, 0, Math.PI * 2);
                    ctx.fill();
                    bi++;
                }
            }

        } else if (rt === 'ri_whiteboard') {
            // Whiteboard
            const ww = 48, wh = 30;
            ctx.fillStyle = '#999'; // frame
            ctx.fillRect(-ww / 2 - 2, -wh / 2 - 2, ww + 4, wh + 4);
            ctx.fillStyle = item.baseColor; // board
            ctx.fillRect(-ww / 2, -wh / 2, ww, wh);
            // Written content suggestion
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(-18, -8); ctx.lineTo(18, -8); ctx.stroke();
            ctx.strokeStyle = '#3498db';
            ctx.beginPath(); ctx.moveTo(-16, -2); ctx.lineTo(10, -2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-16, 3); ctx.lineTo(14, 3); ctx.stroke();
            ctx.strokeStyle = '#e74c3c';
            ctx.beginPath(); ctx.moveTo(-16, 8); ctx.lineTo(8, 8); ctx.stroke();
            // Marker tray
            ctx.fillStyle = '#bbb';
            ctx.fillRect(-12, wh / 2 - 2, 24, 3);
            // Markers
            ctx.fillStyle = '#e74c3c'; ctx.fillRect(-8, wh / 2 - 4, 4, 2);
            ctx.fillStyle = '#3498db'; ctx.fillRect(-2, wh / 2 - 4, 4, 2);
            ctx.fillStyle = '#333'; ctx.fillRect(4, wh / 2 - 4, 4, 2);

        } else if (rt === 'ri_wallmap') {
            // Wall map
            const mw = 38, mh = 26;
            ctx.fillStyle = '#5d4037'; // frame
            ctx.fillRect(-mw / 2 - 1.5, -mh / 2 - 1.5, mw + 3, mh + 3);
            ctx.fillStyle = item.baseColor; // map bg (green/blue)
            ctx.fillRect(-mw / 2, -mh / 2, mw, mh);
            // Ocean
            ctx.fillStyle = '#81D4FA';
            ctx.fillRect(-mw / 2, -mh / 2, mw, mh);
            // Continents (simplified)
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.ellipse(-8, -4, 8, 6, -0.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(10, -2, 6, 5, 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(-4, 8, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(14, 6, 4, 3, 0.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ri_cross') {
            // Wall cross
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-3, -18, 6, 36); // vertical
            ctx.fillRect(-12, -10, 24, 6); // horizontal
            // Embossed effect
            ctx.fillStyle = lighten(item.baseColor, 20);
            ctx.fillRect(-2, -17, 4, 34);
            ctx.fillRect(-11, -9, 22, 4);
            // Shadow
            ctx.fillStyle = darken(item.baseColor, 20);
            ctx.fillRect(2, -16, 1, 34);
            ctx.fillRect(-10, -5, 22, 1);

        } else if (rt === 'ri_stainedglass') {
            // Small stained glass window panel (wall item)
            const gw = 24, gh = 32;
            // Frame
            ctx.fillStyle = '#555';
            ctx.fillRect(-gw / 2 - 2, -gh / 2 - 2, gw + 4, gh + 4);
            // Arched top
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(-gw / 2, gh / 2);
            ctx.lineTo(-gw / 2, -gh / 2 + gw / 2);
            ctx.arc(0, -gh / 2 + gw / 2, gw / 2, Math.PI, 0);
            ctx.lineTo(gw / 2, gh / 2);
            ctx.closePath(); ctx.clip();
            // Colored panes
            const sgc = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'];
            for (let pr = 0; pr < 3; pr++) {
                for (let pc = 0; pc < 2; pc++) {
                    ctx.fillStyle = sgc[(pr * 2 + pc) % sgc.length];
                    ctx.globalAlpha = 0.55;
                    ctx.fillRect(-gw / 2 + pc * (gw / 2), -gh / 2 + pr * (gh / 3), gw / 2, gh / 3);
                    ctx.globalAlpha = 1;
                }
            }
            // Lead lines
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(0, -gh / 2); ctx.lineTo(0, gh / 2); ctx.stroke();
            for (let i = 1; i < 3; i++) {
                ctx.beginPath(); ctx.moveTo(-gw / 2, -gh / 2 + i * (gh / 3)); ctx.lineTo(gw / 2, -gh / 2 + i * (gh / 3)); ctx.stroke();
            }
            ctx.restore();

        } else if (rt === 'ri_utensilrack') {
            // Kitchen utensil rack
            ctx.fillStyle = item.baseColor;
            ctx.fillRect(-16, -2, 32, 3); // bar
            // Hooks and utensils
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
            // Spatula
            ctx.fillStyle = '#555';
            ctx.fillRect(-12, 1, 2, 14);
            ctx.fillRect(-14, 12, 6, 4);
            // Ladle
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(-4, 1); ctx.lineTo(-4, 12); ctx.stroke();
            ctx.beginPath(); ctx.arc(-4, 14, 3, 0, Math.PI * 2); ctx.stroke();
            // Whisk
            ctx.fillStyle = '#777';
            ctx.fillRect(4, 1, 2, 10);
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(5, 14, 3, 4, 0, 0, Math.PI * 2); ctx.stroke();
            // Knife
            ctx.fillStyle = '#aaa';
            ctx.fillRect(12, 1, 2, 16);
            ctx.fillStyle = '#555';
            ctx.fillRect(12, 1, 2, 5);
        }

        // Label
        ctx.fillStyle = 'rgba(60,40,15,0.8)';
        ctx.font = 'bold 8px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.name, 0, 24);
    }

    // Draw side-wall item with perspective skew
    function drawSideWallItemAt(quad, item, alpha) {
        const center = getSideWallSlotCenter(quad);
        const slotW = Math.abs(quad[1].x - quad[0].x);
        const slotH = Math.abs(quad[2].y - quad[0].y);
        // Just draw it centered with a scale, slight skew effect via simple scale
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(center.x, center.y);
        const sc = Math.min(slotW / 32, slotH / 26) * 0.9;
        ctx.scale(sc, sc);
        drawWallItemShape(item);
        ctx.restore();
    }

    // ===================== PLACED ITEMS DRAWING =====================

    function drawPlacedItems() {
        // Back wall items (drawn first, behind floor items)
        for (let r = 0; r < BWALL_ROWS; r++) {
            for (let c = 0; c < BWALL_COLS; c++) {
                if (backWallGrid()[r][c]) {
                    const rect = getBackWallSlotRect(r, c);
                    drawWallItemAt(rect.cx, rect.cy, rect.w, rect.h, backWallGrid()[r][c], 1);
                }
            }
        }

        // Side wall items
        for (let i = 0; i < SIDE_SLOTS; i++) {
            if (leftWallGrid()[i]) {
                drawSideWallItemAt(getLeftWallSlotQuad(i), leftWallGrid()[i], 1);
            }
            if (rightWallGrid()[i]) {
                drawSideWallItemAt(getRightWallSlotQuad(i), rightWallGrid()[i], 1);
            }
        }

        // Floor items (back to front for correct overlap)
        for (let r = 0; r < FLOOR_ROWS; r++) {
            for (let c = 0; c < FLOOR_COLS; c++) {
                if (floorGrid[r][c]) {
                    const center = getFloorSlotCenter(r, c);
                    const scale = getFloorSlotScale(r);
                    drawFloorItemAt(center.x, center.y, scale, floorGrid[r][c], 1);
                }
            }
        }
    }

    // ===================== GHOST PREVIEWS =====================

    function drawGhostPreviews() {
        if (!selectedTool || selectedTool.name === 'eraser') return;

        if (hoverType === 'floor' && !selectedTool.wall) {
            const center = getFloorSlotCenter(hoverR, hoverC);
            const scale = getFloorSlotScale(hoverR);
            if (!floorGrid[hoverR][hoverC]) {
                drawFloorItemAt(center.x, center.y, scale, selectedTool, 0.4);
            }
        } else if (hoverType === 'backwall' && selectedTool.wall) {
            const rect = getBackWallSlotRect(hoverR, hoverC);
            if (!backWallGrid()[hoverR][hoverC]) {
                drawWallItemAt(rect.cx, rect.cy, rect.w, rect.h, selectedTool, 0.4);
            }
        } else if (hoverType === 'leftwall' && selectedTool.wall) {
            if (!leftWallGrid()[hoverR]) {
                drawSideWallItemAt(getLeftWallSlotQuad(hoverR), selectedTool, 0.4);
            }
        } else if (hoverType === 'rightwall' && selectedTool.wall) {
            if (!rightWallGrid()[hoverR]) {
                drawSideWallItemAt(getRightWallSlotQuad(hoverR), selectedTool, 0.4);
            }
        }
    }

    // Eraser hover indicator
    function drawEraserHover() {
        if (!selectedTool || selectedTool.name !== 'eraser' || !hoverType) return;
        const occupied = getGridAt(hoverType, hoverR, hoverC);
        if (!occupied) return;

        let cx, cy;
        if (hoverType === 'floor') {
            const center = getFloorSlotCenter(hoverR, hoverC);
            cx = center.x; cy = center.y;
        } else if (hoverType === 'backwall') {
            const rect = getBackWallSlotRect(hoverR, hoverC);
            cx = rect.cx; cy = rect.cy;
        } else if (hoverType === 'leftwall') {
            const center = getSideWallSlotCenter(getLeftWallSlotQuad(hoverR));
            cx = center.x; cy = center.y;
        } else if (hoverType === 'rightwall') {
            const center = getSideWallSlotCenter(getRightWallSlotQuad(hoverR));
            cx = center.x; cy = center.y;
        }
        if (cx !== undefined) {
            ctx.fillStyle = 'rgba(255,0,0,0.4)';
            ctx.font = '22px serif'; ctx.textAlign = 'center';
            ctx.fillText('\uD83D\uDDD1\uFE0F', cx, cy + 6);
        }
    }

    // ===================== ROTATION UI ON CANVAS =====================

    // Rotation button hit areas (drawn on canvas)
    const rotBtnSize = 28;
    const rotBtnY = 10;
    const rotLeftBtn = { x: 8, y: rotBtnY, w: rotBtnSize * 2.2, h: rotBtnSize };
    const rotRightBtn = { x: W - 8 - rotBtnSize * 2.2, y: rotBtnY, w: rotBtnSize * 2.2, h: rotBtnSize };
    let rotLeftHover = false, rotRightHover = false;

    function drawRotationUI() {
        // Left rotation button
        ctx.fillStyle = rotLeftHover ? 'rgba(255,220,100,0.35)' : 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        const r = 6;
        // Rounded rect helper
        ctx.moveTo(rotLeftBtn.x + r, rotLeftBtn.y);
        ctx.lineTo(rotLeftBtn.x + rotLeftBtn.w - r, rotLeftBtn.y);
        ctx.quadraticCurveTo(rotLeftBtn.x + rotLeftBtn.w, rotLeftBtn.y, rotLeftBtn.x + rotLeftBtn.w, rotLeftBtn.y + r);
        ctx.lineTo(rotLeftBtn.x + rotLeftBtn.w, rotLeftBtn.y + rotLeftBtn.h - r);
        ctx.quadraticCurveTo(rotLeftBtn.x + rotLeftBtn.w, rotLeftBtn.y + rotLeftBtn.h, rotLeftBtn.x + rotLeftBtn.w - r, rotLeftBtn.y + rotLeftBtn.h);
        ctx.lineTo(rotLeftBtn.x + r, rotLeftBtn.y + rotLeftBtn.h);
        ctx.quadraticCurveTo(rotLeftBtn.x, rotLeftBtn.y + rotLeftBtn.h, rotLeftBtn.x, rotLeftBtn.y + rotLeftBtn.h - r);
        ctx.lineTo(rotLeftBtn.x, rotLeftBtn.y + r);
        ctx.quadraticCurveTo(rotLeftBtn.x, rotLeftBtn.y, rotLeftBtn.x + r, rotLeftBtn.y);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('\u2190 Girar (Q)', rotLeftBtn.x + rotLeftBtn.w / 2, rotLeftBtn.y + rotLeftBtn.h / 2 + 4);

        // Right rotation button
        ctx.fillStyle = rotRightHover ? 'rgba(255,220,100,0.35)' : 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.moveTo(rotRightBtn.x + r, rotRightBtn.y);
        ctx.lineTo(rotRightBtn.x + rotRightBtn.w - r, rotRightBtn.y);
        ctx.quadraticCurveTo(rotRightBtn.x + rotRightBtn.w, rotRightBtn.y, rotRightBtn.x + rotRightBtn.w, rotRightBtn.y + r);
        ctx.lineTo(rotRightBtn.x + rotRightBtn.w, rotRightBtn.y + rotRightBtn.h - r);
        ctx.quadraticCurveTo(rotRightBtn.x + rotRightBtn.w, rotRightBtn.y + rotRightBtn.h, rotRightBtn.x + rotRightBtn.w - r, rotRightBtn.y + rotRightBtn.h);
        ctx.lineTo(rotRightBtn.x + r, rotRightBtn.y + rotRightBtn.h);
        ctx.quadraticCurveTo(rotRightBtn.x, rotRightBtn.y + rotRightBtn.h, rotRightBtn.x, rotRightBtn.y + rotRightBtn.h - r);
        ctx.lineTo(rotRightBtn.x, rotRightBtn.y + r);
        ctx.quadraticCurveTo(rotRightBtn.x, rotRightBtn.y, rotRightBtn.x + r, rotRightBtn.y);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Girar (E) \u2192', rotRightBtn.x + rotRightBtn.w / 2, rotRightBtn.y + rotRightBtn.h / 2 + 4);

        // Current wall name indicator (top center)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        const labelW = 120, labelH = 22, labelX = W / 2 - labelW / 2, labelY = 8;
        ctx.moveTo(labelX + r, labelY);
        ctx.lineTo(labelX + labelW - r, labelY);
        ctx.quadraticCurveTo(labelX + labelW, labelY, labelX + labelW, labelY + r);
        ctx.lineTo(labelX + labelW, labelY + labelH - r);
        ctx.quadraticCurveTo(labelX + labelW, labelY + labelH, labelX + labelW - r, labelY + labelH);
        ctx.lineTo(labelX + r, labelY + labelH);
        ctx.quadraticCurveTo(labelX, labelY + labelH, labelX, labelY + labelH - r);
        ctx.lineTo(labelX, labelY + r);
        ctx.quadraticCurveTo(labelX, labelY, labelX + r, labelY);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(WALL_NAMES[viewAngle], W / 2, labelY + labelH / 2 + 4);
    }

    function rotateView(dir) {
        viewAngle = (viewAngle + dir + 4) % 4;
        hoverType = null; hoverR = -1; hoverC = -1;
    }

    // ===================== RENDER LOOP =====================

    function render() {
        ctx.clearRect(0, 0, W, H);
        drawRoom();
        drawBackWallGrid();
        drawSideWallSlots();
        drawPlacedItems();
        drawFloorGrid();
        drawGhostPreviews();
        drawEraserHover();
        drawRotationUI();
        animFrame = requestAnimationFrame(render);
    }

    // ===================== INPUT =====================

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const sx = W / rect.width, sy = H / rect.height;
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (cx - rect.left) * sx, y: (cy - rect.top) * sy };
    }

    canvas.addEventListener('mousemove', (e) => {
        const pos = getMousePos(e);
        // Check rotation button hover
        rotLeftHover = pointInRect(pos.x, pos.y, rotLeftBtn);
        rotRightHover = pointInRect(pos.x, pos.y, rotRightBtn);
        const hit = hitTest(pos.x, pos.y);
        if (hit) {
            hoverType = hit.type;
            hoverR = hit.r;
            hoverC = hit.c;
        } else {
            hoverType = null;
            hoverR = -1;
            hoverC = -1;
        }
    });

    function handlePlace(e) {
        const pos = getMousePos(e);
        // Check rotation buttons first
        if (pointInRect(pos.x, pos.y, rotLeftBtn)) { rotateView(-1); return; }
        if (pointInRect(pos.x, pos.y, rotRightBtn)) { rotateView(1); return; }
        const hit = hitTest(pos.x, pos.y);
        if (!hit || !selectedTool) return;

        if (selectedTool.name === 'eraser') {
            const existing = getGridAt(hit.type, hit.r, hit.c);
            if (existing) {
                setGridAt(hit.type, hit.r, hit.c, null);
                placedCount--;
                addScore(-5);
            }
            return;
        }

        if (!canPlaceItem(selectedTool, hit.type)) return;
        if (getGridAt(hit.type, hit.r, hit.c)) return;

        setGridAt(hit.type, hit.r, hit.c, selectedTool);
        placedCount++;
        addScore(10);
    }

    canvas.addEventListener('click', handlePlace);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePlace(e); });

    // Keyboard rotation: Q = rotate left, E = rotate right
    function handleKeyRotation(e) {
        if (e.key === 'q' || e.key === 'Q') rotateView(-1);
        if (e.key === 'e' || e.key === 'E') rotateView(1);
    }
    document.addEventListener('keydown', handleKeyRotation);

    // ===================== TOOLBAR =====================

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
    eraser.innerHTML = `<span class="tool-icon">\uD83D\uDDD1\uFE0F</span><span class="tool-label">Borrar</span>`;
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
    finishBtn.innerHTML = `<span class="tool-icon">\u2705</span><span class="tool-label">Terminar</span>`;
    finishBtn.onclick = () => {
        const uniqueTypes = new Set();
        for (let r = 0; r < FLOOR_ROWS; r++)
            for (let c = 0; c < FLOOR_COLS; c++)
                if (floorGrid[r][c]) uniqueTypes.add(floorGrid[r][c].name);
        // Count items from ALL 4 walls
        for (let v = 0; v < 4; v++) {
            for (let r = 0; r < BWALL_ROWS; r++)
                for (let c = 0; c < BWALL_COLS; c++)
                    if (wallGrids[v].back[r][c]) uniqueTypes.add(wallGrids[v].back[r][c].name);
            for (let i = 0; i < SIDE_SLOTS; i++) {
                if (wallGrids[v].left[i]) uniqueTypes.add(wallGrids[v].left[i].name);
                if (wallGrids[v].right[i]) uniqueTypes.add(wallGrids[v].right[i].name);
            }
        }
        addScore(uniqueTypes.size * 15);
        let stars = placedCount >= 15 ? 5 : placedCount >= 10 ? 4 : placedCount >= 6 ? 3 : placedCount >= 3 ? 2 : 1;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) starsHtml += `<span class="star ${i < stars ? 'filled' : 'empty'}">\u2605</span>`;
        cancelAnimationFrame(animFrame);
        const finishMsg = ROOM_FINISH_MSG[roomType] || ARQ_FINISH_MSG.interiores;
        showResult(finishMsg, `<div class="stars">${starsHtml}</div>`,
            `Has colocado ${placedCount} elementos con ${uniqueTypes.size} tipos diferentes.`,
            () => startInterioresFP(roomType));
    };
    toolbar.appendChild(finishBtn);

    // Goal
    const goalText = ROOM_GOALS[roomType] || ARQ_GOALS.interiores;
    const roomLabel = roomCfg.label || roomType;
    ui.innerHTML = `<div style="padding: 8px 14px; font-size: 0.7rem; color: rgba(255,255,255,0.8); text-align: center; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px);">
        ${goalText}<br><span style="opacity:0.6; font-size:0.6rem;">Q/E: Girar ${roomLabel.toLowerCase()}</span>
    </div>`;
    ui.style.pointerEvents = 'none';

    render();

    currentGame = {
        cleanup: () => {
            cancelAnimationFrame(animFrame);
            document.removeEventListener('keydown', handleKeyRotation);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

// ============ MOTOR ISOMETRICO GENERICO (urbanismo, paisajismo, sostenible) ============

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
    const originY = Math.max(40, (H - GRID * TILE_H) / 2);

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

    function drawBgPaisajismo() {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#4FC3F7'); g.addColorStop(0.25, '#81D4FA'); g.addColorStop(0.4, '#A5D6A7'); g.addColorStop(1, '#2E7D32');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#FFF176'; ctx.beginPath(); ctx.arc(60, 30, 20, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFEE58'; ctx.beginPath(); ctx.arc(60, 30, 14, 0, Math.PI*2); ctx.fill();
        drawCloud(W*0.5, 20, 0.6); drawCloud(W*0.8, 30, 0.4);
        ctx.fillStyle = '#388E3C';
        for (let x = 0; x < W; x += 25) {
            const th = 12 + Math.sin(x*0.1)*5;
            ctx.beginPath(); ctx.arc(x, originY - 8, th, 0, Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = '#43A047';
        ctx.fillRect(0, originY - 5, W, H);
    }

    function drawBgSostenible() {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#E0F7FA'); g.addColorStop(0.3, '#B2EBF2'); g.addColorStop(0.5, '#C8E6C9'); g.addColorStop(1, '#1B5E20');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#FFB300'; ctx.beginPath(); ctx.arc(W-50, 30, 18, 0, Math.PI*2); ctx.fill();
        for (let a = 0; a < Math.PI*2; a += 0.5) {
            ctx.strokeStyle = '#FFD54F'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(W-50+Math.cos(a)*22, 30+Math.sin(a)*22);
            ctx.lineTo(W-50+Math.cos(a)*30, 30+Math.sin(a)*30); ctx.stroke();
        }
        drawCloud(40, 20, 0.5); drawCloud(W*0.4, 12, 0.4);
        ctx.fillStyle = '#4CAF50'; ctx.beginPath(); ctx.moveTo(0, originY);
        for (let x = 0; x <= W; x += 20) ctx.lineTo(x, originY - 3 + Math.sin(x*0.03)*6);
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    }

    const bgDrawers = { urbanismo: drawBgUrbanismo, paisajismo: drawBgPaisajismo, sostenible: drawBgSostenible };

    // ========== TILE STYLE PER MODE ==========
    function getTileColors(isHover) {
        switch (subtype) {
            case 'paisajismo': return { base: isHover ? '#66BB6A' : '#4CAF50', border: isHover ? '#2E7D32' : '#388E3C' };
            case 'sostenible': return { base: isHover ? '#81C784' : '#66BB6A', border: isHover ? '#2E7D32' : '#43A047' };
            default: return { base: isHover ? '#66BB6A' : '#4CAF50', border: isHover ? '#558B2F' : '#388E3C' };
        }
    }

    function getOccupiedTileColor() {
        switch (subtype) {
            case 'paisajismo': return '#A5D6A7';
            case 'sostenible': return '#A5D6A7';
            default: return '#A5D6A7';
        }
    }

    // ========== 3D BOX HELPER ==========
    function drawBox(x, y, bw, bh, color) {
        const hw = TILE_W / 2, hh = TILE_H / 2;
        ctx.beginPath(); ctx.moveTo(x-hw, y+hh); ctx.lineTo(x, y+TILE_H); ctx.lineTo(x, y+TILE_H-bh); ctx.lineTo(x-hw, y+hh-bh); ctx.closePath();
        ctx.fillStyle = darken(color, 25); ctx.fill(); ctx.strokeStyle = darken(color, 50); ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y+TILE_H); ctx.lineTo(x+hw, y+hh); ctx.lineTo(x+hw, y+hh-bh); ctx.lineTo(x, y+TILE_H-bh); ctx.closePath();
        ctx.fillStyle = darken(color, 45); ctx.fill(); ctx.strokeStyle = darken(color, 70); ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y+TILE_H-bh); ctx.lineTo(x+hw, y+hh-bh); ctx.lineTo(x, y-bh); ctx.lineTo(x-hw, y+hh-bh); ctx.closePath();
        ctx.fillStyle = lighten(color, 20); ctx.fill();
    }

    // ========== ITEM RENDERERS ==========
    function drawItem3D(r, c, item) {
        const { x, y } = toIso(r, c);
        const hw = TILE_W / 2, hh = TILE_H / 2;
        const floorH = 14;
        const totalH = (item.floors || 0) * floorH;

        if (subtype === 'urbanismo') {
            drawUrbanismoItem(x, y, hw, hh, floorH, totalH, item);
        } else if (subtype === 'paisajismo') {
            drawPaisajismoItem(x, y, hw, hh, item);
        } else if (subtype === 'sostenible') {
            drawSostenibleItem(x, y, hw, hh, floorH, totalH, item);
        }

        ctx.fillStyle = 'rgba(255,255,255,0.85)';
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
        drawBox(x, y, TILE_W, totalH, item.baseColor);
        if (item.windows && item.floors >= 2) {
            for (let f = 0; f < item.floors; f++) {
                const fy = y + TILE_H - totalH + f*floorH + 3;
                ctx.fillStyle = f%2===0 ? '#BBDEFB' : '#90CAF9';
                for (let w = 0; w < 2; w++) { ctx.fillRect(x-hw+6+w*12, fy+w*2, 5, 5); ctx.fillRect(x+5+w*12, fy+4-w*2, 5, 5); }
            }
        }
        if (item.floors >= 1) { ctx.fillStyle = '#5D4037'; ctx.fillRect(x-5, y+TILE_H-10, 5, 8); }
        if (item.cross) { ctx.fillStyle = '#E53935'; ctx.fillRect(x-2, y+TILE_H-totalH+4, 4, 12); ctx.fillRect(x-6, y+TILE_H-totalH+8, 12, 4); }
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
            const cols = ['#E91E63','#FF5722','#FF9800','#FFEB3B','#E040FB'];
            for (let i = 0; i < 7; i++) {
                const fx = x - 10 + Math.random()*20, fy = y - 2 + Math.random()*10;
                ctx.fillStyle = '#4CAF50'; ctx.fillRect(fx, fy, 1.5, 6);
                ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); ctx.arc(fx+0.5, fy-1, 3, 0, Math.PI*2); ctx.fill();
            }
        } else if (rt === 'fountain') {
            ctx.fillStyle = '#90A4AE';
            ctx.beginPath(); ctx.ellipse(x, y+8, 16, 8, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#B0BEC5';
            ctx.beginPath(); ctx.ellipse(x, y+6, 14, 6, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#4FC3F7';
            ctx.beginPath(); ctx.ellipse(x, y+5, 11, 5, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#CFD8DC'; ctx.fillRect(x-2, y-12, 4, 16);
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
            drawBox(x, y, TILE_W * 0.9, 12, '#388E3C');
            ctx.fillStyle = '#4CAF50';
            const top = y - 12;
            ctx.beginPath(); ctx.moveTo(x, top+TILE_H); ctx.lineTo(x+hw*0.9, top+hh); ctx.lineTo(x, top); ctx.lineTo(x-hw*0.9, top+hh); ctx.closePath(); ctx.fill();
        } else if (rt === 'bench') {
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(x-10, y+4, 2, 8); ctx.fillRect(x+8, y+4, 2, 8);
            ctx.fillStyle = '#8D6E63'; ctx.fillRect(x-12, y+2, 24, 3);
            ctx.fillStyle = '#795548'; ctx.fillRect(x-12, y-4, 24, 3);
            ctx.fillRect(x-10, y-4, 2, 6); ctx.fillRect(x+8, y-4, 2, 6);
        } else if (rt === 'pond') {
            ctx.fillStyle = '#0277BD';
            ctx.beginPath(); ctx.ellipse(x, y+6, 18, 10, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#039BE5';
            ctx.beginPath(); ctx.ellipse(x, y+5, 15, 8, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#4FC3F7';
            ctx.beginPath(); ctx.ellipse(x-3, y+3, 6, 3, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.ellipse(x+6, y+7, 4, 2.5, 0.3, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'streetlamp') {
            ctx.fillStyle = '#424242'; ctx.fillRect(x-1.5, y-24, 3, 28);
            ctx.fillStyle = '#616161'; ctx.beginPath(); ctx.ellipse(x, y+4, 5, 2.5, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#212121'; ctx.fillRect(x-5, y-26, 10, 3);
            ctx.fillStyle = '#FFF176'; ctx.beginPath(); ctx.arc(x, y-23, 4, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = 'rgba(255,241,118,0.2)'; ctx.beginPath(); ctx.arc(x, y-20, 14, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'sunflower') {
            ctx.fillStyle = '#4CAF50'; ctx.fillRect(x-1, y-18, 2, 20);
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.ellipse(x+5, y-4, 5, 2.5, 0.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(x-5, y-10, 5, 2.5, -0.5, 0, Math.PI*2); ctx.fill();
            for (let a = 0; a < Math.PI*2; a += 0.6) {
                ctx.fillStyle = '#FDD835';
                ctx.beginPath(); ctx.ellipse(x+Math.cos(a)*7, y-22+Math.sin(a)*7, 4, 2, a, 0, Math.PI*2); ctx.fill();
            }
            ctx.fillStyle = '#5D4037'; ctx.beginPath(); ctx.arc(x, y-22, 5, 0, Math.PI*2); ctx.fill();
        } else if (rt === 'path') {
            drawDiamond(x, y, '#D7CCC8', '#BCAAA4', false);
            ctx.fillStyle = '#BDBDBD';
            ctx.beginPath(); ctx.ellipse(x-5, y+hh-2, 4, 2.5, 0.2, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(x+4, y+hh+1, 3.5, 2, -0.3, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(x, y+hh+4, 3, 2, 0, 0, Math.PI*2); ctx.fill();
        }
    }

    // ---------- SOSTENIBLE ----------
    function drawSostenibleItem(x, y, hw, hh, floorH, totalH, item) {
        const rt = item.roofType;

        if (rt === 'solar_array') {
            ctx.fillStyle = '#78909C';
            ctx.fillRect(x - 2, y + 2, 4, 10);
            ctx.fillRect(x - hw + 6, y + hh, 2, 6);
            ctx.fillRect(x + hw - 8, y + hh - 4, 2, 6);
            ctx.fillStyle = '#0D47A1';
            ctx.beginPath();
            ctx.moveTo(x - hw + 2, y + hh - 2);
            ctx.lineTo(x + hw - 2, y + hh - 6);
            ctx.lineTo(x + hw - 2, y + hh - 16);
            ctx.lineTo(x - hw + 2, y + hh - 12);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#1565C0';
            ctx.beginPath();
            ctx.moveTo(x - hw + 2, y + hh - 12);
            ctx.lineTo(x + hw - 2, y + hh - 16);
            ctx.lineTo(x, y - 14);
            ctx.lineTo(x - hw + 6, y + hh - 14);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#42A5F5'; ctx.lineWidth = 0.4;
            for (let i = 1; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(x - hw + 2 + i * 5, y + hh - 12);
                ctx.lineTo(x - hw + 2 + i * 7, y - 6);
                ctx.stroke();
            }
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fillRect(x - 4, y + hh - 14, 10, 4);

        } else if (rt === 'wind_turbine') {
            ctx.fillStyle = '#B0BEC5';
            ctx.beginPath(); ctx.ellipse(x, y + TILE_H - 4, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ECEFF1';
            ctx.beginPath();
            ctx.moveTo(x - 4, y + TILE_H - 4); ctx.lineTo(x + 4, y + TILE_H - 4);
            ctx.lineTo(x + 2, y - 34); ctx.lineTo(x - 2, y - 34);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#CFD8DC';
            ctx.beginPath(); ctx.ellipse(x, y - 34, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#ECEFF1'; ctx.lineWidth = 2.5;
            const cx2 = x, cy2 = y - 34;
            for (let a = 0; a < 3; a++) {
                const angle = a * (Math.PI * 2 / 3) + Date.now() * 0.002;
                ctx.beginPath(); ctx.moveTo(cx2, cy2);
                ctx.lineTo(cx2 + Math.cos(angle) * 20, cy2 + Math.sin(angle) * 20); ctx.stroke();
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(cx2 + Math.cos(angle) * 18, cy2 + Math.sin(angle) * 18);
                ctx.lineTo(cx2 + Math.cos(angle) * 24, cy2 + Math.sin(angle) * 24); ctx.stroke();
                ctx.lineWidth = 2.5;
            }
            ctx.fillStyle = '#455A64';
            ctx.beginPath(); ctx.arc(cx2, cy2, 2.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'green_roof') {
            drawBox(x, y, TILE_W, 10, '#8D6E63');
            ctx.fillStyle = '#4CAF50';
            const top = y - 10;
            ctx.beginPath();
            ctx.moveTo(x, top + TILE_H); ctx.lineTo(x + hw, top + hh); ctx.lineTo(x, top); ctx.lineTo(x - hw, top + hh);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.arc(x - 6, top + hh - 1, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 5, top + hh, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x, top + 5, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#81C784';
            ctx.beginPath(); ctx.arc(x + 2, top + hh + 3, 2, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'ev_charger') {
            ctx.fillStyle = '#37474F'; ctx.fillRect(x - 3, y - 20, 6, 24);
            ctx.fillStyle = '#455A64'; ctx.fillRect(x - 6, y - 24, 12, 8);
            ctx.fillStyle = '#4CAF50'; ctx.fillRect(x - 4, y - 22, 8, 4);
            ctx.fillStyle = '#76FF03'; ctx.beginPath(); ctx.arc(x, y - 16, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x + 4, y - 16); ctx.quadraticCurveTo(x + 12, y - 8, x + 8, y + 4); ctx.stroke();
            ctx.fillStyle = '#444'; ctx.fillRect(x + 6, y + 2, 4, 3);
            ctx.fillStyle = '#546E7A'; ctx.fillRect(x - 5, y + 4, 10, 3);

        } else if (rt === 'rain_tank') {
            ctx.fillStyle = '#00838F'; ctx.fillRect(x - 10, y - 10, 20, 22);
            ctx.fillStyle = '#0097A7'; ctx.beginPath(); ctx.ellipse(x, y - 10, 10, 5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#00ACC1'; ctx.beginPath(); ctx.ellipse(x, y - 10, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#4FC3F7'; ctx.fillRect(x + 10, y - 4, 2, 10);
            ctx.fillStyle = '#00B0FF'; ctx.fillRect(x + 10, y + 2, 2, 4);
            ctx.fillStyle = '#78909C'; ctx.fillRect(x - 14, y - 8, 4, 2);

        } else if (rt === 'compost') {
            drawBox(x, y, TILE_W * 0.7, 14, '#795548');
            ctx.fillStyle = '#8D6E63';
            const top = y - 14;
            ctx.beginPath();
            ctx.moveTo(x, top + TILE_H); ctx.lineTo(x + hw * 0.7, top + hh); ctx.lineTo(x, top); ctx.lineTo(x - hw * 0.7, top + hh);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#5D4037'; ctx.fillRect(x - 2, top + hh - 2, 4, 2);
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath(); ctx.ellipse(x + 4, top + hh + 2, 3, 2, 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = darken('#795548', 20);
            ctx.beginPath(); ctx.arc(x - 4, y + 4, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 4, y + 2, 1.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'bee_hotel') {
            ctx.fillStyle = '#8D6E63'; ctx.fillRect(x - 10, y - 14, 20, 24);
            ctx.fillStyle = '#6D4C41';
            ctx.beginPath(); ctx.moveTo(x - 12, y - 14); ctx.lineTo(x, y - 22); ctx.lineTo(x + 12, y - 14); ctx.closePath(); ctx.fill();
            const fills = ['#D7CCC8', '#BCAAA4', '#A1887F', '#FFE0B2', '#C8E6C9'];
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const bx = x - 7 + col * 7;
                    const by = y - 10 + row * 7;
                    ctx.fillStyle = fills[(row * 3 + col) % fills.length];
                    ctx.fillRect(bx, by, 5, 5);
                    ctx.fillStyle = darken('#795548', 30);
                    ctx.beginPath(); ctx.arc(bx + 2.5, by + 2.5, 1.5, 0, Math.PI * 2); ctx.fill();
                }
            }
            ctx.fillStyle = '#FFD54F';
            ctx.beginPath(); ctx.ellipse(x + 14, y - 8, 2.5, 1.5, 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#333';
            ctx.fillRect(x + 13, y - 9, 1, 3); ctx.fillRect(x + 15, y - 9, 1, 3);

        } else if (rt === 'smart_lamp') {
            ctx.fillStyle = '#78909C'; ctx.fillRect(x - 1.5, y - 28, 3, 32);
            ctx.fillStyle = '#607D8B'; ctx.beginPath(); ctx.ellipse(x, y + 4, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1565C0'; ctx.fillRect(x - 6, y - 32, 12, 3);
            ctx.fillStyle = '#455A64'; ctx.fillRect(x - 8, y - 28, 16, 3);
            ctx.fillStyle = item.baseColor; ctx.fillRect(x - 6, y - 25, 12, 2);
            const glow = ctx.createRadialGradient(x, y - 22, 2, x, y - 22, 16);
            glow.addColorStop(0, 'rgba(144, 202, 249, 0.35)');
            glow.addColorStop(1, 'rgba(144, 202, 249, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(x, y - 22, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#B0BEC5';
            ctx.beginPath(); ctx.arc(x + 3, y - 26, 1.5, 0, Math.PI * 2); ctx.fill();

        } else if (rt === 'recycle_station') {
            const binW = 8;
            const colors = ['#4CAF50', '#2196F3', '#FFC107'];
            const labels = ['O', 'P', 'V'];
            for (let i = 0; i < 3; i++) {
                const bx = x - 14 + i * 10;
                const by = y + 2;
                ctx.fillStyle = colors[i]; ctx.fillRect(bx, by - 12, binW, 14);
                ctx.fillStyle = darken(colors[i], 20); ctx.fillRect(bx - 1, by - 14, binW + 2, 3);
                ctx.fillStyle = '#fff'; ctx.font = 'bold 5px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText(labels[i], bx + binW / 2, by - 4);
            }
            ctx.fillStyle = '#388E3C'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('\u267B', x, y - 14);

        } else if (rt === 'vertical_garden') {
            ctx.fillStyle = '#5D4037'; ctx.fillRect(x - 12, y - 18, 24, 28);
            const plantColors = ['#4CAF50', '#66BB6A', '#81C784', '#388E3C', '#43A047', '#2E7D32'];
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const px = x - 9 + col * 6;
                    const py = y - 14 + row * 6;
                    ctx.fillStyle = plantColors[(row * 4 + col) % plantColors.length];
                    ctx.beginPath(); ctx.arc(px + 2, py + 2, 2.5, 0, Math.PI * 2); ctx.fill();
                }
            }
            ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 1.5;
            ctx.strokeRect(x - 12, y - 18, 24, 28);
            ctx.fillStyle = '#0097A7'; ctx.fillRect(x - 10, y - 20, 20, 2);
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
                        ctx.fillText('\uD83D\uDDD1\uFE0F', x, y + TILE_H / 2 + 5);
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
    eraser.innerHTML = `<span class="tool-icon">\uD83D\uDDD1\uFE0F</span><span class="tool-label">Borrar</span>`;
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
    finishBtn.innerHTML = `<span class="tool-icon">\u2705</span><span class="tool-label">Terminar</span>`;
    finishBtn.onclick = () => {
        const uniqueTypes = new Set();
        for (let r = 0; r < GRID; r++)
            for (let c = 0; c < GRID; c++)
                if (grid[r][c]) uniqueTypes.add(grid[r][c].name);
        addScore(uniqueTypes.size * 15);
        let stars = placedCount >= 15 ? 5 : placedCount >= 10 ? 4 : placedCount >= 6 ? 3 : placedCount >= 3 ? 2 : 1;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) starsHtml += `<span class="star ${i < stars ? 'filled' : 'empty'}">\u2605</span>`;
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
