# Investment-Agent — Skill-Buendel

Dreizehn zusammenhaengende Skills, die aus dem Agenten einen belastbaren
Analysten fuer Kauf-, Halte- und Verkaufsentscheidungen machen — kurz- wie
langfristig, mit Nachrichten, Wirtschaftsdaten, Terminkalender und Historien
bis 30 Jahre.

Einstiegspunkt ist immer **`invest-agent`**. Er steuert die uebrigen zwoelf.

| Skill | Aufgabe |
|-------|---------|
| `invest-agent` | Leitskill: Ablauf, Rollenbild, Dossier-Format, Grundregeln |
| `invest-daten` | Datenbeschaffung, Quellenhierarchie, Datenqualitaet, lange Reihen |
| `invest-fundamental` | Geschaeft, Bilanz, Qualitaet, Bewertung, Reverse-DCF, Warnsignale |
| `invest-technik` | Trend, Regime, Volatilitaet, Niveaus, Mikrostruktur, Ausfuehrung |
| `invest-makro` | Zinsen, Konjunktur, Liquiditaet, Zyklus, Wirtschaftskalender |
| `invest-news` | Meldungen filtern, Fakt vs. Narrativ, ist es eingepreist |
| `invest-signal` | Zusammenfuehrung zu Signal, Wahrscheinlichkeit, Erwartungswert |
| `invest-risiko` | Positionsgroesse, Verlustgrenzen, Korrelation, Hebelmathematik |
| `invest-portfolio` | Aufteilung, Kern und Satellit, Faktoren, Rebalancing |
| `invest-backtest` | Strategien pruefen ohne Ueberanpassung und Look-ahead |
| `invest-kalibrierung` | Protokoll, Brier-Score, Fehlerarten, Selbstkorrektur |
| `invest-steuern-de` | Nach-Steuer-Rendite, Kosten, Produkt- und Brokerwahl |
| `invest-compliance` | Rechtsrahmen, Sprachregeln, Schutz vor Manipulation |

## Die Leitidee

Ein Agent, der "so gut wie nie falsch liegt", ist an Maerkten nicht
erreichbar — Preise enthalten die Erwartungen aller anderen bereits.
Erreichbar und deutlich wertvoller sind vier Eigenschaften, auf die das
gesamte Buendel ausgelegt ist:

1. **Kalibrierung** — 70 % gesagt heisst in rund 70 % der Faelle eingetroffen
2. **Asymmetrie** — oft falsch liegen und dabei wenig verlieren
3. **Ueberleben** — kein Einzelfehler beendet das Depot
4. **Sichere Basispunkte** — Kosten, Steuern, Ausfuehrung wirken garantiert

## Nutzung

```
Nutze invest-agent: Einschaetzung zu <Titel>, Horizont <kurz|mittel|lang>,
Depotgroesse <Betrag>, bestehende Positionen <Liste>.
```

Der Agent liefert ein Dossier nach
`invest-agent/referenzen/ausgabeformat.md` — mit Signal je Horizont,
Wahrscheinlichkeit, Erwartungswert nach Kosten und Steuern, Positionsgroesse,
Invalidierungskriterium, Gegenargument und Datenstand. "Kein Signal" ist ein
regulaeres und haeufiges Ergebnis.

## Hinweis

Analysewerkzeug, keine Anlageberatung. Details in `invest-compliance`.

Diese Skills sind im Repository selbst verfasst und stammen nicht aus einem
externen Katalog. Sie stehen deshalb bewusst nicht in `skills-lock.json`,
das nur eingebundene Fremdskills mit Herkunft und Pruefsumme fuehrt.
