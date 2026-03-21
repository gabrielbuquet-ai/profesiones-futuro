// ==========================================
// MEDICO - Mini-juegos interactivos (Canvas)
// ==========================================

const PATIENTS = [
    { symptoms: ['Fiebre alta', 'Tos seca', 'Dolor de cabeza'], diagnosis: 'Gripe', meds: 'Paracetamol + Jarabe para la tos', medsIcon: '💊🧴' },
    { symptoms: ['Dolor de estomago', 'Nauseas', 'Diarrea'], diagnosis: 'Gastroenteritis', meds: 'Suero oral + Antidiarreico', medsIcon: '💧💊' },
    { symptoms: ['Erupcion en la piel', 'Picazon', 'Enrojecimiento'], diagnosis: 'Alergia', meds: 'Antihistaminico + Crema calmante', medsIcon: '💊🧴' },
    { symptoms: ['Dolor en el pecho', 'Dificultad para respirar', 'Fatiga'], diagnosis: 'Bronquitis', meds: 'Antibiotico + Inhalador', medsIcon: '💊🫁' },
    { symptoms: ['Dolor de garganta', 'Fiebre', 'Ganglios inflamados'], diagnosis: 'Amigdalitis', meds: 'Ibuprofeno + Antibiotico', medsIcon: '💊💊' },
    { symptoms: ['Vision borrosa', 'Dolor de cabeza intenso', 'Mareos'], diagnosis: 'Migrania', meds: 'Triptanes + Reposo en oscuridad', medsIcon: '💊😎' },
    { symptoms: ['Hinchazon en tobillo', 'Dolor al caminar', 'Morado'], diagnosis: 'Esguince', meds: 'Hielo + Vendaje compresivo', medsIcon: '🧊🩹' },
    { symptoms: ['Tos con flema', 'Fiebre', 'Dolor al respirar'], diagnosis: 'Neumonia', meds: 'Antibiotico fuerte + Oxigeno', medsIcon: '💊🫁' }
];

const XRAYS = [
    { image: '🦴💢', problem: 'Fractura en el fémur', location: 'Pierna izquierda', treatment: 'Escayola 6 semanas' },
    { image: '🫁🔍', problem: 'Congestión en pulmón derecho', location: 'Tórax', treatment: 'Reposo y tratamiento' },
    { image: '🦷💢', problem: 'Muela rota', location: 'Mandíbula', treatment: 'Extracción dental' },
    { image: '🖐️💢', problem: 'Fractura en metacarpo', location: 'Mano derecha', treatment: 'Férula 4 semanas' },
    { image: '🦴✅', problem: 'Sin anomalías', location: 'Columna vertebral', treatment: 'Alta médica' },
    { image: '🧠💢', problem: 'Pequeño golpe en la cabeza', location: 'Cabeza', treatment: 'Reposo y observación' }
];

const SURGERY_STEPS = [
    { step: 'Lavar y desinfectar las manos', icon: '🧼' },
    { step: 'Colocar anestesia al paciente', icon: '💉' },
    { step: 'Preparar el instrumental médico', icon: '🏥' },
    { step: 'Localizar el problema con cuidado', icon: '🔍' },
    { step: 'Reparar la zona afectada', icon: '✨' },
    { step: 'Cerrar con puntos', icon: '🪡' },
    { step: 'Aplicar vendaje protector', icon: '🩹' },
    { step: 'Enviar a recuperación', icon: '🛏️' }
];

function startMedico(subtype) {
    const ui = document.getElementById('game-ui');
    const controls = document.getElementById('game-controls');
    ui.style.pointerEvents = 'auto';

    switch (subtype) {
        case 'general': medicoGeneral(ui, controls); break;
        case 'cirujano': medicoCirujano(ui, controls); break;
        case 'radiologo': medicoRadiologo(ui, controls); break;
        case 'farmaceutico': medicoFarmaceutico(ui, controls); break;
    }
}

// ============================================================
// 1. MEDICO GENERAL - Canvas body examination + visual diagnosis
// ============================================================
function medicoGeneral(ui, controls) {
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

    const patients = shuffleArray(PATIENTS).slice(0, 5);
    let patientIdx = 0;
    let correct = 0;
    let examinedParts = [];
    let revealedSymptoms = [];
    let phase = 'examine'; // 'examine' or 'diagnose'
    let selectedCard = -1;
    let animTimer = 0;
    let heartbeatPhase = 0;
    let pulseEffects = []; // {x, y, age, text}
    let running = true;

    // Body parts clickable zones (relative to body center)
    const bodyX = W * 0.35;
    const bodyTop = H * 0.08;
    const bodyScale = Math.min(W * 0.0028, H * 0.0018);

    const BODY_PARTS = [
        { id: 'head', label: 'Cabeza', x: 0, y: 0, r: 22 * bodyScale, symptoms: ['Dolor de cabeza', 'Dolor de cabeza intenso', 'Vision borrosa', 'Mareos'] },
        { id: 'throat', label: 'Garganta', x: 0, y: 32 * bodyScale, r: 14 * bodyScale, symptoms: ['Dolor de garganta', 'Ganglios inflamados', 'Tos seca', 'Tos con flema'] },
        { id: 'chest', label: 'Pecho', x: 0, y: 60 * bodyScale, r: 28 * bodyScale, symptoms: ['Dolor en el pecho', 'Dificultad para respirar', 'Dolor al respirar', 'Fatiga'] },
        { id: 'stomach', label: 'Estomago', x: 0, y: 95 * bodyScale, r: 22 * bodyScale, symptoms: ['Dolor de estomago', 'Nauseas', 'Diarrea'] },
        { id: 'skin', label: 'Piel', x: -40 * bodyScale, y: 55 * bodyScale, r: 16 * bodyScale, symptoms: ['Erupcion en la piel', 'Picazon', 'Enrojecimiento'] },
        { id: 'leg', label: 'Pierna', x: -12 * bodyScale, y: 150 * bodyScale, r: 18 * bodyScale, symptoms: ['Hinchazon en tobillo', 'Dolor al caminar', 'Morado'] },
        { id: 'temp', label: 'Temperatura', x: 40 * bodyScale, y: 20 * bodyScale, r: 14 * bodyScale, symptoms: ['Fiebre alta', 'Fiebre'] }
    ];

    // Diagnosis cards
    let diagCards = [];

    function getPatient() { return patients[patientIdx]; }

    function setupDiagCards() {
        const p = getPatient();
        const allDiags = [...new Set(PATIENTS.map(x => x.diagnosis))];
        const opts = shuffleArray([p.diagnosis, ...allDiags.filter(d => d !== p.diagnosis)]).slice(0, 4);
        const cardW = (W - 30) / 2;
        const cardH = 52;
        const startY = H - 140;
        diagCards = opts.map((d, i) => ({
            label: d,
            x: 10 + (i % 2) * (cardW + 10),
            y: startY + Math.floor(i / 2) * (cardH + 8),
            w: cardW,
            h: cardH,
            correct: d === p.diagnosis
        }));
    }

    function drawBody() {
        const cx = bodyX;
        const cy = bodyTop + 80 * bodyScale;

        // Draw simple body outline
        ctx.save();
        ctx.strokeStyle = 'rgba(100,200,255,0.5)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Head
        ctx.beginPath();
        ctx.arc(cx, cy, 22 * bodyScale, 0, Math.PI * 2);
        ctx.stroke();

        // Neck
        ctx.beginPath();
        ctx.moveTo(cx - 6 * bodyScale, cy + 22 * bodyScale);
        ctx.lineTo(cx - 6 * bodyScale, cy + 32 * bodyScale);
        ctx.moveTo(cx + 6 * bodyScale, cy + 22 * bodyScale);
        ctx.lineTo(cx + 6 * bodyScale, cy + 32 * bodyScale);
        ctx.stroke();

        // Torso
        ctx.beginPath();
        ctx.moveTo(cx - 30 * bodyScale, cy + 32 * bodyScale);
        ctx.lineTo(cx + 30 * bodyScale, cy + 32 * bodyScale);
        ctx.lineTo(cx + 25 * bodyScale, cy + 115 * bodyScale);
        ctx.lineTo(cx - 25 * bodyScale, cy + 115 * bodyScale);
        ctx.closePath();
        ctx.stroke();

        // Arms
        ctx.beginPath();
        ctx.moveTo(cx - 30 * bodyScale, cy + 36 * bodyScale);
        ctx.lineTo(cx - 50 * bodyScale, cy + 75 * bodyScale);
        ctx.lineTo(cx - 45 * bodyScale, cy + 100 * bodyScale);
        ctx.moveTo(cx + 30 * bodyScale, cy + 36 * bodyScale);
        ctx.lineTo(cx + 50 * bodyScale, cy + 75 * bodyScale);
        ctx.lineTo(cx + 45 * bodyScale, cy + 100 * bodyScale);
        ctx.stroke();

        // Legs
        ctx.beginPath();
        ctx.moveTo(cx - 20 * bodyScale, cy + 115 * bodyScale);
        ctx.lineTo(cx - 18 * bodyScale, cy + 170 * bodyScale);
        ctx.lineTo(cx - 22 * bodyScale, cy + 175 * bodyScale);
        ctx.moveTo(cx + 20 * bodyScale, cy + 115 * bodyScale);
        ctx.lineTo(cx + 18 * bodyScale, cy + 170 * bodyScale);
        ctx.lineTo(cx + 22 * bodyScale, cy + 175 * bodyScale);
        ctx.stroke();
        ctx.restore();

        // Draw clickable zones
        BODY_PARTS.forEach(part => {
            const px = cx + part.x;
            const py = cy + part.y;
            const examined = examinedParts.includes(part.id);

            ctx.save();
            if (examined) {
                ctx.fillStyle = 'rgba(67, 233, 123, 0.15)';
                ctx.strokeStyle = 'rgba(67, 233, 123, 0.6)';
            } else {
                // Pulsing glow
                const pulse = 0.3 + 0.15 * Math.sin(animTimer * 3 + BODY_PARTS.indexOf(part));
                ctx.fillStyle = `rgba(100, 200, 255, ${pulse})`;
                ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
            }
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(px, py, part.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Label
            ctx.fillStyle = examined ? '#43e97b' : 'rgba(200,220,255,0.8)';
            ctx.font = `${10 * Math.min(bodyScale, 1.2)}px Poppins, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(part.label, px, py + part.r + 12);

            if (examined) {
                ctx.fillStyle = '#43e97b';
                ctx.font = '12px Poppins, sans-serif';
                ctx.fillText('✓', px, py + 4);
            }
            ctx.restore();
        });
    }

    function drawHeartbeat() {
        heartbeatPhase += 0.05;
        const hbX = W * 0.72;
        const hbY = H * 0.06;
        const hbW = W * 0.24;
        const hbH = 40;

        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.strokeStyle = 'rgba(100,200,255,0.3)';
        ctx.lineWidth = 1;
        roundRect(ctx, hbX - 4, hbY - 4, hbW + 8, hbH + 8, 8);
        ctx.fill();
        ctx.stroke();

        // ECG line
        ctx.strokeStyle = '#43e97b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < hbW; i++) {
            const t = (i / hbW) * Math.PI * 4 + heartbeatPhase * 5;
            const beatPos = t % (Math.PI * 2);
            let y;
            if (beatPos > 1.8 && beatPos < 2.0) y = -15;
            else if (beatPos > 2.0 && beatPos < 2.2) y = 12;
            else if (beatPos > 2.2 && beatPos < 2.5) y = -5;
            else y = 0;
            y += Math.sin(t * 0.3) * 1;
            if (i === 0) ctx.moveTo(hbX + i, hbY + hbH / 2 + y);
            else ctx.lineTo(hbX + i, hbY + hbH / 2 + y);
        }
        ctx.stroke();

        ctx.fillStyle = '#43e97b';
        ctx.font = '10px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Monitor', hbX, hbY - 8);
        ctx.restore();
    }

    function drawSymptomPanel() {
        const panelX = W * 0.62;
        const panelY = H * 0.16;
        const panelW = W * 0.35;

        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        roundRect(ctx, panelX, panelY, panelW, revealedSymptoms.length * 32 + 40, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#aaa';
        ctx.font = 'bold 11px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Historial clinico:', panelX + 10, panelY + 18);

        revealedSymptoms.forEach((s, i) => {
            ctx.fillStyle = '#e0e0e0';
            ctx.font = '11px Poppins, sans-serif';
            ctx.fillText('- ' + s, panelX + 10, panelY + 40 + i * 28);
        });

        if (revealedSymptoms.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '10px Poppins, sans-serif';
            ctx.fillText('Examina al paciente...', panelX + 10, panelY + 42);
        }
        ctx.restore();
    }

    function drawPulseEffects() {
        pulseEffects = pulseEffects.filter(e => e.age < 1);
        pulseEffects.forEach(e => {
            e.age += 0.025;
            ctx.save();
            ctx.globalAlpha = 1 - e.age;
            ctx.fillStyle = '#43e97b';
            ctx.font = `${11 + e.age * 4}px Poppins, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(e.text, e.x, e.y - e.age * 30);
            ctx.restore();
        });
    }

    function drawDiagnosePhase() {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, H - 160, W, 160);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Selecciona tu diagnostico:', W / 2, H - 148);

        diagCards.forEach((card, i) => {
            const hover = selectedCard === i;
            ctx.fillStyle = hover ? 'rgba(100,200,255,0.3)' : 'rgba(255,255,255,0.08)';
            ctx.strokeStyle = hover ? '#00d2ff' : 'rgba(255,255,255,0.2)';
            ctx.lineWidth = hover ? 2 : 1;
            roundRect(ctx, card.x, card.y, card.w, card.h, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#e0e0e0';
            ctx.font = '12px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(card.label, card.x + card.w / 2, card.y + card.h / 2 + 4);
        });
        ctx.restore();
    }

    function drawExaminePrompt() {
        if (phase !== 'examine') return;
        const needed = 3 - examinedParts.length;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        roundRect(ctx, 6, H - 50, W - 12, 44, 10);
        ctx.fill();
        ctx.fillStyle = needed > 0 ? '#ffc107' : '#43e97b';
        ctx.font = '12px Poppins, sans-serif';
        ctx.textAlign = 'center';
        if (needed > 0) {
            ctx.fillText(`Examina ${needed} zona${needed > 1 ? 's' : ''} mas (toca las zonas brillantes)`, W / 2, H - 24);
        } else {
            ctx.fillText('Toca "Diagnosticar" cuando estes listo', W / 2, H - 24);
        }
        ctx.restore();
    }

    function drawHUD() {
        ctx.save();
        ctx.fillStyle = '#888';
        ctx.font = '11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Paciente ${patientIdx + 1} de ${patients.length}`, W / 2, 16);

        // Stethoscope icon
        ctx.font = '20px serif';
        ctx.textAlign = 'left';
        ctx.fillText('🩺', 8, 22);
        ctx.restore();
    }

    function draw() {
        if (!running) return;
        animTimer += 0.016;
        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, W, H);

        // Subtle grid
        ctx.strokeStyle = 'rgba(100,200,255,0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

        drawHUD();
        drawBody();
        drawHeartbeat();
        drawSymptomPanel();
        drawPulseEffects();
        drawExaminePrompt();

        if (phase === 'diagnose') {
            drawDiagnosePhase();
        }

        requestAnimationFrame(draw);
    }

    function handleClick(cx, cy) {
        if (phase === 'examine') {
            const bCX = bodyX;
            const bCY = bodyTop + 80 * bodyScale;
            for (const part of BODY_PARTS) {
                const px = bCX + part.x;
                const py = bCY + part.y;
                const dist = Math.hypot(cx - px, cy - py);
                if (dist < part.r + 5 && !examinedParts.includes(part.id)) {
                    examinedParts.push(part.id);
                    // Check which patient symptoms match this part
                    const p = getPatient();
                    const found = p.symptoms.filter(s => part.symptoms.includes(s));
                    if (found.length > 0) {
                        found.forEach(s => {
                            if (!revealedSymptoms.includes(s)) {
                                revealedSymptoms.push(s);
                                pulseEffects.push({ x: px, y: py - 10, age: 0, text: s });
                            }
                        });
                    } else {
                        pulseEffects.push({ x: px, y: py - 10, age: 0, text: 'Normal' });
                    }
                    addScore(5);
                    break;
                }
            }
        } else if (phase === 'diagnose') {
            for (let i = 0; i < diagCards.length; i++) {
                const c = diagCards[i];
                if (cx >= c.x && cx <= c.x + c.w && cy >= c.y && cy <= c.y + c.h) {
                    if (c.correct) {
                        correct++;
                        addScore(20);
                    }
                    // Next patient
                    patientIdx++;
                    if (patientIdx >= patients.length) {
                        running = false;
                        showResult('Consulta terminada', `${correct}/${patients.length}`,
                            correct >= 4 ? 'Excelente diagnostico!' : correct >= 2 ? 'Puedes mejorar' : 'Sigue practicando',
                            () => { startMedico('general'); });
                    } else {
                        examinedParts = [];
                        revealedSymptoms = [];
                        phase = 'examine';
                        selectedCard = -1;
                        setupDiagCards();
                    }
                    break;
                }
            }
        }
    }

    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x, y };
    }

    const onClick = (e) => {
        e.preventDefault();
        const { x, y } = getCanvasCoords(e);
        handleClick(x, y);
    };
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onClick, { passive: false });

    const onMove = (e) => {
        if (phase !== 'diagnose') return;
        const { x, y } = getCanvasCoords(e);
        selectedCard = -1;
        diagCards.forEach((c, i) => {
            if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) selectedCard = i;
        });
    };
    canvas.addEventListener('mousemove', onMove);

    // Keyboard support
    let kbSelected = 0;
    const kbHandler = (e) => {
        if (phase === 'examine') {
            if (e.key >= '1' && e.key <= '7') {
                const idx = parseInt(e.key) - 1;
                if (idx < BODY_PARTS.length) {
                    const part = BODY_PARTS[idx];
                    const bCX = bodyX;
                    const bCY = bodyTop + 80 * bodyScale;
                    handleClick(bCX + part.x, bCY + part.y);
                }
            }
            if (e.key === 'Enter' && examinedParts.length >= 3) {
                phase = 'diagnose';
                setupDiagCards();
            }
        } else if (phase === 'diagnose') {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') kbSelected = Math.max(0, kbSelected - 1);
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') kbSelected = Math.min(diagCards.length - 1, kbSelected + 1);
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') kbSelected = Math.max(0, kbSelected - 2);
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') kbSelected = Math.min(diagCards.length - 1, kbSelected + 2);
            selectedCard = kbSelected;
            if (e.key === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                const c = diagCards[kbSelected];
                handleClick(c.x + c.w / 2, c.y + c.h / 2);
            }
        }
    };
    document.addEventListener('keydown', kbHandler);

    setupDiagCards();

    controls.innerHTML = `
        <button class="control-btn" id="btn-diagnose" style="flex:1;">Diagnosticar</button>
    `;
    document.getElementById('btn-diagnose').onclick = () => {
        if (examinedParts.length >= 3 && phase === 'examine') {
            phase = 'diagnose';
            setupDiagCards();
        }
    };
    controls.insertAdjacentHTML('beforeend', '<div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">Toca zonas del cuerpo para examinar | 1-7: examinar zona | Enter: diagnosticar</div>');

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

// ============================================================
// 2. CIRUJANO - Canvas operation simulator with tool tray
// ============================================================
function medicoCirujano(ui, controls) {
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

    const steps = [...SURGERY_STEPS];
    let currentStep = 0;
    let running = true;
    let animTimer = 0;
    let timeLeft = 60;
    let timerInterval = null;
    let wrongFlash = 0;
    let successAnim = { active: false, age: 0, icon: '' };
    let completedSteps = [];
    let hoveredTool = -1;

    // Tool tray at bottom
    const TOOL_H = 70;
    const toolsPerRow = 4;
    const remaining = () => steps.filter((_, i) => i >= currentStep);

    function getVisibleTools() {
        const rem = remaining();
        return shuffleArray(rem).slice(0, Math.min(toolsPerRow, rem.length));
    }
    let visibleTools = getVisibleTools();

    function getToolRects() {
        const count = visibleTools.length;
        const toolW = Math.min((W - 20) / count, 90);
        const startX = (W - count * toolW) / 2;
        const y = H - TOOL_H - 10;
        return visibleTools.map((t, i) => ({
            x: startX + i * toolW,
            y: y,
            w: toolW - 4,
            h: TOOL_H,
            step: t
        }));
    }

    function drawOperatingTable() {
        // Table
        const tableY = H * 0.15;
        const tableH = H * 0.48;

        ctx.save();
        // Operating light
        ctx.fillStyle = 'rgba(255,255,200,0.05)';
        ctx.beginPath();
        ctx.arc(W / 2, 0, W * 0.5, 0, Math.PI);
        ctx.fill();

        // Light beam cone
        const grad = ctx.createRadialGradient(W / 2, 10, 10, W / 2, tableY + tableH / 2, W * 0.5);
        grad.addColorStop(0, 'rgba(255,255,200,0.06)');
        grad.addColorStop(1, 'rgba(255,255,200,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(W * 0.1, 0, W * 0.8, tableY + tableH);

        // Table surface
        ctx.fillStyle = 'rgba(40,60,80,0.6)';
        ctx.strokeStyle = 'rgba(100,200,255,0.3)';
        ctx.lineWidth = 2;
        roundRect(ctx, W * 0.08, tableY, W * 0.84, tableH, 14);
        ctx.fill();
        ctx.stroke();

        // Patient silhouette (simple)
        ctx.fillStyle = 'rgba(150,180,200,0.15)';
        ctx.beginPath();
        // Head
        ctx.arc(W / 2, tableY + 40, 18, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillRect(W / 2 - 22, tableY + 58, 44, tableH - 80);
        // Arms
        ctx.fillRect(W / 2 - 50, tableY + 65, 28, 12);
        ctx.fillRect(W / 2 + 22, tableY + 65, 28, 12);

        // Completed steps indicators on table
        completedSteps.forEach((s, i) => {
            const sx = W * 0.15 + (i % 4) * 50;
            const sy = tableY + tableH - 35 + Math.floor(i / 4) * 20;
            ctx.font = '16px serif';
            ctx.textAlign = 'center';
            ctx.fillText(s.icon, sx, sy);
        });

        ctx.restore();
    }

    function drawToolTray() {
        const rects = getToolRects();

        // Tray background
        ctx.save();
        ctx.fillStyle = 'rgba(20,30,50,0.8)';
        ctx.strokeStyle = 'rgba(100,200,255,0.2)';
        ctx.lineWidth = 1;
        roundRect(ctx, 4, H - TOOL_H - 18, W - 8, TOOL_H + 14, 12);
        ctx.fill();
        ctx.stroke();

        rects.forEach((r, i) => {
            const isHover = hoveredTool === i;
            const isCorrect = r.step === steps[currentStep];
            ctx.fillStyle = isHover ? 'rgba(100,200,255,0.2)' : 'rgba(255,255,255,0.06)';
            ctx.strokeStyle = isHover ? '#00d2ff' : 'rgba(255,255,255,0.15)';
            ctx.lineWidth = isHover ? 2 : 1;
            roundRect(ctx, r.x, r.y, r.w, r.h, 10);
            ctx.fill();
            ctx.stroke();

            // Icon
            ctx.font = '24px serif';
            ctx.textAlign = 'center';
            ctx.fillText(r.step.icon, r.x + r.w / 2, r.y + 30);

            // Label
            ctx.fillStyle = '#ccc';
            ctx.font = '9px Poppins, sans-serif';
            const words = r.step.step.split(' ');
            const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
            const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
            ctx.fillText(line1, r.x + r.w / 2, r.y + 48);
            if (line2) ctx.fillText(line2, r.x + r.w / 2, r.y + 60);
        });
        ctx.restore();
    }

    function drawProgress() {
        const y = H * 0.04;
        ctx.save();
        ctx.fillStyle = '#888';
        ctx.font = '11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Paso ${currentStep + 1} de ${steps.length}`, W / 2, y);

        // Progress bar
        const barW = W * 0.6;
        const barX = (W - barW) / 2;
        const barY = y + 8;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        roundRect(ctx, barX, barY, barW, 8, 4);
        ctx.fill();
        ctx.fillStyle = '#43e97b';
        roundRect(ctx, barX, barY, barW * (currentStep / steps.length), 8, 4);
        ctx.fill();

        // Timer
        ctx.fillStyle = timeLeft <= 15 ? '#ff6b6b' : '#ffc107';
        ctx.font = 'bold 13px Poppins, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${timeLeft}s`, W - 12, y);
        ctx.restore();
    }

    function drawWrongFlash() {
        if (wrongFlash > 0) {
            ctx.save();
            ctx.fillStyle = `rgba(255, 50, 50, ${wrongFlash * 0.3})`;
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 16px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Herramienta incorrecta!', W / 2, H / 2);
            wrongFlash -= 0.02;
            ctx.restore();
        }
    }

    function drawSuccessAnim() {
        if (successAnim.active) {
            successAnim.age += 0.03;
            if (successAnim.age >= 1) { successAnim.active = false; return; }
            ctx.save();
            ctx.globalAlpha = 1 - successAnim.age;
            ctx.font = `${30 + successAnim.age * 20}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText(successAnim.icon, W / 2, H * 0.4 - successAnim.age * 40);
            ctx.fillStyle = '#43e97b';
            ctx.font = `bold ${14 + successAnim.age * 4}px Poppins, sans-serif`;
            ctx.fillText('Correcto!', W / 2, H * 0.4 + 20 - successAnim.age * 30);
            ctx.restore();
        }
    }

    function draw() {
        if (!running) return;
        animTimer += 0.016;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0a0e17';
        ctx.fillRect(0, 0, W, H);

        drawOperatingTable();
        drawProgress();
        drawToolTray();
        drawWrongFlash();
        drawSuccessAnim();

        requestAnimationFrame(draw);
    }

    function handleToolClick(cx, cy) {
        const rects = getToolRects();
        for (let i = 0; i < rects.length; i++) {
            const r = rects[i];
            if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) {
                if (r.step === steps[currentStep]) {
                    // Correct tool
                    completedSteps.push(r.step);
                    addScore(15);
                    successAnim = { active: true, age: 0, icon: r.step.icon };
                    currentStep++;
                    if (currentStep >= steps.length) {
                        running = false;
                        clearInterval(timerInterval);
                        addScore(50 + timeLeft);
                        setTimeout(() => {
                            showResult('Operacion exitosa!', score + ' pts', 'Has completado la operacion correctamente.', () => startMedico('cirujano'));
                        }, 500);
                    } else {
                        visibleTools = getVisibleTools();
                    }
                } else {
                    // Wrong tool
                    wrongFlash = 1;
                    addScore(-5);
                }
                break;
            }
        }
    }

    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x, y };
    }

    const onClick = (e) => { e.preventDefault(); const { x, y } = getCanvasCoords(e); handleToolClick(x, y); };
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onClick, { passive: false });

    const onMove = (e) => {
        const { x, y } = getCanvasCoords(e);
        const rects = getToolRects();
        hoveredTool = -1;
        rects.forEach((r, i) => { if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) hoveredTool = i; });
    };
    canvas.addEventListener('mousemove', onMove);

    // Keyboard
    let kbSel = 0;
    const kbHandler = (e) => {
        const rects = getToolRects();
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') kbSel = Math.max(0, kbSel - 1);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') kbSel = Math.min(rects.length - 1, kbSel + 1);
        hoveredTool = kbSel;
        if (e.key === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            const r = rects[kbSel];
            if (r) handleToolClick(r.x + r.w / 2, r.y + r.h / 2);
        }
    };
    document.addEventListener('keydown', kbHandler);

    // Timer
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            running = false;
            clearInterval(timerInterval);
            showResult('Tiempo agotado!', score + ' pts', `Completaste ${currentStep} de ${steps.length} pasos.`, () => startMedico('cirujano'));
        }
    }, 1000);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Selecciona las herramientas en el orden correcto</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">A/D o Flechas: mover | Enter/Espacio: seleccionar</div>';

    draw();

    currentGame = {
        cleanup: () => {
            running = false;
            clearInterval(timerInterval);
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

// ============================================================
// 3. RADIOLOGO - Canvas x-ray with click-to-find anomaly
// ============================================================
function medicoRadiologo(ui, controls) {
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
    let xrayIdx = 0;
    let totalScore = 0;
    let animTimer = 0;
    let clickResult = null; // {x, y, distance, age, hit}
    let scanLine = 0;

    // X-ray cases with anomaly positions
    const XRAY_CASES = [
        {
            title: 'Radiografia de pierna',
            zone: 'Pierna izquierda',
            anomaly: { x: 0.42, y: 0.62, r: 0.06 },
            problem: 'Fractura en el femur',
            drawBones: function(ctx, W, H) {
                ctx.strokeStyle = 'rgba(200,210,220,0.8)';
                ctx.lineWidth = 12;
                ctx.lineCap = 'round';
                // Femur
                ctx.beginPath(); ctx.moveTo(W*0.45, H*0.2); ctx.lineTo(W*0.42, H*0.55); ctx.stroke();
                // Tibia
                ctx.lineWidth = 9;
                ctx.beginPath(); ctx.moveTo(W*0.42, H*0.6); ctx.lineTo(W*0.4, H*0.85); ctx.stroke();
                // Fibula
                ctx.lineWidth = 5;
                ctx.beginPath(); ctx.moveTo(W*0.46, H*0.6); ctx.lineTo(W*0.44, H*0.83); ctx.stroke();
                // Pelvis outline
                ctx.lineWidth = 8;
                ctx.beginPath(); ctx.arc(W*0.45, H*0.18, 30, 0, Math.PI, true); ctx.stroke();
                // Fracture crack line
                ctx.strokeStyle = 'rgba(255,100,100,0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(W*0.39, H*0.59); ctx.lineTo(W*0.47, H*0.63); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(W*0.41, H*0.61); ctx.lineTo(W*0.44, H*0.65); ctx.stroke();
            }
        },
        {
            title: 'Radiografia de torax',
            zone: 'Torax',
            anomaly: { x: 0.58, y: 0.45, r: 0.08 },
            problem: 'Congestion en pulmon derecho',
            drawBones: function(ctx, W, H) {
                ctx.strokeStyle = 'rgba(200,210,220,0.7)';
                // Spine
                ctx.lineWidth = 8;
                ctx.beginPath(); ctx.moveTo(W*0.5, H*0.15); ctx.lineTo(W*0.5, H*0.85); ctx.stroke();
                // Ribs
                ctx.lineWidth = 3;
                for (let i = 0; i < 8; i++) {
                    const y = H*0.25 + i * (H*0.06);
                    ctx.beginPath();
                    ctx.ellipse(W*0.35, y, W*0.15, 8, 0, -0.4, Math.PI*0.7);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.ellipse(W*0.65, y, W*0.15, 8, 0, Math.PI*0.3, Math.PI*1.4);
                    ctx.stroke();
                }
                // Lung fields
                ctx.fillStyle = 'rgba(180,200,220,0.08)';
                ctx.beginPath(); ctx.ellipse(W*0.35, H*0.42, W*0.14, H*0.18, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(W*0.65, H*0.42, W*0.14, H*0.18, 0, 0, Math.PI*2); ctx.fill();
                // Anomaly - cloudy area in right lung
                ctx.fillStyle = 'rgba(200,210,220,0.15)';
                ctx.beginPath(); ctx.ellipse(W*0.58, H*0.45, W*0.08, H*0.07, 0.3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(W*0.61, H*0.43, W*0.05, H*0.05, -0.2, 0, Math.PI*2); ctx.fill();
            }
        },
        {
            title: 'Radiografia de mano',
            zone: 'Mano derecha',
            anomaly: { x: 0.48, y: 0.55, r: 0.05 },
            problem: 'Fractura en metacarpo',
            drawBones: function(ctx, W, H) {
                ctx.strokeStyle = 'rgba(200,210,220,0.8)';
                ctx.lineCap = 'round';
                // Wrist
                ctx.lineWidth = 6;
                ctx.fillStyle = 'rgba(200,210,220,0.3)';
                ctx.beginPath(); ctx.arc(W*0.5, H*0.72, 25, 0, Math.PI*2); ctx.fill();
                // Metacarpals (5 fingers)
                const fingers = [-0.12, -0.06, 0, 0.06, 0.1];
                for (let i = 0; i < 5; i++) {
                    const fx = W*(0.5 + fingers[i]);
                    ctx.lineWidth = 5;
                    // Metacarpal
                    ctx.beginPath(); ctx.moveTo(W*0.5 + fingers[i]*W*0.3, H*0.65); ctx.lineTo(fx, H*0.5); ctx.stroke();
                    // Phalanges
                    ctx.lineWidth = 3.5;
                    ctx.beginPath(); ctx.moveTo(fx, H*0.5); ctx.lineTo(fx + fingers[i]*W*0.15, H*0.38); ctx.stroke();
                    ctx.lineWidth = 2.5;
                    ctx.beginPath(); ctx.moveTo(fx + fingers[i]*W*0.15, H*0.38); ctx.lineTo(fx + fingers[i]*W*0.22, H*0.28); ctx.stroke();
                }
                // Fracture on middle metacarpal
                ctx.strokeStyle = 'rgba(255,100,100,0.35)';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(W*0.47, H*0.53); ctx.lineTo(W*0.51, H*0.56); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(W*0.49, H*0.54); ctx.lineTo(W*0.47, H*0.57); ctx.stroke();
            }
        },
        {
            title: 'Radiografia de craneo',
            zone: 'Cabeza',
            anomaly: { x: 0.55, y: 0.38, r: 0.06 },
            problem: 'Pequeno golpe en la cabeza',
            drawBones: function(ctx, W, H) {
                ctx.strokeStyle = 'rgba(200,210,220,0.7)';
                ctx.lineWidth = 4;
                // Skull outline
                ctx.beginPath();
                ctx.ellipse(W*0.5, H*0.4, W*0.2, H*0.22, 0, 0, Math.PI*2);
                ctx.stroke();
                // Eye sockets
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.ellipse(W*0.42, H*0.38, 14, 10, 0, 0, Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.ellipse(W*0.58, H*0.38, 14, 10, 0, 0, Math.PI*2); ctx.stroke();
                // Nose
                ctx.beginPath(); ctx.moveTo(W*0.5, H*0.4); ctx.lineTo(W*0.48, H*0.48); ctx.lineTo(W*0.52, H*0.48); ctx.stroke();
                // Jaw
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(W*0.5, H*0.55, W*0.15, H*0.08, 0, 0, Math.PI);
                ctx.stroke();
                // Teeth line
                ctx.lineWidth = 1;
                for (let i = 0; i < 8; i++) {
                    const tx = W*0.39 + i * (W*0.028);
                    ctx.beginPath(); ctx.moveTo(tx, H*0.5); ctx.lineTo(tx, H*0.52); ctx.stroke();
                }
                // Impact mark
                ctx.fillStyle = 'rgba(255,150,100,0.15)';
                ctx.beginPath(); ctx.arc(W*0.55, H*0.38, 18, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = 'rgba(255,100,100,0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(W*0.53, H*0.35); ctx.lineTo(W*0.57, H*0.37); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(W*0.56, H*0.37); ctx.lineTo(W*0.54, H*0.41); ctx.stroke();
            }
        }
    ];

    const cases = shuffleArray(XRAY_CASES).slice(0, 4);

    function drawXrayBackground() {
        // Dark film look
        ctx.fillStyle = '#0a0d12';
        ctx.fillRect(0, 0, W, H);

        // Slight vignette
        const grad = ctx.createRadialGradient(W/2, H/2, W*0.1, W/2, H/2, W*0.7);
        grad.addColorStop(0, 'rgba(15,20,30,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Film border
        ctx.strokeStyle = 'rgba(100,120,140,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 50, W - 20, H - 100);

        // Scan line effect
        scanLine = (scanLine + 1) % H;
        ctx.fillStyle = 'rgba(100,200,255,0.03)';
        ctx.fillRect(0, scanLine, W, 3);
    }

    function drawXrayHUD() {
        const c = cases[xrayIdx];
        ctx.save();
        ctx.fillStyle = '#667';
        ctx.font = '11px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Radiografia ${xrayIdx + 1} de ${cases.length}`, 14, 20);
        ctx.fillText(c.title, 14, 36);
        ctx.textAlign = 'right';
        ctx.fillText(`Zona: ${c.zone}`, W - 14, 20);

        // Magnifying glass cursor hint
        ctx.font = '22px serif';
        ctx.textAlign = 'right';
        ctx.fillText('🔍', W - 14, 44);
        ctx.restore();
    }

    function drawClickResult() {
        if (!clickResult) return;
        clickResult.age += 0.02;
        if (clickResult.age >= 1.2) { clickResult = null; return; }

        ctx.save();
        const alpha = Math.max(0, 1 - clickResult.age);
        ctx.globalAlpha = alpha;

        if (clickResult.hit) {
            // Green circle expanding
            ctx.strokeStyle = '#43e97b';
            ctx.lineWidth = 3;
            const r = 20 + clickResult.age * 30;
            ctx.beginPath(); ctx.arc(clickResult.x, clickResult.y, r, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = '#43e97b';
            ctx.font = 'bold 14px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Encontrado!', clickResult.x, clickResult.y - 30 - clickResult.age * 20);
            ctx.font = '11px Poppins, sans-serif';
            ctx.fillText('+' + clickResult.points + ' pts', clickResult.x, clickResult.y - 15 - clickResult.age * 20);
        } else {
            // Red X
            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = 2;
            const s = 10;
            ctx.beginPath(); ctx.moveTo(clickResult.x - s, clickResult.y - s); ctx.lineTo(clickResult.x + s, clickResult.y + s); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(clickResult.x + s, clickResult.y - s); ctx.lineTo(clickResult.x - s, clickResult.y + s); ctx.stroke();
            ctx.fillStyle = '#ff6666';
            ctx.font = '11px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Sigue buscando...', clickResult.x, clickResult.y - 20);
        }
        ctx.restore();
    }

    function drawBottomInfo() {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        roundRect(ctx, 6, H - 44, W - 12, 38, 8);
        ctx.fill();
        ctx.fillStyle = '#aaa';
        ctx.font = '11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Toca donde veas la anomalia en la radiografia', W / 2, H - 20);
        ctx.restore();
    }

    function draw() {
        if (!running) return;
        animTimer += 0.016;
        ctx.clearRect(0, 0, W, H);

        drawXrayBackground();
        if (xrayIdx < cases.length) {
            cases[xrayIdx].drawBones(ctx, W, H);
        }
        drawXrayHUD();
        drawClickResult();
        drawBottomInfo();

        requestAnimationFrame(draw);
    }

    function handleClick(cx, cy) {
        if (clickResult && clickResult.age < 0.5) return; // debounce
        const c = cases[xrayIdx];
        const anomalyX = c.anomaly.x * W;
        const anomalyY = c.anomaly.y * H;
        const anomalyR = c.anomaly.r * Math.max(W, H);
        const dist = Math.hypot(cx - anomalyX, cy - anomalyY);

        if (dist < anomalyR * 2.5) {
            // Hit! Score based on precision
            const precision = Math.max(0, 1 - dist / (anomalyR * 2.5));
            const pts = Math.round(10 + precision * 20);
            addScore(pts);
            totalScore += pts;
            clickResult = { x: cx, y: cy, distance: dist, age: 0, hit: true, points: pts };

            // Next x-ray after delay
            setTimeout(() => {
                xrayIdx++;
                clickResult = null;
                if (xrayIdx >= cases.length) {
                    running = false;
                    showResult('Analisis completado', totalScore + ' pts',
                        totalScore >= 80 ? 'Gran ojo clinico!' : 'Sigue practicando',
                        () => startMedico('radiologo'));
                }
            }, 1200);
        } else {
            clickResult = { x: cx, y: cy, distance: dist, age: 0, hit: false, points: 0 };
            addScore(-3);
        }
    }

    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x, y };
    }

    const onClick = (e) => { e.preventDefault(); const { x, y } = getCanvasCoords(e); handleClick(x, y); };
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onClick, { passive: false });

    // Custom cursor via CSS
    canvas.style.cursor = 'crosshair';

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Encuentra la anomalia en cada radiografia</div>';

    draw();

    currentGame = {
        cleanup: () => {
            running = false;
            canvas.removeEventListener('click', onClick);
            canvas.removeEventListener('touchstart', onClick);
            canvas.style.cursor = '';
            canvas.style.display = 'none';
            ui.innerHTML = '';
            ui.style.pointerEvents = '';
            controls.innerHTML = '';
        }
    };
}

// ============================================================
// 4. FARMACEUTICO - Canvas pharmacy shelf, drag medicines
// ============================================================
function medicoFarmaceutico(ui, controls) {
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
    let patientIdx = 0;
    let correct = 0;
    let hoveredMed = -1;
    let wrongAnim = { active: false, age: 0, text: '' };
    let correctAnim = { active: false, age: 0 };
    let timePerPatient = 15;
    let timeLeft = timePerPatient;
    let timerInterval = null;

    const cases = shuffleArray(PATIENTS).slice(0, 6);

    // Medicine shelf items (all unique meds from PATIENTS)
    const ALL_MEDS = [...new Set(PATIENTS.map(p => p.meds))].map((m, i) => {
        const icons = PATIENTS.find(p => p.meds === m).medsIcon || '💊';
        const colors = [
            'rgba(100,180,255,0.3)', 'rgba(255,150,100,0.3)', 'rgba(100,255,150,0.3)',
            'rgba(255,100,200,0.3)', 'rgba(200,150,255,0.3)', 'rgba(255,255,100,0.3)',
            'rgba(100,255,255,0.3)', 'rgba(255,180,180,0.3)'
        ];
        return { label: m, icon: icons, color: colors[i % colors.length] };
    });

    function getShelfMeds() {
        const currentMed = cases[patientIdx]?.meds;
        const others = ALL_MEDS.filter(m => m.label !== currentMed);
        const selected = shuffleArray(others).slice(0, 4);
        const correctMed = ALL_MEDS.find(m => m.label === currentMed);
        if (correctMed) selected.push(correctMed);
        return shuffleArray(selected);
    }

    let shelfMeds = getShelfMeds();

    function getMedRects() {
        const shelfY = H * 0.42;
        const shelfH = H * 0.50;
        const cols = Math.min(3, shelfMeds.length);
        const rows = Math.ceil(shelfMeds.length / cols);
        const cellW = (W - 24) / cols;
        const cellH = Math.min(shelfH / rows, 80);
        return shelfMeds.map((m, i) => ({
            x: 12 + (i % cols) * cellW,
            y: shelfY + Math.floor(i / cols) * cellH,
            w: cellW - 6,
            h: cellH - 6,
            med: m
        }));
    }

    function drawPatientBubble() {
        const p = cases[patientIdx];
        if (!p) return;

        // Patient
        ctx.save();
        ctx.font = '36px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🤒', W * 0.15, H * 0.14);

        // Speech bubble
        const bx = W * 0.28;
        const by = H * 0.03;
        const bw = W * 0.68;
        const bh = H * 0.17;

        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        roundRect(ctx, bx, by, bw, bh, 12);
        ctx.fill();
        ctx.stroke();

        // Bubble tail
        ctx.beginPath();
        ctx.moveTo(bx, by + bh * 0.4);
        ctx.lineTo(bx - 12, by + bh * 0.55);
        ctx.lineTo(bx, by + bh * 0.65);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fill();

        // Symptoms text
        ctx.fillStyle = '#e0e0e0';
        ctx.font = 'bold 11px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Me siento mal...', bx + 10, by + 18);
        ctx.fillStyle = '#ffc107';
        ctx.font = '10px Poppins, sans-serif';
        p.symptoms.forEach((s, i) => {
            ctx.fillText('- ' + s, bx + 10, by + 34 + i * 15);
        });

        // Diagnosis badge
        ctx.fillStyle = 'rgba(100,200,255,0.15)';
        roundRect(ctx, bx + 10, by + bh - 22, bw - 20, 18, 6);
        ctx.fill();
        ctx.fillStyle = '#88ccff';
        ctx.font = '9px Poppins, sans-serif';
        ctx.fillText('Dx: ' + p.diagnosis, bx + 18, by + bh - 9);

        ctx.restore();
    }

    function drawShelf() {
        const shelfY = H * 0.35;
        ctx.save();

        // Shelf label
        ctx.fillStyle = '#888';
        ctx.font = '11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Estanteria de medicamentos', W / 2, shelfY);

        // Shelf background
        ctx.fillStyle = 'rgba(40,30,20,0.3)';
        ctx.strokeStyle = 'rgba(150,120,80,0.3)';
        ctx.lineWidth = 2;
        roundRect(ctx, 6, shelfY + 8, W - 12, H - shelfY - 60, 10);
        ctx.fill();
        ctx.stroke();

        // Medicine bottles
        const rects = getMedRects();
        rects.forEach((r, i) => {
            const isHover = hoveredMed === i;
            ctx.fillStyle = isHover ? shelfMeds[i].color.replace('0.3', '0.5') : shelfMeds[i].color;
            ctx.strokeStyle = isHover ? '#00d2ff' : 'rgba(255,255,255,0.15)';
            ctx.lineWidth = isHover ? 2 : 1;
            roundRect(ctx, r.x, r.y, r.w, r.h, 8);
            ctx.fill();
            ctx.stroke();

            // Bottle icon
            ctx.font = '18px serif';
            ctx.textAlign = 'center';
            ctx.fillText(r.med.icon, r.x + r.w / 2, r.y + 26);

            // Label
            ctx.fillStyle = '#ddd';
            ctx.font = '8px Poppins, sans-serif';
            const words = r.med.label.split(' + ');
            words.forEach((w, wi) => {
                ctx.fillText(w.trim(), r.x + r.w / 2, r.y + 42 + wi * 12);
            });
        });

        ctx.restore();
    }

    function drawHUD() {
        ctx.save();
        ctx.fillStyle = '#888';
        ctx.font = '11px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Paciente ${patientIdx + 1} de ${cases.length}`, 10, H * 0.25);
        ctx.textAlign = 'right';
        ctx.fillStyle = timeLeft <= 5 ? '#ff6b6b' : '#ffc107';
        ctx.font = 'bold 13px Poppins, sans-serif';
        ctx.fillText(`${timeLeft}s`, W - 10, H * 0.25);

        // Score badges
        ctx.fillStyle = '#43e97b';
        ctx.font = '11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Correctos: ${correct}`, W / 2, H * 0.30);
        ctx.restore();
    }

    function drawAnims() {
        if (wrongAnim.active) {
            wrongAnim.age += 0.03;
            if (wrongAnim.age >= 1) wrongAnim.active = false;
            ctx.save();
            ctx.globalAlpha = 1 - wrongAnim.age;
            ctx.fillStyle = 'rgba(255,50,50,0.15)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 14px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Efecto secundario!', W / 2, H * 0.33 - wrongAnim.age * 20);
            ctx.font = '11px Poppins, sans-serif';
            ctx.fillText(wrongAnim.text, W / 2, H * 0.33 + 16 - wrongAnim.age * 20);
            ctx.restore();
        }
        if (correctAnim.active) {
            correctAnim.age += 0.03;
            if (correctAnim.age >= 1) correctAnim.active = false;
            ctx.save();
            ctx.globalAlpha = 1 - correctAnim.age;
            ctx.fillStyle = '#43e97b';
            ctx.font = `${20 + correctAnim.age * 10}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('✅', W / 2, H * 0.33 - correctAnim.age * 30);
            ctx.restore();
        }
    }

    function draw() {
        if (!running) return;
        animTimer += 0.016;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, W, H);

        drawPatientBubble();
        drawHUD();
        drawShelf();
        drawAnims();

        requestAnimationFrame(draw);
    }

    function handleMedClick(cx, cy) {
        const rects = getMedRects();
        for (let i = 0; i < rects.length; i++) {
            const r = rects[i];
            if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) {
                const p = cases[patientIdx];
                if (r.med.label === p.meds) {
                    correct++;
                    addScore(20);
                    correctAnim = { active: true, age: 0 };
                } else {
                    addScore(-5);
                    const sideEffects = [
                        'El paciente se mareo!', 'No es el tratamiento correcto!',
                        'Reaccion adversa!', 'Lee bien los sintomas!'
                    ];
                    wrongAnim = { active: true, age: 0, text: randomFrom(sideEffects) };
                }

                // Next patient
                setTimeout(() => {
                    patientIdx++;
                    timeLeft = Math.max(8, timePerPatient - patientIdx); // increasing speed
                    if (patientIdx >= cases.length) {
                        running = false;
                        clearInterval(timerInterval);
                        showResult('Farmacia cerrada', `${correct}/${cases.length}`,
                            correct >= 5 ? 'Farmaceutico experto!' : correct >= 3 ? 'Buen trabajo!' : 'Revisa el vademecum',
                            () => startMedico('farmaceutico'));
                    } else {
                        shelfMeds = getShelfMeds();
                    }
                }, 600);
                break;
            }
        }
    }

    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x, y };
    }

    const onClick = (e) => { e.preventDefault(); const { x, y } = getCanvasCoords(e); handleMedClick(x, y); };
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onClick, { passive: false });

    const onMove = (e) => {
        const { x, y } = getCanvasCoords(e);
        const rects = getMedRects();
        hoveredMed = -1;
        rects.forEach((r, i) => { if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) hoveredMed = i; });
    };
    canvas.addEventListener('mousemove', onMove);

    // Keyboard
    let kbSel = 0;
    const kbHandler = (e) => {
        const rects = getMedRects();
        const cols = Math.min(3, shelfMeds.length);
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') kbSel = Math.max(0, kbSel - 1);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') kbSel = Math.min(rects.length - 1, kbSel + 1);
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') kbSel = Math.max(0, kbSel - cols);
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') kbSel = Math.min(rects.length - 1, kbSel + cols);
        hoveredMed = kbSel;
        if (e.key === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            const r = rects[kbSel];
            if (r) handleMedClick(r.x + r.w / 2, r.y + r.h / 2);
        }
    };
    document.addEventListener('keydown', kbHandler);

    // Timer
    timerInterval = setInterval(() => {
        if (!running) return;
        timeLeft--;
        if (timeLeft <= 0) {
            // Auto skip to next patient
            patientIdx++;
            timeLeft = Math.max(8, timePerPatient - patientIdx);
            if (patientIdx >= cases.length) {
                running = false;
                clearInterval(timerInterval);
                showResult('Farmacia cerrada', `${correct}/${cases.length}`,
                    correct >= 5 ? 'Farmaceutico experto!' : correct >= 3 ? 'Buen trabajo!' : 'Revisa el vademecum',
                    () => startMedico('farmaceutico'));
            } else {
                shelfMeds = getShelfMeds();
            }
        }
    }, 1000);

    controls.innerHTML = '<div style="text-align:center;width:100%;color:#aaa;font-size:0.8rem;">Selecciona el medicamento correcto para cada paciente</div><div style="text-align:center;width:100%;color:#666;font-size:0.65rem;margin-top:4px;">WASD/Flechas: mover | Enter/Espacio: seleccionar</div>';

    draw();

    currentGame = {
        cleanup: () => {
            running = false;
            clearInterval(timerInterval);
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

// Helper: rounded rectangle
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
