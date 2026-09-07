#!/usr/bin/env bash
# ============================================================================
# Den offiziellen Lovable-MCP-Server in einem KI-Client eintragen.
#
#   ./werkzeuge/lovable-mcp-einrichten.sh              # alle gefundenen Clients
#   ./werkzeuge/lovable-mcp-einrichten.sh claude-code
#   ./werkzeuge/lovable-mcp-einrichten.sh cursor vscode
#
# Clients: claude-code | claude-desktop | cursor | windsurf | vscode | codex
#
# Der Server liegt bei Lovable selbst (https://mcp.lovable.dev), es wird also
# nichts lokal installiert oder gestartet. Eingetragen wird nur die Adresse.
#
# WICHTIG: Fuer Claude Code in DIESEM Repository ist nichts zu tun - die Datei
# .mcp.json im Wurzelverzeichnis traegt den Server bereits projektweit ein.
# Dieses Skript ist fuer andere Clients bzw. fuer eine benutzerweite Ablage.
#
# Nach dem Eintragen einmal anmelden (OAuth im Browser):
#   Claude Code   ->  /mcp  aufrufen, "lovable" waehlen, "Authenticate"
#   Codex CLI     ->  codex mcp login lovable
#   uebrige       ->  Client neu starten, Anmeldefenster erscheint von selbst
#
# Achtung, kostet Lovable-Credits: create_project und send_message verbrauchen
# Guthaben, deploy_project veroeffentlicht eine oeffentliche URL und
# query_database setzt SQL direkt auf der Projektdatenbank ab.
# ============================================================================
set -euo pipefail

URL="https://mcp.lovable.dev"
# Oeffentliche OAuth-Client-ID von Lovable. Kein Geheimnis, sie steht so in der
# offiziellen Dokumentation. Clients ausser Claude und Codex brauchen sie,
# sonst dreht sich das Anmeldefenster im Kreis.
CLIENT_ID="6d465f583e1e4ce5801b1616f735670c"

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  sed -n '3,25p' "$0" | sed 's/^# \{0,1\}//'
  exit 0
fi

meldung()  { printf '  %s\n' "$*"; }
ueberschrift() { printf '\n\033[1m%s\033[0m\n' "$*"; }

# --- JSON-Datei um den Servereintrag ergaenzen (bestehendes bleibt erhalten) --
# $1 = Pfad, $2 = Schluessel der Serverliste ("mcpServers" oder "servers"),
# $3 = "ja", wenn der Eintrag die auth.CLIENT_ID braucht
json_eintragen() {
  local pfad="$1" schluessel="$2" mit_id="$3"
  if ! command -v python3 >/dev/null 2>&1; then
    meldung "python3 fehlt - bitte den Eintrag von Hand in $pfad ergaenzen."
    return 1
  fi
  mkdir -p "$(dirname "$pfad")"
  URL="$URL" CLIENT_ID="$CLIENT_ID" python3 - "$pfad" "$schluessel" "$mit_id" <<'PY'
import json, os, sys

pfad, schluessel, mit_id = sys.argv[1], sys.argv[2], sys.argv[3]

daten = {}
if os.path.exists(pfad) and os.path.getsize(pfad) > 0:
    with open(pfad, encoding="utf-8") as f:
        try:
            daten = json.load(f)
        except json.JSONDecodeError as fehler:
            sys.exit(f"  {pfad} ist kein gueltiges JSON ({fehler}) - nicht angeruehrt.")
    # Sicherheitskopie, bevor eine bestehende Konfiguration geschrieben wird
    with open(pfad + ".bak", "w", encoding="utf-8") as f:
        json.dump(daten, f, indent=2, ensure_ascii=False)

eintrag = {"type": "http", "url": os.environ["URL"]}
if mit_id == "ja":
    eintrag["auth"] = {"CLIENT_ID": os.environ["CLIENT_ID"]}

server = daten.setdefault(schluessel, {})
vorher = server.get("lovable")
server["lovable"] = eintrag

with open(pfad, "w", encoding="utf-8") as f:
    json.dump(daten, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(f"  {'unveraendert' if vorher == eintrag else 'eingetragen'}: {pfad}")
PY
}

# --- die einzelnen Clients ---------------------------------------------------
claude_code() {
  ueberschrift "Claude Code"
  if ! command -v claude >/dev/null 2>&1; then
    meldung "claude-CLI nicht gefunden - uebersprungen."
    meldung "In diesem Repository greift ohnehin die .mcp.json im Wurzelverzeichnis."
    return
  fi
  if claude mcp get lovable >/dev/null 2>&1; then
    meldung "bereits eingetragen (claude mcp get lovable)."
  else
    claude mcp add --transport http --scope user lovable "$URL"
    meldung "eingetragen (Benutzerbereich, gilt in allen Projekten)."
  fi
  meldung "Anmeldung: in Claude Code /mcp aufrufen und 'lovable' authentifizieren."
}

claude_desktop() {
  ueberschrift "Claude Desktop"
  local pfad
  case "$(uname -s)" in
    Darwin) pfad="$HOME/Library/Application Support/Claude/claude_desktop_config.json" ;;
    *)      pfad="${APPDATA:-$HOME/.config}/Claude/claude_desktop_config.json" ;;
  esac
  json_eintragen "$pfad" mcpServers nein || true
  meldung "Claude Desktop danach neu starten."
}

cursor()   { ueberschrift "Cursor";   json_eintragen "$HOME/.cursor/mcp.json" mcpServers ja || true; }
windsurf() { ueberschrift "Windsurf"; json_eintragen "$HOME/.codeium/windsurf/mcp_config.json" mcpServers ja || true; }
vscode()   { ueberschrift "VS Code";  json_eintragen "$HOME/.vscode/mcp.json" servers ja || true; }

codex() {
  ueberschrift "Codex CLI"
  if ! command -v codex >/dev/null 2>&1; then
    meldung "codex-CLI nicht gefunden - uebersprungen."
    return
  fi
  codex mcp add lovable --url "$URL"
  meldung "Anmeldung: codex mcp login lovable"
}

# --- Auswahl -----------------------------------------------------------------
if [ "$#" -gt 0 ]; then
  ZIELE=("$@")
else
  # Ohne Argumente: alles eintragen, was auf dem Rechner gefunden wird.
  ZIELE=()
  command -v claude >/dev/null 2>&1 && ZIELE+=(claude-code)
  command -v codex  >/dev/null 2>&1 && ZIELE+=(codex)
  [ -d "$HOME/.cursor" ] && ZIELE+=(cursor)
  [ -d "$HOME/.codeium/windsurf" ] && ZIELE+=(windsurf)
  if [ ${#ZIELE[@]} -eq 0 ]; then
    echo "Kein Client gefunden. Aufruf mit Namen, z. B.:" >&2
    echo "  $0 claude-desktop cursor vscode" >&2
    exit 1
  fi
fi

for ziel in "${ZIELE[@]}"; do
  case "$ziel" in
    claude-code)    claude_code ;;
    claude-desktop) claude_desktop ;;
    cursor)         cursor ;;
    windsurf)       windsurf ;;
    vscode)         vscode ;;
    codex)          codex ;;
    *) echo "Unbekannter Client: $ziel (bekannt: claude-code claude-desktop cursor windsurf vscode codex)" >&2; exit 1 ;;
  esac
done

ueberschrift "Fertig"
meldung "Erste Probe im Client: \"Liste meine Lovable-Workspaces auf.\""
meldung "Details: werkzeuge/LOVABLE-MCP.md"
