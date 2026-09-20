const { register, login } = require("../controllers/auth.controller");
const { Router } = require("express");

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);

module.exports = { authRoutes };
