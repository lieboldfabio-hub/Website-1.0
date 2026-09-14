import Einblenden from "./Einblenden.jsx";
import { lebenslagen } from "../daten/firma.js";

/*
  Scheidung, Erbschaft, Erbpacht — auf der alten Seite eigens hervorgehoben,
  und zu Recht: Das sind die Fälle, in denen jemand gezielt nach Hilfe sucht
  und nicht nach einem Makler.
*/
export default function Lebenslagen() {
  return (
    <section id="besonderheiten" className="abschnitt lebenslagen">
      <div className="abschnitt-kopf">
        <p className="ueberzeile">Besonderheiten beim Immobilienverkauf</p>
        <h2>Wenn es nicht nur um den Preis geht</h2>
      </div>

      <ul className="lebenslagen-liste">
        {lebenslagen.map((l, i) => (
          <Einblenden als="li" key={l.titel} verzug={i * 0.09}>
            <h3>{l.titel}</h3>
            <p>{l.text}</p>
          </Einblenden>
        ))}
      </ul>
    </section>
  );
}
