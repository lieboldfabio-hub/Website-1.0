"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const config = require("../config");

/*
  Medienverwaltung: jedes erzeugte Bild/Video bekommt einen Datensatz in
  einer JSON-Datei (data/media-db.json) und liegt als Datei unter
  data/media/<id>.<ext>. Kein Datenbankserver noetig - fuer die zu
  erwartende Menge (ein internes Werkzeug, keine Endkundschaft) reicht das
  vollkommen und bleibt fuer jede Hosting-Umgebung ohne Zusatzdienst lauffaehig.

  "Fuer Website uebernehmen" kopiert die Datei zusaetzlich unter den exakten
  Namen, den die jeweilige Beispiel-Website als Bildplatzhalter erwartet
  (siehe beispiele/BILDPROMPTS.md) - dort erscheint sie dann automatisch,
  ohne dass am HTML/CSS etwas geaendert werden muss.
*/

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const MEDIA_DIR = path.join(DATA_DIR, "media");
const DB_FILE = path.join(DATA_DIR, "media-db.json");

const EXT_BY_MIME = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "text/plain": "txt",
};

function ensureDirs() {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

function readDb() {
  ensureDirs();
  if (!fs.existsSync(DB_FILE)) return [];
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function writeDb(records) {
  ensureDirs();
  fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), "utf8");
}

/**
 * @param {object} entry
 * @param {"image"|"video"} entry.type
 * @param {string} entry.provider
 * @param {string} entry.industry
 * @param {string|null} entry.projectSlug
 * @param {string|null} entry.slotId
 * @param {string|null} entry.slotFilename
 * @param {string} entry.prompt
 * @param {object} entry.params
 * @param {Buffer} entry.buffer
 * @param {string} entry.mimeType
 * @param {boolean} [entry.mock]
 */
function save(entry) {
  ensureDirs();
  const id = crypto.randomUUID();
  const ext = EXT_BY_MIME[entry.mimeType] || "bin";
  const fileName = `${id}.${ext}`;
  fs.writeFileSync(path.join(MEDIA_DIR, fileName), entry.buffer);

  const record = {
    id,
    type: entry.type,
    provider: entry.provider,
    industry: entry.industry,
    projectSlug: entry.projectSlug || null,
    slotId: entry.slotId || null,
    slotFilename: entry.slotFilename || null,
    prompt: entry.prompt,
    params: entry.params || {},
    fileName,
    mimeType: entry.mimeType,
    bytes: entry.buffer.length,
    mock: Boolean(entry.mock),
    createdAt: new Date().toISOString(),
    appliedAt: null,
    appliedPath: null,
  };

  const records = readDb();
  records.unshift(record);
  writeDb(records);
  return record;
}

function list() {
  return readDb();
}

function get(id) {
  return readDb().find((r) => r.id === id) || null;
}

function filePath(id) {
  const record = get(id);
  if (!record) return null;
  return path.join(MEDIA_DIR, record.fileName);
}

function remove(id) {
  const records = readDb();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  const [record] = records.splice(idx, 1);
  writeDb(records);
  const abs = path.join(MEDIA_DIR, record.fileName);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
  return true;
}

/**
 * Uebernimmt ein Bild/Video fuer die zugeordnete Beispiel-Website, sofern
 * eine konkrete Datei-Position bekannt ist (projectSlug + slotFilename) UND
 * der Server auf einer lokalen Kopie des Repos laeuft (AI_STUDIO_REPO_ROOT).
 * Sonst wird nur die erwartete Zielangabe zurueckgegeben, damit die Datei
 * manuell abgelegt werden kann.
 */
function applyToWebsite(id) {
  const record = get(id);
  if (!record) throw new Error("Medium nicht gefunden.");
  if (!record.projectSlug || !record.slotFilename) {
    return {
      applied: false,
      reason: "no-slot",
      hint:
        "Fuer diese Branche gibt es noch kein passendes Beispielprojekt im " +
        "Repo. Bild/Video wurde erzeugt und kann heruntergeladen werden.",
    };
  }

  const targetRel = path.join(
    "beispiele",
    record.projectSlug,
    "assets",
    "img",
    record.slotFilename
  );

  if (!config.repoRoot) {
    return {
      applied: false,
      reason: "no-repo-root",
      targetPath: targetRel,
      hint:
        `AI_STUDIO_REPO_ROOT ist nicht gesetzt. Datei herunterladen und als ` +
        `"${targetRel}" im Repo ablegen - die Seite tauscht den Platzhalter ` +
        `dann automatisch aus.`,
    };
  }

  const absoluteTarget = path.join(config.repoRoot, targetRel);
  fs.mkdirSync(path.dirname(absoluteTarget), { recursive: true });
  fs.copyFileSync(path.join(MEDIA_DIR, record.fileName), absoluteTarget);

  const records = readDb();
  const stored = records.find((r) => r.id === id);
  stored.appliedAt = new Date().toISOString();
  stored.appliedPath = targetRel;
  writeDb(records);

  return { applied: true, targetPath: targetRel };
}

function countCreatedSince(sinceIso) {
  return readDb().filter((r) => r.createdAt >= sinceIso).length;
}

module.exports = {
  save,
  list,
  get,
  filePath,
  remove,
  applyToWebsite,
  countCreatedSince,
};
