/*
  Eine Zeile je Seite: Adresse, Titel, Beschreibung.

  Das ist zugleich die einzige Quelle für das Menü und für den Linktest.
  Eine Seite, die hier nicht steht, gibt es nicht — damit kann kein Menüpunkt
  auf eine Adresse zeigen, die niemand angelegt hat.
*/
import { leistungen } from "./daten/firma.js";

const ORT = "Augsburg";

export const seiten = [
  {
    weg: "/",
    titel: `Immobilienmaklerin ${ORT} — Marion Sens`,
    beschreibung:
      "Immobilienmaklerin in Augsburg mit über 30 Jahren Erfahrung: Bewertung, Verkauf, Vermietung, Beratung und Immobilienmediation. Persönlich und regional.",
    menue: null,
  },
  {
    weg: "/leistungen",
    titel: `Leistungen — Immobilienmaklerin ${ORT}`,
    beschreibung:
      "Immobilienbewertung, Verkauf, Vermietung, Beratung und Mediation in Augsburg, dazu Wohnflächenberechnung, Grundrisse, Energieausweis und Unterlagen.",
    menue: "Leistungen",
  },
  ...leistungen.map((l) => ({
    weg: l.weg,
    titel: `${l.titel} ${ORT} — Marion Sens`,
    beschreibung: l.anriss,
    menue: null,
    untermenue: l.titel,
  })),
  {
    weg: "/region",
    titel: `Einsatzgebiet — Immobilien ${ORT} Stadt und Land`,
    beschreibung:
      "Einsatzgebiet: Augsburger Stadtteile von Göggingen bis Lechhausen sowie Friedberg, Königsbrunn, Neusäß, Mering und das weitere Umland.",
    menue: "Region",
  },
  {
    weg: "/ueber-uns",
    titel: `Marion Sens — Immobilienmaklerin und ImmoMediatorin`,
    beschreibung:
      "Dipl.-Ing. Innenarchitektin, diplomierte Immobilienwirtin, geprüfte ImmoMediatorin und zertifizierte MarktWert-Maklerin mit über 30 Jahren Berufserfahrung.",
    menue: "Über mich",
  },
  {
    weg: "/kontakt",
    titel: `Kontakt — Immobilienmaklerin ${ORT}`,
    beschreibung:
      "Immobilien-Service Augsburg, Marion Sens, Koloniestraße 4, 86199 Augsburg. Telefon 01515 2904317. Erstgespräch ohne Verpflichtung.",
    menue: "Kontakt",
  },
  {
    weg: "/impressum",
    titel: "Impressum — Immobilien-Service Augsburg",
    beschreibung:
      "Anbieterkennzeichnung nach § 5 DDG für Immobilien-Service Augsburg, Dipl.-Ing. Marion Sens, Koloniestraße 4, 86199 Augsburg.",
    menue: null,
  },
  {
    weg: "/datenschutz",
    titel: "Datenschutzerklärung — Immobilien Augsburg",
    beschreibung:
      "Hinweise zur Verarbeitung personenbezogener Daten beim Besuch dieser Website und bei Anfragen über das Kontaktformular.",
    menue: null,
  },
  {
    weg: "/barrierefreiheit",
    titel: "Barrierefreiheit — Immobilien Augsburg",
    beschreibung:
      "Was diese Website für die Bedienbarkeit umsetzt: Kontraste, Tastaturbedienung, reduzierte Bewegung — und was noch offen ist.",
    menue: null,
  },
];

export const menuepunkte = seiten.filter((s) => s.menue);
export const alleWege = seiten.map((s) => s.weg);

export function metaFuer(weg) {
  return seiten.find((s) => s.weg === weg);
}
