const {
  saveScore,
  getScoresByUserId,
  migrateScores,
  summary,
  getStreak,
} = require("../services/scores.service");

const { isUuid } = require("../validators/validators");

function createScore(req, res) {
  let userId = "";

  if (req.user) {
    userId = String(req.user.id);
  } else if (isUuid(req.body.userId)) {
    userId = req.body.userId;
  } else {
    return res.status(400).json({ message: "userId anonimo invalido" });
  }

  const score = { ...req.body, userId };

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
  let userId = "";

  if (req.user) {
    userId = String(req.user.id);
  } else if (isUuid(req.params.userId)) {
    userId = req.params.userId;
  } else {
    return res.status(400).json({ message: "userId anonimo invalido" });
  }

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

  if (!isUuid(oldUserId)) {
    return res.status(400).json({ message: "oldUserId invalido" });
  }

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

function getSummary(req, res) {
  let userId = "";

  if (req.user) {
    userId = String(req.user.id);
  } else if (isUuid(req.params.userId)) {
    userId = req.params.userId;
  } else {
    return res.status(400).json({ message: "userId anonimo invalido" });
  }

  try {
    const result = summary(userId);
    return res.status(200).json({
      message: "Resumo calculado com sucesso",
      result: result,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

function getStreakController(req, res) {
  let userId = "";

  if (req.user) {
    userId = String(req.user.id);
  } else if (isUuid(req.params.userId)) {
    userId = req.params.userId;
  } else {
    return res.status(400).json({ message: "userId anonimo invalido" });
  }

  try {
    const result = getStreak(userId);
    return res
      .status(200)
      .json({ message: "Streak consultado com sucesso", result: result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

module.exports = {
  createScore,
  getScoresByUser,
  getSummary,
  getStreakController,
  migrate,
};
