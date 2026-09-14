import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative Basis: die Seite läuft damit auch in einem Unterverzeichnis,
// etwa in der GitHub-Pages-Vorschau unter /<repo>/.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    // Three.js ist der mit Abstand größte Brocken. Eigenes Bündel, damit der
    // Rest der Seite nicht darauf warten muss und der Browser ihn zwischenspeichert.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
        },
      },
    },
  },
});
