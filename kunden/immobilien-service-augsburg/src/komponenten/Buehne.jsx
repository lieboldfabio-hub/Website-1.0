import { useEffect, useRef } from "react";

/*
  Die klebende Bühne — der gemeinsame Unterbau von Querfahrt und Rundgang.

  Man scrollt nach unten, die Bühne bleibt stehen, das weitere Scrollen treibt
  an, was in ihr liegt. Ist es durch, löst sich die Bühne und die Seite scrollt
  normal weiter.

  Wie das ohne Ruckeln geht — und ohne dem Browser das Scrollen wegzunehmen:

  Der klebende Teil ist reines `position: sticky`. Was sich darin bewegt, hängt
  an einer scrollgetriebenen CSS-Animation: `view-timeline-name: --fahrt` steht
  auf dem Abschnitt, die Kinder lesen sie über `animation-timeline`. Das läuft
  auf dem Compositor — kein Scroll-Zuhörer, keine Rechnung je Bild, kein
  `preventDefault`, kein React-Render. Das Scrollen bleibt beim Browser; es
  wird nur mitgelesen. Deshalb kann hier nichts hängen oder blockieren.

  Die Höhe bestimmt das Tempo: eine Bildschirmhöhe je Station plus eine halbe
  zum Ein- und Ausklingen. Weniger wirkt gehetzt, mehr fühlt sich zäh an.
*/
export default function Buehne({
  anzahl,
  klasse = "",
  beschriftung,
  hintergrund = null,
  vordergrund = null,
  children,
}) {
  const abschnitt = useRef(null);
  useBuehneHinterKopf(abschnitt, klasse.includes("raum"));

  return (
    <section
      ref={abschnitt}
      className={`buehne-abschnitt ${klasse}`.trim()}
      style={{ "--stationen": anzahl, height: `${anzahl * 100 + 50}svh` }}
      aria-label={beschriftung}
    >
      <div className="buehne">
        {hintergrund}
        {children}
        {vordergrund}

        {/* Fortschritt: zeigt, wie weit es noch geht. Ohne das weiß niemand,
            worauf er sich eingelassen hat. */}
        <div className="buehne-leiste" aria-hidden="true">
          <span className="buehne-balken" />
        </div>
      </div>
    </section>
  );
}

/*
  Zwei Dinge hängen daran, ob gerade eine Bühne hinter der Kopfzeile läuft.

  Erstens der Weichzeichner: `backdrop-filter` zeichnet den Bereich hinter dem
  Element bei jedem Bild neu weich. Über einer stehenden Seite kostet das
  nichts, über einer Bühne mit wandernden Stationen kostet es jedes Bild.
  Solange eine Bühne darunter liegt, wird er abgeschaltet.

  Zweitens die Farbe: über dem dunklen Ausstellungsraum muss die Kopfzeile
  selbst dunkel sein — eine hell schimmernde Leiste darüber sieht aus wie ein
  Fehler.

  Das darf kein Scroll-Zuhörer entscheiden. Ein IntersectionObserver mit einem
  ein Pixel hohen Beobachtungsband auf Höhe der Kopfzeilenunterkante meldet
  genau zweimal: beim Eintreten und beim Verlassen. Dazwischen kostet er nichts.
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
