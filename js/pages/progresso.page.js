// ── Progresso do curso: marcar aulas concluídas + emitir certificado ──

import { el, mount } from '../core/dom.js';
import { Button } from '../components/index.js';
import { cursoService, moduloService, aulaService, matriculaService, progressoService, certificadoService } from '../services/index.js';
import { ProgressoAula } from '../models/interacao.models.js';
import { Certificado } from '../models/curadoria.models.js';
import { getUsuarioLogado } from '../core/auth.js';

export function ProgressoPage(params = {}) {
  const usuario = getUsuarioLogado();
  const idCurso = params.idCurso;
  const container = el('div', { class: 'm-4' });

  const curso = () => cursoService.findById(idCurso);
  const matricula = () => matriculaService.findAll().find((m) => m.idUsuario === usuario.id && m.idCurso === idCurso);
  const aulasDoCurso = () => {
    const idsMod = moduloService.findAll().filter((m) => m.idCurso === idCurso).map((m) => m.id);
    return aulaService.findAll().filter((a) => idsMod.includes(a.idModulo)).sort((a, b) => a.ordem - b.ordem);
  };
  const progressoDaAula = (idAula) => progressoService.findAll().find((p) => p.idUsuario === usuario.id && p.idAula === idAula);
  const concluida = (idAula) => { const p = progressoDaAula(idAula); return !!(p && p.status === 'Concluído'); };
  const certificado = () => certificadoService.findAll().find((c) => c.idUsuario === usuario.id && c.idCurso === idCurso) || null;

  function concluir(idAula) {
    const existente = progressoDaAula(idAula);
    if (existente) {
      if (existente.status === 'Concluído') return;
      existente.status = 'Concluído';
      existente.dataConclusao = new Date().toISOString();
      progressoService.update(existente.id, existente);
    } else {
      progressoService.create(new ProgressoAula({ idUsuario: usuario.id, idAula, status: 'Concluído', dataConclusao: new Date().toISOString() }));
    }
    rerender();
  }

  function emitir() {
    if (certificado()) return;
    certificadoService.create(new Certificado({ idUsuario: usuario.id, idCurso }));
    rerender();
  }

  function rerender() {
    const c = curso();
    const mat = matricula();
    const aulas = aulasDoCurso();
    const total = aulas.length;
    const feitas = aulas.filter((a) => concluida(a.id)).length;
    const pct = total ? Math.round((feitas / total) * 100) : 0;
    const cert = certificado();

    let conteudo;
    if (!mat) {
      conteudo = el('div', { class: 'alert alert-warning' }, 'Você não está matriculado neste curso.');
    } else if (total === 0) {
      conteudo = el('div', { class: 'alert alert-info' }, 'Este curso ainda não tem aulas cadastradas.');
    } else {
      conteudo = el('div', {},
        el('div', { class: 'progress mb-3' }, el('div', { class: 'progress-bar', style: `width:${pct}%` }, `${pct}%`)),
        el('ul', { class: 'list-group mb-3' },
          ...aulas.map((a) => el('li', { class: 'list-group-item d-flex justify-content-between align-items-center' },
            a.titulo,
            el('input', { type: 'checkbox', checked: concluida(a.id), disabled: concluida(a.id), onChange: () => concluir(a.id) })
          ))
        ),
        (pct === 100 && !cert) ? Button({ value: '🎓 Emitir Certificado', variant: 'warning', onClick: emitir }) : null,
        cert ? el('div', { class: 'text-center p-3 border rounded mt-3 bg-white' },
          el('h4', {}, '🎓 Certificado de Conclusão'),
          el('p', { class: 'mt-3' }, 'Certificamos que'),
          el('h5', {}, el('strong', {}, usuario.nomeCompleto)),
          el('p', {}, 'concluiu com êxito o curso'),
          el('h5', {}, el('strong', {}, c ? c.titulo : '')),
          el('p', { class: 'text-muted small mt-3' }, `Emitido em: ${new Date(cert.dataEmissao).toLocaleDateString('pt-BR')}`),
          el('code', { class: 'd-block mt-2' }, `Código: ${cert.codigoVerificacao}`)
        ) : null
      );
    }

    mount(container,
      el('div', { class: 'd-flex justify-content-between align-items-center border-bottom mb-3' },
        el('h4', {}, `Progresso — ${c ? c.titulo : ''}`),
        el('a', { class: 'btn btn-sm btn-outline-secondary', href: '#/' }, 'Voltar')
      ),
      conteudo
    );
  }

  rerender();
  return container;
}
