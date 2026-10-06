require("dotenv").config({ quiet: true });
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

// DB_PATH permite apontar o arquivo em produção (ex.: volume persistente)
// ou usar ":memory:" nos testes. Sem a variável, usa backend/mindgames.db.
const dbPath = process.env.DB_PATH || path.join(__dirname, "../../mindgames.db");

const db = new DatabaseSync(dbPath);

module.exports = { db };
