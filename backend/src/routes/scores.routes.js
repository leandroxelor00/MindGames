const {
  createScore,
  getScoresByUser,
} = require("../controllers/scores.controller");

const { Router } = require("express");

const scoreRoutes = Router();

scoreRoutes.post("/scores", createScore);

scoreRoutes.get("/scores/:userId", getScoresByUser);

module.exports = { scoreRoutes };
