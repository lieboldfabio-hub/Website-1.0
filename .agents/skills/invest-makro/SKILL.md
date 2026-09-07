---
name: invest-makro
description: |
  Makroanalyse und Wirtschaftskalender fuer den Investment-Agenten. Zinsen,
  Zinskurve, Inflation, Arbeitsmarkt, Kredit- und Liquiditaetslage,
  Branchenzyklen und Waehrungen einordnen, Termine der naechsten Wochen
  auswerten, aktuelle Lage gegen 30 Jahre Historie und fruehere Regime
  stellen. Fuer Fragen nach Zinsen, Rezession, Inflation, EZB, Fed, Konjunktur.
triggers:
  - "zinsen"
  - "inflation"
  - "rezession"
  - "wirtschaftskalender"
  - "fed ezb"
  - "konjunkturdaten"
  - "makro"
---

# invest-makro — Umfeld, Zyklus, Kalender

Makro erklaert selten, welchen Titel man kauft. Es erklaert sehr oft, **wie
viel Risiko man insgesamt traegt** und **welche Renditequellen gerade
funktionieren**.

## 1. Der Diskontsatz zuerst

Zinsen sind der Preis, mit dem jede zukuenftige Zahlung abgezinst wird. Sie
wirken damit auf **jeden** Vermoegenspreis.

- **Leitzins und Markterwartung** (was ist bereits eingepreist?) — die
  Ueberraschung bewegt den Markt, nicht das Niveau
- **Zinskurve**: Steilheit, Inversion, Versteilerung nach Inversion. Die
  Inversion ist ein Fruehindikator mit langer und schwankender Vorlaufzeit —
  taugt zur Risikodosierung, nicht zum Timing
- **Realzinsen** (nominal minus erwartete Inflation): entscheidend fuer
  Gold, lange Anleihen und hoch bewertete Wachstumstitel
- **Kreditaufschlaege**: Ausweitung bei Unternehmensanleihen ist oft das
  ehrlichste Fruehwarnsignal, weil Kreditmaerkte weniger Geschichten glauben

## 2. Konjunkturdaten richtig lesen

Drei Fehler, die fast alle machen:

1. **Niveau statt Ueberraschung.** Bewegt wird der Markt von der Abweichung
   gegenueber dem Konsens, nicht vom absoluten Wert.
2. **Erstmeldung statt Revision.** Arbeitsmarkt- und BIP-Zahlen werden
   teils erheblich revidiert. Fuer historische Vergleiche Vintage-Daten
   nutzen (`invest-daten`).
3. **Nachlaufend statt vorlaufend.** Arbeitslosigkeit und Gewinne laufen
   nach. Vorlaufend sind Einkaufsmanagerindizes, Auftragseingaenge,
   Kreditvergabestandards, Bautaetigkeit, Frachtraten, Erstantraege.

Kernreihen: Inflation (Gesamt und Kern), Arbeitsmarkt, Einkaufsmanager-
indizes, Einzelhandel, Industrieproduktion, Kreditvergabe, Geldmenge,
Bautaetigkeit, Verbrauchervertrauen.

## 3. Zyklus verorten

| Phase | Merkmale | Historisch relativ stark |
|-------|----------|--------------------------|
| Fruehaufschwung | Zinsen niedrig, Daten drehen hoch, Kredit lockert | zyklischer Konsum, Industrie, Small Caps |
| Spaetaufschwung | Kapazitaeten voll, Inflation steigt, Zinsen steigen | Energie, Rohstoffe, Substanzwerte |
| Abschwung | Daten fallen, Gewinne werden gesenkt | defensiver Konsum, Versorger, Gesundheit |
| Rezession | Kredit knapp, Arbeitsmarkt kippt | lange Staatsanleihen, Kasse, Qualitaet |

**Wichtig:** Das sind historische Tendenzen ueber viele Zyklen, keine
Regeln. Jeder Zyklus hat eine eigene Ursache — 2000 (Bewertung), 2008
(Kredit), 2020 (exogener Schock), 2022 (Inflation und Zinsschock) verliefen
grundverschieden. Wer Muster mechanisch anwendet, kaempft den letzten Krieg.

## 4. Liquiditaet des Systems

Oft wirksamer als jede Konjunkturzahl: Notenbankbilanz, Ueberschussreserven,
Repo-Saetze, Emissionsvolumen des Staates, Kreditschoepfung der
Geschaeftsbanken. Steigende Systemliquiditaet hebt tendenziell alle
Risikoanlagen, sinkende trifft zuerst das Schwaechste (unprofitable
Wachstumswerte, illiquide Nischen, Krypto).

## 5. Waehrungen

Jede Auslandsposition ist zugleich eine Waehrungsposition. Immer angeben, in
welcher Waehrung die Rendite gerechnet wird. Treiber: Zinsdifferenz,
Leistungsbilanz, Kapitalstroeme, Risikoneigung. Absicherung kostet ungefaehr
die Zinsdifferenz — sie ist kein Gratisschutz.

## 6. Wirtschaftskalender

Feste Routine fuer die naechsten 30 Tage:

| Kategorie | Beispiele |
|-----------|-----------|
| Notenbanken | Zinsentscheid, Protokolle, Anhoerungen, Projektionen |
| Inflation | Verbraucherpreise, Erzeugerpreise, Lohnkosten |
| Arbeitsmarkt | Monatsbericht, Erstantraege, offene Stellen |
| Wachstum | BIP, Einkaufsmanagerindizes, Auftragseingaenge |
| Unternehmen | Quartalszahlen, Kapitalmarkttage, Dividendentermine |
| Struktur | Optionsverfall, Index-Rebalancing, Emissionstermine |
| Politik | Wahlen, Haushalt, Zoelle, Regulierung |

Zu jedem relevanten Termin notieren: **Konsenserwartung**, **was bereits
eingepreist scheint**, **wie stark die Position darauf reagiert**. Vor
Terminen mit hohem Ueberraschungspotenzial ist Risikoreduktion oft die
bessere Entscheidung als eine Richtungswette.

## 7. 30-Jahres-Vergleich richtig ziehen

Die nuetzliche Frage lautet nicht "wann war es zuletzt so?", sondern:

1. Welche **Bedingungen** herrschten damals (Zinsniveau, Bewertung,
   Verschuldung, Inflation, Demografie, Regulierung)?
2. Welche dieser Bedingungen gelten heute — und welche nicht?
3. Wie viele **unabhaengige** Faelle gibt es wirklich? Vier Rezessionen in
   30 Jahren sind vier Datenpunkte, keine Statistik.

Historische Analogien liefern Bandbreiten und Vorstellungskraft, keine
Prognosen. Im Dossier so kennzeichnen und die Konfidenz nicht auf einer
Analogie aufbauen.

## Uebersetzung ins Depot

Makro steuert vor allem **die Gesamtrisikohoehe**, die Gewichtung zwischen
Anlageklassen und die Waehrungsverteilung — nicht die Einzeltitelwahl.
Uebergabe an `invest-portfolio` und `invest-risiko`.
