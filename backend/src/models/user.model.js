const { db } = require("../db/connection");

function selectByUserEmail(email) {
  const select = db.prepare("SELECT * FROM users WHERE email = ?");
  const user = select.get(email);
  return user;
}

function selectByUsername(username) {
  const select = db.prepare(
    " SELECT * FROM users WHERE username = ? COLLATE NOCASE",
  );
  const user = select.get(username);
  return user;
}

function insertUser(email, passwordHash, username) {
  const insert = db.prepare(
    `INSERT INTO users (email, passwordHash) VALUES (?, ?, ?)`,
  );
  const user = insert.run(email, passwordHash, username);
  return user;
}

module.exports = { selectByUserEmail, selectByUsername, insertUser };
