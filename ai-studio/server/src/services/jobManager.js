"use strict";

const crypto = require("crypto");
const logger = require("../logger");

/*
  Jobs bilden die asynchrone Generierung ab (Bild: meist Sekunden, Video:
  bis zu mehreren Minuten) und liefern dem Frontend einen Fortschritt zum
  Abfragen (Polling ueber GET /api/jobs/:id).

  Bewusst nur im Arbeitsspeicher: Ein Job lebt hoechstens ein paar Minuten,
  ein Neustart des Servers waehrend einer laufenden Generierung ist selten
  und fuer ein internes Werkzeug hinnehmbar. Das fertige Ergebnis landet
  ohnehin dauerhaft in der Media-Library (services/mediaLibrary.js).
*/

const JOB_TTL_MS = 30 * 60 * 1000; // Jobs verschwinden 30 Min. nach Abschluss

class JobManager {
  constructor() {
    /** @type {Map<string, object>} */
    this.jobs = new Map();
    setInterval(() => this._sweep(), 5 * 60 * 1000).unref();
  }

  create(type, meta) {
    const id = crypto.randomUUID();
    const job = {
      id,
      type, // "image" | "video"
      status: "queued", // queued -> running -> done | error
      progress: 0,
      message: "In der Warteschlange …",
      meta,
      result: null,
      error: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      finishedAt: null,
    };
    this.jobs.set(id, job);
    return job;
  }

  get(id) {
    return this.jobs.get(id) || null;
  }

  _touch(job) {
    job.updatedAt = new Date().toISOString();
  }

  setProgress(id, progress, message) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = "running";
    job.progress = Math.max(0, Math.min(99, Math.round(progress)));
    if (message) job.message = message;
    this._touch(job);
  }

  complete(id, result) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = "done";
    job.progress = 100;
    job.message = "Fertig.";
    job.result = result;
    job.finishedAt = new Date().toISOString();
    this._touch(job);
  }

  fail(id, error) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = "error";
    job.message = "Fehlgeschlagen.";
    job.error = typeof error === "string" ? error : error && error.message ? error.message : "Unbekannter Fehler";
    job.finishedAt = new Date().toISOString();
    this._touch(job);
    logger.error(`Job ${id} fehlgeschlagen:`, job.error);
  }

  /**
   * Fuehrt eine Generierung aus und meldet den Fortschritt.
   * @param {string} id Job-Id
   * @param {(report: (progress:number, message?:string) => void) => Promise<any>} executor
   */
  async run(id, executor) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = "running";
    job.message = "Wird erzeugt …";
    this._touch(job);

    const report = (progress, message) => this.setProgress(id, progress, message);

    try {
      const result = await executor(report);
      this.complete(id, result);
    } catch (err) {
      this.fail(id, err);
    }
  }

  /**
   * Fuer Provider ohne eigenen Fortschritt (z. B. ein einzelner API-Aufruf):
   * simuliert einen ruhigen, glaubwuerdigen Fortschrittsbalken, waehrend die
   * eigentliche Anfrage im Hintergrund laeuft.
   */
  async runWithSimulatedProgress(id, promiseFactory, messages) {
    return this.run(id, async (report) => {
      const steps = messages || [
        "Prompt wird aufbereitet …",
        "Anfrage an den KI-Anbieter …",
        "Bild wird gerendert …",
        "Ergebnis wird verarbeitet …",
      ];
      let step = 0;
      report(4, steps[0]);
      const ticker = setInterval(() => {
        step += 1;
        const target = Math.min(90, 10 + step * 9);
        report(target, steps[Math.min(step, steps.length - 1)]);
      }, 1400);
      try {
        return await promiseFactory();
      } finally {
        clearInterval(ticker);
      }
    });
  }

  _sweep() {
    const now = Date.now();
    for (const [id, job] of this.jobs.entries()) {
      if (!job.finishedAt) continue;
      if (now - new Date(job.finishedAt).getTime() > JOB_TTL_MS) {
        this.jobs.delete(id);
      }
    }
  }
}

module.exports = new JobManager();
