// ── Avaliar Curso (nota 1-5 + comentário) — formulário em MODAL ──

import { el, mount } from '../core/dom.js';
import { Input, Select } from '../components/index.js';
import { abrirModal } from '../components/modal.js';
import { avaliacaoService, cursoService } from '../services/index.js';
import { Avaliacao } from '../models/interacao.models.js';
import { getUsuarioLogado } from '../core/auth.js';

export function AvaliacaoPage() {
  const usuario = getUsuarioLogado();
  const container = el('div');
  const tituloCurso = (id) => cursoService.findById(id)?.titulo || '—';

  function abrirFormulario() {
    const estado = { idCurso: '', nota: 5, comentario: '' };
    let erros = {};
    let erroGeral = '';
    const corpo = el('div');

    function render() {
      mount(corpo,
        Select({ label: 'Curso', value: estado.idCurso, error: erros.idCurso, options: cursoService.findAll().map((c) => ({ value: c.id, label: c.titulo })), onChange: (v) => { estado.idCurso = v; } }),
        Input({ label: 'Nota (1-5)', type: 'number', value: estado.nota, error: erros.nota, onInput: (v) => { estado.nota = Number(v); } }),
        el('label', { class: 'form-label' }, 'Comentário'),
        el('textarea', { class: 'form-control mb-1', rows: '2', value: estado.comentario, onInput: (e) => { estado.comentario = e.target.value; } }),
        erroGeral ? el('div', { class: 'text-danger small my-2' }, erroGeral) : null
      );
    }
    render();

    let instancia;
    const btnCancelar = el('button', { type: 'button', class: 'btn btn-secondary', 'data-bs-dismiss': 'modal' }, 'Cancelar');
    const btnEnviar = el('button', {
      type: 'button', class: 'btn btn-warning',
      onClick: () => {
        erroGeral = '';
        erros = Avaliacao.validar(estado);
        if (Object.keys(erros).length > 0) { render(); return; }
        if (avaliacaoService.findAll().some((a) => a.idUsuario === usuario.id && a.idCurso === estado.idCurso)) {
          erroGeral = 'Você já avaliou este curso.';
          render();
          return;
        }
        avaliacaoService.create(new Avaliacao({ ...estado, idUsuario: usuario.id }));
        instancia.hide();
        rerender();
      },
    }, 'Enviar Avaliação');

    instancia = abrirModal({ titulo: 'Nova Avaliação', corpo, rodape: [btnCancelar, btnEnviar] });
  }

  function rerender() {
    mount(container,
      el('div', { class: 'row m-4 border-bottom align-items-center' },
        el('div', { class: 'col' }, el('h4', {}, 'Avaliar Curso')),
        el('div', { class: 'col-auto' },
          el('button', { class: 'btn btn-warning', onClick: abrirFormulario }, '+ Nova Avaliação')
        )
      ),
      el('div', { class: 'm-4' },
        el('table', { class: 'table table-striped' },
          el('thead', {}, el('tr', {}, el('th', {}, 'CURSO'), el('th', {}, 'NOTA'), el('th', {}, 'COMENTÁRIO'))),
          el('tbody', {},
            ...avaliacaoService.findAll().map((a) => el('tr', {},
              el('td', {}, tituloCurso(a.idCurso)),
              el('td', {}, `${a.nota} ⭐`),
              el('td', {}, a.comentario || '—')
            ))
          )
        )
      )
    );
  }

  rerender();
  return container;
}
