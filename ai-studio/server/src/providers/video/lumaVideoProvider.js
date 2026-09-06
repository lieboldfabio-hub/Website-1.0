"use strict";

const VideoProvider = require("./base");

/*
  Luma AI Dream Machine – reine Text-zu-Video-API, kein Startbild noetig.
  Doku: https://docs.lumalabs.ai/docs/video-generation
  Auth: Authorization: Bearer <LUMA_API_KEY>
*/

const BASE = "https://api.lumalabs.ai/dream-machine/v1/generations";
const SUPPORTED_ASPECTS = ["1:1", "3:4", "4:3", "9:16", "16:9", "9:21", "21:9"];

function closestSupportedAspect(aspect) {
  if (SUPPORTED_ASPECTS.includes(aspect)) return aspect;
  const [w, h] = String(aspect || "16:9").split(":").map(Number);
  if (!w || !h) return "16:9";
  const ratio = w / h;
  if (ratio > 1.4) return "16:9";
  if (ratio > 1.05) return "4:3";
  if (ratio < 0.6) return "9:16";
  if (ratio < 0.95) return "3:4";
  return "1:1";
}

class LumaVideoProvider extends VideoProvider {
  constructor(config) {
    super();
    this.id = "luma";
    this.label = "Luma AI Dream Machine";
    this.costHint = "~0,25–0,50 $ pro Video (5s)";
    this.requiresSourceImage = false;
    this.config = config;
  }

  isConfigured() {
    return Boolean(this.config.apiKey);
  }

  async startGeneration({ prompt, aspect }) {
    if (!this.isConfigured()) {
      throw new Error("Luma AI ist nicht konfiguriert (LUMA_API_KEY fehlt).");
    }

    const response = await fetch(BASE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: closestSupportedAspect(aspect),
        loop: false,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Luma-Videogenerierung fehlgeschlagen (${response.status}): ${detail.slice(0, 500)}`);
    }

    const data = await response.json();
    return { externalJobId: data.id };
  }

  async pollGeneration(externalJobId) {
    const response = await fetch(`${BASE}/${externalJobId}`, {
      headers: { Authorization: `Bearer ${this.config.apiKey}` },
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Luma-Statusabfrage fehlgeschlagen (${response.status}): ${detail.slice(0, 500)}`);
    }
    const data = await response.json();

    if (data.state === "completed") {
      return { status: "completed", progress: 100, videoUrl: data.assets && data.assets.video };
    }
    if (data.state === "failed") {
      return { status: "failed", error: data.failure_reason || "Luma meldet einen Fehler." };
    }
    // "queued" oder "dreaming" – Luma liefert keinen numerischen Fortschritt.
    return { status: "processing" };
  }
}

module.exports = LumaVideoProvider;
