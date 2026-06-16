import { criarPaginaCrud } from './crudPage.js';
import { usuarioService } from '../services/index.js';
import { Usuario } from '../models/core.models.js';

export function UsuarioPage() {
  return criarPaginaCrud({
    titulo: 'Usuários',
    tituloSingular: 'Usuário',
    service: usuarioService,
    Model: Usuario,
    campos: [
      { nome: 'nomeCompleto', label: 'Nome completo', placeholder: 'Digite o nome ...' },
      { nome: 'email', label: 'E-mail', tipo: 'email', placeholder: 'Digite o e-mail ...' },
      { nome: 'senhaHash', label: 'Senha', tipo: 'password', placeholder: 'Digite a senha ...' },
    ],
    colunas: [
      { header: 'NOME', valor: (u) => u.nomeCompleto },
      { header: 'E-MAIL', valor: (u) => u.email },
      { header: 'CADASTRO', valor: (u) => new Date(u.dataCadastro).toLocaleDateString('pt-BR') },
    ],
  });
}
