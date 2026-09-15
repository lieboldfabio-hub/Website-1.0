const U = process.env.U || "http://127.0.0.1:4173";
/* Leitplanke 2, maschinell: was animiert wird, muss auf dem Compositor
   laufen. Kein box-shadow, keine Geometrie — weder in @keyframes noch in
   einem transition. */
import { readFileSync, readdirSync } from "node:fs";
const ordner = new URL("../src/styles", import.meta.url).pathname;
const verboten = ["box-shadow", "padding", "margin", "width", "height", "top", "left", "right", "bottom"];
let fehler = 0;

for (const datei of readdirSync(ordner).filter((d) => d.endsWith(".css"))) {
  const css = readFileSync(`${ordner}/${datei}`, "utf8");

  for (const m of css.matchAll(/@keyframes\s+[\w-]+\s*\{(?:[^{}]|\{[^{}]*\})*\}/g)) {
    for (const eig of verboten) {
      if (new RegExp(`(^|[;{\\s])${eig}\\s*:`, "m").test(m[0])) {
        console.log(`✗ ${datei}: ${eig} in @keyframes — ${m[0].split("\n")[0]}`); fehler++;
      }
    }
  }
  for (const m of css.matchAll(/transition:\s*([^;}]+)[;}]/g)) {
    for (const eig of verboten) {
      if (new RegExp(`(^|[,\\s])${eig}([\\s,]|$)`).test(m[1])) {
        console.log(`✗ ${datei}: ${eig} in transition — ${m[1].trim().slice(0, 60)}`); fehler++;
      }
    }
  }
}
console.log(fehler ? `${fehler} Verstöße` : "✓ Nur Compositor-Eigenschaften werden animiert");
process.exit(fehler ? 1 : 0);
