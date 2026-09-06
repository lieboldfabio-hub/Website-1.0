"use strict";

/**
 * Gemeinsame Schnittstelle aller Video-Provider. Videogenerierung laeuft bei
 * jedem Anbieter asynchron (Sekunden bis mehrere Minuten): startGeneration()
 * stoesst den Auftrag an, pollGeneration() fragt wiederholt den Status ab,
 * bis ein fertiges Video vorliegt. Der Job-Manager (services/jobManager.js)
 * uebernimmt das Polling und meldet den Fortschritt ans Frontend.
 */
class VideoProvider {
  id = "base";
  label = "Basis-Provider";
  costHint = "unbekannt";
  /** @type {boolean} true, wenn der Provider ein Startbild (Referenzframe) braucht */
  requiresSourceImage = false;

  isConfigured() {
    return false;
  }

  /**
   * @param {object} request
   * @param {string} request.prompt
   * @param {string} request.aspect
   * @param {number} request.durationSeconds
   * @param {{buffer: Buffer, mimeType: string}} [request.sourceImage]
   * @returns {Promise<{externalJobId: string}>}
   */
  // eslint-disable-next-line no-unused-vars
  async startGeneration(request) {
    throw new Error(`Provider ${this.id} implementiert startGeneration() nicht.`);
  }

  /**
   * @param {string} externalJobId
   * @returns {Promise<{status: "pending"|"processing"|"completed"|"failed", progress?: number, videoUrl?: string, inlineResult?: {buffer: Buffer, mimeType: string}, error?: string}>}
   */
  // eslint-disable-next-line no-unused-vars
  async pollGeneration(externalJobId) {
    throw new Error(`Provider ${this.id} implementiert pollGeneration() nicht.`);
  }
}

module.exports = VideoProvider;
