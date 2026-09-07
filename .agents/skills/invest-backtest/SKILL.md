---
name: invest-backtest
description: |
  Pruefung von Handels- und Anlagestrategien fuer den Investment-Agenten.
  Backtests korrekt aufsetzen, Look-ahead-, Ueberlebens- und
  Ueberanpassungsfehler vermeiden, Mehrfachtestproblem, Walk-Forward,
  Monte-Carlo, realistische Kosten und Kennzahlenbewertung. Laden, bevor
  irgendeine Aussage zu Trefferquote oder historischer Rendite gemacht wird.
triggers:
  - "backtest"
  - "strategie testen"
  - "historische rendite strategie"
  - "trefferquote"
  - "sharpe ratio"
---

# invest-backtest — Strategien pruefen, ohne sich zu belügen

Fast jeder Backtest, der im Netz kursiert, ist wertlos. Dieser Skill
existiert, damit der Agent nicht dieselben Fehler wiederholt und keine
historische Kennzahl nennt, die er nicht sauber erzeugt hat.

## Verbot

> Ohne eigenen, sauber dokumentierten Test wird **keine** Zahl zu
> Trefferquote, historischer Rendite oder Rueckschlag einer Strategie
> genannt. Uebernommene Zahlen werden als Fremdangabe mit Quelle
> gekennzeichnet und nicht als eigenes Ergebnis dargestellt.

## Die sieben toedlichen Fehler

1. **Look-ahead-Bias.** Verwendung von Informationen, die zum
   Entscheidungszeitpunkt nicht vorlagen. Klassiker: Jahresabschlusszahlen
   ab Bilanzstichtag statt ab Veroeffentlichungsdatum; revidierte
   Makrodaten statt Erstmeldung; Schlusskurs des Signaltages als
   Ausfuehrungskurs.
2. **Ueberlebensverzerrung.** Nur heute existierende Titel im Universum.
   Alle Pleiten fehlen. Ergebnis: systematisch zu gut.
3. **Ueberanpassung.** Parameter so lange drehen, bis die Kurve schoen ist.
   Je mehr Parameter, desto sicherer ist das Ergebnis Zufall.
4. **Mehrfachtestproblem.** Wer 200 Varianten testet, findet garantiert
   einige "signifikante". Anzahl **aller** getesteten Varianten offenlegen
   und die Huerde entsprechend anheben.
5. **Unterschaetzte Kosten.** Spread, Gebuehren, Slippage, Marktimpakt,
   Leihkosten, Steuern. Viele Strategien mit Vorteil vor Kosten haben keinen
   danach — besonders alle mit hoher Umschlagshaeufigkeit.
6. **Nur ein Regime getestet.** Ein Test von 2010–2021 hat fallende Zinsen
   und steigende Maerkte gesehen und sonst nichts.
7. **Kapazitaet ignoriert.** Eine Strategie in illiquiden Nebenwerten
   funktioniert mit 20.000 € und nicht mit 20 Mio. €. Umgekehrt ist genau
   das der einzige echte Vorteil kleiner Depots.

## Sauberer Aufbau

1. **Hypothese zuerst**, mit oekonomischer Begruendung. Warum sollte dieser
   Vorteil existieren, wer bezahlt ihn und warum verschwindet er nicht?
   Ohne Antwort ist es Mustersuche in Rauschen.
2. **Universum** vorab festlegen, inklusive ausgeschiedener Titel.
3. **Daten**: Point-in-Time, corporate-action-bereinigt (`invest-daten`).
4. **Regeln vollstaendig vorab**: Einstieg, Ausstieg, Groesse, Rebalancing,
   Umgang mit fehlenden Daten und Handelsaussetzungen.
5. **Ausfuehrung realistisch**: Signal am Schluss von Tag t, Ausfuehrung an
   der Eroeffnung von t+1, plus Spread und Gebuehren.
6. **Aufteilung**: Entwicklungszeitraum, unberuehrter Testzeitraum,
   Walk-Forward ueber rollende Fenster.
7. **Robustheit statt Optimum**: Ein Parameter, der nur bei genau 14
   funktioniert und bei 12 und 16 nicht, ist Zufall. Plateaus sind gut,
   Spitzen sind verdaechtig.
8. **Monte-Carlo**: Reihenfolge der Trades mischen, Ergebnisse bootstrappen.
   Die erzielte Kurve ist **ein** Pfad von vielen moeglichen — die
   Verteilung ist die eigentliche Information.

## Kennzahlen richtig lesen

| Kennzahl | Aussage | Falle |
|----------|---------|-------|
| Rendite p. a. | Ertrag | ohne Risiko bedeutungslos |
| Volatilitaet | Schwankung | unterschaetzt Sprungrisiko |
| Sharpe | Ertrag je Schwankung | **taeuscht bei schiefen Auszahlungen**, z. B. Optionsverkauf: viele kleine Gewinne, seltener grosser Verlust |
| Sortino | nur Abwaertsschwankung | dieselbe Schwaeche bei Extremen |
| Maximaler Rueckschlag | schlimmster Verlauf | hoechstens so gross wie der Testzeitraum tief war |
| Calmar / MAR | Ertrag je Rueckschlag | robuster fuer Trendstrategien |
| Trefferquote | Anteil Gewinner | **allein wertlos** ohne Gewinn-Verlust-Verhaeltnis |
| Anzahl Trades | statistische Basis | unter etwa 100 unabhaengigen Trades ist nichts belegt |

Zusaetzlich immer ausweisen: laengste Verlustphase in Monaten. Der Grund,
warum Strategien aufgegeben werden, ist fast nie die Tiefe des Rueckschlags,
sondern seine **Dauer**.

## Vor dem Echteinsatz

- Papierhandel oder Kleinstgroesse ueber einen vollstaendigen Zyklusabschnitt
- Vorab festlegen, wann die Strategie als gescheitert gilt (Rueckschlag,
  Dauer, Abweichung vom Testverhalten)
- Erwartete Bandbreite notieren, damit spaetere Ergebnisse einordbar sind
- Alle Testlaeufe archivieren — auch die verworfenen. Nur so bleibt das
  Mehrfachtestproblem sichtbar.

## Ehrliche Grundhaltung

Der wahrscheinlichste Befund eines sauberen Tests lautet: **kein belastbarer
Vorteil.** Das ist ein wertvolles Ergebnis und wird genauso berichtet wie
ein positives.
