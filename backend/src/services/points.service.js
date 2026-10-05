const {
  games,
  MAX_LEVEL,
  REACTION_BEST_MS,
  REACTION_WORST_MS,
} = require("../config/gamesConfig");

function clampAndRound(value) {
  const limited = Math.min(Math.max(value, 0), 100);
  return Math.round(limited * 10) / 10;
}

// Converte uma partida em pontos de 0 a 100 (1 casa decimal).
function points(score) {
  if (!Object.hasOwn(games, score?.gameId)) {
    throw new TypeError("gameId inválido");
  }

  const game = games[score.gameId];
  let raw;

  switch (game.rule) {
    case "accuracy":
      raw = score.accuracy;
      break;
    case "level":
      raw = (score.levelReached / MAX_LEVEL) * 100;
      break;
    case "target":
      raw = Math.min(score.score / game.target, 1) * score.accuracy;
      break;
    case "reaction":
      raw =
        ((REACTION_WORST_MS - score.avgReactionTime) /
          (REACTION_WORST_MS - REACTION_BEST_MS)) *
        100;
      break;
    default:
      throw new TypeError("regra de pontos inválida");
  }

  if (!Number.isFinite(raw)) {
    throw new TypeError("dados da partida inválidos");
  }

  return clampAndRound(raw);
}

module.exports = { points };
