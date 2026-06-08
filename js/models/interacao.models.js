// ── Entidades INTERAÇÃO: Matricula, ProgressoAula, Avaliacao (conforme §5) ──

export class Matricula {
  constructor(d = {}) {
    this.id = d.id;
    this.idUsuario = d.idUsuario ?? '';
    this.idCurso = d.idCurso ?? '';
    this.dataMatricula = d.dataMatricula ?? new Date().toISOString();
    this.dataConclusao = d.dataConclusao ?? null;
  }
}

export class ProgressoAula {
  constructor(d = {}) {
    this.id = d.id;
    this.idUsuario = d.idUsuario ?? '';
    this.idAula = d.idAula ?? '';
    this.status = d.status ?? 'Pendente';
    this.dataConclusao = d.dataConclusao ?? null;
  }

  concluir() {
    this.status = 'Concluído';
    this.dataConclusao = new Date().toISOString();
  }

  get concluido() {
    return this.status === 'Concluído';
  }
}

export class Avaliacao {
  constructor(d = {}) {
    this.id = d.id;
    this.idUsuario = d.idUsuario ?? '';
    this.idCurso = d.idCurso ?? '';
    this.nota = Number(d.nota) || 0;
    this.comentario = d.comentario ?? '';
    this.dataAvaliacao = d.dataAvaliacao ?? new Date().toISOString();
  }

  static validar(d) {
    const e = {};
    if (!d.idCurso) e.idCurso = 'Selecione um curso';
    if (!d.nota || d.nota < 1 || d.nota > 5) e.nota = 'A nota deve ser entre 1 e 5';
    return e;
  }
}
