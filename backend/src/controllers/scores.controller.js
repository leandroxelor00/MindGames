const { saveScore, getScoresByUserId } = require("../services/scores.service");

function createScore(req, res) {
  const score = req.body;
  if (
    typeof score.userId !== "string" ||
    typeof score.gameId !== "string" ||
    typeof score.score !== "number" ||
    typeof score.accuracy !== "number" ||
    typeof score.avgReactionTime !== "number" ||
    typeof score.levelReached !== "number"
  ) {
    return res.status(400).send("Campos inválidos");
  }

  try {
    const result = saveScore(score);
    return res.status(201).json({
      message: "Score criado com sucesso",
      result: result,
    });
  } catch (e) {
    if (e instanceof TypeError) {
      return res.status(400).send(e.message);
    } else {
      return res.status(500).send(e.message);
    }
  }
}

function getScoresByUser(req, res) {
  const userId = req.params.userId;
  const result = getScoresByUserId(userId);
  if (result.length === 0) {
    return res.status(404).send("Nenhum score desse usuário encontrado");
  }
  return res.status(200).json({
    message: "Usuário encontrado",
    result: result,
  });
}

module.exports = { createScore, getScoresByUser };
