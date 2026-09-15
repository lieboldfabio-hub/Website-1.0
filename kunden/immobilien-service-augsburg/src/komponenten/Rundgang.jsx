import { Link } from "react-router-dom";
import Motiv from "../bausteine/Motiv.jsx";
import Buehne from "./Buehne.jsx";

/*
  Der Rundgang: die Stationen der Ausstellung stehen auf einem Kreis im
  dunklen Raum, und das Scrollen dreht den Kreis. Man geht an den Räumen
  vorbei, statt an ihnen vorbeigeschoben zu werden.

  Es bewegt sich genau ein Element — der Kreis. Die Karten stehen fest darauf
  (`rotateY(i · 360°/n) translateZ(radius)`); die Perspektive der Bühne macht
  daraus die Drehung, während sie am Fluchtpunkt vorbeiwandern. Kein Effekt je
  Karte, keine zweite Zeitachse, keine Rechnung je Bild.

  Das ist ausdrücklich nicht die Bauart der Vorlage von 21st.dev. Die hängt an
  einem `scroll`-Zuhörer und einer endlosen `requestAnimationFrame`-Schleife,
  die bei jedem Bild React-State setzt — die ganze Galerie wird damit 60-mal
  je Sekunde neu gerendert, auch außerhalb des Bildes. Übernommen ist die
  Optik, nicht der Motor: hier läuft alles auf dem Compositor, angetrieben von
  der `--fahrt`-Timeline des Abschnitts.

  Eine große Ziffer in der Kreismitte war geplant und ist wieder verschwunden:
  sie steht im selben Raum wie die Karten, schaut zwischen ihnen hindurch und
  sieht dabei aus wie ein Fehler. Die Nummer steht ohnehin auf jeder Karte.

  Auf der Karte steht beim Scrollen nur, worum es geht — Nummer, Kategorie,
  Titel. Der Absatz und der Weg zur Leistung liegen darunter und kommen beim
  Zeigen hervor. Wie das lesbar bleibt, wenn niemand zeigen kann (Touch) oder
  niemand zeigen will (Tastatur), steht bei `.karte-tafel` im Stylesheet.
*/
export default function Rundgang({ stationen, beschriftung = "Ausstellung" }) {
  const letzte = Math.max(stationen.length - 1, 1);

  return (
    <Buehne
      anzahl={stationen.length}
      klasse="rundgang ist-raum"
      beschriftung={beschriftung}
      hintergrund={
        <div className="raum" aria-hidden="true">
          <span className="raum-decke" />
          <span className="raum-boden" />
          <span className="raum-licht" />
        </div>
      }
      vordergrund={
        <>
          <span className="nebel nebel-links" aria-hidden="true" />
          <span className="nebel nebel-rechts" aria-hidden="true" />
        </>
      }
    >
      <div className="rundgang-kreis">
        {stationen.map((s, i) => (
          <article
            className="rundgang-karte"
            key={s.weg}
            style={{ "--i": i, "--mitte": `${(i / letzte) * 100}%` }}
          >
            <div className="karte-blatt" aria-hidden="true">
              <Motiv art={s.motiv} />
            </div>

            <div className="karte-schild">
              <p className="karte-kopf">
                <span className="karte-nummer">{s.nummer}</span>
                <span className="karte-strich" aria-hidden="true" />
                {s.marke && <span className="karte-kategorie">{s.marke}</span>}
              </p>
              <h2>{s.titel}</h2>
            </div>

            {/* `data-aufdecken` ist kein Schalter, sondern eine Zusage an die
                Prüfung: dieser Inhalt ist verborgen, aber per Tastatur
                erreichbar. `werkzeuge/ganzseiten.mjs` nimmt ihn deshalb nicht
                aus, sondern prüft ihn anders — Fokus hinein, muss sichtbar
                werden. */}
            <div className="karte-tafel" data-aufdecken>
              <p>{s.text}</p>
              <Link className="knopf knopf-voll klein" to={s.weg}>{s.aufruf}</Link>
            </div>
          </article>
        ))}
      </div>
    </Buehne>
  );
}
