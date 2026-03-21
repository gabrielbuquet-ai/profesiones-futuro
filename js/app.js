// ==========================================
// APP.JS - Navegacion principal y utilidades
// ==========================================

let currentScreen = 'home';
let currentGame = null;
let score = 0;
let gameDifficulty = 'normal'; // easy, normal, hard
let _lastProfessionId = null;
let _lastSubtypeId = null;

const STORAGE_KEY = 'profesiones_futuro_data';

const HOBBY_SECTIONS = ['deportes', 'conducir', 'musica', 'pintura', 'ajedrez'];

// --- Game to Skills mapping ---
const GAME_SKILLS_MAP = {
    'arquitectura': { creatividad: 0.30, logica: 0.25, precision: 0.25, pensamiento_sistemico: 0.20 },
    'interiorismo': { creatividad: 0.35, juicio_critico: 0.25, empatia: 0.20, precision: 0.20 },
    'medico': { logica: 0.25, empatia: 0.25, memoria: 0.25, precision: 0.15, juicio_critico: 0.10 },
    'cocina': { creatividad: 0.25, velocidad: 0.25, memoria: 0.20, iteracion: 0.15, precision: 0.15 },
    'bombero': { velocidad: 0.30, liderazgo: 0.25, adaptabilidad: 0.20, empatia: 0.15, precision: 0.10 },
    'viajes': { comunicacion: 0.30, empatia: 0.20, creatividad: 0.20, adaptabilidad: 0.15, memoria: 0.15 },
    'debug_detective': { precision: 0.30, logica: 0.30, velocidad: 0.25, memoria: 0.15 },
    'algoritmo': { logica: 0.35, pensamiento_sistemico: 0.25, precision: 0.20, iteracion: 0.20 },
    'prompt_master': { comunicacion: 0.30, iteracion: 0.25, juicio_critico: 0.25, creatividad: 0.20 },
    'director_agentes': { pensamiento_sistemico: 0.25, comunicacion: 0.20, liderazgo: 0.20, juicio_critico: 0.15, adaptabilidad: 0.10, creatividad: 0.10 },
    'deportes': { velocidad: 0.30, liderazgo: 0.25, adaptabilidad: 0.25, empatia: 0.20 },
    'conducir': { precision: 0.30, velocidad: 0.25, logica: 0.25, adaptabilidad: 0.20 },
    'musica': { creatividad: 0.30, memoria: 0.25, precision: 0.20, iteracion: 0.15, empatia: 0.10 },
    'pintura': { creatividad: 0.40, juicio_critico: 0.25, iteracion: 0.20, empatia: 0.15 },
    'ajedrez': { logica: 0.35, pensamiento_sistemico: 0.25, memoria: 0.20, precision: 0.20 },
    'universidad': { comunicacion: 0.25, adaptabilidad: 0.25, velocidad: 0.20, empatia: 0.15, liderazgo: 0.15 }
};

// --- Profession profiles for cosine similarity ---
const PROFESSION_PROFILES = {
    arquitectura: { creatividad:9, logica:8, empatia:3, precision:9, liderazgo:5, velocidad:3, memoria:6, comunicacion:5, pensamiento_sistemico:9, iteracion:7, juicio_critico:8, adaptabilidad:5 },
    interiorismo: { creatividad:10, logica:5, empatia:7, precision:7, liderazgo:4, velocidad:3, memoria:6, comunicacion:7, pensamiento_sistemico:6, iteracion:8, juicio_critico:9, adaptabilidad:6 },
    medico: { creatividad:4, logica:9, empatia:10, precision:9, liderazgo:6, velocidad:7, memoria:9, comunicacion:8, pensamiento_sistemico:8, iteracion:5, juicio_critico:10, adaptabilidad:7 },
    cocina: { creatividad:8, logica:5, empatia:5, precision:7, liderazgo:6, velocidad:8, memoria:7, comunicacion:4, pensamiento_sistemico:4, iteracion:9, juicio_critico:8, adaptabilidad:6 },
    bombero: { creatividad:3, logica:6, empatia:8, precision:6, liderazgo:9, velocidad:10, memoria:5, comunicacion:7, pensamiento_sistemico:7, iteracion:3, juicio_critico:7, adaptabilidad:9 },
    viajes: { creatividad:6, logica:5, empatia:7, precision:5, liderazgo:5, velocidad:4, memoria:7, comunicacion:10, pensamiento_sistemico:5, iteracion:6, juicio_critico:6, adaptabilidad:8 },
    programador: { creatividad:5, logica:10, empatia:3, precision:10, liderazgo:4, velocidad:6, memoria:8, comunicacion:5, pensamiento_sistemico:7, iteracion:6, juicio_critico:7, adaptabilidad:7 },
    orquestador: { creatividad:8, logica:7, empatia:5, precision:7, liderazgo:9, velocidad:5, memoria:5, comunicacion:10, pensamiento_sistemico:10, iteracion:10, juicio_critico:9, adaptabilidad:10 }
};

const PROFESSION_DISPLAY = {
    arquitectura: { icon: '🏗️', name: 'Arquitecto/a', color: '#f59e0b' },
    interiorismo: { icon: '🛋️', name: 'Interiorista', color: '#ec4899' },
    medico: { icon: '🩺', name: 'M\u00e9dico/a', color: '#10b981' },
    cocina: { icon: '👨‍🍳', name: 'Chef', color: '#ef4444' },
    bombero: { icon: '🚒', name: 'Bombero/a', color: '#f97316' },
    viajes: { icon: '✈️', name: 'Agente de Viajes', color: '#3b82f6' },
    programador: { icon: '💻', name: 'Programador/a', color: '#7c3aed' },
    orquestador: { icon: '🎭', name: 'Orquestador/a de IA', color: '#8b5cf6' }
};

const SKILL_NAMES = {
    creatividad: 'Creatividad', logica: 'L\u00f3gica', empatia: 'Empat\u00eda',
    precision: 'Precisi\u00f3n', liderazgo: 'Liderazgo', velocidad: 'Velocidad',
    memoria: 'Memoria', comunicacion: 'Comunicaci\u00f3n',
    pensamiento_sistemico: 'Pensamiento Sist\u00e9mico', iteracion: 'Iteraci\u00f3n',
    juicio_critico: 'Juicio Cr\u00edtico', adaptabilidad: 'Adaptabilidad'
};

const SKILL_KEYS = Object.keys(SKILL_NAMES);

// --- Datos de profesiones y subtipos ---
const PROFESSIONS = {
    arquitectura: {
        title: '🏗️ Arquitectura',
        subtypes: [
            { id: 'urbanismo', icon: '🏙️', name: 'Urbanismo', desc: 'Dise\u00f1a ciudades: coloca edificios, parques, escuelas y m\u00e1s' },
            { id: 'paisajismo', icon: '🌳', name: 'Paisajismo', desc: 'Dise\u00f1a jardines, parques y espacios verdes' },
            { id: 'sostenible', icon: '♻️', name: 'Sostenible', desc: 'Construye edificios ecol\u00f3gicos y eficientes' }
        ],
        perfil: { creatividad:8, logica:7, empatia:5, precision:9, liderazgo:7, velocidad:4, memoria:6, comunicacion:6, pensamiento_sistemico:9, iteracion:7, juicio_critico:8, adaptabilidad:5 }
    },
    interiorismo: {
        title: '🛋️ Interiorismo',
        subtypes: [
            { id: 'int_habitacion', icon: '🛏️', name: 'Habitaci\u00f3n', desc: 'Dise\u00f1a un dormitorio acogedor' },
            { id: 'int_salon', icon: '🛋️', name: 'Sal\u00f3n', desc: 'Decora un sal\u00f3n moderno' },
            { id: 'int_bano', icon: '🚿', name: 'Ba\u00f1o', desc: 'Dise\u00f1a un ba\u00f1o funcional' },
            { id: 'int_restaurante', icon: '🍽️', name: 'Restaurante', desc: 'Crea un restaurante con estilo' },
            { id: 'int_cocina', icon: '🍳', name: 'Cocina', desc: 'Dise\u00f1a una cocina equipada' },
            { id: 'int_colegio', icon: '🏫', name: 'Colegio', desc: 'Organiza un aula escolar' },
            { id: 'int_iglesia', icon: '⛪', name: 'Iglesia', desc: 'Dise\u00f1a el interior de una iglesia' }
        ],
        perfil: { creatividad:9, logica:5, empatia:7, precision:8, liderazgo:5, velocidad:4, memoria:6, comunicacion:7, pensamiento_sistemico:6, iteracion:8, juicio_critico:9, adaptabilidad:6 }
    },
    medico: {
        title: '🩺 M\u00e9dico',
        subtypes: [
            { id: 'general', icon: '👨‍⚕️', name: 'Medicina General', desc: 'Diagnostica pacientes seg\u00fan sus s\u00edntomas' },
            { id: 'cirujano', icon: '🔪', name: 'Cirujano', desc: 'Realiza operaciones quir\u00fargicas paso a paso' },
            { id: 'radiologo', icon: '🩻', name: 'Radi\u00f3logo', desc: 'Analiza radiograf\u00edas y encuentra problemas' },
            { id: 'farmaceutico', icon: '💊', name: 'Farmac\u00e9utico', desc: 'Receta los medicamentos correctos' }
        ],
        perfil: { creatividad:4, logica:8, empatia:9, precision:10, liderazgo:6, velocidad:5, memoria:9, comunicacion:8, pensamiento_sistemico:8, iteracion:5, juicio_critico:10, adaptabilidad:7 }
    },
    cocina: {
        title: '👨‍🍳 Cocina',
        subtypes: [
            { id: 'espanola', icon: '🥘', name: 'Cocina Espa\u00f1ola', desc: 'Prepara paella, tortilla y m\u00e1s cl\u00e1sicos' },
            { id: 'italiana', icon: '🍕', name: 'Cocina Italiana', desc: 'Pizza, pasta y risotto' },
            { id: 'japonesa', icon: '🍣', name: 'Cocina Japonesa', desc: 'Sushi, ramen y tempura' },
            { id: 'pasteleria', icon: '🎂', name: 'Pasteler\u00eda', desc: 'Tartas, galletas y postres' }
        ],
        perfil: { creatividad:9, logica:4, empatia:6, precision:8, liderazgo:5, velocidad:7, memoria:7, comunicacion:5, pensamiento_sistemico:4, iteracion:9, juicio_critico:8, adaptabilidad:6 }
    },
    bombero: {
        title: '🚒 Bomberos',
        subtypes: [
            { id: 'extincion', icon: '🔥', name: 'Extinci\u00f3n de Incendios', desc: 'Apaga fuegos en edificios' },
            { id: 'rescate', icon: '🆘', name: 'Rescate', desc: 'Rescata personas atrapadas' },
            { id: 'conduccion', icon: '🚒', name: 'Conducci\u00f3n', desc: 'Conduce el cami\u00f3n de bomberos' },
            { id: 'forestal', icon: '🌲', name: 'Incendio Forestal', desc: 'Combate incendios en el bosque' }
        ],
        perfil: { creatividad:3, logica:6, empatia:7, precision:7, liderazgo:8, velocidad:9, memoria:5, comunicacion:8, pensamiento_sistemico:7, iteracion:3, juicio_critico:7, adaptabilidad:9 }
    },
    viajes: {
        title: '✈️ Agente de Viajes',
        subtypes: [
            { id: 'europa', icon: '🇪🇺', name: 'Europa', desc: 'Francia, Italia, Alemania y m\u00e1s' },
            { id: 'asia', icon: '🌏', name: 'Asia', desc: 'Jap\u00f3n, Tailandia, China y m\u00e1s' },
            { id: 'america', icon: '🌎', name: 'Am\u00e9rica', desc: 'EEUU, M\u00e9xico, Brasil y m\u00e1s' },
            { id: 'africa', icon: '🌍', name: '\u00c1frica', desc: 'Marruecos, Kenia, Sud\u00e1frica y m\u00e1s' }
        ],
        perfil: { creatividad:6, logica:5, empatia:8, precision:6, liderazgo:5, velocidad:4, memoria:7, comunicacion:9, pensamiento_sistemico:5, iteracion:6, juicio_critico:6, adaptabilidad:8 }
    },
    deportes: {
        title: '⚽ Deportes',
        subtypes: [
            { id: 'futbol', icon: '⚽', name: 'F\u00fatbol', desc: 'Practica tiros a porter\u00eda' },
            { id: 'baloncesto', icon: '🏀', name: 'Baloncesto', desc: 'Encesta canastas' },
            { id: 'tenis', icon: '🎾', name: 'Tenis', desc: 'Devuelve la pelota' },
            { id: 'natacion', icon: '🏊', name: 'Nataci\u00f3n', desc: 'Nada lo m\u00e1s r\u00e1pido posible' },
            { id: 'atletismo', icon: '🏃', name: 'Atletismo', desc: 'Corre y salta obst\u00e1culos' },
            { id: 'boxeo', icon: '🥊', name: 'Boxeo', desc: 'Entrena t\u00e9cnica con el saco de boxeo' }
        ],
        perfil: { creatividad:5, logica:4, empatia:6, precision:6, liderazgo:7, velocidad:9, memoria:5, comunicacion:7, pensamiento_sistemico:5, iteracion:7, juicio_critico:6, adaptabilidad:8 }
    },
    conducir: {
        title: '🚗 Conducir',
        subtypes: [
            { id: 'manual', icon: '🔧', name: 'Coche Manual', desc: 'Aprende a usar el embrague y las marchas' },
            { id: 'automatico', icon: '🅰️', name: 'Coche Autom\u00e1tico', desc: 'Conduce sin preocuparte de marchas' },
            { id: 'moto', icon: '🏍️', name: 'Moto', desc: 'Conduce una motocicleta' }
        ],
        perfil: { creatividad:3, logica:5, empatia:4, precision:8, liderazgo:3, velocidad:8, memoria:6, comunicacion:4, pensamiento_sistemico:6, iteracion:5, juicio_critico:7, adaptabilidad:7 }
    },
    musica: {
        title: '🎵 M\u00fasica',
        subtypes: [
            { id: 'bateria', icon: '🥁', name: 'Bater\u00eda', desc: 'Toca ritmos con la bater\u00eda' },
            { id: 'piano', icon: '🎹', name: 'Piano', desc: 'Toca melod\u00edas con el teclado' },
            { id: 'guitarra', icon: '🎸', name: 'Guitarra', desc: 'Rasguea acordes y melod\u00edas' },
            { id: 'dj', icon: '🎧', name: 'DJ', desc: 'Mezcla m\u00fasica y crea sets' }
        ],
        perfil: { creatividad:9, logica:5, empatia:6, precision:7, liderazgo:4, velocidad:6, memoria:8, comunicacion:5, pensamiento_sistemico:4, iteracion:9, juicio_critico:8, adaptabilidad:6 }
    },
    pintura: {
        title: '🎨 Pintura',
        subtypes: [
            { id: 'acuarela', icon: '💧', name: 'Acuarela', desc: 'Pinta con acuarelas suaves y transparentes' },
            { id: 'oleo', icon: '🖌️', name: '\u00d3leo', desc: 'Pinta con \u00f3leos gruesos y vibrantes' },
            { id: 'graffiti', icon: '🎨', name: 'Graffiti', desc: 'Arte urbano con spray' },
            { id: 'dibujo', icon: '✏️', name: 'Dibujo', desc: 'Dibuja con l\u00e1piz y carb\u00f3n' }
        ],
        perfil: { creatividad:10, logica:3, empatia:6, precision:7, liderazgo:3, velocidad:4, memoria:6, comunicacion:5, pensamiento_sistemico:3, iteracion:10, juicio_critico:9, adaptabilidad:7 }
    },
    ajedrez: {
        title: '♟️ Ajedrez',
        subtypes: [
            { id: 'clasico', icon: '♔', name: 'Cl\u00e1sico', desc: 'Partida completa contra la IA' },
            { id: 'rapido', icon: '⏱️', name: 'R\u00e1pido', desc: 'Partida a 5 minutos por jugador' },
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
            { id: 'monitor', icon: '🧑‍🏫', name: 'Monitor', desc: 'Organiza actividades para los ni\u00f1os' },
            { id: 'dependiente', icon: '🏪', name: 'Dependiente', desc: 'Encuentra productos para los clientes' },
            { id: 'tutor', icon: '📐', name: 'Tutor', desc: 'Da clases particulares de matem\u00e1ticas' }
        ],
        perfil: { creatividad:5, logica:6, empatia:7, precision:5, liderazgo:6, velocidad:7, memoria:6, comunicacion:8, pensamiento_sistemico:5, iteracion:7, juicio_critico:6, adaptabilidad:9 }
    },
    programador: {
        title: '🤖 Programador / Orquestador',
        name: 'Programador / Orquestador',
        icon: '🤖',
        color: '#7c3aed',
        subtypes: [
            { id: 'programador_skills', icon: '💻', name: 'El Programador', desc: 'As\u00ed se hac\u00eda hasta ahora' },
            { id: 'orquestador_skills', icon: '🎭', name: 'El Orquestador', desc: 'As\u00ed se har\u00e1 en el futuro' },
            { id: 'debug_detective', icon: '🔍', name: 'Debug Detective', desc: 'Encuentra los errores en el c\u00f3digo' },
            { id: 'algoritmo', icon: '🧩', name: 'Construye el Algoritmo', desc: 'Ordena las instrucciones' },
            { id: 'prompt_master', icon: '✨', name: 'Prompt Master', desc: 'Aprende a dar instrucciones a la IA' },
            { id: 'director_agentes', icon: '🎬', name: 'Director de Agentes', desc: 'Dirige un equipo de agentes IA' },
            { id: 'evolucion', icon: '🔄', name: 'Evoluci\u00f3n', desc: 'Del programador al orquestador' }
        ],
        perfil: { creatividad:6, logica:9, empatia:4, precision:9, liderazgo:6, velocidad:6, memoria:7, comunicacion:7, pensamiento_sistemico:8, iteracion:8, juicio_critico:8, adaptabilidad:8 }
    }
};

// ==========================================
// localStorage Persistence
// ==========================================

function getPlayerData() {
    try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { /* corrupted data */ }
    return null;
}

function savePlayerData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function createDefaultData(nombre) {
    return {
        jugador: { nombre: nombre, fechaCreacion: new Date().toISOString().slice(0, 10) },
        puntuaciones: [],
        habilidades: {
            creatividad: 0, logica: 0, empatia: 0, precision: 0,
            liderazgo: 0, velocidad: 0, memoria: 0, comunicacion: 0,
            pensamiento_sistemico: 0, iteracion: 0, juicio_critico: 0, adaptabilidad: 0
        }
    };
}

function getTotalScore() {
    var data = getPlayerData();
    if (!data || !data.puntuaciones) return 0;
    return data.puntuaciones.reduce(function(sum, p) { return sum + (p.puntos || 0); }, 0);
}

function updateHomeGreeting() {
    var data = getPlayerData();
    var infoEl = document.getElementById('home-player-info');
    var greetEl = document.getElementById('player-greeting');
    if (!infoEl || !greetEl) return;
    if (data && data.jugador && data.jugador.nombre) {
        var total = getTotalScore();
        greetEl.textContent = 'Hola, ' + data.jugador.nombre + '! 🎮 ' + total + ' pts';
        infoEl.style.display = 'block';
    } else {
        infoEl.style.display = 'none';
    }
}

function showWelcomeModal() {
    var existing = document.getElementById('welcome-modal-backdrop');
    if (existing) existing.remove();

    var backdrop = document.createElement('div');
    backdrop.id = 'welcome-modal-backdrop';
    backdrop.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';

    var modal = document.createElement('div');
    modal.style.cssText = 'background:linear-gradient(145deg,#1e1b4b,#312e81);border-radius:24px;padding:36px 28px;max-width:360px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(124,58,237,0.4),0 0 30px rgba(168,85,247,0.2);border:2px solid rgba(168,85,247,0.3);';

    modal.innerHTML = '<div style="font-size:3.5em;margin-bottom:8px;">🎮</div>'
        + '<h2 style="color:#e0e7ff;font-size:1.4em;margin:0 0 6px 0;line-height:1.2;">\u00a1Bienvenido a<br>Profesiones del Futuro!</h2>'
        + '<p style="color:#a5b4fc;font-size:0.95em;margin:0 0 20px 0;">\u00bfC\u00f3mo te llamas?</p>'
        + '<input id="welcome-name-input" type="text" placeholder="Tu nombre..." maxlength="30" style="'
        + 'width:100%;box-sizing:border-box;padding:14px 16px;border-radius:14px;border:2px solid rgba(168,85,247,0.4);'
        + 'background:rgba(255,255,255,0.08);color:#e0e7ff;font-size:1.1em;text-align:center;outline:none;'
        + 'transition:border-color 0.3s;" />'
        + '<button id="welcome-start-btn" style="'
        + 'margin-top:18px;padding:14px 32px;border:none;border-radius:16px;'
        + 'background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;font-size:1.15em;'
        + 'font-weight:bold;cursor:pointer;width:100%;'
        + 'box-shadow:0 6px 20px rgba(124,58,237,0.5);transition:transform 0.2s;">\u00a1Empezar!</button>';

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    var input = document.getElementById('welcome-name-input');
    var btn = document.getElementById('welcome-start-btn');

    input.addEventListener('focus', function() { input.style.borderColor = '#a855f7'; });
    input.addEventListener('blur', function() { input.style.borderColor = 'rgba(168,85,247,0.4)'; });

    function submitName() {
        var nombre = input.value.trim();
        if (!nombre) {
            input.style.borderColor = '#ef4444';
            input.setAttribute('placeholder', 'Escribe tu nombre...');
            input.focus();
            return;
        }
        var data = createDefaultData(nombre);
        savePlayerData(data);
        backdrop.remove();
        updateHomeGreeting();
    }

    btn.onclick = submitName;
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') submitName();
    });

    setTimeout(function() { input.focus(); }, 100);
}

function getGameKey(professionId, subtypeId) {
    if (GAME_SKILLS_MAP[subtypeId]) return subtypeId;
    if (GAME_SKILLS_MAP[professionId]) return professionId;
    return null;
}

function saveGameResult(points) {
    var data = getPlayerData();
    if (!data) return;

    var professionId = _lastProfessionId;
    var subtypeId = _lastSubtypeId;
    var gameKey = getGameKey(professionId, subtypeId);

    var prevAttempts = data.puntuaciones.filter(function(p) {
        return p.juego === subtypeId && p.profesion === professionId;
    }).length;

    data.puntuaciones.push({
        juego: subtypeId,
        profesion: professionId,
        puntos: points,
        fecha: new Date().toISOString().slice(0, 10),
        intento: prevAttempts + 1
    });

    if (gameKey && GAME_SKILLS_MAP[gameKey] && points > 0) {
        var skillWeights = GAME_SKILLS_MAP[gameKey];
        for (var skill in skillWeights) {
            if (skillWeights.hasOwnProperty(skill)) {
                data.habilidades[skill] = (data.habilidades[skill] || 0) + Math.round(points * skillWeights[skill]);
            }
        }
    }

    savePlayerData(data);
    updateHomeGreeting();
}

// --- Navegacion ---
function navigateTo(professionId) {
    var prof = PROFESSIONS[professionId];
    if (!prof) return;

    document.getElementById('subtypes-title').textContent = prof.title;
    var list = document.getElementById('subtypes-list');
    list.innerHTML = '';

    if (HOBBY_SECTIONS.includes(professionId)) {
        var diffDiv = document.createElement('div');
        diffDiv.className = 'difficulty-selector';
        diffDiv.innerHTML = '<span class="diff-label">Dificultad:</span>'
            + '<button class="diff-btn ' + (gameDifficulty === 'easy' ? 'active' : '') + '" data-diff="easy">F\u00e1cil</button>'
            + '<button class="diff-btn ' + (gameDifficulty === 'normal' ? 'active' : '') + '" data-diff="normal">Normal</button>'
            + '<button class="diff-btn ' + (gameDifficulty === 'hard' ? 'active' : '') + '" data-diff="hard">Dif\u00edcil</button>';
        diffDiv.querySelectorAll('.diff-btn').forEach(function(btn) {
            btn.onclick = function() {
                gameDifficulty = btn.dataset.diff;
                diffDiv.querySelectorAll('.diff-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
            };
        });
        list.appendChild(diffDiv);
    }

    prof.subtypes.forEach(function(sub) {
        var card = document.createElement('div');
        card.className = 'subtype-card fade-in';
        card.innerHTML = '<div class="subtype-icon">' + sub.icon + '</div>'
            + '<h3>' + sub.name + '</h3>'
            + '<p>' + sub.desc + '</p>';
        card.onclick = function() { startGame(professionId, sub.id, sub.name); };
        list.appendChild(card);
    });

    showScreen('subtypes');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(function(s) {
        s.classList.remove('active');
        s.style.display = '';
    });
    var target = document.getElementById('screen-' + screenId);
    if (target) {
        target.style.display = '';
        target.classList.add('active');
    }
    currentScreen = screenId;
}

function goHome() {
    if (currentGame && currentGame.cleanup) currentGame.cleanup();
    currentGame = null;
    updateHomeGreeting();
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
    _lastProfessionId = professionId;
    _lastSubtypeId = subtypeId;

    document.getElementById('game-title').textContent = title;
    document.getElementById('game-ui').innerHTML = '';
    document.getElementById('game-controls').innerHTML = '';
    setScore(0);

    var canvas = document.getElementById('game-canvas');
    var container = document.getElementById('game-container');
    var ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'none';

    showScreen('game');

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
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
}

function showResult(title, scoreFinal, msg, onRestart) {
    // Save to localStorage
    var numericScore = parseInt(String(scoreFinal).replace(/[^0-9-]/g, ''), 10) || score;
    saveGameResult(numericScore);

    var ui = document.getElementById('game-ui');
    var overlay = document.createElement('div');
    overlay.className = 'result-overlay fade-in';
    overlay.innerHTML = '<h2>' + title + '</h2>'
        + '<div class="result-score">' + scoreFinal + '</div>'
        + '<div class="result-msg">' + msg + '</div>'
        + '<button class="btn-primary" id="btn-restart">Volver a jugar</button>'
        + '<button class="btn-primary" style="background: rgba(255,255,255,0.1);" id="btn-exit-result">Salir</button>';
    ui.appendChild(overlay);
    overlay.querySelector('#btn-restart').onclick = function() {
        overlay.remove();
        if (onRestart) onRestart();
    };
    overlay.querySelector('#btn-exit-result').onclick = function() {
        overlay.remove();
        exitGame();
    };
}

// ==========================================
// MI PERFIL Screen
// ==========================================

function showPerfil() {
    var data = getPlayerData();
    if (!data) {
        showWelcomeModal();
        return;
    }

    var content = document.getElementById('perfil-content');
    content.innerHTML = '';

    // Inject styles
    var style = document.createElement('style');
    style.textContent = '#perfil-content{padding:16px;max-width:500px;margin:0 auto;color:#e0e7ff;font-family:inherit;padding-bottom:40px}'
        + '.perfil-back-btn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#c4b5fd;padding:8px 18px;border-radius:12px;font-size:0.95em;cursor:pointer;margin-bottom:16px;display:inline-block}'
        + '.perfil-section{background:rgba(255,255,255,0.04);border:1px solid rgba(168,85,247,0.15);border-radius:18px;padding:20px 16px;margin-bottom:18px}'
        + '.perfil-section h3{margin:0 0 14px 0;font-size:1.1em;color:#c4b5fd}'
        + '.perfil-player-name{text-align:center;font-size:1.5em;font-weight:bold;margin-bottom:4px}'
        + '.perfil-player-date{text-align:center;font-size:0.85em;color:#8b8ba0;margin-bottom:16px}'
        + '.perfil-total{text-align:center;font-size:2em;font-weight:bold;color:#a855f7;margin-bottom:18px}'
        + '.radar-container{display:flex;justify-content:center;margin-bottom:10px}'
        + '.radar-empty-msg{text-align:center;color:#8b8ba0;font-size:0.95em;padding:10px 0}'
        + '.ranking-bar-row{display:flex;align-items:center;gap:8px;margin-bottom:10px}'
        + '.ranking-bar-row.top-profession{transform:scale(1.04);filter:drop-shadow(0 0 12px rgba(168,85,247,0.5))}'
        + '.ranking-icon{font-size:1.5em;width:36px;text-align:center;flex-shrink:0}'
        + '.ranking-name{width:90px;font-size:0.82em;color:#c4b5fd;flex-shrink:0}'
        + '.ranking-bar-bg{flex:1;height:22px;background:rgba(255,255,255,0.06);border-radius:11px;overflow:hidden;position:relative}'
        + '.ranking-bar-fill{height:100%;border-radius:11px;transition:width 0.6s ease}'
        + '.ranking-pct{width:44px;text-align:right;font-size:0.9em;font-weight:bold;flex-shrink:0}'
        + '.motivational-msg{text-align:center;font-size:1.05em;line-height:1.5;color:#e0e7ff;padding:8px}'
        + '.history-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:10px 14px;margin-bottom:8px}'
        + '.history-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}'
        + '.history-card-game{font-weight:bold;font-size:0.95em}'
        + '.history-card-pts{color:#a855f7;font-weight:bold}'
        + '.history-card-date{font-size:0.78em;color:#8b8ba0}'
        + '.history-card-skills{font-size:0.78em;color:#6b6b80;margin-top:3px}'
        + '.history-scroll{max-height:320px;overflow-y:auto}'
        + '.perfil-reset-btn{display:block;margin:24px auto 0 auto;padding:12px 28px;border:2px solid rgba(239,68,68,0.4);background:rgba(239,68,68,0.1);color:#fca5a5;border-radius:14px;font-size:0.95em;cursor:pointer;transition:background 0.2s}'
        + '.perfil-reset-btn:active{background:rgba(239,68,68,0.25)}';
    content.appendChild(style);

    // Back button
    var backBtn = document.createElement('button');
    backBtn.className = 'perfil-back-btn';
    backBtn.textContent = '\u2190 Volver';
    backBtn.onclick = function() { goHome(); };
    content.appendChild(backBtn);

    // Player info
    var nameEl = document.createElement('div');
    nameEl.className = 'perfil-player-name';
    nameEl.textContent = '🌟 ' + data.jugador.nombre;
    content.appendChild(nameEl);

    var dateEl = document.createElement('div');
    dateEl.className = 'perfil-player-date';
    dateEl.textContent = 'Jugando desde ' + data.jugador.fechaCreacion;
    content.appendChild(dateEl);

    var totalEl = document.createElement('div');
    totalEl.className = 'perfil-total';
    totalEl.textContent = getTotalScore() + ' pts totales';
    content.appendChild(totalEl);

    // Section A: Radar Chart
    var radarSection = document.createElement('div');
    radarSection.className = 'perfil-section';
    radarSection.innerHTML = '<h3>📊 Mapa de Habilidades</h3>';

    var hasSkills = SKILL_KEYS.some(function(k) { return (data.habilidades[k] || 0) > 0; });
    if (!hasSkills) {
        radarSection.innerHTML += '<div class="radar-empty-msg">\u00a1Juega algunos juegos para descubrir tus superpoderes!</div>';
    } else {
        var radarWrap = document.createElement('div');
        radarWrap.className = 'radar-container';
        var radarCanvas = document.createElement('canvas');
        var radarSize = Math.min(340, window.innerWidth - 64);
        radarCanvas.style.width = radarSize + 'px';
        radarCanvas.style.height = radarSize + 'px';
        radarCanvas.width = radarSize * 2;
        radarCanvas.height = radarSize * 2;
        radarWrap.appendChild(radarCanvas);
        radarSection.appendChild(radarWrap);
        drawRadarChart(radarCanvas, data.habilidades);
    }
    content.appendChild(radarSection);

    // Section B: Profession Ranking
    var rankSection = document.createElement('div');
    rankSection.className = 'perfil-section';
    rankSection.innerHTML = '<h3>🏆 Tu Ranking de Profesiones</h3>';

    if (!hasSkills) {
        rankSection.innerHTML += '<div class="radar-empty-msg">Necesitas jugar para ver tu ranking.</div>';
    } else {
        var ranking = computeProfessionRanking(data.habilidades);
        ranking.forEach(function(item, idx) {
            var display = PROFESSION_DISPLAY[item.key] || { icon: '❓', name: item.key, color: '#888' };
            var row = document.createElement('div');
            row.className = 'ranking-bar-row' + (idx === 0 ? ' top-profession' : '');
            row.innerHTML = '<div class="ranking-icon">' + display.icon + '</div>'
                + '<div class="ranking-name">' + display.name + '</div>'
                + '<div class="ranking-bar-bg"><div class="ranking-bar-fill" style="width:' + item.pct + '%;background:' + display.color + ';"></div></div>'
                + '<div class="ranking-pct" style="color:' + display.color + '">' + item.pct + '%</div>';
            rankSection.appendChild(row);
        });
    }
    content.appendChild(rankSection);

    // Section C: Motivational Message
    if (hasSkills) {
        var msgSection = document.createElement('div');
        msgSection.className = 'perfil-section';
        msgSection.innerHTML = '<h3>✨ Tu Superpoder</h3>';
        var msgDiv = document.createElement('div');
        msgDiv.className = 'motivational-msg';

        var sortedSkills = SKILL_KEYS.slice().sort(function(a, b) {
            return (data.habilidades[b] || 0) - (data.habilidades[a] || 0);
        });
        var top3 = sortedSkills.slice(0, 3).map(function(k) { return SKILL_NAMES[k]; });
        var rankingForMsg = computeProfessionRanking(data.habilidades);
        var topProf = rankingForMsg.length > 0 ? (PROFESSION_DISPLAY[rankingForMsg[0].key] || {}).name || rankingForMsg[0].key : 'profesional';

        msgDiv.textContent = '\u00a1Tus superpoderes son ' + top3[0] + ', ' + top3[1] + ' y ' + top3[2] + '! Eso te har\u00eda un/a gran ' + topProf + '. \u00a1Sigue entrenando!';
        msgSection.appendChild(msgDiv);
        content.appendChild(msgSection);
    }

    // Section D: Game History
    var histSection = document.createElement('div');
    histSection.className = 'perfil-section';
    histSection.innerHTML = '<h3>📜 Historial de Partidas</h3>';

    if (!data.puntuaciones || data.puntuaciones.length === 0) {
        histSection.innerHTML += '<div class="radar-empty-msg">A\u00fan no has jugado ninguna partida.</div>';
    } else {
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'history-scroll';
        var recent = data.puntuaciones.slice(-20).reverse();
        recent.forEach(function(entry) {
            var card = document.createElement('div');
            card.className = 'history-card';
            var gameName = entry.juego;
            for (var pKey in PROFESSIONS) {
                if (!PROFESSIONS.hasOwnProperty(pKey)) continue;
                var found = PROFESSIONS[pKey].subtypes.find(function(s) { return s.id === entry.juego; });
                if (found) { gameName = found.icon + ' ' + found.name; break; }
            }
            var gk = getGameKey(entry.profesion, entry.juego);
            var skillsText = '';
            if (gk && GAME_SKILLS_MAP[gk]) {
                skillsText = Object.keys(GAME_SKILLS_MAP[gk]).map(function(s) { return SKILL_NAMES[s] || s; }).join(', ');
            }
            card.innerHTML = '<div class="history-card-header">'
                + '<span class="history-card-game">' + gameName + '</span>'
                + '<span class="history-card-pts">' + entry.puntos + ' pts</span>'
                + '</div>'
                + '<div class="history-card-date">' + entry.fecha + ' - Intento #' + entry.intento + '</div>'
                + (skillsText ? '<div class="history-card-skills">' + skillsText + '</div>' : '');
            scrollDiv.appendChild(card);
        });
        histSection.appendChild(scrollDiv);
    }
    content.appendChild(histSection);

    // Section E: Reset Button
    var resetBtn = document.createElement('button');
    resetBtn.className = 'perfil-reset-btn';
    resetBtn.textContent = '🗑️ Borrar mis datos';
    resetBtn.onclick = function() {
        if (confirm('\u00bfSeguro? Se borrar\u00e1n todas tus puntuaciones y tu perfil.')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    };
    content.appendChild(resetBtn);

    showScreen('perfil');
}

// ==========================================
// Radar Chart Drawing
// ==========================================

function drawRadarChart(canvas, habilidades) {
    var ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    var w = canvas.width / 2;
    var h = canvas.height / 2;
    var cx = w / 2;
    var cy = h / 2;
    var radius = Math.min(cx, cy) - 38;
    var numAxes = SKILL_KEYS.length;
    var angleStep = (2 * Math.PI) / numAxes;
    var startAngle = -Math.PI / 2;

    var maxVal = 1;
    for (var mi = 0; mi < SKILL_KEYS.length; mi++) {
        var v = habilidades[SKILL_KEYS[mi]] || 0;
        if (v > maxVal) maxVal = v;
    }

    ctx.clearRect(0, 0, w, h);

    // Concentric rings
    var rings = [0.25, 0.5, 0.75, 1.0];
    for (var ri = 0; ri < rings.length; ri++) {
        var ring = rings[ri];
        ctx.beginPath();
        for (var i = 0; i <= numAxes; i++) {
            var angle = startAngle + i * angleStep;
            var x = cx + radius * ring * Math.cos(angle);
            var y = cy + radius * ring * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(168,85,247,' + (0.1 + ring * 0.15) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Axes
    for (var ai = 0; ai < numAxes; ai++) {
        var aAngle = startAngle + ai * angleStep;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(aAngle), cy + radius * Math.sin(aAngle));
        ctx.strokeStyle = 'rgba(168,85,247,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Player polygon
    ctx.beginPath();
    for (var pi = 0; pi < numAxes; pi++) {
        var pAngle = startAngle + pi * angleStep;
        var pVal = (habilidades[SKILL_KEYS[pi]] || 0) / maxVal;
        var px = cx + radius * pVal * Math.cos(pAngle);
        var py = cy + radius * pVal * Math.sin(pAngle);
        if (pi === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(168,85,247,0.25)';
    ctx.fill();
    ctx.shadowColor = 'rgba(168,85,247,0.6)';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(168,85,247,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Data points
    for (var di = 0; di < numAxes; di++) {
        var dAngle = startAngle + di * angleStep;
        var dVal = (habilidades[SKILL_KEYS[di]] || 0) / maxVal;
        var dx = cx + radius * dVal * Math.cos(dAngle);
        var dy = cy + radius * dVal * Math.sin(dAngle);
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#c084fc';
        ctx.fill();
    }

    // Labels
    var SKILL_ABBREVS = {
        creatividad: 'CRE', logica: 'LOG', empatia: 'EMP',
        precision: 'PRE', liderazgo: 'LID', velocidad: 'VEL',
        memoria: 'MEM', comunicacion: 'COM',
        pensamiento_sistemico: 'SIS', iteracion: 'ITE',
        juicio_critico: 'JUI', adaptabilidad: 'ADA'
    };

    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var li = 0; li < numAxes; li++) {
        var lAngle = startAngle + li * angleStep;
        var labelR = radius + 20;
        var lx = cx + labelR * Math.cos(lAngle);
        var ly = cy + labelR * Math.sin(lAngle);
        ctx.fillStyle = '#a5b4fc';
        ctx.fillText(SKILL_ABBREVS[SKILL_KEYS[li]] || SKILL_KEYS[li].slice(0, 3).toUpperCase(), lx, ly);
    }
}

// ==========================================
// Cosine Similarity + Profession Ranking
// ==========================================

function cosineSimilarity(vecA, vecB) {
    var dot = 0, magA = 0, magB = 0;
    for (var ki = 0; ki < SKILL_KEYS.length; ki++) {
        var key = SKILL_KEYS[ki];
        var a = vecA[key] || 0;
        var b = vecB[key] || 0;
        dot += a * b;
        magA += a * a;
        magB += b * b;
    }
    if (magA === 0 || magB === 0) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function computeProfessionRanking(playerSkills) {
    var results = [];
    for (var key in PROFESSION_PROFILES) {
        if (!PROFESSION_PROFILES.hasOwnProperty(key)) continue;
        var sim = cosineSimilarity(playerSkills, PROFESSION_PROFILES[key]);
        results.push({ key: key, similarity: sim, pct: Math.round(sim * 100) });
    }
    results.sort(function(a, b) { return b.similarity - a.similarity; });
    return results;
}

// ==========================================
// Init on page load
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    var data = getPlayerData();
    if (!data) {
        showWelcomeModal();
    } else {
        updateHomeGreeting();
    }
});
