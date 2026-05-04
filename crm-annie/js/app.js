// Router, modales y arranque del CRM.

const App = {
  currentUser: 'annie',

  init() {
    Store.load();
    if (window.seedDemo) seedDemo();

    // Nav
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.onclick = () => Views.render(b.dataset.view);
    });
    document.getElementById('userSwitch').onchange = e => {
      App.currentUser = e.target.value;
      Views.render(Views.current);
    };

    // Re-render cuando cambia el store
    document.addEventListener('store:changed', () => {
      Views.render(Views.current);
    });

    // Cerrar modal al click backdrop
    document.getElementById('modal').addEventListener('click', e => {
      if (e.target.id === 'modal') Modals.close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') Modals.close();
    });

    // Refrescar dashboard cada 30s para timers SLA
    setInterval(() => {
      if (Views.current === 'dashboard') Views.render('dashboard');
    }, 30000);

    Views.render('dashboard');
  }
};

// =====================================================================
// Modales
// =====================================================================

const Modals = {
  open(html) {
    const m = document.getElementById('modal');
    document.getElementById('modalContent').innerHTML = html;
    m.hidden = false;
  },

  close() {
    document.getElementById('modal').hidden = true;
  },

  // ---------- Nuevo lead ----------
  nuevoLead() {
    const origenes = ORIGENES.map(o => `<option value="${o.id}">${o.label}</option>`).join('');
    const tipos = TIPOS_CASO.map(t => `<option value="${t.id}">${t.label} · ${t.honorarios} €</option>`).join('');
    const ahora = new Date().toISOString().slice(0, 16);

    Modals.open(`
      <h2>Nuevo lead</h2>
      <p style="color:var(--text-soft);margin-top:-8px;">Capta los datos mínimos. Lo demás lo recogerás en la primera llamada.</p>
      <form id="formLead">
        <div class="form-grid">
          <label>Nombre completo *<input name="nombre" required></label>
          <label>Teléfono *<input name="telefono" type="tel" required></label>
          <label>Email<input name="email" type="email"></label>
          <label>Asignar a
            <select name="asignado">
              <option value="annie">Annie</option>
              <option value="elena">Elena</option>
            </select>
          </label>
          <label>Deuda total estimada (€)<input name="deudaTotal" type="number" min="0" step="100"></label>
          <label>Nº acreedores<input name="numAcreedores" type="number" min="0"></label>
          <label>Ingresos mensuales netos (€)<input name="ingresosMensuales" type="number" min="0"></label>
          <label>Tipo de caso<select name="tipoCaso">${tipos}</select></label>
          <label>Origen<select name="origen">${origenes}</select></label>
          <label>Palabra clave (Google Ads)<input name="palabraClave" placeholder="ej: abogado segunda oportunidad valladolid"></label>
          <label>Campaña<input name="campania"></label>
          <label>Coste click (€)<input name="costeClick" type="number" step="0.01" min="0"></label>
        </div>
        <label>Situación / motivo de la consulta
          <textarea name="situacion" placeholder="Resumen breve de qué ha pasado y qué necesita."></textarea>
        </label>
        <input type="hidden" name="fechaEntrada" value="${new Date().toISOString()}">
        <div class="modal-actions">
          <button type="button" class="btn" id="cancelLead">Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar y empezar el cronómetro</button>
        </div>
      </form>
    `);
    document.getElementById('cancelLead').onclick = Modals.close;
    document.getElementById('formLead').onsubmit = e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      data.honorarios = TIPOS_CASO.find(t => t.id === data.tipoCaso).honorarios;
      Store.addLead(data);
      Modals.close();
    };
  },

  // ---------- Detalle lead ----------
  lead(id) {
    const l = Store.state.leads.find(x => x.id === id);
    if (!l) return;
    const etapa = ETAPAS.find(e => e.id === l.etapa);
    const origen = ORIGENES.find(o => o.id === l.origen);
    const tipo = TIPOS_CASO.find(t => t.id === l.tipoCaso);

    Modals.open(`
      <div class="caso-header">
        <div>
          <h2>${l.nombre}</h2>
          <div style="color:var(--text-soft);font-size:13px;">
            ${l.telefono} · ${l.email || 'sin email'} · ${origen ? origen.label : ''}
          </div>
        </div>
        <span class="badge" style="background:${etapa.color};color:white;">${etapa.label}</span>
      </div>

      <div class="modal-tabs" id="leadTabs">
        <button data-tab="info" class="active">Datos</button>
        <button data-tab="acciones">Acciones</button>
        <button data-tab="comunicacion">Comunicación</button>
        <button data-tab="notas">Notas</button>
      </div>

      <div id="tabContent"></div>
    `);

    const tabs = document.querySelectorAll('#leadTabs button');
    const renderTab = name => {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
      const c = document.getElementById('tabContent');
      if (name === 'info') {
        c.innerHTML = `
          <div class="form-grid">
            <div><b>Deuda total:</b> ${(l.deudaTotal || 0).toLocaleString('es-ES')} €</div>
            <div><b>Acreedores:</b> ${l.numAcreedores || '—'}</div>
            <div><b>Ingresos/mes:</b> ${(l.ingresosMensuales || 0).toLocaleString('es-ES')} €</div>
            <div><b>Honorarios:</b> ${(l.honorarios || 2500).toLocaleString('es-ES')} €</div>
            <div><b>Tipo:</b> ${tipo ? tipo.label : '—'}</div>
            <div><b>Asignado:</b> ${l.asignado === 'annie' ? 'Annie' : 'Elena'}</div>
            <div><b>Palabra clave:</b> ${l.palabraClave || '—'}</div>
            <div><b>Campaña:</b> ${l.campania || '—'}</div>
            <div><b>Coste click:</b> ${l.costeClick ? l.costeClick.toFixed(2) + ' €' : '—'}</div>
            <div><b>Entrada:</b> ${new Date(l.fechaEntrada).toLocaleString('es-ES')}</div>
            <div><b>1er contacto:</b> ${l.fechaPrimerContacto ? new Date(l.fechaPrimerContacto).toLocaleString('es-ES') : '⚠️ pendiente'}</div>
            <div><b>Cita:</b> ${l.fechaCita ? new Date(l.fechaCita).toLocaleString('es-ES') : '—'}</div>
          </div>
          ${l.situacion ? `<div class="card-sub" style="margin-top:12px;"><b>Situación:</b> ${l.situacion}</div>` : ''}
          ${l.casoId ? `<div style="margin-top:12px;"><button class="btn" id="goCaso">Abrir expediente del caso →</button></div>` : ''}
        `;
        const goCaso = document.getElementById('goCaso');
        if (goCaso) goCaso.onclick = () => { Modals.close(); Views.render('casos'); setTimeout(() => Modals.caso(l.casoId), 100); };
      }
      if (name === 'acciones') {
        const etapasBtns = ETAPAS.map(e => {
          const active = e.id === l.etapa;
          return `<button class="btn btn-sm" data-etapa="${e.id}" style="${active ? `background:${e.color};color:white;border-color:${e.color};` : ''}">${e.label}</button>`;
        }).join(' ');
        c.innerHTML = `
          <h3 style="margin-top:0;">Mover a etapa</h3>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">${etapasBtns}</div>

          <h3>Agendar cita</h3>
          <div class="form-row">
            <label>Fecha y hora<input type="datetime-local" id="fechaCita" value="${l.fechaCita ? l.fechaCita.slice(0, 16) : ''}"></label>
            <button class="btn" id="guardarCita">Guardar cita</button>
          </div>

          <h3>Honorarios y pago</h3>
          <div class="form-row">
            <label>Honorarios (€)<input type="number" id="honorarios" value="${l.honorarios || 2500}"></label>
            <button class="btn" id="guardarHonorarios">Actualizar</button>
          </div>
          <div class="form-row">
            <label>Importe pago (€)<input type="number" id="importePago" placeholder="1000"></label>
            <label>Concepto<input id="conceptoPago" placeholder="Provisión inicial"></label>
            <button class="btn" id="addPago">Registrar pago</button>
          </div>

          ${l.pagos.length ? `<h4>Pagos registrados</h4>
            <ul>${l.pagos.map(p => `<li>${new Date(p.fecha).toLocaleDateString('es-ES')} · ${p.importe.toLocaleString('es-ES')} € · ${p.concepto}</li>`).join('')}</ul>` : ''}

          ${l.etapa === 'perdido' ? `<h3>Motivo perdido</h3>
            <select id="motivoPerdido">
              <option value="">—</option>
              <option ${l.motivoPerdido === 'precio' ? 'selected' : ''} value="precio">Precio</option>
              <option ${l.motivoPerdido === 'plazo' ? 'selected' : ''} value="plazo">Plazo</option>
              <option ${l.motivoPerdido === 'competencia' ? 'selected' : ''} value="competencia">Competencia</option>
              <option ${l.motivoPerdido === 'cambio' ? 'selected' : ''} value="cambio">Cambió de idea</option>
              <option ${l.motivoPerdido === 'otro' ? 'selected' : ''} value="otro">Otro</option>
            </select>` : ''}
        `;
        c.querySelectorAll('[data-etapa]').forEach(b => b.onclick = () => {
          Store.moverEtapa(l.id, b.dataset.etapa);
          Modals.close(); Modals.lead(l.id);
        });
        document.getElementById('guardarCita').onclick = () => {
          const f = document.getElementById('fechaCita').value;
          if (f) {
            Store.updateLead(l.id, { fechaCita: new Date(f).toISOString() });
            if (l.etapa === 'contactado') Store.moverEtapa(l.id, 'cita');
          }
          Modals.close(); Modals.lead(l.id);
        };
        document.getElementById('guardarHonorarios').onclick = () => {
          Store.updateLead(l.id, { honorarios: Number(document.getElementById('honorarios').value) || 2500 });
          Modals.close(); Modals.lead(l.id);
        };
        document.getElementById('addPago').onclick = () => {
          const imp = Number(document.getElementById('importePago').value);
          const con = document.getElementById('conceptoPago').value || 'Pago';
          if (imp > 0) {
            Store.addPago(l.id, imp, con);
            Modals.close(); Modals.lead(l.id);
          }
        };
        const mp = document.getElementById('motivoPerdido');
        if (mp) mp.onchange = () => Store.updateLead(l.id, { motivoPerdido: mp.value });
      }
      if (name === 'comunicacion') {
        const aj = Store.state.ajustes;
        const opciones = [
          { id: 'whatsapp', label: '💬 WhatsApp inicial', fn: () => Templates.whatsappPrimerContacto(l, aj) },
          { id: 'email_conf', label: '✉️ Email confirmación', fn: () => Templates.emailConfirmacion(l, aj) },
          { id: 'email_recordatorio', label: '🗓 Email recordatorio cita', fn: () => Templates.emailRecordatorioCita(l, aj) },
          { id: 'whatsapp_cita', label: '💬 WhatsApp recordatorio cita', fn: () => Templates.whatsappRecordatorioCita(l, aj) },
          { id: 'email_presupuesto', label: '📑 Email presupuesto', fn: () => Templates.emailPresupuesto(l, aj) },
          { id: 'email_seg48', label: '🔔 Seguimiento 48h', fn: () => Templates.emailSeguimiento48h(l, aj) },
          { id: 'email_seg7d', label: '⏳ Seguimiento 7 días', fn: () => Templates.emailSeguimiento7dias(l, aj) },
          { id: 'hoja_encargo', label: '📜 Hoja de encargo', fn: () => Templates.hojaEncargo(l, aj) }
        ];
        c.innerHTML = `
          <p class="card-sub">Selecciona una plantilla. Sustituye lo que necesites y copia o descarga.</p>
          <select id="selPlantilla" style="width:100%;margin-bottom:10px;">
            ${opciones.map(o => `<option value="${o.id}">${o.label}</option>`).join('')}
          </select>
          <div id="plantillaOut" class="plantilla-box"></div>
          <div class="modal-actions">
            <button class="btn" id="copiar">Copiar al portapapeles</button>
            <button class="btn btn-primary" id="descargar">Descargar .txt</button>
            ${l.telefono ? `<a class="btn" id="abrirWA" target="_blank">Abrir en WhatsApp</a>` : ''}
          </div>
        `;
        const sel = document.getElementById('selPlantilla');
        const out = document.getElementById('plantillaOut');
        const renderPlantilla = () => {
          const opt = opciones.find(o => o.id === sel.value);
          const r = opt.fn();
          out.textContent = r.asunto ? `Asunto: ${r.asunto}\n\n${r.cuerpo}` : r;
          const wa = document.getElementById('abrirWA');
          if (wa) {
            const text = r.cuerpo || r;
            const phone = l.telefono.replace(/\D/g, '');
            wa.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
          }
        };
        sel.onchange = renderPlantilla;
        renderPlantilla();

        document.getElementById('copiar').onclick = () => {
          navigator.clipboard.writeText(out.textContent);
          alert('Copiado.');
        };
        document.getElementById('descargar').onclick = () => {
          const filename = `${sel.value}-${l.nombre.replace(/\s+/g, '_')}.txt`;
          const blob = new Blob([out.textContent], { type: 'text/plain' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          a.click();
        };
      }
      if (name === 'notas') {
        c.innerHTML = `
          <div class="form-row">
            <textarea id="notaTexto" placeholder="Apuntar lo que haya pasado en la llamada, dudas del cliente, próximos pasos..." style="flex:1;"></textarea>
            <button class="btn btn-primary" id="addNota">Añadir nota</button>
          </div>
          <div class="timeline">
            ${l.notas.map(n => `
              <div class="timeline-item">
                <div class="timeline-fecha">${new Date(n.fecha).toLocaleString('es-ES')} · ${n.autor === 'annie' ? 'Annie' : 'Elena'}</div>
                <div>${n.texto}</div>
              </div>`).join('') || '<div class="empty">Sin notas todavía.</div>'}
          </div>
        `;
        document.getElementById('addNota').onclick = () => {
          const t = document.getElementById('notaTexto').value.trim();
          if (t) {
            Store.addNota(l.id, t, App.currentUser);
            Modals.close(); Modals.lead(l.id);
          }
        };
      }
    };
    tabs.forEach(t => t.onclick = () => renderTab(t.dataset.tab));
    renderTab('info');
  },

  // ---------- Detalle caso ----------
  caso(id) {
    const c = Store.state.casos.find(x => x.id === id);
    if (!c) return;
    const lead = Store.state.leads.find(l => l.id === c.leadId);
    const idxFase = FASES_LSO.findIndex(f => f.id === c.faseActual);

    Modals.open(`
      <div class="caso-header">
        <div>
          <h2>${c.cliente}</h2>
          <div class="exp">${c.expediente} · ${TIPOS_CASO.find(t => t.id === c.tipoCaso)?.label || ''}</div>
        </div>
        <div>
          ${c.fechaCierre
            ? `<span class="badge" style="background:var(--green);color:white;">Cerrado</span>`
            : `<button class="btn btn-sm" id="avanzarFase">Avanzar fase →</button>`}
        </div>
      </div>

      <div class="fases-timeline">
        ${FASES_LSO.map((f, i) => {
          let cls = '';
          if (i < idxFase) cls = 'completa';
          if (i === idxFase) cls = 'actual';
          return `<div class="fase-pill ${cls}" data-fase="${f.id}">${f.label}</div>`;
        }).join('')}
      </div>

      <div class="modal-tabs" id="casoTabs">
        <button data-tab="checklist" class="active">Checklist fase actual</button>
        <button data-tab="tareas">Tareas</button>
        <button data-tab="datos">Datos juzgado</button>
        <button data-tab="hitos">Hitos</button>
      </div>
      <div id="casoContent"></div>
      ${!c.fechaCierre && idxFase === FASES_LSO.length - 1 ? `<div class="modal-actions"><button class="btn btn-primary" id="cerrarCaso">Cerrar caso (exoneración firme)</button></div>` : ''}
    `);

    const renderFase = faseId => {
      const fase = FASES_LSO.find(f => f.id === faseId);
      const estado = c.fasesEstado[faseId];
      const cont = document.getElementById('casoContent');
      cont.innerHTML = `
        <h3>${fase.label}</h3>
        <p style="color:var(--text-soft);font-size:13px;">Plazo orientativo: ${fase.dias} días.</p>
        <div class="checklist">
          ${fase.checklist.map(item => `
            <label class="checklist-item">
              <input type="checkbox" data-item="${item}" ${estado.completados.includes(item) ? 'checked' : ''}>
              <span>${item}</span>
            </label>`).join('')}
        </div>
      `;
      cont.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.onchange = () => {
          Store.toggleChecklistFase(c.id, faseId, cb.dataset.item);
        };
      });
    };

    const renderTab = name => {
      document.querySelectorAll('#casoTabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
      const cont = document.getElementById('casoContent');
      if (name === 'checklist') {
        renderFase(c.faseActual);
      }
      if (name === 'tareas') {
        cont.innerHTML = `
          <div class="form-row">
            <input id="tareaTexto" placeholder="Nueva tarea..." style="flex:1;">
            <select id="tareaAsignado">
              <option value="elena">Elena</option>
              <option value="annie">Annie</option>
            </select>
            <button class="btn btn-primary" id="addTarea">Añadir</button>
          </div>
          <div class="tareas">
            ${c.tareas.map(t => `
              <div class="tarea-item ${t.hecho ? 'hecho' : ''}">
                <input type="checkbox" data-tarea="${t.id}" ${t.hecho ? 'checked' : ''}>
                <div class="tarea-text">${t.texto}</div>
                <span class="badge badge-${t.asignado}">${t.asignado === 'annie' ? 'Annie' : 'Elena'}</span>
              </div>`).join('') || '<div class="empty">Sin tareas. Añade alguna.</div>'}
          </div>
        `;
        document.getElementById('addTarea').onclick = () => {
          const t = document.getElementById('tareaTexto').value.trim();
          const a = document.getElementById('tareaAsignado').value;
          if (t) {
            Store.addTarea(c.id, t, a);
            Modals.close(); Modals.caso(c.id);
          }
        };
        cont.querySelectorAll('input[type="checkbox"][data-tarea]').forEach(cb => {
          cb.onchange = () => Store.toggleTarea(c.id, cb.dataset.tarea);
        });
      }
      if (name === 'datos') {
        cont.innerHTML = `
          <div class="form-grid">
            <label>Juzgado<input id="juzgado" value="${c.juzgado || ''}" placeholder="Juzgado de lo Mercantil nº X de Valladolid"></label>
            <label>Nº autos<input id="numAutos" value="${c.numAutos || ''}"></label>
            <label>Cliente<input value="${c.cliente}" disabled></label>
            <label>Tipo<input value="${TIPOS_CASO.find(t => t.id === c.tipoCaso)?.label || ''}" disabled></label>
            <label>Apertura<input value="${new Date(c.fechaApertura).toLocaleDateString('es-ES')}" disabled></label>
            <label>Estado<input value="${c.fechaCierre ? 'Cerrado ' + new Date(c.fechaCierre).toLocaleDateString('es-ES') : 'En curso'}" disabled></label>
          </div>
          ${lead ? `<div class="card-sub">
            <b>Deuda total:</b> ${(lead.deudaTotal || 0).toLocaleString('es-ES')} € ·
            <b>Acreedores:</b> ${lead.numAcreedores || '—'} ·
            <b>Ingresos/mes:</b> ${(lead.ingresosMensuales || 0).toLocaleString('es-ES')} €
          </div>` : ''}
          <button class="btn btn-primary" id="guardarDatos" style="margin-top:10px;">Guardar</button>
        `;
        document.getElementById('guardarDatos').onclick = () => {
          Store.updateCaso(c.id, {
            juzgado: document.getElementById('juzgado').value,
            numAutos: document.getElementById('numAutos').value
          });
          alert('Datos guardados.');
        };
      }
      if (name === 'hitos') {
        cont.innerHTML = `
          <div class="form-row">
            <input id="hitoTexto" placeholder="Ej. Recibido auto de admisión a trámite" style="flex:1;">
            <button class="btn btn-primary" id="addHito">Añadir hito</button>
          </div>
          <div class="timeline">
            ${c.hitos.map(h => `
              <div class="timeline-item">
                <div class="timeline-fecha">${new Date(h.fecha).toLocaleString('es-ES')}</div>
                <div>${h.descripcion}</div>
              </div>`).join('')}
          </div>
        `;
        document.getElementById('addHito').onclick = () => {
          const t = document.getElementById('hitoTexto').value.trim();
          if (t) {
            c.hitos.unshift({ fecha: new Date().toISOString(), descripcion: t });
            Store.save();
            Modals.close(); Modals.caso(c.id);
          }
        };
      }
    };

    document.querySelectorAll('#casoTabs button').forEach(b => b.onclick = () => renderTab(b.dataset.tab));
    document.querySelectorAll('.fase-pill').forEach(p => p.onclick = () => renderFase(p.dataset.fase));

    const av = document.getElementById('avanzarFase');
    if (av) av.onclick = () => {
      if (confirm('¿Avanzar a la siguiente fase del procedimiento?')) {
        Store.avanzarFase(c.id);
        Modals.close(); Modals.caso(c.id);
      }
    };
    const cer = document.getElementById('cerrarCaso');
    if (cer) cer.onclick = () => {
      if (confirm('¿Cerrar definitivamente el caso?')) {
        Store.cerrarCaso(c.id);
        Modals.close();
      }
    };

    renderTab('checklist');
  }
};

window.App = App;
window.Modals = Modals;

document.addEventListener('DOMContentLoaded', () => App.init());
