/* ============================================================================
   Bilder rendern
   ----------------------------------------------------------------------------
   Faehrt das Bildlabor in einem Browser hoch, macht von jeder Szene eine
   Aufnahme und legt sie unter assets/img ab. Damit sind die Bilder der Website
   reproduzierbar: wer eine Szene aendert, laesst das Skript erneut laufen.

       node werkzeug/bilder-rendern.mjs

   Voraussetzung: Playwright mit Chromium. Ohne beides bleibt der Bestand
   unveraendert liegen — das Skript loescht nichts.
   ========================================================================= */

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = join(hier, '..');

const AUFTRAEGE = [
  { szene: 'helix',   datei: 'werk-hallenlicht.jpg',  breite: 1400, hoehe: 1050 },
  { szene: 'prisma',  datei: 'werk-prisma.jpg',       breite: 1050, hoehe: 1400 },
  { szene: 'terrain', datei: 'werk-terrain.jpg',      breite: 1600, hoehe: 900 },
  { szene: 'raster',  datei: 'werk-nachtschicht.jpg', breite: 1050, hoehe: 1400 },
  { szene: 'studio',  datei: 'studio.jpg',            breite: 1600, hoehe: 1000 },
  { szene: 'helix',   datei: 'og.jpg',                breite: 1200, hoehe: 630 }
];

const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

/* Ein winziger Server, weil Module ueber file:// nicht geladen werden duerfen. */
const server = createServer(async (anfrage, antwort) => {
  try {
    const pfad = normalize(decodeURIComponent(anfrage.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    const datei = join(wurzel, pfad);
    if (!datei.startsWith(wurzel)) { antwort.writeHead(403).end(); return; }
    const inhalt = await readFile(datei);
    antwort.writeHead(200, { 'Content-Type': TYPEN[extname(datei)] || 'application/octet-stream' });
    antwort.end(inhalt);
  } catch {
    antwort.writeHead(404).end('nicht gefunden');
  }
});

await new Promise(fertig => server.listen(0, '127.0.0.1', fertig));
const tor = server.address().port;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

for (const auftrag of AUFTRAEGE) {
  // Halbe Groesse mal doppelte Bildpunktdichte ergibt die Zielgroesse und
  // glaettet die Kanten gleich mit.
  const seite = await browser.newPage({
    viewport: { width: Math.round(auftrag.breite / 2), height: Math.round(auftrag.hoehe / 2) },
    deviceScaleFactor: 2
  });
  const adresse = `http://127.0.0.1:${tor}/werkzeug/bildlabor.html?szene=${auftrag.szene}`;
  await seite.goto(adresse, { waitUntil: 'load' });
  await seite.waitForFunction('window.__fertig === true', null, { timeout: 30000 });
  await seite.waitForTimeout(180);

  await seite.locator('#bild').screenshot({
    path: join(wurzel, 'assets', 'img', auftrag.datei),
    type: 'jpeg',
    quality: 86
  });
  console.log('fertig:', auftrag.datei, auftrag.breite + '×' + auftrag.hoehe);
  await seite.close();
}

await browser.close();
server.close();
