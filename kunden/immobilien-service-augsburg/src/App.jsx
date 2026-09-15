import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { leistungen } from "./daten/firma.js";
import Kopfzeile from "./komponenten/Kopfzeile.jsx";
import Fusszeile from "./komponenten/Fusszeile.jsx";
import Start from "./seiten/Start.jsx";
import Leistungsuebersicht from "./seiten/Leistungsuebersicht.jsx";
import Leistungsseite from "./seiten/Leistungsseite.jsx";
import UeberMich from "./seiten/UeberMich.jsx";
import RegionSeite from "./seiten/Region.jsx";
import Kontakt from "./seiten/Kontakt.jsx";
import Recht from "./seiten/Recht.jsx";
import NichtGefunden from "./seiten/NichtGefunden.jsx";

export default function App() {
  return (
    <>
      <a className="zum-inhalt" href="#inhalt">Zum Inhalt springen</a>
      <NachObenBeiWechsel />
      <Kopfzeile />
      <main id="inhalt">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/leistungen" element={<Leistungsuebersicht />} />

          {/* Jede Leistung bekommt ihre Route aus denselben Daten, aus denen
              auch Menü und Fußzeile gespeist werden. Ein Menüpunkt ohne Seite
              ist damit ausgeschlossen. */}
          {leistungen.map((l) => (
            <Route key={l.weg} path={l.weg} element={<Leistungsseite />} />
          ))}

          <Route path="/region" element={<RegionSeite />} />
          <Route path="/ueber-uns" element={<UeberMich />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/impressum" element={<Recht art="impressum" />} />
          <Route path="/datenschutz" element={<Recht art="datenschutz" />} />
          <Route path="/barrierefreiheit" element={<Recht art="barrierefreiheit" />} />
          <Route path="*" element={<NichtGefunden />} />
        </Routes>
      </main>
      <Fusszeile />
    </>
  );
}

/*
  Bei einem Seitenwechsel nach oben springen — ohne Bewegung, damit es
  nicht wie ein Sprung im Scrollen aussieht.
*/
function NachObenBeiWechsel() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
