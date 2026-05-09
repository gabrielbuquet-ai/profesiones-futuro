# Pisos Aguado · Gestión de alquileres

App SPA para centralizar la gestión de los pisos de los Aguado (Pedro, Estrella, Antonio, Bernardo). Vive en `eratours.es/pisos/` (subcarpeta del sitio existente, mismo patrón que `/crm-annie/`).

## Funcionalidades

- **Rent Roll** con fecha de firma, inicio, fin, anexos, renovaciones, IPC y fees del 10 % por gestión.
- **Edificios y pisos** (Delicias 26, Argumosa 11, Narváez 60).
- **Inquilinos** con histórico de contratos.
- **Incidencias** por edificio con técnicos (Alejandro García, Cristian Campoverde, Tavi…), proveedores (MAGARCA…) y coste.
- **Cobros pendientes** a los Aguado (p.ej. lavadora MAGARCA → Pedro).
- **Alertas automáticas**: contratos que vencen en 30/60/90 días, revisiones IPC pendientes, incidencias abiertas hace mucho, gastos sin cobrar.
- **Calendario .ics** descargable, con avisos N días antes (configurable).
- **Recordatorios por email** (mailto: con destinatario y cuerpo prerrellenado).
- **Multiusuario** con login Google y roles (`admin`, `editor`, `lectura`, `pendiente`).

## Stack

- HTML / CSS / Vanilla JS (sin build).
- Firebase Auth (Google) + Firestore (proyecto `profesiones-futuro`).
- Datos en colecciones con prefijo `pisos_*` para no chocar con datos previos del proyecto Firebase.

## Setup mínimo (una sola vez)

En la consola de Firebase del proyecto `profesiones-futuro`:

1. **Authentication → Sign-in method**: habilitar **Google**.
2. **Authentication → Settings → Authorized domains**: añadir `eratours.es` (y `localhost` si quieres probarlo en local).
3. **Firestore → Rules**: por defecto el proyecto está abierto; antes de meter datos reales, restringe a usuarios con rol válido. Sugerencia mínima:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isAdmin() {
      return request.auth != null
        && get(/databases/$(db)/documents/pisos_usuarios/$(request.auth.uid)).data.role == 'admin';
    }
    function canRead() {
      return request.auth != null
        && get(/databases/$(db)/documents/pisos_usuarios/$(request.auth.uid)).data.role in ['admin','editor','lectura'];
    }
    function canWrite() {
      return request.auth != null
        && get(/databases/$(db)/documents/pisos_usuarios/$(request.auth.uid)).data.role in ['admin','editor'];
    }
    match /pisos_usuarios/{uid} {
      allow read: if request.auth != null && (request.auth.uid == uid || isAdmin());
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update, delete: if isAdmin();
    }
    match /pisos_{col}/{doc} {
      allow read: if canRead();
      allow write: if canWrite();
    }
    // Resto del proyecto (juego de profesiones, CRM, etc.) sin cambios.
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Primer arranque

1. Abre `https://eratours.es/pisos/` (después de mergear a `master` para que GitHub Pages publique).
2. Inicia sesión con Google. **El primer usuario que entre será admin automáticamente** (si la colección `pisos_usuarios` está vacía); también lo serán las cuentas `gabriel@buquetabogados.com` y `gabrielbuquet@gmail.com`.
3. Ve a **Ajustes → Cargar datos iniciales** para crear automáticamente:
   - Propietarios: Pedro, Estrella, Antonio y Bernardo Aguado
   - Edificios: Delicias 26, Argumosa 11, Narváez 60 (con su único piso)
   - Técnicos: Alejandro García, Cristian Campoverde, Tavi
   - Proveedor: MAGARCA, con un cobro pendiente a Pedro Aguado por la lavadora de Argumosa 11 (el importe se rellena después).
4. Crea los pisos restantes de Delicias 26 y Argumosa 11, asígnales propietario, y empieza a registrar contratos.

## Estructura

```
pisos/
├── index.html         # Shell + login + templates
├── css/pisos.css
├── js/
│   ├── store.js       # CRUD Firestore + suscripciones tiempo real
│   ├── alerts.js      # Generador de alertas (IPC, vencimientos, etc.)
│   ├── ics.js         # Export .ics (iCalendar)
│   ├── templates.js   # Helpers DOM, modales, toasts
│   ├── views.js       # Renderizado de cada vista
│   ├── seed.js        # Datos iniciales conocidos
│   └── app.js         # Login gate + router
└── README.md
```
