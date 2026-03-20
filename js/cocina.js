// ==========================================
// COCINA - Mini-juegos
// ==========================================

const RECIPES = {
    espanola: [
        {
            name: 'Tortilla Espanola',
            steps: ['Pelar y cortar patatas', 'Freir patatas en aceite', 'Batir huevos', 'Mezclar patatas con huevo', 'Cuajar en sarten', 'Dar la vuelta', 'Servir en plato'],
            ingredients: [
                { icon: '🥔', name: 'Patatas' }, { icon: '🥚', name: 'Huevos' },
                { icon: '🫒', name: 'Aceite' }, { icon: '🧅', name: 'Cebolla' }, { icon: '🧂', name: 'Sal' }
            ]
        },
        {
            name: 'Paella Valenciana',
            steps: ['Sofreir pollo y conejo', 'Anadir judia verde y garrofon', 'Anadir tomate rallado', 'Verter agua y hervir', 'Anadir arroz', 'Cocer 18 minutos', 'Dejar reposar y servir'],
            ingredients: [
                { icon: '🍗', name: 'Pollo' }, { icon: '🐰', name: 'Conejo' },
                { icon: '🍚', name: 'Arroz' }, { icon: '🫘', name: 'Judias' },
                { icon: '🍅', name: 'Tomate' }, { icon: '🧂', name: 'Sal' }
            ]
        }
    ],
    italiana: [
        {
            name: 'Pizza Margherita',
            steps: ['Preparar la masa', 'Estirar la masa', 'Anadir salsa de tomate', 'Colocar mozzarella', 'Anadir albahaca', 'Hornear a 250°C', 'Servir caliente'],
            ingredients: [
                { icon: '🫓', name: 'Masa' }, { icon: '🍅', name: 'Tomate' },
                { icon: '🧀', name: 'Mozzarella' }, { icon: '🌿', name: 'Albahaca' }, { icon: '🫒', name: 'Aceite' }
            ]
        },
        {
            name: 'Pasta Carbonara',
            steps: ['Hervir agua con sal', 'Cocer espaguetis al dente', 'Freir panceta', 'Mezclar huevo con queso', 'Escurrir pasta', 'Mezclar con panceta y salsa', 'Servir con pimienta'],
            ingredients: [
                { icon: '🍝', name: 'Espaguetis' }, { icon: '🥓', name: 'Panceta' },
                { icon: '🥚', name: 'Huevo' }, { icon: '🧀', name: 'Queso' }, { icon: '🌶️', name: 'Pimienta' }
            ]
        }
    ],
    japonesa: [
        {
            name: 'Sushi Maki',
            steps: ['Cocer arroz para sushi', 'Anadir vinagre de arroz', 'Colocar alga nori', 'Extender arroz sobre nori', 'Colocar salmon y aguacate', 'Enrollar con esterilla', 'Cortar en piezas'],
            ingredients: [
                { icon: '🍚', name: 'Arroz' }, { icon: '🐟', name: 'Salmon' },
                { icon: '🥑', name: 'Aguacate' }, { icon: '🟢', name: 'Wasabi' }, { icon: '🫗', name: 'Vinagre' }
            ]
        },
        {
            name: 'Ramen',
            steps: ['Preparar caldo dashi', 'Cocer fideos ramen', 'Preparar huevo marinado', 'Cortar chashu (cerdo)', 'Montar bowl con fideos', 'Anadir caldo caliente', 'Decorar con nori y cebolleta'],
            ingredients: [
                { icon: '🍜', name: 'Fideos' }, { icon: '🍖', name: 'Cerdo' },
                { icon: '🥚', name: 'Huevo' }, { icon: '🧅', name: 'Cebolleta' }, { icon: '🫗', name: 'Caldo' }
            ]
        }
    ],
    pasteleria: [
        {
            name: 'Tarta de Chocolate',
            steps: ['Derretir chocolate al bano maria', 'Mezclar mantequilla con azucar', 'Anadir huevos uno a uno', 'Incorporar harina tamizada', 'Anadir chocolate derretido', 'Hornear 30 min a 180°C', 'Decorar con ganache'],
            ingredients: [
                { icon: '🍫', name: 'Chocolate' }, { icon: '🧈', name: 'Mantequilla' },
                { icon: '🥚', name: 'Huevos' }, { icon: '🌾', name: 'Harina' }, { icon: '🍬', name: 'Azucar' }
            ]
        },
        {
            name: 'Galletas',
            steps: ['Mezclar mantequilla y azucar', 'Anadir huevo y vainilla', 'Incorporar harina y levadura', 'Anadir chips de chocolate', 'Formar bolitas en bandeja', 'Hornear 12 min a 180°C', 'Dejar enfriar'],
            ingredients: [
                { icon: '🧈', name: 'Mantequilla' }, { icon: '🍬', name: 'Azucar' },
                { icon: '🥚', name: 'Huevo' }, { icon: '🌾', name: 'Harina' }, { icon: '🍫', name: 'Chips choc' }
            ]
        }
    ]
};

function startCocina(subtype) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    ui.style.pointerEvents = 'auto';

    const recipeList = RECIPES[subtype] || RECIPES.espanola;
    const recipe = randomFrom(recipeList);

    let currentStep = 0;
    const shuffledSteps = shuffleArray(recipe.steps);

    ui.innerHTML = `
        <div class="recipe-area">
            <div style="text-align: center; margin-bottom: 8px;">
                <div style="font-size: 2.5rem;">${subtype === 'pasteleria' ? '🎂' : subtype === 'japonesa' ? '🍣' : subtype === 'italiana' ? '🍕' : '🥘'}</div>
                <h3 style="margin-top: 4px;">${recipe.name}</h3>
                <p style="color: #888; font-size: 0.75rem;">Sigue los pasos en el orden correcto</p>
            </div>
            <div id="recipe-progress"></div>
            <div style="margin-top: 12px; font-size: 0.85rem; color: #667eea; text-align: center;" id="step-label">Paso 1: ¿Que haces primero?</div>
            <div id="step-options" style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;"></div>
        </div>
    `;

    // Show ingredients
    controls.innerHTML = '<div class="ingredients-shelf" id="ing-shelf"></div>';
    const shelf = document.getElementById('ing-shelf');
    recipe.ingredients.forEach(ing => {
        const item = document.createElement('div');
        item.className = 'ingredient-item';
        item.innerHTML = `<span class="ing-icon">${ing.icon}</span><span class="ing-name">${ing.name}</span>`;
        shelf.appendChild(item);
    });

    function renderStep() {
        const progress = document.getElementById('recipe-progress');
        progress.innerHTML = recipe.steps.map((s, i) => `
            <div class="recipe-step ${i < currentStep ? 'done' : ''}">
                <div class="step-num">${i < currentStep ? '✓' : i + 1}</div>
                <div class="step-text">${i < currentStep ? s : '???'}</div>
            </div>
        `).join('');

        if (currentStep >= recipe.steps.length) {
            addScore(30);
            const stars = score >= 100 ? 5 : score >= 70 ? 4 : score >= 40 ? 3 : 2;
            let starsHtml = '';
            for (let i = 0; i < 5; i++) starsHtml += `<span class="star ${i < stars ? 'filled' : 'empty'}">★</span>`;
            showResult('Plato completado!', `<div class="stars">${starsHtml}</div>`,
                `Has preparado ${recipe.name} correctamente.`, () => startCocina(subtype));
            return;
        }

        const remaining = recipe.steps.filter((_, i) => i >= currentStep);
        const options = shuffleArray(remaining).slice(0, Math.min(4, remaining.length));
        const optionsEl = document.getElementById('step-options');
        const stepLabel = document.getElementById('step-label');

        optionsEl.innerHTML = '';
        stepLabel.textContent = `Paso ${currentStep + 1}: ¿Que toca ahora?`;

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'control-btn';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === recipe.steps[currentStep]) {
                    addScore(15);
                    btn.style.background = 'linear-gradient(135deg, #43e97b88, #38f9d788)';
                    currentStep++;
                    setTimeout(renderStep, 600);
                } else {
                    btn.style.background = 'linear-gradient(135deg, #ff512f88, #f0932288)';
                    addScore(-5);
                    setTimeout(() => { btn.style.background = ''; }, 500);
                }
            };
            optionsEl.appendChild(btn);
        });
    }

    renderStep();
    currentGame = { cleanup: () => { ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}
