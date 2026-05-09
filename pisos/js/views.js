/* Render de cada vista. Cada función recibe el contenedor #app y dibuja dentro. */
(function () {
  'use strict';

  const T = window.Tpl;
  const S = window.Store;
  const A = window.Alerts;

  /* ===================== DASHBOARD ===================== */
  function dashboard(root) {
    const frag = T.inflate('tpl-dashboard');
    root.appendChild(frag);

    const userName = S.state.user ? (S.state.user.displayName || S.state.user.email) : '—';
    root.querySelector('[data-bind="userName"]').textContent = userName.split(' ')[0];

    const contratos = S.contratosActivos();
    const fee = (S.state.config.feePct || 10) / 100;
    const renta = contratos.reduce((s, c) => s + (Number(c.rentaMensual) || 0), 0);
    const fees = renta * fee;
    const incidencias = S.incidenciasAbiertas();
    const gastos = S.gastosPendientes();
    const totalPendiente = gastos.reduce((s, g) => s + (Number(g.importe) || 0), 0);
    const alertas = A.build(S.state);

    document.getElementById('kpiPisos').textContent = contratos.length;
    document.getElementById('kpiRenta').textContent = T.fmtMoney(renta);
    document.getElementById('kpiFees').textContent = T.fmtMoney(fees);
    document.getElementById('kpiIncidencias').textContent = incidencias.length;
    document.getElementById('kpiPendiente').textContent = T.fmtMoney(totalPendiente);
    document.getElementById('kpiAlertas').textContent = alertas.length;

    /* Alertas */
    const alertList = document.getElementById('alertList');
    if (alertas.length === 0) {
      alertList.appendChild(T.el('div', { class: 'empty', text: '🎉 No hay alertas activas. Todo bajo control.' }));
    } else {
      alertas.slice(0, 12).forEach(a => {
        const item = T.el('div', { class: 'alert-item sev-' + a.sev }, [
          T.el('div', { class: 'alert-icon', text: a.icon }),
          T.el('div', {}, [
            T.el('div', { class: 'alert-title', text: a.titulo }),
            T.el('div', { class: 'alert-meta', text: a.meta + (a.cta ? ' · ' + a.cta : '') })
          ]),
          T.el('div', { class: 'pill', text: T.fmtDate(a.fecha) })
        ]);
        alertList.appendChild(item);
      });
    }

    /* Incidencias abiertas */
    const incList = document.getElementById('openIncidents');
    if (incidencias.length === 0) {
      incList.appendChild(T.el('div', { class: 'empty', text: 'Sin incidencias abiertas.' }));
    } else {
      incidencias.forEach(inc => {
        const piso = S.byId('pisos', inc.pisoId);
        const ed = piso ? S.byId('edificios', piso.edificioId) : null;
        const tec = inc.tecnicoId ? S.byId('tecnicos', inc.tecnicoId) : null;
        const item = T.el('div', { class: 'alert-item sev-low' }, [
          T.el('div', { class: 'alert-icon', text: '🔧' }),
          T.el('div', {}, [
            T.el('div', { class: 'alert-title', text: (inc.titulo || 'Incidencia') + ' — ' + (ed ? ed.nombre : '?') + (piso ? ' · ' + (piso.identificador || '') : '') }),
            T.el('div', { class: 'alert-meta', text: (tec ? 'Asignada a ' + tec.nombre + ' · ' : '') + T.fmtDate(inc.fecha) })
          ]),
          T.el('span', { class: 'pill ' + (inc.estado === 'en_curso' ? 'pill-warn' : 'pill-info'), text: inc.estado })
        ]);
        incList.appendChild(item);
      });
    }

    /* Cobros pendientes */
    const charges = document.getElementById('pendingCharges');
    if (gastos.length === 0) {
      charges.appendChild(T.el('div', { class: 'empty', text: 'No hay cobros pendientes.' }));
    } else {
      const tw = T.el('div', { class: 'table-wrap' });
      const table = T.el('table', { class: 'table' });
      table.innerHTML = '<thead><tr><th>Fecha</th><th>Concepto</th><th>Piso</th><th>Facturar a</th><th class="right">Importe</th><th></th></tr></thead>';
      const tbody = T.el('tbody');
      gastos.forEach(g => {
        const piso = g.pisoId ? S.byId('pisos', g.pisoId) : null;
        const ed = piso ? S.byId('edificios', piso.edificioId) : null;
        const tr = T.el('tr');
        tr.innerHTML = '<td>' + T.fmtDate(g.fecha) + '</td>' +
          '<td>' + (g.concepto || '') + '</td>' +
          '<td>' + (ed ? ed.nombre : '—') + (piso ? ' · ' + (piso.identificador || '') : '') + '</td>' +
          '<td>' + (g.facturarA || '—') + '</td>' +
          '<td class="right">' + T.fmtMoney(g.importe) + '</td>' +
          '<td></td>';
        const td = tr.lastElementChild;
        const btn = T.el('button', {
          class: 'btn btn-sm btn-secondary', text: 'Marcar cobrado',
          onclick: async () => {
            await S.update('gastos', g.id, { cobrado: true, fechaCobro: new Date().toISOString().slice(0, 10) });
            T.toast('Gasto marcado como cobrado', 'success');
          }
        });
        td.appendChild(btn);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      tw.appendChild(table);
      charges.appendChild(tw);
    }

    document.getElementById('btnExportIcs').addEventListener('click', () => window.Ics.download(S.state));
    document.getElementById('btnSendReminders').addEventListener('click', () => sendReminders(alertas));
  }

  function sendReminders(alertas) {
    if (!alertas.length) { T.toast('No hay alertas que recordar'); return; }
    const dest = (S.state.config.emailDestino || S.state.user.email || '').trim();
    if (!dest) { T.toast('Configura un email en Ajustes', 'error'); return; }
    const lines = alertas.map(a => '• ' + a.titulo + ' (' + T.fmtDate(a.fecha) + ') — ' + a.meta).join('%0D%0A');
    const subject = encodeURIComponent('[Pisos Aguado] Recordatorios pendientes (' + alertas.length + ')');
    const body = 'Recordatorios automáticos de la app Pisos Aguado:%0D%0A%0D%0A' + lines;
    window.location.href = 'mailto:' + encodeURIComponent(dest) + '?subject=' + subject + '&body=' + body;
  }

  /* ===================== RENT ROLL ===================== */
  function rentroll(root) {
    const frag = T.inflate('tpl-rentroll');
    root.appendChild(frag);

    const filterEd = document.getElementById('rrFilterEdificio');
    const filterProp = document.getElementById('rrFilterPropietario');
    const filterEstado = document.getElementById('rrFilterEstado');

    filterEd.innerHTML = '<option value="">Todos los edificios</option>' +
      S.all('edificios').map(e => '<option value="' + e.id + '">' + e.nombre + '</option>').join('');
    filterProp.innerHTML = '<option value="">Todos los propietarios</option>' +
      S.all('propietarios').map(p => '<option value="' + p.id + '">' + p.nombre + '</option>').join('');

    function render() {
      const tbody = document.getElementById('rentrollBody');
      tbody.innerHTML = '';
      const fee = (S.state.config.feePct || 10) / 100;
      const ahora = new Date();
      let totalRenta = 0, totalFee = 0;

      let contratos = S.all('contratos').slice();
      if (filterEstado.value) contratos = contratos.filter(c => c.estado === filterEstado.value);
      if (filterEd.value) {
        const pisosIds = S.pisosDeEdificio(filterEd.value).map(p => p.id);
        contratos = contratos.filter(c => pisosIds.includes(c.pisoId));
      }
      if (filterProp.value) {
        const pisosIds = S.all('pisos').filter(p => p.propietarioId === filterProp.value).map(p => p.id);
        contratos = contratos.filter(c => pisosIds.includes(c.pisoId));
      }

      contratos.sort((a, b) => (a.fechaInicio || '').localeCompare(b.fechaInicio || ''));

      contratos.forEach(c => {
        const piso = S.byId('pisos', c.pisoId);
        const ed = piso ? S.byId('edificios', piso.edificioId) : null;
        const inq = c.inquilinoId ? S.byId('inquilinos', c.inquilinoId) : null;
        const prop = piso && piso.propietarioId ? S.byId('propietarios', piso.propietarioId) : null;
        const renta = Number(c.rentaMensual) || 0;
        const feeAmt = renta * fee;
        if (c.estado === 'activo' || c.estado === 'renovado') {
          totalRenta += renta;
          totalFee += feeAmt;
        }
        const proxIpc = A.proximaRevisionIpc(c, ahora);
        const tr = T.el('tr');
        tr.innerHTML =
          '<td>' + (ed ? ed.nombre : '—') + ' · ' + (piso ? (piso.identificador || piso.puerta || '') : '—') + '</td>' +
          '<td>' + (prop ? prop.nombre : '—') + '</td>' +
          '<td>' + (inq ? inq.nombre : '—') + '</td>' +
          '<td>' + T.fmtDate(c.fechaFirma) + '</td>' +
          '<td>' + T.fmtDate(c.fechaInicio) + '</td>' +
          '<td>' + T.fmtDate(c.fechaFin) + '</td>' +
          '<td class="right">' + T.fmtMoney(renta) + '</td>' +
          '<td class="right">' + T.fmtMoney(feeAmt) + '</td>' +
          '<td>' + T.fmtDate(proxIpc) + '</td>' +
          '<td><span class="pill ' + estadoPill(c.estado) + '">' + (c.estado || '—') + '</span></td>' +
          '<td></td>';
        const last = tr.lastElementChild;
        const actions = T.el('div', { class: 'row-actions' });
        actions.appendChild(T.el('button', { class: 'btn btn-sm btn-secondary', text: 'Editar', onclick: () => contractForm(c) }));
        actions.appendChild(T.el('button', { class: 'btn btn-sm btn-ghost', text: 'Anexo', onclick: () => addAnexo(c) }));
        actions.appendChild(T.el('button', { class: 'btn btn-sm btn-ghost', text: 'Renovar', onclick: () => renovar(c) }));
        last.appendChild(actions);
        tbody.appendChild(tr);
      });

      document.getElementById('rrTotalRenta').textContent = T.fmtMoney(totalRenta);
      document.getElementById('rrTotalFee').textContent = T.fmtMoney(totalFee);
    }

    [filterEd, filterProp, filterEstado].forEach(s => s.addEventListener('change', render));
    document.getElementById('btnNewContract').addEventListener('click', () => contractForm(null));
    render();
  }

  function estadoPill(estado) {
    if (estado === 'activo') return 'pill-good';
    if (estado === 'renovado') return 'pill-info';
    if (estado === 'finalizado') return 'pill-warn';
    return '';
  }

  function contractForm(c) {
    const isNew = !c || !c.id;
    c = c || { estado: 'activo', rentaMensual: 0, fechaFirma: '', fechaInicio: '', fechaFin: '', anexos: [], renovaciones: [] };
    if (isNew) c = Object.assign({ estado: 'activo', rentaMensual: 0, anexos: [], renovaciones: [] }, c);
    const wrap = T.el('div');
    wrap.appendChild(T.el('h2', { text: isNew ? 'Nuevo contrato' : 'Editar contrato' }));

    const pisoOpts = S.all('pisos').map(p => {
      const ed = S.byId('edificios', p.edificioId);
      return { id: p.id, label: (ed ? ed.nombre : '?') + ' · ' + (p.identificador || p.puerta || '') };
    });
    const inqOpts = S.all('inquilinos').map(i => ({ id: i.id, label: i.nombre }));

    wrap.innerHTML += `
      <div class="form-row">
        <label>Piso
          <select id="cf-piso" required>
            <option value="">— elegir —</option>
            ${pisoOpts.map(p => '<option value="' + p.id + '"' + (p.id === c.pisoId ? ' selected' : '') + '>' + p.label + '</option>').join('')}
          </select>
        </label>
        <label>Inquilino
          <select id="cf-inq">
            <option value="">— elegir —</option>
            ${inqOpts.map(p => '<option value="' + p.id + '"' + (p.id === c.inquilinoId ? ' selected' : '') + '>' + p.label + '</option>').join('')}
          </select>
        </label>
      </div>
      <div class="form-row">
        <label>Fecha de firma <input type="date" id="cf-firma" value="${T.dateInputValue(c.fechaFirma)}"></label>
        <label>Fecha de inicio <input type="date" id="cf-inicio" value="${T.dateInputValue(c.fechaInicio)}"></label>
      </div>
      <div class="form-row">
        <label>Fecha de fin <input type="date" id="cf-fin" value="${T.dateInputValue(c.fechaFin)}"></label>
        <label>Estado
          <select id="cf-estado">
            <option value="activo" ${c.estado === 'activo' ? 'selected' : ''}>Activo</option>
            <option value="renovado" ${c.estado === 'renovado' ? 'selected' : ''}>Renovado</option>
            <option value="finalizado" ${c.estado === 'finalizado' ? 'selected' : ''}>Finalizado</option>
          </select>
        </label>
      </div>
      <div class="form-row">
        <label>Renta mensual (€) <input type="number" id="cf-renta" step="0.01" min="0" value="${c.rentaMensual || 0}"></label>
        <label>Fianza (€) <input type="number" id="cf-fianza" step="0.01" min="0" value="${c.fianza || 0}"></label>
      </div>
      <div class="form-row">
        <label>Índice de actualización
          <select id="cf-indice">
            <option value="IPC" ${c.indice === 'IPC' || !c.indice ? 'selected' : ''}>IPC</option>
            <option value="IRAV" ${c.indice === 'IRAV' ? 'selected' : ''}>IRAV (LAU 2023)</option>
            <option value="PACTADO" ${c.indice === 'PACTADO' ? 'selected' : ''}>Subida pactada</option>
            <option value="NO" ${c.indice === 'NO' ? 'selected' : ''}>Sin actualización</option>
          </select>
        </label>
        <label>Última revisión IPC <input type="date" id="cf-ult-ipc" value="${T.dateInputValue(c.ultimaRevisionIpc)}"></label>
      </div>
      <label>Notas <textarea id="cf-notas">${c.notas || ''}</textarea></label>
    `;

    const actions = T.el('div', { class: 'modal-actions' });
    actions.appendChild(T.el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: T.closeModal }));
    if (!isNew) {
      actions.appendChild(T.el('button', {
        class: 'btn btn-danger', text: 'Eliminar',
        onclick: () => T.confirmDialog('¿Eliminar este contrato?', async () => {
          await S.remove('contratos', c.id);
          T.toast('Contrato eliminado', 'success');
        })
      }));
    }
    actions.appendChild(T.el('button', {
      class: 'btn btn-primary', text: 'Guardar',
      onclick: async () => {
        const payload = {
          pisoId: document.getElementById('cf-piso').value,
          inquilinoId: document.getElementById('cf-inq').value,
          fechaFirma: document.getElementById('cf-firma').value,
          fechaInicio: document.getElementById('cf-inicio').value,
          fechaFin: document.getElementById('cf-fin').value,
          estado: document.getElementById('cf-estado').value,
          rentaMensual: parseFloat(document.getElementById('cf-renta').value) || 0,
          fianza: parseFloat(document.getElementById('cf-fianza').value) || 0,
          indice: document.getElementById('cf-indice').value,
          ultimaRevisionIpc: document.getElementById('cf-ult-ipc').value,
          notas: document.getElementById('cf-notas').value,
          anexos: c.anexos || [],
          renovaciones: c.renovaciones || []
        };
        if (!payload.pisoId) { T.toast('Selecciona un piso', 'error'); return; }
        if (isNew) await S.add('contratos', payload);
        else await S.update('contratos', c.id, payload);
        T.toast('Contrato guardado', 'success');
        T.closeModal();
      }
    }));
    wrap.appendChild(actions);
    T.openModal(wrap);
  }

  function addAnexo(c) {
    const wrap = T.el('div');
    wrap.appendChild(T.el('h2', { text: 'Añadir anexo al contrato' }));
    wrap.innerHTML += `
      <label>Fecha del anexo <input type="date" id="ax-fecha" value="${new Date().toISOString().slice(0, 10)}"></label>
      <label>Concepto <input type="text" id="ax-concepto" placeholder="p.ej. Subida IPC, ampliación plazo..."></label>
      <label>Detalle <textarea id="ax-detalle"></textarea></label>
      <label>Nueva renta mensual (opcional, €) <input type="number" id="ax-renta" step="0.01" min="0"></label>
    `;
    const actions = T.el('div', { class: 'modal-actions' });
    actions.appendChild(T.el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: T.closeModal }));
    actions.appendChild(T.el('button', {
      class: 'btn btn-primary', text: 'Guardar anexo',
      onclick: async () => {
        const anexo = {
          fecha: document.getElementById('ax-fecha').value,
          concepto: document.getElementById('ax-concepto').value,
          detalle: document.getElementById('ax-detalle').value,
          rentaMensual: parseFloat(document.getElementById('ax-renta').value) || null
        };
        const anexos = (c.anexos || []).concat([anexo]);
        const upd = { anexos };
        if (anexo.rentaMensual) {
          upd.rentaMensual = anexo.rentaMensual;
          upd.ultimaRevisionIpc = anexo.fecha;
        }
        await S.update('contratos', c.id, upd);
        T.toast('Anexo añadido', 'success');
        T.closeModal();
      }
    }));
    wrap.appendChild(actions);
    T.openModal(wrap);
  }

  function renovar(c) {
    const wrap = T.el('div');
    wrap.appendChild(T.el('h2', { text: 'Renovar contrato' }));
    const finActual = c.fechaFin || '';
    const sugInicio = finActual ? new Date(finActual) : new Date();
    if (!finActual) sugInicio.setDate(sugInicio.getDate() + 1);
    const sugFin = new Date(sugInicio); sugFin.setFullYear(sugFin.getFullYear() + 1);
    wrap.innerHTML += `
      <p class="muted">Marca el contrato actual como renovado y crea uno nuevo con las nuevas fechas y renta.</p>
      <div class="form-row">
        <label>Inicio nuevo periodo <input type="date" id="rv-inicio" value="${sugInicio.toISOString().slice(0, 10)}"></label>
        <label>Fin nuevo periodo <input type="date" id="rv-fin" value="${sugFin.toISOString().slice(0, 10)}"></label>
      </div>
      <label>Nueva renta mensual (€) <input type="number" id="rv-renta" step="0.01" min="0" value="${c.rentaMensual || 0}"></label>
      <label>Notas <textarea id="rv-notas"></textarea></label>
    `;
    const actions = T.el('div', { class: 'modal-actions' });
    actions.appendChild(T.el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: T.closeModal }));
    actions.appendChild(T.el('button', {
      class: 'btn btn-primary', text: 'Renovar',
      onclick: async () => {
        const inicio = document.getElementById('rv-inicio').value;
        const fin = document.getElementById('rv-fin').value;
        const renta = parseFloat(document.getElementById('rv-renta').value) || 0;
        const notas = document.getElementById('rv-notas').value;
        await S.update('contratos', c.id, { estado: 'renovado', notas: ((c.notas || '') + '\nRenovado el ' + new Date().toISOString().slice(0, 10)).trim() });
        await S.add('contratos', {
          pisoId: c.pisoId,
          inquilinoId: c.inquilinoId,
          fechaFirma: new Date().toISOString().slice(0, 10),
          fechaInicio: inicio,
          fechaFin: fin,
          estado: 'activo',
          rentaMensual: renta,
          fianza: c.fianza || 0,
          indice: c.indice || 'IPC',
          ultimaRevisionIpc: inicio,
          contratoPrevioId: c.id,
          notas: notas,
          anexos: [],
          renovaciones: []
        });
        T.toast('Renovación creada', 'success');
        T.closeModal();
      }
    }));
    wrap.appendChild(actions);
    T.openModal(wrap);
  }

  /* ===================== EDIFICIOS / PISOS ===================== */
  function edificios(root) {
    const frag = T.inflate('tpl-edificios');
    root.appendChild(frag);
    document.getElementById('btnNewEdificio').addEventListener('click', () => edificioForm(null));
    document.getElementById('btnNewPiso').addEventListener('click', () => pisoForm(null));

    const list = document.getElementById('edificiosList');
    const eds = S.all('edificios');
    if (!eds.length) {
      list.appendChild(T.el('div', { class: 'empty', text: 'Aún no hay edificios. Pulsa "Cargar datos iniciales" en Ajustes o crea uno.' }));
      return;
    }
    eds.forEach(ed => {
      const card = T.el('div', { class: 'edificio-card' });
      const head = T.el('div', { class: 'edificio-head' }, [
        T.el('div', {}, [
          T.el('h3', { text: ed.nombre, style: 'margin:0;' }),
          T.el('div', { class: 'muted', text: ed.direccion || '' })
        ]),
        T.el('button', { class: 'btn btn-sm btn-secondary', text: 'Editar', onclick: () => edificioForm(ed) })
      ]);
      card.appendChild(head);
      const pisos = S.pisosDeEdificio(ed.id);
      const grid = T.el('div', { class: 'edificio-pisos' });
      if (!pisos.length) {
        grid.appendChild(T.el('div', { class: 'empty', text: 'Sin pisos registrados.' }));
      } else {
        pisos.forEach(p => {
          const c = S.contratoActivoDePiso(p.id);
          const inq = c && c.inquilinoId ? S.byId('inquilinos', c.inquilinoId) : null;
          const prop = p.propietarioId ? S.byId('propietarios', p.propietarioId) : null;
          const card2 = T.el('div', { class: 'piso-card' });
          card2.appendChild(T.el('h4', { text: p.identificador || p.puerta || 'Piso' }));
          card2.appendChild(T.el('div', { class: 'piso-meta', text: 'Propietario: ' + (prop ? prop.nombre : '—') }));
          card2.appendChild(T.el('div', { class: 'piso-meta', text: c ? 'Inquilino: ' + (inq ? inq.nombre : '—') + ' · ' + T.fmtMoney(c.rentaMensual) : 'Sin contrato activo' }));
          const actions = T.el('div', { class: 'row-actions', style: 'margin-top:8px;' });
          actions.appendChild(T.el('button', { class: 'btn btn-sm btn-ghost', text: 'Editar', onclick: () => pisoForm(p) }));
          actions.appendChild(T.el('button', { class: 'btn btn-sm btn-secondary', text: 'Contrato', onclick: () => contractForm(c || { pisoId: p.id }) }));
          card2.appendChild(actions);
          grid.appendChild(card2);
        });
      }
      card.appendChild(grid);
      list.appendChild(card);
    });
  }

  function edificioForm(ed) {
    const isNew = !ed; ed = ed || { nombre: '', direccion: '' };
    const wrap = T.el('div');
    wrap.appendChild(T.el('h2', { text: isNew ? 'Nuevo edificio' : 'Editar edificio' }));
    wrap.innerHTML += `
      <label>Nombre <input type="text" id="ef-nombre" value="${escapeAttr(ed.nombre)}"></label>
      <label>Dirección <input type="text" id="ef-dir" value="${escapeAttr(ed.direccion)}"></label>
      <label>Notas <textarea id="ef-notas">${escapeHtml(ed.notas || '')}</textarea></label>
    `;
    const actions = T.el('div', { class: 'modal-actions' });
    actions.appendChild(T.el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: T.closeModal }));
    if (!isNew) {
      actions.appendChild(T.el('button', {
        class: 'btn btn-danger', text: 'Eliminar',
        onclick: () => T.confirmDialog('¿Eliminar el edificio? Los pisos se quedarán huérfanos.', async () => {
          await S.remove('edificios', ed.id);
          T.toast('Edificio eliminado');
        })
      }));
    }
    actions.appendChild(T.el('button', {
      class: 'btn btn-primary', text: 'Guardar',
      onclick: async () => {
        const data = {
          nombre: document.getElementById('ef-nombre').value,
          direccion: document.getElementById('ef-dir').value,
          notas: document.getElementById('ef-notas').value
        };
        if (isNew) await S.add('edificios', data);
        else await S.update('edificios', ed.id, data);
        T.toast('Edificio guardado', 'success');
        T.closeModal();
      }
    }));
    wrap.appendChild(actions);
    T.openModal(wrap);
  }

  function pisoForm(p) {
    const isNew = !p; p = p || { edificioId: '', propietarioId: '', identificador: '', m2: null };
    const wrap = T.el('div');
    wrap.appendChild(T.el('h2', { text: isNew ? 'Nuevo piso' : 'Editar piso' }));
    const eds = S.all('edificios');
    const props = S.all('propietarios');
    wrap.innerHTML += `
      <label>Edificio
        <select id="pf-edif">${eds.map(e => '<option value="' + e.id + '"' + (e.id === p.edificioId ? ' selected' : '') + '>' + escapeHtml(e.nombre) + '</option>').join('')}</select>
      </label>
      <label>Identificador (puerta, planta…) <input type="text" id="pf-id" value="${escapeAttr(p.identificador)}"></label>
      <label>Propietario
        <select id="pf-prop">
          <option value="">—</option>
          ${props.map(pr => '<option value="' + pr.id + '"' + (pr.id === p.propietarioId ? ' selected' : '') + '>' + escapeHtml(pr.nombre) + '</option>').join('')}
        </select>
      </label>
      <div class="form-row">
        <label>m² <input type="number" id="pf-m2" min="0" step="0.1" value="${p.m2 || ''}"></label>
        <label>Habitaciones <input type="number" id="pf-hab" min="0" value="${p.habitaciones || ''}"></label>
      </div>
      <label>Notas <textarea id="pf-notas">${escapeHtml(p.notas || '')}</textarea></label>
    `;
    const actions = T.el('div', { class: 'modal-actions' });
    actions.appendChild(T.el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: T.closeModal }));
    if (!isNew) {
      actions.appendChild(T.el('button', {
        class: 'btn btn-danger', text: 'Eliminar',
        onclick: () => T.confirmDialog('¿Eliminar el piso?', async () => {
          await S.remove('pisos', p.id);
          T.toast('Piso eliminado');
        })
      }));
    }
    actions.appendChild(T.el('button', {
      class: 'btn btn-primary', text: 'Guardar',
      onclick: async () => {
        const data = {
          edificioId: document.getElementById('pf-edif').value,
          identificador: document.getElementById('pf-id').value,
          propietarioId: document.getElementById('pf-prop').value || null,
          m2: parseFloat(document.getElementById('pf-m2').value) || null,
          habitaciones: parseInt(document.getElementById('pf-hab').value) || null,
          notas: document.getElementById('pf-notas').value
        };
        if (isNew) await S.add('pisos', data);
        else await S.update('pisos', p.id, data);
        T.toast('Piso guardado', 'success');
        T.closeModal();
      }
    }));
    wrap.appendChild(actions);
    T.openModal(wrap);
  }

  /* ===================== INQUILINOS ===================== */
  function inquilinos(root) {
    const frag = T.inflate('tpl-inquilinos');
    root.appendChild(frag);
    document.getElementById('btnNewInquilino').addEventListener('click', () => inquilinoForm(null));
    const tbody = document.getElementById('inquilinosBody');
    const items = S.all('inquilinos');
    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty">No hay inquilinos.</div></td></tr>';
      return;
    }
    items.forEach(i => {
      const c = S.all('contratos').find(c => c.inquilinoId === i.id && (c.estado === 'activo' || c.estado === 'renovado'));
      const piso = c ? S.byId('pisos', c.pisoId) : null;
      const ed = piso ? S.byId('edificios', piso.edificioId) : null;
      const tr = T.el('tr');
      tr.innerHTML = '<td>' + escapeHtml(i.nombre || '') + '</td>' +
        '<td>' + escapeHtml(i.dni || '—') + '</td>' +
        '<td>' + escapeHtml(i.telefono || '—') + '</td>' +
        '<td>' + escapeHtml(i.email || '—') + '</td>' +
        '<td>' + (c ? (ed ? ed.nombre : '?') + ' · ' + (piso ? piso.identificador : '') + ' (' + T.fmtMoney(c.rentaMensual) + ')' : '<span class="muted">—</span>') + '</td>' +
        '<td></td>';
      const last = tr.lastElementChild;
      last.appendChild(T.el('button', { class: 'btn btn-sm btn-secondary', text: 'Editar', onclick: () => inquilinoForm(i) }));
      tbody.appendChild(tr);
    });
  }

  function inquilinoForm(i) {
    const isNew = !i; i = i || {};
    const wrap = T.el('div');
    wrap.appendChild(T.el('h2', { text: isNew ? 'Nuevo inquilino' : 'Editar inquilino' }));
    wrap.innerHTML += `
      <label>Nombre completo <input type="text" id="if-nombre" value="${escapeAttr(i.nombre)}"></label>
      <div class="form-row">
        <label>DNI <input type="text" id="if-dni" value="${escapeAttr(i.dni)}"></label>
        <label>Teléfono <input type="tel" id="if-tel" value="${escapeAttr(i.telefono)}"></label>
      </div>
      <label>Email <input type="email" id="if-email" value="${escapeAttr(i.email)}"></label>
      <label>Notas <textarea id="if-notas">${escapeHtml(i.notas || '')}</textarea></label>
    `;
    const actions = T.el('div', { class: 'modal-actions' });
    actions.appendChild(T.el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: T.closeModal }));
    if (!isNew) {
      actions.appendChild(T.el('button', {
        class: 'btn btn-danger', text: 'Eliminar',
        onclick: () => T.confirmDialog('¿Eliminar inquilino?', async () => { await S.remove('inquilinos', i.id); T.toast('Eliminado'); })
      }));
    }
    actions.appendChild(T.el('button', {
      class: 'btn btn-primary', text: 'Guardar',
      onclick: async () => {
        const data = {
          nombre: document.getElementById('if-nombre').value,
          dni: document.getElementById('if-dni').value,
          telefono: document.getElementById('if-tel').value,
          email: document.getElementById('if-email').value,
          notas: document.getElementById('if-notas').value
        };
        if (isNew) await S.add('inquilinos', data);
        else await S.update('inquilinos', i.id, data);
        T.toast('Guardado', 'success');
        T.closeModal();
      }
    }));
    wrap.appendChild(actions);
    T.openModal(wrap);
  }

  /* ===================== INCIDENCIAS ===================== */
  function incidencias(root) {
    const frag = T.inflate('tpl-incidencias');
    root.appendChild(frag);
    const filterEd = document.getElementById('incFilterEdificio');
    const filterEs = document.getElementById('incFilterEstado');
    filterEd.innerHTML = '<option value="">Todos los edificios</option>' +
      S.all('edificios').map(e => '<option value="' + e.id + '">' + escapeHtml(e.nombre) + '</option>').join('');
    document.getElementById('btnNewIncidencia').addEventListener('click', () => incidenciaForm(null));

    function render() {
      const list = document.getElementById('incidenciasList');
      list.innerHTML = '';
      let items = S.all('incidencias').slice();
      if (filterEs.value) items = items.filter(i => i.estado === filterEs.value);
      if (filterEd.value) {
        const pisosIds = S.pisosDeEdificio(filterEd.value).map(p => p.id);
        items = items.filter(i => pisosIds.includes(i.pisoId) || i.edificioId === filterEd.value);
      }
      items.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
      if (!items.length) { list.appendChild(T.el('div', { class: 'empty', text: 'Sin incidencias.' })); return; }
      items.forEach(inc => {
        const piso = inc.pisoId ? S.byId('pisos', inc.pisoId) : null;
        const ed = piso ? S.byId('edificios', piso.edificioId) : (inc.edificioId ? S.byId('edificios', inc.edificioId) : null);
        const tec = inc.tecnicoId ? S.byId('tecnicos', inc.tecnicoId) : null;
        const prov = inc.proveedorId ? S.byId('proveedores', inc.proveedorId) : null;
        const card = T.el('div', { class: 'incidencia-card' });
        const left = T.el('div');
        left.appendChild(T.el('div', { html: '<strong>' + escapeHtml(inc.titulo || 'Incidencia') + '</strong> <span class="pill ' + estadoPillIncidencia(inc.estado) + '">' + (inc.estado || '') + '</span>' }));
        left.appendChild(T.el('div', { class: 'meta', text: (ed ? ed.nombre : '—') + (piso ? ' · ' + (piso.identificador || '') : '') + ' · ' + T.fmtDate(inc.fecha) }));
        left.appendChild(T.el('div', { class: 'meta', text: 'Técnico: ' + (tec ? tec.nombre : '—') + (prov ? ' · Proveedor: ' + prov.nombre : '') + (inc.coste ? ' · ' + T.fmtMoney(inc.coste) : '') }));
        if (inc.descripcion) left.appendChild(T.el('div', { style: 'margin-top:6px', text: inc.descripcion }));
        const actions = T.el('div', { class: 'incidencia-actions' });
        if (inc.estado !== 'resuelta') {
          actions.appendChild(T.el('button', { class: 'btn btn-sm btn-secondary', text: 'Resolver', onclick: async () => { await S.update('incidencias', inc.id, { estado: 'resuelta', fechaResolucion: new Date().toISOString().slice(0, 10) }); T.toast('Resuelta', 'success'); } }));
        }
        actions.appendChild(T.el('button', { class: 'btn btn-sm btn-ghost', text: 'Editar', onclick: () => incidenciaForm(inc) }));
        card.appendChild(left); card.appendChild(actions);
        list.appendChild(card);
      });
    }
    [filterEd, filterEs].forEach(s => s.addEventListener('change', render));
    render();
  }

  function estadoPillIncidencia(e) {
    if (e === 'resuelta') return 'pill-good';
    if (e === 'en_curso') return 'pill-warn';
    return 'pill-bad';
  }

  function incidenciaForm(inc) {
    const isNew = !inc; inc = inc || { estado: 'abierta', fecha: new Date().toISOString().slice(0, 10) };
    const wrap = T.el('div');
    wrap.appendChild(T.el('h2', { text: isNew ? 'Nueva incidencia' : 'Editar incidencia' }));
    const pisos = S.all('pisos');
    const tecnicos = S.all('tecnicos');
    const proveedores = S.all('proveedores');
    wrap.innerHTML += `
      <label>Título <input type="text" id="in-titulo" value="${escapeAttr(inc.titulo)}" placeholder="p.ej. Lavadora rota Argumosa 11"></label>
      <div class="form-row">
        <label>Fecha <input type="date" id="in-fecha" value="${T.dateInputValue(inc.fecha) || new Date().toISOString().slice(0, 10)}"></label>
        <label>Estado
          <select id="in-estado">
            <option value="abierta" ${inc.estado === 'abierta' ? 'selected' : ''}>Abierta</option>
            <option value="en_curso" ${inc.estado === 'en_curso' ? 'selected' : ''}>En curso</option>
            <option value="resuelta" ${inc.estado === 'resuelta' ? 'selected' : ''}>Resuelta</option>
          </select>
        </label>
      </div>
      <label>Piso
        <select id="in-piso">
          <option value="">— general del edificio —</option>
          ${pisos.map(p => { const ed = S.byId('edificios', p.edificioId); return '<option value="' + p.id + '"' + (p.id === inc.pisoId ? ' selected' : '') + '>' + escapeHtml((ed ? ed.nombre : '') + ' · ' + (p.identificador || '')) + '</option>'; }).join('')}
        </select>
      </label>
      <div class="form-row">
        <label>Técnico
          <select id="in-tec">
            <option value="">—</option>
            ${tecnicos.map(t => '<option value="' + t.id + '"' + (t.id === inc.tecnicoId ? ' selected' : '') + '>' + escapeHtml(t.nombre) + '</option>').join('')}
          </select>
        </label>
        <label>Proveedor
          <select id="in-prov">
            <option value="">—</option>
            ${proveedores.map(p => '<option value="' + p.id + '"' + (p.id === inc.proveedorId ? ' selected' : '') + '>' + escapeHtml(p.nombre) + '</option>').join('')}
          </select>
        </label>
      </div>
      <div class="form-row">
        <label>Coste (€) <input type="number" id="in-coste" step="0.01" min="0" value="${inc.coste || ''}"></label>
        <label>Facturar a
          <select id="in-fact">
            <option value="">—</option>
            ${S.all('propietarios').map(p => '<option value="' + p.nombre + '"' + (p.nombre === inc.facturarA ? ' selected' : '') + '>' + escapeHtml(p.nombre) + '</option>').join('')}
          </select>
        </label>
      </div>
      <label><input type="checkbox" id="in-cobrado" ${inc.cobrado ? 'checked' : ''}> Cobrado al propietario</label>
      <label>Descripción <textarea id="in-desc">${escapeHtml(inc.descripcion || '')}</textarea></label>
    `;
    const actions = T.el('div', { class: 'modal-actions' });
    actions.appendChild(T.el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: T.closeModal }));
    if (!isNew) {
      actions.appendChild(T.el('button', {
        class: 'btn btn-danger', text: 'Eliminar',
        onclick: () => T.confirmDialog('¿Eliminar la incidencia?', async () => { await S.remove('incidencias', inc.id); T.toast('Eliminada'); })
      }));
    }
    actions.appendChild(T.el('button', {
      class: 'btn btn-primary', text: 'Guardar',
      onclick: async () => {
        const data = {
          titulo: document.getElementById('in-titulo').value,
          fecha: document.getElementById('in-fecha').value,
          estado: document.getElementById('in-estado').value,
          pisoId: document.getElementById('in-piso').value || null,
          tecnicoId: document.getElementById('in-tec').value || null,
          proveedorId: document.getElementById('in-prov').value || null,
          coste: parseFloat(document.getElementById('in-coste').value) || 0,
          facturarA: document.getElementById('in-fact').value || null,
          cobrado: document.getElementById('in-cobrado').checked,
          descripcion: document.getElementById('in-desc').value
        };
        if (isNew) {
          const id = await S.add('incidencias', data);
          // Si tiene coste y facturar a alguien, creamos también un gasto pendiente.
          if (data.coste > 0 && data.facturarA && !data.cobrado) {
            await S.add('gastos', {
              concepto: data.titulo || 'Incidencia',
              fecha: data.fecha,
              importe: data.coste,
              facturarA: data.facturarA,
              pisoId: data.pisoId,
              incidenciaId: id,
              cobrado: false,
              proveedorId: data.proveedorId || null
            });
          }
        }
        else await S.update('incidencias', inc.id, data);
        T.toast('Incidencia guardada', 'success');
        T.closeModal();
      }
    }));
    wrap.appendChild(actions);
    T.openModal(wrap);
  }

  /* ===================== TÉCNICOS ===================== */
  function tecnicos(root) {
    const frag = T.inflate('tpl-tecnicos');
    root.appendChild(frag);
    document.getElementById('btnNewTecnico').addEventListener('click', () => tecnicoForm(null));
    const list = document.getElementById('tecnicosList');
    const items = S.all('tecnicos');
    if (!items.length) {
      list.appendChild(T.el('div', { class: 'empty', text: 'Sin técnicos. Carga datos iniciales en Ajustes.' }));
      return;
    }
    items.forEach(t => {
      const card = T.el('div', { class: 'piso-card' });
      card.appendChild(T.el('h4', { text: t.nombre }));
      if (t.especialidad) card.appendChild(T.el('div', { class: 'piso-meta', text: t.especialidad }));
      if (t.telefono) card.appendChild(T.el('div', { class: 'piso-meta', text: '📞 ' + t.telefono }));
      if (t.email) card.appendChild(T.el('div', { class: 'piso-meta', text: '✉️ ' + t.email }));
      if (t.notas) card.appendChild(T.el('div', { class: 'piso-meta', text: t.notas }));
      const actions = T.el('div', { class: 'row-actions', style: 'margin-top:8px;' });
      actions.appendChild(T.el('button', { class: 'btn btn-sm btn-ghost', text: 'Editar', onclick: () => tecnicoForm(t) }));
      card.appendChild(actions);
      list.appendChild(card);
    });
  }

  function tecnicoForm(t) {
    const isNew = !t; t = t || {};
    const wrap = T.el('div');
    wrap.appendChild(T.el('h2', { text: isNew ? 'Nuevo técnico' : 'Editar técnico' }));
    wrap.innerHTML += `
      <label>Nombre <input type="text" id="tf-nombre" value="${escapeAttr(t.nombre)}"></label>
      <div class="form-row">
        <label>Especialidad <input type="text" id="tf-esp" value="${escapeAttr(t.especialidad)}" placeholder="fontanería, electricidad, manitas..."></label>
        <label>Teléfono <input type="tel" id="tf-tel" value="${escapeAttr(t.telefono)}"></label>
      </div>
      <label>Email <input type="email" id="tf-email" value="${escapeAttr(t.email)}"></label>
      <label>Notas <textarea id="tf-notas">${escapeHtml(t.notas || '')}</textarea></label>
    `;
    const actions = T.el('div', { class: 'modal-actions' });
    actions.appendChild(T.el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: T.closeModal }));
    if (!isNew) actions.appendChild(T.el('button', { class: 'btn btn-danger', text: 'Eliminar', onclick: () => T.confirmDialog('¿Eliminar técnico?', async () => { await S.remove('tecnicos', t.id); T.toast('Eliminado'); }) }));
    actions.appendChild(T.el('button', {
      class: 'btn btn-primary', text: 'Guardar',
      onclick: async () => {
        const data = {
          nombre: document.getElementById('tf-nombre').value,
          especialidad: document.getElementById('tf-esp').value,
          telefono: document.getElementById('tf-tel').value,
          email: document.getElementById('tf-email').value,
          notas: document.getElementById('tf-notas').value
        };
        if (isNew) await S.add('tecnicos', data);
        else await S.update('tecnicos', t.id, data);
        T.toast('Guardado', 'success');
        T.closeModal();
      }
    }));
    wrap.appendChild(actions);
    T.openModal(wrap);
  }

  /* ===================== PROVEEDORES ===================== */
  function proveedores(root) {
    const frag = T.inflate('tpl-proveedores');
    root.appendChild(frag);
    document.getElementById('btnNewProveedor').addEventListener('click', () => proveedorForm(null));
    const list = document.getElementById('proveedoresList');
    const items = S.all('proveedores');
    if (!items.length) {
      list.appendChild(T.el('div', { class: 'empty', text: 'Sin proveedores. Carga datos iniciales en Ajustes.' }));
      return;
    }
    items.forEach(p => {
      const card = T.el('div', { class: 'piso-card' });
      card.appendChild(T.el('h4', { text: p.nombre }));
      if (p.contacto) card.appendChild(T.el('div', { class: 'piso-meta', text: p.contacto }));
      if (p.productos) card.appendChild(T.el('div', { class: 'piso-meta', text: p.productos }));
      if (p.notas) card.appendChild(T.el('div', { class: 'piso-meta', text: p.notas }));
      const actions = T.el('div', { class: 'row-actions', style: 'margin-top:8px;' });
      actions.appendChild(T.el('button', { class: 'btn btn-sm btn-ghost', text: 'Editar', onclick: () => proveedorForm(p) }));
      card.appendChild(actions);
      list.appendChild(card);
    });
  }
  function proveedorForm(p) {
    const isNew = !p; p = p || {};
    const wrap = T.el('div');
    wrap.appendChild(T.el('h2', { text: isNew ? 'Nuevo proveedor' : 'Editar proveedor' }));
    wrap.innerHTML += `
      <label>Nombre <input type="text" id="pv-nombre" value="${escapeAttr(p.nombre)}"></label>
      <label>Contacto <input type="text" id="pv-contacto" value="${escapeAttr(p.contacto)}"></label>
      <label>Productos / servicios <input type="text" id="pv-prod" value="${escapeAttr(p.productos)}"></label>
      <label>Notas <textarea id="pv-notas">${escapeHtml(p.notas || '')}</textarea></label>
    `;
    const actions = T.el('div', { class: 'modal-actions' });
    actions.appendChild(T.el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: T.closeModal }));
    if (!isNew) actions.appendChild(T.el('button', { class: 'btn btn-danger', text: 'Eliminar', onclick: () => T.confirmDialog('¿Eliminar proveedor?', async () => { await S.remove('proveedores', p.id); T.toast('Eliminado'); }) }));
    actions.appendChild(T.el('button', {
      class: 'btn btn-primary', text: 'Guardar',
      onclick: async () => {
        const data = {
          nombre: document.getElementById('pv-nombre').value,
          contacto: document.getElementById('pv-contacto').value,
          productos: document.getElementById('pv-prod').value,
          notas: document.getElementById('pv-notas').value
        };
        if (isNew) await S.add('proveedores', data);
        else await S.update('proveedores', p.id, data);
        T.toast('Guardado', 'success');
        T.closeModal();
      }
    }));
    wrap.appendChild(actions);
    T.openModal(wrap);
  }

  /* ===================== CALENDARIO ===================== */
  function calendario(root) {
    const frag = T.inflate('tpl-calendario');
    root.appendChild(frag);
    document.getElementById('btnExportIcs2').addEventListener('click', () => window.Ics.download(S.state));
    const list = document.getElementById('calendarList');
    const events = window.Ics.buildEvents(S.state).sort((a, b) => a.start - b.start);
    if (!events.length) {
      list.appendChild(T.el('div', { class: 'empty', text: 'Sin fechas clave todavía. Crea contratos para que aparezcan aquí.' }));
      return;
    }
    events.forEach(ev => {
      const item = T.el('div', { class: 'timeline-item' }, [
        T.el('div', { class: 'timeline-date', text: T.fmtDate(ev.start) }),
        T.el('div', {}, [
          T.el('div', { html: '<strong>' + escapeHtml(ev.summary) + '</strong>' }),
          T.el('div', { class: 'muted', text: ev.description.replace(/\\n/g, ' · ') })
        ]),
        T.el('span', { class: 'pill pill-info', text: 'Aviso ' + ev.alarmDays + 'd antes' })
      ]);
      list.appendChild(item);
    });
  }

  /* ===================== AJUSTES ===================== */
  function ajustes(root) {
    const frag = T.inflate('tpl-ajustes');
    root.appendChild(frag);
    const cfg = S.state.config;
    document.getElementById('setFeePct').value = cfg.feePct ?? 10;
    document.getElementById('setAvisoVencDias').value = cfg.avisoVencDias ?? 90;
    document.getElementById('setAvisoIpcDias').value = cfg.avisoIpcDias ?? 30;
    document.getElementById('setEmailDestino').value = cfg.emailDestino || '';
    ['setFeePct','setAvisoVencDias','setAvisoIpcDias','setEmailDestino'].forEach(id => {
      document.getElementById(id).addEventListener('change', async (e) => {
        const v = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        const key = id.replace('set','').charAt(0).toLowerCase() + id.replace('set','').slice(1);
        const upd = {}; upd[key] = v;
        await S.saveConfig(upd);
        T.toast('Guardado', 'success');
      });
    });

    /* Propietarios */
    const propList = document.getElementById('propietariosList');
    const props = S.all('propietarios');
    if (!props.length) propList.appendChild(T.el('div', { class: 'empty', text: 'Carga los datos iniciales para crear los Aguado.' }));
    else props.forEach(p => {
      const row = T.el('div', { class: 'piso-card' });
      row.appendChild(T.el('h4', { text: p.nombre }));
      const f = T.el('div', { class: 'form-row' });
      const emailInput = T.el('input', { type: 'email', value: p.email || '', placeholder: 'email opcional' });
      const tel = T.el('input', { type: 'tel', value: p.telefono || '', placeholder: 'teléfono opcional' });
      f.appendChild(T.el('label', { text: 'Email' }, [emailInput]));
      f.appendChild(T.el('label', { text: 'Teléfono' }, [tel]));
      row.appendChild(f);
      const save = T.el('button', { class: 'btn btn-sm btn-secondary', text: 'Guardar', onclick: async () => {
        await S.update('propietarios', p.id, { email: emailInput.value, telefono: tel.value });
        T.toast('Guardado', 'success');
      }});
      row.appendChild(save);
      propList.appendChild(row);
    });

    /* Usuarios */
    const userList = document.getElementById('usuariosList');
    const fb = window.fb;
    fb.getDocs(fb.collection(fb.db, 'pisos_usuarios')).then(snap => {
      const users = [];
      snap.forEach(d => users.push(Object.assign({ id: d.id }, d.data())));
      if (!users.length) { userList.appendChild(T.el('div', { class: 'empty', text: 'Sin usuarios.' })); return; }
      users.forEach(u => {
        const row = T.el('div', { class: 'piso-card' });
        row.appendChild(T.el('h4', { text: (u.nombre || u.email) + (u.role === 'admin' ? ' · admin' : '') }));
        row.appendChild(T.el('div', { class: 'piso-meta', text: u.email }));
        if (S.state.role === 'admin') {
          const sel = T.el('select');
          ['admin','editor','lectura','pendiente'].forEach(r => {
            const opt = T.el('option', { value: r, text: r }); if (r === u.role) opt.selected = true; sel.appendChild(opt);
          });
          const save = T.el('button', { class: 'btn btn-sm btn-secondary', text: 'Guardar rol', onclick: async () => {
            await fb.updateDoc(fb.doc(fb.db, 'pisos_usuarios', u.id), { role: sel.value });
            T.toast('Rol actualizado', 'success');
          }});
          const wrap = T.el('div', { class: 'row-actions', style: 'margin-top:8px;' }, [sel, save]);
          row.appendChild(wrap);
        }
        userList.appendChild(row);
      });
    });

    document.getElementById('btnSeed').addEventListener('click', async () => {
      if (!confirm('¿Cargar datos iniciales (edificios, propietarios, técnicos, MAGARCA)? Solo se crean si no existen ya.')) return;
      await window.Seed.run();
      T.toast('Datos iniciales cargados', 'success');
    });
    document.getElementById('btnExportAll').addEventListener('click', exportJson);
  }

  function exportJson() {
    const dump = {};
    S.COLLECTIONS.forEach(c => dump[c] = S.all(c));
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pisos-aguado-' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ===================== Helpers ===================== */
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch]));
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/\n/g, ' '); }

  /* ===================== Export ===================== */
  window.Views = {
    dashboard, rentroll, edificios, inquilinos,
    incidencias, tecnicos, proveedores, calendario, ajustes,
    contractForm
  };
})();
