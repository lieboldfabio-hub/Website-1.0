import { Link } from "react-router-dom";
import { firma } from "../daten/firma.js";
import { TelefonZeichen } from "../komponenten/Kopfzeile.jsx";

/*
  Das grüne Band mit Aufruf und Telefonnummer.

  Es ist das auffälligste wiederkehrende Element der bestehenden Seite und
  gliedert dort den Inhalt. Hier übernimmt es dieselbe Aufgabe: Es trennt
  die Abschnitte und hält den kürzesten Weg zum Gespräch immer in
  Reichweite, ohne dass jeder Abschnitt einen eigenen Knopf braucht.

  Dunkle Schrift auf dem hellen Grün — 12,2:1. Weiß wäre darauf unlesbar.
*/
export default function Kontaktband({ text = "Beratung vereinbaren", weg = "/kontakt" }) {
  return (
    <div className="kontaktband">
      <div className="mitte kontaktband-innen">
        <Link to={weg} className="kontaktband-aufruf">
          <span aria-hidden="true">→</span> {text}
        </Link>
        <a href={`tel:${firma.telefonLink}`} className="kontaktband-nummer">
          <TelefonZeichen /> {firma.telefon}
        </a>
      </div>
    </div>
  );
}
