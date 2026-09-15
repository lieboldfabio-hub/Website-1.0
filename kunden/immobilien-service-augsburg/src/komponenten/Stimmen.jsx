import { useState } from "react";
import { stimmen } from "../daten/firma.js";
import Einblenden from "../bausteine/Einblenden.jsx";

/*
  Rückmeldungen als eine große, gesetzte Aussage statt als Kachelreihe.

  Liegt mehr als eine Stimme vor, blättert man mit den Punkten darunter
  weiter — es wird nichts weggescrollt, nur der Text getauscht. Die Höhe des
  Blocks richtet sich nach der längsten Stimme, damit beim Blättern nichts
  springt: alle liegen übereinander im selben Raster, nur die aktive ist
  sichtbar.
*/
export default function Stimmen({ ueberzeile = "Rückmeldungen", titel = "Was Auftraggeber sagen" }) {
  const [aktiv, setAktiv] = useState(0);
  if (stimmen.length === 0) return null;

  return (
    <section className="abschnitt stimmen">
      <div className="mitte">
        <div className="abschnitt-kopf">
          <p className="ueberzeile">{ueberzeile}</p>
          <h2>{titel}</h2>
        </div>

        <Einblenden className="stimmen-buehne">
          {stimmen.map((s, i) => (
            <figure
              className="stimme"
              key={s.quelle}
              aria-hidden={i === aktiv ? undefined : "true"}
              data-aktiv={i === aktiv ? "" : undefined}
            >
              <blockquote>
                <p>{s.text}</p>
              </blockquote>
              <figcaption>
                {s.kontext && <span className="stimme-kontext">{s.kontext}</span>}
                <span className="stimme-quelle">{s.quelle}</span>
              </figcaption>
            </figure>
          ))}
        </Einblenden>

        {stimmen.length > 1 && (
          <div className="stimmen-punkte" role="tablist" aria-label="Rückmeldungen">
            {stimmen.map((s, i) => (
              <button
                key={s.quelle}
                type="button"
                role="tab"
                aria-selected={i === aktiv}
                aria-label={`Rückmeldung ${i + 1} von ${stimmen.length}`}
                className={i === aktiv ? "ist-aktiv" : undefined}
                onClick={() => setAktiv(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
