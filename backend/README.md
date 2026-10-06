# MindGames — Backend

API em Express com SQLite via [libSQL](https://github.com/tursodatabase/libsql-client-ts):
arquivo local no desenvolvimento e [Turso](https://turso.tech) (nuvem) em produção.

## Requisitos
- Node 20 ou superior.

## Rodar
```bash
npm install
cp .env.example .env   # preencha o JWT_SECRET
npm run dev            # ou: npm start
```

## Variáveis de ambiente
| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `JWT_SECRET` | Segredo do JWT (**obrigatório**) | — |
| `PORT` | Porta da API | `3001` |
| `CORS_ORIGIN` | Origem(ns) do front, separadas por vírgula | `http://localhost:5173` |
| `TURSO_DATABASE_URL` | URL do banco no Turso (`libsql://...`) | — (usa arquivo local) |
| `TURSO_AUTH_TOKEN` | Token do banco no Turso | — |
| `DB_PATH` | Arquivo `.db` local (só sem Turso) | `backend/mindgames.db` |

As migrations rodam sozinhas a cada start e são idempotentes.

## Testes
```bash
npm test
```

## Rotas principais
`/health`, `/api/auth/*`, `/api/scores/*`, `/api/daily-challenge`, `/api/ranking/*`.
