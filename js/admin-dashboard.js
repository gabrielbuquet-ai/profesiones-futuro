// ==========================================
// ADMIN-DASHBOARD.JS - Panel de administracion oculto
// ==========================================

var AdminDashboard = (function() {
    'use strict';

    var _tapCount = 0;
    var _tapTimer = null;
    var _isOpen = false;
    var ADMIN_PASSWORD = 'admin2026';
    var TAP_THRESHOLD = 5;
    var TAP_TIMEOUT = 2000; // 2 seconds to complete 5 taps

    // --- Admin Styles ---

    function _injectStyles() {
        if (document.getElementById('admin-dashboard-styles')) return;
        var style = document.createElement('style');
        style.id = 'admin-dashboard-styles';
        style.textContent = ''
            + '#admin-dashboard-backdrop{position:fixed;top:0;left:0;width:100%;height:100%;background:#0f0f1a;z-index:99999;overflow-y:auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#e0e0e0;}'
            + '#admin-dashboard{max-width:1000px;margin:0 auto;padding:20px;}'
            + '.admin-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;}'
            + '.admin-header h1{font-size:1.5em;color:#a78bfa;margin:0;}'
            + '.admin-close-btn{background:#ef4444;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:0.95em;font-weight:bold;}'
            + '.admin-section{background:#1a1a2e;border:1px solid #2d2d44;border-radius:12px;padding:20px;margin-bottom:20px;}'
            + '.admin-section h2{color:#a78bfa;font-size:1.2em;margin:0 0 16px 0;border-bottom:1px solid #2d2d44;padding-bottom:8px;}'
            + '.admin-stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:16px;}'
            + '.admin-stat-card{background:#22223a;border-radius:10px;padding:16px;text-align:center;}'
            + '.admin-stat-card .stat-value{font-size:1.8em;font-weight:bold;color:#818cf8;}'
            + '.admin-stat-card .stat-label{font-size:0.8em;color:#9ca3af;margin-top:4px;}'
            + '.admin-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}'
            + '.admin-table{width:100%;border-collapse:collapse;font-size:0.85em;min-width:600px;}'
            + '.admin-table th{background:#22223a;color:#a78bfa;padding:10px 8px;text-align:left;cursor:pointer;white-space:nowrap;user-select:none;}'
            + '.admin-table th:hover{background:#2d2d50;}'
            + '.admin-table td{padding:8px;border-bottom:1px solid #1f1f35;}'
            + '.admin-table tr:nth-child(even){background:rgba(255,255,255,0.02);}'
            + '.admin-table tr:nth-child(odd){background:rgba(255,255,255,0.05);}'
            + '.admin-export-btn{background:#7c3aed;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:0.9em;margin-right:10px;margin-top:8px;}'
            + '.admin-export-btn:hover{background:#6d28d9;}'
            + '.admin-canvas-wrap{background:#22223a;border-radius:10px;padding:16px;margin-bottom:16px;}'
            + '.admin-loading{text-align:center;padding:40px;color:#9ca3af;font-size:1.1em;}'
            + '.admin-tab-bar{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}'
            + '.admin-tab{background:#22223a;color:#9ca3af;border:1px solid #2d2d44;padding:8px 18px;border-radius:8px;cursor:pointer;font-size:0.9em;}'
            + '.admin-tab.active{background:#7c3aed;color:#fff;border-color:#7c3aed;}'
            + '@media(max-width:600px){#admin-dashboard{padding:12px;}.admin-table{font-size:0.75em;}.admin-stat-card .stat-value{font-size:1.3em;}}';
        document.head.appendChild(style);
    }

    // --- Secret trigger ---

    function _setupTrigger() {
        var title = document.querySelector('.app-title');
        if (!title) return;

        title.addEventListener('click', function() {
            _tapCount++;
            if (_tapTimer) clearTimeout(_tapTimer);
            _tapTimer = setTimeout(function() { _tapCount = 0; }, TAP_TIMEOUT);

            if (_tapCount >= TAP_THRESHOLD) {
                _tapCount = 0;
                clearTimeout(_tapTimer);
                _showPasswordPrompt();
            }
        });
    }

    function _showPasswordPrompt() {
        var pwd = prompt('Introduce la clave de administrador:');
        if (pwd === ADMIN_PASSWORD) {
            _openDashboard();
        } else if (pwd !== null) {
            alert('Clave incorrecta.');
        }
    }

    // --- Dashboard ---

    function _openDashboard() {
        if (_isOpen) return;
        _isOpen = true;
        _injectStyles();

        var backdrop = document.createElement('div');
        backdrop.id = 'admin-dashboard-backdrop';
        backdrop.innerHTML = '<div id="admin-dashboard"><div class="admin-loading">Cargando datos...</div></div>';
        document.body.appendChild(backdrop);

        // Prevent background scrolling
        document.body.style.overflow = 'hidden';

        _loadDashboardData();
    }

    function _closeDashboard() {
        var el = document.getElementById('admin-dashboard-backdrop');
        if (el) el.remove();
        document.body.style.overflow = '';
        _isOpen = false;
    }

    function _loadDashboardData() {
        var usersPromise = (typeof FirebaseSync !== 'undefined') ? FirebaseSync.fetchAllUsers() : Promise.resolve([]);
        var scoresPromise = (typeof FirebaseSync !== 'undefined') ? FirebaseSync.fetchAllScores() : Promise.resolve([]);

        Promise.all([usersPromise, scoresPromise]).then(function(results) {
            var users = results[0];
            var scores = results[1];
            _renderDashboard(users, scores);
        }).catch(function() {
            _renderDashboard([], []);
        });
    }

    function _renderDashboard(users, scores) {
        var container = document.getElementById('admin-dashboard');
        if (!container) return;

        var html = '';

        // Header
        html += '<div class="admin-header">'
            + '<h1>Panel de Administracion</h1>'
            + '<button class="admin-close-btn" id="admin-close-btn">Cerrar</button>'
            + '</div>';

        // Tab bar
        html += '<div class="admin-tab-bar">'
            + '<button class="admin-tab active" data-tab="users">Usuarios</button>'
            + '<button class="admin-tab" data-tab="games">Juegos</button>'
            + '<button class="admin-tab" data-tab="activity">Actividad</button>'
            + '<button class="admin-tab" data-tab="export">Exportar</button>'
            + '</div>';

        // Tab contents
        html += '<div id="admin-tab-users" class="admin-tab-content">' + _renderUsersSection(users) + '</div>';
        html += '<div id="admin-tab-games" class="admin-tab-content" style="display:none;">' + _renderGamesSection(scores) + '</div>';
        html += '<div id="admin-tab-activity" class="admin-tab-content" style="display:none;">' + _renderActivitySection(users, scores) + '</div>';
        html += '<div id="admin-tab-export" class="admin-tab-content" style="display:none;">' + _renderExportSection() + '</div>';

        container.innerHTML = html;

        // Event listeners
        document.getElementById('admin-close-btn').addEventListener('click', _closeDashboard);

        // Tabs
        var tabs = container.querySelectorAll('.admin-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                var tabName = tab.getAttribute('data-tab');
                var contents = container.querySelectorAll('.admin-tab-content');
                contents.forEach(function(c) { c.style.display = 'none'; });
                var target = document.getElementById('admin-tab-' + tabName);
                if (target) target.style.display = 'block';
            });
        });

        // Sortable tables
        _initSortableTables(container);

        // Export buttons
        var exportUsersBtn = document.getElementById('admin-export-users');
        var exportScoresBtn = document.getElementById('admin-export-scores');
        if (exportUsersBtn) {
            exportUsersBtn.addEventListener('click', function() { _exportCSV(users, 'usuarios.csv', 'users'); });
        }
        if (exportScoresBtn) {
            exportScoresBtn.addEventListener('click', function() { _exportCSV(scores, 'puntuaciones.csv', 'scores'); });
        }

        // Draw charts
        _drawPopularGamesChart(scores);
    }

    // --- Section A: Users ---

    function _renderUsersSection(users) {
        var now = new Date();
        var today = now.toISOString().slice(0, 10);
        var weekAgo = new Date(now.getTime() - 7 * 86400000);
        var monthAgo = new Date(now.getTime() - 30 * 86400000);

        var usersToday = 0, usersWeek = 0, usersMonth = 0;
        users.forEach(function(u) {
            var ts = _getTimestamp(u.ultimoAcceso);
            if (!ts) return;
            var d = new Date(ts);
            if (d.toISOString().slice(0, 10) === today) usersToday++;
            if (d >= weekAgo) usersWeek++;
            if (d >= monthAgo) usersMonth++;
        });

        var html = '<div class="admin-section">'
            + '<h2>Estadisticas de Usuarios</h2>'
            + '<div class="admin-stat-grid">'
            + _statCard(users.length, 'Total usuarios')
            + _statCard(usersToday, 'Hoy')
            + _statCard(usersWeek, 'Esta semana')
            + _statCard(usersMonth, 'Este mes')
            + '</div>'
            + '<div class="admin-table-wrap"><table class="admin-table sortable" id="table-users">'
            + '<thead><tr>'
            + '<th data-col="nombre">Nombre</th>'
            + '<th data-col="dispositivo">Dispositivo</th>'
            + '<th data-col="pais">Pais</th>'
            + '<th data-col="ciudad">Ciudad</th>'
            + '<th data-col="visitas" data-type="num">Visitas</th>'
            + '<th data-col="tiempoTotal" data-type="num">Tiempo (min)</th>'
            + '<th data-col="ultimoAcceso">Ultimo acceso</th>'
            + '</tr></thead><tbody>';

        users.forEach(function(u) {
            var tiempo = Math.round((u.tiempoTotal || 0) / 60);
            var ultimo = _formatTimestamp(u.ultimoAcceso);
            html += '<tr>'
                + '<td>' + _esc(u.nombre || '') + '</td>'
                + '<td>' + _esc(u.dispositivo || '') + '</td>'
                + '<td>' + _esc(u.pais || '') + '</td>'
                + '<td>' + _esc(u.ciudad || '') + '</td>'
                + '<td>' + (u.visitas || 0) + '</td>'
                + '<td>' + tiempo + '</td>'
                + '<td>' + ultimo + '</td>'
                + '</tr>';
        });

        html += '</tbody></table></div></div>';
        return html;
    }

    // --- Section B: Games ---

    function _renderGamesSection(scores) {
        var totalGames = scores.length;
        var gameCount = {};
        var gameScores = {};

        scores.forEach(function(s) {
            var game = s.juego || 'desconocido';
            gameCount[game] = (gameCount[game] || 0) + 1;
            if (!gameScores[game]) gameScores[game] = [];
            gameScores[game].push(s.puntos || 0);
        });

        var html = '<div class="admin-section">'
            + '<h2>Estadisticas de Juegos</h2>'
            + '<div class="admin-stat-grid">'
            + _statCard(totalGames, 'Total partidas')
            + _statCard(Object.keys(gameCount).length, 'Juegos distintos')
            + '</div>';

        // Average scores per game
        html += '<div class="admin-table-wrap"><table class="admin-table" id="table-game-avg">'
            + '<thead><tr><th>Juego</th><th>Partidas</th><th>Puntuacion media</th></tr></thead><tbody>';

        var gameNames = Object.keys(gameCount).sort(function(a, b) { return gameCount[b] - gameCount[a]; });
        gameNames.forEach(function(g) {
            var avg = Math.round(gameScores[g].reduce(function(s, v) { return s + v; }, 0) / gameScores[g].length);
            html += '<tr><td>' + _esc(g) + '</td><td>' + gameCount[g] + '</td><td>' + avg + '</td></tr>';
        });

        html += '</tbody></table></div>';

        // Canvas for chart
        html += '<div class="admin-canvas-wrap">'
            + '<h3 style="color:#a78bfa;margin:0 0 12px 0;">Juegos mas populares</h3>'
            + '<canvas id="admin-chart-games" width="900" height="350" style="width:100%;height:auto;"></canvas>'
            + '</div>';

        // Recent 50 scores
        html += '<h3 style="color:#a78bfa;margin:16px 0 10px 0;">Ultimas 50 partidas</h3>'
            + '<div class="admin-table-wrap"><table class="admin-table sortable" id="table-recent-scores">'
            + '<thead><tr>'
            + '<th data-col="nombre">Nombre</th>'
            + '<th data-col="juego">Juego</th>'
            + '<th data-col="profesion">Profesion</th>'
            + '<th data-col="puntos" data-type="num">Puntos</th>'
            + '<th data-col="dispositivo">Dispositivo</th>'
            + '<th data-col="fecha">Fecha</th>'
            + '</tr></thead><tbody>';

        var recent = scores.slice(0, 50);
        recent.forEach(function(s) {
            html += '<tr>'
                + '<td>' + _esc(s.nombre || '') + '</td>'
                + '<td>' + _esc(s.juego || '') + '</td>'
                + '<td>' + _esc(s.profesion || '') + '</td>'
                + '<td>' + (s.puntos || 0) + '</td>'
                + '<td>' + _esc(s.dispositivo || '') + '</td>'
                + '<td>' + _formatTimestamp(s.fecha) + '</td>'
                + '</tr>';
        });

        html += '</tbody></table></div></div>';
        return html;
    }

    // --- Section C: Activity ---

    function _renderActivitySection(users, scores) {
        var now = new Date();
        var dayAgo = new Date(now.getTime() - 24 * 3600000);

        var active24h = 0;
        var countryCounts = {};
        var cityCounts = {};
        var mobileCount = 0;
        var desktopCount = 0;
        var browserCounts = {};

        users.forEach(function(u) {
            var ts = _getTimestamp(u.ultimoAcceso);
            if (ts && new Date(ts) >= dayAgo) active24h++;

            var pais = u.pais || 'Desconocido';
            countryCounts[pais] = (countryCounts[pais] || 0) + 1;

            var ciudad = u.ciudad || 'Desconocida';
            cityCounts[ciudad] = (cityCounts[ciudad] || 0) + 1;

            var disp = (u.dispositivo || '').toLowerCase();
            if (/iphone|ipad|android|mobile/.test(disp)) {
                mobileCount++;
            } else {
                desktopCount++;
            }

            var browser = 'Otro';
            if (/chrome/.test(disp)) browser = 'Chrome';
            else if (/safari/.test(disp)) browser = 'Safari';
            else if (/firefox/.test(disp)) browser = 'Firefox';
            else if (/edge/.test(disp)) browser = 'Edge';
            browserCounts[browser] = (browserCounts[browser] || 0) + 1;
        });

        var html = '<div class="admin-section">'
            + '<h2>Actividad en Vivo</h2>'
            + '<div class="admin-stat-grid">'
            + _statCard(active24h, 'Activos (24h)')
            + _statCard(mobileCount, 'Movil')
            + _statCard(desktopCount, 'Escritorio')
            + '</div>';

        // Geographic distribution
        html += '<h3 style="color:#a78bfa;margin:16px 0 10px 0;">Distribucion geografica</h3>'
            + '<div class="admin-table-wrap"><table class="admin-table">'
            + '<thead><tr><th>Pais</th><th>Ciudad</th><th>Usuarios</th></tr></thead><tbody>';

        // Merge country+city
        var geoEntries = [];
        users.forEach(function(u) {
            var key = (u.pais || 'Desconocido') + '|' + (u.ciudad || 'Desconocida');
            var found = false;
            for (var i = 0; i < geoEntries.length; i++) {
                if (geoEntries[i].key === key) { geoEntries[i].count++; found = true; break; }
            }
            if (!found) geoEntries.push({ key: key, pais: u.pais || 'Desconocido', ciudad: u.ciudad || 'Desconocida', count: 1 });
        });
        geoEntries.sort(function(a, b) { return b.count - a.count; });
        geoEntries.forEach(function(g) {
            html += '<tr><td>' + _esc(g.pais) + '</td><td>' + _esc(g.ciudad) + '</td><td>' + g.count + '</td></tr>';
        });
        html += '</tbody></table></div>';

        // Browser breakdown
        html += '<h3 style="color:#a78bfa;margin:16px 0 10px 0;">Navegadores</h3>'
            + '<div class="admin-table-wrap"><table class="admin-table">'
            + '<thead><tr><th>Navegador</th><th>Usuarios</th></tr></thead><tbody>';
        Object.keys(browserCounts).sort(function(a, b) { return browserCounts[b] - browserCounts[a]; }).forEach(function(b) {
            html += '<tr><td>' + _esc(b) + '</td><td>' + browserCounts[b] + '</td></tr>';
        });
        html += '</tbody></table></div></div>';

        return html;
    }

    // --- Section D: Export ---

    function _renderExportSection() {
        return '<div class="admin-section">'
            + '<h2>Exportar Datos</h2>'
            + '<p style="color:#9ca3af;margin-bottom:16px;">Descarga los datos en formato CSV.</p>'
            + '<button class="admin-export-btn" id="admin-export-users">Exportar Usuarios CSV</button>'
            + '<button class="admin-export-btn" id="admin-export-scores">Exportar Puntuaciones CSV</button>'
            + '</div>';
    }

    // --- Chart drawing ---

    function _drawPopularGamesChart(scores) {
        var canvas = document.getElementById('admin-chart-games');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var displayW = canvas.clientWidth;
        var displayH = canvas.clientHeight || 300;
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
        ctx.scale(dpr, dpr);

        var gameCount = {};
        scores.forEach(function(s) {
            var g = s.juego || 'desconocido';
            gameCount[g] = (gameCount[g] || 0) + 1;
        });

        var entries = Object.keys(gameCount).map(function(k) { return { name: k, count: gameCount[k] }; });
        entries.sort(function(a, b) { return b.count - a.count; });
        entries = entries.slice(0, 15);

        if (entries.length === 0) {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '14px sans-serif';
            ctx.fillText('Sin datos de juegos', displayW / 2 - 60, displayH / 2);
            return;
        }

        var maxVal = entries[0].count;
        var barPadding = 8;
        var leftMargin = 120;
        var rightMargin = 50;
        var topMargin = 10;
        var bottomMargin = 10;
        var barHeight = Math.min(28, (displayH - topMargin - bottomMargin) / entries.length - barPadding);
        var chartWidth = displayW - leftMargin - rightMargin;

        var colors = ['#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185', '#f97316', '#facc15', '#34d399', '#22d3ee', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9'];

        entries.forEach(function(entry, i) {
            var y = topMargin + i * (barHeight + barPadding);
            var barW = (entry.count / maxVal) * chartWidth;

            // Label
            ctx.fillStyle = '#9ca3af';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(entry.name, leftMargin - 8, y + barHeight / 2);

            // Bar
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.roundRect(leftMargin, y, Math.max(barW, 4), barHeight, 4);
            ctx.fill();

            // Count
            ctx.fillStyle = '#e0e0e0';
            ctx.textAlign = 'left';
            ctx.fillText(entry.count, leftMargin + barW + 6, y + barHeight / 2);
        });
    }

    // --- Sortable Tables ---

    function _initSortableTables(container) {
        var tables = container.querySelectorAll('table.sortable');
        tables.forEach(function(table) {
            var headers = table.querySelectorAll('th[data-col]');
            headers.forEach(function(th, colIndex) {
                th.addEventListener('click', function() {
                    _sortTable(table, colIndex, th.getAttribute('data-type') === 'num');
                });
            });
        });
    }

    function _sortTable(table, colIndex, isNumeric) {
        var tbody = table.querySelector('tbody');
        if (!tbody) return;
        var rows = Array.from(tbody.querySelectorAll('tr'));

        var th = table.querySelectorAll('th')[colIndex];
        var asc = th.getAttribute('data-sort') !== 'asc';
        // Reset all
        table.querySelectorAll('th').forEach(function(h) { h.removeAttribute('data-sort'); });
        th.setAttribute('data-sort', asc ? 'asc' : 'desc');

        rows.sort(function(a, b) {
            var aVal = a.cells[colIndex] ? a.cells[colIndex].textContent.trim() : '';
            var bVal = b.cells[colIndex] ? b.cells[colIndex].textContent.trim() : '';
            if (isNumeric) {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
            }
            if (aVal < bVal) return asc ? -1 : 1;
            if (aVal > bVal) return asc ? 1 : -1;
            return 0;
        });

        rows.forEach(function(row) { tbody.appendChild(row); });
    }

    // --- CSV Export ---

    function _exportCSV(data, filename, type) {
        if (!data || data.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }

        var headers, rows;
        if (type === 'users') {
            headers = ['Nombre', 'Dispositivo', 'Pais', 'Ciudad', 'Visitas', 'Tiempo Total (s)', 'IP', 'Ultimo Acceso', 'Fecha Creacion'];
            rows = data.map(function(u) {
                return [
                    u.nombre || '',
                    u.dispositivo || '',
                    u.pais || '',
                    u.ciudad || '',
                    u.visitas || 0,
                    u.tiempoTotal || 0,
                    u.ip || '',
                    _formatTimestamp(u.ultimoAcceso),
                    _formatTimestamp(u.fechaCreacion)
                ];
            });
        } else {
            headers = ['Nombre', 'Juego', 'Profesion', 'Puntos', 'Dispositivo', 'Fecha', 'User ID'];
            rows = data.map(function(s) {
                return [
                    s.nombre || '',
                    s.juego || '',
                    s.profesion || '',
                    s.puntos || 0,
                    s.dispositivo || '',
                    _formatTimestamp(s.fecha),
                    s.userId || ''
                ];
            });
        }

        var csvContent = '\uFEFF'; // BOM for Excel
        csvContent += headers.map(_csvEscape).join(',') + '\n';
        rows.forEach(function(row) {
            csvContent += row.map(_csvEscape).join(',') + '\n';
        });

        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // --- Utility functions ---

    function _statCard(value, label) {
        return '<div class="admin-stat-card"><div class="stat-value">' + value + '</div><div class="stat-label">' + label + '</div></div>';
    }

    function _esc(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function _csvEscape(val) {
        var str = String(val);
        if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    function _getTimestamp(field) {
        if (!field) return null;
        if (field.toDate) return field.toDate().getTime(); // Firestore Timestamp
        if (field.seconds) return field.seconds * 1000;
        if (typeof field === 'string') return new Date(field).getTime();
        if (typeof field === 'number') return field;
        return null;
    }

    function _formatTimestamp(field) {
        var ts = _getTimestamp(field);
        if (!ts) return '-';
        var d = new Date(ts);
        return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    // --- Init ---

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', _setupTrigger);
        } else {
            _setupTrigger();
        }
    }

    init();

    return {
        open: _openDashboard,
        close: _closeDashboard
    };
})();
