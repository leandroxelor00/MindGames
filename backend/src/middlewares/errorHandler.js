function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || "Houve um erro no servidor";

  res.status(status).json({ message: message });
}

module.exports = { errorHandler };
