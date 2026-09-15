/*
  Playwright ist bewusst keine Abhängigkeit dieses Projekts — es liefert
  nichts an den Browser aus und soll das Paket nicht um hundert Megabyte
  aufblähen. Die Skripte nehmen es, wo es liegt: aus dem Projekt, wenn es
  dort installiert wurde, sonst aus einer globalen Installation.
*/
const { chromium } = await import("playwright").catch(() =>
  import("/opt/node22/lib/node_modules/playwright/index.js").then((m) => m.default ?? m)
);
const U = process.env.U || "http://127.0.0.1:4173";
/* Die Bilder landen in einem eigenen Ordner, nicht im Projektverzeichnis —
   sie gehören nicht ins Repo. */
const bilder = process.env.BILDER || new URL("../bilder-pruefung", import.meta.url).pathname;
await (await import("node:fs/promises")).mkdir(bilder, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
let schlecht = 0;

for (const [weg, name] of [["/", "g-start"], ["/leistungen", "g-leistungen"],
  ["/ausstellung", "g-ausstellung"], ["/region", "g-region"],
  ["/ueber-mich", "g-ueber"], ["/kontakt", "g-kontakt"],
  ["/immobilienverkauf", "g-verkauf"]]) {
  await p.goto(U + weg, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  // Alles einmal durchscrollen, damit jede Bewegung ihren Endzustand hat
  await p.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 300) { window.scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${bilder}/${name}.png`, fullPage: true });

  /* Leitplanke 3, maschinell: kein Inhalt darf unsichtbar sein, der nicht
     ausdrücklich Dekoration ist. Geprüft wird nach dem Durchscrollen — was
     dann noch unsichtbar ist, wartet auf niemanden mehr. */
  const versteckt = await p.evaluate(() => {
    const raus = [];
    for (const el of document.querySelectorAll("main *, footer *, header *")) {
      if (el.closest("[aria-hidden='true']") || el.getAttribute("aria-hidden") === "true") continue;
      /* Was je nach Breite absichtlich fehlt: Klappmenü, Menüknopf, Honigtopf. */
      if (el.closest(".klappe, .hauptmenue, .menue-knopf, .honigtopf, .nur-vorlesen, .zum-inhalt")) continue;
      const t = (el.textContent || "").trim();
      if (!t) continue;
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden" || +s.opacity < 0.9) {
        raus.push(`${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 30)} opacity=${s.opacity} vis=${s.visibility}`);
      }
    }
    return [...new Set(raus)].slice(0, 6);
  });
  if (versteckt.length) { schlecht++; console.log("✗", weg, "unsichtbarer Inhalt:", JSON.stringify(versteckt)); }
  else console.log("✓", weg);
}
await b.close();
console.log(schlecht ? `${schlecht} Seiten mit verstecktem Inhalt` : "Kein versteckter Inhalt");
process.exit(schlecht ? 1 : 0);
