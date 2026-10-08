require("dotenv").config({ quiet: true });
const path = require("path");
const { createClient } = require("@libsql/client");

// Em produção: TURSO_DATABASE_URL (libsql://...) + TURSO_AUTH_TOKEN.
// Sem elas, usa um arquivo SQLite local (DB_PATH ou backend/mindgames.db).
// DB_PATH=":memory:" serve para os testes.
function resolveUrl() {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;

  const local = process.env.DB_PATH || path.join(__dirname, "../../mindgames.db");
  if (local === ":memory:") return ":memory:";

  return `file:${local.replace(/\\/g, "/")}`;
}

const db = createClient({
  url: resolveUrl(),
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// SELECT -> array de objetos simples ({ coluna: valor })
async function query(sql, args = []) {
  const result = await db.execute({ sql, args });
  return result.rows.map((row) =>
    Object.fromEntries(result.columns.map((column, i) => [column, row[i]])),
  );
}

// INSERT/UPDATE/DELETE -> { changes, lastInsertRowid } (números, seguros para JSON)
async function run(sql, args = []) {
  const result = await db.execute({ sql, args });
  return {
    changes: result.rowsAffected,
    lastInsertRowid:
      result.lastInsertRowid === undefined
        ? null
        : Number(result.lastInsertRowid),
  };
}

module.exports = { db, query, run };
