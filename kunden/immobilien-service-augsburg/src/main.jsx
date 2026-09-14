import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/tokens.css";
import "./styles/global.css";

/*
  Im Livebetrieb saubere Adressen (/immobilie/…) — dafür sorgt die Umleitung
  in netlify.toml. Für eine Vorschau ohne eigenen Server, die nur als Dateien
  ausgeliefert wird, gibt es diese Umleitung nicht: dort liefert jeder direkte
  Aufruf einer Unterseite einen 404. Ein Vorschau-Bau (VITE_VORSCHAU=1) hängt
  die Adresse deshalb hinter ein #.
*/
const Router = import.meta.env.VITE_VORSCHAU === "1" ? HashRouter : BrowserRouter;

createRoot(document.getElementById("wurzel")).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
