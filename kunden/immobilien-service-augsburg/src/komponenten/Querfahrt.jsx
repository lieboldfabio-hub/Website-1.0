import { stationen } from "../daten/ausstellung.js";
import { Link } from "react-router-dom";
import Motiv from "../bausteine/Motiv.jsx";

/*
  Die Querfahrt durch die Ausstellung.

  Verhalten: Man scrollt normal nach unten, erreicht die Ausstellung, die
  Bühne bleibt stehen, und das weitere Scrollen bewegt die Stationen
  seitlich vorbei. Ist die letzte Station durch, löst sich die Bühne und
  die Seite scrollt normal weiter.

  Wie das ohne Ruckeln geht — und ohne dem Browser das Scrollen wegzunehmen:

  Der klebende Teil ist reines `position: sticky`, das kann der Browser von
  sich aus. Die Seitwärtsbewegung ist eine scrollgetriebene CSS-Animation
  (`view-timeline` auf dem äußeren Abschnitt, `animation-timeline` auf der
  Bahn). Sie läuft auf dem Compositor: kein Scroll-Zuhörer, keine Rechnung
  je Bild, kein `preventDefault`, keine künstliche Verzögerung. Das Scrollen
  bleibt vollständig beim Browser — es wird nur mitgelesen. Deshalb fühlt es
  sich an wie normales Scrollen und kann weder blockieren noch hängen.

  Zwei Rückfallebenen, beide vollwertig:
  - Browser ohne scrollgetriebene Animationen: keine überhohe Sektion, kein
    Kleben; die Bahn ist dann eine gewöhnliche seitlich scrollbare Reihe.
  - Schmale Geräte und reduzierte Bewegung: dasselbe. Auf einem Touchscreen
    ist Wischen ohnehin die natürlichere Geste als eine umgedeutete
    Scrollstrecke.

  Die Höhe der Sektion bestimmt das Tempo: eine Bildschirmhöhe je Station
  plus eine halbe zum Ein- und Ausklingen. Weniger wirkt gehetzt, mehr
  fühlt sich zäh an.
*/
export default function Querfahrt() {
  const hoehe = stationen.length * 100 + 50;

  return (
    <section
      className="querfahrt"
      style={{ "--stationen": stationen.length, height: `${hoehe}svh` }}
      aria-label="Ausstellung"
    >
      <div className="querfahrt-buehne">
        <div className="querfahrt-bahn">
          {stationen.map((s) => (
            <article className="station" key={s.nummer}>
              <div className="station-motiv" aria-hidden="true">
                <Motiv art={s.motiv} />
              </div>

              <div className="station-text">
                <p className="station-kopf">
                  <span className="station-nummer">{s.nummer}</span>
                  <span className="station-strich" aria-hidden="true" />
                  <span className="station-kategorie">{s.kategorie}</span>
                </p>
                <h2>{s.titel}</h2>
                <p className="station-absatz">{s.text}</p>
                <Link className="knopf knopf-voll" to={s.weg}>{s.aufruf}</Link>
              </div>
            </article>
          ))}
        </div>

        {/* Fortschritt: zeigt, wie weit die Ausstellung reicht und wo man
            gerade ist. Ohne das weiß niemand, wie lange das noch geht. */}
        <div className="querfahrt-leiste" aria-hidden="true">
          <span className="querfahrt-balken" />
        </div>
      </div>
    </section>
  );
}
