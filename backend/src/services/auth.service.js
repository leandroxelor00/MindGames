require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { insertUser, selectByUserEmail } = require("../models/user.model");

async function registerUser(email, plainPassword) {
  if (plainPassword.length < 8) {
    const error = new Error("A senha precisa ter pelo menos 8 caracteres");
    error.status = 400;
    throw error;
  }

  const existingUser = selectByUserEmail(email);

  if (existingUser) {
    const error = new Error("Esse email já existe");
    error.status = 409;
    throw error;
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
    const error = new Error("Email ou senha inválido");
    error.status = 400;
    throw error;
  }

  const passwordCorrect = await bcrypt.compare(
    plainPassword,
    user.passwordHash
  );

  if (!passwordCorrect) {
    const error = new Error("Email ou senha inválido");
    error.status = 400;
    throw error;
  }

  const token = generateToken(user);

  return { user: user, token: token };
}

module.exports = { registerUser, loginUser };
