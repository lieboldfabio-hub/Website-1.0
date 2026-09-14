import Einblenden from "./Einblenden.jsx";
import { leistungen } from "../daten/firma.js";

/*
  Sechs Leistungen, jede in ihrer Farbe von der bestehenden Seite. Die
  Farbzuordnung ist dort die Wiedererkennung — wer die alte Seite kennt,
  findet sich hier sofort zurecht.
*/
export default function Leistungen() {
  return (
    <section id="leistungen" className="abschnitt leistungen">
      <div className="abschnitt-kopf">
        <p className="ueberzeile">Was ich tue</p>
        <h2>Sechs Wege, an denen ich Sie begleite</h2>
      </div>

      <ul className="leistungs-liste">
        {leistungen.map((l, i) => (
          <Einblenden
            als="li"
            key={l.schluessel}
            verzug={(i % 3) * 0.08}
            style={{ "--ton": l.farbe, "--ton-schrift": l.schrift }}
            className={l.hervorgehoben ? "ist-hervorgehoben" : undefined}
          >
            <span className="leistungs-pille">{l.titel}</span>
            <h3>{l.kurz}</h3>
            <p>{l.text}</p>
          </Einblenden>
        ))}
      </ul>
    </section>
  );
}
