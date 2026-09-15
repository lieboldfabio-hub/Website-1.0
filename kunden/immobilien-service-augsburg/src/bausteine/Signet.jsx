/*
  Haus mit Zweig — nachgezeichnet nach dem Signet der bestehenden Seite.
  Das Originallogo ersetzt dies, sobald die Datei vorliegt.
*/
export default function Signet({ groesse = 30 }) {
  return (
    <svg
      viewBox="0 0 40 34"
      width={groesse}
      height={(groesse * 34) / 40}
      className="signet"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 17.5 20 6l14 11.5" />
      <path d="M9.5 16v13h21V16" />
      <rect x="17" y="19.5" width="6" height="6" />
      <path d="M3 31c5.5-3.5 11-3.5 17-1.5s11.5 2 17-1.5" />
      <path d="M25.5 7.5c2-2.5 4.5-3 6.5-2.5-.5 2.5-2.5 4-4.5 4" />
    </svg>
  );
}
