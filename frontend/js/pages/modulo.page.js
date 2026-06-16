import { criarPaginaCrud } from './crudPage.js';
import { moduloService, cursoService } from '../services/index.js';
import { Modulo } from '../models/conteudo.models.js';

export function ModuloPage() {
  const tituloCurso = (id) => cursoService.findById(id)?.titulo || '—';

  return criarPaginaCrud({
    titulo: 'Módulos',
    tituloSingular: 'Módulo',
    service: moduloService,
    Model: Modulo,
    campos: [
      { nome: 'idCurso', label: 'Curso', tipo: 'select', opcoes: () => cursoService.findAll().map((c) => ({ value: c.id, label: c.titulo })) },
      { nome: 'titulo', label: 'Título', placeholder: 'Digite o título ...' },
      { nome: 'ordem', label: 'Ordem', tipo: 'number', placeholder: '1' },
    ],
    colunas: [
      { header: 'TÍTULO', valor: (m) => m.titulo },
      { header: 'CURSO', valor: (m) => tituloCurso(m.idCurso) },
      { header: 'ORDEM', valor: (m) => m.ordem },
    ],
  });
}
