/*
  Stammdaten und Inhalte.

  Grundlage ist der bestehende Auftritt immobilien-service-augsburg.de.
  Die Texte sind neu gefasst, die fachlichen Aussagen bleiben unverändert.

  Was mit `offen: true` markiert ist, liegt nicht vor und wird in der
  Oberfläche sichtbar gekennzeichnet — erfundene Werte kommen hier nicht
  hinein.
*/

export const firma = {
  name: "Immobilien-Service Augsburg",
  inhaberin: "Marion Sens",
  anrede: "Dipl.-Ing. Marion Sens",
  rolle: "Immobilienmaklerin & ImmoMediatorin",

  strasse: "Koloniestraße 4",
  plz: "86199",
  ort: "Augsburg",

  telefon: "01515 2904317",
  telefonLink: "+4915152904317",
  email: { wert: "E-Mail-Adresse der Kanzlei eintragen", offen: true },

  gebiet: "Augsburg Stadt und Land",
  erfahrungJahre: 30,
  webseiteAlt: "https://www.immobilien-service-augsburg.de",
};

/* Qualifikationen — alle von der bestehenden Seite belegt. */
export const qualifikationen = [
  { titel: "Dipl.-Ing. Innenarchitektin", text: "Sieht, was aus einem Raum werden kann — und was ihn im Verkauf zurückhält." },
  { titel: "Diplomierte Immobilienwirtin (FH)", text: "Bewertung und Vermarktung auf fachlicher Grundlage, nicht auf Gefühl." },
  { titel: "Geprüfte ImmoMediatorin", text: "Vermittelt, wo mehrere Parteien über eine Immobilie entscheiden müssen." },
  { titel: "Zertifizierte MarktWert-Maklerin", text: "Wertermittlung nach aktuellen Daten und Berichterstattungen." },
  { titel: "Spezialistin für Betreuungsverfahren", text: "Verkauf unter Aufsicht des Betreuungsgerichts, von Anfang bis Genehmigung." },
];

/* Die Vertrauensargumente direkt unter dem Einstieg. */
export const vertrauen = [
  { zahl: "30+", label: "Jahre Berufserfahrung", text: "Seit über drei Jahrzehnten im Augsburger Immobilienmarkt." },
  { zahl: "5", label: "Qualifikationen", text: "Innenarchitektur, Immobilienwirtschaft, Mediation, Bewertung, Betreuung." },
  { zahl: "1", label: "Ansprechpartnerin", text: "Von der Bewertung bis zum Notartermin dieselbe Person." },
];

/*
  Leistungen. `haupt: true` erscheint auf der Startseite und im Menü,
  die übrigen auf der Leistungsübersicht.
*/
export const leistungen = [
  {
    weg: "/immobilienbewertung",
    titel: "Immobilienbewertung",
    kurz: "Was Ihre Immobilie heute wert ist",
    anriss: "Aktuelle Wertermittlung auf Basis echter Abschlüsse — unter Berücksichtigung der Markt-, wirtschaftlichen und rechtlichen Entwicklungen, die den Preis bewegen.",
    haupt: true,
    punkte: [
      "Ortstermin und Aufnahme des Objekts",
      "Auswertung aktueller Vergleichsdaten der Region",
      "Berücksichtigung rechtlicher und wirtschaftlicher Entwicklungen",
      "Nachvollziehbare schriftliche Einschätzung",
    ],
    text: "Ein Preis entsteht nicht am Schreibtisch. Er entsteht aus dem, was in Augsburg und Umgebung tatsächlich gezahlt wird, aus dem Zustand des Objekts und aus den Rahmenbedingungen, die sich gerade ändern — Zinsen, Förderungen, Anforderungen an die Energie. Als zertifizierte MarktWert-Maklerin arbeite ich mit aktuellen Daten und Berichterstattungen, nicht mit Erfahrungswerten von gestern.",
  },
  {
    weg: "/immobilienverkauf",
    titel: "Immobilienverkauf",
    kurz: "Von A bis Z in einer Hand",
    anriss: "Der gesamte Verkaufsprozess in einer Hand: Wertermittlung, Unterlagen, Vermarktung, Besichtigungen und die Vorbereitung bis zum Notartermin.",
    haupt: true,
    punkte: [
      "Wertermittlung und Preisstrategie",
      "Unterlagen vollständig zusammenstellen",
      "Aufbereitung und Vermarktung des Objekts",
      "Besichtigungen und Auswahl der Interessenten",
      "Vorbereitung bis zum Notartermin",
    ],
    text: "Ein Verkauf scheitert selten am Objekt und oft an Lücken: fehlende Unterlagen, unklare Zuständigkeiten, Interessenten, die nach der dritten Nachfrage abspringen. Ich bereite den Verkauf vollständig vor und bleibe von der ersten Einschätzung bis zum Notartermin Ihre Ansprechpartnerin. Kein Wechsel im Team, keine Rückfragen ins Leere.",
  },
  {
    weg: "/immobilienvermietung",
    titel: "Immobilienvermietung",
    kurz: "Mieter, die bleiben",
    anriss: "Mietersuche, Auswahl geeigneter Interessenten, Vorbereitung und Vertragsabwicklung — mit Blick auf ein Mietverhältnis, das trägt.",
    haupt: true,
    punkte: [
      "Aufbereitung und Ausschreibung der Wohnung",
      "Vorauswahl und Prüfung der Interessenten",
      "Besichtigungen und Auskünfte",
      "Vertragsabwicklung und Übergabe",
    ],
    text: "Gestiegene Nachfrage und wenig Neubau haben die Vermietung zu einer organisatorischen Herausforderung gemacht. Auf eine Anzeige kommen heute Dutzende Zuschriften. Die Aufgabe ist nicht, Interessenten zu finden, sondern die richtigen auszuwählen — und dafür braucht es neben Unterlagen auch Menschenkenntnis.",
  },
  {
    weg: "/immobilienmediation",
    titel: "Immobilienmediation",
    kurz: "Bevor Anwälte nötig werden",
    anriss: "Wenn mehrere Parteien über eine Immobilie entscheiden müssen — bei Trennung, Scheidung, Erbschaft oder im Betreuungsverfahren.",
    haupt: true,
    punkte: [
      "Neutrale Vermittlung zwischen allen Beteiligten",
      "Trennung und Scheidung",
      "Erbengemeinschaften",
      "Betreuungsverfahren mit Beteiligung des Gerichts",
    ],
    text: "Es ist immer wieder erstaunlich, wie sich Konflikte um Immobilienbesitz mit einer neutralen Vermittlerin lösen lassen — in der Regel von allen Beteiligten getragen und schneller, als ein Verfahren dauern würde. Als geprüfte ImmoMediatorin bin ich für beide Seiten da, nicht für eine.",
  },
  {
    weg: "/beratung",
    titel: "Immobilienberatung",
    kurz: "Fragen, bevor Sie entscheiden",
    anriss: "Individuelle Beratung rund um Immobilie, Markt und Ihre persönliche Situation — auch wenn noch nichts entschieden ist.",
    haupt: true,
    punkte: [
      "Einschätzung Ihrer Ausgangslage",
      "Fragen zu Markt, Preis und Zeitpunkt",
      "Einordnung von Erbbaurecht, Teilung, Sanierungsbedarf",
      "Erstgespräch ohne Verpflichtung",
    ],
    text: "Meine Beratung setzt da an, wo bei Käufern und Verkäufern Fragen rund um die Immobilie und den Markt auftauchen. Manche davon klären sich in einem Gespräch, andere brauchen einen Ortstermin. Beides ist besser, als eine Entscheidung auf gut Glück zu treffen.",
  },
  {
    weg: "/wohnflaechenberechnung",
    titel: "Wohnflächenberechnung",
    kurz: "Die Zahl, an der alles hängt",
    anriss: "Nachvollziehbare Berechnung der Wohnfläche nach anerkannten Regeln — Grundlage für Preis, Miete und Nebenkosten.",
    punkte: [
      "Aufmaß vor Ort",
      "Berechnung nach anerkannten Regeln",
      "Dachschrägen, Balkone und Terrassen korrekt gewichtet",
      "Dokumentation für Unterlagen und Verträge",
    ],
    text: "Die Wohnfläche steht in jedem Exposé, in jedem Mietvertrag und in jeder Nebenkostenabrechnung. Ist sie falsch, zieht sich der Fehler durch alles. Als Innenarchitektin nehme ich das Aufmaß selbst vor und dokumentiere die Berechnung so, dass sie nachvollziehbar bleibt.",
  },
  {
    weg: "/grundrisse",
    titel: "Grundrisse",
    kurz: "Was Interessenten zuerst ansehen",
    anriss: "Erstellung sauberer, verständlicher Grundrisse — das Erste, was ernsthafte Interessenten in einem Exposé suchen.",
    punkte: [
      "Aufmaß und Zeichnung",
      "Klare, maßstabsgetreue Darstellung",
      "Möblierungsvorschlag auf Wunsch",
      "Format für Exposé und Unterlagen",
    ],
    text: "Ein Grundriss beantwortet in fünf Sekunden, wofür Fotos zwanzig Bilder brauchen: wie die Räume zueinander liegen. Fehlt er oder ist er unleserlich, springen Interessenten ab, bevor sie anrufen.",
  },
  {
    weg: "/energieausweis",
    titel: "Energieausweis",
    kurz: "Pflicht bei jedem Angebot",
    anriss: "Beschaffung und Einordnung des Energieausweises — gesetzlich vorgeschrieben für jedes Verkaufs- und Mietangebot.",
    punkte: [
      "Klärung, welcher Ausweis nötig ist",
      "Beschaffung der Unterlagen",
      "Pflichtangaben für Anzeige und Exposé",
      "Einordnung der Werte für Interessenten",
    ],
    text: "Ohne gültigen Energieausweis darf eine Immobilie weder inseriert noch besichtigt werden; die Pflichtangaben gehören bereits in die Anzeige. Ich kläre, welcher Ausweis für Ihr Objekt der richtige ist, und sorge dafür, dass er rechtzeitig vorliegt.",
  },
  {
    weg: "/unterlagen",
    titel: "Unterlagen & Dokumente",
    kurz: "Vollständig, bevor es zählt",
    anriss: "Zusammenstellung aller Unterlagen, die für Verkauf oder Vermietung gebraucht werden — vollständig und rechtzeitig.",
    punkte: [
      "Grundbuchauszug, Flurkarte, Baulastenverzeichnis",
      "Bauunterlagen und Baubeschreibung",
      "Teilungserklärung und Protokolle bei Eigentum",
      "Nachweise zu Sanierungen und Modernisierungen",
    ],
    text: "Unterlagen sind der unspektakulärste und zuverlässigste Grund, warum sich ein Verkauf um Monate verzögert. Vieles muss bei Ämtern und Verwaltungen angefordert werden und hat Vorlaufzeit. Ich kümmere mich früh darum, damit am Ende nichts fehlt.",
  },
  {
    weg: "/innenarchitektur",
    titel: "Innenarchitektur & Feng Shui",
    kurz: "Räume, die ihr Potenzial zeigen",
    anriss: "Beratung zur Raumwirkung vor dem Verkauf, auf Wunsch mit Feng-Shui-Prinzipien — und Unterstützung bei der Suche nach Handwerkern.",
    punkte: [
      "Einschätzung der Raumwirkung vor der Vermarktung",
      "Vorschläge zu Aufteilung, Licht und Farbe",
      "Feng Shui auf Wunsch",
      "Unterstützung bei der Suche nach Handwerkern",
    ],
    text: "Vieles, was einen Raum drückt, lässt sich mit geringem Aufwand ändern — ein anderer Bodenbelag, eine Wand weniger, mehr Licht an der richtigen Stelle. Als Innenarchitektin sehe ich das, bevor die ersten Interessenten kommen. Und wenn Handwerker nötig sind, helfe ich, welche zu finden.",
  },
];

export const hauptleistungen = leistungen.filter((l) => l.haupt);
export const weitereLeistungen = leistungen.filter((l) => !l.haupt);

/* Die Lebenslagen, die auf der bestehenden Seite eigens hervorgehoben sind. */
export const lebenslagen = [
  { titel: "Scheidung", text: "Eine gemeinsame Immobilie muss nicht zum Streitpunkt werden. Als Mediatorin bin ich für beide Seiten da." },
  { titel: "Erbschaft", text: "Erbengemeinschaften scheitern selten am Objekt und fast immer am Gespräch. Ich führe es, bevor es vor Gericht geführt wird." },
  { titel: "Erbpacht", text: "Erbbaurechte sind erklärungsbedürftig und schrecken Käufer ab, wenn sie niemand einordnet." },
  { titel: "Betreuung", text: "Beim Verkauf im Betreuungsverfahren überwacht das Gericht den Ablauf und muss zustimmen. Darauf bin ich eingerichtet." },
];

/* Einsatzgebiet. Die Orte stammen von der bestehenden Seite. */
export const region = {
  stadt: [
    "Göggingen", "Pfersee", "Hochzoll", "Haunstetten", "Kriegshaber",
    "Lechhausen", "Bismarckviertel", "Antonsviertel", "Firnhaberau",
    "Hammerschmiede", "Hochfeld", "Inningen", "Univiertel", "Spickel-Herrenbach",
  ],
  umland: [
    "Friedberg", "Bobingen", "Königsbrunn", "Mering", "Kissing",
    "Neusäß", "Stadtbergen", "Leitershofen", "Bergheim", "Straßberg",
  ],
};

/*
  Kundenstimmen.

  Hier steht ausschließlich, was belegt ist. Die bestehende Seite führt
  weitere Google-Rezensionen; sie gehören ergänzt, sobald sie im Wortlaut
  vorliegen. Erfundene Bewertungen kommen nicht hinein — bei einem realen
  Unternehmen wäre das nicht nur unredlich, sondern wettbewerbswidrig.
*/
export const stimmen = [
  {
    text: "Als gesetzlicher Betreuer hatte ich mehrmals Unterstützung von Frau Sens bei der Veräußerung von Immobilien. Dabei ist zu beachten, dass solche Verkäufe kompliziert sind, es muss das Betreuungsgericht mit eingebunden werden. Frau Sens konnte durch ihre freundliche, sozial kompetente Art und ihr hohes Fachwissen zur Abwicklung der Geschäfte beitragen.",
    quelle: "Betreuungsbüro Alberth, Augsburg",
  },
];
