# Investoren-App — Bauauftrag fuer Emergent

Zwei Dateien:

- **`EMERGENT-AUFTRAG.md`** — der vollstaendige Bauauftrag. Alles ab der
  Zeile „ANFANG DES AUFTRAGS" kopieren und in Emergent einfuegen.
- **`KURZFASSUNG.md`** — komprimierte Fassung, falls die Eingabe zu lang
  wird. Danach je Phase den passenden Abschnitt nachreichen.

## Vorher besorgen

| Schluessel | Wofuer | Kosten |
|------------|--------|--------|
| `ANTHROPIC_API_KEY` | Textsynthese der Dossiers | nach Verbrauch, Budget in der App gedeckelt |
| `FRED_API_KEY` | Makroreihen, teils ueber 50 Jahre | kostenlos |
| `MARKETDATA_API_KEY` | Kurse und Kennzahlen | je nach Anbieter |
| `SEC_USER_AGENT` | Pflichtangabe fuer SEC-Abrufe, Name und E-Mail | kostenlos |

Ohne Schluessel startet die App im Demo-Modus mit erkennbar erfundenen
Beispielunternehmen.

## Verhaeltnis zu den Skills

Die dreizehn Skills unter `.agents/skills/invest-*` beschreiben, **wie**
analysiert wird — sie steuern den Agenten in diesem Repository. Der
Bauauftrag hier uebersetzt dieselbe Methodik in **Software**: aus jedem
Skill wird eine Engine im Backend.

| Skill | Engine im Auftrag |
|-------|-------------------|
| `invest-agent` | Orchestrator, Abschnitt 9 |
| `invest-daten` | `data`, Abschnitt 8.1 |
| `invest-fundamental` | `fundamental`, 8.2 |
| `invest-technik` | `technical`, 8.3 |
| `invest-makro` | `macro` und `calendar`, 8.4 und 8.5 |
| `invest-news` | `news`, 8.6 |
| `invest-signal` | `signal`, 8.7 |
| `invest-risiko` | `risk`, 8.8 |
| `invest-portfolio` | `portfolio`, 8.9 |
| `invest-backtest` | `backtest`, 8.10 |
| `invest-kalibrierung` | `calibration`, 8.11 |
| `invest-steuern-de` | `tax_cost`, 8.12 |
| `invest-compliance` | `compliance`, 8.13 |

Wer die Skills aendert, sollte den Auftrag mit aendern — und umgekehrt.

## Grenze, die im Auftrag steht und dort bleiben sollte

Die App sagt nicht die Zukunft voraus. Sie macht nachvollziehbar, worauf
eine Einschaetzung beruht, wie unsicher sie ist und wie oft das Modell
bisher richtig lag. Wer die Belegpflicht, den Zahlenpruefer oder die
Vetoregeln herausnimmt, um die Oberflaeche entschlossener wirken zu lassen,
baut ein anderes und schlechteres Produkt.
