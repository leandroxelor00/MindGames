const { registerUser, loginUser } = require("../services/auth.service");

async function register(req, res, next) {
  const { email, plainPassword, username } = req.body;

  try {
    const result = await registerUser(email, plainPassword, username);
    const { user, token } = result;
    const { passwordHash, ...safeUser } = user;
    return res.status(201).json({
      message: "Usuário registrado com sucesso",
      result: safeUser,
      token,
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  const { email, plainPassword } = req.body;

  try {
    const result = await loginUser(email, plainPassword);
    const { user, token } = result;
    const { passwordHash, ...safeUser } = user;
    return res.status(200).json({
      message: "Login realizado com sucesso",
      result: safeUser,
      token,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login };
