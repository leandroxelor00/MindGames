const { db } = require("../db/connection");

function selectByUserId(userId) {
  const select = db.prepare("SELECT * FROM scores WHERE userId = ?");
  const rows = select.all(String(userId));
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

function updateUserIdInScores(oldUserId, newUserId) {
  const update = db.prepare(`UPDATE scores SET userId = ? WHERE userId = ?`);
  const result = update.run(newUserId, oldUserId);
  return result.changes;
}

module.exports = { selectByUserId, insertScore, updateUserIdInScores };
