import { useEffect } from "react";
import Lenis from "lenis";

/*
  Sanftes Scrollen — genau eine Instanz für die ganze Seite.

  In der Vorlage war das eine Fehlerquelle: bei jedem Seitenwechsel drohte
  eine zweite Instanz mit einer zweiten Schleife. Hier hängt sie am Wurzel-
  Bauteil, wird einmal erzeugt und beim Verlassen sauber abgeräumt.

  Wer Bewegung reduziert haben möchte, bekommt gewöhnliches Scrollen —
  sanftes Scrollen ist für manche Menschen ein körperliches Problem,
  keine Geschmacksfrage.
*/
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Auf Touchgeräten nicht eingreifen: das Betriebssystem scrollt dort
      // besser, als jede Bibliothek es nachbauen kann.
      syncTouch: false,
    });

    let bild;
    const schritt = (zeit) => {
      lenis.raf(zeit);
      bild = requestAnimationFrame(schritt);
    };
    bild = requestAnimationFrame(schritt);

    return () => {
      cancelAnimationFrame(bild);
      lenis.destroy();
    };
  }, []);
}
