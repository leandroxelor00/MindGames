const {
  insertScore,
  selectByUserId,
  updateUserIdInScores,
} = require("../models/score.model");

const { points } = require("./points.service");
const { games, GAME_IDS, SCORE_LIMITS } = require("../config/gamesConfig");

function isInRange(value, max) {
  return Number.isFinite(value) && value >= 0 && value <= max;
}

function saveScore(score) {
  if (
    !GAME_IDS.includes(score.gameId) ||
    !isInRange(score.score, SCORE_LIMITS.score) ||
    !isInRange(score.accuracy, SCORE_LIMITS.accuracy) ||
    !isInRange(score.avgReactionTime, SCORE_LIMITS.avgReactionTime) ||
    !isInRange(score.levelReached, SCORE_LIMITS.levelReached)
  ) {
    const error = new TypeError("Valores inválidos");
    error.status = 400;
    throw error;
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
    const error = new TypeError(
      "É obrigatório ter o Id antigo e novo do usuário"
    );
    error.status = 400;
    throw error;
  }

  const changes = updateUserIdInScores(oldUserId, newUserId);

  return changes;
}

function avg(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function summary(userId) {
  const buckets = { memory: [], attention: [], velocity: [], logic: [] };

  for (const score of selectByUserId(userId)) {
    const game = games[score.gameId];
    if (!game) continue;
    try {
      buckets[game.category].push(points(score));
    } catch {}
  }

  return {
    memoria: avg(buckets.memory),
    atencao: avg(buckets.attention),
    velocidade: avg(buckets.velocity),
    logica: avg(buckets.logic),
  };
}

function getStreak(userId) {
  const scores = selectByUserId(userId);

  const formatedDates = scores.map(
    (ele) => new Date(ele.playedAt.replace(" ", "T") + "Z")
  );

  const newFormatedDates = formatedDates.map((ele) =>
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/Sao_Paulo",
    }).format(ele)
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
