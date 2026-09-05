/* ============================================================================
   Osteria Fontana - Skript dieser Seite
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

  var nav = document.querySelector(".firmenschild");
  if (nav && "IntersectionObserver" in window) {
    var marke = document.createElement("span");
    marke.setAttribute("aria-hidden", "true");
    marke.style.cssText = "position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none";
    document.body.appendChild(marke);
    new IntersectionObserver(function (e) {
      nav.classList.toggle("is-stuck", !e[0].isIntersecting);
    }).observe(marke);
  }

  var burger = document.querySelector(".firmenschild__burger");
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

  /* Ankerlinks um das fixierte Firmenschild versetzen */
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
     Maske; der Text selbst bleibt zusammenhaengender Fliesstext und damit
     fuer Vorlesesoftware unveraendert lesbar.
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
      aussen.style.setProperty("--verzug", (i * 150) + "ms");
      var innen = document.createElement("span");
      innen.textContent = gruppe.map(function (s) { return s.textContent; }).join("");
      aussen.appendChild(innen);
      el.appendChild(aussen);
    });
  }

  /* ------------------------------------------------------------- Bewegung */
  /*
     Das Haus hat keine Eile. Nichts springt herein: die Bloecke kommen
     einzeln, spaet und langsam - erst wenn sie wirklich im Blick sind
     (threshold 0.28), nicht schon am unteren Rand. Deshalb wird hier auch
     nicht gebuendelt wie anderswo; jeder Block hat seinen eigenen Moment.
     Die Laenge steckt in --takt (660 ms), die Kurve in --ease.
  */

  function aufdecken(liste, schritt) {
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(liste, function (el) { el.classList.add("ist-da"); });
      return;
    }
    var offen = 0;
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        beobachter.unobserve(e.target);
        if (--offen <= 0) beobachter.disconnect();
        e.target.style.setProperty("--verzug", schritt + "ms");
        e.target.classList.add("ist-da");
      });
    }, { rootMargin: "0px 0px -14% 0px", threshold: 0.28 });
    Array.prototype.forEach.call(liste, function (el) {
      /* Sehr hohe Bloecke erreichen 28 Prozent nie am Stueck - fuer sie
         wird der Schwellenwert zurueckgenommen. */
      if (el.offsetHeight > window.innerHeight * 0.8) {
        var einzeln = new IntersectionObserver(function (ee) {
          if (!ee[0].isIntersecting) return;
          einzeln.disconnect();
          ee[0].target.classList.add("ist-da");
        }, { threshold: 0.04 });
        einzeln.observe(el);
      } else { offen++; beobachter.observe(el); }
    });
  }

  if (reduziert) {
    root.classList.add("ohne-bewegung");
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".reveal-lines"), zeilenAufbauen);

    /* Der Aufmacher kommt wie Licht, das langsam hochgedreht wird. */
    var heroTeile = document.querySelectorAll("[data-hero]");
    Array.prototype.forEach.call(heroTeile, function (el, i) {
      el.style.setProperty("--verzug", (220 + i * 170) + "ms");
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        Array.prototype.forEach.call(heroTeile, function (el) { el.classList.add("ist-da"); });
      });
    });

    aufdecken(document.querySelectorAll(".reveal"), 0);
    aufdecken(document.querySelectorAll(".reveal-lines"), 0);
  }

  /* --------------------------------------------------- Hilfen fuer Seiten */

  return {
    bewegt: !reduziert,
    reduziert: reduziert,

    /* Der Knopf folgt dem Zeiger, aber weich und traege - passend zum Haus.
       Gezeichnet wird nur einmal je Bild, nicht bei jeder Mausbewegung. */
    magnetisch: function (el, staerke) {
      if (reduziert || grob) return;
      staerke = staerke || 0.32;
      var zx = 0, zy = 0, x = 0, y = 0, laeuft = false;

      function schritt() {
        x += (zx - x) * 0.09;
        y += (zy - y) * 0.09;
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


/* --------------------------------------- 2. Signatur-Interaktion */

(function () {
  "use strict";
  if (!window.Basis || !window.Basis.bewegt) return;

  /* ------------------------------------------------------------- Laufband */
  /*
     Die Spur wird verdoppelt und um genau eine Haelfte verschoben. Dadurch
     ist der Uebergang nahtlos, ohne Sprung und ohne Rechnerei bei Resize.
     Geschoben wird von CSS; beim Zeigen wird nur die Dauer hochgesetzt,
     dann laeuft das Band aus statt abrupt zu stehen.
  */
  var spur = document.querySelector(".marquee__spur");
  if (spur) {
    spur.innerHTML += spur.innerHTML;
    spur.classList.add("laeuft");
    var band = spur.parentElement;
    band.addEventListener("pointerenter", function () { band.classList.add("is-ruhig"); });
    band.addEventListener("pointerleave", function () { band.classList.remove("is-ruhig"); });
  }

  /* Knoepfe folgen dem Zeiger leicht. */
  Array.prototype.forEach.call(
    document.querySelectorAll(".hero__actions .btn"),
    function (b) { window.Basis.magnetisch(b, 0.22); }
  );
})();


/* ------------------------------------------------------- Gaenge (Karussell) */
/*
   Fuenf Gaenge, einer davon vorn. Das Skript setzt je Karte nur:
     --ab   Abstand mit Vorzeichen (Richtung)
     --weg  Betrag davon (Groesse, Deckkraft, Unschaerfe)
     data-vorn / data-fern  fuer Text und Ausblenden
   Alles Uebrige rechnet das CSS. Umlaufend, damit die Pfeile nie ins Leere
   fuehren. Ohne JavaScript stehen die Karten nebeneinander und sind lesbar.
*/
(function () {
  "use strict";

  var reihe = document.querySelector(".gaenge__reihe");
  if (!reihe) return;

  var karten = Array.prototype.slice.call(reihe.querySelectorAll(".gang"));
  var punkte = Array.prototype.slice.call(document.querySelectorAll(".gaenge__punkte button"));
  var zurueck = document.querySelector(".gaenge__pfeil--zurueck");
  var vor     = document.querySelector(".gaenge__pfeil--vor");
  var n = karten.length;
  var vorn = 0;

  function zeichnen() {
    karten.forEach(function (k, i) {
      var d = (i - vorn + n) % n;
      var ab = d > n / 2 ? d - n : d;
      var weg = Math.abs(ab);
      k.style.setProperty("--ab", ab);
      k.style.setProperty("--weg", weg);
      k.setAttribute("data-vorn", weg === 0 ? "ja" : "nein");
      k.setAttribute("data-fern", weg > 1 ? "ja" : "nein");
      /* Was man nicht sieht, soll auch nicht vorgelesen werden. */
      k.setAttribute("aria-hidden", weg > 1 ? "true" : "false");
    });
    punkte.forEach(function (p, i) {
      p.setAttribute("aria-selected", i === vorn ? "true" : "false");
    });
  }

  function waehlen(i) { vorn = ((i % n) + n) % n; zeichnen(); }

  if (zurueck) zurueck.addEventListener("click", function () { waehlen(vorn - 1); });
  if (vor)     vor.addEventListener("click",     function () { waehlen(vorn + 1); });
  punkte.forEach(function (p, i) { p.addEventListener("click", function () { waehlen(i); }); });

  /* Ein Klick auf den Nachbarn holt ihn nach vorn. */
  karten.forEach(function (k, i) { k.addEventListener("click", function () { waehlen(i); }); });

  document.querySelector(".gaenge").addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); waehlen(vorn + 1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); waehlen(vorn - 1); }
  });

  zeichnen();
})();


/* -------------------------------------------------------- Kerzenlicht im Anschlag */
/*
   Der erste Bildschirm dieser Seite. Zwei bis drei warme Lichtinseln, die
   unabhaengig voneinander flackern, dazu langsam aufsteigende Partikel wie
   Staub im Gegenlicht.

   Das Flackern ist bewusst kein Zufallsrauschen, sondern die Summe dreier
   Sinuskurven mit unrunden Verhaeltnissen. Reiner Zufall zappelt; so atmet
   es. Bei prefers-reduced-motion steht das Licht still.
*/
(function () {
  "use strict";

  var leinwand = document.querySelector(".kerzen");
  if (!leinwand || !leinwand.getContext) return;

  var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stift = leinwand.getContext("2d");
  var breite = 0, hoehe = 0, dichte = 1;
  var lichter = [], staub = [];
  var laeuft = false, bild = 0, vorher = 0, uhr = 0;

  function messen() {
    var r = leinwand.getBoundingClientRect();
    dichte = Math.min(window.devicePixelRatio || 1, 2);
    breite = Math.max(1, Math.round(r.width));
    hoehe = Math.max(1, Math.round(r.height));
    leinwand.width = Math.round(breite * dichte);
    leinwand.height = Math.round(hoehe * dichte);
    stift.setTransform(dichte, 0, 0, dichte, 0, 0);

    lichter = [
      { x: .30, y: .62, gross: .48, ton: "214, 122, 78",  kraft: .34, takt: 1.00 },
      { x: .72, y: .40, gross: .40, ton: "226, 168, 104", kraft: .26, takt: 1.37 },
      { x: .52, y: .84, gross: .55, ton: "180,  92,  56", kraft: .20, takt: 0.71 }
    ];

    var soll = Math.max(20, Math.min(90, Math.round(breite * hoehe / 22000)));
    staub = [];
    for (var i = 0; i < soll; i++) {
      staub.push({
        x: Math.random() * breite,
        y: Math.random() * hoehe,
        r: 0.5 + Math.random() * 1.4,
        steigt: 5 + Math.random() * 16,
        seite: (Math.random() - .5) * 7,
        phase: Math.random() * Math.PI * 2,
        deckung: 0.06 + Math.random() * 0.22
      });
    }
  }

  /* Drei Sinuskurven mit unrunden Verhaeltnissen ergeben ein Flackern, das
     sich nicht hoerbar wiederholt. */
  function flackern(t, takt) {
    return 0.82
      + Math.sin(t * 1.7 * takt) * 0.07
      + Math.sin(t * 3.1 * takt + 1.3) * 0.06
      + Math.sin(t * 5.9 * takt + 2.7) * 0.05;
  }

  function zeichnen(jetzt) {
    var dt = Math.min((jetzt - vorher) / 1000 || 0, 0.05);
    vorher = jetzt;
    if (!ruhig) uhr += dt;

    stift.clearRect(0, 0, breite, hoehe);
    stift.globalCompositeOperation = "lighter";

    for (var i = 0; i < lichter.length; i++) {
      var L = lichter[i];
      var f = ruhig ? 0.82 : flackern(uhr, L.takt);
      var cx = L.x * breite, cy = L.y * hoehe;
      var rad = L.gross * Math.max(breite, hoehe) * f;
      var v = stift.createRadialGradient(cx, cy, 0, cx, cy, rad);
      v.addColorStop(0,   "rgba(" + L.ton + "," + (L.kraft * f) + ")");
      v.addColorStop(.45, "rgba(" + L.ton + "," + (L.kraft * f * .28) + ")");
      v.addColorStop(1,   "rgba(" + L.ton + ",0)");
      stift.fillStyle = v;
      stift.beginPath(); stift.arc(cx, cy, rad, 0, Math.PI * 2); stift.fill();
    }

    for (var j = 0; j < staub.length; j++) {
      var s = staub[j];
      if (!ruhig) {
        s.y -= s.steigt * dt;
        s.phase += dt * .5;
        if (s.y < -8) { s.y = hoehe + 8; s.x = Math.random() * breite; }
      }
      stift.fillStyle = "rgba(255, 226, 190," + s.deckung + ")";
      stift.beginPath();
      stift.arc(s.x + Math.sin(s.phase) * s.seite, s.y, s.r, 0, Math.PI * 2);
      stift.fill();
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

  var raum = leinwand.closest(".anschlag");
  if ("IntersectionObserver" in window && raum) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) anwerfen(); else anhalten();
    }, { threshold: 0.02 }).observe(raum);
  } else {
    anwerfen();
  }
})();


/* ------------------------------------------------------------- Tiefe im Anschlag */
/*
   Das Bild im Anschlag laeuft beim Scrollen deutlich langsamer als die
   Seite - mehr Weg als bei den anderen, weil hier alles langsamer ist.
   Nur eine Transform, und nur solange der Anschlag sichtbar ist.
*/
(function () {
  "use strict";
  var bild = document.querySelector(".anschlag__bild img");
  var band = document.querySelector(".anschlag");
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
    bild.style.transform = "translate3d(0," + (anteil * 60).toFixed(1) + "px,0) scale(1.12)";
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
   Beim Wechsel senkt sich ein warmer Schleier ueber die Seite und hebt
   sich drueben wieder - langsam, wie das Licht im Raum. Kein Balken,
   kein Wischen; das waere zu ruppig fuer dieses Haus.

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
    setTimeout(function () { window.location.href = ziel; }, 420);
  });
})();
