const { Router } = require("express");
const {
  getDailyChallenge,
} = require("../controllers/dailyChallenge.controller");

const dailyChallengeRoutes = Router();

dailyChallengeRoutes.get("/daily-challenge", getDailyChallenge);

module.exports = { dailyChallengeRoutes };
