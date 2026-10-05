const { db } = require("../connection");

const columns = db.prepare("PRAGMA table_info(users)").all();

if (!columns.some((column) => column.name === "username")) {
  db.exec(`ALTER TABLE users ADD COLUMN username TEXT`);
}

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username
  ON users(username COLLATE NOCASE)
`);
