# Immobilien-Service Augsburg

Auftritt für Immobilien-Service Augsburg. React auf Vite, statisch gebaut,
vorgesehen für Netlify.

> Interne Projektnotizen zu diesem Auftrag stehen **nicht** hier, sondern im
> privaten Vault (`Zweites-Gehirn`, `30-Projekte/`). Dieses Verzeichnis liegt
> vorläufig im öffentlichen Agentur-Repo und wandert nach `kunden/AUSLAGERN.md`
> in ein eigenes, privates Repository. Bis dahin gehört hierher nur, was auch
> ein Fremder lesen dürfte.

## Entwickeln

```bash
npm install
npm run dev      # Entwicklung
npm run build    # nach dist/
npm run preview  # gebaute Fassung ansehen
```

Ein Vorschau-Bau ohne Server-Umleitung:
`VITE_VORSCHAU=1 npx vite build --outDir dist-vorschau` — hängt die Adressen
der Unterseiten hinter ein `#`.

## Farben und Inhalte

Alle Farben stehen in `src/styles/tokens.css` und nirgends sonst. Die Marke ist
ein Gelbgrün bei Farbton 75–78°, dazu je Leistung eine eigene Nebenfarbe.

Stammdaten, Leistungen und Objekte liegen in `src/daten/`. Alles mit
`todo: true` ist unbestätigt und wird in der Oberfläche markiert dargestellt,
damit es nicht versehentlich live geht. Fotos gehören nach `public/`.

## Der Showroom

Die Ausstellung ist eine WebGL-Szene (Three.js), keine CSS-3D-Konstruktion:
Bei CSS-3D rastert der Browser jede Ebene pro Bild in Software neu. Drei
Grundsätze tragen die Datei `src/showroom/szene.js`:

1. Gezeichnet wird nur nach einer Änderung (`anfordern()`), und die Schleife
   hält an, sobald die Sektion aus dem Bild oder der Tab in den Hintergrund geht.
2. Keine Lichtberechnung: alle Materialien sind Basic-Materialien, die
   Beleuchtung ist gemalt, Schatten gibt es nirgends.
3. Geometrien und Materialien werden geteilt, nicht je Objekt neu gebaut.

`window.__szeneInfo()` in der Browserkonsole beantwortet jederzeit, wie viele
Bilder im Sichtfeld stehen und ob die Karte dasselbe Objekt benennt, das der
Betrachter groß vor sich sieht — beides wird gemessen, nicht geschätzt.

## Beim Ändern beachten

- **Das Kontaktformular ist doppelt gepflegt.** Netlify erkennt Formulare nur
  im ausgelieferten HTML, React baut seins erst im Browser. In `index.html`
  liegt eine versteckte Zwillingsfassung. Ändert man ein `name` in
  `src/komponenten/Kontakt.jsx`, muss es dort mitgeändert werden — sonst
  verschwinden Anfragen spurlos.
- **Die Umleitung `/* → /index.html`** steht in `netlify.toml` und in
  `public/_redirects`. Ohne sie gibt es 404 beim direkten Aufruf von
  `/impressum` oder `/immobilie/…`.
- **Schriftfarben der Leistungspillen sind gerechnet, nicht gewählt.** Fünf der
  sechs Leistungsfarben sind zu hell für weiße Schrift. Wer eine Farbe ändert,
  prüft den Kontrast neu: mindestens 4,5:1.
- **Das Licht im Showroom trägt nicht die Markenfarbe.** Eine Wandleuchte in
  vollem Limettengrün färbt den Raum giftgrün; Galerielicht ist warmweiß.
- **Animiert wird nur die Lage, nie die Deckkraft** (`src/komponenten/Einblenden.jsx`).
  Inhalt, der auf `opacity: 0` wartet, fehlt in jeder Linkvorschau und für
  jeden, der Bewegung abgeschaltet hat.
- **`scroll-margin-top` nicht entfernen**, sonst verdeckt die feste Kopfzeile
  bei jedem Menüklick die Überschrift des Ziels.
- **Messungen ohne Grafikkarte sagen nichts über echte Hardware.** Belastbar
  sind `zeichenaufrufe` und `dreiecke`, nicht die Bildrate.

## Vor dem Livegang

- Porträtfoto, Originallogo (die Kopfzeile zeigt eine Nachzeichnung),
  Objektfotos, Anschrift und E-Mail
- Impressum und Datenschutz sind Gerüste — §34c GewO und DSGVO prüfen lassen
- Pflichtangaben je Objekt: Energieausweis, Endenergiebedarf, Energieträger,
  Provision
- Empfänger-Adresse fürs Kontaktformular bei Netlify hinterlegen
