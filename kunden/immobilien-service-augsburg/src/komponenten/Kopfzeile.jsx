import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { firma, hauptleistungen, weitereLeistungen } from "../daten/firma.js";
import { menuepunkte } from "../seiten-meta.js";
import Signet from "../bausteine/Signet.jsx";

export default function Kopfzeile() {
  const [offen, setOffen] = useState(false);
  const [klappeOffen, setKlappeOffen] = useState(false);
  const [gescrollt, setGescrollt] = useState(false);
  const { pathname } = useLocation();
  const klappeRef = useRef(null);

  /* Nur eine Klasse umschalten, nichts berechnen — das läuft bei jedem
     Scrollereignis und darf nichts kosten. */
  useEffect(() => {
    const beiScroll = () => setGescrollt(window.scrollY > 8);
    beiScroll();
    window.addEventListener("scroll", beiScroll, { passive: true });
    return () => window.removeEventListener("scroll", beiScroll);
  }, []);

  useEffect(() => {
    setOffen(false);
    setKlappeOffen(false);
  }, [pathname]);

  /* Klick daneben und Escape schließen die Klappe — sonst bleibt sie hängen. */
  useEffect(() => {
    if (!klappeOffen) return;
    const beiKlick = (e) => {
      if (!klappeRef.current?.contains(e.target)) setKlappeOffen(false);
    };
    const beiTaste = (e) => e.key === "Escape" && setKlappeOffen(false);
    document.addEventListener("pointerdown", beiKlick);
    document.addEventListener("keydown", beiTaste);
    return () => {
      document.removeEventListener("pointerdown", beiKlick);
      document.removeEventListener("keydown", beiTaste);
    };
  }, [klappeOffen]);

  return (
    <header className={`kopfzeile${gescrollt ? " ist-gescrollt" : ""}`}>
      <div className="kopfzeile-innen">
        <Link to="/" className="marke" aria-label={`${firma.name} — zur Startseite`}>
          <Signet />
          <span className="marke-text">
            <strong>{firma.inhaberin}</strong>
            <span>Immobilien {firma.ort}</span>
          </span>
        </Link>

        <button
          type="button"
          className="menue-knopf"
          aria-expanded={offen}
          aria-controls="hauptmenue"
          onClick={() => setOffen((o) => !o)}
        >
          <span className="menue-striche" aria-hidden="true">
            <i /><i /><i />
          </span>
          {offen ? "Schließen" : "Menü"}
        </button>

        <nav id="hauptmenue" className={`hauptmenue${offen ? " ist-offen" : ""}`} aria-label="Hauptmenü">
          <ul>
            {/* Ein Durchlauf über das Register, damit die Reihenfolge im Menü
               dieselbe ist wie dort. Leistungen bekommen eine Klappe. */}
            {menuepunkte.map((punkt) =>
              punkt.weg === "/leistungen" ? (
                <li className="hat-klappe" key={punkt.weg} ref={klappeRef}>
                  <div className="klappe-zeile">
                    <NavLink to={punkt.weg}>{punkt.menue}</NavLink>
                    <button
                      type="button"
                      className="klappe-knopf"
                      aria-expanded={klappeOffen}
                      aria-label="Leistungen aufklappen"
                      onClick={() => setKlappeOffen((o) => !o)}
                    >
                      <svg viewBox="0 0 12 8" width="11" height="8" aria-hidden="true">
                        <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  <div className={`klappe${klappeOffen ? " ist-offen" : ""}`}>
                    <div className="klappe-spalte">
                      <p className="klappe-titel">Kernleistungen</p>
                      {hauptleistungen.map((l) => (
                        <NavLink key={l.weg} to={l.weg}>
                          <strong>{l.titel}</strong>
                          <span>{l.kurz}</span>
                        </NavLink>
                      ))}
                    </div>
                    <div className="klappe-spalte">
                      <p className="klappe-titel">Weitere Leistungen</p>
                      {weitereLeistungen.map((l) => (
                        <NavLink key={l.weg} to={l.weg}>
                          <strong>{l.titel}</strong>
                          <span>{l.kurz}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={punkt.weg}>
                  <NavLink to={punkt.weg} end={punkt.weg === "/"}>
                    {punkt.menue}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          <div className="kopfzeile-aktionen">
            <a className="kopfzeile-anruf" href={`tel:${firma.telefonLink}`}>
              <TelefonZeichen /> {firma.telefon}
            </a>
            <Link className="knopf knopf-voll klein" to="/immobilienbewertung">
              Immobilie bewerten
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function TelefonZeichen() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
      <path d="M3.2 1.5a1.4 1.4 0 0 1 2 .3l1 1.4a1.4 1.4 0 0 1-.1 1.8l-.7.7a.4.4 0 0 0-.1.4 7 7 0 0 0 3.6 3.6.4.4 0 0 0 .4-.1l.7-.7a1.4 1.4 0 0 1 1.8-.1l1.4 1a1.4 1.4 0 0 1 .3 2l-.6.8c-.5.6-1.4.9-2.2.6A13 13 0 0 1 1.8 4.5c-.3-.8 0-1.7.6-2.2l.8-.8Z" />
    </svg>
  );
}
