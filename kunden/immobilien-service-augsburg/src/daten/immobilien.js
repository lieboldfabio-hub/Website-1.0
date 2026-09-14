/*
  Die Objekte, die der Showroom zeigt.

  BILDER: `bild` zeigt auf eine Datei unter `public/immobilien/`.
  Fehlt die Datei, erzeugt der Showroom automatisch eine erkennbare
  Platzhalter-Textur — die Ausstellung bleibt also immer bespielt.
  Genau das war bei der Vorlage kaputt: ein leerer Showroom.

  Diese Objekte sind BEISPIELDATEN zum Aufbau der Seite. Vor dem Livegang
  durch echte Angebote ersetzen.
*/

export const immobilien = [
  {
    slug: "stadthaus-am-hochfeld",
    titel: "Stadthaus am Hochfeld",
    lage: "Augsburg-Hochfeld",
    art: "Reihenendhaus",
    zimmer: 5,
    flaeche: 148,
    grundstueck: 310,
    baujahr: 1962,
    preis: 745000,
    bild: "/immobilien/stadthaus-am-hochfeld.jpg",
    text: "Ruhige Lage, gewachsener Garten, kurze Wege in die Innenstadt. Das Haus wurde 2018 energetisch saniert und ist sofort bezugsfertig.",
    todo: true,
  },
  {
    slug: "altbauwohnung-bleich",
    titel: "Altbauwohnung an der Bleich",
    lage: "Augsburg-Innenstadt",
    art: "Etagenwohnung",
    zimmer: 3,
    flaeche: 96,
    baujahr: 1908,
    preis: 489000,
    bild: "/immobilien/altbauwohnung-bleich.jpg",
    text: "Stuck, Dielen, drei Meter Raumhöhe. Saniert mit Respekt vor dem Bestand, mit Blick über die Dächer.",
    todo: true,
  },
  {
    slug: "landhaus-aystetten",
    titel: "Landhaus Aystetten",
    lage: "Aystetten",
    art: "Einfamilienhaus",
    zimmer: 6,
    flaeche: 212,
    grundstueck: 890,
    baujahr: 1994,
    preis: 1120000,
    bild: "/immobilien/landhaus-aystetten.jpg",
    text: "Grundstück in zweiter Reihe, nach Süden offen. Wintergarten, Kamin, doppelte Garage.",
    todo: true,
  },
  {
    slug: "neubau-goeggingen",
    titel: "Neubau Göggingen",
    lage: "Augsburg-Göggingen",
    art: "Erstbezug",
    zimmer: 4,
    flaeche: 118,
    baujahr: 2024,
    preis: 695000,
    bild: "/immobilien/neubau-goeggingen.jpg",
    text: "KfW-40-Standard, Wärmepumpe, Fußbodenheizung. Übergabe schlüsselfertig, Tiefgaragenplatz inklusive.",
    todo: true,
  },
  {
    slug: "hofstelle-dillingen",
    titel: "Hofstelle bei Dillingen",
    lage: "Landkreis Dillingen",
    art: "Bauernhaus",
    zimmer: 8,
    flaeche: 265,
    grundstueck: 2400,
    baujahr: 1871,
    preis: 580000,
    bild: "/immobilien/hofstelle-dillingen.jpg",
    text: "Denkmalgeschütztes Hauptgebäude mit Stadel. Für alle, die Platz brauchen und keine Angst vor Handwerk haben.",
    todo: true,
  },
  {
    slug: "penthouse-textilviertel",
    titel: "Penthouse im Textilviertel",
    lage: "Augsburg-Textilviertel",
    art: "Penthouse",
    zimmer: 4,
    flaeche: 164,
    baujahr: 2016,
    preis: 1340000,
    bild: "/immobilien/penthouse-textilviertel.jpg",
    text: "Dachterrasse nach zwei Seiten, bodentiefe Fenster, eigener Aufzug bis in die Wohnung.",
    todo: true,
  },
];

export const preisFormat = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
