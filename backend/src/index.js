require("dotenv").config({ quiet: true });

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET não definido. Copie .env.example para .env e preencha.");
  process.exit(1);
}

require("./db/connection");
require("./db/migrations/001_create_scores");
require("./db/migrations/002_create_users");
require("./db/migrations/003_add_username_to_users");

const express = require("express");
const cors = require("cors");
const { scoreRoutes } = require("./routes/scores.routes");
const { authRoutes } = require("./routes/auth.routes");
const { dailyChallengeRoutes } = require("./routes/dailyChallenge.routes");
const { rankingRoutes } = require("./routes/ranking.routes");
const { healthRoutes } = require("./routes/health.routes");
const { errorHandler } = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 3001;

// CORS_ORIGIN aceita várias origens separadas por vírgula
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

const app = express();

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/api", dailyChallengeRoutes);
app.use("/api", scoreRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ranking", rankingRoutes);
app.use(healthRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
