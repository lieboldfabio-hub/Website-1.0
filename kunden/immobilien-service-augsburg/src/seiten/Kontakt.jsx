import { useState } from "react";
import { Link } from "react-router-dom";
import { firma, leistungen } from "../daten/firma.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Seitenkopf from "../bausteine/Seitenkopf.jsx";
import { TelefonZeichen } from "../komponenten/Kopfzeile.jsx";

/*
  Das Formular sendet echt: ein POST an Netlify Forms.

  STOLPERFALLE: Netlify erkennt ein Formular nur im ausgelieferten HTML.
  React baut seins erst im Browser, deshalb liegt in `index.html` eine
  versteckte Zwillingsfassung mit denselben Feldnamen. Wird hier ein
  `name` geändert, muss es dort mitgeändert werden — sonst verschwinden
  Anfragen spurlos.
*/
export default function Kontakt() {
  useSeitenkopf("/kontakt");
  const [stand, setStand] = useState("bereit");

  async function absenden(e) {
    e.preventDefault();
    setStand("sendet");
    const daten = new FormData(e.currentTarget);
    try {
      const antwort = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(daten).toString(),
      });
      setStand(antwort.ok ? "gesendet" : "fehler");
    } catch {
      setStand("fehler");
    }
  }

  return (
    <>
      <Seitenkopf
        ueberzeile="Kontakt"
        titel="Reden wir, bevor Sie sich entscheiden."
        vorspann="Ein erstes Gespräch kostet nichts und verpflichtet zu nichts. Ich melde mich innerhalb eines Werktags."
      />

      <section className="abschnitt">
        <div className="mitte kontakt-raster">
          <div className="kontakt-angaben">
            <a className="anruf-feld" href={`tel:${firma.telefonLink}`}>
              <TelefonZeichen />
              <span>
                <small>Direkt anrufen</small>
                {firma.telefon}
              </span>
            </a>

            <dl className="angaben-liste">
              <div>
                <dt>Anschrift</dt>
                <dd>
                  <address>
                    {firma.name}<br />
                    {firma.anrede}<br />
                    {firma.strasse}<br />
                    {firma.plz} {firma.ort}
                  </address>
                </dd>
              </div>
              <div>
                <dt>E-Mail</dt>
                <dd className="offen">{firma.email.wert}</dd>
              </div>
              <div>
                <dt>Gebiet</dt>
                <dd>{firma.gebiet}</dd>
              </div>
            </dl>

            <p className="kontakt-hinweis">
              Sie wissen noch nicht genau, was Sie brauchen? Die{" "}
              <Link to="/leistungen">Leistungsübersicht</Link> hilft beim
              Einordnen — oder rufen Sie einfach an.
            </p>
          </div>

          {stand === "gesendet" ? (
            <div className="formular-erfolg" role="status">
              <h2>Danke, Ihre Anfrage ist angekommen.</h2>
              <p>
                Ich melde mich innerhalb eines Werktags bei Ihnen. Wenn es
                eilt, erreichen Sie mich direkt unter{" "}
                <a href={`tel:${firma.telefonLink}`}>{firma.telefon}</a>.
              </p>
              <Link className="knopf knopf-linie" to="/">Zur Startseite</Link>
            </div>
          ) : (
            <form
              className="formular"
              name="kontakt"
              method="POST"
              data-netlify="true"
              netlify-honeypot="firmenname"
              onSubmit={absenden}
            >
              <input type="hidden" name="form-name" value="kontakt" />
              <p className="honigtopf">
                <label htmlFor="firmenname">Bitte frei lassen</label>
                <input id="firmenname" name="firmenname" tabIndex={-1} autoComplete="off" />
              </p>

              <label htmlFor="f-name">
                Name
                <input id="f-name" name="name" type="text" required autoComplete="name" />
              </label>

              <div className="feld-paar">
                <label htmlFor="f-email">
                  E-Mail
                  <input id="f-email" name="email" type="email" required autoComplete="email" />
                </label>
                <label htmlFor="f-telefon">
                  Telefon <span className="freiwillig">(freiwillig)</span>
                  <input id="f-telefon" name="telefon" type="tel" autoComplete="tel" />
                </label>
              </div>

              <label htmlFor="f-anliegen">
                Anliegen
                <select id="f-anliegen" name="anliegen" defaultValue={leistungen[0].titel}>
                  {leistungen.map((l) => (
                    <option key={l.weg}>{l.titel}</option>
                  ))}
                  <option>Etwas anderes</option>
                </select>
              </label>

              <label htmlFor="f-nachricht">
                Nachricht
                <textarea id="f-nachricht" name="nachricht" rows={6} required />
              </label>

              <label className="zustimmung" htmlFor="f-datenschutz">
                <input id="f-datenschutz" type="checkbox" name="datenschutz" required />
                <span>
                  Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung
                  meiner Anfrage verwendet werden. Einzelheiten in der{" "}
                  <Link to="/datenschutz">Datenschutzerklärung</Link>.
                </span>
              </label>

              <button type="submit" className="knopf knopf-voll" disabled={stand === "sendet"}>
                {stand === "sendet" ? "Wird gesendet …" : "Anfrage senden"}
              </button>

              {stand === "fehler" && (
                <p className="formular-fehler" role="alert">
                  Die Anfrage konnte nicht gesendet werden. Bitte rufen Sie mich
                  an unter <a href={`tel:${firma.telefonLink}`}>{firma.telefon}</a>.
                </p>
              )}
              <p className="formular-fussnote offen">
                Versand aktiv, sobald die Seite bei Netlify liegt und eine
                Empfänger-Adresse hinterlegt ist.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
