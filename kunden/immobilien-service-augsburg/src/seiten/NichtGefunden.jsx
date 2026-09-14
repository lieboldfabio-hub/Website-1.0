import { Link } from "react-router-dom";

export default function NichtGefunden() {
  return (
    <section className="abschnitt schmal">
      <p className="ueberzeile">Fehler 404</p>
      <h1>Diese Seite gibt es nicht.</h1>
      <p>
        Möglicherweise hat sich die Adresse geändert. Von der{" "}
        <Link to="/">Startseite</Link> aus finden Sie alles Weitere.
      </p>
    </section>
  );
}
