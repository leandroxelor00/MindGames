const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("mindgames.db");

module.exports = { db };
const tabela = db
  .prepare("PRAGMA table_info(scores)")
  .all();

console.log("Estrutura real da tabela scores:");
console.log(tabela);