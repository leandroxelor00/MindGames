require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { insertUser, selectByUserEmail } = require("../models/user.model");

async function registerUser(email, plainPassword) {
  if (plainPassword.length < 8) {
    throw new Error("A senha precisa ter mais que 8 caracteres");
  }

  const existingUser = selectByUserEmail(email);

  if (existingUser) {
    throw new Error("Esse email já existe");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(plainPassword, saltRounds);
  insertUser(email, passwordHash);

  const user = selectByUserEmail(email);

  const token = generateToken(user);

  return { user: user, token: token };
}

function generateToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
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

  const token = generateToken(user);

  return { user: user, token: token };
}

module.exports = { registerUser, loginUser };
