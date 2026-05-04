// Datos demo para que Annie y Elena vean el CRM con contenido al primer arranque.
// Solo se cargan si el localStorage está vacío.

(function () {
  const SEED_FLAG = 'crm_annie_seeded_v1';

  function daysAgo(d) {
    return new Date(Date.now() - d * 86400000).toISOString();
  }
  function minsAgo(m) {
    return new Date(Date.now() - m * 60000).toISOString();
  }

  function seed() {
    Store.load();
    if (localStorage.getItem(SEED_FLAG)) return;
    if (Store.state.leads.length > 0) {
      localStorage.setItem(SEED_FLAG, '1');
      return;
    }

    const seedLeads = [
      {
        nombre: 'María González Pérez',
        telefono: '+34 666 12 34 56',
        email: 'maria.g@correo.es',
        deudaTotal: 38500, numAcreedores: 6, ingresosMensuales: 1180,
        situacion: 'Despido reciente, 3 tarjetas revolving y un préstamo personal.',
        origen: 'google_ads', palabraClave: 'abogado segunda oportunidad valladolid',
        campania: 'LSO · Valladolid · Búsqueda · Mes 1', costeClick: 4.20,
        asignado: 'annie', tipoCaso: 'lso_inmediata',
        fechaEntradaOffsetMin: 3
      },
      {
        nombre: 'Javier Ruiz Martín',
        telefono: '+34 677 22 11 33',
        email: 'jruiz@correo.es',
        deudaTotal: 62000, numAcreedores: 9, ingresosMensuales: 1620,
        situacion: 'Autónomo cerrado durante pandemia, deuda con Hacienda y Seg. Social.',
        origen: 'google_ads', palabraClave: 'cancelar deudas autonomo',
        campania: 'LSO · Valladolid · Búsqueda · Mes 1', costeClick: 5.10,
        asignado: 'annie', tipoCaso: 'lso_empresa',
        fechaEntradaOffsetMin: 25
      },
      {
        nombre: 'Lucía Fernández Vega',
        telefono: '+34 612 99 00 11',
        email: 'lucia.fv@correo.es',
        deudaTotal: 21300, numAcreedores: 4, ingresosMensuales: 980,
        situacion: 'Madre soltera, 2 hijos a cargo, deuda principal en revolving.',
        origen: 'google_ads', palabraClave: 'ley segunda oportunidad valladolid',
        campania: 'LSO · Valladolid · Búsqueda · Mes 1', costeClick: 3.80,
        asignado: 'elena', tipoCaso: 'lso_inmediata',
        fechaEntradaOffsetMin: 90,
        avanzarA: 'contactado'
      },
      {
        nombre: 'Carlos Vázquez Soto',
        telefono: '+34 645 33 44 55',
        email: 'cvazquez@correo.es',
        deudaTotal: 45800, numAcreedores: 7, ingresosMensuales: 1340,
        situacion: 'Embargo de nómina por sentencia firme; busca exoneración inmediata.',
        origen: 'google_ads', palabraClave: 'cancelar deudas valladolid',
        campania: 'LSO · Valladolid · Búsqueda · Mes 1', costeClick: 4.90,
        asignado: 'annie', tipoCaso: 'lso_inmediata',
        fechaEntradaOffsetMin: 60 * 26,
        avanzarA: 'cita',
        fechaCita: new Date(Date.now() + 2 * 86400000).toISOString()
      },
      {
        nombre: 'Ana Belén Castro',
        telefono: '+34 699 88 77 66',
        email: 'abcastro@correo.es',
        deudaTotal: 29400, numAcreedores: 5, ingresosMensuales: 1100,
        situacion: 'Separación, asumió deudas conjuntas. Quiere cerrar rápido.',
        origen: 'recomendacion', palabraClave: '',
        campania: '', costeClick: 0,
        asignado: 'annie', tipoCaso: 'lso_inmediata',
        fechaEntradaOffsetMin: 60 * 24 * 4,
        avanzarA: 'presupuesto'
      },
      {
        nombre: 'Pedro López Hidalgo',
        telefono: '+34 622 55 66 77',
        email: 'plhidalgo@correo.es',
        deudaTotal: 51200, numAcreedores: 8, ingresosMensuales: 1450,
        situacion: 'Avalado a familiar, ahora le persiguen las deudas.',
        origen: 'google_ads', palabraClave: 'abogado deudas valladolid',
        campania: 'LSO · Valladolid · Búsqueda · Mes 1', costeClick: 4.50,
        asignado: 'annie', tipoCaso: 'lso_inmediata',
        fechaEntradaOffsetMin: 60 * 24 * 8,
        avanzarA: 'ganado'
      },
      {
        nombre: 'Rocío Méndez Iglesias',
        telefono: '+34 611 22 33 44',
        email: 'rocio.m@correo.es',
        deudaTotal: 18900, numAcreedores: 3, ingresosMensuales: 1050,
        situacion: 'Tarjetas y préstamo coche; sin bienes embargables.',
        origen: 'google_ads', palabraClave: 'segunda oportunidad sin bienes',
        campania: 'LSO · Valladolid · Búsqueda · Mes 1', costeClick: 3.40,
        asignado: 'elena', tipoCaso: 'lso_inmediata',
        fechaEntradaOffsetMin: 60 * 24 * 12,
        avanzarA: 'perdido',
        motivoPerdido: 'precio'
      }
    ];

    seedLeads.forEach(s => {
      const fechaEntrada = minsAgo(s.fechaEntradaOffsetMin);
      const lead = Store.addLead({
        nombre: s.nombre,
        telefono: s.telefono,
        email: s.email,
        deudaTotal: s.deudaTotal,
        numAcreedores: s.numAcreedores,
        ingresosMensuales: s.ingresosMensuales,
        situacion: s.situacion,
        origen: s.origen,
        palabraClave: s.palabraClave,
        campania: s.campania,
        costeClick: s.costeClick,
        asignado: s.asignado,
        tipoCaso: s.tipoCaso,
        fechaEntrada
      });
      if (s.avanzarA) {
        const orden = ['nuevo', 'contactado', 'cita', 'presupuesto', 'negociacion', 'ganado'];
        const target = s.avanzarA === 'perdido' ? 'perdido' : s.avanzarA;
        const idx = orden.indexOf(target);
        if (target === 'perdido') {
          Store.updateLead(lead.id, {
            fechaPrimerContacto: minsAgo(s.fechaEntradaOffsetMin - 30),
            etapa: 'perdido',
            motivoPerdido: s.motivoPerdido
          });
        } else if (idx > 0) {
          Store.updateLead(lead.id, {
            fechaPrimerContacto: minsAgo(Math.max(0, s.fechaEntradaOffsetMin - 30))
          });
          for (let i = 1; i <= idx; i++) {
            Store.moverEtapa(lead.id, orden[i],
              orden[i] === 'cita' && s.fechaCita ? { fechaCita: s.fechaCita } : {});
          }
        }
      }
    });

    // Inversión Google Ads del mes en curso (Mes 1: 200€).
    const mes = new Date().toISOString().slice(0, 7);
    Store.setInversion(mes, 'google', 200);
    Store.setInversion(mes, 'meta', 0);

    localStorage.setItem(SEED_FLAG, '1');
  }

  window.seedDemo = seed;
})();
