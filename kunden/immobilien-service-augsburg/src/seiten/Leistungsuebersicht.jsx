import { Link } from "react-router-dom";
import { hauptleistungen, weitereLeistungen } from "../daten/firma.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Einblenden from "../bausteine/Einblenden.jsx";
import Querfahrt from "../komponenten/Querfahrt.jsx";
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

      {/* Die sechs Kernleistungen laufen seitwärts vorbei — dieselbe
          Mechanik wie in der Ausstellung, aber hell und in ihrer eigenen
          Farbe. Die weiteren Leistungen bleiben darunter ein Raster: sie
          heißen nicht ohne Grund „weitere". */}
      <Querfahrt
        variante="hell"
        beschriftung="Kernleistungen"
        stationen={hauptleistungen.map((l, i) => ({
          nummer: String(i + 1).padStart(2, "0"),
          titel: l.titel,
          claim: l.kurz,
          text: l.anriss,
          weg: l.weg,
          aufruf: "Mehr dazu",
          motiv: l.weg,
          ton: l.ton,
          tonSchrift: l.tonSchrift,
        }))}
      />

      <section className="abschnitt">
        <div className="mitte">
          <h2 className="gruppen-titel gruppen-titel-zweit">Weitere Leistungen</h2>
          <ul className="leistungs-raster leistungs-raster-schlank">
            {weitereLeistungen.map((l, i) => (
              <Einblenden als="li" key={l.weg} verzug={(i % 3) * 60}
                style={{ "--ton": l.ton, "--ton-schrift": l.tonSchrift }}>
                <Link to={l.weg}>
                  <span className="karten-band" aria-hidden="true" />
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
