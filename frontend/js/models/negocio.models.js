// ── Entidades NEGÓCIO: Plano, Assinatura, Pagamento (conforme §5) ──

export class Plano {
  constructor(d = {}) {
    this.id = d.id;
    this.nome = (d.nome ?? '').trim();
    this.descricao = d.descricao ?? '';
    this.preco = Number(d.preco) || 0;
    this.duracaoMeses = Number(d.duracaoMeses) || 1;
  }

  static validar(d) {
    const e = {};
    if (!d.nome || !d.nome.trim()) e.nome = 'O nome é obrigatório';
    if (Number.isNaN(d.preco) || d.preco < 0) e.preco = 'O preço não pode ser negativo';
    if (!d.duracaoMeses || d.duracaoMeses < 1) e.duracaoMeses = 'A duração deve ser no mínimo 1 mês';
    return e;
  }
}

export class Assinatura {
  constructor(d = {}) {
    this.id = d.id;
    this.idUsuario = d.idUsuario ?? '';
    this.idPlano = d.idPlano ?? '';
    this.dataInicio = d.dataInicio ?? new Date().toISOString();
    this.dataFim = d.dataFim ?? '';
  }
}

export class Pagamento {
  constructor(d = {}) {
    this.id = d.id;
    this.idAssinatura = d.idAssinatura ?? '';
    this.valorPago = Number(d.valorPago) || 0;
    this.dataPagamento = d.dataPagamento ?? new Date().toISOString();
    this.metodoPagamento = d.metodoPagamento ?? '';
    this.idTransacaoGateway = d.idTransacaoGateway ?? Pagamento.gerarTransacao();
  }

  static gerarTransacao() {
    return 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
