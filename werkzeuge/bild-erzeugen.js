#!/usr/bin/env node
"use strict";
// ============================================================================
// Ein einzelnes Bild ueber OpenAI erzeugen – ohne laufenden Studio-Server.
//
//   node werkzeuge/bild-erzeugen.js "Prompt" [Optionen]
//
// Gedacht fuer die Arbeit an der Kommandozeile: Claude oder Du koennen damit
// ein Bild erzeugen, ohne vorher ai-studio/server zu starten und ohne die
// Oberflaeche zu oeffnen. Fuer ganze Bilderserien mit Branchen-Vorlagen und
// Medienablage bleibt das KI-Studio zustaendig.
//
// Der eigentliche API-Aufruf kommt aus dem vorhandenen Provider
// (ai-studio/server/src/providers/image/openaiImageProvider.js). Dieses Skript
// dupliziert ihn bewusst NICHT – ein Modellwechsel oder Fix dort wirkt hier
// sofort mit. Deshalb auch keine Abhaengigkeiten: der Provider braucht nur
// "fetch" aus Node 18+.
//
// Optionen:
//   --seite  <v:h>   Seitenverhaeltnis, z. B. 16:9, 4:5, 1:1   (Vorgabe 16:9)
//   --ziel   <pfad>  Zieldatei (Vorgabe: bild-<zeitstempel>.png im aktuellen Ordner)
//   --modell <name>  uebersteuert OPENAI_IMAGE_MODEL fuer diesen einen Aufruf
//
// Der Schluessel kommt aus der Umgebung oder aus ai-studio/server/.env.
// ============================================================================

const fs = require("fs");
const path = require("path");

const WURZEL = path.resolve(__dirname, "..");
const ENV_DATEI = path.join(WURZEL, "ai-studio", "server", ".env");

/* ------------------------------------------------------------------ .env -- */
// Bewusst ein Mini-Parser statt dotenv: dieses Skript soll auch dann laufen,
// wenn in ai-studio/server nie "npm install" gelaufen ist.
function ausEnvDatei(schluessel) {
  if (!fs.existsSync(ENV_DATEI)) return "";
  for (const zeile of fs.readFileSync(ENV_DATEI, "utf8").split(/\r?\n/)) {
    const treffer = zeile.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (treffer && treffer[1] === schluessel) {
      return treffer[2].replace(/^["']|["']$/g, "");
    }
  }
  return "";
}

function wert(schluessel) {
  return process.env[schluessel] || ausEnvDatei(schluessel);
}

/* ---------------------------------------------------------- Argumente ---- */
function argumenteLesen(argv) {
  const opt = { prompt: "", seite: "16:9", ziel: "", modell: "" };
  const namen = { "--seite": "seite", "--ziel": "ziel", "--modell": "modell" };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (namen[a]) {
      const folgt = argv[++i];
      if (!folgt) {
        throw new Error(`${a} braucht einen Wert.`);
      }
      opt[namen[a]] = folgt;
    } else if (a.startsWith("--")) {
      throw new Error(`Unbekannte Option: ${a}`);
    } else if (!opt.prompt) {
      opt.prompt = a;
    } else {
      throw new Error("Mehr als ein Prompt angegeben – bitte in Anfuehrungszeichen setzen.");
    }
  }
  return opt;
}

function hilfe() {
  console.log(
    [
      "Aufruf: node werkzeuge/bild-erzeugen.js \"<Prompt>\" [Optionen]",
      "",
      "  --seite  <v:h>   Seitenverhaeltnis (Vorgabe 16:9)",
      "  --ziel   <pfad>  Zieldatei (Vorgabe bild-<zeitstempel>.png)",
      "  --modell <name>  Modell fuer diesen Aufruf",
      "",
      "Beispiel:",
      '  node werkzeuge/bild-erzeugen.js "Werkstatt eines Elektrikers, Morgenlicht" \\',
      "      --seite 16:9 --ziel beispiele/halbritter-haustechnik/assets/img/held.png",
    ].join("\n")
  );
}

/* ------------------------------------------------------------- Ablauf ---- */
async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes("--hilfe") || argv.includes("-h")) {
    hilfe();
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const opt = argumenteLesen(argv);
  if (!opt.prompt) throw new Error("Kein Prompt angegeben.");

  const apiKey = wert("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY fehlt.\n" +
        "  Entweder in die Umgebung setzen, oder in ai-studio/server/.env eintragen\n" +
        "  (Vorlage: ai-studio/server/.env.example). Schluessel holen:\n" +
        "  https://platform.openai.com/api-keys"
    );
  }

  const OpenAIImageProvider = require(path.join(
    WURZEL,
    "ai-studio/server/src/providers/image/openaiImageProvider"
  ));
  const provider = new OpenAIImageProvider({
    apiKey,
    imageModel: opt.modell || wert("OPENAI_IMAGE_MODEL") || "gpt-image-1",
  });

  const zeitstempel = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const ziel = path.resolve(opt.ziel || `bild-${zeitstempel}.png`);

  // Vor dem kostenpflichtigen Aufruf pruefen – ein fehlendes Verzeichnis erst
  // nach der Rechnung zu bemerken waere aergerlich.
  const ordner = path.dirname(ziel);
  if (!fs.existsSync(ordner)) {
    throw new Error(`Zielordner gibt es nicht: ${ordner}`);
  }

  console.error(`[bild] Modell ${provider.config.imageModel}, Seite ${opt.seite}`);
  const { buffer } = await provider.generateImage({ prompt: opt.prompt, aspect: opt.seite });

  fs.writeFileSync(ziel, buffer);
  console.error(`[bild] ${(buffer.length / 1024).toFixed(0)} KB geschrieben`);
  console.log(ziel);
}

main().catch((fehler) => {
  console.error(`\nFehlgeschlagen: ${fehler.message}\n`);
  process.exit(1);
});
