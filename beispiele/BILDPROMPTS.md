# Bild-Prompts für die Beispielprojekte

21 Bildplätze, verteilt auf fünf Projekte. Für jedes Projekt gibt es einen
**Stilblock**, der in jeden Prompt dieses Projekts ans Ende gehängt wird – so
wirken die Bilder eines Projekts wie aus einer Serie und nicht wie fünf
zusammengesuchte Stockfotos.

## So benutzt du die Prompts

- **Sprache:** Die Prompts sind bewusst auf Englisch. Alle Bildmodelle
  (Firefly, Midjourney, Gemini, DALL·E) verstehen Englisch deutlich präziser.
- **Seitenverhältnis:** steht bei jedem Bild dabei. In Firefly und Gemini
  wählst du es im Menü, in Midjourney hängst du es an (z. B. `--ar 4:5`).
- **Kein Text im Bild:** Bildmodelle schreiben unleserliche Buchstaben. Deshalb
  steht in jedem Stilblock `no text, no logos, no watermark`.
- **Größe:** Liefere die Rohbilder ruhig groß (mindestens 1600 px an der langen
  Kante). Zuschnitt aufs exakte Seitenverhältnis und die Komprimierung fürs Web
  mache ich danach.
- **Ablage:** Datei mit **exakt** dem angegebenen Namen als `.jpg` in den Ordner
  `beispiele/<projekt>/assets/img/` legen. Die Seiten tauschen den Platzhalter
  dann von selbst gegen das Foto – es ist keine Code-Änderung nötig.

---

## 1. Halbritter Haustechnik · Handwerk (3 Bilder)

**Stilblock** (an jeden Prompt anhängen):

```
documentary photography, natural daylight, clean and technical mood, muted
graphite grey and off-white palette with a single cool blue accent, sharp
focus, 35mm lens, realistic, no text, no logos, no watermark
```

### `hero.jpg` — Hochformat 4:5
```
A tradesman in dark workwear installing an electrical distribution board in a
residential utility room, hands and tools in sharp focus, calm concentrated
work, daylight falling in from a side window, tidy and organised workspace
```

### `nachher.jpg` — Querformat 16:10
```
A newly renovated modern bathroom, large format grey tiles, walk-in shower with
a slim black frame, floating vanity with a round mirror, soft daylight from the
left, spotless and finished, wide shot taken from the doorway corner
```

### `vorher.jpg` — Querformat 16:10, **gleicher Blickwinkel wie `nachher.jpg`**
```
The same bathroom before renovation, dated 1980s beige tiles, old bathtub, worn
fittings and yellowed silicone, dull overhead lighting, empty and stripped,
shot from the exact same doorway corner and camera angle as the renovated
version
```

> **Wichtig:** Dieses Paar sitzt auf der Seite in einem Vorher-Nachher-Schieber
> – der Effekt funktioniert nur, wenn beide Bilder denselben Bildausschnitt
> zeigen. Erzeuge zuerst `nachher.jpg` und gib es dem Tool anschließend als
> Referenzbild ("same room, same camera angle, before renovation") mit. Firefly
> und Gemini können das über "Bild als Referenz", Midjourney über `--cref` bzw.
> ein vorangestelltes Bild.

---

## 2. Osteria Fontana · Gastronomie (7 Bilder)

**Stilblock:**

```
moody editorial food photography, warm candlelight and low evening light, deep
warm near-black background, cream and terracotta tones, shallow depth of field,
50mm lens, subtle film grain, appetising, no text, no logos, no watermark
```

### `hero.jpg` — Hochformat 4:5
```
A laid dinner table in a small Italian trattoria at night, linen napkins, wine
glasses catching the candlelight, a warm pool of light on the tabletop, the
background falling off into shadow
```

### `kueche.jpg` — Hochformat 5:6
```
A chef's hands finishing a plate at the pass of a small restaurant kitchen,
steam rising, copper pans hanging above, warm tungsten light, dark surroundings,
close and intimate
```

### `abend-1.jpg` — Hochformat 3:4
```
An antipasti plate seen slightly from above, cured ham, olives and grilled
vegetables on rustic ceramic, dark wooden table, a single warm light source
```

### `abend-2.jpg` — Querformat, breite Kachel (16:9)
```
Fresh handmade tagliatelle being served, twirled on the plate, grated parmesan
falling from above, dark wooden table, warm light from the side, wide framing
```

### `abend-3.jpg` — Hochformat 3:4
```
A main course of slow braised meat with a red wine reduction on a rustic plate,
fresh herbs, dark background, warm intimate light
```

### `abend-4.jpg` — Hochformat 3:4
```
Red wine being poured into a glass at a dark table, the wine catching the
candlelight, the bottle blurred in the background
```

### `abend-5.jpg` — Querformat, breite Kachel (16:9)
```
The interior of a small Italian trattoria in the evening, a few occupied tables,
warm pendant lights, brick and plaster walls, guests softly blurred, wide
atmospheric shot
```

---

## 3. Kopfsache Studio · Friseur & Beauty (5 Bilder)

**Stilblock:**

```
high contrast editorial photography, near-black background, crisp studio
lighting with a single hard key light, desaturated palette except skin tones,
one acid lime green accent somewhere in frame, modern urban salon, 85mm lens,
no text, no logos, no watermark
```

### `hero.jpg` — Hochformat 3:4
```
Interior of a modern hair salon, black walls, a styling chair facing a large
mirror, exposed bulbs, a stylist working in the blurred background, one lime
green detail in frame, moody and stylish
```

### `team-1.jpg` — Hochformat 3:4
```
Studio portrait of a female hairstylist in her thirties with a short undercut,
all black clothing, arms crossed, confident and relaxed, hard key light from the
left, near-black background
```

### `team-2.jpg` — Hochformat 3:4
```
Studio portrait of a male hairstylist in his forties with a short beard and
rolled up sleeves, holding scissors, slight smile, near-black background
```

### `team-3.jpg` — Hochformat 3:4
```
Studio portrait of a young female hairstylist with long braided hair, looking
directly into the camera, calm expression, near-black background
```

### `team-4.jpg` — Hochformat 3:4
```
Studio portrait of a male hairstylist in his twenties with bleached blond hair,
plain black t-shirt, hands in his pockets, near-black background
```

---

## 4. Brenner & Kolb Rechtsanwälte · Recht (3 Bilder)

**Stilblock:**

```
restrained architectural interior photography, cool daylight, deep navy and warm
parchment tones with a muted brass accent, calm and understated, uncluttered,
35mm lens, realistic, no text, no logos, no watermark
```

### `hero.jpg` — Hochformat 4:5
```
Reception area of a small German law firm in an old town building, dark panelled
wall, a single leather armchair, tall window with a sheer curtain, soft daylight,
brass detailing, quiet and orderly, nobody in frame
```

### `brenner.jpg` — Hochformat 4:5
```
Business portrait of a female lawyer in her late thirties in a dark blazer,
seated at a desk with her hands folded, neutral friendly expression, soft window
light from the side, blurred office background in navy tones
```

### `kolb.jpg` — Hochformat 4:5
```
Business portrait of a male lawyer in his mid forties in a dark suit without a
tie, standing with relaxed arms, calm confident expression, soft window light,
blurred office background in navy tones, matching the lighting and framing of
the female lawyer portrait
```

---

## 5. Zahnärzte am Königsplatz · Gesundheit (3 Bilder)

**Stilblock:**

```
bright friendly healthcare photography, soft natural daylight, deep green and
warm cream palette with a soft coral accent, calm and reassuring, clean but not
sterile, 35mm lens, realistic, no text, no logos, no watermark
```

### `hero.jpg` — Querformat 16:9
```
A modern dental treatment room, treatment chair beside a large window with
plants, warm wood and deep green surfaces, soft daylight, welcoming rather than
clinical, nobody in frame
```

### `sorg.jpg` — Querformat 4:3
```
Friendly portrait of a female dentist in her late thirties in a light green
scrub top, warm open smile, soft daylight, blurred practice interior behind her
```

### `aydin.jpg` — Querformat 4:3
```
Friendly portrait of a male dentist in his forties in a light green scrub top,
calm warm smile, soft daylight, blurred practice interior, matching the lighting
and framing of the female dentist portrait
```

---

## Hinweise zu den acht Portraits

Die Portraits zeigen erfundene Personen mit erfundenen Namen und Berufen
(Fachanwältin, Zahnarzt). Deshalb:

- **KI-generierte Gesichter sind hier die richtige Wahl.** Ein Stockfoto einer
  echten Person unter einem erfundenen Namen mit erfundener Berufsbezeichnung
  verstößt in der Regel gegen die Stock-Lizenz und ist persönlichkeitsrechtlich
  heikel.
- **Alternative ohne Gesichter:** Aufnahmen bei der Arbeit von hinten oder mit
  unscharfem Gesicht funktionieren gestalterisch genauso – dann entfällt das
  Thema komplett.

## Wenn die Bilder fertig sind

Schick sie mir oder leg sie in die jeweiligen `assets/img/`-Ordner. Ich
übernehme dann:

- Zuschnitt auf das exakte Seitenverhältnis
- Komprimierung fürs Web (Ziel: unter 200 KB pro Bild)
- korrekte `width`/`height`-Angaben im HTML, damit beim Laden nichts springt
- eine Datei `BILDNACHWEIS.md` je Projekt mit Quelle und Lizenz jedes Bildes
