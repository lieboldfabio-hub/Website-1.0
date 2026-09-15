import { Link } from "react-router-dom";
import { hauptleistungen, weitereLeistungen } from "../daten/firma.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Einblenden from "../bausteine/Einblenden.jsx";
import Aufruf from "../bausteine/Aufruf.jsx";
import Seitenkopf from "../bausteine/Seitenkopf.jsx";

export default function Leistungsuebersicht() {
  useSeitenkopf("/leistungen");

  return (
    <>
      <Seitenkopf
        ueberzeile="Leistungen"
        titel="Alles rund um Ihre Immobilie"
        vorspann="Von der ersten Einschätzung bis zum Notartermin — und in den Fällen, in denen mehr nötig ist als eine Vermarktung."
      />

      <section className="abschnitt">
        <div className="mitte">
          <h2 className="gruppen-titel">Kernleistungen</h2>
          <ul className="leistungs-raster">
            {hauptleistungen.map((l, i) => (
              <Einblenden als="li" key={l.weg} verzug={(i % 3) * 60}>
                <Link to={l.weg}>
                  <h3>{l.titel}</h3>
                  <p className="leistungs-kurz">{l.kurz}</p>
                  <p>{l.anriss}</p>
                  <span className="mehr-zeichen">Mehr dazu</span>
                </Link>
              </Einblenden>
            ))}
          </ul>

          <h2 className="gruppen-titel gruppen-titel-zweit">Weitere Leistungen</h2>
          <ul className="leistungs-raster leistungs-raster-schlank">
            {weitereLeistungen.map((l, i) => (
              <Einblenden als="li" key={l.weg} verzug={(i % 3) * 60}>
                <Link to={l.weg}>
                  <h3>{l.titel}</h3>
                  <p>{l.anriss}</p>
                  <span className="mehr-zeichen">Mehr dazu</span>
                </Link>
              </Einblenden>
            ))}
          </ul>
        </div>
      </section>

      <Aufruf
        ueberzeile="Unklar, was Sie brauchen?"
        titel="Sagen Sie mir, worum es geht."
        text="Ein Erstgespräch kostet nichts und verpflichtet zu nichts. Oft klärt sich in zwanzig Minuten, was sonst wochenlang offen bleibt."
        knopf="Kontakt aufnehmen"
        weg="/kontakt"
      />
    </>
  );
}
