#!/usr/bin/env bash
# ============================================================================
# Ein Kundenprojekt in ein eigenes Repository auslagern.
#
#   ./werkzeuge/kundenrepo-exportieren.sh dognsoul-augsburg
#
# Legt neben diesem Repository einen fertigen Ordner an: die Projektdateien,
# ein eigener GitHub-Actions-Workflow fuer GitHub Pages, eine .gitignore und
# ein bereits initialisiertes Git-Repository mit erstem Commit.
#
# Was das Skript NICHT tut: das Repository auf github.com anlegen. Das geht
# nur mit einem persoenlichen Zugang. Die noetigen Befehle stehen am Ende der
# Ausgabe und koennen direkt kopiert werden.
#
# WICHTIG: Die README.md eines Kundenprojekts enthaelt interne Notizen zum
# Verkaufsgespraech. Das ausgelagerte Repository muss deshalb PRIVAT sein.
# ============================================================================
set -euo pipefail

SLUG="${1:-}"
if [ -z "$SLUG" ]; then
  echo "Aufruf: $0 <ordnername-unter-kunden>" >&2
  echo "Vorhanden:" >&2
  ls -1 "$(dirname "$0")/../kunden" >&2
  exit 1
fi

WURZEL="$(cd "$(dirname "$0")/.." && pwd)"
QUELLE="$WURZEL/kunden/$SLUG"
ZIEL="$WURZEL/../$SLUG"

[ -d "$QUELLE" ] || { echo "Kein Projekt unter kunden/$SLUG" >&2; exit 1; }
[ -e "$ZIEL" ] && { echo "$ZIEL gibt es schon. Bitte vorher wegraeumen." >&2; exit 1; }

mkdir -p "$ZIEL"
ZIEL="$(cd "$ZIEL" && pwd)"
cp -r "$QUELLE"/. "$ZIEL"/

# ------------------------------------------------------- eigener Workflow --
mkdir -p "$ZIEL/.github/workflows"
cat > "$ZIEL/.github/workflows/pages.yml" <<'YML'
# Veroeffentlicht diese Website ueber GitHub Pages.
# Die interne README bleibt dabei aussen vor.
name: Website veroeffentlichen

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Seite zusammenstellen
        run: |
          mkdir -p _site
          cp -r ./* _site/ 2>/dev/null || true
          rm -rf _site/_site

          # Interne Unterlagen gehoeren nicht ins Netz.
          find _site \( -name '*.md' -o -name 'README.txt' \) -delete
          if find _site \( -name '*.md' -o -name 'README.txt' \) | grep .; then
            echo "Interne Unterlagen sind noch vorhanden, Abbruch."; exit 1
          fi

      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
YML

cat > "$ZIEL/.gitignore" <<'IGN'
.DS_Store
Thumbs.db
_site/
IGN

# ------------------------------------------------------------------ Git ----
cd "$ZIEL"
git init -q -b main
git add -A
git -c user.name="S & F Webseiten" -c user.email="lieboldfabio@gmail.com" \
    commit -q -m "Website-Entwurf $SLUG"

echo
echo "Fertig. Der Ordner liegt unter: $ZIEL"
echo
echo "Naechste Schritte:"
echo
echo "  1. Auf github.com ein neues Repository anlegen:"
echo "     Name:       $SLUG"
echo "     Sichtbarkeit: PRIVAT  (die README enthaelt interne Notizen)"
echo "     Ohne README, ohne .gitignore, ohne Lizenz."
echo
echo "  2. Dann hier im Ordner:"
echo
echo "     cd $ZIEL"
echo "     git remote add origin git@github.com:<dein-konto>/$SLUG.git"
echo "     git push -u origin main"
echo
echo "  3. Im Repository unter Settings -> Pages als Quelle"
echo "     \"GitHub Actions\" waehlen. Danach laeuft der Workflow bei jedem Push."
echo
