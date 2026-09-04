# Beispielprojekte

Fünf Websites für erfundene Unternehmen, gebaut zum Vorzeigen bei
Kundengesprächen. Jedes Beispiel steht für eine andere Branche, eine andere
Gestaltungsrichtung und eine andere Signatur-Interaktion.

**Alle Unternehmen darin sind erfunden.** Namen, Adressen, Preise und Texte
dienen ausschließlich der Veranschaulichung. Jede Seite trägt unten rechts einen
Hinweis und im Fußbereich einen Vermerk. E-Mail-Adressen nutzen die reservierte
Endung `.example` und gehen ins Leere.

---

## Übersicht

| Ordner | Branche | Umfang | Gestaltung |
|---|---|---|---|
| `halbritter-haustechnik` | Handwerk, Elektro und Sanitär | **Mehrseiter** (4 Seiten) | Archivo auf Knochenweiß, Signalblau |
| `osteria-fontana` | Restaurant | **Mehrseiter** (4 Seiten) | Playfair Display auf Fast-Schwarz, Terrakotta |
| `zahnaerzte-koenigsplatz` | Zahnarztpraxis | **Mehrseiter** (4 Seiten) | Sora auf Creme, Tannengrün und Koralle |
| `kopfsache-studio` | Friseursalon | **Scroll-Pager** | Bricolage Grotesque, Schwarzweiß mit Limette |
| `brenner-kolb-recht` | Kanzlei | **Scroll-Pager** | Frank Ruhl Libre auf Pergament, Gold |

### Jede Seite hat ihre eigene Form

Kopf, Aufmacher und Fuß sind bei allen fünf verschieden gebaut. Das ist der
Punkt: wir werben mit individuellen Websites, also darf keine zwei Mal
dieselbe Form haben.

| | Kopf | Aufmacher | Fuß |
|---|---|---|---|
| **Kopfsache** | Nummerierte Schiene rechts, Laufband unten | Erste von fünf Tafeln, Grund schlägt hart um | In der letzten Tafel |
| **Brenner & Kolb** | Laufender Kolumnentitel mit römischer Ziffer, Haarlinie darunter | Erstes von fünf Blättern, Fußnote unten | Im Schlussblatt |
| **Halbritter** | Zwei Lagen: Notdienst oben, Name im Farbblock darunter | Bildband über die volle Breite, Ansage darin | Datenblatt mit Punktlinien |
| **Osteria** | Firmenschild: Name mittig, Wege links und rechts | Bild über die volle Fläche, Satz mittig darin | Rückseite der Karte, mittig |
| **Zahnärzte** | Schwebende Kachel, aktive Seite als gefüllte Pille | Grünes Feld mit rundem Abschluss, Bild ragt hinein | Praxiskarte, zweispaltig |

Die beiden Scroll-Pager rasten beim Scrollen ein: jede Tafel beziehungsweise
jedes Blatt füllt genau einen Bildschirm. Auf zu niedrigen oder zu schmalen
Fenstern schaltet sich das Einrasten ab und die Seite liest sich normal weiter
– lieber das als Inhalt, an den man nicht herankommt. Impressum, Datenschutz
und 404 bleiben auch dort gewöhnliche Seiten.

Jedes Projekt hat zusätzlich `impressum.html`, `datenschutz.html` und
`404.html`. Die Rechtstexte sind branchenspezifisch: Handwerkskammer und
Handwerksrolle beim Handwerk, Rechtsanwaltskammer samt BRAO, BORA, FAO und RVG
bei der Kanzlei, Landeszahnärztekammer und GOZ bei der Praxis,
Gaststättenerlaubnis nach § 2 GastG in der Gastronomie.

Alle noch auszufüllenden Felder sind mit `<span class="todo">` markiert und
damit auf der Seite farbig hervorgehoben. Vor einem Livegang darf keine
einzige davon mehr stehen.

---

## Die drei Mehrseiter

### halbritter-haustechnik

`index.html` (Landingpage) · `leistungen.html` · `arbeiten.html` · `kontakt.html`

**Signatur:** Vorher-Nachher-Schieber. Ziehen, klicken oder Pfeiltasten, alles
funktioniert. Beim ersten Erscheinen zieht er kurz auf, damit erkennbar wird,
dass man ihn bewegen kann. Er steht auf der Startseite und auf `arbeiten.html`.

Außerdem: Leistungskarten, die sich beim Scrollen stapeln (`leistungen.html`),
Ablauf in vier Schritten, Preisrahmen, häufige Fragen, drei Referenzen mit
Umfang, Dauer und Art der Abrechnung, Anfrageformular mit Notdienst-Streifen.

### osteria-fontana

`index.html` · `karte.html` · `abend.html` · `besuch.html`

**Signatur:** Eine Galerie, die waagerecht läuft, während man senkrecht
scrollt. Der Abschnitt wird dabei am Bildschirm festgehalten.

Außerdem: Laufband mit den Gerichten des Tages, Speisekarte mit Punktlinie
(Auszug auf der Startseite, vollständig plus Weinkarte auf `karte.html`),
Ablauf eines Abends, Gästestimmen, Reservierungsformular und Anfahrt.

### zahnaerzte-koenigsplatz

`index.html` · `leistungen.html` · `praxis.html` · `termin.html`

Ruhig, hell, ohne Klinik-Ästhetik. Vier Leistungsbereiche auf der Startseite,
im Einzelnen ausgeführt auf `leistungen.html` samt Kosten und Kassen. `praxis.html`
zeigt Arbeitsweise, Team und Ausstattung, `termin.html` das Terminformular mit
Sprechzeiten, Notfallzeiten und Anfahrt.

Das Terminformular fragt bewusst **keine Gesundheitsdaten** ab; das steht so
auch im Formular und in der Datenschutzerklärung.

---

## Die zwei Scroll-Pager

Bei beiden füllt jeder Abschnitt genau einen Bildschirm und das Scrollen rastet
ein (`scroll-snap-type: y mandatory` an der Wurzel, weil das Dokument selbst der
scrollende Kasten ist). Freigeschaltet wird das über `<html class="pager">`, das
nur `index.html` trägt – die Rechtstexte bleiben gewöhnliche Seiten.

Die beiden führen den Leser bewusst gegensätzlich:

### kopfsache-studio

Fünf **Tafeln**. Rechts eine nummerierte Schiene; der Name eines Abschnitts
erscheint erst, wenn er dran ist oder der Zeiger darauf liegt, sonst steht dort
nur eine ruhige Zahlenreihe. Unten läuft dauerhaft ein Band mit den Leistungen.
Der Grund schlägt hart um – dunkel, hell, dunkel, hell, dunkel –, damit beim
Einrasten sichtbar eine neue Seite aufschlägt.

**Signatur:** Lichtkegel unter dem Zeiger auf den Leistungskarten, Ziehharmonika
bei den Fragen, Knöpfe, die dem Zeiger folgen.

### brenner-kolb-recht

Fünf **Blätter**, römisch nummeriert. Statt einer Schiene führt ein laufender
Kolumnentitel oben durch die Seite: Ziffer und Kapitel, darunter eine Haarlinie,
die mit dem Fortschritt wächst. Unten links ein Register – die Kapitel
ausgeschrieben, durch Punkte getrennt. Der Grund bleibt durchgehend Pergament,
nur das Schlussblatt schlägt ins Nachtblau um; einmal, als Schlusszeichen.

Unterschieden werden die Blätter über ihren Satzspiegel statt über Farbe:
Aufschlag zweispaltig mit Fußnote, Rechtsgebiete als nummerierte Liste mit
Haarlinien, Kanzlei einspaltig und mittig, Team zwei Zeilen mit Portrait links,
Kontakt zweigeteilt.

### Rückfall

Unter 900 Pixel Breite – bei Brenner & Kolb zusätzlich unter 720 Pixel Höhe –
schaltet sich das Einrasten ab, die Abschnitte wachsen mit dem Inhalt, Schiene,
Band und Register verschwinden. Ein Abschnitt, der nicht auf den Bildschirm
passt, darf nicht festgehalten werden.

---

## Der Akzent hat drei Rollen

Ursprünglich gab es einen einzigen `--accent` für alles. Derselbe Ton kann aber
nicht gleichzeitig als kleine Schrift auf hellem Papier **und** als leuchtende
Fläche funktionieren. Beim Prüfen lagen vier von fünf Projekten mit der
Schriftvariante unter der Kontrastvorgabe – am deutlichsten Kopfsache, wo
Limette auf Papier nur 1,19:1 erreichte und praktisch unlesbar war. Deshalb:

```css
--accent-flaeche  /* der Markenton, wie er auf Knöpfen und Balken liegt */
--accent          /* abgedunkelt, für Akzentschrift und Linien           */
--accent-band     /* aufgehellt, gilt innerhalb der dunklen Abschnitte   */
--accent-fg       /* Beschriftung auf der Fläche                          */
```

Am Ende jeder `site.css` steht, welche Abschnitte des Projekts dunkel sind. Dort
übernehmen `--accent-band` und eine dunkle Knopfbeschriftung. Weil `--accent`
vererbt wird, genügt es, das am Container zu setzen.

Wer eine Akzentfarbe ändert, prüft drei Werte: Akzentschrift auf dem Grund,
Akzent im dunklen Abschnitt, Knopfbeschriftung auf der Fläche. Alle drei
müssen 4,5:1 erreichen.

**Hinweis:** Den umschaltbaren Farbwähler gibt es hier bewusst **nicht**. Die
Beispiele sollen jeweils eine Marke zeigen, nicht ihre Varianten. Das
Baukasten-Feature sitzt im Bereich „Vorschau" auf der Agenturseite.

---

## Aufbau

Jedes Beispiel ist eine **eigenständige Website**. Es gibt keine Datei, die
zwei Projekte gemeinsam benutzen – wer eines bearbeitet, verändert damit
garantiert kein anderes.

```
beispiele/<name>/
├── index.html          Startseite
├── <unterseiten>.html  nur bei den drei Mehrseitern
├── impressum.html
├── datenschutz.html
├── 404.html
└── assets/
    ├── css/site.css    das komplette Aussehen dieser Seite
    │                   1. Struktur (Raster, Abstände, Bausteine)
    │                   2. Tokens und eigene Bausteine
    │                   3. Rahmen bzw. Pager dieser Seite
    ├── css/fonts.css   Schrifteinbindung dieser Seite
    ├── js/site.js      das komplette Verhalten dieser Seite
    │                   1. Grundverhalten (Menü, Bildplätze, Reveals)
    │                   2. Signatur-Interaktion bzw. Pager
    ├── js/gsap.min.js  GSAP 3.15 mit ScrollTrigger
    ├── fonts/          selbst gehostet, kein Google-Request
    └── img/            og.jpg liegt hier, hier auch die Fotos ablegen
```

Früher lagen Struktur und Grundverhalten in geteilten Dateien `basis.css` und
`basis.js`. Die sind aufgelöst: ihr Inhalt steht jetzt als Abschnitt 1 in
`site.css` bzw. `site.js` jedes Projekts. Das ist bewusst etwas mehr Text pro
Ordner – dafür ist jedes Beispiel für sich änderbar, und genau das versprechen
wir unseren Kunden auch.

### Nur noch, was die Seite wirklich benutzt

In jeder `site.css` steht ausschließlich, was das eigene HTML auch anspricht.
Beim Umbau auf die fünf eigenen Formen sind rund 325 Regelköpfe entfernt
worden, die zu Bausteinen gehörten, die es in dem Projekt gar nicht gibt –
Preistabellen bei der Kanzlei etwa oder Zitatkästen beim Friseur. Dadurch gibt
es keine gemeinsame Bausteinliste mehr, an der man sich entlanghangeln könnte,
und genau das ist die Absicht: wer eine Datei öffnet, sieht nur Regeln, die
diese Seite betreffen.

Nachgewiesen ist das über einen Vergleich: alle 29 Seiten wurden vor und nach
dem Entfernen gerendert und pixelweise verglichen. Kein Unterschied.

### Als Vorlage für neue Kunden

Für ein neues Projekt kopiert man den Ordner, der inhaltlich am nächsten liegt,
und setzt in Abschnitt 2 von `site.css` die Tokens neu:

```css
:root {
  --bg --surface --line --text --text-soft
  --accent --accent-fg
  --band --band-text --band-text-soft --band-line
  --ph-1 --ph-2 --ph-3        /* Bildplatzhalter */
  --font-display --font-body
  --r                          /* Radius für Flächen, Buttons sind rund */
}
```

Welche Bausteine dabei mitkommen, hängt vom kopierten Ordner ab. Fester
Bestandteil aller fünf sind nur `.legal` für die Rechtstexte, `.fehler` für die
404-Seite und die Bildplätze.

Abschnitt 1 von `site.js` stellt zusätzlich zwei Hilfen bereit:

- `Basis.magnetisch(element, stärke)` - folgt dem Zeiger, nur mit Maus
- `Basis.spotlight(element)` - setzt `--mx` und `--my` für Lichtkegel

Beide schalten sich auf Touchgeräten und bei `prefers-reduced-motion` ab.

---

## Bilder

Alle 24 Bildplätze zeigen eine Markenfläche mit Signet, solange kein Foto
vorliegt. Legt man die Datei unter dem erwarteten Namen in `assets/img/` ab,
erscheint sie automatisch – ohne Code-Änderung; `.is-filled` blendet den
Platzhalter dann aus.

Die Unterschrift im Platzhalter ist bewusst so gesetzt, dass sie auch **vor
einem Kunden** gelesen werden kann: „Foto folgt" als kleine Auszeichnung,
darunter, was auf dem Bild zu sehen sein wird. Dateiname, Format und der
fertige Prompt stehen nicht auf der Seite, sondern in `BILDPROMPTS.md` –
dort werden sie beim Fotografieren gebraucht.

**Was nicht geht:** erzeugte Grafik statt Foto. Ein Versuch damit ist
verworfen worden. Eine abstrakte Fläche in einem Feld, dessen Unterschrift
„Monteur bei der Arbeit" lautet, wirft beim Kunden genau die Frage auf, die
man nicht hören will. Ein sauber gesetzter Platzhalter sagt dagegen das
Richtige: hier kommt Ihr Foto hin.

Beim Vorher-Nachher-Schieber sind die beiden Platzhalter bewusst verschieden
eingefärbt, damit der Effekt auch ohne Fotos erkennbar ist.

### Vorschaubild für soziale Netzwerke

`assets/img/og.jpg` (1200 × 630) liegt in jedem Projekt und ist über
`og:image` eingebunden. Es besteht nur aus Schrift, Farbe und Akzent der
jeweiligen Marke und braucht deshalb kein Foto. Erzeugt wird es aus der
`site.css` des Projekts – wer Farben oder Schrift ändert, sollte es neu
rendern lassen.

---

## Geprüft

Für jedes Beispiel im echten Browser nachgestellt:

- HTML-Verschachtelung aller 29 Seiten maschinell geprüft, keine offenen Tags
- Alle internen Verweise lösen auf, kein `href="#"` ins Leere
- Kein horizontaler Overflow, geprüft bei 1600, 1440, 1024, 768 und 500 Pixeln
- Bei den Scroll-Pagern füllt jeder Abschnitt exakt das Fenster, gemessen bei
  1920x1080, 1600x900, 1440x900, 1366x768, 1280x800 und 1100x700
- Alle 29 Seiten vor und nach dem Entfernen des ungenutzten CSS gerendert und
  pixelweise verglichen: identisch
- Signatur-Interaktionen funktional getestet: Schieber mit Ziehen und Tastatur,
  Ziehharmonika mit Öffnen, Schließen und Wechseln
- Waagerechte Galerie fällt unter 820 Pixel auf eine wischbare Reihe zurück
- Bei `prefers-reduced-motion` entfallen Laufband, Heftung und alle Reveals
- Die aktive Seite ist in der Navigation mit `aria-current="page"` markiert
