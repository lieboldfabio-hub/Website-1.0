import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { hauptleistungen } from "../daten/firma.js";
import Einblenden from "../bausteine/Einblenden.jsx";

/*
  Die horizontale Präsentation.

  Sie benutzt ausschließlich das Scrollen, das der Browser ohnehin kann:
  ein Element mit `overflow-x: auto`. Kein Rad-Abfangen, kein sticky, keine
  Kamerafahrt, kein Animationslauf. Der Vorgänger war eine 660 Bildschirme
  hohe Sektion, deren Scroll-Fortschritt eine 3D-Szene steuerte — jedes
  Scroll-Ereignis rechnete und zeichnete, und genau daher kamen die Hänger
  und Sprünge.

  Was hier an JavaScript übrig ist, greift nie ins Scrollen ein: zwei
  Knöpfe, die `scrollBy` aufrufen, und ein Beobachter, der ausrechnet, ob
  die Knöpfe noch etwas zu tun haben. Das senkrechte Scrollen der Seite
  bleibt davon vollständig unberührt.
*/
export default function Schaufenster() {
  const bahnRef = useRef(null);
  const [kannLinks, setKannLinks] = useState(false);
  const [kannRechts, setKannRechts] = useState(true);

  const standPruefen = useCallback(() => {
    const el = bahnRef.current;
    if (!el) return;
    const rest = el.scrollWidth - el.clientWidth - el.scrollLeft;
    setKannLinks(el.scrollLeft > 8);
    setKannRechts(rest > 8);
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
    const karte = el.querySelector(".schaufenster-karte");
    const schritt = karte ? karte.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: richtung * schritt, behavior: "smooth" });
  };

  return (
    <section className="schaufenster" aria-labelledby="schaufenster-titel">
      <div className="mitte">
        <div className="abschnitt-kopf schaufenster-kopf">
          <div>
            <p className="ueberzeile">Im Überblick</p>
            <h2 id="schaufenster-titel">Wobei ich Sie begleite</h2>
          </div>

          <div className="schaufenster-steuerung" aria-hidden="true">
            <button type="button" onClick={() => blaettern(-1)} disabled={!kannLinks} tabIndex={-1}>
              <Pfeil richtung="links" />
            </button>
            <button type="button" onClick={() => blaettern(1)} disabled={!kannRechts} tabIndex={-1}>
              <Pfeil richtung="rechts" />
            </button>
          </div>
        </div>
      </div>

      {/* Die Bahn ist selbst fokussierbar, damit sie auch mit den
          Pfeiltasten bedient werden kann — das erledigt der Browser. */}
      <ul
        className="schaufenster-bahn"
        ref={bahnRef}
        tabIndex={0}
        role="list"
        aria-label="Leistungen, seitlich scrollbar"
      >
        {hauptleistungen.map((l, i) => (
          <li className="schaufenster-karte" key={l.weg}>
            <Link to={l.weg}>
              <span className="schaufenster-bild" data-nummer={String(i + 1).padStart(2, "0")}>
                <Motiv art={l.weg} />
              </span>
              <span className="schaufenster-inhalt">
                <h3>{l.titel}</h3>
                <p>{l.kurz}</p>
                <span className="schaufenster-mehr">
                  Mehr dazu <Pfeil richtung="rechts" klein />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mitte">
        <Einblenden className="schaufenster-fuss">
          <p>
            Alle Leistungen, auch Wohnflächenberechnung, Grundrisse,
            Energieausweis und Unterlagen, finden Sie in der{" "}
            <Link to="/leistungen">Übersicht</Link>.
          </p>
        </Einblenden>
      </div>
    </section>
  );
}

function Pfeil({ richtung, klein = false }) {
  const g = klein ? 12 : 16;
  return (
    <svg
      viewBox="0 0 16 16"
      width={g}
      height={g}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={richtung === "links" ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/*
  Motive statt Fotos.

  Es liegt kein freigegebenes Bildmaterial vor, und für ein reales
  Unternehmen aus dem Netz gegriffene Bilder einzusetzen wäre ein
  Lizenzproblem. Diese ruhigen Linienmotive tragen den Auftritt, bis
  echte Fotos da sind — und sie kosten nichts zu laden.
*/
function Motiv({ art }) {
  const gemeinsam = {
    viewBox: "0 0 300 200",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (art === "/immobilienbewertung")
    return (
      <svg {...gemeinsam}>
        <path d="M60 150V95l45-33 45 33v55" />
        <path d="M95 150v-28h20v28" />
        <path d="M175 150V70h70v80" />
        <path d="M192 88h16M192 106h16M192 124h16M222 88h8M222 106h8M222 124h8" />
        <path d="M40 150h230" strokeWidth="1.8" />
        <path d="M150 62v-18M138 52l12-12 12 12" />
      </svg>
    );
  if (art === "/immobilienverkauf")
    return (
      <svg {...gemeinsam}>
        <path d="M70 150V92l50-36 50 36v58" />
        <path d="M105 150v-32h30v32" />
        <path d="M40 150h230" strokeWidth="1.8" />
        <path d="M200 66h46v34h-46z" />
        <path d="M223 100v50" />
        <path d="M210 78h22M210 88h14" />
      </svg>
    );
  if (art === "/immobilienvermietung")
    return (
      <svg {...gemeinsam}>
        <path d="M60 150V78h80v72M140 150V96h80v54" />
        <path d="M40 150h230" strokeWidth="1.8" />
        <path d="M78 96h18v18H78zM104 96h18v18h-18zM78 122h18v18H78z" />
        <path d="M160 114h18v18h-18zM188 114h18v18h-18z" />
        <circle cx="113" cy="131" r="3" />
      </svg>
    );
  if (art === "/immobilienmediation")
    return (
      <svg {...gemeinsam}>
        <path d="M40 150h230" strokeWidth="1.8" />
        <path d="M95 150V92l35-26 35 26v58" />
        <path d="M130 66v-16" />
        <circle cx="70" cy="112" r="13" />
        <path d="M54 150v-14a16 16 0 0 1 32 0v14" />
        <circle cx="222" cy="112" r="13" />
        <path d="M206 150v-14a16 16 0 0 1 32 0v14" />
        <path d="M100 124h-14M174 124h14" />
      </svg>
    );
  return (
    <svg {...gemeinsam}>
      <path d="M40 150h230" strokeWidth="1.8" />
      <path d="M78 150V84h64v66" />
      <path d="M142 150V104h72v46" />
      <circle cx="110" cy="60" r="12" />
      <path d="M96 84a14 14 0 0 1 28 0" />
      <path d="M160 122h36M160 136h24" />
    </svg>
  );
}
