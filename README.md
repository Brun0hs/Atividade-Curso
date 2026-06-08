# Novus Saber

Plataforma de cursos em **JavaScript**, (`atividade-curso-react`): autenticação, catálogo de cursos e CRUDs.

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
