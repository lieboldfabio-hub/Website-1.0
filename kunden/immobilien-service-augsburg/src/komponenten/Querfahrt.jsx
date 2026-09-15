import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Motiv from "../bausteine/Motiv.jsx";

/*
  Zwei Dinge hängen daran, ob gerade eine Querfahrt hinter der Kopfzeile
  läuft.

  Erstens der Weichzeichner: `backdrop-filter` zeichnet den Bereich hinter
  dem Element bei jedem Bild neu weich. Über einer stehenden Seite kostet das
  nichts, über einer Bühne mit wandernden Stationen kostet es jedes Bild.
  Solange eine Fahrt darunter liegt, wird er abgeschaltet.

  Zweitens die Farbe: über dem dunklen Ausstellungsraum muss die Kopfzeile
  selbst dunkel sein — eine hell schimmernde Leiste darüber sieht aus wie ein
  Fehler.

  Das darf kein Scroll-Zuhörer entscheiden. Ein IntersectionObserver mit
  einem ein Pixel hohen Beobachtungsband auf Höhe der Kopfzeilenunterkante
  meldet genau zweimal: beim Eintreten und beim Verlassen. Dazwischen kostet
  er nichts.
*/
function useBuehneHinterKopf(ref, dunkel) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;

    const wurzel = document.documentElement;
    let beobachter;

    const aufbauen = () => {
      beobachter?.disconnect();
      const kopf = parseFloat(getComputedStyle(wurzel).getPropertyValue("--kopfzeile-hoehe")) * 16 || 72;
      const unten = Math.max(window.innerHeight - kopf - 1, 0);
      beobachter = new IntersectionObserver(
        ([eintrag]) => {
          if (eintrag.isIntersecting) {
            wurzel.dataset.buehne = "";
            if (dunkel) wurzel.dataset.dunkleBuehne = "";
          } else {
            delete wurzel.dataset.buehne;
            delete wurzel.dataset.dunkleBuehne;
          }
        },
        { rootMargin: `-${kopf}px 0px -${unten}px 0px`, threshold: 0 }
      );
      beobachter.observe(el);
    };

    aufbauen();
    window.addEventListener("resize", aufbauen);
    return () => {
      beobachter?.disconnect();
      window.removeEventListener("resize", aufbauen);
      delete wurzel.dataset.buehne;
      delete wurzel.dataset.dunkleBuehne;
    };
  }, [ref, dunkel]);
}

/*
  Die Querfahrt: man scrollt nach unten, die Bühne bleibt stehen, das weitere
  Scrollen bewegt die Stationen seitlich vorbei, danach löst sich die Bühne
  und die Seite scrollt normal weiter.

  Wie das ohne Ruckeln geht — und ohne dem Browser das Scrollen wegzunehmen:

  Der klebende Teil ist reines `position: sticky`. Die Seitwärtsbewegung ist
  eine scrollgetriebene CSS-Animation (`view-timeline` auf dem Abschnitt,
  `animation-timeline` auf der Bahn). Sie läuft auf dem Compositor: kein
  Scroll-Zuhörer, keine Rechnung je Bild, kein `preventDefault`. Das Scrollen
  bleibt beim Browser, es wird nur mitgelesen.

  Zwei Varianten, eine Mechanik:

  - `"raum"` — die Ausstellung. Dunkler Raum mit Boden, Decke, wanderndem
    Licht und Rahmen an der Wand.
  - `"hell"` — die Leistungen. Heller Grund, jede Station in ihrem eigenen
    Leistungston, als Platte mit Dicke und Schatten.

  Die Tiefe in beiden: die Bühne hat eine Perspektive, die Bahn steht in
  `preserve-3d`, und jede Station dreht sich um ihre eigene Mitte. Wann diese
  Mitte erreicht ist, weiß die Station aus `--mitte` — hier ausgerechnet, weil
  Rechnen in JavaScript ehrlicher ist als eine Division im Stylesheet. Der
  Bereich der Drehung liegt symmetrisch darum, also steht jede Station genau
  dann gerade, wenn die Fahrt sie in die Mitte bringt.

  Zwei Rückfallebenen, beide vollwertig: ohne scrollgetriebene Animationen,
  auf schmalen Geräten und bei reduzierter Bewegung gibt es keine überhohe
  Sektion und kein Kleben — die Stationen liegen dann in einer seitlich
  wischbaren Reihe mit Einrasten. Auf einem Touchscreen ist Wischen ohnehin
  die natürlichere Geste als eine umgedeutete Scrollstrecke.

  Die Höhe bestimmt das Tempo: eine Bildschirmhöhe je Station plus eine halbe
  zum Ein- und Ausklingen. Weniger wirkt gehetzt, mehr fühlt sich zäh an.
*/
export default function Querfahrt({ stationen, variante = "raum", beschriftung = "Ausstellung" }) {
  const hoehe = stationen.length * 100 + 50;
  const letzte = Math.max(stationen.length - 1, 1);
  const abschnitt = useRef(null);
  useBuehneHinterKopf(abschnitt, variante === "raum");

  return (
    <section
      ref={abschnitt}
      className={`querfahrt querfahrt-${variante}`}
      style={{ "--stationen": stationen.length, height: `${hoehe}svh` }}
      aria-label={beschriftung}
    >
      <div className="querfahrt-buehne">
        {variante === "raum" && (
          <div className="raum" aria-hidden="true">
            <span className="raum-decke" />
            <span className="raum-boden" />
            <span className="raum-licht" />
          </div>
        )}

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

        {variante === "raum" && (
          <>
            <span className="nebel nebel-links" aria-hidden="true" />
            <span className="nebel nebel-rechts" aria-hidden="true" />
          </>
        )}

        {/* Fortschritt: zeigt, wie weit es noch geht. Ohne das weiß niemand,
            worauf er sich eingelassen hat. */}
        <div className="querfahrt-leiste" aria-hidden="true">
          <span className="querfahrt-balken" />
        </div>
      </div>
    </section>
  );
}
