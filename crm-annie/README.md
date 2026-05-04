# CRM Buquet Abogados

CRM personalizado para **Annie Buquet** (abogada en Valladolid) y su becaria **Elena**, optimizado para captación vía Google Ads de casos de **Ley de Segunda Oportunidad** con honorarios de 2.500 € / caso.

> Diseño basado en la estrategia documentada por Gabriel de Buquet Segarra: pipeline de 7 etapas, regla de los 5 minutos, integración con métricas Google Ads, plantillas listas y procedimiento BEPI completo.

## Cómo ejecutarlo

Es una SPA estática 100 % cliente (HTML/CSS/JS vainilla, sin build, sin backend). Para usarla:

```bash
# Opción 1: abrir directamente en el navegador
open crm-annie/index.html

# Opción 2: servidor local
python3 -m http.server 8080
# luego abrir http://localhost:8080/crm-annie/
```

Funciona offline. Todos los datos se guardan en `localStorage` del navegador.

## Qué incluye

### 1. Dashboard
- KPIs del mes: leads, CPL, tasa de cierre, ingresos, ROAS, casos activos.
- **Alerta SLA**: avisa cuando hay leads sin contactar pasados 5 minutos (la regla Harvard que multiplica x21 la conversión).
- Lista de "acción inmediata" con cronómetro por lead.
- Próximas citas y tareas asignadas a Elena.

### 2. Pipeline (Kanban arrastrable)
7 columnas según el documento de Gabriel:
1. Lead nuevo (10 %)
2. Contactado (25 %)
3. Cita agendada (40 %)
4. Presupuesto enviado (60 %)
5. Negociación (75 %)
6. Ganado (100 %)
7. Perdido (0 %)

Arrastra leads entre columnas para avanzar. Al pasar a "Ganado" se abre automáticamente un expediente de caso.

### 3. Casos · Procedimiento Ley Segunda Oportunidad
6 fases con checklist de documentos y trámites para cada una:
1. Recopilación documental
2. Análisis de viabilidad
3. Solicitud al juzgado (concurso de persona física + EPI)
4. Admisión a trámite
5. Liquidación / Plan de pagos
6. Exoneración

Cada caso tiene tareas asignables a Annie o Elena, hitos con timeline y datos del juzgado / nº de autos.

### 4. Plantillas de comunicación
Generadas dinámicamente con los datos del lead:
- WhatsApp inicial (regla 5 min, cuando no puedes llamar)
- Email confirmación
- Email + WhatsApp recordatorio cita
- Email envío de presupuesto (con honorarios y plan de pagos)
- Seguimiento 48h y 7 días
- **Hoja de encargo** completa (texto descargable)

Botones para copiar al portapapeles, descargar `.txt` o **abrir directamente en WhatsApp** (con `wa.me`).

### 5. Métricas
- Inversión Google Ads / Meta Ads (mensual, editable)
- CPL, CAC, ROAS por mes
- Embudo de conversión visual
- Distribución de origen de leads
- **Ranking de palabras clave que más convierten** (input clave para optimizar tu campaña Google)

### 6. Ajustes
- Datos del despacho (se rellenan automáticamente en plantillas y hojas de encargo)
- Export / import JSON (backup completo)
- Vaciar datos demo

## Modelo de datos

Toda la información se guarda en `localStorage` bajo la clave `crm_annie_v1`. Estructura:

```js
{
  leads: [{ id, nombre, telefono, email, deudaTotal, numAcreedores,
            ingresosMensuales, situacion, origen, palabraClave, campania,
            costeClick, etapa, asignado, tipoCaso, honorarios,
            fechaEntrada, fechaPrimerContacto, fechaCita,
            notas[], pagos[], casoId, motivoPerdido }],
  casos: [{ id, leadId, expediente, cliente, faseActual, fasesEstado,
            tareas[], hitos[], juzgado, numAutos, fechaApertura, fechaCierre }],
  inversion: [{ mes: '2026-05', google, meta }],
  ajustes: { despacho: { nombre, letrada, colegio, colegiado, ... } }
}
```

## Datos demo

El primer arranque carga **7 leads de ejemplo** distribuidos por todo el pipeline (1 nuevo recién entrado con SLA en peligro, 1 contactado, 1 con cita, 1 presupuesto, 1 ganado con caso abierto, 1 perdido por precio) más 200 € de inversión Google del mes.

Cuando Annie esté lista para empezar de verdad: **Ajustes → Vaciar todos los datos**.

## Próximos pasos sugeridos

1. **Configurar despacho** en Ajustes (nombre, colegiado, IBAN, teléfono).
2. **Empezar a registrar cada lead que entra** en el formulario, con la palabra clave y el coste por click cuando vengan de Google Ads. Con esos datos en 60-90 días podrás ver qué keywords cierran clientes y cuáles solo queman presupuesto.
3. **Conectar el formulario de la landing** (Carrd / Lovable / Hubspot) para que dispare la creación automática del lead. Como el CRM es 100 % cliente, lo más simple es:
   - Recibir el formulario en HubSpot Free (gratis).
   - Sincronizar manualmente o usar Make/Zapier para postear al `localStorage` vía un endpoint propio.
   - O: migrar el almacén a Firestore (ya hay infra Firebase en el repo padre) cuando quieras multi-dispositivo y notificaciones móviles.

## Conexión con la estrategia de Gabriel

Este CRM materializa exactamente las decisiones del documento:

| Documento | Implementado en CRM |
|---|---|
| Regla 5 min | Alerta SLA en dashboard + cronómetro por lead |
| Pipeline 7 etapas | Tablero Kanban arrastrable |
| Honorarios 2.500 € | Default en Ajustes y por tipo de caso |
| Tracking palabra clave + CPC | Campos en lead + ranking en Métricas |
| Plantillas email §13 | Tab Comunicación en cada lead |
| Hoja de encargo | Generador descargable con datos pre-rellenados |
| Métricas CPL/CAC/ROAS | Vista Métricas con cálculo automático |
| Optimización keywords | Tabla "palabras clave que más convierten" |

— Preparado para Annie · Mayo 2026
