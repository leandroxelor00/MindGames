const { dailyChallenge } = require("../services/dailyChallenge.service");

function getDailyChallenge(req, res) {
  try {
    const result = dailyChallenge();
    return res
      .status(200)
      .json({ message: "Desafio diário gerado com sucesso", result: result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

module.exports = { getDailyChallenge };
