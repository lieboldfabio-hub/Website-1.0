import { Link } from "react-router-dom";
import { hauptleistungen } from "../daten/firma.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";

export default function NichtGefunden() {
  useSeitenkopf("/404", {
    titel: "Seite nicht gefunden",
    beschreibung: "Diese Adresse gibt es nicht.",
  });

  return (
    <section className="abschnitt nicht-gefunden">
      <div className="mitte fliesstext">
        <p className="ueberzeile">Fehler 404</p>
        <h1>Diese Seite gibt es nicht.</h1>
        <p>
          Möglicherweise hat sich die Adresse geändert. Diese Wege führen weiter:
        </p>
        <ul className="haken-liste">
          <li><Link to="/">Startseite</Link></li>
          <li><Link to="/leistungen">Alle Leistungen</Link></li>
          {hauptleistungen.slice(0, 3).map((l) => (
            <li key={l.weg}><Link to={l.weg}>{l.titel}</Link></li>
          ))}
          <li><Link to="/kontakt">Kontakt</Link></li>
        </ul>
      </div>
    </section>
  );
}
