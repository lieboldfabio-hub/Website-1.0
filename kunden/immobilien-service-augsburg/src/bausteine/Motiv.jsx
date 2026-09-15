/*
  Motive statt Fotos.

  Es liegt kein freigegebenes Bildmaterial vor; für ein reales Unternehmen aus
  dem Netz gegriffene Bilder einzusetzen wäre ein Lizenzproblem. Diese
  Architekturzeichnungen tragen die Ausstellung und die Leistungen, bis echte
  Fotos da sind — sie kosten nichts zu laden und lassen sich beliebig
  skalieren.

  Jede Zeichnung hat drei Ebenen, und die Ebene ist nicht nur Dekoration:

    data-linie="1"  Kontext — Dachlandschaft, Nachbarbebauung, Horizont.
                    Dünner Strich, zurückgenommen.
    data-linie="2"  Das Gebäude selbst: Aufriss oder Schnitt.
    data-linie="3"  Detail, Schraffur, Maßangaben. Vorn und am kräftigsten.

  Die drei liegen in `translateZ` gestaffelt übereinander. Steht die Zeichnung
  in einer Querfahrt, dreht sich die Station mit ihr — und weil die Ebenen
  wirklich verschieden tief liegen, verschieben sie sich dabei gegeneinander.
  Das ist echte Parallaxe aus der Projektion, keine zweite Animation.

  `pathLength="1"` auf jedem Pfad normiert die Länge. Damit kann eine einzige
  Regel (`stroke-dasharray: 1; stroke-dashoffset: 1 → 0`) jede Linie
  gleichmäßig zeichnen lassen, egal wie lang sie wirklich ist — die Regel
  steht in styles/bewegung.css und erbt von der Gruppe auf ihre Kinder.
*/

const SVG = {
  viewBox: "0 0 400 300",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  preserveAspectRatio: "xMidYMid meet",
  "aria-hidden": true,
};

/* Schraffur: kurze Parallelen unter 45°. Material und Schatten entstehen in
   einer Architekturzeichnung nicht aus Flächen, sondern aus Strichen. */
function Schraffur({ x, y, breite, hoehe, abstand = 7, schluessel }) {
  const striche = [];
  for (let i = 0; i < (breite + hoehe) / abstand; i++) {
    const s = i * abstand;
    const x1 = x + Math.min(s, breite);
    const y1 = y + Math.max(s - breite, 0);
    const x2 = x + Math.max(s - hoehe, 0);
    const y2 = y + Math.min(s, hoehe);
    if (x1 === x2 && y1 === y2) continue;
    striche.push(
      <line key={`${schluessel}-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} pathLength="1" />
    );
  }
  return <g strokeWidth="0.5">{striche}</g>;
}

/* Fensterraster: die Wiederholung macht ein Gebäude zum Gebäude. */
function Fenster({ x, y, spalten, zeilen, b = 14, h = 18, luecke = 10, schluessel }) {
  const raus = [];
  for (let s = 0; s < spalten; s++) {
    for (let z = 0; z < zeilen; z++) {
      raus.push(
        <rect
          key={`${schluessel}-${s}-${z}`}
          x={x + s * (b + luecke)}
          y={y + z * (h + luecke)}
          width={b}
          height={h}
          pathLength="1"
        />
      );
    }
  }
  return <>{raus}</>;
}

/* Die Dachlandschaft im Hintergrund — in jeder Zeichnung dieselbe Stadt. */
function Horizont({ schluessel }) {
  return (
    <g data-linie="1" strokeWidth="0.7" opacity="0.4">
      <path d="M0 214h400" pathLength="1" />
      <path d="M8 214v-34l22-17 22 17v34" pathLength="1" />
      <path d="M58 214v-46h30v46" pathLength="1" />
      <path d="M94 214v-28l16-13 16 13v28" pathLength="1" />
      <path d="M296 214v-40h26v40" pathLength="1" />
      <path d="M328 214v-52l18-14 18 14v52" pathLength="1" />
      <path d="M370 214v-30h24v30" pathLength="1" />
      <path d="M66 168h14M102 190h8M336 162h20M378 190h8" pathLength="1" />
      <path d={`M${schluessel === "weit" ? 130 : 150} 214v-22h18v22`} pathLength="1" />
    </g>
  );
}

export default function Motiv({ art }) {
  const w = (...n) => n.includes(art);

  /* --- Bewertung: ein Haus im Aufriss, vermaßt ------------------------- */
  if (w("bewertung", "/immobilienbewertung"))
    return (
      <svg {...SVG}>
        <Horizont schluessel="nah" />
        <g data-linie="2" strokeWidth="1.2">
          <path d="M20 262h360" strokeWidth="1.5" pathLength="1" />
          <path d="M96 262V150l70-52 70 52v112" pathLength="1" />
          <path d="M84 158l82-61 82 61" pathLength="1" />
          <path d="M150 262v-48h32v48" pathLength="1" />
          <path d="M158 236h4" pathLength="1" />
          <Fenster x={112} y={176} spalten={2} zeilen={1} b={18} h={22} luecke={68} schluessel="bew-a" />
          <path d="M156 128h20v18h-20z" pathLength="1" />
          <path d="M262 262V168h84v94" pathLength="1" />
          <Fenster x={276} y={182} spalten={2} zeilen={3} b={14} h={16} luecke={26} schluessel="bew-b" />
        </g>
        <g data-linie="3" strokeWidth="0.9" opacity="0.85">
          {/* Maßlinie: der Wert entsteht aus Gemessenem. */}
          <path d="M96 282h140" pathLength="1" />
          <path d="M96 276v12M236 276v12" pathLength="1" />
          <path d="M92 150h-24M92 262h-24" pathLength="1" />
          <path d="M74 150v112" pathLength="1" />
          <path d="M70 156l4-6 4 6M70 256l4 6 4-6" pathLength="1" />
          <Schraffur x={166} y={152} breite={66} hoehe={52} abstand={9} schluessel="bew-dach" />
          <Schraffur x={262} y={168} breite={26} hoehe={94} abstand={11} schluessel="bew-hoch" />
        </g>
      </svg>
    );

  /* --- Verkauf: Haus mit Schild, Weg zum Notartermin ------------------- */
  if (w("verkauf", "/immobilienverkauf"))
    return (
      <svg {...SVG}>
        <Horizont schluessel="weit" />
        <g data-linie="2" strokeWidth="1.2">
          <path d="M20 262h360" strokeWidth="1.5" pathLength="1" />
          <path d="M60 262V152l74-56 74 56v110" pathLength="1" />
          <path d="M48 160l86-65 86 65" pathLength="1" />
          <path d="M116 262v-52h36v52" pathLength="1" />
          <Fenster x={78} y={180} spalten={2} zeilen={1} b={20} h={24} luecke={72} schluessel="vk-a" />
          <path d="M124 126h20v20h-20z" pathLength="1" />
          <path d="M276 262V190h96v72" pathLength="1" />
          <path d="M276 190h96" pathLength="1" />
          <path d="M292 208h64M292 224h44M292 240h52" pathLength="1" />
          <path d="M324 190v-34" pathLength="1" />
        </g>
        <g data-linie="3" strokeWidth="0.9" opacity="0.85">
          <path d="M134 78v-14" pathLength="1" />
          <path d="M126 70l8-8 8 8" pathLength="1" />
          <Schraffur x={134} y={154} breite={72} hoehe={50} abstand={9} schluessel="vk-dach" />
          <path d="M228 262v-16h34v16" pathLength="1" />
          <path d="M222 246l23-14 23 14" pathLength="1" />
        </g>
      </svg>
    );

  /* --- Vermietung: Mehrfamilienhaus, viele Parteien -------------------- */
  if (w("vermietung", "/immobilienvermietung"))
    return (
      <svg {...SVG}>
        <Horizont schluessel="nah" />
        <g data-linie="2" strokeWidth="1.2">
          <path d="M20 262h360" strokeWidth="1.5" pathLength="1" />
          <path d="M64 262V134h132v128" pathLength="1" />
          <path d="M56 134h148" pathLength="1" />
          <Fenster x={80} y={152} spalten={3} zeilen={3} b={20} h={22} luecke={16} schluessel="vm-a" />
          <path d="M112 262v-38h36v38" pathLength="1" />
          <path d="M138 244h4" pathLength="1" />
          <path d="M224 262V176h104v86" pathLength="1" />
          <path d="M216 176h120" pathLength="1" />
          <Fenster x={240} y={192} spalten={3} zeilen={2} b={16} h={18} luecke={14} schluessel="vm-b" />
        </g>
        <g data-linie="3" strokeWidth="0.9" opacity="0.85">
          {/* Je Geschoss eine Klingel — das Haus hat Parteien, nicht Wände. */}
          <path d="M206 150h10M206 166h10M206 182h10M206 198h10" pathLength="1" />
          <Schraffur x={64} y={134} breite={28} hoehe={128} abstand={12} schluessel="vm-l" />
          <Schraffur x={224} y={176} breite={22} hoehe={86} abstand={12} schluessel="vm-r" />
          <path d="M348 262v-30h26v30" pathLength="1" />
          <path d="M342 232l19-13 19 13" pathLength="1" />
        </g>
      </svg>
    );

  /* --- Mediation: zwei Seiten, ein Haus dazwischen --------------------- */
  if (w("mediation", "/immobilienmediation"))
    return (
      <svg {...SVG}>
        <Horizont schluessel="weit" />
        <g data-linie="2" strokeWidth="1.2">
          <path d="M20 262h360" strokeWidth="1.5" pathLength="1" />
          <path d="M148 262V148l52-40 52 40v114" pathLength="1" />
          <path d="M138 156l62-48 62 48" pathLength="1" />
          <path d="M186 262v-44h28v44" pathLength="1" />
          <Fenster x={162} y={172} spalten={2} zeilen={1} b={16} h={18} luecke={46} schluessel="med-a" />
          {/* Zwei Parteien, gleich groß gezeichnet. */}
          <circle cx="68" cy="196" r="14" pathLength="1" />
          <path d="M50 262v-32a18 18 0 0 1 36 0v32" pathLength="1" />
          <circle cx="332" cy="196" r="14" pathLength="1" />
          <path d="M314 262v-32a18 18 0 0 1 36 0v32" pathLength="1" />
        </g>
        <g data-linie="3" strokeWidth="0.9" opacity="0.85">
          <path d="M100 206h30M270 206h30" pathLength="1" />
          <path d="M124 200l6 6-6 6M276 200l-6 6 6 6" pathLength="1" />
          <Schraffur x={200} y={150} breite={50} hoehe={50} abstand={9} schluessel="med-dach" />
        </g>
      </svg>
    );

  /* --- Betreuungsverfahren: das Haus unter Aufsicht des Gerichts ------- */
  if (w("betreuung", "/betreuungsverfahren"))
    return (
      <svg {...SVG}>
        <Horizont schluessel="nah" />
        <g data-linie="2" strokeWidth="1.2">
          <path d="M20 262h360" strokeWidth="1.5" pathLength="1" />
          <path d="M56 262V158l58-44 58 44v104" pathLength="1" />
          <path d="M46 166l68-52 68 52" pathLength="1" />
          <path d="M96 262v-40h30v40" pathLength="1" />
          <Fenster x={72} y={180} spalten={2} zeilen={1} b={16} h={18} luecke={48} schluessel="bt-a" />
          {/* Ein Giebel auf Säulen: das Gericht steht daneben, nicht darüber. */}
          <path d="M224 262V178h136v84" pathLength="1" />
          <path d="M214 178l78-40 78 40" pathLength="1" />
          <path d="M248 262v-84M292 262v-84M336 262v-84" pathLength="1" />
          <path d="M224 250h136" pathLength="1" />
        </g>
        <g data-linie="3" strokeWidth="0.9" opacity="0.85">
          <path d="M292 138v-16" pathLength="1" />
          <path d="M270 122h44" pathLength="1" />
          <path d="M270 122l-8 18h16zM314 122l-8 18h16z" pathLength="1" />
          <Schraffur x={114} y={160} breite={58} hoehe={50} abstand={9} schluessel="bt-dach" />
          <path d="M182 230h34" pathLength="1" />
          <path d="M208 224l8 6-8 6" pathLength="1" />
        </g>
      </svg>
    );

  /* --- Beratung: ein Tisch, zwei Stühle, Pläne ------------------------- */
  if (w("beratung", "/beratung"))
    return (
      <svg {...SVG}>
        <Horizont schluessel="weit" />
        <g data-linie="2" strokeWidth="1.2">
          <path d="M20 262h360" strokeWidth="1.5" pathLength="1" />
          <path d="M96 206h208" pathLength="1" />
          <path d="M112 206v56M288 206v56" pathLength="1" />
          <path d="M120 206v-8h160v8" pathLength="1" />
          {/* Der Plan auf dem Tisch. */}
          <path d="M150 198h100" pathLength="1" />
          <path d="M162 190h76M162 182h52" pathLength="1" />
          <circle cx="66" cy="168" r="13" pathLength="1" />
          <path d="M48 226v-24a18 18 0 0 1 36 0v24" pathLength="1" />
          <circle cx="334" cy="168" r="13" pathLength="1" />
          <path d="M316 226v-24a18 18 0 0 1 36 0v24" pathLength="1" />
        </g>
        <g data-linie="3" strokeWidth="0.9" opacity="0.85">
          <path d="M188 172v-34l24-18 24 18v34" pathLength="1" />
          <path d="M180 142l32-24 32 24" pathLength="1" />
          <Schraffur x={96} y={206} breite={208} hoehe={10} abstand={10} schluessel="ber-tisch" />
          <path d="M60 246h12M328 246h12" pathLength="1" />
        </g>
      </svg>
    );

  /* --- Raum und Gestaltung: der Schnitt, nicht die Fassade ------------- */
  if (w("raum", "/innenarchitektur"))
    return (
      <svg {...SVG}>
        <Horizont schluessel="nah" />
        <g data-linie="2" strokeWidth="1.2">
          <path d="M20 262h360" strokeWidth="1.5" pathLength="1" />
          <path d="M70 262V126h260v136" pathLength="1" />
          <path d="M60 134l140-46 140 46" pathLength="1" />
          <path d="M70 196h260" pathLength="1" />
          <path d="M196 196v66M196 126v70" pathLength="1" />
          {/* Möbel im Schnitt: erst dadurch wird ein Kasten ein Raum. */}
          <path d="M92 262v-26h64v26" pathLength="1" />
          <path d="M92 244h64" pathLength="1" />
          <path d="M232 262v-38h52v38" pathLength="1" />
          <path d="M240 224v-12h36v12" pathLength="1" />
          <path d="M96 196v-34h48v34" pathLength="1" />
        </g>
        <g data-linie="3" strokeWidth="0.9" opacity="0.85">
          {/* Licht von oben links — dieselbe Quelle wie im Rest der Seite. */}
          <path d="M256 126v34" pathLength="1" />
          <circle cx="256" cy="166" r="9" pathLength="1" />
          <path d="M244 178l24 18M268 178l-24 18" strokeWidth="0.6" pathLength="1" />
          <Schraffur x={196} y={196} breite={88} hoehe={20} abstand={9} schluessel="ra-boden" />
          <Schraffur x={200} y={88} breite={64} hoehe={40} abstand={10} schluessel="ra-dach" />
          <path d="M304 262v-22h18v22" pathLength="1" />
        </g>
      </svg>
    );

  /* --- Rückfall: ein Haus, schlicht, aber nicht leer ------------------- */
  return (
    <svg {...SVG}>
      <Horizont schluessel="weit" />
      <g data-linie="2" strokeWidth="1.2">
        <path d="M20 262h360" strokeWidth="1.5" pathLength="1" />
        <path d="M128 262V150l72-54 72 54v112" pathLength="1" />
        <path d="M116 158l84-64 84 64" pathLength="1" />
        <path d="M182 262v-46h36v46" pathLength="1" />
        <Fenster x={146} y={176} spalten={2} zeilen={1} b={18} h={20} luecke={74} schluessel="fb-a" />
      </g>
      <g data-linie="3" strokeWidth="0.9" opacity="0.85">
        <Schraffur x={200} y={152} breite={70} hoehe={50} abstand={9} schluessel="fb-dach" />
      </g>
    </svg>
  );
}
