/* Datos demo de Asturias para ver la bolsa funcionando desde el minuto 1.
 * Solo se cargan si el localStorage está vacío. Se pueden vaciar en Ajustes.
 */
(function () {
  'use strict';

  function seedDemo() {
    const S = window.Store;
    if (S.state.profesionales.length || S.state.constructoras.length) return;

    const D = (n) => S.addDays(S.hoy(), -n); // hace n días

    // ---------- Profesionales (bolsa viva) ----------
    const profesionales = [
      { nombre: 'Juan Pérez Álvarez', telefono: '+34 611 223 344', oficioPrincipal: 'alicatador',
        oficiosSecundarios: ['albanil', 'solador'], zonas: ['Oviedo', 'Siero'], radioKm: 30, tipo: 'autonomo',
        disponibilidad: 'inmediata', precioTipo: 'dia', precio: 160, experiencia: 8, fotos: 4,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'ok', prl: 'ok', tpc: 'ok' }, estado: 'verificado',
        referencias: [{ obra: 'Reforma baños Ería', empresa: 'Construcciones Nalón' }],
        observaciones: 'Muy bueno en baños. No coger obra grande.', actualizado: D(2) },
      { nombre: 'Miguel Ángel Roza', telefono: '+34 622 334 455', oficioPrincipal: 'albanil',
        oficiosSecundarios: ['peon'], zonas: ['Gijón', 'Villaviciosa'], radioKm: 40, tipo: 'autonomo',
        disponibilidad: 'inmediata', precioTipo: 'dia', precio: 170, experiencia: 15, fotos: 6,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'ok', prl: 'ok', tpc: 'ok' }, estado: 'verificado',
        referencias: [{ obra: 'Rehabilitación fachada Cimavilla', empresa: 'Reformas Xixón' }],
        observaciones: 'Cuadrilla propia de 2 peones si hace falta.', actualizado: D(1) },
      { nombre: 'Cuadrilla Pladur Asturias (SL)', telefono: '+34 633 445 566', oficioPrincipal: 'pladurista',
        oficiosSecundarios: ['pintor'], zonas: ['Toda Asturias'], radioKm: 80, tipo: 'subcontrata',
        disponibilidad: 'semana', disponibleDesde: S.addDays(S.hoy(), 5), precioTipo: 'dia', precio: 220, experiencia: 12, fotos: 9,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'ok', prl: 'ok', tpc: 'ok', rea: 'ok' }, estado: 'verificado',
        referencias: [{ obra: 'Oficinas Intu', empresa: 'Promotora Central' }],
        observaciones: 'Equipo de 4. Trabajan toda Asturias. Facturan como SL.', actualizado: D(3) },
      { nombre: 'David Fernández Sela', telefono: '+34 644 556 677', oficioPrincipal: 'electricista',
        oficiosSecundarios: [], zonas: ['Avilés', 'Gijón'], radioKm: 35, tipo: 'autonomo',
        disponibilidad: 'inmediata', precioTipo: 'hora', precio: 28, experiencia: 10, fotos: 3,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'ok', prl: 'ok', tpc: 'pendiente' }, estado: 'verificado',
        referencias: [{ obra: 'BT vivienda Versalles', empresa: 'Instalaciones Avilés' }],
        observaciones: 'Boletines al día. Falta subir la TPC.', actualizado: D(6) },
      { nombre: 'Roberto Cueto', telefono: '+34 655 667 788', oficioPrincipal: 'fontanero',
        oficiosSecundarios: ['electricista'], zonas: ['Oviedo', 'Langreo', 'Mieres'], radioKm: 45, tipo: 'autonomo',
        disponibilidad: 'ocupado', precioTipo: 'dia', precio: 165, experiencia: 20, fotos: 5,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'ok', prl: 'ok', tpc: 'ok' }, estado: 'verificado',
        referencias: [{ obra: 'Calefacción bloque Sama', empresa: 'Cuencas Reformas' }],
        observaciones: 'Ocupado hasta fin de mes.', actualizado: D(4) },
      { nombre: 'Andrei Popescu', telefono: '+34 666 778 899', oficioPrincipal: 'ferralla',
        oficiosSecundarios: ['peon'], zonas: ['Gijón', 'Oviedo'], radioKm: 50, tipo: 'asalariado',
        disponibilidad: 'inmediata', precioTipo: 'hora', precio: 16, experiencia: 6, fotos: 2,
        docs: { dni: 'ok', prl: 'ok', tpc: 'ok', permisoTrabajo: 'ok' }, estado: 'verificado',
        referencias: [], observaciones: 'FASE 2 · asalariado buscando empleo. Requiere agencia de colocación.', actualizado: D(2) },
      { nombre: 'Sergio Lada', telefono: '+34 677 889 900', oficioPrincipal: 'pintor',
        oficiosSecundarios: ['pladurista'], zonas: ['Oviedo'], radioKm: 25, tipo: 'autonomo',
        disponibilidad: 'inmediata', precioTipo: 'dia', precio: 140, experiencia: 7, fotos: 4,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'pendiente', prl: 'ok', tpc: 'ok' }, estado: 'pendiente',
        referencias: [{ obra: 'Pintura chalet Colloto', empresa: 'Reformas Prado' }],
        observaciones: 'Perfil nuevo. Falta póliza RC para verificar.', actualizado: D(0) },
      { nombre: 'Carpintería Hnos. Granda', telefono: '+34 688 990 011', oficioPrincipal: 'carpintero',
        oficiosSecundarios: [], zonas: ['Siero', 'Oviedo', 'Gijón'], radioKm: 40, tipo: 'sl',
        disponibilidad: 'semana', disponibleDesde: S.addDays(S.hoy(), 7), precioTipo: 'dia', precio: 200, experiencia: 18, fotos: 8,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'ok', prl: 'ok', tpc: 'ok', rea: 'ok' }, estado: 'verificado',
        referencias: [{ obra: 'Puertas hotel Silken', empresa: 'Grupo Hotelero' }],
        observaciones: 'Taller propio. Buenos acabados en madera.', actualizado: D(5) },
      { nombre: 'Iván Solís', telefono: '+34 699 001 122', oficioPrincipal: 'solador',
        oficiosSecundarios: ['alicatador'], zonas: ['Avilés', 'Occidente'], radioKm: 60, tipo: 'autonomo',
        disponibilidad: 'inmediata', precioTipo: 'dia', precio: 150, experiencia: 9, fotos: 3,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'ok', prl: 'ok', tpc: 'ok' }, estado: 'verificado',
        referencias: [], observaciones: '', actualizado: D(12) },
      { nombre: 'Pablo Meana', telefono: '+34 610 112 233', oficioPrincipal: 'albanil',
        oficiosSecundarios: ['solador', 'alicatador'], zonas: ['Toda Asturias'], radioKm: 90, tipo: 'subcontrata',
        disponibilidad: 'semana', disponibleDesde: S.addDays(S.hoy(), 3), precioTipo: 'dia', precio: 190, experiencia: 22, fotos: 10,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'ok', prl: 'ok', tpc: 'ok', rea: 'ok' }, estado: 'verificado',
        referencias: [{ obra: 'Nave industrial Bobes', empresa: 'Naves del Norte' }],
        observaciones: 'Cuadrilla de 3. Cogen obra grande.', actualizado: D(1) },
      { nombre: 'Nicolae Dumitru', telefono: '+34 620 223 344', oficioPrincipal: 'peon',
        oficiosSecundarios: [], zonas: ['Gijón'], radioKm: 20, tipo: 'asalariado',
        disponibilidad: 'inmediata', precioTipo: 'hora', precio: 13, experiencia: 3, fotos: 0,
        docs: { dni: 'ok', prl: 'pendiente', tpc: 'pendiente' }, estado: 'pendiente',
        referencias: [], observaciones: 'FASE 2. Falta PRL y TPC. Buscando empleo.', actualizado: D(0) },
      { nombre: 'Electro Nalón (SL)', telefono: '+34 630 334 455', oficioPrincipal: 'electricista',
        oficiosSecundarios: ['fontanero'], zonas: ['Langreo', 'Mieres', 'Oviedo'], radioKm: 45, tipo: 'sl',
        disponibilidad: 'inmediata', precioTipo: 'dia', precio: 210, experiencia: 14, fotos: 6,
        docs: { dni: 'ok', altaAutonomo: 'ok', rc: 'ok', prl: 'ok', tpc: 'ok', rea: 'ok' }, estado: 'verificado',
        referencias: [{ obra: 'Reforma integral Sama', empresa: 'Cuencas Reformas' }],
        observaciones: 'Instaladora autorizada. 2 oficiales.', actualizado: D(2) }
    ];
    const profIds = profesionales.map(p => S.addProfesional(p));

    // ---------- Constructoras (clientes) ----------
    const constructoras = [
      { nombre: 'Reformas Xixón', contacto: 'Marcos', telefono: '+34 640 111 222', email: 'marcos@reformasxixon.es',
        zona: 'Gijón', plan: 'pro', estado: 'activa', cuotaMes: 149,
        altaFecha: D(38), renovacionFecha: S.addDays(S.hoy(), -8 + 30), notas: 'Cliente contento. Renovó el 2º mes.' },
      { nombre: 'Construcciones Nalón', contacto: 'Elena Buelga', telefono: '+34 641 222 333', email: 'obras@nalon.es',
        zona: 'Langreo', plan: 'basico', estado: 'activa', cuotaMes: 99,
        altaFecha: D(20), renovacionFecha: S.addDays(S.hoy(), 10), notas: '' },
      { nombre: 'Promociones Ovetense', contacto: 'Jorge', telefono: '+34 642 333 444', email: 'jorge@ovetense.es',
        zona: 'Oviedo', plan: 'piloto', estado: 'prueba', cuotaMes: 99,
        altaFecha: D(6), renovacionFecha: S.addDays(S.hoy(), 24), notas: 'Piloto. Decide renovación en 3 semanas.' },
      { nombre: 'Reformas Prado', contacto: 'Luis Prado', telefono: '+34 643 444 555', email: 'luis@reformasprado.es',
        zona: 'Oviedo', plan: 'piloto', estado: 'prueba', cuotaMes: 99,
        altaFecha: D(3), renovacionFecha: S.addDays(S.hoy(), 27), notas: 'Le urgen alicatadores.' },
      { nombre: 'Grupo Avilés Obras', contacto: 'Nuria', telefono: '+34 644 555 666', email: 'nuria@avilesobras.es',
        zona: 'Avilés', plan: 'premium', estado: 'activa', cuotaMes: 299,
        altaFecha: D(52), renovacionFecha: S.addDays(S.hoy(), 8), notas: 'Uso intensivo. Varias obras a la vez.' },
      { nombre: 'Reformas Cuencas', contacto: 'Dani', telefono: '+34 645 666 777', email: 'dani@reformascuencas.es',
        zona: 'Mieres', plan: 'basico', estado: 'pausada', cuotaMes: 99,
        altaFecha: D(70), renovacionFecha: D(10), notas: 'Pausó en verano. Recontactar en septiembre.' }
    ];
    const conIds = constructoras.map(c => S.addConstructora(c));

    // ---------- Solicitudes ----------
    const solicitudes = [
      { constructoraId: conIds[4], oficio: 'alicatador', cantidad: 2, zona: 'Avilés', fechaInicio: S.addDays(S.hoy(), 4),
        duracion: '3 semanas', urgencia: 'urgente', tipoContrato: 'subcontrata', estado: 'nueva',
        notas: 'Baños de un bloque. Empezar lunes.' },
      { constructoraId: conIds[0], oficio: 'pladurista', cantidad: 3, zona: 'Gijón', fechaInicio: S.addDays(S.hoy(), 7),
        duracion: '1 mes', urgencia: 'normal', tipoContrato: 'subcontrata', estado: 'presentada',
        candidatos: [profIds[2], profIds[6]], notas: 'Oficinas. Enviados 2 perfiles, esperando respuesta.' },
      { constructoraId: conIds[1], oficio: 'electricista', cantidad: 1, zona: 'Langreo', fechaInicio: S.addDays(S.hoy(), 2),
        duracion: '2 semanas', urgencia: 'normal', tipoContrato: 'autonomo', estado: 'cerrada',
        candidatos: [profIds[11]], elegido: profIds[11], notas: 'Match cerrado con Electro Nalón.' },
      { constructoraId: conIds[3], oficio: 'alicatador', cantidad: 1, zona: 'Oviedo', fechaInicio: S.addDays(S.hoy(), 5),
        duracion: '10 días', urgencia: 'urgente', tipoContrato: 'autonomo', estado: 'enProceso',
        notas: 'Reforma baño chalet. Buscando disponibles.' }
    ];
    solicitudes.forEach(s => S.addSolicitud(s));

    // ---------- Valoraciones (scoring) ----------
    S.addValoracion({ profesionalId: profIds[0], constructoraId: conIds[1], calidad: 5, puntualidad: 5, limpieza: 4, autonomia: 5, comentario: 'Impecable en baños.', fecha: D(15) });
    S.addValoracion({ profesionalId: profIds[1], constructoraId: conIds[0], calidad: 5, puntualidad: 4, limpieza: 4, autonomia: 5, comentario: 'Rápido y limpio.', fecha: D(20) });
    S.addValoracion({ profesionalId: profIds[2], constructoraId: conIds[4], calidad: 4, puntualidad: 5, limpieza: 5, autonomia: 4, comentario: 'Buen equipo de pladur.', fecha: D(10) });
    S.addValoracion({ profesionalId: profIds[11], constructoraId: conIds[1], calidad: 5, puntualidad: 5, limpieza: 5, autonomia: 5, comentario: 'Instaladora seria.', fecha: D(5) });
    S.addValoracion({ profesionalId: profIds[9], constructoraId: conIds[4], calidad: 4, puntualidad: 4, limpieza: 3, autonomia: 5, comentario: 'Coge obra grande sin problema.', fecha: D(8) });
    S.addValoracion({ profesionalId: profIds[3], constructoraId: conIds[4], calidad: 4, puntualidad: 5, limpieza: 4, autonomia: 4, comentario: 'Cumple plazos.', fecha: D(12) });

    console.log('[seed] Datos demo de ObraMatch cargados');
  }

  window.seedDemo = seedDemo;
})();
