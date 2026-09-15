const { saveScore, getScoresByUserId } = require("../services/scores.service");

function createScore(req, res) {
  const score = req.body;
  return saveScore(score);
}

function getScoresByUser(req, res) {
  return getScoresByUserId(userId);
}

module.exports = { createScore, getScoresByUser };
