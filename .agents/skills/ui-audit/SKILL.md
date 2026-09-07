---
name: ui-audit
description: |
  Systematische Pruefung einer bestehenden Oberflaeche auf Schwachstellen in
  Gestaltung, Bedienfuehrung und Einheitlichkeit. Liefert belegte Befunde mit
  Ort, Schwere und Vorschlag statt allgemeiner Eindruecke. Immer vor jeder
  gestalterischen Aenderung ausfuehren.
triggers:
  - "ui pruefen"
  - "design audit"
  - "schwachstellen finden"
  - "was ist schlecht am design"
---

# ui-audit — Befunde statt Eindruecke

Ein Befund ohne Ort und Belegkraft ist eine Meinung. Dieser Skill erzeugt
Befunde, an denen man arbeiten kann.

## Form eines Befunds

Jeder Eintrag enthaelt genau diese Felder:

```
Ort:        Datei und Komponente, moeglichst mit Zeilenangabe
Stufe:      1 blockierend | 2 Verstaendlichkeit | 3 Einheitlichkeit
            | 4 Leistung | 5 Feinschliff
Beobachtet: was tatsaechlich da ist, messbar formuliert
Warum:      welche Regel oder welcher Nutzerschaden dahintersteht
Vorschlag:  die konkrete Aenderung
Risiko:     was dabei kaputtgehen koennte
```

„Wirkt unmodern" ist kein Befund. „Karten verwenden drei verschiedene
Radien (6, 8 und 12 px) in denselben Listen" ist einer.

## Pruefdurchgang

### A. Erst schauen, dann messen

Jede Hauptansicht in drei Zustaenden ansehen: **gefuellt**, **leer**,
**fehlerhaft**. Die meisten Schwaechen sitzen im leeren und im fehlerhaften
Zustand, weil dort selten jemand hinsieht.

Fuenf-Sekunden-Test je Ansicht: Was faellt zuerst ins Auge? Ist das auch das
Wichtigste? Wenn die auffaelligste Flaeche nicht die wichtigste Aussage
traegt, ist die Hierarchie falsch — das ist ein Stufe-2-Befund.

### B. Hierarchie

- Gibt es genau **eine** primaere Aussage je Ansicht?
- Traegt sie die groesste Flaeche, den staerksten Kontrast oder die groesste
  Schrift — moeglichst nur eines davon, nicht alles zugleich?
- Sind Warnungen und Datenluecken auffaelliger als dekorative Elemente?
- Konkurrieren mehrere Schaltflaechen um dieselbe Aufmerksamkeit? Genau eine
  primaere je Ansicht.

### C. Einheitlichkeit — der ergiebigste Teil

Systematisch zaehlen, nicht schaetzen. Beispiele fuer Suchen im Quelltext:

- alle verwendeten Radien, Abstaende, Schriftgroessen, Schattenwerte
- alle Farbwerte, die nicht ueber ein Token laufen
- Komponenten, die denselben Zweck erfuellen, aber doppelt existieren
- unterschiedliche Schreibweisen fuer dasselbe (Datum, Waehrung, Prozent)

Jeder Wert ausserhalb der Skala aus `DESIGN-SYSTEM.md` ist ein Befund.

### D. Bedienfuehrung

- Kommt der Nutzer von jeder Ansicht aus weiter, ohne zurueckzugehen?
- Ist jederzeit erkennbar, wo er ist und wie er zurueckkommt?
- Sind Zielgroessen ausreichend, Abstaende zwischen Zielen ausreichend?
- Gibt es Rueckmeldung auf jede Aktion, sofort und sichtbar?
- Sind zerstoerende Aktionen abgesichert und optisch abgesetzt?

### E. Zustaende

Fuer jedes Bedienelement pruefen, ob Ruhe, Hover, Fokus, Aktiv und
Deaktiviert vorhanden und unterscheidbar sind. Fehlt einer, ist die
Komponente unfertig — Stufe 3.

Fuer jede datenfuehrende Ansicht pruefen: laedt, leer, fehlerhaft, teilweise
befuellt, sehr viele Eintraege, sehr lange Texte.

### F. Text

- Sind Beschriftungen Substantive und Aktionen Verben?
- Ist die Anrede durchgehend gleich?
- Sagen Fehlermeldungen, **was zu tun ist**, nicht nur, was schiefging?
- Erklaert jeder Leerzustand, warum er leer ist und was der naechste Schritt waere?
- Steht irgendwo eine Formulierung auf der Sperrliste (`invest-compliance`)?

### G. Uebergabe an die Fachskills

Kontrast, Tastatur und Fokus → `ui-barrierefrei`.
Bewegung → `ui-motion`. Bildrate und Ladezeit → `ui-performance`.
Kleine Bildschirme und Zeigergeraete → `ui-responsive`.

## Ausgabe

Eine nach Stufe sortierte Tabelle, blockierende Befunde zuerst. Am Ende drei
Zahlen: Anzahl Befunde je Stufe, Anzahl Verstoesse gegen das Designsystem,
Anzahl Komponenten ohne vollstaendige Zustaende.

Findet der Durchgang nichts, ist das ein zulaessiges Ergebnis — aber es
kommt praktisch nie vor. Wer nichts findet, hat meist nur die gefuellten
Zustaende angesehen.
