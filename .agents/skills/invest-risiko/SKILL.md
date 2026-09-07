---
name: invest-risiko
description: |
  Risiko- und Kapitalmanagement fuer den Investment-Agenten. Positionsgroesse
  bestimmen (Risikoanteil, Volatilitaetsnormierung, Kelly-Fraktion),
  Maximalverlust begrenzen, Drawdown-Regeln, Korrelation, Klumpenrisiko,
  Hebelmathematik und Pfadabhaengigkeit. Ohne diesen Skill wird keine
  Positionsgroesse genannt.
triggers:
  - "positionsgroesse"
  - "wie viel investieren"
  - "risikomanagement"
  - "stop loss"
  - "drawdown"
  - "hebel"
---

# invest-risiko — Groesse, Verlustgrenze, Ueberleben

Der einzige Bereich, in dem sich Profis und Amateure **systematisch**
unterscheiden. Rendite ist ein Nebenprodukt des Ueberlebens.

## Reihenfolge — immer so herum

Nicht "wie viel Gewinn ist moeglich", sondern:

1. Wo ist die These falsch? (Invalidierungspunkt aus `invest-signal`)
2. Wie viel darf dieser einzelne Irrtum kosten? (Risikobudget)
3. **Daraus** folgt die Positionsgroesse.

```
Positionsgroesse = (Depotwert × Risikoanteil) ÷ Abstand zum Invalidierungspunkt
```

Beispiel: 50.000 € Depot, 1 % Risikoanteil = 500 € Risiko. Invalidierung
15 % unter Einstieg → Positionsgroesse rund 3.300 €, also etwa 6,6 % des
Depots. Die Position ist gross, das **Risiko** ist klein — das ist der
Unterschied, den die meisten nicht machen.

## Risikoanteil je Idee

| Konfidenz (aus `invest-signal`) | Risikoanteil je Position |
|---------------------------------|--------------------------|
| niedrig | 0,25–0,5 % |
| mittel | 0,5–1 % |
| hoch | 1–2 % |

Ueber 2 % je Einzelidee ist ohne ausdrueckliche, begruendete Freigabe des
Nutzers nicht vorzuschlagen. Bei Einzelaktien zusaetzlich beruecksichtigen,
dass ein Totalverlust ueber Nacht moeglich ist (Insolvenz, Betrug,
Uebernahme zu schlechten Konditionen) — der Invalidierungspunkt schuetzt
davor **nicht**.

## Volatilitaetsnormierung

Gleiches Geld auf zwei Positionen bedeutet nicht gleiches Risiko. Positionen
so dimensionieren, dass jede etwa denselben Beitrag zur Depotschwankung
leistet:

```
Gewicht_i ∝ Zielvolatilitaet ÷ Volatilitaet_i
```

Folge: volatile Titel bekommen kleinere Betraege. Wer beides gleich gross
kauft, hat unbemerkt eine Wette auf den volatileren Titel abgeschlossen.

## Kelly und warum nur ein Bruchteil davon

Kelly liefert die theoretisch wachstumsoptimale Groesse:

```
f* = (p × b − (1 − p)) ÷ b
```

p = Trefferwahrscheinlichkeit, b = Gewinn-Verlust-Verhaeltnis.

In der Praxis nur **ein Viertel bis die Haelfte** davon einsetzen, weil p
und b geschaetzt sind und Ueberschaetzung sofort in ruinoese Groessen fuehrt.
Volles Kelly erzeugt Rueckschlaege von ueber 50 %, die kaum jemand
durchhaelt. **Kelly ist eine Obergrenze, kein Ziel.**

## Vier Mathematiken, die man kennen muss

1. **Asymmetrie der Erholung.** −20 % braucht +25 %, −50 % braucht +100 %,
   −80 % braucht +400 %. Verluste sind nicht symmetrisch zu Gewinnen.
2. **Volatilitaetsbremse.** Der Depotwert folgt der geometrischen, nicht der
   arithmetischen Rendite. +50 % und −50 % ergeben nicht null, sondern −25 %.
   Schwankung frisst Rendite, auch ohne Fehler.
3. **Pfadabhaengigkeit / Nichtergodizitaet.** Der Durchschnitt ueber viele
   Spieler ist nicht der Durchschnitt ueber dein Leben. Ein Spiel mit
   positivem Erwartungswert kann dich mit hoher Wahrscheinlichkeit ruinieren,
   wenn du es wiederholt mit demselben Kapital spielst. **Das ist die
   eigentliche Begruendung fuer Positionsgroessen** — nicht Vorsicht.
4. **Hebel.** Hebel multipliziert die Volatilitaetsbremse und macht
   Zwischenverluste zu endgueltigen. Kredit- oder Derivatehebel wird nur
   dargestellt, wenn der Nutzer ausdruecklich danach fragt, und immer mit
   Nachschuss-, Knock-out- und Pfadrisiko.

## Korrelation und Klumpenrisiko

- Korrelationen laufen im Stress gegen 1. Diversifikation verschwindet genau
  dann, wenn man sie braucht.
- Klumpen pruefen nach: Branche, Region, Waehrung, Faktor (Wachstum,
  Substanz, Momentum), Zinssensitivitaet, Lieferkette, Grosskunde.
- **Das eigene Humankapital gehoert dazu.** Arbeitgeber, Branche und
  Immobilie sind bereits Positionen im Portfolio. Wer bei einer Bank
  arbeitet und Bankaktien haelt, ist doppelt exponiert — genau dann, wenn
  auch der Arbeitsplatz wackelt.

## Depotweite Grenzen

Als Vorschlagswerte, vom Nutzer bestaetigen zu lassen:

- Gesamtrisiko aller offenen Ideen gleichzeitig: 5–6 % des Depots
- Maximalgewicht einer Einzelaktie: 5–10 %
- Maximalgewicht einer Branche: 20–25 %
- Deeskalationsstufen: bei −10 % Rueckschlag Risiko halbieren, bei −20 %
  nur noch bestehende Positionen verwalten, keine neuen eroeffnen
- Liquiditaetspuffer, der nie investiert wird (Notgroschen ausserhalb des
  Depots, mindestens 3–6 Monatsausgaben)

## Ausstiegsmechanik

- Invalidierungspunkt **vor** dem Einstieg festlegen und nie nach unten
  verschieben. Ein verschobener Stop ist ein aufgegebener Plan.
- Abstand an der Volatilitaet ausrichten, nicht am Wunschverlust. Ein enger
  Stop im volatilen Titel wird ausgeloest, bevor die These falsch ist.
- Stop-Market kann in Kursluecken weit entfernt ausgefuehrt werden; bei
  duennen Titeln Stop-Limit oder mentale Grenze mit Handlungsdisziplin.
- Teilverkaeufe sind erlaubt und oft die beste Loesung fuer den Konflikt
  zwischen "These laeuft" und "Position zu gross geworden".

## Kasse

Kasse ist keine Renditeluecke, sondern das **Recht, in Panik zu kaufen**.
Ein Depot ohne Kasse hat keine Handlungsfaehigkeit in genau den Momenten,
in denen sie am meisten wert ist.
