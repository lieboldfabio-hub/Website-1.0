"use strict";

require("dotenv").config();

function list(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function bool(value, fallback) {
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1";
}

const config = {
  port: parseInt(process.env.PORT, 10) || 8787,
  adminToken: process.env.ADMIN_TOKEN || "",
  allowedOrigins: list(process.env.ALLOWED_ORIGINS),
  maxDailyGenerations: parseInt(process.env.MAX_DAILY_GENERATIONS, 10) || 40,
  mockEnabled: bool(process.env.AI_STUDIO_ENABLE_MOCK, false),
  repoRoot: process.env.AI_STUDIO_REPO_ROOT || "",

  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    imageModel: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
  },
  google: {
    apiKey: process.env.GOOGLE_API_KEY || "",
    imageModel: process.env.GOOGLE_IMAGE_MODEL || "gemini-2.5-flash-image",
  },
  runway: {
    apiKey: process.env.RUNWAY_API_KEY || "",
    apiVersion: process.env.RUNWAY_API_VERSION || "2024-11-06",
    model: process.env.RUNWAY_MODEL || "gen4_turbo",
  },
  luma: {
    apiKey: process.env.LUMA_API_KEY || "",
  },
};

if (!config.adminToken) {
  // eslint-disable-next-line no-console
  console.warn(
    "[config] ADMIN_TOKEN ist nicht gesetzt – alle erzeugenden Endpunkte " +
      "bleiben gesperrt, bis eines in .env eingetragen wird."
  );
}

module.exports = config;
