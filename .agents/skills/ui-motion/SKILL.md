---
name: ui-motion
description: |
  Bewegung in der Oberflaeche: Uebergaenge, Hover-Verhalten, Ein- und
  Ausblenden, Ladezustaende. Sorgt fuer fluessige, zurueckhaltende
  Animationen, die Zusammenhaenge erklaeren statt zu schmuecken, und die auf
  schwacher Hardware und bei reduzierter Bewegung sauber bleiben.
triggers:
  - "animationen"
  - "hover effekt"
  - "uebergaenge"
  - "transitions"
  - "smooth"
---

# ui-motion — Bewegung erklaert, sie feiert nicht

In einer Finanzanwendung hat Bewegung genau drei zulaessige Aufgaben:

1. **Herkunft zeigen** — woher kommt dieses Overlay, wohin verschwindet es
2. **Rueckmeldung geben** — die Eingabe ist angekommen
3. **Aufmerksamkeit lenken** — hier hat sich etwas geaendert

Alles andere ist Dekoration und kostet Vertrauen.

## Werte

| Zweck | Dauer | Kurve |
|-------|-------|-------|
| Hover, Fokus, Farbe | 120 ms | `cubic-bezier(.2,0,0,1)` |
| Dropdown, Tab, Aufklappen | 180 ms | `cubic-bezier(.2,0,0,1)` |
| Overlay ein | 260 ms | `cubic-bezier(.2,0,0,1)` |
| Overlay aus | 160 ms | `cubic-bezier(.3,0,1,1)` |
| Seitenwechsel | max. 300 ms | dito |

Ausblenden ist immer schneller als Einblenden. Wer etwas schliesst, hat sich
schon entschieden und will nicht warten.

Unter 100 ms wirkt Bewegung wie ein Sprung, ueber 400 ms wie Zaehigkeit.
Alles Wichtige liegt dazwischen.

## Harte Regeln

- **Nur `transform` und `opacity` animieren.** `width`, `height`, `top`,
  `left`, `margin`, `box-shadow` und `filter` erzwingen Layout- oder
  Malvorgaenge in jedem Einzelbild und ruckeln zuverlaessig.
- Aufklappen ueber `grid-template-rows: 0fr → 1fr`, nicht ueber `height`.
- **Zahlen zaehlen nie hoch.** Ein hochlaufender Kurs ist unlesbar und
  behauptet eine Bewegung, die es nicht gab. Werte wechseln direkt; wenn eine
  Aenderung auffallen soll, blitzt kurz die Zeilenflaeche auf, nicht die Ziffer.
- Nichts bewegt sich ohne Ausloeser durch den Nutzer oder ohne echte
  Datenaenderung. Keine Dauerschleifen, kein Pulsieren, kein Schimmern
  ausser bei echten Ladeplatzhaltern.
- Gestaffelte Listen: hoechstens fuenf Elemente, je 30 ms Versatz. Danach
  erscheinen alle gleichzeitig.
- `will-change` nur waehrend einer laufenden Animation setzen und danach
  entfernen. Dauerhaft gesetzt kostet es Speicher und bringt nichts.

## Hover

- Nur auf Geraeten mit Zeiger: `@media (hover: hover) and (pointer: fine)`.
  Ohne diese Abfrage bleiben Hover-Zustaende auf Beruehrungsgeraeten kleben.
- Hover aendert Flaeche oder Kante, nicht die Position. Elemente, die beim
  Ueberfahren wandern, machen Listen unruhig.
- Zeilen in Tabellen: eine Flaechenstufe hoeher, 120 ms, sonst nichts.
- Kein Hover-Zustand ohne entsprechenden Fokus-Zustand.

## Ladezustaende

- Platzhalter haben **exakt** die Hoehe des spaeteren Inhalts. Sonst springt
  das Layout, und das ist schlimmer als ein kurzer Leerraum.
- Unter 300 ms Wartezeit gar keine Anzeige — ein aufblitzender Platzhalter
  ist unruhiger als eine kurze Pause.
- Bei laengeren Vorgaengen den laufenden Schritt im Klartext nennen, nicht
  nur einen Kreisel zeigen. In dieser App zeigt der Analyselauf ohnehin
  seinen Fortschritt schrittweise an.

## Reduzierte Bewegung

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Das ist kein Zugestaendnis, sondern eine Anforderung: Bewegung loest bei
manchen Menschen Uebelkeit aus. Die Oberflaeche muss ohne jede Animation
vollstaendig bedienbar und verstaendlich bleiben — wenn ein Zusammenhang nur
durch eine Animation erkennbar ist, ist das Layout falsch.

## Pruefung

- Mit gedrosselter Prozessorleistung testen, nicht nur auf schneller Hardware
- Beim Scrollen einer langen Liste auf Ruckler achten
- Jede Animation einmal mit reduzierter Bewegung durchgehen
- Zaehlen, wie viele Elemente sich gleichzeitig bewegen — mehr als drei ist
  fast immer zu viel
