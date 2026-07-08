/* Plantillas de mensajes WhatsApp listas para copiar/pegar.
 * El canal del negocio es WhatsApp (informe §9): capta profesionales, pregunta
 * disponibilidad semanal, presenta candidatos a la constructora y pide valoración.
 */
(function () {
  'use strict';

  function nombreCorto(n) { return (n || '').trim().split(/\s+/)[0] || ''; }
  function oficioLabel(id) {
    const o = (window.Store.OFICIOS || []).find(x => x.id === id);
    return o ? o.label.toLowerCase() : id;
  }

  const Templates = {
    // ---------- Captación de profesionales (informe §5) ----------
    captacionProfesional(cfg) {
      const e = cfg.empresa;
      return `Estamos creando una bolsa GRATUITA de trabajo para oficios de construcción en Asturias 🏗️\n\n` +
        `Si eres albañil, electricista, fontanero, pladurista, pintor o autónomo de reformas, te registras por WhatsApp en 3 minutos y te avisamos cuando haya obras disponibles.\n\n` +
        `Para ti siempre gratis. ¿Te apunto? — ${e.nombre}`;
    },

    // ---------- Alta: preguntas del bot (informe §9) ----------
    altaProfesional() {
      return `¡Bienvenido a la bolsa! Para darte de alta necesito 6 datos rápidos 👇\n\n` +
        `1️⃣ Tu oficio principal (¿otros oficios?)\n` +
        `2️⃣ Zona y radio de trabajo (km)\n` +
        `3️⃣ Años de experiencia\n` +
        `4️⃣ ¿Autónomo, empresa o buscas empleo?\n` +
        `5️⃣ Disponibilidad (ya / en 1 semana / ocupado)\n` +
        `6️⃣ Precio orientativo (€/día o €/hora)\n\n` +
        `Y una foto de: DNI, alta de autónomo, seguro RC, PRL y TPC si tienes. Lo revisamos y te activamos.`;
    },

    // ---------- Disponibilidad semanal (cada lunes) ----------
    disponibilidadSemanal(prof) {
      return `Hola ${nombreCorto(prof.nombre)} 👋 ¿Estás disponible esta semana?\n\n` +
        `Responde: *libre* / *ocupado* / *desde qué día*.\n` +
        `Así solo te paso obras que te encajen.`;
    },

    // ---------- Recordar aportar documentación pendiente ----------
    pedirDocs(prof) {
      const faltan = window.Store.docsRequeridos(prof)
        .filter(d => (prof.docs || {})[d.id] !== 'ok')
        .map(d => '• ' + d.label).join('\n');
      return `Hola ${nombreCorto(prof.nombre)}, para activar tu perfil en la bolsa me falta:\n\n` +
        (faltan || '• (todo aportado)') +
        `\n\nPásame una foto de cada uno y te verifico hoy mismo. Sin esto no puedo presentarte a constructoras.`;
    },

    // ---------- Presentar candidatos a la constructora (informe §9) ----------
    presentarCandidatos(solicitud, candidatos, cfg) {
      const con = window.Store.constructoraById(solicitud.constructoraId);
      const oficio = oficioLabel(solicitud.oficio);
      let msg = `Hola${con ? ' ' + nombreCorto(con.contacto || con.nombre) : ''} 👋 Para tu obra en ${solicitud.zona} ` +
        `(${solicitud.cantidad} ${oficio}${solicitud.cantidad > 1 ? 's' : ''}, inicio ${fmt(solicitud.fechaInicio)}) ` +
        `te propongo ${candidatos.length} perfil${candidatos.length === 1 ? '' : 'es'} verificado${candidatos.length === 1 ? '' : 's'}:\n`;
      candidatos.forEach((c, i) => {
        const p = c.prof;
        const r = c.rating || window.Store.rating(p.id);
        const disp = (window.Store.DISPONIBILIDAD.find(d => d.id === p.disponibilidad) || {}).label;
        msg += `\n${i + 1}️⃣ *${p.nombre}* — ${oficioLabel(p.oficioPrincipal)}\n` +
          `   ${p.experiencia} años · ${(p.zonas || []).join('/')} · ${disp}\n` +
          `   ${p.precio ? p.precio + ' €/' + (p.precioTipo === 'hora' ? 'h' : 'día') : 'precio a convenir'}` +
          `${r.n ? ' · ' + r.media + '★' : ''} · docs ${window.Store.verificadoPct(p)}% ✅\n`;
      });
      msg += `\n¿Con cuál quieres que te ponga en contacto? Respóndeme el número y os conecto por aquí. — ${cfg.empresa.nombre}`;
      return msg;
    },

    // ---------- Pedir valoración al terminar (informe §9) ----------
    pedirValoracion(prof, cfg) {
      return `¿Qué tal fue con ${nombreCorto(prof.nombre)}? Puntúa del 1 al 5 para mantener la bolsa fiable:\n\n` +
        `⭐ Calidad\n⏱️ Puntualidad\n🧹 Limpieza\n🧠 Autonomía\n\n` +
        `Con tu feedback subimos a los buenos y expulsamos a los malos. — ${cfg.empresa.nombre}`;
    },

    // ---------- Guion de venta a constructora (informe §3) ----------
    ventaConstructora(cfg) {
      return `Estoy montando una bolsa PRIVADA de oficios verificados en Asturias: albañiles, pladuristas, alicatadores, electricistas, fontaneros, carpinteros, pintores...\n\n` +
        `La idea: pides por WhatsApp "necesito 2 oficiales para el lunes" y te decimos quién está disponible, con papeles revisados y referencias.\n\n` +
        `Primer mes 99 €. Si no te presento al menos 3 perfiles válidos, no pagas el segundo. ¿Lo probamos? — ${cfg.empresa.nombre}`;
    }
  };

  function fmt(iso) {
    if (!iso) return '';
    try { return new Date(iso + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }); }
    catch (e) { return iso; }
  }

  window.Templates = Templates;
})();
