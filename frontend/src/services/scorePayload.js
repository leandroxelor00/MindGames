import { games } from "../config/gamesConfig";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function buildScorePayload(gameId, metrics = {}) {
  const game = games[gameId];

  if (!game) {
    throw new TypeError("gameId inválido");
  }

  const payload = {
    gameId,
    score: 0,
    accuracy: 0,
    avgReactionTime: 0,
    levelReached: 0,
  };

  switch (game.rule) {
    case "accuracy":
      payload.accuracy = toNumber(metrics.accuracy);
      payload.score = toNumber(metrics.score);
      break;
    case "level":
      payload.levelReached = toNumber(metrics.levelReached);
      payload.score = payload.levelReached;
      break;
    case "reaction":
      payload.avgReactionTime = toNumber(metrics.avgReactionTime);
      payload.score = payload.avgReactionTime;
      break;
    case "target":
      payload.score = toNumber(metrics.score);
      payload.accuracy = toNumber(metrics.accuracy);
      payload.avgReactionTime = toNumber(metrics.avgReactionTime);
      payload.levelReached = toNumber(metrics.levelReached);
      break;
    default:
      throw new TypeError("regra de pontos inválida");
  }

  return payload;
}
