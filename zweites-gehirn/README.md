# Zweites Gehirn

Obsidian-Vault, iPad-first, per Git mit Claude verbunden.

**Neu hier? → [EINRICHTUNG-IPAD.md](EINRICHTUNG-IPAD.md)**

## Wie es funktioniert

```
   iPad / Obsidian  ──(Obsidian Git)──►  GitHub (privat)  ◄──(Claude Code)──  Claude
```

Der Vault ist ein privates Git-Repo. Das iPad synchronisiert es über das Plugin
*Obsidian Git*, Claude arbeitet über GitHub auf denselben Dateien. Es läuft kein Server,
es wird kein API-Schlüssel gebraucht, und es muss kein Rechner an sein.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `00-Posteingang` | Alles Ungeklärte. Erfassen darf nie Arbeit sein. |
| `10-Notizen` | Dauerhafte Notizen — eine Datei, ein Gedanke |
| `20-Quellen` | Bücher, Artikel, Videos, Gespräche |
| `30-Projekte` | Vorhaben mit Ende |
| `40-Bereiche` | Dauerthemen ohne Ende |
| `50-Archiv` | Erledigtes, statt Löschen |
| `60-Tagebuch` | Eine Datei pro Tag |
| `90-Meta` | Vorlagen, Karten, Anhänge, Arbeitsanweisungen |

Einstieg im Vault: `90-Meta/Karten/Start.md` — als Lesezeichen setzen.

## Regeln

- [`CLAUDE.md`](CLAUDE.md) — wie Claude in diesem Vault schreiben darf, und was nicht
- [`90-Meta/Arbeitsanweisungen.md`](90-Meta/Arbeitsanweisungen.md) — fertige Prompts

## Grundsatz

Der Vault ist nur so viel wert wie die Gedanken darin, die **du** formuliert hast.
Claude sortiert, verknüpft und erinnert — denken musst du selbst.
