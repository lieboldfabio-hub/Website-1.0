# Zweites Gehirn

Obsidian-Vault, iPad-first, per Git mit Claude verbunden.

**Neu hier? → [EINRICHTUNG-IPAD.md](EINRICHTUNG-IPAD.md)**

## Zweck

Zwei Dinge in einem:

1. **Fabios Notizbuch** — Gedanken, Quellen, Tagebuch.
2. **Claudes Gedächtnis zwischen Sitzungen.** Statt sich in jeder neuen Sitzung wieder
   durch Quelltext und Verlauf zu arbeiten, liest Claude zwei kleine Dateien: den Index
   und die Projektnotiz. Das ist der eigentliche Grund für diesen Vault — jede Sitzung
   startet mit dem, was die letzte gelernt hat, statt es neu zu erarbeiten.

Damit das aufgeht, sind die Notizen **klein gehalten und mit Zeilengrenzen versehen**
(siehe [`CLAUDE.md`](CLAUDE.md)). Ein Vault, der bei jedem Start komplett gelesen wird,
kostet mehr als er spart.

## Wie es zusammenhängt

```
   iPad / Obsidian  ──(Obsidian Git)──►  GitHub (privat)  ◄──(Claude Code)──  Claude
```

Kein Server, kein API-Schlüssel, kein laufender Rechner.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `00-Posteingang` | Alles Ungeklärte. Erfassen darf nie Arbeit sein. |
| `10-Notizen` | Dauerhaftes Wissen — eine Datei, ein Gedanke |
| `20-Quellen` | Bücher, Artikel, Videos, Gespräche |
| `30-Projekte` | Projektgedächtnis — je eine Datei pro Vorhaben |
| `40-Bereiche` | Dauerthemen ohne Ende |
| `50-Archiv` | Abgeschlossenes, statt Löschen |
| `60-Tagebuch` | Eine Datei pro Tag |
| `90-Meta` | Index, Vorlagen, Arbeitsanweisungen, Anhänge |

- Claudes Einstieg: [`90-Meta/Index.md`](90-Meta/Index.md)
- Fabios Einstieg: `90-Meta/Karten/Start.md` — als Lesezeichen setzen
- Regeln: [`CLAUDE.md`](CLAUDE.md) · Prompts: [`90-Meta/Arbeitsanweisungen.md`](90-Meta/Arbeitsanweisungen.md)

## Grundsatz

Claude sortiert, verknüpft und erinnert. Denken bleibt bei dir.
