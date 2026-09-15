import { Link } from "react-router-dom";
import Motiv from "../bausteine/Motiv.jsx";
import Buehne from "./Buehne.jsx";

/*
  Die Querfahrt: die Leistungen ziehen seitlich vorbei, während die Bühne
  steht. Die Bühne selbst — Kleben, Höhe, Fortschritt, Kopfzeile — steckt in
  `Buehne.jsx`; hier steht nur, was sich darin bewegt.

  Die Seitwärtsbewegung ist eine scrollgetriebene CSS-Animation auf der Bahn,
  angetrieben von der `--fahrt`-Timeline des Abschnitts. Die Tiefe kommt aus
  echter Perspektive: die Bühne hat sie, die Bahn steht in `preserve-3d`, und
  jedes Stationsbild dreht sich um seine eigene Mitte. Wann diese Mitte
  erreicht ist, sagt `--mitte` — hier ausgerechnet, weil Rechnen in JavaScript
  ehrlicher ist als eine Division im Stylesheet.

  Gedreht wird das Bild, nicht die Station: eine Station ist so groß wie das
  Fenster und enthält Fließtext. Dreht man sie mit, muss der Browser bei jedem
  Bild die ganze Fläche samt Schrift neu rastern — gemessen 21 ms je Bild statt
  16,7. So bleibt der Text flach und damit lesbar.

  Unter 900 px und bei reduzierter Bewegung gibt es kein Kleben: die Stationen
  liegen dann in einer seitlich wischbaren Reihe mit Einrasten. Auf einem
  Touchscreen ist Wischen ohnehin die natürlichere Geste als eine umgedeutete
  Scrollstrecke.
*/
export default function Querfahrt({ stationen, variante = "hell", beschriftung = "Leistungen" }) {
  const letzte = Math.max(stationen.length - 1, 1);

  return (
    <Buehne
      anzahl={stationen.length}
      klasse={`querfahrt querfahrt-${variante}`}
      beschriftung={beschriftung}
    >
      <div className="querfahrt-bahn">
        {stationen.map((s, i) => (
          <article
            className="station"
            key={s.weg}
            style={{
              "--mitte": `${(i / letzte) * 100}%`,
              "--ton": s.ton,
              "--ton-schrift": s.tonSchrift,
            }}
          >
            <div className="station-bild" aria-hidden="true">
              <span className="station-geist">{s.nummer}</span>
              <div className="station-rahmen">
                <Motiv art={s.motiv} />
              </div>
            </div>

            <div className="station-text">
              <p className="station-kopf">
                <span className="station-nummer">{s.nummer}</span>
                <span className="station-strich" aria-hidden="true" />
                {s.marke && <span className="station-kategorie">{s.marke}</span>}
              </p>
              <h2>{s.titel}</h2>
              {s.claim && <p className="station-claim">{s.claim}</p>}
              <p className="station-absatz">{s.text}</p>
              <Link className="knopf knopf-voll" to={s.weg}>{s.aufruf}</Link>
            </div>
          </article>
        ))}
      </div>
    </Buehne>
  );
}
