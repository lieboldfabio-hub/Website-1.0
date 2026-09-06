"use strict";

const express = require("express");
const config = require("../config");
const mediaLibrary = require("../services/mediaLibrary");
const generationService = require("../services/generationService");
const { requireAdminToken } = require("../middleware/auth");

const router = express.Router();
router.use(requireAdminToken);

function checkDailyLimit(res) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const usedToday = mediaLibrary.countCreatedSince(startOfDay.toISOString());
  if (usedToday >= config.maxDailyGenerations) {
    res.status(429).json({
      error: "daily-limit-reached",
      message: `Tageslimit von ${config.maxDailyGenerations} Generierungen erreicht. Siehe MAX_DAILY_GENERATIONS in .env.`,
    });
    return false;
  }
  return true;
}

router.post("/image", (req, res, next) => {
  try {
    if (!checkDailyLimit(res)) return;
    if (!req.body || !req.body.industrySlug) {
      return res.status(400).json({ error: "invalid-request", message: "industrySlug ist erforderlich." });
    }
    const job = generationService.enqueueImageGeneration(req.body);
    res.status(202).json({ jobId: job.id });
  } catch (err) {
    next(err);
  }
});

router.post("/video", (req, res, next) => {
  try {
    if (!checkDailyLimit(res)) return;
    if (!req.body || !req.body.industrySlug) {
      return res.status(400).json({ error: "invalid-request", message: "industrySlug ist erforderlich." });
    }
    const job = generationService.enqueueVideoGeneration(req.body);
    res.status(202).json({ jobId: job.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
