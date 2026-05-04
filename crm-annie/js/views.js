// Renderizadores de las vistas del CRM.
// Cada Views.* devuelve / monta DOM en el contenedor #app.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const fmtEUR = n => (n || 0).toLocaleString('es-ES') + ' €';
const fmtPct = n => isFinite(n) ? (n * 100).toFixed(1) + '%' : '—';

function relTime(iso) {
  if (!iso) return '—';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `hace ${Math.floor(diff)} s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

function timerSLA(iso) {
  const mins = (Date.now() - new Date(iso).getTime()) / 60000;
  let cls = '';
  if (mins > SLA_MINUTOS * 6) cls = 'danger';
  else if (mins > SLA_MINUTOS) cls = 'warn';
  return { mins, cls, label: relTime(iso) };
}

const Views = {
  current: 'dashboard',

  render(name) {
    Views.current = name;
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    const tpl = document.getElementById('tpl-' + name);
    const app = $('#app');
    app.innerHTML = '';
    app.appendChild(tpl.content.cloneNode(true));
    Views[name] && Views[name]();
  },

  // =================================================================
  // DASHBOARD
  // =================================================================
  dashboard() {
    const userId = App.currentUser;
    const user = USUARIOS.find(u => u.id === userId);
    $('[data-bind="userName"]').textContent = user.nombre.split(' ')[0];

    const mes = new Date().toISOString().slice(0, 7);
    const leads = Store.state.leads;
    const leadsMes = leads.filter(l => l.fechaEntrada.startsWith(mes));
    const ganados = leads.filter(l => l.etapa === 'ganado');
    const ganadosMes = ganados.filter(l => l.fechaEntrada.startsWith(mes));
    const inv = Store.inversionMes(mes);
    const cpl = leadsMes.length ? inv.total / leadsMes.length : 0;
    const cierre = leadsMes.length ? ganadosMes.length / leadsMes.length : 0;
    const ingresos = Store.ingresosMes(mes);
    const roas = inv.total ? ingresos / inv.total : 0;
    const casosActivos = Store.state.casos.filter(c => !c.fechaCierre).length;

    $('#kpiLeads').textContent = leadsMes.length;
    $('#kpiCPL').textContent = inv.total ? fmtEUR(Math.round(cpl)) : '—';
    $('#kpiCierre').textContent = leadsMes.length ? fmtPct(cierre) : '—';
    $('#kpiIngresos').textContent = fmtEUR(ingresos);
    $('#kpiROAS').textContent = inv.total ? roas.toFixed(1) + '×' : '—';
    $('#kpiCasos').textContent = casosActivos;

    // SLA alert
    const vencidos = Store.leadsSLAVencido();
    const sla = $('#slaAlert');
    if (vencidos.length > 0) {
      sla.hidden = false;
      sla.innerHTML = `<div><b>${vencidos.length} lead${vencidos.length > 1 ? 's' : ''} sin contactar pasaron los ${SLA_MINUTOS} min.</b><br>Cada minuto de retraso reduce x21 las probabilidades de cierre. Llámalos ya.</div>`;
    } else { sla.hidden = true; }

    // Acción inmediata: nuevos primero, luego cita en próximas 48h
    const urgentList = $('#urgentList');
    const nuevos = leads.filter(l => l.etapa === 'nuevo')
      .sort((a, b) => new Date(a.fechaEntrada) - new Date(b.fechaEntrada));
    if (nuevos.length === 0) {
      urgentList.innerHTML = '<div class="empty">Todos los leads están atendidos. Buen trabajo.</div>';
    } else {
      urgentList.innerHTML = nuevos.map(Views._leadCardHTML).join('');
      $$('.lead-card', urgentList).forEach(c => c.onclick = () => Modals.lead(c.dataset.id));
    }

    // Próximas citas
    const citasList = $('#citasList');
    const ahora = Date.now();
    const conCita = leads.filter(l => l.fechaCita && new Date(l.fechaCita).getTime() > ahora - 86400000)
      .sort((a, b) => new Date(a.fechaCita) - new Date(b.fechaCita))
      .slice(0, 5);
    if (conCita.length === 0) {
      citasList.innerHTML = '<div class="empty">No hay citas próximas.</div>';
    } else {
      citasList.innerHTML = conCita.map(l => `
        <div class="lead-card" data-id="${l.id}">
          <div class="lead-info">
            <b>${l.nombre}</b>
            <small>${new Date(l.fechaCita).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</small>
          </div>
          <div class="lead-meta">
            <span class="badge badge-${l.asignado}">${l.asignado === 'annie' ? 'Annie' : 'Elena'}</span>
            <span class="deuda">${fmtEUR(l.deudaTotal)}</span>
          </div>
        </div>`).join('');
      $$('.lead-card', citasList).forEach(c => c.onclick = () => Modals.lead(c.dataset.id));
    }

    // Tareas Elena
    const tareasElena = $('#tareasElena');
    const tareas = [];
    Store.state.casos.forEach(c => {
      if (c.fechaCierre) return;
      c.tareas.filter(t => !t.hecho && t.asignado === 'elena').forEach(t => {
        tareas.push({ casoId: c.id, expediente: c.expediente, cliente: c.cliente, ...t });
      });
    });
    if (tareas.length === 0) {
      tareasElena.innerHTML = '<div class="empty">Elena no tiene tareas pendientes. Asigna alguna desde un caso.</div>';
    } else {
      tareasElena.innerHTML = tareas.map(t => `
        <div class="tarea-item" data-caso="${t.casoId}" data-tarea="${t.id}">
          <input type="checkbox">
          <div class="tarea-text">
            <b>${t.cliente}</b> · ${t.texto}
            <br><small style="color:var(--text-soft)">${t.expediente}</small>
          </div>
        </div>`).join('');
      $$('.tarea-item input', tareasElena).forEach(cb => {
        cb.onchange = e => {
          const item = e.target.closest('.tarea-item');
          Store.toggleTarea(item.dataset.caso, item.dataset.tarea);
        };
      });
    }

    $('#btnNuevoLead').onclick = () => Modals.nuevoLead();
  },

  _leadCardHTML(l) {
    const t = timerSLA(l.fechaEntrada);
    const origen = ORIGENES.find(o => o.id === l.origen);
    return `
      <div class="lead-card" data-id="${l.id}">
        <div class="lead-info">
          <b>${l.nombre}</b>
          <small>${l.telefono} · ${l.situacion ? l.situacion.slice(0, 50) + (l.situacion.length > 50 ? '…' : '') : ''}</small>
          <div style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap;">
            <span class="badge badge-origen">${origen ? origen.label : l.origen}</span>
            <span class="badge badge-${l.asignado}">${l.asignado === 'annie' ? 'Annie' : 'Elena'}</span>
            ${l.palabraClave ? `<span class="badge">"${l.palabraClave}"</span>` : ''}
          </div>
        </div>
        <div class="lead-meta">
          <span class="deuda">${fmtEUR(l.deudaTotal)}</span>
          <span class="timer ${t.cls}">${t.label}</span>
        </div>
      </div>`;
  },

  // =================================================================
  // PIPELINE (Kanban)
  // =================================================================
  pipeline() {
    const kanban = $('#kanban');
    kanban.innerHTML = ETAPAS.map(et => {
      const leads = Store.leadsPorEtapa(et.id);
      return `
        <div class="kanban-col" data-etapa="${et.id}">
          <div class="stripe" style="background:${et.color}"></div>
          <header><b>${et.label}</b><span class="count">${leads.length}</span></header>
          <div class="kanban-cards">
            ${leads.map(l => Views._kanbanCardHTML(l)).join('')}
          </div>
        </div>`;
    }).join('');

    $$('.kanban-card', kanban).forEach(c => {
      c.onclick = () => Modals.lead(c.dataset.id);
      c.draggable = true;
      c.ondragstart = e => e.dataTransfer.setData('text/plain', c.dataset.id);
    });
    $$('.kanban-col', kanban).forEach(col => {
      col.ondragover = e => { e.preventDefault(); col.style.background = 'rgba(59,130,246,.05)'; };
      col.ondragleave = () => { col.style.background = ''; };
      col.ondrop = e => {
        e.preventDefault();
        col.style.background = '';
        const id = e.dataTransfer.getData('text/plain');
        Store.moverEtapa(id, col.dataset.etapa);
      };
    });

    $('#btnNuevoLead').onclick = () => Modals.nuevoLead();
  },

  _kanbanCardHTML(l) {
    const origen = ORIGENES.find(o => o.id === l.origen);
    return `
      <div class="kanban-card" data-id="${l.id}">
        <b>${l.nombre}</b>
        <div style="font-size:12px;color:var(--text-soft)">${l.telefono}</div>
        <div class="row">
          <span class="deuda" style="color:var(--primary);font-weight:700">${fmtEUR(l.deudaTotal)}</span>
          <span class="badge badge-${l.asignado}">${l.asignado === 'annie' ? 'A' : 'E'}</span>
        </div>
        <div style="font-size:11px;color:var(--text-soft);margin-top:4px;">
          ${origen ? origen.label : ''} · ${relTime(l.fechaEntrada)}
        </div>
      </div>`;
  },

  // =================================================================
  // CASOS
  // =================================================================
  casos() {
    const list = $('#casosList');
    const casos = Store.state.casos;
    if (casos.length === 0) {
      list.innerHTML = '<div class="empty">Aún no hay casos. Cuando un lead pase a "Ganado" se abrirá automáticamente su expediente.</div>';
      return;
    }
    list.innerHTML = casos.map(c => {
      const idx = FASES_LSO.findIndex(f => f.id === c.faseActual);
      const pct = c.fechaCierre ? 100 : ((idx) / FASES_LSO.length) * 100;
      const fase = FASES_LSO.find(f => f.id === c.faseActual);
      return `
        <div class="caso-card" data-id="${c.id}">
          <span class="exp">${c.expediente}</span>
          <h3>${c.cliente}</h3>
          <div style="font-size:13px;color:var(--text-soft);">
            ${c.fechaCierre ? '<b style="color:var(--green)">✓ Cerrado</b>' : `Fase actual: <b>${fase ? fase.label : ''}</b>`}
          </div>
          <div class="progress"><div style="width:${pct}%"></div></div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:12px;color:var(--text-soft);">
            <span>${c.tareas.filter(t => !t.hecho).length} tareas pendientes</span>
            <span>Abierto ${relTime(c.fechaApertura)}</span>
          </div>
        </div>`;
    }).join('');
    $$('.caso-card', list).forEach(c => c.onclick = () => Modals.caso(c.dataset.id));
  },

  // =================================================================
  // MÉTRICAS
  // =================================================================
  metricas() {
    const sel = $('#mesSelector');
    sel.value = sel.value || new Date().toISOString().slice(0, 7);
    const render = () => Views._renderMetricas(sel.value);
    sel.onchange = render;
    render();

    $('#guardarInversion').onclick = () => {
      const mes = sel.value;
      const g = Number($('#invGoogle').value) || 0;
      const m = Number($('#invMeta').value) || 0;
      Store.setInversion(mes, 'google', g);
      Store.setInversion(mes, 'meta', m);
      alert('Inversión guardada.');
      render();
    };
  },

  _renderMetricas(mes) {
    const leadsMes = Store.state.leads.filter(l => l.fechaEntrada.startsWith(mes));
    const ganadosMes = leadsMes.filter(l => l.etapa === 'ganado');
    const inv = Store.inversionMes(mes);
    const ingresos = ganadosMes.reduce((s, l) => s + (l.honorarios || 0), 0);
    const cpl = leadsMes.length ? inv.total / leadsMes.length : 0;
    const cac = ganadosMes.length ? inv.total / ganadosMes.length : 0;
    const roas = inv.total ? ingresos / inv.total : 0;

    $('#mInvGoogle').textContent = fmtEUR(inv.google);
    $('#mInvMeta').textContent = fmtEUR(inv.meta);
    $('#mLeads').textContent = leadsMes.length;
    $('#mCPL').textContent = inv.total && leadsMes.length ? fmtEUR(Math.round(cpl)) : '—';
    $('#mClientes').textContent = ganadosMes.length;
    $('#mCAC').textContent = ganadosMes.length && inv.total ? fmtEUR(Math.round(cac)) : '—';
    $('#mIngresos').textContent = fmtEUR(ingresos);
    $('#mROAS').textContent = inv.total ? roas.toFixed(1) + '×' : '—';

    $('#invGoogle').value = inv.google;
    $('#invMeta').value = inv.meta;

    // Funnel del mes
    const etapas = ['nuevo', 'contactado', 'cita', 'presupuesto', 'negociacion', 'ganado'];
    const labels = { nuevo: 'Lead nuevo', contactado: 'Contactado', cita: 'Cita agendada', presupuesto: 'Presupuesto', negociacion: 'Negociación', ganado: 'Ganado' };
    const orden = ['nuevo', 'contactado', 'cita', 'presupuesto', 'negociacion', 'ganado'];
    const counts = etapas.map(et => {
      // Cuántos leads ALCANZARON al menos esa etapa
      return leadsMes.filter(l => {
        const li = orden.indexOf(l.etapa);
        const ti = orden.indexOf(et);
        if (l.etapa === 'perdido') return ti === 0; // se cuenta solo en lead nuevo
        return li >= ti;
      }).length;
    });
    const max = Math.max(...counts, 1);
    $('#funnel').innerHTML = etapas.map((et, i) => `
      <div class="funnel-step">
        <span class="label">${labels[et]}</span>
        <div class="bar">
          <div class="bar-fill" style="width:${(counts[i] / max) * 100}%">${counts[i]}</div>
        </div>
      </div>`).join('');

    // Origen
    const origen = $('#origenChart');
    const origCount = {};
    leadsMes.forEach(l => origCount[l.origen] = (origCount[l.origen] || 0) + 1);
    const total = leadsMes.length || 1;
    origen.innerHTML = ORIGENES.map(o => {
      const n = origCount[o.id] || 0;
      const pct = (n / total) * 100;
      return `
        <div class="origen-row">
          <span>${o.label}</span>
          <div class="bar"><div style="width:${pct}%"></div></div>
          <span style="text-align:right;font-weight:600">${n}</span>
        </div>`;
    }).join('');

    // Palabras clave
    const tbody = $('#kwTable tbody');
    const kwMap = {};
    leadsMes.filter(l => l.palabraClave).forEach(l => {
      const k = kwMap[l.palabraClave] = kwMap[l.palabraClave] || { leads: 0, ganados: 0, coste: 0 };
      k.leads++;
      if (l.etapa === 'ganado') k.ganados++;
      k.coste += (l.costeClick || 0);
    });
    const rows = Object.entries(kwMap).sort((a, b) => b[1].ganados - a[1].ganados || b[1].leads - a[1].leads);
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Aún no hay datos de palabras clave.</td></tr>';
    } else {
      tbody.innerHTML = rows.map(([k, v]) => `
        <tr><td>${k}</td><td>${v.leads}</td><td>${v.ganados}</td><td>${fmtPct(v.ganados / v.leads)}</td><td>${fmtEUR(Math.round(v.coste))}</td></tr>`).join('');
    }
  },

  // =================================================================
  // AJUSTES
  // =================================================================
  ajustes() {
    const a = Store.state.ajustes.despacho;
    Object.keys(a).forEach(k => {
      const i = $(`[data-ajuste="${k}"]`);
      if (i) i.value = a[k];
    });
    $('#guardarAjustes').onclick = () => {
      const d = Store.state.ajustes.despacho;
      $$('[data-ajuste]').forEach(i => d[i.dataset.ajuste] = i.value);
      Store.save();
      alert('Ajustes guardados.');
    };
    $('#resetData').onclick = () => {
      if (confirm('¿Vaciar TODOS los datos del CRM? Esta acción no se puede deshacer.')) {
        Store.reset();
        localStorage.removeItem('crm_annie_seeded_v1');
        location.reload();
      }
    };
    $('#exportData').onclick = () => {
      const blob = new Blob([JSON.stringify(Store.state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crm-annie-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };
    $('#importData').onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          Store.state = JSON.parse(r.result);
          Store.save();
          alert('Datos importados.');
          location.reload();
        } catch { alert('Archivo no válido.'); }
      };
      r.readAsText(file);
    };
  }
};

window.Views = Views;
