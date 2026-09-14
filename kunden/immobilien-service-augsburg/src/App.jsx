import { Routes, Route } from "react-router-dom";
import { useLenis } from "./scroll/useLenis.js";
import Kopfzeile from "./komponenten/Kopfzeile.jsx";
import Fusszeile from "./komponenten/Fusszeile.jsx";
import Startseite from "./seiten/Startseite.jsx";
import Objektseite from "./seiten/Objektseite.jsx";
import Rechtstext from "./seiten/Rechtstext.jsx";
import NichtGefunden from "./seiten/NichtGefunden.jsx";
import NachObenBeiWechsel from "./komponenten/NachObenBeiWechsel.jsx";

export default function App() {
  useLenis();

  return (
    <>
      <a className="zum-inhalt" href="#inhalt">
        Zum Inhalt springen
      </a>
      <NachObenBeiWechsel />
      <Kopfzeile />
      <main id="inhalt">
        <Routes>
          <Route path="/" element={<Startseite />} />
          <Route path="/immobilie/:slug" element={<Objektseite />} />
          <Route path="/impressum" element={<Rechtstext art="impressum" />} />
          <Route path="/datenschutz" element={<Rechtstext art="datenschutz" />} />
          <Route path="*" element={<NichtGefunden />} />
        </Routes>
      </main>
      <Fusszeile />
    </>
  );
}
