---
name: ui-barrierefrei
description: |
  Barrierefreiheit der Oberflaeche: Kontraste rechnen statt schaetzen,
  Tastaturbedienung, sichtbarer Fokus, Bedeutung nie allein ueber Farbe,
  sinnvolle Beschriftungen und Struktur. Besonders wichtig auf dunklem Grund
  mit Verlaeufen, wo Kontraste truegen.
triggers:
  - "kontrast"
  - "barrierefrei"
  - "accessibility"
  - "tastatur"
  - "screenreader"
  - "farbenblind"
---

# ui-barrierefrei — gerechnet, nicht geschaetzt

Auf dunklem Grund mit Verlaeufen taeuscht das Auge besonders stark. Helle
Schrift auf dunklem Grund wirkt kontrastreicher, als sie ist. Deshalb gilt
hier ausnahmslos: **rechnen**.

## Kontrast

| Inhalt | Mindestwert |
|--------|-------------|
| Fliesstext und Zahlen | 4,5:1 |
| Grosser Text ab 24 px oder 19 px fett | 3:1 |
| Bedienelemente, Kanten, Symbole | 3:1 |
| Diagrammobjekte gegen die Flaeche | 3:1 |

Die Token aus `DESIGN-SYSTEM.md` sind geprueft: Primaertext 17,2:1,
Sekundaertext 9,9:1, gedaempfter Text 6,0:1, Akzent 6,4:1 — jeweils auf der
Kartenflaeche.

**Auf Verlaeufen** wird gegen **beide Enden** einzeln gerechnet, nicht gegen
die Mitte. Ein Text, der oben 6:1 erreicht und unten 3,2:1, ist durchgefallen.

**Auf Glas** wird gegen die deckende Grundfarbe gerechnet, nicht gegen das
weichgezeichnete Bild dahinter — denn der Browser darf die Weichzeichnung
verweigern. Deshalb ist die Grundfarbe mindestens 85 % deckend.

## Farbe ist nie der alleinige Traeger

In dieser App besonders relevant:

- **Kursrichtung**: immer Vorzeichen und Pfeil zusaetzlich zur Farbe
  (`▲ +1,24 %`), nie nur gruen oder rot
- **Signale**: immer das Wort („Kaufen", „Kein Signal"), nie nur eine Farbe
  oder ein Punkt
- **Konfidenz**: beschrifteter Balken, nicht nur eine Ampelfarbe
- **Warnungen**: Symbol und Text, nicht nur ein farbiger Rahmen
- **Diagrammserien**: ab zwei Serien immer eine Legende, bis zu vier Serien
  zusaetzlich direkt beschriftet

Rot-Gruen-Schwaeche betrifft etwa jeden zwoelften Mann. In einer Anwendung,
in der Rot und Gruen „Verlust" und „Gewinn" bedeuten, ist Farbe allein
fahrlaessig.

## Tastatur

- Jede Funktion ist ohne Maus erreichbar
- Die Fokusreihenfolge folgt der sichtbaren Anordnung
- Fokus ist immer sichtbar: `outline: 2px solid var(--accent); outline-offset: 2px`.
  `outline: none` ohne gleichwertigen Ersatz ist ein blockierender Befund.
- Dialoge fangen den Fokus, geben ihn beim Schliessen an den ausloesenden
  Knopf zurueck, und `Escape` schliesst sie
- Popover, auch die Beleg-Chips, sind per Tastatur zu oeffnen und zu schliessen
- Sprungmarke zum Hauptinhalt am Seitenanfang

## Struktur und Beschriftung

- Eine `h1` je Ansicht, Ueberschriftenebenen ohne Luecken
- Bedienelemente ohne sichtbaren Text bekommen eine Beschriftung
- Tabellen mit echten Kopfzellen und Zuordnung
- Dynamische Meldungen (Analyse fertig, Warnung ausgeloest) werden angesagt
- Datenstaende und Zeitangaben in einer maschinenlesbaren Form hinterlegen
- Sprache der Seite ist ausgezeichnet

## Zahlen und Sprache

- Deutsche Schreibweise durchgehend: `1.234,56 €`, `07.09.2026`
- Prozentwerte mit Vorzeichen bei Veraenderungen
- Abkuerzungen ausschreiben oder erklaeren
- Fehlermeldungen sagen, was zu tun ist

## Pruefung

1. Alle Kontraste rechnen — auch die auf Verlaeufen und Glas
2. Die App einmal komplett nur mit der Tastatur bedienen
3. Eine Ansicht in Graustufen ansehen: ist noch alles verstaendlich?
4. Textgroesse auf 200 % stellen
5. Reduzierte Bewegung einschalten und pruefen, ob nichts verlorengeht

Punkt 3 ist der schnellste Test der ganzen Liste und findet zuverlaessig
jede Stelle, an der Farbe allein Bedeutung traegt.
