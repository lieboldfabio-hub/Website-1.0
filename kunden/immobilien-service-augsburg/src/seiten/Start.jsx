import { Link } from "react-router-dom";
import {
  firma, vertrauen, lebenslagen, qualifikationen, region, hauptleistungen,
} from "../daten/firma.js";
import { stationen } from "../daten/ausstellung.js";
import { useSeitenkopf } from "../bausteine/useSeitenkopf.js";
import Einblenden from "../bausteine/Einblenden.jsx";
import Stimmen from "../komponenten/Stimmen.jsx";
import Bildflaeche from "../bausteine/Bildflaeche.jsx";
import Aufruf from "../bausteine/Aufruf.jsx";
import Kontaktband from "../bausteine/Kontaktband.jsx";
import Motiv from "../bausteine/Motiv.jsx";
import { TelefonZeichen } from "../komponenten/Kopfzeile.jsx";

/*
  Die Startseite erzählt in einer Reihenfolge, die sich beim Scrollen
  entwickelt: Ankommen, Vertrauen, Kompetenz, Leistungen, besondere
  Situationen, Persönlichkeit, Region, Ausstellung, Kontakt.

  Kein Abschnitt bringt einen eigenen Farbblock mit — der Hintergrund läuft
  unter allem durch, getrennt wird über Abstand, Haarlinien und leicht
  erhobene Flächen.
*/
export default function Start() {
  useSeitenkopf("/");

  return (
    <>
      <section className="einstieg">
        <div className="mitte einstieg-raster">
          <div className="einstieg-text">
            <p className="ueberzeile" data-eintritt>Immobilienmaklerin für {firma.gebiet}</p>
            <h1 data-eintritt="1">
              Immobilien in Augsburg mit Erfahrung, Marktkenntnis und{" "}
              <em>persönlicher Beratung.</em>
            </h1>
            <p className="vorspann" data-eintritt="2">
              Zertifizierte Immobilienmaklerin für Augsburg Stadt und Land mit
              mehr als {firma.erfahrungJahre} Jahren Berufserfahrung.
            </p>
            <div className="knopf-reihe" data-eintritt="3">
              <Link className="knopf knopf-voll" to="/immobilienbewertung">
                Immobilie bewerten lassen
              </Link>
              <Link className="knopf knopf-linie" to="/kontakt">
                Persönliche Beratung
              </Link>
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
        <ul className="mitte vertrauen-reihe" data-bewegung="staffel">
          {vertrauen.map((v) => (
            <Einblenden als="li" key={v.label}>
              <span className="vertrauen-zahl">{v.zahl}</span>
              <strong>{v.label}</strong>
              <p>{v.text}</p>
            </Einblenden>
          ))}
        </ul>
      </section>

      {/* Leistungen als Lesestrecke, nicht als Kartenreihe: eine Zeile je
          Leistung, mit Nummer, Aussage und Weg dorthin. */}
      <section className="abschnitt leistungsstrecke">
        <div className="mitte">
          <div className="abschnitt-kopf">
            <p className="ueberzeile">Leistungen</p>
            <h2>Wobei ich Sie begleite</h2>
            <p className="abschnitt-vorspann">
              Von der ersten Einschätzung bis zum Notartermin — und in den
              Fällen, in denen mehr nötig ist als eine Vermarktung.
            </p>
          </div>

          <ol className="strecke" data-bewegung="staffel">
            {hauptleistungen.map((l, i) => (
              <Einblenden als="li" key={l.weg} style={{ "--ton": l.ton }}>
                <Link to={l.weg}>
                  <span className="strecke-nr">{String(i + 1).padStart(2, "0")}</span>
                  <span className="strecke-inhalt">
                    <h3>{l.titel}</h3>
                    <p className="strecke-kurz">{l.kurz}</p>
                    <p className="strecke-text">{l.anriss}</p>
                  </span>
                  <span className="strecke-pfeil" aria-hidden="true">→</span>
                </Link>
              </Einblenden>
            ))}
          </ol>

          <p className="strecke-fuss">
            Dazu Wohnflächenberechnung, Grundrisse, Energieausweis, Unterlagen
            und Innenarchitektur — alles in der{" "}
            <Link to="/leistungen">Leistungsübersicht</Link>.
          </p>
        </div>
      </section>

      <Kontaktband />

      {/* Teaser: die Ausstellung selbst liegt auf ihrer eigenen Seite. */}
      <section className="abschnitt teaser">
        <div className="mitte teaser-raster">
          <Einblenden className="teaser-text">
            <p className="ueberzeile">Die Ausstellung</p>
            <h2>Immobilien neu betrachtet.</h2>
            <p>
              Ein Rundgang durch die Immobilienarten, die in Augsburg zu mir
              kommen — vom Einfamilienhaus bis zum geerbten Haus. Sieben
              Stationen, und das Scrollen dreht Sie daran vorbei.
            </p>
            <Link className="knopf knopf-voll" to="/ausstellung">Zur Ausstellung</Link>
          </Einblenden>

          <div className="teaser-vorschau" aria-hidden="true">
            {stationen.slice(0, 3).map((s, i) => (
              <span
                className="teaser-blatt"
                key={s.nummer}
                data-bewegung="tiefe"
                style={{ "--i": i, "--tiefe": `${5 + i * 4}%` }}
              >
                <Motiv art={s.motiv} />
                <small>{s.nummer} — {s.kategorie}</small>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="abschnitt lagen">
        <div className="mitte">
          <div className="abschnitt-kopf">
            <p className="ueberzeile">Besondere Situationen</p>
            <h2>Wenn eine Immobilie zur Herausforderung wird</h2>
            <p className="abschnitt-vorspann">
              Manche Immobilien werden nicht verkauft, weil jemand umziehen
              möchte, sondern weil eine Lebenslage es verlangt. Dann entscheidet
              die Gesprächsführung über das Ergebnis, nicht das Exposé.
            </p>
          </div>

          <ul className="lagen-raster" data-bewegung="staffel">
            {lebenslagen.map((l) => (
              <Einblenden als="li" key={l.titel}>
                <h3>{l.titel}</h3>
                <p>{l.text}</p>
                <Link className="mehr-zeichen" to={l.weg}>{l.aufruf}</Link>
              </Einblenden>
            ))}
          </ul>
        </div>
      </section>

      <section className="abschnitt kurz-ueber">
        <div className="mitte kurz-ueber-raster">
          <Einblenden className="kurz-ueber-text">
            <p className="ueberzeile">Über mich</p>
            <h2>Ich kenne die Straßen, nicht nur die Postleitzahlen.</h2>
            <p>
              Über {firma.erfahrungJahre} Jahre Immobilien in Augsburg Stadt und
              Land. In dieser Zeit habe ich gelernt, dass hinter jedem Objekt
              eine Entscheidung steht, die jemandem schwerfällt — ein Umzug, ein
              Erbe, eine Trennung, ein Anfang.
            </p>
            <p>
              Meine Arbeit beginnt deshalb mit Zuhören und nicht mit einem
              Preisvorschlag. Was ich einschätze, erkläre ich so, dass Sie es
              nachvollziehen können — und was ich nicht weiß, sage ich auch.
            </p>
            <Link className="knopf knopf-linie" to="/ueber-mich">Mehr über mich</Link>
          </Einblenden>

          <ul className="qualifikations-liste" data-bewegung="staffel">
            {qualifikationen.map((q) => (
              <li key={q.titel}>
                <strong>{q.titel}</strong>
                <span>{q.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="abschnitt region-kurz">
        <div className="mitte">
          <div className="abschnitt-kopf">
            <p className="ueberzeile">Einsatzgebiet</p>
            <h2>Augsburg Stadt und Land</h2>
            <p className="abschnitt-vorspann">
              Regionale Marktkenntnis heißt: wissen, warum zwei gleich große
              Wohnungen in zwei Stadtteilen unterschiedlich viel wert sind.
            </p>
          </div>
          <div className="ort-wolke" data-bewegung="staffel">
            {region.flatMap((g) => g.orte.slice(0, 5)).map((o) => (
              <span key={o}>{o}</span>
            ))}
            <Link to="/region" className="ort-mehr">alle Orte ansehen</Link>
          </div>
        </div>
      </section>

      <Stimmen />

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
