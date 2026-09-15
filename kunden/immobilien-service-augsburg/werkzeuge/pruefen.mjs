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
const browser = await chromium.launch();
const HART = "html { scroll-behavior: auto !important; }";
const raus = [];
const merke = (n, ok, notiz = "") => { raus.push({ n, ok, notiz }); };

// ---------- 1. Crawl über alle internen Links ----------
const seite = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const fehler = [];
seite.on("pageerror", (e) => fehler.push(`${seite.url()}: ${e.message}`));
seite.on("console", (m) => { if (m.type() === "error") fehler.push(`${seite.url()}: ${m.text()}`); });

const gesehen = new Set(["/"]);
const warteschlange = ["/"];
const befund = [];
while (warteschlange.length) {
  const weg = warteschlange.shift();
  await seite.goto(U + weg, { waitUntil: "networkidle" });
  await seite.waitForTimeout(120);
  const d = await seite.evaluate(() => ({
    h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
    titel: document.title,
    beschreibung: document.querySelector('meta[name="description"]')?.content || "",
    vierNullVier: document.body.textContent.includes("Diese Seite gibt es nicht"),
    ueberlauf: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    links: [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h.startsWith("/")),
    leereLinks: [...document.querySelectorAll("a[href]")].filter((a) => !a.textContent.trim() && !a.getAttribute("aria-label")).length,
  }));
  befund.push({ weg, ...d });
  for (const l of d.links) {
    const rein = l.split("#")[0] || "/";
    if (!gesehen.has(rein)) { gesehen.add(rein); warteschlange.push(rein); }
  }
}
merke(`Crawl: ${befund.length} Seiten`, true, befund.map((b) => b.weg).join(" "));
merke("Kein 404 auf verlinkten Seiten", befund.every((b) => !b.vierNullVier),
  befund.filter((b) => b.vierNullVier).map((b) => b.weg).join(", "));
merke("Genau eine H1 je Seite", befund.every((b) => b.h1.length === 1),
  befund.filter((b) => b.h1.length !== 1).map((b) => `${b.weg}:${b.h1.length}`).join(", "));
const titelSet = new Set(befund.map((b) => b.titel));
merke("Titel je Seite eigen", titelSet.size === befund.length, `${titelSet.size}/${befund.length}`);
const bSet = new Set(befund.map((b) => b.beschreibung));
merke("Beschreibung je Seite eigen und gefüllt",
  bSet.size === befund.length && befund.every((b) => b.beschreibung.length > 60),
  `${bSet.size}/${befund.length}`);
merke("Kein Querüberlauf bei 1440", befund.every((b) => b.ueberlauf <= 0),
  befund.filter((b) => b.ueberlauf > 0).map((b) => `${b.weg}:${b.ueberlauf}`).join(", "));
merke("Keine Links ohne Beschriftung", befund.every((b) => b.leereLinks === 0),
  befund.filter((b) => b.leereLinks).map((b) => `${b.weg}:${b.leereLinks}`).join(", "));

// ---------- 2. Unbekannte Adresse ----------
await seite.goto(U + "/gibt-es-wirklich-nicht", { waitUntil: "domcontentloaded" });
await seite.waitForTimeout(200);
merke("Unbekannte Adresse zeigt die 404-Seite",
  await seite.evaluate(() => document.body.textContent.includes("Diese Seite gibt es nicht")));

// ---------- 3. Überlauf auf Tablet und Handy ----------
for (const [name, w, h] of [["Tablet", 820, 1180], ["Handy", 390, 844], ["Schmal", 320, 700]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
  const schlimm = [];
  for (const b of befund) {
    await p.goto(U + b.weg, { waitUntil: "networkidle" });
    await p.waitForTimeout(100);
    const u = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (u > 0) schlimm.push(`${b.weg}:${u}`);
  }
  merke(`Kein Querüberlauf auf ${name} (${w}px)`, schlimm.length === 0, schlimm.join(", "));
  await p.close();
}

// ---------- 4. Scrollfluss ----------
async function fluss(p, weg) {
  await p.goto(U + weg, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  return await p.evaluate(async () => {
    const t = [];
    let letzte = performance.now();
    const hoehe = document.documentElement.scrollHeight;
    for (let y = 0; y < hoehe; y += 90) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
      const jetzt = performance.now();
      t.push(jetzt - letzte); letzte = jetzt;
    }
    t.sort((a, b) => a - b);
    return { median: +t[Math.floor(t.length / 2)].toFixed(1), max: +t[t.length - 1].toFixed(1), lang: t.filter((x) => x > 32).length, n: t.length };
  });
}
const pf = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const weg of ["/", "/ausstellung", "/immobilienverkauf", "/region", "/ueber-mich"]) {
  const f = await fluss(pf, weg);
  merke(`Scrollfluss ${weg}`, f.median <= 20 && f.lang <= 2, `Median ${f.median} ms, max ${f.max} ms, ${f.lang}/${f.n} Bilder über 32 ms`);
}

// ---------- 5. Querfahrt ----------
/*
  Beide Bühnen prüfen — die Bahn auf /leistungen und den Rundgang auf
  /ausstellung. Gemessen wird nicht die Zahl im Stylesheet, sondern was der
  Browser daraus macht: bei der Bahn der Versatz in Pixeln, beim Rundgang der
  Drehwinkel. Beides muss monoton in eine Richtung laufen und am Ende genau
  dort stehen, wo die letzte Station vorn ist.
*/
for (const [seite, name, art] of [
  ["/ausstellung", "Rundgang", "kreis"],
  ["/leistungen", "Querfahrt", "bahn"],
]) {
await pf.goto(U + seite, { waitUntil: "networkidle" });
await pf.waitForTimeout(500);
await pf.addStyleTag({ content: HART });
const quer = await pf.evaluate(async (art) => {
  const ruhe = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const abschnitt = document.querySelector(".buehne-abschnitt");
  const buehne = document.querySelector(".buehne");
  const bewegt = document.querySelector(art === "kreis" ? ".rundgang-kreis" : ".querfahrt-bahn");
  const stationen = document.querySelectorAll(art === "kreis" ? ".rundgang-karte" : ".station").length;
  const oben = abschnitt.offsetTop;
  const ende = oben + abschnitt.offsetHeight - window.innerHeight;

  /* Der Drehwinkel muss kumulativ gelesen werden: `atan2` klappt bei ±180°
     um, und eine Drehung über eine halbe Umdrehung hinaus sähe sonst aus,
     als liefe sie zurück. */
  let vorher = 0, umlauf = 0;
  const proben = [];
  for (let i = 0; i <= 24; i++) {
    const y = oben + ((ende - oben) * i) / 24;
    window.scrollTo(0, y);
    await ruhe(); await ruhe();
    const m = new DOMMatrixReadOnly(getComputedStyle(bewegt).transform);
    let wert;
    if (art === "kreis") {
      const roh = Math.atan2(-m.m13, m.m11) * 180 / Math.PI;
      if (i > 0 && roh - vorher > 180) umlauf -= 360;
      if (i > 0 && roh - vorher < -180) umlauf += 360;
      vorher = roh;
      wert = Math.round(roh + umlauf);
    } else {
      wert = Math.round(m.m41);
    }
    proben.push({ y: Math.round(y), x: wert, buehneOben: Math.round(buehne.getBoundingClientRect().top) });
  }
  // Nach der Fahrt weiterscrollen: die Seite muss vertikal freigeben
  window.scrollTo(0, ende + 400);
  await ruhe(); await ruhe();
  const danach = Math.round(buehne.getBoundingClientRect().top);
  const sollEnde = art === "kreis"
    ? -Math.round(360 * (stationen - 1) / stationen)
    : -(stationen - 1) * window.innerWidth;
  return { stationen, proben, danach, sollEnde, einheit: art === "kreis" ? "°" : "px" };
}, art);

const xs = quer.proben.map((p) => p.x);
const monoton = xs.every((x, i) => i === 0 || x <= xs[i - 1] + 0.5);
merke(`${name}: läuft monoton vorwärts`, monoton, xs.join(" "));
merke(`${name}: endet genau bei der letzten Station`,
  Math.abs(xs[xs.length - 1] - quer.sollEnde) <= 1,
  `${xs[xs.length - 1]}${quer.einheit} statt ${quer.sollEnde}${quer.einheit} (${quer.stationen} Stationen)`);
merke(`${name}: Bühne bleibt angeheftet`,
  quer.proben.slice(1, -1).every((p) => Math.abs(p.buehneOben) <= 1), "");
merke(`${name}: danach scrollt die Seite normal weiter`, quer.danach < -100, `Bühne bei ${quer.danach}px`);
}

// ---------- 6. Querfahrt auf dem Handy: blockiert nicht ----------
const ph = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await ph.goto(U + "/ausstellung", { waitUntil: "networkidle" });
await ph.waitForTimeout(400);
await ph.addStyleTag({ content: HART });
const handy = await ph.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  window.scrollTo(0, h);
  await new Promise((r) => setTimeout(r, 400));
  return { erreicht: window.scrollY > 0, unten: Math.round(window.scrollY + window.innerHeight), hoehe: h };
});
merke("Ausstellung ist auf dem Handy bis unten scrollbar",
  handy.erreicht && handy.unten >= handy.hoehe - 4, `${handy.unten}/${handy.hoehe}`);

// ---------- 7. Formular ----------
await ph.close();
await pf.goto(U + "/kontakt", { waitUntil: "networkidle" });
const form = await pf.evaluate(() => {
  const f = document.querySelector("form.formular");
  if (!f) return null;
  const felder = [...f.querySelectorAll("input, textarea, select")];
  return {
    name: f.getAttribute("name"),
    netlify: f.hasAttribute("data-netlify") || f.hasAttribute("netlify"),
    versteckt: !!f.querySelector('input[name="form-name"]'),
    ohneLabel: felder.filter((e) => e.type !== "hidden" && !e.labels?.length && !e.getAttribute("aria-label")).length,
    pflicht: felder.filter((e) => e.required).length,
  };
});
merke("Formular ist bei Netlify angemeldet", !!form && form.netlify && form.versteckt, JSON.stringify(form));
merke("Jedes Feld hat ein Label", !!form && form.ohneLabel === 0, form ? `${form.ohneLabel} ohne` : "");

// ---------- 8. Navigation im Browser ----------
await pf.goto(U + "/", { waitUntil: "networkidle" });
await pf.click('.hauptmenue a[href="/ausstellung"]');
await pf.waitForTimeout(400);
const nachKlick = await pf.evaluate(() => ({ weg: location.pathname, y: window.scrollY }));
await pf.goBack(); await pf.waitForTimeout(400);
const zurueck = await pf.evaluate(() => location.pathname);
merke("Menüklick führt zur Ausstellung, oben beginnend", nachKlick.weg === "/ausstellung" && nachKlick.y < 20, JSON.stringify(nachKlick));
merke("Zurück-Taste führt zurück", zurueck === "/", zurueck);

merke("Keine Fehler in der Konsole", fehler.length === 0, fehler.slice(0, 3).join(" | "));

await browser.close();
let schlecht = 0;
for (const r of raus) { if (!r.ok) schlecht++; console.log(`${r.ok ? "✓" : "✗"} ${r.n}${r.notiz ? "  — " + r.notiz : ""}`); }
console.log(`\n${raus.length - schlecht}/${raus.length} bestanden`);
