"use strict";

const crypto = require("crypto");
const config = require("../config");

/*
  Einfacher Token-Schutz statt vollem Benutzer-System: Das KI-Studio ist ein
  internes Werkzeug fuer die Agentur, keine Endkunden-Anwendung. Jede
  Generierung kostet echtes Geld - deshalb muss jede erzeugende oder
  aendernde Anfrage ein Token mitschicken, das in der Server-.env steht und
  nirgends im Frontend-Quellcode.
*/

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function requireAdminToken(req, res, next) {
  if (!config.adminToken) {
    return res.status(503).json({
      error: "server-not-configured",
      message: "ADMIN_TOKEN ist auf dem Server nicht gesetzt. Siehe ai-studio/README.md.",
    });
  }

  const provided = req.get("x-admin-token") || "";
  if (!provided || !timingSafeEqual(provided, config.adminToken)) {
    return res.status(401).json({ error: "unauthorized", message: "Ungueltiges oder fehlendes Admin-Token." });
  }
  next();
}

module.exports = { requireAdminToken };
