# Investoren-App — Bauauftrag fuer Emergent

Drei Dateien:

- **`EMERGENT-AUFTRAG.md`** — der vollstaendige Bauauftrag auf Deutsch, das
  Referenzdokument. Alles ab „ANFANG DES AUFTRAGS" ist der Prompt.
- **`EMERGENT-BUILD-ORDER-EN.md`** — englische Arbeitsfassung fuer den
  Emergent-Agenten. Inhaltlich gleich, zusaetzlich mit Abschnitt 0
  (Sprachregel) und Akzeptanzkriterium 23: die Oberflaeche laeuft auf
  Deutsch, der Code ist englisch.
- **`DESIGN-SYSTEM.md`** — verbindliche Gestaltungsgrundlage: Blau-Schwarz-
  Farbtoken mit gerechneten Kontrasten, Regeln fuer Verlaeufe und Glas,
  Bewegung, Leistungsbudget. Quelle der Wahrheit fuer alles Optische.
- **`KURZFASSUNG.md`** — komprimierte deutsche Fassung, falls die Eingabe
  zu lang wird. Danach je Phase den passenden Abschnitt nachreichen.

Aendert sich etwas, beide Fassungen nachziehen — sonst laufen sie
auseinander.

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

## Der zweite Agent: Oberflaeche

Acht `ui-*` Skills bilden einen zweiten, eigenstaendigen Agenten neben dem
Investment-Agenten. Klare Arbeitsteilung: `invest-agent` verantwortet, **was**
angezeigt wird — Zahlen, Signale, Belege, Regeln. `ui-agent` verantwortet,
**wie** es angezeigt wird. Der Oberflaechen-Agent aendert nie ein
Analyseergebnis; faellt ihm dort etwas auf, meldet er es.

| Skill | Aufgabe |
|-------|---------|
| `ui-agent` | Leitskill: Arbeitszyklus, Rangfolge der Befunde, Massstab |
| `ui-audit` | Systematische Pruefung, Befunde mit Ort und Schwere |
| `ui-designsystem` | Token durchsetzen, Verlaufs- und Glasdisziplin, Einheitlichkeit |
| `ui-motion` | Uebergaenge, Hover, Ladezustaende, reduzierte Bewegung |
| `ui-performance` | Bildrate, Ladezeit, Layoutspruenge — gemessen, nicht geschaetzt |
| `ui-responsive` | Haltepunkte, dichte Tabellen auf kleinen Geraeten, Beruehrung |
| `ui-barrierefrei` | Kontraste rechnen, Tastatur, Farbe nie allein |
| `ui-regression` | Funktionsinventar vor und nach jedem Umbau |

Die tragende Regel des zweiten Agenten: **nichts geht verloren.** Der
haeufigste Schaden durch ein Redesign ist nicht schlechtes Aussehen, sondern
stiller Funktionsverlust — eine Warnung, die im neuen Layout keinen Platz
mehr hat, ein Leerzustand, den niemand mehr sieht. `ui-regression` ist
deshalb vor und nach jedem Durchgang verpflichtend und fuehrt eine
unantastbare Liste: Beleg-Chips, Hinweistext, Demo-Band, Datenstand,
„Kein Signal" in voller Groesse, Gegenargument, Warnungen.

## Grenze, die im Auftrag steht und dort bleiben sollte

Die App sagt nicht die Zukunft voraus. Sie macht nachvollziehbar, worauf
eine Einschaetzung beruht, wie unsicher sie ist und wie oft das Modell
bisher richtig lag. Wer die Belegpflicht, den Zahlenpruefer oder die
Vetoregeln herausnimmt, um die Oberflaeche entschlossener wirken zu lassen,
baut ein anderes und schlechteres Produkt.
