// Store: estado en memoria persistido en localStorage.
// Modelo pensado para captación Google Ads -> pipeline -> caso de Ley de Segunda Oportunidad.

const LS_KEY = 'crm_annie_v1';

const ETAPAS = [
  { id: 'nuevo',        label: 'Lead nuevo',         prob: 10, color: '#94a3b8' },
  { id: 'contactado',   label: 'Contactado',         prob: 25, color: '#60a5fa' },
  { id: 'cita',         label: 'Cita agendada',      prob: 40, color: '#a78bfa' },
  { id: 'presupuesto',  label: 'Presupuesto enviado', prob: 60, color: '#f59e0b' },
  { id: 'negociacion',  label: 'Negociación',        prob: 75, color: '#fb923c' },
  { id: 'ganado',       label: 'Ganado',             prob: 100, color: '#10b981' },
  { id: 'perdido',      label: 'Perdido',            prob: 0,   color: '#ef4444' }
];

// Fases del proceso de Ley de Segunda Oportunidad (tras reforma TR-LC 2022).
// Optimizadas para flujo rápido con exoneración inmediata cuando procede.
const FASES_LSO = [
  { id: 'recopilacion', label: '1. Recopilación documental',   dias: 7,
    checklist: [
      'DNI cliente y cónyuge si procede',
      'Vida laboral actualizada',
      'Últimas 3 nóminas o certificado del SEPE',
      'Certificado de empadronamiento',
      'Libro de familia',
      'Listado completo de acreedores con CIF e importes',
      'Contratos de préstamo y tarjetas',
      'Últimas 12 nóminas / extractos bancarios',
      'Declaración IRPF últimos 2 años',
      'Escrituras de propiedades / certificados de bienes',
      'Sentencias o reclamaciones judiciales en curso'
    ]},
  { id: 'analisis',     label: '2. Análisis de viabilidad',     dias: 3,
    checklist: [
      'Calcular masa activa (bienes y derechos)',
      'Cuantificar deuda total y por acreedor',
      'Verificar buena fe (sin condena por delitos económicos en 10 años)',
      'Comprobar que no se ha exonerado en 5 años previos',
      'Decidir vía: exoneración inmediata vs plan de pagos',
      'Firmar hoja de encargo y cobrar provisión'
    ]},
  { id: 'solicitud',    label: '3. Solicitud al juzgado',       dias: 5,
    checklist: [
      'Redactar solicitud de concurso de persona física',
      'Solicitar exoneración del pasivo insatisfecho (EPI)',
      'Inventario de bienes y deudas (art. 489 TRLC)',
      'Memoria económica',
      'Presentar por LexNET en juzgado de lo Mercantil',
      'Pagar tasas si proceden'
    ]},
  { id: 'admision',     label: '4. Admisión a trámite',         dias: 30,
    checklist: [
      'Recibir auto de admisión',
      'Notificar a acreedores',
      'Publicar en BOE',
      'Designación de Administrador Concursal si procede'
    ]},
  { id: 'liquidacion',  label: '5. Liquidación / Plan de pagos', dias: 90,
    checklist: [
      'Liquidar bienes embargables (si los hay)',
      'O presentar plan de pagos a 3-5 años',
      'Audiencia con el juez',
      'Resolución sobre la propuesta'
    ]},
  { id: 'exoneracion',  label: '6. Exoneración',                dias: 30,
    checklist: [
      'Auto de exoneración del pasivo insatisfecho',
      'Comunicar a acreedores y registros',
      'Solicitar cancelación en ASNEF, RAI, CIRBE',
      'Entregar resolución firmada al cliente',
      'Cierre de expediente y archivado'
    ]}
];

const ORIGENES = [
  { id: 'google_ads',    label: 'Google Ads' },
  { id: 'meta_ads',      label: 'Meta Ads' },
  { id: 'organico',      label: 'Web orgánica' },
  { id: 'recomendacion', label: 'Recomendación' },
  { id: 'colega',        label: 'Compañero / colega' },
  { id: 'otro',          label: 'Otro' }
];

const TIPOS_CASO = [
  { id: 'lso_inmediata', label: 'LSO · Exoneración inmediata',  honorarios: 2500 },
  { id: 'lso_plan',      label: 'LSO · Plan de pagos',          honorarios: 2500 },
  { id: 'lso_empresa',   label: 'LSO · Autónomo / empresarial', honorarios: 3500 }
];

const USUARIOS = [
  { id: 'annie', nombre: 'Annie Buquet',  rol: 'Letrada' },
  { id: 'elena', nombre: 'Elena',         rol: 'Becaria' }
];

const SLA_MINUTOS = 5; // Regla Harvard: contactar en < 5 min multiplica x21 la tasa de cierre.

const DEFAULT_STATE = {
  leads: [],
  casos: [],
  inversion: [],     // [{mes:'2026-05', google:200, meta:0}]
  ajustes: {
    honorariosBase: 2500,
    despacho: {
      nombre: 'Buquet Abogados',
      letrada: 'Annie Buquet',
      colegio: 'ICAVA',
      colegiado: '0000',
      direccion: 'Valladolid',
      telefono: '+34 000 000 000',
      email: 'contacto@buquetabogados.es',
      iban: 'ES00 0000 0000 0000 0000 0000'
    }
  }
};

const Store = {
  state: null,

  load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      this.state = raw ? JSON.parse(raw) : structuredClone(DEFAULT_STATE);
    } catch {
      this.state = structuredClone(DEFAULT_STATE);
    }
    if (!this.state.ajustes) this.state.ajustes = DEFAULT_STATE.ajustes;
    if (!this.state.inversion) this.state.inversion = [];
    return this.state;
  },

  save() {
    localStorage.setItem(LS_KEY, JSON.stringify(this.state));
    document.dispatchEvent(new CustomEvent('store:changed'));
  },

  reset() {
    this.state = structuredClone(DEFAULT_STATE);
    this.save();
  },

  // ---------- Leads ----------
  addLead(data) {
    const lead = {
      id: 'L' + Date.now().toString(36),
      nombre: data.nombre || '',
      telefono: data.telefono || '',
      email: data.email || '',
      deudaTotal: Number(data.deudaTotal) || 0,
      numAcreedores: Number(data.numAcreedores) || 0,
      ingresosMensuales: Number(data.ingresosMensuales) || 0,
      situacion: data.situacion || '',
      origen: data.origen || 'google_ads',
      palabraClave: data.palabraClave || '',
      campania: data.campania || '',
      costeClick: Number(data.costeClick) || 0,
      asignado: data.asignado || 'annie',
      etapa: 'nuevo',
      tipoCaso: data.tipoCaso || 'lso_inmediata',
      honorarios: Number(data.honorarios) || 2500,
      fechaEntrada: data.fechaEntrada || new Date().toISOString(),
      fechaPrimerContacto: null,
      fechaCita: null,
      motivoPerdido: '',
      notas: [],
      pagos: [],
      casoId: null
    };
    this.state.leads.unshift(lead);
    this.save();
    return lead;
  },

  updateLead(id, patch) {
    const lead = this.state.leads.find(l => l.id === id);
    if (!lead) return null;
    Object.assign(lead, patch);
    this.save();
    return lead;
  },

  moverEtapa(id, nuevaEtapa, extra = {}) {
    const lead = this.state.leads.find(l => l.id === id);
    if (!lead) return;
    lead.etapa = nuevaEtapa;
    if (nuevaEtapa === 'contactado' && !lead.fechaPrimerContacto) {
      lead.fechaPrimerContacto = new Date().toISOString();
    }
    if (nuevaEtapa === 'ganado' && !lead.casoId) {
      const caso = this.abrirCaso(lead);
      lead.casoId = caso.id;
    }
    Object.assign(lead, extra);
    this.save();
  },

  marcarContactado(id) {
    this.moverEtapa(id, 'contactado');
  },

  addNota(leadId, texto, autor = 'annie') {
    const lead = this.state.leads.find(l => l.id === leadId);
    if (!lead) return;
    lead.notas.unshift({ fecha: new Date().toISOString(), texto, autor });
    this.save();
  },

  addPago(leadId, importe, concepto) {
    const lead = this.state.leads.find(l => l.id === leadId);
    if (!lead) return;
    lead.pagos.push({ fecha: new Date().toISOString(), importe: Number(importe), concepto });
    this.save();
  },

  // ---------- Casos ----------
  abrirCaso(lead) {
    const caso = {
      id: 'C' + Date.now().toString(36),
      leadId: lead.id,
      cliente: lead.nombre,
      expediente: this._generarExpediente(),
      tipoCaso: lead.tipoCaso,
      fechaApertura: new Date().toISOString(),
      fechaCierre: null,
      faseActual: 'recopilacion',
      juzgado: '',
      numAutos: '',
      fasesEstado: FASES_LSO.reduce((acc, f) => {
        acc[f.id] = {
          completados: [],
          fechaInicio: f.id === 'recopilacion' ? new Date().toISOString() : null,
          fechaFin: null
        };
        return acc;
      }, {}),
      tareas: [
        { id: 't1', texto: 'Recopilar documentación con cliente', asignado: 'elena', hecho: false },
        { id: 't2', texto: 'Calcular masa activa y deuda total',   asignado: 'elena', hecho: false },
        { id: 't3', texto: 'Validar viabilidad y firmar encargo',  asignado: 'annie', hecho: false }
      ],
      hitos: [{ fecha: new Date().toISOString(), descripcion: 'Apertura del expediente' }],
      documentos: []
    };
    this.state.casos.push(caso);
    return caso;
  },

  _generarExpediente() {
    const año = new Date().getFullYear();
    const num = (this.state.casos.length + 1).toString().padStart(4, '0');
    return `LSO-${año}-${num}`;
  },

  updateCaso(id, patch) {
    const c = this.state.casos.find(x => x.id === id);
    if (!c) return null;
    Object.assign(c, patch);
    this.save();
    return c;
  },

  toggleChecklistFase(casoId, faseId, item) {
    const caso = this.state.casos.find(c => c.id === casoId);
    if (!caso) return;
    const fase = caso.fasesEstado[faseId];
    if (!fase) return;
    const idx = fase.completados.indexOf(item);
    if (idx >= 0) fase.completados.splice(idx, 1);
    else fase.completados.push(item);
    this.save();
  },

  avanzarFase(casoId) {
    const caso = this.state.casos.find(c => c.id === casoId);
    if (!caso) return;
    const idx = FASES_LSO.findIndex(f => f.id === caso.faseActual);
    if (idx < 0 || idx >= FASES_LSO.length - 1) return;
    caso.fasesEstado[caso.faseActual].fechaFin = new Date().toISOString();
    const next = FASES_LSO[idx + 1];
    caso.faseActual = next.id;
    caso.fasesEstado[next.id].fechaInicio = new Date().toISOString();
    caso.hitos.unshift({
      fecha: new Date().toISOString(),
      descripcion: `Avance a fase: ${next.label}`
    });
    this.save();
  },

  cerrarCaso(casoId) {
    const caso = this.state.casos.find(c => c.id === casoId);
    if (!caso) return;
    caso.fechaCierre = new Date().toISOString();
    caso.hitos.unshift({ fecha: caso.fechaCierre, descripcion: 'Caso archivado' });
    this.save();
  },

  addTarea(casoId, texto, asignado = 'elena') {
    const caso = this.state.casos.find(c => c.id === casoId);
    if (!caso) return;
    caso.tareas.push({
      id: 't' + Date.now().toString(36),
      texto, asignado, hecho: false
    });
    this.save();
  },

  toggleTarea(casoId, tareaId) {
    const caso = this.state.casos.find(c => c.id === casoId);
    if (!caso) return;
    const t = caso.tareas.find(x => x.id === tareaId);
    if (!t) return;
    t.hecho = !t.hecho;
    this.save();
  },

  // ---------- Inversión publicitaria ----------
  setInversion(mes, canal, importe) {
    let row = this.state.inversion.find(r => r.mes === mes);
    if (!row) {
      row = { mes, google: 0, meta: 0 };
      this.state.inversion.push(row);
    }
    row[canal] = Number(importe) || 0;
    this.save();
  },

  // ---------- Selectores derivados ----------
  leadsPorEtapa(etapa) {
    return this.state.leads.filter(l => l.etapa === etapa);
  },

  leadsSLAVencido() {
    const ahora = Date.now();
    return this.state.leads.filter(l => {
      if (l.etapa !== 'nuevo') return false;
      const entrada = new Date(l.fechaEntrada).getTime();
      return (ahora - entrada) / 60000 > SLA_MINUTOS;
    });
  },

  ingresosMes(mes) {
    return this.state.leads
      .filter(l => l.etapa === 'ganado')
      .filter(l => (l.fechaPrimerContacto || l.fechaEntrada).startsWith(mes))
      .reduce((s, l) => s + (l.honorarios || 0), 0);
  },

  inversionMes(mes) {
    const r = this.state.inversion.find(x => x.mes === mes);
    if (!r) return { google: 0, meta: 0, total: 0 };
    return { google: r.google, meta: r.meta, total: (r.google || 0) + (r.meta || 0) };
  }
};

window.Store = Store;
window.ETAPAS = ETAPAS;
window.FASES_LSO = FASES_LSO;
window.ORIGENES = ORIGENES;
window.TIPOS_CASO = TIPOS_CASO;
window.USUARIOS = USUARIOS;
window.SLA_MINUTOS = SLA_MINUTOS;
