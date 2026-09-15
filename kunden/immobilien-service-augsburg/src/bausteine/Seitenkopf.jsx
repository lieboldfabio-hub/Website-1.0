import { Link, useLocation } from "react-router-dom";
import { metaFuer } from "../seiten-meta.js";

/*
  Der Kopf jeder Unterseite: Brotkrumen, Überzeile, H1, Vorspann.
  Die Brotkrumen kommen aus dem Seitenregister — sie können deshalb nie
  auf eine Adresse zeigen, die es nicht gibt.
*/
export default function Seitenkopf({ ueberzeile, titel, vorspann, ueber }) {
  const { pathname } = useLocation();
  const eigen = metaFuer(pathname);

  const krumen = [{ weg: "/", name: "Start" }];
  if (ueber) krumen.push(ueber);
  if (eigen && eigen.weg !== "/") {
    krumen.push({ weg: eigen.weg, name: eigen.menue ?? eigen.untermenue ?? titel });
  }

  return (
    <section className="seitenkopf">
      <div className="mitte">
        <nav className="krumen" aria-label="Sie sind hier">
          <ol>
            {krumen.map((k, i) => (
              <li key={k.weg}>
                {i < krumen.length - 1 ? (
                  <>
                    <Link to={k.weg}>{k.name}</Link>
                    <span aria-hidden="true">/</span>
                  </>
                ) : (
                  <span aria-current="page">{k.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {ueberzeile && <p className="ueberzeile">{ueberzeile}</p>}
        <h1>{titel}</h1>
        {vorspann && <p className="vorspann">{vorspann}</p>}
      </div>
    </section>
  );
}
