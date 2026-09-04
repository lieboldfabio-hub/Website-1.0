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

  var hatGSAP = typeof window.gsap !== "undefined";
  if (hatGSAP && typeof window.ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

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
  if (hatGSAP && nav) {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onToggle: function (self) { nav.classList.toggle("is-stuck", self.isActive); }
    });
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

  /* Ankerlinks um die fixierte Leiste versetzen */
  var reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
     Zerlegt eine Ueberschrift in echte Zeilen und legt jede in eine Maske,
     damit sie von unten hereinfahren kann. Nach dem Messen bleibt der Text
     als normaler Fliesstext im DOM und damit fuer Vorlesesoftware intakt.
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
    var traeger = [];
    zeilen.forEach(function (gruppe) {
      var aussen = document.createElement("span");
      aussen.className = "zeile";
      var innen = document.createElement("span");
      innen.textContent = gruppe.map(function (s) { return s.textContent; }).join("");
      aussen.appendChild(innen);
      el.appendChild(aussen);
      traeger.push(innen);
    });
    return traeger;
  }

  /* ---------------------------------------------------------- Bewegung ---- */

  if (hatGSAP) {
    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", function () {
      /* Hero baut sich gestaffelt auf und fuehrt zum Knopf */
      var heroTeile = gsap.utils.toArray("[data-hero]");
      if (heroTeile.length) {
        gsap.set(heroTeile, { opacity: 0, y: 22 });
        gsap.to(heroTeile, {
          opacity: 1, y: 0, duration: .85, ease: "power3.out",
          stagger: .09, delay: .12
        });
      }

      /* Abschnitte blenden beim Lesen ein */
      ScrollTrigger.batch(".reveal", {
        start: "top 86%",
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1, y: 0, duration: .7, ease: "power2.out",
            stagger: .08, overwrite: true
          });
        }
      });

      /* Ueberschriften zeilenweise aufdecken */
      gsap.utils.toArray(".reveal-lines").forEach(function (el) {
        var traeger = zeilenAufbauen(el);
        gsap.to(traeger, {
          y: "0%",
          duration: .9,
          ease: "power3.out",
          stagger: .08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        });
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", function () {
      gsap.set(".reveal, [data-hero]", { opacity: 1, y: 0 });
    });
  } else {
    root.classList.remove("js");
  }

  /* --------------------------------------------------- Hilfen fuer Seiten */

  return {
    gsap: hatGSAP,
    reduziert: reduziert,

    /* Knopf, der dem Zeiger leicht folgt. Laeuft ueber Motion-Werte statt
       ueber Zustand, damit kein Layout neu berechnet wird. */
    magnetisch: function (el, staerke) {
      if (!hatGSAP || reduziert || window.matchMedia("(pointer: coarse)").matches) return;
      staerke = staerke || 0.32;
      var qx = gsap.quickTo(el, "x", { duration: .4, ease: "power3" });
      var qy = gsap.quickTo(el, "y", { duration: .4, ease: "power3" });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * staerke);
        qy((e.clientY - (r.top + r.height / 2)) * staerke);
      });
      el.addEventListener("pointerleave", function () { qx(0); qy(0); });
    },

    /* Lichtkegel, der unter dem Zeiger ueber eine Karte wandert. */
    spotlight: function (el) {
      if (window.matchMedia("(pointer: coarse)").matches) return;
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
  if (!window.Basis || !window.Basis.gsap) return;

  var mm = gsap.matchMedia();

  /* ------------------------------------------------------------- Laufband */
  /*
     Die Spur wird verdoppelt und um genau eine Haelfte verschoben. Dadurch
     ist der Uebergang nahtlos, ohne Sprung und ohne Rechnerei bei Resize.
  */
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    var spur = document.querySelector(".marquee__spur");
    if (!spur) return;

    spur.innerHTML += spur.innerHTML;
    var tween = gsap.to(spur, {
      xPercent: -50,
      duration: 34,
      ease: "none",
      repeat: -1
    });

    /* Beim Zeigen anhalten, damit man in Ruhe lesen kann. */
    spur.parentElement.addEventListener("pointerenter", function () { tween.timeScale(0.15); });
    spur.parentElement.addEventListener("pointerleave", function () { tween.timeScale(1); });

    return function () { tween.kill(); };
  });

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
