const {
  saveScore,
  getScoresByUserId,
  migrateScores,
  summary,
  getStreak,
} = require("../services/scores.service");

const { isUuid } = require("../validators/validators");

async function createScore(req, res, next) {
  let userId = "";

  if (req.user) {
    userId = String(req.user.id);
  } else if (isUuid(req.body?.userId)) {
    userId = req.body?.userId;
  } else {
    return res.status(400).json({ message: "userId anônimo inválido" });
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
    const result = await saveScore(score);
    return res.status(201).json({
      message: "Score criado com sucesso",
      result: result,
    });
  } catch (e) {
    next(e);
  }
}

async function getScoresByUser(req, res, next) {
  let userId = "";

  if (req.user) {
    userId = String(req.user.id);
  } else if (isUuid(req.params.userId)) {
    userId = req.params.userId;
  } else {
    return res.status(400).json({ message: "userId anônimo inválido" });
  }

  try {
    const result = await getScoresByUserId(userId);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum score desse usuário encontrado" });
    }

    return res.status(200).json({
      message: "Usuário encontrado",
      result,
    });
  } catch (e) {
    next(e);
  }
}

async function migrate(req, res, next) {
  const oldUserId = req.body?.oldUserId;
  const newUserId = req.user.id;

  if (!isUuid(oldUserId)) {
    return res.status(400).json({ message: "oldUserId inválido" });
  }

  try {
    const migrate = await migrateScores(oldUserId, newUserId);
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
    next(e);
  }
}

async function getSummary(req, res, next) {
  let userId = "";

  if (req.user) {
    userId = String(req.user.id);
  } else if (isUuid(req.params.userId)) {
    userId = req.params.userId;
  } else {
    return res.status(400).json({ message: "userId anônimo inválido" });
  }

  try {
    const result = await summary(userId);
    return res.status(200).json({
      message: "Resumo calculado com sucesso",
      result: result,
    });
  } catch (e) {
    next(e);
  }
}

async function getStreakController(req, res, next) {
  let userId = "";

  if (req.user) {
    userId = String(req.user.id);
  } else if (isUuid(req.params.userId)) {
    userId = req.params.userId;
  } else {
    return res.status(400).json({ message: "userId anônimo inválido" });
  }

  try {
    const result = await getStreak(userId);
    return res
      .status(200)
      .json({ message: "Streak consultado com sucesso", result: result });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createScore,
  getScoresByUser,
  getSummary,
  getStreakController,
  migrate,
};
