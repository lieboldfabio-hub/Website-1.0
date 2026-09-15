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

Vorschau ohne Server-Umleitung:
`VITE_VORSCHAU=1 npx vite build --outDir dist-vorschau` — hängt die Adressen
der Unterseiten hinter ein `#`.

## Warum das Scrollen so gebaut ist, wie es gebaut ist

Die Vorfassung hatte zwei Dinge, die das Scrollen unbrauchbar machten: eine
Scroll-Bibliothek (Lenis), die das gesamte Seiten-Scrollen übernahm, und einen
Showroom als 660 Bildschirme hohe Sektion, deren Scroll-Fortschritt eine
WebGL-Kamerafahrt steuerte. Jedes Scroll-Ereignis rechnete und zeichnete.

**Beides ist entfernt und darf nicht zurückkommen.** Das Scrollen gehört dem
Browser. Die waagerechte Präsentation (`Schaufenster.jsx`) ist ein Element mit
`overflow-x: auto` — mehr nicht. Was dort an JavaScript steht, greift nie ins
Scrollen ein: zwei Knöpfe, die `scrollBy` aufrufen, und ein Beobachter, der
prüft, ob die Knöpfe noch etwas zu tun haben.

Gemessen (Startseite, ganze Länge durchgescrollt): 16,7 ms je Bild auf
Desktop, Laptop, Tablet und Handy — und ebenso bei vierfach gedrosselter
CPU. Kein einziges Bild über 32 ms. Layout-Verschiebung 0,000.

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
- **`white-space: nowrap` nur mit Medienabfrage.** Eine Satzfeinheit in der
  H1 erzwang sonst eine Mindestbreite, die die Seite auf einem 320-Pixel-Gerät
  quer scrollen ließ.
- **Schriftfarben auf Flächen neu rechnen**, wenn eine Farbe geändert wird:
  mindestens 4,5:1.

## Struktur

- `src/daten/firma.js` — sämtliche Inhalte: Stammdaten, zehn Leistungen,
  Qualifikationen, Region, Kundenstimmen. Was `offen: true` trägt, liegt nicht
  vor und wird in der Oberfläche markiert dargestellt.
- `src/seiten-meta.js` — Adressregister mit Titel und Beschreibung je Seite.
- `src/styles/tokens.css` — **alle** Farben, Größen, Abstände, Radien.
- `src/styles/schriften.css` — selbst ausgelieferte Schriften, kein Aufruf an
  Google.
- `src/komponenten/Schaufenster.jsx` — die waagerechte Präsentation.
- `src/bausteine/` — Einblenden, Bildfläche, Seitenkopf, Aufruf, Signet.

## Vor dem Livegang

- **E-Mail-Adresse** — fehlt als einzige Stammangabe
- **Porträtfoto** als `public/marion-sens.jpg`
- **Originallogo** — das Signet ist eine Nachzeichnung
- **Weitere Kundenstimmen** im Wortlaut; belegt ist bisher eine
- **Impressum und Datenschutz** prüfen lassen: §34c GewO und DSGVO
- **Empfänger-Adresse** fürs Formular bei Netlify hinterlegen
- **Objektbilder**, falls der Showroom später echte Immobilien zeigen soll

## Bekannte Grenze

Auf genau 320 Pixel Breite misst `scrollWidth` vier Pixel mehr als das
Fenster. Die Seite lässt sich dort trotzdem nicht seitlich verschieben
(`overflow-x: hidden` am `body`), es erscheint keine Scrollleiste und kein
Element ragt sichtbar heraus. Für den Benutzer hat das keine Wirkung; sollte
es später doch stören, liegt der Rest in der Innenabstands-Rechnung der
waagerechten Bahn.
