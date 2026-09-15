const { db } = require("./db/connection");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Fé");
});

app.listen(3001, () => {
  console.log("Boa");
});
