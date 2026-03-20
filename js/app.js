// ==========================================
// APP.JS - Navegacion principal y utilidades
// ==========================================

let currentScreen = 'home';
let currentGame = null;
let score = 0;

// --- Datos de profesiones y subtipos ---
const PROFESSIONS = {
    arquitectura: {
        title: '🏗️ Arquitectura',
        subtypes: [
            { id: 'urbanismo', icon: '🏙️', name: 'Urbanismo', desc: 'Disena ciudades: coloca edificios, parques, escuelas y mas' },
            { id: 'interiores', icon: '🛋️', name: 'Interiores', desc: 'Decora y organiza espacios interiores de viviendas' },
            { id: 'paisajismo', icon: '🌳', name: 'Paisajismo', desc: 'Disena jardines, parques y espacios verdes' },
            { id: 'sostenible', icon: '♻️', name: 'Sostenible', desc: 'Construye edificios ecologicos y eficientes' }
        ]
    },
    medico: {
        title: '🩺 Medico',
        subtypes: [
            { id: 'general', icon: '👨‍⚕️', name: 'Medicina General', desc: 'Diagnostica pacientes segun sus sintomas' },
            { id: 'cirujano', icon: '🔪', name: 'Cirujano', desc: 'Realiza operaciones quirurgicas paso a paso' },
            { id: 'radiologo', icon: '🩻', name: 'Radiologo', desc: 'Analiza radiografias y encuentra problemas' },
            { id: 'farmaceutico', icon: '💊', name: 'Farmaceutico', desc: 'Receta los medicamentos correctos' }
        ]
    },
    cocina: {
        title: '👨‍🍳 Cocina',
        subtypes: [
            { id: 'espanola', icon: '🥘', name: 'Cocina Espanola', desc: 'Prepara paella, tortilla y mas clasicos' },
            { id: 'italiana', icon: '🍕', name: 'Cocina Italiana', desc: 'Pizza, pasta y risotto' },
            { id: 'japonesa', icon: '🍣', name: 'Cocina Japonesa', desc: 'Sushi, ramen y tempura' },
            { id: 'pasteleria', icon: '🎂', name: 'Pasteleria', desc: 'Tartas, galletas y postres' }
        ]
    },
    bombero: {
        title: '🚒 Bomberos',
        subtypes: [
            { id: 'extincion', icon: '🔥', name: 'Extincion de Incendios', desc: 'Apaga fuegos en edificios' },
            { id: 'rescate', icon: '🆘', name: 'Rescate', desc: 'Rescata personas atrapadas' },
            { id: 'conduccion', icon: '🚒', name: 'Conduccion', desc: 'Conduce el camion de bomberos' },
            { id: 'forestal', icon: '🌲', name: 'Incendio Forestal', desc: 'Combate incendios en el bosque' }
        ]
    },
    viajes: {
        title: '✈️ Agente de Viajes',
        subtypes: [
            { id: 'europa', icon: '🇪🇺', name: 'Europa', desc: 'Francia, Italia, Alemania y mas' },
            { id: 'asia', icon: '🌏', name: 'Asia', desc: 'Japon, Tailandia, China y mas' },
            { id: 'america', icon: '🌎', name: 'America', desc: 'EEUU, Mexico, Brasil y mas' },
            { id: 'africa', icon: '🌍', name: 'Africa', desc: 'Marruecos, Kenia, Sudafrica y mas' }
        ]
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
        ]
    },
    conducir: {
        title: '🚗 Conducir',
        subtypes: [
            { id: 'manual', icon: '🔧', name: 'Coche Manual', desc: 'Aprende a usar el embrague y las marchas' },
            { id: 'automatico', icon: '🅰️', name: 'Coche Automatico', desc: 'Conduce sin preocuparte de marchas' },
            { id: 'moto', icon: '🏍️', name: 'Moto', desc: 'Conduce una motocicleta' }
        ]
    },
    musica: {
        title: '🎵 Musica',
        subtypes: [
            { id: 'bateria', icon: '🥁', name: 'Bateria', desc: 'Toca ritmos con la bateria' },
            { id: 'piano', icon: '🎹', name: 'Piano', desc: 'Toca melodias con el teclado' },
            { id: 'guitarra', icon: '🎸', name: 'Guitarra', desc: 'Rasguea acordes y melodias' },
            { id: 'dj', icon: '🎧', name: 'DJ', desc: 'Mezcla musica y crea sets' }
        ]
    }
};

// --- Navegacion ---
function navigateTo(professionId) {
    const prof = PROFESSIONS[professionId];
    if (!prof) return;

    document.getElementById('subtypes-title').textContent = prof.title;
    const list = document.getElementById('subtypes-list');
    list.innerHTML = '';

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
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.display = 'none';

    showScreen('game');

    // Enrutar al juego correcto
    switch (professionId) {
        case 'arquitectura': startArquitectura(subtypeId); break;
        case 'medico': startMedico(subtypeId); break;
        case 'cocina': startCocina(subtypeId); break;
        case 'bombero': startBombero(subtypeId); break;
        case 'viajes': startViajes(subtypeId); break;
        case 'deportes': startDeporte(subtypeId); break;
        case 'conducir': startConducir(subtypeId); break;
        case 'musica': startMusica(subtypeId); break;
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
