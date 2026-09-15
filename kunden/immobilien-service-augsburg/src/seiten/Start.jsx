import { Link } from "react-router-dom";
import { firma, vertrauen, lebenslagen, qualifikationen, region, stimmen } from "../daten/firma.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Einblenden from "../bausteine/Einblenden.jsx";
import Bildflaeche from "../bausteine/Bildflaeche.jsx";
import Aufruf from "../bausteine/Aufruf.jsx";
import Kontaktband from "../bausteine/Kontaktband.jsx";
import Schaufenster from "../komponenten/Schaufenster.jsx";
import { TelefonZeichen } from "../komponenten/Kopfzeile.jsx";

export default function Start() {
  useSeitenkopf("/");

  return (
    <>
      <section className="einstieg">
        <div className="mitte einstieg-raster">
          <div className="einstieg-text">
            <p className="ueberzeile">Immobilienmaklerin für {firma.gebiet}</p>
            <h1>
              Ein Zuhause wechselt
              <em> nicht nebenbei</em> den Besitzer.
            </h1>
            <p className="vorspann">
              Seit über {firma.erfahrungJahre} Jahren begleite ich Eigentümer in
              Augsburg und Umgebung durch Bewertung, Verkauf und Vermietung —
              und durch die Fälle, in denen mehrere Parteien entscheiden müssen.
            </p>
            <div className="knopf-reihe">
              <Link className="knopf knopf-voll" to="/kontakt">Beratung vereinbaren</Link>
              <Link className="knopf knopf-linie" to="/immobilienbewertung">Immobilie bewerten lassen</Link>
            </div>
            <a className="einstieg-anruf" href={`tel:${firma.telefonLink}`}>
              <TelefonZeichen /> Direkt anrufen: {firma.telefon}
            </a>
          </div>

          <figure className="einstieg-portraet">
            <Bildflaeche
              src="/marion-sens.jpg"
              alt={`${firma.anrede}, ${firma.rolle}`}
              breite="720" hoehe="900"
              fetchPriority="high"
              fehltText="Porträtfoto fehlt"
            />
            <figcaption>
              <strong>{firma.anrede}</strong>
              <span>{firma.rolle}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="vertrauen" aria-label="Auf einen Blick">
        <ul className="mitte vertrauen-reihe">
          {vertrauen.map((v, i) => (
            <Einblenden als="li" key={v.label} verzug={i * 70}>
              <span className="vertrauen-zahl">{v.zahl}</span>
              <strong>{v.label}</strong>
              <p>{v.text}</p>
            </Einblenden>
          ))}
        </ul>
      </section>

      <Kontaktband />

      <Schaufenster />

      <section className="lagen">
        <div className="mitte">
          <div className="abschnitt-kopf">
            <p className="ueberzeile">Besondere Situationen</p>
            <h2>Wenn es nicht nur um den Preis geht</h2>
            <p className="abschnitt-vorspann">
              Manche Immobilien werden nicht verkauft, weil jemand umziehen
              möchte, sondern weil eine Lebenslage es verlangt. Dann entscheidet
              die Gesprächsführung über das Ergebnis, nicht das Exposé.
            </p>
          </div>
          <ul className="lagen-raster">
            {lebenslagen.map((l, i) => (
              <Einblenden als="li" key={l.titel} verzug={i * 60}>
                <h3>{l.titel}</h3>
                <p>{l.text}</p>
              </Einblenden>
            ))}
          </ul>
          <p className="lagen-fuss">
            Mehr dazu unter <Link to="/immobilienmediation">Immobilienmediation</Link>.
          </p>
        </div>
      </section>

      <Kontaktband text="Immobilie bewerten lassen" weg="/immobilienbewertung" />

      <section className="kurz-ueber">
        <div className="mitte kurz-ueber-raster">
          <Einblenden className="kurz-ueber-text">
            <p className="ueberzeile">Über mich</p>
            <h2>Ich kenne die Straßen, nicht nur die Postleitzahlen.</h2>
            <p>
              Über {firma.erfahrungJahre} Jahre Immobilien in Augsburg Stadt und
              Land. In dieser Zeit habe ich gelernt, dass hinter jedem Objekt eine
              Entscheidung steht, die jemandem schwerfällt — ein Umzug, ein Erbe,
              eine Trennung, ein Anfang.
            </p>
            <Link className="knopf knopf-linie" to="/ueber-uns">Mehr über mich</Link>
          </Einblenden>

          <Einblenden als="ul" className="qualifikations-liste" verzug={80}>
            {qualifikationen.map((q) => (
              <li key={q.titel}>
                <strong>{q.titel}</strong>
                <span>{q.text}</span>
              </li>
            ))}
          </Einblenden>
        </div>
      </section>

      <section className="region-kurz">
        <div className="mitte">
          <div className="abschnitt-kopf">
            <p className="ueberzeile">Einsatzgebiet</p>
            <h2>Augsburg Stadt und Land</h2>
          </div>
          <Einblenden as="div" className="ort-wolke">
            {[...region.stadt.slice(0, 8), ...region.umland.slice(0, 5)].map((o) => (
              <span key={o}>{o}</span>
            ))}
            <Link to="/region" className="ort-mehr">alle Orte ansehen</Link>
          </Einblenden>
        </div>
      </section>

      {stimmen.length > 0 && (
        <section className="stimmen">
          <div className="mitte">
            <div className="abschnitt-kopf">
              <p className="ueberzeile">Rückmeldungen</p>
              <h2>Was Auftraggeber sagen</h2>
            </div>
            <ul className="stimmen-liste">
              {stimmen.map((s, i) => (
                <Einblenden als="li" key={s.quelle} verzug={i * 70}>
                  <blockquote>
                    <p>{s.text}</p>
                    <footer>{s.quelle}</footer>
                  </blockquote>
                </Einblenden>
              ))}
            </ul>
            <p className="stimmen-hinweis offen">
              Weitere Google-Rezensionen der bestehenden Seite ergänzen, sobald
              sie im Wortlaut vorliegen — erfundene Bewertungen kommen hier nicht hinein.
            </p>
          </div>
        </section>
      )}

      <Aufruf
        ueberzeile="Verkaufen oder vermieten?"
        titel="Erfahren Sie zuerst, was Ihre Immobilie wert ist."
        text="Eine belastbare Einschätzung kostet ein Gespräch und einen Ortstermin — und ist die Grundlage für jede weitere Entscheidung."
        knopf="Immobilie bewerten lassen"
        weg="/immobilienbewertung"
        ton="dunkel"
      />
    </>
  );
}
