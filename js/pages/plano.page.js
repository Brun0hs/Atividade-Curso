import { el } from '../core/dom.js';
import { criarPaginaCrud } from './crudPage.js';
import { planoService } from '../services/index.js';
import { Plano } from '../models/negocio.models.js';

export function PlanoPage() {
  return criarPaginaCrud({
    titulo: 'Planos',
    tituloSingular: 'Plano',
    service: planoService,
    Model: Plano,
    campos: [
      { nome: 'nome', label: 'Nome', placeholder: 'Digite o nome ...' },
      { nome: 'descricao', label: 'Descrição', placeholder: 'Digite a descrição ...' },
      { nome: 'preco', label: 'Preço (R$)', tipo: 'number', placeholder: '0' },
      { nome: 'duracaoMeses', label: 'Duração (meses)', tipo: 'number', placeholder: '1' },
    ],
    colunas: [
      { header: 'NOME', valor: (p) => p.nome },
      { header: 'PREÇO', valor: (p) => `R$ ${(Number(p.preco) || 0).toFixed(2)}` },
      { header: 'DURAÇÃO', valor: (p) => `${p.duracaoMeses} ${p.duracaoMeses === 1 ? 'mês' : 'meses'}` },
      { header: 'ASSINAR', valor: (p) => el('a', { class: 'btn btn-sm btn-success', href: `#/planos/${p.id}/checkout` }, 'Assinar') },
    ],
  });
}
