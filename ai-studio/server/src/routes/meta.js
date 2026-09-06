"use strict";

const express = require("express");
const industries = require("../services/industries");
const promptBuilder = require("../services/promptBuilder");
const imageProviders = require("../providers/image/registry");
const videoProviders = require("../providers/video/registry");
const mediaLibrary = require("../services/mediaLibrary");
const config = require("../config");
const { requireAdminToken } = require("../middleware/auth");

const router = express.Router();
router.use(requireAdminToken);

router.get("/industries", (req, res) => {
  res.json({ industries: industries.all() });
});

router.get("/options", (req, res) => {
  res.json({
    colorSchemes: promptBuilder.COLOR_SCHEMES,
    styles: Object.keys(promptBuilder.STYLES),
    atmospheres: Object.keys(promptBuilder.ATMOSPHERES),
  });
});

router.get("/providers", (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const usedToday = mediaLibrary.countCreatedSince(startOfDay.toISOString());

  res.json({
    image: imageProviders.list(),
    video: videoProviders.list(),
    dailyLimit: config.maxDailyGenerations,
    usedToday,
    remainingToday: Math.max(0, config.maxDailyGenerations - usedToday),
  });
});

module.exports = router;
