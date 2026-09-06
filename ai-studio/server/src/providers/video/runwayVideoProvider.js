"use strict";

const VideoProvider = require("./base");

/*
  Runway ML – Bild-zu-Video (Gen-4/Gen-3 Turbo). Runways oeffentliche API
  erzeugt Video aus einem Startbild plus Textprompt, nicht aus Text allein.
  Deshalb erzeugt die aufrufende Stelle (routes/generate.js) zuerst ein
  Standbild ueber einen Bild-Provider und reicht es hier als sourceImage
  durch ("Bild als erster Frame, dann Animation").
  Doku: https://docs.dev.runwayml.com/
  Auth: Authorization: Bearer <RUNWAY_API_KEY>, X-Runway-Version: <Datum>
*/

const BASE = "https://api.dev.runwayml.com/v1";
const SUPPORTED_RATIOS = {
  "16:9": "1280:720",
  "9:16": "720:1280",
  "4:3": "1104:832",
  "3:4": "832:1104",
  "1:1": "960:960",
};

function ratioFor(aspect) {
  return SUPPORTED_RATIOS[aspect] || SUPPORTED_RATIOS["16:9"];
}

class RunwayVideoProvider extends VideoProvider {
  constructor(config) {
    super();
    this.id = "runway";
    this.label = "Runway ML (Gen-4 Turbo)";
    this.costHint = "~0,25–1,00 $ pro Video, abhaengig von Laenge";
    this.requiresSourceImage = true;
    this.config = config;
  }

  isConfigured() {
    return Boolean(this.config.apiKey);
  }

  async startGeneration({ prompt, aspect, durationSeconds, sourceImage }) {
    if (!this.isConfigured()) {
      throw new Error("Runway ist nicht konfiguriert (RUNWAY_API_KEY fehlt).");
    }
    if (!sourceImage) {
      throw new Error("Runway benoetigt ein Startbild, es wurde keins uebergeben.");
    }

    const dataUri = `data:${sourceImage.mimeType};base64,${sourceImage.buffer.toString("base64")}`;

    const response = await fetch(`${BASE}/image_to_video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "X-Runway-Version": this.config.apiVersion,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.model,
        promptImage: dataUri,
        promptText: prompt,
        ratio: ratioFor(aspect),
        duration: durationSeconds && durationSeconds >= 10 ? 10 : 5,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Runway-Videogenerierung fehlgeschlagen (${response.status}): ${detail.slice(0, 500)}`);
    }

    const data = await response.json();
    return { externalJobId: data.id };
  }

  async pollGeneration(externalJobId) {
    const response = await fetch(`${BASE}/tasks/${externalJobId}`, {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "X-Runway-Version": this.config.apiVersion,
      },
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Runway-Statusabfrage fehlgeschlagen (${response.status}): ${detail.slice(0, 500)}`);
    }
    const data = await response.json();

    if (data.status === "SUCCEEDED") {
      return { status: "completed", progress: 100, videoUrl: data.output && data.output[0] };
    }
    if (data.status === "FAILED") {
      return { status: "failed", error: data.failure || "Runway meldet einen Fehler." };
    }
    return { status: "processing", progress: typeof data.progress === "number" ? Math.round(data.progress * 100) : undefined };
  }
}

module.exports = RunwayVideoProvider;
