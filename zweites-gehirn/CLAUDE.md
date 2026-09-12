# Arbeitsregeln für Claude in diesem Vault

Dieses Repository ist kein Softwareprojekt, sondern das **zweite Gehirn von Fabio**.
Alles hier sind Markdown-Notizen, die in Obsidian gelesen werden — meistens auf einem iPad.

## Sprache und Ton

- Immer **Deutsch**, Du-Form.
- Kurze Sätze. Keine Werbesprache, keine Füllwörter, keine Emojis in Notizen.
- Schreib so, wie Fabio es in einem Jahr noch verstehen will, nicht wie ein Lexikon.

## Ordnung

| Ordner | Inhalt | Regel |
|---|---|---|
| `00-Posteingang` | Unsortiertes | Nur hierhin schreiben, wenn die Einordnung unklar ist |
| `10-Notizen` | Dauerhafte Notizen | Eine Datei = ein Gedanke |
| `20-Quellen` | Fremdmaterial | Beleg, kein Wissen |
| `30-Projekte` | Vorhaben mit Ende | Muss ein Ziel und einen nächsten Schritt haben |
| `40-Bereiche` | Dauerthemen | Wird nie „fertig" |
| `50-Archiv` | Erledigtes | Statt Löschen |
| `60-Tagebuch` | `YYYY-MM-DD.md` | Logbuch, nichts Dauerhaftes |
| `90-Meta` | Vorlagen, Karten, Anhänge | Kein Inhaltswissen |

## Notizen schreiben

1. **Titel als Aussage.** In `10-Notizen` heißt eine Datei nicht „Zinseszins", sondern
   „Zinseszins belohnt Zeit stärker als Rendite". Der Titel ist schon die halbe Notiz.
2. **Atomar.** Zwei Gedanken = zwei Dateien, verlinkt. Lieber drei kurze Notizen als eine lange.
3. **Frontmatter immer setzen**, mindestens `typ`, `erstellt`, `tags`.
   Erlaubte `typ`-Werte: `notiz`, `quelle`, `projekt`, `bereich`, `tagebuch`, `karte`, `hinweis`.
   Erlaubte `status`-Werte für Notizen: `keim`, `entwurf`, `fest`.
4. **Verlinken statt wiederholen.** Jede neue Notiz in `10-Notizen` bekommt mindestens einen
   `[[Wikilink]]` zu einer vorhandenen Notiz. Wenn keine passt: in der Notiz vermerken, warum
   sie allein steht.
5. **Wikilinks, keine Markdown-Links** für interne Verweise. Anhänge nach `90-Meta/Anhänge`.
6. **Dateinamen:** normale Groß-/Kleinschreibung, Leerzeichen erlaubt, Umlaute erlaubt.
   Keine `/ \ : * ? " < > |` — die brechen auf iOS.

## Was du von dir aus tun darfst

- Notizen anlegen, erweitern, umformulieren, verlinken.
- Den Posteingang aufräumen, wenn darum gebeten wird.
- Querverbindungen vorschlagen, die Fabio übersehen hat — das ist der eigentliche Nutzen.
- Karten (`90-Meta/Karten`) anlegen, sobald ein Thema mehr als ungefähr zehn Notizen hat.

## Was du nicht tust

- **Nie Notizen löschen.** Verschieb sie nach `50-Archiv`.
- Keine Inhalte erfinden und als Fabios Gedanken ausgeben. Was von dir kommt, wird als
  solches gekennzeichnet: `> [!note] Von Claude ergänzt`.
- Keine Tagebucheinträge rückwirkend umschreiben.
- Keine Massenumbenennung ohne Ansage — das zerreißt Links.
- Keine Dateien außerhalb dieses Vaults anfassen.

## Umgang mit Unsicherheit

Wenn eine Notiz eine Behauptung enthält, die du nicht belegen kannst, schreib sie trotzdem —
aber markiere sie:

```
> [!question] Ungeprüft
> Behauptung X stammt aus dem Gedächtnis und ist nicht belegt.
```

## Commit-Regel

Eine Sitzung = ein Commit, Betreff auf Deutsch und inhaltlich, nicht technisch.
Gut: `Posteingang aufgeräumt, 6 Notizen zu Zinsen verknüpft`.
Schlecht: `update files`.
