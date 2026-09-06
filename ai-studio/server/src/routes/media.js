"use strict";

const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const config = require("../config");
const mediaLibrary = require("../services/mediaLibrary");
const generationService = require("../services/generationService");
const { requireAdminToken } = require("../middleware/auth");

const router = express.Router();

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

router.get("/", requireAdminToken, (req, res) => {
  res.json({ media: mediaLibrary.list() });
});

/*
  Eigener Auth-Weg statt requireAdminToken: <img>/<video>-Tags koennen keine
  eigenen Header setzen, das Token kommt hier deshalb als Query-Parameter.
  Das ist fuer ein internes Werkzeug hinter HTTPS vertretbar, sollte aber
  nicht als Vorbild fuer oeffentliche Endpunkte dienen.
*/
router.get("/:id/file", (req, res) => {
  const token = req.query.token || "";
  if (!config.adminToken || !timingSafeEqual(token, config.adminToken)) {
    return res.status(401).json({ error: "unauthorized", message: "Ungueltiges oder fehlendes Token." });
  }
  const record = mediaLibrary.get(req.params.id);
  const abs = mediaLibrary.filePath(req.params.id);
  if (!record || !abs || !fs.existsSync(abs)) {
    return res.status(404).json({ error: "not-found", message: "Medium nicht gefunden." });
  }
  res.setHeader("Content-Type", record.mimeType);
  res.setHeader("Cache-Control", "private, max-age=3600");
  fs.createReadStream(abs).pipe(res);
});

router.post("/:id/apply", requireAdminToken, (req, res, next) => {
  try {
    const result = mediaLibrary.applyToWebsite(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/regenerate", requireAdminToken, (req, res, next) => {
  try {
    const record = mediaLibrary.get(req.params.id);
    if (!record) return res.status(404).json({ error: "not-found", message: "Medium nicht gefunden." });
    const job = generationService.regenerate(record);
    res.status(202).json({ jobId: job.id });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAdminToken, (req, res) => {
  const removed = mediaLibrary.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: "not-found", message: "Medium nicht gefunden." });
  res.status(204).end();
});

module.exports = router;
