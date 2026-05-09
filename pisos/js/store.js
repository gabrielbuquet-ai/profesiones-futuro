/* Pisos Aguado - Capa de datos sobre Firestore.
 * Mantiene cache en memoria para render rápido y se suscribe a cambios.
 */
(function () {
  'use strict';

  const COLLECTIONS = [
    'edificios', 'pisos', 'inquilinos', 'contratos',
    'incidencias', 'tecnicos', 'proveedores', 'gastos',
    'propietarios', 'usuarios', 'config'
  ];

  const state = {
    user: null,
    role: 'guest',
    cache: Object.fromEntries(COLLECTIONS.map(c => [c, []])),
    listeners: [],
    unsubs: [],
    config: {
      feePct: 10,
      avisoVencDias: 90,
      avisoIpcDias: 30,
      emailDestino: ''
    }
  };

  function fb() { return window.fb; }

  function log(...args) { try { console.log('[store]', ...args); } catch (e) {} }
  function warn(...args) { try { console.warn('[store]', ...args); } catch (e) {} }

  function emit() {
    state.listeners.forEach(fn => { try { fn(state); } catch (e) { warn('listener error', e); } });
  }

  function subscribe(fn) {
    state.listeners.push(fn);
    return () => {
      state.listeners = state.listeners.filter(f => f !== fn);
    };
  }

  function setUser(user, role) {
    state.user = user;
    state.role = role || 'guest';
    emit();
  }

  /* ============ Auth ============ */
  async function ensureUserDoc(user) {
    const f = fb();
    const ref = f.doc(f.db, 'pisos_usuarios', user.uid);
    const snap = await f.getDoc(ref);
    const KNOWN_ADMIN_EMAILS = ['gabriel@buquetabogados.com', 'gabrielbuquet@gmail.com'];
    if (!snap.exists()) {
      // Primer usuario que entra: si la colección está vacía, lo hacemos admin.
      let role = 'pendiente';
      try {
        const all = await f.getDocs(f.collection(f.db, 'pisos_usuarios'));
        if (all.empty) role = 'admin';
        else if (KNOWN_ADMIN_EMAILS.includes((user.email || '').toLowerCase())) role = 'admin';
      } catch (e) { warn('No pude leer pisos_usuarios', e); }
      await f.setDoc(ref, {
        uid: user.uid,
        email: user.email,
        nombre: user.displayName || user.email,
        photoURL: user.photoURL || null,
        role,
        creado: f.serverTimestamp(),
        ultimoAcceso: f.serverTimestamp()
      });
      return role;
    } else {
      const data = snap.data();
      await f.updateDoc(ref, { ultimoAcceso: f.serverTimestamp() });
      return data.role || 'pendiente';
    }
  }

  async function loginWithGoogle() {
    const f = fb();
    const provider = new f.GoogleAuthProvider();
    const cred = await f.signInWithPopup(f.auth, provider);
    return cred.user;
  }

  async function logout() {
    const f = fb();
    await f.signOut(f.auth);
  }

  /* ============ Subscripciones tiempo real ============ */
  function clearSubs() {
    state.unsubs.forEach(u => { try { u(); } catch (e) {} });
    state.unsubs = [];
  }

  function startSubs() {
    clearSubs();
    const f = fb();
    COLLECTIONS.forEach(name => {
      // Las colecciones llevan prefijo 'pisos_' para no chocar con datos previos del proyecto Firebase.
      const refName = colName(name);
      const ref = f.collection(f.db, refName);
      const unsub = f.onSnapshot(ref, snap => {
        const items = [];
        snap.forEach(d => items.push(Object.assign({ id: d.id }, d.data())));
        state.cache[name] = items;
        if (name === 'config') {
          const cfg = items.find(x => x.id === 'general');
          if (cfg) Object.assign(state.config, cfg);
        }
        emit();
      }, err => warn('subs error', name, err.message));
      state.unsubs.push(unsub);
    });
  }

  function colName(name) {
    return 'pisos_' + name;
  }

  /* ============ CRUD genérico ============ */
  async function add(collectionName, data) {
    const f = fb();
    const payload = Object.assign({}, data, {
      _creado: f.serverTimestamp(),
      _modificado: f.serverTimestamp(),
      _creadoPor: state.user ? state.user.uid : null
    });
    const ref = await f.addDoc(f.collection(f.db, colName(collectionName)), payload);
    return ref.id;
  }

  async function update(collectionName, id, data) {
    const f = fb();
    const payload = Object.assign({}, data, {
      _modificado: f.serverTimestamp()
    });
    await f.updateDoc(f.doc(f.db, colName(collectionName), id), payload);
  }

  async function setAt(collectionName, id, data) {
    const f = fb();
    await f.setDoc(f.doc(f.db, colName(collectionName), id), data, { merge: true });
  }

  async function remove(collectionName, id) {
    const f = fb();
    await f.deleteDoc(f.doc(f.db, colName(collectionName), id));
  }

  async function saveConfig(cfg) {
    const f = fb();
    await f.setDoc(f.doc(f.db, colName('config'), 'general'), cfg, { merge: true });
    Object.assign(state.config, cfg);
    emit();
  }

  /* ============ Helpers de lectura ============ */
  function all(name) { return state.cache[name] || []; }

  function byId(name, id) {
    return (state.cache[name] || []).find(x => x.id === id) || null;
  }

  function pisosDeEdificio(edificioId) {
    return all('pisos').filter(p => p.edificioId === edificioId);
  }

  function contratoActivoDePiso(pisoId) {
    return all('contratos').find(c =>
      c.pisoId === pisoId && (c.estado === 'activo' || c.estado === 'renovado')
    ) || null;
  }

  function contratosActivos() {
    return all('contratos').filter(c => c.estado === 'activo' || c.estado === 'renovado');
  }

  function incidenciasAbiertas() {
    return all('incidencias').filter(i => i.estado !== 'resuelta');
  }

  function gastosPendientes() {
    return all('gastos').filter(g => !g.cobrado);
  }

  /* ============ Export público ============ */
  window.Store = {
    COLLECTIONS,
    state,
    subscribe,
    setUser,
    loginWithGoogle,
    logout,
    ensureUserDoc,
    startSubs,
    clearSubs,
    add, update, setAt, remove,
    saveConfig,
    all, byId,
    pisosDeEdificio, contratoActivoDePiso,
    contratosActivos, incidenciasAbiertas, gastosPendientes
  };
})();
