# Novus Saber — versão JavaScript (full-stack Dockerizado)

Plataforma de cursos com o **mesmo escopo e telas da versão React** (`atividade-curso-react`):
autenticação, catálogo de cursos e CRUDs. O frontend é **JavaScript puro (ES Modules)**,
servido pelo **Vite**, e a aplicação roda em containers orquestrados por **Docker Compose**,
seguindo a mesma arquitetura do projeto de referência (`projeto-web`).

## Arquitetura (Docker Compose)

| Serviço    | Imagem / Build      | Porta (host) | Função                                   |
|------------|---------------------|--------------|------------------------------------------|
| `nginx`    | `./nginx`           | **8080**     | Proxy reverso: `/` → frontend, `/api` → backend |
| `frontend` | `./frontend` (Vite) | 5173         | App em JavaScript puro (ES Modules)      |
| `backend`  | `./backend` (NestJS)| 3000         | API NestJS (recebe `DATABASE_URL`)       |
| `postgres` | `postgres:alpine`   | 5532         | Banco de dados PostgreSQL                |
| `pgadmin`  | `dpage/pgadmin4`    | 5550         | UI de administração do Postgres          |

```
Atividade-Curso/
├── docker-compose.yml      # orquestra os 5 serviços
├── .env.example            # variáveis de ambiente (copie para .env)
├── frontend/               # app JS puro + Vite + Dockerfile
│   ├── index.html
│   ├── css/style.css
│   └── js/                 # main, core, models, services, components, pages
├── backend/                # API NestJS + Dockerfile
│   └── src/                # main.ts, app.module/controller/service.ts
└── nginx/                  # proxy reverso (Dockerfile + nginx.conf)
```

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
