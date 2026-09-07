---
name: invest-daten
description: |
  Datenbeschaffung und Datenqualitaet fuer Investmentanalysen. Kursdaten,
  Jahresabschluesse, Makroreihen und Kalenderdaten bis 30 Jahre zurueck
  besorgen, bereinigen und pruefen. Deckt Point-in-Time-Daten, Corporate
  Actions, Waehrungen, Revisionen und die Belegpflicht ab. Laden, bevor
  irgendeine Zahl in eine Analyse eingeht.
triggers:
  - "kursdaten"
  - "historische daten"
  - "finanzdaten besorgen"
  - "30 jahre historie"
  - "datenqualitaet"
---

# invest-daten — Beschaffung und Pruefung

Falsche Daten erzeugen selbstsicher falsche Analysen. Dieser Skill steht vor
allen anderen.

## Eiserne Regel

> Keine Zahl ohne Quelle, Zeitraum und Abrufdatum. Was nicht belegbar ist,
> heisst "unbekannt" — nie eine plausibel klingende Schaetzung.

Erinnerungswissen ueber Kurse, Kennzahlen oder Termine ist **keine Quelle**.
Modelle haben einen Wissensstichtag und Kurse aendern sich taeglich. Wenn
kein Live-Zugriff moeglich ist, wird das im Dossier ausgewiesen und die
Konfidenz gesenkt.

## Welche Daten fuer welche Frage

| Frage | Notwendige Daten | Mindesthistorie |
|-------|------------------|-----------------|
| Langfristiges Investment | Jahresabschluesse, Cashflow, Kapitalstruktur, Kapitalallokation | 10–30 Jahre |
| Bewertungseinordnung | eigene Bewertungshistorie, Peer-Bewertung | 10–20 Jahre |
| Zyklusposition | Umsatz-/Margenreihe ueber mehrere Rezessionen | mind. 2 volle Zyklen |
| Mittelfristige Positionierung | Kurse, Volumen, Volatilitaet, Zinsen | 3–10 Jahre |
| Kurzfristiger Trade | Tages-/Intradaykurse, Spread, Volumen, Termine | Wochen bis Monate |
| Makro-Regimevergleich | BIP, Inflation, Zinsen, Arbeitsmarkt, Kredit | 30 Jahre und mehr |

Ein Urteil ueber ein Geschaeftsmodell, das nur den Aufschwung seit der
letzten Krise gesehen hat, ist kein Urteil, sondern eine Extrapolation.

## Quellen

Rangfolge und Belegpflicht: siehe `invest-agent/referenzen/datenquellen.md`.

Frei verfuegbare Anlaufstellen fuer lange Reihen:

- **Makro**: FRED und ALFRED (Vintage-Daten), EZB Data Portal, Bundesbank
  Zeitreihen, Destatis, Eurostat, OECD, IWF, Weltbank
- **Unternehmen**: SEC EDGAR (Volltextsuche ueber alle Einreichungen),
  Bundesanzeiger, Investor-Relations-Seiten mit Berichtsarchiv
- **Positionierung**: CFTC COT, 13F-Einreichungen, Stimmrechtsmeldungen
- **Energie und Rohstoffe**: EIA, IEA, USDA, LME- und CME-Veroeffentlichungen

## Fallstricke bei langen Reihen

1. **Point-in-Time vs. heutiger Stand.** Makrodaten werden revidiert. Wer
   heutige BIP-Endwerte in einen historischen Vergleich einsetzt, benutzt
   Wissen, das damals niemand hatte. Fuer Rueckvergleiche Vintage-Daten.
2. **Corporate Actions.** Splits, Reverse-Splits, Spin-offs,
   Kapitalerhoehungen, Fusionen. Unbereinigte Kursreihen zeigen Spruenge,
   die nie stattgefunden haben.
3. **Bilanzierungswechsel.** HGB → IFRS, IFRS 16 (Leasing ab 2019 in der
   Bilanz), geaenderte Segmentberichte. Verschuldungsquoten sind ueber
   solche Brueche hinweg nicht direkt vergleichbar.
4. **Waehrung.** DM-/Euro-Bruch, Fremdwaehrungsrenditen. Immer angeben, in
   welcher Waehrung gerechnet wird. Die Rendite eines US-Titels in EUR ist
   eine andere Zahl.
5. **Inflation.** Ueber 30 Jahre ist nominal und real ein grosser
   Unterschied. Fuer lange Vergleiche real rechnen und den Deflator nennen.
6. **Ueberlebensverzerrung.** Indexreihen und Branchendurchschnitte aus
   heutigen Mitgliedern blenden alle Pleiten aus und sehen zu gut aus.
7. **Definitionswechsel.** "Bereinigter Gewinn", "EBITDA vor
   Sondereffekten", "Nutzerzahl" — Unternehmen aendern Definitionen. Bei
   Bruechen in der Reihe im Bericht nachschlagen, nicht glaetten.
8. **Feiertage und Handelszeiten.** Luecken in Tagesreihen sind normal;
   Nullwerte statt Luecken sind ein Datenfehler.
9. **Zeitzonen.** Schlusskurse, Meldungszeitpunkte und Kalendertermine
   immer mit Zeitzone.

## Pruefroutine bei jedem Datensatz

- Beginn, Ende und Frequenz der Reihe pruefen
- Luecken zaehlen; Luecken in Krisenzeiten sind besonders verdaechtig
- Extremwerte einzeln pruefen: echter Marktbruch oder Datenfehler?
- Zwei unabhaengige Quellen fuer die wichtigste Kennzahl vergleichen
- Groessenordnung gegen den gesunden Menschenverstand pruefen
  (Umsatz je Mitarbeiter, Marge, Bewertung relativ zur eigenen Historie)

## Ablage

Reihen lokal mit Abrufdatum speichern und beim naechsten Lauf auf Revisionen
pruefen. So bleibt jede alte Analyse nachvollziehbar — das ist die
Voraussetzung fuer die Kalibrierungsauswertung in `invest-kalibrierung`.
