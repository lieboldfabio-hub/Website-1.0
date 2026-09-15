import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/tokens.css";
import "./styles/schriften.css";
import "./styles/global.css";

/*
  Im Livebetrieb saubere Adressen — dafür sorgt die Umleitung in
  netlify.toml. Ein Vorschau-Bau (VITE_VORSCHAU=1) wird ohne Server
  ausgeliefert und hat diese Umleitung nicht; dort hängen die Adressen
  hinter einem #.

  Kein Lenis, keine Scroll-Bibliothek: Das Scrollen gehört dem Browser.
*/
const Router = import.meta.env.VITE_VORSCHAU === "1" ? HashRouter : BrowserRouter;

createRoot(document.getElementById("wurzel")).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
