---
name: ui-performance
description: |
  Leistung und Fluessigkeit der Oberflaeche messen und verbessern: Bildrate
  beim Scrollen und Interagieren, Ladezeiten, Layoutspruenge, Kosten von
  Weichzeichnung und Schatten, Neuberechnungen in React, Diagramm- und
  Tabellenlast. Misst, statt zu vermuten.
triggers:
  - "performance"
  - "ruckelt"
  - "langsam"
  - "smoothness"
  - "ladezeit"
---

# ui-performance — messen, nicht vermuten

Gefuehlte Geschwindigkeit ist eine Messgroesse. Dieser Skill arbeitet nur mit
Zahlen.

## Budget

| Groesse | Grenze |
|---------|--------|
| Bildrate bei Interaktion und Scrollen | 60 fps, kein Einzelbild ueber 50 ms |
| Reaktion auf Eingabe (INP) | unter 200 ms |
| Groesster Inhaltsaufbau (LCP) | unter 2,0 s |
| Layoutverschiebung (CLS) | unter 0,05 |
| Gleichzeitige `backdrop-filter`-Flaechen | hoechstens 3 |
| Tabellenzeilen ohne Virtualisierung | hoechstens 100 |
| Punkte je Diagrammserie | ueber 500 vorher zusammenfassen |

Ein gerissenes Budget ist ein Stufe-4-Befund und wird behoben, nicht
wegdiskutiert.

## Messen — immer gedrosselt

Auf schneller Hardware ist alles fluessig. Aussagekraeftig wird es erst mit
Drosselung: Prozessor auf ein Viertel, Netzwerk auf langsames Mobilfunkniveau.
Was dort ruckelt, ruckelt bei echten Nutzern auch.

Vorgehen:
1. Aufzeichnung waehrend der typischen Handlung (Liste scrollen, Ansicht
   wechseln, Analyse starten, Overlay oeffnen)
2. Lange Einzelbilder suchen und ihre Ursache benennen: Layout, Malen,
   Skriptausfuehrung
3. Erst nach der Messung aendern — die Ursache liegt selten dort, wo man sie
   vermutet

## Die haeufigsten Ursachen, nach Haeufigkeit

1. **Animierte Layout-Eigenschaften.** `width`, `height`, `top`, `margin`,
   `box-shadow` in Uebergaengen. Ersetzen durch `transform` und `opacity`.
2. **Zu viel Weichzeichnung.** Jede `backdrop-filter`-Flaeche zwingt den
   Browser, den Hintergrund separat zu rastern. Drei sind das Maximum, und
   nie auf mitscrollenden Elementen.
3. **Unnoetige Neuberechnungen in React.** Neu erzeugte Objekte und Funktionen
   als Eigenschaften, fehlende Stabilisierung bei Listen, Kontext, der zu viel
   umfasst. Erst mit dem Profiler feststellen, welche Komponente wie oft
   neu rechnet, dann gezielt stabilisieren.
4. **Lange Listen ohne Virtualisierung.** Ueber 100 Zeilen wird virtualisiert.
5. **Diagramme, die bei jedem Bild neu rechnen.** Datenaufbereitung
   auslagern und zwischenspeichern; das Diagramm zeichnet nur neu, wenn sich
   die Daten aendern — nicht bei jedem Hover.
6. **Layoutspruenge.** Platzhalter ohne reservierte Hoehe, spaet geladene
   Schriften ohne `font-display: swap`, Bilder ohne Groessenangabe.
7. **Zu grosses Startbuendel.** Selten genutzte Ansichten (Backtest-Labor,
   Einstellungen) nachladen statt mitliefern.

## Layoutspruenge vermeiden

Der unangenehmste Fehler in einer Datenanwendung: eine Kennzahl laedt nach,
die Zeile wird hoeher, und der Nutzer klickt auf das Falsche.

- Platzhalter reservieren die exakte Endhoehe
- Zahlenspalten haben feste Mindestbreite, damit sie beim Aktualisieren nicht
  springen — zusammen mit `tabular-nums` bleibt die Spalte ruhig
- Banner und Warnungen bekommen ihren Platz reserviert, wenn sie erscheinen
  koennen

## Wo Aufwand sich lohnt

Nicht ueberall optimieren. Die Rangfolge in dieser App:

1. Die Watchlist-Tabelle — wird am haeufigsten benutzt und ist am dichtesten
2. Das Dossier — lang, viele Diagramme, viele Beleg-Chips
3. Ansichtswechsel — der Eindruck von Geschwindigkeit entsteht hier
4. Alles andere

## Berichten

Immer Vorher- und Nachher-Wert nennen, mit Angabe der Drosselung. „Fuehlt
sich besser an" ist kein Ergebnis. „Scrollen der Watchlist bei
Vierfach-Drosselung: laengstes Einzelbild von 180 ms auf 22 ms" ist eines.
