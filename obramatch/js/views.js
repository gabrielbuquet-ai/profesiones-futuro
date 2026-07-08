/* Vistas y modales del panel de operaciones de ObraMatch. */
(function () {
  'use strict';

  const S = window.Store;

  /* ============ Helpers de UI ============ */

  const UI = {
    esc(s) { return (s == null ? '' : String(s)).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); },
    oficio(id) { const o = S.OFICIOS.find(x => x.id === id); return o ? o : { label: id, emoji: '🔨' }; },
    oficioTag(id) { const o = UI.oficio(id); return `<span class="tag">${o.emoji} ${UI.esc(o.label)}</span>`; },
    money(n) { return (Number(n) || 0).toLocaleString('es-ES') + ' €'; },
    fecha(iso) {
      if (!iso) return '—';
      try { return new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }); }
      catch (e) { return iso; }
    },
    dias(iso) {
      if (!iso) return null;
      const a = new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso);
      const b = new Date(S.hoy() + 'T00:00:00');
      return Math.round((a - b) / 86400000);
    },
    estadoProf(id) { const e = S.ESTADOS_PROF.find(x => x.id === id) || {}; return `<span class="pill" style="--c:${e.color}">${UI.esc(e.label || id)}</span>`; },
    estadoSub(id) { const e = S.ESTADOS_SUB.find(x => x.id === id) || {}; return `<span class="pill" style="--c:${e.color}">${UI.esc(e.label || id)}</span>`; },
    estadoSol(id) { const e = S.ESTADOS_SOL.find(x => x.id === id) || {}; return `<span class="pill" style="--c:${e.color}">${UI.esc(e.label || id)}</span>`; },
    disp(id) { const d = S.DISPONIBILIDAD.find(x => x.id === id) || {}; return `<span class="pill" style="--c:${d.color}">${UI.esc(d.label || id)}</span>`; },
    stars(n) {
      const full = Math.round(n);
      return '<span class="stars" title="' + n + '">' + '★'.repeat(full) + '<span class="stars-empty">' + '★'.repeat(5 - full) + '</span></span>';
    },
    docBar(pct) {
      const cls = pct === 100 ? 'ok' : pct >= 60 ? 'mid' : 'low';
      return `<span class="docbar"><span class="docbar-fill ${cls}" style="width:${pct}%"></span></span><span class="docbar-txt">${pct}%</span>`;
    },
    wa(tel, msg) {
      const num = (tel || '').replace(/[^0-9]/g, '');
      return `https://wa.me/${num}?text=${encodeURIComponent(msg || '')}`;
    },
    toast(msg, type) {
      let t = document.getElementById('toast');
      if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
      t.textContent = msg;
      t.className = 'toast show' + (type ? ' ' + type : '');
      clearTimeout(UI._tt);
      UI._tt = setTimeout(() => { t.className = 'toast'; }, 2600);
    },
    copy(text) {
      navigator.clipboard && navigator.clipboard.writeText(text).then(
        () => UI.toast('Copiado ✅'),
        () => UI.toast('No se pudo copiar', 'err')
      );
    },
    opts(list, sel, valKey, labKey) {
      return list.map(x => {
        const v = valKey ? x[valKey] : x.id;
        const l = labKey ? x[labKey] : x.label;
        return `<option value="${UI.esc(v)}"${v === sel ? ' selected' : ''}>${UI.esc(l)}</option>`;
      }).join('');
    }
  };
  window.UI = UI;

  /* ============ Modales ============ */

  const Modals = {
    open(html, wide) {
      const m = document.getElementById('modal');
      const c = document.getElementById('modalContent');
      c.className = 'modal' + (wide ? ' modal-wide' : '');
      c.innerHTML = html;
      m.hidden = false;
      const first = c.querySelector('input,select,textarea');
      if (first) setTimeout(() => first.focus(), 40);
    },
    close() { document.getElementById('modal').hidden = true; },

    /* ---------- Profesional ---------- */
    profesional(id) {
      const p = id ? S.profesionalById(id) : null;
      const nuevo = !p;
      const d = p || { docs: {}, oficiosSecundarios: [], zonas: [], referencias: [] };
      const oficiosSel = S.OFICIOS.map(o =>
        `<label class="chk"><input type="checkbox" name="of_sec" value="${o.id}"${(d.oficiosSecundarios || []).includes(o.id) ? ' checked' : ''}> ${o.emoji} ${o.label}</label>`).join('');
      const zonasSel = S.ZONAS.map(z =>
        `<label class="chk"><input type="checkbox" name="zona" value="${z}"${(d.zonas || []).includes(z) ? ' checked' : ''}> ${z}</label>`).join('');

      Modals.open(`
        <div class="modal-head">
          <h2>${nuevo ? 'Nuevo profesional' : UI.esc(d.nombre)}</h2>
          ${nuevo ? '' : UI.estadoProf(d.estado)}
        </div>
        <form id="formProf">
          <div class="form-grid">
            <label>Nombre *<input name="nombre" required value="${UI.esc(d.nombre || '')}"></label>
            <label>Teléfono *<input name="telefono" required value="${UI.esc(d.telefono || '')}" placeholder="+34 6..."></label>
            <label>Oficio principal
              <select name="oficioPrincipal">${UI.opts(S.OFICIOS, d.oficioPrincipal || 'albanil')}</select></label>
            <label>Tipo
              <select name="tipo">${UI.opts(S.TIPOS, d.tipo || 'autonomo')}</select></label>
            <label>Disponibilidad
              <select name="disponibilidad">${UI.opts(S.DISPONIBILIDAD, d.disponibilidad || 'inmediata')}</select></label>
            <label>Disponible desde<input type="date" name="disponibleDesde" value="${UI.esc(d.disponibleDesde || '')}"></label>
            <label>Experiencia (años)<input type="number" name="experiencia" min="0" value="${d.experiencia || 0}"></label>
            <label>Radio (km)<input type="number" name="radioKm" min="0" value="${d.radioKm || 30}"></label>
            <label>Precio
              <span class="inline"><input type="number" name="precio" min="0" step="5" value="${d.precio || 0}" style="width:90px">
              <select name="precioTipo">${UI.opts([{id:'dia',label:'€/día'},{id:'hora',label:'€/hora'}], d.precioTipo || 'dia')}</select></span></label>
          </div>

          <fieldset><legend>Oficios secundarios</legend><div class="chk-grid">${oficiosSel}</div></fieldset>
          <fieldset><legend>Zonas que cubre</legend><div class="chk-grid">${zonasSel}</div></fieldset>

          <label>Observaciones internas
            <textarea name="observaciones" placeholder="Ej: bueno en baños, no coger obra grande...">${UI.esc(d.observaciones || '')}</textarea></label>

          <div class="modal-actions">
            <button type="button" class="btn" id="cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">${nuevo ? 'Añadir a la bolsa' : 'Guardar cambios'}</button>
          </div>
        </form>

        ${nuevo ? '' : Modals._profExtra(d)}
      `, true);

      document.getElementById('cancel').onclick = Modals.close;
      document.getElementById('formProf').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        data.oficiosSecundarios = fd.getAll('of_sec');
        data.zonas = fd.getAll('zona');
        data.experiencia = Number(data.experiencia) || 0;
        data.radioKm = Number(data.radioKm) || 0;
        data.precio = Number(data.precio) || 0;
        delete data.of_sec; delete data.zona;
        if (nuevo) { S.addProfesional(data); UI.toast('Profesional añadido a la bolsa'); Modals.close(); }
        else { S.updateProfesional(id, data); UI.toast('Cambios guardados'); Modals.profesional(id); }
      };
      if (!nuevo) Modals._bindProfExtra(d);
    },

    _profExtra(p) {
      const req = S.docsRequeridos(p);
      const pct = S.verificadoPct(p);
      const docsHtml = req.map(doc => {
        const st = (p.docs || {})[doc.id] || 'no';
        return `<div class="doc-row">
          <span class="doc-label">${UI.esc(doc.label)}</span>
          <select data-doc="${doc.id}">
            ${UI.opts([{id:'ok',label:'✅ Aportado'},{id:'pendiente',label:'⏳ Pendiente'},{id:'no',label:'❌ No aporta'}], st)}
          </select>
        </div>`;
      }).join('');

      const r = S.rating(p.id);
      const vals = S.state.valoraciones.filter(v => v.profesionalId === p.id);
      const valsHtml = vals.length ? vals.map(v => `
        <div class="val-row">
          <div class="val-score">${v.calidad + v.puntualidad + v.limpieza + v.autonomia}/20</div>
          <div class="val-body">
            <div class="val-crit">⭐${v.calidad} ⏱️${v.puntualidad} 🧹${v.limpieza} 🧠${v.autonomia}</div>
            ${v.comentario ? `<div class="val-com">"${UI.esc(v.comentario)}"</div>` : ''}
            <div class="val-meta">${UI.fecha(v.fecha)}</div>
          </div>
        </div>`).join('') : '<p class="muted">Sin valoraciones todavía.</p>';

      return `
        <div class="sep"></div>
        <div class="grid-2">
          <div class="panel">
            <h3>📄 Verificación documental <span class="badge-pct ${pct===100?'ok':pct>=60?'mid':'low'}">${pct}%</span></h3>
            <p class="muted small">Antes de activar un perfil, revisa y marca cada documento (informe §7).</p>
            <div class="docs-list">${docsHtml}</div>
            <div class="estado-actions">
              <button class="btn btn-mini btn-ok" data-estado="verificado">✅ Verificar</button>
              <button class="btn btn-mini btn-warn" data-estado="pendiente">⏳ Pendiente</button>
              <button class="btn btn-mini btn-danger" data-estado="noApto">❌ No apto</button>
            </div>
          </div>
          <div class="panel">
            <h3>⭐ Scoring ${r.n ? UI.stars(r.media) + ' <span class="muted">' + r.media + ' (' + r.n + ')</span>' : '<span class="muted">sin datos</span>'}</h3>
            <div class="vals">${valsHtml}</div>
            <button class="btn btn-mini" id="addVal">+ Registrar valoración</button>
          </div>
        </div>

        <div class="sep"></div>
        <div class="panel">
          <h3>💬 Acciones WhatsApp</h3>
          <div class="wa-actions">
            <a class="btn btn-wa" target="_blank" id="waDisp">📅 Preguntar disponibilidad</a>
            <a class="btn btn-wa" target="_blank" id="waDocs">📄 Pedir documentación</a>
            <button class="btn btn-danger btn-ghost" id="delProf">Eliminar de la bolsa</button>
          </div>
        </div>`;
    },

    _bindProfExtra(p) {
      const cont = document.getElementById('modalContent');
      cont.querySelectorAll('[data-doc]').forEach(sel => {
        sel.onchange = () => {
          const docs = Object.assign({}, p.docs);
          docs[sel.dataset.doc] = sel.value;
          S.updateProfesional(p.id, { docs });
          Modals.profesional(p.id);
        };
      });
      cont.querySelectorAll('[data-estado]').forEach(b => {
        b.onclick = () => { S.updateProfesional(p.id, { estado: b.dataset.estado }); UI.toast('Estado: ' + b.dataset.estado); Modals.profesional(p.id); };
      });
      const cfg = S.state.config;
      const waDisp = cont.querySelector('#waDisp');
      if (waDisp) waDisp.href = UI.wa(p.telefono, window.Templates.disponibilidadSemanal(p));
      const waDocs = cont.querySelector('#waDocs');
      if (waDocs) waDocs.href = UI.wa(p.telefono, window.Templates.pedirDocs(p));
      const addVal = cont.querySelector('#addVal');
      if (addVal) addVal.onclick = () => Modals.valoracion(p.id);
      const del = cont.querySelector('#delProf');
      if (del) del.onclick = () => {
        if (confirm('¿Eliminar a ' + p.nombre + ' de la bolsa?')) { S.removeProfesional(p.id); Modals.close(); UI.toast('Eliminado'); }
      };
    },

    /* ---------- Valoración ---------- */
    valoracion(profId) {
      const p = S.profesionalById(profId);
      const crit = S.CRITERIOS.map(c => `
        <label class="rate">${UI.esc(c.label)}
          <select name="${c.id}">${[5,4,3,2,1].map(n => `<option value="${n}">${'★'.repeat(n)} ${n}</option>`).join('')}</select>
        </label>`).join('');
      Modals.open(`
        <h2>Valorar a ${UI.esc(p.nombre)}</h2>
        <p class="muted">Puntúa del 1 al 5. El scoring mantiene la bolsa fiable.</p>
        <form id="formVal">
          <div class="rate-grid">${crit}</div>
          <label>Comentario<textarea name="comentario" placeholder="¿Qué tal fue la obra?"></textarea></label>
          <div class="modal-actions">
            <button type="button" class="btn" id="cancelVal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar valoración</button>
          </div>
        </form>`);
      document.getElementById('cancelVal').onclick = () => Modals.profesional(profId);
      document.getElementById('formVal').onsubmit = e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        S.CRITERIOS.forEach(c => data[c.id] = Number(data[c.id]));
        data.profesionalId = profId;
        S.addValoracion(data);
        UI.toast('Valoración registrada');
        Modals.profesional(profId);
      };
    },

    /* ---------- Constructora ---------- */
    constructora(id) {
      const c = id ? S.constructoraById(id) : null;
      const nuevo = !c;
      const d = c || {};
      const planOpts = S.PLANES.map(p => `<option value="${p.id}"${(d.plan||'piloto')===p.id?' selected':''}>${p.label} · ${p.cuota} €</option>`).join('');
      const sols = c ? S.state.solicitudes.filter(s => s.constructoraId === c.id) : [];

      Modals.open(`
        <div class="modal-head">
          <h2>${nuevo ? 'Nueva constructora' : UI.esc(d.nombre)}</h2>
          ${nuevo ? '' : UI.estadoSub(d.estado)}
        </div>
        <form id="formCon">
          <div class="form-grid">
            <label>Nombre *<input name="nombre" required value="${UI.esc(d.nombre||'')}"></label>
            <label>Persona de contacto<input name="contacto" value="${UI.esc(d.contacto||'')}"></label>
            <label>Teléfono *<input name="telefono" required value="${UI.esc(d.telefono||'')}"></label>
            <label>Email<input name="email" type="email" value="${UI.esc(d.email||'')}"></label>
            <label>Zona<select name="zona">${UI.opts(S.ZONAS.map(z=>({id:z,label:z})), d.zona||'Oviedo')}</select></label>
            <label>Plan<select name="plan" id="planSel">${planOpts}</select></label>
            <label>Estado suscripción<select name="estado">${UI.opts(S.ESTADOS_SUB, d.estado||'prueba')}</select></label>
            <label>Cuota (€/mes)<input type="number" name="cuotaMes" min="0" value="${d.cuotaMes||99}"></label>
            <label>Alta<input type="date" name="altaFecha" value="${UI.esc(d.altaFecha||S.hoy())}"></label>
            <label>Renovación<input type="date" name="renovacionFecha" value="${UI.esc(d.renovacionFecha||S.addDays(S.hoy(),30))}"></label>
          </div>
          <label>Notas<textarea name="notas">${UI.esc(d.notas||'')}</textarea></label>
          <div class="modal-actions">
            <button type="button" class="btn" id="cancelCon">Cancelar</button>
            <button type="submit" class="btn btn-primary">${nuevo?'Añadir cliente':'Guardar'}</button>
          </div>
        </form>
        ${nuevo ? '' : `
        <div class="sep"></div>
        <div class="panel">
          <h3>📨 Solicitudes de este cliente (${sols.length})</h3>
          ${sols.length ? sols.map(s => `<div class="mini-row" data-sol="${s.id}">
              ${UI.oficioTag(s.oficio)} × ${s.cantidad} · ${UI.esc(s.zona)} ${UI.estadoSol(s.estado)}</div>`).join('') : '<p class="muted">Sin solicitudes aún.</p>'}
          <div class="wa-actions" style="margin-top:12px">
            <a class="btn btn-wa" target="_blank" id="waVenta">💬 Guion de venta</a>
            <button class="btn btn-danger btn-ghost" id="delCon">Eliminar cliente</button>
          </div>
        </div>`}
      `, true);

      document.getElementById('cancelCon').onclick = Modals.close;
      const planSel = document.getElementById('planSel');
      if (planSel) planSel.onchange = () => {
        const pl = S.PLANES.find(p => p.id === planSel.value);
        if (pl) document.querySelector('#formCon [name=cuotaMes]').value = pl.cuota;
      };
      document.getElementById('formCon').onsubmit = e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        data.cuotaMes = Number(data.cuotaMes) || 0;
        if (nuevo) { S.addConstructora(data); UI.toast('Cliente añadido'); Modals.close(); }
        else { S.updateConstructora(id, data); UI.toast('Guardado'); Modals.constructora(id); }
      };
      if (!nuevo) {
        const cont = document.getElementById('modalContent');
        cont.querySelectorAll('[data-sol]').forEach(el => el.onclick = () => Modals.solicitud(el.dataset.sol));
        const waVenta = cont.querySelector('#waVenta');
        if (waVenta) waVenta.href = UI.wa(d.telefono, window.Templates.ventaConstructora(S.state.config));
        const del = cont.querySelector('#delCon');
        if (del) del.onclick = () => { if (confirm('¿Eliminar ' + d.nombre + '?')) { S.removeConstructora(id); Modals.close(); UI.toast('Eliminado'); } };
      }
    },

    /* ---------- Solicitud + matching ---------- */
    solicitud(id) {
      const s = id ? S.solicitudById(id) : null;
      const nuevo = !s;
      const d = s || {};
      const conOpts = S.state.constructoras.map(c => `<option value="${c.id}"${d.constructoraId===c.id?' selected':''}>${UI.esc(c.nombre)}</option>`).join('');

      Modals.open(`
        <div class="modal-head">
          <h2>${nuevo ? 'Nueva solicitud' : 'Solicitud'}</h2>
          ${nuevo ? '' : UI.estadoSol(d.estado)}
        </div>
        <form id="formSol">
          <div class="form-grid">
            <label>Constructora *<select name="constructoraId" required><option value="">— elegir —</option>${conOpts}</select></label>
            <label>Oficio<select name="oficio">${UI.opts(S.OFICIOS, d.oficio||'albanil')}</select></label>
            <label>Cantidad<input type="number" name="cantidad" min="1" value="${d.cantidad||1}"></label>
            <label>Zona<select name="zona">${UI.opts(S.ZONAS.filter(z=>z!=='Toda Asturias').map(z=>({id:z,label:z})), d.zona||'Oviedo')}</select></label>
            <label>Fecha inicio<input type="date" name="fechaInicio" value="${UI.esc(d.fechaInicio||S.hoy())}"></label>
            <label>Duración<input name="duracion" value="${UI.esc(d.duracion||'')}" placeholder="Ej: 3 semanas"></label>
            <label>Urgencia<select name="urgencia">${UI.opts([{id:'normal',label:'Normal'},{id:'urgente',label:'🔴 Urgente'}], d.urgencia||'normal')}</select></label>
            <label>Contrato<select name="tipoContrato">${UI.opts([{id:'subcontrata',label:'Subcontrata'},{id:'autonomo',label:'Autónomo'},{id:'sl',label:'Empresa/SL'}], d.tipoContrato||'subcontrata')}</select></label>
          </div>
          <label>Notas<textarea name="notas">${UI.esc(d.notas||'')}</textarea></label>
          <div class="modal-actions">
            <button type="button" class="btn" id="cancelSol">Cancelar</button>
            <button type="submit" class="btn btn-primary">${nuevo?'Crear y buscar candidatos':'Guardar'}</button>
          </div>
        </form>
        ${nuevo ? '' : '<div class="sep"></div><div id="matchZone"></div>'}
      `, true);

      document.getElementById('cancelSol').onclick = Modals.close;
      document.getElementById('formSol').onsubmit = e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        data.cantidad = Number(data.cantidad) || 1;
        if (nuevo) { const nid = S.addSolicitud(data); UI.toast('Solicitud creada'); Modals.solicitud(nid); }
        else { S.updateSolicitud(id, data); UI.toast('Guardado'); Modals.solicitud(id); }
      };
      if (!nuevo) Modals._renderMatch(s);
    },

    _renderMatch(s) {
      const zone = document.getElementById('matchZone');
      if (!zone) return;
      const { top } = S.matching(s, { limit: 5 });
      const con = S.constructoraById(s.constructoraId);
      const propuestos = s.candidatos || [];

      const cards = top.length ? top.map(c => {
        const p = c.prof;
        const yaProp = propuestos.includes(p.id);
        const elegido = s.elegido === p.id;
        return `<div class="match-card ${elegido?'elegido':''}">
          <div class="match-head">
            <div>
              <b>${UI.esc(p.nombre)}</b> ${UI.estadoProf(p.estado)}
              <div class="muted small">${UI.oficio(p.oficioPrincipal).label} · ${p.experiencia} años · ${(p.zonas||[]).join('/')}</div>
            </div>
            <div class="match-score" title="Puntuación de encaje">${c.score}</div>
          </div>
          <div class="match-razones">
            ${c.razones.map(r => `<span class="razon ${r.ok?'si':'no'}">${r.ok?'✓':'·'} ${UI.esc(r.txt)}</span>`).join('')}
          </div>
          <div class="match-actions">
            <a class="btn btn-mini btn-wa" target="_blank" href="${UI.wa(p.telefono, 'Hola ' + (p.nombre||'').split(' ')[0] + ', tengo una obra que te puede encajar en ' + s.zona + '. ¿Estás disponible?')}">💬 WhatsApp</a>
            <button class="btn btn-mini" data-verperfil="${p.id}">Ver ficha</button>
            <button class="btn btn-mini ${yaProp?'btn-ok':''}" data-prop="${p.id}">${yaProp?'✓ Propuesto':'+ Proponer'}</button>
            <button class="btn btn-mini ${elegido?'btn-ok':'btn-primary'}" data-elegir="${p.id}">${elegido?'✓ Elegido':'Marcar match'}</button>
          </div>
        </div>`;
      }).join('') : '<p class="muted">Ningún profesional cubre este oficio/zona con disponibilidad. Revisa la bolsa o amplía la zona.</p>';

      const propObjs = propuestos.map(pid => S.profesionalById(pid)).filter(Boolean);
      const waPresentar = con && propObjs.length
        ? UI.wa(con.telefono, window.Templates.presentarCandidatos(s, propObjs.map(p => ({ prof: p, rating: S.rating(p.id) })), S.state.config))
        : '';

      zone.innerHTML = `
        <div class="panel">
          <div class="match-topbar">
            <h3>🎯 Candidatos para esta obra</h3>
            <div class="estado-pills">
              ${S.ESTADOS_SOL.map(e => `<button class="pill-btn ${s.estado===e.id?'active':''}" data-setestado="${e.id}" style="--c:${e.color}">${e.label}</button>`).join('')}
            </div>
          </div>
          <div class="match-list">${cards}</div>
          ${propObjs.length ? `<div class="present-bar">
            <span>${propObjs.length} perfil${propObjs.length>1?'es':''} propuesto${propObjs.length>1?'s':''}: ${propObjs.map(p=>UI.esc(p.nombre)).join(', ')}</span>
            <a class="btn btn-wa" target="_blank" href="${waPresentar}">📤 Enviar a ${con?UI.esc(con.nombre):'cliente'}</a>
          </div>` : ''}
        </div>`;

      zone.querySelectorAll('[data-prop]').forEach(b => b.onclick = () => {
        const pid = b.dataset.prop;
        let cand = (s.candidatos || []).slice();
        cand = cand.includes(pid) ? cand.filter(x => x !== pid) : cand.concat(pid);
        const estado = cand.length && s.estado === 'nueva' ? 'presentada' : s.estado;
        S.updateSolicitud(s.id, { candidatos: cand, estado });
        Modals.solicitud(s.id);
      });
      zone.querySelectorAll('[data-elegir]').forEach(b => b.onclick = () => {
        const pid = b.dataset.elegir;
        const elegido = s.elegido === pid ? '' : pid;
        S.updateSolicitud(s.id, { elegido, estado: elegido ? 'cerrada' : s.estado });
        if (elegido) UI.toast('Match cerrado ✅');
        Modals.solicitud(s.id);
      });
      zone.querySelectorAll('[data-verperfil]').forEach(b => b.onclick = () => Modals.profesional(b.dataset.verperfil));
      zone.querySelectorAll('[data-setestado]').forEach(b => b.onclick = () => { S.updateSolicitud(s.id, { estado: b.dataset.setestado }); Modals.solicitud(s.id); });
    }
  };
  window.Modals = Modals;

  /* ============ Vistas ============ */

  const Views = {
    current: 'dashboard',

    render(view) {
      Views.current = view;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
      const app = document.getElementById('app');
      const fn = Views[view];
      app.innerHTML = typeof fn === 'function' ? fn() : '<p>Vista no encontrada</p>';
      if (Views['_bind_' + view]) Views['_bind_' + view]();
    },

    /* ---------- Dashboard ---------- */
    dashboard() {
      const k = S.kpis();
      const objetivos = [
        ['Constructoras contactadas', k.constructorasContactadas, 50],
        ['Constructoras en piloto', k.constructorasPiloto, 10],
        ['Constructoras pagando', k.constructorasPagando, '5-10'],
        ['Profesionales registrados', k.profesionalesRegistrados, 150],
        ['Profesionales verificados', k.profesionalesVerificados, 50],
        ['Solicitudes recibidas', k.solicitudesRecibidas, 30],
        ['Matches realizados', k.matchesRealizados, 20],
        ['Renovación mes 2', k.renovacionPct + '%', '>60%']
      ];
      const pend = S.profesionalesPendientes();
      const activas = S.solicitudesActivas();
      const caduca = S.disponibilidadCaducada();

      return `
        <div class="hero-row">
          <div>
            <h1>Panel ObraMatch <span class="muted">· Asturias</span></h1>
            <p class="hero-sub">Bolsa viva de oficios verificados. Cobramos por acceso, no por contacto.</p>
          </div>
          <div class="hero-actions">
            <button class="btn btn-primary" data-new="solicitud">+ Solicitud</button>
            <button class="btn" data-new="profesional">+ Profesional</button>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi"><span class="kpi-label">MRR (pagando)</span><span class="kpi-value">${UI.money(k.mrr)}</span></div>
          <div class="kpi"><span class="kpi-label">Clientes pagando</span><span class="kpi-value">${k.constructorasPagando}</span></div>
          <div class="kpi"><span class="kpi-label">En piloto</span><span class="kpi-value">${k.constructorasPiloto}</span></div>
          <div class="kpi"><span class="kpi-label">Bolsa verificada</span><span class="kpi-value">${k.profesionalesVerificados}<span class="kpi-sub">/${k.profesionalesRegistrados}</span></span></div>
          <div class="kpi"><span class="kpi-label">Solicitudes abiertas</span><span class="kpi-value">${k.solicitudesAbiertas}</span></div>
          <div class="kpi"><span class="kpi-label">Matches</span><span class="kpi-value">${k.matchesRealizados}</span></div>
        </div>

        <div class="grid-2">
          <div class="card">
            <h2>🔥 Solicitudes abiertas</h2>
            <p class="card-sub">Obras esperando candidatos. Ábrelas y lanza el matching.</p>
            <div class="list">
              ${activas.length ? activas.map(s => {
                const c = S.constructoraById(s.constructoraId);
                const dias = UI.dias(s.fechaInicio);
                return `<div class="list-row" data-sol="${s.id}">
                  <div>${UI.oficioTag(s.oficio)} <b>× ${s.cantidad}</b> · ${UI.esc(s.zona)}
                    ${s.urgencia==='urgente'?'<span class="urg">🔴 urgente</span>':''}</div>
                  <div class="list-meta">${c?UI.esc(c.nombre):'—'} · inicio ${dias>=0?'en '+dias+'d':'pasado'} ${UI.estadoSol(s.estado)}</div>
                </div>`; }).join('') : '<p class="muted">Sin solicitudes abiertas.</p>'}
            </div>
          </div>
          <div class="card">
            <h2>📄 Pendientes de verificar <span class="count">${pend.length}</span></h2>
            <p class="card-sub">Perfiles nuevos sin activar. Revisa su documentación.</p>
            <div class="list">
              ${pend.length ? pend.map(p => `<div class="list-row" data-prof="${p.id}">
                <div><b>${UI.esc(p.nombre)}</b> · ${UI.oficio(p.oficioPrincipal).label}</div>
                <div class="list-meta">docs ${S.verificadoPct(p)}% · ${UI.esc((p.zonas||[]).join('/'))}</div>
              </div>`).join('') : '<p class="muted">Todo verificado 🎉</p>'}
            </div>
            ${caduca.length ? `<div class="warn-box">⚠️ ${caduca.length} perfil(es) verificados sin actualizar disponibilidad hace +7 días. Envía el WhatsApp del lunes.</div>` : ''}
          </div>
        </div>

        <div class="card">
          <h2>🎯 Objetivos 90 días <span class="muted small">(informe §12)</span></h2>
          <div class="obj-grid">
            ${objetivos.map(o => `<div class="obj"><span class="obj-val">${o[1]}</span><span class="obj-goal">meta ${o[2]}</span><span class="obj-label">${o[0]}</span></div>`).join('')}
          </div>
        </div>`;
    },
    _bind_dashboard() {
      const app = document.getElementById('app');
      app.querySelectorAll('[data-sol]').forEach(el => el.onclick = () => Modals.solicitud(el.dataset.sol));
      app.querySelectorAll('[data-prof]').forEach(el => el.onclick = () => Modals.profesional(el.dataset.prof));
      app.querySelectorAll('[data-new]').forEach(el => el.onclick = () => el.dataset.new === 'solicitud' ? Modals.solicitud() : Modals.profesional());
    },

    /* ---------- Solicitudes ---------- */
    solicitudes() {
      const sols = S.state.solicitudes;
      const grupos = [['Abiertas', s => s.estado==='nueva'||s.estado==='enProceso'], ['Perfiles enviados', s => s.estado==='presentada'], ['Cerradas', s => s.estado==='cerrada'], ['Canceladas', s => s.estado==='cancelada']];
      return `
        <div class="view-header">
          <h1>Solicitudes de obra</h1>
          <button class="btn btn-primary" data-new="solicitud">+ Nueva solicitud</button>
        </div>
        <p class="hero-sub">Flujo: constructora pide por WhatsApp → clasificamos → matching → 3 perfiles → conecta → valora.</p>
        ${!sols.length ? '<div class="empty-state">Aún no hay solicitudes. Crea la primera.</div>' :
          grupos.map(([titulo, filt]) => {
            const items = sols.filter(filt);
            if (!items.length) return '';
            return `<h3 class="group-title">${titulo} <span class="count">${items.length}</span></h3>
              <div class="sol-grid">${items.map(Views._solCard).join('')}</div>`;
          }).join('')}`;
    },
    _solCard(s) {
      const c = S.constructoraById(s.constructoraId);
      const dias = UI.dias(s.fechaInicio);
      const cand = (s.candidatos||[]).length;
      return `<div class="sol-card" data-sol="${s.id}">
        <div class="sol-card-head">${UI.oficioTag(s.oficio)} <b>× ${s.cantidad}</b> ${s.urgencia==='urgente'?'<span class="urg">🔴</span>':''}</div>
        <div class="sol-card-body">
          <div class="muted">${c?UI.esc(c.nombre):'—'}</div>
          <div>📍 ${UI.esc(s.zona)} · inicio ${dias>=0?'en '+dias+'d':UI.fecha(s.fechaInicio)}</div>
          ${s.duracion?`<div class="muted small">⏳ ${UI.esc(s.duracion)}</div>`:''}
        </div>
        <div class="sol-card-foot">${UI.estadoSol(s.estado)} ${cand?`<span class="muted small">${cand} propuesto(s)</span>`:''}</div>
      </div>`;
    },
    _bind_solicitudes() {
      const app = document.getElementById('app');
      app.querySelectorAll('[data-sol]').forEach(el => el.onclick = () => Modals.solicitud(el.dataset.sol));
      app.querySelectorAll('[data-new]').forEach(el => el.onclick = () => Modals.solicitud());
    },

    /* ---------- Profesionales (bolsa) ---------- */
    profesionales() {
      return `
        <div class="view-header">
          <h1>Bolsa de profesionales</h1>
          <button class="btn btn-primary" data-new="profesional">+ Nuevo profesional</button>
        </div>
        <div class="filters">
          <input id="fSearch" placeholder="🔎 Buscar nombre...">
          <select id="fOficio"><option value="">Todos los oficios</option>${UI.opts(S.OFICIOS,'')}</select>
          <select id="fZona"><option value="">Todas las zonas</option>${S.ZONAS.map(z=>`<option value="${z}">${z}</option>`).join('')}</select>
          <select id="fDisp"><option value="">Cualquier disponibilidad</option>${UI.opts(S.DISPONIBILIDAD,'')}</select>
          <select id="fEstado"><option value="">Cualquier estado</option>${UI.opts(S.ESTADOS_PROF,'')}</select>
        </div>
        <div id="profList"></div>`;
    },
    _bind_profesionales() {
      const app = document.getElementById('app');
      app.querySelector('[data-new]').onclick = () => Modals.profesional();
      const render = () => {
        const q = (document.getElementById('fSearch').value||'').toLowerCase();
        const of = document.getElementById('fOficio').value;
        const zo = document.getElementById('fZona').value;
        const di = document.getElementById('fDisp').value;
        const es = document.getElementById('fEstado').value;
        let list = S.state.profesionales.filter(p => {
          if (q && !p.nombre.toLowerCase().includes(q)) return false;
          if (of && p.oficioPrincipal !== of && !(p.oficiosSecundarios||[]).includes(of)) return false;
          if (zo && !(p.zonas||[]).includes(zo) && !(p.zonas||[]).includes('Toda Asturias')) return false;
          if (di && p.disponibilidad !== di) return false;
          if (es && p.estado !== es) return false;
          return true;
        });
        const cont = document.getElementById('profList');
        if (!list.length) { cont.innerHTML = '<div class="empty-state">Ningún profesional con esos filtros.</div>'; return; }
        cont.innerHTML = `<table class="data-table">
          <thead><tr><th>Profesional</th><th>Oficio</th><th>Zonas</th><th>Disp.</th><th>Precio</th><th>Docs</th><th>Rating</th><th>Estado</th></tr></thead>
          <tbody>${list.map(p => {
            const r = S.rating(p.id);
            return `<tr data-prof="${p.id}">
              <td><b>${UI.esc(p.nombre)}</b><div class="muted small">${p.experiencia} años · ${UI.esc((S.TIPOS.find(t=>t.id===p.tipo)||{}).label||p.tipo)}</div></td>
              <td>${UI.oficio(p.oficioPrincipal).emoji} ${UI.esc(UI.oficio(p.oficioPrincipal).label)}</td>
              <td class="muted small">${UI.esc((p.zonas||[]).join(', '))||'—'}</td>
              <td>${UI.disp(p.disponibilidad)}</td>
              <td class="nowrap">${p.precio?p.precio+' €/'+(p.precioTipo==='hora'?'h':'d'):'—'}</td>
              <td class="nowrap">${UI.docBar(S.verificadoPct(p))}</td>
              <td class="nowrap">${r.n?UI.stars(r.media)+' <span class="muted small">('+r.n+')</span>':'<span class="muted small">—</span>'}</td>
              <td>${UI.estadoProf(p.estado)}</td>
            </tr>`; }).join('')}</tbody></table>`;
        cont.querySelectorAll('[data-prof]').forEach(el => el.onclick = () => Modals.profesional(el.dataset.prof));
      };
      ['fSearch','fOficio','fZona','fDisp','fEstado'].forEach(id => {
        const el = document.getElementById(id);
        el.oninput = render; el.onchange = render;
      });
      render();
    },

    /* ---------- Constructoras ---------- */
    constructoras() {
      const cons = S.state.constructoras;
      return `
        <div class="view-header">
          <h1>Constructoras · clientes</h1>
          <button class="btn btn-primary" data-new="constructora">+ Nueva constructora</button>
        </div>
        ${!cons.length ? '<div class="empty-state">Sin clientes todavía.</div>' :
        `<table class="data-table">
          <thead><tr><th>Cliente</th><th>Contacto</th><th>Zona</th><th>Plan</th><th>Cuota</th><th>Renovación</th><th>Estado</th></tr></thead>
          <tbody>${cons.map(c => {
            const pl = S.PLANES.find(p => p.id === c.plan) || {};
            const dias = UI.dias(c.renovacionFecha);
            const alerta = c.estado==='activa' && dias!=null && dias<=7;
            return `<tr data-con="${c.id}">
              <td><b>${UI.esc(c.nombre)}</b></td>
              <td class="muted small">${UI.esc(c.contacto||'—')}<br>${UI.esc(c.telefono||'')}</td>
              <td>${UI.esc(c.zona)}</td>
              <td>${UI.esc(pl.label||c.plan)}</td>
              <td class="nowrap">${UI.money(c.cuotaMes)}</td>
              <td class="nowrap ${alerta?'text-warn':''}">${UI.fecha(c.renovacionFecha)}${alerta?' ⚠️':''}</td>
              <td>${UI.estadoSub(c.estado)}</td>
            </tr>`; }).join('')}</tbody></table>`}`;
    },
    _bind_constructoras() {
      const app = document.getElementById('app');
      app.querySelector('[data-new]').onclick = () => Modals.constructora();
      app.querySelectorAll('[data-con]').forEach(el => el.onclick = () => Modals.constructora(el.dataset.con));
    },

    /* ---------- Ajustes ---------- */
    ajustes() {
      const e = S.state.config.empresa;
      return `
        <div class="view-header"><h1>Ajustes</h1></div>
        <div class="card">
          <h2>Empresa</h2>
          <div class="form-grid">
            <label>Nombre<input data-emp="nombre" value="${UI.esc(e.nombre)}"></label>
            <label>Teléfono WhatsApp<input data-emp="telefono" value="${UI.esc(e.telefono)}"></label>
            <label>Email<input data-emp="email" value="${UI.esc(e.email)}"></label>
            <label>Web<input data-emp="web" value="${UI.esc(e.web)}"></label>
          </div>
          <label>Claim<input data-emp="claim" value="${UI.esc(e.claim)}" style="width:100%"></label>
          <button class="btn btn-primary" id="saveEmp">Guardar</button>
        </div>

        <div class="card">
          <h2>Planes de suscripción</h2>
          <table class="data-table">
            <thead><tr><th>Plan</th><th>Cuota</th><th>Solicitudes/mes</th><th>Para quién</th></tr></thead>
            <tbody>${S.PLANES.map(p => `<tr><td><b>${p.label}</b></td><td>${p.cuota} €/mes</td><td>${p.solicitudes}</td><td class="muted small">${p.desc}</td></tr>`).join('')}</tbody>
          </table>
          <p class="muted small">💡 Cobramos por acceso a la bolsa viva, no por contacto. Si cobras por contacto, te puentean.</p>
        </div>

        <div class="card">
          <h2>Fase 2 · Agencia de colocación</h2>
          <p class="muted">Los perfiles marcados como <b>asalariado</b> requieren la declaración responsable de agencia de colocación (SEPE) para poder intermediar con trabajadores por cuenta ajena. Hay ${S.state.profesionales.filter(p=>p.tipo==='asalariado').length} perfil(es) en esa situación esperando la Fase 2.</p>
        </div>

        <div class="card">
          <h2>Datos</h2>
          <div class="wa-actions">
            <button class="btn" id="exportData">⬇️ Descargar copia (JSON)</button>
            <label class="btn">⬆️ Importar JSON<input type="file" id="importData" hidden accept="application/json"></label>
            <button class="btn btn-danger" id="resetData">Vaciar todos los datos</button>
          </div>
        </div>`;
    },
    _bind_ajustes() {
      document.getElementById('saveEmp').onclick = () => {
        const emp = {};
        document.querySelectorAll('[data-emp]').forEach(el => emp[el.dataset.emp] = el.value);
        S.state.config.empresa = Object.assign(S.state.config.empresa, emp);
        S.save();
        UI.toast('Guardado');
      };
      document.getElementById('exportData').onclick = () => {
        const blob = new Blob([JSON.stringify(S.state, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'obramatch-backup.json';
        a.click();
      };
      document.getElementById('importData').onchange = ev => {
        const f = ev.target.files[0]; if (!f) return;
        const rd = new FileReader();
        rd.onload = () => {
          try {
            const data = JSON.parse(rd.result);
            ['profesionales','constructoras','solicitudes','valoraciones'].forEach(k => { if (data[k]) S.state[k] = data[k]; });
            if (data.config) S.state.config = data.config;
            S.save(); UI.toast('Importado ✅');
          } catch (e) { UI.toast('Archivo no válido', 'err'); }
        };
        rd.readAsText(f);
      };
      document.getElementById('resetData').onclick = () => {
        if (confirm('¿Vaciar TODOS los datos? Esto no se puede deshacer.')) { S.reset(); UI.toast('Datos vaciados'); Views.render('dashboard'); }
      };
    }
  };
  window.Views = Views;
})();
