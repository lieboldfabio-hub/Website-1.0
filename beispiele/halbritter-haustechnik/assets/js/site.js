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
  /*
     Die Leiste wird schmal, sobald die ersten 80 Pixel weggescrollt sind.
     Statt bei jedem Scrollschritt zu rechnen, liegt oben eine 80 Pixel hohe
     Marke; verlaesst sie das Bild, schaltet die Leiste um. Das kostet im
     laufenden Betrieb nichts.
  */

  var nav = document.querySelector(".werkleiste");
  if (nav && "IntersectionObserver" in window) {
    var marke = document.createElement("span");
    marke.setAttribute("aria-hidden", "true");
    marke.style.cssText = "position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none";
    document.body.appendChild(marke);
    new IntersectionObserver(function (e) {
      nav.classList.toggle("is-stuck", !e[0].isIntersecting);
    }).observe(marke);
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
    zeilen.forEach(function (gruppe, i) {
      var aussen = document.createElement("span");
      aussen.className = "zeile";
      aussen.style.setProperty("--verzug", (i * 70) + "ms");
      var innen = document.createElement("span");
      innen.textContent = gruppe.map(function (s) { return s.textContent; }).join("");
      aussen.appendChild(innen);
      el.appendChild(aussen);
    });
  }

  /* ------------------------------------------------------------- Bewegung */
  /*
     Handwerk heisst hier: kurz, gerade, ohne Schnoerkel. Die Bloecke werden
     nicht eingeblendet, sondern von links freigelegt - wie ein Bauplan, der
     aufgerollt wird. Getaktet wird in Vielfachen von --takt (170 ms), das
     Aufdecken selbst macht die CSS-Transition.

     Beobachtet wird mit einem IntersectionObserver, nicht mit einem
     Scroll-Listener: waehrend des Scrollens laeuft dadurch kein eigener
     Code mit.
  */

  function aufdecken(liste, schritt) {
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(liste, function (el) { el.classList.add("ist-da"); });
      return;
    }
    var stapel = [], leer = null, offen = liste.length;
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        beobachter.unobserve(e.target);
        if (--offen === 0) beobachter.disconnect();
        stapel.push(e.target);
        clearTimeout(leer);
        leer = setTimeout(function () {
          stapel.forEach(function (el, i) {
            /* Nach dem fuenften Element wird nicht weiter gestaffelt.
               Sonst wartet die letzte Karte einer grossen Gruppe eine
               halbe Sekunde auf ihren Auftritt, und die Seite wirkt
               langsam, obwohl sie es nicht ist. */
            el.style.setProperty("--verzug", (Math.min(i, 5) * schritt) + "ms");
            el.classList.add("ist-da");
          });
          stapel = [];
        }, 40);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    Array.prototype.forEach.call(liste, function (el) { beobachter.observe(el); });
  }

  if (reduziert) {
    root.classList.add("ohne-bewegung");
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".reveal-lines"), zeilenAufbauen);

    /* Der Aufmacher baut sich sofort auf, Teil fuer Teil. */
    var heroTeile = document.querySelectorAll("[data-hero]");
    Array.prototype.forEach.call(heroTeile, function (el, i) {
      el.style.setProperty("--verzug", (120 + i * 90) + "ms");
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        Array.prototype.forEach.call(heroTeile, function (el) { el.classList.add("ist-da"); });
      });
    });

    aufdecken(document.querySelectorAll(".reveal"), 55);
    aufdecken(document.querySelectorAll(".reveal-lines"), 0);
  }

  /* --------------------------------------------------- Hilfen fuer Seiten */

  return {
    bewegt: !reduziert,
    reduziert: reduziert,

    /* Knopf, der dem Zeiger leicht folgt. Der Zielwert wird beim Bewegen nur
       gemerkt, gezeichnet wird einmal pro Bild - so bleibt es ruhig, auch
       wenn die Maus schnell ist. */
    magnetisch: function (el, staerke) {
      if (reduziert || grob) return;
      staerke = staerke || 0.32;
      var zx = 0, zy = 0, x = 0, y = 0, laeuft = false;

      function schritt() {
        x += (zx - x) * 0.16;
        y += (zy - y) * 0.16;
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
  if (window.Basis && window.Basis.bewegt && "IntersectionObserver" in window) {
    var gezeigt = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return;
      gezeigt.disconnect();

      /* Ein Hin und Zurueck ueber 2,2 Sekunden, gerechnet aus der Zeit statt
         aus Bildzaehlern - dadurch laeuft es auf jedem Geraet gleich lang. */
      var start = null, dauer = 2200;
      function bild(jetzt) {
        if (start === null) start = jetzt;
        var t = Math.min((jetzt - start) / dauer, 1);
        /* Dreieck: 0 -> 1 -> 0, danach weich gemacht wie die Knoepfe. */
        var w = t < .5 ? t * 2 : (1 - t) * 2;
        var weich = w < .5 ? 2 * w * w : 1 - Math.pow(-2 * w + 2, 2) / 2;
        setzen(50 + weich * 28);
        if (t < 1) requestAnimationFrame(bild); else setzen(50);
      }
      requestAnimationFrame(bild);
    }, { threshold: 0.35 });
    gezeigt.observe(schieber);
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

/* ------------------------------------------------------ Tiefe im Aufmacher */
/*
   Das Bild im Aufmacher laeuft beim Scrollen etwas langsamer als die Seite.
   Nur eine Transform, kein Layout - und nur, solange das Band sichtbar ist.
   Auf Touch und bei prefers-reduced-motion bleibt es stehen: dort ist das
   Ruckelrisiko hoch und der Gewinn klein.
*/
(function () {
  "use strict";
  var bild = document.querySelector(".aufmacher__bild img");
  var band = document.querySelector(".aufmacher");
  if (!bild || !band) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  var sichtbar = false, laeuft = false;
  bild.style.willChange = "transform";
  bild.style.transform = "scale(1.12)";   /* Reserve, damit nichts abreisst */

  function zeichnen() {
    laeuft = false;
    var r = band.getBoundingClientRect();
    var anteil = (r.top + r.height / 2) / window.innerHeight - 0.5;
    bild.style.transform = "translate3d(0," + (anteil * 46).toFixed(1) + "px,0) scale(1.12)";
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
   Beim Wechsel auf eine andere Seite dieser Website faehrt ein blauer Balken
   von links durchs Bild, dann wird geladen; auf der neuen Seite faehrt er
   nach rechts hinaus. Kurz und hart - dieselbe Sprache wie die Knoepfe.

   Ohne JavaScript passiert schlicht nichts Besonderes, die Verweise
   funktionieren normal. Wer mit gedrueckter Steuerungstaste oder mittlerer
   Maustaste klickt, will einen neuen Tab und wird nicht aufgehalten.
*/
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var vorhang = document.createElement("div");
  vorhang.className = "wechsel";
  vorhang.setAttribute("aria-hidden", "true");
  document.body.appendChild(vorhang);

  /* Hereinkommen: der Balken faehrt hinaus. */
  requestAnimationFrame(function () { document.body.classList.add("ist-da"); });

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target && a.target !== "_self") return;
    var ziel = a.getAttribute("href") || "";
    if (!ziel || ziel.charAt(0) === "#" || /^(https?:|mailto:|tel:)/.test(ziel)) return;
    if (ziel === "../") return;          /* zurueck zur Uebersicht: ohne Effekt */

    e.preventDefault();
    document.body.classList.remove("ist-da");
    document.body.classList.add("geht");
    setTimeout(function () { window.location.href = ziel; }, 260);
  });
})();
