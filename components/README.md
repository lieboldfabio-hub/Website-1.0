# components/

Diese beiden Dateien sind **React/TypeScript** und gehören nicht zur statischen
Website in `sf-webseiten/`, `beispiele/` und `kunden/`. Sie liegen hier, weil
`components/ui/` der Pfad ist, den die shadcn-Konvention vorgibt — nutzbar sind
sie erst, wenn dieses Repository eine React-Toolchain bekommt.

| Datei | Zweck |
| --- | --- |
| `ui/blackhole-hero-section.tsx` | Die Komponente. Rendert ein Schwarzes Loch per Raymarching in WebGL. |
| `blackhole-hero-section-demo.tsx` | Beispielverwendung als Hero mit Textspalte. |

## Stand

Dieses Repository ist eine statische Website ohne Build-Schritt: keine
`package.json`, kein TypeScript, kein Tailwind, kein Bundler. Die Dateien
werden daher **nicht kompiliert, nicht typgeprüft und von nichts importiert**.

Der Veröffentlichungs-Workflow (`.github/workflows/pages.yml`) kopiert nur
`kunden/`, `beispiele/` und `sf-webseiten/` nach `_site/`. Dieser Ordner landet
also nicht auf der Vorschau-Seite.

## Was zum Betrieb fehlt

Die Komponente braucht **kein** shadcn-Paket: sie verwendet keine Radix-
Primitive, kein `cn()` und keine `class-variance-authority`. Sie braucht nur:

1. React 18+
2. TypeScript
3. Tailwind CSS (für die Utility-Klassen in beiden Dateien)
4. Den Pfad-Alias `@/*`, den die Demo für den Import nutzt

Die Einrichtungsschritte stehen im Chatverlauf zu diesem Commit bzw. in der
Projektdokumentation. Ohne diese vier Punkte sind die Dateien totes Gewicht.

## Alternative für dieses Repository

Der eigentliche Inhalt der Komponente ist ein GLSL-Shader plus rund 200 Zeilen
WebGL-Ansteuerung — beides läuft ohne React. Wer den Effekt in der bestehenden
statischen Seite haben will, braucht keine Toolchain, sondern portiert die
`useEffect`-Logik in ein normales JS-Modul mit einem `<canvas>`. Das passt zur
Linie des Repos: `index.html` doppelklicken genügt, nichts wird gebaut.
