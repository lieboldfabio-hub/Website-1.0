# Lovable per MCP anbinden

Damit kann Claude (oder Cursor, Codex, VS Code …) direkt mit
[Lovable](https://lovable.dev) arbeiten: Projekte anlegen, dem Lovable-Agenten
Anweisungen schicken, Änderungen im Code ansehen, deployen, Datenbank abfragen –
ohne den Editor zu wechseln.

Angebunden wird der **offizielle Lovable-MCP-Server**. Es wird nichts lokal
installiert oder gestartet, eingetragen wird nur eine Adresse:

| | |
| --- | --- |
| Adresse | `https://mcp.lovable.dev` |
| Transport | Streamable HTTP |
| Anmeldung | OAuth 2.1, läuft beim ersten Aufruf im Browser |
| Öffentliche Client-ID | `6d465f583e1e4ce5801b1616f735670c` (kein Geheimnis, steht so in Lovables Doku) |
| Verfügbarkeit | in allen Lovable-Tarifen, derzeit „Research Preview" |

> Ein eigener MCP-Server wäre hier der falsche Weg: Lovable hat keine
> öffentliche REST-API, ein Eigenbau müsste die interne API nachahmen und würde
> bei jeder Änderung brechen.

---

## Einrichten

### Claude Code in diesem Repository

Nichts zu tun. Die Datei `.mcp.json` im Wurzelverzeichnis trägt den Server
projektweit ein – Claude Code fragt beim nächsten Start einmal, ob der Server
aus diesem Projekt genutzt werden darf.

### Alle anderen Clients (und Claude Code außerhalb dieses Repos)

```sh
./werkzeuge/lovable-mcp-einrichten.sh                 # alles Gefundene
./werkzeuge/lovable-mcp-einrichten.sh cursor vscode   # gezielt
```

Bekannte Clients: `claude-code`, `claude-desktop`, `cursor`, `windsurf`,
`vscode`, `codex`. Bestehende Konfigurationsdateien werden ergänzt, nicht
ersetzt; vorher legt das Skript eine `.bak`-Kopie daneben.

Von Hand geht es genauso:

```sh
claude mcp add --transport http lovable https://mcp.lovable.dev   # Claude Code
codex mcp add lovable --url https://mcp.lovable.dev               # Codex CLI
```

Für Claude Desktop, Cursor, Windsurf und VS Code der Eintrag in der jeweiligen
MCP-Konfiguration (bei VS Code heißt der Block `servers` statt `mcpServers`):

```json
{
  "mcpServers": {
    "lovable": {
      "type": "http",
      "url": "https://mcp.lovable.dev",
      "auth": { "CLIENT_ID": "6d465f583e1e4ce5801b1616f735670c" }
    }
  }
}
```

Claude, Claude Code und ChatGPT brauchen die `auth`-Zeile nicht – nur die URL.

### Anmelden

Einmalig, danach hält das Token.

- **Claude Code**: `/mcp` aufrufen, `lovable` auswählen, `Authenticate`
- **Codex CLI**: `codex mcp login lovable`
- **übrige**: Client neu starten, das Anmeldefenster öffnet sich von selbst

Probe: „Liste meine Lovable-Workspaces auf." Kommt eine Liste zurück, steht die
Verbindung.

---

## Was der Server kann

Über 50 Tools in diesen Bereichen:

| Bereich | Beispiele |
| --- | --- |
| Projekte & Workspaces | auflisten, anlegen, deployen, remixen, Sichtbarkeit setzen |
| Agent | Nachrichten an den Lovable-Agenten schicken, Antworten abholen |
| Code | Diffs, Dateibaum, Dateiinhalte, Änderungsverlauf |
| Wissen | KI-Anweisungen je Projekt / Workspace lesen und schreiben |
| Datenbank | Postgres aktivieren, Status, SQL ausführen, Verbindungsdaten |
| Connectors | externe Integrationen (Linear, Notion, Slack, eigene MCPs) verwalten |
| Vorlagen | Template- und Library-Projekte durchsuchen |
| Analytics | Zugriffszahlen, historisch und live |
| Uploads | Upload-URLs für Bilder erzeugen |

Typischer Ablauf:

```
1. list_workspaces()                    → workspace_id
2. create_project(workspace_id, …)      → project_id     (kostet Credits)
3. send_message(project_id, "Füge … ")  → message_id     (kostet Credits)
4. get_diff(project_id, message_id)     → Änderungen prüfen
5. deploy_project(project_id)           → öffentliche URL
```

Die meisten Tools brauchen eine `workspace_id`, deshalb immer mit
`list_workspaces` anfangen. `read_file` braucht zusätzlich eine Git-Ref – die
`latest_commit_sha` liefert `get_project`.

---

## Vorsicht

- `create_project` und `send_message` **verbrauchen Lovable-Credits**.
- `deploy_project` stellt das Projekt unter einer **öffentlichen URL** online.
- `query_database` setzt **SQL direkt auf der Projektdatenbank** ab – auch
  `DELETE` und `DROP`. Vor schreibenden Abfragen nachfragen lassen.
- Der Zugang hängt am angemeldeten Lovable-Konto: Wer den Client bedient, kann
  alle Projekte dieses Kontos ändern.

## Wenn es klemmt

| Symptom | Ursache / Abhilfe |
| --- | --- |
| `401 Unauthorized`, Token abgelaufen | Anmeldung im Client wiederholen |
| Anmeldefenster dreht sich im Kreis | `auth.CLIENT_ID` fehlt in der Konfiguration |
| „Transport not supported" | Client beherrscht kein Streamable HTTP |
| Tool meckert über fehlende `workspace_id` | zuerst `list_workspaces` aufrufen |
| Server taucht im Client nicht auf | Client neu starten; in Claude Code `/mcp` prüfen |

## Quellen

- [github.com/lovablelabs/mcp](https://github.com/lovablelabs/mcp) – offizielles Repository
- [docs.lovable.dev/integrations/lovable-mcp-server](https://docs.lovable.dev/integrations/lovable-mcp-server) – vollständige Tool-Referenz
