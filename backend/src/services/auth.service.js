const bcrypt = require("bcrypt");
const { insertUser, selectByUserEmail } = require("../models/user.model");

async function registerUser(email, plainPassword) {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(plainPassword, saltRounds);
  insertUser(email, passwordHash);
}

async function loginUser(email, plainPassword) {
  const user = selectByUserEmail(email);

  if (!user) {
    throw new Error("Email ou senha inválido");
  }

  const passwordCorrect = await bcrypt.compare(
    plainPassword,
    user.passwordHash,
  );

  if (!passwordCorrect) {
    throw new Error("Email ou senha inválido");
  }

  return user;
}

module.exports = { registerUser, loginUser };
