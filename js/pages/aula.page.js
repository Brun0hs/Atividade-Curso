import { criarPaginaCrud } from './crudPage.js';
import { aulaService, moduloService, cursoService } from '../services/index.js';
import { Aula } from '../models/conteudo.models.js';

const TIPOS = ['Vídeo', 'Texto', 'Quiz'];

export function AulaPage() {
  const tituloModulo = (id) => moduloService.findById(id)?.titulo || '—';
  const rotuloModulo = (m) => {
    const curso = cursoService.findById(m.idCurso);
    return `${curso ? curso.titulo : '?'} › ${m.titulo}`;
  };

  return criarPaginaCrud({
    titulo: 'Aulas',
    tituloSingular: 'Aula',
    service: aulaService,
    Model: Aula,
    campos: [
      { nome: 'idModulo', label: 'Módulo', tipo: 'select', opcoes: () => moduloService.findAll().map((m) => ({ value: m.id, label: rotuloModulo(m) })) },
      { nome: 'titulo', label: 'Título', placeholder: 'Digite o título ...' },
      { nome: 'tipoConteudo', label: 'Tipo de Conteúdo', tipo: 'select', opcoes: () => TIPOS.map((t) => ({ value: t, label: t })) },
      { nome: 'urlConteudo', label: 'URL do Conteúdo', placeholder: 'https://...' },
      { nome: 'duracaoMinutos', label: 'Duração (min)', tipo: 'number', placeholder: '0' },
      { nome: 'ordem', label: 'Ordem', tipo: 'number', placeholder: '1' },
    ],
    colunas: [
      { header: 'TÍTULO', valor: (a) => a.titulo },
      { header: 'MÓDULO', valor: (a) => tituloModulo(a.idModulo) },
      { header: 'TIPO', valor: (a) => a.tipoConteudo },
      { header: 'DURAÇÃO', valor: (a) => `${a.duracaoMinutos} min` },
    ],
  });
}
