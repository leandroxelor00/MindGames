const {
  createScore,
  getScoresByUser,
  migrate,
} = require("../controllers/scores.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

const { Router } = require("express");

const scoreRoutes = Router();

scoreRoutes.post("/scores", createScore);
scoreRoutes.get("/scores/me", authMiddleware, getScoresByUser);
scoreRoutes.post("/scores/migrate", authMiddleware, migrate);

module.exports = { scoreRoutes };
