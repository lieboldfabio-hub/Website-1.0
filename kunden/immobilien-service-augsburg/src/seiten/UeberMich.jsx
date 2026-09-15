import { Link } from "react-router-dom";
import { firma, qualifikationen } from "../daten/firma.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Seitenkopf from "../bausteine/Seitenkopf.jsx";
import Einblenden from "../bausteine/Einblenden.jsx";
import Stimmen from "../komponenten/Stimmen.jsx";
import Bildflaeche from "../bausteine/Bildflaeche.jsx";
import Aufruf from "../bausteine/Aufruf.jsx";

export default function UeberMich() {
  useSeitenkopf("/ueber-mich");

  return (
    <>
      <Seitenkopf
        ueberzeile="Über mich"
        titel="Marion Sens"
        vorspann={`${firma.rolle} in Augsburg — seit über ${firma.erfahrungJahre} Jahren.`}
      />

      <section className="abschnitt">
        <div className="mitte person-raster">
          <figure className="person-bild">
            <Bildflaeche
              src="/marion-sens.jpg"
              alt={`${firma.anrede}, ${firma.rolle}`}
              breite="720" hoehe="900"
              fehltText="Porträtfoto fehlt"
            />
          </figure>

          <div className="person-text">
            <h2>Vier Berufe, eine Aufgabe</h2>
            <p>
              Ich bin Innenarchitektin, Immobilienwirtin, Mediatorin und
              Maklerin. Diese Verbindung ist selten, und sie ist kein Zufall:
              Eine Immobilie ist zugleich ein Raum, ein Vermögenswert und
              häufig ein Gegenstand, über den mehrere Menschen einig werden
              müssen.
            </p>
            <p>
              Als Innenarchitektin sehe ich, was aus einem Haus werden kann
              und was es im Verkauf zurückhält. Als Immobilienwirtin weiß ich,
              was es wert ist. Als geprüfte Mediatorin kann ich vermitteln,
              wenn mehrere darüber entscheiden müssen — bei einer Trennung,
              in einer Erbengemeinschaft oder im Betreuungsverfahren.
            </p>
            <p>
              In über {firma.erfahrungJahre} Jahren in Augsburg Stadt und Land
              habe ich gelernt, dass hinter jedem Objekt eine Entscheidung
              steht, die jemandem schwerfällt. Deshalb nehme ich mir Zeit,
              bevor ein Schild im Garten steht.
            </p>
          </div>
        </div>
      </section>

      <section className="abschnitt abschnitt-ruhig">
        <div className="mitte">
          <div className="abschnitt-kopf">
            <p className="ueberzeile">Qualifikationen</p>
            <h2>Worauf die Arbeit fachlich steht</h2>
          </div>
          <ul className="qualifikations-raster" data-bewegung="staffel">
            {qualifikationen.map((q) => (
              <li key={q.titel}>
                <h3>{q.titel}</h3>
                <p>{q.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Stimmen ueberzeile="Rückmeldungen" titel="Womit Auftraggeber gekommen sind" />

      <Aufruf
        titel="Lernen wir uns kennen."
        text="Sie haben eine individuelle Situation? Lassen Sie uns darüber sprechen — unverbindlich und ohne Zeitdruck."
        knopf="Beratung vereinbaren"
        weg="/kontakt"
        ton="dunkel"
      />
    </>
  );
}
