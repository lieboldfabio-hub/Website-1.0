"use strict";

const ImageProvider = require("./base");

/*
  Test-Provider ohne Kosten und ohne externe Anfrage: erzeugt eine
  SVG-Platzhaltergrafik mit dem gewaehlten Farbton. Damit laesst sich der
  komplette Ablauf (Formular -> Job -> Fortschritt -> Galerie -> Website
  uebernehmen) pruefen, ohne einen einzigen echten API-Aufruf auszuloesen.
  Nur aktiv, wenn AI_STUDIO_ENABLE_MOCK=true gesetzt ist - siehe README.
*/

function dimensionsForAspect(aspect) {
  const [w, h] = String(aspect || "1:1").split(":").map(Number);
  if (!w || !h) return { width: 1024, height: 1024 };
  const longEdge = 1200;
  if (w >= h) return { width: longEdge, height: Math.round((longEdge * h) / w) };
  return { width: Math.round((longEdge * w) / h), height: longEdge };
}

function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]));
}

class MockImageProvider extends ImageProvider {
  constructor() {
    super();
    this.id = "mock";
    this.label = "Test-Bild (kein echtes KI-Ergebnis)";
    this.costHint = "kostenlos";
  }

  isConfigured() {
    return true;
  }

  async generateImage({ prompt, aspect, colorHex, label }) {
    const { width, height } = dimensionsForAspect(aspect);
    const accent = colorHex || "#c9993c";
    const excerpt = escapeXml(String(prompt || "").slice(0, 140)) + "…";

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#15120e" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.55" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)" />
  <text x="6%" y="14%" font-family="sans-serif" font-size="${Math.round(width * 0.03)}" fill="#f7f1e3" opacity="0.85">MOCK · ${escapeXml(label || "KI-Studio")}</text>
  <text x="6%" y="92%" font-family="sans-serif" font-size="${Math.round(width * 0.018)}" fill="#f7f1e3" opacity="0.7">
    <tspan x="6%" dy="0">${excerpt}</tspan>
  </text>
</svg>`;

    return { buffer: Buffer.from(svg, "utf8"), mimeType: "image/svg+xml" };
  }
}

module.exports = MockImageProvider;
