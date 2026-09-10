/* ============================================================================
   S&F Materials - Interaktion dieser Seite
   ----------------------------------------------------------------------------
   Vier Dinge: die Materialtafel, die Linie im Ablauf, ein leichter Versatz
   des Hero-Bildes und das Anfrageformular. Navigation, Einblendungen und
   Bildplaetze kommen aus basis.js.

   Ohne JavaScript bleibt alles lesbar: die Tafel zeigt dann die erste Gruppe,
   das Formular wird vom Browser geprueft und normal abgeschickt.
   ========================================================================= */

(function () {
  "use strict";

  var reduziert = window.Basis ? window.Basis.reduziert : false;
  var hatGSAP = window.Basis ? window.Basis.gsap : false;

  /* ------------------------------------------------------- Materialtafel */
  /*
     Echte Tabs. Klick waehlt aus, Pfeiltasten wechseln, Pos1 und Ende
     springen an den Rand. Eine weitere Materialgruppe braucht nur einen
     Knopf und eine Tafel im HTML, hier ist nichts anzupassen.
  */
  Array.prototype.forEach.call(document.querySelectorAll("[data-tafel]"), function (tafel) {
    var knoepfe = Array.prototype.slice.call(tafel.querySelectorAll('[role="tab"]'));
    if (knoepfe.length < 2) return;

    function tafelZu(knopf) {
      return document.getElementById(knopf.getAttribute("aria-controls"));
    }

    function waehlen(neu, fokus) {
      knoepfe.forEach(function (k) {
        var aktiv = k === neu;
        k.setAttribute("aria-selected", String(aktiv));
        k.tabIndex = aktiv ? 0 : -1;
        var inhalt = tafelZu(k);
        if (!inhalt) return;
        inhalt.hidden = !aktiv;
        if (aktiv && hatGSAP && !reduziert) {
          gsap.fromTo(inhalt.children,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: .45, ease: "power2.out", stagger: .05, overwrite: true });
        }
      });
      if (fokus) neu.focus();
    }

    knoepfe.forEach(function (knopf, i) {
      knopf.addEventListener("click", function () { waehlen(knopf, false); });
      knopf.addEventListener("keydown", function (e) {
        var ziel = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") ziel = knoepfe[(i + 1) % knoepfe.length];
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") ziel = knoepfe[(i - 1 + knoepfe.length) % knoepfe.length];
        else if (e.key === "Home") ziel = knoepfe[0];
        else if (e.key === "End") ziel = knoepfe[knoepfe.length - 1];
        if (!ziel) return;
        e.preventDefault();
        waehlen(ziel, true);
      });
    });
  });

  /* ---------------------------------------------------------- Ablauflinie */
  /*
     Die Linie ueber den vier Schritten wird beim Scrollen mitgezeichnet.
     Sie ist reine Dekoration und aus dem Vorlesebaum ausgenommen.
  */
  var linie = document.querySelector(".ablauf-linie span");
  if (linie) {
    if (hatGSAP && !reduziert) {
      gsap.to(linie, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: linie.parentNode,
          start: "top 85%",
          end: "+=420",
          scrub: .6
        }
      });
    } else {
      linie.style.transform = "scaleX(1)";
    }
  }

  /* ------------------------------------------------------------ Hero-Bild */
  /*
     Das Bild laeuft beim Scrollen minimal langsamer als der Text. Sehr
     zurueckhaltend, es soll auffallen, dass die Flaeche Tiefe hat, nicht
     dass sich etwas bewegt.
  */
  var heroBild = document.querySelector(".hero__bild .ph");
  if (heroBild && hatGSAP && !reduziert) {
    gsap.to(heroBild, {
      yPercent: -6,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .5 }
    });
  }

  /* ------------------------------------------------------------ Formular */
  /*
     Geprueft wird erst beim Absenden, danach bei jeder Eingabe. Das ist
     angenehmer, als schon beim ersten Verlassen eines Feldes zu meckern.
  */
  var formular = document.querySelector(".formular");
  if (!formular) return;

  var geprueft = false;

  function feldVon(el) { return el.closest(".feld"); }

  function meldung(feld, text) {
    var el = feld.querySelector(".feld__fehler");
    if (!text) {
      feld.classList.remove("feld--fehler");
      if (el) el.remove();
      return;
    }
    feld.classList.add("feld--fehler");
    if (!el) {
      el = document.createElement("p");
      el.className = "feld__fehler";
      feld.appendChild(el);
    }
    el.textContent = text;
  }

  function pruefeFeld(el) {
    var feld = feldVon(el);
    if (!feld) return true;
    var wert = el.value.trim();

    if (el.required && !wert) {
      meldung(feld, "Please complete this field.");
      return false;
    }
    if (el.type === "email" && wert && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wert)) {
      meldung(feld, "Please enter a valid email address.");
      return false;
    }
    meldung(feld, "");
    return true;
  }

  var felder = Array.prototype.slice.call(formular.querySelectorAll("input, textarea"));

  felder.forEach(function (el) {
    el.addEventListener("input", function () { if (geprueft) pruefeFeld(el); });
    el.addEventListener("blur", function () { if (geprueft) pruefeFeld(el); });
  });

  formular.addEventListener("submit", function (e) {
    e.preventDefault();
    geprueft = true;

    var erstesFehlerfeld = null;
    felder.forEach(function (el) {
      if (!pruefeFeld(el) && !erstesFehlerfeld) erstesFehlerfeld = el;
    });

    if (erstesFehlerfeld) {
      erstesFehlerfeld.focus();
      return;
    }

    /* ---------------------------------------------------------------------
       Hier wird der Versand eingehaengt. Bis dahin zeigt das Formular nur
       den Erfolgszustand und verschickt nichts.

       Mit Formspree oder einem vergleichbaren Dienst genuegt:

         fetch("https://formspree.io/f/<id>", {
           method: "POST",
           headers: { "Accept": "application/json" },
           body: new FormData(formular)
         }).then(zeigeErfolg);

       Alternativ das Formular auf ein Skript des Hosters richten und diese
       Datei an dieser Stelle nicht mehr eingreifen lassen.
       ------------------------------------------------------------------- */

    formular.classList.add("is-gesendet");
    formular.reset();
    geprueft = false;

    var erfolg = formular.querySelector(".formular__erfolg");
    if (erfolg) {
      erfolg.setAttribute("tabindex", "-1");
      erfolg.focus();
      if (hatGSAP && !reduziert) {
        gsap.from(erfolg, { opacity: 0, y: -8, duration: .4, ease: "power2.out" });
      }
    }
  });
})();
