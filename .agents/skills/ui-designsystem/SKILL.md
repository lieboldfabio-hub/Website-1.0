---
name: ui-designsystem
description: |
  Durchsetzung und Pflege des Designsystems der Trading-App: Farbtoken,
  Blau-Schwarz-Verlaeufe, Glaseffekte mit Budget, Tiefe, Typografie,
  Abstands- und Radienskala, Komponentenvarianten. Sorgt dafuer, dass alle
  Bereiche optisch einheitlich wirken und kein Wert am System vorbei entsteht.
triggers:
  - "farbschema"
  - "design tokens"
  - "einheitliches design"
  - "farbverlauf"
  - "glaseffekt"
  - "dark theme"
---

# ui-designsystem — ein System, keine Sammlung von Einzelfaellen

Werte stehen in `investoren-app/DESIGN-SYSTEM.md`. Dieser Skill beschreibt,
wie sie durchgesetzt werden.

## Der Kerngedanke des Blau-Schwarz-Systems

> Tiefe und Verlauf gehoeren in die Rahmenflaechen, nie hinter Daten.

Schwarz mit blauem Stich traegt die Flaeche, Blau markiert alles, was
interaktiv oder wichtig ist. Weil Blau die Akzentfarbe ist, darf es nirgends
sonst auftauchen — sonst verliert es seine Bedeutung. Eine blaue Ueberschrift
ohne Funktion ist ein Fehler, kein Schmuck.

## Fuenf Durchsetzungsregeln

1. **Kein Hex im Code.** Jede Farbe laeuft ueber ein Token. Ein direkter
   Farbwert in einer Komponente ist ein Befund, auch wenn er richtig aussieht.
2. **Kein Wert ausserhalb der Skala.** Abstaende aus 4/8/12/16/24/32/48/64,
   Radien aus 6/10/14/999, Kanten immer 1 px. Wer einen neuen Wert braucht,
   nimmt ihn ins System auf und wendet ihn ueberall an — oder verzichtet.
3. **Eine Komponente je Zweck.** Zwei Kartenkomponenten, die dasselbe tun,
   werden zusammengefuehrt, bevor irgendetwas poliert wird.
4. **Varianten statt Sonderfaelle.** Braucht eine Karte an einer Stelle mehr
   Betonung, bekommt sie eine benannte Variante — keine abweichenden
   Zusatzklassen an der Verwendungsstelle.
5. **Zahlen sind ein eigener Typ.** Jede Zahl traegt `tabular-nums`, ist
   rechtsbuendig und folgt der deutschen Schreibweise. Das wird an einer
   zentralen Stelle geloest, nicht in jeder Komponente neu.

## Verlaeufe

Erlaubt auf Seitengrund, Kopfleiste, Navigation, Kennzahlenband,
Primaerschaltflaeche, Flaeche unter einer Diagrammlinie, Fortschrittsbalken.

Verboten hinter Tabellen, Zahlen, Fliesstext, Beleg-Chips und in der
Zeichenflaeche von Diagrammen. Hoechstens zwei sichtbare Verlaufsflaechen je
Bildschirm. Nie mehrfarbig.

Pruefung: Der Kontrast des Textes darauf wird gegen **beide Enden** des
Verlaufs einzeln gerechnet, nicht gegen die Mitte. Faellt ein Ende unter
4,5:1, wird der Verlauf flacher oder der Text bekommt eine deckende Flaeche.

## Glas

Nur auf schwebenden Flaechen: Kopfleiste beim Scrollen, Popover, Dropdown,
Dialog, Befehlspalette, Benachrichtigung. Nie auf mitscrollenden Karten oder
Tabellenzeilen.

Budget: hoechstens drei weichgezeichnete Flaechen gleichzeitig, hoechstens
20 px Weichzeichnung, Grundfarbe mindestens 85 % deckend, nie auf einem
gerade animierten Element. Immer mit Rueckfall ueber `@supports not`.

## Tiefe auf dunklem Grund

Schwarze Schatten sind auf schwarzem Grund fast unsichtbar. Tiefe entsteht
in dieser Rangfolge: **Flaechenstufe** zuerst, dann das **Kantenlicht**
(`inset 0 1px 0 rgba(255,255,255,.06)`), erst zuletzt ein weicher Schatten.

Dieses eine Pixel Kantenlicht ist der groesste sichtbare Unterschied
zwischen einer flachen und einer hochwertigen dunklen Oberflaeche. Kein
farbiger Schein um Elemente.

## Diagramme

Serienfarben in fester Reihenfolge, nie zyklisch. Serienfarben sind niemals
Textfarbe — Beschriftungen tragen Schrifttoken, die Zugehoerigkeit macht ein
farbiges Plaettchen. Achsen und Raster bleiben zurueckhaltend (`--ink-3`,
Rasterlinien in `--border`). Nie zwei Werteachsen in einem Diagramm.

Aendert jemand die Serienfarben, werden sie neu gegen Farbfehlsichtigkeit
geprueft. Augenmass genuegt dafuer nicht.

## Aufraeumen einer gewachsenen Oberflaeche

Reihenfolge, die am wenigsten kaputtmacht:

1. Token anlegen und Rohwerte ersetzen — rein mechanisch, kein Aussehen aendert sich
2. Doppelte Komponenten zusammenfuehren
3. Abstaende und Radien auf die Skala ziehen
4. Zustaende vervollstaendigen
5. Erst danach Verlaeufe, Glas und Tiefe auftragen

Wer mit Schritt 5 anfaengt, traegt Hochglanz auf eine uneinheitliche
Oberflaeche und macht die Unruhe sichtbarer, nicht kleiner.
