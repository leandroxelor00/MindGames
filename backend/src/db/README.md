# db/

Conexão com o banco SQLite (`connection.js`) e migrações que criam/alteram as tabelas (`scores`, `users`, etc.).

É o único lugar que sabe qual banco está sendo usado e como conectar nele — se um dia trocarmos de SQLite pra outro banco, a mudança concentra aqui.
