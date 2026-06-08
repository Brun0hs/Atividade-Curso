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

O projeto usa ES Modules, então precisa ser servido por **HTTP** (não abra o
`index.html` via `file://`). Opções:

```bash
# com Docker (já incluso)
docker compose up

# ou qualquer servidor estático, ex.:
npx http-server .
```

Depois acesse o endereço informado.

### Usuário de teste (semeado automaticamente)
- **admin@edu.com** / **123456**

> Os dados ficam no `localStorage` do navegador (chave `novus_saber_db`).
