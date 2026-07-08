/* Arranque y router del panel ObraMatch. */
(function () {
  'use strict';

  const App = {
    init() {
      const had = window.Store.load();
      if (!had && window.seedDemo) window.seedDemo();

      // Navegación
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.onclick = () => { location.hash = b.dataset.view; };
      });

      // Router por hash
      window.addEventListener('hashchange', App.route);

      // Re-render al cambiar el store (solo si no hay modal abierto para no perder foco)
      document.addEventListener('store:changed', () => {
        if (document.getElementById('modal').hidden) window.Views.render(window.Views.current);
      });

      // Cierre de modal
      document.getElementById('modal').addEventListener('click', e => {
        if (e.target.id === 'modal') window.Modals.close();
      });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') window.Modals.close(); });

      App.route();
    },

    route() {
      const valid = ['dashboard', 'solicitudes', 'profesionales', 'constructoras', 'ajustes'];
      const h = (location.hash || '').replace('#', '');
      window.Views.render(valid.includes(h) ? h : 'dashboard');
    }
  };

  if (document.readyState !== 'loading') App.init();
  else document.addEventListener('DOMContentLoaded', App.init);
})();
