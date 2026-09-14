import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Showroomszene } from "./szene.js";
import { immobilien, preisFormat } from "../daten/immobilien.js";
import ObjektRaster from "../komponenten/ObjektRaster.jsx";
import "./showroom.css";

/* Kann dieser Browser überhaupt WebGL? Einmal prüfen, Ergebnis merken. */
function webglMoeglich() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function bewegungReduziert() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function Showroom() {
  const navigate = useNavigate();
  const sektionRef = useRef(null);
  const leinwandRef = useRef(null);
  const szeneRef = useRef(null);
  const [aktiv, setAktiv] = useState(0);
  const [dreiD, setDreiD] = useState(null); // null = noch nicht entschieden

  useEffect(() => {
    setDreiD(webglMoeglich() && !bewegungReduziert());
  }, []);

  useEffect(() => {
    if (dreiD !== true) return;
    const leinwand = leinwandRef.current;
    const sektion = sektionRef.current;
    if (!leinwand || !sektion) return;

    const stil = getComputedStyle(document.documentElement);
    const akzent = stil.getPropertyValue("--gruen-kraeftig").trim() || "#a8c455";

    let szene;
    try {
      szene = new Showroomszene(leinwand, immobilien, akzent);
    } catch (fehler) {
      // Lieber eine schlichte Liste als eine kaputte Seite.
      console.warn("Showroom konnte nicht starten, zeige Raster:", fehler);
      setDreiD(false);
      return;
    }
    szeneRef.current = szene;
    szene.beiWechsel = setAktiv;
    szene.groesseAnpassen();

    /* Diagnosefenster: sagt jederzeit, wie viel tatsächlich gezeichnet wird.
       Zeichenaufrufe und Dreiecke sind hardwareunabhängig — anders als eine
       Bildrate, die auf jedem Rechner anders ausfällt. Bei Problemen zuerst
       hier nachsehen: window.__szeneInfo() in der Browserkonsole. */
    window.__szeneInfo = () => ({
      zeichenaufrufe: szene.renderer.info.render.calls,
      dreiecke: szene.renderer.info.render.triangles,
      texturen: szene.renderer.info.memory.textures,
      geometrien: szene.renderer.info.memory.geometries,
      objekte: immobilien.length,
      sichtbareBilder: szene.sichtbareRahmen(),
      dominantesBild: szene.dominantesBild(),
      aktivesBild: szene.aktiv,
    });

    /* --- Scroll: Fortschritt der Sektion auf die Kamerafahrt abbilden ----- */
    const fortschrittLesen = () => {
      const r = sektion.getBoundingClientRect();
      const strecke = sektion.offsetHeight - window.innerHeight;
      if (strecke <= 0) return;
      szene.setFortschritt(-r.top / strecke);
    };

    /* Gerendert wird nur, solange die Sektion zu sehen ist. Scrollt man
       darüber hinaus, steht die Schleife — das schont Akku und Lüfter. */
    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        if (eintrag.isIntersecting) {
          fortschrittLesen();
          szene.start();
        } else {
          szene.stopp();
        }
      },
      { threshold: 0 }
    );
    beobachter.observe(sektion);

    const beiScroll = () => fortschrittLesen();
    const beiGroesse = () => {
      szene.groesseAnpassen();
      fortschrittLesen();
    };
    const beiZeiger = (e) => {
      szene.setZeiger(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    /* Im Hintergrundtab nicht weiterrechnen. */
    const beiSichtbarkeit = () => {
      if (document.hidden) szene.stopp();
      else if (sektion.getBoundingClientRect().top < window.innerHeight) szene.start();
    };

    window.addEventListener("scroll", beiScroll, { passive: true });
    window.addEventListener("resize", beiGroesse);
    window.addEventListener("pointermove", beiZeiger, { passive: true });
    document.addEventListener("visibilitychange", beiSichtbarkeit);
    fortschrittLesen();

    return () => {
      beobachter.disconnect();
      window.removeEventListener("scroll", beiScroll);
      window.removeEventListener("resize", beiGroesse);
      window.removeEventListener("pointermove", beiZeiger);
      document.removeEventListener("visibilitychange", beiSichtbarkeit);
      delete window.__szeneInfo;
      szene.entsorgen();
      szeneRef.current = null;
    };
  }, [dreiD]);

  const beiKlick = useCallback(
    (e) => {
      const slug = szeneRef.current?.treffer(e.clientX, e.clientY);
      if (slug) navigate(`/immobilie/${slug}`);
    },
    [navigate]
  );

  /* Zu einem Objekt springen — für die Punktnavigation und die Tastatur. */
  const springeZu = useCallback((i) => {
    const sektion = sektionRef.current;
    if (!sektion) return;
    const strecke = sektion.offsetHeight - window.innerHeight;
    const anteil = i / Math.max(1, immobilien.length - 1);
    const ziel =
      sektion.offsetTop + strecke * (anteil * 0.92 + 0.04);
    window.scrollTo({ top: ziel, behavior: "smooth" });
  }, []);

  if (dreiD === null) return <div className="showroom-platz" aria-hidden="true" />;

  /* Ohne WebGL oder bei reduzierter Bewegung: dieselben Objekte als Raster.
     Niemand bekommt eine leere Sektion zu sehen. */
  if (dreiD === false) {
    return (
      <section id="immobilien" className="showroom-ersatz">
        <div className="abschnitt-kopf">
          <p className="ueberzeile">Aktuelle Objekte</p>
          <h2>Unsere Ausstellung</h2>
        </div>
        <ObjektRaster objekte={immobilien} />
      </section>
    );
  }

  const objekt = immobilien[aktiv];

  return (
    <section
      id="immobilien"
      ref={sektionRef}
      className="showroom"
      style={{ height: `${immobilien.length * 92 + 60}vh` }}
      aria-label="Ausstellung unserer Immobilien"
    >
      <div className="showroom-buehne">
        <canvas
          ref={leinwandRef}
          className="showroom-leinwand"
          onClick={beiKlick}
          aria-hidden="true"
        />

        <div className="showroom-oben">
          <p className="ueberzeile">Aktuelle Objekte</p>
          <p className="showroom-zaehler">
            <span>{String(aktiv + 1).padStart(2, "0")}</span>
            <i />
            <span>{String(immobilien.length).padStart(2, "0")}</span>
          </p>
        </div>

        {/* Die Texte liegen als HTML über der Szene: gestochen scharf,
            vorlesbar, durchsuchbar — und kosten kein einziges Polygon. */}
        <div className="showroom-karte" key={objekt.slug}>
          <p className="showroom-lage">{objekt.lage}</p>
          <h3 className="showroom-titel">{objekt.titel}</h3>
          <dl className="showroom-eckdaten">
            <div>
              <dt>Wohnfläche</dt>
              <dd>{objekt.flaeche} m²</dd>
            </div>
            <div>
              <dt>Zimmer</dt>
              <dd>{objekt.zimmer}</dd>
            </div>
            <div>
              <dt>Baujahr</dt>
              <dd>{objekt.baujahr}</dd>
            </div>
          </dl>
          <p className={`showroom-preis${objekt.todo ? " todo" : ""}`}>
            {preisFormat.format(objekt.preis)}
          </p>
          <button
            type="button"
            className="knopf knopf-akzent"
            onClick={() => navigate(`/immobilie/${objekt.slug}`)}
          >
            Objekt ansehen
          </button>
        </div>

        {/* Punktnavigation: zeigt, wie viele Objekte es gibt und wo man ist.
            In der Vorlage fehlte genau das — man wusste nie, wie weit es geht. */}
        <nav className="showroom-punkte" aria-label="Zu einem Objekt springen">
          {immobilien.map((o, i) => (
            <button
              key={o.slug}
              type="button"
              className={i === aktiv ? "ist-aktiv" : ""}
              aria-current={i === aktiv ? "true" : undefined}
              onClick={() => springeZu(i)}
            >
              <span className="nur-vorlesen">{o.titel}</span>
            </button>
          ))}
        </nav>

        <p className="showroom-hinweis" aria-hidden="true">
          Weiterscrollen
        </p>
      </div>

      {/* Für Suchmaschinen und Screenreader: die vollständige Liste,
          unabhängig davon, was die Grafikkarte gerade tut. */}
      <div className="nur-vorlesen">
        <h2>Unsere Objekte</h2>
        <ObjektRaster objekte={immobilien} schlicht />
      </div>
    </section>
  );
}
