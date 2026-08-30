/* ============================================================================
   Dog'n'Soul Augsburg - Interaktion und Bewegung
   ----------------------------------------------------------------------------
   Grundsatz: jede Animation hat eine Aufgabe.
     Hero-Einblendung  fuehrt den Blick von der Ueberschrift zum Button.
     Scroll-Reveal     laesst Inhalte in Lesereihenfolge ankommen.
     Ablauf-Linie      zeichnet den Prozess mit, waehrend man ihn liest.
     Hover und Klick   geben Rueckmeldung.
   Alles andere bleibt ruhig.

   Ohne JavaScript ist die Seite vollstaendig lesbar. Bei
   prefers-reduced-motion wird jede Bewegung durch den Endzustand ersetzt.
   Es wird kein scroll-Listener verwendet, ausschliesslich ScrollTrigger.
   ========================================================================= */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && typeof window.ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------ Bildplaetze */
  /* Liegt ein Foto vor, blendet es sich ueber die Markenflaeche. Fehlt es,
     bleibt die Flaeche stehen. Kein Broken-Image-Symbol, kein Layoutsprung. */

  Array.prototype.forEach.call(document.querySelectorAll(".ph img"), function (img) {
    function fill() {
      img.classList.add("is-loaded");
      img.closest(".ph").classList.add("is-filled");
    }
    if (img.complete && img.naturalWidth > 0) fill();
    else img.addEventListener("load", fill, { once: true });
  });

  /* -------------------------------------------------------------- Navigation */

  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");

  if (hasGSAP && nav) {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onToggle: function (self) { nav.classList.toggle("is-stuck", self.isActive); }
    });
  }

  if (burger && menu) {
    menu.hidden = false;
    var open = false;

    function setMenu(next) {
      open = next;
      menu.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) menu.querySelector("a").focus();
    }

    burger.addEventListener("click", function () { setMenu(!open); });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) { setMenu(false); burger.focus(); }
    });
  }

  /* Ankerlinks: Sprungziel um die fixierte Navigation versetzen. */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* ------------------------------------------------------------- Bewegungen */

  if (hasGSAP) {
    var mm = gsap.matchMedia();

    /* Nur wenn Bewegung erwuenscht ist. */
    mm.add("(prefers-reduced-motion: no-preference)", function () {

      /* Hero: gestaffelter Aufbau, Ueberschrift zuerst. */
      var heroBits = gsap.utils.toArray("[data-hero]");
      if (heroBits.length) {
        gsap.set(heroBits, { opacity: 0, y: 22 });
        gsap.to(heroBits, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.09,
          delay: 0.12
        });
      }

      /* Abschnitte kommen beim Lesen an. */
      ScrollTrigger.batch(".reveal", {
        start: "top 86%",
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.08,
            overwrite: true
          });
        }
      });

      /* Ablauf: die Linie waechst mit dem Lesefortschritt, die Punkte
         schalten sich nacheinander scharf. */
      var rail = document.getElementById("rail");
      var track = document.querySelector(".flow__track");
      if (rail && track) {
        gsap.to(rail, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top 68%",
            end: "bottom 78%",
            scrub: 0.6
          }
        });
      }

      gsap.utils.toArray(".step").forEach(function (step) {
        ScrollTrigger.create({
          trigger: step,
          start: "top 74%",
          onEnter: function () { step.classList.add("is-active"); },
          onLeaveBack: function () { step.classList.remove("is-active"); }
        });
      });

      return function () {
        gsap.set(".reveal, [data-hero]", { clearProps: "all" });
      };
    });

    /* Reduzierte Bewegung: direkt der Endzustand. */
    mm.add("(prefers-reduced-motion: reduce)", function () {
      gsap.set(".reveal, [data-hero]", { opacity: 1, y: 0 });
      gsap.set("#rail", { scaleX: 1 });
      Array.prototype.forEach.call(document.querySelectorAll(".step"), function (s) {
        s.classList.add("is-active");
      });
    });
  } else {
    /* GSAP nicht geladen: nichts verstecken. */
    root.classList.remove("js");
  }

  /* --------------------------------------------------------------- Formular */

  var form = document.getElementById("form");
  if (form) {
    var submit = document.getElementById("submit");
    var result = document.getElementById("result");
    var resultText = result.querySelector("span");

    function fieldOf(input) { return input.closest(".field"); }

    function validate(input) {
      var value = input.value.trim();
      var ok = value.length > 0;

      /* Zweites Feld nimmt Telefon oder E-Mail entgegen. */
      if (ok && input.name === "kontakt") {
        var digits = value.replace(/[^0-9]/g, "").length;
        ok = /\S+@\S+\.\S+/.test(value) || digits >= 6;
      }
      if (ok && input.name === "nachricht") ok = value.length >= 10;

      fieldOf(input).classList.toggle("has-error", !ok);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    }

    var required = Array.prototype.slice.call(form.querySelectorAll("[required]"));

    required.forEach(function (input) {
      /* Erst nach dem Verlassen pruefen, danach live korrigieren. */
      input.addEventListener("blur", function () { validate(input); });
      input.addEventListener("input", function () {
        if (fieldOf(input).classList.contains("has-error")) validate(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstBad = null;
      required.forEach(function (input) {
        if (!validate(input) && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      submit.classList.add("is-busy");
      submit.disabled = true;

      /* --------------------------------------------------------------------
         DEMO-ZUSTAND. Es wird nichts verschickt.
         Vor dem Livegang hier den echten Versand einhaengen, zum Beispiel:

           fetch("https://formspree.io/f/DEINE-ID", {
             method: "POST",
             headers: { Accept: "application/json" },
             body: new FormData(form)
           })

         Alternativ Netlify Forms (data-netlify="true" am <form>) oder ein
         PHP-Skript beim Hoster. Danach diesen Timeout entfernen.
         -------------------------------------------------------------------- */
      window.setTimeout(function () {
        submit.classList.remove("is-busy");
        submit.disabled = false;
        form.reset();
        resultText.textContent =
          "Vielen Dank. Ihre Anfrage ist eingegangen, ich melde mich zeitnah bei Ihnen.";
        result.classList.add("is-visible");
        if (hasGSAP) ScrollTrigger.refresh();
      }, 900);
    });
  }
})();
