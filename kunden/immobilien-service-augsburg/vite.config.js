import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/*
  Zwei Bauarten, zwei Basispfade.

  Live liegt die Seite im Wurzelverzeichnis einer Domain, und jede Adresse
  wird über netlify.toml auf index.html umgeschrieben. Mit relativer Basis
  („./assets/…") würde ein direkter Einstieg auf /leistungen/ das Skript
  unter /leistungen/assets/… suchen — die Umschreibung liefert dort wieder
  index.html, und die Seite bliebe weiß. Darum absolute Basis.

  Die Vorschau (VITE_VORSCHAU=1) wird ohne Server geöffnet, dort ist die
  relative Basis die einzige, die trägt.
*/
export default defineConfig(() => ({
  base: process.env.VITE_VORSCHAU === "1" ? "./" : "/",
  plugins: [react()],
}));
