function errorHandler(error, req, res, next) {
  // JSON malformado no body
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON inválido" });
  }

  const status = error.status || 500;

  if (status >= 500) {
    console.error(error);
    return res.status(500).json({ message: "Houve um erro no servidor" });
  }

  return res.status(status).json({ message: error.message });
}

module.exports = { errorHandler };
