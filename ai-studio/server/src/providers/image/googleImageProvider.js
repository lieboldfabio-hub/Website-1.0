"use strict";

const ImageProvider = require("./base");

/*
  Google Gemini – native Bildausgabe ueber generateContent.
  Doku: https://ai.google.dev/gemini-api/docs/image-generation
  Auth: API-Key als Query-Parameter (Google AI Studio Key, kein GCP-Projekt noetig)
*/

const SUPPORTED_ASPECTS = ["1:1", "3:4", "4:3", "9:16", "16:9"];

function closestSupportedAspect(aspect) {
  if (SUPPORTED_ASPECTS.includes(aspect)) return aspect;
  const [w, h] = String(aspect || "1:1").split(":").map(Number);
  if (!w || !h) return "1:1";
  const ratio = w / h;
  if (ratio > 1.3) return "16:9";
  if (ratio > 1.05) return "4:3";
  if (ratio < 0.75) return "9:16";
  if (ratio < 0.95) return "3:4";
  return "1:1";
}

class GoogleImageProvider extends ImageProvider {
  constructor(config) {
    super();
    this.id = "google";
    this.label = "Google Gemini (Bild)";
    this.costHint = "~0,02–0,04 $ pro Bild";
    this.config = config;
  }

  isConfigured() {
    return Boolean(this.config.apiKey);
  }

  async generateImage({ prompt, aspect }) {
    if (!this.isConfigured()) {
      throw new Error("Google Gemini ist nicht konfiguriert (GOOGLE_API_KEY fehlt).");
    }

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${this.config.imageModel}:generateContent` +
      `?key=${encodeURIComponent(this.config.apiKey)}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: closestSupportedAspect(aspect) },
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Google-Bildgenerierung fehlgeschlagen (${response.status}): ${detail.slice(0, 500)}`);
    }

    const data = await response.json();
    const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content
      ? data.candidates[0].content.parts || []
      : [];
    const imagePart = parts.find((p) => p.inlineData && p.inlineData.data);
    if (!imagePart) throw new Error("Google hat kein Bild zurueckgegeben.");

    return {
      buffer: Buffer.from(imagePart.inlineData.data, "base64"),
      mimeType: imagePart.inlineData.mimeType || "image/png",
    };
  }
}

module.exports = GoogleImageProvider;
