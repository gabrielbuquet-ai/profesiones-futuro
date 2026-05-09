/* Orquestador: login gate, routing entre vistas y refresco al cambiar el store. */
(function () {
  'use strict';

  const VIEWS = {
    dashboard: 'dashboard',
    rentroll: 'rentroll',
    edificios: 'edificios',
    inquilinos: 'inquilinos',
    incidencias: 'incidencias',
    tecnicos: 'tecnicos',
    proveedores: 'proveedores',
    calendario: 'calendario',
    ajustes: 'ajustes'
  };

  let currentView = 'dashboard';
  let appReady = false;

  function showLogin() {
    document.getElementById('loginGate').hidden = false;
    document.getElementById('appShell').hidden = true;
  }
  function showApp() {
    document.getElementById('loginGate').hidden = true;
    document.getElementById('appShell').hidden = false;
  }

  function setActiveNav(view) {
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });
  }

  function render() {
    if (!appReady) return;
    const main = document.getElementById('app');
    main.innerHTML = '';
    const fn = window.Views[currentView];
    if (typeof fn === 'function') fn(main);
    else main.appendChild(Object.assign(document.createElement('div'), { className: 'empty', textContent: 'Vista no encontrada' }));
    setActiveNav(currentView);
  }

  function navigateTo(view) {
    if (!VIEWS[view]) return;
    currentView = view;
    if (location.hash !== '#' + view) location.hash = view;
    render();
  }

  function bindNav() {
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.addEventListener('click', () => navigateTo(b.dataset.view));
    });
    document.getElementById('btnLogout').addEventListener('click', async () => {
      await window.Store.logout();
    });
    window.addEventListener('hashchange', () => {
      const h = location.hash.replace('#', '');
      if (h && VIEWS[h]) { currentView = h; render(); }
    });
  }

  function applyUserUI(user, role) {
    document.getElementById('userName').textContent = user.displayName || user.email;
    const badge = document.getElementById('userRole');
    badge.textContent = role;
    badge.className = 'role-badge' + (role === 'admin' ? ' admin' : '');
  }

  async function onAuth(user) {
    if (!user) {
      window.Store.setUser(null, 'guest');
      window.Store.clearSubs();
      showLogin();
      return;
    }
    let role = 'pendiente';
    try {
      role = await window.Store.ensureUserDoc(user);
    } catch (e) {
      console.error('No se pudo asegurar el documento de usuario', e);
    }
    if (role === 'pendiente') {
      window.Tpl && window.Tpl.toast('Tu cuenta está pendiente de aprobación por el admin', 'error');
      // Mostramos la app igualmente en modo limitado: solo lectura del config + sus propios datos
    }
    window.Store.setUser(user, role);
    applyUserUI(user, role);
    window.Store.startSubs();
    showApp();
    appReady = true;
    // Hash inicial
    const h = location.hash.replace('#', '');
    if (h && VIEWS[h]) currentView = h;
    render();
  }

  function bindLogin() {
    document.getElementById('btnLogin').addEventListener('click', async () => {
      try {
        await window.Store.loginWithGoogle();
      } catch (e) {
        console.error('Login error', e);
        alert('No se pudo iniciar sesión: ' + e.message);
      }
    });
  }

  function bootstrap() {
    bindLogin();
    bindNav();
    window.Store.subscribe(() => render());
    try {
      window.fb.onAuthStateChanged(window.fb.auth, onAuth);
    } catch (e) {
      console.error('onAuthStateChanged error', e);
      const g = document.getElementById('globalError');
      if (g) {
        g.hidden = false;
        g.textContent = 'Firebase Auth no disponible. ¿Has habilitado Google como proveedor en la consola Firebase y añadido eratours.es a Authorized domains? Detalle: ' + (e.message || e);
      }
      showLogin();
    }
  }

  // Si Firebase tarda más de 4s en cargar, muestra el login igualmente con un aviso.
  setTimeout(function(){
    if (!window.fb) {
      showLogin();
      const g = document.getElementById('globalError');
      if (g) {
        g.hidden = false;
        g.textContent = 'Firebase no se cargó (¿bloqueador de scripts? ¿sin conexión?). Recarga la página.';
      }
    }
  }, 4000);

  if (window.fb) bootstrap();
  else window.addEventListener('fb-ready', bootstrap, { once: true });
})();
