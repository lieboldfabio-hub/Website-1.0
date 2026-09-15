import { firma } from "../daten/firma.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Seitenkopf from "../bausteine/Seitenkopf.jsx";

/*
  Impressum, Datenschutz und Barrierefreiheit.

  Die Angaben, die vorliegen, stehen vollständig drin. Was fehlt, ist
  sichtbar markiert statt erfunden: Ein Impressum mit falschen Angaben ist
  abmahnfähig, und bei einer Maklerin kommen §34c GewO und die DSGVO
  zusammen. Vor dem Livegang prüfen lassen.
*/
function Offen({ children }) {
  return <span className="offen">{children}</span>;
}

export default function Recht({ art }) {
  useSeitenkopf(`/${art}`);

  if (art === "impressum") {
    return (
      <>
        <Seitenkopf ueberzeile="Rechtliches" titel="Impressum" />
        <section className="abschnitt">
          <div className="mitte fliesstext">
            <h2>Angaben gemäß § 5 DDG</h2>
            <p>
              {firma.name}<br />
              {firma.anrede}<br />
              {firma.strasse}<br />
              {firma.plz} {firma.ort}
            </p>

            <h2>Kontakt</h2>
            <p>
              Telefon: {firma.telefon}<br />
              E-Mail: <Offen>{firma.email.wert}</Offen>
            </p>

            <h2>Umsatzsteuer-Identifikationsnummer</h2>
            <p><Offen>USt-IdNr. eintragen, falls vorhanden</Offen></p>

            <h2>Erlaubnis nach § 34c Gewerbeordnung</h2>
            <p>Erteilt durch: <Offen>zuständige Behörde eintragen</Offen></p>

            <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>
              Immobilienmaklerin (Bundesrepublik Deutschland). Es gelten die
              Gewerbeordnung (§ 34c GewO) und die Makler- und Bauträgerverordnung
              (MaBV), einsehbar unter{" "}
              <a href="https://www.gesetze-im-internet.de" target="_blank" rel="noreferrer noopener">
                gesetze-im-internet.de
              </a>.
            </p>

            <h2>Verbraucherstreitbeilegung</h2>
            <p>
              <Offen>
                Angeben, ob an einem Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilgenommen wird — Pflichtangabe.
              </Offen>
            </p>

            <h2>Haftung für Inhalte und Links</h2>
            <p>
              Für eigene Inhalte auf diesen Seiten wird nach den allgemeinen
              Gesetzen die Verantwortung getragen. Für Inhalte verlinkter
              externer Seiten ist stets deren Anbieter verantwortlich; zum
              Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.
            </p>
          </div>
        </section>
      </>
    );
  }

  if (art === "barrierefreiheit") {
    return (
      <>
        <Seitenkopf
          ueberzeile="Rechtliches"
          titel="Barrierefreiheit"
          vorspann="Was diese Website tut, damit sie für möglichst viele Menschen bedienbar ist — und wo sie noch nicht so weit ist."
        />
        <section className="abschnitt">
          <div className="mitte fliesstext">
            <h2>Was umgesetzt ist</h2>
            <ul>
              <li>Alle Texte erreichen mindestens 4,5:1 Kontrast zum Hintergrund.</li>
              <li>Die gesamte Seite ist mit der Tastatur bedienbar, der Fokus ist sichtbar.</li>
              <li>Ein Sprunglink führt direkt zum Inhalt.</li>
              <li>Bewegung wird abgeschaltet, sobald das Betriebssystem sie reduziert.</li>
              <li>Inhalte sind ohne Scrollen sichtbar, nichts wartet auf eine Animation.</li>
              <li>Überschriften folgen einer Rangfolge, Formularfelder haben Beschriftungen.</li>
              <li>Die Schriftgröße lässt sich im Browser vergrößern, ohne dass Text abgeschnitten wird.</li>
            </ul>

            <h2>Was noch offen ist</h2>
            <p className="offen">
              Diese Erklärung ist noch keine förmliche Erklärung zur
              Barrierefreiheit nach BFSG. Sie wird ergänzt, sobald eine
              vollständige Prüfung vorliegt — insbesondere zu Bildbeschreibungen,
              sobald echte Fotos eingesetzt sind.
            </p>

            <h2>Rückmeldung</h2>
            <p>
              Fällt Ihnen eine Hürde auf, sagen Sie es bitte: telefonisch unter{" "}
              {firma.telefon} oder über das <a href="/kontakt">Kontaktformular</a>.
              Rückmeldungen dazu werden bevorzugt bearbeitet.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seitenkopf ueberzeile="Rechtliches" titel="Datenschutzerklärung" />
      <section className="abschnitt">
        <div className="mitte fliesstext">
          <p className="offen">
            Gerüst. Der Text muss die tatsächlich eingesetzten Dienste benennen —
            derzeit vorgesehen: Hosting bei Netlify (Auftragsverarbeitung und
            Standardvertragsklauseln prüfen) und das Kontaktformular über Netlify
            Forms. Kommen Karten, Analyse oder Schriften von fremden Servern
            hinzu, gehören sie ebenfalls hierher.
          </p>

          <h2>Verantwortlich</h2>
          <p>
            {firma.name}, {firma.anrede}, {firma.strasse}, {firma.plz} {firma.ort}
            <br />
            Telefon: {firma.telefon}
            <br />
            E-Mail: <Offen>{firma.email.wert}</Offen>
          </p>

          <h2>Aufruf dieser Website</h2>
          <p>
            Beim Aufruf werden Server-Logdaten verarbeitet: IP-Adresse,
            Zeitpunkt, abgerufene Seite und Browser. Rechtsgrundlage ist
            Art. 6 Abs. 1 lit. f DSGVO — Betrieb und Sicherheit der Seite.
          </p>

          <h2>Kontaktformular</h2>
          <p>
            Ihre Angaben werden ausschließlich zur Bearbeitung Ihrer Anfrage
            verarbeitet (Art. 6 Abs. 1 lit. b bzw. f DSGVO) und gelöscht,
            sobald sie nicht mehr benötigt werden und keine gesetzlichen
            Aufbewahrungsfristen entgegenstehen.
          </p>

          <h2>Schriftarten</h2>
          <p>
            Die Schriften werden von dieser Website selbst ausgeliefert. Es
            besteht keine Verbindung zu Servern Dritter, es werden keine Daten
            an Schriftanbieter übertragen.
          </p>

          <h2>Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit und
            Widerspruch sowie das Recht, sich bei einer Aufsichtsbehörde zu
            beschweren.
          </p>
        </div>
      </section>
    </>
  );
}
