const {
  insertScore,
  selectByUserId,
  updateUserIdInScores,
} = require("../models/score.model");

const games = [
  "memory-match",
  "stroop-test",
  "number-challenge",
  "visual-memory",
  "food-memory",
  "reaction-time",
];

const summaryCategory = {
  memory: ["memory-match", "food-memory", "visual-memory"],
  attention: ["stroop-test"],
  velocity: ["reaction-time"],
  logic: ["number-challenge"],
};
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

function migrateScores(oldUserId, newUserId) {
  if (!oldUserId || !newUserId) {
    throw new TypeError("É obrigatório ter o Id antigo e novo do usuário");
  }

  const changes = updateUserIdInScores(oldUserId, newUserId);

  return changes;
}

function summary(userId) {
  const scores = selectByUserId(userId);
  const memoryCategory = filterScoresByCategory(scores, summaryCategory.memory);
  const attentionCategory = filterScoresByCategory(
    scores,
    summaryCategory.attention
  );
  const velocityCategory = filterScoresByCategory(
    scores,
    summaryCategory.velocity
  );
  const logicCategory = filterScoresByCategory(scores, summaryCategory.logic);

  const avgMemoryAccuracy = avgAccuracyByCategory(memoryCategory);
  const avgAttentionAccuracy = avgAccuracyByCategory(attentionCategory);
  const avgVelocityAccuracy = avgAccuracyByCategory(velocityCategory);
  const avgLogicAccuracy = avgAccuracyByCategory(logicCategory);

  return {
    memoria: avgMemoryAccuracy,
    atencao: avgAttentionAccuracy,
    velocidade: avgVelocityAccuracy,
    logica: avgLogicAccuracy,
  };
}

function avgAccuracyByCategory(category) {
  if (category.length === 0) {
    return 0;
  } else {
    return (
      category.reduce((acc, cur) => acc + cur.accuracy, 0) / category.length
    );
  }
}

summary("b063ad41-4251-4bb4-bab4-26d2c6cb3ad5");

function filterScoresByCategory(scores, list) {
  const scoresByCategory = scores.filter((score) =>
    list.includes(score.gameId)
  );
  return scoresByCategory;
}

module.exports = { saveScore, getScoresByUserId, migrateScores, summary };
