// ── Persistência EM MEMÓRIA (conforme o LAB03) ──
// Arrays guardam INSTÂNCIAS das classes; semeados ao carregar o módulo.
// (A sessão de login fica no localStorage — ver auth.js.)

import { Usuario, Categoria, Curso } from '../models/core.models.js';
import { Plano } from '../models/negocio.models.js';

let _seq = 1;
export const gerarId = () => 'id-' + (_seq++).toString().padStart(4, '0');

const store = {
  usuarios: [],
  categorias: [],
  cursos: [],
  modulos: [],
  aulas: [],
  matriculas: [],
  progressos: [],
  avaliacoes: [],
  trilhas: [],
  trilhaCursos: [],
  certificados: [],
  planos: [],
  assinaturas: [],
  pagamentos: [],
};

function semear() {
  store.usuarios.push(new Usuario({ id: 'adm1', nomeCompleto: 'Administrador', email: 'admin@edu.com', senhaHash: '123456' }));

  store.categorias.push(new Categoria({ id: 'cat1', nome: 'Programação', descricao: 'Cursos de desenvolvimento de software' }));
  store.categorias.push(new Categoria({ id: 'cat2', nome: 'Design', descricao: 'Cursos de design e UX' }));

  store.cursos.push(new Curso({ id: 'cur1', titulo: 'JavaScript do Zero', descricao: 'Fundamentos da linguagem', idInstrutor: 'adm1', idCategoria: 'cat1', nivel: 'Iniciante', dataPublicacao: '2025-01-10', totalAulas: 10, totalHoras: 8 }));
  store.cursos.push(new Curso({ id: 'cur2', titulo: 'React Avançado', descricao: 'Hooks, context e performance', idInstrutor: 'adm1', idCategoria: 'cat1', nivel: 'Avançado', dataPublicacao: '2025-03-05', totalAulas: 20, totalHoras: 16 }));

  store.planos.push(new Plano({ id: 'plan1', nome: 'Mensal', descricao: 'Acesso a todos os cursos por 1 mês', preco: 29.9, duracaoMeses: 1 }));
  store.planos.push(new Plano({ id: 'plan2', nome: 'Semestral', descricao: 'Acesso a todos os cursos por 6 meses', preco: 149.9, duracaoMeses: 6 }));
  store.planos.push(new Plano({ id: 'plan3', nome: 'Anual', descricao: 'Acesso a todos os cursos por 1 ano', preco: 249.9, duracaoMeses: 12 }));
}
semear();

export function getColecao(nome) {
  return store[nome];
}
