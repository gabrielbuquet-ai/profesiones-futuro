// ==========================================
// PROGRAMADOR / ORQUESTADOR DE AGENTES
// ==========================================

// --- Skill data ---
const PROGRAMADOR_SKILLS = {
    tecnicas: {
        title: 'Habilidades Técnicas',
        emoji: '💻',
        skills: [
            { emoji: '🐍', name: 'Lenguajes de programación', desc: 'Python, JavaScript, C++... el idioma de las máquinas', detail: 'Un programador domina varios lenguajes para decirle al ordenador exactamente qué hacer.' },
            { emoji: '🗄️', name: 'Bases de datos', desc: 'Guardar y buscar datos rápidamente', detail: 'Como una biblioteca gigante donde el ordenador encuentra cualquier dato en milisegundos.' },
            { emoji: '🌐', name: 'Desarrollo web', desc: 'Crear páginas y aplicaciones online', detail: 'HTML, CSS y JavaScript: los tres pilares para construir todo lo que ves en internet.' },
            { emoji: '📱', name: 'Apps móviles', desc: 'Programar para teléfonos y tablets', detail: 'Crear apps que millones de personas llevan en su bolsillo cada día.' },
            { emoji: '🔧', name: 'Herramientas (Git)', desc: 'Controlar versiones del código', detail: 'Git es como una máquina del tiempo para tu código: puedes volver atrás si algo sale mal.' },
            { emoji: '🧪', name: 'Testing', desc: 'Comprobar que todo funciona', detail: 'Escribir pruebas automáticas para que los bugs no se escondan en el código.' },
            { emoji: '☁️', name: 'Cloud / Nube', desc: 'Servidores en la nube', detail: 'Usar ordenadores gigantes en centros de datos para que tu app funcione para millones.' },
            { emoji: '🔒', name: 'Seguridad', desc: 'Proteger datos y sistemas', detail: 'Como un guardia digital que impide que los hackers entren en tu aplicación.' }
        ]
    },
    pensamiento: {
        title: 'Pensamiento',
        emoji: '🧠',
        skills: [
            { emoji: '🧩', name: 'Lógica', desc: 'Pensar paso a paso de forma ordenada', detail: 'Si pasa X, entonces haz Y. La base de todo programa.' },
            { emoji: '🔍', name: 'Resolver problemas', desc: 'Encontrar soluciones creativas a errores', detail: 'Un bug es un misterio: hay que investigar pistas y encontrar la causa.' },
            { emoji: '📐', name: 'Algoritmos', desc: 'Recetas paso a paso para el ordenador', detail: 'Como una receta de cocina, pero para que el ordenador resuelva problemas.' },
            { emoji: '🏗️', name: 'Arquitectura', desc: 'Diseñar la estructura del programa', detail: 'Antes de construir una casa, necesitas los planos. Con el software es igual.' },
            { emoji: '🎯', name: 'Atención al detalle', desc: 'Un punto y coma puede romperlo todo', detail: 'En programación, hasta el más pequeño error puede hacer que nada funcione.' },
            { emoji: '♻️', name: 'Optimización', desc: 'Hacer que todo sea más rápido', detail: 'Encontrar formas de que el programa use menos memoria y sea más veloz.' }
        ]
    },
    proceso: {
        title: 'Proceso',
        emoji: '⚙️',
        skills: [
            { emoji: '📋', name: 'Planificación', desc: 'Organizar el trabajo en tareas', detail: 'Dividir un proyecto grande en pedazos pequeños y manejables.' },
            { emoji: '🔄', name: 'Metodología ágil', desc: 'Trabajar en ciclos cortos y mejorar', detail: 'Hacer un poco, enseñar, recibir feedback, mejorar. Repetir.' },
            { emoji: '📖', name: 'Documentación', desc: 'Explicar tu código para otros', detail: 'Escribir comentarios y guías para que otros (o tú del futuro) entiendan el código.' },
            { emoji: '🐛', name: 'Debugging', desc: 'Encontrar y arreglar errores', detail: 'Ser detective digital: poner pistas en el código para encontrar dónde falla.' },
            { emoji: '🚀', name: 'Despliegue', desc: 'Publicar tu app para el mundo', detail: 'El momento mágico en que tu creación está disponible para todos.' }
        ]
    },
    humanas: {
        title: 'Humanas',
        emoji: '🤝',
        skills: [
            { emoji: '👥', name: 'Trabajo en equipo', desc: 'Programar con otras personas', detail: 'Los mejores programas los hacen equipos, no personas solas.' },
            { emoji: '💬', name: 'Comunicación', desc: 'Explicar ideas técnicas de forma simple', detail: 'De nada sirve una solución genial si no puedes explicársela a tu equipo.' },
            { emoji: '📚', name: 'Aprender siempre', desc: 'La tecnología cambia cada día', detail: 'Nuevos lenguajes, herramientas y formas de programar aparecen constantemente.' },
            { emoji: '⏰', name: 'Gestión del tiempo', desc: 'Cumplir plazos sin estresarse', detail: 'Saber cuánto tiempo lleva cada tarea y organizarse para llegar a tiempo.' },
            { emoji: '💡', name: 'Creatividad', desc: 'Inventar soluciones nuevas', detail: 'Programar es crear: cada línea de código es una decisión creativa.' }
        ]
    }
};

const ORQUESTADOR_SKILLS = {
    estrategia: {
        title: 'Estrategia de Agentes',
        emoji: '🎯',
        skills: [
            { emoji: '🧭', name: 'Diseño de sistemas multi-agente', desc: 'Decidir cuántos agentes y qué hace cada uno', badge: 'NUEVA', detail: 'Como un director de orquesta que elige qué instrumento toca cada parte.' },
            { emoji: '🔀', name: 'Orquestación de flujos', desc: 'Conectar tareas entre agentes en orden', badge: 'NUEVA', detail: 'Crear el camino que sigue la información de un agente a otro.' },
            { emoji: '🏗️', name: 'Arquitectura de prompts', desc: 'Diseñar instrucciones perfectas para la IA', badge: 'EVOLUCIONA DE Arquitectura de software', detail: 'En vez de escribir código, escribes instrucciones claras y precisas.' },
            { emoji: '⚡', name: 'Evaluación de modelos', desc: 'Elegir la mejor IA para cada tarea', badge: 'NUEVA', detail: 'Cada modelo de IA tiene fortalezas diferentes: hay que saber elegir.' },
            { emoji: '🔄', name: 'Iteración de resultados', desc: 'Mejorar las respuestas de los agentes', badge: 'EVOLUCIONA DE Debugging', detail: 'Revisar lo que produce la IA y pedir mejoras hasta que sea perfecto.' },
            { emoji: '🛡️', name: 'Guardrails y seguridad', desc: 'Poner límites a lo que puede hacer la IA', badge: 'NUEVA', detail: 'Asegurarse de que los agentes no hagan cosas peligrosas o incorrectas.' }
        ]
    },
    comunicacion: {
        title: 'Comunicación con IA',
        emoji: '💬',
        skills: [
            { emoji: '✍️', name: 'Prompt engineering', desc: 'Escribir instrucciones perfectas', badge: 'NUEVA', detail: 'El arte de hablar con la IA: cuanto mejor preguntes, mejor responde.' },
            { emoji: '🎭', name: 'Asignación de roles', desc: 'Dar personalidad y reglas a cada agente', badge: 'NUEVA', detail: 'Decirle a cada agente: eres un experto en X, responde siempre así.' },
            { emoji: '📊', name: 'Definición de criterios', desc: 'Explicar qué significa bueno y malo', badge: 'EVOLUCIONA DE Testing', detail: 'Crear reglas claras para evaluar si el resultado de la IA es bueno.' },
            { emoji: '🔍', name: 'Verificación de hechos', desc: 'Comprobar que la IA no inventa', badge: 'NUEVA', detail: 'Las IAs a veces inventan datos. Hay que saber detectar cuándo mienten.' },
            { emoji: '🌐', name: 'Contexto y memoria', desc: 'Gestionar lo que recuerda cada agente', badge: 'NUEVA', detail: 'Decidir qué información necesita cada agente y cómo la comparten.' }
        ]
    },
    gestion: {
        title: 'Gestión de Proyectos IA',
        emoji: '📋',
        skills: [
            { emoji: '💰', name: 'Gestión de costes IA', desc: 'Controlar cuánto gasta cada agente', badge: 'NUEVA', detail: 'Cada llamada a la IA cuesta dinero. Hay que optimizar para no gastar de más.' },
            { emoji: '⏱️', name: 'Planificación de sprints', desc: 'Organizar ciclos de trabajo con agentes', badge: 'SE MANTIENE', detail: 'Igual que antes, pero ahora planificas trabajo para humanos Y para agentes.' },
            { emoji: '📈', name: 'Métricas de calidad', desc: 'Medir si los agentes lo hacen bien', badge: 'EVOLUCIONA DE Testing', detail: 'Crear dashboards y métricas para saber si tus agentes mejoran o empeoran.' },
            { emoji: '🔗', name: 'Integración de herramientas', desc: 'Conectar agentes con apps reales', badge: 'EVOLUCIONA DE APIs', detail: 'Hacer que los agentes usen herramientas reales: email, bases de datos, webs.' },
            { emoji: '👥', name: 'Equipos humano-IA', desc: 'Coordinar personas y agentes juntos', badge: 'NUEVA', detail: 'El futuro es equipos mixtos: personas y agentes trabajando juntos.' }
        ]
    },
    humanas: {
        title: 'Habilidades Humanas',
        emoji: '❤️',
        skills: [
            { emoji: '🤔', name: 'Pensamiento crítico', desc: 'No fiarse ciegamente de la IA', badge: 'SE MANTIENE', detail: 'La IA es potente pero no perfecta. Siempre hay que revisar y pensar.' },
            { emoji: '🎨', name: 'Visión creativa', desc: 'Imaginar soluciones que la IA no ve', badge: 'SE MANTIENE', detail: 'La creatividad humana sigue siendo insustituible para las ideas originales.' },
            { emoji: '⚖️', name: 'Ética de la IA', desc: 'Asegurarse de que la IA sea justa', badge: 'NUEVA', detail: 'Que la IA no discrimine, no miente y respete a todas las personas.' },
            { emoji: '🗣️', name: 'Comunicación clara', desc: 'Explicar decisiones de la IA a no-técnicos', badge: 'SE MANTIENE', detail: 'Traducir lo que hace la IA a un idioma que todo el mundo entienda.' },
            { emoji: '🌱', name: 'Adaptabilidad', desc: 'La IA cambia cada semana', badge: 'SE MANTIENE', detail: 'Nuevos modelos, nuevas capacidades. Hay que aprender constantemente.' }
        ]
    }
};

// --- Debug Detective data ---
const DEBUG_ROUNDS = [
    {
        lines: [
            { text: 'let nombre = "Maria"', errors: [] },
            { text: 'let edadd = 12', errors: [{ start: 4, end: 9, fix: 'edad', type: 'typo: edadd -> edad' }] },
            { text: 'if (nombre = "Maria") {', errors: [{ start: 11, end: 12, fix: '==', type: 'deberia ser ==' }] },
            { text: '  console.log("Hola" nombre)', errors: [{ start: 20, end: 21, fix: '", ', type: 'falta coma' }] },
            { text: '}', errors: [] }
        ],
        errorCount: 3
    },
    {
        lines: [
            { text: 'function sumar(a, b) {', errors: [] },
            { text: '  let resultado = a - b', errors: [{ start: 20, end: 21, fix: '+', type: 'deberia ser +' }] },
            { text: '  retrun resultado', errors: [{ start: 2, end: 8, fix: 'return', type: 'typo: retrun -> return' }] },
            { text: '}', errors: [] },
            { text: 'console.log(sumar(5, 3)', errors: [{ start: 23, end: 23, fix: ')', type: 'falta )' }] }
        ],
        errorCount: 3
    },
    {
        lines: [
            { text: 'let frutas = ["manzana", "platano" "naranja"]', errors: [{ start: 33, end: 34, fix: '", ', type: 'falta coma' }] },
            { text: 'for (let i = 0; i <= frutas.lenght; i++) {', errors: [{ start: 18, end: 20, fix: '<', type: '<= deberia ser <' }, { start: 27, end: 33, fix: 'length', type: 'typo: lenght -> length' }] },
            { text: '  consolee.log(frutas[i])', errors: [{ start: 2, end: 10, fix: 'console', type: 'typo: consolee -> console' }] },
            { text: '}', errors: [] }
        ],
        errorCount: 4
    },
    {
        lines: [
            { text: 'funcion calcularArea(base, altura) {', errors: [{ start: 0, end: 7, fix: 'function', type: 'typo: funcion -> function' }] },
            { text: '  let area = base * altura / 3', errors: [{ start: 29, end: 30, fix: '2', type: 'deberia ser / 2' }] },
            { text: '  if (area >> 100) {', errors: [{ start: 10, end: 12, fix: '>', type: '>> deberia ser >' }] },
            { text: '    console.log("Area grande!")', errors: [] },
            { text: '  }', errors: [] },
            { text: '  return area', errors: [] },
            { text: '', errors: [{ start: 0, end: 0, fix: '}', type: 'falta } de cierre' }] }
        ],
        errorCount: 4
    },
    {
        lines: [
            { text: 'let puntos == 0', errors: [{ start: 11, end: 13, fix: '=', type: '== deberia ser =' }] },
            { text: 'const max_puntos = 100;', errors: [] },
            { text: 'while (puntos < max_puntos) [', errors: [{ start: 28, end: 29, fix: '{', type: '[ deberia ser {' }] },
            { text: '  puntos = puntos ++ 10', errors: [{ start: 18, end: 20, fix: '+', type: '++ deberia ser +' }] },
            { text: '  console.log("Puntos: " + puntoss)', errors: [{ start: 27, end: 34, fix: 'puntos', type: 'typo: puntoss -> puntos' }] },
            { text: '  if (puntos = max_puntos) {', errors: [{ start: 13, end: 14, fix: '===', type: '= deberia ser ===' }] },
            { text: '    console.log("Ganaste!")', errors: [] },
            { text: '  }', errors: [] },
            { text: '}', errors: [] }
        ],
        errorCount: 5
    }
];

// --- Algorithm builder data ---
const ALGORITHM_ROUNDS = [
    {
        goal: 'Haz un sandwich',
        emoji: '🥪',
        blocks: ['Poner jamon', 'Cortar pan', 'Poner pan arriba', 'Coger plato', 'Poner queso'],
        correct: ['Coger plato', 'Cortar pan', 'Poner jamon', 'Poner queso', 'Poner pan arriba']
    },
    {
        goal: 'Ordena de menor a mayor: 8, 3, 5, 1',
        emoji: '🔢',
        blocks: ['Comparar 3 y 5', 'Comparar 8 y 3', 'Resultado: 1,3,5,8', 'Comparar 1 y 3', 'Intercambiar 8 y 3'],
        correct: ['Comparar 8 y 3', 'Intercambiar 8 y 3', 'Comparar 1 y 3', 'Comparar 3 y 5', 'Resultado: 1,3,5,8']
    },
    {
        goal: 'Encuentra el número más grande en: 4, 9, 2, 7',
        emoji: '🔎',
        blocks: ['Si siguiente > máximo, actualizar', 'Empezar con máximo = 4', 'Comprobar 9', 'Comprobar 2', 'Comprobar 7', 'El máximo es 9'],
        correct: ['Empezar con máximo = 4', 'Comprobar 9', 'Si siguiente > máximo, actualizar', 'Comprobar 2', 'Comprobar 7', 'El máximo es 9']
    },
    {
        goal: 'Dibuja un cuadrado',
        emoji: '⬜',
        blocks: ['Girar 90 grados', 'Avanzar 100 pixels', 'Repetir 4 veces', 'Empezar en centro', 'Bajar el lápiz'],
        correct: ['Empezar en centro', 'Bajar el lápiz', 'Repetir 4 veces', 'Avanzar 100 pixels', 'Girar 90 grados']
    }
];

// --- Prompt Master data ---
const PROMPT_LEVELS = [
    {
        desc: 'Un círculo rojo grande en el centro',
        target: [{ shape: 'circle', color: '#e74c3c', size: 'grande', x: 0.5, y: 0.5 }]
    },
    {
        desc: 'Un cuadrado azul con un círculo amarillo dentro',
        target: [
            { shape: 'square', color: '#3498db', size: 'grande', x: 0.5, y: 0.5 },
            { shape: 'circle', color: '#f1c40f', size: 'mediano', x: 0.5, y: 0.5 }
        ]
    },
    {
        desc: 'Tres estrellas verdes arriba y un triángulo naranja abajo',
        target: [
            { shape: 'star', color: '#2ecc71', size: 'pequeno', x: 0.25, y: 0.25 },
            { shape: 'star', color: '#2ecc71', size: 'pequeno', x: 0.5, y: 0.25 },
            { shape: 'star', color: '#2ecc71', size: 'pequeno', x: 0.75, y: 0.25 },
            { shape: 'triangle', color: '#e67e22', size: 'mediano', x: 0.5, y: 0.75 }
        ]
    },
    {
        desc: 'Un rectángulo azul grande en el centro con dos círculos rojos pequeños a los lados',
        target: [
            { shape: 'rectangle', color: '#3498db', size: 'grande', x: 0.5, y: 0.5 },
            { shape: 'circle', color: '#e74c3c', size: 'pequeno', x: 0.15, y: 0.5 },
            { shape: 'circle', color: '#e74c3c', size: 'pequeno', x: 0.85, y: 0.5 }
        ]
    },
    {
        desc: 'Cuatro cuadrados de colores en las esquinas y una estrella dorada grande en el centro',
        target: [
            { shape: 'square', color: '#e74c3c', size: 'pequeno', x: 0.15, y: 0.15 },
            { shape: 'square', color: '#3498db', size: 'pequeno', x: 0.85, y: 0.15 },
            { shape: 'square', color: '#2ecc71', size: 'pequeno', x: 0.15, y: 0.85 },
            { shape: 'square', color: '#f1c40f', size: 'pequeno', x: 0.85, y: 0.85 },
            { shape: 'star', color: '#f39c12', size: 'grande', x: 0.5, y: 0.5 }
        ]
    }
];

// --- Director de Agentes missions ---
const AGENT_MISSIONS = [
    {
        title: 'Fiesta de cumpleaños',
        emoji: '🎂',
        desc: 'Organiza la mejor fiesta de cumpleaños para tu mejor amigo/a.',
        tutorial: true,
        tasks: [
            { text: 'Hacer lista de 20 invitados', agent: 'analista', keywords: ['lista', 'nombres', 'cuantos', 'contar', 'numero'] },
            { text: 'Diseñar las invitaciones', agent: 'creativo', keywords: ['diseno', 'bonito', 'colores', 'dibujar', 'crear'] },
            { text: 'Escribir el mensaje de invitación', agent: 'escritor', keywords: ['texto', 'escribir', 'mensaje', 'redactar', 'carta'] },
            { text: 'Buscar sitios para celebrar', agent: 'investigador', keywords: ['buscar', 'encontrar', 'opciones', 'investigar', 'sitio'] },
            { text: 'Calcular el presupuesto', agent: 'analista', keywords: ['precio', 'coste', 'dinero', 'calcular', 'presupuesto'] }
        ]
    },
    {
        title: 'App para el colegio',
        emoji: '📱',
        desc: 'Crea una app increíble para que todos los alumnos la usen.',
        tasks: [
            { text: 'Investigar qué apps usan otros colegios', agent: 'investigador', keywords: ['buscar', 'investigar', 'comparar', 'otros'] },
            { text: 'Diseñar las pantallas de la app', agent: 'creativo', keywords: ['diseno', 'pantallas', 'interfaz', 'visual'] },
            { text: 'Escribir instrucciones para alumnos', agent: 'escritor', keywords: ['escribir', 'explicar', 'guia', 'instrucciones'] },
            { text: 'Calcular cuántos alumnos la usarán', agent: 'analista', keywords: ['calcular', 'numero', 'cuantos', 'estadistica'] },
            { text: 'Crear el logo de la app', agent: 'creativo', keywords: ['logo', 'disenar', 'imagen', 'marca', 'crear'] }
        ]
    },
    {
        title: 'Negocio de limonada',
        emoji: '🍋',
        desc: 'Monta el mejor puesto de limonada del barrio.',
        tasks: [
            { text: 'Buscar las mejores recetas de limonada', agent: 'investigador', keywords: ['buscar', 'receta', 'investigar', 'encontrar'] },
            { text: 'Calcular costes y precio de venta', agent: 'analista', keywords: ['calcular', 'precio', 'coste', 'dinero', 'beneficio'] },
            { text: 'Diseñar el puesto y los vasos', agent: 'creativo', keywords: ['disenar', 'decorar', 'puesto', 'bonito'] },
            { text: 'Escribir los carteles publicitarios', agent: 'escritor', keywords: ['escribir', 'cartel', 'publicidad', 'eslogan'] },
            { text: 'Investigar dónde hay más gente', agent: 'investigador', keywords: ['investigar', 'buscar', 'lugar', 'gente', 'donde'] },
            { text: 'Hacer plan de gastos e ingresos', agent: 'analista', keywords: ['plan', 'gastos', 'ingresos', 'calcular', 'dinero'] }
        ]
    },
    {
        title: 'Viaje familiar',
        emoji: '✈️',
        desc: 'Planifica unas vacaciones perfectas para toda la familia.',
        tasks: [
            { text: 'Buscar destinos para familias', agent: 'investigador', keywords: ['buscar', 'destino', 'investigar', 'opciones'] },
            { text: 'Comparar precios de vuelos y hotel', agent: 'analista', keywords: ['comparar', 'precio', 'calcular', 'coste'] },
            { text: 'Diseñar el itinerario día a día', agent: 'creativo', keywords: ['disenar', 'itinerario', 'plan', 'organizar', 'dia'] },
            { text: 'Escribir email al hotel para reservar', agent: 'escritor', keywords: ['escribir', 'email', 'carta', 'reservar', 'mensaje'] },
            { text: 'Calcular presupuesto total', agent: 'analista', keywords: ['calcular', 'presupuesto', 'total', 'dinero', 'suma'] },
            { text: 'Buscar actividades para niños', agent: 'investigador', keywords: ['buscar', 'actividades', 'ninos', 'encontrar'] }
        ]
    },
    {
        title: 'Campaña salvar el parque',
        emoji: '🌳',
        desc: 'El parque de tu barrio está en peligro. Organizad una campaña para salvarlo.',
        tasks: [
            { text: 'Investigar la historia del parque', agent: 'investigador', keywords: ['investigar', 'historia', 'buscar', 'informacion'] },
            { text: 'Diseñar carteles de campaña', agent: 'creativo', keywords: ['disenar', 'carteles', 'imagen', 'visual', 'crear'] },
            { text: 'Escribir carta al alcalde', agent: 'escritor', keywords: ['escribir', 'carta', 'redactar', 'alcalde', 'formal'] },
            { text: 'Calcular firmas necesarias', agent: 'analista', keywords: ['calcular', 'firmas', 'numero', 'cuantas', 'necesario'] },
            { text: 'Buscar leyes de protección', agent: 'investigador', keywords: ['buscar', 'leyes', 'proteccion', 'investigar', 'normas'] },
            { text: 'Redactar publicación para redes', agent: 'escritor', keywords: ['redactar', 'publicacion', 'redes', 'escribir', 'post'] }
        ]
    }
];

const AGENTS = [
    { id: 'investigador', emoji: '🔍', name: 'Investigador', color: '#3498db', desc: 'Busca información' },
    { id: 'escritor', emoji: '✍️', name: 'Escritor', color: '#2ecc71', desc: 'Redacta textos' },
    { id: 'creativo', emoji: '🎨', name: 'Creativo', color: '#9b59b6', desc: 'Diseña cosas' },
    { id: 'analista', emoji: '📊', name: 'Analista', color: '#e67e22', desc: 'Calcula números' }
];

// --- Evolution data ---
const EVOLUTION_MAP = [
    { from: 'Lenguajes de programación', to: 'Prompt Engineering', type: 'transforma', color: '#f1c40f' },
    { from: 'Testing', to: 'Métricas de calidad IA', type: 'transforma', color: '#f1c40f' },
    { from: 'Arquitectura', to: 'Diseño multi-agente', type: 'transforma', color: '#f1c40f' },
    { from: 'Debugging', to: 'Iteración de resultados', type: 'transforma', color: '#f1c40f' },
    { from: 'APIs', to: 'Integración de herramientas', type: 'transforma', color: '#f1c40f' },
    { from: 'Escribir código', to: null, type: 'desaparece', color: '#e74c3c' },
    { from: 'Memorizar sintaxis', to: null, type: 'desaparece', color: '#e74c3c' },
    { from: null, to: 'Orquestación de flujos', type: 'nueva', color: '#2ecc71' },
    { from: null, to: 'Ética de la IA', type: 'nueva', color: '#2ecc71' },
    { from: null, to: 'Evaluación de modelos', type: 'nueva', color: '#2ecc71' },
    { from: 'Pensamiento crítico', to: 'Pensamiento crítico', type: 'mantiene', color: '#3498db' },
    { from: 'Creatividad', to: 'Visión creativa', type: 'mantiene', color: '#3498db' },
    { from: 'Comunicación', to: 'Comunicación clara', type: 'mantiene', color: '#3498db' }
];

const TIMELINE_ENTRIES = [
    { year: 2000, text: 'Todo se escribía a mano', emoji: '⌨️' },
    { year: 2015, text: 'Autocompletado inteligente', emoji: '💡' },
    { year: 2020, text: 'Copilot sugiere código', emoji: '🤖' },
    { year: 2024, text: 'Agentes escriben programas enteros', emoji: '🧠' },
    { year: 2026, text: 'Orquestadores dirigen equipos de agentes', emoji: '🎯' },
    { year: 2030, text: '¿???', emoji: '🔮' }
];

// ==============================================================
// ENTRY POINT
// ==============================================================
function startProgramador(subtypeId) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    const canvas = document.getElementById('game-canvas');
    const container = document.getElementById('game-container');
    ui.style.pointerEvents = 'auto';

    switch (subtypeId) {
        case 'programador_skills': showSkillsTaxonomy(ui, controls, PROGRAMADOR_SKILLS, 'programador'); break;
        case 'orquestador_skills': showSkillsTaxonomy(ui, controls, ORQUESTADOR_SKILLS, 'orquestador'); break;
        case 'debug_detective': startDebugDetective(ui, controls, canvas, container); break;
        case 'algoritmo': startAlgoritmo(ui, controls, canvas, container); break;
        case 'prompt_master': startPromptMaster(ui, controls, canvas, container); break;
        case 'director_agentes': startDirectorAgentes(ui, controls, canvas, container); break;
        case 'evolucion': showEvolucion(ui, controls, canvas, container); break;
        case 'diseno_niveles': startDisenoNiveles(ui, controls, canvas, container); break;
    }
}

// ==============================================================
// SKILL TAXONOMY SCREENS
// ==============================================================
function showSkillsTaxonomy(ui, controls, data, type) {
    const isProgramador = type === 'programador';
    const primaryColor = isProgramador ? '#3498db' : '#9b59b6';
    const secondaryColor = isProgramador ? '#2c3e50' : '#2d1b69';
    const accentColor = isProgramador ? '#1abc9c' : '#f39c12';

    ui.innerHTML = '';
    controls.innerHTML = '';

    let html = `<div style="padding: 12px; overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch;">`;
    html += `<div style="text-align:center; margin-bottom: 16px;">
        <div style="font-size: 2.5rem;">${isProgramador ? '💻' : '🎯'}</div>
        <h2 style="color: ${primaryColor}; margin: 4px 0; font-size: 1.1rem;">${isProgramador ? 'Habilidades del Programador' : 'Habilidades del Orquestador'}</h2>
        <p style="color: #aaa; font-size: 0.75rem;">Toca una categoria para expandirla. Toca una tarjeta para ver mas.</p>
    </div>`;

    const categories = Object.keys(data);
    categories.forEach((catKey, catIdx) => {
        const cat = data[catKey];
        html += `
        <div class="prog-category" data-cat="${catIdx}" style="margin-bottom: 10px;">
            <div class="prog-cat-header" data-cat-toggle="${catIdx}" style="
                background: linear-gradient(135deg, ${secondaryColor}, ${primaryColor}22);
                border: 1px solid ${primaryColor}44;
                border-radius: 12px; padding: 12px 16px; cursor: pointer;
                display: flex; align-items: center; gap: 10px;
                transition: all 0.3s ease;">
                <span style="font-size: 1.5rem;">${cat.emoji}</span>
                <span style="flex:1; font-weight: bold; color: ${primaryColor}; font-size: 0.95rem;">${cat.title}</span>
                <span class="prog-cat-arrow" style="color: ${primaryColor}; transition: transform 0.3s;">▶</span>
            </div>
            <div class="prog-cat-body" data-cat-body="${catIdx}" style="
                display: none; padding: 8px 0;
                display: none; flex-direction: column; gap: 8px;">`;

        cat.skills.forEach((skill, sIdx) => {
            const badgeHtml = skill.badge ? `<span style="
                display: inline-block; font-size: 0.6rem; padding: 2px 6px; border-radius: 8px; font-weight: bold; margin-left: 6px;
                background: ${skill.badge === 'NUEVA' ? '#2ecc71' : skill.badge === 'SE MANTIENE' ? '#3498db' : '#f39c12'};
                color: #fff;">${skill.badge}</span>` : '';

            html += `
            <div class="prog-skill-card" data-skill="${catIdx}-${sIdx}" style="
                background: ${isProgramador ? 'rgba(44,62,80,0.7)' : 'rgba(45,27,105,0.7)'};
                border: 1px solid ${primaryColor}33; border-radius: 10px; padding: 10px 12px;
                cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.3rem;">${skill.emoji}</span>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: bold; font-size: 0.85rem; color: #eee;">${skill.name}${badgeHtml}</div>
                        <div style="font-size: 0.72rem; color: #aaa; margin-top: 2px;">${skill.desc}</div>
                    </div>
                </div>
                <div class="prog-skill-detail" data-detail="${catIdx}-${sIdx}" style="
                    max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.3s ease;
                    font-size: 0.78rem; color: ${accentColor}; padding: 0 4px;">
                    ${skill.detail}
                </div>
            </div>`;
        });

        html += `</div></div>`;
    });

    html += `</div>`;
    controls.innerHTML = html;

    // Event delegation
    const listeners = [];
    function addListener(el, evt, fn) {
        el.addEventListener(evt, fn);
        listeners.push({ el, evt, fn });
    }

    addListener(controls, 'click', (e) => {
        // Category toggle
        const catToggle = e.target.closest('[data-cat-toggle]');
        if (catToggle) {
            const idx = catToggle.dataset.catToggle;
            const body = controls.querySelector(`[data-cat-body="${idx}"]`);
            const arrow = catToggle.querySelector('.prog-cat-arrow');
            if (body.style.display === 'none' || body.style.display === '') {
                body.style.display = 'flex';
                arrow.style.transform = 'rotate(90deg)';
            } else {
                body.style.display = 'none';
                arrow.style.transform = 'rotate(0deg)';
            }
            return;
        }
        // Skill card toggle
        const skillCard = e.target.closest('.prog-skill-card');
        if (skillCard) {
            const key = skillCard.dataset.skill;
            const detail = skillCard.querySelector('.prog-skill-detail');
            if (detail.style.maxHeight === '0px' || detail.style.maxHeight === '') {
                detail.style.maxHeight = '100px';
                detail.style.paddingTop = '8px';
                skillCard.style.borderColor = primaryColor;
            } else {
                detail.style.maxHeight = '0px';
                detail.style.paddingTop = '0';
                skillCard.style.borderColor = primaryColor + '33';
            }
        }
    });

    currentGame = {
        cleanup: () => {
            listeners.forEach(l => l.el.removeEventListener(l.evt, l.fn));
            ui.innerHTML = '';
            controls.innerHTML = '';
            ui.style.pointerEvents = '';
        }
    };
}

// ==============================================================
// MINIGAME 1: DEBUG DETECTIVE
// ==============================================================
function startDebugDetective(ui, controls, canvas, container) {
    canvas.style.display = 'block';
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    canvas.width = cw * 2;
    canvas.height = ch * 2;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);

    let round = 0;
    let foundErrors = [];
    let wrongClicks = 0;
    let timerStart = Date.now();
    let timerPenalty = 0;
    let flashWrong = null;
    let totalFound = 0;
    let totalErrors = 0;
    let cursorLine = 0;
    let cursorToken = 0;
    let animFrame = null;

    // Token-based layout
    const FONT_SIZE = Math.max(11, Math.min(14, cw / 30));
    const LINE_H = FONT_SIZE * 2.2;
    const PAD_LEFT = 40;
    const PAD_TOP = 60;

    // Parse tokens per line for the current round
    function getTokens(roundData) {
        return roundData.lines.map((line, li) => {
            const tokens = [];
            if (line.text === '') {
                tokens.push({ text: '(linea vacia)', start: 0, end: 0, isError: line.errors.length > 0, error: line.errors[0] || null, found: false });
                return tokens;
            }
            // Split into meaningful chunks
            const parts = line.text.match(/\S+|\s+/g) || [line.text];
            let pos = 0;
            parts.forEach(part => {
                if (part.trim() === '') { pos += part.length; return; }
                const tStart = pos;
                const tEnd = pos + part.length;
                let isError = false;
                let error = null;
                for (const err of line.errors) {
                    if (tStart <= err.start && tEnd >= err.end) {
                        isError = true;
                        error = err;
                        break;
                    }
                    if (err.start >= tStart && err.start < tEnd) {
                        isError = true;
                        error = err;
                        break;
                    }
                }
                tokens.push({ text: part, start: tStart, end: tEnd, isError, error, found: false });
                pos += part.length;
            });
            return tokens;
        });
    }

    let tokensGrid = [];
    let foundSet = new Set();

    function setupRound() {
        if (round >= DEBUG_ROUNDS.length) {
            const elapsed = ((Date.now() - timerStart) / 1000 + timerPenalty).toFixed(1);
            const accuracy = totalErrors > 0 ? Math.round((totalFound / totalErrors) * 100) : 100;
            const timeBonus = Math.max(0, 300 - Math.floor((Date.now() - timerStart) / 1000) * 2);
            const finalScore = score + timeBonus;
            setScore(finalScore);
            cancelAnimationFrame(animFrame);
            showResult(
                '🔍 Debug Detective',
                finalScore + ' pts',
                `Encontraste ${totalFound}/${totalErrors} errores en ${elapsed}s`,
                () => { round = 0; foundErrors = []; wrongClicks = 0; timerStart = Date.now(); timerPenalty = 0; totalFound = 0; totalErrors = 0; setScore(0); setupRound(); }
            );
            return;
        }

        const rd = DEBUG_ROUNDS[round];
        totalErrors += rd.errorCount;
        tokensGrid = getTokens(rd);
        foundSet = new Set();
        cursorLine = 0;
        cursorToken = 0;
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, cw, ch);

        // Background
        ctx.fillStyle = '#1e1e2e';
        ctx.fillRect(0, 0, cw, ch);

        // Header
        ctx.fillStyle = '#cdd6f4';
        ctx.font = `bold ${FONT_SIZE + 2}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(`Ronda ${round + 1}/${DEBUG_ROUNDS.length} - Encuentra los ${DEBUG_ROUNDS[round] ? DEBUG_ROUNDS[round].errorCount : 0} errores`, cw / 2, 20);

        // Timer
        const elapsed = ((Date.now() - timerStart) / 1000).toFixed(1);
        ctx.font = `${FONT_SIZE - 1}px monospace`;
        ctx.fillStyle = '#89b4fa';
        ctx.textAlign = 'right';
        ctx.fillText(`Tiempo: ${elapsed}s`, cw - 10, 20);

        ctx.textAlign = 'left';

        // Score
        ctx.fillStyle = '#a6e3a1';
        ctx.textAlign = 'left';
        ctx.fillText(`${score} pts`, 10, 20);
        ctx.textAlign = 'left';

        // Draw code lines
        if (round < DEBUG_ROUNDS.length) {
            const rd = DEBUG_ROUNDS[round];
            tokensGrid.forEach((tokens, li) => {
                const y = PAD_TOP + li * LINE_H;

                // Line number
                ctx.fillStyle = '#585b70';
                ctx.font = `${FONT_SIZE - 1}px monospace`;
                ctx.fillText(`${li + 1}`, 8, y + FONT_SIZE);

                // Draw tokens
                let x = PAD_LEFT;
                ctx.font = `${FONT_SIZE}px monospace`;
                tokens.forEach((tok, ti) => {
                    const tw = ctx.measureText(tok.text).width;
                    const isHighlighted = (li === cursorLine && ti === cursorToken);

                    // Cursor highlight
                    if (isHighlighted) {
                        ctx.fillStyle = 'rgba(137, 180, 250, 0.15)';
                        ctx.fillRect(x - 2, y - 2, tw + 4, LINE_H - 4);
                        ctx.strokeStyle = '#89b4fa';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(x - 2, y - 2, tw + 4, LINE_H - 4);
                    }

                    // Error flash red
                    if (flashWrong && flashWrong.li === li && flashWrong.ti === ti) {
                        ctx.fillStyle = 'rgba(243, 139, 168, 0.3)';
                        ctx.fillRect(x - 2, y - 2, tw + 4, LINE_H - 4);
                    }

                    // Found: green bg
                    if (tok.found) {
                        ctx.fillStyle = 'rgba(166, 227, 161, 0.2)';
                        ctx.fillRect(x - 2, y - 2, tw + 4, LINE_H - 4);
                        ctx.fillStyle = '#a6e3a1';
                        ctx.fillText(tok.text, x, y + FONT_SIZE);
                        // Checkmark
                        ctx.fillText(' ✓', x + tw, y + FONT_SIZE);
                    } else if (tok.isError) {
                        // Normal text color (errors look normal until found)
                        ctx.fillStyle = '#cdd6f4';
                        ctx.fillText(tok.text, x, y + FONT_SIZE);
                    } else {
                        ctx.fillStyle = '#cdd6f4';
                        ctx.fillText(tok.text, x, y + FONT_SIZE);
                    }

                    x += tw + ctx.measureText(' ').width;
                });
            });
        }

        // Instructions
        ctx.fillStyle = '#585b70';
        ctx.font = `${Math.max(9, FONT_SIZE - 3)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('Toca los errores o usa flechas + Enter', cw / 2, ch - 10);
        ctx.textAlign = 'left';

        animFrame = requestAnimationFrame(draw);
    }

    function selectToken(li, ti) {
        if (round >= DEBUG_ROUNDS.length) return;
        const tokens = tokensGrid[li];
        if (!tokens || !tokens[ti]) return;
        const tok = tokens[ti];

        if (tok.isError && !tok.found) {
            tok.found = true;
            foundSet.add(`${li}-${ti}`);
            totalFound++;
            addScore(20);

            // Check round complete
            let allFound = true;
            tokensGrid.forEach(lineTokens => {
                lineTokens.forEach(t => {
                    if (t.isError && !t.found) allFound = false;
                });
            });
            if (allFound) {
                addScore(10); // Bonus
                setTimeout(() => { round++; setupRound(); }, 800);
            }
        } else if (!tok.isError) {
            wrongClicks++;
            timerPenalty += 5;
            flashWrong = { li, ti };
            setTimeout(() => { flashWrong = null; }, 400);
        }
    }

    // Touch / click
    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const cx = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0) - rect.left;
        const cy = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || 0) - rect.top;

        // Find which token
        ctx.font = `${FONT_SIZE}px monospace`;
        for (let li = 0; li < tokensGrid.length; li++) {
            const y = PAD_TOP + li * LINE_H;
            if (cy < y - 2 || cy > y + LINE_H - 2) continue;
            let x = PAD_LEFT;
            for (let ti = 0; ti < tokensGrid[li].length; ti++) {
                const tw = ctx.measureText(tokensGrid[li][ti].text).width + ctx.measureText(' ').width;
                if (cx >= x - 2 && cx <= x + tw + 2) {
                    cursorLine = li;
                    cursorToken = ti;
                    selectToken(li, ti);
                    return;
                }
                x += tw;
            }
        }
    }

    function handleKey(e) {
        if (round >= DEBUG_ROUNDS.length) return;
        const maxLine = tokensGrid.length - 1;
        switch (e.key) {
            case 'ArrowUp':
                cursorLine = Math.max(0, cursorLine - 1);
                cursorToken = Math.min(cursorToken, (tokensGrid[cursorLine] || []).length - 1);
                e.preventDefault();
                break;
            case 'ArrowDown':
                cursorLine = Math.min(maxLine, cursorLine + 1);
                cursorToken = Math.min(cursorToken, (tokensGrid[cursorLine] || []).length - 1);
                e.preventDefault();
                break;
            case 'ArrowLeft':
                cursorToken = Math.max(0, cursorToken - 1);
                e.preventDefault();
                break;
            case 'ArrowRight':
                cursorToken = Math.min((tokensGrid[cursorLine] || []).length - 1, cursorToken + 1);
                e.preventDefault();
                break;
            case 'Enter':
            case ' ':
                selectToken(cursorLine, cursorToken);
                e.preventDefault();
                break;
        }
    }

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleClick(e); }, { passive: false });
    document.addEventListener('keydown', handleKey);

    setupRound();

    currentGame = {
        cleanup: () => {
            cancelAnimationFrame(animFrame);
            canvas.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKey);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            controls.innerHTML = '';
            ui.style.pointerEvents = '';
        }
    };
}

// ==============================================================
// MINIGAME 2: BUILD THE ALGORITHM
// ==============================================================
function startAlgoritmo(ui, controls, canvas, container) {
    canvas.style.display = 'block';
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    canvas.width = cw * 2;
    canvas.height = ch * 2;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);

    let round = 0;
    let playerOrder = [];
    let animFrame = null;
    let selectedBlock = -1;
    let blockRects = [];
    let slotRects = [];
    let executing = false;
    let execStep = -1;
    let execTimer = null;

    const BLOCK_H = Math.max(32, Math.min(40, ch / 16));
    const BLOCK_PAD = 6;
    const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];

    function setupRound() {
        if (round >= ALGORITHM_ROUNDS.length) {
            const finalScore = score;
            cancelAnimationFrame(animFrame);
            showResult(
                '🧩 Construye el Algoritmo',
                finalScore + ' pts',
                finalScore >= 300 ? 'Eres un genio de los algoritmos!' : finalScore >= 150 ? 'Muy buen trabajo!' : 'Sigue practicando!',
                () => { round = 0; setScore(0); setupRound(); }
            );
            return;
        }

        const rd = ALGORITHM_ROUNDS[round];
        playerOrder = [];
        selectedBlock = -1;
        executing = false;
        execStep = -1;

        // Show goal and controls
        controls.innerHTML = `
            <div style="text-align: center; padding: 8px;">
                <button id="algo-ejecutar" class="control-btn" style="padding: 10px 30px; font-size: 1rem; background: linear-gradient(135deg, #2ecc71, #27ae60); border: none; color: #fff; border-radius: 12px; cursor: pointer;">
                    ▶ Ejecutar
                </button>
                <button id="algo-reset" class="control-btn" style="padding: 10px 20px; font-size: 0.85rem; background: rgba(255,255,255,0.1); border: none; color: #aaa; border-radius: 12px; cursor: pointer; margin-left: 8px;">
                    ↺ Reiniciar
                </button>
            </div>`;

        document.getElementById('algo-ejecutar').onclick = executeAlgorithm;
        document.getElementById('algo-reset').onclick = () => { playerOrder = []; selectedBlock = -1; };

        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, cw, ch);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, cw, ch);

        if (round >= ALGORITHM_ROUNDS.length) return;
        const rd = ALGORITHM_ROUNDS[round];

        // Header
        ctx.fillStyle = '#f1c40f';
        ctx.font = `bold ${Math.min(15, cw / 24)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`Ronda ${round + 1}/${ALGORITHM_ROUNDS.length}`, cw / 2, 18);

        // Goal
        ctx.fillStyle = '#eee';
        ctx.font = `bold ${Math.min(14, cw / 26)}px sans-serif`;
        ctx.fillText(`${rd.emoji} Objetivo: ${rd.goal}`, cw / 2, 40);

        ctx.textAlign = 'left';

        // Available blocks (not yet placed)
        const availBlocks = rd.blocks.filter(b => !playerOrder.includes(b));
        const slotStartY = 58;
        const blockStartY = slotStartY + (rd.correct.length + 1) * (BLOCK_H + BLOCK_PAD) + 16;

        // Slots (numbered)
        ctx.fillStyle = '#888';
        ctx.font = `bold ${Math.min(12, cw / 32)}px sans-serif`;
        ctx.fillText('Tu secuencia:', 10, slotStartY);
        slotRects = [];
        for (let i = 0; i < rd.correct.length; i++) {
            const y = slotStartY + 14 + i * (BLOCK_H + BLOCK_PAD);
            const bw = cw - 50;

            // Slot background
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.strokeStyle = executing && execStep === i ? '#f1c40f' : 'rgba(255,255,255,0.15)';
            ctx.lineWidth = executing && execStep === i ? 2 : 1;
            roundRect(ctx, 36, y, bw, BLOCK_H, 8);
            ctx.fill();
            ctx.stroke();

            // Number
            ctx.fillStyle = '#667';
            ctx.font = `bold ${Math.min(13, cw / 28)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(`${i + 1}`, 20, y + BLOCK_H / 2 + 5);
            ctx.textAlign = 'left';

            slotRects.push({ x: 36, y, w: bw, h: BLOCK_H, idx: i });

            if (playerOrder[i]) {
                const ci = rd.blocks.indexOf(playerOrder[i]) % COLORS.length;
                ctx.fillStyle = COLORS[ci] + 'cc';
                roundRect(ctx, 38, y + 2, bw - 4, BLOCK_H - 4, 6);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = `${Math.min(12, cw / 30)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(playerOrder[i], 36 + bw / 2, y + BLOCK_H / 2 + 4);
                ctx.textAlign = 'left';
            }
        }

        // Available blocks label
        ctx.fillStyle = '#888';
        ctx.font = `bold ${Math.min(12, cw / 32)}px sans-serif`;
        ctx.fillText('Bloques disponibles:', 10, blockStartY);

        blockRects = [];
        availBlocks.forEach((block, i) => {
            const y = blockStartY + 14 + i * (BLOCK_H + BLOCK_PAD);
            const bw = cw - 20;
            const ci = rd.blocks.indexOf(block) % COLORS.length;
            const isSelected = selectedBlock === rd.blocks.indexOf(block);

            ctx.fillStyle = isSelected ? COLORS[ci] : COLORS[ci] + '99';
            roundRect(ctx, 10, y, bw, BLOCK_H, 8);
            ctx.fill();

            if (isSelected) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                roundRect(ctx, 10, y, bw, BLOCK_H, 8);
                ctx.stroke();
            }

            ctx.fillStyle = '#fff';
            ctx.font = `${Math.min(12, cw / 30)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(block, 10 + bw / 2, y + BLOCK_H / 2 + 4);
            ctx.textAlign = 'left';

            blockRects.push({ x: 10, y, w: bw, h: BLOCK_H, blockIdx: rd.blocks.indexOf(block), text: block });
        });

        // Executing animation glow
        if (executing && execStep >= 0) {
            ctx.fillStyle = '#f1c40f';
            ctx.font = `bold ${Math.min(13, cw / 28)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('▶ Ejecutando paso ' + (execStep + 1) + '...', cw / 2, ch - 10);
            ctx.textAlign = 'left';
        }

        animFrame = requestAnimationFrame(draw);
    }

    function handleClick(e) {
        if (executing) return;
        const rect = canvas.getBoundingClientRect();
        const cx = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0) - rect.left;
        const cy = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || 0) - rect.top;
        const rd = ALGORITHM_ROUNDS[round];
        if (!rd) return;

        // Check available blocks
        for (const br of blockRects) {
            if (cx >= br.x && cx <= br.x + br.w && cy >= br.y && cy <= br.y + br.h) {
                if (selectedBlock === br.blockIdx) {
                    // Double tap = add to next empty slot
                    const nextSlot = playerOrder.length;
                    if (nextSlot < rd.correct.length) {
                        playerOrder.push(br.text);
                        selectedBlock = -1;
                    }
                } else {
                    selectedBlock = br.blockIdx;
                }
                return;
            }
        }

        // Check slots - if block selected, place it; if slot has block, remove it
        for (const sr of slotRects) {
            if (cx >= sr.x && cx <= sr.x + sr.w && cy >= sr.y && cy <= sr.y + sr.h) {
                if (selectedBlock >= 0) {
                    const blockText = rd.blocks[selectedBlock];
                    if (!playerOrder.includes(blockText) && playerOrder.length <= sr.idx) {
                        // Fill up to this slot
                        while (playerOrder.length < sr.idx) playerOrder.push(null);
                        if (playerOrder.length === sr.idx) {
                            playerOrder.push(blockText);
                        }
                    } else if (playerOrder[sr.idx] === undefined || playerOrder[sr.idx] === null) {
                        playerOrder[sr.idx] = blockText;
                    }
                    selectedBlock = -1;
                } else if (playerOrder[sr.idx]) {
                    // Remove from slot
                    playerOrder.splice(sr.idx, 1);
                }
                return;
            }
        }

        selectedBlock = -1;
    }

    function executeAlgorithm() {
        if (executing) return;
        const rd = ALGORITHM_ROUNDS[round];
        if (playerOrder.length < rd.correct.length) return;

        executing = true;
        execStep = 0;

        let correctCount = 0;
        for (let i = 0; i < rd.correct.length; i++) {
            if (playerOrder[i] === rd.correct[i]) correctCount++;
        }

        const stepInterval = setInterval(() => {
            execStep++;
            if (execStep >= rd.correct.length) {
                clearInterval(stepInterval);
                const pts = Math.round((correctCount / rd.correct.length) * 100);
                addScore(pts);

                setTimeout(() => {
                    executing = false;
                    round++;
                    setupRound();
                }, 1000);
            }
        }, 600);
    }

    function handleKey(e) {
        if (executing || round >= ALGORITHM_ROUNDS.length) return;
        const rd = ALGORITHM_ROUNDS[round];
        const availBlocks = rd.blocks.filter(b => !playerOrder.includes(b));

        switch (e.key) {
            case 'Enter':
            case ' ':
                if (selectedBlock >= 0) {
                    const blockText = rd.blocks[selectedBlock];
                    if (!playerOrder.includes(blockText) && playerOrder.length < rd.correct.length) {
                        playerOrder.push(blockText);
                        selectedBlock = -1;
                    }
                }
                e.preventDefault();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                if (availBlocks.length > 0) {
                    const curIdx = availBlocks.findIndex(b => rd.blocks.indexOf(b) === selectedBlock);
                    const newIdx = curIdx <= 0 ? availBlocks.length - 1 : curIdx - 1;
                    selectedBlock = rd.blocks.indexOf(availBlocks[newIdx]);
                }
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                if (availBlocks.length > 0) {
                    const curIdx = availBlocks.findIndex(b => rd.blocks.indexOf(b) === selectedBlock);
                    const newIdx = curIdx >= availBlocks.length - 1 ? 0 : curIdx + 1;
                    selectedBlock = rd.blocks.indexOf(availBlocks[newIdx]);
                }
                e.preventDefault();
                break;
            case 'Backspace':
            case 'Delete':
                if (playerOrder.length > 0) playerOrder.pop();
                e.preventDefault();
                break;
        }
    }

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleClick(e); }, { passive: false });
    document.addEventListener('keydown', handleKey);

    setupRound();

    currentGame = {
        cleanup: () => {
            cancelAnimationFrame(animFrame);
            canvas.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKey);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            controls.innerHTML = '';
            ui.style.pointerEvents = '';
        }
    };
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ==============================================================
// MINIGAME 3: PROMPT MASTER
// ==============================================================
function startPromptMaster(ui, controls, canvas, container) {
    canvas.style.display = 'block';
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    canvas.width = cw * 2;
    canvas.height = ch * 2;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);

    let level = 0;
    let animFrame = null;
    let aiShapes = [];
    let matchPercent = 0;
    let bestScores = [0, 0, 0, 0, 0];

    const HALF = Math.floor(cw / 2);
    const DRAW_AREA_Y = 40;
    const DRAW_AREA_H = ch - 90;

    const COLOR_MAP = {
        rojo: '#e74c3c', azul: '#3498db', verde: '#2ecc71', amarillo: '#f1c40f',
        naranja: '#e67e22', morado: '#9b59b6', rosa: '#e84393', negro: '#2c3e50',
        blanco: '#ecf0f1', dorado: '#f39c12', dorada: '#f39c12'
    };

    const SIZE_MAP = { grande: 0.35, mediano: 0.22, pequeno: 0.13, pequenos: 0.13, grandes: 0.35 };

    function setupLevel() {
        if (level >= PROMPT_LEVELS.length) {
            cancelAnimationFrame(animFrame);
            const total = bestScores.reduce((a, b) => a + b, 0);
            showResult(
                '✍️ Prompt Master',
                total + ' pts',
                total >= 400 ? 'Dominas el arte de hablar con la IA!' : total >= 200 ? 'Buen trabajo con los prompts!' : 'Sigue practicando!',
                () => { level = 0; bestScores = [0, 0, 0, 0, 0]; setScore(0); setupLevel(); }
            );
            return;
        }

        aiShapes = [];
        matchPercent = 0;

        controls.innerHTML = `
            <div style="padding: 8px; display: flex; flex-direction: column; gap: 6px;">
                <div style="text-align: center; font-size: 0.78rem; color: #f1c40f;">
                    Nivel ${level + 1}/${PROMPT_LEVELS.length}: Describe la imagen de la izquierda
                </div>
                <div style="display: flex; gap: 6px;">
                    <input id="prompt-input" type="text" placeholder="Escribe tu prompt aqui..." style="
                        flex: 1; padding: 10px 14px; border-radius: 12px; border: 1px solid #555;
                        background: #1a1a2e; color: #eee; font-size: 0.9rem; outline: none;">
                    <button id="prompt-send" class="control-btn" style="padding: 10px 16px; background: linear-gradient(135deg, #9b59b6, #8e44ad); border: none; color: #fff; border-radius: 12px; cursor: pointer; font-size: 1rem;">
                        ▶
                    </button>
                </div>
                <div id="prompt-feedback" style="text-align: center; font-size: 0.75rem; color: #aaa; min-height: 18px;"></div>
                <div style="text-align: center;">
                    <button id="prompt-next" class="control-btn" style="display: none; padding: 8px 24px; background: linear-gradient(135deg, #2ecc71, #27ae60); border: none; color: #fff; border-radius: 12px; cursor: pointer;">
                        Siguiente ▶
                    </button>
                </div>
            </div>`;

        const input = document.getElementById('prompt-input');
        const sendBtn = document.getElementById('prompt-send');
        const nextBtn = document.getElementById('prompt-next');

        sendBtn.onclick = () => processPrompt(input.value);
        input.onkeydown = (e) => { if (e.key === 'Enter') processPrompt(input.value); };
        nextBtn.onclick = () => { level++; setupLevel(); };
        input.focus();

        draw();
    }

    function parsePrompt(text) {
        const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const shapes = [];

        // Detect quantities
        const quantityWords = { un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5 };

        // Split into segments by 'y', 'con'
        const segments = lower.split(/\s+y\s+|\s+con\s+/);

        segments.forEach(seg => {
            let quantity = 1;
            let color = '#888';
            let shape = null;
            let size = 'mediano';
            let position = { x: 0.5, y: 0.5 };

            const words = seg.trim().split(/\s+/);

            // Parse quantity
            for (const w of words) {
                if (quantityWords[w] !== undefined) { quantity = quantityWords[w]; break; }
            }

            // Parse color
            for (const w of words) {
                if (COLOR_MAP[w]) { color = COLOR_MAP[w]; break; }
            }

            // Parse shape
            const shapeMap = {
                circulo: 'circle', circulos: 'circle',
                cuadrado: 'square', cuadrados: 'square',
                triangulo: 'triangle', triangulos: 'triangle',
                rectangulo: 'rectangle', rectangulos: 'rectangle',
                estrella: 'star', estrellas: 'star',
                corazon: 'heart', corazones: 'heart'
            };
            for (const w of words) {
                if (shapeMap[w]) { shape = shapeMap[w]; break; }
            }

            // Parse size
            for (const w of words) {
                if (SIZE_MAP[w] !== undefined) { size = w.replace('s', '').replace('es', ''); if (SIZE_MAP[size] === undefined) size = 'mediano'; break; }
            }
            for (const w of words) {
                if (w === 'grande' || w === 'grandes') size = 'grande';
                if (w === 'pequeno' || w === 'pequenos' || w === 'pequena' || w === 'pequenas') size = 'pequeno';
                if (w === 'mediano' || w === 'medianos') size = 'mediano';
            }

            // Parse position
            if (seg.includes('centro')) { position = { x: 0.5, y: 0.5 }; }
            if (seg.includes('arriba')) { position.y = 0.25; }
            if (seg.includes('abajo')) { position.y = 0.75; }
            if (seg.includes('izquierda') || seg.includes('lado')) { position.x = 0.25; }
            if (seg.includes('derecha')) { position.x = 0.75; }
            if (seg.includes('esquina')) {
                // Multiple positions handled by quantity
            }

            if (!shape) return;

            if (quantity === 1) {
                shapes.push({ shape, color, size, x: position.x, y: position.y });
            } else {
                const spacing = 0.8 / Math.max(quantity, 1);
                for (let i = 0; i < quantity; i++) {
                    let sx = position.x;
                    let sy = position.y;
                    if (seg.includes('esquina') || seg.includes('esquinas')) {
                        const corners = [[0.15, 0.15], [0.85, 0.15], [0.15, 0.85], [0.85, 0.85]];
                        if (i < corners.length) { sx = corners[i][0]; sy = corners[i][1]; }
                    } else if (seg.includes('lado') || seg.includes('lados')) {
                        sx = i === 0 ? 0.15 : 0.85;
                    } else {
                        sx = 0.1 + spacing * (i + 0.5);
                    }
                    shapes.push({ shape, color, size, x: sx, y: sy });
                }
            }
        });

        return shapes;
    }

    function processPrompt(text) {
        if (!text.trim()) return;
        aiShapes = parsePrompt(text);

        const target = PROMPT_LEVELS[level].target;
        let matched = 0;

        // Compare shapes
        const used = new Set();
        for (const ts of target) {
            let bestDist = Infinity;
            let bestIdx = -1;
            aiShapes.forEach((as, i) => {
                if (used.has(i)) return;
                let score = 0;
                if (as.shape === ts.shape) score += 3;
                // Color similarity
                if (as.color === ts.color) score += 2;
                // Size
                const tSize = SIZE_MAP[ts.size] || 0.22;
                const aSize = SIZE_MAP[as.size] || 0.22;
                if (Math.abs(tSize - aSize) < 0.05) score += 1;
                // Position
                const dist = Math.hypot(as.x - ts.x, as.y - ts.y);
                if (dist < 0.2) score += 1;

                if (score > bestDist || bestIdx === -1) {
                    bestDist = score;
                    bestIdx = i;
                }
            });
            if (bestIdx >= 0 && bestDist >= 3) {
                matched++;
                used.add(bestIdx);
            }
        }

        matchPercent = Math.round((matched / Math.max(target.length, 1)) * 100);
        const pts = Math.round(matchPercent * 0.2) * (level + 1);
        if (pts > bestScores[level]) {
            const diff = pts - bestScores[level];
            bestScores[level] = pts;
            addScore(diff);
        }

        const fb = document.getElementById('prompt-feedback');
        if (matchPercent >= 80) {
            fb.innerHTML = `<span style="color: #2ecc71;">Coincidencia: ${matchPercent}% - Excelente!</span>`;
            document.getElementById('prompt-next').style.display = 'inline-block';
        } else if (matchPercent >= 50) {
            fb.innerHTML = `<span style="color: #f39c12;">Coincidencia: ${matchPercent}% - Casi! Intenta de nuevo.</span>`;
        } else {
            fb.innerHTML = `<span style="color: #e74c3c;">Coincidencia: ${matchPercent}% - Revisa tu descripcion.</span>`;
        }
    }

    function drawShape(ctx, shape, color, size, cx, cy, areaW, areaH) {
        const sz = (SIZE_MAP[size] || 0.22) * Math.min(areaW, areaH);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        switch (shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(cx, cy, sz / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'square':
                ctx.fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
                break;
            case 'rectangle':
                ctx.fillRect(cx - sz * 0.7, cy - sz * 0.4, sz * 1.4, sz * 0.8);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(cx, cy - sz / 2);
                ctx.lineTo(cx + sz / 2, cy + sz / 2);
                ctx.lineTo(cx - sz / 2, cy + sz / 2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'star':
                drawStar(ctx, cx, cy, 5, sz / 2, sz / 4);
                ctx.fill();
                break;
            case 'heart':
                drawHeart(ctx, cx, cy, sz / 2);
                ctx.fill();
                break;
        }
    }

    function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
        ctx.beginPath();
        let rot = -Math.PI / 2;
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
            rot += Math.PI / spikes;
            ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
            rot += Math.PI / spikes;
        }
        ctx.closePath();
    }

    function drawHeart(ctx, cx, cy, sz) {
        ctx.beginPath();
        ctx.moveTo(cx, cy + sz * 0.3);
        ctx.bezierCurveTo(cx + sz, cy - sz * 0.5, cx + sz * 0.5, cy - sz, cx, cy - sz * 0.3);
        ctx.bezierCurveTo(cx - sz * 0.5, cy - sz, cx - sz, cy - sz * 0.5, cx, cy + sz * 0.3);
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, cw, ch);
        ctx.fillStyle = '#16213e';
        ctx.fillRect(0, 0, cw, ch);

        // Divider line
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(HALF, DRAW_AREA_Y);
        ctx.lineTo(HALF, DRAW_AREA_Y + DRAW_AREA_H);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#89b4fa';
        ctx.font = `bold ${Math.min(12, cw / 32)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('OBJETIVO', HALF / 2, 18);
        ctx.fillStyle = '#cba6f7';
        ctx.fillText('TU RESULTADO', HALF + HALF / 2, 18);

        // Level description
        ctx.fillStyle = '#f1c40f';
        ctx.font = `${Math.min(10, cw / 40)}px sans-serif`;
        ctx.fillText(`"${PROMPT_LEVELS[level].desc}"`, cw / 2, 33);

        // Draw target shapes (left half)
        const target = PROMPT_LEVELS[level].target;
        target.forEach(s => {
            const px = s.x * (HALF - 20) + 10;
            const py = DRAW_AREA_Y + s.y * DRAW_AREA_H;
            drawShape(ctx, s.shape, s.color, s.size, px, py, HALF - 20, DRAW_AREA_H);
        });

        // Draw AI shapes (right half)
        aiShapes.forEach(s => {
            const px = HALF + s.x * (HALF - 20) + 10;
            const py = DRAW_AREA_Y + s.y * DRAW_AREA_H;
            drawShape(ctx, s.shape, s.color, s.size, px, py, HALF - 20, DRAW_AREA_H);
        });

        // Match percentage
        if (aiShapes.length > 0) {
            ctx.fillStyle = matchPercent >= 80 ? '#2ecc71' : matchPercent >= 50 ? '#f39c12' : '#e74c3c';
            ctx.font = `bold ${Math.min(16, cw / 22)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(`${matchPercent}%`, cw / 2, ch - 8);
        }

        ctx.textAlign = 'left';
        animFrame = requestAnimationFrame(draw);
    }

    setupLevel();

    currentGame = {
        cleanup: () => {
            cancelAnimationFrame(animFrame);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            controls.innerHTML = '';
            ui.style.pointerEvents = '';
        }
    };
}

// ==============================================================
// MINIGAME 4: DIRECTOR DE AGENTES (FLAGSHIP)
// ==============================================================
function startDirectorAgentes(ui, controls, canvas, container) {
    canvas.style.display = 'none';

    let missionIdx = 0;
    let unlockedMissions = 1; // Only first unlocked at start
    let phase = 'select'; // select, assign, order, instruct, execute, result
    let assignments = {}; // taskIdx -> agentId
    let taskOrder = [];
    let instructions = {};
    let animTimers = [];

    function cleanup() {
        animTimers.forEach(t => clearTimeout(t));
        animTimers.forEach(t => clearInterval(t));
        ui.innerHTML = '';
        controls.innerHTML = '';
        ui.style.pointerEvents = '';
    }

    function showMissionSelect() {
        phase = 'select';
        ui.innerHTML = '';
        controls.innerHTML = `
        <div style="padding: 12px; overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch;">
            <div style="text-align: center; margin-bottom: 16px;">
                <div style="font-size: 2.5rem;">🎯</div>
                <h2 style="color: #9b59b6; margin: 4px 0; font-size: 1.1rem;">Director de Agentes</h2>
                <p style="color: #aaa; font-size: 0.75rem;">Dirige un equipo de agentes de IA para completar misiones.</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${AGENT_MISSIONS.map((m, i) => `
                    <div class="mission-card" data-mission="${i}" style="
                        background: ${i < unlockedMissions ? 'rgba(155, 89, 182, 0.15)' : 'rgba(255,255,255,0.03)'};
                        border: 1px solid ${i < unlockedMissions ? '#9b59b644' : '#33333344'};
                        border-radius: 12px; padding: 14px; cursor: ${i < unlockedMissions ? 'pointer' : 'default'};
                        opacity: ${i < unlockedMissions ? '1' : '0.4'};
                        transition: all 0.3s ease;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 1.8rem;">${m.emoji}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: bold; color: ${i < unlockedMissions ? '#eee' : '#666'}; font-size: 0.9rem;">
                                    ${i + 1}. ${m.title}
                                    ${m.tutorial ? '<span style="background: #f39c12; color: #000; font-size: 0.6rem; padding: 1px 5px; border-radius: 6px; margin-left: 6px;">TUTORIAL</span>' : ''}
                                    ${i >= unlockedMissions ? '🔒' : ''}
                                </div>
                                <div style="font-size: 0.72rem; color: #999; margin-top: 3px;">${m.desc}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;

        controls.querySelectorAll('.mission-card').forEach(card => {
            card.onclick = () => {
                const idx = parseInt(card.dataset.mission);
                if (idx < unlockedMissions) {
                    missionIdx = idx;
                    startMission();
                }
            };
        });
    }

    function startMission() {
        const mission = AGENT_MISSIONS[missionIdx];
        assignments = {};
        taskOrder = [];
        instructions = {};
        phase = 'assign';
        showAssignPhase();
    }

    function showAssignPhase() {
        const mission = AGENT_MISSIONS[missionIdx];

        let agentsHtml = AGENTS.map(a => `
            <div class="da-agent" data-agent="${a.id}" style="
                background: ${a.color}22; border: 2px solid ${a.color}55;
                border-radius: 10px; padding: 8px; text-align: center;
                cursor: pointer; transition: all 0.3s; min-width: 60px;">
                <div style="font-size: 1.4rem;">${a.emoji}</div>
                <div style="font-size: 0.65rem; font-weight: bold; color: ${a.color};">${a.name}</div>
            </div>
        `).join('');

        let tasksHtml = mission.tasks.map((t, i) => {
            const assigned = assignments[i];
            const agent = assigned ? AGENTS.find(a => a.id === assigned) : null;
            return `
            <div class="da-task" data-task="${i}" style="
                background: ${agent ? agent.color + '22' : 'rgba(255,255,255,0.05)'};
                border: 1px solid ${agent ? agent.color + '88' : '#33333355'};
                border-radius: 10px; padding: 10px 12px;
                cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.1rem;">${agent ? agent.emoji : '❓'}</span>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.8rem; color: #eee;">${t.text}</div>
                    ${agent ? `<div style="font-size: 0.65rem; color: ${agent.color};">${agent.name}</div>` : ''}
                </div>
                ${mission.tutorial && !agent ? `<div style="font-size: 0.6rem; color: #f39c12;">Pista: ${t.agent === 'investigador' ? '🔍' : t.agent === 'escritor' ? '✍️' : t.agent === 'creativo' ? '🎨' : '📊'}</div>` : ''}
            </div>`;
        }).join('');

        let allAssigned = Object.keys(assignments).length === mission.tasks.length;

        controls.innerHTML = `
        <div style="padding: 10px; overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch;">
            <div style="text-align: center; margin-bottom: 8px;">
                <span style="font-size: 1.3rem;">${mission.emoji}</span>
                <span style="color: #cba6f7; font-weight: bold; font-size: 0.95rem; margin-left: 6px;">${mission.title}</span>
            </div>
            <div style="text-align: center; font-size: 0.72rem; color: #f1c40f; margin-bottom: 8px;">
                PASO 1: Asigna cada tarea a un agente
            </div>
            <div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px; flex-wrap: wrap;" id="da-agents-row">
                ${agentsHtml}
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;" id="da-tasks-list">
                ${tasksHtml}
            </div>
            <div style="text-align: center; margin-top: 12px;">
                <button id="da-next-btn" class="control-btn" style="
                    padding: 10px 30px; font-size: 0.9rem;
                    background: ${allAssigned ? 'linear-gradient(135deg, #9b59b6, #8e44ad)' : 'rgba(255,255,255,0.05)'};
                    border: none; color: ${allAssigned ? '#fff' : '#555'}; border-radius: 12px; cursor: pointer;
                    ${allAssigned ? '' : 'pointer-events: none;'}">
                    Siguiente: Ordenar tareas ▶
                </button>
            </div>
        </div>`;

        // Agent selection
        let selectedAgent = null;
        controls.querySelectorAll('.da-agent').forEach(el => {
            el.onclick = () => {
                controls.querySelectorAll('.da-agent').forEach(a => a.style.transform = '');
                el.style.transform = 'scale(1.15)';
                selectedAgent = el.dataset.agent;
            };
        });

        controls.querySelectorAll('.da-task').forEach(el => {
            el.onclick = () => {
                const taskIdx = parseInt(el.dataset.task);
                if (selectedAgent) {
                    assignments[taskIdx] = selectedAgent;
                    showAssignPhase(); // Refresh
                } else if (assignments[taskIdx]) {
                    delete assignments[taskIdx];
                    showAssignPhase();
                }
            };
        });

        const nextBtn = document.getElementById('da-next-btn');
        if (nextBtn && allAssigned) {
            nextBtn.onclick = () => showOrderPhase();
        }
    }

    function showOrderPhase() {
        const mission = AGENT_MISSIONS[missionIdx];
        phase = 'order';
        taskOrder = [];

        renderOrderUI();
    }

    function renderOrderUI() {
        const mission = AGENT_MISSIONS[missionIdx];
        const available = mission.tasks.map((t, i) => i).filter(i => !taskOrder.includes(i));
        const allOrdered = taskOrder.length === mission.tasks.length;

        let orderedHtml = '';
        for (let slot = 0; slot < mission.tasks.length; slot++) {
            const taskIdx = taskOrder[slot];
            if (taskIdx !== undefined) {
                const t = mission.tasks[taskIdx];
                const agent = AGENTS.find(a => a.id === assignments[taskIdx]);
                orderedHtml += `
                <div class="da-order-slot" data-slot="${slot}" style="
                    background: ${agent.color}22; border: 1px solid ${agent.color}55;
                    border-radius: 8px; padding: 8px 10px; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <span style="color: #f1c40f; font-weight: bold; font-size: 0.85rem; min-width: 18px;">${slot + 1}.</span>
                    <span style="font-size: 1rem;">${agent.emoji}</span>
                    <span style="font-size: 0.75rem; color: #ddd; flex: 1;">${t.text}</span>
                </div>`;
            } else {
                orderedHtml += `
                <div class="da-order-slot" data-slot="${slot}" style="
                    background: rgba(255,255,255,0.03); border: 1px dashed #33333555;
                    border-radius: 8px; padding: 8px 10px; min-height: 34px; display: flex; align-items: center;">
                    <span style="color: #555; font-size: 0.75rem;">${slot + 1}. (toca una tarea)</span>
                </div>`;
            }
        }

        let availHtml = available.map(i => {
            const t = mission.tasks[i];
            const agent = AGENTS.find(a => a.id === assignments[i]);
            return `
            <div class="da-avail-task" data-task="${i}" style="
                background: ${agent.color}15; border: 1px solid ${agent.color}33;
                border-radius: 8px; padding: 6px 10px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
                <span style="font-size: 0.9rem;">${agent.emoji}</span>
                <span style="font-size: 0.72rem; color: #ccc;">${t.text}</span>
            </div>`;
        }).join('');

        controls.innerHTML = `
        <div style="padding: 10px; overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch;">
            <div style="text-align: center; font-size: 0.72rem; color: #f1c40f; margin-bottom: 8px;">
                PASO 2: Ordena las tareas (1 = primera)
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px;" id="da-order-slots">
                ${orderedHtml}
            </div>
            ${available.length > 0 ? `
            <div style="font-size: 0.7rem; color: #888; margin-bottom: 4px;">Tareas sin ordenar:</div>
            <div style="display: flex; flex-direction: column; gap: 5px;" id="da-avail-list">
                ${availHtml}
            </div>` : ''}
            <div style="text-align: center; margin-top: 12px; display: flex; gap: 8px; justify-content: center;">
                <button id="da-order-undo" class="control-btn" style="padding: 8px 16px; font-size: 0.8rem; background: rgba(255,255,255,0.08); border: none; color: #aaa; border-radius: 10px; cursor: pointer;">
                    ↺ Deshacer
                </button>
                <button id="da-order-next" class="control-btn" style="
                    padding: 10px 24px; font-size: 0.9rem;
                    background: ${allOrdered ? 'linear-gradient(135deg, #9b59b6, #8e44ad)' : 'rgba(255,255,255,0.05)'};
                    border: none; color: ${allOrdered ? '#fff' : '#555'}; border-radius: 12px; cursor: pointer;
                    ${allOrdered ? '' : 'pointer-events: none;'}">
                    Siguiente: Instrucciones ▶
                </button>
            </div>
        </div>`;

        // Click available tasks to add to order
        controls.querySelectorAll('.da-avail-task').forEach(el => {
            el.onclick = () => {
                const taskIdx = parseInt(el.dataset.task);
                taskOrder.push(taskIdx);
                renderOrderUI();
            };
        });

        // Click ordered slots to remove (last one)
        controls.querySelectorAll('.da-order-slot').forEach(el => {
            el.onclick = () => {
                const slot = parseInt(el.dataset.slot);
                if (slot === taskOrder.length - 1) {
                    taskOrder.pop();
                    renderOrderUI();
                }
            };
        });

        const undoBtn = document.getElementById('da-order-undo');
        if (undoBtn) undoBtn.onclick = () => { if (taskOrder.length > 0) { taskOrder.pop(); renderOrderUI(); } };

        const nextBtn = document.getElementById('da-order-next');
        if (nextBtn && allOrdered) {
            nextBtn.onclick = () => showInstructPhase();
        }
    }

    function showInstructPhase() {
        const mission = AGENT_MISSIONS[missionIdx];
        phase = 'instruct';

        // Initialize instructions
        taskOrder.forEach(i => { if (!instructions[i]) instructions[i] = ''; });

        let html = `
        <div style="padding: 10px; overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch;">
            <div style="text-align: center; font-size: 0.72rem; color: #f1c40f; margin-bottom: 10px;">
                PASO 3: Escribe una instruccion breve para cada agente
            </div>`;

        taskOrder.forEach((taskIdx, order) => {
            const t = mission.tasks[taskIdx];
            const agent = AGENTS.find(a => a.id === assignments[taskIdx]);
            html += `
            <div style="background: ${agent.color}11; border: 1px solid ${agent.color}33; border-radius: 10px; padding: 10px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                    <span style="color: #f1c40f; font-weight: bold; font-size: 0.8rem;">${order + 1}.</span>
                    <span style="font-size: 1rem;">${agent.emoji}</span>
                    <span style="font-size: 0.75rem; color: #ddd;">${t.text}</span>
                </div>
                <input class="da-instruction" data-task="${taskIdx}" type="text"
                    placeholder="Ej: ${t.keywords.slice(0, 2).join(', ')}..."
                    value="${instructions[taskIdx] || ''}"
                    style="width: 100%; box-sizing: border-box; padding: 8px 10px; border-radius: 8px; border: 1px solid ${agent.color}44;
                    background: rgba(0,0,0,0.3); color: #eee; font-size: 0.8rem; outline: none;">
            </div>`;
        });

        html += `
            <div style="text-align: center; margin-top: 10px;">
                <button id="da-execute" class="control-btn" style="
                    padding: 12px 30px; font-size: 1rem;
                    background: linear-gradient(135deg, #f39c12, #e67e22);
                    border: none; color: #fff; border-radius: 14px; cursor: pointer;
                    box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);">
                    🚀 Ejecutar Mision
                </button>
            </div>
        </div>`;

        controls.innerHTML = html;

        controls.querySelectorAll('.da-instruction').forEach(input => {
            input.oninput = () => { instructions[parseInt(input.dataset.task)] = input.value; };
        });

        document.getElementById('da-execute').onclick = () => executeMission();
    }

    function executeMission() {
        const mission = AGENT_MISSIONS[missionIdx];
        phase = 'execute';

        let html = `
        <div style="padding: 12px; overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch;">
            <div style="text-align: center; margin-bottom: 12px;">
                <div style="font-size: 1.5rem;">🚀</div>
                <div style="color: #f1c40f; font-weight: bold; font-size: 0.95rem;">Ejecutando Mision...</div>
            </div>`;

        taskOrder.forEach((taskIdx, order) => {
            const t = mission.tasks[taskIdx];
            const agent = AGENTS.find(a => a.id === assignments[taskIdx]);
            html += `
            <div id="da-exec-${order}" style="
                background: ${agent.color}11; border: 1px solid ${agent.color}33;
                border-radius: 10px; padding: 10px; margin-bottom: 8px; opacity: 0.3; transition: all 0.5s;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                    <span style="font-size: 1rem;">${agent.emoji}</span>
                    <span style="font-size: 0.75rem; color: #ddd; flex: 1;">${t.text}</span>
                    <span id="da-exec-status-${order}" style="font-size: 0.7rem; color: #666;">Esperando...</span>
                </div>
                <div style="background: rgba(0,0,0,0.3); border-radius: 6px; height: 8px; overflow: hidden;">
                    <div id="da-exec-bar-${order}" style="height: 100%; width: 0%; background: ${agent.color}; transition: width 0.6s ease; border-radius: 6px;"></div>
                </div>
            </div>`;
        });

        html += `<div id="da-exec-result" style="text-align: center; margin-top: 12px;"></div></div>`;
        controls.innerHTML = html;

        // Animate each task
        let step = 0;
        function animateStep() {
            if (step >= taskOrder.length) {
                showMissionResult();
                return;
            }

            const el = document.getElementById(`da-exec-${step}`);
            const bar = document.getElementById(`da-exec-bar-${step}`);
            const status = document.getElementById(`da-exec-status-${step}`);
            if (el) el.style.opacity = '1';
            if (status) status.textContent = 'Trabajando...';
            if (status) status.style.color = '#f1c40f';

            let progress = 0;
            const currentStep = step;
            const interval = setInterval(() => {
                progress += 15 + Math.random() * 20;
                if (progress >= 100) progress = 100;
                if (bar) bar.style.width = progress + '%';
                if (progress >= 100) {
                    clearInterval(interval);
                    if (status) { status.textContent = 'Completado ✓'; status.style.color = '#2ecc71'; }
                    step++;
                    const timer = setTimeout(animateStep, 300);
                    animTimers.push(timer);
                }
            }, 200);
            animTimers.push(interval);
        }

        animateStep();
    }

    function showMissionResult() {
        const mission = AGENT_MISSIONS[missionIdx];
        phase = 'result';

        // Calculate scores
        let assignScore = 0;
        mission.tasks.forEach((t, i) => {
            if (assignments[i] === t.agent) assignScore++;
        });
        const assignPts = Math.round((assignScore / mission.tasks.length) * 40);

        // Order scoring - give points for relative ordering that makes sense
        // Simple: compare with a reasonable order
        let orderPts = 0;
        for (let i = 0; i < taskOrder.length; i++) {
            // Award points if investigador/analista tasks come before escritor/creativo tasks as appropriate
            // Simple heuristic: each correctly-positioned task vs neighbors
            if (i > 0) {
                const prev = mission.tasks[taskOrder[i - 1]];
                const curr = mission.tasks[taskOrder[i]];
                // If investigation comes before writing, good
                if (prev.agent === 'investigador' && (curr.agent === 'escritor' || curr.agent === 'creativo')) orderPts += 6;
                else if (prev.agent === 'analista' && curr.agent === 'escritor') orderPts += 6;
                else orderPts += 3;
            }
        }
        orderPts = Math.min(30, orderPts);

        // Instruction scoring - check for keywords
        let instrScore = 0;
        let instrTotal = 0;
        mission.tasks.forEach((t, i) => {
            instrTotal++;
            const instr = (instructions[i] || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (instr.length > 3) {
                instrScore += 2; // At least they wrote something
                for (const kw of t.keywords) {
                    if (instr.includes(kw)) { instrScore += 3; break; }
                }
            }
        });
        const instrPts = Math.min(30, Math.round((instrScore / (instrTotal * 5)) * 30));

        const totalPts = assignPts + orderPts + instrPts;
        addScore(totalPts);

        // Unlock next mission if scored > 50
        if (totalPts > 50 && missionIdx + 1 < AGENT_MISSIONS.length) {
            unlockedMissions = Math.max(unlockedMissions, missionIdx + 2);
        }

        const resultEl = document.getElementById('da-exec-result');
        if (resultEl) {
            resultEl.innerHTML = `
            <div style="background: rgba(155, 89, 182, 0.15); border: 1px solid #9b59b644; border-radius: 14px; padding: 16px; margin-top: 8px;">
                <div style="font-size: 1.3rem; margin-bottom: 8px;">🏆</div>
                <div style="color: #f1c40f; font-weight: bold; font-size: 1.2rem; margin-bottom: 10px;">${totalPts} puntos</div>
                <div style="display: flex; flex-direction: column; gap: 6px; text-align: left;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                        <span style="color: #aaa;">Asignacion correcta</span>
                        <span style="color: #3498db; font-weight: bold;">${assignPts}/40</span>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); border-radius: 4px; height: 6px;">
                        <div style="background: #3498db; height: 100%; width: ${(assignPts / 40) * 100}%; border-radius: 4px;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                        <span style="color: #aaa;">Orden logico</span>
                        <span style="color: #2ecc71; font-weight: bold;">${orderPts}/30</span>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); border-radius: 4px; height: 6px;">
                        <div style="background: #2ecc71; height: 100%; width: ${(orderPts / 30) * 100}%; border-radius: 4px;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                        <span style="color: #aaa;">Calidad instrucciones</span>
                        <span style="color: #e67e22; font-weight: bold;">${instrPts}/30</span>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); border-radius: 4px; height: 6px;">
                        <div style="background: #e67e22; height: 100%; width: ${(instrPts / 30) * 100}%; border-radius: 4px;"></div>
                    </div>
                </div>
                ${totalPts > 50 && missionIdx + 1 < AGENT_MISSIONS.length ? '<div style="color: #2ecc71; font-size: 0.75rem; margin-top: 10px;">🔓 Siguiente mision desbloqueada!</div>' : ''}
                <div style="display: flex; gap: 8px; justify-content: center; margin-top: 14px;">
                    <button id="da-res-retry" class="control-btn" style="padding: 8px 18px; font-size: 0.8rem; background: rgba(255,255,255,0.1); border: none; color: #aaa; border-radius: 10px; cursor: pointer;">
                        ↺ Reintentar
                    </button>
                    <button id="da-res-missions" class="control-btn" style="padding: 8px 18px; font-size: 0.8rem; background: linear-gradient(135deg, #9b59b6, #8e44ad); border: none; color: #fff; border-radius: 10px; cursor: pointer;">
                        Misiones ▶
                    </button>
                </div>
            </div>`;

            document.getElementById('da-res-retry').onclick = () => startMission();
            document.getElementById('da-res-missions').onclick = () => showMissionSelect();
        }
    }

    showMissionSelect();

    currentGame = { cleanup };
}

// ==============================================================
// EVOLUTION SCREEN
// ==============================================================
function showEvolucion(ui, controls, canvas, container) {
    canvas.style.display = 'none';
    ui.innerHTML = '';

    let html = `<div style="padding: 12px; overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch;">`;

    // --- Transformation Map ---
    html += `
    <div style="text-align: center; margin-bottom: 16px;">
        <div style="font-size: 2rem;">🔄</div>
        <h2 style="color: #cba6f7; margin: 4px 0; font-size: 1rem;">Mapa de Transformación</h2>
        <p style="color: #888; font-size: 0.7rem;">Cómo cambian las habilidades del programador al orquestador</p>
    </div>`;

    // Legend
    html += `
    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 12px;">
        <span style="font-size: 0.65rem; color: #e74c3c;">● Desaparece</span>
        <span style="font-size: 0.65rem; color: #f1c40f;">● Se transforma</span>
        <span style="font-size: 0.65rem; color: #2ecc71;">● Nace nueva</span>
        <span style="font-size: 0.65rem; color: #3498db;">● Se mantiene</span>
    </div>`;

    EVOLUTION_MAP.forEach(e => {
        const arrow = e.type === 'desaparece' ? '✕' : e.type === 'nueva' ? '✦' : '→';
        html += `
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; padding: 6px 8px; background: ${e.color}11; border-radius: 8px; border-left: 3px solid ${e.color};">
            ${e.from ? `<span style="font-size: 0.72rem; color: #89b4fa; flex: 1; min-width: 0;">${e.from}</span>` : '<span style="flex: 1;"></span>'}
            <span style="color: ${e.color}; font-weight: bold; font-size: 0.9rem; min-width: 20px; text-align: center;">${arrow}</span>
            ${e.to ? `<span style="font-size: 0.72rem; color: #cba6f7; flex: 1; min-width: 0;">${e.to}</span>` : `<span style="font-size: 0.72rem; color: #e74c3c55; flex: 1; font-style: italic;">(la IA lo hace)</span>`}
        </div>`;
    });

    // --- Timeline ---
    html += `
    <div style="margin-top: 24px; text-align: center;">
        <div style="font-size: 1.5rem;">⏳</div>
        <h2 style="color: #f1c40f; margin: 4px 0; font-size: 1rem;">Linea del Tiempo</h2>
    </div>
    <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; padding: 12px 0;">
        <div style="display: flex; gap: 12px; min-width: max-content; padding: 0 8px; align-items: flex-end;">
            ${TIMELINE_ENTRIES.map((t, i) => `
                <div style="
                    background: linear-gradient(180deg, rgba(${i < 4 ? '52, 152, 219' : '155, 89, 182'}, 0.2), transparent);
                    border: 1px solid ${i < 4 ? '#3498db' : '#9b59b6'}44;
                    border-radius: 10px; padding: 10px; text-align: center;
                    min-width: 100px; max-width: 110px;">
                    <div style="font-size: 1.5rem; margin-bottom: 4px;">${t.emoji}</div>
                    <div style="font-weight: bold; color: #f1c40f; font-size: 0.85rem;">${t.year}</div>
                    <div style="font-size: 0.68rem; color: #bbb; margin-top: 4px;">${t.text}</div>
                </div>
            `).join('')}
        </div>
    </div>`;

    // --- Fun fact ---
    html += `
    <div style="margin-top: 20px; background: linear-gradient(135deg, rgba(155, 89, 182, 0.15), rgba(52, 152, 219, 0.15)); border-radius: 14px; padding: 16px; border: 1px solid #9b59b644;">
        <div style="font-size: 1.3rem; text-align: center;">💡</div>
        <div style="text-align: center; color: #f1c40f; font-weight: bold; font-size: 0.85rem; margin: 6px 0;">Sabías que...</div>
        <div style="text-align: center; color: #ccc; font-size: 0.78rem; line-height: 1.5;">
            Esta misma app fue hecha por un padre y su hija usando un orquestador de agentes. Miles de líneas de código en una tarde, sin escribir ni una línea a mano.
        </div>
    </div>`;

    // --- Radar chart placeholder (canvas inside controls) ---
    html += `
    <div style="margin-top: 20px; text-align: center;">
        <div style="font-size: 1.3rem;">📊</div>
        <h2 style="color: #89b4fa; margin: 4px 0; font-size: 1rem;">Comparativa de Perfiles</h2>
        <canvas id="radar-canvas" width="600" height="600" style="width: 100%; max-width: 300px; height: auto;"></canvas>
    </div>`;

    html += `</div>`;
    controls.innerHTML = html;

    // Draw radar chart
    setTimeout(() => {
        const radarCanvas = document.getElementById('radar-canvas');
        if (!radarCanvas) return;
        const rctx = radarCanvas.getContext('2d');
        const rw = 300;
        const rh = 300;
        radarCanvas.width = 600;
        radarCanvas.height = 600;
        rctx.setTransform(2, 0, 0, 2, 0, 0);

        const cx = rw / 2;
        const cy = rh / 2;
        const maxR = rw * 0.38;
        const labels = [
            'Lógica', 'Creatividad', 'Comunicación', 'Liderazgo',
            'Técnica', 'Estrategia', 'Ética', 'Adaptabilidad',
            'Colaboración', 'Análisis', 'Diseño', 'Planificación'
        ];
        const programadorData = [0.9, 0.5, 0.5, 0.3, 0.95, 0.4, 0.3, 0.6, 0.6, 0.7, 0.4, 0.6];
        const orquestadorData = [0.6, 0.8, 0.9, 0.9, 0.4, 0.95, 0.8, 0.9, 0.85, 0.7, 0.6, 0.8];
        const n = labels.length;
        const angleStep = (Math.PI * 2) / n;

        // Grid lines
        for (let ring = 1; ring <= 4; ring++) {
            const r = (ring / 4) * maxR;
            rctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) rctx.moveTo(x, y); else rctx.lineTo(x, y);
            }
            rctx.strokeStyle = 'rgba(255,255,255,0.1)';
            rctx.lineWidth = 0.5;
            rctx.stroke();
        }

        // Axes and labels
        for (let i = 0; i < n; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + Math.cos(angle) * maxR;
            const y = cy + Math.sin(angle) * maxR;

            rctx.beginPath();
            rctx.moveTo(cx, cy);
            rctx.lineTo(x, y);
            rctx.strokeStyle = 'rgba(255,255,255,0.08)';
            rctx.lineWidth = 0.5;
            rctx.stroke();

            const lx = cx + Math.cos(angle) * (maxR + 18);
            const ly = cy + Math.sin(angle) * (maxR + 18);
            rctx.fillStyle = '#888';
            rctx.font = '7px sans-serif';
            rctx.textAlign = 'center';
            rctx.textBaseline = 'middle';
            rctx.fillText(labels[i], lx, ly);
        }

        // Draw polygon
        function drawPoly(data, color, alpha) {
            rctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const idx = i % n;
                const angle = idx * angleStep - Math.PI / 2;
                const r = data[idx] * maxR;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) rctx.moveTo(x, y); else rctx.lineTo(x, y);
            }
            rctx.closePath();
            rctx.fillStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            rctx.fill();
            rctx.strokeStyle = color;
            rctx.lineWidth = 1.5;
            rctx.stroke();
        }

        drawPoly(programadorData, 'rgb(52, 152, 219)', 0.15);
        drawPoly(orquestadorData, 'rgb(155, 89, 182)', 0.15);

        // Legend
        rctx.fillStyle = '#3498db';
        rctx.fillRect(cx - 65, rh - 14, 10, 10);
        rctx.fillStyle = '#89b4fa';
        rctx.font = '8px sans-serif';
        rctx.textAlign = 'left';
        rctx.fillText('Programador', cx - 52, rh - 5);

        rctx.fillStyle = '#9b59b6';
        rctx.fillRect(cx + 10, rh - 14, 10, 10);
        rctx.fillStyle = '#cba6f7';
        rctx.fillText('Orquestador', cx + 23, rh - 5);

    }, 50);

    currentGame = {
        cleanup: () => {
            ui.innerHTML = '';
            controls.innerHTML = '';
            ui.style.pointerEvents = '';
        }
    };
}

// ==============================================================
// MINIGAME 6: LEVEL DESIGNER (Diseñador de Niveles)
// ==============================================================

function startDisenoNiveles(ui, controls, canvas, container) {
    canvas.style.display = 'block';
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    canvas.width = cw * 2;
    canvas.height = ch * 2;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);

    // --- Constants ---
    const COLS = 20;
    const ROWS = 12;
    const TOOLBAR_H = 48;
    const GRID_H = ch - TOOLBAR_H;
    const TILE_W = cw / COLS;
    const TILE_H = GRID_H / ROWS;

    // Tile types
    const T = { EMPTY: 0, GROUND: 1, PLATFORM: 2, SPIKE: 3, COIN: 4, START: 5, EXIT: 6, ENEMY: 7, SPRING: 8 };
    const TILE_NAMES = ['Vacío', 'Suelo', 'Plataforma', 'Pinchos', 'Moneda', 'Inicio', 'Salida', 'Enemigo', 'Muelle'];
    const TILE_KEYS = [null, '1', '2', '3', '4', '5', '6', '7', '8'];

    // Colors
    const COLORS = {
        bg: '#1a1a2e',
        grid: 'rgba(255,255,255,0.08)',
        ground: '#8B5E3C',
        groundLight: '#A0724E',
        platform: '#4CAF50',
        platformLight: '#66BB6A',
        spike: '#F44336',
        coin: '#FFD700',
        coinGlow: '#FFF176',
        start: '#4CAF50',
        exit: '#9C27B0',
        exitGlow: '#CE93D8',
        enemy: '#FF9800',
        enemyEye: '#FFF',
        spring: '#2196F3',
        springLight: '#64B5F6',
        player: '#42A5F5',
        playerEye: '#FFF',
        playerPupil: '#1A1A2E',
        toolbar: '#16213e',
        toolbarBorder: '#0f3460',
        selected: '#e94560',
        text: '#FFF',
        textDim: 'rgba(255,255,255,0.5)',
        cursor: 'rgba(233,69,96,0.5)'
    };

    // --- State ---
    let grid = [];
    let phase = 'design'; // 'design' | 'play'
    let selectedTile = T.GROUND;
    let animFrame = null;
    let cursorCol = -1;
    let cursorRow = -1;
    let kbCursorCol = 0;
    let kbCursorRow = 0;
    let useKbCursor = false;

    // Play mode state
    let player = null;
    let enemies = [];
    let coins = [];
    let springs = [];
    let playTime = 0;
    let playStart = 0;
    let coinsCollected = 0;
    let totalCoins = 0;
    let levelComplete = false;
    let deathFlash = 0;

    // Physics constants
    const GRAVITY = 0.55;
    const JUMP_VEL = -9.5;
    const MOVE_SPEED = 3.8;
    const SPRING_VEL = -14;
    const ENEMY_SPEED = 1.2;

    // --- Pre-made levels ---
    const PREMADE_LEVELS = [
        {
            name: 'Tutorial',
            desc: 'Nivel sencillo para aprender los controles',
            data: (function() {
                const g = Array.from({length: ROWS}, () => Array(COLS).fill(T.EMPTY));
                // Ground floor
                for (let c = 0; c < COLS; c++) g[ROWS-1][c] = T.GROUND;
                // Start and exit
                g[ROWS-2][1] = T.START;
                g[ROWS-2][COLS-2] = T.EXIT;
                // A few platforms
                for (let c = 5; c < 9; c++) g[8][c] = T.PLATFORM;
                for (let c = 12; c < 16; c++) g[6][c] = T.PLATFORM;
                // Coins
                g[7][6] = T.COIN; g[7][7] = T.COIN;
                g[5][13] = T.COIN; g[5][14] = T.COIN;
                g[ROWS-2][10] = T.COIN;
                return g;
            })()
        },
        {
            name: 'El Salto',
            desc: 'Huecos y plataformas a diferentes alturas',
            data: (function() {
                const g = Array.from({length: ROWS}, () => Array(COLS).fill(T.EMPTY));
                // Ground with gaps
                for (let c = 0; c < 5; c++) g[ROWS-1][c] = T.GROUND;
                for (let c = 7; c < 11; c++) g[ROWS-1][c] = T.GROUND;
                for (let c = 13; c < 17; c++) g[ROWS-1][c] = T.GROUND;
                for (let c = 19; c < COLS; c++) g[ROWS-1][c] = T.GROUND;
                // Spikes in gaps
                g[ROWS-1][5] = T.SPIKE; g[ROWS-1][6] = T.SPIKE;
                g[ROWS-1][11] = T.SPIKE; g[ROWS-1][12] = T.SPIKE;
                g[ROWS-1][17] = T.SPIKE; g[ROWS-1][18] = T.SPIKE;
                // Platforms at varying heights
                for (let c = 4; c < 7; c++) g[8][c] = T.PLATFORM;
                for (let c = 10; c < 13; c++) g[6][c] = T.PLATFORM;
                for (let c = 15; c < 18; c++) g[4][c] = T.PLATFORM;
                // Coins above platforms
                g[7][5] = T.COIN; g[5][11] = T.COIN; g[3][16] = T.COIN;
                g[ROWS-2][2] = T.COIN; g[ROWS-2][9] = T.COIN;
                // Start and exit
                g[ROWS-2][1] = T.START;
                g[3][15] = T.EXIT;
                return g;
            })()
        },
        {
            name: 'Aventura',
            desc: 'Enemigos, pinchos, muelles y más',
            data: (function() {
                const g = Array.from({length: ROWS}, () => Array(COLS).fill(T.EMPTY));
                // Ground
                for (let c = 0; c < COLS; c++) g[ROWS-1][c] = T.GROUND;
                // Remove some ground for gaps
                g[ROWS-1][8] = T.SPIKE; g[ROWS-1][9] = T.SPIKE;
                // Platforms
                for (let c = 3; c < 6; c++) g[8][c] = T.PLATFORM;
                for (let c = 7; c < 10; c++) g[6][c] = T.PLATFORM;
                for (let c = 11; c < 14; c++) g[8][c] = T.PLATFORM;
                for (let c = 15; c < 18; c++) g[5][c] = T.PLATFORM;
                // Walls
                g[ROWS-2][6] = T.GROUND; g[ROWS-3][6] = T.GROUND;
                // Springs
                g[ROWS-2][4] = T.SPRING;
                g[7][12] = T.SPRING;
                // Enemies
                g[ROWS-2][13] = T.ENEMY;
                g[7][8] = T.ENEMY;
                // Spikes
                g[ROWS-2][10] = T.SPIKE;
                g[4][16] = T.SPIKE;
                // Coins
                g[5][8] = T.COIN; g[7][4] = T.COIN; g[4][12] = T.COIN;
                g[ROWS-2][2] = T.COIN; g[ROWS-2][16] = T.COIN;
                g[4][17] = T.COIN; g[7][15] = T.COIN;
                // Start and exit
                g[ROWS-2][1] = T.START;
                g[4][18] = T.EXIT;
                return g;
            })()
        }
    ];

    // --- Helpers ---
    function clearGrid() {
        grid = Array.from({length: ROWS}, () => Array(COLS).fill(T.EMPTY));
    }

    function loadLevel(levelData) {
        grid = levelData.map(r => [...r]);
    }

    function findTile(type) {
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                if (grid[r][c] === type) return {r, c};
        return null;
    }

    function countTile(type) {
        let n = 0;
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                if (grid[r][c] === type) n++;
        return n;
    }

    function isSolid(col, row) {
        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return row >= ROWS;
        const t = grid[row][col];
        return t === T.GROUND || t === T.PLATFORM;
    }

    // --- Drawing: Design Mode ---
    function drawDesign() {
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, cw, ch);

        // Draw grid
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 0.5;
        for (let c = 0; c <= COLS; c++) {
            ctx.beginPath();
            ctx.moveTo(c * TILE_W, 0);
            ctx.lineTo(c * TILE_W, GRID_H);
            ctx.stroke();
        }
        for (let r = 0; r <= ROWS; r++) {
            ctx.beginPath();
            ctx.moveTo(0, r * TILE_H);
            ctx.lineTo(cw, r * TILE_H);
            ctx.stroke();
        }

        // Draw tiles
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                drawTile(c * TILE_W, r * TILE_H, TILE_W, TILE_H, grid[r][c], false);
            }
        }

        // Draw cursor highlight
        if (useKbCursor) {
            ctx.strokeStyle = COLORS.cursor;
            ctx.lineWidth = 2;
            ctx.strokeRect(kbCursorCol * TILE_W + 1, kbCursorRow * TILE_H + 1, TILE_W - 2, TILE_H - 2);
        } else if (cursorCol >= 0 && cursorCol < COLS && cursorRow >= 0 && cursorRow < ROWS) {
            ctx.strokeStyle = COLORS.cursor;
            ctx.lineWidth = 2;
            ctx.strokeRect(cursorCol * TILE_W + 1, cursorRow * TILE_H + 1, TILE_W - 2, TILE_H - 2);
        }

        // Draw toolbar
        drawToolbar();

        // Title
        ctx.fillStyle = COLORS.text;
        ctx.font = 'bold ' + Math.max(10, TILE_H * 0.4) + 'px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🎮 Diseñador de Niveles - Modo Edición', cw / 2, TILE_H * 0.45);
    }

    function drawTile(x, y, w, h, type, small) {
        const p = small ? 1 : 2;
        switch (type) {
            case T.GROUND:
                ctx.fillStyle = COLORS.ground;
                ctx.fillRect(x + p, y + p, w - p*2, h - p*2);
                ctx.fillStyle = COLORS.groundLight;
                ctx.fillRect(x + p, y + p, w - p*2, h * 0.15);
                // brick lines
                ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(x + w*0.5, y + p); ctx.lineTo(x + w*0.5, y + h*0.5);
                ctx.moveTo(x + p, y + h*0.5); ctx.lineTo(x + w - p, y + h*0.5);
                ctx.moveTo(x + w*0.25, y + h*0.5); ctx.lineTo(x + w*0.25, y + h - p);
                ctx.moveTo(x + w*0.75, y + h*0.5); ctx.lineTo(x + w*0.75, y + h - p);
                ctx.stroke();
                break;
            case T.PLATFORM:
                ctx.fillStyle = COLORS.platform;
                ctx.fillRect(x + p, y + p, w - p*2, h - p*2);
                ctx.fillStyle = COLORS.platformLight;
                ctx.fillRect(x + p, y + p, w - p*2, h * 0.25);
                break;
            case T.SPIKE:
                ctx.fillStyle = COLORS.spike;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.5, y + p);
                ctx.lineTo(x + w - p, y + h - p);
                ctx.lineTo(x + p, y + h - p);
                ctx.closePath();
                ctx.fill();
                // highlight
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.beginPath();
                ctx.moveTo(x + w*0.5, y + h*0.15);
                ctx.lineTo(x + w*0.6, y + h*0.6);
                ctx.lineTo(x + w*0.4, y + h*0.6);
                ctx.closePath();
                ctx.fill();
                break;
            case T.COIN:
                const cx1 = x + w/2, cy1 = y + h/2, rad = Math.min(w, h) * 0.3;
                ctx.fillStyle = COLORS.coinGlow;
                ctx.beginPath(); ctx.arc(cx1, cy1, rad * 1.2, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = COLORS.coin;
                ctx.beginPath(); ctx.arc(cx1, cy1, rad, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#DAA520';
                ctx.font = 'bold ' + (rad * 1.2) + 'px sans-serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('★', cx1, cy1 + 1);
                break;
            case T.START:
                ctx.fillStyle = COLORS.start;
                // flag pole
                ctx.fillRect(x + w*0.25, y + p, w*0.06, h - p*2);
                // flag
                ctx.fillStyle = '#66BB6A';
                ctx.beginPath();
                ctx.moveTo(x + w*0.31, y + p);
                ctx.lineTo(x + w*0.75, y + h*0.25);
                ctx.lineTo(x + w*0.31, y + h*0.45);
                ctx.closePath();
                ctx.fill();
                break;
            case T.EXIT:
                ctx.fillStyle = COLORS.exit;
                ctx.fillRect(x + w*0.15, y + p, w*0.7, h - p*2);
                // door arch
                ctx.fillStyle = COLORS.exitGlow;
                ctx.beginPath();
                ctx.arc(x + w*0.5, y + h*0.35, w*0.25, Math.PI, 0);
                ctx.fillRect(x + w*0.25, y + h*0.35, w*0.5, h*0.5);
                ctx.fill();
                // handle
                ctx.fillStyle = COLORS.coin;
                ctx.beginPath(); ctx.arc(x + w*0.62, y + h*0.55, w*0.05, 0, Math.PI*2); ctx.fill();
                break;
            case T.ENEMY:
                ctx.fillStyle = COLORS.enemy;
                const em = Math.min(w, h) * 0.35;
                const ecx = x + w/2, ecy = y + h/2;
                // body
                ctx.beginPath(); ctx.arc(ecx, ecy, em, 0, Math.PI*2); ctx.fill();
                // eyes
                ctx.fillStyle = COLORS.enemyEye;
                ctx.beginPath(); ctx.arc(ecx - em*0.3, ecy - em*0.15, em*0.2, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(ecx + em*0.3, ecy - em*0.15, em*0.2, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#333';
                ctx.beginPath(); ctx.arc(ecx - em*0.25, ecy - em*0.1, em*0.1, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(ecx + em*0.35, ecy - em*0.1, em*0.1, 0, Math.PI*2); ctx.fill();
                break;
            case T.SPRING:
                ctx.fillStyle = COLORS.spring;
                ctx.fillRect(x + w*0.15, y + h*0.6, w*0.7, h*0.35);
                ctx.fillStyle = COLORS.springLight;
                // coil
                ctx.fillRect(x + w*0.2, y + h*0.3, w*0.6, h*0.12);
                ctx.fillRect(x + w*0.25, y + h*0.45, w*0.5, h*0.12);
                // top
                ctx.fillStyle = '#BBDEFB';
                ctx.fillRect(x + w*0.15, y + h*0.2, w*0.7, h*0.12);
                break;
        }
    }

    function drawToolbar() {
        const ty = GRID_H;
        ctx.fillStyle = COLORS.toolbar;
        ctx.fillRect(0, ty, cw, TOOLBAR_H);
        ctx.strokeStyle = COLORS.toolbarBorder;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(cw, ty); ctx.stroke();

        const btnW = cw / 10;
        const btnH = TOOLBAR_H - 8;
        const by = ty + 4;

        for (let i = 1; i <= 8; i++) {
            const bx = (i - 1) * btnW + 4;
            // highlight selected
            if (selectedTile === i) {
                ctx.fillStyle = COLORS.selected;
                ctx.fillRect(bx, by, btnW - 8, btnH);
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.fillRect(bx, by, btnW - 8, btnH);
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                ctx.fillRect(bx, by, btnW - 8, btnH);
            }
            // draw mini tile
            drawTile(bx + 4, by + 2, btnW - 16, btnH - 10, i, true);
            // key number
            ctx.fillStyle = COLORS.textDim;
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(i.toString(), bx + (btnW - 8)/2, by + btnH - 2);
        }

        // Eraser (0)
        const erX = 8 * btnW + 4;
        if (selectedTile === 0) {
            ctx.fillStyle = COLORS.selected;
            ctx.fillRect(erX, by, btnW - 8, btnH);
        }
        ctx.fillStyle = COLORS.textDim;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧹', erX + (btnW - 8)/2, by + btnH/2 + 5);
        ctx.font = '8px monospace';
        ctx.fillText('0', erX + (btnW - 8)/2, by + btnH - 2);
    }

    // --- Drawing: Play Mode ---
    function drawPlay() {
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, cw, ch);

        // Draw all tiles
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const t = grid[r][c];
                if (t === T.GROUND || t === T.PLATFORM || t === T.SPIKE || t === T.EXIT || t === T.SPRING) {
                    drawTile(c * TILE_W, r * TILE_H, TILE_W, TILE_H, t, false);
                }
            }
        }

        // Draw coins (animated)
        const coinBob = Math.sin(Date.now() * 0.005) * 2;
        for (const coin of coins) {
            if (!coin.collected) {
                drawTile(coin.c * TILE_W, coin.r * TILE_H + coinBob, TILE_W, TILE_H, T.COIN, false);
            }
        }

        // Draw enemies
        for (const en of enemies) {
            const ex = en.x, ey = en.y;
            const em = Math.min(TILE_W, TILE_H) * 0.35;
            ctx.fillStyle = COLORS.enemy;
            ctx.beginPath(); ctx.arc(ex + TILE_W/2, ey + TILE_H/2, em, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = COLORS.enemyEye;
            const dir = en.vx > 0 ? 1 : -1;
            ctx.beginPath(); ctx.arc(ex + TILE_W/2 - em*0.3*dir, ey + TILE_H/2 - em*0.15, em*0.2, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(ex + TILE_W/2 + em*0.3*dir, ey + TILE_H/2 - em*0.15, em*0.2, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#333';
            ctx.beginPath(); ctx.arc(ex + TILE_W/2 - em*0.25*dir, ey + TILE_H/2 - em*0.1, em*0.1, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(ex + TILE_W/2 + em*0.35*dir, ey + TILE_H/2 - em*0.1, em*0.1, 0, Math.PI*2); ctx.fill();
        }

        // Draw start flag (faded)
        const st = findTile(T.START);
        if (st) {
            ctx.globalAlpha = 0.3;
            drawTile(st.c * TILE_W, st.r * TILE_H, TILE_W, TILE_H, T.START, false);
            ctx.globalAlpha = 1;
        }

        // Draw player
        if (player && !levelComplete) {
            const px = player.x, py = player.y;
            const pw = TILE_W * 0.7, ph = TILE_H * 0.85;
            const pcx = px + TILE_W/2, pcy = py + TILE_H/2;

            // Body
            ctx.fillStyle = COLORS.player;
            const cornerR = Math.min(pw, ph) * 0.2;
            ctx.beginPath();
            ctx.moveTo(pcx - pw/2 + cornerR, pcy - ph/2);
            ctx.lineTo(pcx + pw/2 - cornerR, pcy - ph/2);
            ctx.quadraticCurveTo(pcx + pw/2, pcy - ph/2, pcx + pw/2, pcy - ph/2 + cornerR);
            ctx.lineTo(pcx + pw/2, pcy + ph/2 - cornerR);
            ctx.quadraticCurveTo(pcx + pw/2, pcy + ph/2, pcx + pw/2 - cornerR, pcy + ph/2);
            ctx.lineTo(pcx - pw/2 + cornerR, pcy + ph/2);
            ctx.quadraticCurveTo(pcx - pw/2, pcy + ph/2, pcx - pw/2, pcy + ph/2 - cornerR);
            ctx.lineTo(pcx - pw/2, pcy - ph/2 + cornerR);
            ctx.quadraticCurveTo(pcx - pw/2, pcy - ph/2, pcx - pw/2 + cornerR, pcy - ph/2);
            ctx.closePath();
            ctx.fill();

            // Eyes
            const eyeR = pw * 0.12;
            const eyeOff = pw * 0.18;
            const eyeY = pcy - ph * 0.1;
            ctx.fillStyle = COLORS.playerEye;
            ctx.beginPath(); ctx.arc(pcx - eyeOff, eyeY, eyeR, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(pcx + eyeOff, eyeY, eyeR, 0, Math.PI*2); ctx.fill();
            // Pupils
            const pDir = player.vx > 0.5 ? 1 : player.vx < -0.5 ? -1 : 0;
            ctx.fillStyle = COLORS.playerPupil;
            ctx.beginPath(); ctx.arc(pcx - eyeOff + pDir * eyeR * 0.3, eyeY, eyeR * 0.55, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(pcx + eyeOff + pDir * eyeR * 0.3, eyeY, eyeR * 0.55, 0, Math.PI*2); ctx.fill();
        }

        // Death flash
        if (deathFlash > 0) {
            ctx.fillStyle = 'rgba(244,67,54,' + (deathFlash * 0.3) + ')';
            ctx.fillRect(0, 0, cw, ch);
            deathFlash -= 0.05;
        }

        // Level complete overlay
        if (levelComplete) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, cw, ch);
            ctx.fillStyle = COLORS.coin;
            ctx.font = 'bold ' + Math.max(18, cw * 0.05) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🎉 ¡Nivel Completado!', cw/2, ch * 0.35);
            ctx.fillStyle = COLORS.text;
            ctx.font = Math.max(12, cw * 0.03) + 'px sans-serif';
            const elapsed = ((playTime) / 1000).toFixed(1);
            ctx.fillText('Tiempo: ' + elapsed + 's  |  Monedas: ' + coinsCollected + '/' + totalCoins, cw/2, ch * 0.45);
        }

        // HUD
        if (!levelComplete) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, cw, 28);
            ctx.fillStyle = COLORS.text;
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'left';
            const elapsed = ((Date.now() - playStart) / 1000).toFixed(1);
            ctx.fillText('⏱ ' + elapsed + 's', 8, 18);
            ctx.textAlign = 'center';
            ctx.fillText('⭐ ' + coinsCollected + '/' + totalCoins, cw/2, 18);
            ctx.textAlign = 'right';
            ctx.fillText('Flechas/WASD = mover  |  Espacio = saltar', cw - 8, 18);
        }
    }

    // --- Play Mode Logic ---
    let keys = {};

    function initPlayMode() {
        phase = 'play';
        playStart = Date.now();
        playTime = 0;
        coinsCollected = 0;
        levelComplete = false;
        deathFlash = 0;
        keys = {};

        // Find start
        const st = findTile(T.START);
        const startC = st ? st.c : 1;
        const startR = st ? st.r : ROWS - 2;

        player = {
            x: startC * TILE_W,
            y: startR * TILE_H,
            vx: 0,
            vy: 0,
            onGround: false
        };

        // Setup coins
        coins = [];
        totalCoins = 0;
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                if (grid[r][c] === T.COIN) {
                    coins.push({r, c, collected: false});
                    totalCoins++;
                }

        // Setup enemies
        enemies = [];
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                if (grid[r][c] === T.ENEMY) {
                    enemies.push({
                        x: c * TILE_W,
                        y: r * TILE_H,
                        vx: ENEMY_SPEED,
                        startC: c,
                        r: r
                    });
                }

        // Setup springs
        springs = [];
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                if (grid[r][c] === T.SPRING) springs.push({r, c, bounceAnim: 0});

        updateButtons();
    }

    function respawnPlayer() {
        const st = findTile(T.START);
        const startC = st ? st.c : 1;
        const startR = st ? st.r : ROWS - 2;
        player.x = startC * TILE_W;
        player.y = startR * TILE_H;
        player.vx = 0;
        player.vy = 0;
        player.onGround = false;
        deathFlash = 1;
        // Reset coins
        for (const coin of coins) coin.collected = false;
        coinsCollected = 0;
        playStart = Date.now();
    }

    function updatePlay() {
        if (levelComplete || !player) return;

        // Input
        let moveX = 0;
        if (keys['ArrowLeft'] || keys['KeyA']) moveX = -1;
        if (keys['ArrowRight'] || keys['KeyD']) moveX = 1;
        const wantJump = keys['Space'] || keys['ArrowUp'] || keys['KeyW'];

        player.vx = moveX * MOVE_SPEED;

        // Jump
        if (wantJump && player.onGround) {
            player.vy = JUMP_VEL;
            player.onGround = false;
        }

        // Gravity
        player.vy += GRAVITY;
        if (player.vy > 12) player.vy = 12;

        // Move X
        player.x += player.vx;
        // Clamp to bounds
        if (player.x < 0) player.x = 0;
        if (player.x > (COLS - 1) * TILE_W) player.x = (COLS - 1) * TILE_W;

        // X collisions
        resolveCollisionX();

        // Move Y
        player.y += player.vy;
        player.onGround = false;

        // Y collisions
        resolveCollisionY();

        // Fall off screen
        if (player.y > ROWS * TILE_H + 50) {
            respawnPlayer();
            return;
        }

        // Check tile overlaps
        const pcol = Math.floor((player.x + TILE_W * 0.35) / TILE_W);
        const prow = Math.floor((player.y + TILE_H * 0.5) / TILE_H);

        // Check a small area around player
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const cr = prow + dr;
                const cc = pcol + dc;
                if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue;

                const pBox = { x: player.x + TILE_W * 0.15, y: player.y + TILE_H * 0.1, w: TILE_W * 0.7, h: TILE_H * 0.85 };
                const tBox = { x: cc * TILE_W, y: cr * TILE_H, w: TILE_W, h: TILE_H };

                if (!boxOverlap(pBox, tBox)) continue;

                const t = grid[cr][cc];

                // Spikes
                if (t === T.SPIKE) {
                    respawnPlayer();
                    return;
                }

                // Coins
                for (const coin of coins) {
                    if (!coin.collected && coin.r === cr && coin.c === cc) {
                        coin.collected = true;
                        coinsCollected++;
                        addScore(10);
                    }
                }

                // Exit
                if (t === T.EXIT) {
                    levelComplete = true;
                    playTime = Date.now() - playStart;
                    const timeBonus = Math.max(0, 200 - Math.floor(playTime / 1000) * 2);
                    const coinBonus = coinsCollected * 25;
                    addScore(timeBonus + coinBonus + 100);
                    showResult(
                        '🎮 Nivel Completado',
                        score + ' pts',
                        'Monedas: ' + coinsCollected + '/' + totalCoins + ' | Tiempo: ' + (playTime/1000).toFixed(1) + 's'
                    );
                    return;
                }

                // Springs
                for (const sp of springs) {
                    if (sp.r === cr && sp.c === cc && player.vy > 0) {
                        player.vy = SPRING_VEL;
                        player.onGround = false;
                        sp.bounceAnim = 1;
                    }
                }
            }
        }

        // Enemies
        for (const en of enemies) {
            en.x += en.vx;
            // Patrol: reverse on walls or edges
            const eCol = Math.floor((en.x + TILE_W/2) / TILE_W);
            const eRow = en.r;
            // Check wall ahead
            const nextCol = en.vx > 0 ? eCol + 1 : eCol - 1;
            if (nextCol < 0 || nextCol >= COLS || isSolid(nextCol, eRow)) {
                en.vx *= -1;
            }
            // Check floor ahead (don't walk off edges)
            if (!isSolid(nextCol, eRow + 1) && isSolid(eCol, eRow + 1)) {
                en.vx *= -1;
            }
            // Clamp
            if (en.x < 0) { en.x = 0; en.vx *= -1; }
            if (en.x > (COLS - 1) * TILE_W) { en.x = (COLS - 1) * TILE_W; en.vx *= -1; }

            // Check collision with player
            const pBox = { x: player.x + TILE_W * 0.15, y: player.y + TILE_H * 0.1, w: TILE_W * 0.7, h: TILE_H * 0.85 };
            const eBox = { x: en.x + TILE_W * 0.15, y: en.y + TILE_H * 0.15, w: TILE_W * 0.7, h: TILE_H * 0.7 };
            if (boxOverlap(pBox, eBox)) {
                respawnPlayer();
                return;
            }
        }

        playTime = Date.now() - playStart;
    }

    function boxOverlap(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function resolveCollisionX() {
        const pw = TILE_W * 0.7;
        const ph = TILE_H * 0.85;
        const px = player.x + (TILE_W - pw) / 2;
        const py = player.y + (TILE_H - ph) / 2;

        const left = Math.floor(px / TILE_W);
        const right = Math.floor((px + pw - 1) / TILE_W);
        const top = Math.floor(py / TILE_H);
        const bottom = Math.floor((py + ph - 1) / TILE_H);

        for (let r = top; r <= bottom; r++) {
            for (let c = left; c <= right; c++) {
                if (!isSolid(c, r)) continue;
                const tileLeft = c * TILE_W;
                const tileRight = tileLeft + TILE_W;
                if (player.vx > 0) {
                    player.x = tileLeft - TILE_W + (TILE_W - pw)/2 - 0.1;
                } else if (player.vx < 0) {
                    player.x = tileRight - (TILE_W - pw)/2 + 0.1;
                }
                player.vx = 0;
                return;
            }
        }
    }

    function resolveCollisionY() {
        const pw = TILE_W * 0.7;
        const ph = TILE_H * 0.85;
        const px = player.x + (TILE_W - pw) / 2;
        const py = player.y + (TILE_H - ph) / 2;

        const left = Math.floor(px / TILE_W);
        const right = Math.floor((px + pw - 1) / TILE_W);
        const top = Math.floor(py / TILE_H);
        const bottom = Math.floor((py + ph - 1) / TILE_H);

        for (let r = top; r <= bottom; r++) {
            for (let c = left; c <= right; c++) {
                if (!isSolid(c, r)) continue;
                const tileTop = r * TILE_H;
                const tileBottom = tileTop + TILE_H;
                if (player.vy > 0) {
                    player.y = tileTop - TILE_H + (TILE_H - ph)/2 - 0.1;
                    player.vy = 0;
                    player.onGround = true;
                } else if (player.vy < 0) {
                    player.y = tileBottom - (TILE_H - ph)/2 + 0.1;
                    player.vy = 0;
                }
                return;
            }
        }
    }

    // --- Main loop ---
    function loop() {
        if (phase === 'design') {
            drawDesign();
        } else {
            updatePlay();
            drawPlay();
        }
        animFrame = requestAnimationFrame(loop);
    }

    // --- Input: Mouse/Touch ---
    function getGridPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = cw / rect.width;
        const scaleY = ch / rect.height;
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const mx = (clientX - rect.left) * scaleX;
        const my = (clientY - rect.top) * scaleY;
        return {mx, my, col: Math.floor(mx / TILE_W), row: Math.floor(my / TILE_H)};
    }

    function handleCanvasClick(e) {
        if (phase !== 'design') return;
        e.preventDefault();
        const {mx, my, col, row} = getGridPos(e);

        // Check toolbar click
        if (my >= GRID_H) {
            const btnW = cw / 10;
            const idx = Math.floor(mx / btnW);
            if (idx >= 0 && idx < 8) {
                selectedTile = idx + 1;
            } else if (idx === 8) {
                selectedTile = T.EMPTY; // eraser
            }
            return;
        }

        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
        placeTile(col, row);
    }

    function handleCanvasMove(e) {
        if (phase !== 'design') return;
        const {col, row} = getGridPos(e);
        cursorCol = col;
        cursorRow = row;
        useKbCursor = false;
    }

    function placeTile(col, row) {
        // Enforce uniqueness for start/exit
        if (selectedTile === T.START || selectedTile === T.EXIT) {
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS; c++)
                    if (grid[r][c] === selectedTile) grid[r][c] = T.EMPTY;
        }

        if (grid[row][col] === selectedTile) {
            grid[row][col] = T.EMPTY;
        } else {
            grid[row][col] = selectedTile;
        }
    }

    function handleKeyDown(e) {
        const key = e.code;

        if (phase === 'play') {
            keys[key] = true;
            if (key === 'Space' || key === 'ArrowUp' || key === 'ArrowDown') e.preventDefault();
            return;
        }

        // Design mode keyboard
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
            e.preventDefault();
            useKbCursor = true;
            if (key === 'ArrowUp') kbCursorRow = Math.max(0, kbCursorRow - 1);
            if (key === 'ArrowDown') kbCursorRow = Math.min(ROWS - 1, kbCursorRow + 1);
            if (key === 'ArrowLeft') kbCursorCol = Math.max(0, kbCursorCol - 1);
            if (key === 'ArrowRight') kbCursorCol = Math.min(COLS - 1, kbCursorCol + 1);
        }
        if (key === 'Enter') {
            if (useKbCursor) placeTile(kbCursorCol, kbCursorRow);
        }
        if (key === 'Delete' || key === 'Backspace') {
            if (useKbCursor) grid[kbCursorRow][kbCursorCol] = T.EMPTY;
        }
        // Number keys to select tile
        const num = parseInt(e.key);
        if (num >= 0 && num <= 8) {
            selectedTile = num;
        }
    }

    function handleKeyUp(e) {
        keys[e.code] = false;
    }

    // --- Controls / Buttons ---
    function updateButtons() {
        controls.innerHTML = '';

        if (phase === 'design') {
            // Pre-made level buttons
            const levelRow = document.createElement('div');
            levelRow.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:6px;';

            PREMADE_LEVELS.forEach((lv, i) => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-sm';
                btn.textContent = '📋 ' + lv.name;
                btn.title = lv.desc;
                btn.onclick = () => { loadLevel(lv.data); };
                levelRow.appendChild(btn);
            });

            controls.appendChild(levelRow);

            const actionRow = document.createElement('div');
            actionRow.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:center;';

            const clearBtn = document.createElement('button');
            clearBtn.className = 'btn btn-sm';
            clearBtn.textContent = '🗑️ Limpiar Todo';
            clearBtn.onclick = () => { clearGrid(); };
            actionRow.appendChild(clearBtn);

            const playBtn = document.createElement('button');
            playBtn.className = 'btn btn-sm';
            playBtn.style.background = '#4CAF50';
            playBtn.textContent = '▶️ Jugar Nivel';
            playBtn.onclick = () => {
                if (!findTile(T.START)) { alert('¡Coloca un punto de Inicio (5)!'); return; }
                if (!findTile(T.EXIT)) { alert('¡Coloca una Salida (6)!'); return; }
                setScore(0);
                initPlayMode();
            };
            actionRow.appendChild(playBtn);

            controls.appendChild(actionRow);
        } else {
            const actionRow = document.createElement('div');
            actionRow.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:center;';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm';
            editBtn.textContent = '✏️ Editar Nivel';
            editBtn.onclick = () => {
                phase = 'design';
                keys = {};
                updateButtons();
            };
            actionRow.appendChild(editBtn);

            const newBtn = document.createElement('button');
            newBtn.className = 'btn btn-sm';
            newBtn.textContent = '🆕 Nuevo Nivel';
            newBtn.onclick = () => {
                phase = 'design';
                keys = {};
                clearGrid();
                setScore(0);
                updateButtons();
            };
            actionRow.appendChild(newBtn);

            const retryBtn = document.createElement('button');
            retryBtn.className = 'btn btn-sm';
            retryBtn.style.background = '#FF9800';
            retryBtn.textContent = '🔄 Reintentar';
            retryBtn.onclick = () => {
                setScore(0);
                initPlayMode();
            };
            actionRow.appendChild(retryBtn);

            controls.appendChild(actionRow);
        }
    }

    // --- Init ---
    clearGrid();
    // Load first tutorial level by default
    loadLevel(PREMADE_LEVELS[0].data);

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMove);
    canvas.addEventListener('touchstart', handleCanvasClick, {passive: false});
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    updateButtons();
    loop();

    currentGame = {
        cleanup: () => {
            cancelAnimationFrame(animFrame);
            canvas.removeEventListener('click', handleCanvasClick);
            canvas.removeEventListener('mousemove', handleCanvasMove);
            canvas.removeEventListener('touchstart', handleCanvasClick);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            controls.innerHTML = '';
            ui.style.pointerEvents = '';
        }
    };
}
