// ── Ponto de entrada: o store em memória semeia ao ser importado; inicia o roteador ──

import './core/store.js';
import { iniciarRouter } from './core/router.js';

import { HomePage } from './pages/home.page.js';
import { LoginPage } from './pages/login.page.js';
import { CadastroPage } from './pages/cadastro.page.js';
import { CategoriaPage } from './pages/categoria.page.js';
import { CursoPage } from './pages/curso.page.js';
import { TrilhaPage } from './pages/trilha.page.js';
import { ModuloPage } from './pages/modulo.page.js';
import { AulaPage } from './pages/aula.page.js';
import { UsuarioPage } from './pages/usuario.page.js';
import { PlanoPage } from './pages/plano.page.js';
import { AvaliacaoPage } from './pages/avaliacao.page.js';
import { ProgressoPage } from './pages/progresso.page.js';
import { CheckoutPage } from './pages/checkout.page.js';

iniciarRouter({
  nav: document.getElementById('nav'),
  app: document.getElementById('app'),
  rotas: {
    '/': { pagina: HomePage },
    '/login': { pagina: LoginPage },
    '/cadastro': { pagina: CadastroPage },
    '/categorias': { pagina: CategoriaPage, privada: true },
    '/cursos': { pagina: CursoPage, privada: true },
    '/trilhas': { pagina: TrilhaPage, privada: true },
    '/modulos': { pagina: ModuloPage, privada: true },
    '/aulas': { pagina: AulaPage, privada: true },
    '/usuarios': { pagina: UsuarioPage, privada: true },
    '/avaliar': { pagina: AvaliacaoPage, privada: true },
    '/planos': { pagina: PlanoPage, privada: true },
    '/planos/:idPlano/checkout': { pagina: CheckoutPage, privada: true },
    '/cursos/:idCurso/progresso': { pagina: ProgressoPage, privada: true },
  },
});
