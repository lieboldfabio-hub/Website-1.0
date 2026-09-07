---
name: invest-portfolio
description: |
  Portfolioaufbau fuer den Investment-Agenten. Anlageziele und Horizonte
  festlegen, Aufteilung ueber Anlageklassen, Regionen, Waehrungen und
  Renditequellen, Kern-Satellit-Struktur, Faktoren, Rebalancing,
  Klumpenrisiko und Trennung von Langfristdepot und Handelskapital.
  Fuer Fragen nach Depotaufbau, Aufteilung, Diversifikation, Umschichtung.
triggers:
  - "depot aufbauen"
  - "asset allocation"
  - "aufteilung"
  - "diversifikation"
  - "rebalancing"
  - "etf oder einzelaktien"
---

# invest-portfolio — Struktur vor Einzelidee

Die Aufteilung erklaert langfristig den weitaus groessten Teil des
Ergebnisses und der Schwankung. Einzeltitelauswahl ist die Feinarbeit
danach, nicht davor.

## 1. Zuerst der Zweck

Ohne diese Angaben ist jede Aufteilung geraten:

- **Wofuer** ist das Geld und **wann** wird es gebraucht?
- Wie viel Rueckschlag ist finanziell und psychisch tragbar?
- Laufende Sparrate oder Entnahme?
- Bestehende Vermoegenswerte: Immobilie, Betriebsvermoegen, Rentenanspruch
- **Humankapital**: Beruf, Branche, Arbeitsplatzsicherheit — das ist die
  groesste Position der meisten Menschen und korreliert oft mit dem Depot

Geld, das in unter drei Jahren gebraucht wird, gehoert nicht in
schwankende Anlagen. Diese Aussage wird nicht relativiert.

## 2. Drei Toepfe strikt trennen

| Topf | Zweck | Regel |
|------|-------|-------|
| Reserve | Notfaelle, 3–6 Monatsausgaben | ausserhalb des Depots, nie investiert |
| Kern | langfristiger Vermoegensaufbau | breit, kostenguenstig, selten angefasst |
| Satellit | Einzelideen, kurzfristige Trades | begrenzt, klar beziffert |

Der Satellit wird **vorab** gedeckelt (z. B. 10–20 % des Depots). Ohne
Deckel wandert erfahrungsgemaess der Kern in den Satelliten. Verluste im
Satelliten duerfen nie aus dem Kern nachfinanziert werden.

## 3. Renditequellen statt nur Titel diversifizieren

Zwanzig Technologieaktien sind eine Position. Echte Diversifikation heisst
Streuung ueber **Quellen**, die sich unterschiedlich verhalten:

- Aktienrisiko (breite Maerkte)
- Zinsrisiko und Duration (Staatsanleihen)
- Kreditrisiko (Unternehmensanleihen)
- Realwerte (Rohstoffe, Immobilien, Infrastruktur, inflationsindexierte Anleihen)
- Trendfolge und Momentum
- Carry
- Kasse

Zusaetzlich streuen ueber Region, Waehrung, Branche, Groesse und
Zeithorizont. Und: die Aktien-Anleihen-Korrelation ist **nicht konstant** —
2022 fielen beide gemeinsam. Eine Aufteilung, die nur ein Zinsregime
gesehen hat, ist ungetestet.

## 4. Faktoren

Substanz, Momentum, Qualitaet, Groesse, niedrige Volatilitaet sind
historisch belegte Renditequellen — mit der entscheidenden Einschraenkung,
dass jede von ihnen **jahrelang** nicht funktioniert. Wer nach drei
schlechten Jahren wechselt, erntet ausschliesslich die schlechten Phasen
aller Faktoren. Faktorwetten nur mit vorab festgelegter Mindesthaltedauer.

## 5. Kosten und Produktwahl

Der zuverlaessigste Renditehebel ueberhaupt, weil er sicher wirkt:

- **Tracking Difference statt nur TER** vergleichen — sie ist das, was
  wirklich ankommt
- Replikationsart (physisch, Sampling, Swap) und Gegenparteirisiko
- Fondsvolumen und Handelsvolumen, Spread ausserhalb der Kernzeiten
- Domizil und Ertragsverwendung — steuerlich relevant, siehe `invest-steuern-de`
- Zertifikate tragen **Emittentenrisiko**: bei Insolvenz des Emittenten ist
  das Geld weg, unabhaengig vom Basiswert. Immer explizit nennen.

## 6. Rebalancing

- **Regelbasiert**, nicht nach Gefuehl: fester Termin (jaehrlich) oder
  Bandbreite (Abweichung ueber 20 % relativ)
- Rebalancing verkauft automatisch das Gestiegene und kauft das Gefallene —
  antizyklisch, ohne Prognose
- Zu haeufiges Rebalancing kostet Gebuehren, Spread und Steuern und
  beschneidet Trends. Ein- bis zweimal im Jahr genuegt meist
- Neues Geld und Ausschuettungen zuerst zum Rebalancing nutzen — das ist die
  steuerguenstigste Variante

## 7. Klumpenrisiko pruefen

Vor jeder neuen Position gegen das Bestandsdepot pruefen: Branche, Region,
Waehrung, Faktor, Zinssensitivitaet, Lieferkette, gemeinsamer Grosskunde,
**und das eigene Berufsrisiko**.

Ein Titel mit guter Einzelbewertung kann eine schlechte Depotentscheidung
sein, wenn er nur verstaerkt, was ohnehin schon dominiert. Diese Pruefung
kann ein Kaufsignal aus `invest-signal` ueberstimmen.

## 8. Die unbequeme Einordnung

Die deutliche Mehrheit aktiver Privatanleger schlaegt einen breiten Index
langfristig nicht. Fuer viele ist die rationale Grundstruktur ein breit
gestreuter, kostenguenstiger Kern plus ein klein gehaltener Satellit — und
der Fokus auf Sparrate, Kosten und Steuern statt auf Titelauswahl.

Das gehoert zu jeder Depotberatung dazu, auch wenn es nicht die Antwort ist,
die erwartet wird. Der Agent darf diese Einordnung nicht weglassen, um
interessanter zu wirken.
