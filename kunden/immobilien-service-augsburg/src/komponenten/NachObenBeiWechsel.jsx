import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/*
  Bei einem Seitenwechsel nach oben springen.

  Ohne das landet man auf der Objektseite mitten im Text, weil der Browser
  die Scrollhöhe der vorherigen Seite behält — ein Fehler, den fast jede
  Single-Page-Seite am Anfang hat.
*/
export default function NachObenBeiWechsel() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
