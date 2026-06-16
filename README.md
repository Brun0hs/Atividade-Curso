# Novus Saber — versão JavaScript (modular)

Plataforma de cursos em **JavaScript puro (ES Modules)**, com o **mesmo escopo e telas
da versão React** (`atividade-curso-react`): autenticação, catálogo de cursos e CRUDs.
O antigo `script.js` monolítico foi quebrado em módulos com **separação de
responsabilidades**, espelhando a arquitetura do projeto React.

## Estrutura

```
Atividade-Curso/
├── index.html            # shell (só os containers #nav e #app)
├── css/style.css
└── js/
    ├── main.js           # ponto de entrada (semeia o banco + inicia rotas)
    ├── core/
    │   ├── dom.js        # helper para criar elementos (estilo JSX)
    │   ├── storage.js    # "banco" em localStorage + seed
    │   ├── auth.js       # sessão (login/cadastro/logout)
    │   └── router.js     # roteador por hash + rota privada
    ├── models/
    │   └── validators.js # validações (espelham os schemas Zod)
    ├── services/
    │   ├── base.service.js  # CRUD genérico sobre o localStorage
    │   └── index.js         # um service por entidade
    ├── components/
    │   ├── index.js      # Button, Input, Select, Tabela
    │   └── nav.js        # navbar dinâmica
    └── pages/
        ├── crudPage.js   # fábrica de página CRUD (Form + Tabela)
        ├── home.page.js  · login.page.js · cadastro.page.js
        ├── categoria.page.js · curso.page.js · trilha.page.js
        └── modulo.page.js · aula.page.js · usuario.page.js
```

## Telas (mesmas da versão React)

- **Home**: boas-vindas (deslogado) ou catálogo de cursos com filtro (logado)
- **Login** e **Cadastro**
- **CRUDs** (formulário + tabela): Categorias, Cursos, Trilhas (+ vincular curso),
  Módulos, Aulas e Usuários

## Como rodar

Pré-requisito: **Docker** + **Docker Compose**.

```bash
# 1. crie o .env a partir do exemplo (ajuste as senhas se quiser)
cp .env.example .env

# 2. suba tudo
docker compose up --build
```

Acessos:
- **App**: http://localhost:8080  (nginx → frontend)
- **API**: http://localhost:8080/api  (nginx → backend NestJS)
- **pgAdmin**: http://localhost:5550
- **Postgres**: `localhost:5532`

### Usuário de teste (semeado automaticamente)
- **admin@edu.com** / **123456**

> **Sobre a persistência:** assim como no projeto de referência, o container
> **Postgres** já sobe e é conectado ao backend via `DATABASE_URL`. Os dados das
> telas (cursos, usuários, etc.) são semeados em memória no frontend. Para fazer o
> backend NestJS persistir no Postgres de verdade (TypeORM/queries), é só pedir —
> a infraestrutura já está pronta para isso.
