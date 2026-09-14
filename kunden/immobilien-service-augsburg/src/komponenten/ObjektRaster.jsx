import { Link } from "react-router-dom";
import { preisFormat } from "../daten/immobilien.js";

/*
  Die Objekte als gewöhnliche Karten.

  Zwei Aufgaben: Rückfallebene, wenn der Showroom nicht laufen kann
  (kein WebGL, reduzierte Bewegung), und zugleich die Fassung, die
  Suchmaschinen und Screenreader lesen. Deshalb echte Links und echte
  Überschriften, kein Klick-Handler auf einem <div>.
*/
export default function ObjektRaster({ objekte, schlicht = false }) {
  return (
    <ul className={schlicht ? "objekt-liste schlicht" : "objekt-liste"}>
      {objekte.map((o) => (
        <li key={o.slug} className="objekt-karte">
          <Link to={`/immobilie/${o.slug}`}>
            {!schlicht && (
              <span className="objekt-bild">
                <img
                  src={o.bild}
                  alt={`${o.art} in ${o.lage}`}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="400"
                  onError={(e) => {
                    // Fehlt das Foto, bleibt eine beschriftete Fläche stehen
                    // statt eines kaputten Bildsymbols.
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.dataset.fehlt = "Foto fehlt";
                  }}
                />
              </span>
            )}
            <span className="objekt-lage">{o.lage}</span>
            <h3>{o.titel}</h3>
            <p className="objekt-daten">
              {o.art} · {o.flaeche} m² · {o.zimmer} Zimmer · Baujahr {o.baujahr}
            </p>
            <p className={`objekt-preis${o.todo ? " todo" : ""}`}>
              {preisFormat.format(o.preis)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
