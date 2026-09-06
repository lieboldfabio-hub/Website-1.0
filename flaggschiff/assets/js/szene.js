/* ============================================================================
   OKTANT — 3D
   ----------------------------------------------------------------------------
   Zwei Szenen, ein Objekt: der Oktant. Drei Ebenen teilen einen Wuerfel in
   acht Teile — daher der Name des Studios, daher das Signet, daher dieses
   Modell.

   Im Kopfbereich dreht er sich langsam im Staub und reagiert auf Zeiger und
   Bildlauf. In der Werkbank laesst er sich ziehen, und die Darstellung
   schaltet zwischen Kanten, Massiv und Streuung um.

   Umsicht beim Rechnen:
   * Beide Szenen starten erst, wenn sie im Bild sind, und halten an, sobald
     sie es verlassen. Ein Oktant, den niemand sieht, kostet nichts.
   * Die Bildpunktdichte ist bei 2 gedeckelt. Auf einem 3x-Bildschirm faellt
     der Unterschied nicht auf, die Rechenlast dagegen sehr.
   * Wer weniger Bewegung eingestellt hat, bekommt ein einziges Standbild.
   * Faellt WebGL aus, bleibt der Verlauf aus dem Stilblatt stehen. Kein Loch,
     keine Fehlermeldung.
   ========================================================================= */

import * as THREE from './three.module.min.js';

var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var GLUT = 0xff5b2e;
var KALT = 0x4d6f9a;

/* --------------------------------------------------------------- Umgebung

   Statt einer Bilddatei fuer die Spiegelungen wird eine kleine Leinwand
   gemalt: dunkler Grund, ein warmes und ein kaltes Licht. Das reicht, damit
   Metall aussieht wie Metall, und spart einen Download.                     */

function umgebungBauen(renderer) {
  var leinwand = document.createElement('canvas');
  leinwand.width = 512; leinwand.height = 256;
  var s = leinwand.getContext('2d');

  var grund = s.createLinearGradient(0, 0, 0, 256);
  grund.addColorStop(0, '#0d1017');
  grund.addColorStop(0.52, '#05060a');
  grund.addColorStop(1, '#12141c');
  s.fillStyle = grund;
  s.fillRect(0, 0, 512, 256);

  function fleck(x, y, r, farbe, staerke) {
    var g = s.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, farbe);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    s.globalAlpha = staerke;
    s.fillStyle = g;
    s.fillRect(x - r, y - r, r * 2, r * 2);
    s.globalAlpha = 1;
  }
  fleck(150, 70, 150, '#ff7a4a', 0.95);   // warmes Hauptlicht
  fleck(390, 96, 120, '#8fb4e8', 0.55);   // kalte Gegenseite
  fleck(300, 232, 180, '#20242e', 0.9);   // Aufheller von unten

  var textur = new THREE.CanvasTexture(leinwand);
  textur.mapping = THREE.EquirectangularReflectionMapping;
  textur.colorSpace = THREE.SRGBColorSpace;

  var pmrem = new THREE.PMREMGenerator(renderer);
  var ziel = pmrem.fromEquirectangular(textur);
  textur.dispose();
  pmrem.dispose();
  return ziel.texture;
}

/* ------------------------------------------------------------- Der Oktant

   Acht Wuerfel um einen gemeinsamen Mittelpunkt. Jeder kennt seine Richtung,
   damit er sich spaeter genau nach aussen schieben laesst.                  */

function oktantBauen(stoff) {
  var gruppe = new THREE.Group();
  var geo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  var kantenGeo = new THREE.EdgesGeometry(geo);
  var teile = [];

  var kantenStoff = new THREE.LineBasicMaterial({
    color: GLUT, transparent: true, opacity: 0.85
  });

  [-1, 1].forEach(function (x) {
    [-1, 1].forEach(function (y) {
      [-1, 1].forEach(function (z) {
        var teil = new THREE.Group();
        var richtung = new THREE.Vector3(x, y, z).normalize();
        var sitz = new THREE.Vector3(x * 0.5, y * 0.5, z * 0.5);

        var koerper = new THREE.Mesh(geo, stoff);
        koerper.castShadow = false;
        teil.add(koerper);

        var kanten = new THREE.LineSegments(kantenGeo, kantenStoff);
        teil.add(kanten);

        teil.position.copy(sitz);
        teil.userData = { sitz: sitz, richtung: richtung, koerper: koerper, kanten: kanten };
        gruppe.add(teil);
        teile.push(teil);
      });
    });
  });

  gruppe.userData.teile = teile;
  gruppe.userData.kantenStoff = kantenStoff;
  return gruppe;
}

/* ------------------------------------------------------------ Staubfeld */

function staubBauen(anzahl, weite) {
  var pos = new Float32Array(anzahl * 3);
  var farben = new Float32Array(anzahl * 3);
  var warm = new THREE.Color(GLUT);
  var kuehl = new THREE.Color(0xdfe6f2);

  for (var i = 0; i < anzahl; i++) {
    // Kugelschale statt Wuerfel: kein sichtbarer Rand im Bild.
    var r = weite * (0.42 + Math.random() * 0.58);
    var phi = Math.acos(2 * Math.random() - 1);
    var theta = Math.random() * Math.PI * 2;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    pos[i * 3 + 2] = r * Math.cos(phi);

    var f = warm.clone().lerp(kuehl, Math.random() * 0.85);
    farben[i * 3] = f.r; farben[i * 3 + 1] = f.g; farben[i * 3 + 2] = f.b;
  }

  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(farben, 3));

  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.028,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
}

/* --------------------------------------------------------- Grundgeruest */

function buehneBauen(behaelter, sicht) {
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true, powerPreference: 'high-performance'
    });
  } catch (fehler) {
    return null;                       // Kein WebGL: der Verlauf bleibt stehen.
  }
  if (!renderer.getContext()) return null;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  behaelter.appendChild(renderer.domElement);

  var szene = new THREE.Scene();
  var kamera = new THREE.PerspectiveCamera(sicht || 38, 1, 0.1, 100);

  function messen() {
    var b = behaelter.clientWidth || 1;
    var h = behaelter.clientHeight || 1;
    renderer.setSize(b, h, false);
    kamera.aspect = b / h;
    kamera.updateProjectionMatrix();
  }
  messen();

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(messen).observe(behaelter);
  } else {
    window.addEventListener('resize', messen);
  }

  return { renderer: renderer, szene: szene, kamera: kamera, messen: messen };
}

/* Laeuft nur, solange der Behaelter im Bild ist. */
function takten(behaelter, schritt) {
  var laeuft = false;
  var letzte = 0;

  function schleife(zeit) {
    if (!laeuft) return;
    var d = Math.min((zeit - letzte) / 1000, 0.05);
    letzte = zeit;
    schritt(d, zeit / 1000);
    requestAnimationFrame(schleife);
  }

  var waechter = new IntersectionObserver(function (e) {
    var drin = e[0].isIntersecting;
    if (drin && !laeuft) {
      laeuft = true;
      letzte = performance.now();
      requestAnimationFrame(schleife);
    } else if (!drin) {
      laeuft = false;
    }
  }, { rootMargin: '120px' });
  waechter.observe(behaelter);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { laeuft = false; }
    else if (!laeuft && waechter) { laeuft = true; letzte = performance.now(); requestAnimationFrame(schleife); }
  });
}

/* ========================================================== Kopfbereich */

function kopfSzene() {
  var behaelter = document.getElementById('hero-buehne');
  if (!behaelter) return;

  var b = buehneBauen(behaelter, 34);
  if (!b) return;

  var umgebung = umgebungBauen(b.renderer);
  b.szene.environment = umgebung;
  b.szene.fog = new THREE.FogExp2(0x07080b, 0.085);

  var stoff = new THREE.MeshStandardMaterial({
    color: 0x0b0d13,
    metalness: 0.94,
    roughness: 0.26,
    envMapIntensity: 1.25
  });

  var oktant = oktantBauen(stoff);
  // Der Wuerfel misst zwei Einheiten, seine Raumdiagonale das 1,73-fache.
  // Bei jeder Drehung muss diese Diagonale ins Bild passen, nicht die Kante.
  oktant.scale.setScalar(0.95);
  oktant.userData.kantenStoff.opacity = 0.5;
  b.szene.add(oktant);

  // Ein zweiter, viel groesserer Oktant als Umriss dahinter: Tiefe ohne Kosten.
  var schatten = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
    new THREE.LineBasicMaterial({ color: KALT, transparent: true, opacity: 0.16 })
  );
  schatten.scale.setScalar(3.2);
  b.szene.add(schatten);

  var staub = staubBauen(760, 6.5);
  b.szene.add(staub);

  var licht = new THREE.DirectionalLight(GLUT, 2.6);
  licht.position.set(2.4, 2.0, 2.2);
  b.szene.add(licht);
  var gegen = new THREE.DirectionalLight(KALT, 1.5);
  gegen.position.set(-3, -1.2, -2);
  b.szene.add(gegen);
  b.szene.add(new THREE.AmbientLight(0x20242e, 1.1));

  b.kamera.position.set(0, 0, 9.4);

  // Der Oktant steht rechts neben der Schlagzeile. Unter 900px ist daneben
  // kein Platz mehr, dort ruecken beide uebereinander in die Mitte.
  function versatzBerechnen() {
    return window.innerWidth > 900 ? 2.5 : 0;
  }
  var versatz = versatzBerechnen();
  window.addEventListener('resize', function () { versatz = versatzBerechnen(); });
  oktant.position.x = versatz;
  schatten.position.x = versatz;

  var zeigerX = 0, zeigerY = 0, glattX = 0, glattY = 0;
  window.addEventListener('pointermove', function (e) {
    zeigerX = (e.clientX / window.innerWidth) * 2 - 1;
    zeigerY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  var fortschritt = 0;
  window.addEventListener('scroll', function () {
    var h = behaelter.getBoundingClientRect().height || window.innerHeight;
    fortschritt = Math.min(Math.max(window.scrollY / h, 0), 1.6);
  }, { passive: true });

  behaelter.classList.add('laeuft');

  if (ruhig) {
    oktant.rotation.set(-0.35, 0.7, 0.12);
    b.renderer.render(b.szene, b.kamera);
    return;
  }

  takten(behaelter, function (d, t) {
    glattX += (zeigerX - glattX) * 0.045;
    glattY += (zeigerY - glattY) * 0.045;

    oktant.rotation.y += d * 0.16;
    oktant.rotation.x = -0.3 + glattY * 0.24 + Math.sin(t * 0.4) * 0.05;
    oktant.rotation.z = glattX * 0.1;

    // Beim Scrollen faellt der Oktant auseinander und sinkt aus dem Bild.
    var auf = Math.min(fortschritt * 1.25, 1);
    oktant.userData.teile.forEach(function (teil, i) {
      var weg = 0.5 + auf * (0.55 + (i % 3) * 0.14);
      teil.position.copy(teil.userData.sitz).multiplyScalar(weg / 0.5 * 1);
      teil.rotation.y = auf * (i % 2 ? 0.8 : -0.8);
    });
    oktant.position.x += (versatz - oktant.position.x) * 0.08;
    oktant.position.y = -fortschritt * 1.6;
    schatten.position.x = oktant.position.x;
    oktant.userData.kantenStoff.opacity = 0.5 * (1 - auf * 0.7);

    schatten.rotation.y -= d * 0.05;
    schatten.rotation.x = 0.2 + glattY * 0.05;

    staub.rotation.y += d * 0.022;
    staub.position.y = Math.sin(t * 0.25) * 0.12 - fortschritt * 0.6;

    b.kamera.position.x = glattX * 0.55;
    b.kamera.position.y = -glattY * 0.35 + fortschritt * 0.4;
    b.kamera.position.z = 9.4 + fortschritt * 2.2;
    b.kamera.lookAt(0, oktant.position.y * 0.4, 0);

    b.renderer.render(b.szene, b.kamera);
  });
}

/* ============================================================= Werkbank */

function werkbankSzene() {
  var behaelter = document.getElementById('werkbank-buehne');
  if (!behaelter) return;

  var b = buehneBauen(behaelter, 32);
  if (!b) return;

  var umgebung = umgebungBauen(b.renderer);
  b.szene.environment = umgebung;

  var stoff = new THREE.MeshStandardMaterial({
    color: 0x1b1f2a, metalness: 0.86, roughness: 0.3, envMapIntensity: 2.3
  });

  var oktant = oktantBauen(stoff);
  oktant.scale.setScalar(1.05);
  b.szene.add(oktant);

  var boden = new THREE.Mesh(
    new THREE.CircleGeometry(6, 64),
    new THREE.MeshBasicMaterial({ color: 0x0a0c12, transparent: true, opacity: 0.55 })
  );
  boden.rotation.x = -Math.PI / 2;
  boden.position.y = -2.1;
  b.szene.add(boden);

  var staub = staubBauen(320, 4.2);
  b.szene.add(staub);

  var licht = new THREE.DirectionalLight(GLUT, 3.0);
  licht.position.set(2.2, 2.6, 1.8);
  b.szene.add(licht);
  var gegen = new THREE.DirectionalLight(KALT, 1.6);
  gegen.position.set(-2.6, -0.8, -2.4);
  b.szene.add(gegen);
  b.szene.add(new THREE.AmbientLight(0x1c2029, 1.2));

  b.kamera.position.set(0, 0.35, 8.6);
  b.kamera.lookAt(0, 0, 0);

  /* ------------------------------------------------------------ Ziehen */

  var drehX = -0.32, drehY = 0.6;      // aktueller Stand
  var schwungX = 0, schwungY = 0.12;   // Nachlauf
  var zieht = false, letztX = 0, letztY = 0;
  var beruehrt = false;

  function anfassen(e) {
    zieht = true;
    letztX = e.clientX; letztY = e.clientY;
    behaelter.setPointerCapture(e.pointerId);
    if (!beruehrt) { beruehrt = true; behaelter.classList.add('ist-beruehrt'); }
  }
  function ziehen(e) {
    if (!zieht) return;
    var dx = e.clientX - letztX;
    var dy = e.clientY - letztY;
    letztX = e.clientX; letztY = e.clientY;
    schwungY = dx * 0.006;
    schwungX = dy * 0.005;
    drehY += schwungY;
    drehX += schwungX;
  }
  function loslassen(e) {
    zieht = false;
    if (behaelter.hasPointerCapture && behaelter.hasPointerCapture(e.pointerId)) {
      behaelter.releasePointerCapture(e.pointerId);
    }
  }
  behaelter.addEventListener('pointerdown', anfassen);
  behaelter.addEventListener('pointermove', ziehen);
  behaelter.addEventListener('pointerup', loslassen);
  behaelter.addEventListener('pointercancel', loslassen);

  /* -------------------------------------------------------- Darstellung */

  var modus = 'massiv';
  var streuungZiel = 0, streuung = 0;

  var knoepfe = document.querySelectorAll('.schalterreihe [data-modus]');
  knoepfe.forEach(function (knopf) {
    knopf.addEventListener('click', function () {
      modus = knopf.getAttribute('data-modus');
      knoepfe.forEach(function (k) {
        k.setAttribute('aria-pressed', String(k === knopf));
      });
      streuungZiel = modus === 'streuung' ? 1 : 0;
      oktant.userData.teile.forEach(function (teil) {
        teil.userData.koerper.visible = modus !== 'kanten';
      });
      oktant.userData.kantenStoff.opacity = modus === 'kanten' ? 1 : 0.55;
      if (!beruehrt) { beruehrt = true; behaelter.classList.add('ist-beruehrt'); }
    });
  });

  /* ----------------------------------------------------------- Bildrate */

  var anzeige = document.getElementById('bildrate');
  var bilder = 0, seit = performance.now();

  var scrollDreh = 0;
  window.addEventListener('scroll', function () {
    var r = behaelter.getBoundingClientRect();
    var mitte = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight;
    scrollDreh = mitte;
  }, { passive: true });

  if (ruhig) {
    oktant.rotation.set(drehX, drehY, 0);
    b.renderer.render(b.szene, b.kamera);
    if (anzeige) anzeige.textContent = '—';
    return;
  }

  takten(behaelter, function (d, t) {
    if (!zieht) {
      schwungY += (0.0022 - schwungY) * 0.035;   // Grunddrehung
      schwungX *= 0.92;
      drehY += schwungY;
      drehX += schwungX;
    }
    drehX = Math.max(-1.15, Math.min(1.15, drehX));

    oktant.rotation.y = drehY;
    oktant.rotation.x = drehX + scrollDreh * 0.5;
    oktant.position.y = Math.sin(t * 0.5) * 0.06;

    streuung += (streuungZiel - streuung) * 0.06;
    oktant.userData.teile.forEach(function (teil, i) {
      var weg = 1 + streuung * (0.9 + (i % 4) * 0.22);
      teil.position.copy(teil.userData.sitz).multiplyScalar(weg);
      teil.rotation.z = streuung * (i % 2 ? 0.5 : -0.5);
    });

    staub.rotation.y -= d * 0.05;

    b.renderer.render(b.szene, b.kamera);

    bilder++;
    if (t * 1000 - seit > 900) {
      if (anzeige) anzeige.textContent = Math.round(bilder / ((t * 1000 - seit) / 1000));
      bilder = 0; seit = t * 1000;
    }
  });
}

/* Erst starten, wenn der Rest der Seite steht. */
function los() {
  try { kopfSzene(); } catch (f) { /* Verlauf bleibt stehen */ }
  try { werkbankSzene(); } catch (f) { /* Bedienung bleibt, Bild fehlt */ }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  window.setTimeout(los, 0);
} else {
  document.addEventListener('DOMContentLoaded', los);
}
