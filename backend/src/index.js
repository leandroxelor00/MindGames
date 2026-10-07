require("dotenv").config({ quiet: true });

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET não definido. Copie .env.example para .env e preencha.");
  process.exit(1);
}

const { runMigrations } = require("./db/migrate");

const fs = require("fs");
const path = require("path");
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

// Se o front já foi buildado (frontend/dist), a própria API o serve.
// Assim uma única URL (ex.: a do túnel) entrega app + API, sem CORS.
const frontDist = path.join(__dirname, "../../frontend/dist");

if (fs.existsSync(frontDist)) {
  app.use(express.static(frontDist));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontDist, "index.html"));
  });
}

app.use(errorHandler);

// As migrations rodam antes de aceitar requisições
runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Falha ao preparar o banco de dados:", error);
    process.exit(1);
  });
