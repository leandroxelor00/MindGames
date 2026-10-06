# MindGames — Backend

API em Express + SQLite nativo (`node:sqlite`).

## Requisitos
- **Node 22.13 ou superior** (o `node:sqlite` só funciona sem flag a partir daí).

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
| `DB_PATH` | Caminho do arquivo `.db` | `backend/mindgames.db` |

## Testes
```bash
npm test
```

## Rotas principais
`/health`, `/api/auth/*`, `/api/scores/*`, `/api/daily-challenge`, `/api/ranking/*`.
