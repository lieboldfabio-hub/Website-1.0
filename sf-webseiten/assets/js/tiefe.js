/* ============================================================================
   Tiefe - die scrollgetriebene 3D-Ebene der Startseite
   ----------------------------------------------------------------------------
   Baut auf GSAP + ScrollTrigger auf (beides selbst gehostet, siehe unten).
   Vier Bausteine, alle unabhaengig voneinander abschaltbar:

     1. Partikelfeld   perspektivisch projizierte Punkte hinter dem Hero
     2. Mock-Stapel    die drei Vorschaukarten kippen und staffeln sich im Raum
     3. Tiefenschichten  [data-tiefe] bewegt sich langsamer als der Scroll
     4. Kapitel        [data-kapitel] wird angeheftet und am Scrollrad erzaehlt

   WARUM KEIN THREE.JS:
   Das Partikelfeld braucht Punkte, keine Geometrie, kein Licht, keine Texturen.
   Die perspektivische Projektion dafuer sind drei Zeilen Mathematik (siehe
   zeichne()). Three.js waere ~600 KB zusaetzlich - mehr als die gesamte
   Seite heute wiegt - fuer eine Funktion, die 2D-Canvas mitbringt. Sollte
   spaeter echte Geometrie dazukommen (rotierendes Logo, Szene mit Licht),
   ist das der Moment fuer Three.js, nicht jetzt.

   BARRIEREFREIHEIT:
   Bei "prefers-reduced-motion: reduce" passiert hier gar nichts. Die Seite
   bleibt dann in ihrem Endzustand stehen und ist vollstaendig lesbar - das
   ist kein Notbehelf, sondern die zweite gueltige Fassung der Seite.
   ========================================================================= */

(function () {
  "use strict";

  var reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduziert) return;
  if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  /* Erst ab hier darf tiefe.css greifen: das Modul laeuft, GSAP ist da.
     Vorher bleibt die Seite in ihrer ruhigen Grundfassung stehen. */
  document.documentElement.classList.add("tiefe-an");

  partikelfeld();
  mockStapel();
  tiefenschichten();
  kapitel();

  /* ======================================================== Partikelfeld == */
  /* Punkte in einem Quader, der auf die Kameraebene projiziert wird. Sie
     driften auf die Betrachterin zu; wer am Ende ankommt, wird hinten neu
     eingesetzt. Das ergibt einen ruhigen Sog ohne Anfang und ohne Ende. */
  function partikelfeld() {
    var hero = document.querySelector(".hero");
    if (!hero || !window.requestAnimationFrame) return;

    var canvas = document.createElement("canvas");
    canvas.className = "tiefe-feld";
    canvas.setAttribute("aria-hidden", "true");
    hero.insertBefore(canvas, hero.firstChild);

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var BRENNWEITE = 620;   /* je kleiner, desto staerker die Perspektive */
    var TIEFE = 900;        /* Laenge des Quaders in z */
    var punkte = [];
    var b = 0, h = 0, dpr = 1;
    var zeiger = { x: 0, y: 0 };   /* sanfte Blickfuehrung per Maus */
    var ziel = { x: 0, y: 0 };
    var laeuft = false;
    var scrollSchub = 0;

    messen();
    saeen();

    window.addEventListener("resize", messen);

    /* Nur rechnen, solange der Hero sichtbar ist. Ein Partikelfeld, das
       unbemerkt im Hintergrund weiterlaeuft, kostet auf Notebooks spuerbar
       Akku - und beim Kundentermin laeuft die Seite stundenlang offen. */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (eintraege) {
        eintraege[0].isIntersecting ? starten() : stoppen();
      }, { threshold: 0 }).observe(hero);
    } else {
      starten();
    }
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stoppen() : starten();
    });

    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      ziel.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ziel.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    hero.addEventListener("pointerleave", function () { ziel.x = 0; ziel.y = 0; });

    /* Beim Scrollen beschleunigt der Sog kurz - die Seite reagiert, statt
       nur abzulaufen. */
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      onUpdate: function (self) { scrollSchub = Math.abs(self.getVelocity()) / 900; }
    });

    function messen() {
      var r = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      b = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(b * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = b + "px";
      canvas.style.height = h + "px";
    }

    /* Anzahl an der Flaeche bemessen: ein Telefon bekommt nicht dieselbe
       Punktzahl wie ein 27-Zoll-Schirm, sonst wird es dort dicht und hier zaeh. */
    function saeen() {
      var anzahl = Math.round(Math.min(260, Math.max(70, (b * h) / 5200)));
      punkte = [];
      for (var i = 0; i < anzahl; i++) punkte.push(neuerPunkt(Math.random() * TIEFE));
    }

    function neuerPunkt(z) {
      return {
        x: (Math.random() - 0.5) * b * 1.8,
        y: (Math.random() - 0.5) * h * 1.8,
        z: z,
        tempo: 0.35 + Math.random() * 0.75,
        glanz: 0.25 + Math.random() * 0.75
      };
    }

    function starten() {
      if (laeuft) return;
      laeuft = true;
      requestAnimationFrame(zeichne);
    }
    function stoppen() { laeuft = false; }

    function zeichne() {
      if (!laeuft) return;

      zeiger.x += (ziel.x - zeiger.x) * 0.045;
      zeiger.y += (ziel.y - zeiger.y) * 0.045;
      scrollSchub *= 0.92;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, b, h);

      var mx = b / 2, my = h / 2;

      for (var i = 0; i < punkte.length; i++) {
        var p = punkte[i];

        p.z -= p.tempo * (1 + scrollSchub * 6);
        if (p.z <= 1) { punkte[i] = neuerPunkt(TIEFE); continue; }

        /* Die eigentliche Perspektive: was weiter weg ist, rueckt zur Mitte
           und wird kleiner. Der Zeiger verschiebt die Fluchtachse leicht. */
        var s = BRENNWEITE / (BRENNWEITE + p.z);
        var x = mx + (p.x + zeiger.x * 140) * s;
        var y = my + (p.y + zeiger.y * 90) * s;

        if (x < -40 || x > b + 40 || y < -40 || y > h + 40) continue;

        var r = Math.max(0.35, s * 2.1);
        var a = Math.min(0.62, s * 1.25) * p.glanz;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.283185);
        ctx.fillStyle = "rgba(236, 200, 121, " + a.toFixed(3) + ")";
        ctx.fill();
      }

      requestAnimationFrame(zeichne);
    }
  }

  /* ======================================================== Mock-Stapel === */
  /* Die drei Vorschaukarten liegen heute flach uebereinander. Beim Scrollen
     faechern sie sich im Raum auf - das ist der Moment, der die Startseite
     von einer Seite mit Bildern unterscheidet. */
  function mockStapel() {
    var stapel = document.querySelector(".mock-stack");
    if (!stapel) return;

    var karten = stapel.querySelectorAll(".mock");
    if (karten.length < 2) return;

    stapel.classList.add("tiefe-raum");

    gsap.set(karten, { transformOrigin: "50% 60%" });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });

    /* Der Text zieht langsamer ab als die Karten und verliert dabei an
       Deckkraft. Das ist der eigentliche Tiefeneindruck: nicht die Bewegung
       einzelner Teile, sondern dass sie sich unterschiedlich schnell bewegen. */
    var textspalte = document.querySelector(".hero__grid > div:first-child");
    if (textspalte) {
      tl.to(textspalte, { y: -70, autoAlpha: 0.25, ease: "none" }, 0);
    }

    /* Jede Karte bekommt ihre eigene Tiefe. Der Fluchtpunkt liegt rechts
       aussen, deshalb wandern die hinteren Karten nach links und oben. */
    Array.prototype.forEach.call(karten, function (karte, i) {
      tl.to(karte, {
        z: i * -190,
        y: i * -46,
        x: i * -34,
        rotationY: 14 + i * 5,
        rotationX: -6,
        ease: "none"
      }, 0);
    });
  }

  /* ===================================================== Tiefenschichten == */
  /* [data-tiefe="0.2"] bewegt sich um 20 Prozent der Scrollstrecke gegen die
     Leserichtung. Kleine Werte wirken weit weg, grosse nah. Ueber 0.5 wird es
     unruhig - das ist Absicht, nicht Auslassung. */
  function tiefenschichten() {
    var schichten = document.querySelectorAll("[data-tiefe]");
    Array.prototype.forEach.call(schichten, function (el) {
      /* data-reveal blendet ueber CSS-transform ein (basis.css). Stuende
         data-tiefe am selben Element, wuerden sich CSS-Transition und GSAP
         gegenseitig ueberschreiben und das Element zuckt. Die beiden Attribute
         schliessen einander aus - lieber eine Ebene tiefer haengen. */
      if (el.hasAttribute("data-reveal")) return;

      var staerke = parseFloat(el.getAttribute("data-tiefe")) || 0.2;
      gsap.to(el, {
        yPercent: staerke * -100,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  /* ============================================================ Kapitel === */
  /* Ein Abschnitt mit [data-kapitel] bleibt stehen, waehrend seine
     [data-szene]-Kinder nacheinander durchlaufen. Das Scrollrad wird zum
     Erzaehltempo - dasselbe Prinzip wie die Kapitel im React-Auftritt. */
  function kapitel() {
    var abschnitte = document.querySelectorAll("[data-kapitel]");
    if (!abschnitte.length) return;

    /* matchMedia raeumt beim Wechsel der Bildschirmbreite selbst auf: der Pin
       wird geloest, die gesetzten Werte werden zurueckgenommen. Von Hand ist
       das die haeufigste Fehlerquelle bei angehefteten Abschnitten - ein
       Wechsel ins Querformat laesst den Abschnitt sonst festgeklebt zurueck. */
    gsap.matchMedia().add("(min-width: 761px)", function () {
      Array.prototype.forEach.call(abschnitte, function (abschnitt) {
        var szenen = abschnitt.querySelectorAll("[data-szene]");
        if (!szenen.length) return;

        abschnitt.classList.add("tiefe-raum", "tiefe-kapitel");

        /* Gestapelt wird der gemeinsame Elternknoten der Szenen, nicht der
           Abschnitt: im Markup steckt zwischen beiden oft noch ein div. */
        var buehne = szenen[0].parentNode;
        buehne.classList.add("tiefe-buehne");

        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: abschnitt,
            start: "top top",
            end: "+=" + (szenen.length * 85) + "%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1
          }
        });

        /* Jede Szene bekommt eine Einheit auf der Zeitachse. Die abgehende
           Szene ist vollstaendig verschwunden, bevor die naechste einsetzt -
           sonst stehen zwei Texte uebereinander und keiner ist lesbar.
             Szene i:  ein  i    -> i+0.45
                       aus  i+0.7 -> i+1.0
           Die letzte Szene bleibt stehen, sonst laeuft der Abschnitt leer,
           bevor der Pin ihn loslaesst. */
        Array.prototype.forEach.call(szenen, function (szene, i) {
          tl.fromTo(szene,
            { autoAlpha: 0, z: -420, rotationX: 12, y: 60 },
            { autoAlpha: 1, z: 0, rotationX: 0, y: 0, ease: "power2.out", duration: 0.45 },
            i
          );
          if (i < szenen.length - 1) {
            tl.to(szene,
              { autoAlpha: 0, z: 320, rotationX: -10, y: -50, ease: "power2.in", duration: 0.3 },
              i + 0.7
            );
          }
        });
      });

      /* Aufraeumen beim Verlassen der Bildschirmbreite: die Klassen muss
         matchMedia nicht kennen, die Animationen loest es selbst auf. */
      return function () {
        Array.prototype.forEach.call(abschnitte, function (abschnitt) {
          abschnitt.classList.remove("tiefe-raum", "tiefe-kapitel");
        });
      };
    });
  }
})();
