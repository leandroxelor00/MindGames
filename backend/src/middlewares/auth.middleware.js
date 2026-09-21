require("dotenv").config();
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: "Acesso não autorizado" });
  }
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
  next();
}

module.exports = { authMiddleware };
