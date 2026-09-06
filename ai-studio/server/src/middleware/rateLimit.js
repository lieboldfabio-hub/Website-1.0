"use strict";

const rateLimit = require("express-rate-limit");

/*
  Zwei Schutzschichten gegen ausufernde Kosten:
  1. generateLimiter: begrenzt, wie oft ueberhaupt angefragt werden darf
     (kurzfristiger Schutz gegen Doppelklicks/Skripte).
  2. Das Tageslimit (services/mediaLibrary.countCreatedSince, geprueft in
     routes/generate.js) begrenzt die tatsaechlich erzeugten Medien pro Tag.
*/

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "rate-limited", message: "Zu viele Generierungen in kurzer Zeit. Bitte kurz warten." },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "rate-limited", message: "Zu viele Anfragen. Bitte kurz warten." },
});

module.exports = { generateLimiter, generalLimiter };
