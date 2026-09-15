import { useLocation, Link, Navigate } from "react-router-dom";
import { leistungen, firma } from "../daten/firma.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Seitenkopf from "../bausteine/Seitenkopf.jsx";
import Einblenden from "../bausteine/Einblenden.jsx";
import Aufruf from "../bausteine/Aufruf.jsx";
import Kontaktband from "../bausteine/Kontaktband.jsx";

/*
  Eine Vorlage für alle zehn Leistungsseiten. Die Adresse kommt aus den
  Daten, nicht aus einer zweiten Liste — damit gibt es zu jeder Leistung
  im Menü auch eine Seite, und umgekehrt.
*/
export default function Leistungsseite() {
  const { pathname } = useLocation();
  const weg = pathname;
  const l = leistungen.find((x) => x.weg === weg);

  useSeitenkopf(weg);

  if (!l) return <Navigate to="/leistungen" replace />;

  const andere = leistungen.filter((x) => x.weg !== weg).slice(0, 3);

  return (
    <div style={{ "--ton": l.ton, "--ton-schrift": l.tonSchrift }}>
      <Seitenkopf
        ueberzeile="Leistung"
        titel={l.titel}
        vorspann={l.anriss}
        ueber={{ weg: "/leistungen", name: "Leistungen" }}
      />

      <section className="abschnitt">
        <div className="mitte leistung-raster">
          <div className="leistung-text">
            <h2>Worum es geht</h2>
            <p>{l.text}</p>

            <h2>Was dazugehört</h2>
            <ul className="haken-liste">
              {l.punkte.map((p) => <li key={p}>{p}</li>)}
            </ul>

            <div className="knopf-reihe">
              <Link className="knopf knopf-voll" to="/kontakt">Beratung vereinbaren</Link>
              <a className="knopf knopf-linie" href={`tel:${firma.telefonLink}`}>
                {firma.telefon}
              </a>
            </div>
          </div>

          <aside className="leistung-rand">
            <Einblenden className="rand-karte">
              <h2>Kurz gefasst</h2>
              <p>{l.kurz}</p>
              <dl>
                <div><dt>Gebiet</dt><dd>{firma.gebiet}</dd></div>
                <div><dt>Erfahrung</dt><dd>{firma.erfahrungJahre}+ Jahre</dd></div>
                <div><dt>Ansprechpartnerin</dt><dd>{firma.inhaberin}</dd></div>
              </dl>
            </Einblenden>
          </aside>
        </div>
      </section>

      <Kontaktband />

      <section className="abschnitt abschnitt-ruhig">
        <div className="mitte">
          <h2 className="gruppen-titel">Könnte ebenfalls passen</h2>
          <ul className="leistungs-raster leistungs-raster-schlank">
            {andere.map((a) => (
              <li key={a.weg} style={{ "--ton": a.ton, "--ton-schrift": a.tonSchrift }}>
                <span className="karten-band" aria-hidden="true" />
                <Link to={a.weg}>
                  <h3>{a.titel}</h3>
                  <p>{a.anriss}</p>
                  <span className="mehr-zeichen">Mehr dazu</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Aufruf
        titel="Sprechen wir darüber."
        text="Ein erstes Gespräch kostet nichts und verpflichtet zu nichts. Ich melde mich innerhalb eines Werktags."
        knopf="Kontakt aufnehmen"
        weg="/kontakt"
        ton="dunkel"
      />
    </div>
  );
}
