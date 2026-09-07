# Pruefung der Oberflaeche

`ui-audit.py` prueft den Frontend-Quelltext gegen `../DESIGN-SYSTEM.md`.
Nur Standardbibliothek, keine Installation noetig.

```bash
python3 ui-audit.py /app/frontend/src
python3 ui-audit.py /app/frontend/src --json bericht.json
```

Rueckgabewert 1, sobald ein blockierender Befund vorliegt — damit laesft sich
das Skript als Tor in eine Pipeline haengen.

## Was geprueft wird

| Bereich | Inhalt | Stufe bei Verstoss |
|---------|--------|--------------------|
| Kontrast | jedes Farbtoken gegen Karte und Seitengrund neu gerechnet, nicht der Dokumentation geglaubt | 1 |
| Token | alle 28 Token vorhanden und mit dem vorgeschriebenen Wert | 1 |
| Fokus | `outline: none` ohne erkennbaren Ersatz | 1 |
| Sprache | Sperrformulierungen wie „garantiert" | 1 |
| Funktionsverlust | Beleg-Chip, Demo-Band, Hinweistext, „Kein Signal", „keine Daten", Datenvollstaendigkeit, Gegenargument noch im Quelltext auffindbar | 1 |
| Bewegung | fehlender `prefers-reduced-motion`-Block | 1 |
| Typografie | `tabular-nums` gesetzt; keine hochzaehlenden Zahlen | 2 |
| Sprache | vermutlich englische Oberflaechentexte ausserhalb der Locale-Datei | 2 |
| Glas | `backdrop-filter` ohne `@supports`-Rueckfall | 2 |
| Rohfarben | Hex- oder rgb-Werte am Token-System vorbei | 3 |
| Skala | Radien ausserhalb 6/10/14/999, Abstaende ausserhalb der 4er-Skala | 3 |
| Bewegung | `transition` auf Layout- oder Malvorgaengen | 4 |
| Glas | Weichzeichnung ueber 20 px, auffaellig viele Glasflaechen | 4 |

## Was das Skript nicht kann

Es liest Quelltext, keinen laufenden Browser. Nicht geprueft werden dadurch:
Bildrate, tatsaechliche Ladezeiten, Layoutspruenge, Kontrast auf Verlaeufen im
gerenderten Zustand, Tastaturreihenfolge, Verhalten auf kleinen Geraeten.

Diese Punkte bleiben Aufgabe des Oberflaechen-Agenten mit Browser und
Messwerkzeug (`ui-performance`, `ui-responsive`, `ui-barrierefrei`). Das
Skript deckt die Haelfte ab, die sich mechanisch pruefen laesst — und genau
die wird sonst am haeufigsten uebersehen.
