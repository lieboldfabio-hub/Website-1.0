"use strict";

const ImageProvider = require("./base");

/*
  OpenAI Images API (gpt-image-1).
  Doku: https://platform.openai.com/docs/api-reference/images/create
  Auth: Authorization: Bearer <OPENAI_API_KEY>
*/

const ENDPOINT = "https://api.openai.com/v1/images/generations";

function sizeForAspect(aspect) {
  const [w, h] = String(aspect || "1:1").split(":").map(Number);
  if (!w || !h) return "1024x1024";
  const ratio = w / h;
  if (ratio > 1.15) return "1536x1024"; // Querformat
  if (ratio < 0.87) return "1024x1536"; // Hochformat
  return "1024x1024"; // annaehernd quadratisch
}

class OpenAIImageProvider extends ImageProvider {
  constructor(config) {
    super();
    this.id = "openai";
    this.label = "OpenAI (gpt-image-1)";
    this.costHint = "~0,04–0,17 $ pro Bild, je nach Groesse/Qualitaet";
    this.config = config;
  }

  isConfigured() {
    return Boolean(this.config.apiKey);
  }

  async generateImage({ prompt, aspect }) {
    if (!this.isConfigured()) {
      throw new Error("OpenAI ist nicht konfiguriert (OPENAI_API_KEY fehlt).");
    }

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.imageModel,
        prompt,
        size: sizeForAspect(aspect),
        n: 1,
        quality: "high",
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`OpenAI-Bildgenerierung fehlgeschlagen (${response.status}): ${detail.slice(0, 500)}`);
    }

    const data = await response.json();
    const b64 = data && data.data && data.data[0] && data.data[0].b64_json;
    if (!b64) throw new Error("OpenAI hat kein Bild zurueckgegeben.");

    return { buffer: Buffer.from(b64, "base64"), mimeType: "image/png" };
  }
}

module.exports = OpenAIImageProvider;
