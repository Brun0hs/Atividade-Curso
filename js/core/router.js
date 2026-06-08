// ── Roteador por hash (com rota privada e parâmetros de rota) ──

import { mount } from './dom.js';
import { Nav } from '../components/nav.js';
import { getUsuarioLogado } from './auth.js';

let _rotas = {};
let _nav = null;
let _app = null;

/**
 * @param {object} cfg
 * @param {HTMLElement} cfg.nav - container da navbar
 * @param {HTMLElement} cfg.app - container das páginas
 * @param {Record<string, {pagina: (params?:object) => HTMLElement, privada?: boolean}>} cfg.rotas
 */
export function iniciarRouter({ nav, app, rotas }) {
  _nav = nav;
  _app = app;
  _rotas = rotas;
  window.addEventListener('hashchange', resolver);
  resolver();
}

export function navegar(path) {
  const alvo = '#' + path;
  if (location.hash === alvo) {
    resolver();
  } else {
    location.hash = alvo;
  }
}

// Casa "/planos/:idPlano/checkout" com "/planos/abc/checkout" → { idPlano: 'abc' }
function casar(padrao, atual) {
  const a = padrao.split('/');
  const b = atual.split('/');
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

function resolver() {
  const path = (location.hash || '#/').slice(1) || '/';

  // A navbar é re-renderizada a cada navegação (reflete login/logout)
  mount(_nav, Nav());

  let rota = null;
  let params = {};
  for (const [padrao, r] of Object.entries(_rotas)) {
    const m = casar(padrao, path);
    if (m) { rota = r; params = m; break; }
  }

  if (!rota) { location.hash = '#/'; return; }
  if (rota.privada && !getUsuarioLogado()) { location.hash = '#/login'; return; }

  mount(_app, rota.pagina(params));
}
