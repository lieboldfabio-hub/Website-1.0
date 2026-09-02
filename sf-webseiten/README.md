# S & F Webseiten – eigener Auftritt

Der Markenauftritt der Agentur selbst (nicht ein Kunden- oder Beispielprojekt).
Mehrseitig, eigenständige Markenidentität (Fraunces/Instrument Sans, Tinte/Ivory/
Vermillion), getrennt von der Formensprache der Kunden- und Beispielprojekte.

Läuft **ohne Internetverbindung** – `index.html` doppelklicken genügt, alle Fonts
sind selbst gehostet.

---

## Seitenstruktur

| Datei | Zweck |
| --- | --- |
| `index.html` | Startseite: Hero, Statistiken, Leistungen-Teaser, Differenzierung, Portfolio-Teaser, Bewertungen-Teaser, CTA |
| `leistungen.html` | Leistungen im Detail, Ablauf, FAQ |
| `portfolio.html` | Alle 5 Vorschau-Projekte mit Branchen-Filter |
| `bewertungen.html` | Testimonials aus den Beispielprojekten |
| `ueber-uns.html` | Positionierung, Werte, Servicegebiet |
| `kontakt.html` | Kontaktformular (siehe Hinweis unten) + Kontaktdaten |
| `impressum.html` / `datenschutz.html` | Rechtstexte mit Platzhaltern |

Die Portfolio-Seite verlinkt auf die fünf Projekte unter `beispiele/` (relative
Links ohne `../`, da beide Verzeichnisebenen beim Deploy als Geschwister an die
Wurzel der Vorschau kopiert werden – siehe `.github/workflows/pages.yml`).

---

## Vor dem Livegang zu erledigen

Diese Website ist vollständig gestaltet und funktionsfähig, enthält aber an
mehreren Stellen bewusst sichtbare Platzhalter (gelb markiert, Klasse `.todo`),
weil echte Angaben zum Unternehmen noch fehlen:

- **Adresse**: Maximilianstraße 57, 86150 Augsburg ist bereits eingetragen
  (Impressum, Kontakt, JSON-LD auf `index.html`) – bei Bedarf gegen die
  tatsächliche Geschäftsadresse austauschen.
- **Impressum** (`impressum.html`): Firmierung/Rechtsform, Inhaber:in,
  Telefon, E-Mail, USt-IdNr. noch offen
- **Datenschutz** (`datenschutz.html`): Firmierung, Hosting-Anbieter, E-Mail
  noch offen
- **Kontakt** (`kontakt.html`): Telefonnummer, E-Mail-Adresse noch offen
- **Kontaktformular**: hat aktuell keine Versandanbindung. Vor dem Livegang an
  einen Formular-Dienst (z. B. Formspree, eigenes Backend) oder eine echte
  E-Mail-Adresse anbinden – und danach den Hinweis dazu in `kontakt.html`
  entfernen.
- **Canonical-/OG-URLs und JSON-LD** in allen `<head>`-Bereichen verwenden
  aktuell die Platzhalter-Domain `https://www.sf-webseiten.de/` – auf die
  echte Domain anpassen, sobald sie feststeht. `sitemap.xml` und `robots.txt`
  ebenfalls.
- **Social-Links**: aktuell keine vorhanden (`sameAs` im JSON-LD bewusst leer
  gelassen statt erfundener Profile).

Nichts davon ist erfunden im Sinne von falschen Tatsachenbehauptungen – die
Felder sind als Platzhalter *sichtbar markiert*, nicht mit Fantasiewerten
gefüllt, die versehentlich live gehen könnten.

---

## Zu den Vorschau-Projekten

Portfolio und Bewertungen zeigen fünf **erfundene** Unternehmen aus Augsburg
und Umgebung (Handwerk, Gastronomie, Beauty, Recht, Gesundheit) – drei davon
bereits vorhanden (`beispiele/halbritter-haustechnik`, `osteria-fontana`,
`kopfsache-studio`), zwei neu dafür gebaut:

- `beispiele/brenner-kolb-recht` – Rechtsanwaltskanzlei, eigene Marke
  (Frank Ruhl Libre / Work Sans, Tinte-Navy + Gold)
- `beispiele/zahnaerzte-koenigsplatz` – Zahnarztpraxis, eigene Marke
  (Sora / Nunito Sans, Tanne-Grün + Koralle)

Beide folgen exakt dem bestehenden Muster (`basis.css`/`basis.js`/GSAP wie bei
den ersten drei Beispielen), damit sie sich nahtlos einreihen.

Die Testimonials auf `bewertungen.html` sind als Zitate der fiktiven
Beispielprojekte über den Zusammenarbeitsprozess formuliert – **nicht** als
echte, verifizierte Kundenbewertungen ausgegeben (bewusst kein
`schema.org/AggregateRating`-Markup, um keine irreführenden Rich Snippets zu
erzeugen). Das entspricht der bestehenden Linie im Repo: `kunden/` verzichtet
konsequent auf erfundene Bewertungen, weil es dort um ein echtes Unternehmen
geht. Für den eigenen Auftritt gilt dieselbe Vorsicht – die Fiktion ist an
mehreren Stellen (Portfolio-Hinweisbox, Bewertungen-Hinweisbox, Impressum)
klar offengelegt.

Sobald reale Kundenprojekte abgeschlossen sind, sollten sie die
Beispielprojekte in Portfolio und Bewertungen nach und nach ersetzen oder
ergänzen.

---

## Zu den Statistik-Kacheln auf der Startseite

Die vier Zahlen im Abschnitt „Warum Design zählt" (94 %, 3 Sek., 75 %, 88 %)
sind gerundete, häufig zitierte Richtwerte aus öffentlich zugänglicher
UX-/Webforschung (u. a. Studien zu Ladezeit-Absprungraten und zum Stanford Web
Credibility Project) – keine frei erfundenen Werte und keine einer realen
Institution zugeschriebene Studie, die es so nicht gibt. Die Fußnote auf der
Seite ordnet sie entsprechend ein. Vor dem Livegang gerne durch aktuellere
oder eigene Zahlen ersetzen, sobald echte Projektdaten vorliegen.

---

## Farbwähler im Bereich Vorschau

Die Seite kann von Besuchern auf sechs Farbrichtungen umgestellt werden. Das
ist kein Spielzeug, sondern das Verkaufsargument in eigener Sache: im Gespräch
lässt sich zeigen, dass Gestaltungsspielraum eingebaut werden kann, ohne dass
jemand Code anfasst.

**Bedienung**: der Block sitzt im Bereich **Vorschau** auf der Startseite,
oberhalb der Beispielkacheln – erst zeigen, was die eigene Seite kann, dann
die Beispiele. Zusätzlich als kompakte Punktreihe im Fußbereich jeder Seite,
damit die Farbe auch von den übrigen Seiten aus erreichbar bleibt.

Die Beispielprojekte unter `beispiele/` haben **bewusst keinen** Farbwähler.
Sie sollen jeweils eine Marke zeigen, nicht ihre Varianten.

**Wie es funktioniert**

- `assets/css/farben.css` enthält alle sechs Richtungen als
  `:root[data-farbe="…"]`, jeweils mit hellem und dunklem Satz.
- Ein kurzes Skript im `<head>` **jeder** Seite liest die gemerkte Wahl aus
  `localStorage` und setzt `data-farbe`, **bevor** gezeichnet wird. Ohne das
  würde beim Laden kurz die Grundfarbe aufblitzen. Kommt eine neue Seite dazu,
  muss dieses Skript mit hinein – sonst springt genau dort die Farbe.
- `assets/js/site.js` verwaltet nur noch Klicks, `aria-pressed` und das
  Speichern. Die Umschaltung selbst macht das CSS.
- `--accent-band` ist der aufgehellte Akzent für die dunklen Flächen (Hero,
  Laufband, Abschlussband, Fußbereich). Der normale Akzent wäre dort zu dunkel.

**Geprüft**: Jede der sechs Richtungen erreicht WCAG AA – Fließtext gegen
Grundfläche mindestens 15:1, Akzent als Text mindestens 4,5:1, Knopfbeschriftung
auf dem Akzent mindestens 4,5:1, aufgehellter Akzent auf der Tinte mindestens
6:1. Wer die Palette ändert, sollte das nachrechnen.

**Bewusst nicht mitgeführt**: Das Favicon bleibt in der Grundfarbe. Es steht für
die Marke, nicht für die Vorliebe eines einzelnen Besuchers. Die
`theme-color`-Angabe für die Adressleiste mobiler Browser zieht dagegen mit.

**Datenschutz**: Die Wahl liegt ausschließlich im Browser des Besuchers, es
geht nichts an einen Server. Deshalb ist sie nach § 25 Abs. 2 TDDDG
einwilligungsfrei – sie ist unbedingt erforderlich, um den vom Nutzer
ausdrücklich gewünschten Dienst zu erbringen. Kein Banner nötig.

## Deployment

`.github/workflows/pages.yml` kopiert `sf-webseiten/*` beim Bauen der Vorschau
direkt an die Wurzel von `_site/` (zusammen mit den geflacht kopierten
`kunden/`- und `beispiele/`-Projekten als Geschwister-Ordner) – dieselbe
Struktur, die auch für die spätere echte Domain sinnvoll ist. Die interne
Team-Übersicht der Entwürfe liegt seitdem nicht mehr unter der Wurzel, sondern
unter `/_uebersicht/`, damit sie den neuen echten Auftritt nicht überschreibt.

Wie bei allen anderen Projekten im Repo erzwingt der Workflow für die
**Vorschau** `noindex, nofollow` auf allen Seiten und schreibt `robots.txt`
auf „alles sperren" – unabhängig davon, was in den Quelldateien steht. Die
Quelldateien selbst behalten `index, follow` (siehe `<meta name="robots">` in
den einzelnen Seiten), damit sie korrekt sind, sobald `sf-webseiten/*` auf die
echte Domain übertragen wird.
