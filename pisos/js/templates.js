/* Helpers para inflar templates y construir formularios. */
(function () {
  'use strict';

  function inflate(id) {
    const tpl = document.getElementById(id);
    if (!tpl) throw new Error('Template no encontrada: ' + id);
    return tpl.content.cloneNode(true);
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(k => {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k.startsWith('on') && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        }
        else if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null || c === false) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function fmtMoney(n) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }
  function fmtPct(n) {
    return Number(n || 0).toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' %';
  }
  function fmtDate(d) {
    if (!d) return '—';
    if (typeof d === 'string') d = new Date(d);
    if (typeof d === 'object' && typeof d.seconds === 'number') d = new Date(d.seconds * 1000);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  function dateInputValue(d) {
    if (!d) return '';
    if (typeof d === 'string') d = new Date(d);
    if (typeof d === 'object' && typeof d.seconds === 'number') d = new Date(d.seconds * 1000);
    if (!d || isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }

  /* ===== Modales / formularios genéricos ===== */
  function openModal(html) {
    const root = document.getElementById('modalRoot');
    const content = document.getElementById('modalContent');
    content.innerHTML = '';
    if (typeof html === 'string') content.innerHTML = html;
    else content.appendChild(html);
    root.hidden = false;
    root.querySelectorAll('[data-close]').forEach(b => {
      b.addEventListener('click', closeModal, { once: true });
    });
    return content;
  }
  function closeModal() {
    document.getElementById('modalRoot').hidden = true;
    document.getElementById('modalContent').innerHTML = '';
  }

  function toast(msg, type) {
    const root = document.getElementById('toastRoot');
    const t = el('div', { class: 'toast ' + (type || '') , text: msg });
    root.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2800);
  }

  function selectOptions(items, valueKey, labelFn, includeEmpty) {
    const html = (includeEmpty ? '<option value="">' + includeEmpty + '</option>' : '') +
      items.map(i => '<option value="' + i[valueKey] + '">' + labelFn(i) + '</option>').join('');
    return html;
  }

  function confirmDialog(message, onConfirm) {
    const wrap = el('div');
    wrap.appendChild(el('h2', { text: 'Confirmar' }));
    wrap.appendChild(el('p', { text: message }));
    const actions = el('div', { class: 'modal-actions' });
    actions.appendChild(el('button', { class: 'btn btn-ghost', text: 'Cancelar', onclick: closeModal }));
    actions.appendChild(el('button', { class: 'btn btn-danger', text: 'Eliminar', onclick: () => { closeModal(); onConfirm(); } }));
    wrap.appendChild(actions);
    openModal(wrap);
  }

  window.Tpl = {
    inflate, el, fmtMoney, fmtPct, fmtDate, dateInputValue,
    openModal, closeModal, toast, selectOptions, confirmDialog
  };
})();
