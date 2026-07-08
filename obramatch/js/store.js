/* ObraMatch Asturias — capa de datos.
 * Estado en memoria persistido en localStorage. Sin backend: pensado para que
 * un operador lleve la bolsa viva a mano en fase piloto (como recomienda el informe).
 *
 * Modelo de negocio: marketplace B2B de suscripción. Cobramos por ACCESO a una
 * bolsa viva de oficios verificados, no por contacto. Fase 1: autónomos / SL /
 * subcontratas. Fase 2 (preparada): agencia de colocación para asalariados.
 */
(function () {
  'use strict';

  const LS_KEY = 'obramatch_v1';

  /* ============ Constantes de dominio ============ */

  // Oficios prioritarios (informe §4). Los 5 primeros son los más demandados.
  const OFICIOS = [
    { id: 'albanil',      label: 'Albañil',              emoji: '🧱', top: true },
    { id: 'pladurista',   label: 'Pladurista',           emoji: '🪚', top: true },
    { id: 'alicatador',   label: 'Alicatador',           emoji: '◼️', top: true },
    { id: 'electricista', label: 'Electricista',         emoji: '⚡', top: true },
    { id: 'fontanero',    label: 'Fontanero',            emoji: '🔧', top: true },
    { id: 'pintor',       label: 'Pintor',               emoji: '🎨' },
    { id: 'carpintero',   label: 'Carpintero',           emoji: '🪵' },
    { id: 'ferralla',     label: 'Ferralla / Encofrador', emoji: '🏗️' },
    { id: 'solador',      label: 'Solador',              emoji: '🔲' },
    { id: 'peon',         label: 'Peón especializado',   emoji: '👷' }
  ];

  // Zonas de trabajo en Asturias.
  const ZONAS = [
    'Oviedo', 'Gijón', 'Avilés', 'Siero', 'Langreo', 'Mieres',
    'Occidente', 'Oriente', 'Toda Asturias'
  ];

  const TIPOS = [
    { id: 'autonomo',   label: 'Autónomo' },
    { id: 'sl',         label: 'Empresa / SL' },
    { id: 'subcontrata',label: 'Subcontrata / cuadrilla' },
    { id: 'asalariado', label: 'Asalariado disponible' } // Fase 2 · agencia colocación
  ];

  const DISPONIBILIDAD = [
    { id: 'inmediata', label: 'Inmediata',   peso: 20, color: '#10b981' },
    { id: 'semana',    label: 'En 1 semana', peso: 10, color: '#f59e0b' },
    { id: 'ocupado',   label: 'Ocupado',     peso: 0,  color: '#ef4444' }
  ];

  const ESTADOS_PROF = [
    { id: 'verificado', label: 'Verificado', color: '#10b981' },
    { id: 'pendiente',  label: 'Pendiente',  color: '#f59e0b' },
    { id: 'noApto',     label: 'No apto',    color: '#ef4444' }
  ];

  // Documentos exigidos para verificar (informe §7). 'na' = no aplica a su tipo.
  const DOCS = [
    { id: 'dni',          label: 'DNI / NIE',            para: ['autonomo','sl','subcontrata','asalariado'] },
    { id: 'altaAutonomo', label: 'Alta autónomo / CIF',  para: ['autonomo','sl','subcontrata'] },
    { id: 'rc',           label: 'Seguro RC',            para: ['autonomo','sl','subcontrata'] },
    { id: 'prl',          label: 'Formación PRL',        para: ['autonomo','sl','subcontrata','asalariado'] },
    { id: 'tpc',          label: 'TPC (Tarjeta Prof. Construcción)', para: ['autonomo','sl','subcontrata','asalariado'] },
    { id: 'rea',          label: 'REA (Registro Empresas Acreditadas)', para: ['sl','subcontrata'] },
    { id: 'permisoTrabajo', label: 'Permiso de trabajo', para: ['asalariado'] }
  ];

  const CRITERIOS = [
    { id: 'calidad',    label: 'Calidad' },
    { id: 'puntualidad',label: 'Puntualidad' },
    { id: 'limpieza',   label: 'Limpieza' },
    { id: 'autonomia',  label: 'Autonomía' }
  ];

  const PLANES = [
    { id: 'piloto',  label: 'Piloto (1er mes)', cuota: 99,  solicitudes: 3,  desc: 'Prueba. Si no presentamos 3 perfiles válidos, no pagas el 2º mes.' },
    { id: 'basico',  label: 'Básico',           cuota: 99,  solicitudes: 3,  desc: 'Reformistas pequeños.' },
    { id: 'pro',     label: 'Pro',              cuota: 149, solicitudes: 6,  desc: 'Constructoras activas.' },
    { id: 'premium', label: 'Premium',          cuota: 299, solicitudes: 10, desc: 'Uso intensivo / urgencias.' }
  ];

  const ESTADOS_SUB = [
    { id: 'prueba',  label: 'En prueba',  color: '#f59e0b' },
    { id: 'activa',  label: 'Activa',     color: '#10b981' },
    { id: 'pausada', label: 'Pausada',    color: '#94a3b8' },
    { id: 'baja',    label: 'Baja',       color: '#ef4444' }
  ];

  const ESTADOS_SOL = [
    { id: 'nueva',      label: 'Nueva',        color: '#60a5fa' },
    { id: 'enProceso',  label: 'Buscando',     color: '#a78bfa' },
    { id: 'presentada', label: 'Perfiles enviados', color: '#f59e0b' },
    { id: 'cerrada',    label: 'Cerrada (match)',   color: '#10b981' },
    { id: 'cancelada',  label: 'Cancelada',    color: '#ef4444' }
  ];

  const DEFAULT_CONFIG = {
    empresa: {
      nombre: 'ObraMatch Asturias',
      claim: 'Oficios verificados para obra y reforma en Asturias en menos de 24-48h por WhatsApp.',
      telefono: '+34 600 000 000',
      email: 'hola@obramatch.es',
      web: 'obramatch.es'
    }
  };

  /* ============ Estado ============ */

  const state = {
    profesionales: [],
    constructoras: [],
    solicitudes: [],
    valoraciones: [],
    config: JSON.parse(JSON.stringify(DEFAULT_CONFIG))
  };

  /* ============ Persistencia ============ */

  function uid(prefix) {
    // Sin Date.now/Math.random garantizados: usamos contador + longitud.
    const n = (state.profesionales.length + state.constructoras.length +
               state.solicitudes.length + state.valoraciones.length);
    let seed = n.toString(36);
    // añade entropía basada en el contenido ya existente
    const stamp = (JSON.stringify(state).length).toString(36);
    return (prefix || 'id') + '_' + seed + stamp + '_' + Math.abs(hashStr(prefix + seed + stamp)).toString(36);
  }

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
    return h;
  }

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        profesionales: state.profesionales,
        constructoras: state.constructoras,
        solicitudes: state.solicitudes,
        valoraciones: state.valoraciones,
        config: state.config
      }));
    } catch (e) { console.warn('[store] no se pudo guardar', e); }
    emit();
  }

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        state.profesionales = data.profesionales || [];
        state.constructoras = data.constructoras || [];
        state.solicitudes = data.solicitudes || [];
        state.valoraciones = data.valoraciones || [];
        state.config = Object.assign(JSON.parse(JSON.stringify(DEFAULT_CONFIG)), data.config || {});
        return true;
      }
    } catch (e) { console.warn('[store] no se pudo cargar', e); }
    return false;
  }

  function reset() {
    state.profesionales = [];
    state.constructoras = [];
    state.solicitudes = [];
    state.valoraciones = [];
    state.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    save();
  }

  function emit() {
    document.dispatchEvent(new CustomEvent('store:changed'));
  }

  /* ============ CRUD Profesionales ============ */

  function addProfesional(data) {
    const p = Object.assign({
      id: uid('pro'),
      nombre: '', telefono: '', oficioPrincipal: 'albanil',
      oficiosSecundarios: [], zonas: [], radioKm: 30,
      tipo: 'autonomo', disponibilidad: 'inmediata', disponibleDesde: '',
      precioTipo: 'dia', precio: 0, experiencia: 0,
      docs: {}, referencias: [], fotos: 0,
      estado: 'pendiente', observaciones: '',
      creado: nowISO(), actualizado: nowISO()
    }, data);
    state.profesionales.unshift(p);
    save();
    return p.id;
  }

  function updateProfesional(id, patch) {
    const p = state.profesionales.find(x => x.id === id);
    if (!p) return;
    Object.assign(p, patch, { actualizado: nowISO() });
    save();
  }

  function removeProfesional(id) {
    state.profesionales = state.profesionales.filter(x => x.id !== id);
    state.valoraciones = state.valoraciones.filter(v => v.profesionalId !== id);
    save();
  }

  /* ============ CRUD Constructoras ============ */

  function addConstructora(data) {
    const plan = PLANES.find(p => p.id === (data.plan || 'piloto')) || PLANES[0];
    const c = Object.assign({
      id: uid('con'),
      nombre: '', contacto: '', telefono: '', email: '', zona: 'Oviedo',
      plan: plan.id, estado: 'prueba', cuotaMes: plan.cuota,
      altaFecha: hoy(), renovacionFecha: addDays(hoy(), 30),
      notas: '', creado: nowISO()
    }, data);
    state.constructoras.unshift(c);
    save();
    return c.id;
  }

  function updateConstructora(id, patch) {
    const c = state.constructoras.find(x => x.id === id);
    if (!c) return;
    Object.assign(c, patch);
    save();
  }

  function removeConstructora(id) {
    state.constructoras = state.constructoras.filter(x => x.id !== id);
    save();
  }

  /* ============ CRUD Solicitudes ============ */

  function addSolicitud(data) {
    const s = Object.assign({
      id: uid('sol'),
      constructoraId: '', oficio: 'albanil', cantidad: 1,
      zona: 'Oviedo', fechaInicio: hoy(), duracion: '',
      urgencia: 'normal', tipoContrato: 'subcontrata',
      estado: 'nueva', candidatos: [], elegido: '',
      notas: '', creado: nowISO(), actualizado: nowISO()
    }, data);
    state.solicitudes.unshift(s);
    save();
    return s.id;
  }

  function updateSolicitud(id, patch) {
    const s = state.solicitudes.find(x => x.id === id);
    if (!s) return;
    Object.assign(s, patch, { actualizado: nowISO() });
    save();
  }

  function removeSolicitud(id) {
    state.solicitudes = state.solicitudes.filter(x => x.id !== id);
    save();
  }

  /* ============ Valoraciones / scoring ============ */

  function addValoracion(data) {
    const v = Object.assign({
      id: uid('val'), solicitudId: '', profesionalId: '', constructoraId: '',
      calidad: 5, puntualidad: 5, limpieza: 5, autonomia: 5,
      comentario: '', fecha: hoy()
    }, data);
    state.valoraciones.unshift(v);
    save();
    return v.id;
  }

  // Rating agregado de un profesional (media de las 4 dimensiones).
  function rating(profesionalId) {
    const vs = state.valoraciones.filter(v => v.profesionalId === profesionalId);
    if (!vs.length) return { media: 0, n: 0, criterios: {} };
    const crit = {};
    CRITERIOS.forEach(c => {
      crit[c.id] = avg(vs.map(v => Number(v[c.id]) || 0));
    });
    const media = avg(CRITERIOS.map(c => crit[c.id]));
    return { media: round1(media), n: vs.length, criterios: crit };
  }

  /* ============ Verificación documental ============ */

  function docsRequeridos(prof) {
    return DOCS.filter(d => d.para.includes(prof.tipo));
  }

  // % de documentos aportados ('ok') sobre los requeridos por su tipo.
  function verificadoPct(prof) {
    const req = docsRequeridos(prof);
    if (!req.length) return 0;
    const ok = req.filter(d => (prof.docs || {})[d.id] === 'ok').length;
    return Math.round((ok / req.length) * 100);
  }

  function docsCompletos(prof) {
    return verificadoPct(prof) === 100;
  }

  /* ============ Motor de matching ============ */
  /* Dada una solicitud, puntúa a cada profesional y devuelve los mejores
   * candidatos con el desglose de por qué encajan. Cobramos por acceso a esta
   * bolsa viva: el valor está en que el match sea rápido y fiable. */

  function cubreOficio(prof, oficioId) {
    if (prof.oficioPrincipal === oficioId) return 'principal';
    if ((prof.oficiosSecundarios || []).includes(oficioId)) return 'secundario';
    return null;
  }

  function cubreZona(prof, zona) {
    const zonas = prof.zonas || [];
    if (zonas.includes('Toda Asturias')) return 'amplia';
    if (zonas.includes(zona)) return 'exacta';
    return null;
  }

  function matching(solicitud, opts) {
    opts = opts || {};
    const results = [];
    state.profesionales.forEach(prof => {
      if (prof.estado === 'noApto') return;
      const oficio = cubreOficio(prof, solicitud.oficio);
      if (!oficio) return; // debe cubrir el oficio pedido
      if (solicitud.urgencia === 'urgente' && prof.disponibilidad === 'ocupado') return;

      const razones = [];
      let score = 0;

      // Oficio
      if (oficio === 'principal') { score += 40; razones.push({ ok: true, txt: 'Oficio principal' }); }
      else { score += 20; razones.push({ ok: true, txt: 'Oficio secundario' }); }

      // Zona
      const zona = cubreZona(prof, solicitud.zona);
      if (zona === 'exacta') { score += 25; razones.push({ ok: true, txt: 'Zona exacta: ' + solicitud.zona }); }
      else if (zona === 'amplia') { score += 18; razones.push({ ok: true, txt: 'Cubre toda Asturias' }); }
      else { score += 4; razones.push({ ok: false, txt: 'Fuera de zona (' + (prof.zonas || []).join(', ') + ')' }); }

      // Disponibilidad
      const disp = DISPONIBILIDAD.find(d => d.id === prof.disponibilidad);
      score += disp ? disp.peso : 0;
      razones.push({ ok: prof.disponibilidad !== 'ocupado', txt: 'Disponibilidad: ' + (disp ? disp.label : '—') });

      // Verificación
      if (prof.estado === 'verificado') { score += 30; razones.push({ ok: true, txt: 'Perfil verificado' }); }
      else { score += 5; razones.push({ ok: false, txt: 'Pendiente de verificar' }); }

      // Documentación
      const pct = verificadoPct(prof);
      score += Math.round(pct / 10); // 0..10
      razones.push({ ok: pct === 100, txt: 'Documentación ' + pct + '%' });

      // Rating
      const r = rating(prof.id);
      if (r.n > 0) {
        score += Math.round(r.media * 5); // 0..25
        razones.push({ ok: r.media >= 4, txt: 'Rating ' + r.media + '★ (' + r.n + ')' });
      } else {
        razones.push({ ok: false, txt: 'Sin valoraciones aún' });
      }

      results.push({ prof, score, razones, rating: r, oficio, zona });
    });

    results.sort((a, b) => b.score - a.score);
    const limit = opts.limit || 3;
    return { top: results.slice(0, limit), all: results };
  }

  /* ============ KPIs (informe §12) ============ */

  function kpis() {
    const cons = state.constructoras;
    const profs = state.profesionales;
    const sols = state.solicitudes;
    return {
      constructorasContactadas: cons.length,
      constructorasPiloto: cons.filter(c => c.estado === 'prueba').length,
      constructorasPagando: cons.filter(c => c.estado === 'activa').length,
      profesionalesRegistrados: profs.length,
      profesionalesVerificados: profs.filter(p => p.estado === 'verificado').length,
      solicitudesRecibidas: sols.length,
      matchesRealizados: sols.filter(s => s.estado === 'cerrada').length,
      solicitudesAbiertas: sols.filter(s => s.estado === 'nueva' || s.estado === 'enProceso').length,
      valoraciones: state.valoraciones.length,
      mrr: cons.filter(c => c.estado === 'activa').reduce((a, c) => a + (Number(c.cuotaMes) || 0), 0),
      renovacionPct: (() => {
        const facturables = cons.filter(c => c.estado === 'activa' || c.estado === 'baja').length;
        return facturables ? Math.round(cons.filter(c => c.estado === 'activa').length / facturables * 100) : 0;
      })()
    };
  }

  /* ============ Helpers de lectura ============ */

  function profesionalesPendientes() {
    return state.profesionales.filter(p => p.estado === 'pendiente');
  }
  function disponibilidadCaducada() {
    // Perfiles cuya disponibilidad no se actualiza hace >7 días.
    const limite = addDays(hoy(), -7);
    return state.profesionales.filter(p => (p.actualizado || '').slice(0, 10) < limite && p.estado === 'verificado');
  }
  function solicitudesActivas() {
    return state.solicitudes.filter(s => s.estado === 'nueva' || s.estado === 'enProceso' || s.estado === 'presentada');
  }
  function constructoraById(id) { return state.constructoras.find(c => c.id === id) || null; }
  function profesionalById(id) { return state.profesionales.find(p => p.id === id) || null; }
  function solicitudById(id) { return state.solicitudes.find(s => s.id === id) || null; }

  /* ============ Utilidades de fecha (sin Date.now en runtime crítico) ============ */

  function nowISO() { return new Date().toISOString(); }
  function hoy() { return new Date().toISOString().slice(0, 10); }
  function addDays(iso, d) {
    const dt = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''));
    dt.setDate(dt.getDate() + d);
    return dt.toISOString().slice(0, 10);
  }
  function avg(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
  function round1(n) { return Math.round(n * 10) / 10; }

  /* ============ Export público ============ */

  window.Store = {
    // constantes
    OFICIOS, ZONAS, TIPOS, DISPONIBILIDAD, ESTADOS_PROF, DOCS, CRITERIOS,
    PLANES, ESTADOS_SUB, ESTADOS_SOL,
    // estado
    state,
    // persistencia
    load, save, reset,
    // crud
    addProfesional, updateProfesional, removeProfesional,
    addConstructora, updateConstructora, removeConstructora,
    addSolicitud, updateSolicitud, removeSolicitud,
    addValoracion,
    // lógica
    rating, docsRequeridos, verificadoPct, docsCompletos, matching, kpis,
    cubreOficio, cubreZona,
    // lecturas
    profesionalesPendientes, disponibilidadCaducada, solicitudesActivas,
    constructoraById, profesionalById, solicitudById,
    // helpers
    hoy, addDays, uid
  };
})();
