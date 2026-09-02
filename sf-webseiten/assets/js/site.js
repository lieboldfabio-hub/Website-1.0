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
   Farbwaehler
   ----------------------------------------------------------------------------
   Setzt data-farbe am <html>-Element. Die eigentliche Umschaltung macht das
   CSS, hier wird nur die Wahl verwaltet, gespeichert und an alle Bedienelemente
   zurueckgemeldet.

   Die Wiederherstellung beim Laden passiert bereits im Kopf jeder Seite, damit
   beim Aufbau keine falsche Farbe aufblitzt. Hier geht es nur noch um die
   Bedienung.
   ========================================================================= */

(function () {
  "use strict";

  var SPEICHER = "sf-farbe";
  var ERLAUBT = ["vermillion", "kobalt", "marine", "tanne", "aubergine", "petrol"];
  var wurzel = document.documentElement;
  var schalter = Array.prototype.slice.call(document.querySelectorAll("[data-farbe-wahl]"));
  if (!schalter.length) return;

  /* Die Adressleiste mobiler Browser faerbt sich nach theme-color. Ohne
     Nachfuehren bliebe dort die Farbe der Grundpalette stehen. */
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function anzeigen(wahl) {
    schalter.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-farbe-wahl") === wahl));
    });
    if (themeMeta) {
      var tinte = getComputedStyle(wurzel).getPropertyValue("--ink").trim();
      if (tinte) themeMeta.setAttribute("content", tinte);
    }
  }

  function setzen(wahl, merken) {
    if (ERLAUBT.indexOf(wahl) === -1) return;
    wurzel.setAttribute("data-farbe", wahl);
    if (merken) {
      try { localStorage.setItem(SPEICHER, wahl); } catch (e) { /* privater Modus */ }
    }
    anzeigen(wahl);
  }

  schalter.forEach(function (b) {
    b.addEventListener("click", function () {
      setzen(b.getAttribute("data-farbe-wahl"), true);
    });
  });

  /* Ist die Seite in einem zweiten Tab offen, zieht sie mit. */
  window.addEventListener("storage", function (e) {
    if (e.key === SPEICHER && e.newValue) setzen(e.newValue, false);
  });

  anzeigen(wurzel.getAttribute("data-farbe") || "vermillion");
})();
