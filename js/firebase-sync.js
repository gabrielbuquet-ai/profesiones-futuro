// ==========================================
// FIREBASE-SYNC.JS - Sincronizacion con Firestore
// ==========================================

var FirebaseSync = (function() {
    'use strict';

    var _userId = null;
    var _sessionStart = Date.now();
    var _locationData = null;
    var _initialized = false;

    // --- Utilidades ---

    function _isFirebaseReady() {
        return typeof window.firebaseDB !== 'undefined' && window.firebaseDB !== null;
    }

    function _generateDeviceFingerprint() {
        var ua = navigator.userAgent || '';
        var screen = window.screen ? (window.screen.width + 'x' + window.screen.height) : '0x0';
        var str = ua + screen;
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    function _generateUserId(nombre) {
        var cleanName = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
        var fingerprint = _generateDeviceFingerprint();
        return cleanName + '_' + fingerprint;
    }

    function _getDeviceInfo() {
        var ua = navigator.userAgent || '';
        var device = 'Desconocido';
        var browser = 'Desconocido';

        // Device detection
        if (/iPhone/.test(ua)) {
            var match = ua.match(/iPhone OS (\d+)/);
            device = 'iPhone' + (match ? ' (iOS ' + match[1] + ')' : '');
        } else if (/iPad/.test(ua)) {
            device = 'iPad';
        } else if (/Android/.test(ua)) {
            var androidMatch = ua.match(/Android [\d.]+/);
            device = androidMatch ? androidMatch[0] : 'Android';
        } else if (/Windows/.test(ua)) {
            device = 'Windows PC';
        } else if (/Mac/.test(ua)) {
            device = 'Mac';
        } else if (/Linux/.test(ua)) {
            device = 'Linux';
        }

        // Browser detection
        if (/CriOS|Chrome/.test(ua) && !/Edg/.test(ua)) {
            browser = 'Chrome';
        } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
            browser = 'Safari';
        } else if (/Firefox/.test(ua)) {
            browser = 'Firefox';
        } else if (/Edg/.test(ua)) {
            browser = 'Edge';
        }

        return device + ' / ' + browser;
    }

    function _getScreenSize() {
        return (window.screen ? window.screen.width : 0) + 'x' + (window.screen ? window.screen.height : 0);
    }

    function _isMobile() {
        return /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent || '');
    }

    // --- Fetch IP/Location ---

    function _fetchLocation() {
        try {
            fetch('https://ipapi.co/json/')
                .then(function(resp) { return resp.json(); })
                .then(function(data) {
                    _locationData = {
                        ip: data.ip || '',
                        pais: data.country_name || '',
                        ciudad: data.city || '',
                        region: data.region || ''
                    };
                    // Update user doc if we already have a userId
                    if (_userId && _isFirebaseReady()) {
                        _updateLocationData();
                    }
                })
                .catch(function() {
                    _locationData = { ip: '', pais: '', ciudad: '', region: '' };
                });
        } catch (e) {
            _locationData = { ip: '', pais: '', ciudad: '', region: '' };
        }
    }

    function _updateLocationData() {
        if (!_isFirebaseReady() || !_userId || !_locationData) return;
        try {
            var docRef = window.firebaseDoc(window.firebaseDB, 'usuarios', _userId);
            window.firebaseUpdateDoc(docRef, {
                ip: _locationData.ip,
                pais: _locationData.pais,
                ciudad: _locationData.ciudad
            }).catch(function() {});
        } catch (e) {}
    }

    // --- User Registration ---

    function registerUser(nombre) {
        if (!_isFirebaseReady()) return;
        try {
            _userId = _generateUserId(nombre);
            var docRef = window.firebaseDoc(window.firebaseDB, 'usuarios', _userId);

            window.firebaseGetDoc(docRef).then(function(docSnap) {
                if (docSnap.exists()) {
                    // Existing user - update access and increment visits
                    var currentData = docSnap.data();
                    var visitas = (currentData.visitas || 0) + 1;
                    window.firebaseUpdateDoc(docRef, {
                        ultimoAcceso: window.firebaseServerTimestamp(),
                        visitas: visitas,
                        dispositivo: _getDeviceInfo(),
                        pantalla: _getScreenSize()
                    }).catch(function() {});
                } else {
                    // New user
                    var userData = {
                        nombre: nombre,
                        fechaCreacion: window.firebaseServerTimestamp(),
                        ultimoAcceso: window.firebaseServerTimestamp(),
                        dispositivo: _getDeviceInfo(),
                        pantalla: _getScreenSize(),
                        visitas: 1,
                        tiempoTotal: 0,
                        ip: (_locationData && _locationData.ip) || '',
                        pais: (_locationData && _locationData.pais) || '',
                        ciudad: (_locationData && _locationData.ciudad) || ''
                    };
                    window.firebaseSetDoc(docRef, userData).catch(function() {});
                }

                // Update location if available
                if (_locationData) {
                    _updateLocationData();
                }
            }).catch(function() {});

            // Analytics event
            _logEvent('user_register', { nombre: nombre });

        } catch (e) {}
    }

    // --- Session tracking on existing user ---

    function initSession(nombre) {
        if (!_isFirebaseReady() || !nombre) return;
        try {
            _userId = _generateUserId(nombre);
            _sessionStart = Date.now();

            var docRef = window.firebaseDoc(window.firebaseDB, 'usuarios', _userId);
            window.firebaseGetDoc(docRef).then(function(docSnap) {
                if (docSnap.exists()) {
                    var currentData = docSnap.data();
                    var visitas = (currentData.visitas || 0) + 1;
                    window.firebaseUpdateDoc(docRef, {
                        ultimoAcceso: window.firebaseServerTimestamp(),
                        visitas: visitas,
                        dispositivo: _getDeviceInfo(),
                        pantalla: _getScreenSize()
                    }).catch(function() {});
                }
                if (_locationData) {
                    _updateLocationData();
                }
            }).catch(function() {});
        } catch (e) {}
    }

    // --- Save session time on unload ---

    function _saveSessionTime() {
        if (!_isFirebaseReady() || !_userId) return;
        try {
            var sessionSeconds = Math.round((Date.now() - _sessionStart) / 1000);
            var docRef = window.firebaseDoc(window.firebaseDB, 'usuarios', _userId);

            // Use navigator.sendBeacon approach won't work with Firestore SDK
            // Instead, do a quick updateDoc (may not always succeed on unload)
            window.firebaseGetDoc(docRef).then(function(docSnap) {
                if (docSnap.exists()) {
                    var data = docSnap.data();
                    var tiempoTotal = (data.tiempoTotal || 0) + sessionSeconds;
                    window.firebaseUpdateDoc(docRef, {
                        tiempoTotal: tiempoTotal,
                        ultimoAcceso: window.firebaseServerTimestamp()
                    }).catch(function() {});
                }
            }).catch(function() {});
        } catch (e) {}
    }

    // --- Score Sync ---

    function saveScore(nombre, juego, profesion, puntos) {
        if (!_isFirebaseReady()) return;
        try {
            var userId = _userId || _generateUserId(nombre);
            var scoreData = {
                userId: userId,
                nombre: nombre,
                juego: juego || '',
                profesion: profesion || '',
                puntos: puntos || 0,
                fecha: window.firebaseServerTimestamp(),
                dispositivo: _getDeviceInfo()
            };

            window.firebaseAddDoc(
                window.firebaseCollection(window.firebaseDB, 'puntuaciones'),
                scoreData
            ).catch(function() {});

            // Analytics
            _logEvent('game_complete', {
                juego: juego,
                profesion: profesion,
                puntos: puntos
            });
        } catch (e) {}
    }

    // --- Analytics Events ---

    function _logEvent(eventName, params) {
        if (!window.firebaseAnalytics || !window.firebaseLogEvent) return;
        try {
            window.firebaseLogEvent(window.firebaseAnalytics, eventName, params || {});
        } catch (e) {}
    }

    function logGameStart(juego, profesion) {
        _logEvent('game_start', { juego: juego, profesion: profesion });
    }

    function logProfessionView(profesion) {
        _logEvent('profession_view', { profesion: profesion });
    }

    function logProfileView() {
        _logEvent('profile_view', {});
    }

    // --- Admin: Fetch data from Firestore ---

    function fetchAllUsers() {
        if (!_isFirebaseReady()) return Promise.resolve([]);
        try {
            var q = window.firebaseQuery(
                window.firebaseCollection(window.firebaseDB, 'usuarios'),
                window.firebaseOrderBy('ultimoAcceso', 'desc')
            );
            return window.firebaseGetDocs(q).then(function(snapshot) {
                var users = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data._id = doc.id;
                    users.push(data);
                });
                return users;
            }).catch(function() { return []; });
        } catch (e) { return Promise.resolve([]); }
    }

    function fetchAllScores() {
        if (!_isFirebaseReady()) return Promise.resolve([]);
        try {
            var q = window.firebaseQuery(
                window.firebaseCollection(window.firebaseDB, 'puntuaciones'),
                window.firebaseOrderBy('fecha', 'desc')
            );
            return window.firebaseGetDocs(q).then(function(snapshot) {
                var scores = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data._id = doc.id;
                    scores.push(data);
                });
                return scores;
            }).catch(function() { return []; });
        } catch (e) { return Promise.resolve([]); }
    }

    function fetchRecentScores(count) {
        if (!_isFirebaseReady()) return Promise.resolve([]);
        try {
            var q = window.firebaseQuery(
                window.firebaseCollection(window.firebaseDB, 'puntuaciones'),
                window.firebaseOrderBy('fecha', 'desc'),
                window.firebaseLimit(count || 50)
            );
            return window.firebaseGetDocs(q).then(function(snapshot) {
                var scores = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data._id = doc.id;
                    scores.push(data);
                });
                return scores;
            }).catch(function() { return []; });
        } catch (e) { return Promise.resolve([]); }
    }

    // --- Init ---

    function init() {
        if (_initialized) return;
        _initialized = true;

        _fetchLocation();

        window.addEventListener('beforeunload', function() {
            _saveSessionTime();
        });
    }

    // Auto-init when script loads
    init();

    // Public API
    return {
        registerUser: registerUser,
        initSession: initSession,
        saveScore: saveScore,
        logGameStart: logGameStart,
        logProfessionView: logProfessionView,
        logProfileView: logProfileView,
        fetchAllUsers: fetchAllUsers,
        fetchAllScores: fetchAllScores,
        fetchRecentScores: fetchRecentScores,
        getUserId: function() { return _userId; }
    };
})();
