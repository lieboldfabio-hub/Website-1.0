"use strict";

/**
 * Gemeinsame Schnittstelle aller Bild-Provider. Ein neuer Anbieter muss nur
 * diese Klasse erweitern und sich in registry.js eintragen - der Rest der
 * Anwendung (Routen, Job-Manager, Frontend) bleibt unveraendert.
 */
class ImageProvider {
  /** @type {string} eindeutiger Bezeichner, z. B. "openai" */
  id = "base";
  /** @type {string} Anzeigename fuer die Oberflaeche */
  label = "Basis-Provider";
  /** @type {string} grobe Kosteneinschaetzung fuer die Oberflaeche */
  costHint = "unbekannt";

  /** @returns {boolean} ob die noetigen Zugangsdaten gesetzt sind */
  isConfigured() {
    return false;
  }

  /**
   * @param {object} request
   * @param {string} request.prompt
   * @param {string} [request.negativePrompt]
   * @param {string} request.aspect z. B. "16:9", "4:5", "1:1"
   * @returns {Promise<{buffer: Buffer, mimeType: string}>}
   */
  // eslint-disable-next-line no-unused-vars
  async generateImage(request) {
    throw new Error(`Provider ${this.id} implementiert generateImage() nicht.`);
  }
}

module.exports = ImageProvider;
