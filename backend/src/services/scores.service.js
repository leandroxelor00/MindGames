const { insertScore, selectByUserId } = require("../models/score.model");

function saveScore(score) {
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
