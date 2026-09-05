/* ============================================================================
   Zahnaerzte am Koenigsplatz - Skript dieser Seite
   ----------------------------------------------------------------------------
   1. Grundverhalten: Navigation, Menue, Bildplaetze, Scroll-Einblendungen
      und Zeilen-Reveals. Stellt window.Basis fuer Abschnitt 2 bereit.
   2. Signatur-Interaktion dieser Seite.
   Ohne JavaScript bleibt alles lesbar, bei prefers-reduced-motion wird
   direkt der Endzustand gezeigt.
   ========================================================================= */

/* ------------------------------------------------- 1. Grundverhalten */

window.Basis = (function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var grob      = window.matchMedia("(pointer: coarse)").matches;

  /* ------------------------------------------------------------ Bildplaetze */

  Array.prototype.forEach.call(document.querySelectorAll(".ph img"), function (img) {
    function fuellen() {
      img.classList.add("is-loaded");
      img.closest(".ph").classList.add("is-filled");
    }
    if (img.complete && img.naturalWidth > 0) fuellen();
    else img.addEventListener("load", fuellen, { once: true });
  });

  /* -------------------------------------------------------------- Navigation */

  var nav = document.querySelector(".schwebeleiste");
  if (nav && "IntersectionObserver" in window) {
    var marke = document.createElement("span");
    marke.setAttribute("aria-hidden", "true");
    marke.style.cssText = "position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none";
    document.body.appendChild(marke);
    new IntersectionObserver(function (e) {
      nav.classList.toggle("is-stuck", !e[0].isIntersecting);
    }).observe(marke);
  }

  var burger = document.querySelector(".schwebeleiste__burger");
  var menu = document.querySelector(".menu");
  if (burger && menu) {
    menu.hidden = false;
    var offen = false;
    function setzeMenu(neu) {
      offen = neu;
      menu.classList.toggle("is-open", offen);
      burger.setAttribute("aria-expanded", String(offen));
      burger.setAttribute("aria-label", offen ? "Menü schließen" : "Menü öffnen");
      document.body.style.overflow = offen ? "hidden" : "";
      if (offen) menu.querySelector("a").focus();
    }
    burger.addEventListener("click", function () { setzeMenu(!offen); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setzeMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && offen) { setzeMenu(false); burger.focus(); }
    });
  }

  /* Ankerlinks um die schwebende Leiste versetzen */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var ziel = document.querySelector(id);
      if (!ziel) return;
      e.preventDefault();
      window.scrollTo({
        top: ziel.getBoundingClientRect().top + window.pageYOffset - 70,
        behavior: reduziert ? "auto" : "smooth"
      });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* --------------------------------------------------------- Zeilen-Reveal */
  /*
     Ueberschriften werden zeilenweise aufgedeckt. Jede Zeile liegt in einer
     Maske; der Text bleibt danach normaler Fliesstext und damit fuer
     Vorlesesoftware unveraendert.
  */
  function zeilenAufbauen(el) {
    var text = el.textContent.trim();
    var woerter = text.split(/\s+/);
    el.textContent = "";
    var spans = woerter.map(function (w, i) {
      var s = document.createElement("span");
      s.className = "wort";
      s.textContent = w + (i < woerter.length - 1 ? " " : "");
      el.appendChild(s);
      return s;
    });

    var zeilen = [], aktuell = null, letztesTop = null;
    spans.forEach(function (s) {
      var top = Math.round(s.offsetTop);
      if (letztesTop === null || Math.abs(top - letztesTop) > 4) {
        aktuell = []; zeilen.push(aktuell); letztesTop = top;
      }
      aktuell.push(s);
    });

    el.textContent = "";
    zeilen.forEach(function (gruppe, i) {
      var aussen = document.createElement("span");
      aussen.className = "zeile";
      aussen.style.setProperty("--verzug", (i * 110) + "ms");
      var innen = document.createElement("span");
      innen.textContent = gruppe.map(function (s) { return s.textContent; }).join("");
      aussen.appendChild(innen);
      el.appendChild(aussen);
    });
  }

  /* ------------------------------------------------------------- Bewegung */
  /*
     In einer Praxis soll nichts erschrecken. Die Bloecke kommen nicht von
     der Seite und nicht von unten hereingefahren, sie wachsen aus sich
     heraus auf ihre Groesse - langsam (--takt 480 ms) und ohne harte
     Kante. Der Takt ist bewusst gross, damit nie zwei Dinge gleichzeitig
     passieren.
  */

  function aufdecken(liste, schritt) {
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(liste, function (el) { el.classList.add("ist-da"); });
      return;
    }
    var stapel = [], leer = null;
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        beobachter.unobserve(e.target);
        stapel.push(e.target);
        clearTimeout(leer);
        leer = setTimeout(function () {
          stapel.forEach(function (el, i) {
            el.style.setProperty("--verzug", (i * schritt) + "ms");
            el.classList.add("ist-da");
          });
          stapel = [];
        }, 60);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(liste, function (el) { beobachter.observe(el); });
  }

  if (reduziert) {
    root.classList.add("ohne-bewegung");
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".reveal-lines"), zeilenAufbauen);

    var heroTeile = document.querySelectorAll("[data-hero]");
    Array.prototype.forEach.call(heroTeile, function (el, i) {
      el.style.setProperty("--verzug", (140 + i * 120) + "ms");
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        Array.prototype.forEach.call(heroTeile, function (el) { el.classList.add("ist-da"); });
      });
    });

    aufdecken(document.querySelectorAll(".reveal"), 95);
    aufdecken(document.querySelectorAll(".reveal-lines"), 0);
  }

  /* --------------------------------------------------- Hilfen fuer Seiten */

  return {
    bewegt: !reduziert,
    reduziert: reduziert,

    /* Knopf, der dem Zeiger folgt - weich, ohne Nachschwingen. */
    magnetisch: function (el, staerke) {
      if (reduziert || grob) return;
      staerke = staerke || 0.32;
      var zx = 0, zy = 0, x = 0, y = 0, laeuft = false;

      function schritt() {
        x += (zx - x) * 0.11;
        y += (zy - y) * 0.11;
        el.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
        if (Math.abs(zx - x) > 0.1 || Math.abs(zy - y) > 0.1) { requestAnimationFrame(schritt); return; }
        laeuft = false;
        /* Steht der Knopf wieder in der Mitte, wird der Stil ganz entfernt -
           sonst blockiert er die Transform aus dem CSS beim Ueberfahren. */
        if (!zx && !zy) { x = 0; y = 0; el.style.transform = ""; }
      }
      function anwerfen() { if (!laeuft) { laeuft = true; requestAnimationFrame(schritt); } }

      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        zx = (e.clientX - (r.left + r.width / 2)) * staerke;
        zy = (e.clientY - (r.top + r.height / 2)) * staerke;
        anwerfen();
      });
      el.addEventListener("pointerleave", function () { zx = 0; zy = 0; anwerfen(); });
    },

    /* Lichtkegel, der unter dem Zeiger ueber eine Karte wandert. */
    spotlight: function (el) {
      if (grob) return;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    }
  };
})();


/* ------------------------------------------------------------ Atem im Empfang */
/*
   Der erste Bildschirm dieser Seite. Fuenf weiche Formen ziehen sehr langsam
   ihre Bahn und schieben sich dabei ineinander. Kein Blinken, kein Zucken -
   das Tempo ist bewusst niedriger als das, was man bewusst wahrnimmt.

   Der Grund fuer die Langsamkeit: die Seite wirbt damit, Angst zu nehmen.
   Alles, was ruckt, arbeitet dagegen.

   Die Bahnen sind Lissajous-Figuren mit unrunden Verhaeltnissen - so
   wiederholt sich das Bild praktisch nie, ohne dass Zufall im Spiel ist.
*/
(function () {
  "use strict";

  var leinwand = document.querySelector(".atem");
  if (!leinwand || !leinwand.getContext) return;

  var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stift = leinwand.getContext("2d");
  var breite = 0, hoehe = 0, dichte = 1;
  var formen = [];
  var laeuft = false, bild = 0, vorher = 0, uhr = 0;

  function messen() {
    var r = leinwand.getBoundingClientRect();
    dichte = Math.min(window.devicePixelRatio || 1, 2);
    breite = Math.max(1, Math.round(r.width));
    hoehe = Math.max(1, Math.round(r.height));
    leinwand.width = Math.round(breite * dichte);
    leinwand.height = Math.round(hoehe * dichte);
    stift.setTransform(dichte, 0, 0, dichte, 0, 0);

    formen = [
      { ton: "154, 214, 190", kraft: .30, gross: .40, ax: .30, ay: .16, fx: 0.061, fy: 0.083, px: 0.0, py: 1.1, mx: .28, my: .42 },
      { ton: "233, 122,  78", kraft: .22, gross: .30, ax: .26, ay: .20, fx: 0.047, fy: 0.069, px: 2.1, py: 0.4, mx: .72, my: .56 },
      { ton: "110, 190, 160", kraft: .20, gross: .46, ax: .34, ay: .13, fx: 0.037, fy: 0.053, px: 4.2, py: 2.6, mx: .52, my: .30 },
      { ton: "255, 236, 210", kraft: .11, gross: .26, ax: .22, ay: .18, fx: 0.073, fy: 0.041, px: 1.4, py: 3.3, mx: .40, my: .74 },
      { ton: "233, 122,  78", kraft: .13, gross: .22, ax: .30, ay: .15, fx: 0.029, fy: 0.097, px: 3.7, py: 1.9, mx: .84, my: .24 }
    ];
  }

  function zeichnen(jetzt) {
    var dt = Math.min((jetzt - vorher) / 1000 || 0, 0.05);
    vorher = jetzt;
    if (!ruhig) uhr += dt;

    stift.clearRect(0, 0, breite, hoehe);
    stift.globalCompositeOperation = "lighter";

    var kante = Math.max(breite, hoehe);
    for (var i = 0; i < formen.length; i++) {
      var f = formen[i];
      var cx = (f.mx + Math.sin(uhr * f.fx * 6.283 + f.px) * f.ax) * breite;
      var cy = (f.my + Math.cos(uhr * f.fy * 6.283 + f.py) * f.ay) * hoehe;
      /* Der Radius atmet leicht mit - sonst wirken die Formen wie Schablonen. */
      var rad = f.gross * kante * (1 + Math.sin(uhr * f.fx * 3.1 + f.py) * 0.09);
      var v = stift.createRadialGradient(cx, cy, 0, cx, cy, rad);
      v.addColorStop(0,   "rgba(" + f.ton + "," + f.kraft + ")");
      v.addColorStop(.55, "rgba(" + f.ton + "," + (f.kraft * .22) + ")");
      v.addColorStop(1,   "rgba(" + f.ton + ",0)");
      stift.fillStyle = v;
      stift.beginPath(); stift.arc(cx, cy, rad, 0, Math.PI * 2); stift.fill();
    }

    stift.globalCompositeOperation = "source-over";
    if (laeuft && !ruhig) bild = requestAnimationFrame(zeichnen);
  }

  function anhalten() { laeuft = false; cancelAnimationFrame(bild); }
  function anwerfen() {
    if (laeuft) return;
    laeuft = true; vorher = performance.now();
    if (ruhig) zeichnen(vorher); else bild = requestAnimationFrame(zeichnen);
  }

  messen();
  window.addEventListener("resize", function () { messen(); }, { passive: true });

  var feld = leinwand.closest(".empfang__feld");
  if ("IntersectionObserver" in window && feld) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) anwerfen(); else anhalten();
    }, { threshold: 0.02 }).observe(feld);
  } else {
    anwerfen();
  }
})();


/* ------------------------------------------------------------- Tiefe im Empfang */
/*
   Das Bild unter dem gruenen Feld laeuft beim Scrollen etwas langsamer
   als die Seite. Bewusst wenig Weg - die Seite soll ruhig bleiben.
*/
(function () {
  "use strict";
  var bild = document.querySelector(".empfang__bild img");
  var band = document.querySelector(".empfang");
  if (!bild || !band) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  var sichtbar = false, laeuft = false;
  bild.style.willChange = "transform";
  bild.style.transform = "scale(1.12)";

  function zeichnen() {
    laeuft = false;
    var r = band.getBoundingClientRect();
    var anteil = (r.top + r.height / 2) / window.innerHeight - 0.5;
    bild.style.transform = "translate3d(0," + (anteil * 34).toFixed(1) + "px,0) scale(1.12)";
  }
  function planen() { if (!laeuft && sichtbar) { laeuft = true; requestAnimationFrame(zeichnen); } }

  new IntersectionObserver(function (e) {
    sichtbar = e[0].isIntersecting; if (sichtbar) planen();
  }).observe(band);
  window.addEventListener("scroll", planen, { passive: true });
  window.addEventListener("resize", planen);
  planen();
})();

/* ---------------------------------------------------------- Seitenwechsel */
/*
   Beim Wechsel steigt ein weiches gruenes Feld von unten auf und faellt
   drueben wieder ab. Runde Oberkante, damit es zur Formensprache der
   Seite passt.

   Ohne JavaScript passiert nichts Besonderes, die Verweise funktionieren
   normal. Wer mit gedrueckter Steuerungstaste oder mittlerer Maustaste
   klickt, will einen neuen Tab und wird nicht aufgehalten.
*/
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var vorhang = document.createElement("div");
  vorhang.className = "wechsel";
  vorhang.setAttribute("aria-hidden", "true");
  document.body.appendChild(vorhang);
  requestAnimationFrame(function () { document.body.classList.add("ist-da"); });

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target && a.target !== "_self") return;
    var ziel = a.getAttribute("href") || "";
    if (!ziel || ziel.charAt(0) === "#" || /^(https?:|mailto:|tel:)/.test(ziel)) return;
    if (ziel === "../") return;

    e.preventDefault();
    document.body.classList.remove("ist-da");
    document.body.classList.add("geht");
    setTimeout(function () { window.location.href = ziel; }, 360);
  });
})();
