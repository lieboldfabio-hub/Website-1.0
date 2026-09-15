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
const b = await chromium.launch();
let schlecht = 0;

/* Drei Durchläufe je Seite, der erste wird verworfen: er enthält das
   erstmalige Rastern jeder Fläche. Berichtet wird der Median der Mediane
   und das schlechteste 95. Perzentil — ein einzelnes langes Bild beim
   Aufbau ist kein Ruckeln, eine Reihe davon schon. */
async function messen(p) {
  return await p.evaluate(async () => {
    const t = []; let letzte = performance.now();
    const h = document.documentElement.scrollHeight;
    window.scrollTo(0, 0);
    await new Promise((r) => requestAnimationFrame(r));
    for (let y = 0; y < h; y += 100) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
      const n = performance.now(); t.push(n - letzte); letzte = n;
    }
    t.sort((a, b) => a - b);
    return { median: t[Math.floor(t.length / 2)], p95: t[Math.floor(t.length * 0.95)],
             lang: t.filter((x) => x > 32).length, n: t.length };
  });
}

for (const drossel of [1, 4]) {
  for (const weg of ["/", "/leistungen", "/ausstellung", "/region", "/immobilienverkauf"]) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const cdp = await p.context().newCDPSession(p);
    if (drossel > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: drossel });
    await p.goto(U + weg, { waitUntil: "networkidle" });
    await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await p.waitForTimeout(600);
    await messen(p);                       // Aufwärmen, wird verworfen
    const laeufe = [await messen(p), await messen(p), await messen(p)];
    const med = laeufe.map(l => l.median).sort((a, b) => a - b)[1];
    const p95 = Math.max(...laeufe.map(l => l.p95));
    const lang = Math.max(...laeufe.map(l => l.lang));
    const ok = med <= 20 && p95 <= 32;
    if (!ok) schlecht++;
    console.log(`${ok ? "✓" : "✗"} ${drossel}× CPU  ${weg.padEnd(20)} Median ${med.toFixed(1)} ms · 95. Perzentil ${p95.toFixed(1)} ms · schlimmstenfalls ${lang}/${laeufe[0].n} über 32 ms`);
    await p.close();
  }
}
await b.close();
process.exit(schlecht ? 1 : 0);
