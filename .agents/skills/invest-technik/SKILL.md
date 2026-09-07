---
name: invest-technik
description: |
  Markttechnik und Marktmikrostruktur fuer den Investment-Agenten. Trend und
  Regime bestimmen, Volatilitaet einordnen, relative Staerke messen,
  Kursniveaus und Ausfuehrung planen, Positionierung und Optionsmarkt lesen.
  Liefert das Timing und die Ausfuehrung zu einer fundamentalen These.
triggers:
  - "chartanalyse"
  - "einstiegszeitpunkt"
  - "trend"
  - "unterstuetzung widerstand"
  - "volatilitaet"
  - "orderausfuehrung"
---

# invest-technik — Timing, Struktur, Ausfuehrung

Markttechnik beantwortet nicht "was ist es wert", sondern **"was macht der
Preis gerade und was kostet es mich, hier ein- oder auszusteigen"**.

## Was zaehlt und was nicht

**Zaehlt:** Trendrichtung ueber mehrere Zeitebenen, Volatilitaetsregime,
relative Staerke, Volumen an markanten Stellen, Liquiditaet, Spread,
Positionierung.

**Zaehlt nicht:** ein Indikatorenzoo. Zehn Indikatoren, die alle aus dem
Schlusskurs abgeleitet sind, liefern keine zehn Meinungen, sondern eine —
mit falschem Gefuehl von Bestaetigung. Maximal zwei bis drei nicht
redundante Werkzeuge, jedes mit klarer Aufgabe.

## 1. Regime bestimmen — immer zuerst

Ohne Regime ist jedes Signal beliebig, weil dieselbe Regel im Trend und in
der Seitwaertsphase gegensaetzlich wirkt.

| Regime | Merkmale | Was funktioniert eher |
|--------|----------|-----------------------|
| Trend aufwaerts | hoehere Hochs und Tiefs, ruhige Volatilitaet | Rueckseztzer kaufen, Trend halten |
| Trend abwaerts | tiefere Hochs und Tiefs, steigende Volatilitaet | Staerke verkaufen, Kasse halten |
| Seitwaerts | Spanne, mittlere Volatilitaet | Extreme der Spanne handeln |
| Stress | Volatilitaetssprung, Korrelationen gegen 1, Liquiditaet duenn | nur Risiko reduzieren |

Regimewechsel erkennen ist wertvoller als jedes Einstiegssignal.

## 2. Zeitebenen trennen

Mindestens zwei Ebenen ansehen: die des Anlagehorizonts und die eine Stufe
darueber. Ein Kaufsignal im Tagesbild gegen einen intakten Abwaertstrend im
Wochenbild ist ein Trade mit schlechterer Trefferquote — das gehoert in die
Konfidenzbewertung.

**Die haeufigste Selbstzerstoerung im Depot:** ein kurzfristiger Trade wird
im Verlust zum "Langfristinvestment" umgedeutet. Der Horizont wird beim
Einstieg festgelegt und nicht nachtraeglich geaendert.

## 3. Kursniveaus richtig verstehen

Unterstuetzung und Widerstand sind keine Magie, sondern **Orderansammlungen
und Erinnerungspunkte**: frueheres Hoch oder Tief, Ausbruchskante, Bereich
mit hohem gehandelten Volumen, runde Marken, Eroeffnungs- und Vortagesniveau.

Nutze Niveaus als **Zonen**, nie als exakte Linien, und vor allem fuer zwei
Dinge: Platzierung des Invalidierungspunktes und Beurteilung des
Chance-Risiko-Verhaeltnisses. Nicht als Prognose.

## 4. Volatilitaet

- **Realisierte Volatilitaet** bestimmt die Positionsgroesse
  (`invest-risiko`) und den Abstand des Ausstiegs. Ein enger Stop in einem
  volatilen Markt wird ausgeloest, bevor die These falsch ist.
- **Implizite Volatilitaet** zeigt, was der Markt erwartet. Implizit deutlich
  ueber realisiert heisst: Absicherung ist teuer, Erwartung ist nervoes.
- **Volatilitaetsclusterung**: ruhige Phasen folgen auf ruhige, Stress auf
  Stress. Niedrige Volatilitaet ist kein Sicherheitszeichen, sondern oft die
  Vorbedingung fuer Hebelaufbau im Markt.

## 5. Relative Staerke

Verhaeltnis des Titels zum Index und zur eigenen Branche. Trennt
titelspezifische Bewegung von Marktbewegung. Ein Titel, der im steigenden
Markt seitwaerts laeuft, ist schwaecher, als der Chart allein aussieht.

## 6. Mikrostruktur und Ausfuehrung

Der stille Renditekiller. Vor jeder Order pruefen:

- **Spread** in Prozent — bei engen Zielen entscheidend
- **Handelsvolumen** und die eigene Ordergroesse im Verhaeltnis dazu
- **Handelszeit**: Eroeffnung und Schluss sind volatil, ausserhalb der
  Heimatboersenzeit sind Spreads breiter
- **Ordertyp**: Limit ist der Normalfall. Market nur bei hoher Liquiditaet
  und Eile. Stop-Market kann in Luecken weit entfernt ausgefuehrt werden
- **Handelsplatz**: Heimatboerse hat meist die beste Liquiditaet
- **Stueckelung** grosser Orders bei duennen Titeln

Erwarteter Vorteil einer Idee minus Spread minus Gebuehren minus Slippage —
was uebrig bleibt, ist der reale Vorteil. Bei vielen kurzfristigen Ideen
bleibt nichts uebrig; dann ist "kein Signal" das ehrliche Ergebnis.

## 7. Positionierung und Flows

Preis wird kurzfristig von Zwang gemacht, nicht von Meinung:

- **COT-Daten** fuer Terminmaerkte, extreme Positionierung als Kontraindikator
- **Optionsverfall** und Konzentration offener Kontrakte an bestimmten Marken
- **Index-Rebalancing** und Auf-/Abstiege erzeugen Zwangskaeufe und -verkaufe
- **Zwangsverkaeufer**: Margin Calls, Fondsabfluesse, Steuerverkaeufe zum
  Jahresende, Mandatsgrenzen. Ein Zwangsverkaeufer ist die beste Gegenseite,
  die es gibt — er verkauft nicht wegen der Fakten, sondern wegen der Regeln.
- **Stimmung**: Extremwerte in Umfragen und Put/Call-Verhaeltnissen wirken
  kontraer, aber nur an Extremen und nie als alleiniges Signal

## Grenzen

Markttechnik erzeugt keinen langfristigen Wert und keine Prognose. Sie
verbessert Einstieg, Ausstieg und Groesse einer These, die fundamental oder
makroseitig begruendet ist. Als alleinige Grundlage einer Kaufentscheidung
ist sie im Dossier als Konfidenz "niedrig" zu fuehren.
