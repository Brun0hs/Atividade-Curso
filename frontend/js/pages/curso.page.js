import { criarPaginaCrud } from './crudPage.js';
import { cursoService, categoriaService, usuarioService } from '../services/index.js';
import { Curso } from '../models/core.models.js';

const NIVEIS = ['Iniciante', 'Intermediário', 'Avançado'];

export function CursoPage() {
  const nomeCategoria = (id) => categoriaService.findById(id)?.nome || '—';
  const nomeInstrutor = (id) => usuarioService.findById(id)?.nomeCompleto || '—';

  return criarPaginaCrud({
    titulo: 'Gestão de Cursos',
    tituloSingular: 'Curso',
    service: cursoService,
    Model: Curso,
    campos: [
      { nome: 'titulo', label: 'Título', placeholder: 'Digite o título ...' },
      { nome: 'descricao', label: 'Descrição', placeholder: 'Digite a descrição ...' },
      { nome: 'idInstrutor', label: 'Instrutor', tipo: 'select', opcoes: () => usuarioService.findAll().map((u) => ({ value: u.id, label: u.nomeCompleto })) },
      { nome: 'idCategoria', label: 'Categoria', tipo: 'select', opcoes: () => categoriaService.findAll().map((c) => ({ value: c.id, label: c.nome })) },
      { nome: 'nivel', label: 'Nível', tipo: 'select', opcoes: () => NIVEIS.map((n) => ({ value: n, label: n })) },
      { nome: 'dataPublicacao', label: 'Data de Publicação', tipo: 'date' },
      { nome: 'totalAulas', label: 'Total de Aulas', tipo: 'number', placeholder: '0' },
      { nome: 'totalHoras', label: 'Total de Horas', tipo: 'number', placeholder: '0' },
    ],
    colunas: [
      { header: 'TÍTULO', valor: (c) => c.titulo },
      { header: 'CATEGORIA', valor: (c) => nomeCategoria(c.idCategoria) },
      { header: 'INSTRUTOR', valor: (c) => nomeInstrutor(c.idInstrutor) },
      { header: 'NÍVEL', valor: (c) => c.nivel },
    ],
  });
}
