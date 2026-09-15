/* ============================================================================
   Bildquelle - Auslieferung ueber Cloudinary, mit Rueckfall auf die Datei
   ----------------------------------------------------------------------------
   Cloudinary liefert dasselbe Bild in dem Format aus, das der Browser gerade
   am besten kann (AVIF, sonst WebP, sonst JPEG) und in genau der Breite, die
   der Platz hergibt. Das spart bei den grossen Vorschaubildern den Loewenanteil
   der Datenmenge - gerade auf dem Mobilfunknetz, wo die cinematische Startseite
   sonst zaeh wird.

   WICHTIG - hier wird nur ausgeliefert, nie hochgeladen:
   Der Cloud Name unten ist oeffentlich, er steht ohnehin in jeder Bild-URL.
   API Key und Secret gehoeren NICHT hierher. Diese Datei liegt offen im Repo
   und wird an jeden Browser ausgeliefert. Zum Hochladen gibt es das KI-Studio,
   dessen Schluessel in ai-studio/server/.env bleiben.

   EINRICHTEN:
   1. Im Cloudinary-Dashboard oben links den "Cloud Name" ablesen
      (nicht die lange Account-ID aus der Konsolen-Adresse).
   2. Unten bei CLOUD eintragen.
   3. Die Bilder aus assets/img/ in Cloudinary in den Ordner "sf-webseiten"
      hochladen - unter demselben Dateinamen ohne Endung. Also wird aus
      assets/img/folio-osteria-fontana.jpg die Public ID
      sf-webseiten/folio-osteria-fontana.

   Solange CLOUD leer ist, passiert nichts: jedes Bild behaelt seinen lokalen
   Pfad. Die Seite laesst sich also weiterhin ohne Netz vorfuehren, und das
   Umschalten ist eine einzige Zeile - in beide Richtungen.
   ========================================================================= */

(function () {
  "use strict";

  /* Leer lassen = alles bleibt lokal. Beispiel: "sf-webseiten". */
  var CLOUD = "";

  /* Ordner in Cloudinary, unter dem die Bilder liegen. Leer = Wurzel. */
  var ORDNER = "sf-webseiten";

  /* Breiten, die im srcset angeboten werden. Mehr Stufen kosten nichts:
     Cloudinary erzeugt jede Groesse erst beim ersten Abruf und legt sie
     danach im eigenen Zwischenspeicher ab. */
  var BREITEN = [480, 768, 1024, 1440, 1920];

  window.Bildquelle = {
    aktiv: function () { return CLOUD !== ""; },
    url: url,
    srcset: srcset
  };

  /* Ohne Cloud Name bleibt der lokale Pfad unveraendert stehen - so faellt
     jede Funktion hier auf den heutigen Zustand zurueck statt auf einen Fehler. */
  function url(lokal, breite) {
    if (!CLOUD) return lokal;
    var t = ["f_auto", "q_auto"];
    if (breite) t.push("w_" + breite, "c_limit");
    return "https://res.cloudinary.com/" + CLOUD + "/image/upload/" +
           t.join(",") + "/" + publicId(lokal);
  }

  function srcset(lokal) {
    if (!CLOUD) return "";
    return BREITEN.map(function (b) {
      return url(lokal, b) + " " + b + "w";
    }).join(", ");
  }

  /* "assets/img/folio-osteria-fontana.jpg" -> "sf-webseiten/folio-osteria-fontana" */
  function publicId(lokal) {
    var name = lokal.split("/").pop().replace(/\.[^.]+$/, "");
    return ORDNER ? ORDNER + "/" + name : name;
  }

  /* Jedes Bild mit data-cloudinary wird beim Laden umgehaengt. Das Attribut
     ist bewusst nicht automatisch fuer alle Bilder gesetzt: Logo, Signet und
     Favicons sollen lokal bleiben, damit die Marke auch ohne Netz steht. */
  if (!CLOUD) return;

  document.addEventListener("DOMContentLoaded", function () {
    var bilder = document.querySelectorAll("img[data-cloudinary]");
    Array.prototype.forEach.call(bilder, function (img) {
      var lokal = img.getAttribute("src");
      if (!lokal) return;
      var satz = srcset(lokal);
      if (satz) {
        img.setAttribute("srcset", satz);
        if (!img.getAttribute("sizes")) {
          img.setAttribute("sizes", img.getAttribute("data-cloudinary") || "100vw");
        }
      }
      img.setAttribute("src", url(lokal, 1440));
    });
  });
})();
