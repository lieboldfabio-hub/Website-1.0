import { Link } from "react-router-dom";
import { firma, qualifikationen, leistungen } from "../daten/firma.js";
import { stationen } from "../daten/ausstellung.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Aufruf from "../bausteine/Aufruf.jsx";
import Querfahrt from "../komponenten/Querfahrt.jsx";
import Motiv from "../bausteine/Motiv.jsx";

export default function Ausstellung() {
  useSeitenkopf("/ausstellung");

  return (
    <>
      <section className="aus-einstieg">
        <div className="mitte">
          <p className="ueberzeile">Die Ausstellung</p>
          <h1>Immobilien neu betrachtet.</h1>
          <p className="vorspann">
            Eine Immobilie ist mehr als eine Zahl im Exposé. Sie ist ein Ort,
            ein Vermögenswert und oft eine Entscheidung, die mehrere Menschen
            betrifft. Diese Ausstellung zeigt die Arbeit dahinter — Raum für
            Raum.
          </p>
          <div className="knopf-reihe">
            <a className="knopf knopf-voll" href="#ausstellung">Ausstellung entdecken</a>
            <Link className="knopf knopf-linie" to="/kontakt">Beratung vereinbaren</Link>
          </div>
          <p className="aus-hinweis">
            Scrollen Sie weiter — die Ausstellung bewegt sich seitlich mit.
          </p>
        </div>
      </section>

      <div id="ausstellung">
        <Querfahrt
          variante="raum"
          beschriftung="Ausstellung"
          stationen={stationen.map((s) => ({
            nummer: s.nummer,
            marke: s.kategorie,
            titel: s.titel,
            text: s.text,
            weg: s.weg,
            aufruf: s.aufruf,
            motiv: s.motiv,
            ton: leistungen.find((l) => l.weg === s.weg)?.ton,
          }))}
        />
      </div>

      <section className="abschnitt">
        <div className="mitte">
          <div className="abschnitt-kopf">
            <p className="ueberzeile">Immobilien & Architektur</p>
            <h2>Worauf ich beim Betreten eines Hauses zuerst schaue</h2>
          </div>

          <div className="architektur-raster" data-bewegung="staffel">
            <div className="arch-block">
              <h3>Raumgefühl</h3>
              <p>
                Ob ein Raum trägt, entscheidet sich selten an der Quadratmeterzahl.
                Es entscheidet sich an der Höhe, am Lichteinfall und daran, wie
                die Räume zueinander liegen. Als Innenarchitektin sehe ich das,
                bevor die ersten Interessenten kommen.
              </p>
            </div>
            <div className="arch-block">
              <h3>Substanz</h3>
              <p>
                Baujahr, Bauweise und Zustand bestimmen, was an einer Immobilie
                möglich ist und was sie in den nächsten Jahren kostet. Beides
                gehört auf den Tisch, bevor über einen Preis gesprochen wird.
              </p>
            </div>
            <div className="arch-block">
              <h3>Lage</h3>
              <p>
                Der Augsburger Markt ist kleinteilig. Lechhausen und das
                Bismarckviertel folgen unterschiedlichen Regeln, im Umland
                entscheidet oft die Anbindung. Wer hier bewertet, muss die
                Straßen kennen, nicht nur die Statistik.
              </p>
            </div>
            <div className="arch-block">
              <h3>Unterlagen</h3>
              <p>
                Grundriss, Wohnflächenberechnung, Energieausweis: die
                unspektakulärsten Dokumente sind der häufigste Grund, warum
                sich ein Verkauf um Monate verzögert. Sie gehören früh
                zusammengestellt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="abschnitt kompetenz">
        <div className="mitte kompetenz-raster">
          <div className="kompetenz-text" data-bewegung="heben">
            <p className="ueberzeile">Kompetenz</p>
            <h2>Vier Berufe, die zusammengehören</h2>
            <p>
              Innenarchitektur, Immobilienwirtschaft, Mediation und
              Marktwertermittlung sind selten in einer Person vereint. Genau
              in den schwierigen Fällen ist diese Verbindung entscheidend:
              Wenn eine Immobilie zugleich ein Raum, ein Vermögenswert und ein
              Streitpunkt ist.
            </p>
            <Link className="knopf knopf-linie" to="/ueber-mich">
              Mehr über {firma.inhaberin}
            </Link>
          </div>

          <ul className="kompetenz-liste" data-bewegung="staffel">
            {qualifikationen.map((q) => (
              <li key={q.titel}>
                <strong>{q.titel}</strong>
                <span>{q.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Aufruf
        ueberzeile="Beratung"
        titel="Ihre Immobilie verdient eine persönliche Betrachtung."
        text="Kein Formular ersetzt einen Ortstermin. Sagen Sie mir, worum es geht — ich melde mich innerhalb eines Werktags."
        knopf="Beratung vereinbaren"
        weg="/kontakt"
        ton="dunkel"
      />
    </>
  );
}
