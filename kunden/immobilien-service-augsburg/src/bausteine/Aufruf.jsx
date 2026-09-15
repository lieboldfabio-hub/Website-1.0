import { Link } from "react-router-dom";
import Einblenden from "./Einblenden.jsx";

/* Ein Handlungsaufruf, überall gleich gebaut. */
export default function Aufruf({ ueberzeile, titel, text, knopf, weg, ton = "ruhig" }) {
  return (
    <section className={`aufruf aufruf-${ton}`}>
      <Einblenden className="mitte aufruf-innen">
        {ueberzeile && <p className="ueberzeile">{ueberzeile}</p>}
        <h2>{titel}</h2>
        <p className="aufruf-text">{text}</p>
        <Link className="knopf knopf-voll" to={weg}>{knopf}</Link>
      </Einblenden>
    </section>
  );
}
