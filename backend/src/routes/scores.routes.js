const {
  createScore,
  getScoresByUser,
  migrate,
  getSummary,
  getStreakController,
} = require("../controllers/scores.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  optionalAuthMiddleware,
} = require("../middlewares/optionalAuth.middleware");

const { Router } = require("express");
const scoreRoutes = Router();

scoreRoutes.post("/scores", optionalAuthMiddleware, createScore);
scoreRoutes.get("/scores/me", authMiddleware, getScoresByUser);
scoreRoutes.get("/scores/:userId", getScoresByUser);
scoreRoutes.post("/scores/migrate", authMiddleware, migrate);
scoreRoutes.get("/scores/me/summary", authMiddleware, getSummary);
scoreRoutes.get("/scores/:userId/summary", getSummary);
scoreRoutes.get("/scores/me/streak", authMiddleware, getStreakController);
scoreRoutes.get("/scores/:userId/streak", getStreakController);

module.exports = { scoreRoutes };
