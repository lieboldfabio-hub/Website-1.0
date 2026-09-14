import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { immobilien, preisFormat } from "../daten/immobilien.js";

export default function Objektseite() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const objekt = immobilien.find((o) => o.slug === slug);

  if (!objekt) {
    return (
      <section className="abschnitt schmal">
        <h1>Dieses Objekt gibt es nicht mehr</h1>
        <p>
          Vielleicht ist es bereits vermittelt. Sehen Sie sich die{" "}
          <Link to="/#immobilien">aktuellen Objekte</Link> an.
        </p>
      </section>
    );
  }

  const eckdaten = [
    ["Objektart", objekt.art],
    ["Lage", objekt.lage],
    ["Wohnfläche", `${objekt.flaeche} m²`],
    ["Zimmer", objekt.zimmer],
    ["Baujahr", objekt.baujahr],
    objekt.grundstueck ? ["Grundstück", `${objekt.grundstueck} m²`] : null,
  ].filter(Boolean);

  return (
    <motion.article
      className="objektseite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <button type="button" className="zurueck" onClick={() => navigate(-1)}>
        Zurück
      </button>

      <header className="objektseite-kopf">
        <p className="ueberzeile">{objekt.lage}</p>
        <h1>{objekt.titel}</h1>
        <p className={`objektseite-preis${objekt.todo ? " todo" : ""}`}>
          {preisFormat.format(objekt.preis)}
        </p>
      </header>

      <figure className="objektseite-bild">
        <img
          src={objekt.bild}
          alt={`${objekt.art} in ${objekt.lage}`}
          width="1600"
          height="1067"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.dataset.fehlt = "Foto fehlt noch";
          }}
        />
      </figure>

      <div className="objektseite-raster">
        <div className="objektseite-text">
          <h2>Zum Objekt</h2>
          <p>{objekt.text}</p>
          {objekt.todo && (
            <p className="todo">
              Beispieltext — vor dem Livegang durch die echte Objektbeschreibung
              und die gesetzlich nötigen Angaben ersetzen (Energieausweis,
              Energieträger, Baujahr, Endenergiebedarf, Provision).
            </p>
          )}
          <Link className="knopf knopf-akzent" to="/#kontakt">
            Besichtigung anfragen
          </Link>
        </div>

        <dl className="objektseite-daten">
          {eckdaten.map(([k, w]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{w}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.article>
  );
}
