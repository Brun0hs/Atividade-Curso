// ── Home: boas-vindas (deslogado) ou catálogo de cursos + matrícula (logado) ──

import { el, mount } from '../core/dom.js';
import { Button, Select } from '../components/index.js';
import { cursoService, categoriaService, usuarioService, matriculaService } from '../services/index.js';
import { Matricula } from '../models/interacao.models.js';
import { getUsuarioLogado } from '../core/auth.js';

export function HomePage() {
  const usuario = getUsuarioLogado();

  if (!usuario) {
    return el('div', { class: 'row justify-content-center' },
      el('div', { class: 'col-md-6 text-center py-5' },
        el('h4', {}, 'Bem-vindo à Novus Saber'),
        el('p', { class: 'text-muted' }, 'Faça login ou cadastre-se para acessar os cursos.'),
        el('a', { class: 'btn btn-primary me-2', href: '#/login' }, 'Entrar'),
        el('a', { class: 'btn btn-outline-primary', href: '#/cadastro' }, 'Cadastrar-se')
      )
    );
  }

  const container = el('div', { class: 'm-4' });
  let filtro = '';

  const nomeCategoria = (id) => categoriaService.findById(id)?.nome || '—';
  const nomeInstrutor = (id) => usuarioService.findById(id)?.nomeCompleto || '—';
  const estaMatriculado = (idCurso) =>
    matriculaService.findAll().some((m) => m.idUsuario === usuario.id && m.idCurso === idCurso);

  function matricular(idCurso) {
    if (estaMatriculado(idCurso)) return;
    matriculaService.create(new Matricula({ idUsuario: usuario.id, idCurso }));
    rerender();
  }

  function rerender() {
    const categorias = categoriaService.findAll();
    const cursos = cursoService.findAll().filter((c) => !filtro || c.idCategoria === filtro);

    mount(container,
      el('div', { class: 'd-flex flex-wrap gap-2 mb-3 align-items-center justify-content-between' },
        el('h4', { class: 'm-0' }, 'Cursos disponíveis'),
        el('div', { style: 'min-width:250px' },
          Select({
            label: 'Filtrar por categoria',
            value: filtro,
            placeholder: 'Todas as categorias',
            options: categorias.map((c) => ({ value: c.id, label: c.nome })),
            onChange: (v) => { filtro = v; rerender(); },
          })
        )
      ),
      el('div', { class: 'row g-3' },
        cursos.length === 0 ? el('div', { class: 'col-12 text-muted' }, 'Nenhum curso cadastrado.') : null,
        ...cursos.map((curso) => el('div', { class: 'col-12 col-sm-6 col-md-4' },
          el('div', { class: 'card h-100' },
            el('div', { class: 'card-body' },
              el('h5', { class: 'card-title' }, curso.titulo),
              el('p', { class: 'card-text text-muted small mb-1' }, `Instrutor: ${nomeInstrutor(curso.idInstrutor)}`),
              el('p', { class: 'card-text text-muted small mb-1' }, `Categoria: ${nomeCategoria(curso.idCategoria)}`),
              el('span', { class: 'badge bg-secondary' }, curso.nivel),
              el('span', { class: 'badge bg-light text-dark ms-1' }, `${curso.totalAulas} aulas`)
            ),
            el('div', { class: 'card-footer' },
              estaMatriculado(curso.id)
                ? el('a', { class: 'btn btn-sm btn-outline-success w-100', href: `#/cursos/${curso.id}/progresso` }, 'Ver Progresso')
                : Button({ value: 'Matricular-se', onClick: () => matricular(curso.id) })
            )
          )
        ))
      )
    );
  }

  rerender();
  return container;
}
