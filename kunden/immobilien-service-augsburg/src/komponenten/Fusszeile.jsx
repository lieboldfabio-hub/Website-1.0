import { Link } from "react-router-dom";
import { firma, hauptleistungen, weitereLeistungen } from "../daten/firma.js";
import Signet from "../bausteine/Signet.jsx";
import { TelefonZeichen } from "./Kopfzeile.jsx";

export default function Fusszeile() {
  return (
    <footer className="fusszeile">
      <div className="mitte fusszeile-raster">
        <div className="fusszeile-marke">
          <Link to="/" className="marke">
            <Signet groesse={34} />
            <span className="marke-text">
              <strong>{firma.inhaberin}</strong>
              <span>Immobilien {firma.ort}</span>
            </span>
          </Link>
          <p>
            Immobilienmaklerin und ImmoMediatorin für {firma.gebiet}.
            Bewertung, Verkauf, Vermietung, Beratung und Mediation —
            seit über {firma.erfahrungJahre} Jahren.
          </p>
        </div>

        <nav aria-label="Leistungen">
          <h2>Leistungen</h2>
          <ul>
            {hauptleistungen.map((l) => (
              <li key={l.weg}><Link to={l.weg}>{l.titel}</Link></li>
            ))}
            <li><Link to="/leistungen">Alle Leistungen</Link></li>
          </ul>
        </nav>

        <nav aria-label="Weitere Leistungen">
          <h2>Weiteres</h2>
          <ul>
            {weitereLeistungen.map((l) => (
              <li key={l.weg}><Link to={l.weg}>{l.titel}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="fusszeile-kontakt">
          <h2>Kontakt</h2>
          <address>
            {firma.name}
            <br />
            {firma.anrede}
            <br />
            {firma.strasse}
            <br />
            {firma.plz} {firma.ort}
          </address>
          <a className="fusszeile-anruf" href={`tel:${firma.telefonLink}`}>
            <TelefonZeichen /> {firma.telefon}
          </a>
          <Link className="knopf knopf-linie klein" to="/kontakt">Nachricht schreiben</Link>
        </div>
      </div>

      <div className="mitte fusszeile-unten">
        <p>© {new Date().getFullYear()} {firma.name} · {firma.anrede}</p>
        <nav aria-label="Rechtliches">
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
          <Link to="/barrierefreiheit">Barrierefreiheit</Link>
        </nav>
      </div>
    </footer>
  );
}
