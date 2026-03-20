// ==========================================
// AGENTE DE VIAJES - Mini-juegos
// ==========================================

const COUNTRIES = {
    europa: [
        {
            flag: '🇫🇷', name: 'Francia', capital: 'Paris',
            highlights: ['Torre Eiffel', 'Louvre', 'Versalles', 'Mont Saint-Michel'],
            cuisine: 'Croissants, queso, crepes',
            bestTime: 'Abril - Octubre',
            budget: '€€€ - Caro',
            tips: ['Aprende frances basico', 'Reserva museos online', 'Usa el metro de Paris'],
            pros: ['Cultura increible', 'Gastronomia mundial', 'Monumentos iconicos', 'Buena red de trenes'],
            cons: ['Muy turistico', 'Precios altos', 'Barreras de idioma', 'Mucha gente en zonas turisticas']
        },
        {
            flag: '🇮🇹', name: 'Italia', capital: 'Roma',
            highlights: ['Coliseo', 'Venecia', 'Florencia', 'Costa Amalfitana'],
            cuisine: 'Pizza, pasta, gelato',
            bestTime: 'Mayo - Septiembre',
            budget: '€€ - Moderado',
            tips: ['Evita restaurantes turisticos', 'Visita al amanecer', 'Compra la Roma Pass'],
            pros: ['Historia milenaria', 'Mejor cocina del mundo', 'Arte en cada esquina', 'Gente muy amable'],
            cons: ['Masificacion turistica', 'Trenes con retrasos', 'Precios altos en zonas turisticas', 'Calor extremo en verano']
        },
        {
            flag: '🇩🇪', name: 'Alemania', capital: 'Berlin',
            highlights: ['Puerta de Brandeburgo', 'Muro de Berlin', 'Castillo Neuschwanstein', 'Selva Negra'],
            cuisine: 'Salchichas, pretzels, pasteles',
            bestTime: 'Mayo - Septiembre (Diciembre para mercadillos)',
            budget: '€€ - Moderado',
            tips: ['Compra billetes de tren con antelacion', 'Lleva efectivo', 'Visita mercadillos navidenos'],
            pros: ['Muy organizado', 'Transporte excelente', 'Limpio y seguro', 'Mercadillos navidenos'],
            cons: ['Clima frio', 'Idioma dificil', 'Domingos todo cerrado', 'Comida repetitiva']
        }
    ],
    asia: [
        {
            flag: '🇯🇵', name: 'Japon', capital: 'Tokio',
            highlights: ['Monte Fuji', 'Templos de Kioto', 'Shibuya', 'Parque de Nara'],
            cuisine: 'Sushi, ramen, takoyaki',
            bestTime: 'Marzo - Mayo (cerezos) / Octubre - Noviembre',
            budget: '€€€ - Caro',
            tips: ['Compra Japan Rail Pass', 'Aprende a usar palillos', 'Respeta las costumbres'],
            pros: ['Cultura fascinante', 'Seguridad maxima', 'Tecnologia avanzada', 'Comida extraordinaria'],
            cons: ['Barrera de idioma', 'Muy caro', 'Puede ser abrumador', 'Poco espacio personal']
        },
        {
            flag: '🇹🇭', name: 'Tailandia', capital: 'Bangkok',
            highlights: ['Templos de Bangkok', 'Islas Phi Phi', 'Chiang Mai', 'Mercados flotantes'],
            cuisine: 'Pad thai, curry, mango sticky rice',
            bestTime: 'Noviembre - Febrero',
            budget: '€ - Barato',
            tips: ['Regatear es normal', 'Respeta los templos', 'Cuidado con el picante'],
            pros: ['Muy barato', 'Playas paradisiacas', 'Gente sonriente', 'Comida callejera increible'],
            cons: ['Calor extremo', 'Muy diferente a Europa', 'Trafico terrible', 'Monzones en verano']
        },
        {
            flag: '🇨🇳', name: 'China', capital: 'Pekin',
            highlights: ['Gran Muralla', 'Ciudad Prohibida', 'Guerreros de Terracota', 'Shanghai'],
            cuisine: 'Dim sum, pato pekin, dumplings',
            bestTime: 'Abril - Mayo / Septiembre - Octubre',
            budget: '€€ - Moderado',
            tips: ['Necesitas VPN', 'Descarga traductor offline', 'Lleva efectivo o WeChat Pay'],
            pros: ['Historia milenaria', 'Paisajes impresionantes', 'Comida variada', 'Precios razonables'],
            cons: ['Barrera de idioma enorme', 'Internet diferente', 'Mucha contaminacion en ciudades', 'Masificacion']
        }
    ],
    america: [
        {
            flag: '🇺🇸', name: 'Estados Unidos', capital: 'Washington D.C.',
            highlights: ['Nueva York', 'Gran Canon', 'Los Angeles', 'Parques Disney'],
            cuisine: 'Hamburguesas, BBQ, apple pie',
            bestTime: 'Depende del estado - todo el ano',
            budget: '€€€ - Caro',
            tips: ['Necesitas ESTA', 'Alquila coche', 'Propinas obligatorias (15-20%)'],
            pros: ['Diversidad enorme', 'Parques nacionales', 'Entretenimiento', 'Compras'],
            cons: ['Muy caro', 'Necesitas coche', 'Sistema sanitario caro', 'Distancias enormes']
        },
        {
            flag: '🇲🇽', name: 'Mexico', capital: 'Ciudad de Mexico',
            highlights: ['Chichen Itza', 'Cancun', 'Oaxaca', 'Ciudad de Mexico'],
            cuisine: 'Tacos, mole, guacamole',
            bestTime: 'Noviembre - Abril',
            budget: '€ - Barato',
            tips: ['Bebe agua embotellada', 'Aprende espanol basico', 'Viaja siempre con un adulto'],
            pros: ['Cultura rica', 'Comida increible', 'Playas hermosas', 'Muy barato'],
            cons: ['Calor intenso', 'Mucha gente en zonas turisticas', 'Distancias largas', 'Mejor beber agua embotellada']
        },
        {
            flag: '🇧🇷', name: 'Brasil', capital: 'Brasilia',
            highlights: ['Cristo Redentor', 'Cataratas de Iguazu', 'Amazonia', 'Copacabana'],
            cuisine: 'Feijoada, churrasco, acai',
            bestTime: 'Mayo - Septiembre (o Febrero para Carnaval)',
            budget: '€€ - Moderado',
            tips: ['Usa proteccion solar', 'Aprende portugues basico', 'Viaja siempre acompanado'],
            pros: ['Naturaleza espectacular', 'Gente alegre', 'Musica y carnaval', 'Playas increibles'],
            cons: ['Distancias enormes', 'Mucho calor', 'Mosquitos', 'Hay que planificar bien']
        }
    ],
    africa: [
        {
            flag: '🇲🇦', name: 'Marruecos', capital: 'Rabat',
            highlights: ['Marrakech', 'Desierto del Sahara', 'Fez', 'Chefchaouen (ciudad azul)'],
            cuisine: 'Tajin, cuscus, te de menta',
            bestTime: 'Marzo - Mayo / Septiembre - Noviembre',
            budget: '€ - Barato',
            tips: ['Regatear siempre', 'Viste con respeto', 'No te pierdas el hammam'],
            pros: ['Cultura exotica', 'Muy barato', 'Cerca de Europa', 'Gastronomia unica'],
            cons: ['Mucha gente en los zocos', 'Regateo agotador', 'Calor extremo', 'Muy diferente a Europa']
        },
        {
            flag: '🇰🇪', name: 'Kenia', capital: 'Nairobi',
            highlights: ['Safari Masai Mara', 'Monte Kenia', 'Mombasa', 'Lago Nakuru'],
            cuisine: 'Nyama choma, ugali, chapati',
            bestTime: 'Julio - Octubre (gran migracion)',
            budget: '€€ - Moderado (safaris caros)',
            tips: ['Reserva safari con guia', 'Vacunas obligatorias', 'Lleva proteccion solar'],
            pros: ['Safaris increibles', 'Naturaleza salvaje', 'Gente amable', 'Paisajes unicos'],
            cons: ['Safaris muy caros', 'Necesitas vacunas', 'Infraestructura limitada', 'Lejos de Europa']
        },
        {
            flag: '🇿🇦', name: 'Sudafrica', capital: 'Pretoria',
            highlights: ['Ciudad del Cabo', 'Kruger Park', 'Ruta Jardin', 'Robben Island'],
            cuisine: 'Biltong, braai, bobotie',
            bestTime: 'Septiembre - Noviembre',
            budget: '€€ - Moderado',
            tips: ['Alquila coche', 'Viaja siempre acompanado', 'Visita los jardines de Kirstenbosch'],
            pros: ['Paisajes variados', 'Animales increibles', 'Safaris accesibles', 'Ciudad del Cabo es increible'],
            cons: ['Muy lejos de Europa', 'Distancias largas', 'Clima muy variable', 'Necesitas coche']
        }
    ]
};

function startViajes(subtype) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    ui.style.pointerEvents = 'auto';

    const countries = COUNTRIES[subtype] || COUNTRIES.europa;
    let totalScore = 0;
    let countryIdx = 0;

    function showCountryList() {
        ui.innerHTML = `
            <div class="country-cards" id="country-list">
                <div style="text-align: center; color: #aaa; font-size: 0.8rem; padding: 10px;">
                    Selecciona un pais para planificar el viaje
                </div>
            </div>
        `;

        const list = document.getElementById('country-list');
        countries.forEach((c, i) => {
            const card = document.createElement('div');
            card.className = 'country-card fade-in';
            card.innerHTML = `
                <div class="country-flag">${c.flag}</div>
                <h3>${c.name}</h3>
                <p>Capital: ${c.capital} | ${c.budget}</p>
            `;
            card.onclick = () => showCountryDetail(c);
            list.appendChild(card);
        });
    }

    function showCountryDetail(country) {
        ui.innerHTML = `
            <div class="eval-section fade-in">
                <div style="text-align: center; margin-bottom: 16px;">
                    <div style="font-size: 4rem;">${country.flag}</div>
                    <h2 style="margin-top: 8px;">${country.name}</h2>
                    <p style="color: #888; font-size: 0.85rem;">Capital: ${country.capital}</p>
                </div>

                <div class="eval-item eval-neutral">
                    <div class="label">Que ver</div>
                    <div class="value">${country.highlights.join(' • ')}</div>
                </div>

                <div class="eval-item eval-neutral">
                    <div class="label">Gastronomia</div>
                    <div class="value">${country.cuisine}</div>
                </div>

                <div class="eval-item eval-neutral">
                    <div class="label">Mejor epoca</div>
                    <div class="value">${country.bestTime}</div>
                </div>

                <div class="eval-item eval-neutral">
                    <div class="label">Presupuesto</div>
                    <div class="value">${country.budget}</div>
                </div>

                <div class="eval-item eval-neutral">
                    <div class="label">Consejos</div>
                    <div class="value">${country.tips.map(t => '• ' + t).join('<br>')}</div>
                </div>

                <h3 style="margin: 16px 0 8px; color: #43e97b;">✅ Puntos fuertes</h3>
                ${country.pros.map(p => `<div class="eval-item eval-good"><div class="value" style="font-size: 0.85rem;">👍 ${p}</div></div>`).join('')}

                <h3 style="margin: 16px 0 8px; color: #ff512f;">❌ Puntos debiles</h3>
                ${country.cons.map(c => `<div class="eval-item eval-bad"><div class="value" style="font-size: 0.85rem;">👎 ${c}</div></div>`).join('')}

                <div style="margin-top: 20px; text-align: center;">
                    <h3>¿Como puntuarias este destino?</h3>
                    <div style="display: flex; justify-content: center; gap: 12px; margin-top: 12px;" id="rating-stars"></div>
                </div>
            </div>
        `;

        const starsEl = document.getElementById('rating-stars');
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '⭐';
            star.style.cssText = 'font-size: 2rem; cursor: pointer; transition: transform 0.2s; opacity: 0.4;';
            star.onmouseenter = () => {
                starsEl.querySelectorAll('span').forEach((s, idx) => {
                    s.style.opacity = idx < i ? '1' : '0.4';
                });
            };
            star.onclick = () => {
                addScore(i * 5);
                // Show quiz after rating
                showQuiz(country);
            };
            starsEl.appendChild(star);
        }

        controls.innerHTML = `
            <button class="control-btn" onclick="document.getElementById('game-ui').querySelector('.eval-section').scrollTop = 0" style="flex:1;">⬆️ Arriba</button>
            <button class="control-btn" id="btn-back-countries" style="flex:1;">← Otros paises</button>
        `;
        document.getElementById('btn-back-countries').onclick = showCountryList;
    }

    function showQuiz(country) {
        const questions = [
            { q: `¿Cual es la capital de ${country.name}?`, correct: country.capital, options: shuffleArray([country.capital, ...countries.filter(c => c.name !== country.name).map(c => c.capital)]).slice(0, 4) },
            { q: `¿Cual es la mejor epoca para visitar?`, correct: country.bestTime, options: shuffleArray([country.bestTime, 'Enero - Marzo', 'Todo el ano', 'Solo en diciembre']).slice(0, 4) },
            { q: `¿Que presupuesto necesitas?`, correct: country.budget, options: shuffleArray([country.budget, '€ - Barato', '€€ - Moderado', '€€€ - Caro']).slice(0, 4) }
        ];

        let qIdx = 0;
        let correct = 0;

        function showQuestion() {
            if (qIdx >= questions.length) {
                addScore(correct * 15);
                showResult('Evaluacion completada', `${correct}/${questions.length}`,
                    correct === 3 ? 'Experto en ' + country.name + '!' : 'Repasa la info de ' + country.name,
                    () => showCountryList()
                );
                return;
            }

            const q = questions[qIdx];
            ui.innerHTML = `
                <div style="padding: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; justify-content: center;">
                    <div style="text-align: center; font-size: 3rem;">${country.flag}</div>
                    <h3 style="text-align: center;">Pregunta ${qIdx + 1}</h3>
                    <p style="text-align: center; color: #aaa;">${q.q}</p>
                    <div style="display: flex; flex-direction: column; gap: 8px;" id="quiz-options"></div>
                </div>
            `;

            const optionsEl = document.getElementById('quiz-options');
            const uniqueOptions = [...new Set(q.options)];
            uniqueOptions.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'control-btn';
                btn.style.width = '100%';
                btn.textContent = opt;
                btn.onclick = () => {
                    if (opt === q.correct) {
                        correct++;
                        btn.style.background = 'linear-gradient(135deg, #43e97b88, #38f9d788)';
                    } else {
                        btn.style.background = 'linear-gradient(135deg, #ff512f88, #f0932288)';
                    }
                    optionsEl.querySelectorAll('button').forEach(b => b.onclick = null);
                    setTimeout(() => { qIdx++; showQuestion(); }, 1000);
                };
                optionsEl.appendChild(btn);
            });
        }

        showQuestion();
    }

    showCountryList();
    currentGame = { cleanup: () => { ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}
