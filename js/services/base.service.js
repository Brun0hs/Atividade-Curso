// ── Serviço base com CRUD sobre o store EM MEMÓRIA ──
// Mantém as instâncias das classes vivas nos arrays (sem serialização).

import { getColecao, gerarId } from '../core/store.js';

export class BaseService {
  constructor(recurso) {
    this.recurso = recurso;
  }

  findAll() {
    // cópia rasa para a página não mutar o array interno por engano
    return [...getColecao(this.recurso)];
  }

  findById(id) {
    return getColecao(this.recurso).find((x) => x.id === id) || null;
  }

  create(entidade) {
    entidade.id = gerarId();
    getColecao(this.recurso).push(entidade);
    return entidade;
  }

  update(id, entidade) {
    const arr = getColecao(this.recurso);
    const i = arr.findIndex((x) => x.id === id);
    if (i >= 0) {
      entidade.id = id;
      arr[i] = entidade;
    }
    return entidade;
  }

  delete(id) {
    const arr = getColecao(this.recurso);
    const i = arr.findIndex((x) => x.id === id);
    if (i >= 0) arr.splice(i, 1);
  }
}
