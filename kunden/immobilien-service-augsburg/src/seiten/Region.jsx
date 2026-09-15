import { Link } from "react-router-dom";
import { firma, region } from "../daten/firma.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Seitenkopf from "../bausteine/Seitenkopf.jsx";
import Einblenden from "../bausteine/Einblenden.jsx";
import Aufruf from "../bausteine/Aufruf.jsx";

export default function Region() {
  useSeitenkopf("/region");

  return (
    <>
      <Seitenkopf
        ueberzeile="Einsatzgebiet"
        titel="Augsburg Stadt und Land"
        vorspann="Regionale Marktkenntnis heißt: wissen, warum zwei gleich große Wohnungen in zwei Stadtteilen unterschiedlich viel wert sind."
      />

      <section className="abschnitt">
        <div className="mitte gebiet-raster">
          <Einblenden className="gebiet-block">
            <h2>Augsburg Stadt</h2>
            <ul className="ort-liste">
              {region.stadt.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </Einblenden>

          <Einblenden className="gebiet-block" verzug={80}>
            <h2>Umgebung und Landkreis</h2>
            <ul className="ort-liste">
              {region.umland.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </Einblenden>
        </div>

        <div className="mitte gebiet-text">
          <p>
            Diese Liste ist keine Werbefläche, sondern eine Arbeitsgrundlage.
            Der Augsburger Markt ist kleinteilig: Lechhausen und das
            Bismarckviertel folgen unterschiedlichen Regeln, und im Umland
            entscheidet oft die Anbindung über den Preis. Wer hier bewertet,
            muss die Straßen kennen und nicht nur die Statistik.
          </p>
          <p>
            Ihr Ort ist nicht dabei? Sprechen Sie mich an — vieles im
            weiteren Umkreis lässt sich einrichten.{" "}
            <Link to="/kontakt">Zum Kontakt</Link>.
          </p>
        </div>
      </section>

      <Aufruf
        ueberzeile="Standort und Wert"
        titel={`Was ist Ihre Immobilie in ${firma.ort} wert?`}
        text="Eine Einschätzung auf Basis echter Abschlüsse in Ihrer Lage — nicht auf Basis überregionaler Durchschnittswerte."
        knopf="Immobilie bewerten lassen"
        weg="/immobilienbewertung"
      />
    </>
  );
}
