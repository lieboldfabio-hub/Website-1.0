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
  {
    zahl: "30+",
    label: "Jahre Erfahrung",
    text: "Langjährige Erfahrung in Bewertung, Verkauf und Vermietung.",
  },
  {
    zahl: "24",
    label: "Orte im Gebiet",
    text: "Augsburg und die umliegende Region aus langjähriger Tätigkeit.",
  },
  {
    zahl: "1",
    label: "Ansprechpartnerin",
    text: "Eine feste Ansprechpartnerin vom ersten Gespräch bis zum Abschluss.",
  },
  {
    zahl: "4",
    label: "Fachgebiete",
    text: "Immobilienwirtschaft, Innenarchitektur, Marktwertermittlung und Mediation, miteinander verbunden.",
  },
];

/*
  Der Verkaufsprozess in acht Schritten.

  Er macht sichtbar, was zwischen „Ich möchte verkaufen" und dem Schlüssel
  in fremder Hand tatsächlich passiert — und wo die Arbeit steckt, die
  Eigentümer selten sehen.
*/
export const verkaufsschritte = [
  { nr: "01", titel: "Bewertung", text: "Ortstermin, Aufnahme des Objekts, belastbare Einschätzung des Marktwerts." },
  { nr: "02", titel: "Vorbereitung", text: "Unterlagen zusammenstellen: Grundbuch, Flurkarte, Bauakte, Energieausweis." },
  { nr: "03", titel: "Vermarktung", text: "Exposé, Grundrisse, Fotos, Anzeigen mit allen gesetzlichen Pflichtangaben." },
  { nr: "04", titel: "Interessenten", text: "Anfragen sichten, Ernsthaftigkeit und Finanzierung klären, vorauswählen." },
  { nr: "05", titel: "Besichtigungen", text: "Termine begleiten, Fragen beantworten, Rückmeldungen einholen." },
  { nr: "06", titel: "Verhandlung", text: "Angebote bewerten, Bedingungen klären, Preis und Termine abstimmen." },
  { nr: "07", titel: "Notartermin", text: "Kaufvertrag vorbereiten, Entwurf prüfen, Beurkundung begleiten." },
  { nr: "08", titel: "Übergabe", text: "Zählerstände, Schlüssel, Protokoll — und der Abschluss ist wirklich abgeschlossen." },
];

/*
  Leistungen. `haupt: true` erscheint auf der Startseite und im Showroom,
  die übrigen auf der Leistungsübersicht.

  `ton` ist die Farbe, die die bestehende Seite dieser Leistung gibt. Dort
  trägt sie die Wiedererkennung — wer die alte Seite kennt, findet sich über
  die Farbe zurecht. Sie bleibt deshalb erhalten.

  Fünf der sechs Töne sind zu hell für weiße Schrift (unter 2:1). Schrift auf
  diesen Flächen ist deshalb dunkel; nur das Bordeaux der Beratung trägt
  Weiß. Wer eine Farbe ändert, rechnet den Kontrast neu: mindestens 4,5:1.
*/
export const leistungen = [
  {
    weg: "/immobilienbewertung",
    ton: "var(--ton-bewertung)",
    tonSchrift: "#1d2b30",
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
    ton: "var(--ton-verkauf)",
    tonSchrift: "#3a2c10",
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
    ton: "var(--ton-vermietung)",
    tonSchrift: "#1f2733",
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
    ton: "var(--ton-mediation)",
    tonSchrift: "#24261f",
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
    weg: "/betreuungsverfahren",
    ton: "var(--ton-betreuung)",
    tonSchrift: "#2b2a14",
    titel: "Betreuungsverfahren",
    kurz: "Wenn das Gericht mitentscheidet",
    anriss: "Verkauf einer Immobilie im Rahmen eines Betreuungsverfahrens — unter Aufsicht und mit Zustimmung des Betreuungsgerichts.",
    haupt: true,
    punkte: [
      "Abstimmung mit Betreuerin oder Betreuer",
      "Wertermittlung, die vor Gericht Bestand hat",
      "Vollständige Unterlagen für den Genehmigungsantrag",
      "Begleitung bis zur Genehmigung durch das Gericht",
    ],
    text: "Steht eine Immobilie im Eigentum einer betreuten Person, entscheidet nicht allein der Betreuer: Das Betreuungsgericht überwacht den gesamten Ablauf und muss dem Verkauf zustimmen. Das macht die Arbeit zeitintensiv, formell und anspruchsvoll — Wertermittlung und Unterlagen müssen einer gerichtlichen Prüfung standhalten. Auf genau diese Fälle bin ich spezialisiert, und Betreuungsbüros arbeiten seit Jahren aus diesem Grund mit mir.",
  },
  {
    weg: "/beratung",
    ton: "var(--ton-beratung)",
    tonSchrift: "#ffffff",
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
    ton: "var(--ton-betreuung)",
    tonSchrift: "#2b2a14",
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
    ton: "var(--ton-weiteres)",
    tonSchrift: "#1f2415",
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
    ton: "var(--ton-betreuung)",
    tonSchrift: "#2b2a14",
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
    ton: "var(--ton-weiteres)",
    tonSchrift: "#1f2415",
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
    ton: "var(--ton-bewertung)",
    tonSchrift: "#1d2b30",
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

/*
  Besondere Situationen.

  Die bestehende Seite hebt diese Fälle eigens hervor, und zu Recht: Hier
  sucht jemand nicht nach einem Makler, sondern nach einem Weg aus einer
  Lage. Jede Situation bekommt deshalb eine Erklärung und einen eigenen
  nächsten Schritt.
*/
export const lebenslagen = [
  {
    titel: "Scheidung und Trennung",
    text: "Eine gemeinsame Immobilie muss nicht zum Streitpunkt werden. Ob verkauft, übernommen oder vermietet wird, ist zuerst eine Frage der Verständigung — und dann eine des Preises. Als geprüfte Mediatorin bin ich für beide Seiten da, nicht für eine.",
    weg: "/immobilienmediation",
    aufruf: "Zur Mediation",
  },
  {
    titel: "Erbschaft",
    text: "Erbengemeinschaften scheitern selten am Objekt und fast immer am Gespräch. Solange alle Beteiligten einig sind, ist der Verkauf unkompliziert; danach wird er teuer. Ich führe das Gespräch, bevor es vor Gericht geführt wird.",
    weg: "/immobilienmediation",
    aufruf: "Zur Mediation",
  },
  {
    titel: "Betreuungsverfahren",
    text: "Steht eine Immobilie im Eigentum einer betreuten Person, überwacht das Betreuungsgericht den Verkauf und muss zustimmen. Wertermittlung und Unterlagen müssen einer gerichtlichen Prüfung standhalten. Darauf bin ich spezialisiert.",
    weg: "/betreuungsverfahren",
    aufruf: "Zu Betreuungsverfahren",
  },
  {
    titel: "Erbbaurecht",
    text: "Erbbaurechte sind erklärungsbedürftig: Restlaufzeit, Erbbauzins und Heimfall entscheiden über den Wert. Wer sie nicht einordnet, schreckt Käufer ab oder verkauft zu billig.",
    weg: "/immobilienbewertung",
    aufruf: "Zur Bewertung",
  },
  {
    titel: "Das Haus wird zu groß",
    text: "Wenn die Kinder aus dem Haus sind oder Treppen zum Hindernis werden, steht selten nur ein Verkauf an, sondern ein ganzer Lebensabschnitt. Dafür braucht es Zeit und jemanden, der zuhört, bevor er rechnet.",
    weg: "/beratung",
    aufruf: "Zur Beratung",
  },
  {
    titel: "Veränderte Lebenssituation",
    text: "Ein neuer Beruf, eine Pflegesituation, ein Umzug in eine andere Stadt: Manche Entscheidungen lassen sich nicht aufschieben. Dann zählt, dass der Verkauf zuverlässig und ohne Nachfragen läuft.",
    weg: "/immobilienverkauf",
    aufruf: "Zum Verkauf",
  },
];

/*
  Einsatzgebiet. Die Orte stammen von der bestehenden Seite, sind hier aber
  nach Gebietskörperschaft sortiert statt in eine lange Liste geworfen:
  Stadtteile Augsburgs, Landkreis Augsburg, Landkreis Aichach-Friedberg.
  Bergheim ist ein Stadtteil Augsburgs und steht darum oben, Leitershofen
  gehört zu Stadtbergen, Straßberg zu Bobingen.
*/
export const region = [
  {
    schluessel: "stadt",
    titel: "Augsburg — Stadtteile",
    anriss:
      "Der Augsburger Markt ist kleinteilig. Zwei gleich große Wohnungen in zwei Stadtteilen sind selten gleich viel wert.",
    orte: [
      "Antonsviertel", "Bergheim", "Bismarckviertel", "Firnhaberau",
      "Göggingen", "Hammerschmiede", "Haunstetten", "Hochfeld", "Hochzoll",
      "Inningen", "Kriegshaber", "Lechhausen", "Pfersee",
      "Spickel-Herrenbach", "Univiertel",
    ],
  },
  {
    schluessel: "landkreis-a",
    titel: "Landkreis Augsburg",
    anriss:
      "Westlich und südlich der Stadt. Hier entscheidet oft die Anbindung über den Preis, nicht die Quadratmeterzahl.",
    orte: [
      "Bobingen", "Königsbrunn", "Leitershofen", "Neusäß", "Stadtbergen",
      "Straßberg",
    ],
  },
  {
    schluessel: "landkreis-af",
    titel: "Landkreis Aichach-Friedberg",
    anriss:
      "Östlich des Lechs. Eigener Markt mit eigenem Tempo — und eigenen Vergleichswerten.",
    orte: ["Friedberg", "Kissing", "Mering"],
  },
];

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
    kontext: "Immobilienverkauf im Betreuungsverfahren",
    quelle: "Betreuungsbüro Alberth, Augsburg",
  },
];
