import * as THREE from "three";
import { platzhalterTextur, leuchtfleckTextur } from "./platzhalter.js";

/*
  Die Ausstellung als echte 3D-Szene auf der Grafikkarte.

  Warum nicht CSS-3D wie in der Vorlage: dort rastert der Browser bei jedem
  Bild alle Ebenen neu in Software. Gemessen waren das 37 ms pro Bild statt
  der nötigen 16, beim Richtungswechsel 98 ms. Das ist keine Einstellungssache,
  das ist die Bauweise. Hier trägt die Grafikkarte, und die Kamera ist eine
  echte Kamera statt eines Stapels verschobener Rechtecke.

  Drei Grundsätze, die diese Datei durchziehen:
  1. Gezeichnet wird nur, wenn sich etwas geändert hat (`anfordern()`).
  2. Keine Lichtberechnung: alle Materialien sind Basic-Materialien, die
     Beleuchtung ist gemalt. Kein Schattenwurf, nirgends.
  3. Geometrien und Materialien werden geteilt, nicht je Objekt neu gebaut.
*/

const ABSTAND = 10;       // Abstand zweier Objekte auf der Fahrtachse
const WAND_X = 6.4;       // Abstand der Wände von der Mitte
const RAHMEN_X = 4.3;     // Abstand der Bilder von der Fahrtachse
const RAHMEN_DREH = 0.30; // Neigung der Bilder zur Mitte, im Bogenmaß (~17°)
const RAHMEN_B = 4.6;
const RAHMEN_H = 3.1;
const NAH_AUS = 6.6;      // ab hier ist ein Bild ausgeblendet
const NAH_VOLL = 9.8;     // ab hier ist es voll da
const VORLAUF = 14;       // Strecke vor dem ersten Objekt
const NACHLAUF = 13;      // Strecke hinter dem letzten
const VORAUS = 12.5;      // so weit vor der Kamera gilt ein Bild als „dran“

/*
  Warum die Bilder NICHT flach an den Wänden hängen:
  In einer echten Galerie dreht der Besucher den Kopf. Eine Kamera, die stur
  geradeaus fährt, sieht ein Bild an der Seitenwand nur als schmalen Strich —
  im ersten Aufbau war der Showroom deshalb praktisch leer, derselbe Eindruck
  wie bei der Vorlage. Die Bilder stehen jetzt nah an der Fahrtachse und sind
  leicht zur Mitte gedreht, und die Kamera wendet sich dem jeweils nächsten
  Bild zu. Das ist der Unterschied zwischen „da ist ein Raum“ und „da sind
  Immobilien“.
*/

export class Showroomszene {
  constructor(leinwand, objekte, akzent) {
    this.leinwand = leinwand;
    this.objekte = objekte;
    this.akzent = new THREE.Color(akzent);
    this.rahmen = [];
    this.laeuft = false;
    this.zeichnenNoetig = true;
    this.fortschritt = 0;
    this.blickX = 0;
    this.blickY = 0;
    this.blickWunsch = 0;
    this.blickHoehe = 2.1;
    this.zielBlickX = 0;
    this.zielBlickY = 0;
    this.aktiv = 0;
    this.beiWechsel = null;
    this.entsorgt = false;

    this.#rendererBauen();
    this.#szeneBauen();
    this.#objekteBauen();

    this.raycaster = new THREE.Raycaster();
    this.zeiger = new THREE.Vector2();
    this.uhr = new THREE.Clock();
  }

  /* ---------------------------------------------------------------- Aufbau */

  #rendererBauen() {
    const dpr = window.devicePixelRatio || 1;
    // Kantenglättung kostet Füllrate. Auf dichten Displays ist sie ohnehin
    // kaum sichtbar — dort lieber weglassen und die Bildrate behalten.
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.leinwand,
      antialias: dpr < 1.5,
      powerPreference: "high-performance",
      alpha: false,
      stencil: false,
      depth: true,
    });
    this.renderer.setPixelRatio(Math.min(dpr, 1.8));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x10120d, 1);
    // Schatten bleiben aus. Sie sind in einer Szene wie dieser der teuerste
    // Posten und bringen optisch fast nichts, weil der Raum ohnehin dunkel ist.
    this.renderer.shadowMap.enabled = false;
  }

  #szeneBauen() {
    this.szene = new THREE.Scene();
    // Nebel erzeugt die Tiefe, die in der Vorlage über abgedunkelte Ebenen
    // und Weichzeichner erkauft wurde. Kostet hier praktisch nichts.
    this.szene.fog = new THREE.Fog(0x10120d, 16, ABSTAND * this.objekte.length + 20);

    this.kamera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);
    this.kamera.position.set(0, 1.65, VORLAUF);

    const tiefe = ABSTAND * this.objekte.length + VORLAUF + NACHLAUF;
    const mitteZ = VORLAUF - tiefe / 2;

    const geteilteEbene = new THREE.PlaneGeometry(1, 1);
    this.geteilteEbene = geteilteEbene;

    // Boden
    const boden = new THREE.Mesh(
      geteilteEbene,
      new THREE.MeshBasicMaterial({ color: 0x15180f })
    );
    boden.rotation.x = -Math.PI / 2;
    boden.scale.set(WAND_X * 2, tiefe, 1);
    boden.position.set(0, 0, mitteZ);
    this.szene.add(boden);

    // Decke, nur angedeutet
    const decke = boden.clone();
    decke.material = new THREE.MeshBasicMaterial({ color: 0x0d0f0a });
    decke.rotation.x = Math.PI / 2;
    decke.position.y = 5.4;
    this.szene.add(decke);

    // Wände
    const wandMaterial = new THREE.MeshBasicMaterial({ color: 0x1b1f15 });
    for (const seite of [-1, 1]) {
      const wand = new THREE.Mesh(geteilteEbene, wandMaterial);
      wand.scale.set(tiefe, 5.4, 1);
      wand.rotation.y = seite * (Math.PI / 2);
      wand.position.set(seite * WAND_X, 2.7, mitteZ);
      this.szene.add(wand);
    }

    this.leuchtfleck = leuchtfleckTextur();
    /*
      Das Licht trägt NICHT die Markenfarbe. Eine Wandleuchte in vollem
      Limettengrün färbt den ganzen Raum giftgrün und lässt die Bilder
      billig aussehen — in der ersten Fassung war genau das zu sehen.
      Galerielicht ist warmweiß; die Marke gehört auf die Rahmen, nicht
      in die Lampe. Ein Hauch des Grüntons bleibt, damit es zusammenpasst.
    */
    const lichtfarbe = this.akzent.clone().lerp(new THREE.Color(0xfff6e2), 0.82);
    this.lichtMaterial = new THREE.MeshBasicMaterial({
      map: this.leuchtfleck,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: lichtfarbe,
      opacity: 0.62,
    });
  }

  #objekteBauen() {
    const lader = new THREE.TextureLoader();

    this.objekte.forEach((objekt, i) => {
      const seite = i % 2 === 0 ? -1 : 1;
      const z = -(i * ABSTAND);
      const gruppe = new THREE.Group();
      gruppe.position.set(seite * RAHMEN_X, 2.35, z);
      // Vorderseite zur Fahrtachse drehen, nicht zur Wand.
      gruppe.rotation.y = -seite * RAHMEN_DREH;

      // Passepartout hinter dem Bild, in der Markenfarbe.
      const kante = new THREE.Mesh(
        this.geteilteEbene,
        new THREE.MeshBasicMaterial({
          color: this.akzent,
          transparent: true,
          depthWrite: false,
        })
      );
      kante.scale.set(RAHMEN_B + 0.34, RAHMEN_H + 0.34, 1);
      kante.position.z = -0.02;
      gruppe.add(kante);

      const bildMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: platzhalterTextur(objekt, `#${this.akzent.getHexString()}`),
        transparent: true,
      });
      const bild = new THREE.Mesh(this.geteilteEbene, bildMaterial);
      bild.scale.set(RAHMEN_B, RAHMEN_H, 1);
      bild.userData.slug = objekt.slug;
      bild.userData.index = i;
      gruppe.add(bild);

      // Wandleuchte über dem Bild.
      const leuchte = new THREE.Mesh(this.geteilteEbene, this.lichtMaterial);
      leuchte.scale.set(RAHMEN_B * 1.5, RAHMEN_H * 1.4, 1);
      leuchte.position.set(0, 0.2, 0.05);
      gruppe.add(leuchte);

      // Lichtfleck auf dem Boden vor dem Bild — ersetzt eine echte Reflexion.
      const bodenlicht = new THREE.Mesh(this.geteilteEbene, this.lichtMaterial);
      bodenlicht.rotation.x = -Math.PI / 2;
      bodenlicht.scale.set(6, 8, 1);
      bodenlicht.position.set(seite * RAHMEN_X, 0.02, z + 0.6);
      this.szene.add(bodenlicht);

      this.szene.add(gruppe);
      this.rahmen.push({
        gruppe, bild, kante, bildMaterial,
        kanteMaterial: kante.material,
        leuchte, bodenlicht, seite, z, index: i,
      });

      // Das echte Foto wird nachgeladen und ersetzt den Platzhalter, sobald
      // es da ist. Schlägt es fehl, bleibt der Platzhalter stehen.
      if (objekt.bild) {
        lader.load(
          objekt.bild,
          (textur) => {
            if (this.entsorgt) {
              textur.dispose();
              return;
            }
            textur.colorSpace = THREE.SRGBColorSpace;
            textur.anisotropy = Math.min(
              4,
              this.renderer.capabilities.getMaxAnisotropy()
            );
            bildMaterial.map?.dispose();
            bildMaterial.map = textur;
            bildMaterial.needsUpdate = true;
            this.anfordern();
          },
          undefined,
          () => {
            /* Kein Foto vorhanden — der Platzhalter bleibt, und das ist in
               Ordnung. Kein Fehler in der Konsole, kein leerer Rahmen. */
          }
        );
      }
    });

    this.streckeGesamt = ABSTAND * (this.objekte.length - 1);
    this.zStart = VORLAUF;
    this.zEnde = -this.streckeGesamt + 4.5;
  }

  /* ------------------------------------------------------------- Steuerung */

  /* Fortschritt 0..1 über die gesamte Fahrt. Kommt vom Scroll. */
  setFortschritt(p) {
    const neu = Math.min(1, Math.max(0, p));
    if (Math.abs(neu - this.fortschritt) < 0.00005) return;
    this.fortschritt = neu;
    this.anfordern();
  }

  /* Leichte Blickverschiebung mit der Maus — dezent, sonst wird es kitschig. */
  setZeiger(nx, ny) {
    this.zielBlickX = nx;
    this.zielBlickY = ny;
    this.anfordern();
  }

  groesseAnpassen() {
    const b = this.leinwand.clientWidth;
    const h = this.leinwand.clientHeight;
    if (!b || !h) return;
    this.renderer.setSize(b, h, false);
    this.kamera.aspect = b / h;
    // Auf schmalen Geräten etwas weitwinkliger, sonst sieht man nur Wand.
    this.kamera.fov = b < 700 ? 72 : 58;
    /* Auf schmalen Schirmen nimmt die Objektkarte die untere Hälfte ein.
       Die Kamera blickt dort etwas tiefer, damit die Bilder in die obere
       Hälfte rücken und nicht hinter der Karte verschwinden. */
    this.blickHoehe = b < 700 ? 1.35 : 2.1;
    this.kamera.updateProjectionMatrix();
    this.anfordern();
  }

  anfordern() {
    this.zeichnenNoetig = true;
  }

  start() {
    if (this.laeuft) return;
    this.laeuft = true;
    this.uhr.start();
    const schleife = () => {
      if (!this.laeuft) return;
      this.bild = requestAnimationFrame(schleife);
      this.#schritt();
    };
    this.bild = requestAnimationFrame(schleife);
  }

  stopp() {
    this.laeuft = false;
    if (this.bild) cancelAnimationFrame(this.bild);
  }

  /* ----------------------------------------------------------- Bildschleife */

  #schritt() {
    // Weiches Nachziehen des Blicks — läuft auch ohne Scroll weiter, deshalb
    // gilt die Szene erst als ruhig, wenn die Differenz vernachlässigbar ist.
    const dx = this.zielBlickX - this.blickX;
    const dy = this.zielBlickY - this.blickY;
    if (Math.abs(dx) > 0.0008 || Math.abs(dy) > 0.0008) {
      this.blickX += dx * 0.08;
      this.blickY += dy * 0.08;
      this.zeichnenNoetig = true;
    }

    if (!this.zeichnenNoetig) return;
    this.zeichnenNoetig = false;

    /* Die Fahrt endet VOR dem letzten Bild, nicht dahinter. Sonst steht man
       am Ende der Sektion in einem leeren Raum und schaut auf nichts — ein
       Fehler, den man beim Entwickeln nie sieht, weil man selten ganz
       durchscrollt. */
    const z = this.zStart + this.fortschritt * (this.zEnde - this.zStart);
    this.kamera.position.z = z;
    this.kamera.position.x = this.blickX * 0.45;
    this.kamera.position.y = 1.7 + this.blickY * 0.2;

    // Welcher Rahmen ist gerade dran? Gemessen wird an der Stelle, die
    // VORAUS Einheiten vor der Kamera liegt — dort steht ein Bild am besten
    // im Bild, nicht erst, wenn man daran vorbei ist.
    // Vorbelegt mit dem bisherigen Eintrag: findet die Schleife keinen
    // Kandidaten, bleibt die Anzeige stehen, statt auf das erste Objekt
    // zurückzuspringen.
    let naechster = this.aktiv;
    let blickSumme = 0;
    let gewichtSumme = 0;

    for (const r of this.rahmen) {
      // Wie weit steht das Bild vor der Kamera? Negativ heißt: schon vorbei.
      const vorne = z - r.z;

      /* Ein Bild, an dem die Kamera gerade vorbeizieht, wird ausgeblendet.
         Ohne das schiebt sich der Rahmen als breiter Balken quer durchs
         Bild — im ersten Aufbau war genau das zu sehen. */
      const sichtbar = vorne > NAH_AUS;
      r.gruppe.visible = sichtbar;
      if (!sichtbar) continue;

      // Weiches Verschwinden auf den letzten Metern.
      const deckung = Math.min(1, (vorne - NAH_AUS) / (NAH_VOLL - NAH_AUS));

      const d = Math.abs(r.z - (z - VORAUS));
      r.bildMaterial.opacity = deckung;
      r.kanteMaterial.opacity = deckung;

      // Das Bild, an dem die Kamera gerade ist, tritt hervor.
      const naehe = Math.max(0, 1 - d / (ABSTAND * 0.9));
      r.bildMaterial.color.setScalar(0.4 + naehe * 0.6);
      const s = 1 + naehe * 0.05;
      r.gruppe.scale.set(s, s, 1);

      // Gewichteter Blick: die Kamera wendet sich dem Bild zu, an dem sie
      // gerade ist — die Kopfdrehung, die eine Galerie erst lesbar macht.
      const g = naehe * naehe * deckung;
      blickSumme += r.seite * RAHMEN_X * g;
      gewichtSumme += g;
    }

    /* Welches Objekt die Karte benennt, wird gemessen, nicht geschätzt:
       es ist das Bild, das gerade die größte Fläche auf dem Schirm einnimmt.
       Damit kann die Karte gar nicht mehr etwas anderes behaupten, als der
       Betrachter vor sich sieht — bei der Vorlage stimmte beides nicht
       überein, und das fällt niemandem auf, der den Code liest.
       Gewechselt wird erst bei deutlichem Vorsprung, sonst flackert die
       Anzeige zwischen zwei etwa gleich großen Bildern hin und her. */
    const dom = this.dominantesBild(true);
    if (dom.index >= 0) {
      const wertNeu = dom.werte.get(dom.index) ?? 0;
      const wertAlt = dom.werte.get(this.aktiv) ?? 0;
      if (dom.index !== this.aktiv && wertNeu > wertAlt * 1.18) {
        naechster = dom.index;
      }
    }

    const blickZiel = gewichtSumme > 0.001 ? blickSumme / gewichtSumme : 0;
    this.blickWunsch += (blickZiel - this.blickWunsch) * 0.12;

    this.kamera.lookAt(
      this.blickWunsch * 0.72 + this.blickX * 1.2,
      this.blickHoehe + this.blickY * 0.45,
      z - VORAUS - 1
    );

    if (naechster !== this.aktiv) {
      this.aktiv = naechster;
      this.beiWechsel?.(naechster);
    }

    this.renderer.render(this.szene, this.kamera);
  }

  /* -------------------------------------------------------------- Diagnose */

  /*
    Wie viele Bilder stehen gerade tatsächlich im Sichtfeld?

    Das ist die Frage, an der die Vorlage gescheitert ist: Dort lief alles
    fehlerfrei, es war nur nichts zu sehen. Die Zahl hängt an keiner Hardware
    und an keiner Bildrate — sie sagt schlicht, ob die Ausstellung bespielt
    ist. Fällt sie über die ganze Fahrt auf null, ist der Showroom kaputt,
    ganz gleich wie flüssig er läuft.
  */
  /*
    Welches Bild nimmt gerade die größte Fläche auf dem Schirm ein?

    Damit lässt sich prüfen, ob die Karte links dasselbe Objekt benennt, das
    der Betrachter groß vor sich sieht. Eine Seite, die etwas anderes anzeigt
    als sie behauptet, ist schlimmer als eine langsame.
  */
  dominantesBild(mitWerten = false) {
    this.kamera.updateMatrixWorld();
    const ecken = [
      new THREE.Vector3(-0.5, -0.5, 0),
      new THREE.Vector3(0.5, -0.5, 0),
      new THREE.Vector3(0.5, 0.5, 0),
      new THREE.Vector3(-0.5, 0.5, 0),
    ];
    let bester = -1;
    let groesste = 0;
    const werte = new Map();
    for (const r of this.rahmen) {
      if (!r.gruppe.visible || r.bildMaterial.opacity < 0.5) continue;
      r.bild.updateMatrixWorld();
      const p = ecken.map((e) =>
        e.clone().applyMatrix4(r.bild.matrixWorld).project(this.kamera)
      );
      if (p.some((v) => v.z > 1)) continue; // hinter der Kamera
      // Fläche des projizierten Vierecks, auf den Schirm begrenzt.
      let flaeche = 0;
      for (let i = 0; i < 4; i++) {
        const a = p[i];
        const b = p[(i + 1) % 4];
        flaeche += a.x * b.y - b.x * a.y;
      }
      flaeche = Math.abs(flaeche) / 2;
      // Bilder am Bildrand zählen weniger — sie beherrschen das Bild nicht.
      const mitte = Math.abs((p[0].x + p[2].x) / 2);
      const gewicht = Math.max(0.15, 1 - mitte * 0.85);
      const wert = flaeche * gewicht;
      werte.set(r.index, wert);
      if (wert > groesste) {
        groesste = wert;
        bester = r.index;
      }
    }
    return mitWerten ? { index: bester, werte } : bester;
  }

  sichtbareRahmen() {
    this.kamera.updateMatrixWorld();
    const m = new THREE.Matrix4().multiplyMatrices(
      this.kamera.projectionMatrix,
      this.kamera.matrixWorldInverse
    );
    const kegel = new THREE.Frustum().setFromProjectionMatrix(m);
    let n = 0;
    for (const r of this.rahmen) {
      r.bild.updateMatrixWorld();
      if (!r.bild.geometry.boundingSphere) r.bild.geometry.computeBoundingSphere();
      const kugel = r.bild.geometry.boundingSphere
        .clone()
        .applyMatrix4(r.bild.matrixWorld);
      if (kegel.intersectsSphere(kugel)) n++;
    }
    return n;
  }

  /* --------------------------------------------------------------- Auswahl */

  /* Liefert den Slug des angeklickten Bildes, sonst null. */
  treffer(klientX, klientY) {
    const r = this.leinwand.getBoundingClientRect();
    this.zeiger.x = ((klientX - r.left) / r.width) * 2 - 1;
    this.zeiger.y = -((klientY - r.top) / r.height) * 2 + 1;
    this.raycaster.setFromCamera(this.zeiger, this.kamera);
    const bilder = this.rahmen.map((x) => x.bild);
    const treffer = this.raycaster.intersectObjects(bilder, false);
    return treffer.length ? treffer[0].object.userData.slug : null;
  }

  /* ------------------------------------------------------------- Aufräumen */

  entsorgen() {
    this.entsorgt = true;
    this.stopp();
    this.szene.traverse((o) => {
      if (o.isMesh) {
        if (o.material?.map && o.material.map !== this.leuchtfleck) {
          o.material.map.dispose();
        }
        if (o.material !== this.lichtMaterial) o.material?.dispose();
      }
    });
    this.geteilteEbene.dispose();
    this.lichtMaterial.dispose();
    this.leuchtfleck.dispose();
    this.renderer.dispose();
  }
}

export const showroomKennzahlen = { ABSTAND, VORLAUF, NACHLAUF };
