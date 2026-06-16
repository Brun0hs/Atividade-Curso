// ── Navbar dinâmica (muda conforme login) ──

import { el } from '../core/dom.js';
import { getUsuarioLogado, logout } from '../core/auth.js';
import { navegar } from '../core/router.js';

const link = (href, texto) =>
  el('li', { class: 'nav-item' }, el('a', { class: 'nav-link', href }, texto));

const itemDropdown = (href, texto) =>
  el('li', {}, el('a', { class: 'dropdown-item', href }, texto));

function itensLogado(usuario) {
  return [
    link('#/', 'Cursos'),
    el('li', { class: 'nav-item dropdown' },
      el('a', { class: 'nav-link dropdown-toggle', role: 'button', 'data-bs-toggle': 'dropdown' }, 'Acadêmico'),
      el('ul', { class: 'dropdown-menu dropdown-menu-end' },
        itemDropdown('#/categorias', 'Categorias'),
        itemDropdown('#/cursos', 'Gestão de Cursos'),
        itemDropdown('#/trilhas', 'Trilhas'),
        itemDropdown('#/modulos', 'Módulos'),
        itemDropdown('#/aulas', 'Aulas')
      )
    ),
    link('#/avaliar', 'Avaliar'),
    link('#/planos', 'Planos'),
    link('#/usuarios', 'Usuários'),
    el('li', { class: 'nav-item dropdown' },
      el('a', { class: 'nav-link dropdown-toggle text-warning fw-bold', role: 'button', 'data-bs-toggle': 'dropdown' },
        (usuario.nomeCompleto || 'Usuário').split(' ')[0]),
      el('ul', { class: 'dropdown-menu dropdown-menu-end' },
        el('li', {},
          el('button', { class: 'dropdown-item', onClick: () => { logout(); navegar('/'); } }, 'Sair')
        )
      )
    ),
  ];
}

function itensDeslogado() {
  return [link('#/login', 'Entrar'), link('#/cadastro', 'Cadastrar-se')];
}

export function Nav() {
  const usuario = getUsuarioLogado();
  return el('nav', { class: 'navbar navbar-expand-lg navbar-dark bg-dark mb-3' },
    el('div', { class: 'container' },
      el('a', { class: 'navbar-brand', href: '#/' }, 'Novus Saber'),
      el('button', {
        class: 'navbar-toggler', type: 'button',
        'data-bs-toggle': 'collapse', 'data-bs-target': '#navMenu',
      },
        el('span', { class: 'navbar-toggler-icon' })
      ),
      el('div', { class: 'collapse navbar-collapse', id: 'navMenu' },
        el('ul', { class: 'navbar-nav ms-auto align-items-lg-center gap-1' },
          ...(usuario ? itensLogado(usuario) : itensDeslogado())
        )
      )
    )
  );
}
