---
name: invest-signal
description: |
  Entscheidungsrahmen des Investment-Agenten. Fuehrt Fundamental-, Technik-,
  Makro- und Nachrichtenbefunde zu einem Kauf-, Halte- oder Verkaufssignal
  zusammen, mit Wahrscheinlichkeit, Erwartungswert, Konfidenz, Zeithorizont
  und Invalidierungskriterium. Regelt, wann bewusst kein Signal gegeben wird.
triggers:
  - "kaufen oder verkaufen"
  - "signal"
  - "entscheidung treffen"
  - "erwartungswert"
  - "kursziel"
---

# invest-signal — Von Befunden zur Entscheidung

Dieser Skill verhindert den haeufigsten Fehler von Analyse-Agenten: aus
vielen interessanten Beobachtungen eine selbstsichere Richtungsaussage zu
machen.

## Grundsatz

> Ein Signal ist keine Prognose. Ein Signal ist eine **Wette mit positivem
> Erwartungswert nach Kosten**, verbunden mit einer Groesse und einer
> Abbruchbedingung.

Ohne positiven Erwartungswert nach Spread, Gebuehren und Steuern gibt es
kein Kaufsignal — egal wie ueberzeugend die Geschichte ist.

## Schritt 1: Vier Ebenen getrennt bewerten

Jede Ebene bekommt unabhaengig ein Urteil, **bevor** sie zusammengefuehrt
werden. Sonst faerbt die zuerst gebildete Meinung alle weiteren.

| Ebene | Urteil | Quelle |
|-------|--------|--------|
| Bewertung und Geschaeftsqualitaet | negativ / neutral / positiv | `invest-fundamental` |
| Marktstruktur und Trend | negativ / neutral / positiv | `invest-technik` |
| Makro und Zyklus | negativ / neutral / positiv | `invest-makro` |
| Nachrichten und Katalysatoren | negativ / neutral / positiv | `invest-news` |

## Schritt 2: Widersprueche auswerten, nicht mitteln

**Widersprueche sind Information, kein Rauschen.** Nie zu einer
Durchschnittsnote verrechnen.

| Konstellation | Lesart | Typische Konsequenz |
|---------------|--------|---------------------|
| Alle vier positiv | Konsens, wahrscheinlich schon eingepreist | kleinere Position, Konfidenz mittel |
| Fundamental positiv, Technik negativ | frueh dran | gestaffelt einsteigen, langer Horizont |
| Fundamental negativ, Technik positiv | Momentum ohne Substanz | nur kurzfristig, enge Invalidierung |
| Makro negativ, Rest positiv | Gesamtrisiko senken | Position kleiner, nicht streichen |
| Ebenen widersprechen sich stark | ehrliches Unwissen | **kein Signal** |

## Schritt 3: Wahrscheinlichkeit und Erwartungswert

Szenarien mit Wahrscheinlichkeiten (Summe 100 %) und Kurszielen bilden:

```
Erwartungswert = Σ (Wahrscheinlichkeit_i × Rendite_i) − Kosten − Steuern
```

Regeln:

- Wahrscheinlichkeiten in Schritten von 5 %. Feiner ist Scheingenauigkeit.
- Basisraten zuerst: Wie oft geht so etwas *im Allgemeinen* gut? Erst danach
  die Besonderheiten der Situation einrechnen.
- Selten Werte ueber 80 % oder unter 20 % vergeben. Wer haeufig 90 % sagt,
  ist fast immer nur schlecht kalibriert.
- Chance-Risiko-Verhaeltnis getrennt ausweisen: Weg bis zum Ziel gegen Weg
  bis zur Invalidierung.

## Schritt 4: Signal je Horizont

Getrennte Aussagen, nie eine gemischte:

- **Kurzfristig** (Tage bis Wochen): getrieben von Technik, Positionierung,
  Terminen. Kleine Positionen, enge Invalidierung, Kosten dominieren.
- **Mittelfristig** (3–18 Monate): Zyklus, Gewinnrevisionen, Bewertung
  gegenueber der eigenen Historie.
- **Langfristig** (3+ Jahre): Geschaeftsqualitaet, Kapitalallokation,
  Wiederanlagerendite. Technik ist hier fast bedeutungslos.

Derselbe Titel darf gleichzeitig "langfristig kaufen" und "kurzfristig
abwarten" sein. Das ist kein Widerspruch, sondern Praezision.

## Schritt 5: Konfidenz

| Stufe | Bedingung |
|-------|-----------|
| hoch | Datenlage vollstaendig, mehrere unabhaengige Ebenen zeigen dasselbe, Basisrate stuetzt |
| mittel | eine wesentliche Datenluecke oder ein Widerspruch |
| niedrig | Ebenen widersprechen sich, Daten alt oder unvollstaendig, Analogie statt Beleg |

Konfidenz steuert die Positionsgroesse in `invest-risiko`. Sie ist keine
Hoeflichkeitsfloskel, sondern eine Zahl mit Folgen.

## Schritt 6: Invalidierung

Ohne diesen Punkt kein Signal. Zulaessig sind nur ueberpruefbare Formen:

- **Kursbasiert**: "Wochenschluss unter X"
- **Kennzahlbasiert**: "freier Cashflow zwei Quartale in Folge negativ",
  "Bruttomarge unter Y"
- **Ereignisbasiert**: "Zulassung abgelehnt", "Grosskunde kuendigt"
- **Zeitbasiert**: "wenn bis Datum Z keine Bestaetigung, Position beenden"

Unzulaessig: "wenn sich die Lage verschlechtert".

## Wann bewusst kein Signal

**"Kein Signal" ist die haeufigste richtige Antwort.** Verpflichtend bei:

- Erwartungswert nach Kosten nahe null oder negativ
- Widerspruechlicher Datenlage ohne klaren Vorrang
- Fehlenden oder veralteten Kerndaten
- Titeln ausserhalb des Kompetenzkreises
- Reiner Geschichte ohne pruefbare Zahlen
- Emotional aufgeladenen Situationen kurz nach einem Kurssprung

Nie eine Richtung erfinden, weil eine Frage gestellt wurde. Der
Rechtfertigungsdruck, "etwas zu liefern", ist die teuerste Eigenschaft eines
Beraters.

## Verkaufssignale — eigene Logik

Verkaufen ist nicht die Umkehrung von Kaufen. Gueltige Verkaufsgruende:

1. **These erfuellt** — der Grund fuer den Kauf ist eingetreten
2. **These widerlegt** — Invalidierungskriterium erreicht
3. **These veraltet** — die urspruengliche Begruendung gilt nicht mehr
4. **Bessere Verwendung** — klar hoeherer Erwartungswert anderswo
5. **Risikoregel** — Position zu gross geworden, Klumpenrisiko, Rebalancing

Ungueltige Gruende: Buchgewinn "sichern" wollen, Einstandskurs erreicht,
Langeweile, Kursziel eines Dritten. **Der Einstandskurs ist dem Markt egal
und darf in keiner Entscheidung vorkommen.**

## Ausgabe

Immer im Dossier-Format aus `invest-agent/referenzen/ausgabeformat.md`, und
immer mit dem staerksten Gegenargument. Danach Uebergabe an
`invest-risiko` (Groesse) und `invest-kalibrierung` (Protokoll).
