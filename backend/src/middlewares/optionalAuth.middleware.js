require("dotenv").config();
const jwt = require("jsonwebtoken");

function optionalAuthMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return next();
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    return next();
  }
  next();
}

module.exports = { optionalAuthMiddleware };
