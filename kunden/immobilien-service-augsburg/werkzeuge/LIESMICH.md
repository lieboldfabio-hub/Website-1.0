# Prüfskripte

Vier Skripte, die vor jedem Ausliefern laufen. Sie brauchen Playwright und
eine laufende Vorschau; die Adresse kommt aus `U`, sonst `http://127.0.0.1:4173`.

```bash
npm run build
npx vite preview &            # liefert auf 4173 aus
node werkzeuge/pruefen.mjs    # 30 Prüfungen: Seiten, Fahrten, Formular, Konsole
node werkzeuge/fluss.mjs      # Scrollfluss, auch mit 4× gedrosselter CPU
node werkzeuge/ganzseiten.mjs # Bilder der ganzen Seiten + versteckter Inhalt
node werkzeuge/regeln.mjs     # braucht keine Vorschau: prüft das Stylesheet
```

Was sie durchsetzen — und warum:

**`pruefen.mjs`** — jede verlinkte Seite ist erreichbar, hat genau eine H1,
einen eigenen Titel und eine eigene Beschreibung, läuft bei 1440, 820, 390
und 320 px nicht quer über, beide Querfahrten laufen monoton vorwärts und
enden exakt auf der letzten Station, das Formular ist bei Netlify angemeldet
und jedes Feld beschriftet.

**`fluss.mjs`** — drei Durchläufe je Seite, der erste verworfen (er enthält
das erstmalige Rastern). Verlangt Median ≤ 20 ms und ein 95. Perzentil
≤ 32 ms, auch bei vierfach gedrosselter CPU. **Das ist die Zahl, an der
Bewegung scheitert.** Wird sie gerissen, fliegt der teuerste Effekt raus —
die Messung wird nicht weggeredet.

**`ganzseiten.mjs`** — scrollt jede Seite einmal ganz durch und meldet danach
jedes Element mit Text, das unsichtbar ist und nicht `aria-hidden` trägt.
Inhalt, der auf einen Beobachter wartet, fehlt sonst in jeder Linkvorschau.
Dieser Fehler ist in diesem Projekt dreimal passiert; seitdem prüft ihn eine
Maschine statt eines Gedächtnisses.

**`regeln.mjs`** — kein `box-shadow` und keine Geometrie in `@keyframes` oder
`transition`. Beides läuft im Mal- oder Layoutschritt und ist genau die Art
Kosten, die die Vorfassung unbrauchbar gemacht hat.
