import { useState } from "react";

/*
  Ein Bild in einem Rahmen, dessen Größe feststeht, bevor das Bild da ist.

  Schlägt das Laden fehl, wird das Bild nur unsichtbar — die Fläche bleibt.
  Damit entsteht kein Layout-Sprung, weder beim fehlenden Foto noch beim
  langsamen Nachladen.
*/
export default function Bildflaeche({ src, alt, breite, hoehe, fehltText, ...rest }) {
  const [fehlt, setFehlt] = useState(false);
  return (
    <span className="bildflaeche" data-fehlt={fehlt ? fehltText : undefined}>
      <img
        src={src}
        alt={fehlt ? "" : alt}
        width={breite}
        height={hoehe}
        decoding="async"
        onError={() => setFehlt(true)}
        {...rest}
      />
    </span>
  );
}
