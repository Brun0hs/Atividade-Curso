// ── Entidades ──────────────────────────────────────────

class Usuario {
  constructor(id, nome, email, senha, tipo = 'aluno') {
    if (!nome) throw new Error('Nome obrigatório');
    if (!/\S+@\S+\.\S+/.test(email)) throw new Error('E-mail inválido');
    this.id    = id;
    this.nome  = nome;
    this.email = email;
    this.senha = senha;
    this.tipo  = tipo; // 'aluno' | 'instrutor' | 'admin'
  }
}

class Categoria {
  constructor(id, nome, descricao = '') {
    if (!nome) throw new Error('Nome obrigatório');
    this.id        = id;
    this.nome      = nome;
    this.descricao = descricao;
  }
}

class Curso {
  constructor(id, titulo, idCategoria, idInstrutor, preco = 0) {
    if (!titulo) throw new Error('Título obrigatório');
    this.id          = id;
    this.titulo      = titulo;
    this.idCategoria = idCategoria; // FK → Categoria
    this.idInstrutor = idInstrutor; // FK → Usuario
    this.preco       = preco;
  }
}

class Modulo {
  constructor(id, titulo, idCurso, ordem = 1) {
    this.id     = id;
    this.titulo = titulo;
    this.idCurso = idCurso; // FK → Curso
    this.ordem  = ordem;
  }
}

class Aula {
  constructor(id, titulo, idModulo, duracao = 0) {
    this.id       = id;
    this.titulo   = titulo;
    this.idModulo = idModulo; // FK → Modulo
    this.duracao  = duracao;  // em minutos
  }
}

class Matricula {
  constructor(id, idUsuario, idCurso) {
    this.id        = id;
    this.idUsuario = idUsuario; // FK → Usuario
    this.idCurso   = idCurso;   // FK → Curso
    this.dataInicio = new Date();
  }
}

class ProgressoAula {
  constructor(id, idMatricula, idAula) {
    this.id         = id;
    this.idMatricula = idMatricula; // FK → Matricula
    this.idAula     = idAula;       // FK → Aula
    this.concluido  = false;
    this.dataConclusao = null;
  }

  marcarComoConcluido() {
    this.concluido     = true;
    this.dataConclusao = new Date();
  }
}

class Certificado {
  constructor(id, idMatricula) {
    this.id          = id;
    this.idMatricula = idMatricula; // FK → Matricula
    this.dataEmissao = new Date();
    this.codigoVerificacao = this._gerarCodigo();
  }

  _gerarCodigo() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}


class Avaliacao {
  constructor(id, idUsuario, idCurso, nota, comentario = '') {
    if (nota < 1 || nota > 5) throw new Error('Nota deve ser entre 1 e 5');
    this.id         = id;
    this.idUsuario  = idUsuario;
    this.idCurso    = idCurso;
    this.nota       = nota;
    this.comentario = comentario;
    this.data       = new Date();
  }
}

class Trilha {
  constructor(id, titulo) {
    this.id     = id;
    this.titulo = titulo;
  }
}

class TrilhaCurso {
  constructor(idTrilha, idCurso, ordem = 1) {
    this.idTrilha = idTrilha; // FK → Trilha
    this.idCurso  = idCurso;  // FK → Curso
    this.ordem    = ordem;
  }
}

class Plano {
  constructor(id, nome, descricao, preco, duracaoMeses) {
    this.id           = id;
    this.nome         = nome;
    this.descricao    = descricao;
    this.preco        = preco;
    this.duracaoMeses = duracaoMeses;
  }
}

class Assinatura {
  constructor(id, idUsuario, idPlano, duracaoMeses) {
    this.id        = id;
    this.idUsuario = idUsuario;
    this.idPlano   = idPlano;
    const fim = new Date();
    fim.setMonth(fim.getMonth() + duracaoMeses);
    this.inicio = new Date();
    this.fim    = fim;
    this.ativa  = true;
  }
}

class Pagamento {
  constructor(id, idAssinatura, valorPago, metodoPagamento) {
    this.id              = id;
    this.idAssinatura    = idAssinatura;
    this.valorPago       = valorPago;
    this.metodoPagamento = metodoPagamento;
    this.data            = new Date();
    this.idTransacao     = 'TXN-' + Math.random().toString(36).substring(2,10).toUpperCase();
  }
}

// ── Persistência em memória ────────────────────────────

const listaUsuarios    = [];
const listaCategorias  = [];
const listaCursos      = [];
const listaModulos     = [];
const listaAulas       = [];
const listaMatriculas  = [];
const listaProgressos  = [];
const listaCertificados = [];
const listaTrilhas     = [];
const listaTrilhaCursos = [];
const listaPlanos      = [];
const listaAssinaturas = [];
const listaPagamentos  = [];
const listaAvaliacoes  = [];

// Contador simples de IDs
let _id = 1;
const nextId = () => _id++;

// ── Helpers ────────────────────────────────────────────

function popularSelect(selectId, lista, labelFn) {
  const sel = document.getElementById(selectId);
  // mantém a opção vazia
  sel.innerHTML = '<option value="">Selecione...</option>';
  lista.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = labelFn(item);
    sel.appendChild(opt);
  });
}

function renderGrid(filtroIdCategoria = '') {
  const grid = document.getElementById('gridCursos');
  const lista = filtroIdCategoria
    ? listaCursos.filter(c => String(c.idCategoria) === String(filtroIdCategoria))
    : listaCursos;

  if (!lista.length) {
    grid.innerHTML = '<div class="col-12 text-muted">Nenhum curso cadastrado.</div>';
    return;
  }

  grid.innerHTML = lista.map(c => {
    const cat = listaCategorias.find(k => k.id === c.idCategoria);
    return `
      <div class="col-12 col-sm-6 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${c.titulo}</h5>
            <p class="card-text text-muted small mb-1">Instrutor: ${c.instrutor || '—'}</p>
            <p class="card-text text-muted small mb-1">Categoria: ${cat ? cat.nome : '—'}</p>
            <span class="badge bg-secondary">${c.nivel}</span>
            <span class="badge bg-light text-dark ms-1">R$ ${Number(c.preco).toFixed(2)}</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ── Formulário: Categoria ──────────────────────────────

document.getElementById('formCategoria').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('catNome').value.trim();
  const erro = document.getElementById('catErro');

  if (!nome) { erro.textContent = 'Nome obrigatório.'; return; }
  if (listaCategorias.some(c => c.nome.toLowerCase() === nome.toLowerCase())) {
    erro.textContent = 'Categoria já existe.'; return;
  }
  erro.textContent = '';

  const cat = new Categoria(nextId(), nome, document.getElementById('catDesc').value.trim());
  listaCategorias.push(cat);

  // atualiza selects e filtro
  popularSelect('cursoCategoria', listaCategorias, c => c.nome);
  const filtro = document.getElementById('filtroCategoria');
  const opt = document.createElement('option');
  opt.value = cat.id; opt.textContent = cat.nome;
  filtro.appendChild(opt);

  this.reset();
  bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
});

// ── Formulário: Curso ──────────────────────────────────

document.getElementById('formCurso').addEventListener('submit', function(e) {
  e.preventDefault();
  const titulo = document.getElementById('cursoTitulo').value.trim();
  const idCat  = document.getElementById('cursoCategoria').value;
  const erro   = document.getElementById('cursoErro');

  if (!titulo) { erro.textContent = 'Título obrigatório.'; return; }
  if (!idCat)  { erro.textContent = 'Selecione uma categoria.'; return; }
  erro.textContent = '';

  const curso = new Curso(
    nextId(), titulo, Number(idCat),
    document.getElementById('cursoInstrutor').value.trim() || null,
    Number(document.getElementById('cursoPreco').value)
  );
  curso.nivel     = document.getElementById('cursoNivel').value;
  curso.instrutor = document.getElementById('cursoInstrutor').value.trim();
  listaCursos.push(curso);

  popularSelect('moduloCurso', listaCursos, c => c.titulo);
  renderGrid(document.getElementById('filtroCategoria').value);

  this.reset();
  bootstrap.Modal.getInstance(document.getElementById('modalCurso')).hide();
});

// ── Formulário: Trilha ─────────────────────────────────

document.getElementById('formTrilha').addEventListener('submit', function(e) {
  e.preventDefault();
  const titulo = document.getElementById('trilhaTitulo').value.trim();
  if (!titulo) return;
  const t = new Trilha(nextId(), titulo);
  listaTrilhas.push(t);
  popularSelect('trilhaCursoTrilha', listaTrilhas, x => x.titulo);
  popularSelect('trilhaCursoCurso',  listaCursos,  x => x.titulo);
  this.reset();
  bootstrap.Modal.getInstance(document.getElementById('modalTrilha')).hide();
});

// ── Formulário: TrilhaCurso ────────────────────────────

document.getElementById('formTrilhaCurso').addEventListener('submit', function(e) {
  e.preventDefault();
  const idTrilha = document.getElementById('trilhaCursoTrilha').value;
  const idCurso  = document.getElementById('trilhaCursoCurso').value;
  const ordem    = Number(document.getElementById('trilhaCursoOrdem').value);
  if (!idTrilha || !idCurso) return;
  listaTrilhaCursos.push(new TrilhaCurso(Number(idTrilha), Number(idCurso), ordem));
  this.reset();
  bootstrap.Modal.getInstance(document.getElementById('modalTrilhaCurso')).hide();
});

// ── Formulário: Módulo ─────────────────────────────────

document.getElementById('formModulo').addEventListener('submit', function(e) {
  e.preventDefault();
  const idCurso = document.getElementById('moduloCurso').value;
  const titulo  = document.getElementById('moduloTitulo').value.trim();
  const ordem   = Number(document.getElementById('moduloOrdem').value);
  if (!idCurso || !titulo) return;

  const mod = new Modulo(nextId(), titulo, Number(idCurso), ordem);
  listaModulos.push(mod);
  popularSelect('aulaModulo', listaModulos, m => {
    const c = listaCursos.find(x => x.id === m.idCurso);
    return `${c ? c.titulo : '?'} › ${m.titulo}`;
  });

  this.reset();
  bootstrap.Modal.getInstance(document.getElementById('modalModulo')).hide();
});

// ── Formulário: Aula ───────────────────────────────────

document.getElementById('formAula').addEventListener('submit', function(e) {
  e.preventDefault();
  const idMod  = document.getElementById('aulaModulo').value;
  const titulo = document.getElementById('aulaTitulo').value.trim();
  const ordem  = Number(document.getElementById('aulaOrdem').value);
  if (!idMod || !titulo) return;

  const aula = new Aula(nextId(), titulo, Number(idMod), Number(document.getElementById('aulaDuracao').value));
  aula.tipo  = document.getElementById('aulaTipo').value;
  aula.ordem = ordem;
  listaAulas.push(aula);

  this.reset();
  bootstrap.Modal.getInstance(document.getElementById('modalAula')).hide();
});

// ── Formulário: Avaliação ──────────────────────────────

document.getElementById('formAvaliacao').addEventListener('submit', function(e) {
  e.preventDefault();
  const idCurso   = Number(document.getElementById('avalCurso').value);
  const nota      = Number(document.getElementById('avalNota').value);
  const comentario = document.getElementById('avalComentario').value.trim();
  const erro      = document.getElementById('avalErro');

  if (!idCurso) { erro.textContent = 'Selecione um curso.'; return; }
  if (!nota || nota < 1 || nota > 5) { erro.textContent = 'Nota deve ser entre 1 e 5.'; return; }
  if (listaAvaliacoes.some(a => a.idUsuario === usuarioLogado.id && a.idCurso === idCurso)) {
    erro.textContent = 'Você já avaliou este curso.'; return;
  }
  erro.textContent = '';

  listaAvaliacoes.push(new Avaliacao(nextId(), usuarioLogado.id, idCurso, nota, comentario));
  this.reset();
  bootstrap.Modal.getInstance(document.getElementById('modalAvaliacao')).hide();
});

// ── Filtro de categoria ────────────────────────────────

document.getElementById('filtroCategoria').addEventListener('change', function() {
  renderGrid(this.value);
});

// ── Sessão ─────────────────────────────────────────────

let usuarioLogado = JSON.parse(localStorage.getItem('sessao')) || null;

function salvarSessao(u) {
  usuarioLogado = u;
  localStorage.setItem('sessao', JSON.stringify(u));
  document.getElementById('navUsuario').textContent = u.nome.split(' ')[0];
  document.getElementById('secaoAuth').classList.add('d-none');
  document.getElementById('secaoPrincipal').classList.remove('d-none');
  renderGrid();
  renderPlanos();
}

function logout() {
  usuarioLogado = null;
  localStorage.removeItem('sessao');
  document.getElementById('navUsuario').textContent = '';
  document.getElementById('secaoAuth').classList.remove('d-none');
  document.getElementById('secaoPrincipal').classList.add('d-none');
}

// ── Formulário: Registro ───────────────────────────────

document.getElementById('formRegistro').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome  = document.getElementById('regNome').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const senha = document.getElementById('regSenha').value;
  const erro  = document.getElementById('regErro');

  if (!nome || !email || !senha) { erro.textContent = 'Preencha todos os campos.'; return; }
  if (!/\S+@\S+\.\S+/.test(email)) { erro.textContent = 'E-mail inválido.'; return; }
  if (listaUsuarios.some(u => u.email === email)) { erro.textContent = 'E-mail já cadastrado.'; return; }
  erro.textContent = '';

  const u = new Usuario(nextId(), nome, email, senha);
  listaUsuarios.push(u);
  salvarSessao(u);
  bootstrap.Modal.getInstance(document.getElementById('modalRegistro')).hide();
  this.reset();
});

// ── Formulário: Login ──────────────────────────────────

document.getElementById('formLogin').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  const erro  = document.getElementById('loginErro');

  const u = listaUsuarios.find(x => x.email === email && x.senha === senha);
  if (!u) { erro.textContent = 'E-mail ou senha incorretos.'; return; }
  erro.textContent = '';
  salvarSessao(u);
  bootstrap.Modal.getInstance(document.getElementById('modalLogin')).hide();
  this.reset();
});

// ── renderGrid (atualizada com botão Matricular) ────────

// Sobrescreve a função definida anteriormente
function renderGrid(filtroIdCategoria = '') {
  const grid = document.getElementById('gridCursos');
  if (!grid) return;
  const lista = filtroIdCategoria
    ? listaCursos.filter(c => String(c.idCategoria) === String(filtroIdCategoria))
    : listaCursos;

  if (!lista.length) {
    grid.innerHTML = '<div class="col-12 text-muted">Nenhum curso cadastrado.</div>';
    return;
  }

  grid.innerHTML = lista.map(c => {
    const cat = listaCategorias.find(k => k.id === c.idCategoria);
    const jaMatriculado = usuarioLogado && listaMatriculas.some(
      m => m.idUsuario === usuarioLogado.id && m.idCurso === c.id
    );
    return `
      <div class="col-12 col-sm-6 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${c.titulo}</h5>
            <p class="card-text text-muted small mb-1">Instrutor: ${c.instrutor || '—'}</p>
            <p class="card-text text-muted small mb-1">Categoria: ${cat ? cat.nome : '—'}</p>
            <span class="badge bg-secondary">${c.nivel}</span>
            <span class="badge bg-light text-dark ms-1">R$ ${Number(c.preco).toFixed(2)}</span>
          </div>
          <div class="card-footer d-flex gap-2">
            ${jaMatriculado
              ? `<button class="btn btn-sm btn-outline-success" onclick="verProgresso(${c.id})">Ver Progresso</button>`
              : `<button class="btn btn-sm btn-primary" onclick="matricular(${c.id})">Matricular-se</button>`
            }
          </div>
        </div>
      </div>`;
  }).join('');
}

// ── Matrícula ──────────────────────────────────────────

function matricular(idCurso) {
  if (!usuarioLogado) { alert('Faça login primeiro.'); return; }
  if (listaMatriculas.some(m => m.idUsuario === usuarioLogado.id && m.idCurso === idCurso)) {
    alert('Você já está matriculado neste curso.'); return;
  }
  const m = new Matricula(nextId(), usuarioLogado.id, idCurso);
  listaMatriculas.push(m);
  renderGrid(document.getElementById('filtroCategoria').value);
}

// ── Progresso ──────────────────────────────────────────

function verProgresso(idCurso) {
  if (!usuarioLogado) return;
  const curso     = listaCursos.find(c => c.id === idCurso);
  const matricula = listaMatriculas.find(m => m.idUsuario === usuarioLogado.id && m.idCurso === idCurso);
  if (!matricula) return;

  // Aulas do curso (via módulos)
  const modIds  = listaModulos.filter(m => m.idCurso === idCurso).map(m => m.id);
  const aulas   = listaAulas.filter(a => modIds.includes(a.idModulo));

  if (!aulas.length) {
    alert('Este curso ainda não tem aulas cadastradas.'); return;
  }

  const progItens = aulas.map(a => {
    const prog = listaProgressos.find(p => p.idMatricula === matricula.id && p.idAula === a.id);
    const concluida = prog && prog.concluido;
    return `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${a.titulo}
        <input type="checkbox" ${concluida ? 'checked disabled' : ''}
          onchange="concluirAula(${matricula.id}, ${a.id}, ${idCurso})" />
      </li>`;
  }).join('');

  const total     = aulas.length;
  const concluidas = listaProgressos.filter(p => p.idMatricula === matricula.id && p.concluido).length;
  const pct       = Math.round((concluidas / total) * 100);

  document.getElementById('progressoModalLabel').textContent = curso.titulo;
  document.getElementById('progressoConteudo').innerHTML = `
    <div class="progress mb-3">
      <div class="progress-bar" style="width:${pct}%">${pct}%</div>
    </div>
    <ul class="list-group">${progItens}</ul>
    ${pct === 100 ? `<button class="btn btn-warning w-100 mt-3" onclick="emitirCertificado(${matricula.id})">🎓 Emitir Certificado</button>` : ''}
  `;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalProgresso')).show();
}

function concluirAula(idMatricula, idAula, idCurso) {
  let prog = listaProgressos.find(p => p.idMatricula === idMatricula && p.idAula === idAula);
  if (!prog) {
    prog = new ProgressoAula(nextId(), idMatricula, idAula);
    listaProgressos.push(prog);
  }
  prog.marcarComoConcluido();
  verProgresso(idCurso); // re-renderiza
}

// ── Certificado ────────────────────────────────────────

function emitirCertificado(idMatricula) {
  const matricula = listaMatriculas.find(m => m.id === idMatricula);
  const curso     = listaCursos.find(c => c.id === matricula.idCurso);
  const usuario   = listaUsuarios.find(u => u.id === matricula.idUsuario);

  let cert = listaCertificados.find(c => c.idMatricula === idMatricula);
  if (!cert) {
    cert = new Certificado(nextId(), idMatricula);
    listaCertificados.push(cert);
  }

  document.getElementById('certConteudo').innerHTML = `
    <div class="text-center p-3 border rounded">
      <h4>🎓 Certificado de Conclusão</h4>
      <p class="mt-3">Certificamos que</p>
      <h5><strong>${usuario.nome}</strong></h5>
      <p>concluiu com êxito o curso</p>
      <h5><strong>${curso.titulo}</strong></h5>
      <p class="text-muted small mt-3">Emitido em: ${cert.dataEmissao.toLocaleDateString('pt-BR')}</p>
      <code class="d-block mt-2">Código: ${cert.codigoVerificacao}</code>
    </div>
  `;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalProgresso')).hide();
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCertificado')).show();
}

// ── Planos ─────────────────────────────────────────────

listaPlanos.push(new Plano(nextId(), 'Mensal',    'Acesso a todos os cursos por 1 mês',   29.90,  1));
listaPlanos.push(new Plano(nextId(), 'Semestral', 'Acesso a todos os cursos por 6 meses', 149.90, 6));
listaPlanos.push(new Plano(nextId(), 'Anual',     'Acesso a todos os cursos por 1 ano',   249.90, 12));

let planoSelecionadoId = null;

function renderPlanos() {
  const cont = document.getElementById('listaPlanos');
  if (!cont) return;
  cont.innerHTML = listaPlanos.map(p => {
    const ativa = usuarioLogado && listaAssinaturas.find(
      a => a.idUsuario === usuarioLogado.id && a.idPlano === p.id && a.ativa
    );
    return `
      <div class="col-12 col-md-4">
        <div class="card text-center h-100">
          <div class="card-body">
            <h5 class="card-title">${p.nome}</h5>
            <p class="text-muted small">${p.descricao}</p>
            <h3>R$ ${p.preco.toFixed(2)}</h3>
            <p class="text-muted small">${p.duracaoMeses} ${p.duracaoMeses === 1 ? 'mês' : 'meses'}</p>
          </div>
          <div class="card-footer">
            ${ativa
              ? `<span class="badge bg-success">Ativo até ${new Date(ativa.fim).toLocaleDateString('pt-BR')}</span>`
              : `<button class="btn btn-primary w-100" onclick="abrirCheckout(${p.id})">Assinar agora</button>`
            }
          </div>
        </div>
      </div>`;
  }).join('');
}

function abrirCheckout(idPlano) {
  if (!usuarioLogado) { alert('Faça login primeiro.'); return; }
  planoSelecionadoId = idPlano;
  const p = listaPlanos.find(x => x.id === idPlano);
  document.getElementById('checkoutResumo').innerHTML =
    `<strong>${p.nome}</strong> — R$ ${p.preco.toFixed(2)} / ${p.duracaoMeses} ${p.duracaoMeses===1?'mês':'meses'}`;
  document.getElementById('checkoutErro').textContent = '';
  document.getElementById('formCheckout').reset();
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCheckout')).show();
}

document.getElementById('formCheckout').addEventListener('submit', function(e) {
  e.preventDefault();
  const metodo = document.getElementById('checkoutMetodo').value;
  const erro   = document.getElementById('checkoutErro');
  if (!metodo)              { erro.textContent = 'Selecione um método.'; return; }
  if (!planoSelecionadoId)  { erro.textContent = 'Nenhum plano selecionado.'; return; }

  const plano  = listaPlanos.find(p => p.id === planoSelecionadoId);
  const assin  = new Assinatura(nextId(), usuarioLogado.id, plano.id, plano.duracaoMeses);
  const pgto   = new Pagamento(nextId(), assin.id, plano.preco, metodo);
  listaAssinaturas.push(assin);
  listaPagamentos.push(pgto);

  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCheckout')).hide();

  document.getElementById('confirmacaoConteudo').innerHTML = `
    <div class="alert alert-success">
      <strong>Assinatura ativada!</strong><br>
      Plano: ${plano.nome}<br>
      Válido até: ${new Date(assin.fim).toLocaleDateString('pt-BR')}<br>
      Método: ${pgto.metodoPagamento}<br>
      <code>ID da Transação: ${pgto.idTransacao}</code>
    </div>`;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalConfirmacao')).show();
  renderPlanos();
});

// ── Tabelas administrativas ───────────────────────────

function renderTabelaUsuarios() {
  const tb = document.getElementById('tabelaUsuarios');
  if (!tb) return;
  tb.innerHTML = listaUsuarios.map(u => `
    <tr><td>${u.id}</td><td>${u.nome}</td><td>${u.email}</td><td>${u.tipo}</td></tr>
  `).join('') || '<tr><td colspan="4" class="text-muted">Nenhum usuário.</td></tr>';
}

function renderTabelaPagamentos() {
  const tb = document.getElementById('tabelaPagamentos');
  if (!tb) return;
  tb.innerHTML = listaPagamentos.map(p => {
    const a = listaAssinaturas.find(x => x.id === p.idAssinatura);
    const u = a ? listaUsuarios.find(x => x.id === a.idUsuario) : null;
    const pl = a ? listaPlanos.find(x => x.id === a.idPlano) : null;
    return `<tr>
      <td>${p.idTransacao}</td>
      <td>${u ? u.nome : '—'}</td>
      <td>${pl ? pl.nome : '—'}</td>
      <td>R$ ${p.valorPago.toFixed(2)}</td>
      <td>${p.metodoPagamento}</td>
      <td>${new Date(p.data).toLocaleDateString('pt-BR')}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" class="text-muted">Nenhuma transação.</td></tr>';
}

// ── Navegação entre seções ─────────────────────────────

function mostrarSec(id) {
  ['secCursos','secPlanos','secAdmin'].forEach(s => {
    const el = document.getElementById(s);
    el.classList.toggle('d-none', s !== id);
  });
}

document.getElementById('navVerCursos').addEventListener('click', e => {
  e.preventDefault(); mostrarSec('secCursos');
});

document.getElementById('navVerPlanos').addEventListener('click', e => {
  e.preventDefault(); mostrarSec('secPlanos'); renderPlanos();
});

document.getElementById('navVerAdmin').addEventListener('click', e => {
  e.preventDefault(); mostrarSec('secAdmin');
  renderTabelaUsuarios(); renderTabelaPagamentos();
});

document.getElementById('navAvaliar').addEventListener('click', e => {
  e.preventDefault();
  if (!usuarioLogado) { alert('Faça login primeiro.'); return; }
  popularSelect('avalCurso', listaCursos, c => c.titulo);
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAvaliacao')).show();
});

// ── Init ───────────────────────────────────────────────

if (usuarioLogado) {
  // Reconstrói usuário da sessão no array (simplificado)
  if (!listaUsuarios.find(u => u.email === usuarioLogado.email)) {
    listaUsuarios.push(Object.assign(Object.create(Usuario.prototype), usuarioLogado));
  }
  document.getElementById('navUsuario').textContent = usuarioLogado.nome.split(' ')[0];
  document.getElementById('secaoAuth').classList.add('d-none');
  document.getElementById('secaoPrincipal').classList.remove('d-none');
} else {
  document.getElementById('secaoAuth').classList.remove('d-none');
  document.getElementById('secaoPrincipal').classList.add('d-none');
}
