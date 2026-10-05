const { dailyChallenge } = require("../services/dailyChallenge.service");

function getDailyChallenge(req, res, next) {
  try {
    const result = dailyChallenge();
    return res
      .status(200)
      .json({ message: "Desafio diário gerado com sucesso", result: result });
  } catch (e) {
    next(e);
  }
}

module.exports = { getDailyChallenge };
