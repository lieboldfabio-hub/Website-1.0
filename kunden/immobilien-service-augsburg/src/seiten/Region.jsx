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
        <div className="mitte gebiet-raster" data-bewegung="staffel">
          {region.map((gebiet) => (
            <div className="gebiet-block" key={gebiet.schluessel}>
              <h2>{gebiet.titel}</h2>
              <p className="gebiet-anriss">{gebiet.anriss}</p>
              <ul className="ort-liste" data-bewegung="staffel">
                {gebiet.orte.map((o) => <li key={o}>{o}</li>)}
              </ul>
              <p className="gebiet-zahl">
                {gebiet.orte.length} {gebiet.orte.length === 1 ? "Ort" : "Orte"}
              </p>
            </div>
          ))}
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
