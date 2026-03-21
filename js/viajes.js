// ==========================================
// AGENTE DE VIAJES - Simulador interactivo
// ==========================================

const COUNTRIES = {
    europa: [
        {
            flag: '🇫🇷', name: 'Francia', capital: 'París',
            highlights: ['Torre Eiffel', 'Louvre', 'Versalles', 'Mont Saint-Michel'],
            cuisine: 'Croissants, queso, crepes',
            bestTime: 'Abril - Octubre',
            budget: '€€€ - Caro',
            tags: ['cultura', 'gastronomia', 'monumentos', 'ciudad'],
            tips: ['Aprende francés básico', 'Reserva museos online', 'Usa el metro de París'],
            pros: ['Cultura increíble', 'Gastronomía mundial', 'Monumentos icónicos', 'Buena red de trenes'],
            cons: ['Muy turístico', 'Precios altos', 'Barreras de idioma', 'Mucha gente en zonas turísticas']
        },
        {
            flag: '🇮🇹', name: 'Italia', capital: 'Roma',
            highlights: ['Coliseo', 'Venecia', 'Florencia', 'Costa Amalfitana'],
            cuisine: 'Pizza, pasta, gelato',
            bestTime: 'Mayo - Septiembre',
            budget: '€€ - Moderado',
            tags: ['historia', 'gastronomia', 'playa', 'arte'],
            tips: ['Evita restaurantes turísticos', 'Visita al amanecer', 'Compra la Roma Pass'],
            pros: ['Historia milenaria', 'Mejor cocina del mundo', 'Arte en cada esquina', 'Gente muy amable'],
            cons: ['Masificación turística', 'Trenes con retrasos', 'Precios altos en zonas turísticas', 'Calor extremo en verano']
        },
        {
            flag: '🇩🇪', name: 'Alemania', capital: 'Berlín',
            highlights: ['Puerta de Brandeburgo', 'Muro de Berlín', 'Castillo Neuschwanstein', 'Selva Negra'],
            cuisine: 'Salchichas, pretzels, pasteles',
            bestTime: 'Mayo - Septiembre (Diciembre para mercadillos)',
            budget: '€€ - Moderado',
            tags: ['historia', 'naturaleza', 'navidad', 'ciudad'],
            tips: ['Compra billetes de tren con antelación', 'Lleva efectivo', 'Visita mercadillos navideños'],
            pros: ['Muy organizado', 'Transporte excelente', 'Limpio y seguro', 'Mercadillos navideños'],
            cons: ['Clima frío', 'Idioma difícil', 'Domingos todo cerrado', 'Comida repetitiva']
        }
    ],
    asia: [
        {
            flag: '🇯🇵', name: 'Japón', capital: 'Tokio',
            highlights: ['Monte Fuji', 'Templos de Kioto', 'Shibuya', 'Parque de Nara'],
            cuisine: 'Sushi, ramen, takoyaki',
            bestTime: 'Marzo - Mayo (cerezos) / Octubre - Noviembre',
            budget: '€€€ - Caro',
            tags: ['cultura', 'tecnologia', 'naturaleza', 'gastronomia'],
            tips: ['Compra Japan Rail Pass', 'Aprende a usar palillos', 'Respeta las costumbres'],
            pros: ['Cultura fascinante', 'Seguridad máxima', 'Tecnología avanzada', 'Comida extraordinaria'],
            cons: ['Barrera de idioma', 'Muy caro', 'Puede ser abrumador', 'Poco espacio personal']
        },
        {
            flag: '🇹🇭', name: 'Tailandia', capital: 'Bangkok',
            highlights: ['Templos de Bangkok', 'Islas Phi Phi', 'Chiang Mai', 'Mercados flotantes'],
            cuisine: 'Pad thai, curry, mango sticky rice',
            bestTime: 'Noviembre - Febrero',
            budget: '€ - Barato',
            tags: ['playa', 'gastronomia', 'barato', 'templos'],
            tips: ['Regatear es normal', 'Respeta los templos', 'Cuidado con el picante'],
            pros: ['Muy barato', 'Playas paradisíacas', 'Gente sonriente', 'Comida callejera increíble'],
            cons: ['Calor extremo', 'Muy diferente a Europa', 'Tráfico terrible', 'Monzones en verano']
        },
        {
            flag: '🇨🇳', name: 'China', capital: 'Pekin',
            highlights: ['Gran Muralla', 'Ciudad Prohibida', 'Guerreros de Terracota', 'Shanghai'],
            cuisine: 'Dim sum, pato pekín, dumplings',
            bestTime: 'Abril - Mayo / Septiembre - Octubre',
            budget: '€€ - Moderado',
            tags: ['historia', 'cultura', 'monumentos', 'gastronomia'],
            tips: ['Necesitas VPN', 'Descarga traductor offline', 'Lleva efectivo o WeChat Pay'],
            pros: ['Historia milenaria', 'Paisajes impresionantes', 'Comida variada', 'Precios razonables'],
            cons: ['Barrera de idioma enorme', 'Internet diferente', 'Mucha contaminación en ciudades', 'Masificación']
        }
    ],
    america: [
        {
            flag: '🇺🇸', name: 'Estados Unidos', capital: 'Washington D.C.',
            highlights: ['Nueva York', 'Gran Cañón', 'Los Ángeles', 'Parques Disney'],
            cuisine: 'Hamburguesas, BBQ, apple pie',
            bestTime: 'Depende del estado - todo el año',
            budget: '€€€ - Caro',
            tags: ['ciudad', 'naturaleza', 'entretenimiento', 'compras'],
            tips: ['Necesitas ESTA', 'Alquila coche', 'Propinas obligatorias (15-20%)'],
            pros: ['Diversidad enorme', 'Parques nacionales', 'Entretenimiento', 'Compras'],
            cons: ['Muy caro', 'Necesitas coche', 'Sistema sanitario caro', 'Distancias enormes']
        },
        {
            flag: '🇲🇽', name: 'México', capital: 'Ciudad de México',
            highlights: ['Chichén Itzá', 'Cancún', 'Oaxaca', 'Ciudad de México'],
            cuisine: 'Tacos, mole, guacamole',
            bestTime: 'Noviembre - Abril',
            budget: '€ - Barato',
            tags: ['playa', 'gastronomia', 'historia', 'barato'],
            tips: ['Bebe agua embotellada', 'Aprende español básico', 'Viaja siempre con un adulto'],
            pros: ['Cultura rica', 'Comida increíble', 'Playas hermosas', 'Muy barato'],
            cons: ['Calor intenso', 'Mucha gente en zonas turísticas', 'Distancias largas', 'Mejor beber agua embotellada']
        },
        {
            flag: '🇧🇷', name: 'Brasil', capital: 'Brasilia',
            highlights: ['Cristo Redentor', 'Cataratas de Iguazú', 'Amazonia', 'Copacabana'],
            cuisine: 'Feijoada, churrasco, acai',
            bestTime: 'Mayo - Septiembre (o Febrero para Carnaval)',
            budget: '€€ - Moderado',
            tags: ['playa', 'naturaleza', 'fiesta', 'aventura'],
            tips: ['Usa protección solar', 'Aprende portugués básico', 'Viaja siempre acompañado'],
            pros: ['Naturaleza espectacular', 'Gente alegre', 'Música y carnaval', 'Playas increíbles'],
            cons: ['Distancias enormes', 'Mucho calor', 'Mosquitos', 'Hay que planificar bien']
        }
    ],
    africa: [
        {
            flag: '🇲🇦', name: 'Marruecos', capital: 'Rabat',
            highlights: ['Marrakech', 'Desierto del Sahara', 'Fez', 'Chefchaouen (ciudad azul)'],
            cuisine: 'Tajín, cuscús, té de menta',
            bestTime: 'Marzo - Mayo / Septiembre - Noviembre',
            budget: '€ - Barato',
            tags: ['cultura', 'barato', 'gastronomia', 'aventura'],
            tips: ['Regatear siempre', 'Viste con respeto', 'No te pierdas el hammam'],
            pros: ['Cultura exótica', 'Muy barato', 'Cerca de Europa', 'Gastronomía única'],
            cons: ['Mucha gente en los zocos', 'Regateo agotador', 'Calor extremo', 'Muy diferente a Europa']
        },
        {
            flag: '🇰🇪', name: 'Kenia', capital: 'Nairobi',
            highlights: ['Safari Masai Mara', 'Monte Kenia', 'Mombasa', 'Lago Nakuru'],
            cuisine: 'Nyama choma, ugali, chapati',
            bestTime: 'Julio - Octubre (gran migración)',
            budget: '€€ - Moderado (safaris caros)',
            tags: ['safari', 'naturaleza', 'aventura', 'animales'],
            tips: ['Reserva safari con guía', 'Vacunas obligatorias', 'Lleva protección solar'],
            pros: ['Safaris increíbles', 'Naturaleza salvaje', 'Gente amable', 'Paisajes únicos'],
            cons: ['Safaris muy caros', 'Necesitas vacunas', 'Infraestructura limitada', 'Lejos de Europa']
        },
        {
            flag: '🇿🇦', name: 'Sudáfrica', capital: 'Pretoria',
            highlights: ['Ciudad del Cabo', 'Kruger Park', 'Ruta Jardín', 'Robben Island'],
            cuisine: 'Biltong, braai, bobotie',
            bestTime: 'Septiembre - Noviembre',
            budget: '€€ - Moderado',
            tags: ['safari', 'naturaleza', 'ciudad', 'aventura'],
            tips: ['Alquila coche', 'Viaja siempre acompañado', 'Visita los jardines de Kirstenbosch'],
            pros: ['Paisajes variados', 'Animales increíbles', 'Safaris accesibles', 'Ciudad del Cabo es increíble'],
            cons: ['Muy lejos de Europa', 'Distancias largas', 'Clima muy variable', 'Necesitas coche']
        }
    ]
};

// Client requests for the travel agent simulator
const CLIENT_REQUESTS = [
    { text: 'Quiero playa y buena comida, sin gastar mucho', tags: ['playa', 'gastronomia', 'barato'], icon: '🏖️' },
    { text: 'Me encanta la historia antigua y los monumentos', tags: ['historia', 'monumentos', 'cultura'], icon: '🏛️' },
    { text: 'Busco aventura y naturaleza salvaje', tags: ['aventura', 'naturaleza', 'safari'], icon: '🌿' },
    { text: 'Quiero ver animales en libertad!', tags: ['safari', 'animales', 'naturaleza'], icon: '🦁' },
    { text: 'Me gusta la tecnologia y la cultura moderna', tags: ['tecnologia', 'ciudad', 'cultura'], icon: '🤖' },
    { text: 'Busco un viaje barato con cultura diferente', tags: ['barato', 'cultura', 'gastronomia'], icon: '💰' },
    { text: 'Quiero una ciudad grande con mucho que hacer', tags: ['ciudad', 'entretenimiento', 'compras'], icon: '🏙️' },
    { text: 'Me apasiona la gastronomia y probar platos nuevos', tags: ['gastronomia', 'cultura'], icon: '🍜' },
    { text: 'Busco playas paradisiacas y relax total', tags: ['playa', 'barato', 'naturaleza'], icon: '🌴' },
    { text: 'Quiero ver templos y lugares espirituales', tags: ['templos', 'cultura', 'historia'], icon: '🛕' },
    { text: 'Busco naturaleza impresionante y paisajes unicos', tags: ['naturaleza', 'aventura'], icon: '🏔️' },
    { text: 'Quiero arte, museos y mucha cultura', tags: ['arte', 'cultura', 'ciudad', 'monumentos'], icon: '🎨' }
];

function startViajes(subtype) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    ui.style.pointerEvents = 'auto';

    const countries = COUNTRIES[subtype] || COUNTRIES.europa;
    // Also include some from other regions for variety
    const allCountries = Object.values(COUNTRIES).flat();
    viajesAgentSimulator(ui, controls, countries, allCountries);
}

// ============================================================
// Travel Agent Simulator - Canvas-based interactive game
// ============================================================
function viajesAgentSimulator(ui, controls, regionCountries, allCountries) {
    const canvas = document.getElementById('game-canvas');
    const container = document.getElementById('game-container');
    canvas.style.display = 'block';
    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    canvas.style.width = container.clientWidth + 'px';
    canvas.style.height = container.clientHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = container.clientWidth;
    const H = container.clientHeight;

    let running = true;
    let animTimer = 0;
    let clientIdx = 0;
    let correct = 0;
    const totalClients = 6;
    let hoveredCard = -1;
    let selectedCard = -1;
    let resultAnim = null; // { type: 'correct'|'wrong', age, country }
    let stampAnims = []; // { flag, x, y, age, rot }
    let deskItems = []; // decorative desk items

    // Generate client sequence
    const clients = shuffleArray(CLIENT_REQUESTS).slice(0, totalClients);

    // For each client, pick the best matching country + some distractors
    function getOptionsForClient(client) {
        // Score each country by tag overlap
        const scored = allCountries.map(c => {
            const tags = c.tags || [];
            const overlap = client.tags.filter(t => tags.includes(t)).length;
            return { country: c, score: overlap };
        });
        scored.sort((a, b) => b.score - a.score);

        const best = scored[0].country;
        // Pick 2 distractors from different scores
        const distractors = scored.filter(s => s.country.name !== best.name && s.score < scored[0].score)
            .slice(0, 5);
        const picked = shuffleArray(distractors).slice(0, 2).map(s => s.country);
        picked.push(best);
        return { options: shuffleArray(picked), correct: best };
    }

    let currentOptions = null;

    function setupClient() {
        if (clientIdx >= totalClients) return;
        currentOptions = getOptionsForClient(clients[clientIdx]);
    }

    // --- Drawing functions ---

    function drawDesk() {
        // Desk surface
        const deskY = H * 0.62;
        ctx.save();
        const deskGrad = ctx.createLinearGradient(0, deskY, 0, H);
        deskGrad.addColorStop(0, 'rgba(60,45,30,0.6)');
        deskGrad.addColorStop(1, 'rgba(40,30,20,0.8)');
        ctx.fillStyle = deskGrad;
        ctx.fillRect(0, deskY, W, H - deskY);

        // Desk edge
        ctx.fillStyle = 'rgba(80,60,40,0.8)';
        ctx.fillRect(0, deskY, W, 4);

        // Computer monitor
        ctx.fillStyle = 'rgba(30,35,45,0.8)';
        ctx.strokeStyle = 'rgba(100,110,130,0.5)';
        ctx.lineWidth = 2;
        _roundRect(ctx, 10, deskY - 70, 70, 55, 5);
        ctx.fill(); ctx.stroke();
        // Screen glow
        ctx.fillStyle = 'rgba(100,200,255,0.1)';
        _roundRect(ctx, 14, deskY - 66, 62, 47, 3);
        ctx.fill();
        // Monitor stand
        ctx.fillStyle = 'rgba(60,65,75,0.6)';
        ctx.fillRect(38, deskY - 15, 14, 16);
        ctx.fillRect(28, deskY - 2, 34, 4);

        // Phone
        ctx.fillStyle = 'rgba(40,40,50,0.7)';
        _roundRect(ctx, W - 65, deskY - 30, 50, 28, 4);
        ctx.fill();
        ctx.fillStyle = 'rgba(80,80,100,0.5)';
        ctx.beginPath(); ctx.arc(W - 40, deskY - 16, 8, 0, Math.PI * 2); ctx.fill();

        // Brochures stack
        const colors = ['rgba(255,100,100,0.3)', 'rgba(100,200,100,0.3)', 'rgba(100,150,255,0.3)'];
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = colors[i];
            _roundRect(ctx, W - 60 + i * 4, deskY + 10 + i * 3, 40, 25, 2);
            ctx.fill();
        }

        // Passport stamps collection (from correct answers)
        stampAnims.forEach(s => {
            ctx.save();
            ctx.globalAlpha = Math.min(1, s.age * 2);
            ctx.translate(s.x, s.y);
            ctx.rotate(s.rot);
            ctx.font = `${18 + (s.age < 0.3 ? (0.3 - s.age) * 20 : 0)}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText(s.flag, 0, 0);
            ctx.restore();
        });

        ctx.restore();
    }

    function drawClient() {
        if (clientIdx >= totalClients) return;
        const client = clients[clientIdx];

        // Client avatar
        ctx.save();
        ctx.font = '42px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧑', W * 0.12, H * 0.14);

        // Speech bubble
        const bx = W * 0.22;
        const by = H * 0.03;
        const bw = W * 0.74;
        const bh = H * 0.15;

        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        _roundRect(ctx, bx, by, bw, bh, 14);
        ctx.fill(); ctx.stroke();

        // Bubble tail
        ctx.beginPath();
        ctx.moveTo(bx, by + bh * 0.3);
        ctx.lineTo(bx - 14, by + bh * 0.5);
        ctx.lineTo(bx, by + bh * 0.65);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fill();

        // Request icon
        ctx.font = '28px serif';
        ctx.textAlign = 'left';
        ctx.fillText(client.icon, bx + 10, by + 36);

        // Request text - word wrap
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '12px Poppins, sans-serif';
        const maxW = bw - 55;
        const words = client.text.split(' ');
        let line = '';
        let lineY = by + 28;
        words.forEach(w => {
            const test = line + w + ' ';
            if (ctx.measureText(test).width > maxW) {
                ctx.fillText(line.trim(), bx + 48, lineY);
                line = w + ' ';
                lineY += 16;
            } else {
                line = test;
            }
        });
        ctx.fillText(line.trim(), bx + 48, lineY);

        // Tags visual
        ctx.font = '9px Poppins, sans-serif';
        ctx.fillStyle = '#888';
        const tagText = client.tags.map(t => '#' + t).join(' ');
        ctx.fillText(tagText, bx + 48, by + bh - 10);

        ctx.restore();
    }

    function drawDestinationCards() {
        if (!currentOptions || clientIdx >= totalClients) return;
        const opts = currentOptions.options;
        const cardW = (W - 30) / opts.length;
        const cardH = H * 0.32;
        const cardY = H * 0.22;

        opts.forEach((country, i) => {
            const cx = 10 + i * (cardW + 5);
            const isHover = hoveredCard === i;
            const isSelected = selectedCard === i;

            ctx.save();
            // Card background
            ctx.fillStyle = isHover ? 'rgba(100,200,255,0.15)' : 'rgba(255,255,255,0.06)';
            ctx.strokeStyle = isHover ? '#00d2ff' : 'rgba(255,255,255,0.15)';
            ctx.lineWidth = isHover ? 2.5 : 1;
            _roundRect(ctx, cx, cardY, cardW - 5, cardH, 12);
            ctx.fill(); ctx.stroke();

            // Flag
            ctx.font = '30px serif';
            ctx.textAlign = 'center';
            ctx.fillText(country.flag, cx + (cardW - 5) / 2, cardY + 34);

            // Country name
            ctx.fillStyle = '#e0e0e0';
            ctx.font = 'bold 11px Poppins, sans-serif';
            ctx.fillText(country.name, cx + (cardW - 5) / 2, cardY + 54);

            // Budget badge
            ctx.fillStyle = 'rgba(255,200,50,0.15)';
            _roundRect(ctx, cx + 6, cardY + 60, cardW - 17, 16, 4);
            ctx.fill();
            ctx.fillStyle = '#ffc107';
            ctx.font = '8px Poppins, sans-serif';
            ctx.fillText(country.budget, cx + (cardW - 5) / 2, cardY + 72);

            // Highlights (compact)
            ctx.fillStyle = '#999';
            ctx.font = '8px Poppins, sans-serif';
            ctx.textAlign = 'center';
            const hl = country.highlights.slice(0, 2);
            hl.forEach((h, hi) => {
                ctx.fillText(h, cx + (cardW - 5) / 2, cardY + 90 + hi * 13);
            });

            // Cuisine
            ctx.fillStyle = '#888';
            ctx.font = '8px Poppins, sans-serif';
            ctx.fillText('🍽️ ' + country.cuisine.split(',')[0], cx + (cardW - 5) / 2, cardY + 120);

            // Best time
            ctx.fillStyle = '#667';
            ctx.font = '7px Poppins, sans-serif';
            const timeText = country.bestTime.length > 18 ? country.bestTime.substring(0, 18) + '...' : country.bestTime;
            ctx.fillText('📅 ' + timeText, cx + (cardW - 5) / 2, cardY + 135);

            // Tags
            const tags = (country.tags || []).slice(0, 3);
            const tagY = cardY + cardH - 20;
            ctx.font = '7px Poppins, sans-serif';
            tags.forEach((t, ti) => {
                const tw = ctx.measureText('#' + t).width + 6;
                const tx = cx + 4 + ti * (tw + 2);
                ctx.fillStyle = 'rgba(100,200,255,0.15)';
                _roundRect(ctx, tx, tagY, tw, 12, 3);
                ctx.fill();
                ctx.fillStyle = '#88ccff';
                ctx.textAlign = 'left';
                ctx.fillText('#' + t, tx + 3, tagY + 9);
            });

            // Keyboard shortcut
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            _roundRect(ctx, cx + (cardW - 5) / 2 - 10, cardY + cardH - 38, 20, 16, 4);
            ctx.fill();
            ctx.fillStyle = '#888';
            ctx.font = 'bold 9px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText((i + 1).toString(), cx + (cardW - 5) / 2, cardY + cardH - 27);

            ctx.restore();
        });
    }

    function drawHUD() {
        ctx.save();
        // Client counter
        ctx.fillStyle = '#888';
        ctx.font = '11px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Cliente ${clientIdx + 1} de ${totalClients}`, 8, H * 0.60);

        // Score
        ctx.textAlign = 'right';
        ctx.fillStyle = '#43e97b';
        ctx.fillText(`Aciertos: ${correct}`, W - 8, H * 0.60);

        // Progress bar
        const barW = W - 16;
        const barY = H * 0.605;
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        _roundRect(ctx, 8, barY, barW, 5, 3);
        ctx.fill();
        ctx.fillStyle = 'linear-gradient(90deg, #667eea, #43e97b)';
        ctx.fillStyle = '#667eea';
        _roundRect(ctx, 8, barY, barW * (clientIdx / totalClients), 5, 3);
        ctx.fill();
        ctx.restore();
    }

    function drawResultAnim() {
        if (!resultAnim) return;
        resultAnim.age += 0.02;
        if (resultAnim.age >= 1.5) {
            resultAnim = null;
            return;
        }

        ctx.save();
        const alpha = resultAnim.age < 1 ? 1 : 1 - (resultAnim.age - 1) * 2;
        ctx.globalAlpha = Math.max(0, alpha);

        if (resultAnim.type === 'correct') {
            // Passport stamp animation
            ctx.fillStyle = 'rgba(67, 233, 123, 0.15)';
            ctx.fillRect(0, 0, W, H);

            // Big stamp effect
            const stampSize = resultAnim.age < 0.3 ? 60 - resultAnim.age * 100 : 30;
            ctx.font = `${stampSize}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText(resultAnim.country.flag, W / 2, H * 0.45);
            ctx.fillStyle = '#43e97b';
            ctx.font = 'bold 16px Poppins, sans-serif';
            ctx.fillText('Destino correcto!', W / 2, H * 0.50);
            ctx.font = '11px Poppins, sans-serif';
            ctx.fillStyle = '#8f8';
            ctx.fillText(resultAnim.country.name, W / 2, H * 0.54);
        } else {
            ctx.fillStyle = 'rgba(255, 80, 50, 0.1)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#ff6b6b';
            ctx.font = 'bold 14px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No es el mejor destino', W / 2, H * 0.47);
            ctx.font = '11px Poppins, sans-serif';
            ctx.fillStyle = '#aaa';
            ctx.fillText('Mejor opcion: ' + resultAnim.country.flag + ' ' + resultAnim.country.name, W / 2, H * 0.52);
        }
        ctx.restore();
    }

    function drawEndScreen() {
        if (clientIdx < totalClients) return;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Jornada terminada!', W / 2, H * 0.35);

        ctx.font = '40px serif';
        ctx.fillText('✈️', W / 2, H * 0.28);

        ctx.fillStyle = '#43e97b';
        ctx.font = 'bold 14px Poppins, sans-serif';
        ctx.fillText(`${correct} de ${totalClients} clientes satisfechos`, W / 2, H * 0.42);

        // Show passport stamps
        stampAnims.forEach((s, i) => {
            const sx = W * 0.2 + (i % 4) * 50;
            const sy = H * 0.50 + Math.floor(i / 4) * 35;
            ctx.font = '24px serif';
            ctx.fillText(s.flag, sx, sy);
        });

        ctx.restore();
    }

    function draw() {
        if (!running) return;
        animTimer += 0.016;
        ctx.clearRect(0, 0, W, H);

        // Background - travel agency interior
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, W, H);

        // Wall
        ctx.fillStyle = 'rgba(30,35,50,0.4)';
        ctx.fillRect(0, 0, W, H * 0.62);

        // Window with landscape
        ctx.fillStyle = 'rgba(100,180,255,0.08)';
        _roundRect(ctx, W * 0.7, H * 0.01, W * 0.27, H * 0.12, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(100,180,255,0.2)';
        ctx.lineWidth = 1;
        _roundRect(ctx, W * 0.7, H * 0.01, W * 0.27, H * 0.12, 6);
        ctx.stroke();

        drawDesk();
        drawClient();
        drawDestinationCards();
        drawHUD();
        drawResultAnim();
        drawEndScreen();

        requestAnimationFrame(draw);
    }

    function selectDestination(idx) {
        if (!currentOptions || resultAnim) return;
        const chosen = currentOptions.options[idx];
        const isCorrect = chosen.name === currentOptions.correct.name;

        if (isCorrect) {
            correct++;
            addScore(25);
            resultAnim = { type: 'correct', age: 0, country: chosen };
            // Add stamp
            stampAnims.push({
                flag: chosen.flag,
                x: 15 + stampAnims.length * 30,
                y: H * 0.72,
                age: 0,
                rot: (Math.random() - 0.5) * 0.3
            });
        } else {
            resultAnim = { type: 'wrong', age: 0, country: currentOptions.correct };
        }

        // Animate stamps
        const stampInterval = setInterval(() => {
            stampAnims.forEach(s => { if (s.age < 1) s.age += 0.05; });
            if (stampAnims.every(s => s.age >= 1)) clearInterval(stampInterval);
        }, 30);

        // Next client after animation
        setTimeout(() => {
            clientIdx++;
            if (clientIdx >= totalClients) {
                // End - show result
                setTimeout(() => {
                    running = false;
                    showResult('Agencia cerrada', `${correct}/${totalClients}`,
                        correct >= 5 ? 'Agente de viajes estrella!' : correct >= 3 ? 'Buen agente!' : 'Estudia mas destinos',
                        () => {
                            // Restart - need to get the region back
                            const regionCountriesForRestart = regionCountries;
                            const allForRestart = allCountries;
                            viajesAgentSimulator(ui, controls, regionCountriesForRestart, allForRestart);
                        });
                }, 1500);
            } else {
                setupClient();
                selectedCard = -1;
                hoveredCard = -1;
            }
        }, 1500);
    }

    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x, y };
    }

    function getCardAtPos(cx, cy) {
        if (!currentOptions) return -1;
        const opts = currentOptions.options;
        const cardW = (W - 30) / opts.length;
        const cardH = H * 0.32;
        const cardY = H * 0.22;
        for (let i = 0; i < opts.length; i++) {
            const x = 10 + i * (cardW + 5);
            if (cx >= x && cx <= x + cardW - 5 && cy >= cardY && cy <= cardY + cardH) return i;
        }
        return -1;
    }

    const onClick = (e) => {
        e.preventDefault();
        const { x, y } = getCanvasCoords(e);
        const card = getCardAtPos(x, y);
        if (card >= 0) selectDestination(card);
    };
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onClick, { passive: false });

    const onMove = (e) => {
        const { x, y } = getCanvasCoords(e);
        hoveredCard = getCardAtPos(x, y);
    };
    canvas.addEventListener('mousemove', onMove);

    // Keyboard
    let kbSel = 0;
    const kbHandler = (e) => {
        if (!currentOptions) return;
        const count = currentOptions.options.length;

        // Number keys 1-3
        const num = parseInt(e.key);
        if (num >= 1 && num <= count) {
            selectDestination(num - 1);
            return;
        }

        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') kbSel = Math.max(0, kbSel - 1);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') kbSel = Math.min(count - 1, kbSel + 1);
        hoveredCard = kbSel;
        if (e.key === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            selectDestination(kbSel);
        }
    };
    document.addEventListener('keydown', kbHandler);

    setupClient();

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Elige el mejor destino para cada cliente</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">1-3: elegir destino | A/D: mover | Enter: seleccionar</div>';

    draw();

    currentGame = {
        cleanup: () => {
            running = false;
            canvas.removeEventListener('click', onClick);
            canvas.removeEventListener('touchstart', onClick);
            canvas.removeEventListener('mousemove', onMove);
            document.removeEventListener('keydown', kbHandler);
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

// Helper: rounded rectangle (prefixed to avoid global conflicts)
function _roundRect(ctx, x, y, w, h, r) {
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
