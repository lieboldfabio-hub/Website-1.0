import { useEffect } from "react";
import { metaFuer } from "../seiten-meta.js";

/*
  Setzt Titel, Beschreibung und die kanonische Adresse je Seite.

  Eine Single-Page-Anwendung behält sonst den Titel der ersten Seite über
  alle Wechsel hinweg — für Suchmaschinen und für die Lesezeichenleiste
  heißt dann jede Unterseite gleich.
*/
export function useSeitenkopf(weg, ueberschreiben) {
  useEffect(() => {
    const m = ueberschreiben ?? metaFuer(weg);
    if (!m) return;

    /* Der Zusatz kommt nur dran, wenn der Titel dadurch nicht über 60
       Zeichen wächst — darüber schneidet Google ihn in der Trefferliste ab. */
    const zusatz = " — Marion Sens, Immobilien Augsburg";
    document.title =
      m.titel.includes("Marion Sens") || m.titel.length + zusatz.length > 60
        ? m.titel
        : m.titel + zusatz;

    setzeMeta("name", "description", m.beschreibung);
    setzeLink("canonical", window.location.origin + weg);
  }, [weg, ueberschreiben]);
}

function setzeMeta(art, wert, inhalt) {
  let el = document.head.querySelector(`meta[${art}="${wert}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(art, wert);
    document.head.appendChild(el);
  }
  el.setAttribute("content", inhalt);
}

function setzeLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}
