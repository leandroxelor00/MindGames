const { db } = require("../connection");

async function up() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS scores(
      id INTEGER primary key AUTOINCREMENT,
      userId TEXT not null,
      gameId TEXT not null,
      score INTEGER,
      accuracy REAL,
      avgReactionTime REAL,
      levelReached INTEGER,
      playedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

module.exports = { up };
