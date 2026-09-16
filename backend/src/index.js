const { db } = require("./db/connection");
require("./db/migrations/001_create_scores");
const { scoreRoutes } = require("./routes/scores.routes");

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
app.use(cors());

app.use(express.json());
app.use("/api", scoreRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
