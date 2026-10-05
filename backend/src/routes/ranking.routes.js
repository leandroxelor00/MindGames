const {
  globalRanking,
  gameRanking,
} = require("../controllers/ranking.controller");
const {
  optionalAuthMiddleware,
} = require("../middlewares/optionalAuth.middleware");

const { Router } = require("express");
const rankingRoutes = Router();

rankingRoutes.get("/global", optionalAuthMiddleware, globalRanking);
rankingRoutes.get("/:gameId", optionalAuthMiddleware, gameRanking);

module.exports = { rankingRoutes };
