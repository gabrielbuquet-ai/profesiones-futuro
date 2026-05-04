// Plantillas de comunicación listas para Annie y Elena.
// Sustituye {{placeholders}} con datos del lead/caso al renderizar.

const Templates = {
  // -------- Email --------
  emailConfirmacion(lead, ajustes) {
    return {
      asunto: `Hemos recibido tu consulta — ${ajustes.despacho.nombre}`,
      cuerpo: `Hola ${lead.nombre},

Acabamos de recibir tu consulta sobre Ley de Segunda Oportunidad. Gracias por confiar en nosotros.

Te llamaremos en menos de 24 horas (normalmente en menos de 1 hora durante horario laborable) para conocer tu caso con detalle y agendar una primera consulta sin compromiso.

Si prefieres adelantar la conversación:
• Teléfono: ${ajustes.despacho.telefono}
• WhatsApp: ${ajustes.despacho.telefono}

Un saludo,
${ajustes.despacho.letrada}
${ajustes.despacho.nombre} · Col. núm. ${ajustes.despacho.colegiado} ${ajustes.despacho.colegio}`
    };
  },

  emailRecordatorioCita(lead, ajustes) {
    const fecha = lead.fechaCita
      ? new Date(lead.fechaCita).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })
      : '[fecha cita]';
    return {
      asunto: `Recordatorio · Tu consulta el ${fecha}`,
      cuerpo: `Hola ${lead.nombre},

Te recuerdo nuestra cita el ${fecha}.

Para que la consulta sea lo más útil posible, ten a mano:
• DNI
• Listado de tus deudas y acreedores
• Últimas 3 nóminas o certificado del SEPE
• Cualquier requerimiento, demanda o sentencia que hayas recibido

Si surge algún imprevisto, contéstame a este email o por WhatsApp (${ajustes.despacho.telefono}) y reagendamos.

Un saludo,
${ajustes.despacho.letrada}`
    };
  },

  emailPresupuesto(lead, ajustes) {
    const validez = new Date(Date.now() + 7 * 86400000).toLocaleDateString('es-ES');
    return {
      asunto: `Tu propuesta — ${ajustes.despacho.nombre}`,
      cuerpo: `Hola ${lead.nombre},

Tras nuestra conversación, adjunto la hoja de encargo con la propuesta de actuación para tu caso de Ley de Segunda Oportunidad.

Resumen:
• Actuación: tramitación completa del concurso de persona física y solicitud de exoneración del pasivo insatisfecho ante el Juzgado de lo Mercantil de Valladolid.
• Honorarios: ${(lead.honorarios || 2500).toLocaleString('es-ES')} € + IVA, todo incluido (no hay extras).
• Provisión inicial: ${Math.round((lead.honorarios || 2500) * 0.4).toLocaleString('es-ES')} € a la firma.
• Resto: a fraccionar a lo largo del procedimiento.
• Plazo estimado: 6 a 9 meses hasta exoneración.

La propuesta tiene validez hasta el ${validez}. Para aceptarla, basta con firmar digitalmente y abonar la provisión inicial por transferencia a:

IBAN: ${ajustes.despacho.iban}
Concepto: "${lead.nombre} · LSO · provisión"

Si quieres que repasemos cualquier punto, dime y agendamos una llamada de 15 minutos.

Un saludo,
${ajustes.despacho.letrada}`
    };
  },

  emailSeguimiento48h(lead, ajustes) {
    return {
      asunto: '¿Has podido revisar la propuesta?',
      cuerpo: `Hola ${lead.nombre},

Te escribo para saber si has tenido oportunidad de revisar la hoja de encargo que te envié hace dos días.

Si tienes cualquier duda o quieres que ajustemos algún punto (importes, plazos, alcance), dímelo y le damos una vuelta.

Quedo a la espera.

Un saludo,
${ajustes.despacho.letrada}`
    };
  },

  emailSeguimiento7dias(lead, ajustes) {
    return {
      asunto: `¿Sigues interesad@? — ${ajustes.despacho.nombre}`,
      cuerpo: `Hola ${lead.nombre},

No quería perder el contacto. Hace una semana te envié la propuesta para tu caso y no he sabido nada más.

Solo quería preguntarte:

1. ¿Sigues queriendo avanzar?
2. ¿Has decidido ir por otro camino?
3. ¿Necesitas más información o ajustar algo de la propuesta?

Una respuesta breve, aunque sea "no sigo", me ayuda a cerrar el seguimiento.

Un saludo,
${ajustes.despacho.letrada}`
    };
  },

  // -------- WhatsApp --------
  whatsappPrimerContacto(lead, ajustes) {
    return `Hola ${lead.nombre.split(' ')[0]}, soy ${ajustes.despacho.letrada} de ${ajustes.despacho.nombre}. Acabamos de recibir tu consulta sobre Ley de Segunda Oportunidad. Estoy revisándolo y te llamo en los próximos minutos. ¿Es un buen momento o prefieres que te llame a otra hora?`;
  },

  whatsappRecordatorioCita(lead, ajustes) {
    const fecha = lead.fechaCita
      ? new Date(lead.fechaCita).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
      : '[fecha cita]';
    return `Hola ${lead.nombre.split(' ')[0]}, te recuerdo nuestra cita el ${fecha}. Si necesitas reagendar, dímelo y lo movemos. — ${ajustes.despacho.letrada}`;
  },

  // -------- Hoja de encargo (texto plano descargable) --------
  hojaEncargo(lead, ajustes) {
    const honorarios = lead.honorarios || 2500;
    const provision = Math.round(honorarios * 0.4);
    const fecha = new Date().toLocaleDateString('es-ES');
    return `HOJA DE ENCARGO PROFESIONAL
============================

En ${ajustes.despacho.direccion}, a ${fecha}.

REUNIDOS

DE UNA PARTE: Dña. ${ajustes.despacho.letrada}, abogada en ejercicio,
colegiada núm. ${ajustes.despacho.colegiado} del Iltre. Colegio de Abogados ${ajustes.despacho.colegio},
con despacho en ${ajustes.despacho.direccion} (en adelante, "la Letrada").

DE OTRA PARTE: ${lead.nombre}, con teléfono ${lead.telefono} y email ${lead.email}
(en adelante, "el Cliente").

EXPONEN

I. Que el Cliente ha encomendado a la Letrada la dirección técnico-jurídica
   del procedimiento de concurso de persona física y solicitud de Exoneración
   del Pasivo Insatisfecho (EPI) al amparo del Texto Refundido de la Ley Concursal
   tras la reforma operada por Ley 16/2022.

II. Que el Cliente declara una deuda total estimada de ${(lead.deudaTotal || 0).toLocaleString('es-ES')} €
    distribuida entre ${lead.numAcreedores || '?'} acreedores, con ingresos mensuales
    declarados de ${(lead.ingresosMensuales || 0).toLocaleString('es-ES')} €.

ACUERDAN

PRIMERA. Objeto. La Letrada asume la dirección letrada del procedimiento,
incluyendo: análisis de viabilidad, redacción de la solicitud, presentación por
LexNET, asistencia a la audiencia, gestión del Administrador Concursal si procede,
y cualesquiera escritos hasta el auto de exoneración.

SEGUNDA. Honorarios. Se fijan en ${honorarios.toLocaleString('es-ES')} € + IVA,
todo incluido, sin partidas adicionales por escritos, audiencias o recursos
ordinarios. Quedan excluidos: tasas judiciales, aranceles registrales y gastos
de procurador, que se facturarán como suplidos.

TERCERA. Forma de pago.
  · Provisión inicial a la firma: ${provision.toLocaleString('es-ES')} €.
  · Resto: ${(honorarios - provision).toLocaleString('es-ES')} € a fraccionar
    en pagos mensuales hasta la conclusión del procedimiento.
  Transferencia a: ${ajustes.despacho.iban}.

CUARTA. Plazo estimado. 6 a 9 meses desde la firma hasta el auto de
exoneración, sin perjuicio de las dilaciones que puedan acumular el juzgado
o terceros.

QUINTA. Obligaciones del Cliente. Aportar veraz y puntualmente toda la
documentación requerida por la Letrada y comunicar cualquier modificación
de su situación patrimonial.

SEXTA. Confidencialidad y protección de datos. Conforme al art. 542.3 LOPJ
y al RGPD, los datos serán tratados con la finalidad exclusiva del encargo.

SÉPTIMA. Desistimiento. El Cliente podrá desistir en cualquier momento.
La Letrada percibirá los honorarios devengados hasta el desistimiento.

Y en prueba de conformidad, firman por duplicado en el lugar y fecha indicados.



______________________                ______________________
La Letrada                            El Cliente
${ajustes.despacho.letrada}            ${lead.nombre}
`;
  }
};

window.Templates = Templates;
