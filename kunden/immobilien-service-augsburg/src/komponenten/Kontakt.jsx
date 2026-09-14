import { useState } from "react";
import { Link } from "react-router-dom";
import { firma } from "../daten/firma.js";

/*
  Kontaktformular über Netlify Forms — kein eigener Server, keine Wartung.

  STOLPERFALLE (aus dem Schwesterprojekt teuer gelernt): Netlify erkennt ein
  Formular nur, wenn es im ausgelieferten HTML steht. React baut es erst im
  Browser zusammen, deshalb liegt in `index.html` eine versteckte Zwillings-
  fassung mit denselben Feldnamen. Ändert man hier ein `name`, muss man es
  dort mitändern — sonst verschwinden Anfragen spurlos.
*/
const FELDER = ["name", "email", "telefon", "anliegen", "nachricht"];

export default function Kontakt() {
  const [status, setStatus] = useState("bereit");

  async function absenden(e) {
    e.preventDefault();
    setStatus("sendet");
    const daten = new FormData(e.target);
    try {
      const antwort = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(daten).toString(),
      });
      setStatus(antwort.ok ? "gesendet" : "fehler");
    } catch {
      setStatus("fehler");
    }
  }

  return (
    <section id="kontakt" className="abschnitt kontakt">
      <div className="kontakt-raster">
        <div className="kontakt-text">
          <p className="ueberzeile">Kontakt</p>
          <h2>Reden wir, bevor Sie sich entscheiden.</h2>
          <p>
            Ein erstes Gespräch kostet nichts und verpflichtet zu nichts. Sagen
            Sie mir, worum es geht — ich melde mich innerhalb eines Werktags.
          </p>

          <a className="kontakt-telefon" href={`tel:${firma.telefonLink}`}>
            <span aria-hidden="true">☏</span>
            <span>
              <small>Direkt anrufen</small>
              {firma.telefon}
            </span>
          </a>

          <dl className="kontakt-daten">
            <div>
              <dt>E-Mail</dt>
              <dd className="todo">{firma.email.wert}</dd>
            </div>
            <div>
              <dt>Anschrift</dt>
              <dd>
                <span className="todo">{firma.strasse.wert}</span>
                <br />
                <span className="todo">{firma.plz.wert}</span> {firma.ort}
              </dd>
            </div>
          </dl>
        </div>

        <form
          className="kontakt-formular"
          name="kontakt"
          method="POST"
          data-netlify="true"
          netlify-honeypot="firmenname"
          onSubmit={absenden}
        >
          <input type="hidden" name="form-name" value="kontakt" />
          {/* Honigtopf gegen Spam: für Menschen unsichtbar, Bots füllen ihn aus. */}
          <p className="honigtopf">
            <label>
              Bitte nicht ausfüllen <input name="firmenname" tabIndex={-1} />
            </label>
          </p>

          <label>
            Name
            <input name="name" type="text" required autoComplete="name" />
          </label>

          <div className="feld-paar">
            <label>
              E-Mail
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Telefon <span className="freiwillig">(freiwillig)</span>
              <input name="telefon" type="tel" autoComplete="tel" />
            </label>
          </div>

          <label>
            Anliegen
            <select name="anliegen" defaultValue="Immobilienbewertung">
              <option>Immobilienbewertung</option>
              <option>Immobilienverkauf</option>
              <option>Immobilienvermietung</option>
              <option>Immobilienmediation</option>
              <option>Betreuungsverfahren</option>
              <option>Immobilienberatung</option>
              <option>Etwas anderes</option>
            </select>
          </label>

          <label>
            Nachricht
            <textarea name="nachricht" rows={5} required />
          </label>

          <label className="zustimmung">
            <input type="checkbox" name="datenschutz" required />
            <span>
              Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung
              meiner Anfrage verwendet werden. Einzelheiten in der{" "}
              <Link to="/datenschutz">Datenschutzerklärung</Link>.
            </span>
          </label>

          <button
            type="submit"
            className="knopf knopf-akzent"
            disabled={status === "sendet"}
          >
            {status === "sendet" ? "Wird gesendet …" : "Anfrage senden"}
          </button>

          {status === "gesendet" && (
            <p className="formular-meldung ist-gut" role="status">
              Danke — Ihre Anfrage ist angekommen. Ich melde mich.
            </p>
          )}
          {status === "fehler" && (
            <p className="formular-meldung ist-schlecht" role="alert">
              Das hat nicht geklappt. Bitte rufen Sie mich an — {firma.telefon}
              — oder schreiben Sie mir direkt.
            </p>
          )}
          <p className="formular-hinweis todo">
            Versand erst aktiv, sobald die Seite bei Netlify liegt und eine
            Empfänger-Adresse hinterlegt ist.
          </p>
        </form>
      </div>
    </section>
  );
}
