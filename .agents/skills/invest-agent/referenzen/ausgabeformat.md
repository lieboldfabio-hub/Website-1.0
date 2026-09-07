# Verbindliches Ausgabeformat: das Dossier

Jede Einschaetzung zu einem Titel folgt dieser Struktur. Abschnitte, fuer
die Daten fehlen, bleiben stehen und werden mit "keine belastbaren Daten"
gefuellt — sie verschwinden nicht.

---

## Kopf

| Feld | Inhalt |
|------|--------|
| Titel | Name, ISIN/Ticker, Boerse, Handelswaehrung |
| Datenstand | Datum und Uhrzeit des Abrufs, je Quelle |
| Letzter Kurs | Kurs, Waehrung, Quelle |
| Auftrag | Was gefragt wurde, welcher Horizont |

## 1. Signal

Getrennt nach Horizont, nie vermischt:

| Horizont | Signal | Konfidenz | Wahrscheinlichkeit | Erwartungswert |
|----------|--------|-----------|--------------------|----------------|
| Kurzfristig (Tage–Wochen) | Kaufen / Halten / Verkaufen / Kein Signal | niedrig / mittel / hoch | z. B. 55 % | z. B. +1,8 % |
| Mittelfristig (3–18 Monate) | … | … | … | … |
| Langfristig (3+ Jahre) | … | … | … | … |

**"Kein Signal" ist ein vollwertiges Ergebnis.** Die meiste Zeit ist es das
richtige. Erzwinge nie eine Richtung.

Konfidenz-Definition:
- **hoch** — mehrere unabhaengige Datenebenen zeigen dasselbe, Datenlage vollstaendig
- **mittel** — Ebenen zeigen dasselbe, aber eine Datenluecke oder ein Widerspruch
- **niedrig** — Ebenen widersprechen sich oder wesentliche Daten fehlen

## 2. These in drei Saetzen

Was das Geschaeft ist, warum es unter- oder ueberbewertet sein koennte, und
was der Markt uebersieht. Wer das nicht in drei Saetzen kann, hat keine These.

## 3. Faktenlage

- **Fundamental** (`invest-fundamental`): Umsatz, Marge, freier Cashflow,
  ROIC, Verschuldung, Bewertung heute vs. eigener 10-/20-/30-Jahres-Median
- **Markttechnik** (`invest-technik`): Trendlage, Regime, Volatilitaet,
  relative Staerke, markante Kursniveaus
- **Makro** (`invest-makro`): Zinsumfeld, Konjunkturlage, Branchenzyklus,
  relevante Termine der naechsten 30 Tage
- **Nachrichten** (`invest-news`): was seit dem letzten Quartal passiert ist,
  getrennt nach einmalig und strukturell

Jede Zahl mit Quelle. Schaetzungen als solche kennzeichnen.

## 4. Szenarien

| Szenario | Wahrscheinlichkeit | Kursziel | Begruendung |
|----------|--------------------|----------|-------------|
| Baer | z. B. 30 % | … | … |
| Basis | z. B. 50 % | … | … |
| Bulle | z. B. 20 % | … | … |

Summe 100 %. Erwartungswert daraus rechnen und ausweisen. Wenn der
Erwartungswert nach Kosten und Steuern negativ ist: kein Kauf, unabhaengig
davon, wie gut die Geschichte klingt.

## 5. Umsetzung

- **Positionsgroesse** in % des Depots und in Waehrung (`invest-risiko`)
- **Einstieg**: sofort, gestaffelt oder limitiert — mit Begruendung
- **Invalidierung**: konkreter Kurs, konkrete Kennzahl oder konkretes
  Ereignis, bei dem die These beendet wird
- **Ausstieg auf der Gewinnseite**: bei welchem Ereignis oder Niveau
- **Ueberpruefungstermin**: Datum, an dem die These erneut geprueft wird
- **Nach Steuern und Kosten** (`invest-steuern-de`)

## 6. Gegenargument

- Das staerkste Argument gegen die eigene These
- **Wer steht auf der Gegenseite dieses Trades und warum handelt er so?**
- Wodurch koennte die Analyse systematisch verzerrt sein

## 7. Depotwirkung

Korrelation zu bestehenden Positionen, Klumpenrisiko nach Branche, Waehrung,
Faktor und Region (`invest-portfolio`).

## 8. Unsicherheiten und Hinweis

- Welche Daten fehlen, welche Annahmen sind tragend
- Wie stark aendert sich das Ergebnis, wenn die Hauptannahme kippt
- Standardhinweis nach `invest-compliance`

---

## Kurzform

Fuer schnelle Zwischenfragen ist eine Kurzform zulaessig — aber nie ohne
diese fuenf Felder: **Signal, Konfidenz, Wahrscheinlichkeit, Invalidierung,
Datenstand.**
