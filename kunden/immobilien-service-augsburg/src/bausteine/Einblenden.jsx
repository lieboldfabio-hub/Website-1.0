import { useEffect, useRef } from "react";

/*
  Dezentes Einblenden beim Hereinscrollen — mit IntersectionObserver und
  einer CSS-Klasse, ohne Animationsbibliothek.

  Zwei Regeln, die nicht verhandelbar sind:
  1. Die Ruhelage ist sichtbar. Animiert wird nur eine kleine Verschiebung,
     nie die Deckkraft. Inhalt, der auf den Beobachter wartet, fehlt sonst
     in jeder Linkvorschau und für alle, die Bewegung abgeschaltet haben.
  2. Der Beobachter meldet sich nach dem ersten Mal ab. Nichts läuft weiter,
     während gescrollt wird.
*/
export default function Einblenden({ children, als: Als = "div", verzug = 0, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    el.dataset.wartet = "";
    const beobachter = new IntersectionObserver(
      ([eintrag], b) => {
        if (!eintrag.isIntersecting) return;
        el.style.transitionDelay = `${verzug}ms`;
        delete el.dataset.wartet;
        b.disconnect();
      },
      { threshold: 0.04, rootMargin: "0px 0px -40px 0px" }
    );
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [verzug]);

  return (
    <Als ref={ref} className={`einblenden ${className}`.trim()} {...rest}>
      {children}
    </Als>
  );
}
