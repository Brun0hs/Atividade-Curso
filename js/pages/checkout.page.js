// ── Checkout: escolher método → gera Assinatura + Pagamento ──

import { el, mount } from '../core/dom.js';
import { Button, Select } from '../components/index.js';
import { planoService, assinaturaService, pagamentoService } from '../services/index.js';
import { Assinatura, Pagamento } from '../models/negocio.models.js';
import { getUsuarioLogado } from '../core/auth.js';

const METODOS = ['Cartão de Crédito', 'PIX', 'Boleto'];

export function CheckoutPage(params = {}) {
  const usuario = getUsuarioLogado();
  const plano = planoService.findById(params.idPlano);
  const container = el('div', { class: 'row justify-content-center m-4' });
  const estado = { metodo: '' };
  let erro = '';
  let confirmacao = null;

  function finalizar() {
    erro = '';
    if (!estado.metodo) { erro = 'Selecione um método de pagamento.'; rerender(); return; }
    if (!plano) return;

    const inicio = new Date();
    const fim = new Date();
    fim.setMonth(fim.getMonth() + plano.duracaoMeses);

    const assinatura = assinaturaService.create(new Assinatura({
      idUsuario: usuario.id, idPlano: plano.id,
      dataInicio: inicio.toISOString(), dataFim: fim.toISOString(),
    }));
    const pagamento = pagamentoService.create(new Pagamento({
      idAssinatura: assinatura.id, valorPago: plano.preco, metodoPagamento: estado.metodo,
    }));

    confirmacao = { assinatura, pagamento };
    rerender();
  }

  function rerender() {
    if (!plano) {
      mount(container, el('div', { class: 'col-12' }, el('div', { class: 'alert alert-danger m-4' }, 'Plano não encontrado.')));
      return;
    }

    const corpo = confirmacao
      ? el('div', { class: 'alert alert-success' },
        el('strong', {}, 'Assinatura ativada!'), el('br'),
        `Plano: ${plano.nome}`, el('br'),
        `Válido até: ${new Date(confirmacao.assinatura.dataFim).toLocaleDateString('pt-BR')}`, el('br'),
        `Método: ${confirmacao.pagamento.metodoPagamento}`, el('br'),
        el('code', {}, `ID da Transação: ${confirmacao.pagamento.idTransacaoGateway}`)
      )
      : el('div', {},
        el('div', { class: 'alert alert-light' },
          el('strong', {}, plano.nome), ` — R$ ${(Number(plano.preco) || 0).toFixed(2)} / ${plano.duracaoMeses} ${plano.duracaoMeses === 1 ? 'mês' : 'meses'}`
        ),
        Select({ label: 'Método de pagamento', visivel: true, value: estado.metodo, placeholder: 'Selecione ...', options: METODOS.map((m) => ({ value: m, label: m })), onChange: (v) => { estado.metodo = v; } }),
        erro ? el('div', { class: 'text-danger small mb-2' }, erro) : null
      );

    mount(container,
      el('div', { class: 'col-12 col-md-6 col-lg-5' },
        el('div', { class: 'card shadow' },
          el('div', { class: 'card-body bg-light' },
            el('h5', { class: 'card-title' }, 'Checkout'),
            el('hr'),
            corpo
          ),
          el('div', { class: 'card-footer' },
            confirmacao
              ? el('a', { class: 'btn btn-primary w-100', href: '#/planos' }, 'Voltar aos planos')
              : Button({ value: 'Finalizar Pagamento', variant: 'success', onClick: finalizar })
          )
        )
      )
    );
  }

  rerender();
  return container;
}
