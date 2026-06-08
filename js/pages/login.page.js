// ── Login ──

import { el, mount } from '../core/dom.js';
import { Button, Input } from '../components/index.js';
import { login } from '../core/auth.js';
import { navegar } from '../core/router.js';

export function LoginPage() {
  const container = el('div', { class: 'row justify-content-center m-4' });
  const estado = { email: '', senha: '' };
  let erro = '';

  function onEntrar() {
    erro = '';
    try {
      login(estado.email, estado.senha);
      navegar('/');
    } catch (e) {
      erro = e.message;
      rerender();
    }
  }

  function rerender() {
    mount(container,
      el('div', { class: 'col-12 col-md-6 col-lg-5' },
        el('div', { class: 'card shadow' },
          el('div', { class: 'card-body bg-light' },
            el('h5', { class: 'card-title' }, 'Login'),
            el('hr'),
            Input({ label: 'E-mail', type: 'email', value: estado.email, placeholder: 'Digite seu e-mail ...', onInput: (v) => { estado.email = v; } }),
            Input({ label: 'Senha', type: 'password', value: estado.senha, placeholder: 'Digite sua senha ...', onInput: (v) => { estado.senha = v; } }),
            erro ? el('div', { class: 'text-danger small mb-2' }, erro) : null
          ),
          el('div', { class: 'card-footer' },
            Button({ value: 'Entrar', onClick: onEntrar }),
            el('p', { class: 'text-center small mt-2 mb-0' }, 'Não tem conta? ', el('a', { href: '#/cadastro' }, 'Cadastre-se'))
          )
        )
      )
    );
  }

  rerender();
  return container;
}
