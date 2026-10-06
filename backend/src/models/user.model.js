const { query, run } = require("../db/connection");

async function selectByUserEmail(email) {
  const rows = await query(
    "SELECT * FROM users WHERE email = ? COLLATE NOCASE",
    [email],
  );
  return rows[0];
}

async function selectByUsername(username) {
  const rows = await query(
    "SELECT * FROM users WHERE username = ? COLLATE NOCASE",
    [username],
  );
  return rows[0];
}

async function insertUser(email, passwordHash, username) {
  return run(
    "INSERT INTO users (email, passwordHash, username) VALUES (?, ?, ?)",
    [email, passwordHash, username],
  );
}

module.exports = { selectByUserEmail, selectByUsername, insertUser };
