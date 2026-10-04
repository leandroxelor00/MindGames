require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  insertUser,
  selectByUserEmail,
  selectByUsername,
} = require("../models/user.model");
const { isValidUsername } = require("../validators/validators");

async function registerUser(email, plainPassword, username) {
  if (typeof username !== "string" || !isValidUsername(username.trim())) {
    throw new Error("Username inválido. Use 3 a 16 letras, números ou _");
  }

  const trimUsername = username.trim();

  if (plainPassword.length < 8) {
    throw new Error("A senha precisa ter pelo menos 8 caracteres");
  }

  const existingUsername = selectByUsername(trimUsername);
  const existingUser = selectByUserEmail(email);

  if (existingUsername) {
    throw new Error("Esse username já está em uso");
  }

  if (existingUser) {
    throw new Error("Esse email já existe");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(plainPassword, saltRounds);
  insertUser(email, passwordHash, trimUsername);

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
