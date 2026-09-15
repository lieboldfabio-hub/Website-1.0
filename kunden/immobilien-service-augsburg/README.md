# Immobilien-Service Augsburg

Auftritt für Immobilien-Service Augsburg. React auf Vite, statisch gebaut,
vorgesehen für Netlify.

> Interne Projektnotizen zu diesem Auftrag stehen **nicht** hier, sondern im
> privaten Vault (`Zweites-Gehirn`, `30-Projekte/`). Dieses Verzeichnis liegt
> vorläufig im öffentlichen Agentur-Repo und wandert nach `kunden/AUSLAGERN.md`
> in ein eigenes, privates Repository.

## Entwickeln

```bash
npm install
npm run dev      # Entwicklung
npm run build    # nach dist/
npm run preview  # gebaute Fassung ansehen
```

Prüfen (braucht Playwright und eine laufende Vorschau — Einzelheiten in
`werkzeuge/LIESMICH.md`):

```bash
node werkzeuge/pruefen.mjs     # 30 Prüfungen
node werkzeuge/fluss.mjs       # Scrollfluss, auch mit gedrosselter CPU
node werkzeuge/ganzseiten.mjs  # Ganzseitenbilder + versteckter Inhalt
node werkzeuge/regeln.mjs      # Stylesheet-Regeln, ohne Vorschau
```

Vorschau ohne Server-Umleitung:
`VITE_VORSCHAU=1 npx vite build --outDir dist-vorschau` — hängt die Adressen
der Unterseiten hinter ein `#`.

## Die Marke

Das Gelbgrün der bestehenden Seite (Ton 76°) trägt den Auftritt: helle Bänder,
Flächen, Symbole. Für Schrift und Linien wird dieselbe Farbe abgedunkelt, weil
das helle Grün auf Weiß nur 1,9:1 erreicht und unlesbar ist. Gleiche Farbe,
zwei Helligkeiten.

Dazu die sechs Nebenfarben der bestehenden Seite, eine je Leistung — Petrol,
Sand, Hellblau, Limette, Bordeaux, Khaki. Dort tragen sie die Wiedererkennung,
hier ebenso: als Kante der Leistungen in der Lesestrecke und als Ton der
Stationen in der Ausstellung.
Fünf davon sind zu hell für weiße Schrift; die Schriftfarbe je Ton steht
gerechnet in `daten/firma.js`.

Das grüne Band mit Aufruf und Telefonnummer (`Kontaktband.jsx`) ist das
auffälligste wiederkehrende Element der bestehenden Seite und gliedert hier
ebenso den Inhalt.

## Die Ausstellung

`/ausstellung` ist eine eigene Seite: sieben Stationen, nummeriert wie Räume
einer Ausstellung („01 — Bewertung"). Beim Scrollen bleibt die Bühne stehen und
der Inhalt wandert seitlich durch, danach läuft die Seite normal weiter.

Technisch ist das kein Scroll-Hijacking, sondern eine scrollgetriebene
CSS-Animation: die Sektion ist so hoch wie die Fahrt lang ist
(`Stationen × 100svh + 50svh`), die Bühne darin ist `position: sticky`, und die
Bahn bewegt sich über `animation-timeline: view()` um
`-100vw × (Stationen − 1)`. Kein Scroll-Zuhörer, keine Rechnung je Bild, kein
`preventDefault` — der Browser behält das Scrollen.

Gemessen bei 1440 × 900 und sieben Stationen: die Bahn läuft linear von 0 auf
−8640 px, genau die Breite von sechs Fenstern, dann gibt die Bühne frei.

Unter 900 px Breite und bei `prefers-reduced-motion: reduce` gibt es keine
Heftung: die Stationen stehen dann als Karten in einer Bahn mit
`overflow-x: auto` und `scroll-snap-type: x mandatory` — man wischt sie
seitlich durch, das senkrechte Scrollen bleibt unberührt.

## Warum das Scrollen so gebaut ist, wie es gebaut ist

Die Vorfassung hatte zwei Dinge, die das Scrollen unbrauchbar machten: eine
Scroll-Bibliothek (Lenis), die das gesamte Seiten-Scrollen übernahm, und einen
Showroom als 660 Bildschirme hohe Sektion, deren Scroll-Fortschritt eine
WebGL-Kamerafahrt steuerte. Jedes Scroll-Ereignis rechnete und zeichnete.

**Beides ist entfernt und darf nicht zurückkommen.** Das Scrollen gehört dem
Browser. Die Querfahrt der Ausstellung ist reines CSS (siehe oben), auf
schmalen Geräten ein Element mit `overflow-x: auto`. In `Querfahrt.jsx` steht
kein einziger Scroll-Zuhörer.

Gemessen (Startseite, ganze Länge durchgescrollt): 16,7 ms je Bild auf
Desktop, Laptop, Tablet und Handy — und ebenso bei vierfach gedrosselter
CPU. Kein einziges Bild über 32 ms. Layout-Verschiebung 0,000.

## Bewegung

Die Seite reagiert durchgehend auf die Scrollposition — über
`animation-timeline`, nicht über JavaScript. Der Browser liest die Position
und bewegt auf dem Compositor: kein Scroll-Zuhörer, keine Rechnung je Bild,
kein `preventDefault`.

Die Primitive stehen einmal in `styles/bewegung.css`; die Seiten rufen sie
über ein Attribut ab (`data-bewegung="heben"`, `"tiefe"`, `"naeher"`,
`"staffel"`, `"schweben"`, `"aufwischen"`, `"zeichnen"`). Eine Seite erfindet
keine eigene Animation.

Vier Regeln, die nicht verhandelbar sind:

1. Animiert werden nur `transform`, `opacity`, `clip-path` und über
   `@property` registrierte Eigenschaften — und auch die nur, wenn sie eine
   dieser Eigenschaften speisen. Eine registrierte Eigenschaft, die in einen
   Verlauf fließt, kostet jedes Bild einen Malschritt.
2. Inhalt startet sichtbar. Verstecken ist nur für `aria-hidden`-Dekoration
   erlaubt. `werkzeuge/ganzseiten.mjs` setzt das maschinell durch.
3. Nichts über dem Falz hängt an einer View-Timeline. Der Einstieg bekommt
   `data-eintritt` — eine einmalige Bewegung beim Laden.
4. Zwei Primitive, die beide `transform` animieren, gehören nicht auf
   dasselbe Element.

## Licht und Tiefe

Eine Lichtquelle für die ganze Seite: von oben, leicht von links. Alles
Erhobene wirft in dieselbe Richtung, darum wächst der Versatz nach rechts mit
der Höhe. Die Schattenleiter `--schatten-1` bis `--schatten-4` steht in
`tokens.css`, gefärbt aus `--dunkel` statt aus Schwarz — ein neutralgrauer
Schatten auf warmem Off-White sieht billig aus.

Tiefe ist Hierarchie, nicht Dekor: 1 Lesestrecken (Verlauf, kein Schatten),
2 Karten und Formularfelder, 3 Gehobenes und die Stationen der Querfahrten,
4 Kopfzeile und offene Menüs.

## Die beiden Querfahrten

`komponenten/Querfahrt.jsx` trägt zwei Varianten derselben Mechanik:

- **`"raum"`** auf `/ausstellung` — dunkler Raum mit Boden, Decke, wanderndem
  Licht und Rahmen an der Wand.
- **`"hell"`** auf `/leistungen` — die sechs Kernleistungen als Platten im
  eigenen Leistungston, mit Dicke und Schatten.

Die Tiefe kommt aus echter Perspektive: die Bühne hat `perspective`, die Bahn
steht in `preserve-3d`, und jede Station dreht sich um ihre eigene Mitte.
Wann diese Mitte erreicht ist, sagt `--mitte` — in der Komponente
ausgerechnet, weil Rechnen in JavaScript ehrlicher ist als eine Division im
Stylesheet.

## Beim Ändern beachten

- **Keine Scroll-Bibliothek einbauen.** Kein Lenis, kein Locomotive, kein
  ScrollSmoother. Wenn etwas beim Scrollen passieren soll: IntersectionObserver.
- **Nie Inhalt auf `opacity: 0` parken**, der auf einen Beobachter wartet.
  `Einblenden.jsx` animiert nur die Lage. Inhalt, der auf das Hereinscrollen
  wartet, fehlt in jeder Linkvorschau und für alle mit reduzierter Bewegung.
- **`font-display: optional` nicht auf `swap` ändern.** Der Tausch der
  Ersatzschrift gegen die echte verschiebt jede Zeile der Seite — gemessen
  0,28 Layout-Verschiebung allein dadurch.
- **Bilder gehören in `Bildflaeche.jsx`.** Der Rahmen hat seine Größe, bevor
  das Bild da ist; fehlt es, wird es nur unsichtbar. Ein per `display: none`
  entferntes Bild kostete auf dem Handy 0,97 Layout-Verschiebung.
- **Das Kontaktformular ist doppelt gepflegt.** Netlify erkennt Formulare nur
  im ausgelieferten HTML. In `index.html` liegt eine versteckte
  Zwillingsfassung; wird in `seiten/Kontakt.jsx` ein `name` geändert, muss es
  dort mitgeändert werden, sonst verschwinden Anfragen spurlos.
- **Adressen stehen in `seiten-meta.js`**, und zwar genau einmal. Menü,
  Fußzeile, Brotkrumen und Routen speisen sich daraus. Eine Seite, die dort
  nicht steht, gibt es nicht — damit kann kein Menüpunkt ins Leere zeigen.
- **Kein `white-space: nowrap` in Fließtext-Überschriften.** Zweimal
  danebengegangen: es erzwingt eine Mindestbreite, die die Seite auf einem
  320-Pixel-Gerät quer scrollen ließ, und es schafft dahinter eine
  Umbruchstelle, an der der Schlusspunkt allein in die nächste Zeile rutschte.
  In der Kopfzeile ist es richtig, im Satz nicht.
- **Rasterspalten als `minmax(0, 1fr)`, nicht als `1fr`.** Sonst setzt der
  breiteste unteilbare Inhalt eine Mindestbreite durch und die Spalte wächst
  über das Fenster hinaus — so entstand der letzte Querüberlauf auf 320 px.
- **Gedreht wird das Bild, nie eine Fläche mit Fließtext.** Eine Station ist
  so groß wie das Fenster; dreht man sie mitsamt Schrift, muss der Browser
  bei jedem Bild alles neu rastern — gemessen 21 ms je Bild statt 16,7.
- **Kein `backdrop-filter` über einer laufenden Bühne.** Der Weichzeichner
  rechnet den Bereich dahinter bei jedem Bild neu. Über der stehenden Seite
  kostet das nichts, über wandernden Stationen jedes Bild. Ein
  IntersectionObserver in `Querfahrt.jsx` schaltet ihn ab, solange eine Fahrt
  hinter der Kopfzeile läuft — und die Kopfzeile über dem Ausstellungsraum
  gleich mit dunkel.
- **`max-width` in Überschriften darf kein Wort zerreißen.**
  „Immobilienbewertung" wurde als „Immobilienbewertun|g" umbrochen. Auf
  Silbentrennung ist kein Verlass, also `overflow-wrap: normal` und das Wort
  ragt lieber über das Maß.
- **`base` bleibt beim Live-Bau absolut.** Mit relativer Basis sucht ein
  direkter Einstieg auf einer Unterseite mit Schlussstrich die Dateien im
  falschen Verzeichnis; die Umschreibung liefert dort wieder index.html und
  die Seite bleibt weiß. Relativ ist nur der Vorschau-Bau.
- **Der Schlussstrich wird in `App.jsx` abgeschnitten, vor den Routen.**
  Steht die Weiterleitung neben ihnen, rendert die Leistungsseite im selben
  Durchgang ihre eigene Weiterleitung auf die Übersicht und behält recht.
- **Vorgeladene Dateien über den Quellpfad angeben**, damit Vite sie auf den
  gehashten Namen umschreibt. Ein fest getippter Pfad lud bei jedem Aufruf
  eine Datei, die es nicht gab.
- **Schriftfarben auf Flächen neu rechnen**, wenn eine Farbe geändert wird:
  mindestens 4,5:1.
- **Kein `content-visibility: auto` auf den Stationen.** Es spart bei sieben
  Stationen nichts und überspringt sie beim Zeichnen, solange sie außerhalb
  liegen — in einem Bild der ganzen Seite war die Ausstellung dadurch leer.
- **Farbbänder als Rahmenkante, nicht als Element mit negativen Rändern.**
  Solche Ränder vergrößern die Elementbreite; das Band ragte dadurch auf
  schmalen Geräten aus der Karte heraus und ließ die Seite quer scrollen.

## Struktur

- `src/daten/firma.js` — sämtliche Inhalte: Stammdaten, zehn Leistungen,
  Qualifikationen, Verkaufsschritte, Lebenslagen, Region, Kundenstimmen. Was `offen: true` trägt, liegt nicht
  vor und wird in der Oberfläche markiert dargestellt.
- `src/seiten-meta.js` — Adressregister mit Titel und Beschreibung je Seite.
- `src/styles/tokens.css` — **alle** Farben, Größen, Abstände, Radien,
  Schattenleiter.
- `src/styles/bewegung.css` — die Bewegungsprimitive, einmal.
- `src/styles/schriften.css` — selbst ausgelieferte Schriften, kein Aufruf an
  Google.
- `src/daten/ausstellung.js` — die sieben Stationen der Ausstellung.
- `src/komponenten/Querfahrt.jsx` — beide Querfahrten, hell und dunkel.
- `src/komponenten/Stimmen.jsx` — Rückmeldungen; ab der zweiten Stimme
  erscheinen die Punkte zum Blättern von selbst.
- `src/bausteine/` — Einblenden, Bildfläche, Seitenkopf, Aufruf, Signet, Motiv.
- `werkzeuge/` — die vier Prüfskripte.

## Vor dem Livegang

- **E-Mail-Adresse** — fehlt als einzige Stammangabe
- **Porträtfoto** als `public/marion-sens.jpg`
- **Originallogo** — das Signet ist eine Nachzeichnung
- **Weitere Kundenstimmen** im Wortlaut; belegt ist bisher eine
- **Impressum und Datenschutz** prüfen lassen: §34c GewO und DSGVO
- **Empfänger-Adresse** fürs Formular bei Netlify hinterlegen
- **Objektbilder**, falls die Ausstellung später echte Immobilien zeigen soll

## Geprüft

Alle Prüfungen bestanden, Vorschau auf `dist/`:

- **30 Prüfungen**: 20 Seiten erreichbar und kein 404, je genau eine H1,
  eigener Titel und eigene Beschreibung; kein Querüberlauf bei 1440, 820,
  390 und 320 px; **beide** Querfahrten monoton vorwärts und exakt auf der
  letzten Station endend (−8640 px bei sieben, −7200 px bei sechs Stationen);
  Formular angemeldet und jedes Feld beschriftet; keine Konsolenfehler.
- **Scrollfluss** auf `/`, `/leistungen`, `/ausstellung`, `/region` und einer
  Leistungsseite: Median 16,7 ms, auch bei **vierfach gedrosselter CPU**.
  Gemessen über drei Durchläufe je Seite, der erste verworfen.
- **Layout-Verschiebung 0,000** auf Desktop, Tablet und Handy.
- Kein Inhalt unsichtbar, der nicht `aria-hidden` trägt (maschinell).
- Nur Compositor-Eigenschaften in `@keyframes` und `transition` (maschinell).
