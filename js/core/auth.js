// ── Sessão / autenticação (usuário atual; sessão no localStorage) ──

import { usuarioService } from '../services/index.js';
import { Usuario } from '../models/core.models.js';

const SESSAO_KEY = 'novus_saber_sessao';

export function getUsuarioLogado() {
  const raw = localStorage.getItem(SESSAO_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function login(email, senha) {
  const usuario = usuarioService.findAll().find((u) => u.email === email && u.senhaHash === senha);
  if (!usuario) {
    throw new Error('E-mail ou senha incorretos.');
  }
  localStorage.setItem(SESSAO_KEY, JSON.stringify(usuario));
  return usuario;
}

export function cadastrar(dados) {
  if (usuarioService.findAll().some((u) => u.email === dados.email)) {
    throw new Error('E-mail já cadastrado.');
  }
  const novo = usuarioService.create(new Usuario(dados));
  localStorage.setItem(SESSAO_KEY, JSON.stringify(novo));
  return novo;
}

export function logout() {
  localStorage.removeItem(SESSAO_KEY);
}
