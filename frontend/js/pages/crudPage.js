// ── Fábrica de página CRUD: Tabela + botão "Novo"; formulário abre em MODAL ──

import { el, mount } from '../core/dom.js';
import { Input, Select, Tabela } from '../components/index.js';
import { abrirModal } from '../components/modal.js';

/**
 * @param {object} config
 * @param {string} config.titulo
 * @param {string} config.tituloSingular
 * @param {object} config.service
 * @param {Function} config.Model - classe da entidade (com static validar)
 * @param {{nome:string,label:string,tipo?:string,placeholder?:string,opcoes?:()=>{value:string,label:string}[]}[]} config.campos
 * @param {{header:string,valor:(item:any)=>any}[]} config.colunas
 */
export function criarPaginaCrud(config) {
  const container = el('div');

  function abrirFormulario(item) {
    const estado = item ? { ...item } : { ...new config.Model() };
    let erros = {};
    const corpo = el('div');

    function renderCampos() {
      mount(corpo, ...config.campos.map((campo) => {
        if (campo.tipo === 'select') {
          return Select({
            label: campo.label,
            value: estado[campo.nome] ?? '',
            error: erros[campo.nome],
            options: campo.opcoes(),
            onChange: (v) => { estado[campo.nome] = v; },
          });
        }
        const ehNumero = campo.tipo === 'number';
        return Input({
          label: campo.label,
          type: campo.tipo || 'text',
          value: estado[campo.nome] ?? '',
          placeholder: campo.placeholder || '',
          error: erros[campo.nome],
          onInput: (v) => { estado[campo.nome] = ehNumero ? Number(v) : v; },
        });
      }));
    }
    renderCampos();

    let instancia;
    const btnCancelar = el('button', { type: 'button', class: 'btn btn-secondary', 'data-bs-dismiss': 'modal' }, 'Cancelar');
    const btnSalvar = el('button', {
      type: 'button',
      class: `btn btn-${item ? 'warning' : 'primary'}`,
      onClick: () => {
        erros = config.Model.validar(estado);
        if (Object.keys(erros).length > 0) { renderCampos(); return; }
        // A classe da entidade modela/normaliza os dados capturados no formulário
        const entidade = new config.Model(estado);
        if (estado.id) config.service.update(estado.id, entidade);
        else config.service.create(entidade);
        instancia.hide();
        rerender();
      },
    }, item ? 'Atualizar' : 'Salvar');

    instancia = abrirModal({
      titulo: `${item ? 'Editar' : 'Novo'} ${config.tituloSingular}`,
      corpo,
      rodape: [btnCancelar, btnSalvar],
    });
  }

  function onExcluir(id) {
    config.service.delete(id);
    rerender();
  }

  function rerender() {
    mount(container,
      el('div', { class: 'row m-4 border-bottom align-items-center' },
        el('div', { class: 'col' }, el('h4', {}, config.titulo)),
        el('div', { class: 'col-auto' },
          el('button', { class: 'btn btn-primary', onClick: () => abrirFormulario(null) }, `+ Novo ${config.tituloSingular}`)
        )
      ),
      el('div', { class: 'm-4' },
        Tabela({
          colunas: config.colunas,
          dados: config.service.findAll(),
          onEditar: abrirFormulario,
          onExcluir,
        })
      )
    );
  }

  rerender();
  return container;
}
