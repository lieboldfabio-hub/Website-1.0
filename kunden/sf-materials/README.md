# S&F Materials – Website

Auftritt für **S&F Materials**, Handels- und Vermittlungsunternehmen für
Rohstoffe und Sekundärrohstoffe. Fünf Inhaltsseiten, zwei Rechtstexte, eine
Fehlerseite.

Der Entwurf ist vollständig funktionsfähig und läuft **ohne Internetverbindung**.
`index.html` doppelklicken genügt.

---

## Sprache

Die Seite ist **durchgehend englisch**, so wie im Auftrag festgelegt. Das
betrifft auch die Navigation und die Knöpfe: aus „Unternehmen“, „Leistungen“,
„Materialien“, „Kontakt“ wurden `Company`, `Services`, `Materials`, `Contact`,
aus „Kontakt aufnehmen“ und „Unsere Leistungen“ wurden `Get in touch` und
`Our services`. Eine Seite, die englisch textet und deutsch beschriftet, wirkt
im internationalen Handel unfertig.

Sollen die deutschen Beschriftungen doch stehen bleiben, sind es fünf Wörter
in der Navigation und zwei auf den Hero-Knöpfen – jeweils in allen acht
HTML-Dateien.

---

## Was bewusst **nicht** auf der Seite steht

Das ist der Teil, der im Kundengespräch zählt. Nichts davon ist erfunden,
weil erfundene Angaben im Rohstoffhandel schnell teuer werden:

- keine Lagerbestände, keine Mengen, keine Preise
- keine Zertifikate, keine Mitgliedschaften, keine Handelsvolumen
- keine Kundenlogos, keine Referenzen, keine Bewertungen
- keine Namen von Lieferanten oder Käufern
- keine Personenfotos, keine Mitarbeiterprofile, keine Firmengeschichte
- keine Superlative („Europe's leading …“, „Marktführer“)

Statt Zahlen trägt die Seite Aussagen, die überprüfbar sind: Materialgruppen,
Ablauf, Arbeitsweise. Der Hinweis unter der Materialtafel macht das Fehlen von
Beständen und Preisen ausdrücklich zum Argument („Availability changes
constantly …“) – das wirkt seriöser, als es zu verschweigen.

---

## Seiten

| Datei | Inhalt |
| --- | --- |
| `index.html` | Hero, Unternehmen, Leistungen, Materialtafel, Ablauf, Netzwerk, Vertrauen, CTA |
| `company.html` | Was wir tun, Materialien/Regionen/Gegenparteien, was Kunden erwarten können |
| `services.html` | Sourcing, Matching, Trade Support im Einzelnen; Ablauf; was für eine Anfrage gebraucht wird |
| `materials.html` | Materialtafel mit Materialfotos, wie eine Qualität vereinbart wird |
| `contact.html` | Anfrageformular, Direktkontakt, Hinweise für Käufer und Lieferanten |
| `imprint.html` | Vorlage, gelb markierte Stellen ausfüllen |
| `privacy.html` | Vorlage, gelb markierte Stellen ausfüllen |
| `404.html` | Fehlerseite: dunkler Seitenkopf, volle Navigation, drei Wege weiter |

## Vor dem Livegang

| Punkt | Wo | Aufwand |
| --- | --- | --- |
| E-Mail-Adresse und Telefonnummer | `contact.html`, `imprint.html`, `privacy.html` | 5 Min |
| Impressum vervollständigen | `imprint.html` | Angaben des Unternehmens |
| Datenschutz vervollständigen | `privacy.html` | Angaben des Hosters |
| Formular an einen Versand anschließen | `assets/js/site.js`, Ende | ca. 15 Min |
| Domain und Hosting | | |

Die Fotos sind eingesetzt. Wer eines austauscht, legt die neue Datei unter
demselben Namen in `assets/img/` ab; am Code ist nichts zu ändern. Welche
Datei wo steht, sagt `assets/img/README.txt`.

Die auszufüllenden Stellen in den Rechtstexten sind **farbig markiert** und
damit nicht zu übersehen. Vor dem Livegang darf keine einzige mehr stehen:

```bash
grep -rn 'class="todo"' *.html
```

Die Rechtstexte sind an deutschem Recht ausgerichtet (DDG, MStV, DSGVO),
aber englisch formuliert. Steht der Sitz nicht in Deutschland, müssen sie
juristisch gegengelesen werden.

---

## Erweiterung: ein weiteres Material

Die Materialtafel ist auf Zuwachs gebaut. Eine neue Gruppe kostet einen Knopf
und eine Tafel, sonst nichts – kein JavaScript, kein CSS. In `index.html` und
`materials.html` jeweils:

```html
<!-- in .tafel__liste, vor der Fussnote -->
<button class="tafel__knopf" type="button" role="tab" id="tab-zinc"
        aria-controls="panel-zinc" aria-selected="false" tabindex="-1"
        style="--material: #7d8a94">Zinc <small>Zn</small></button>

<!-- als weitere Tafel, direkt vor </div> der .tafel -->
<div class="tafel__inhalt" role="tabpanel" id="panel-zinc"
     aria-labelledby="tab-zinc" tabindex="0" style="--material: #7d8a94" hidden>
  …
</div>
```

`--material` ist die Kennfarbe, die links am aktiven Knopf und am Kürzel
erscheint. Kupfer und Aluminium haben dafür `--kupfer` und `--aluminium` in
`site.css`; für ein weiteres Material dort eine Variable ergänzen. Die
Tastaturbedienung nimmt den neuen Knopf automatisch auf.

**Weitere Länder oder Regionen** stehen an drei Stellen und sind bewusst
knapp gehalten, damit sie sich ohne Umbau erweitern lassen:
`company.html` („Regions“), die Materialzeile im Hero und der Vertrauensblock
auf der Startseite („European supplier network“).

---

## Technik

Bewusst ohne Framework und ohne Build-Schritt.

- Statisches HTML, CSS und JavaScript. Kein npm, kein Build.
- **GSAP 3.15** mit ScrollTrigger, lokal eingebunden.
- **Schriften lokal**: Archivo (Überschriften) und Barlow (Fließtext), selbst
  gehostet. Keine Verbindung zu Google, damit kein Datenschutzproblem.
- Keine Cookies, kein Tracking, kein Einwilligungsbanner nötig.
- Signet, Favicon und Icons sind Inline-SVG, keine Bilddatei nötig.

### Aufbau

```
kunden/sf-materials/
├── index.html … 404.html
└── assets/
    ├── css/basis.css   gemeinsames Fundament, ohne Farben
    ├── css/site.css    Tokens und Abschnitte dieser Seite
    ├── css/fonts.css   Schrifteinbindung
    ├── js/basis.js     Navigation, Reveals, Bildplätze
    ├── js/site.js      Materialtafel, Ablauflinie, Formular
    ├── js/gsap.min.js  GSAP 3.15 mit ScrollTrigger
    ├── fonts/          4 woff2-Dateien, zusammen 104 KB
    └── img/            fünf Fotos, og.jpg und favicon.svg
```

`basis.css` ist dieselbe Datei wie in den Beispielprojekten. `basis.js` weicht
an zwei Stellen ab: englische Beschriftung des Menüknopfs, und der Fokus wandert
erst nach dem Übergang ins Menü – vorher gilt es dem Browser als unsichtbar und
nimmt keinen Fokus an. Wer `basis.js` in andere Projekte kopiert, sollte den
Fokus-Teil mitnehmen.

### Gestaltung

Weiß, Dunkelblau (`#123a68`), Anthrazit (`#0c141d`) und Grau. Kanten statt
Rundungen, Haarlinien statt Schatten, viel Weißraum. Kupfer und Aluminium
erscheinen ausschließlich als schmale Kennfarbe an der Materialtafel, nie als
Markenfarbe – sonst sieht der Auftritt aus wie ein Schrottplatz-Prospekt.

Der Akzent hat drei Rollen (`--accent-flaeche`, `--accent`, `--accent-band`),
siehe Kommentar in `site.css`. Wer eine Farbe ändert, prüft alle drei.

### Bilder

Fünf Fotos, sonst nichts – die Seite lebt von Weißraum, nicht von Bildern.

| Datei | Wo | Motiv |
| --- | --- | --- |
| `hero.jpg` | Startseite, Hero | Recyclinganlage, ganze Halle, unter dunklem Schleier |
| `process.jpg` | Ablauf (Start + Leistungen) | enger Ausschnitt auf das Förderband |
| `material-copper.jpg` | Materialtafel, Copper | gebündelter Kupferschrott |
| `material-aluminium.jpg` | Materialtafel, Aluminium | gebündelter Aluminiumschrott |
| `network.jpg` | „Connecting European Markets“ | Containerterminal in der Dämmerung |

Hero und Ablauf zeigen dieselbe Anlage, aber unterschiedliche Ausschnitte:
im Hero die Halle unter starkem Schleier, im Ablauf ein enger Blick auf das
Band. Kommt ein weiteres Anlagenfoto dazu, ersetzt es `process.jpg`.

Alle Fotos laufen über `.ph`: bis das Bild geladen ist, steht dort eine
Metallfläche mit Signet, danach blendet das Foto auf. Fehlt eine Datei,
bleibt die Fläche stehen – nie ein kaputtes Bildsymbol.

Damit die Bilder aus verschiedenen Quellen wie eine Bildwelt wirken, nimmt
`site.css` Farbe und Kontrast leicht zurück (`.ph img`, `.hero__foto`). Das
hält auch Warnfarben wie das Gelb der Geländer im Zaum.

Der Schleier über dem Hero-Foto ist kein Geschmacksentscheid: ohne ihn fällt
der Fließtext unter die Kontrastvorgabe. Wer ihn aufhellt, misst nach – die
Werte stehen unten unter „Geprüft“.

### Bewegung

Jede Bewegung hat eine Aufgabe:

- Der Hero baut sich gestaffelt auf und führt zum Knopf.
- Abschnitte blenden beim Lesen ein, Überschriften zeilenweise.
- Die Linie über dem Ablauf wird beim Scrollen mitgezeichnet.
- Das Hero-Foto läuft minimal langsamer als der Text und blendet beim Laden auf.
- Beim Wechsel der Materialtafel fährt der Inhalt kurz ein.

Bei `prefers-reduced-motion` entfällt alles davon, die Inhalte stehen sofort.

### Geprüft

Im echten Browser nachgestellt, nicht nur überlegt:

- HTML-Verschachtelung aller 8 Seiten maschinell geprüft, keine offenen Tags
- alle internen Verweise lösen auf (offen sind nur die vier Fotos, die noch fehlen)
- kein horizontaler Overflow bei 390, 820, 1024, 1280 und 1440 Pixeln
- Kontraste: alle Texte erreichen mindestens 4,5:1, maschinell über alle Seiten
- Schrift über dem Hero-Foto pixelweise gegen den tatsächlichen Untergrund
  gemessen, schlechtester Wert 5,2:1 (Fließtext auf dem Telefon)
- Materialtafel mit Maus und Tastatur (Pfeile, Pos1, Ende), Fokus wandert mit
- Formular mit Leer-, Fehler- und Erfolgszustand
- Mobiles Menü inklusive Escape und Fokus im Menü
- bei `prefers-reduced-motion` bleibt kein Abschnitt unsichtbar
- keine Konsolenfehler

## Veröffentlichen

Der Ordner ist statisch und läuft überall. Für den Termin genügt es, ihn auf
[app.netlify.com/drop](https://app.netlify.com/drop) zu ziehen. Über den
Workflow dieses Repositories liegt die Vorschau unter
`https://lieboldfabio-hub.github.io/Website-1.0/sf-materials/`.

Zum Auslagern in ein eigenes, privates Repository siehe `kunden/AUSLAGERN.md`.

## Lizenzen

- GSAP: Standard-Lizenz, für diese Nutzung kostenfrei. Siehe <https://gsap.com/licensing/>
- Archivo und Barlow: SIL Open Font License 1.1
