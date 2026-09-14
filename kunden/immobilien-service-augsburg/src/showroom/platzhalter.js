import * as THREE from "three";

/*
  Erzeugt eine erkennbare Platzhalter-Textur, wenn ein Objektfoto fehlt.

  Der Grund steht in der Projektnotiz: bei der Vorlage war der Showroom leer,
  weil fehlende Bilder einfach nichts gezeichnet haben. Hier kann das nicht
  passieren — es gibt immer etwas zu sehen, und man sieht sofort, dass das
  Foto noch fehlt.
*/
export function platzhalterTextur(objekt, akzent = "#a8c455") {
  const b = 768;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = b;
  c.height = h;
  const g = c.getContext("2d");

  const verlauf = g.createLinearGradient(0, 0, b, h);
  verlauf.addColorStop(0, "#2b3024");
  verlauf.addColorStop(1, "#161a12");
  g.fillStyle = verlauf;
  g.fillRect(0, 0, b, h);

  // Diagonale Schraffur — signalisiert „hier fehlt etwas“, ohne zu schreien.
  g.strokeStyle = "rgba(255,255,255,0.045)";
  g.lineWidth = 2;
  for (let x = -h; x < b; x += 22) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x + h, h);
    g.stroke();
  }

  g.strokeStyle = akzent;
  g.lineWidth = 6;
  g.strokeRect(3, 3, b - 6, h - 6);

  g.fillStyle = "#f2f4ec";
  g.font = "600 42px Georgia, serif";
  g.textAlign = "center";
  g.fillText(objekt.titel, b / 2, h / 2 - 8, b - 80);

  g.fillStyle = akzent;
  g.font = "500 22px system-ui, sans-serif";
  g.fillText(objekt.lage.toUpperCase(), b / 2, h / 2 + 36, b - 80);

  g.fillStyle = "rgba(255,196,84,0.95)";
  g.font = "500 18px system-ui, sans-serif";
  g.fillText("Foto fehlt noch", b / 2, h - 42);

  const textur = new THREE.CanvasTexture(c);
  textur.colorSpace = THREE.SRGBColorSpace;
  return textur;
}

/* Weicher Lichtfleck für Boden und Wandleuchten. Eine Textur für alle. */
export function leuchtfleckTextur() {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const g = c.getContext("2d");
  const v = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  v.addColorStop(0, "rgba(255,255,255,0.85)");
  v.addColorStop(0.45, "rgba(255,255,255,0.18)");
  v.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = v;
  g.fillRect(0, 0, s, s);
  const textur = new THREE.CanvasTexture(c);
  textur.colorSpace = THREE.SRGBColorSpace;
  return textur;
}
