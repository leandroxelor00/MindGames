const {
  saveScore,
  getScoresByUserId,
  migrateScores,
} = require("../services/scores.service");

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
    return res.status(400).json({ message: "Campos inválidos" });
  }

  try {
    const result = saveScore(score);
    return res.status(201).json({
      message: "Score criado com sucesso",
      result: result,
    });
  } catch (e) {

    if (e instanceof TypeError) {
      return res.status(400).json({ message: e.message });
    } else {
      return res.status(500).json({ message: e.message });
    }
  }
}

function getScoresByUser(req, res) {
  const userId = req.user ? req.user.id : req.params.userId;
  const result = getScoresByUserId(userId);

  if (result.length === 0) {
    return res
      .status(404)
      .json({ message: "Nenhum score desse usuário encontrado" });
  }

  return res.status(200).json({
    message: "Usuário encontrado",
    result,
  });
}

function migrate(req, res) {
  const oldUserId = req.body.oldUserId;
  const newUserId = req.user.id;
  try {
    const migrate = migrateScores(oldUserId, newUserId);
    if (migrate > 0) {
      return res.status(200).json({
        message: "Migração concluida com sucesso",
        migratedRows: migrate,
      });
    } else {
      return res.status(200).json({
        message: "Nenhuma migração encontrada",
        migratedRows: migrate,
      });
    }
  } catch (e) {
    if (e instanceof TypeError) {
      return res.status(400).json({ message: e.message });
    } else {
      return res.status(500).json({ message: e.message });
    }
  }
}

module.exports = { createScore, getScoresByUser, migrate };
