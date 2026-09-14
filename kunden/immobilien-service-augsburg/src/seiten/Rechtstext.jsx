import { firma } from "../daten/firma.js";

/*
  Impressum und Datenschutz.

  Bewusst als Gerüst mit sichtbar markierten Lücken, nicht als fertiger Text:
  Ein Impressum mit erfundenen Angaben ist abmahnfähig, und ein aus dem Netz
  kopierter Datenschutztext passt nie zu den tatsächlich eingesetzten
  Diensten. Beides muss vor dem Livegang geprüft werden — im Zweifel
  anwaltlich, weil §34c GewO und die DSGVO hier zusammenkommen.
*/
function Lücke({ children }) {
  return <span className="todo">{children}</span>;
}

export default function Rechtstext({ art }) {
  if (art === "impressum") {
    return (
      <section className="abschnitt schmal rechtstext">
        <h1>Impressum</h1>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          {firma.name}
          <br />
          {firma.inhaberin}
          <br />
          <Lücke>{firma.strasse.wert}</Lücke>
          <br />
          <Lücke>{firma.plz.wert}</Lücke> {firma.ort}
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: {firma.telefon}
          <br />
          E-Mail: <Lücke>{firma.email.wert}</Lücke>
        </p>

        <h2>Umsatzsteuer-Identifikationsnummer</h2>
        <p>
          <Lücke>{firma.ustIdNr.wert}</Lücke>
        </p>

        <h2>Erlaubnis nach § 34c Gewerbeordnung</h2>
        <p>
          Erteilt durch: <Lücke>{firma.aufsichtsbehoerde.wert}</Lücke>
        </p>

        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          <Lücke>
            Angeben, ob die Teilnahme an einem Streitbeilegungsverfahren vor
            einer Verbraucherschlichtungsstelle erfolgt — Pflichtangabe.
          </Lücke>
        </p>
      </section>
    );
  }

  return (
    <section className="abschnitt schmal rechtstext">
      <h1>Datenschutzerklärung</h1>

      <p className="todo">
        Gerüst. Der Text muss die tatsächlich eingesetzten Dienste benennen —
        derzeit: Hosting bei Netlify (USA, Auftragsverarbeitung und
        Standardvertragsklauseln prüfen) und das Kontaktformular über Netlify
        Forms. Kommen Karten, Analyse oder Schriftarten von fremden Servern
        dazu, gehören sie hier ebenfalls hinein.
      </p>

      <h2>Verantwortlich</h2>
      <p>
        {firma.name}, {firma.inhaberin}, <Lücke>{firma.strasse.wert}</Lücke>,{" "}
        <Lücke>{firma.plz.wert}</Lücke> {firma.ort}
        <br />
        <Lücke>{firma.email.wert}</Lücke>
      </p>

      <h2>Aufruf dieser Website</h2>
      <p>
        Beim Aufruf werden Server-Logdaten verarbeitet (IP-Adresse, Zeitpunkt,
        abgerufene Seite, Browser). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
        DSGVO — der Betrieb und die Sicherheit der Seite.
      </p>

      <h2>Kontaktformular</h2>
      <p>
        Die von Ihnen eingegebenen Daten verarbeiten wir, um Ihre Anfrage zu
        beantworten (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Wir löschen sie,
        sobald sie nicht mehr benötigt werden und keine gesetzlichen
        Aufbewahrungsfristen entgegenstehen.
      </p>

      <h2>Schriftarten</h2>
      <p>
        Es werden ausschließlich Schriftarten verwendet, die auf Ihrem Gerät
        vorhanden sind. Es besteht keine Verbindung zu Servern Dritter.
      </p>

      <h2>Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
        der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht,
        sich bei einer Aufsichtsbehörde zu beschweren.
      </p>
    </section>
  );
}
