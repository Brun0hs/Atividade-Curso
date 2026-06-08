// ── Um "service" por entidade (singletons) ──

import { BaseService } from './base.service.js';

// Core
export const usuarioService = new BaseService('usuarios');
export const categoriaService = new BaseService('categorias');
export const cursoService = new BaseService('cursos');
// Conteúdo
export const moduloService = new BaseService('modulos');
export const aulaService = new BaseService('aulas');
// Interação
export const matriculaService = new BaseService('matriculas');
export const progressoService = new BaseService('progressos');
export const avaliacaoService = new BaseService('avaliacoes');
// Curadoria
export const trilhaService = new BaseService('trilhas');
export const trilhaCursoService = new BaseService('trilhaCursos');
export const certificadoService = new BaseService('certificados');
// Negócio
export const planoService = new BaseService('planos');
export const assinaturaService = new BaseService('assinaturas');
export const pagamentoService = new BaseService('pagamentos');
