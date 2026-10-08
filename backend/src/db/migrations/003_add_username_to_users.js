const { db, query } = require("../connection");

async function up() {
  const columns = await query("PRAGMA table_info(users)");

  if (!columns.some((column) => column.name === "username")) {
    await db.execute("ALTER TABLE users ADD COLUMN username TEXT");
  }

  await db.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username
    ON users(username COLLATE NOCASE)
  `);
}

module.exports = { up };
