---
typ: projekt
status: aktiv
geprüft: 2026-09-12
repo: lieboldfabio-hub/Website-1.0
tags: [projekt, webseiten]
---

# Website-1.0

**Einzeiler:** Agenturauftritt „S & F Webseiten", fünf erfundene Beispielprojekte und das
interne KI-Studio in einem Repo. Statisch über GitHub Pages, Deploy per `pages.yml`.

## Stand (2026-09-12)

Zuletzt gemerged: KI-Studio mit austauschbarer Provider-Architektur für Bild und Video
(PR #7). Davor Coverflow für die drei Vorschaukarten auf der Startseite und die Umstellung
des Auftritts auf Logo und Signet, Gold auf Schwarz. Die fünf Beispielprojekte sind fertig
inklusive branchenspezifischer Rechtstexte.

Der Branch `claude/obsidian-external-brain-qy4i32` trägt zusätzlich den Vault unter
`zweites-gehirn/` — der zieht um, sobald das eigene Repo steht, und gehört nicht nach `main`.

## Nächste Schritte

- [ ] Platzhalter vor Livegang füllen: Firmierung, Telefon, E-Mail, USt-IdNr., echte Domain
- [ ] Kontaktformular an einen Versanddienst anbinden, danach den Hinweis in `kontakt.html` raus
- [ ] Hosting für `ai-studio/server` wählen (Render, Railway, Fly.io oder VPS)
- [ ] Canonical-/OG-URLs, `sitemap.xml`, `robots.txt` von `sf-webseiten.de` auf die echte Domain

## Entscheidungen

| Entscheidung | Begründung | Verworfen wurde |
|---|---|---|
| Kundenprojekte in eigene **private** Repos auslagern | Kunden-READMEs enthalten Verkaufsargumente und Einschätzungen zum Gespräch | alles in einem Repo; öffentliche Kundenrepos |
| Fonts selbst hosten, Seite läuft offline | `index.html` doppelklicken muss genügen, auch beim Kundentermin ohne Netz | Google Fonts per CDN |
| KI-Studio über Provider-Registry | neuer Anbieter = eine Datei plus ein `register(...)`; Routen und Frontend bleiben unberührt | Anbieter fest verdrahten |
| Backend getrennt hosten | GitHub Pages führt kein Node aus | Server mit ins Pages-Deployment |
| Backend-Adresse zur Laufzeit abfragen | keine feste URL im ausgelieferten Code | URL im Frontend hart eintragen |
| Beispielfirmen erfunden, sichtbar gekennzeichnet, `.example`-Adressen | keine Verwechslung mit echten Unternehmen | echte Firmen als Referenz |
| Platzhalter gelb markiert (`.todo`) statt Fantasiewerte | Fantasiewerte gehen versehentlich live, sichtbare Lücken nicht | Beispieltexte einsetzen |

## Stolperfallen

- **Relative Links nicht „reparieren":** `sf-webseiten/portfolio.html` verlinkt `beispiele/`
  ohne `../`, weil der Deploy beide Verzeichnisse als Geschwister an die Wurzel kopiert.
  Lokal sieht das falsch aus, live ist es richtig. Siehe `.github/workflows/pages.yml`.
- **Kundenrepo-Workflow** löscht vor dem Deploy alle `*.md` und bricht ab, wenn eine übrig
  bleibt. Absicht: interne Notizen dürfen nie in die Vorschau.
- **Repos anlegen geht nicht automatisiert** — GitHub antwortet meinem Zugang mit 403.
  Muss Fabio von Hand machen, steht auch in `kunden/AUSLAGERN.md`.
- `kunden/dognsoul-augsburg/` bleibt liegen, solange die weitergegebene Vorschau-Adresse
  `lieboldfabio-hub.github.io/Website-1.0/dognsoul-augsburg/` gilt. Erst nach Abnahme entfernen.

## Landkarte

| Pfad | Zuständig für |
|---|---|
| `sf-webseiten/` | eigener Auftritt, 8 Seiten, eigene Markenidentität |
| `beispiele/` | fünf Branchenbeispiele, je eigene Gestaltung und Signatur-Interaktion |
| `kunden/dognsoul-augsburg/` | Kundenvorschau, wandert in ein eigenes Repo |
| `ai-studio/server/src/providers/*/registry.js` | zentrale Anlaufstelle für neue KI-Anbieter |
| `ai-studio/server/src/services/promptBuilder.js` | baut den englischen Prompt aus dem Formular |
| `sf-webseiten/ki-studio.html`, `assets/js/ki-studio.js` | Bedienoberfläche des Studios |
| `.github/workflows/pages.yml` | Deploy; bestimmt die Verzeichnislage live |
| `werkzeuge/kundenrepo-exportieren.sh` | erzeugt den fertigen Ordner fürs Kundenrepo |
| `.claude/skills/`, `.agents/skills/` | 21 Design- und Animations-Skills, identisch gespiegelt |

## Offene Fragen

- Welche Domain kommt wirklich? Davon hängen Canonical, JSON-LD, Sitemap und Impressum ab.
- Bleibt `dognsoul-augsburg` im Repo oder wird ausgelagert, sobald die Abnahme steht?
