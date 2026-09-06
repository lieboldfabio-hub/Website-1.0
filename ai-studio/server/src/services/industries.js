"use strict";

/*
  Branchen-Bibliothek fuer den KI-Medien-Generator.

  Fuenf Branchen sind an ein bestehendes Beispielprojekt unter beispiele/
  gekoppelt (projectSlug + slots): dort erwartet jede Seite ein Bild unter
  einem exakten Dateinamen in assets/img/ - sobald es dort liegt, ersetzt
  die Seite den Markenplatzhalter automatisch, ganz ohne Code-Aenderung
  (siehe beispiele/BILDPROMPTS.md). Die Slot-Namen, Seitenverhaeltnisse und
  Stilbloecke hier sind exakt aus dieser Datei uebernommen, damit neu
  erzeugte Bilder zur bestehenden Bildserie jedes Projekts passen.

  Vier weitere Branchen aus der Anfrage (Fitness, Immobilien, Autohaus,
  Hotel) haben noch kein Beispielprojekt im Repo. Sie bekommen generische
  Bildplaetze ohne festen Dateinamen - erzeugte Medien lassen sich trotzdem
  herunterladen und fuer ein kuenftiges Projekt verwenden.
*/

const INDUSTRIES = [
  {
    slug: "handwerker",
    label: "Handwerker",
    teaser: "Elektro, Sanitär, Renovierung – dokumentarisch und technisch sauber",
    projectSlug: "halbritter-haustechnik",
    defaultStyleBlock:
      "documentary photography, natural daylight, clean and technical mood, " +
      "muted graphite grey and off-white palette with a single cool blue " +
      "accent, sharp focus, 35mm lens, realistic",
    videoStyleBlock:
      "documentary-style handheld footage, natural daylight, steady focused " +
      "shots of skilled manual work, calm and trustworthy pacing, no music cues implied",
    subjectPresets: [
      { id: "installation", label: "Installation/Montage", promptFragment: "A tradesman in dark workwear carefully installing technical equipment in a modern home, hands and tools in sharp focus" },
      { id: "team", label: "Team bei der Arbeit", promptFragment: "A small team of tradespeople working together on site, organised tools, focused collaboration" },
      { id: "ergebnis", label: "Fertiges Ergebnis", promptFragment: "A newly finished, spotless technical installation in a modern home, clean lines, well lit" },
    ],
    slots: [
      { id: "hero", filename: "hero.jpg", aspect: "4:5", label: "Startseite – Held", description: "Handwerker bei konzentrierter Arbeit" },
      { id: "nachher", filename: "nachher.jpg", aspect: "16:10", label: "Vorher/Nachher – Nachher", description: "Fertig renoviertes Bad, aufgeraeumt" },
      { id: "vorher", filename: "vorher.jpg", aspect: "16:10", label: "Vorher/Nachher – Vorher", description: "Gleicher Blickwinkel wie 'nachher', unrenoviert" },
    ],
  },
  {
    slug: "restaurant",
    label: "Restaurant",
    teaser: "Gastronomie – stimmungsvolle, appetitanregende Food-Fotografie",
    projectSlug: "osteria-fontana",
    defaultStyleBlock:
      "moody editorial food photography, warm candlelight and low evening " +
      "light, deep warm near-black background, cream and terracotta tones, " +
      "shallow depth of field, 50mm lens, subtle film grain, appetising",
    videoStyleBlock:
      "cinematic food and restaurant footage, warm candlelight, slow " +
      "deliberate camera moves, steam and texture in close-up, intimate evening atmosphere",
    subjectPresets: [
      { id: "gericht", label: "Angerichtetes Gericht", promptFragment: "A beautifully plated dish seen close up on a dark wooden table, a single warm light source" },
      { id: "kueche", label: "Küche/Zubereitung", promptFragment: "A chef's hands finishing a plate at the pass of a small restaurant kitchen, steam rising, warm tungsten light" },
      { id: "raum", label: "Gastraum am Abend", promptFragment: "The interior of a small restaurant in the evening, warm pendant lights, guests softly blurred in the background" },
    ],
    slots: [
      { id: "hero", filename: "hero.jpg", aspect: "4:5", label: "Startseite – Held", description: "Gedeckter Tisch am Abend" },
      { id: "kueche", filename: "kueche.jpg", aspect: "5:6", label: "Küche", description: "Chef bei der Zubereitung" },
      { id: "abend-1", filename: "abend-1.jpg", aspect: "3:4", label: "Abend – Vorspeise", description: "Antipasti-Teller von oben" },
      { id: "abend-2", filename: "abend-2.jpg", aspect: "16:9", label: "Abend – Pasta (breit)", description: "Frische Pasta beim Servieren" },
      { id: "abend-3", filename: "abend-3.jpg", aspect: "3:4", label: "Abend – Hauptgang", description: "Geschmortes Fleisch mit Sauce" },
      { id: "abend-4", filename: "abend-4.jpg", aspect: "3:4", label: "Abend – Wein", description: "Rotwein wird eingeschenkt" },
      { id: "abend-5", filename: "abend-5.jpg", aspect: "16:9", label: "Abend – Gastraum (breit)", description: "Gastraum am Abend, atmosphärisch" },
    ],
  },
  {
    slug: "friseur",
    label: "Friseur & Beauty",
    teaser: "Salon – hochkontrastig, modern, urbaner Beauty-Fokus",
    projectSlug: "kopfsache-studio",
    defaultStyleBlock:
      "high contrast editorial photography, near-black background, crisp " +
      "studio lighting with a single hard key light, desaturated palette " +
      "except skin tones, one acid lime green accent somewhere in frame, " +
      "modern urban salon, 85mm lens",
    videoStyleBlock:
      "high contrast studio video, hard key light, confident deliberate " +
      "movement, close-ups of hands, scissors and hair in motion, modern urban energy",
    subjectPresets: [
      { id: "styling", label: "Styling in Aktion", promptFragment: "A hairstylist working on a client's hair in a modern salon chair, focused expression, dramatic studio lighting" },
      { id: "portrait", label: "Team-Portrait", promptFragment: "Studio portrait of a hairstylist against a near-black background, confident pose, hard key light from the side" },
      { id: "interieur", label: "Salon-Interieur", promptFragment: "Interior of a modern hair salon, black walls, styling chairs facing large mirrors, exposed bulbs" },
    ],
    slots: [
      { id: "hero", filename: "hero.jpg", aspect: "3:4", label: "Startseite – Held", description: "Salon-Interieur mit Stylist" },
      { id: "team-1", filename: "team-1.jpg", aspect: "3:4", label: "Team 1", description: "Portrait Stylistin" },
      { id: "team-2", filename: "team-2.jpg", aspect: "3:4", label: "Team 2", description: "Portrait Stylist" },
      { id: "team-3", filename: "team-3.jpg", aspect: "3:4", label: "Team 3", description: "Portrait Stylistin" },
      { id: "team-4", filename: "team-4.jpg", aspect: "3:4", label: "Team 4", description: "Portrait Stylist" },
    ],
  },
  {
    slug: "arztpraxis",
    label: "Arztpraxis",
    teaser: "Gesundheit – hell, freundlich, seriös statt klinisch",
    projectSlug: "zahnaerzte-koenigsplatz",
    defaultStyleBlock:
      "bright friendly healthcare photography, soft natural daylight, deep " +
      "green and warm cream palette with a soft coral accent, calm and " +
      "reassuring, clean but not sterile, 35mm lens, realistic",
    videoStyleBlock:
      "bright reassuring healthcare footage, soft natural daylight, gentle " +
      "steady camera moves, calm and professional pacing, welcoming rather than clinical",
    subjectPresets: [
      { id: "behandlung", label: "Behandlungsraum", promptFragment: "A modern medical treatment room beside a large window with plants, warm wood and calm surfaces, nobody in frame" },
      { id: "team", label: "Team-Portrait", promptFragment: "Friendly portrait of a doctor in a light scrub top, warm open smile, soft daylight, blurred practice interior" },
      { id: "empfang", label: "Empfang/Wartebereich", promptFragment: "A bright, welcoming medical practice reception area, plants, natural light, uncluttered" },
    ],
    slots: [
      { id: "hero", filename: "hero.jpg", aspect: "4:5", label: "Startseite – Held", description: "Behandlungsraum am Fenster" },
      { id: "sorg", filename: "sorg.jpg", aspect: "4:3", label: "Team 1", description: "Portrait Ärztin" },
      { id: "aydin", filename: "aydin.jpg", aspect: "4:3", label: "Team 2", description: "Portrait Arzt" },
    ],
  },
  {
    slug: "recht",
    label: "Recht & Beratung",
    teaser: "Kanzlei – zurückhaltend, seriös, vertrauensbildend",
    projectSlug: "brenner-kolb-recht",
    defaultStyleBlock:
      "restrained architectural interior photography, cool daylight, deep " +
      "navy and warm parchment tones with a muted brass accent, calm and " +
      "understated, uncluttered, 35mm lens, realistic",
    videoStyleBlock:
      "restrained corporate footage, cool daylight, slow static or gently " +
      "moving shots, calm and understated pacing, no people rushing",
    subjectPresets: [
      { id: "empfang", label: "Empfangsbereich", promptFragment: "Reception area of a small law firm in an old town building, dark panelled wall, a single leather armchair, soft daylight, nobody in frame" },
      { id: "portrait", label: "Anwalts-Portrait", promptFragment: "Business portrait of a lawyer at a desk, hands folded, neutral friendly expression, soft window light, blurred office background in navy tones" },
      { id: "buero", label: "Büro/Besprechung", promptFragment: "A quiet, orderly law firm meeting room, dark wood table, soft daylight through tall windows" },
    ],
    slots: [
      { id: "hero", filename: "hero.jpg", aspect: "4:5", label: "Startseite – Held", description: "Empfangsbereich" },
      { id: "brenner", filename: "brenner.jpg", aspect: "4:3", label: "Team 1", description: "Portrait Anwältin" },
      { id: "kolb", filename: "kolb.jpg", aspect: "4:3", label: "Team 2", description: "Portrait Anwalt" },
    ],
  },
  {
    slug: "fitness",
    label: "Fitnessstudio",
    teaser: "Dynamisch, modern, starke Kontraste, energiegeladen",
    projectSlug: null,
    defaultStyleBlock:
      "dynamic high-energy sports photography, dramatic gym lighting with " +
      "strong contrast, deep charcoal background, sweat and motion frozen " +
      "in sharp focus, bold and modern, 50mm lens",
    videoStyleBlock:
      "dynamic sports footage, fast confident camera moves, dramatic " +
      "lighting, high energy training sequences, strong rhythm and motion",
    subjectPresets: [
      { id: "training", label: "Training in Bewegung", promptFragment: "An athlete mid-movement lifting weights in a modern gym, sweat visible, dramatic side lighting, motion frozen in sharp focus" },
      { id: "gruppenkurs", label: "Gruppenkurs", promptFragment: "A small group fitness class in a modern studio, synchronized movement, dramatic gym lighting, high energy" },
      { id: "interieur", label: "Studio-Interieur", promptFragment: "Interior of a modern fitness studio, industrial design, bold lighting, premium equipment arranged cleanly" },
    ],
    slots: [
      { id: "hero", filename: null, aspect: "16:9", label: "Startseite – Held", description: "Dynamische Trainingsszene" },
      { id: "interieur", filename: null, aspect: "4:3", label: "Studio-Interieur", description: "Trainingsbereich" },
      { id: "detail", filename: null, aspect: "1:1", label: "Detail", description: "Ausrüstung/Nahaufnahme" },
      { id: "team", filename: null, aspect: "4:5", label: "Trainer-Portrait", description: "Portrait Trainer:in" },
    ],
  },
  {
    slug: "immobilien",
    label: "Immobilien",
    teaser: "Minimalistisch, seriös, Premium, großzügige Bildsprache",
    projectSlug: null,
    defaultStyleBlock:
      "minimalist architectural photography, clean geometric lines, soft " +
      "natural daylight, neutral warm grey and white palette, premium and " +
      "uncluttered, wide angle, high dynamic range, realistic",
    videoStyleBlock:
      "minimalist architectural footage, slow smooth camera moves (dolly or " +
      "gimbal), soft natural daylight, premium and calm pacing, clean geometric framing",
    subjectPresets: [
      { id: "aussen", label: "Außenansicht", promptFragment: "A modern high-end residential building exterior at golden hour, clean geometric lines, landscaped surroundings" },
      { id: "interieur", label: "Wohninterieur", promptFragment: "A bright, minimalist living room interior with floor-to-ceiling windows, premium natural materials, soft daylight" },
      { id: "detail", label: "Architektur-Detail", promptFragment: "A close-up architectural detail, premium natural materials, soft daylight, minimalist composition" },
    ],
    slots: [
      { id: "hero", filename: null, aspect: "16:9", label: "Startseite – Held", description: "Außenansicht Premium-Immobilie" },
      { id: "interieur", filename: null, aspect: "4:3", label: "Interieur", description: "Wohnraum" },
      { id: "detail", filename: null, aspect: "1:1", label: "Detail", description: "Architektur-Detail" },
      { id: "team", filename: null, aspect: "4:5", label: "Makler-Portrait", description: "Portrait Makler:in" },
    ],
  },
  {
    slug: "autohaus",
    label: "Autohaus",
    teaser: "Hochwertige Fahrzeug- und Lifestyle-Bilder",
    projectSlug: null,
    defaultStyleBlock:
      "premium automotive photography, dramatic studio or golden hour " +
      "lighting, glossy reflective surfaces, deep neutral background, " +
      "precise sharp focus, wide angle, commercial quality",
    videoStyleBlock:
      "premium automotive footage, slow orbiting or tracking camera moves, " +
      "dramatic lighting on glossy surfaces, confident and sleek pacing",
    subjectPresets: [
      { id: "fahrzeug", label: "Fahrzeug im Studio", promptFragment: "A modern car photographed in a premium studio setting, dramatic lighting on glossy surfaces, deep neutral background" },
      { id: "showroom", label: "Showroom", promptFragment: "Interior of a modern car showroom, clean lines, premium lighting, vehicles arranged elegantly" },
      { id: "detail", label: "Fahrzeug-Detail", promptFragment: "A close-up detail shot of a car's design element, dramatic reflective lighting, premium quality" },
    ],
    slots: [
      { id: "hero", filename: null, aspect: "16:9", label: "Startseite – Held", description: "Fahrzeug im Studio" },
      { id: "interieur", filename: null, aspect: "4:3", label: "Showroom", description: "Innenansicht Autohaus" },
      { id: "detail", filename: null, aspect: "1:1", label: "Detail", description: "Fahrzeug-Detail" },
      { id: "team", filename: null, aspect: "4:5", label: "Berater-Portrait", description: "Portrait Verkaufsberater:in" },
    ],
  },
  {
    slug: "hotel",
    label: "Hotel",
    teaser: "Reise- und Hotelfotografie, einladend und hochwertig",
    projectSlug: null,
    defaultStyleBlock:
      "elevated travel and hospitality photography, warm natural light, " +
      "inviting premium interiors, soft neutral and warm tones, wide angle, " +
      "realistic, aspirational but calm",
    videoStyleBlock:
      "elevated hospitality footage, warm natural light, slow smooth camera " +
      "moves through inviting spaces, calm aspirational pacing",
    subjectPresets: [
      { id: "zimmer", label: "Zimmer/Suite", promptFragment: "A bright, elegant hotel room interior with soft natural light, premium linens, calm and inviting" },
      { id: "lobby", label: "Lobby/Empfang", promptFragment: "A warm, inviting hotel lobby with premium furnishings, soft ambient light, welcoming atmosphere" },
      { id: "aussenbereich", label: "Außenbereich/Pool", promptFragment: "A hotel terrace or pool area at golden hour, inviting premium atmosphere, soft warm light" },
    ],
    slots: [
      { id: "hero", filename: null, aspect: "16:9", label: "Startseite – Held", description: "Einladende Hotelszene" },
      { id: "interieur", filename: null, aspect: "4:3", label: "Zimmer/Lobby", description: "Innenansicht" },
      { id: "detail", filename: null, aspect: "1:1", label: "Detail", description: "Ambiente-Detail" },
      { id: "team", filename: null, aspect: "4:5", label: "Team-Portrait", description: "Portrait Empfang/Service" },
    ],
  },
];

function all() {
  return INDUSTRIES;
}

function bySlug(slug) {
  return INDUSTRIES.find((i) => i.slug === slug) || null;
}

function slotFor(industrySlug, slotId) {
  const industry = bySlug(industrySlug);
  if (!industry) return null;
  return industry.slots.find((s) => s.id === slotId) || null;
}

module.exports = { all, bySlug, slotFor };
