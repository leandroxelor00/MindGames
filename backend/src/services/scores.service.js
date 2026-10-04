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
  "sound-sequence"
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
    score.levelReached,
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
    summaryCategory.attention,
  );
  const velocityCategory = filterScoresByCategory(
    scores,
    summaryCategory.velocity,
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

function filterScoresByCategory(scores, list) {
  const scoresByCategory = scores.filter((score) =>
    list.includes(score.gameId),
  );
  return scoresByCategory;
}

function getStreak(userId) {
  const scores = selectByUserId(userId);

  const formatedDates = scores.map((ele) => new Date(ele.playedAt));

  const newFormatedDates = formatedDates.map((ele) =>
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/Sao_Paulo",
    }).format(ele),
  );

  const date = new Date();

  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
  }).format(date);

  const day = new Date(`${today}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() - 1);

  const yesterday = day.toISOString().slice(0, 10);

  const dates = new Set(newFormatedDates);

  const newArr = [...dates];
  newArr.sort();
  let i = newArr.includes(today) ? 0 : newArr.includes(yesterday) ? 1 : null;

  if (i === null) return 0;

  let streak = 0;
  while (true) {
    const day = new Date(`${today}T12:00:00Z`);
    day.setUTCDate(day.getUTCDate() - i);
    const currentDate = day.toISOString().slice(0, 10);

    if (newArr.includes(currentDate)) {
      streak++;
      i++;
    } else {
      break;
    }
  }

  return streak;
}

module.exports = {
  saveScore,
  getScoresByUserId,
  migrateScores,
  summary,
  getStreak,
};
