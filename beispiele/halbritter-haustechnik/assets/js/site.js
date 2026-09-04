/* ============================================================================
   Halbritter Haustechnik - Skript dieser Seite
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

  var nav = document.querySelector(".werkleiste");
  if (hatGSAP && nav) {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onToggle: function (self) { nav.classList.toggle("is-stuck", self.isActive); }
    });
  }

  var burger = document.querySelector(".werkleiste__burger");
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

  var schieber = document.querySelector(".schieber");
  if (!schieber) return;

  var pos = 50;

  function setzen(neu) {
    pos = Math.max(0, Math.min(100, neu));
    schieber.style.setProperty("--pos", pos + "%");
    schieber.setAttribute("aria-valuenow", Math.round(pos));
  }

  function ausEvent(e) {
    var r = schieber.getBoundingClientRect();
    setzen(((e.clientX - r.left) / r.width) * 100);
  }

  var zieht = false;

  schieber.addEventListener("pointerdown", function (e) {
    zieht = true;
    schieber.setPointerCapture(e.pointerId);
    ausEvent(e);
  });

  schieber.addEventListener("pointermove", function (e) {
    if (zieht) { ausEvent(e); return; }
    /* Ohne gedrueckte Taste folgt die Kante sanft dem Zeiger, damit der
       Effekt sofort erkennbar ist, ohne dass man ihn erst finden muss. */
    if (e.pointerType === "mouse") ausEvent(e);
  });

  function loslassen(e) {
    if (!zieht) return;
    zieht = false;
    if (schieber.hasPointerCapture && schieber.hasPointerCapture(e.pointerId)) {
      schieber.releasePointerCapture(e.pointerId);
    }
  }
  schieber.addEventListener("pointerup", loslassen);
  schieber.addEventListener("pointercancel", loslassen);

  schieber.addEventListener("keydown", function (e) {
    var schritt = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft") { setzen(pos - schritt); e.preventDefault(); }
    if (e.key === "ArrowRight") { setzen(pos + schritt); e.preventDefault(); }
    if (e.key === "Home") { setzen(0); e.preventDefault(); }
    if (e.key === "End") { setzen(100); e.preventDefault(); }
  });

  setzen(50);

  /* Beim ersten Erscheinen einmal kurz aufziehen, damit sichtbar wird, dass
     sich hier etwas bewegen laesst. */
  if (window.Basis && window.Basis.gsap && !window.Basis.reduziert) {
    ScrollTrigger.create({
      trigger: schieber,
      start: "top 75%",
      once: true,
      onEnter: function () {
        gsap.fromTo({ v: 50 },
          { v: 50 },
          {
            v: 78, duration: 1.1, ease: "power2.inOut", yoyo: true, repeat: 1,
            onUpdate: function () { setzen(this.targets()[0].v); }
          });
      }
    });
  }
})();


/* ---------------------------------------------- Tarifblatt (Leistungen) */
/*
   Umschalter zwischen Jahresbetrag und Monatsrate. Getauscht wird nur Text:
   jede Zahl traegt beide Werte als data-jahr und data-monat. Ohne
   JavaScript steht der Jahresbetrag da und der Umschalter verschwindet -
   dann ist die Seite immer noch vollstaendig.
*/
(function () {
  "use strict";

  var schalter = document.querySelector(".tarife__schalter");
  if (!schalter) return;

  var knoepfe = Array.prototype.slice.call(schalter.querySelectorAll("button"));
  var felder  = Array.prototype.slice.call(
                  document.querySelectorAll(".tarife [data-jahr]"));

  function setzen(takt, platz) {
    knoepfe.forEach(function (k) {
      var an = k.getAttribute("data-takt") === takt;
      k.classList.toggle("is-an", an);
      k.setAttribute("aria-pressed", String(an));
    });
    schalter.style.setProperty("--platz", platz);
    felder.forEach(function (f) {
      var wert = f.getAttribute("data-" + takt);
      if (wert) f.innerHTML = wert;
    });
  }

  knoepfe.forEach(function (k, i) {
    k.addEventListener("click", function () {
      setzen(k.getAttribute("data-takt"), i);
    });
  });
})();


/* ----------------------------------------------------- Leitungen im Aufmacher */
/*
   Der erste Bildschirm dieser Seite. Rechtwinklige Wege ueber ein Raster,
   wie in einem Installationsplan; darauf laufen Impulse entlang und
   erhellen die Strecke kurz hinter sich. An den Knicken sitzen Punkte.

   Warum rechtwinklig: eine Leitung im Haus laeuft an der Wand entlang und
   nicht diagonal durch den Raum. Das ist der ganze Trick daran.

   Sparsam gerechnet: hoechstens 2x Bildpunktdichte, Anzahl der Wege haengt
   an der Breite, laeuft nur solange sichtbar, und bei
   prefers-reduced-motion wird einmal gezeichnet und dann angehalten.
*/
(function () {
  "use strict";

  var leinwand = document.querySelector(".leitungen");
  if (!leinwand || !leinwand.getContext) return;

  var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stift = leinwand.getContext("2d");
  var breite = 0, hoehe = 0, dichte = 1;
  var wege = [], impulse = [];
  var laeuft = false, bild = 0, vorher = 0;

  var RASTER = 46;      /* Kantenlaenge des Rasters in Bildpunkten */
  var BLAU = "47, 109, 240";

  /* Ein Weg ist eine Folge von Punkten, die nur waagerecht oder senkrecht
     voneinander abweichen. Erzeugt wird er als Irrfahrt auf dem Raster. */
  function wegBauen() {
    var spalten = Math.ceil(breite / RASTER);
    var zeilen = Math.ceil(hoehe / RASTER);
    var x = Math.floor(Math.random() * spalten);
    var y = Math.floor(Math.random() * zeilen);
    var punkte = [[x, y]];
    var waagerecht = Math.random() < 0.5;
    var schritte = 5 + Math.floor(Math.random() * 6);

    for (var i = 0; i < schritte; i++) {
      var weite = 1 + Math.floor(Math.random() * 4);
      var richtung = Math.random() < 0.5 ? -1 : 1;
      if (waagerecht) x = Math.max(0, Math.min(spalten, x + weite * richtung));
      else            y = Math.max(0, Math.min(zeilen,  y + weite * richtung));
      punkte.push([x, y]);
      waagerecht = !waagerecht;   /* nach jedem Stueck rechtwinklig abbiegen */
    }
    return punkte;
  }

  /* Gesamtlaenge und Streckenanteile - damit ein Impuls gleichmaessig
     schnell laeuft und nicht in kurzen Stuecken beschleunigt. */
  function vermessen(punkte) {
    var teile = [], gesamt = 0;
    for (var i = 1; i < punkte.length; i++) {
      var l = (Math.abs(punkte[i][0] - punkte[i-1][0]) +
               Math.abs(punkte[i][1] - punkte[i-1][1])) * RASTER;
      teile.push(l); gesamt += l;
    }
    return { teile: teile, gesamt: gesamt };
  }

  function ortAuf(weg, strecke) {
    var rest = strecke;
    for (var i = 0; i < weg.mass.teile.length; i++) {
      if (rest <= weg.mass.teile[i]) {
        var a = weg.punkte[i], b = weg.punkte[i+1];
        var t = weg.mass.teile[i] ? rest / weg.mass.teile[i] : 0;
        return [ (a[0] + (b[0]-a[0]) * t) * RASTER,
                 (a[1] + (b[1]-a[1]) * t) * RASTER ];
      }
      rest -= weg.mass.teile[i];
    }
    var e = weg.punkte[weg.punkte.length-1];
    return [e[0]*RASTER, e[1]*RASTER];
  }

  function messen() {
    var r = leinwand.getBoundingClientRect();
    dichte = Math.min(window.devicePixelRatio || 1, 2);
    breite = Math.max(1, Math.round(r.width));
    hoehe = Math.max(1, Math.round(r.height));
    leinwand.width = Math.round(breite * dichte);
    leinwand.height = Math.round(hoehe * dichte);
    stift.setTransform(dichte, 0, 0, dichte, 0, 0);

    var soll = Math.max(4, Math.min(12, Math.round(breite / 190)));
    wege = [];
    for (var i = 0; i < soll; i++) {
      var punkte = wegBauen();
      wege.push({ punkte: punkte, mass: vermessen(punkte) });
    }
    impulse = wege.map(function (w, i) {
      return { weg: i, bei: Math.random() * w.mass.gesamt,
               tempo: 90 + Math.random() * 110 };
    });
  }

  function zeichnen(jetzt) {
    var dt = Math.min((jetzt - vorher) / 1000 || 0, 0.05);
    vorher = jetzt;
    stift.clearRect(0, 0, breite, hoehe);

    /* Erst die Wege selbst, sehr zurueckhaltend. */
    stift.lineWidth = 1;
    stift.strokeStyle = "rgba(" + BLAU + ", .16)";
    for (var i = 0; i < wege.length; i++) {
      var p = wege[i].punkte;
      stift.beginPath();
      stift.moveTo(p[0][0]*RASTER, p[0][1]*RASTER);
      for (var j = 1; j < p.length; j++) stift.lineTo(p[j][0]*RASTER, p[j][1]*RASTER);
      stift.stroke();

      /* Punkte an den Knicken, wie Dosen im Plan. */
      stift.fillStyle = "rgba(" + BLAU + ", .26)";
      for (var k = 1; k < p.length - 1; k++) {
        stift.beginPath();
        stift.arc(p[k][0]*RASTER, p[k][1]*RASTER, 2.2, 0, Math.PI*2);
        stift.fill();
      }
    }

    /* Dann die Impulse: ein kurzer heller Schweif entlang der Strecke. */
    for (var m = 0; m < impulse.length; m++) {
      var imp = impulse[m], weg = wege[imp.weg];
      if (!ruhig) imp.bei += imp.tempo * dt;
      if (imp.bei > weg.mass.gesamt + 120) imp.bei = -Math.random() * 200;

      for (var s = 0; s < 14; s++) {
        var stelle = imp.bei - s * 7;
        if (stelle < 0 || stelle > weg.mass.gesamt) continue;
        var o = ortAuf(weg, stelle);
        var staerke = (1 - s / 14);
        stift.fillStyle = "rgba(" + BLAU + "," + (staerke * 0.85) + ")";
        stift.beginPath();
        stift.arc(o[0], o[1], 1.6 + staerke * 1.6, 0, Math.PI*2);
        stift.fill();
      }
    }

    if (laeuft && !ruhig) bild = requestAnimationFrame(zeichnen);
  }

  function anhalten() { laeuft = false; cancelAnimationFrame(bild); }
  function anwerfen() {
    if (laeuft) return;
    laeuft = true; vorher = performance.now();
    if (ruhig) zeichnen(vorher);          /* einmal zeichnen, dann stehen */
    else bild = requestAnimationFrame(zeichnen);
  }

  messen();
  window.addEventListener("resize", function () { messen(); }, { passive: true });

  var band = leinwand.closest(".aufmacher");
  if ("IntersectionObserver" in window && band) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) anwerfen(); else anhalten();
    }, { threshold: 0.02 }).observe(band);
  } else {
    anwerfen();
  }
})();
