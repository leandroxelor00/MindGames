const {
  getGlobalRanking,
  getGameRanking,
} = require("../services/ranking.service");
const { GAME_IDS } = require("../config/gamesConfig");

function parseLimit(value) {
  const limit = Number.parseInt(value, 10);
  if (!Number.isInteger(limit) || limit < 1) return 10;
  return Math.min(limit, 50);
}

function globalRanking(req, res, next) {
  try {
    const result = getGlobalRanking(parseLimit(req.query.limit), req.user?.id);
    return res
      .status(200)
      .json({ message: "Ranking calculado com sucesso", result });
  } catch (e) {
    next(e);
  }
}

function gameRanking(req, res, next) {
  const { gameId } = req.params;

  if (!GAME_IDS.includes(gameId)) {
    return res.status(404).json({ message: "Jogo não encontrado" });
  }

  try {
    const result = getGameRanking(
      gameId,
      parseLimit(req.query.limit),
      req.user?.id,
    );
    return res
      .status(200)
      .json({ message: "Ranking calculado com sucesso", result });
  } catch (e) {
    next(e);
  }
}

module.exports = { globalRanking, gameRanking };
