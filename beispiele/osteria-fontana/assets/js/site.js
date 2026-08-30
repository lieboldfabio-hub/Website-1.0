/* ============================================================================
   Osteria Fontana - Signatur-Interaktionen
   ----------------------------------------------------------------------------
   1. Laufband mit den Gerichten des Tages
   2. Waagerecht gescrollte Galerie, am Viewport geheftet
   Beides laeuft nur, wenn Bewegung erwuenscht ist und der Platz reicht.
   ========================================================================= */

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

  /* ------------------------------------------------------------- Galerie */
  /*
     Der Abschnitt wird geheftet, sobald seine Oberkante den oberen Rand
     erreicht. Die Spur wandert dann genau um ihre Ueberlaenge nach links.
     Die Scrollstrecke entspricht dieser Ueberlaenge, damit sich Scrollen
     und Bewegung eins zu eins anfuehlen.
  */
  mm.add("(min-width: 821px) and (prefers-reduced-motion: no-preference)", function () {
    var rahmen = document.querySelector(".galerie");
    var spur = document.querySelector(".galerie__spur");
    if (!rahmen || !spur) return;

    var tween = gsap.to(spur, {
      x: function () { return -(spur.scrollWidth - window.innerWidth); },
      ease: "none",
      scrollTrigger: {
        trigger: rahmen,
        start: "top top",
        end: function () { return "+=" + (spur.scrollWidth - window.innerWidth); },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    return function () {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      gsap.set(spur, { clearProps: "transform" });
    };
  });

  /* Knoepfe folgen dem Zeiger leicht. */
  Array.prototype.forEach.call(
    document.querySelectorAll(".hero__actions .btn"),
    function (b) { window.Basis.magnetisch(b, 0.22); }
  );
})();
