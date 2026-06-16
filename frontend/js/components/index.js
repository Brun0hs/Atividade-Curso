// ── Componentes reutilizáveis (espelham Button/Input/Select/Table do React) ──

import { el } from '../core/dom.js';

export function Button({ value, variant = 'primary', type = 'button', onClick, disabled = false }) {
  return el('div', { class: 'd-grid' },
    el('button', { type, class: `btn btn-${variant}`, disabled, onClick }, value)
  );
}

export function Input({ label, type = 'text', value = '', placeholder = '', error, onInput, visivel = true }) {
  return el('div', { class: 'd-grid' },
    visivel ? el('label', { class: 'form-label' }, label) : null,
    el('input', {
      type,
      class: `form-control mb-1 ${error ? 'is-invalid' : ''}`,
      value,
      placeholder,
      onInput: (e) => onInput && onInput(e.target.value),
    }),
    error ? el('div', { class: 'invalid-feedback d-block mb-2' }, error) : null
  );
}

export function Select({ label, value = '', options = [], placeholder = 'Selecione...', error, onChange, visivel = true }) {
  const select = el('select', {
    class: `form-select mb-1 ${error ? 'is-invalid' : ''}`,
    onChange: (e) => onChange && onChange(e.target.value),
  },
    el('option', { value: '' }, placeholder),
    ...options.map((o) => el('option', { value: o.value }, o.label))
  );
  select.value = value;

  return el('div', { class: 'd-grid' },
    visivel ? el('label', { class: 'form-label' }, label) : null,
    select,
    error ? el('div', { class: 'invalid-feedback d-block mb-2' }, error) : null
  );
}

/**
 * Tabela genérica com ações Editar/Excluir.
 * @param {object} cfg
 * @param {{header: string, valor: (item:any)=>any}[]} cfg.colunas
 * @param {any[]} cfg.dados
 * @param {(item:any)=>void} cfg.onEditar
 * @param {(id:string)=>void} cfg.onExcluir
 * @param {boolean} [cfg.bloqueado]
 */
export function Tabela({ colunas, dados, onEditar, onExcluir, bloqueado = false }) {
  return el('table', { class: 'table table-striped' },
    el('thead', {},
      el('tr', {},
        ...colunas.map((c) => el('th', {}, c.header)),
        el('th', {}, 'AÇÕES')
      )
    ),
    el('tbody', {},
      ...dados.map((item) => el('tr', {},
        ...colunas.map((c) => el('td', {}, c.valor(item))),
        el('td', { class: 'd-flex gap-2' },
          Button({ value: 'Editar', variant: 'warning', disabled: bloqueado, onClick: () => onEditar(item) }),
          Button({ value: 'Excluir', variant: 'danger', disabled: bloqueado, onClick: () => onExcluir(item.id) })
        )
      ))
    )
  );
}
