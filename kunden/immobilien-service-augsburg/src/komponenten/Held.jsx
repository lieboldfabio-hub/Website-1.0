import { motion } from "framer-motion";
import { firma, qualifikationen } from "../daten/firma.js";

/*
  Der Einstieg. Er stellt eine Person vor, keine Firma — das ist bei einer
  Einzelmaklerin der Unterschied, auf den es ankommt. Die Zielgruppe kommt
  oft aus schwierigen Lagen (Trennung, Erbe, Betreuung); der Ton bleibt
  deshalb ruhig und warm statt hochglänzend.
*/
const auftritt = {
  versteckt: { opacity: 0, y: 24 },
  sichtbar: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Held() {
  return (
    <section className="held" aria-label="Einstieg">
      <div className="held-raum">
        <div className="held-text-spalte">
          <motion.p className="ueberzeile" variants={auftritt} initial="versteckt" animate="sichtbar" custom={0}>
            Immobilienmaklerin für {firma.gebiet}
          </motion.p>

          <motion.h1 variants={auftritt} initial="versteckt" animate="sichtbar" custom={1}>
            Ein Zuhause wechselt
            <br />
            <em>nicht nebenbei</em> den Besitzer.
          </motion.h1>

          <motion.p className="held-text" variants={auftritt} initial="versteckt" animate="sichtbar" custom={2}>
            Seit über {firma.erfahrungJahre} Jahren begleite ich Menschen in Augsburg
            durch Verkauf, Vermietung und die Fälle, in denen mehrere Parteien
            entscheiden müssen — bei Trennung, Erbschaft oder im Betreuungsverfahren.
          </motion.p>

          <motion.ul className="held-qualifikationen" variants={auftritt} initial="versteckt" animate="sichtbar" custom={3}>
            {qualifikationen.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </motion.ul>

          <motion.div className="held-knoepfe" variants={auftritt} initial="versteckt" animate="sichtbar" custom={4}>
            <a className="knopf knopf-akzent" href="#kontakt">
              Beratung vereinbaren
            </a>
            <a className="knopf knopf-linie" href={`tel:${firma.telefonLink}`}>
              <span aria-hidden="true">☏</span> {firma.telefon}
            </a>
          </motion.div>
        </div>

        <motion.figure
          className="held-portraet"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/marion-sens.jpg"
            alt={`${firma.inhaberin}, ${firma.rolle}`}
            width="640"
            height="800"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.dataset.fehlt = "Porträtfoto fehlt";
            }}
          />
          <figcaption>
            <strong>{firma.inhaberin}</strong>
            <span>{firma.rolle}</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
