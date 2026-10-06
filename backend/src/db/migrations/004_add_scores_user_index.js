const { db } = require("../connection");

// Acelera as consultas por userId e reduz as linhas lidas por requisição
async function up() {
  await db.execute(
    "CREATE INDEX IF NOT EXISTS idx_scores_userId ON scores(userId)",
  );
}

module.exports = { up };
