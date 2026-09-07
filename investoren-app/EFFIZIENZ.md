# Effizienzprotokoll

Ziel: derselbe Qualitaetsstand bei deutlich weniger Token. Nicht durch
weniger Sorgfalt, sondern dadurch, dass nichts zweimal bezahlt wird.

## Der teuerste Fehler — belegt

Anweisungen an Emergent wurden als mehrseitiger Fliesstext geschickt statt
als Verweis auf eine Datei. Zwei davon kamen zusaetzlich **doppelt** an
(im Verlauf als zwei aufeinanderfolgende Nachrichten mit identischem Text
sichtbar). Ein Agentenverlauf traegt jede fruehere Nachricht in **jedem**
weiteren Zug mit. Eine 6.000-Wort-Anweisung kostet also nicht einmal,
sondern in jedem folgenden Schritt erneut — und doppelt gesendet doppelt.

Daraus folgen die drei Regeln, die am meisten sparen.

## Regel 1 — Spezifikationen leben in Dateien, nicht in Nachrichten

Alles Dauerhafte liegt im Container unter `/app/memory/`:

| Datei | Inhalt |
|-------|--------|
| `PRD.md` | Produktdefinition |
| `ARCHITEKTUR.md` | Ordner, Module, Datenmodell, Endpunkte, Namenskonventionen |
| `DESIGN_SYSTEM.md` | Farbtoken, Skalen, Verlaufs- und Glasregeln |
| `UI_AGENT.md` | Doktrin des Oberflaechen-Agenten |
| `UI_INVENTORY.md` | Funktionsinventar |
| `PHASEN.md` | alle acht Bauphasen mit Fertigstellungskriterium |

Eine Nachricht lautet danach: *„Baue Phase 3 nach `/app/memory/PHASEN.md`,
Abschnitt 3. Abweichung: keine."* — statt die Phase erneut auszuschreiben.

Ersparnis: eine Spezifikation wird einmal geschrieben und danach mit rund
zwanzig Token referenziert statt mit mehreren tausend wiederholt.

## Regel 2 — Nur Abweichungen uebertragen

Wenn eine Vorgabe bereits in einer Datei steht, wird sie nie erneut
zitiert. Uebertragen wird ausschliesslich, was sich **aendert**:

> Falsch: die ganze Farbtabelle erneut senden, weil ein Wert sich geaendert hat.
> Richtig: „In `DESIGN_SYSTEM.md`: Primaerverlauf auf `accent-hover → accent`
> aendern, Grund Kontrast 2,88:1 am unteren Ende. Rest unveraendert."

## Regel 3 — Was pruefbar ist, wird zum Skript

Jede Pruefung, die ein Agent im Kopf macht, kostet bei jeder Wiederholung
erneut Token. Als Skript kostet sie einmal und danach nichts mehr.

Bereits umgesetzt: `pruefung/ui-audit.py` ersetzt eine mehrseitige
Design-Durchsicht durch einen Aufruf mit Rueckgabewert. Dasselbe Muster
gilt fuer Vetoregeln, Positionsgroessen, Kontraste und Formatpruefungen.

Faustregel: Wird eine Pruefung ein drittes Mal gebraucht, wird sie ein Test.

## Arbeitsregeln im Container

- **Erst suchen, dann lesen.** `grep -rn` statt eine Datei ganz zu oeffnen.
  Danach nur den gefundenen Bereich lesen, nicht die ganze Datei.
- **Nichts zweimal lesen.** Was in diesem Lauf schon gelesen wurde, wird
  nicht erneut geoeffnet. Bei Unsicherheit in `ARCHITEKTUR.md` nachsehen.
- **Aenderungen buendeln.** Mehrere Bearbeitungen an derselben Datei in
  einem Durchgang, nicht nacheinander mit Zwischenpruefungen.
- **Wiederverwenden statt neu bauen.** Vor jeder neuen Komponente pruefen,
  ob eine bestehende sie mit einer Variante abdeckt. Vorhandene
  Bibliotheken nutzen, keine neuen einfuehren.
- **Keine neue Datei ohne Notwendigkeit.** Eine zusaetzliche Datei kostet
  dauerhaft Aufmerksamkeit in jeder spaeteren Suche.
- **Kein Neuaufbau von Bekanntem.** Das Datenmodell, die Endpunkte und die
  Ordnerstruktur stehen in `ARCHITEKTUR.md` und werden nicht neu erforscht.
- **Ausgaben begrenzen.** Werkzeugausgaben mit `head`, `tail`, `-n`
  eingrenzen. Ein vollstaendiger Testlauf im Verlauf kostet mehr als seine
  Zusammenfassung.
- **Berichte kurz halten.** Zahlen und Abweichungen, keine Nacherzaehlung
  der Arbeitsschritte.

## Woran nicht gespart wird

Diese Punkte bleiben vollstaendig, auch wenn sie Token kosten:

- Die Kontrast-, Veto- und Positionsgroessenpruefungen
- Der Zahlenpruefer gegen erfundene Werte
- Der Injektionsschutz
- Der Inventarvergleich vor und nach jedem Umbau
- Sicherheitspruefungen und Schluesselhygiene
- Die vollstaendige Testsuite vor jeder Phasenabnahme

Sparen heisst hier: dieselbe Pruefung nicht zweimal bezahlen. Nicht: sie
weglassen.

## Fuer den steuernden Agenten

- Unabhaengige Werkzeugaufrufe in einem Block, nicht nacheinander.
- Keine Spezifikation erneut senden, die bereits als Datei existiert.
- Keine Datei erneut lesen, die in diesem Lauf schon gelesen wurde.
- Grosse Referenzskills nur laden, wenn die Aufgabe sie wirklich braucht.
- Wiederkehrende Rechnungen als Skript ablegen statt sie neu herzuleiten.
- Nachrichten kurz halten — auch weil eine versehentlich doppelt
  zugestellte kurze Nachricht wenig kostet, eine lange viel.
