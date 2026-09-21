const { db } = require("../db/connection");

function selectByUserEmail(email) {
  const select = db.prepare("SELECT * FROM users WHERE email = ?");
  const user = select.get(email);
  return user;
}

function insertUser(email, passwordHash) {
  const insert = db.prepare(
    `INSERT INTO users (email, passwordHash) VALUES (?, ?)`,
  );
  const user = insert.run(email, passwordHash);
  return user;
}

module.exports = { selectByUserEmail, insertUser };
