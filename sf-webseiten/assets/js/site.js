(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");

  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.hidden === false;
      menu.hidden = open;
      toggle.setAttribute("aria-expanded", String(!open));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  var filterRow = document.querySelector("[data-filter]");
  if (filterRow) {
    var chips = filterRow.querySelectorAll(".chip");
    var cards = document.querySelectorAll("[data-branche]");
    filterRow.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      var value = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var match = value === "alle" || card.getAttribute("data-branche") === value;
        card.style.display = match ? "" : "none";
      });
    });
  }

  var yearEl = document.getElementById("jahr");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  var spotlightEls = document.querySelectorAll(".svc-card, .folio-card, .testi-card");
  if (spotlightEls.length && !window.matchMedia("(pointer: coarse)").matches) {
    spotlightEls.forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  var counters = document.querySelectorAll("[data-count-to]");
  if (counters.length && "IntersectionObserver" in window) {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var countIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countIo.unobserve(entry.target);
          var el = entry.target;
          var to = parseFloat(el.getAttribute("data-count-to"));
          var decimals = el.getAttribute("data-count-decimals") ? parseInt(el.getAttribute("data-count-decimals"), 10) : 0;
          var suffix = el.getAttribute("data-count-suffix") || "";
          if (reduced) { el.textContent = to.toFixed(decimals) + suffix; return; }
          var start = null, duration = 1100;
          function tick(ts) {
            if (start === null) start = ts;
            var p = Math.min(1, (ts - start) / duration);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (to * eased).toFixed(decimals) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countIo.observe(el); });
  }
})();

/* ============================================================================
   Musterseite einfaerben
   ----------------------------------------------------------------------------
   Der Besucher stellt die Farbe einer Beispiel-Website um, nicht die dieser
   Seite. Gesetzt wird nur ein Attribut am Muster, die eigentliche Umschaltung
   macht das CSS. Nichts davon wird gespeichert oder uebertragen - beim
   naechsten Aufruf steht wieder der Ausgangszustand.
   ========================================================================= */

(function () {
  "use strict";

  var muster = document.querySelector("[data-muster]");
  var schalter = Array.prototype.slice.call(document.querySelectorAll("[data-farbe-wahl]"));
  if (!muster || !schalter.length) return;

  var anzeige = document.querySelector("[data-muster-name]");
  var reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setzen(wahl, knopf) {
    muster.setAttribute("data-muster", wahl);
    schalter.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === knopf));
    });
    if (anzeige) anzeige.textContent = knopf.getAttribute("data-farbe-name");

    /* Ein kurzer Impuls macht sichtbar, dass etwas passiert ist - auch dann,
       wenn zwei Richtungen sich farblich aehneln. */
    if (!reduziert) {
      muster.classList.remove("muster--wechsel");
      void muster.offsetWidth;
      muster.classList.add("muster--wechsel");
    }
  }

  schalter.forEach(function (b) {
    b.addEventListener("click", function () { setzen(b.getAttribute("data-farbe-wahl"), b); });
  });

  /* Mit den Pfeiltasten laesst sich die Reihe durchgehen, ohne jeden Knopf
     einzeln anzusteuern. */
  schalter.forEach(function (b, i) {
    b.addEventListener("keydown", function (e) {
      var schritt = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!schritt) return;
      e.preventDefault();
      var ziel = schalter[(i + schritt + schalter.length) % schalter.length];
      ziel.focus();
      setzen(ziel.getAttribute("data-farbe-wahl"), ziel);
    });
  });

  var start = schalter.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0] || schalter[0];
  setzen(start.getAttribute("data-farbe-wahl"), start);
})();

/* ============================================================================
   Coverflow
   ----------------------------------------------------------------------------
   Verwaltet, welche der drei Vorschauen vorn steht. Die Darstellung macht das
   CSS: jede Karte bekommt ein Attribut data-lage mit -1, 0 oder 1.

   Beim Ziehen laeuft der Stapel ueber die Variable --zug am Finger mit. Erst
   beim Loslassen wird gerechnet, ob weit genug gezogen wurde. Dadurch fuehlt
   sich die Bewegung angebunden an, statt erst nach dem Loslassen zu springen.
   ========================================================================= */

(function () {
  "use strict";

  var buehne = document.querySelector("[data-coverflow]");
  if (!buehne) return;

  var karten = Array.prototype.slice.call(buehne.querySelectorAll("[data-karte]"));
  var punkte = Array.prototype.slice.call(buehne.querySelectorAll("[data-cf-zu]"));
  var flaeche = buehne.querySelector(".coverflow__buehne");
  if (karten.length < 2 || !flaeche) return;

  var anzahl = karten.length;
  var aktiv = 0;
  var reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Lage einer Karte relativ zur vorderen, auf kuerzestem Weg im Kreis.
     Bei drei Karten liegt jede entweder vorn, links oder rechts. */
  function lage(i) {
    var d = i - aktiv;
    if (d > anzahl / 2) d -= anzahl;
    if (d < -anzahl / 2) d += anzahl;
    return d;
  }

  function zeichnen() {
    karten.forEach(function (k, i) {
      var l = lage(i);
      k.setAttribute("data-lage", String(l));
      /* Was hinten liegt, gehoert nicht in die Tabulator-Reihenfolge: sonst
         springt der Fokus in eine Karte, die kaum zu sehen ist. */
      Array.prototype.forEach.call(k.querySelectorAll("a"), function (a) {
        if (l === 0) a.removeAttribute("tabindex");
        else a.setAttribute("tabindex", "-1");
      });
      k.setAttribute("aria-hidden", l === 0 ? "false" : "true");
    });
    punkte.forEach(function (p, i) {
      p.setAttribute("aria-selected", String(i === aktiv));
    });
  }

  function gehe(zu) {
    aktiv = ((zu % anzahl) + anzahl) % anzahl;
    zeichnen();
  }

  /* --------------------------------------------------------- Bedienung -- */

  buehne.querySelectorAll("[data-cf]").forEach(function (b) {
    b.addEventListener("click", function () {
      gehe(aktiv + (b.getAttribute("data-cf") === "vor" ? 1 : -1));
    });
  });
  punkte.forEach(function (p, i) {
    p.addEventListener("click", function () { gehe(i); });
  });

  /* Klick auf eine hintere Karte holt sie nach vorn, statt dem Link zu folgen. */
  karten.forEach(function (k, i) {
    k.addEventListener("click", function (e) {
      if (lage(i) !== 0) { e.preventDefault(); gehe(i); }
    }, true);
  });

  buehne.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft")  { gehe(aktiv - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { gehe(aktiv + 1); e.preventDefault(); }
  });

  /* ------------------------------------------------------------ Ziehen -- */

  var start = null, zug = 0, zieht = false;
  var SCHWELLE = 60;   /* so weit muss gezogen werden, damit umgeschaltet wird */

  function setzeZug(px) {
    flaeche.style.setProperty("--zug", px + "px");
  }

  /* Zweite Absicherung neben dem CSS: manche Browser starten das eigene
     Ziehen trotzdem, etwa auf Links. */
  flaeche.addEventListener("dragstart", function (e) { e.preventDefault(); });

  flaeche.addEventListener("pointerdown", function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    start = e.clientX; zug = 0; zieht = false;
  });

  flaeche.addEventListener("pointermove", function (e) {
    if (start === null) return;
    zug = e.clientX - start;
    if (!zieht && Math.abs(zug) > 6) {
      zieht = true;
      buehne.classList.add("is-zieht");
      if (flaeche.setPointerCapture) { try { flaeche.setPointerCapture(e.pointerId); } catch (x) {} }
    }
    if (zieht && !reduziert) {
      /* Ueber die Schwelle hinaus wird der Weg gedaempft, damit der Stapel
         nicht ins Leere gezogen werden kann. */
      var w = Math.abs(zug) > SCHWELLE ? SCHWELLE + (Math.abs(zug) - SCHWELLE) * 0.32 : Math.abs(zug);
      setzeZug((zug < 0 ? -w : w).toFixed(1));
    }
  });

  function loslassen() {
    if (start === null) { zieht = false; buehne.classList.remove("is-zieht"); return; }
    var weit = zug;
    start = null;
    setzeZug(0);
    if (zieht) {
      buehne.classList.remove("is-zieht");
      /* Erst im naechsten Zyklus freigeben, sonst loest der Browser noch den
         Klick auf den Link unter dem Finger aus. */
      setTimeout(function () { zieht = false; }, 0);
      if (Math.abs(weit) > SCHWELLE) gehe(aktiv + (weit < 0 ? 1 : -1));
    }
    zug = 0;
  }
  flaeche.addEventListener("pointerup", loslassen);
  flaeche.addEventListener("pointercancel", loslassen);
  /* Bewusst kein pointerleave: setPointerCapture loest selbst ein solches
     Ereignis aus, das den Zug sofort wieder beenden wuerde. Die Erfassung
     leitet ohnehin alles hierher, bis losgelassen wird. */

  /* Ein Zug ist kein Klick: sonst oeffnet jedes Wischen die Vorschau. */
  flaeche.addEventListener("click", function (e) {
    if (zieht) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  zeichnen();
})();
