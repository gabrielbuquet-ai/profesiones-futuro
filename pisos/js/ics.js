/* Generador de archivos .ics (iCalendar) para fechas clave del rent roll. */
(function () {
  'use strict';

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function toIcsDate(d) {
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) +
      'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
  }
  function toIcsAllDay(d) {
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  }
  function escapeIcs(s) {
    return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }

  function buildEvents(state) {
    const ahora = new Date();
    const events = [];
    const pisos = state.cache.pisos;
    const edificios = state.cache.edificios;
    const inquilinos = state.cache.inquilinos;

    function pisoLabel(pisoId) {
      const p = pisos.find(x => x.id === pisoId); if (!p) return 'piso';
      const e = edificios.find(x => x.id === p.edificioId);
      return (e ? e.nombre + ' · ' : '') + (p.identificador || p.puerta || '');
    }
    function inquilinoLabel(id) {
      const i = inquilinos.find(x => x.id === id);
      return i ? i.nombre : '';
    }

    state.cache.contratos.forEach(c => {
      if (c.estado !== 'activo' && c.estado !== 'renovado') return;
      const fin = c.fechaFin ? new Date(c.fechaFin) : null;
      if (fin && !isNaN(fin.getTime())) {
        const aviso = new Date(fin); aviso.setDate(aviso.getDate() - (state.config.avisoVencDias || 90));
        events.push({
          uid: 'fin-' + c.id + '@pisos.aguado',
          start: fin,
          summary: 'Vence contrato — ' + pisoLabel(c.pisoId),
          description: 'Inquilino: ' + inquilinoLabel(c.inquilinoId) + '\\nRenta: ' + (c.rentaMensual || 0) + ' €',
          alarmDays: (state.config.avisoVencDias || 90)
        });
      }
      const prox = window.Alerts.proximaRevisionIpc(c, ahora);
      if (prox) {
        events.push({
          uid: 'ipc-' + c.id + '-' + prox.getFullYear() + '@pisos.aguado',
          start: prox,
          summary: 'Revisión IPC — ' + pisoLabel(c.pisoId),
          description: 'Aplicar IPC o subida pactada al contrato de ' + inquilinoLabel(c.inquilinoId),
          alarmDays: (state.config.avisoIpcDias || 30)
        });
      }
    });

    return events;
  }

  function toIcsString(events) {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Pisos Aguado//Rent Roll//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];
    const dtstamp = toIcsDate(new Date());
    events.forEach(ev => {
      lines.push('BEGIN:VEVENT');
      lines.push('UID:' + ev.uid);
      lines.push('DTSTAMP:' + dtstamp);
      lines.push('DTSTART;VALUE=DATE:' + toIcsAllDay(ev.start));
      const dtEnd = new Date(ev.start); dtEnd.setDate(dtEnd.getDate() + 1);
      lines.push('DTEND;VALUE=DATE:' + toIcsAllDay(dtEnd));
      lines.push('SUMMARY:' + escapeIcs(ev.summary));
      lines.push('DESCRIPTION:' + escapeIcs(ev.description));
      if (ev.alarmDays) {
        lines.push('BEGIN:VALARM');
        lines.push('TRIGGER:-P' + ev.alarmDays + 'D');
        lines.push('ACTION:DISPLAY');
        lines.push('DESCRIPTION:' + escapeIcs(ev.summary));
        lines.push('END:VALARM');
      }
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function download(state) {
    const events = buildEvents(state);
    if (!events.length) {
      alert('No hay fechas clave para exportar todavía.');
      return;
    }
    const ics = toIcsString(events);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pisos-aguado-' + new Date().toISOString().slice(0, 10) + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.Ics = { buildEvents, toIcsString, download };
})();
