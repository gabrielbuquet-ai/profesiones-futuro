/* Generador de alertas a partir del estado del store. */
(function () {
  'use strict';

  const DAY = 24 * 60 * 60 * 1000;
  const SEV = { HIGH: 'high', MED: 'med', LOW: 'low' };

  function parseDate(s) {
    if (!s) return null;
    if (s instanceof Date) return s;
    if (typeof s === 'object' && typeof s.seconds === 'number') return new Date(s.seconds * 1000);
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  function diffDays(a, b) {
    return Math.round((a.getTime() - b.getTime()) / DAY);
  }

  function fmtDate(d) {
    if (!d) return '—';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  /* Calcula la próxima revisión IPC anual desde la fecha de inicio o última revisión. */
  function proximaRevisionIpc(contrato, ahora) {
    const inicio = parseDate(contrato.fechaInicio || contrato.fechaFirma);
    if (!inicio) return null;
    const ultima = parseDate(contrato.ultimaRevisionIpc) || inicio;
    const next = new Date(ultima);
    while (next.getTime() <= ahora.getTime()) {
      next.setFullYear(next.getFullYear() + 1);
    }
    return next;
  }

  function build(state) {
    const cfg = state.config;
    const ahora = new Date();
    const out = [];

    const contratos = state.cache.contratos.filter(c => c.estado === 'activo' || c.estado === 'renovado');
    const pisos = state.cache.pisos;
    const inquilinos = state.cache.inquilinos;
    const edificios = state.cache.edificios;
    const incidencias = state.cache.incidencias;
    const gastos = state.cache.gastos;

    function pisoLabel(pisoId) {
      const p = pisos.find(x => x.id === pisoId);
      if (!p) return '(piso desconocido)';
      const e = edificios.find(x => x.id === p.edificioId);
      return (e ? e.nombre + ' · ' : '') + (p.identificador || p.puerta || '—');
    }
    function inquilinoLabel(id) {
      const i = inquilinos.find(x => x.id === id);
      return i ? i.nombre : '—';
    }

    /* === Alertas por contrato === */
    contratos.forEach(c => {
      const fin = parseDate(c.fechaFin);
      if (fin) {
        const dias = diffDays(fin, ahora);
        if (dias <= 0) {
          out.push({
            sev: SEV.HIGH,
            icon: '⚠️',
            tipo: 'vencido',
            contratoId: c.id,
            pisoId: c.pisoId,
            inquilinoId: c.inquilinoId,
            fecha: fin,
            titulo: 'Contrato vencido — ' + pisoLabel(c.pisoId),
            meta: 'Inquilino: ' + inquilinoLabel(c.inquilinoId) + ' · finalizó el ' + fmtDate(fin),
            cta: 'Renovar o buscar nuevo inquilino',
            order: dias
          });
        } else if (dias <= (cfg.avisoVencDias || 90)) {
          const sev = dias <= 30 ? SEV.HIGH : (dias <= 60 ? SEV.MED : SEV.LOW);
          out.push({
            sev,
            icon: '📅',
            tipo: 'fin_proximo',
            contratoId: c.id,
            pisoId: c.pisoId,
            inquilinoId: c.inquilinoId,
            fecha: fin,
            titulo: 'Vencimiento en ' + dias + ' días — ' + pisoLabel(c.pisoId),
            meta: 'Inquilino: ' + inquilinoLabel(c.inquilinoId) + ' · fin ' + fmtDate(fin),
            cta: dias <= 60 ? 'Decidir renovación / buscar inquilino' : 'Planificar renovación',
            order: dias
          });
        }
      }

      const proxIpc = proximaRevisionIpc(c, ahora);
      if (proxIpc) {
        const dias = diffDays(proxIpc, ahora);
        if (dias <= (cfg.avisoIpcDias || 30)) {
          const sev = dias <= 0 ? SEV.HIGH : (dias <= 15 ? SEV.MED : SEV.LOW);
          out.push({
            sev,
            icon: '📈',
            tipo: 'ipc',
            contratoId: c.id,
            pisoId: c.pisoId,
            inquilinoId: c.inquilinoId,
            fecha: proxIpc,
            titulo: (dias <= 0 ? 'Revisión IPC pendiente' : 'Revisión IPC en ' + dias + ' días') + ' — ' + pisoLabel(c.pisoId),
            meta: 'Inquilino: ' + inquilinoLabel(c.inquilinoId) + ' · próxima revisión ' + fmtDate(proxIpc),
            cta: 'Aplicar IPC o subida pactada',
            order: dias
          });
        }
      }
    });

    /* === Incidencias antiguas === */
    incidencias.forEach(inc => {
      if (inc.estado === 'resuelta') return;
      const f = parseDate(inc.fecha);
      if (!f) return;
      const dias = diffDays(ahora, f);
      if (dias >= 14) {
        const sev = dias >= 30 ? SEV.HIGH : SEV.MED;
        out.push({
          sev,
          icon: '🔧',
          tipo: 'incidencia',
          incidenciaId: inc.id,
          pisoId: inc.pisoId,
          fecha: f,
          titulo: 'Incidencia abierta hace ' + dias + ' días — ' + (inc.titulo || pisoLabel(inc.pisoId)),
          meta: (inc.descripcion || '').slice(0, 90),
          cta: 'Cerrar o asignar técnico',
          order: -dias
        });
      }
    });

    /* === Gastos sin cobrar === */
    gastos.forEach(g => {
      if (g.cobrado) return;
      const f = parseDate(g.fecha);
      const diasAbierto = f ? diffDays(ahora, f) : 0;
      if (diasAbierto >= 30 || (g.importe || 0) >= 200) {
        const sev = diasAbierto >= 60 ? SEV.HIGH : SEV.MED;
        out.push({
          sev,
          icon: '💸',
          tipo: 'cobro',
          gastoId: g.id,
          fecha: f || ahora,
          titulo: 'Cobro pendiente: ' + (g.concepto || 'gasto') + ' (' + (g.importe || 0).toFixed(2) + ' €)',
          meta: 'Facturar a ' + (g.facturarA || 'propietario') + ' · ' + (f ? fmtDate(f) : ''),
          cta: 'Marcar como cobrado al recibir',
          order: -(diasAbierto || 0)
        });
      }
    });

    out.sort((a, b) => {
      const sevOrder = { high: 0, med: 1, low: 2 };
      if (sevOrder[a.sev] !== sevOrder[b.sev]) return sevOrder[a.sev] - sevOrder[b.sev];
      return (a.order || 0) - (b.order || 0);
    });

    return out;
  }

  window.Alerts = { build, parseDate, fmtDate, proximaRevisionIpc, diffDays };
})();
