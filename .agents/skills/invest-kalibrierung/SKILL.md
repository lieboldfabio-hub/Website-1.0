---
name: invest-kalibrierung
description: |
  Protokoll, Kalibrierung und Selbstkorrektur des Investment-Agenten. Jede
  Entscheidung mit Wahrscheinlichkeit erfassen, spaeter gegen das Ergebnis
  auswerten, Brier-Score und Trefferquote messen, Fehlerarten klassifizieren
  und die eigene Sicherheit nachjustieren. Das ist der Mechanismus, durch den
  der Agent ueber die Zeit tatsaechlich besser wird.
triggers:
  - "track record"
  - "wie gut lag ich"
  - "auswertung entscheidungen"
  - "journal"
  - "kalibrierung"
  - "post mortem"
---

# invest-kalibrierung — Messen statt behaupten

Ein Agent, der nie ueberprueft wird, verbessert sich nicht — er wird nur
selbstsicherer. Dieser Skill ist die Antwort auf den Wunsch nach einem
Berater, der "so gut wie nie falsch liegt": **Unfehlbarkeit ist nicht
erreichbar, Kalibrierung schon.**

## Was Kalibrierung heisst

Wenn der Agent hundertmal "70 % Wahrscheinlichkeit" sagt, sollte das
Ereignis in ungefaehr 70 Faellen eintreten. Ein kalibrierter Agent, der in
40 % der Faelle richtig liegt und das weiss, ist brauchbar. Ein Agent, der
angeblich zu 90 % richtig liegt und es nicht misst, ist gefaehrlich.

## Protokollpflicht

Jede Entscheidung, jedes Signal und jede explizite Nichtentscheidung wird
beim Entstehen erfasst — nicht nachtraeglich.

| Feld | Inhalt |
|------|--------|
| Datum, Uhrzeit | Zeitpunkt der Entscheidung |
| Titel, Horizont | was, ueber welchen Zeitraum |
| Signal | Kaufen / Halten / Verkaufen / Kein Signal |
| Wahrscheinlichkeit | die genannte Zahl, in 5-%-Schritten |
| Konfidenz | niedrig / mittel / hoch |
| These | drei Saetze |
| Tragende Annahme | die eine Annahme, die das Szenario haelt |
| Invalidierung | konkrete Bedingung |
| Erwartungswert | gerechnet, nach Kosten |
| Positionsgroesse | % des Depots und Risiko in Waehrung |
| Datenstand | Quellen und Abrufzeitpunkt |
| Gegenargument | das staerkste, das damals bekannt war |
| Ueberpruefungstermin | Datum |

Ablage als JSON oder CSV, eine Zeile je Entscheidung, versionierbar. Das
Protokoll wird **nie rueckwirkend geaendert**. Korrekturen kommen als neue
Zeile mit Bezug auf die alte.

## Auswertung

Zum Ueberpruefungstermin und quartalsweise gesamt:

- **Brier-Score**: Mittel von (Wahrscheinlichkeit − Ergebnis)², wobei
  Ergebnis 1 oder 0 ist. Niedriger ist besser. Der Vergleichsmassstab ist
  die Basisrate — wer sie nicht schlaegt, hat keinen Vorteil.
- **Kalibrierungskurve**: alle Aussagen nach genannter Wahrscheinlichkeit
  gruppieren und die tatsaechliche Trefferquote je Gruppe berechnen.
  Systematisch zu hohe Werte bedeuten Ueberkonfidenz — die genannten Zahlen
  werden dann dauerhaft nach unten korrigiert.
- **Trefferquote getrennt nach Konfidenzstufe.** Wenn "hoch" nicht besser
  trifft als "mittel", ist die Konfidenzbewertung wertlos und muss neu
  definiert werden.
- **Gewinn-Verlust-Verhaeltnis**, nicht nur Trefferquote.
- **Vergleich gegen die faule Alternative**: breiter Index, Halten, Nichts
  tun. Eine Strategie, die den Index nach Kosten und Steuern nicht schlaegt,
  ist gescheitert — auch wenn sie Gewinn gemacht hat.

## Fehlerklassifikation

Bei jeder abgeschlossenen Position eintragen:

| Klasse | Bedeutung | Konsequenz |
|--------|-----------|------------|
| Guter Prozess, gutes Ergebnis | verdient | Vorgehen beibehalten |
| Guter Prozess, schlechtes Ergebnis | Pech | **nichts aendern** |
| Schlechter Prozess, gutes Ergebnis | Glueck | gefaehrlichster Fall, Regel schaerfen |
| Schlechter Prozess, schlechtes Ergebnis | Fehler | Ursache abstellen |

**Die wichtigste Trennung ueberhaupt.** Wer Prozesse nach Ergebnissen
bewertet, lernt Zufall statt Koennen. Der dritte Fall wird am haeufigsten
uebersehen und richtet den groessten langfristigen Schaden an.

Zusaetzlich Fehlerursache erfassen: Datenfehler, Analysefehler,
Groessenfehler, Timingfehler, Disziplinfehler, Kostenfehler. Nach 20–30
Eintraegen zeigt die Verteilung, wo tatsaechlich Verbesserung ansetzt — sie
liegt fast nie dort, wo man sie vermutet.

## Post-Mortem und Pre-Mortem

- **Pre-Mortem beim Einstieg**: "Es ist ein Jahr spaeter, die Position steht
  60 % im Minus. Was ist passiert?" Die Antworten sind die
  Invalidierungskriterien.
- **Post-Mortem beim Ausstieg**: Was war im Nachhinein erkennbar, was nicht?
  Nur das Erkennbare ist ein Lernpunkt; alles andere ist Rueckschaufehler.

## Rueckkopplung in den Agenten

Die Auswertung ist kein Bericht, sondern aendert das Verhalten:

- Ueberkonfidenz nachgewiesen → genannte Wahrscheinlichkeiten senken
- Eine Titelklasse trifft dauerhaft schlecht → als ausserhalb des
  Kompetenzkreises markieren und dort kein Signal mehr geben
- Timingfehler dominieren → kurzfristige Signale reduzieren oder einstellen
- Kostenfehler dominieren → Umschlagshaeufigkeit senken
- Zu viele Entscheidungen, zu wenig Vorteil je Entscheidung → Huerde anheben

## Mindestmenge

Unter etwa 30 abgeschlossenen, unabhaengigen Entscheidungen ist keine
Aussage ueber die eigene Qualitaet moeglich. Bis dahin gilt die Basisrate:
Die deutliche Mehrheit aktiver Anleger schlaegt den Index nicht. Der Agent
behauptet in dieser Phase keinen Vorteil und sagt das dem Nutzer.
