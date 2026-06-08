// ── Entidades CONTEÚDO: Modulo, Aula (campos conforme §5 do LAB03) ──

export class Modulo {
  constructor(d = {}) {
    this.id = d.id;
    this.idCurso = d.idCurso ?? '';
    this.titulo = (d.titulo ?? '').trim();
    this.ordem = Number(d.ordem) || 1;
  }

  static validar(d) {
    const e = {};
    if (!d.idCurso) e.idCurso = 'Selecione um curso';
    if (!d.titulo || !d.titulo.trim()) e.titulo = 'O título é obrigatório';
    if (!d.ordem || d.ordem < 1) e.ordem = 'A ordem deve ser no mínimo 1';
    return e;
  }
}

export class Aula {
  constructor(d = {}) {
    this.id = d.id;
    this.idModulo = d.idModulo ?? '';
    this.titulo = (d.titulo ?? '').trim();
    this.tipoConteudo = d.tipoConteudo ?? 'Vídeo';
    this.urlConteudo = d.urlConteudo ?? '';
    this.duracaoMinutos = Number(d.duracaoMinutos) || 0;
    this.ordem = Number(d.ordem) || 1;
  }

  static validar(d) {
    const e = {};
    if (!d.idModulo) e.idModulo = 'Selecione um módulo';
    if (!d.titulo || !d.titulo.trim()) e.titulo = 'O título é obrigatório';
    if (Number.isNaN(d.duracaoMinutos) || d.duracaoMinutos < 0) e.duracaoMinutos = 'A duração não pode ser negativa';
    if (!d.ordem || d.ordem < 1) e.ordem = 'A ordem deve ser no mínimo 1';
    return e;
  }
}
