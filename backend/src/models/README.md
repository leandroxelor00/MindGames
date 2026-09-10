# models/

Funções que conversam diretamente com o banco (queries SQL via `db/connection.js`) — uma função por operação, ex.: `createScore()`, `findScoresByUserId()`.

Só o `model` sabe que existe SQL/tabela; `services/` e `controllers/` não devem ter nenhuma query escrita neles.
