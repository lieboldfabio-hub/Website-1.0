/* ============================================================================
   Kopfsache - Signatur-Interaktionen
   ----------------------------------------------------------------------------
   1. Lichtkegel unter dem Zeiger auf den Leistungskarten
   2. Laufband mit den Leistungen
   3. Ziehharmonika fuer haeufige Fragen, mit weicher Hoehe und ohne Sprung
   ========================================================================= */

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
