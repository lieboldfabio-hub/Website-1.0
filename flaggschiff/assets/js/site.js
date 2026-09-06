/* ============================================================================
   OKTANT — Oberflaeche
   ----------------------------------------------------------------------------
   Alles, was nicht 3D ist: Vorspann, weiches Scrollen, Leiste, Zeiger,
   Einblendungen, waagerechte Strecke, Zaehler, Laufband.

   Zwei Regeln ziehen sich durch die Datei:

   1. Wer im Betriebssystem weniger Bewegung eingestellt hat, bekommt jede
      Animation als Endzustand — nichts fehlt, nichts bewegt sich.
   2. Animiert werden ausschliesslich transform und opacity. Alles andere
      zwingt den Browser zum Neuberechnen des Layouts.
   ========================================================================= */

(function () {
  'use strict';

  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var feinerZeiger = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hatGsap = typeof window.gsap !== 'undefined';

  if (hatGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------- Weiches Scrollen

     Lenis ersetzt den Sprung des Mausrads durch eine Fahrt mit Nachlauf.
     Auf Touch bleibt das native Scrollen: das Betriebssystem macht es dort
     besser als jede Bibliothek.                                             */

  var lenis = null;
  if (!ruhig && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      syncTouch: false
    });
    if (hatGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (zeit) { lenis.raf(zeit * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function los(z) { lenis.raf(z); requestAnimationFrame(los); });
    }
  }

  function fahreZu(ziel) {
    if (lenis) lenis.scrollTo(ziel, { offset: 0, duration: 1.2 });
    else ziel.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth' });
  }

  /* Ankersprünge laufen über dieselbe Fahrt wie das Rad. */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    var ziel = document.querySelector(id);
    if (!ziel) return;
    e.preventDefault();
    schliesseUebersicht();
    fahreZu(ziel);
    history.replaceState(null, '', id);
  });

  /* ================================================================ Vorspann

     Der Balken zeigt echten Fortschritt: er zaehlt bis 92 hoch und wartet
     dort auf das load-Ereignis. So endet er nie vor den Bildern.            */

  var vorspann = document.getElementById('vorspann');
  var vorhang = document.getElementById('vorhang');
  var balken = document.getElementById('vorspann-balken');
  var zahl = document.getElementById('vorspann-zahl');
  var eingelaufen = false;

  function einlaufen() {
    if (eingelaufen) return;
    eingelaufen = true;
    document.body.classList.remove('laedt');
    if (vorspann) vorspann.hidden = true;
    if (vorhang) vorhang.hidden = true;
    kopfEinblenden();
  }

  if (!vorspann || !hatGsap || ruhig) {
    // Ohne GSAP oder mit abgeschalteter Bewegung gibt es keinen Vorspann.
    if (vorspann) vorspann.hidden = true;
    if (vorhang) vorhang.hidden = true;
    document.body.classList.remove('laedt');
    document.addEventListener('DOMContentLoaded', kopfEinblenden);
    if (document.readyState !== 'loading') kopfEinblenden();
  } else {
    var stand = { wert: 0 };
    var geladen = false;
    window.addEventListener('load', function () { geladen = true; });

    gsap.set('.vorspann__wort span', { yPercent: 110 });
    var vorTl = gsap.timeline();
    vorTl.to('.vorspann__wort span', {
      yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.045
    });
    vorTl.to(stand, {
      wert: 92,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: function () {
        var w = Math.round(stand.wert);
        if (zahl) zahl.textContent = String(w).padStart(3, '0');
        if (balken) gsap.set(balken, { scaleX: w / 100 });
      }
    }, 0.15);

    vorTl.call(function () {
      // Auf das letzte Bild warten, dann die restlichen acht Prozent.
      var warten = setInterval(function () {
        if (!geladen && vorTl.time() < 6) return;
        clearInterval(warten);
        gsap.to(stand, {
          wert: 100, duration: 0.5, ease: 'power2.inOut',
          onUpdate: function () {
            var w = Math.round(stand.wert);
            if (zahl) zahl.textContent = String(w).padStart(3, '0');
            if (balken) gsap.set(balken, { scaleX: w / 100 });
          },
          onComplete: vorhangHeben
        });
      }, 90);
    });
  }

  function vorhangHeben() {
    var tl = gsap.timeline({ onComplete: einlaufen });
    tl.to('.vorspann__mitte', { autoAlpha: 0, y: -24, duration: 0.5, ease: 'power2.in' });
    tl.to(vorspann, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.1');
    tl.to(vorhang, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.78');
    tl.set([vorspann, vorhang], { display: 'none' });
  }

  /* Der Kopfbereich baut sich Zeile für Zeile auf. */
  function kopfEinblenden() {
    document.body.classList.remove('laedt');
    if (!hatGsap || ruhig) return;
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero .rubrik', { autoAlpha: 0, y: 18, duration: 0.8 });
    tl.from('.hero__titel .zeile > span', {
      yPercent: 112, duration: 1.25, stagger: 0.09
    }, '-=0.55');
    tl.from('.hero__zusatz, .hero__tat', {
      autoAlpha: 0, y: 26, duration: 1, stagger: 0.09
    }, '-=0.8');
    tl.from('.hero__daten div', {
      autoAlpha: 0, y: 22, duration: 0.9, stagger: 0.07
    }, '-=0.75');
    tl.from('.leiste', { autoAlpha: 0, y: -28, duration: 0.9 }, '-=1.0');
    tl.from('.hero__wink', { autoAlpha: 0, duration: 0.8 }, '-=0.5');
  }

  /* ================================================================= Leiste */

  var leiste = document.getElementById('leiste');
  var schalter = document.getElementById('schalter');
  var uebersicht = document.getElementById('uebersicht');
  var offen = false;

  function oeffneUebersicht() {
    if (!uebersicht || offen) return;
    offen = true;
    uebersicht.hidden = false;
    // Ein Bildaufbau Abstand, sonst greift der Übergang nicht.
    requestAnimationFrame(function () { uebersicht.classList.add('ist-offen'); });
    schalter.setAttribute('aria-expanded', 'true');
    schalter.querySelector('.nur-vorlesen').textContent = 'Menü schließen';
    leiste.classList.add('ist-offen');
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
  }

  function schliesseUebersicht() {
    if (!uebersicht || !offen) return;
    offen = false;
    uebersicht.classList.remove('ist-offen');
    schalter.setAttribute('aria-expanded', 'false');
    schalter.querySelector('.nur-vorlesen').textContent = 'Menü öffnen';
    leiste.classList.remove('ist-offen');
    if (lenis) lenis.start();
    document.body.style.overflow = '';
    window.setTimeout(function () { if (!offen) uebersicht.hidden = true; }, 600);
  }

  if (schalter) {
    schalter.addEventListener('click', function () {
      if (offen) schliesseUebersicht(); else oeffneUebersicht();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && offen) { schliesseUebersicht(); schalter.focus(); }
  });

  /* Beim Abwärtsscrollen fährt die Leiste weg, beim Aufwärts kommt sie zurück. */
  if (hatGsap && window.ScrollTrigger && leiste) {
    ScrollTrigger.create({
      start: 'top -120',
      end: 99999,
      onUpdate: function (selbst) {
        if (offen) return;
        var runter = selbst.direction === 1;
        leiste.classList.toggle('ist-weg', runter && selbst.scroll() > 300);
      }
    });
  }

  /* Welcher Bereich gerade sichtbar ist, steht in der Leiste. */
  if (hatGsap && window.ScrollTrigger) {
    document.querySelectorAll('main section[id]').forEach(function (bereich) {
      var weg = document.querySelector('.leiste__weg[href="#' + bereich.id + '"]');
      if (!weg) return;
      ScrollTrigger.create({
        trigger: bereich,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: function (selbst) {
          weg.setAttribute('aria-current', selbst.isActive ? 'true' : 'false');
        }
      });
    });
  }

  /* ================================================================= Zeiger

     Punkt und Ring laufen mit unterschiedlicher Trägheit hinterher. Über
     Flächen mit data-zeiger wächst der Ring und nimmt das Wort auf.         */

  if (feinerZeiger && !ruhig) {
    var zeiger = document.getElementById('zeiger');
    var punkt = document.getElementById('zeiger-punkt');
    var ring = document.getElementById('zeiger-ring');
    var zielX = window.innerWidth / 2, zielY = window.innerHeight / 2;
    var pX = zielX, pY = zielY, rX = zielX, rY = zielY;

    window.addEventListener('pointermove', function (e) {
      zielX = e.clientX; zielY = e.clientY;
    }, { passive: true });

    (function lauf() {
      pX += (zielX - pX) * 0.42;
      pY += (zielY - pY) * 0.42;
      rX += (zielX - rX) * 0.14;
      rY += (zielY - rY) * 0.14;
      punkt.style.transform = 'translate3d(' + pX + 'px,' + pY + 'px,0)';
      ring.style.transform = 'translate3d(' + rX + 'px,' + rY + 'px,0)';
      requestAnimationFrame(lauf);
    })();

    document.addEventListener('pointerover', function (e) {
      var feld = e.target.closest('[data-zeiger], a, button');
      if (!feld) return;
      var wort = feld.getAttribute('data-zeiger');
      zeiger.classList.add('ist-gross');
      ring.textContent = wort || '';
    });
    document.addEventListener('pointerout', function (e) {
      if (e.target.closest('[data-zeiger], a, button')) {
        zeiger.classList.remove('ist-gross');
        ring.textContent = '';
      }
    });
  }

  /* ------------------------------------------------------ Magnetische Knöpfe

     Der Knopf folgt dem Zeiger ein Stück weit und schnellt beim Verlassen
     zurück. Nur mit echter Maus — auf Touch gäbe es kein Verlassen.         */

  if (feinerZeiger && !ruhig && hatGsap) {
    document.querySelectorAll('.knopf, .schalter').forEach(function (feld) {
      var staerke = feld.classList.contains('schalter') ? 0.25 : 0.32;
      feld.addEventListener('pointermove', function (e) {
        var r = feld.getBoundingClientRect();
        gsap.to(feld, {
          x: (e.clientX - r.left - r.width / 2) * staerke,
          y: (e.clientY - r.top - r.height / 2) * staerke,
          duration: 0.7, ease: 'power3.out'
        });
      });
      feld.addEventListener('pointerleave', function () {
        gsap.to(feld, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ============================================================ Einblenden */

  var aufFelder = Array.prototype.slice.call(document.querySelectorAll('.auf'));

  if (ruhig || !('IntersectionObserver' in window)) {
    aufFelder.forEach(function (f) { f.classList.add('ist-da'); });
  } else {
    var waechter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var verzug = Math.min(i, 4) * 70;
        window.setTimeout(function () { e.target.classList.add('ist-da'); }, verzug);
        waechter.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    aufFelder.forEach(function (f) { waechter.observe(f); });
  }

  /* ------------------------------------------------------------ Zähler */

  document.querySelectorAll('[data-zaehler]').forEach(function (feld) {
    var ziel = parseFloat(feld.getAttribute('data-zaehler'));
    if (ruhig || !hatGsap) { feld.textContent = String(ziel); return; }
    var stand = { wert: 0 };
    ScrollTrigger.create({
      trigger: feld,
      start: 'top 98%',
      once: true,
      onEnter: function () {
        gsap.to(stand, {
          wert: ziel, duration: 1.6, ease: 'power2.out',
          onUpdate: function () { feld.textContent = Math.round(stand.wert); }
        });
      }
    });
  });

  /* ------------------------------------------- Satz, der beim Lesen aufhellt */

  var satz = document.getElementById('manifest-satz');
  if (satz && hatGsap && window.ScrollTrigger) {
    var worte = satz.textContent.trim().split(/\s+/);
    satz.textContent = '';
    worte.forEach(function (wort, i) {
      var s = document.createElement('span');
      s.textContent = wort;
      satz.appendChild(s);
      if (i < worte.length - 1) satz.appendChild(document.createTextNode(' '));
    });
    var teile = satz.querySelectorAll('span');
    if (ruhig) {
      teile.forEach(function (s) { s.classList.add('hell'); });
    } else {
      ScrollTrigger.create({
        trigger: satz,
        start: 'top 78%',
        end: 'bottom 52%',
        scrub: true,
        onUpdate: function (selbst) {
          var bis = Math.round(selbst.progress * teile.length);
          for (var i = 0; i < teile.length; i++) {
            teile[i].classList.toggle('hell', i < bis);
          }
        }
      });
    }
  }

  /* ---------------------------------------------------------- Bildparallaxe */

  if (!ruhig && hatGsap && window.ScrollTrigger) {
    document.querySelectorAll('[data-parallax]').forEach(function (feld) {
      var bild = feld.querySelector('img');
      if (!bild) return;
      var mass = parseFloat(feld.getAttribute('data-parallax')) || 0.1;
      gsap.set(bild, { scale: 1 + mass * 1.6 });
      gsap.fromTo(bild,
        { yPercent: -mass * 50 },
        {
          yPercent: mass * 50, ease: 'none',
          scrollTrigger: { trigger: feld, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });
  }

  /* --------------------------------------------------------- Karten neigen */

  if (feinerZeiger && !ruhig && hatGsap) {
    document.querySelectorAll('[data-neig]').forEach(function (karte) {
      var schale = karte.querySelector('.schale');
      var kern = karte.querySelector('.kern');
      if (!schale) return;
      gsap.set(schale, { transformPerspective: 900, transformStyle: 'preserve-3d' });

      karte.addEventListener('pointermove', function (e) {
        var r = karte.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        gsap.to(schale, {
          rotateY: (x - 0.5) * 9,
          rotateX: (0.5 - y) * 9,
          y: -6,
          duration: 0.7, ease: 'power3.out'
        });
        if (kern) {
          kern.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
          kern.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        }
      });
      karte.addEventListener('pointerleave', function () {
        gsap.to(schale, { rotateY: 0, rotateX: 0, y: 0, duration: 1, ease: 'power3.out' });
      });
    });
  }

  /* ============================================================== Laufband

     Ein endloses Band braucht mindestens die doppelte Bildschirmbreite an
     Inhalt, sonst reisst die Kette beim Umschlagen sichtbar ab.             */

  var bandLauf = document.getElementById('band-lauf');
  if (bandLauf && !ruhig && hatGsap) {
    var stueck = bandLauf.firstElementChild;
    var breite = stueck.getBoundingClientRect().width;
    var noetig = Math.ceil((window.innerWidth * 2) / breite) + 1;
    for (var i = 0; i < noetig; i++) bandLauf.appendChild(stueck.cloneNode(true));

    var abschnittBreite = breite + parseFloat(getComputedStyle(bandLauf).gap || 0);
    gsap.to(bandLauf, {
      x: -abschnittBreite,
      duration: 22,
      ease: 'none',
      repeat: -1
    });
  }

  /* ====================================================== Waagerechte Strecke

     Der Abschnitt bleibt per CSS stehen (position: sticky), die Karten laufen
     quer. Die Hoehe des Abschnitts richtet sich nach der tatsaechlichen Breite
     der Karten — sonst laeuft die Strecke zu frueh oder zu spaet aus.
     Unter 900px uebernimmt die senkrechte Liste; matchMedia raeumt dann alles
     wieder ab.                                                              */

  if (hatGsap && window.ScrollTrigger && !ruhig) {
    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', function () {
      var lauf = document.getElementById('strecke-lauf');
      var strecke = document.getElementById('strecke');
      var spur = document.getElementById('strecke-spur');
      if (!lauf || !strecke) return;

      var weg = function () {
        return Math.max(0, lauf.scrollWidth - window.innerWidth);
      };
      var hoeheSetzen = function () {
        strecke.style.height = (window.innerHeight + weg()) + 'px';
      };
      hoeheSetzen();

      var tween = gsap.to(lauf, {
        x: function () { return -weg(); },
        ease: 'none',
        scrollTrigger: {
          trigger: strecke,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
          onRefresh: hoeheSetzen,
          onUpdate: function (selbst) {
            if (spur) gsap.set(spur, { scaleX: selbst.progress });
          }
        }
      });

      // Die Karten kippen leicht in die Laufrichtung.
      var karten = lauf.querySelectorAll('.werkkarte');
      karten.forEach(function (karte, i) {
        gsap.fromTo(karte,
          { rotate: 1.2, y: 26 },
          {
            rotate: -1.2, y: -26, ease: 'none',
            scrollTrigger: {
              trigger: strecke, start: 'top top', end: 'bottom bottom', scrub: 1
            }
          });
      });

      return function () {
        strecke.style.height = '';
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(lauf, { clearProps: 'transform' });
        karten.forEach(function (k) { gsap.set(k, { clearProps: 'transform' }); });
      };
    });
  }

  /* ----------------------------------------------------- Schein am Abschluss */

  var schein = document.getElementById('abschluss-schein');
  if (schein && !ruhig && hatGsap && window.ScrollTrigger) {
    gsap.fromTo(schein,
      { scale: 0.55, autoAlpha: 0.35 },
      {
        scale: 1.1, autoAlpha: 1, ease: 'none',
        scrollTrigger: { trigger: '.abschluss', start: 'top bottom', end: 'bottom bottom', scrub: 1 }
      });
    gsap.from('.abschluss__titel .zeile > span', {
      yPercent: 112, duration: 1.2, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: '.abschluss__titel', start: 'top 82%' }
    });
  } else if (schein) {
    document.querySelectorAll('.abschluss__titel .zeile > span').forEach(function (s) {
      s.style.transform = 'none';
    });
  }

  /* Bilder, die spaet geladen werden, verschieben das Layout — danach muss
     ScrollTrigger neu messen. */
  window.addEventListener('load', function () {
    if (hatGsap && window.ScrollTrigger) ScrollTrigger.refresh();
  });

  // Damit szene.js die Fahrt kennt, ohne sie erneut aufzubauen.
  window.OKTANT = { lenis: lenis, ruhig: ruhig };
})();
