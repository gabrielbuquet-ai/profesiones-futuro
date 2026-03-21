// ==========================================
// APP.JS - Navegacion principal y utilidades
// ==========================================

let currentScreen = 'home';
let currentGame = null;
let score = 0;
let gameDifficulty = 'normal'; // easy, normal, hard

const HOBBY_SECTIONS = ['deportes', 'conducir', 'musica', 'pintura', 'ajedrez'];

// --- Datos de profesiones y subtipos ---
const PROFESSIONS = {
    arquitectura: {
        title: '🏗️ Arquitectura',
        subtypes: [
            { id: 'urbanismo', icon: '🏙️', name: 'Urbanismo', desc: 'Disena ciudades: coloca edificios, parques, escuelas y mas' },
            { id: 'paisajismo', icon: '🌳', name: 'Paisajismo', desc: 'Disena jardines, parques y espacios verdes' },
            { id: 'sostenible', icon: '♻️', name: 'Sostenible', desc: 'Construye edificios ecologicos y eficientes' }
        ],
        perfil: { creatividad:8, logica:7, empatia:5, precision:9, liderazgo:7, velocidad:4, memoria:6, comunicacion:6, pensamiento_sistemico:9, iteracion:7, juicio_critico:8, adaptabilidad:5 }
    },
    interiorismo: {
        title: '🛋️ Interiorismo',
        subtypes: [
            { id: 'int_habitacion', icon: '🛏️', name: 'Habitacion', desc: 'Disena un dormitorio acogedor' },
            { id: 'int_salon', icon: '🛋️', name: 'Salon', desc: 'Decora un salon moderno' },
            { id: 'int_bano', icon: '🚿', name: 'Bano', desc: 'Disena un bano funcional' },
            { id: 'int_restaurante', icon: '🍽️', name: 'Restaurante', desc: 'Crea un restaurante con estilo' },
            { id: 'int_cocina', icon: '🍳', name: 'Cocina', desc: 'Disena una cocina equipada' },
            { id: 'int_colegio', icon: '🏫', name: 'Colegio', desc: 'Organiza un aula escolar' },
            { id: 'int_iglesia', icon: '⛪', name: 'Iglesia', desc: 'Disena el interior de una iglesia' }
        ],
        perfil: { creatividad:9, logica:5, empatia:7, precision:8, liderazgo:5, velocidad:4, memoria:6, comunicacion:7, pensamiento_sistemico:6, iteracion:8, juicio_critico:9, adaptabilidad:6 }
    },
    medico: {
        title: '🩺 Medico',
        subtypes: [
            { id: 'general', icon: '👨‍⚕️', name: 'Medicina General', desc: 'Diagnostica pacientes segun sus sintomas' },
            { id: 'cirujano', icon: '🔪', name: 'Cirujano', desc: 'Realiza operaciones quirurgicas paso a paso' },
            { id: 'radiologo', icon: '🩻', name: 'Radiologo', desc: 'Analiza radiografias y encuentra problemas' },
            { id: 'farmaceutico', icon: '💊', name: 'Farmaceutico', desc: 'Receta los medicamentos correctos' }
        ],
        perfil: { creatividad:4, logica:8, empatia:9, precision:10, liderazgo:6, velocidad:5, memoria:9, comunicacion:8, pensamiento_sistemico:8, iteracion:5, juicio_critico:10, adaptabilidad:7 }
    },
    cocina: {
        title: '👨‍🍳 Cocina',
        subtypes: [
            { id: 'espanola', icon: '🥘', name: 'Cocina Espanola', desc: 'Prepara paella, tortilla y mas clasicos' },
            { id: 'italiana', icon: '🍕', name: 'Cocina Italiana', desc: 'Pizza, pasta y risotto' },
            { id: 'japonesa', icon: '🍣', name: 'Cocina Japonesa', desc: 'Sushi, ramen y tempura' },
            { id: 'pasteleria', icon: '🎂', name: 'Pasteleria', desc: 'Tartas, galletas y postres' }
        ],
        perfil: { creatividad:9, logica:4, empatia:6, precision:8, liderazgo:5, velocidad:7, memoria:7, comunicacion:5, pensamiento_sistemico:4, iteracion:9, juicio_critico:8, adaptabilidad:6 }
    },
    bombero: {
        title: '🚒 Bomberos',
        subtypes: [
            { id: 'extincion', icon: '🔥', name: 'Extincion de Incendios', desc: 'Apaga fuegos en edificios' },
            { id: 'rescate', icon: '🆘', name: 'Rescate', desc: 'Rescata personas atrapadas' },
            { id: 'conduccion', icon: '🚒', name: 'Conduccion', desc: 'Conduce el camion de bomberos' },
            { id: 'forestal', icon: '🌲', name: 'Incendio Forestal', desc: 'Combate incendios en el bosque' }
        ],
        perfil: { creatividad:3, logica:6, empatia:7, precision:7, liderazgo:8, velocidad:9, memoria:5, comunicacion:8, pensamiento_sistemico:7, iteracion:3, juicio_critico:7, adaptabilidad:9 }
    },
    viajes: {
        title: '✈️ Agente de Viajes',
        subtypes: [
            { id: 'europa', icon: '🇪🇺', name: 'Europa', desc: 'Francia, Italia, Alemania y mas' },
            { id: 'asia', icon: '🌏', name: 'Asia', desc: 'Japon, Tailandia, China y mas' },
            { id: 'america', icon: '🌎', name: 'America', desc: 'EEUU, Mexico, Brasil y mas' },
            { id: 'africa', icon: '🌍', name: 'Africa', desc: 'Marruecos, Kenia, Sudafrica y mas' }
        ],
        perfil: { creatividad:6, logica:5, empatia:8, precision:6, liderazgo:5, velocidad:4, memoria:7, comunicacion:9, pensamiento_sistemico:5, iteracion:6, juicio_critico:6, adaptabilidad:8 }
    },
    deportes: {
        title: '⚽ Deportes',
        subtypes: [
            { id: 'futbol', icon: '⚽', name: 'Futbol', desc: 'Practica tiros a porteria' },
            { id: 'baloncesto', icon: '🏀', name: 'Baloncesto', desc: 'Encesta canastas' },
            { id: 'tenis', icon: '🎾', name: 'Tenis', desc: 'Devuelve la pelota' },
            { id: 'natacion', icon: '🏊', name: 'Natacion', desc: 'Nada lo mas rapido posible' },
            { id: 'atletismo', icon: '🏃', name: 'Atletismo', desc: 'Corre y salta obstaculos' },
            { id: 'boxeo', icon: '🥊', name: 'Boxeo', desc: 'Entrena tecnica con el saco de boxeo' }
        ],
        perfil: { creatividad:5, logica:4, empatia:6, precision:6, liderazgo:7, velocidad:9, memoria:5, comunicacion:7, pensamiento_sistemico:5, iteracion:7, juicio_critico:6, adaptabilidad:8 }
    },
    conducir: {
        title: '🚗 Conducir',
        subtypes: [
            { id: 'manual', icon: '🔧', name: 'Coche Manual', desc: 'Aprende a usar el embrague y las marchas' },
            { id: 'automatico', icon: '🅰️', name: 'Coche Automatico', desc: 'Conduce sin preocuparte de marchas' },
            { id: 'moto', icon: '🏍️', name: 'Moto', desc: 'Conduce una motocicleta' }
        ],
        perfil: { creatividad:3, logica:5, empatia:4, precision:8, liderazgo:3, velocidad:8, memoria:6, comunicacion:4, pensamiento_sistemico:6, iteracion:5, juicio_critico:7, adaptabilidad:7 }
    },
    musica: {
        title: '🎵 Musica',
        subtypes: [
            { id: 'bateria', icon: '🥁', name: 'Bateria', desc: 'Toca ritmos con la bateria' },
            { id: 'piano', icon: '🎹', name: 'Piano', desc: 'Toca melodias con el teclado' },
            { id: 'guitarra', icon: '🎸', name: 'Guitarra', desc: 'Rasguea acordes y melodias' },
            { id: 'dj', icon: '🎧', name: 'DJ', desc: 'Mezcla musica y crea sets' }
        ],
        perfil: { creatividad:9, logica:5, empatia:6, precision:7, liderazgo:4, velocidad:6, memoria:8, comunicacion:5, pensamiento_sistemico:4, iteracion:9, juicio_critico:8, adaptabilidad:6 }
    },
    pintura: {
        title: '🎨 Pintura',
        subtypes: [
            { id: 'acuarela', icon: '💧', name: 'Acuarela', desc: 'Pinta con acuarelas suaves y transparentes' },
            { id: 'oleo', icon: '🖌️', name: 'Oleo', desc: 'Pinta con oleos gruesos y vibrantes' },
            { id: 'graffiti', icon: '🎨', name: 'Graffiti', desc: 'Arte urbano con spray' },
            { id: 'dibujo', icon: '✏️', name: 'Dibujo', desc: 'Dibuja con lapiz y carbon' }
        ],
        perfil: { creatividad:10, logica:3, empatia:6, precision:7, liderazgo:3, velocidad:4, memoria:6, comunicacion:5, pensamiento_sistemico:3, iteracion:10, juicio_critico:9, adaptabilidad:7 }
    },
    ajedrez: {
        title: '♟️ Ajedrez',
        subtypes: [
            { id: 'clasico', icon: '♔', name: 'Clasico', desc: 'Partida completa contra la IA' },
            { id: 'rapido', icon: '⏱️', name: 'Rapido', desc: 'Partida a 5 minutos por jugador' },
            { id: 'puzzle', icon: '🧩', name: 'Puzzles', desc: 'Encuentra la mejor jugada' }
        ],
        perfil: { creatividad:6, logica:10, empatia:3, precision:9, liderazgo:4, velocidad:5, memoria:9, comunicacion:3, pensamiento_sistemico:10, iteracion:6, juicio_critico:9, adaptabilidad:5 }
    },
    universidad: {
        title: '🎓 Camino a la Universidad',
        subtypes: [
            { id: 'camarero', icon: '🍽️', name: 'Camarero', desc: 'Sirve pedidos a los clientes del restaurante' },
            { id: 'socorrista', icon: '🛟', name: 'Socorrista', desc: 'Rescata nadadores en la piscina' },
            { id: 'repartidor', icon: '🛵', name: 'Repartidor', desc: 'Entrega pedidos en moto por la ciudad' },
            { id: 'monitor', icon: '🧑‍🏫', name: 'Monitor', desc: 'Organiza actividades para los ninos' },
            { id: 'dependiente', icon: '🏪', name: 'Dependiente', desc: 'Encuentra productos para los clientes' },
            { id: 'tutor', icon: '📐', name: 'Tutor', desc: 'Da clases particulares de matematicas' }
        ],
        perfil: { creatividad:5, logica:6, empatia:7, precision:5, liderazgo:6, velocidad:7, memoria:6, comunicacion:8, pensamiento_sistemico:5, iteracion:7, juicio_critico:6, adaptabilidad:9 }
    },
    programador: {
        title: '🤖 Programador / Orquestador',
        name: 'Programador / Orquestador',
        icon: '🤖',
        color: '#7c3aed',
        subtypes: [
            { id: 'programador_skills', icon: '💻', name: 'El Programador', desc: 'Asi se hacia hasta ahora' },
            { id: 'orquestador_skills', icon: '🎭', name: 'El Orquestador', desc: 'Asi se hara en el futuro' },
            { id: 'debug_detective', icon: '🔍', name: 'Debug Detective', desc: 'Encuentra los errores en el codigo' },
            { id: 'algoritmo', icon: '🧩', name: 'Construye el Algoritmo', desc: 'Ordena las instrucciones' },
            { id: 'prompt_master', icon: '✨', name: 'Prompt Master', desc: 'Aprende a dar instrucciones a la IA' },
            { id: 'director_agentes', icon: '🎬', name: 'Director de Agentes', desc: 'Dirige un equipo de agentes IA' },
            { id: 'evolucion', icon: '🔄', name: 'Evolucion', desc: 'Del programador al orquestador' }
        ],
        perfil: { creatividad:6, logica:9, empatia:4, precision:9, liderazgo:6, velocidad:6, memoria:7, comunicacion:7, pensamiento_sistemico:8, iteracion:8, juicio_critico:8, adaptabilidad:8 }
    }
};

// --- Navegacion ---
function navigateTo(professionId) {
    const prof = PROFESSIONS[professionId];
    if (!prof) return;

    document.getElementById('subtypes-title').textContent = prof.title;
    const list = document.getElementById('subtypes-list');
    list.innerHTML = '';

    // Difficulty selector for hobbies
    if (HOBBY_SECTIONS.includes(professionId)) {
        const diffDiv = document.createElement('div');
        diffDiv.className = 'difficulty-selector';
        diffDiv.innerHTML = `
            <span class="diff-label">Dificultad:</span>
            <button class="diff-btn ${gameDifficulty === 'easy' ? 'active' : ''}" data-diff="easy">Facil</button>
            <button class="diff-btn ${gameDifficulty === 'normal' ? 'active' : ''}" data-diff="normal">Normal</button>
            <button class="diff-btn ${gameDifficulty === 'hard' ? 'active' : ''}" data-diff="hard">Dificil</button>
        `;
        diffDiv.querySelectorAll('.diff-btn').forEach(btn => {
            btn.onclick = () => {
                gameDifficulty = btn.dataset.diff;
                diffDiv.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
        });
        list.appendChild(diffDiv);
    }

    prof.subtypes.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'subtype-card fade-in';
        card.innerHTML = `
            <div class="subtype-icon">${sub.icon}</div>
            <h3>${sub.name}</h3>
            <p>${sub.desc}</p>
        `;
        card.onclick = () => startGame(professionId, sub.id, sub.name);
        list.appendChild(card);
    });

    showScreen('subtypes');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + screenId).classList.add('active');
    currentScreen = screenId;
}

function goHome() {
    if (currentGame && currentGame.cleanup) currentGame.cleanup();
    currentGame = null;
    showScreen('home');
}

function exitGame() {
    if (currentGame && currentGame.cleanup) currentGame.cleanup();
    currentGame = null;
    showScreen('subtypes');
}

function setScore(pts) {
    score = pts;
    document.getElementById('game-score').textContent = score + ' pts';
}

function addScore(pts) {
    setScore(score + pts);
}

function startGame(professionId, subtypeId, title) {
    document.getElementById('game-title').textContent = title;
    document.getElementById('game-ui').innerHTML = '';
    document.getElementById('game-controls').innerHTML = '';
    setScore(0);

    const canvas = document.getElementById('game-canvas');
    const container = document.getElementById('game-container');
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any previous scale
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'none';

    showScreen('game');

    // Enrutar al juego correcto
    switch (professionId) {
        case 'arquitectura': startArquitectura(subtypeId); break;
        case 'interiorismo': startArquitectura(subtypeId); break;
        case 'medico': startMedico(subtypeId); break;
        case 'cocina': startCocina(subtypeId); break;
        case 'bombero': startBombero(subtypeId); break;
        case 'viajes': startViajes(subtypeId); break;
        case 'deportes': startDeporte(subtypeId); break;
        case 'conducir': startConducir(subtypeId); break;
        case 'musica': startMusica(subtypeId); break;
        case 'pintura': startPintura(subtypeId); break;
        case 'ajedrez': startAjedrez(subtypeId); break;
        case 'universidad': startUniversidad(subtypeId); break;
        case 'programador': startProgramador(subtypeId); break;
    }
}

// --- Utilidades ---
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function showResult(title, scoreFinal, msg, onRestart) {
    const ui = document.getElementById('game-ui');
    const overlay = document.createElement('div');
    overlay.className = 'result-overlay fade-in';
    overlay.innerHTML = `
        <h2>${title}</h2>
        <div class="result-score">${scoreFinal}</div>
        <div class="result-msg">${msg}</div>
        <button class="btn-primary" id="btn-restart">Volver a jugar</button>
        <button class="btn-primary" style="background: rgba(255,255,255,0.1);" id="btn-exit-result">Salir</button>
    `;
    ui.appendChild(overlay);
    overlay.querySelector('#btn-restart').onclick = () => {
        overlay.remove();
        if (onRestart) onRestart();
    };
    overlay.querySelector('#btn-exit-result').onclick = () => {
        overlay.remove();
        exitGame();
    };
}
