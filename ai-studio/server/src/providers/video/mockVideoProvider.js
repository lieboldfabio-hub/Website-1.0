"use strict";

const crypto = require("crypto");
const VideoProvider = require("./base");

/*
  Test-Provider ohne Kosten und ohne externe Anfrage. Simuliert eine
  asynchrone Videogenerierung (Warten, dann fertig), liefert aber kein
  echtes Video, sondern eine kurze Textdatei mit dem verwendeten Prompt -
  ausreichend, um Job-Status, Fortschrittsanzeige und Medienverwaltung ohne
  echten Videoanbieter durchzuspielen. Nur aktiv bei AI_STUDIO_ENABLE_MOCK=true.
*/

const SIMULATED_DURATION_MS = 6000;

class MockVideoProvider extends VideoProvider {
  constructor() {
    super();
    this.id = "mock";
    this.label = "Test-Video (kein echtes KI-Ergebnis)";
    this.costHint = "kostenlos";
    this.requiresSourceImage = false;
    this._jobs = new Map();
  }

  isConfigured() {
    return true;
  }

  async startGeneration({ prompt, aspect, durationSeconds }) {
    const externalJobId = crypto.randomUUID();
    this._jobs.set(externalJobId, { startedAt: Date.now(), prompt, aspect, durationSeconds });
    return { externalJobId };
  }

  async pollGeneration(externalJobId) {
    const job = this._jobs.get(externalJobId);
    if (!job) return { status: "failed", error: "Unbekannter Test-Job." };

    const elapsed = Date.now() - job.startedAt;
    if (elapsed < SIMULATED_DURATION_MS) {
      return { status: "processing", progress: Math.round((elapsed / SIMULATED_DURATION_MS) * 100) };
    }

    const text =
      `MOCK-VIDEO – kein echtes KI-Ergebnis\n\n` +
      `Prompt: ${job.prompt}\n` +
      `Seitenverhaeltnis: ${job.aspect}\n` +
      `Laenge: ${job.durationSeconds || 5}s\n\n` +
      `Mit einem echten Provider (Runway, Luma) waere an dieser Stelle eine ` +
      `MP4-Datei entstanden.`;

    this._jobs.delete(externalJobId);
    return {
      status: "completed",
      progress: 100,
      inlineResult: { buffer: Buffer.from(text, "utf8"), mimeType: "text/plain" },
    };
  }
}

module.exports = MockVideoProvider;
