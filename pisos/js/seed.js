/* Datos iniciales conocidos: edificios de los Aguado, propietarios, técnicos y MAGARCA. */
(function () {
  'use strict';
  const S = window.Store;

  const PROPIETARIOS = [
    { nombre: 'Pedro Aguado' },
    { nombre: 'Estrella Aguado' },
    { nombre: 'Antonio Aguado' },
    { nombre: 'Bernardo Aguado' }
  ];

  const EDIFICIOS = [
    { nombre: 'Delicias 26', direccion: 'C/ Delicias 26, Madrid' },
    { nombre: 'Argumosa 11', direccion: 'C/ Argumosa 11, Madrid' },
    { nombre: 'Narváez 60', direccion: 'C/ Narváez 60, Madrid' }
  ];

  const TECNICOS = [
    { nombre: 'Alejandro García', especialidad: 'Manitas / general' },
    { nombre: 'Cristian Campoverde', especialidad: 'Reparaciones generales' },
    { nombre: 'Tavi', especialidad: 'Reparaciones puntuales' }
  ];

  const PROVEEDORES = [
    {
      nombre: 'MAGARCA',
      contacto: 'Calle Argumosa, Madrid',
      productos: 'Electrodomésticos (lavadoras, etc.)',
      notas: 'Compra de lavadora para Argumosa 11. Pendiente de cobro a Pedro Aguado.'
    }
  ];

  async function run() {
    // Propietarios
    const propsExistentes = S.all('propietarios');
    for (const p of PROPIETARIOS) {
      if (!propsExistentes.find(x => x.nombre === p.nombre)) {
        await S.add('propietarios', p);
      }
    }
    // Edificios
    const edsExistentes = S.all('edificios');
    for (const e of EDIFICIOS) {
      if (!edsExistentes.find(x => x.nombre === e.nombre)) {
        await S.add('edificios', e);
      }
    }
    // Técnicos
    const tecsExistentes = S.all('tecnicos');
    for (const t of TECNICOS) {
      if (!tecsExistentes.find(x => x.nombre === t.nombre)) {
        await S.add('tecnicos', t);
      }
    }
    // Proveedores
    const provsExistentes = S.all('proveedores');
    for (const p of PROVEEDORES) {
      if (!provsExistentes.find(x => x.nombre === p.nombre)) {
        await S.add('proveedores', p);
      }
    }
    // Esperamos un momento a que el listener actualice la cache
    await new Promise(r => setTimeout(r, 800));

    // Crear gasto pendiente de la lavadora MAGARCA -> Pedro Aguado, si no existe
    const magarca = S.all('proveedores').find(p => p.nombre === 'MAGARCA');
    const yaCargado = S.all('gastos').find(g => g.concepto && g.concepto.toLowerCase().includes('lavadora') && g.facturarA === 'Pedro Aguado');
    if (magarca && !yaCargado) {
      await S.add('gastos', {
        concepto: 'Lavadora Argumosa 11 (MAGARCA)',
        fecha: new Date().toISOString().slice(0, 10),
        importe: 0,
        facturarA: 'Pedro Aguado',
        proveedorId: magarca.id,
        cobrado: false,
        notas: 'Importe a confirmar — actualízalo cuando tengas la factura.'
      });
    }

    // Pisos: solo Narváez 60 sabemos que tiene exactamente 1 piso
    const ed = S.all('edificios');
    const narv = ed.find(e => e.nombre === 'Narváez 60');
    const pisosExistentes = S.all('pisos');
    if (narv && !pisosExistentes.find(p => p.edificioId === narv.id)) {
      await S.add('pisos', { edificioId: narv.id, identificador: 'Único' });
    }
  }

  window.Seed = { run };
})();
