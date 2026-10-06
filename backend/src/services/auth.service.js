require("dotenv").config({ quiet: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  insertUser,
  selectByUserEmail,
  selectByUsername,
} = require("../models/user.model");
const { isValidUsername } = require("../validators/validators");

function badRequest(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

async function registerUser(rawEmail, plainPassword, username) {
  const email = normalizeEmail(rawEmail);

  if (!email) {
    throw badRequest("Email é obrigatório");
  }

  if (typeof username !== "string" || !isValidUsername(username.trim())) {
    throw badRequest("Username inválido. Use 3 a 16 letras, números ou _");
  }

  const trimUsername = username.trim();

  if (typeof plainPassword !== "string" || plainPassword.length < 8) {
    throw badRequest("A senha precisa ter pelo menos 8 caracteres");
  }

  if (await selectByUsername(trimUsername)) {
    throw badRequest("Esse username já está em uso", 409);
  }

  if (await selectByUserEmail(email)) {
    throw badRequest("Esse email já existe", 409);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(plainPassword, saltRounds);
  await insertUser(email, passwordHash, trimUsername);

  const user = await selectByUserEmail(email);

  const token = generateToken(user);

  return { user: user, token: token };
}

function generateToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
}

async function loginUser(rawEmail, plainPassword) {
  const email = normalizeEmail(rawEmail);

  if (!email || typeof plainPassword !== "string" || !plainPassword) {
    throw badRequest("Email e senha são obrigatórios");
  }

  const user = await selectByUserEmail(email);

  if (!user) {
    throw badRequest("Email ou senha inválido");
  }

  const passwordCorrect = await bcrypt.compare(
    plainPassword,
    user.passwordHash,
  );

  if (!passwordCorrect) {
    throw badRequest("Email ou senha inválido");
  }

  const token = generateToken(user);

  return { user: user, token: token };
}

module.exports = { registerUser, loginUser };
