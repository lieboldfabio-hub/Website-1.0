# Kundenprojekt in ein eigenes Repository auslagern

Kundenprojekte bekommen ein **eigenes, privates Repository**. Der eigene
Auftritt von S & F Webseiten und die Beispielprojekte bleiben zusammen in
diesem Repository – sie gehören inhaltlich zusammen und werden über denselben
Workflow veröffentlicht.

## Warum privat

Die `README.md` eines Kundenprojekts enthält interne Notizen: Verkaufsargumente,
Recherche zur bisherigen Website, Einschätzungen zum Gespräch. Das ist nichts,
was der Kunde oder ein Wettbewerber lesen soll. Ein öffentliches Repository
wäre hier ein Fehler, der sich nicht zurücknehmen lässt – auch ein späteres
Löschen hilft nicht, wenn die Seite schon indexiert wurde.

Der Veröffentlichungs-Workflow im ausgelagerten Repository löscht alle
`*.md`-Dateien vor dem Deploy und bricht ab, falls doch eine übrig bleibt. Die
Vorschau selbst enthält die internen Notizen also nie.

## In zwei Schritten

### 1. Ordner erzeugen

```bash
./werkzeuge/kundenrepo-exportieren.sh dognsoul-augsburg
```

Das legt **neben** diesem Repository einen fertigen Ordner an – mit den
Projektdateien, einem eigenen Pages-Workflow, einer `.gitignore` und einem
bereits initialisierten Git-Repository samt erstem Commit.

### 2. Auf GitHub anlegen und hochladen

Ein Repository anzulegen geht nur mit einem persönlichen Zugang, nicht
automatisiert von hier aus. Also von Hand:

1. Auf [github.com/new](https://github.com/new):
   - **Name:** derselbe wie der Ordner, z. B. `dognsoul-augsburg`
   - **Sichtbarkeit: Private**
   - keine README, keine `.gitignore`, keine Lizenz anhaken
2. Dann im erzeugten Ordner:
   ```bash
   cd ../dognsoul-augsburg
   git remote add origin git@github.com:<dein-konto>/dognsoul-augsburg.git
   git push -u origin main
   ```
3. Im neuen Repository unter **Settings → Pages** als Quelle
   **„GitHub Actions"** wählen. Ab dann veröffentlicht jeder Push auf `main`.

## Was danach mit dem Ordner hier passiert

Vorerst nichts. `kunden/dognsoul-augsburg/` bleibt bestehen, damit die bereits
weitergegebene Vorschau-Adresse weiter funktioniert:

```
https://lieboldfabio-hub.github.io/Website-1.0/dognsoul-augsburg/
```

Erst wenn der Kunde die Seite abgenommen hat und die neue Adresse steht, kann
der Ordner hier entfernt werden. Ab dann ist das eigene Repository die einzige
Quelle – zwei Stände desselben Projekts sind auf Dauer eine Fehlerquelle.
