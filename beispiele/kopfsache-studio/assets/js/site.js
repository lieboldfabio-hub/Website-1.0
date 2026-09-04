/* ============================================================================
   Kopfsache Studio - Skript dieser Seite
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

  var nav = document.querySelector(".nav");
  if (hatGSAP && nav) {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onToggle: function (self) { nav.classList.toggle("is-stuck", self.isActive); }
    });
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

  /* ---------------------------------------------------------- Lichtkegel */
  Array.prototype.forEach.call(document.querySelectorAll(".karte-k"), function (k) {
    if (window.Basis) window.Basis.spotlight(k);
  });

  /* ------------------------------------------------------------ Laufband */
  if (window.Basis && window.Basis.gsap) {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", function () {
      var spur = document.querySelector(".streifen__spur");
      if (!spur) return;
      spur.innerHTML += spur.innerHTML;
      var t = gsap.to(spur, { xPercent: -50, duration: 26, ease: "none", repeat: -1 });
      return function () { t.kill(); };
    });

    Array.prototype.forEach.call(
      document.querySelectorAll(".termin__actions .btn, .hero__actions .btn"),
      function (b) { window.Basis.magnetisch(b, 0.24); }
    );
  }

  /* ------------------------------------------------------- Ziehharmonika */
  /*
     Die Hoehe wird gemessen und gesetzt, damit der Uebergang laeuft. Nach
     dem Oeffnen wird sie auf auto zurueckgestellt, damit sich der Inhalt
     bei Textumbruch oder Zoom weiter anpassen kann.
  */
  var fragen = Array.prototype.slice.call(document.querySelectorAll(".frage"));

  fragen.forEach(function (frage) {
    var knopf = frage.querySelector(".frage__knopf");
    var inhalt = frage.querySelector(".frage__inhalt");
    if (!knopf || !inhalt) return;

    function schliessen(f) {
      var k = f.querySelector(".frage__knopf");
      var i = f.querySelector(".frage__inhalt");
      if (k.getAttribute("aria-expanded") !== "true") return;
      i.style.height = i.scrollHeight + "px";
      requestAnimationFrame(function () { i.style.height = "0px"; });
      k.setAttribute("aria-expanded", "false");
    }

    knopf.addEventListener("click", function () {
      var offen = knopf.getAttribute("aria-expanded") === "true";

      if (offen) { schliessen(frage); return; }

      /* Nur eine Frage gleichzeitig offen halten. */
      fragen.forEach(function (f) { if (f !== frage) schliessen(f); });

      knopf.setAttribute("aria-expanded", "true");
      inhalt.style.height = inhalt.scrollHeight + "px";
      inhalt.addEventListener("transitionend", function nachAuf(e) {
        if (e.propertyName !== "height") return;
        if (knopf.getAttribute("aria-expanded") === "true") inhalt.style.height = "auto";
        inhalt.removeEventListener("transitionend", nachAuf);
      });
    });
  });
})();
