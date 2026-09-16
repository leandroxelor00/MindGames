const { insertScore, selectByUserId } = require("../models/score.model");

const games = ["memory-match", "stroop-test"];

function saveScore(score) {
  if (
    !games.includes(score.gameId) ||
    score.score < 0 ||
    score.accuracy < 0 ||
    score.accuracy > 100 ||
    score.avgReactionTime < 0 ||
    score.levelReached < 0
  ) {
    throw new TypeError("Valores inválidos");
  }
  return insertScore(
    score.userId,
    score.gameId,
    score.score,
    score.accuracy,
    score.avgReactionTime,
    score.levelReached
  );
}

function getScoresByUserId(userId) {
  return selectByUserId(userId);
}

module.exports = { saveScore, getScoresByUserId };
