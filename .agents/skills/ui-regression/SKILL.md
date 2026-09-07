---
name: ui-regression
description: |
  Schutz vor Funktionsverlust bei gestalterischen Aenderungen. Nimmt vor
  jedem Umbau ein Inventar aller Funktionen, Zustaende und Texte auf und
  vergleicht es danach. Verpflichtend vor und nach jedem Durchgang des
  Oberflaechen-Agenten.
triggers:
  - "nichts kaputt machen"
  - "regression"
  - "funktionen erhalten"
  - "vorher nachher vergleich"
---

# ui-regression — nichts geht verloren

Der haeufigste Schaden durch ein Redesign ist nicht schlechtes Aussehen,
sondern **stiller Funktionsverlust**. Etwas verschwindet, niemand merkt es,
und es faellt erst auf, wenn jemand es braucht — typischerweise eine Warnung
oder ein Leerzustand, den beim Umbau niemand offen hatte.

Dieser Skill macht das unmoeglich.

## Inventar vor dem Umbau

Vor der ersten Aenderung wird je betroffener Ansicht aufgenommen:

```
Ansicht:
  Bedienelemente:   jede Schaltflaeche, jedes Feld, jeder Link, mit Beschriftung
  Datenfelder:      jede angezeigte Groesse, mit Beleg-Verknuepfung
  Zustaende:        laedt / leer / fehlerhaft / teilweise / viele Eintraege
  Meldungen:        Warnungen, Hinweise, Fehler, Leerzustandstexte
  Pflichttexte:     Hinweistext, Demo-Band, Datenstand, Datenvollstaendigkeit
  Wege:             wohin fuehrt jeder Link, was passiert nach jeder Aktion
  Tastatur:         Fokusreihenfolge, erreichbare Elemente
```

Das Inventar wird als Datei abgelegt, nicht im Kopf behalten.

## Die unantastbare Liste

Diese Elemente duerfen unter keinen Umstaenden verschwinden, verkleinert
werden bis zur Unauffaelligkeit oder hinter ein Aufklappen wandern:

- **Beleg-Chips** an jeder Zahl — das Kernmerkmal der App
- **Hinweistext** am Ende jedes Dossiers und Lagebilds
- **Demo-Band** auf jeder Ansicht mit Demo-Daten
- **Datenstand** und **Datenvollstaendigkeit** im Kopf jedes Dossiers
- **„Kein Signal"** in derselben visuellen Groesse wie „Kaufen"
- **Gegenargument** und „Wer haelt die Gegenposition" — nie einklappbar
- **Warnungen** zu Datenluecken, Vetoregeln und Injektionsfunden
- **Abbruchbedingung** und **Ueberpruefungstermin** in der Umsetzung
- Der Abschnitt **„Wie diese Analyse entstand"**

Eine gestalterische Aenderung, die eines dieser Elemente schwaecht, wird
nicht umgesetzt — auch wenn die Ansicht dadurch ruhiger wuerde. Diese
Elemente sind der Grund, warum die App vertrauenswuerdig ist.

## Vergleich nach dem Umbau

Dasselbe Inventar erneut aufnehmen und Zeile fuer Zeile gegenueberstellen.
Zulaessige Ergebnisse je Eintrag:

- **unveraendert** — vorhanden und gleichwertig auffaellig
- **verbessert** — vorhanden und besser auffindbar
- **verschoben** — vorhanden, an anderer Stelle; die neue Stelle wird genannt
- **entfallen** — nur zulaessig, wenn der Nutzer es ausdruecklich wollte

Jedes „entfallen" ohne ausdruecklichen Wunsch ist ein Fehler und wird
zurueckgebaut, nicht begruendet.

## Was ausserdem geprueft wird

- Alle vorhandenen Tests laufen weiter durch
- Der Sprachtest schlaegt nicht an: keine fest verdrahteten englischen
  Oberflaechentexte
- Die Sperrliste der Formulierungen greift weiterhin
- Kein Beleg-Chip hat seine Verknuepfung verloren
- Kein Zahlenformat ist von deutscher auf englische Schreibweise gekippt
- Tastaturbedienung ist mindestens so vollstaendig wie vorher

## Bericht

Am Ende jedes Durchgangs steht entweder der Satz

> Funktionsinventar vorher und nachher verglichen: keine Funktion entfallen.

oder die vollstaendige Liste dessen, was fehlt — mit Plan, wie es
zurueckkommt. Ein Durchgang ohne diesen Abschnitt gilt als nicht
abgeschlossen.
