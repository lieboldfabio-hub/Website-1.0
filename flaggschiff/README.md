# Flaggschiff — OKTANT

Ein Gestaltungsbeispiel der oberen Preisklasse. Gebaut, um zu zeigen, was
technisch und gestalterisch möglich ist, wenn ein Projekt nicht bei „modern und
seriös“ aufhört: echtes 3D im Browser, scrollgetriebene Dramaturgie, eigene
Bildsprache.

**OKTANT ist ein erfundenes Studio.** Name, Anschrift, Telefonnummer, Zahlen
und Projekte dienen ausschließlich der Veranschaulichung. Der Hinweis steht
sichtbar auf jeder Seite, im Fußbereich und in den Rechtstexten.

Läuft **ohne Internetverbindung** — `index.html` doppelklicken genügt.
Schriften, GSAP, Lenis und Three.js liegen alle im Verzeichnis.

---

## Warum diese Seite anders ist als die unter `beispiele/`

Die fünf Beispielprojekte lösen eine andere Aufgabe: ein Handwerksbetrieb, ein
Restaurant, eine Kanzlei brauchen eine Seite, die schnell lädt, auf jedem
Bürorechner funktioniert und in zwei Sekunden sagt, wen man anruft. Genau das
tun sie, und sie tun es gut.

Diese Seite fragt umgekehrt: Was ist das obere Ende? Sie kostet mehr Rechenzeit,
mehr Bandbreite und deutlich mehr Bauzeit. Sie ist kein Ersatz für die
Beispiele, sondern deren Gegenstück im Verkaufsgespräch — die Antwort auf
„Können Sie auch etwas, das aussieht wie die Seiten, die man auf Awwwards
sieht?“

---

## Aufbau

| Datei | Zweck |
| --- | --- |
| `index.html` | Die gesamte Seite: Kopf, Haltung, Leistungen, Arbeiten, Werkbank, Kontakt |
| `impressum.html` · `datenschutz.html` | Rechtstexte mit sichtbar markierten Platzhaltern |
| `404.html` | Fehlerseite |
| `assets/css/basis.css` | Fundament ohne Marke: Reset, Bewegungsvorbehalt, Sprungmarke |
| `assets/css/site.css` | Das Gestaltungssystem: Farben, Schrift, Raster, alle Bausteine |
| `assets/css/fonts.css` | Die vier selbst gehosteten Schriftschnitte |
| `assets/js/site.js` | Oberfläche: Vorspann, Leiste, Zeiger, Einblendungen, waagerechte Strecke |
| `assets/js/szene.js` | 3D: der Oktant im Kopfbereich und in der Werkbank |
| `werkzeug/bildlabor.html` | Die Bilder der Seite als gerechnete Szenen |
| `werkzeug/bilder-rendern.mjs` | Nimmt diese Szenen ab und legt sie unter `assets/img` ab |

Fremde Bibliotheken: `gsap.min.js` und `ScrollTrigger.min.js` (3.15.0, aus dem
Bestand der Beispielprojekte übernommen), `lenis.min.js` (1.3.26),
`three.module.min.js` (0.160.1). Zusammen rund 800 KB unkomprimiert; Three.js
allein macht davon 670 KB aus und wird nur geladen, wenn die Seite tatsächlich
3D zeigt.

---

## Die Marke

Der Name kommt aus der Geometrie: drei Ebenen teilen den Raum in acht Oktanten.
Diese Achtteilung ist das Signet, das Modell im Kopfbereich, das Objekt in der
Werkbank und die Ordnung des Rasters. Ein Zeichen, das an vier Stellen dasselbe
sagt, wirkt teurer als vier Zeichen, die nichts miteinander zu tun haben.

**Farbe.** Ein tiefes, leicht blaues Schwarz und genau eine warme Farbe. Kein
zweiter Akzent. Die Spannung entsteht zwischen kalter Fläche und warmem Licht,
nicht zwischen zwei Farbtönen.

```css
--grund:       #07080b   Obsidian, nie reines Schwarz
--text:        #f2efe9   Elfenbein, kein Weiß
--glut:        #ff5b2e   Flächen, Signet, Fortschritt
--akzent-hell: #ff865f   Schrift auf dunklem Grund
```

Kontraste auf dem Grund: Text 16,8:1, Akzentschrift 6,3:1, gedämpfter Text
7,4:1. Alle über der Vorgabe von WCAG AA, die hellste Kombination auch über AAA.

**Schrift.** Instrument Serif in großen Graden gegen Space Grotesk in kleinen.
Der Bruch zwischen den beiden trägt die Hierarchie — nicht die Schriftgröße
allein und schon gar nicht Fettungen. Space Grotesk liegt als eine variable
Datei über 300–700 vor; das spart drei Downloads.

---

## Die Bilder

Sie stammen nicht aus einer Bildagentur und nicht aus einem Bildgenerator,
sondern aus `werkzeug/bildlabor.html`: fünf gerechnete Szenen mit derselben
Lichtanlage — ein warmes Hauptlicht von rechts oben, das Schatten wirft, ein
kaltes Streiflicht von links hinten, Staub in der Luft, viel schwarze Fläche.

```
node werkzeug/bilder-rendern.mjs      # braucht Playwright mit Chromium
```

Wer eine Szene ändert, lässt das Skript erneut laufen; die Bilder sind damit
reproduzierbar und nicht bloß vorhanden. Drei Dinge haben beim Bauen den
Unterschied gemacht und stehen deshalb auch als Kommentar in der Datei:

1. **Licht bleibt schwach.** Sobald eine Lampe eine Fläche vollständig
   einfärbt, verliert das Material seine Identität — aus Gips wird orange
   Knete. Die Helligkeit kommt aus der Umgebungsspiegelung.
2. **Ohne Schlagschatten steht nichts.** Der Schattenwurf ist der einzige
   Hinweis auf Gewicht, den ein gerechnetes Bild geben kann.
3. **Ohne Lichtstreuung leuchtet nichts.** Eine leuchtende Fläche ohne Streuung
   ist ein Aufkleber. Erst wenn das Licht über seine Kante hinausblutet, glaubt
   das Auge, dass dort eine Quelle ist.

Ein sechster Versuch — eine fotorealistische Werkstatt — ist gestrichen worden.
Eine Echtzeitberechnung ohne Lichtverfolgung macht eine Innenaufnahme nicht
glaubhaft, und ein schlechtes Foto ist schlechter als ein gutes Diagramm. An
seiner Stelle steht jetzt der Oktant im Lichtraster.

---

## Bewegung

Alles Bewegte hat einen Zweck, und alles Bewegte lässt sich abschalten.

- **Vorspann.** Zählt bis 92 und wartet dort auf das `load`-Ereignis, endet
  also nie vor den Bildern. Eine Reißleine im `<head>` räumt ihn nach sechs
  Sekunden auch dann weg, wenn `site.js` gar nicht lädt.
- **Weiches Scrollen** über Lenis, mit GSAP gekoppelt. Auf Touch bleibt das
  native Scrollen: das Betriebssystem macht es dort besser.
- **Waagerechte Strecke** bei den Arbeiten: der Abschnitt steht still, die
  Karten laufen quer. Unter 900 px übernimmt eine senkrechte Liste — quer
  scrollende Bereiche und Touch vertragen sich schlecht.
- **Satz, der beim Lesen aufhellt**, Zähler, Parallaxe, magnetische Knöpfe,
  Kartenneigung, eigener Zeiger. Zeiger, Magnetismus und Neigung nur auf
  Geräten mit echter Maus.

**Bewegung reduzieren.** Wer das im Betriebssystem eingestellt hat, bekommt
jede Animation als Endzustand: kein Vorspann, kein Lenis, keine Fahrten, statt
der beiden 3D-Szenen je ein Standbild. Es fehlt kein Inhalt.

**Ohne JavaScript** bleibt die Seite vollständig lesbar. Der Vorspann wird per
CSS ausgeblendet, die Einblendungen starten sichtbar (`.kein-js`).

---

## Rechenlast

Zwei WebGL-Szenen auf einer Seite sind ein Versprechen, das eingehalten werden
muss:

- Beide starten erst, wenn sie im Bild sind, und halten an, sobald sie es
  verlassen oder der Reiter in den Hintergrund geht.
- Die Bildpunktdichte ist bei 2 gedeckelt.
- Fällt WebGL aus, bleibt der Verlauf aus dem Stilblatt stehen. Kein Loch,
  keine Fehlermeldung.
- Animiert werden ausschließlich `transform` und `opacity`.
- Der Weichzeichner liegt nur auf festen Elementen, das Korn auf einer festen
  Ebene — beides nie in einem scrollenden Behälter.

Die Werkbank zeigt die gemessene Bildrate an. Das ist kein Selbstzweck: Wer
die Seite bei einem Kunden vorführt, kann damit belegen, dass 3D im Browser
nicht automatisch ruckelt.

---

## Vor einem Livegang zu erledigen

Diese Seite ist vollständig gestaltet und funktionsfähig, enthält aber an
mehreren Stellen sichtbare Platzhalter (gelb-orange markiert, Klasse `.todo`):

- **Impressum**: Firmierung, Anschrift, Vertretung, Kontakt, Register,
  USt-IdNr. — alles offen
- **Datenschutz**: Verantwortlicher, Hosting-Anbieter, Löschfrist der
  Protokolle
- **Domain**: `canonical`, `og:url` und die E-Mail-Adressen zeigen auf
  `oktant.example`, eine reservierte Endung, die ins Leere geht
- **Sozial-Links** im Fußbereich zeigen auf den Kontaktbereich, nicht auf echte
  Profile

Bewusst **nicht** enthalten: strukturierte Daten nach schema.org. Ein
`Organization`-Eintrag würde einer Suchmaschine ein Unternehmen melden, das es
nicht gibt. Sobald die Seite für ein echtes Studio umgebaut wird, gehört er
selbstverständlich hinein.
