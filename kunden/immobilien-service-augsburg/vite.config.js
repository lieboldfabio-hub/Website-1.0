import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative Basis: die Seite läuft damit auch in einem Unterverzeichnis.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
