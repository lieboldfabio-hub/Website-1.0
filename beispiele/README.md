# Beispielprojekte

Drei Websites für erfundene Unternehmen, gebaut zum Vorzeigen bei
Kundengesprächen. Jedes Beispiel steht für eine andere Branche, eine andere
Gestaltungsrichtung und eine andere Signatur-Interaktion.

**Alle Unternehmen darin sind erfunden.** Namen, Adressen, Preise und Texte
dienen ausschließlich der Veranschaulichung. Jede Seite trägt unten rechts einen
Hinweis und im Fußbereich einen Vermerk. E-Mail-Adressen nutzen die reservierte
Endung `.example` und gehen ins Leere.

---

## Die drei Beispiele

### osteria-fontana - Restaurant

Dunkel, redaktionell, bildgetrieben. Playfair Display auf warmem Fast-Schwarz
mit Terrakotta.

**Signatur:** Eine Galerie, die waagerecht läuft, während man senkrecht
scrollt. Der Abschnitt wird dabei am Bildschirm festgehalten.

Außerdem: Laufband mit den Gerichten des Tages, das beim Zeigen langsamer wird.
Feines Korn über der ganzen Seite. Preise als Speisekarte mit Punktlinie.

### halbritter-haustechnik - Handwerk, Elektro und Sanitär

Hell, technisch, sachlich. Archivo auf Knochenweiß mit Signalblau, dazu ein
feines Punktraster.

**Signatur:** Vorher-Nachher-Schieber. Ziehen, klicken oder Pfeiltasten, alles
funktioniert. Beim ersten Erscheinen zieht er kurz auf, damit erkennbar wird,
dass man ihn bewegen kann.

Außerdem: Leistungskarten, die sich beim Scrollen stapeln. Notdienst-Streifen
direkt unter dem Hero, weil das im Handwerk das stärkste Argument ist.

### kopfsache-studio - Friseursalon

Laut, kontrastreich, jung. Bricolage Grotesque auf Schwarzweiß mit Limette.

**Signatur:** Karten mit Lichtkegel, der unter dem Zeiger mitwandert.

Außerdem: Knöpfe, die dem Zeiger leicht folgen. Ziehharmonika für häufige
Fragen mit weich laufender Höhe. Laufband in Akzentfarbe.

---

## Aufbau

Jedes Beispiel liegt eigenständig in seinem Ordner und lässt sich einzeln
ausliefern. Geteilt wird nur die Bauweise, nicht der Code.

```
beispiele/<name>/
├── index.html
└── assets/
    ├── css/basis.css   gemeinsames Fundament, ohne Farben
    ├── css/site.css    Tokens und Abschnitte dieser Seite
    ├── css/fonts.css   Schrifteinbindung
    ├── js/basis.js     Navigation, Reveals, Bildplätze, Hilfen
    ├── js/site.js      Signatur-Interaktion dieser Seite
    ├── js/gsap.min.js  GSAP 3.15 mit ScrollTrigger
    ├── fonts/          selbst gehostet, kein Google-Request
    └── img/            hier die Fotos ablegen
```

### Als Vorlage für neue Kunden

`basis.css` und `basis.js` enthalten keine Farben und keine Schriftnamen. Für
ein neues Projekt genügt es, beide zu kopieren und in `site.css` die Tokens neu
zu setzen:

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

Damit stehen Navigation, Menü, Bildplätze, Scroll-Einblendungen und
Zeilen-Reveals bereits.

`basis.js` stellt zusätzlich zwei Hilfen bereit:

- `Basis.magnetisch(element, stärke)` - folgt dem Zeiger, nur mit Maus
- `Basis.spotlight(element)` - setzt `--mx` und `--my` für Lichtkegel

Beide schalten sich auf Touchgeräten und bei `prefers-reduced-motion` ab.

---

## Bilder

Alle Bildplätze zeigen eine Markenfläche mit Signet, solange kein Foto vorliegt.
Legt man die Datei unter dem erwarteten Namen in `assets/img/` ab, erscheint sie
automatisch. Die erwarteten Namen stehen jeweils im Platzhalter selbst.

Beim Vorher-Nachher-Schieber sind die beiden Platzhalter bewusst verschieden
eingefärbt, damit der Effekt auch ohne Fotos erkennbar ist. Sobald echte Bilder
eingesetzt sind, verdecken sie diese Flächen.

---

## Geprüft

Für jedes Beispiel im echten Browser nachgestellt:

- Keine Konsolenfehler, kein horizontaler Overflow, keine toten Links
- Signatur-Interaktionen funktional getestet: Schieber mit Ziehen und Tastatur,
  Ziehharmonika mit Öffnen, Schließen und Wechseln
- Waagerechte Galerie fällt unter 820 Pixel auf eine wischbare Reihe zurück
- Bei `prefers-reduced-motion` entfallen Laufband, Heftung und alle Reveals
