const { db } = require("../db/connection");

function selectByUserId(userId) {
  const select = db.prepare("SELECT * FROM scores WHERE userId = ?");
  const rows = select.all(userId);
  return rows;
}

function insertScore(
  userId,
  gameId,
  score,
  accuracy,
  avgReactionTime,
  levelReached
) {
  const insert = db.prepare(`
    INSERT INTO scores (userId, gameId, score, accuracy, avgReactionTime, levelReached)
    VALUES (?, ? ,? ,? ,? ,?)
    `);

  const rows = insert.run(
    userId,
    gameId,
    score,
    accuracy,
    avgReactionTime,
    levelReached
  );

  return rows;
}

module.exports = { selectByUserId, insertScore };
