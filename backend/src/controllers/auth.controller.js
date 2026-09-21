const { registerUser, loginUser } = require("../services/auth.service");

async function register(req, res) {
  const { email, plainPassword } = req.body;

  try {
    const result = await registerUser(email, plainPassword);
    const { user, token } = result;
    const { passwordHash, ...safeUser } = user;
    return res.status(201).json({
      message: "Usuário registrado com sucesso",
      result: safeUser,
      token,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function login(req, res) {
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
    return res.status(401).json({ message: e.message });
  }
}

module.exports = { register, login };
