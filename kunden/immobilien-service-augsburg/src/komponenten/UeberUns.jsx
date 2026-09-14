import Einblenden from "./Einblenden.jsx";
import { firma, qualifikationen } from "../daten/firma.js";

export default function UeberUns() {
  return (
    <section id="ueber-mich" className="abschnitt ueber-mich">
      <Einblenden className="ueber-mich-raum">
        <div className="ueber-mich-text">
          <p className="ueberzeile">Über mich</p>
          <h2>Ich kenne die Straßen, nicht nur die Postleitzahlen.</h2>
          <p>
            Über {firma.erfahrungJahre} Jahre Immobilien in Augsburg Stadt und Land —
            und in dieser Zeit habe ich gelernt, dass hinter jedem Objekt eine
            Entscheidung steht, die jemandem schwerfällt. Ein Umzug, ein Erbe,
            eine Trennung, ein Anfang.
          </p>
          <p>
            Als Innenarchitektin sehe ich, was aus einem Haus werden kann. Als
            Immobilienwirtin weiß ich, was es wert ist. Als geprüfte Mediatorin
            kann ich vermitteln, wenn mehrere darüber entscheiden müssen. Diese
            drei Dinge zusammen sind selten — und genau in den schwierigen
            Fällen entscheidend.
          </p>

          <ul className="qualifikations-liste">
            {qualifikationen.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>

        <dl className="kennzahlen">
          <div>
            <dt>Berufserfahrung</dt>
            <dd>{firma.erfahrungJahre}+ Jahre</dd>
          </div>
          <div>
            <dt>Einsatzgebiet</dt>
            <dd>{firma.gebiet}</dd>
          </div>
          <div>
            <dt>Schwerpunkt</dt>
            <dd>Wohnimmobilien</dd>
          </div>
        </dl>
      </Einblenden>
    </section>
  );
}
