// ── Cadastro ──

import { el, mount } from '../core/dom.js';
import { Button, Input } from '../components/index.js';
import { cadastrar } from '../core/auth.js';
import { Usuario } from '../models/core.models.js';
import { navegar } from '../core/router.js';

export function CadastroPage() {
  const container = el('div', { class: 'row justify-content-center m-4' });
  const estado = { nomeCompleto: '', email: '', senhaHash: '' };
  let erros = {};
  let erroGeral = '';

  function onCadastrar() {
    erroGeral = '';
    erros = Usuario.validar(estado);
    if (Object.keys(erros).length > 0) { rerender(); return; }
    try {
      cadastrar(estado);
      navegar('/');
    } catch (e) {
      erroGeral = e.message;
      rerender();
    }
  }

  function rerender() {
    mount(container,
      el('div', { class: 'col-12 col-md-6 col-lg-5' },
        el('div', { class: 'card shadow' },
          el('div', { class: 'card-body bg-light' },
            el('h5', { class: 'card-title' }, 'Cadastro'),
            el('hr'),
            Input({ label: 'Nome completo', value: estado.nomeCompleto, error: erros.nomeCompleto, placeholder: 'Digite seu nome ...', onInput: (v) => { estado.nomeCompleto = v; } }),
            Input({ label: 'E-mail', type: 'email', value: estado.email, error: erros.email, placeholder: 'Digite seu e-mail ...', onInput: (v) => { estado.email = v; } }),
            Input({ label: 'Senha', type: 'password', value: estado.senhaHash, error: erros.senhaHash, placeholder: 'Digite sua senha ...', onInput: (v) => { estado.senhaHash = v; } }),
            erroGeral ? el('div', { class: 'text-danger small mb-2' }, erroGeral) : null
          ),
          el('div', { class: 'card-footer' },
            Button({ value: 'Cadastrar', onClick: onCadastrar }),
            el('p', { class: 'text-center small mt-2 mb-0' }, 'Já tem conta? ', el('a', { href: '#/login' }, 'Entrar'))
          )
        )
      )
    );
  }

  rerender();
  return container;
}
