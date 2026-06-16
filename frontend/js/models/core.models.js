// ── Entidades CORE: Usuario, Categoria, Curso (campos conforme §5 do LAB03) ──

const emailValido = (email) => /\S+@\S+\.\S+/.test(email || '');

export class Usuario {
  constructor(d = {}) {
    this.id = d.id;
    this.nomeCompleto = (d.nomeCompleto ?? '').trim();
    this.email = (d.email ?? '').trim();
    this.senhaHash = d.senhaHash ?? '';
    this.dataCadastro = d.dataCadastro ?? new Date().toISOString();
  }

  static validar(d) {
    const e = {};
    if (!d.nomeCompleto || !d.nomeCompleto.trim()) e.nomeCompleto = 'O nome é obrigatório';
    else if (d.nomeCompleto.trim().length < 3) e.nomeCompleto = 'O nome deve ter no mínimo 3 caracteres';
    if (!d.email || !d.email.trim()) e.email = 'O e-mail é obrigatório';
    else if (!emailValido(d.email)) e.email = 'Digite um e-mail válido';
    if (!d.senhaHash) e.senhaHash = 'A senha é obrigatória';
    else if (d.senhaHash.length < 6) e.senhaHash = 'A senha deve ter no mínimo 6 caracteres';
    return e;
  }
}

export class Categoria {
  constructor(d = {}) {
    this.id = d.id;
    this.nome = (d.nome ?? '').trim();
    this.descricao = d.descricao ?? '';
  }

  static validar(d) {
    const e = {};
    if (!d.nome || !d.nome.trim()) e.nome = 'O nome é obrigatório';
    return e;
  }
}

export class Curso {
  constructor(d = {}) {
    this.id = d.id;
    this.titulo = (d.titulo ?? '').trim();
    this.descricao = d.descricao ?? '';
    this.idInstrutor = d.idInstrutor ?? '';
    this.idCategoria = d.idCategoria ?? '';
    this.nivel = d.nivel ?? 'Iniciante';
    this.dataPublicacao = d.dataPublicacao ?? '';
    this.totalAulas = Number(d.totalAulas) || 0;
    this.totalHoras = Number(d.totalHoras) || 0;
  }

  static validar(d) {
    const e = {};
    if (!d.titulo || !d.titulo.trim()) e.titulo = 'O título é obrigatório';
    if (!d.idCategoria) e.idCategoria = 'Selecione uma categoria';
    if (!d.idInstrutor) e.idInstrutor = 'Selecione um instrutor';
    return e;
  }
}
