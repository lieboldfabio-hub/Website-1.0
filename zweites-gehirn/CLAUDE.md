# Arbeitsregeln für Claude in diesem Vault

Dieser Vault hat zwei Zwecke, und der zweite ist der wichtigere:

1. Fabios Notizbuch.
2. **Claudes Gedächtnis zwischen Sitzungen.** Was hier steht, muss nicht noch einmal
   aus Quelltext, Chatverlauf oder Recherche erarbeitet werden.

Sprache: **Deutsch**, Du-Form, kurze Sätze, keine Emojis, keine Werbesprache.

---

## Sitzungsablauf

**Beim Start** — in dieser Reihenfolge, und nicht mehr:

1. `90-Meta/Index.md` lesen. Eine Bildschirmseite, das ist die ganze Übersicht.
2. Genau **eine** Projektnotiz aus `30-Projekte/`, nämlich die zur Aufgabe passende.
3. Nur wenn der Index ausdrücklich darauf zeigt, zusätzlich eine Wissensnotiz.

Nie den ganzen Vault durchsuchen. Nie mehrere Projektnotizen auf Verdacht lesen.
Ein Vault, der bei jedem Start vollständig gelesen wird, kostet mehr Tokens als er spart —
das ist der einzige Weg, wie diese Einrichtung ihren Zweck verfehlt.

**Beim Abschluss** eines Arbeitsschritts, bevor die Sitzung endet:
Projektnotiz aktualisieren. Nicht anhängen, sondern **überschreiben** — ein Projekt hat
einen Stand, keine Chronik. Index nur anfassen, wenn ein Projekt dazukommt, wegfällt
oder sein Einzeiler nicht mehr stimmt.

---

## Was in eine Projektnotiz gehört

Nur das, was man sonst mühsam wieder herausfinden müsste:

- **Stand** — woran zuletzt gearbeitet wurde, mit Datum
- **Entscheidungen samt Begründung**, besonders die verworfenen Alternativen
- **Stolperfallen** — was schiefging, warum, und was stattdessen funktioniert
- **Landkarte** — welche Datei wofür zuständig ist, als `pfad/datei.js:120`
- **Nächste Schritte**

Nicht hinein gehören: Quelltext, Chatverläufe, Befehlsausgaben, Dateilisten und alles,
was ohnehin in der Datei selbst steht. Statt Code den Pfad mit Zeilennummer nennen —
drei Wörter statt dreißig Zeilen, und sie veralten langsamer.

---

## Grenzen — sie sind der Sinn der Sache

| Notizart | Höchstens | Wenn überschritten |
|---|---|---|
| `90-Meta/Index.md` | 40 Zeilen | Einzeiler kürzen, nicht Projekte auslagern |
| Projektnotiz | 80 Zeilen | Ältestes streichen, nicht in eine zweite Datei ausweichen |
| Wissensnotiz | 30 Zeilen | in zwei Gedanken trennen |

Jede Notiz trägt `geprüft: JJJJ-MM-TT`. Was älter als drei Monate ist, gilt als unsicher:
an der Quelle nachprüfen, bevor man sich darauf verlässt, und das Datum erneuern.

---

## Ordnung

| Ordner | Inhalt |
|---|---|
| `00-Posteingang` | Unsortiertes von Fabio |
| `10-Notizen` | Dauerhaftes Wissen, das für mehrere Projekte gilt |
| `20-Quellen` | Fremdmaterial: Bücher, Artikel, Videos |
| `30-Projekte` | **Projektgedächtnis** — je eine Datei pro Vorhaben |
| `40-Bereiche` | Dauerthemen ohne Ende |
| `50-Archiv` | Abgeschlossenes, statt Löschen |
| `60-Tagebuch` | `YYYY-MM-DD.md`, Logbuch |
| `90-Meta` | Index, Vorlagen, Arbeitsanweisungen, Anhänge |

Dateinamen: Groß-/Kleinschreibung normal, Leerzeichen und Umlaute erlaubt,
aber keines von `/ \ : * ? " < > |` — die brechen auf iOS.
Interne Verweise als `[[Wikilink]]`, Anhänge nach `90-Meta/Anhänge`.

---

## Für Fabios eigene Notizen

In `10-Notizen` ist der Titel eine **Aussage**, keine Überschrift: nicht „Zinsen",
sondern „Zinsen belohnen Geduld, nicht Klugheit". Eine Notiz, ein Gedanke.
Status im Frontmatter: `keim`, `entwurf`, `fest`.

---

## Was du nicht tust

- **Nie Notizen löschen.** Verschieben nach `50-Archiv`.
- Nichts erfinden und als Fabios Gedanken ausgeben. Eigene Ergänzungen kennzeichnen:
  `> [!note] Von Claude ergänzt`.
- Keine Behauptung ohne Beleg stehen lassen, ohne sie zu markieren:
  `> [!question] Ungeprüft`.
- Keine Tagebucheinträge rückwirkend ändern.
- Keine Massenumbenennung ohne Ansage — das zerreißt Links.
- Keine Zugangsdaten, Token oder Schlüssel in den Vault schreiben. Er liegt in einem
  Git-Repo; einmal committet, bleibt es in der Historie.

## Commits

Eine Sitzung, ein Commit. Betreff inhaltlich auf Deutsch:
`Projektnotiz Website-1.0 auf Stand gebracht` — nicht `update files`.
