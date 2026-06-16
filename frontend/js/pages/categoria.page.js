import { criarPaginaCrud } from './crudPage.js';
import { categoriaService } from '../services/index.js';
import { Categoria } from '../models/core.models.js';

export function CategoriaPage() {
  return criarPaginaCrud({
    titulo: 'Categorias',
    tituloSingular: 'Categoria',
    service: categoriaService,
    Model: Categoria,
    campos: [
      { nome: 'nome', label: 'Nome', placeholder: 'Digite o nome ...' },
      { nome: 'descricao', label: 'Descrição', placeholder: 'Digite a descrição ...' },
    ],
    colunas: [
      { header: 'NOME', valor: (c) => c.nome },
      { header: 'DESCRIÇÃO', valor: (c) => c.descricao },
    ],
  });
}
