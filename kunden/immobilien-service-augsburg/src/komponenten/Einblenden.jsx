import { motion, useReducedMotion } from "framer-motion";

/*
  Abschnitte gleiten beim Scrollen herein — aber nur, wenn das auch sicher
  ankommt.

  Der Fehler, der das hier nötig gemacht hat: Die Abschnitte standen auf
  `opacity: 0` und warteten auf den Beobachter, der sie beim Scrollen
  einblendet. Wer nicht scrollt, sieht dann eine Seite mit Überschriften und
  sonst nichts — und genau das bekommen auch eine Linkvorschau, ein
  Vorschaubild und jeder, der Bewegung abgeschaltet hat.

  Deshalb zwei Regeln:
  1. Bei reduzierter Bewegung wird gar nicht animiert, der Inhalt steht sofort da.
  2. Animiert wird nur die Lage, nie die Deckkraft. Der Abschnitt gleitet ein
     Stück herauf, ist aber in jedem Zustand lesbar — auch wenn der Beobachter
     nie auslöst. Bewegung darf ein Inhalt gewinnen, seine Sichtbarkeit nicht.
*/
export default function Einblenden({ children, verzug = 0, als = "div", ...rest }) {
  const ruhig = useReducedMotion();
  const Bauteil = motion[als] ?? motion.div;

  if (ruhig) {
    const Schlicht = als;
    return <Schlicht {...rest}>{children}</Schlicht>;
  }

  return (
    <Bauteil
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.55, delay: verzug, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Bauteil>
  );
}
