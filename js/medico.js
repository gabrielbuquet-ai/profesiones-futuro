// ==========================================
// MEDICO - Mini-juegos
// ==========================================

const PATIENTS = [
    { symptoms: ['Fiebre alta', 'Tos seca', 'Dolor de cabeza'], diagnosis: 'Gripe', meds: '💊 Paracetamol + 🧴 Jarabe para la tos' },
    { symptoms: ['Dolor de estomago', 'Nauseas', 'Diarrea'], diagnosis: 'Gastroenteritis', meds: '💧 Suero oral + 💊 Antidiarreico' },
    { symptoms: ['Erupcion en la piel', 'Picazon', 'Enrojecimiento'], diagnosis: 'Alergia', meds: '💊 Antihistaminico + 🧴 Crema calmante' },
    { symptoms: ['Dolor en el pecho', 'Dificultad para respirar', 'Fatiga'], diagnosis: 'Bronquitis', meds: '💊 Antibiotico + 🫁 Inhalador' },
    { symptoms: ['Dolor de garganta', 'Fiebre', 'Ganglios inflamados'], diagnosis: 'Amigdalitis', meds: '💊 Ibuprofeno + 💊 Antibiotico' },
    { symptoms: ['Vision borrosa', 'Dolor de cabeza intenso', 'Mareos'], diagnosis: 'Migrania', meds: '💊 Triptanes + 😎 Reposo en oscuridad' },
    { symptoms: ['Hinchazon en tobillo', 'Dolor al caminar', 'Morado'], diagnosis: 'Esguince', meds: '🧊 Hielo + 🩹 Vendaje compresivo' },
    { symptoms: ['Tos con flema', 'Fiebre', 'Dolor al respirar'], diagnosis: 'Neumonia', meds: '💊 Antibiotico fuerte + 🫁 Oxigeno' }
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

function medicoGeneral(ui, controls) {
    let patientIndex = 0;
    let correct = 0;
    const patients = shuffleArray(PATIENTS).slice(0, 5);

    function showPatient() {
        if (patientIndex >= patients.length) {
            showResult('Consulta terminada', `${correct}/${patients.length}`,
                correct >= 4 ? 'Excelente diagnóstico!' : correct >= 2 ? 'Puedes mejorar' : 'Sigue practicando',
                () => { patientIndex = 0; correct = 0; startMedico('general'); }
            );
            return;
        }

        const p = patients[patientIndex];
        const options = shuffleArray([...new Set([p.diagnosis, ...PATIENTS.filter(x => x.diagnosis !== p.diagnosis).map(x => x.diagnosis)])]).slice(0, 4);

        ui.innerHTML = `
            <div style="padding: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px;">
                <div style="text-align: center; color: #888; font-size: 0.8rem;">Paciente ${patientIndex + 1} de ${patients.length}</div>
                <div style="background: rgba(255,255,255,0.05); border-radius: 16px; padding: 20px;">
                    <div style="font-size: 3rem; text-align: center; margin-bottom: 10px;">🤒</div>
                    <h3 style="margin-bottom: 12px; text-align: center;">Sintomas:</h3>
                    ${p.symptoms.map(s => `<div style="padding: 8px 12px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 6px; font-size: 0.9rem;">• ${s}</div>`).join('')}
                </div>
                <h3 style="text-align: center;">¿Cual es el diagnostico?</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;" id="diagnosis-options"></div>
            </div>
        `;

        const optionsEl = document.getElementById('diagnosis-options');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'control-btn';
            btn.style.width = '100%';
            btn.style.padding = '14px';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === p.diagnosis) {
                    correct++;
                    addScore(20);
                    btn.style.background = 'linear-gradient(135deg, #43e97b88, #38f9d788)';
                } else {
                    btn.style.background = 'linear-gradient(135deg, #ff512f88, #f0932288)';
                    // Show correct
                    optionsEl.querySelectorAll('button').forEach(b => {
                        if (b.textContent === p.diagnosis) b.style.background = 'linear-gradient(135deg, #43e97b88, #38f9d788)';
                    });
                }
                optionsEl.querySelectorAll('button').forEach(b => b.onclick = null);
                setTimeout(() => { patientIndex++; showPatient(); }, 1200);
            };
            optionsEl.appendChild(btn);
        });
    }

    showPatient();
    currentGame = { cleanup: () => { ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function medicoCirujano(ui, controls) {
    const steps = [...SURGERY_STEPS];
    const shuffled = shuffleArray(steps);
    let currentStep = 0;

    ui.innerHTML = `
        <div class="recipe-area" id="surgery-area">
            <div style="text-align: center; color: #aaa; font-size: 0.8rem; margin-bottom: 8px;">Ordena los pasos de la operacion correctamente</div>
            <div id="surgery-progress"></div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #667eea; text-align: center;">Paso ${currentStep + 1}: ¿Que haces primero?</div>
            <div id="surgery-options" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;"></div>
        </div>
    `;

    function renderStep() {
        const progress = document.getElementById('surgery-progress');
        progress.innerHTML = steps.map((s, i) => `
            <div class="recipe-step ${i < currentStep ? 'done' : ''}" style="opacity: ${i < currentStep ? 1 : 0.3}">
                <div class="step-num">${i < currentStep ? '✓' : i + 1}</div>
                <div class="step-text">${i < currentStep ? s.icon + ' ' + s.step : '???'}</div>
            </div>
        `).join('');

        if (currentStep >= steps.length) {
            addScore(50);
            showResult('Operación exitosa!', score + ' pts', 'Has completado la operación correctamente.', () => startMedico('cirujano'));
            return;
        }

        const remaining = steps.filter((_, i) => i >= currentStep);
        const options = shuffleArray(remaining).slice(0, Math.min(4, remaining.length));
        const optionsEl = document.getElementById('surgery-options');
        const stepLabel = ui.querySelector('[id="surgery-area"] > div:nth-child(3)');

        optionsEl.innerHTML = '';
        stepLabel.textContent = `Paso ${currentStep + 1}: ¿Que toca ahora?`;

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'control-btn';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.textContent = opt.icon + ' ' + opt.step;
            btn.onclick = () => {
                if (opt.step === steps[currentStep].step) {
                    addScore(15);
                    currentStep++;
                    renderStep();
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

function medicoRadiologo(ui, controls) {
    let idx = 0;
    let correct = 0;
    const xrays = shuffleArray(XRAYS).slice(0, 4);

    function showXray() {
        if (idx >= xrays.length) {
            showResult('Análisis completado', `${correct}/${xrays.length}`,
                correct >= 3 ? 'Gran ojo clínico!' : 'Sigue practicando', () => startMedico('radiologo'));
            return;
        }
        const x = xrays[idx];
        const options = shuffleArray([...new Set([x.problem, ...XRAYS.filter(r => r.problem !== x.problem).map(r => r.problem)])]).slice(0, 4);

        ui.innerHTML = `
            <div style="padding: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; align-items: center;">
                <div style="color: #888; font-size: 0.8rem;">Radiografia ${idx + 1} de ${xrays.length}</div>
                <div style="font-size: 6rem; background: rgba(255,255,255,0.03); border-radius: 20px; padding: 30px; border: 1px solid rgba(255,255,255,0.1);">${x.image}</div>
                <div style="color: #aaa; font-size: 0.85rem;">Zona: ${x.location}</div>
                <h3>¿Que observas?</h3>
                <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;" id="xray-options"></div>
            </div>
        `;

        const optionsEl = document.getElementById('xray-options');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'control-btn';
            btn.style.width = '100%';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === x.problem) {
                    correct++;
                    addScore(25);
                    btn.style.background = 'linear-gradient(135deg, #43e97b88, #38f9d788)';
                } else {
                    btn.style.background = 'linear-gradient(135deg, #ff512f88, #f0932288)';
                }
                optionsEl.querySelectorAll('button').forEach(b => b.onclick = null);
                setTimeout(() => { idx++; showXray(); }, 1200);
            };
            optionsEl.appendChild(btn);
        });
    }

    showXray();
    currentGame = { cleanup: () => { ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}

function medicoFarmaceutico(ui, controls) {
    let idx = 0;
    let correct = 0;
    const cases = shuffleArray(PATIENTS).slice(0, 5);

    function showCase() {
        if (idx >= cases.length) {
            showResult('Farmacia cerrada', `${correct}/${cases.length}`,
                correct >= 4 ? 'Farmacéutico experto!' : 'Revisa el vademécum', () => startMedico('farmaceutico'));
            return;
        }
        const c = cases[idx];
        const allMeds = [...new Set(PATIENTS.map(p => p.meds))];
        const options = shuffleArray([...new Set([c.meds, ...allMeds.filter(m => m !== c.meds)])]).slice(0, 4);

        ui.innerHTML = `
            <div style="padding: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px;">
                <div style="color: #888; font-size: 0.8rem; text-align: center;">Receta ${idx + 1} de ${cases.length}</div>
                <div style="background: rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">📋</div>
                    <h3>Diagnostico: ${c.diagnosis}</h3>
                    <p style="color: #888; font-size: 0.8rem; margin-top: 8px;">Sintomas: ${c.symptoms.join(', ')}</p>
                </div>
                <h3 style="text-align: center;">¿Que medicamento recetas?</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;" id="med-options"></div>
            </div>
        `;

        const optionsEl = document.getElementById('med-options');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'control-btn';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.style.fontSize = '0.8rem';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === c.meds) {
                    correct++;
                    addScore(20);
                    btn.style.background = 'linear-gradient(135deg, #43e97b88, #38f9d788)';
                } else {
                    btn.style.background = 'linear-gradient(135deg, #ff512f88, #f0932288)';
                }
                optionsEl.querySelectorAll('button').forEach(b => b.onclick = null);
                setTimeout(() => { idx++; showCase(); }, 1200);
            };
            optionsEl.appendChild(btn);
        });
    }

    showCase();
    currentGame = { cleanup: () => { ui.innerHTML = ''; ui.style.pointerEvents = ''; controls.innerHTML = ''; } };
}
