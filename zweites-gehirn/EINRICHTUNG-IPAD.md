# Einrichtung auf dem iPad

Ziel: Obsidian auf dem iPad als zweites Gehirn — und Claude kann denselben Vault lesen
und beschreiben, ohne dass irgendwo ein Rechner laufen muss.

Der Trick: Der Vault ist ein **privates Git-Repository**. Obsidian synchronisiert es auf dem
iPad, Claude arbeitet auf demselben Repo über GitHub. Kein API-Schlüssel, kein Server,
kein offener Port.

```
   iPad / Obsidian  ──(Obsidian Git)──►  GitHub (privat)  ◄──(Claude Code)──  Claude
```

Zeitaufwand: ungefähr 15 Minuten. Alles davon geht am iPad.

---

## Schritt 1 — Privates Repo anlegen (Safari, 1 Minute)

1. [github.com/new](https://github.com/new) öffnen.
2. **Repository name:** `zweites-gehirn`
3. **Private** auswählen. (Wichtig — dein Gehirn ist nicht öffentlich.)
4. **„Add a README file" NICHT ankreuzen.** Das Repo muss leer bleiben, sonst kollidiert es
   mit dem Gerüst, das Claude hineinschiebt.
5. *Create repository*.

Danach in diesem Chat sagen: **„Repo ist da, schieb das Gerüst rein."**
Claude überträgt dann Ordner, Vorlagen und Regeln in das Repo.

---

## Schritt 2 — Zugangs-Token erzeugen (3 Minuten)

Obsidian auf dem iPad braucht ein Passwort für GitHub. Nicht dein echtes — ein Token,
das nur dieses eine Repo darf.

1. [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)
2. **Token name:** `obsidian-ipad`
3. **Expiration:** 1 Jahr (oder „No expiration", wenn dir Bequemlichkeit wichtiger ist)
4. **Repository access:** *Only select repositories* → `zweites-gehirn`
5. **Permissions → Repository permissions → Contents:** auf **Read and write** stellen.
   (`Metadata: Read` setzt GitHub automatisch dazu. Mehr braucht es nicht.)
6. *Generate token* → Token **sofort kopieren**, er wird nie wieder angezeigt.

Leg ihn in den iOS-Passwörtern ab. **Niemals** in eine Notiz im Vault schreiben —
die landet sonst im Repo.

---

## Schritt 3 — Obsidian vorbereiten (2 Minuten)

1. Obsidian öffnen → unten links auf den Vault-Namen → **Vault wechseln** → **Neuen Vault erstellen**.
2. Name: `Zweites Gehirn`.
3. Speicherort: **Auf meinem iPad** (nicht iCloud Drive). iCloud und Git zusammen führen zu
   zerschossenen Dateien.
4. Der Vault muss **leer** sein — der Klon in Schritt 4 verlangt das.

> Deinen bisherigen Vault „First Voult" kannst du danach löschen, da liegt ohnehin nichts drin.

---

## Schritt 4 — Obsidian Git installieren und klonen (5 Minuten)

1. **Einstellungen → Externe Erweiterungen** (auf deinem Screenshot der Punkt unter
   „Obsidian-Erweiterungen") → **Eingeschränkten Modus deaktivieren**.
2. **Durchsuchen** → nach `Git` suchen → **Obsidian Git** installieren → **Aktivieren**.
3. **Einstellungen → Obsidian Git** öffnen und eintragen:
   - *Authentication/Commit Author* → **Username:** `lieboldfabio-hub`
   - *Authentication/Commit Author* → **Password/Personal access token:** der Token aus Schritt 2
   - *Author name for commit:* `Fabio`
   - *Author email for commit:* deine GitHub-Mailadresse
4. Befehlspalette öffnen (Tastenkürzel `⌘P` mit Tastatur, sonst das Icon links) →
   **`Git: Clone an existing remote repo`**.
5. URL eingeben:
   ```
   https://github.com/lieboldfabio-hub/zweites-gehirn.git
   ```
6. Auf die Frage nach dem Zielordner: **Vault-Wurzel** wählen.
7. Nach dem Klonen: Obsidian einmal schließen und neu öffnen.

Wenn alles geklappt hat, siehst du jetzt die Ordner `00-Posteingang` bis `90-Meta`.

---

## Schritt 5 — Automatische Synchronisation einschalten (2 Minuten)

**Einstellungen → Obsidian Git:**

| Einstellung | Wert | Warum |
|---|---|---|
| Vault backup interval (minutes) | `10` | Sichert automatisch alle 10 Minuten |
| Auto pull interval (minutes) | `10` | Holt, was Claude geschrieben hat |
| Pull updates on startup | **an** | Beim Öffnen immer aktueller Stand |
| Push on backup | **an** | Sonst bleibt alles lokal |
| Commit message | `iPad: {{date}}` | Erkennbar, was vom iPad kam |
| Disable notifications | **an** | Sonst blinkt es alle 10 Minuten |

Zusätzlich sinnvoll: In **Einstellungen → Tastenkürzel** dem Befehl
`Git: Commit-and-sync` eine Geste oder einen Shortcut geben, damit du vor dem Weglegen
des iPads einmal von Hand synchronisieren kannst.

---

## Schritt 6 — Claude an den Vault lassen

In einer Claude-Code-Sitzung (Web oder App) einfach schreiben:

> Nimm das Repo `lieboldfabio-hub/zweites-gehirn` dazu.

Claude hängt das Repo an die Sitzung, liest die `CLAUDE.md` im Vault und hält sich an die
Regeln, die dort stehen. Danach zum Beispiel:

> Räum meinen Posteingang auf.

Fertige Prompts stehen in `90-Meta/Arbeitsanweisungen.md`.

**Wichtig zum Ablauf:** Claude schreibt direkt ins Repo. Damit du die Änderungen am iPad
siehst, einmal `Git: Pull` auslösen (oder 10 Minuten warten). Und umgekehrt: Bevor Claude
arbeitet, sollte dein iPad gepusht haben — sonst arbeitet Claude auf altem Stand.
Merksatz: **erst synchronisieren, dann Claude bitten.**

---

## Wenn etwas klemmt

**„Authentication failed"**
Token abgelaufen oder falsch kopiert. Neuen erzeugen (Schritt 2), in den Plugin-Einstellungen
ersetzen. Benutzername ist `lieboldfabio-hub`, nicht die E-Mail-Adresse.

**„Merge conflict" / Datei mit `<<<<<<<` darin**
Du hast dieselbe Notiz am iPad und über Claude geändert. Öffne die Datei, lösch die Markierungen
`<<<<<<<`, `=======`, `>>>>>>>` und behalte den Text, den du willst. Dann `Git: Commit-and-sync`.
Vorbeugen: vor jeder Claude-Sitzung pushen.

**Sync ist quälend langsam**
Obsidian Git auf iOS ist reines JavaScript und wird bei vielen tausend Dateien träge.
Bis ein paar tausend Notizen ist das kein Thema. Große PDFs und Bilder gehören nicht in den Vault —
die blähen die Repo-Historie dauerhaft auf.

**Plan B, wenn Obsidian Git auf dem iPad zickt**
Die App **Working Copy** (iOS-Git-Client) klont das Repo, gibt den Ordner an die Dateien-App frei,
und Obsidian öffnet diesen Ordner als Vault. Synchronisiert wird dann in Working Copy statt in
Obsidian. Etwas mehr Handarbeit, dafür der robustere Git-Unterbau.

---

## Was du bewusst **nicht** brauchst

- **Keinen Anthropic-API-Schlüssel.** Der Dialog *Einstellungen → Schlüsselbund → Geheimnis
  hinzufügen* bleibt leer. Den bräuchtest du nur, wenn ein Plugin *innerhalb* von Obsidian
  mit einem Modell chatten soll — das wird pro Token abgerechnet und ist von deinem
  Claude-Abo unabhängig.
- **Keinen laufenden Rechner.** Die verbreiteten Wege über *Local REST API* oder einen
  MCP-Server sind Desktop-only und auf dem iPad nicht nutzbar. Deshalb der Umweg über Git.
- **Kein Obsidian Sync.** Git macht die Synchronisation. Beides gleichzeitig auf demselben
  Vault erzeugt Konflikte. Wenn du später Obsidian Sync für weitere Geräte willst: dann
  Git abschalten und stattdessen einen anderen Weg für Claude wählen.
