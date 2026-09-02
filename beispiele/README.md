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
| `kopfsache-studio` | Friseursalon | Einseiter | Bricolage Grotesque, Schwarzweiß mit Limette |
| `brenner-kolb-recht` | Kanzlei | Einseiter | Frank Ruhl Libre auf Pergament, Gold |

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

## Farbwähler

Jedes Beispiel lässt sich im Fußbereich auf **drei Akzentfarben** umstellen –
dieselbe Marke, ein anderer Akzent. Das beantwortet im Kundengespräch die Frage,
die ohnehin kommt: „Geht das auch in unserem Rot?"

| Projekt | Varianten |
|---|---|
| Halbritter Haustechnik | Signalblau · Signalrot · Waldgrün |
| Osteria Fontana | Terrakotta · Olive · Bordeaux |
| Kopfsache Studio | Limette · Magenta · Cyan |
| Brenner & Kolb | Gold · Bordeaux · Marine |
| Zahnärzte am Königsplatz | Koralle · Himmelblau · Lavendel |

Papier, Tinte und Schrift bleiben unverändert. Nur der Akzent wechselt – das
ist die realistische Frage und zugleich der überzeugendere Beweis, weil die
Marke erkennbar bleibt.

### Der Akzent hat drei Rollen

Vorher gab es einen einzigen `--accent` für alles. Derselbe Ton kann aber nicht
gleichzeitig als kleine Schrift auf hellem Papier **und** als leuchtende Fläche
funktionieren. Beim Prüfen lagen vier von fünf Projekten mit der Schriftvariante
unter der Kontrastvorgabe – am deutlichsten Kopfsache, wo Limette auf Papier
nur 1,19:1 erreichte und praktisch unlesbar war. Deshalb jetzt:

```css
--accent-flaeche  /* der Markenton, wie er auf Knöpfen und Balken liegt */
--accent          /* abgedunkelt, für Akzentschrift und Linien           */
--accent-band     /* aufgehellt, gilt innerhalb der dunklen Abschnitte   */
--accent-fg       /* Beschriftung auf der Fläche                          */
```

Am Ende jeder `site.css` steht, welche Abschnitte des Projekts dunkel sind. Dort
übernehmen `--accent-band` und eine dunkle Knopfbeschriftung. Weil `--accent`
vererbt wird, genügt es, das am Container zu setzen.

**Alle 15 Varianten** erreichen WCAG AA in allen drei Rollen: Akzentschrift auf
dem Grund, Akzent im dunklen Abschnitt, Knopfbeschriftung auf der Fläche.
Wer eine Variante ändert oder hinzufügt, sollte das nachrechnen.

### Technik

- Ein kurzes Skript im `<head>` **jeder** Seite stellt die gemerkte Wahl her,
  bevor gezeichnet wird. Kommt eine neue Seite dazu, muss es mit hinein – sonst
  blitzt dort beim Laden der Grundakzent auf.
- Die Wahl liegt in `localStorage` unter dem Schlüssel `farbe`, getrennt je
  Projekt-Herkunft. Sie verlässt den Browser nicht.
- Ohne JavaScript wird die Leiste ausgeblendet, die Seite bleibt im
  Grundakzent vollständig benutzbar.

---

## Aufbau

Jedes Beispiel liegt eigenständig in seinem Ordner und lässt sich einzeln
ausliefern. Geteilt wird nur die Bauweise, nicht der Code.

```
beispiele/<name>/
├── index.html          Startseite
├── <unterseiten>.html  nur bei den drei Mehrseitern
├── impressum.html
├── datenschutz.html
├── 404.html
└── assets/
    ├── css/basis.css   gemeinsames Fundament, ohne Farben
    ├── css/site.css    Tokens und Abschnitte dieser Seite
    ├── css/fonts.css   Schrifteinbindung
    ├── js/basis.js     Navigation, Reveals, Bildplätze, Hilfen
    ├── js/site.js      Signatur-Interaktion dieser Seite
    ├── js/gsap.min.js  GSAP 3.15 mit ScrollTrigger
    ├── fonts/          selbst gehostet, kein Google-Request
    └── img/            og.jpg liegt hier, hier auch die Fotos ablegen
```

`basis.css` ist in allen fünf Projekten **byteweise identisch**. Wer daran etwas
ändert, kopiert die Datei anschließend in die anderen vier.

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
Zeilen-Reveals bereits. Für Unterseiten kommen dazu, ebenfalls rein über die
Tokens gefärbt:

`.seitenkopf` · `.kopf-block` · `.teaser-grid` mit `.teaser` · `.ablauf` ·
`.projekte` mit `.projekt` und `.fakten` · `.zitate` mit `.zitat` · `.faq` ·
`.cta-band` · `.formular` mit `.feld` und `.feld-paar` · `.preise` mit `.preis` ·
`.zwei` als zweispaltiges Raster · `.legal` für Rechtstexte · `.fehler` für 404

`basis.js` stellt zusätzlich zwei Hilfen bereit:

- `Basis.magnetisch(element, stärke)` - folgt dem Zeiger, nur mit Maus
- `Basis.spotlight(element)` - setzt `--mx` und `--my` für Lichtkegel

Beide schalten sich auf Touchgeräten und bei `prefers-reduced-motion` ab.

---

## Bilder

Alle Bildplätze zeigen eine Markenfläche mit Signet, solange kein Foto vorliegt.
Legt man die Datei unter dem erwarteten Namen in `assets/img/` ab, erscheint sie
automatisch – ohne Code-Änderung. Die erwarteten Namen stehen jeweils im
Platzhalter selbst, die fertigen Prompts in `BILDPROMPTS.md`.

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
- Kein horizontaler Overflow, geprüft bei 1440 und 390 Pixeln Breite
- Signatur-Interaktionen funktional getestet: Schieber mit Ziehen und Tastatur,
  Ziehharmonika mit Öffnen, Schließen und Wechseln
- Waagerechte Galerie fällt unter 820 Pixel auf eine wischbare Reihe zurück
- Bei `prefers-reduced-motion` entfallen Laufband, Heftung und alle Reveals
- Die aktive Seite ist in der Navigation mit `aria-current="page"` markiert
- Alle 15 Akzentvarianten im Browser durchgeschaltet und je Variante Attribut,
  Speicherung, `aria-pressed` und die berechneten Farbwerte ausgelesen
