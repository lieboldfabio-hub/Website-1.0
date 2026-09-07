# Kompass — Designsystem „Blau auf Schwarz"

Verbindliche Gestaltungsgrundlage der Trading-App. Alle Werte sind gerechnet
und geprueft, nicht geschaetzt: die Kontraste per WCAG-Formel, die
Serienfarben zusaetzlich gegen Farbfehlsichtigkeit (Deutan und Tritan).

Der Grundsatz, der alles andere ordnet:

> **Tiefe und Verlauf gehoeren in die Rahmenflaechen, nie hinter Daten.**
> Eine Zahl steht immer auf einer ruhigen, deckenden Flaeche. Alles
> Glaenzende passiert am Rand des Blicks, nicht in seiner Mitte.

Das ist der Unterschied zwischen einem Premium-Fintech-Produkt und einer
huebschen Seite, auf der man Kurse schlecht ablesen kann.

---

## 1. Farbtoken

Alle Farben als CSS-Variablen auf `:root`. Keine Farbe wird irgendwo im
Code direkt als Hex geschrieben — ausschliesslich ueber Token.

### 1.1 Flaechen (Blau-Schwarz-Achse, Farbton 255)

Schwarz mit blauem Stich, nicht neutralgrau und nicht reines Schwarz.
Reines `#000000` wirkt hart und flimmert auf OLED beim Scrollen.

```css
--bg:              #060A12;   /* Seitengrund */
--surface-1:       #0D141E;   /* Karten, Tabellen */
--surface-2:       #161F2A;   /* erhoeht, Hover-Zeile */
--surface-3:       #212B38;   /* Overlay, Popover, Dropdown */
--border:          #2B3645;   /* Standardkante */
--border-strong:   #404E60;   /* betonte Kante, Fokusring-Basis */
```

### 1.2 Schrift

```css
--ink-1: #F3F7FC;   /* Primaertext        Kontrast 17,2:1 auf Karte */
--ink-2: #B7BEC8;   /* Sekundaertext      Kontrast  9,9:1 */
--ink-3: #8A939F;   /* gedaempft, Achsen  Kontrast  6,0:1 */
```

Alle drei liegen deutlich ueber der Anforderung von 4,5:1. `--ink-3` ist die
unterste zulaessige Stufe; darunter gibt es keine weitere.

### 1.3 Blau als Akzent

```css
--accent:        #319CFC;   /* Kontrast 6,4:1 auf Karte */
--accent-hover:  #4CB0FF;   /* Kontrast 7,9:1 */
--accent-quiet:  #1A609E;   /* nur Flaechen und Kanten, NIE Text */
--accent-ink:    #07121E;   /* Text auf gefuellter Akzentflaeche, 6,5:1 */
```

`--accent-quiet` erreicht als Text nur 2,8:1 und ist deshalb ausschliesslich
fuer Fuellungen, Kanten und Verlaeufe freigegeben.

### 1.4 Richtungs- und Statusfarben

```css
--up:         #5BCC80;   /* steigend      9,2:1 */
--up-quiet:   #2F7346;   /* Flaeche/Kante */
--down:       #EF675C;   /* fallend       6,0:1 */
--down-quiet: #8F3831;
--warn:       #E7B643;   /* Warnung       9,8:1 */
--neutral:    #989FA8;   /* unveraendert  6,9:1 */
```

**Regel: Richtung nie allein ueber Farbe.** Jede Auf- oder Abwaertsangabe
traegt zusaetzlich Vorzeichen und Pfeil (`▲ +1,24 %` / `▼ −0,86 %`). Das ist
nicht nur Barrierefreiheit — auf blaudominanten Oberflaechen verschieben sich
Farbeindruecke, und ein Prozentwert muss auch im Augenwinkel eindeutig sein.

### 1.5 Serienfarben fuer Diagramme

Feste Reihenfolge, nie zyklisch weiterzaehlen. Eine neunte Serie wird zu
„Sonstige" zusammengefasst oder in kleine Einzeldiagramme aufgeteilt.

```css
--chart-1: #0A6BB7;   /* Blau     */
--chart-2: #16B05C;   /* Gruen    */
--chart-3: #CB2526;   /* Rot      */
--chart-4: #C48611;   /* Amber    */
--chart-5: #7D40C8;   /* Violett  */
--chart-6: #15A4AB;   /* Cyan     */
--chart-7: #B73095;   /* Magenta  */
--chart-8: #879F11;   /* Limette  */
```

Die Helligkeiten wechseln absichtlich zwischen dunkel und hell. Genau das
macht benachbarte Paare unter Rot-Gruen-Schwaeche unterscheidbar, weil
Farbfehlsichtigkeit den Farbton kollabieren laesst, die Helligkeit aber nicht.

**Geprueft:** alle acht innerhalb der Helligkeitsbandbreite, Farbsaettigung
ueber dem Mindestwert, schlechtestes benachbartes Paar Delta E 9,7 bei
Deutan und 14,1 bei Tritan, Normalsicht 19,3, alle ueber 3:1 gegen die
Kartenflaeche. Wer die Palette aendert, prueft sie neu — Augenmass genuegt hier nicht.

**Trennung der Rollen:** Serienfarben sind fuer Diagrammobjekte. Sie sind
niemals Textfarbe. Beschriftungen, Werte und Legendentext tragen
`--ink-1/2/3`; die Zugehoerigkeit macht ein farbiges Plaettchen daneben.

---

## 2. Verlaeufe — wo sie erlaubt sind und wo nicht

**Erlaubt**

| Ort | Verlauf |
|-----|---------|
| Seitengrund | sehr grossflaechig und flach: radial von `#0B1524` oben links nach `--bg`, Deckkraft hoechstens 60 % |
| Kopfleiste und Seitennavigation | linear 180°, `--surface-1` → `--bg` |
| Signal- und Kennzahlenband | linear 135°, `--surface-1` → `--surface-2`, plus 1 px Kantenlicht oben |
| Primaerschaltflaeche | linear 180°, `--accent-hover` → `--accent` |
| Diagrammfuellung unter einer Linie | vertikal von Serienfarbe 22 % nach 0 % |
| Fortschritts- und Konfidenzbalken | linear 90° innerhalb der Balkenfarbe |

**Verboten**

- Hinter Tabellen, Zahlenspalten oder Fliesstext
- In der Zeichenflaeche eines Diagramms (nur unter der Kurve, siehe oben)
- Auf Beleg-Chips, Kennzahlwerten oder Signalwerten
- Mehr als **zwei** sichtbare Verlaufsflaechen gleichzeitig auf einem Bildschirm
- Regenbogen- oder Mehrfarbverlaeufe jeder Art

Ein Verlauf darf ueber seine gesamte Ausdehnung den Kontrast des darauf
liegenden Textes nie unter 4,5:1 druecken. Im Zweifel wird gegen das
**dunkelste** und das **hellste** Ende einzeln geprueft.

**Beispiel, warum das keine Formalie ist.** Die erste Fassung dieses Dokuments
sah fuer die Primaerschaltflaeche `--accent` → `--accent-quiet` vor. Gerechnet:
`--accent-ink` erreicht am oberen Ende 6,54:1, am unteren aber nur **2,88:1** —
die Beschriftung waere auf der unteren Haelfte des Knopfes durchgefallen. Weil
die Mitte unauffaellig aussieht, faellt so etwas beim Hinsehen nicht auf.
Korrigiert auf `--accent-hover` → `--accent`: schlechtestes Ende 6,54:1.

Geprueft wird deshalb maschinell, nicht am Bild (`pruefung/ui-audit.py`,
Abschnitt Verlaufsenden).

---

## 3. Glaseffekt — mit Budget

Glas ist teuer. `backdrop-filter` zwingt den Browser, den Hintergrund
separat zu rastern; auf mittelmaessiger Hardware kostet jede zusaetzliche
Flaeche messbar Bildrate — besonders beim Scrollen.

**Erlaubt ausschliesslich auf schwebenden Flaechen:**
Kopfleiste bei gescrollter Seite, Popover, Dropdown, Dialog, Befehlspalette,
Benachrichtigungsstreifen.

**Verboten auf:** Karten in Listen, Tabellenzeilen, Diagrammflaechen, allem,
was mitscrollt und in Vielzahl vorkommt.

```css
.glass {
  background: rgba(22, 31, 42, 0.88);   /* deckend genug fuer Kontrast */
  backdrop-filter: blur(16px) saturate(1.15);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);   /* Kantenlicht */
}
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: var(--surface-3); }
}
```

**Budget, hart einzuhalten:**
- Hoechstens **drei** Elemente mit `backdrop-filter` gleichzeitig sichtbar
- Weichzeichnung hoechstens 20 px
- Die Grundfarbe ist immer mindestens 85 % deckend, damit der Kontrast auch
  dann stimmt, wenn der Browser die Weichzeichnung verweigert
- Nie `backdrop-filter` auf einem Element, das gerade animiert wird

---

## 4. Tiefe und Schatten

Auf dunklem Grund funktionieren schwarze Schatten kaum — man sieht sie nicht.
Tiefe entsteht hier aus drei Mitteln, in dieser Rangfolge:

1. **Flaechenstufe** (`--surface-1/2/3`) — das Haupt-Tiefenmittel
2. **Kantenlicht**: `inset 0 1px 0 rgba(255,255,255,0.06)` an der Oberkante.
   Dieser eine Pixel ist der Unterschied zwischen „flach" und „hochwertig".
3. **Schatten**, sparsam und weich, nur bei echt schwebenden Elementen

```css
--shadow-1: 0 1px 2px rgba(0,0,0,.30);                                  /* Karte  */
--shadow-2: 0 6px 20px rgba(0,0,0,.40);                                 /* Hover  */
--shadow-3: 0 16px 40px rgba(0,0,0,.55);                                /* Overlay*/
--edge-light: inset 0 1px 0 rgba(255,255,255,.06);
```

Kein farbiger Schein („Glow") um Elemente. Er sieht auf Standbildern gut aus
und macht Oberflaechen im Gebrauch unruhig.

---

## 5. Typografie

```css
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

- **Alle Zahlen** tragen `font-variant-numeric: tabular-nums`. Ohne das
  springen Spalten bei jeder Aktualisierung. Nicht verhandelbar.
- Groessenstufen: 12 / 13 / 14 / 16 / 20 / 26 / 34 / 44 px
- Zeilenhoehe 1,5 bei Fliesstext, 1,25 bei Ueberschriften, 1,2 bei Zahlen
- Laufweite bei grossen Ueberschriften leicht negativ (−0,02 em), bei
  Versalien-Kleintext positiv (+0,08 em)
- Fliesstextzeilen hoechstens 72 Zeichen

---

## 6. Bewegung

Bewegung erklaert Zusammenhaenge. Sie feiert nichts.

| Zweck | Dauer | Kurve |
|-------|-------|-------|
| Hover, Fokus, Farbwechsel | 120 ms | `cubic-bezier(.2,0,0,1)` |
| Dropdown, Tab, Aufklappen | 180 ms | `cubic-bezier(.2,0,0,1)` |
| Overlay einblenden | 260 ms | `cubic-bezier(.2,0,0,1)` |
| Overlay ausblenden | 160 ms | `cubic-bezier(.3,0,1,1)` |
| Seitenwechsel | hoechstens 300 ms | dito |

**Regeln**

- Animiert werden ausschliesslich `transform` und `opacity`. Niemals
  `width`, `height`, `top`, `left`, `box-shadow` oder `filter` — das erzwingt
  Layout- oder Malvorgaenge in jedem Bild.
- Bei Aufklapp-Elementen `grid-template-rows: 0fr → 1fr` statt `height`.
- **Zahlen zaehlen nicht hoch.** Ein hochlaufender Kurs ist unlesbar und
  suggeriert eine Bewegung, die nicht stattgefunden hat.
- Kein Element bewegt sich ohne Auslöser durch den Nutzer oder ohne echte
  Datenaenderung. Keine Dauerschleifen, kein Pulsieren, kein Schimmern.
- Eintretende Listen hoechstens 5 Elemente gestaffelt, je 30 ms Versatz.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Interaktionszustaende

Jedes bedienbare Element braucht alle fuenf. Fehlt einer, ist die Komponente
unfertig.

| Zustand | Umsetzung |
|---------|-----------|
| Ruhe | Grundflaeche |
| Hover | eine Flaechenstufe hoeher, 120 ms |
| Fokus | `outline: 2px solid var(--accent); outline-offset: 2px` — sichtbar, nie entfernt |
| Aktiv | `transform: scale(.985)`, 80 ms |
| Deaktiviert | Deckkraft 0,45, `cursor: not-allowed`, kein Hover |

Fokus wird **nie** durch `outline: none` unterdrueckt. Tastaturbedienung ist
in einer Finanzanwendung kein Sonderfall.

---

## 8. Leistungsbudget

| Groesse | Grenze |
|---------|--------|
| Bildrate bei Interaktion und Scrollen | 60 fps, keine Ruckler ueber 50 ms |
| Reaktion auf Eingabe (INP) | unter 200 ms |
| Groesster Inhaltsaufbau (LCP) | unter 2,0 s |
| Layoutverschiebung (CLS) | unter 0,05 |
| Gleichzeitige `backdrop-filter`-Flaechen | hoechstens 3 |
| Tabellenzeilen ohne Virtualisierung | hoechstens 100 |
| Diagrammpunkte je Serie | ueber 500 vorher zusammenfassen |

**Kein Layoutsprung beim Laden.** Platzhalter reservieren exakt die Hoehe des
spaeteren Inhalts. Ein Kennzahlenfeld, das nach dem Laden die Zeile
verschiebt, ist ein Fehler, kein Schoenheitsmangel.

---

## 9. Einheitlichkeit

Diese Werte gelten in der gesamten App, ohne Ausnahme:

- **Abstaende** aus einer 4-px-Skala: 4, 8, 12, 16, 24, 32, 48, 64
- **Radien**: 6 px klein (Chip, Feld), 10 px mittel (Karte), 14 px gross
  (Overlay), 999 px Pille. Keine anderen Werte.
- **Kantenstaerke** immer 1 px
- **Symbole** durchgehend aus einer Familie, Strichstaerke 1,5 px,
  Groessen 14 / 16 / 20 px
- **Karten** haben identische Innenabstaende: 20 px bei mittleren, 24 px bei
  grossen
- **Tabellen**: Kopf 40 px hoch, Zeilen 44 px, Zahlen rechtsbuendig, Text
  linksbuendig, Kopfzeile klebt beim Scrollen

Ein neuer Wert kommt nicht dazu, weil er an einer Stelle besser aussieht. Er
kommt dazu, wenn er in die Skala aufgenommen und ueberall angewendet wird.

---

## 10. Was verboten bleibt

Der Redesign macht die App hochwertiger, nicht lauter. Unveraendert
untersagt:

- Emoji in der Oberflaeche
- Hochzaehlende Zahlen, Konfetti, Erfolgsanimationen
- Werbesprache, Ausrufezeichen, Dringlichkeitsformeln
- Farbiger Schein um Karten oder Schaltflaechen
- Verlauf oder Glas hinter Zahlen
- Mehr als eine Akzentfarbe
- Dekorative Kursticker ohne Funktion
- Jede Gestaltung, die Sicherheit suggeriert, wo die Daten sie nicht hergeben

Der Massstab bleibt: die App soll aussehen wie ein Werkzeug, das viel Geld
verwaltet — nicht wie eine App, die Aufmerksamkeit verkauft.
