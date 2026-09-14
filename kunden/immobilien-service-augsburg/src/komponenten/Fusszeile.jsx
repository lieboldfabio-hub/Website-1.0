import { Link } from "react-router-dom";
import { firma } from "../daten/firma.js";

export default function Fusszeile() {
  return (
    <footer className="fusszeile">
      <div className="fusszeile-oben">
        <div>
          <p className="marke-text">
            <strong>{firma.inhaberin}</strong>
            <span>{firma.rolle}</span>
          </p>
          <p className="fusszeile-satz">
            Bewertung, Verkauf, Vermietung, Mediation, Betreuungsverfahren und
            Beratung — für {firma.gebiet}.
          </p>
          <a className="fusszeile-telefon" href={`tel:${firma.telefonLink}`}>
            <span aria-hidden="true">☏</span> {firma.telefon}
          </a>
        </div>

        <nav aria-label="Rechtliches">
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
          <a href="#inhalt">Nach oben</a>
        </nav>
      </div>

      <p className="fusszeile-unten">
        © {new Date().getFullYear()} {firma.name} · {firma.inhaberin}
      </p>
    </footer>
  );
}
