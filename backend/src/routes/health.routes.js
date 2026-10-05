const { Router } = require("express");

const healthRoutes = Router();

healthRoutes.get("/health", (req, res) => {
  res.json({ message: "O servidor está rodando" });
});

module.exports = { healthRoutes };
