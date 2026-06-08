// ── Componente Modal (Bootstrap) — abre conteúdo num modal e devolve a instância ──

import { el } from '../core/dom.js';

/**
 * @param {object} cfg
 * @param {string} cfg.titulo
 * @param {HTMLElement} cfg.corpo    - conteúdo do modal-body
 * @param {HTMLElement[]} [cfg.rodape] - botões do modal-footer
 * @returns {object} instância do bootstrap.Modal (.show()/.hide())
 */
export function abrirModal({ titulo, corpo, rodape = [] }) {
  const modalEl = el('div', { class: 'modal fade', tabindex: '-1' },
    el('div', { class: 'modal-dialog' },
      el('div', { class: 'modal-content' },
        el('div', { class: 'modal-header' },
          el('h5', { class: 'modal-title' }, titulo),
          el('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal' })
        ),
        el('div', { class: 'modal-body' }, corpo),
        rodape.length ? el('div', { class: 'modal-footer' }, ...rodape) : null
      )
    )
  );

  document.body.appendChild(modalEl);
  const instancia = new window.bootstrap.Modal(modalEl);
  // remove o elemento do DOM quando o modal fecha (limpeza)
  modalEl.addEventListener('hidden.bs.modal', () => modalEl.remove());
  instancia.show();
  return instancia;
}
