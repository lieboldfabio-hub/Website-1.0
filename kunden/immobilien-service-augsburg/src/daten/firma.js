/*
  Stammdaten.

  Inhalte und Qualifikationen beruhen auf der bestehenden Seite
  immobilien-service-augsburg.de (Stand 14.09.2026), sinngemäß gefasst.
  Alle Texte vor dem Livegang von der Inhaberin freigeben lassen.

  Alles mit `todo: true` ist NICHT bestätigt und muss ersetzt werden.
  Die Oberfläche stellt solche Werte markiert dar, damit sie nicht
  versehentlich live gehen.
*/

export const firma = {
  name: "Immobilien-Service Augsburg",
  inhaberin: "Marion Sens",
  rolle: "Immobilienmaklerin & ImmoMediatorin",
  ort: "Augsburg",
  webseiteAlt: "https://www.immobilien-service-augsburg.de",

  // --- Von der bestehenden Seite übernommen -----------------------------
  telefon: "015152904317",
  telefonLink: "+4915152904317",
  gebiet: "Augsburg Stadt & Land",
  erfahrungJahre: 30,

  // --- Unbestätigt ------------------------------------------------------
  strasse: { wert: "Straße und Hausnummer eintragen", todo: true },
  plz: { wert: "PLZ eintragen", todo: true },
  email: { wert: "E-Mail-Adresse eintragen", todo: true },
  ustIdNr: { wert: "USt-IdNr. eintragen", todo: true },
  aufsichtsbehoerde: { wert: "Erlaubnis §34c GewO: Behörde eintragen", todo: true },
};

/* Die Qualifikationen. Sie stehen im Einstieg und unter „Über mich“. */
export const qualifikationen = [
  "Geprüfte ImmoMediatorin",
  "Diplomierte Immobilienwirtin (FH)",
  "Dipl.-Ing. Innenarchitektin",
  "Zertifizierte MarktWert-Maklerin",
  "Spezialistin für Betreuungsverfahren",
];

/*
  Die sechs Leistungen der bestehenden Seite, jede mit ihrer dortigen Farbe.
  Die Farbzuordnung ist Wiedererkennung — sie bleibt deshalb erhalten.

  `schrift` ist nicht Geschmack, sondern gerechnet: fünf der sechs Farben sind
  so hell, dass weiße Schrift darauf unter 2:1 liegt und praktisch unlesbar
  wird. Nur das Bordeaux der Beratung trägt Weiß (5,06:1). Wer eine Farbe
  ändert, muss den Kontrast neu prüfen — mindestens 4,5:1.
*/
export const leistungen = [
  {
    schluessel: "bewertung",
    titel: "Immobilienbewertung",
    kurz: "Was ist Ihre Immobilie wirklich wert?",
    text: "Aktuelle Wertermittlung auf Basis echter Abschlüsse — mit Blick auf politische, wirtschaftliche und rechtliche Entwicklungen, die den Preis bewegen. Nicht auf Basis von Wunschvorstellungen.",
    farbe: "var(--ton-bewertung)",
    schrift: "#23261f",
  },
  {
    schluessel: "verkauf",
    titel: "Immobilienverkauf",
    kurz: "Von A bis Z in einer Hand",
    text: "Von der Wertermittlung über die Besichtigungen bis zum Notarvertrag bleibe ich Ihre erste Ansprechpartnerin. Kein Wechsel im Team, keine Rückfragen ins Leere.",
    farbe: "var(--ton-verkauf)",
    schrift: "#23261f",
  },
  {
    schluessel: "vermietung",
    titel: "Immobilienvermietung",
    kurz: "Mieter, die bleiben",
    text: "Gestiegene Nachfrage und wenig Neubau haben die Vermietung zu einer organisatorischen Herausforderung gemacht. Auswahl, Bonität, Übergabe — und Menschenkenntnis.",
    farbe: "var(--ton-vermietung)",
    schrift: "#23261f",
  },
  {
    schluessel: "mediation",
    titel: "Immobilienmediation",
    kurz: "Bevor Anwälte nötig werden",
    text: "Es ist immer wieder erstaunlich, wie sich Konflikte um Immobilienbesitz mit einer neutralen Vermittlerin lösen lassen — bei Trennung, Scheidung oder Erbschaft, meist spontan und von allen Beteiligten getragen.",
    farbe: "var(--ton-mediation)",
    schrift: "#23261f",
    hervorgehoben: true,
  },
  {
    schluessel: "betreuung",
    titel: "Betreuungsverfahren",
    kurz: "Wenn das Gericht mitentscheidet",
    text: "Auf den Verkauf im Rahmen von Betreuungsverfahren spezialisiert. Das Betreuungsgericht überwacht den Ablauf und muss zustimmen — das ist zeitintensiv und anspruchsvoll, und genau dafür bin ich da.",
    farbe: "var(--ton-betreuung)",
    schrift: "#23261f",
  },
  {
    schluessel: "beratung",
    titel: "Immobilienberatung",
    kurz: "Fragen, bevor Sie entscheiden",
    text: "Meine Beratung setzt da an, wo bei Käufern und Verkäufern Fragen rund um die Immobilie und den Markt auftauchen. Sprechen Sie mich an, auch wenn noch nichts entschieden ist.",
    farbe: "var(--ton-beratung)",
    schrift: "#ffffff",
  },
];

/* Die drei Lebenslagen, die auf der alten Seite eigens hervorgehoben sind. */
export const lebenslagen = [
  {
    titel: "Scheidung",
    text: "Eine gemeinsame Immobilie muss nicht zum Streitpunkt werden. Als Mediatorin bin ich für beide Seiten da, nicht für eine.",
  },
  {
    titel: "Erbschaft",
    text: "Erbengemeinschaften scheitern selten am Objekt und fast immer am Gespräch. Ich führe es, bevor es vor Gericht geführt wird.",
  },
  {
    titel: "Erbpacht",
    text: "Erbbaurechte sind erklärungsbedürftig und schrecken Käufer ab, wenn sie niemand einordnet. Ich tue es.",
  },
];
