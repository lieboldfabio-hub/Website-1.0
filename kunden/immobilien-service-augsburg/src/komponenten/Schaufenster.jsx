import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { hauptleistungen } from "../daten/firma.js";

/*
  Der Showroom.

  Ein dunkler Ausstellungsraum, durch den man seitlich fährt — die Tafel in
  der Mitte steht groß und hell, die seitlichen treten zurück. Optisch ist
  das die Wirkung der Vorfassung; technisch hat es damit nichts mehr zu tun.

  Die Vorfassung war eine 660 Bildschirme hohe Sektion, deren Scroll-
  Fortschritt eine WebGL-Kamerafahrt steuerte: jedes Scroll-Ereignis rechnete
  und zeichnete, und das senkrechte Scrollen der Seite hing mit daran.

  Hier trägt die Tiefenwirkung eine scrollgetriebene CSS-Animation
  (`animation-timeline: view(inline)`). Die läuft auf dem Compositor, nicht
  im Hauptthread — es gibt keinen Scroll-Zuhörer, keine Berechnung je Bild
  und keinen Zugriff auf das Layout. Gescrollt wird waagerecht in einem
  Element mit `overflow-x: auto`, also mit dem, was der Browser ohnehin tut.
  Das senkrechte Scrollen der Seite bleibt vollständig unberührt.

  Browser ohne scrollgetriebene Animationen zeigen alle Tafeln gleich hell
  und gleich groß. Es fehlt dann die Tiefe, nicht der Inhalt.
*/
export default function Schaufenster() {
  const bahnRef = useRef(null);
  const [kannLinks, setKannLinks] = useState(false);
  const [kannRechts, setKannRechts] = useState(true);

  const standPruefen = useCallback(() => {
    const el = bahnRef.current;
    if (!el) return;
    setKannLinks(el.scrollLeft > 8);
    setKannRechts(el.scrollWidth - el.clientWidth - el.scrollLeft > 8);
  }, []);

  useEffect(() => {
    const el = bahnRef.current;
    if (!el) return;
    standPruefen();
    el.addEventListener("scroll", standPruefen, { passive: true });
    window.addEventListener("resize", standPruefen);
    return () => {
      el.removeEventListener("scroll", standPruefen);
      window.removeEventListener("resize", standPruefen);
    };
  }, [standPruefen]);

  const blaettern = (richtung) => {
    const el = bahnRef.current;
    if (!el) return;
    const tafel = el.querySelector(".tafel");
    const schritt = tafel ? tafel.getBoundingClientRect().width + 28 : el.clientWidth * 0.8;
    el.scrollBy({ left: richtung * schritt, behavior: "smooth" });
  };

  return (
    <section className="showroom" aria-labelledby="showroom-titel">
      <div className="showroom-raum" aria-hidden="true" />

      <div className="mitte showroom-kopf">
        <div>
          <p className="ueberzeile">Die Ausstellung</p>
          <h2 id="showroom-titel">Wobei ich Sie begleite</h2>
        </div>
        <div className="showroom-steuerung">
          <button type="button" onClick={() => blaettern(-1)} disabled={!kannLinks}
                  aria-label="Eine Tafel zurück">
            <Pfeil richtung="links" />
          </button>
          <button type="button" onClick={() => blaettern(1)} disabled={!kannRechts}
                  aria-label="Eine Tafel weiter">
            <Pfeil richtung="rechts" />
          </button>
        </div>
      </div>

      <ul
        className="showroom-bahn"
        ref={bahnRef}
        tabIndex={0}
        aria-label="Leistungen, seitlich scrollbar"
      >
        {hauptleistungen.map((l, i) => (
          <li className="tafel" key={l.weg} style={{ "--ton": l.ton, "--ton-schrift": l.tonSchrift }}>
            <Link to={l.weg}>
              <span className="tafel-rahmen">
                <span className="tafel-motiv"><Motiv art={l.weg} /></span>
                <span className="tafel-nummer">{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="tafel-schild">
                <span className="tafel-marke" />
                <h3>{l.titel}</h3>
                <p>{l.kurz}</p>
                <span className="tafel-mehr">Mehr dazu <Pfeil richtung="rechts" klein /></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mitte showroom-fuss">
        <p>
          Alle Leistungen, auch Wohnflächenberechnung, Grundrisse,
          Energieausweis und Unterlagen, stehen in der{" "}
          <Link to="/leistungen">Übersicht</Link>.
        </p>
      </div>
    </section>
  );
}

function Pfeil({ richtung, klein = false }) {
  const g = klein ? 12 : 16;
  return (
    <svg viewBox="0 0 16 16" width={g} height={g} aria-hidden="true" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
         style={richtung === "links" ? { transform: "rotate(180deg)" } : undefined}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/*
  Motive statt Fotos: Es liegt kein freigegebenes Bildmaterial vor, und für
  ein reales Unternehmen aus dem Netz gegriffene Bilder einzusetzen wäre ein
  Lizenzproblem. Die Linienzeichnungen tragen den Raum, bis echte Fotos da
  sind — und sie kosten nichts zu laden.
*/
function Motiv({ art }) {
  const g = {
    viewBox: "0 0 320 220", fill: "none", stroke: "currentColor",
    strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
  };
  if (art === "/immobilienbewertung")
    return (
      <svg {...g}>
        <path d="M30 170h260" strokeWidth="1.7" />
        <path d="M62 170v-58l46-34 46 34v58" />
        <path d="M96 170v-30h24v30" />
        <path d="M186 170V84h74v86" />
        <path d="M202 102h18M202 122h18M202 142h18M234 102h10M234 122h10M234 142h10" />
        <path d="M154 74V44M140 56l14-14 14 14" />
        <circle cx="154" cy="30" r="8" />
      </svg>
    );
  if (art === "/immobilienverkauf")
    return (
      <svg {...g}>
        <path d="M30 170h260" strokeWidth="1.7" />
        <path d="M70 170v-62l52-38 52 38v62" />
        <path d="M106 170v-34h32v34" />
        <path d="M212 76h56v40h-56z" />
        <path d="M240 116v54" />
        <path d="M224 90h32M224 102h20" />
      </svg>
    );
  if (art === "/immobilienvermietung")
    return (
      <svg {...g}>
        <path d="M30 170h260" strokeWidth="1.7" />
        <path d="M62 170V88h88v82M150 170v-62h88v62" />
        <path d="M82 108h20v20H82zM112 108h20v20h-20zM82 136h20v20H82z" />
        <path d="M172 126h20v20h-20zM202 126h20v20h-20z" />
        <circle cx="122" cy="146" r="3.5" />
      </svg>
    );
  if (art === "/immobilienmediation")
    return (
      <svg {...g}>
        <path d="M30 170h260" strokeWidth="1.7" />
        <path d="M108 170v-62l44-32 44 32v62" />
        <path d="M152 76V50" />
        <circle cx="62" cy="120" r="14" />
        <path d="M44 170v-16a18 18 0 0 1 36 0v16" />
        <circle cx="258" cy="120" r="14" />
        <path d="M240 170v-16a18 18 0 0 1 36 0v16" />
        <path d="M100 134H84M204 134h16" />
      </svg>
    );
  return (
    <svg {...g}>
      <path d="M30 170h260" strokeWidth="1.7" />
      <path d="M78 170V96h74v74" />
      <path d="M152 170v-52h82v52" />
      <circle cx="115" cy="62" r="14" />
      <path d="M97 90a18 18 0 0 1 36 0" />
      <path d="M172 136h42M172 152h28" />
    </svg>
  );
}
