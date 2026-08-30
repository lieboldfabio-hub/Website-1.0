# Dog'n'Soul Augsburg - Website-Entwurf

Entwurf einer neuen Website für **Dog'n'Soul Hundetraining und Verhaltenstherapie**,
Krystana Föh, Vorderer Lech 22, 86150 Augsburg.

Der Entwurf ist vollständig funktionsfähig und läuft **ohne Internetverbindung**.
`index.html` doppelklicken genügt.

---

## Das Verkaufsargument

**Die bisherige Website ist offline.** Die Domain `dognsoul-augsburg.de` hat
zum Zeitpunkt der Erstellung keinen DNS-Eintrag mehr, die Seite ist nicht
erreichbar. Gleichzeitig verlinken zahlreiche Verzeichnisse weiterhin dorthin:
Gelbe Seiten, Das Telefonbuch, YellowMap, Snautz, Hundeschulen24, tierfritz,
DER HUND und Yelp. Jeder Interessent, der dort klickt, landet im Nichts.

Das ist der stärkste Aufhänger für das Gespräch. Prüfen lässt sich das live:

```
nslookup dognsoul-augsburg.de
```

Zweites Argument: Die Inhaberin ist **Tierärztin**. Das ist ein echter
Unterschied zu jeder anderen Hundeschule in Augsburg, und genau darauf ist die
Seite aufgebaut. Der zweite Abschnitt erklärt, warum Verhalten eine medizinische
Ursache haben kann. Das verkauft ihre Qualifikation, statt sie nur zu erwähnen.

---

## Inhaltliche Grundlage

Alle Angaben stammen aus öffentlichen Verzeichniseinträgen:

| Angabe | Wert |
| --- | --- |
| Inhaberin | Krystana Föh, Tierärztin und Hundetrainerin |
| Adresse | Vorderer Lech 22, 86150 Augsburg |
| Telefon | 0170 7332220 |
| Zeiten | Mo bis Fr 9:00 bis 19:00, Sa 10:00 bis 16:00 |
| Qualifikation | Approbation, Erlaubnis nach § 11 TierSchG |
| Arbeitsweise | mobil in Augsburg und Umgebung |
| Leistungen | Einzeltraining und Verhaltenstherapie, Welpen-Basics, Stadttraining, Wald und Wiese, Clickertraining, Hundekaufberatung, Bürohund-Coaching, Hausbesuche |

**Nichts davon ist erfunden.** Es stehen keine erfundenen Bewertungen, keine
erfundenen Preise und keine erfundenen Zahlen auf der Seite. Der
Bewertungsabschnitt ist bewusst ein sichtbarer Platzhalter: echte
Google-Bewertungen wirken dort, erfundene wären ein Haftungsrisiko.

---

## Vor dem Kundentermin prüfen

1. **Ist der Betrieb aktiv?** Ein Verzeichniseintrag erwähnt eine Pause ab
   August mit Wiederaufnahme im November. Das Datum ließ sich nicht verifizieren
   und steht deshalb nicht auf der Seite. Kurz telefonisch klären.
2. **Gehört die Domain noch ihr?** Falls sie frei ist, ist das ein zusätzliches
   Argument und ein zusätzlicher Posten im Angebot.
3. **Schreibweise des Namens** gegenprüfen.

---

## Was vor dem Livegang noch fehlt

| Punkt | Wo | Aufwand |
| --- | --- | --- |
| Drei Fotos einsetzen | `assets/img/` | siehe unten |
| Formular an einen Versand anschließen | `assets/js/site.js`, Ende | ca. 15 Min |
| Impressum vervollständigen | `impressum.html` | Angaben der Inhaberin |
| Datenschutz vervollständigen | `datenschutz.html` | Angaben des Hosters |
| E-Mail-Adresse ergänzen | beide Rechtstexte | |
| Domain und Hosting | | |

Die auszufüllenden Stellen in den Rechtstexten sind **gelb markiert** und damit
nicht zu übersehen.

### Fotos

Drei Bildplätze sind vorbereitet. Die Datei einfach unter diesem Namen ablegen,
das Bild erscheint dann automatisch. Es muss nichts im Code geändert werden.

| Datei | Format | Motiv |
| --- | --- | --- |
| `assets/img/hero.jpg` | hoch, 4:5, ab 1200 px | Krystana mit Hund im Freien |
| `assets/img/einzeltraining.jpg` | quadratisch, ab 900 px | Nahaufnahme Mensch und Hund im Training |
| `assets/img/krystana.jpg` | hoch, 4:5, ab 800 px | Portrait, freundlich und natürlich |

Optional `assets/img/og.jpg` (1200 × 630) für die Vorschau beim Teilen.

Solange ein Foto fehlt, zeigt der Platz eine Markenfläche mit Pfotensignet und
der Bildbeschreibung. Das sieht bewusst nach vorbereitetem Platz aus und nicht
nach einem Fehler.

### Formular anschließen

Aktuell zeigt das Formular den Erfolgszustand, **ohne etwas zu versenden**. Der
Versand wird am Ende von `assets/js/site.js` eingehängt, die Stelle ist
kommentiert. Mit Formspree genügt ein `fetch` auf die eigene Endpunkt-URL,
alternativ Netlify Forms oder das Postfach des Hosters.

---

## Technik

Bewusst ohne Framework und ohne Build-Schritt. Das hält die Seite schnell,
wartbar und für jeden Hoster geeignet.

- Statisches HTML, CSS und JavaScript. Kein npm, kein Build.
- **GSAP 3.15** mit ScrollTrigger, lokal eingebunden.
- **Schriften lokal**: Outfit und Source Sans 3, selbst gehostet. Keine
  Verbindung zu Google, damit kein Datenschutzproblem.
- **Icons**: Phosphor Icons als SVG-Sprite direkt im HTML.
- Keine Cookies, kein Tracking, kein Einwilligungsbanner nötig.

### Bewegung

Jede Animation hat eine Aufgabe, nichts bewegt sich zur Dekoration:

- Der Hero baut sich gestaffelt auf und führt den Blick zum Button.
- Abschnitte blenden beim Lesen ein.
- Die Linie im Ablauf wird beim Scrollen mitgezeichnet, die Punkte schalten
  nacheinander scharf.
- Buttons und Kacheln geben Rückmeldung bei Hover und Klick.

Bei `prefers-reduced-motion` entfällt jede Bewegung, alle Inhalte sind sofort
sichtbar.

### Geprüft

- Kontraste: alle Texte über WCAG AA, gemessen in hell und dunkel
- Hero passt auf 1440, 1280 und 390 px in den sichtbaren Bereich
- Formularvalidierung mit Leer-, Fehler- und Erfolgszustand
- Mobiles Menü inklusive Schließen per Escape
- Kein horizontaler Overflow
- Keine Konsolenfehler
- Hell- und Dunkelmodus

---

## Struktur

```
kunden/dognsoul-augsburg/
├── index.html          Startseite
├── impressum.html      Vorlage, gelb markierte Stellen ausfüllen
├── datenschutz.html    Vorlage, gelb markierte Stellen ausfüllen
└── assets/
    ├── css/site.css    Design-System und alle Abschnitte
    ├── css/fonts.css   Schrifteinbindung
    ├── js/site.js      Interaktion und Animation
    ├── js/gsap.min.js  GSAP 3.15
    ├── js/ScrollTrigger.min.js
    ├── fonts/          6 woff2-Dateien, zusammen 192 KB
    └── img/            hier die Fotos ablegen
```

## Veröffentlichen

Der Ordner ist statisch und läuft überall. Am schnellsten geht es, den Ordner
auf [app.netlify.com/drop](https://app.netlify.com/drop) zu ziehen. Man erhält
sofort eine Adresse, die sich im Kundentermin zeigen lässt, und kann die eigene
Domain später verbinden.

## Lizenzen

- GSAP: Standard-Lizenz, für diese Nutzung kostenfrei. Siehe <https://gsap.com/licensing/>
- Outfit und Source Sans 3: SIL Open Font License 1.1
- Phosphor Icons: MIT
