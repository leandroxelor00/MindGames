const { db } = require("./db/connection");
require("./db/migrations/001_create_scores");
require("./db/migrations/002_create_users");
const { scoreRoutes } = require("./routes/scores.routes");
const { authRoutes } = require("./routes/auth.routes");
const { dailyChallengeRoutes } = require("./routes/dailyChallenge.routes");

const tables = db
  .prepare(
    `
  SELECT name FROM sqlite_master WHERE type = 'table'
`
  )
  .all();

console.log(tables);

const express = require("express");
const app = express();
const cors = require("cors");
const { healthRoutes } = require("./routes/health.routes");
const { errorHandler } = require("./middlewares/errorHandler");
app.use(cors());

app.use(express.json());
app.use("/api", dailyChallengeRoutes);
app.use("/api", scoreRoutes);
app.use("/api/auth", authRoutes);
app.use(healthRoutes);
app.use(errorHandler);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
