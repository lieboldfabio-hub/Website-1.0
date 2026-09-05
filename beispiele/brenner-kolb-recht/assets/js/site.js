/* ============================================================================
   Brenner & Kolb Rechtsanwaelte - Skript dieser Seite
   ----------------------------------------------------------------------------
   1. Grundverhalten: Navigation, Menue, Bildplaetze, Scroll-Einblendungen
      und Zeilen-Reveals. Stellt window.Basis fuer Abschnitt 2 bereit.
   2. Der Scroll-Pager der Startseite: Kolumnentitel, Fortschrittslinie
      und Register.
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

  var nav = document.querySelector(".nav");
  if (nav && "IntersectionObserver" in window) {
    var marke = document.createElement("span");
    marke.setAttribute("aria-hidden", "true");
    marke.style.cssText = "position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none";
    document.body.appendChild(marke);
    new IntersectionObserver(function (e) {
      nav.classList.toggle("is-stuck", !e[0].isIntersecting);
    }).observe(marke);
  }

  var burger = document.querySelector(".nav__burger");
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

  /* Ankerlinks versetzen */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var ziel = document.querySelector(id);
      if (!ziel) return;
      e.preventDefault();
      /* Auf der laufenden Seite muss der Sprung um den Kolumnentitel
         versetzt werden, sonst verschwindet die Kapitelueberschrift
         darunter. */
      var versatz = root.classList.contains("lauf") ? 78 : 70;
      window.scrollTo({
        top: ziel.getBoundingClientRect().top + window.pageYOffset - versatz,
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
      aussen.style.setProperty("--verzug", (i * 95) + "ms");
      var innen = document.createElement("span");
      innen.textContent = gruppe.map(function (s) { return s.textContent; }).join("");
      aussen.appendChild(innen);
      el.appendChild(aussen);
    });
  }

  /* ------------------------------------------------------------- Bewegung */
  /*
     Eine Kanzlei bewegt sich nicht viel. Es gibt keinen Weg, den etwas
     zurueckliegt, und kein Ueberschwingen: der Block wird lediglich aus
     einer Andeutung heraus scharf gestellt. Das genuegt, damit der Aufbau
     lesbar bleibt, und faellt nie auf.

     Ausgeloest wird frueh (threshold 0.02), damit beim ruhigen Lesen nie
     ein Block erst nach dem Ankommen erscheint.
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
        }, 30);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.02 });
    Array.prototype.forEach.call(liste, function (el) { beobachter.observe(el); });
  }

  if (reduziert) {
    root.classList.add("ohne-bewegung");
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".reveal-lines"), zeilenAufbauen);

    var heroTeile = document.querySelectorAll("[data-hero]");
    Array.prototype.forEach.call(heroTeile, function (el, i) {
      el.style.setProperty("--verzug", (160 + i * 110) + "ms");
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        Array.prototype.forEach.call(heroTeile, function (el) { el.classList.add("ist-da"); });
      });
    });

    aufdecken(document.querySelectorAll(".reveal"), 90);
    aufdecken(document.querySelectorAll(".reveal-lines"), 0);
  }

  /* --------------------------------------------------- Hilfen fuer Seiten */

  return {
    bewegt: !reduziert,
    reduziert: reduziert,

    /* Knopf, der dem Zeiger minimal folgt. Die Bewegung ist bewusst so
       klein, dass sie eher gespuert als gesehen wird. */
    magnetisch: function (el, staerke) {
      if (reduziert || grob) return;
      staerke = staerke || 0.32;
      var zx = 0, zy = 0, x = 0, y = 0, laeuft = false;

      function schritt() {
        x += (zx - x) * 0.13;
        y += (zy - y) * 0.13;
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
/*
   Der Pager der Startseite. Drei Dinge haengen am Scrollen:
     - welches Kapitel im Kolumnentitel steht,
     - wie weit die Haarlinie darunter gewachsen ist,
     - ob der Grund hell oder dunkel ist.
   Alles drei kommt aus derselben Beobachtung, damit nichts auseinanderlaeuft.
*/

(function () {
  "use strict";

  var blaetter = Array.prototype.slice.call(document.querySelectorAll(".blatt"));
  if (!blaetter.length) return;

  var wurzel  = document.documentElement;
  var ziffer  = document.querySelector(".kolumne__ort b");
  var kapitel = document.querySelector(".kolumne__ort span");
  var balken  = document.querySelector(".fortschritt i");

  var glieder = {};
  Array.prototype.forEach.call(document.querySelectorAll(".register a"), function (a) {
    glieder[a.getAttribute("href").slice(1)] = a;
  });

  /* ------------------------------------------------- Welches Kapitel gilt */

  var aktuell = null;

  function setzen(el) {
    if (!el || el.id === aktuell) return;
    aktuell = el.id;
    if (ziffer)  ziffer.textContent  = el.getAttribute("data-ziffer") || "";
    if (kapitel) kapitel.textContent = el.getAttribute("data-kapitel") || "";
    for (var k in glieder) glieder[k].classList.toggle("is-hier", k === aktuell);
    /* Das Schlussblatt ist das einzige dunkle. */
    wurzel.classList.toggle("auf-dunkel", el.classList.contains("blatt--kontakt"));
  }

  var beobachter = new IntersectionObserver(function (eintraege) {
    var treffer = null;
    eintraege.forEach(function (e) { if (e.isIntersecting) treffer = e.target; });
    setzen(treffer);
  }, {
    /* Ein Streifen quer durch die Bildschirmmitte: genau ein Blatt belegt ihn. */
    rootMargin: "-50% 0px -50% 0px",
    threshold: 0
  });

  blaetter.forEach(function (b) { beobachter.observe(b); });
  setzen(blaetter[0]);

  /* --------------------------------------------------------- Haarlinie -- */
  /*
     Nur eine Transform, kein Layout. Gemessen wird gegen die scrollbare
     Strecke; ist die Seite kuerzer als das Fenster (Rueckfall auf sehr
     grossen Bildschirmen), steht die Linie voll.
  */
  if (balken) {
    var laeuft = false;

    function zeichnen() {
      laeuft = false;
      var strecke = wurzel.scrollHeight - window.innerHeight;
      var anteil = strecke > 0 ? window.pageYOffset / strecke : 1;
      balken.style.transform = "scaleX(" + Math.min(1, Math.max(0, anteil)) + ")";
    }

    window.addEventListener("scroll", function () {
      if (laeuft) return;
      laeuft = true;
      requestAnimationFrame(zeichnen);
    }, { passive: true });
    window.addEventListener("resize", zeichnen);
    zeichnen();
  }
})();


/* --------------------------------------------------- Aktenwand im Aufschlag */
/*
   Der erste Bildschirm dieser Seite. Spalten aus kurzen Linien, die wie
   gesetzte Textzeilen aussehen - Seite an Seite, wie in einem Aktenschrank -
   und sehr langsam nach oben wandern.

   Bewusst kein Effekt, der auffaellt: eine Kanzlei, die mit Bewegung wirbt,
   wirkt unserioes. Es soll nur so aussehen, als stuende man vor Papier.

   Damit es nach Satz aussieht und nicht nach Balkendiagramm: die letzte
   Zeile eines Absatzes ist kuerzer, und die Absatzlaengen wechseln.
*/
(function () {
  "use strict";

  var leinwand = document.querySelector(".akten");
  if (!leinwand || !leinwand.getContext) return;

  var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stift = leinwand.getContext("2d");
  var breite = 0, hoehe = 0, dichte = 1;
  var spalten = [];
  var laeuft = false, bild = 0, vorher = 0;

  var ZEILE = 7;          /* Abstand von Zeile zu Zeile */
  var TINTE = "23, 27, 40";

  /* Eine Spalte ist eine Folge von Zeilenlaengen zwischen 0 und 1. */
  function spalteBauen(hoch) {
    var zeilen = [], rest = 0;
    var anzahl = Math.ceil(hoch / ZEILE) + 40;
    for (var i = 0; i < anzahl; i++) {
      if (rest === 0) {
        /* neuer Absatz: drei bis neun Zeilen */
        rest = 3 + Math.floor(Math.random() * 7);
        zeilen.push(0);          /* Leerzeile zwischen Absaetzen */
        continue;
      }
      rest--;
      /* Die letzte Zeile eines Absatzes ist kurz - daran erkennt das Auge
         gesetzten Text. */
      zeilen.push(rest === 0 ? 0.25 + Math.random() * 0.45 : 0.88 + Math.random() * 0.12);
    }
    return zeilen;
  }

  function messen() {
    var r = leinwand.getBoundingClientRect();
    dichte = Math.min(window.devicePixelRatio || 1, 2);
    breite = Math.max(1, Math.round(r.width));
    hoehe = Math.max(1, Math.round(r.height));
    leinwand.width = Math.round(breite * dichte);
    leinwand.height = Math.round(hoehe * dichte);
    stift.setTransform(dichte, 0, 0, dichte, 0, 0);

    var anzahl = Math.max(2, Math.min(6, Math.round(breite / 260)));
    var luecke = 34;
    var sb = (breite - luecke * (anzahl + 1)) / anzahl;
    spalten = [];
    for (var i = 0; i < anzahl; i++) {
      spalten.push({
        x: luecke + i * (sb + luecke),
        breit: sb,
        zeilen: spalteBauen(hoehe),
        /* jede Spalte wandert etwas anders schnell */
        bei: Math.random() * 400,
        tempo: 3.5 + Math.random() * 4
      });
    }
  }

  function zeichnen(jetzt) {
    var dt = Math.min((jetzt - vorher) / 1000 || 0, 0.05);
    vorher = jetzt;
    stift.clearRect(0, 0, breite, hoehe);

    for (var i = 0; i < spalten.length; i++) {
      var sp = spalten[i];
      if (!ruhig) sp.bei += sp.tempo * dt;
      var umlauf = sp.zeilen.length * ZEILE;
      if (sp.bei > umlauf) sp.bei -= umlauf;

      for (var j = 0; j < sp.zeilen.length; j++) {
        var laenge = sp.zeilen[j];
        if (!laenge) continue;
        var y = j * ZEILE - sp.bei;
        if (y < -ZEILE || y > hoehe) continue;
        /* Oben und unten ausblenden, damit nichts hart abreisst. */
        var rand = Math.min(y / 120, (hoehe - y) / 120, 1);
        if (rand <= 0) continue;
        stift.fillStyle = "rgba(" + TINTE + "," + (0.055 * rand) + ")";
        stift.fillRect(sp.x, y, sp.breit * laenge, 2);
      }
    }

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

  var blatt = leinwand.closest(".blatt");
  if ("IntersectionObserver" in window && blatt) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) anwerfen(); else anhalten();
    }, { threshold: 0.02 }).observe(blatt);
  } else {
    anwerfen();
  }
})();
