// ── Trilhas: CRUD de trilha + vínculo de cursos à trilha — formulários em MODAL ──

import { el, mount } from '../core/dom.js';
import { Button, Input, Select, Tabela } from '../components/index.js';
import { abrirModal } from '../components/modal.js';
import { trilhaService, trilhaCursoService, cursoService, categoriaService } from '../services/index.js';
import { Trilha, TrilhaCurso } from '../models/curadoria.models.js';

export function TrilhaPage() {
  const container = el('div');

  const tituloTrilha = (id) => trilhaService.findById(id)?.titulo || '—';
  const tituloCurso = (id) => cursoService.findById(id)?.titulo || '—';
  const nomeCategoria = (id) => categoriaService.findById(id)?.nome || '—';

  // ----- Modal: Trilha -----
  function abrirFormTrilha(item) {
    const estado = item ? { ...item } : { ...new Trilha() };
    let erros = {};
    const corpo = el('div');

    function render() {
      mount(corpo,
        Input({ label: 'Título', value: estado.titulo ?? '', error: erros.titulo, placeholder: 'Digite o título ...', onInput: (v) => { estado.titulo = v; } }),
        Input({ label: 'Descrição', value: estado.descricao ?? '', error: erros.descricao, placeholder: 'Digite a descrição ...', onInput: (v) => { estado.descricao = v; } }),
        Select({ label: 'Categoria', value: estado.idCategoria ?? '', error: erros.idCategoria, options: categoriaService.findAll().map((c) => ({ value: c.id, label: c.nome })), onChange: (v) => { estado.idCategoria = v; } })
      );
    }
    render();

    let instancia;
    const cancelar = el('button', { type: 'button', class: 'btn btn-secondary', 'data-bs-dismiss': 'modal' }, 'Cancelar');
    const salvar = el('button', {
      type: 'button', class: `btn btn-${item ? 'warning' : 'primary'}`,
      onClick: () => {
        erros = Trilha.validar(estado);
        if (Object.keys(erros).length > 0) { render(); return; }
        const trilha = new Trilha(estado);
        if (estado.id) trilhaService.update(estado.id, trilha);
        else trilhaService.create(trilha);
        instancia.hide();
        rerender();
      },
    }, item ? 'Atualizar' : 'Salvar');

    instancia = abrirModal({ titulo: item ? 'Editar Trilha' : 'Nova Trilha', corpo, rodape: [cancelar, salvar] });
  }

  function onExcluirTrilha(id) { trilhaService.delete(id); rerender(); }

  // ----- Modal: Trilha-Curso -----
  function abrirFormTrilhaCurso() {
    const estado = { idTrilha: '', idCurso: '', ordem: 1 };
    let erros = {};
    const corpo = el('div');

    function render() {
      mount(corpo,
        Select({ label: 'Trilha', value: estado.idTrilha, error: erros.idTrilha, options: trilhaService.findAll().map((t) => ({ value: t.id, label: t.titulo })), onChange: (v) => { estado.idTrilha = v; } }),
        Select({ label: 'Curso', value: estado.idCurso, error: erros.idCurso, options: cursoService.findAll().map((c) => ({ value: c.id, label: c.titulo })), onChange: (v) => { estado.idCurso = v; } }),
        Input({ label: 'Ordem', type: 'number', value: estado.ordem, error: erros.ordem, placeholder: '1', onInput: (v) => { estado.ordem = Number(v); } })
      );
    }
    render();

    let instancia;
    const cancelar = el('button', { type: 'button', class: 'btn btn-secondary', 'data-bs-dismiss': 'modal' }, 'Cancelar');
    const adicionar = el('button', {
      type: 'button', class: 'btn btn-primary',
      onClick: () => {
        erros = TrilhaCurso.validar(estado);
        if (Object.keys(erros).length > 0) { render(); return; }
        trilhaCursoService.create(new TrilhaCurso(estado));
        instancia.hide();
        rerender();
      },
    }, 'Adicionar');

    instancia = abrirModal({ titulo: 'Adicionar Curso à Trilha', corpo, rodape: [cancelar, adicionar] });
  }

  function onExcluirTC(id) { trilhaCursoService.delete(id); rerender(); }

  function rerender() {
    mount(container,
      el('div', { class: 'row m-4 border-bottom align-items-center' },
        el('div', { class: 'col' }, el('h4', {}, 'Trilhas')),
        el('div', { class: 'col-auto' }, el('button', { class: 'btn btn-primary', onClick: () => abrirFormTrilha(null) }, '+ Nova Trilha'))
      ),
      el('div', { class: 'm-4' },
        Tabela({
          colunas: [
            { header: 'TÍTULO', valor: (t) => t.titulo },
            { header: 'CATEGORIA', valor: (t) => nomeCategoria(t.idCategoria) },
          ],
          dados: trilhaService.findAll(),
          onEditar: abrirFormTrilha,
          onExcluir: onExcluirTrilha,
        })
      ),
      el('div', { class: 'row m-4 border-bottom align-items-center' },
        el('div', { class: 'col' }, el('h5', {}, 'Cursos nas Trilhas')),
        el('div', { class: 'col-auto' }, el('button', { class: 'btn btn-secondary', onClick: abrirFormTrilhaCurso }, '+ Adicionar Curso à Trilha'))
      ),
      el('div', { class: 'm-4' },
        el('table', { class: 'table table-striped' },
          el('thead', {}, el('tr', {}, el('th', {}, 'TRILHA'), el('th', {}, 'CURSO'), el('th', {}, 'ORDEM'), el('th', {}, 'AÇÕES'))),
          el('tbody', {},
            ...trilhaCursoService.findAll().map((tc) => el('tr', {},
              el('td', {}, tituloTrilha(tc.idTrilha)),
              el('td', {}, tituloCurso(tc.idCurso)),
              el('td', {}, tc.ordem),
              el('td', {}, Button({ value: 'Excluir', variant: 'danger', onClick: () => onExcluirTC(tc.id) }))
            ))
          )
        )
      )
    );
  }

  rerender();
  return container;
}
