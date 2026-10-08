const { query, run } = require("../db/connection");

async function selectByUserId(userId) {
  return query("SELECT * FROM scores WHERE userId = ?", [String(userId)]);
}

async function selectScoresWithUsername() {
  return query(`
    SELECT scores.*, users.username
    FROM scores
    JOIN users ON CAST(users.id AS TEXT) = scores.userId
    WHERE users.username IS NOT NULL
  `);
}

async function insertScore(
  userId,
  gameId,
  score,
  accuracy,
  avgReactionTime,
  levelReached,
) {
  return run(
    `INSERT INTO scores (userId, gameId, score, accuracy, avgReactionTime, levelReached)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, gameId, score, accuracy, avgReactionTime, levelReached],
  );
}

async function updateUserIdInScores(oldUserId, newUserId) {
  const result = await run("UPDATE scores SET userId = ? WHERE userId = ?", [
    String(newUserId),
    String(oldUserId),
  ]);
  return result.changes;
}

module.exports = {
  selectByUserId,
  selectScoresWithUsername,
  insertScore,
  updateUserIdInScores,
};
