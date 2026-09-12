---
typ: projekt
status: aktiv
geprüft: 2026-09-12
repo: lieboldfabio-hub/zweites-gehirn (noch nicht angelegt)
tags: [projekt, obsidian]
---

# Zweites Gehirn

**Einzeiler:** Dieser Vault. Obsidian auf dem iPad, über ein privates Git-Repo mit Claude
verbunden — Fabios Notizbuch und zugleich Claudes Gedächtnis zwischen Sitzungen.

## Stand (2026-09-12)

Gerüst fertig: Ordner, Vorlagen, Index, Regeln, zwei Projektnotizen. Liegt im Branch
`claude/obsidian-external-brain-qy4i32` von `Website-1.0` unter `zweites-gehirn/` und
zusätzlich als ZIP beim Nutzer auf dem iPad.

Das eigene Repo `zweites-gehirn` ist noch nicht angelegt — das muss Fabio tun,
GitHub verweigert meinem Zugang das Anlegen von Repos (403).

## Nächste Schritte

- [ ] Fabio legt `zweites-gehirn` privat und leer an
- [ ] Vault als Wurzel dorthin pushen, Branch in `Website-1.0` danach aufräumen
- [ ] Obsidian Git auf dem iPad einrichten (Anleitung in `EINRICHTUNG-IPAD.md`)

## Entscheidungen

| Entscheidung | Begründung | Verworfen wurde |
|---|---|---|
| Synchronisation über Git statt MCP-Server | Local REST API und die MCP-Server für Obsidian sind Desktop-only, Fabio arbeitet am iPad | MCP-Server, Local REST API |
| Eigenes privates Repo statt Branch in `Website-1.0` | Notizen und Website sollen sich kein Repo teilen | Orphan-Branch im Website-Repo |
| Kein Anthropic-API-Schlüssel | Claude liest den Vault über GitHub, nicht über ein Obsidian-Plugin; ein Schlüssel würde extra abgerechnet | Copilot-Plugin mit API-Schlüssel im Obsidian-Schlüsselbund |
| Vault auf dem iPad lokal, nicht in iCloud | iCloud und Git auf demselben Ordner zerschießen Dateien | iCloud-Drive-Vault |
| Harte Zeilengrenzen für Notizen | ein Vault, der bei jedem Start ganz gelesen wird, kostet mehr Tokens als er spart | frei wachsende Notizen |

## Stolperfallen

- **Reihenfolge:** iPad pushen, dann Claude arbeiten lassen, dann am iPad pullen.
  Andersherum entstehen Merge-Konflikte mitten in Notizen.
- **Klonen verlangt einen leeren Vault.** Wer erst das ZIP entpackt, kann in denselben
  Vault später nicht mehr klonen — dann neuen Vault anlegen und Notizen hinüberziehen.
- Obsidian Git auf iOS läuft in JavaScript und wird bei sehr vielen Dateien träge.
  Große PDFs und Bilder gehören nicht in den Vault.
- Keine Token oder Schlüssel in Notizen — der Vault ist ein Git-Repo, die Historie vergisst nichts.

## Landkarte

| Pfad | Zuständig für |
|---|---|
| `CLAUDE.md` | Regeln und Sitzungsablauf — wird zuerst gelesen |
| `90-Meta/Index.md` | Einstieg: alle Projekte auf einer Bildschirmseite |
| `30-Projekte/` | je eine Gedächtnisnotiz pro Vorhaben |
| `90-Meta/Vorlagen/Projektgedächtnis.md` | Vorlage für neue Projekte |
| `EINRICHTUNG-IPAD.md` | Einrichtung Schritt für Schritt |
