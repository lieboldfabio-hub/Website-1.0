# KI-Studio – Bild- und Videogenerierung für S & F Webseiten

Internes Werkzeug, das zu einer Branche (Restaurant, Fitness, Immobilien,
Friseur, Handwerker, Arztpraxis, Autohaus, Hotel, Recht) automatisch einen
passenden KI-Prompt baut und darüber hochwertige Bilder bzw. Videos erzeugt –
zur direkten Verwendung in den Beispielprojekten unter `beispiele/`.

Besteht aus zwei Teilen:

- **`server/`** – Node/Express-Backend. Spricht mit den KI-Anbietern, hält die
  API-Schlüssel serverseitig und liefert eine kleine JSON-API.
- **`sf-webseiten/ki-studio.html`** (+ `assets/js/ki-studio.js`,
  `assets/css/ki-studio.css`) – die Bedienoberfläche. Reines Frontend, ruft
  ausschließlich die API des Backends auf.

**Wichtig zum Hosting:** `sf-webseiten/` wird als statische Seite über GitHub
Pages ausgeliefert (`.github/workflows/pages.yml`) – GitHub Pages kann kein
Node.js ausführen. Der Server aus `server/` muss deshalb **separat** gehostet
werden (z. B. Render, Railway, Fly.io oder ein eigener kleiner VPS). Die
Studio-Seite fragt die Backend-Adresse einmalig beim Verbinden ab (siehe
„Bedienung" unten) – es ist keine feste URL im Code hinterlegt.

---

## 1. Architektur im Überblick

```
ai-studio/server/src/
├── index.js                    Express-App, Sicherheits-Header, CORS, Routen
├── config.js                   liest .env, keine Zugangsdaten im Code
├── providers/
│   ├── image/
│   │   ├── base.js             gemeinsame Schnittstelle
│   │   ├── openaiImageProvider.js
│   │   ├── googleImageProvider.js
│   │   ├── mockImageProvider.js   kostenloser Test-Provider
│   │   └── registry.js         zentrale Anlaufstelle, austauschbar
│   └── video/
│       ├── base.js
│       ├── runwayVideoProvider.js
│       ├── lumaVideoProvider.js
│       ├── mockVideoProvider.js
│       └── registry.js
├── services/
│   ├── industries.js           Branchen, Bildplätze, Stilblöcke
│   ├── promptBuilder.js        baut den englischen KI-Prompt aus dem Formular
│   ├── generationService.js    verbindet Prompt-Builder, Provider, Jobs, Medien
│   ├── jobManager.js           asynchrone Jobs mit Fortschritt (Polling)
│   └── mediaLibrary.js         JSON-Datenbank + Dateiablage
├── middleware/                 Admin-Token-Prüfung, Rate-Limits, Fehlerformat
└── routes/                     /api/generate, /api/jobs, /api/media, /api/meta
```

**Warum dieser Aufbau austauschbar ist:** Ein neuer Anbieter (Bild oder
Video) ist eine neue Datei nach dem Muster der bestehenden Provider plus ein
zusätzlicher `register(new XyzProvider(...))`-Aufruf in der jeweiligen
`registry.js`. Routen, Job-Manager, Medienverwaltung und Frontend fragen
ausschließlich die Registry ab (`GET /api/meta/providers`) und müssen dafür
nicht angefasst werden. Siehe Abschnitt 8.

---

## 2. Unterstützte KI-Anbieter

| Anbieter | Einsatz | Benötigter Zugang | Ungefähre Kosten |
|---|---|---|---|
| **OpenAI** (`gpt-image-1`) | Bild | API-Key von [platform.openai.com](https://platform.openai.com/api-keys) | ~0,04–0,17 $ pro Bild (je nach Größe/Qualität) |
| **Google Gemini** (natives Bildmodell) | Bild | API-Key von [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | ~0,02–0,04 $ pro Bild |
| **Luma AI Dream Machine** | Video (Text→Video, kein Startbild nötig) | API-Key von [lumalabs.ai/dream-machine/api/keys](https://lumalabs.ai/dream-machine/api/keys) | ~0,25–0,50 $ pro Video (5 s) |
| **Runway ML** (Gen-4 Turbo) | Video (Bild→Video) | API-Key von [dev.runwayml.com](https://dev.runwayml.com/) | ~0,25–1,00 $ pro Video, je nach Länge |
| **Test-Provider (Mock)** | Bild + Video | keiner | kostenlos |

**Zu Runway:** Runways öffentliche API animiert ein **Startbild**, sie erzeugt
kein Video direkt aus Text. Das KI-Studio löst das automatisch: Es erzeugt
zuerst über den konfigurierten Bild-Anbieter ein Standbild zum selben Prompt
und übergibt es anschließend an Runway zur Animation. Wer nur Runway nutzen
will, braucht deshalb zusätzlich mindestens einen Bild-Anbieter (OpenAI,
Google oder den kostenlosen Mock-Provider zum Testen).

**Zum Mock-/Test-Provider:** Erzeugt statt eines echten KI-Ergebnisses eine
farbige Platzhaltergrafik (Bild) bzw. eine kurze Textdatei (Video) – ganz ohne
externe Anfrage und ohne Kosten. Damit lässt sich die komplette Oberfläche
(Formular, Fortschrittsanzeige, Galerie, „Für Website übernehmen",
Regenerieren, Löschen) testen, bevor überhaupt ein echter API-Schlüssel
vorliegt. Nur aktiv, wenn `AI_STUDIO_ENABLE_MOCK=true` gesetzt ist – **in
Produktion nicht aktivieren**, sonst landen Platzhalterbilder in der Galerie.

---

## 3. Einrichtung

### 3.1 Server

```bash
cd ai-studio/server
npm install
cp .env.example .env
```

`.env` ausfüllen (siehe Tabelle in Abschnitt 4), dann starten:

```bash
npm start          # einmalig
npm run dev         # startet neu, sobald sich Dateien ändern
```

Der Server läuft standardmäßig auf Port `8787` und stellt ausschließlich eine
JSON-API bereit (`GET /api/health` zum Prüfen, ob er läuft).

### 3.2 Bedienoberfläche öffnen

`sf-webseiten/ki-studio.html` ist Teil der normalen Website, aber **nicht** in
der Hauptnavigation verlinkt und trägt `<meta name="robots" content="noindex,
nofollow">` – sie soll nicht öffentlich beworben werden, weil jede Generierung
Kosten verursacht. Aufrufbar:

- lokal: `sf-webseiten/index.html` im Browser öffnen funktioniert offline,
  `ki-studio.html` braucht aber einen erreichbaren Server dahinter – am
  einfachsten mit einem simplen Webserver ausliefern, z. B.
  `npx http-server sf-webseiten -p 8080` oder `python3 -m http.server 8080`
  im Ordner `sf-webseiten/`, dann `http://localhost:8080/ki-studio.html`.
- auf der veröffentlichten Vorschau/Domain: einfach die passende URL direkt
  aufrufen (z. B. `https://www.sf-webseiten.de/ki-studio.html`).

Beim ersten Aufruf fragt die Seite nach zwei Angaben:

1. **Server-Adresse** – wo der Node-Server aus 3.1 erreichbar ist
   (`http://localhost:8787` lokal, sonst die Adresse des Hosting-Anbieters).
2. **Admin-Token** – der Wert aus `ADMIN_TOKEN` in der `.env` des Servers.

Beides wird danach nur im `localStorage` dieses Browsers gespeichert, nicht
im Quellcode der Seite und nicht auf dem Server dauerhaft protokolliert.

---

## 4. Environment-Variablen (`ai-studio/server/.env`)

| Variable | Pflicht | Bedeutung |
|---|---|---|
| `ADMIN_TOKEN` | ja | Frei wählbares, langes Zufalls-Token. Schützt jede erzeugende/ändernde Anfrage. Ohne dieses Token bleibt der Server für Generierung und Medienverwaltung gesperrt. |
| `ALLOWED_ORIGINS` | empfohlen | Kommagetrennte Liste erlaubter Herkünfte (CORS), z. B. `https://www.sf-webseiten.de`. Leer = jede Herkunft erlaubt (nur für lokale Entwicklung sinnvoll). |
| `PORT` | nein | Server-Port, Standard `8787`. |
| `MAX_DAILY_GENERATIONS` | nein | Harte Obergrenze aller Generierungen pro Kalendertag, Standard `40`. Schützt vor einer aus dem Ruder laufenden Rechnung. |
| `OPENAI_API_KEY` / `OPENAI_IMAGE_MODEL` | für OpenAI | Bild-Provider. |
| `GOOGLE_API_KEY` / `GOOGLE_IMAGE_MODEL` | für Google | Bild-Provider. |
| `RUNWAY_API_KEY` / `RUNWAY_API_VERSION` / `RUNWAY_MODEL` | für Runway | Video-Provider. |
| `LUMA_API_KEY` | für Luma | Video-Provider. |
| `AI_STUDIO_ENABLE_MOCK` | nein | `true` schaltet den kostenlosen Test-Provider frei. Nur für Entwicklung/Vorführung. |
| `AI_STUDIO_REPO_ROOT` | nein | Absoluter Pfad zu einer lokalen Kopie dieses Repos. Wenn gesetzt, legt „Für Website übernehmen" die Datei direkt unter `beispiele/<projekt>/assets/img/` ab. Leer lassen, wenn der Server nicht auf einer Repo-Kopie läuft (z. B. gehostet bei Render) – dann gibt es stattdessen die Datei zum Herunterladen samt genauer Zielangabe. |

**Wo eintragen:** ausschließlich in `ai-studio/server/.env` (liegt im
`.gitignore`, wird nie eingecheckt). Niemals in `sf-webseiten/` oder einer
`.html`/`.js`-Datei – das Frontend kennt nur die Server-Adresse und das
Admin-Token, niemals die eigentlichen API-Schlüssel der KI-Anbieter.

---

## 5. Wie die Bildgenerierung funktioniert

1. Im Formular werden Branche, Motiv, Bildplatz (bei den fünf bestehenden
   Beispielprojekten: die exakten Bildnamen aus `beispiele/BILDPROMPTS.md`,
   z. B. `hero.jpg`), Stil, Farbschema, Zielgruppe, Atmosphäre, Modernität und
   Premium-Level sowie optionale Zusatzwünsche gewählt.
2. `services/promptBuilder.js` setzt daraus einen einzigen, strukturierten
   **englischen** Prompt zusammen (Bildmodelle verstehen Englisch spürbar
   präziser – siehe `beispiele/BILDPROMPTS.md`) und hängt feste
   Qualitätsanforderungen an (scharf, professionell, kein Text/Logo/Wasserzeichen).
3. `services/generationService.js` erstellt einen Job (`services/jobManager.js`)
   und ruft den gewählten Bild-Provider auf. Da ein einzelner API-Aufruf keinen
   granularen Fortschritt liefert, simuliert der Job-Manager einen ruhigen,
   glaubwürdigen Fortschrittsbalken, während die Anfrage läuft.
4. Das Ergebnis landet in der Medienverwaltung (`services/mediaLibrary.js`):
   Datei unter `server/data/media/`, Metadaten (Prompt, Branche, Bildplatz,
   Provider, Zeitpunkt) in `server/data/media-db.json`.
5. Über „Für Website übernehmen" (`POST /api/media/:id/apply`) wird die Datei
   – sofern `AI_STUDIO_REPO_ROOT` gesetzt ist – direkt unter
   `beispiele/<projekt>/assets/img/<erwarteter-name>.jpg` abgelegt. Die
   jeweilige Seite ersetzt den Markenplatzhalter dann automatisch, ohne dass
   HTML oder CSS angefasst werden muss (siehe `beispiele/README.md`, Abschnitt
   „Bilder"). Für die vier Branchen ohne bestehendes Beispielprojekt
   (Fitness, Immobilien, Autohaus, Hotel) gibt es stattdessen nur den Download
   plus einen Hinweis, wie eine Ablage aussehen könnte.

Das Frontend fragt den Job-Status per Polling ab (`GET /api/jobs/:id`, alle
1,3 s) und zeigt Fortschritt, Status-Text und – bei Fehlern – die
Fehlermeldung des Anbieters an.

---

## 6. Wie die Videogenerierung funktioniert

Prinzipiell gleich wie bei Bildern, mit zwei Unterschieden:

- **Asynchron mit echtem Warten:** Luma und Runway liefern nicht sofort ein
  fertiges Video. `generationService.js` stößt die Generierung an und fragt
  danach alle 4 Sekunden den Status beim Anbieter ab (`pollGeneration`), bis
  das Video fertig ist, ein Fehler gemeldet wird oder ein Zeitlimit von 6
  Minuten erreicht ist.
- **Runway braucht ein Startbild:** Ist Runway gewählt, erzeugt das System
  zuerst automatisch ein Standbild über den konfigurierten Bild-Provider
  (derselbe Prompt) und reicht es als Startframe an Runway weiter. Luma
  braucht das nicht (reine Text-zu-Video-API).

Das fertige Video wird heruntergeladen und wie ein Bild in der Medienverwaltung
gespeichert – dieselben Aktionen (Regenerieren, Für Website übernehmen,
Herunterladen, Löschen) stehen zur Verfügung.

---

## 7. Kosten und Limits im Blick behalten

- Jeder Bild-/Video-Anbieter berechnet pro Anfrage, unabhängig davon, ob das
  Ergebnis am Ende verwendet wird. Die groben Richtwerte oben stammen aus den
  Preislisten der Anbieter zum Zeitpunkt der Einrichtung – vor dem
  produktiven Einsatz die aktuellen Preise auf den jeweiligen Anbieter-Seiten
  prüfen.
- `MAX_DAILY_GENERATIONS` deckelt die Gesamtzahl aller Generierungen (Bild +
  Video) pro Kalendertag serverweit. Wird das Limit erreicht, lehnt der
  Server weitere Anfragen mit `429 daily-limit-reached` ab, bis der nächste
  Tag beginnt.
- Die Rate-Limits (`middleware/rateLimit.js`) verhindern zusätzlich, dass ein
  Skript oder ein hängendes Frontend in kurzer Zeit viele Anfragen abfeuert
  (max. 20 Generierungen pro 15 Minuten).
- Der Admin-Token-Schutz verhindert, dass jemand ohne Kenntnis des Tokens
  überhaupt eine kostenpflichtige Anfrage auslösen kann – das Token also wie
  ein Passwort behandeln, nicht in Screenshots oder Chats teilen.

---

## 8. Einen weiteren KI-Anbieter ergänzen

Am Beispiel eines neuen Bild-Anbieters „Beispiel KI":

1. Neue Datei `server/src/providers/image/beispielImageProvider.js` anlegen,
   die von `./base.js` erbt und `isConfigured()` sowie `generateImage({prompt,
   negativePrompt, aspect, colorHex, label})` implementiert. Vorlage: eine der
   bestehenden Dateien (`openaiImageProvider.js` ist die einfachste).
2. In `server/src/config.js` einen Konfigurationsblock ergänzen (API-Key etc.)
   und die zugehörigen Variablen in `.env.example` dokumentieren.
3. In `server/src/providers/image/registry.js` importieren und registrieren:
   `register(new BeispielImageProvider(config.beispiel));`
4. Fertig. Der neue Anbieter erscheint automatisch in `GET
   /api/meta/providers`, im Auswahlfeld des Formulars und lässt sich sofort
   verwenden – an Routen, Job-Manager oder Frontend muss nichts geändert
   werden.

Für einen neuen **Video**-Anbieter gilt derselbe Ablauf unter
`providers/video/`, mit den Methoden `startGeneration()` und
`pollGeneration()` aus `providers/video/base.js`. Braucht der Anbieter ein
Startbild (wie Runway), `requiresSourceImage = true` setzen – der Rest
(automatische Standbild-Erzeugung) übernimmt `generationService.js` bereits.

---

## 9. Branchen und Bildplätze erweitern

Neue Branchen oder zusätzliche Bildplätze für ein bestehendes Beispielprojekt
werden ausschließlich in `server/src/services/industries.js` gepflegt (eine
einzige Datei, keine verstreute Konfiguration). Ein Eintrag besteht aus
Bezeichner, Stilblock (Bild), Stilblock (Video), Motiv-Vorschlägen und – falls
vorhanden – den exakten Bildplatz-Namen aus `beispiele/BILDPROMPTS.md`.

---

## 10. Grenzen dieser ersten Version

- Jobs leben nur im Arbeitsspeicher des Servers – ein Neustart während einer
  laufenden Generierung verwirft den Job (das fertige Ergebnis ist zu diesem
  Zeitpunkt aber ohnehin noch nicht in der Medienverwaltung gelandet).
- Die Medien-Datenbank ist eine einzelne JSON-Datei – für den Umfang eines
  internen Werkzeugs ausreichend, für sehr große Mengen an Medien (mehrere
  Tausend) wäre eine echte Datenbank sinnvoller.
- Es gibt genau eine Zugriffsebene (ein gemeinsames Admin-Token), kein
  Mehrbenutzer-System mit einzelnen Konten.
