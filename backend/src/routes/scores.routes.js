const {
  createScore,
  getScoresByUser,
  migrate,
  getSummary,
} = require("../controllers/scores.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { Router } = require("express");
const scoreRoutes = Router();
scoreRoutes.post("/scores", createScore);
scoreRoutes.get("/scores/me", authMiddleware, getScoresByUser);
scoreRoutes.get("/scores/:userId", getScoresByUser);
scoreRoutes.post("/scores/migrate", authMiddleware, migrate);
scoreRoutes.get("/scores/me/summary", authMiddleware, getSummary);
scoreRoutes.get("/scores/:userId/summary", getSummary);

module.exports = { scoreRoutes };
