/*
  Motive statt Fotos.

  Es liegt kein freigegebenes Bildmaterial vor; für ein reales Unternehmen
  aus dem Netz gegriffene Bilder einzusetzen wäre ein Lizenzproblem. Diese
  großformatigen Linienzeichnungen tragen die Ausstellung, bis echte Fotos
  da sind — sie kosten nichts zu laden und lassen sich beliebig skalieren.
*/
const G = {
  viewBox: "0 0 400 300",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  preserveAspectRatio: "xMidYMid meet",
};

export default function Motiv({ art }) {
  if (art === "bewertung" || art === "/immobilienbewertung")
    return (
      <svg {...G}>
        <path d="M30 250h340" strokeWidth="1.5" />
        <path d="M72 250V152l58-44 58 44v98" />
        <path d="M112 250v-42h32v42" />
        <path d="M120 130v-26M108 116l12-12 12 12" />
        <path d="M228 250V120h92v130" />
        <path d="M248 142h22M248 168h22M248 194h22M290 142h12M290 168h12M290 194h12" />
        <circle cx="120" cy="92" r="10" />
        <path d="M340 250v-58M328 204l12-12 12 12" strokeWidth="1.4" />
      </svg>
    );
  if (art === "verkauf" || art === "/immobilienverkauf")
    return (
      <svg {...G}>
        <path d="M30 250h340" strokeWidth="1.5" />
        <path d="M84 250V148l66-50 66 50v102" />
        <path d="M128 250v-44h44v44" />
        <path d="M262 108h76v52h-76z" />
        <path d="M300 160v90" />
        <path d="M278 128h44M278 144h28" />
        <path d="M150 98l-14-11M150 98l14-11" />
      </svg>
    );
  if (art === "vermietung" || art === "/immobilienvermietung")
    return (
      <svg {...G}>
        <path d="M30 250h340" strokeWidth="1.5" />
        <path d="M70 250V140h110v110M180 250V166h110v84" />
        <path d="M94 164h26v26H94zM134 164h26v26h-26zM94 204h26v26H94z" />
        <path d="M206 192h26v26h-26zM248 192h26v26h-26z" />
        <circle cx="147" cy="217" r="4" />
        <path d="M310 250v-46h40v46" />
        <path d="M304 204l26-18 26 18" />
      </svg>
    );
  if (art === "mediation" || art === "/immobilienmediation")
    return (
      <svg {...G}>
        <path d="M30 250h340" strokeWidth="1.5" />
        <path d="M150 250V148l50-38 50 38v102" />
        <path d="M200 110V78" />
        <path d="M182 250v-48h36v48" />
        <circle cx="76" cy="164" r="18" />
        <path d="M52 250v-22a24 24 0 0 1 48 0v22" />
        <circle cx="324" cy="164" r="18" />
        <path d="M300 250v-22a24 24 0 0 1 48 0v22" />
        <path d="M112 186h26M262 186h26" />
      </svg>
    );
  if (art === "betreuung" || art === "/betreuungsverfahren")
    return (
      <svg {...G}>
        <path d="M30 250h340" strokeWidth="1.5" />
        <path d="M108 250V150h94v100" />
        <path d="M140 250v-38h30v38" />
        <path d="M100 150l55-40 55 40" />
        <path d="M262 250V118h76v132" />
        <path d="M282 140h36M282 162h36M282 184h36M282 206h20" />
        <path d="M252 118h96" strokeWidth="1.4" />
        <path d="M300 106v-18M286 96l14-14 14 14" />
      </svg>
    );
  if (art === "raum" || art === "/innenarchitektur")
    return (
      <svg {...G}>
        <path d="M30 250h340" strokeWidth="1.5" />
        <path d="M78 250V96h140v154" />
        <path d="M78 96l70-42 70 42" />
        <path d="M106 134h38v38h-38z" />
        <path d="M106 196h38M106 214h24" />
        <path d="M250 250v-82h96v82" />
        <path d="M250 168l48-30 48 30" />
        <path d="M274 250v-44h26v44" />
        <path d="M318 196h16v18h-16z" />
      </svg>
    );
  return (
    <svg {...G}>
      <path d="M30 250h340" strokeWidth="1.5" />
      <path d="M96 250V142h116v108" />
      <path d="M96 142l58-38 58 38" />
      <circle cx="154" cy="182" r="16" />
      <path d="M130 250v-24a24 24 0 0 1 48 0v24" />
      <path d="M254 250v-72h92v72" />
      <path d="M274 202h52M274 224h34" />
    </svg>
  );
}
