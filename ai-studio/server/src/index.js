"use strict";

const express = require("express");
const cors = require("cors");
const config = require("./config");
const logger = require("./logger");
const { generalLimiter, generateLimiter } = require("./middleware/rateLimit");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const healthRoute = require("./routes/health");
const metaRoute = require("./routes/meta");
const generateRoute = require("./routes/generate");
const jobsRoute = require("./routes/jobs");
const mediaRoute = require("./routes/media");

const app = express();

app.disable("x-powered-by");

// Sicherheits-Header ohne zusaetzliche Abhaengigkeit (kein helmet noetig fuer
// diesen kleinen, reinen JSON-API-Server ohne HTML-Ausgabe).
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

if (config.allowedOrigins.length === 0) {
  logger.warn(
    "ALLOWED_ORIGINS ist leer – CORS erlaubt aktuell jede Herkunft. Fuer den " +
      "produktiven Einsatz in .env auf die echte Domain des Frontends einschraenken."
  );
}
app.use(
  cors({
    origin: config.allowedOrigins.length ? config.allowedOrigins : true,
  })
);

app.use(express.json({ limit: "256kb" }));
app.use(generalLimiter);

app.use("/api/health", healthRoute);
app.use("/api/meta", metaRoute);
app.use("/api/generate", generateLimiter, generateRoute);
app.use("/api/jobs", jobsRoute);
app.use("/api/media", mediaRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`S & F KI-Studio Server laeuft auf Port ${config.port}`);
  if (!config.adminToken) {
    logger.warn("Kein ADMIN_TOKEN gesetzt – Generierung und Medienverwaltung bleiben gesperrt.");
  }
});
