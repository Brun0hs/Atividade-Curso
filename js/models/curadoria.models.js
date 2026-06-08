// ── Entidades CURADORIA: Trilha, TrilhaCurso, Certificado (conforme §5) ──

export class Trilha {
  constructor(d = {}) {
    this.id = d.id;
    this.titulo = (d.titulo ?? '').trim();
    this.descricao = d.descricao ?? '';
    this.idCategoria = d.idCategoria ?? '';
  }

  static validar(d) {
    const e = {};
    if (!d.titulo || !d.titulo.trim()) e.titulo = 'O título é obrigatório';
    if (!d.idCategoria) e.idCategoria = 'Selecione uma categoria';
    return e;
  }
}

export class TrilhaCurso {
  constructor(d = {}) {
    this.id = d.id;
    this.idTrilha = d.idTrilha ?? '';
    this.idCurso = d.idCurso ?? '';
    this.ordem = Number(d.ordem) || 1;
  }

  static validar(d) {
    const e = {};
    if (!d.idTrilha) e.idTrilha = 'Selecione uma trilha';
    if (!d.idCurso) e.idCurso = 'Selecione um curso';
    if (!d.ordem || d.ordem < 1) e.ordem = 'A ordem deve ser no mínimo 1';
    return e;
  }
}

export class Certificado {
  constructor(d = {}) {
    this.id = d.id;
    this.idUsuario = d.idUsuario ?? '';
    this.idCurso = d.idCurso ?? '';
    this.idTrilha = d.idTrilha ?? null;
    this.codigoVerificacao = d.codigoVerificacao ?? Certificado.gerarCodigo();
    this.dataEmissao = d.dataEmissao ?? new Date().toISOString();
  }

  static gerarCodigo() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
