// Fonte única dos jogos do backend: categoria, tipo de regra de pontos e constantes.
// A lógica de cálculo fica no points.service; aqui ficam só os dados.

const MAX_LEVEL = 15;
const REACTION_BEST_MS = 150;
const REACTION_WORST_MS = 500;
const MIN_RANKING_MATCHES = 3; // mínimo de partidas para aparecer no ranking por jogo
const TOP_RANKING_SCORES = 3; // quantas melhores partidas entram na média do ranking

// rule: como a partida vira pontos (0-100)
//  "accuracy" -> usa a accuracy
//  "level"    -> levelReached / MAX_LEVEL
//  "target"   -> min(score / target, 1) * accuracy
//  "reaction" -> avgReactionTime entre REACTION_BEST_MS e REACTION_WORST_MS
const games = {
  "memory-match": { category: "memory", rule: "accuracy" },
  "visual-memory": { category: "memory", rule: "level" },
  "food-memory": { category: "memory", rule: "level" },
  "stroop-test": { category: "attention", rule: "target", target: 25 },
  "number-challenge": { category: "logic", rule: "target", target: 20 },
  "reaction-time": { category: "velocity", rule: "reaction" },
  "sound-sequence": { category: "memory", rule: "level" },
};

const GAME_IDS = Object.keys(games);

module.exports = {
  games,
  GAME_IDS,
  MAX_LEVEL,
  REACTION_BEST_MS,
  REACTION_WORST_MS,
  MIN_RANKING_MATCHES,
  TOP_RANKING_SCORES,
};
