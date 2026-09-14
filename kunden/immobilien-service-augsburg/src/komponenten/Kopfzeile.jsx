import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { firma } from "../daten/firma.js";

const punkte = [
  { ziel: "#immobilien", text: "Objekte" },
  { ziel: "#leistungen", text: "Leistungen" },
  { ziel: "#besonderheiten", text: "Besonderheiten" },
  { ziel: "#ueber-mich", text: "Über mich" },
  { ziel: "#kontakt", text: "Kontakt" },
];

export default function Kopfzeile() {
  const [verkleinert, setVerkleinert] = useState(false);
  const [offen, setOffen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const beiScroll = () => setVerkleinert(window.scrollY > 40);
    beiScroll();
    window.addEventListener("scroll", beiScroll, { passive: true });
    return () => window.removeEventListener("scroll", beiScroll);
  }, []);

  useEffect(() => setOffen(false), [pathname]);

  const aufStartseite = pathname === "/";

  return (
    <header className={`kopfzeile${verkleinert ? " ist-klein" : ""}`}>
      <Link to="/" className="marke">
        <span className="marke-zeichen" aria-hidden="true">
          {/* Haus mit Zweig — nach dem Signet der bestehenden Seite.
              Das Originallogo ersetzt dies, sobald es vorliegt. */}
          <svg viewBox="0 0 40 34" width="30" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 17.5 20 6l14 11.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 16v13h21V16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="17" y="19.5" width="6" height="6" />
            <path d="M3 31c5.5-3.5 11-3.5 17-1.5s11.5 2 17-1.5" strokeLinecap="round" />
            <path d="M25.5 7.5c2-2.5 4.5-3 6.5-2.5-.5 2.5-2.5 4-4.5 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="marke-text">
          <strong>Marion Sens</strong>
          <span>Immobilien Augsburg</span>
        </span>
      </Link>

      <button
        type="button"
        className="menue-knopf"
        aria-expanded={offen}
        aria-controls="hauptmenue"
        onClick={() => setOffen((o) => !o)}
      >
        <span aria-hidden="true" />
        {offen ? "Schließen" : "Menü"}
      </button>

      <nav
        id="hauptmenue"
        className={`hauptmenue${offen ? " ist-offen" : ""}`}
        aria-label="Hauptmenü"
      >
        {punkte.map((p) => (
          <a key={p.ziel} href={aufStartseite ? p.ziel : `/${p.ziel}`}>
            {p.text}
          </a>
        ))}
        <a className="knopf knopf-akzent klein" href={`tel:${firma.telefonLink}`}>
          <span aria-hidden="true">☏</span> {firma.telefon}
        </a>
      </nav>
    </header>
  );
}
