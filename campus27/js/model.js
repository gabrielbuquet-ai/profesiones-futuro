/* ===== Campus 27 · modelo de negocio interactivo (piloto 120 plazas Madrid) ===== */
(function () {
  'use strict';

  // ---- Supuestos por defecto (del business case) ----
  var A = {
    camas: 120,
    ocupacion: 90,      // %
    renta: 900,         // €/mes por cama
    alumnos: 100,
    feeAlumno: 6000,    // €/año
    proyectos: 25,
    precioProyecto: 20000, // € medio
    recruiting: 120000,  // € recruiting + sponsorship
    eventos: 100000,     // € eventos / executive education
    // costes anuales (fijos del caso base)
    masterLease: 700000
  };

  // Costes fijos del OpCo (no ligados a sliders, salvo master lease)
  var COSTES = [
    { k: 'Equipo académico/práctico', v: 450000 },
    { k: 'Mentores externos', v: 180000 },
    { k: 'Operación residencia/comunidad', v: 300000 },
    { k: 'Marketing/admisiones', v: 180000 },
    { k: 'Plataforma IA/software', v: 90000 },
    { k: 'Eventos/comunidad', v: 100000 },
    { k: 'Administración/general', v: 150000 }
  ];

  function eur(n) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.round(n));
  }
  function eurK(n) {
    if (Math.abs(n) >= 1e6) return (n / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' M€';
    return Math.round(n / 1000).toLocaleString('es-ES') + ' K€';
  }

  function compute() {
    var alojamiento = A.camas * (A.ocupacion / 100) * A.renta * 12;
    var programa = A.alumnos * A.feeAlumno;
    var proyectos = A.proyectos * A.precioProyecto;
    var recruiting = A.recruiting;
    var eventos = A.eventos;

    var revLayers = [
      { k: 'Alojamiento', v: alojamiento, c: '#4f46e5', d: A.camas + ' camas · ' + A.ocupacion + '% ocup. · ' + eur(A.renta) + '/mes' },
      { k: 'Programa práctico', v: programa, c: '#10b981', d: A.alumnos + ' alumnos · ' + eur(A.feeAlumno) + '/año' },
      { k: 'Proyectos empresa', v: proyectos, c: '#f59e0b', d: A.proyectos + ' proyectos · ' + eur(A.precioProyecto) + ' medio' },
      { k: 'Recruiting/sponsorship', v: recruiting, c: '#0ea5e9', d: 'Colocaciones + sponsors de cohorte' },
      { k: 'Eventos/executive education', v: eventos, c: '#8b5cf6', d: 'Uso de aulas y comunidad' }
    ];
    var totalRev = revLayers.reduce(function (s, l) { return s + l.v; }, 0);

    var costes = COSTES.concat([{ k: 'Master lease / renta al PropCo', v: A.masterLease }]);
    var totalCost = costes.reduce(function (s, c) { return s + c.v; }, 0);

    var ebitda = totalRev - totalCost;
    var margin = totalRev > 0 ? (ebitda / totalRev) * 100 : 0;
    var noAloj = totalRev > 0 ? ((totalRev - alojamiento) / totalRev) * 100 : 0;

    return { revLayers: revLayers, totalRev: totalRev, costes: costes, totalCost: totalCost, ebitda: ebitda, margin: margin, noAloj: noAloj, alojamiento: alojamiento };
  }

  function render() {
    var m = compute();

    // KPIs
    var kpis = document.getElementById('pnlKpis');
    if (kpis) {
      kpis.innerHTML = [
        kpi('Ingresos anuales', eurK(m.totalRev), 'estabilizados'),
        kpi('Costes operativos', eurK(m.totalCost), 'incl. master lease'),
        kpi('EBITDA OpCo', eurK(m.ebitda), m.margin.toFixed(0) + '% margen', m.ebitda >= 0),
        kpi('Ingresos no alojamiento', m.noAloj.toFixed(0) + '%', 'diversificación')
      ].join('');
    }

    // Tabla P&L
    var body = document.getElementById('pnlBody');
    if (body) {
      var maxRev = Math.max.apply(null, m.revLayers.map(function (l) { return l.v; }));
      var maxCost = Math.max.apply(null, m.costes.map(function (c) { return c.v; }));
      var rows = [];
      rows.push('<tr class="subhead"><td colspan="3">Ingresos</td></tr>');
      m.revLayers.forEach(function (l) {
        rows.push('<tr><td>' + l.k + '<div class="muted small" style="font-size:12px;color:var(--text-soft)">' + l.d + '</div></td>' +
          '<td class="num bar-cell">' + eur(l.v) +
          '<span class="barfill" style="width:' + (l.v / maxRev * 120) + 'px;background:' + l.c + '"></span></td>' +
          '<td class="num">' + (l.v / m.totalRev * 100).toFixed(0) + '%</td></tr>');
      });
      rows.push('<tr class="total rev"><td>Total ingresos</td><td class="num">' + eur(m.totalRev) + '</td><td class="num">100%</td></tr>');
      rows.push('<tr class="subhead"><td colspan="3">Costes</td></tr>');
      m.costes.forEach(function (c) {
        rows.push('<tr><td>' + c.k + '</td><td class="num bar-cell">' + eur(c.v) +
          '<span class="barfill" style="width:' + (c.v / maxCost * 120) + 'px;background:#94a3b8"></span></td>' +
          '<td class="num">' + (c.v / m.totalCost * 100).toFixed(0) + '%</td></tr>');
      });
      rows.push('<tr class="total"><td>Total costes</td><td class="num">' + eur(m.totalCost) + '</td><td class="num">100%</td></tr>');
      body.innerHTML = rows.join('');
    }

    // Caja EBITDA
    var eb = document.getElementById('ebitdaBox');
    if (eb) {
      eb.innerHTML = '<div><div class="eb-lbl">EBITDA OpCo estimado</div>' +
        '<div class="muted small" style="color:var(--text-soft)">Margen ' + m.margin.toFixed(1) + '% · ingresos no-alojamiento ' + m.noAloj.toFixed(0) + '%</div></div>' +
        '<div class="eb-val' + (m.ebitda < 0 ? ' neg' : '') + '">' + eur(m.ebitda) + '</div>';
    }
  }

  function kpi(label, value, sub, pos) {
    return '<div class="kpi"><div class="kpi-label">' + label + '</div>' +
      '<div class="kpi-value' + (pos ? ' pos' : '') + '">' + value + '</div>' +
      '<div class="kpi-sub">' + sub + '</div></div>';
  }

  // ---- Sliders ----
  var SLIDERS = [
    { id: 'camas', label: 'Camas', min: 60, max: 200, step: 10, fmt: function (v) { return v; } },
    { id: 'ocupacion', label: 'Ocupación', min: 60, max: 100, step: 1, fmt: function (v) { return v + '%'; } },
    { id: 'renta', label: 'Renta', min: 700, max: 1300, step: 25, fmt: function (v) { return eur(v) + '/mes'; } },
    { id: 'alumnos', label: 'Alumnos de pago', min: 40, max: 160, step: 5, fmt: function (v) { return v; } },
    { id: 'feeAlumno', label: 'Fee programa', min: 3000, max: 12000, step: 500, fmt: function (v) { return eur(v) + '/año'; } },
    { id: 'proyectos', label: 'Proyectos/año', min: 5, max: 80, step: 5, fmt: function (v) { return v; } },
    { id: 'precioProyecto', label: 'Precio medio proyecto', min: 10000, max: 75000, step: 2500, fmt: function (v) { return eur(v); } },
    { id: 'masterLease', label: 'Master lease al PropCo', min: 400000, max: 1100000, step: 25000, fmt: function (v) { return eur(v) + '/año'; } }
  ];

  function buildSliders() {
    var wrap = document.getElementById('assumptions');
    if (!wrap) return;
    wrap.innerHTML = SLIDERS.map(function (s) {
      return '<div><label>' + s.label + ' · <span class="rangeval" id="rv_' + s.id + '">' + s.fmt(A[s.id]) + '</span></label>' +
        '<input type="range" id="sl_' + s.id + '" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + A[s.id] + '">' +
        '</div>';
    }).join('');
    SLIDERS.forEach(function (s) {
      var el = document.getElementById('sl_' + s.id);
      el.addEventListener('input', function () {
        A[s.id] = +el.value;
        document.getElementById('rv_' + s.id).textContent = s.fmt(A[s.id]);
        render();
      });
    });
    var reset = document.getElementById('resetBtn');
    if (reset) reset.addEventListener('click', function () {
      A.camas = 120; A.ocupacion = 90; A.renta = 900; A.alumnos = 100; A.feeAlumno = 6000;
      A.proyectos = 25; A.precioProyecto = 20000; A.masterLease = 700000;
      SLIDERS.forEach(function (s) {
        document.getElementById('sl_' + s.id).value = A[s.id];
        document.getElementById('rv_' + s.id).textContent = s.fmt(A[s.id]);
      });
      render();
    });
  }

  // ---- Navegación de vistas ----
  function initNav() {
    var btns = document.querySelectorAll('.nav-btn');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        document.querySelectorAll('.pview').forEach(function (v) { v.classList.remove('active'); });
        var t = document.getElementById('view-' + b.dataset.view);
        if (t) t.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildSliders();
    render();
    initNav();
  });
})();
