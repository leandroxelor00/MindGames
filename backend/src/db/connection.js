const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("mindgames.db");

module.exports = { db };
