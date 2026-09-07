---
name: ui-responsive
description: |
  Verhalten der Oberflaeche ueber Bildschirmgroessen und Eingabearten hinweg:
  Haltepunkte, dichte Tabellen auf kleinen Geraeten, Zielgroessen fuer
  Beruehrung, Diagramme im Hochformat, Overlays auf Mobilgeraeten. Sorgt
  dafuer, dass die App auf jedem Geraet vollstaendig bedienbar bleibt.
triggers:
  - "responsive"
  - "mobil"
  - "handy ansicht"
  - "tablet"
  - "breakpoints"
---

# ui-responsive — vollstaendig auf jedem Geraet

Grundhaltung: Auf kleinen Bildschirmen wird **umgeordnet**, nicht
weggelassen. Eine Funktion, die auf dem Telefon fehlt, ist verloren — und
das verstoesst gegen die Grundregel des Oberflaechen-Agenten.

## Haltepunkte

| Name | Ab | Layout |
|------|----|--------|
| klein | 0 | eine Spalte, Navigation unten oder in einer Schublade |
| mittel | 768 px | zwei Spalten, Navigation seitlich einklappbar |
| gross | 1280 px | volle Aufteilung, Navigation dauerhaft sichtbar |
| sehr gross | 1600 px | Inhaltsbreite begrenzen, nicht endlos dehnen |

Auf sehr breiten Bildschirmen wird die Lesebreite begrenzt. Eine Tabelle, die
sich ueber 2000 px zieht, ist schlechter lesbar, nicht besser.

## Dichte Tabellen auf kleinen Geraeten

Der schwierigste Teil dieser App. Drei zulaessige Loesungen, in dieser
Rangfolge:

1. **Spalten nach Wichtigkeit ausblenden** und ueber ein Aufklappen je Zeile
   zugaenglich halten. Nichts geht verloren, es ist nur eine Ebene tiefer.
2. **Zeile zu Karte** umbauen: Bezeichnung links, Wert rechts, wichtigste
   drei Werte sichtbar, Rest aufklappbar.
3. **Waagerecht scrollen** mit klebender erster Spalte — nur, wenn der
   Zusammenhang zwischen den Spalten zwingend ist.

Nie: Spalten ersatzlos streichen. Nie: Schrift so weit verkleinern, dass sie
passt.

## Beruehrung

- Zielgroesse mindestens 44 x 44 px, auch wenn das sichtbare Element kleiner
  aussieht
- Mindestens 8 px Abstand zwischen benachbarten Zielen
- Beleg-Chips sind auf kleinen Geraeten schwer zu treffen: Trefferflaeche
  vergroessern, ohne die Zeilenhoehe zu aendern
- Hover-Zustaende nur unter `@media (hover: hover) and (pointer: fine)`
- Wichtige Bedienelemente in Daumenreichweite, nicht am oberen Rand

## Diagramme

- Im Hochformat weniger Achsenbeschriftungen, aber nie ohne Einheit
- Mindesthoehe festlegen; ein 80 px hohes Diagramm ist keine Information
- Direktbeschriftung im Hochformat oft besser als eine Legende
- Zeitachse zusammenfassen statt Punkte quetschen

## Overlays

Auf kleinen Geraeten werden Dialoge und Popover zu Schubladen von unten. Sie
bekommen einen sichtbaren Schliessen-Knopf — Wegwischen allein reicht nicht,
weil es nicht entdeckbar ist.

## Pruefung

Jede Ansicht bei 360, 768, 1280 und 1600 px Breite ansehen, dazu einmal im
Querformat auf kleinem Geraet. Zusaetzlich: Textgroesse im Browser auf 200 %
stellen — die Oberflaeche muss lesbar und bedienbar bleiben, ohne dass
Inhalte abgeschnitten werden.

Achten auf: waagerechtes Scrollen der ganzen Seite (immer ein Fehler),
ueberlappende Elemente, abgeschnittene Zahlen, unerreichbare Bedienelemente,
Tabellen, die aus dem Bildschirm laufen.
