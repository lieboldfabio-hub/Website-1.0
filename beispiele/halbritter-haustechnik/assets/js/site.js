/* ============================================================================
   Halbritter Haustechnik - Signatur-Interaktion
   ----------------------------------------------------------------------------
   Vorher-Nachher-Schieber. Bedienbar mit Maus, Finger und Tastatur.
   Der Wert lebt in einer CSS-Variablen, damit nur der Zuschnitt neu
   gezeichnet wird und kein Layout.
   ========================================================================= */

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
