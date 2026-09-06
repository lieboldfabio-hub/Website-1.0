"use strict";

const logger = require("../logger");

function notFound(req, res) {
  res.status(404).json({ error: "not-found", message: `Kein Endpunkt fuer ${req.method} ${req.path}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.path} –`, err && err.message ? err.message : err);
  const status = err.status || 500;
  res.status(status).json({
    error: "internal-error",
    message: err && err.message ? err.message : "Unerwarteter Serverfehler.",
  });
}

module.exports = { notFound, errorHandler };
