#!/usr/bin/env python3
"""
Statische Pruefung der Kompass-Oberflaeche gegen DESIGN-SYSTEM.md.

Prueft, was sich ohne laufenden Browser pruefen laesst: Farbtoken und ihre
Kontraste, Rohwerte am Designsystem vorbei, Skalenverstoesse, verbotene
Animationseigenschaften, Glas-Budget, Sperrformulierungen, englische
Oberflaechentexte.

Aufruf:
    python3 ui-audit.py /app/frontend/src
    python3 ui-audit.py /app/frontend/src --json bericht.json

Rueckgabewert 1, sobald ein blockierender Befund vorliegt.
Nur Standardbibliothek, keine Abhaengigkeiten.
"""

import argparse, json, os, re, sys
from collections import defaultdict

# --------------------------------------------------------------------------
# Sollwerte aus DESIGN-SYSTEM.md
# --------------------------------------------------------------------------

TOKENS = {
    "--bg": "#060A12", "--surface-1": "#0D141E", "--surface-2": "#161F2A",
    "--surface-3": "#212B38", "--border": "#2B3645", "--border-strong": "#404E60",
    "--ink-1": "#F3F7FC", "--ink-2": "#B7BEC8", "--ink-3": "#8A939F",
    "--accent": "#319CFC", "--accent-hover": "#4CB0FF",
    "--accent-quiet": "#1A609E", "--accent-ink": "#07121E",
    "--up": "#5BCC80", "--up-quiet": "#2F7346",
    "--down": "#EF675C", "--down-quiet": "#8F3831",
    "--warn": "#E7B643", "--neutral": "#989FA8",
    "--chart-1": "#0A6BB7", "--chart-2": "#16B05C", "--chart-3": "#CB2526",
    "--chart-4": "#C48611", "--chart-5": "#7D40C8", "--chart-6": "#15A4AB",
    "--chart-7": "#B73095", "--chart-8": "#879F11",
}

# Textfarbe -> Mindestkontrast gegen --surface-1
TEXT_MIN = {"--ink-1": 4.5, "--ink-2": 4.5, "--ink-3": 4.5,
            "--accent": 4.5, "--up": 4.5, "--down": 4.5, "--warn": 4.5,
            "--neutral": 4.5}
# Diagrammobjekte brauchen nur 3:1
MARK_MIN = {f"--chart-{i}": 3.0 for i in range(1, 9)}
# accent-quiet ist ausdruecklich KEINE Textfarbe
NEVER_TEXT = {"--accent-quiet", "--up-quiet", "--down-quiet"}

SPACING = {0, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64}
RADII = {0, 6, 10, 14, 999, 9999}
FORBIDDEN_TRANSITION = ["width", "height", "top", "left", "right", "bottom",
                        "margin", "padding", "box-shadow", "filter", "all"]
BLOCKED_PHRASES = ["garantiert", "risikolos", "todsicher", "einmalige chance",
                   "verpassen sie nicht", "kursexplosion", "geheimtipp",
                   "wird steigen", "wird fallen"]
ENGLISH_UI = ["Loading", "No data", "Error", "Save", "Cancel", "Search",
              "Settings", "Submit", "Delete", "Close", "Back", "Next",
              "Confirm", "Retry", "Something went wrong"]

# --------------------------------------------------------------------------

def luminance(hexstr):
    h = hexstr.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    ch = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    ch = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in ch]
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)


class Report:
    def __init__(self):
        self.items = []

    def add(self, stufe, kategorie, ort, text):
        self.items.append({"stufe": stufe, "kategorie": kategorie,
                           "ort": ort, "befund": text})

    @property
    def blocking(self):
        return [i for i in self.items if i["stufe"] == 1]


def walk(root, exts=(".css", ".js", ".jsx", ".ts", ".tsx")):
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in
                   {"node_modules", ".git", "build", "dist", "__pycache__"}]
        for f in files:
            if f.endswith(exts):
                yield os.path.join(base, f)


def rel(p, root):
    return os.path.relpath(p, os.path.dirname(root.rstrip("/")))


# --------------------------------------------------------------------------
# Pruefungen
# --------------------------------------------------------------------------

def check_tokens(root, rep):
    """Sind alle Token definiert und mit dem vorgeschriebenen Wert?"""
    defined = {}
    for path in walk(root, (".css",)):
        txt = open(path, encoding="utf-8", errors="ignore").read()
        for m in re.finditer(r"(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})", txt):
            defined.setdefault(m.group(1), (m.group(2).upper(), path))

    for name, soll in TOKENS.items():
        if name not in defined:
            rep.add(1, "token", "-", f"Token {name} ist nirgends definiert")
            continue
        ist, path = defined[name]
        if ist.upper() != soll.upper():
            rep.add(1, "token", rel(path, root),
                    f"Token {name} ist {ist}, vorgeschrieben ist {soll}")
    return defined


def check_contrast(rep):
    """Kontraste neu rechnen statt der Dokumentation zu glauben."""
    card = TOKENS["--surface-1"]
    bg = TOKENS["--bg"]
    for token, minimum in TEXT_MIN.items():
        for flaeche, name in ((card, "Karte"), (bg, "Seitengrund")):
            c = contrast(TOKENS[token], flaeche)
            if c < minimum:
                rep.add(1, "kontrast", "DESIGN-SYSTEM.md",
                        f"{token} auf {name}: {c}:1, gefordert {minimum}:1")
    for token, minimum in MARK_MIN.items():
        c = contrast(TOKENS[token], card)
        if c < minimum:
            rep.add(1, "kontrast", "DESIGN-SYSTEM.md",
                    f"{token} auf Karte: {c}:1, gefordert {minimum}:1")
    c = contrast(TOKENS["--accent-ink"], TOKENS["--accent"])
    if c < 4.5:
        rep.add(1, "kontrast", "DESIGN-SYSTEM.md",
                f"--accent-ink auf --accent: {c}:1, gefordert 4.5:1")


def check_raw_colors(root, rep, token_file_hint="index.css"):
    """Hex- und rgb-Werte, die am Token-System vorbeilaufen."""
    hex_re = re.compile(r"#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3}(?:[0-9a-fA-F]{2})?)?\b")
    rgb_re = re.compile(r"\brgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+")
    allowed = {v.upper() for v in TOKENS.values()}
    for path in walk(root):
        name = os.path.basename(path)
        is_token_file = token_file_hint in name or name in ("theme.css", "tokens.css")
        txt = open(path, encoding="utf-8", errors="ignore").read()
        for ln, line in enumerate(txt.splitlines(), 1):
            if line.lstrip().startswith(("//", "/*", "*")):
                continue
            for m in hex_re.finditer(line):
                val = m.group(0).upper()
                if is_token_file and val in allowed:
                    continue
                if is_token_file:
                    continue
                rep.add(3, "rohfarbe", f"{rel(path, root)}:{ln}",
                        f"Farbwert {m.group(0)} direkt im Code statt ueber ein Token")
            for m in rgb_re.finditer(line):
                if "rgba(255, 255, 255" in line or "rgba(0, 0, 0" in line:
                    continue   # Kantenlicht und Schatten sind erlaubt
                if is_token_file:
                    continue
                rep.add(3, "rohfarbe", f"{rel(path, root)}:{ln}",
                        "rgb/rgba direkt im Code statt ueber ein Token")


def check_scales(root, rep):
    """Abstaende und Radien gegen die Skala."""
    px_re = re.compile(r"\b(border-radius|gap|padding|margin)(?:-[a-z]+)?\s*:\s*([^;]+);")
    for path in walk(root, (".css",)):
        txt = open(path, encoding="utf-8", errors="ignore").read()
        for ln, line in enumerate(txt.splitlines(), 1):
            for m in px_re.finditer(line):
                prop, value = m.group(1), m.group(2)
                if "var(" in value or "%" in value or "calc" in value:
                    continue
                for num in re.findall(r"(-?\d+(?:\.\d+)?)px", value):
                    n = abs(float(num))
                    if prop == "border-radius":
                        if n not in RADII:
                            rep.add(3, "skala", f"{rel(path, root)}:{ln}",
                                    f"Radius {num}px liegt ausserhalb 6/10/14/999")
                    else:
                        if n not in SPACING:
                            rep.add(3, "skala", f"{rel(path, root)}:{ln}",
                                    f"{prop} {num}px liegt ausserhalb der 4er-Skala")


def check_motion(root, rep):
    """Verbotene Animationseigenschaften und fehlende Bewegungsreduktion."""
    found_reduced = False
    for path in walk(root):
        txt = open(path, encoding="utf-8", errors="ignore").read()
        if "prefers-reduced-motion" in txt:
            found_reduced = True
        for ln, line in enumerate(txt.splitlines(), 1):
            m = re.search(r"transition\s*:\s*([^;\"'}]+)", line)
            if m:
                decl = m.group(1).lower()
                for bad in FORBIDDEN_TRANSITION:
                    if re.search(rf"\b{re.escape(bad)}\b", decl):
                        rep.add(4, "bewegung", f"{rel(path, root)}:{ln}",
                                f"transition auf '{bad}' erzwingt Layout- oder "
                                f"Malvorgaenge; nur transform und opacity animieren")
                        break
    if not found_reduced:
        rep.add(1, "bewegung", "-",
                "Kein Block fuer prefers-reduced-motion gefunden")


def check_glass(root, rep):
    """Glas-Budget und Rueckfall."""
    users, has_fallback = [], False
    for path in walk(root):
        txt = open(path, encoding="utf-8", errors="ignore").read()
        if "@supports not (backdrop-filter" in txt.replace("  ", " "):
            has_fallback = True
        for ln, line in enumerate(txt.splitlines(), 1):
            if "backdrop-filter" in line and "supports" not in line:
                users.append(f"{rel(path, root)}:{ln}")
                m = re.search(r"blur\((\d+(?:\.\d+)?)px\)", line)
                if m and float(m.group(1)) > 20:
                    rep.add(4, "glas", f"{rel(path, root)}:{ln}",
                            f"Weichzeichnung {m.group(1)}px ueber dem Budget von 20px")
    if users and not has_fallback:
        rep.add(2, "glas", users[0],
                "backdrop-filter ohne @supports-Rueckfall: ohne Weichzeichnung "
                "kann der Kontrast kippen")
    if len(users) > 6:
        rep.add(4, "glas", "-",
                f"{len(users)} Stellen mit backdrop-filter — Budget sind drei "
                f"gleichzeitig sichtbare Flaechen, bitte pruefen")
    return users


def check_focus(root, rep):
    for path in walk(root):
        txt = open(path, encoding="utf-8", errors="ignore").read()
        for ln, line in enumerate(txt.splitlines(), 1):
            if re.search(r"outline\s*:\s*(none|0)\b", line):
                window = txt.splitlines()[max(0, ln - 3):ln + 4]
                if not any("outline" in w and "none" not in w and "0" not in w
                           for w in window) and not any("ring" in w for w in window):
                    rep.add(1, "fokus", f"{rel(path, root)}:{ln}",
                            "outline: none ohne erkennbaren Ersatz — Fokus "
                            "waere unsichtbar")


def check_numbers(root, rep):
    txt_all = ""
    for path in walk(root):
        txt_all += open(path, encoding="utf-8", errors="ignore").read()
    if "tabular-nums" not in txt_all:
        rep.add(2, "typografie", "-",
                "tabular-nums nirgends gesetzt — Zahlenspalten springen bei "
                "jeder Aktualisierung")
    for path in walk(root):
        txt = open(path, encoding="utf-8", errors="ignore").read()
        for ln, line in enumerate(txt.splitlines(), 1):
            if re.search(r"\b(countUp|CountUp|animateValue|useCountUp)\b", line):
                rep.add(2, "bewegung", f"{rel(path, root)}:{ln}",
                        "Hochzaehlende Zahl gefunden — in einer Finanzanwendung "
                        "unzulaessig")


def check_language(root, rep):
    emoji = re.compile("[\U0001F300-\U0001FAFF☀-➿]")
    for path in walk(root, (".js", ".jsx", ".ts", ".tsx")):
        txt = open(path, encoding="utf-8", errors="ignore").read()
        is_locale = "locales" in path or os.path.basename(path).startswith("de.")
        for ln, line in enumerate(txt.splitlines(), 1):
            low = line.lower()
            for phrase in BLOCKED_PHRASES:
                if phrase in low:
                    rep.add(1, "sprache", f"{rel(path, root)}:{ln}",
                            f"Sperrformulierung '{phrase}' gefunden")
            if emoji.search(line):
                rep.add(3, "sprache", f"{rel(path, root)}:{ln}",
                        "Emoji in der Oberflaeche")
            if is_locale:
                continue
            for word in ENGLISH_UI:
                if re.search(rf'["\'>]\s*{re.escape(word)}\b', line):
                    rep.add(2, "sprache", f"{rel(path, root)}:{ln}",
                            f"Vermutlich englischer Oberflaechentext '{word}' "
                            f"ausserhalb der Locale-Datei")
                    break


def check_untouchables(root, rep):
    """Kernelemente, die ein Redesign nie verlieren darf."""
    needles = {
        "Beleg-Chip": ["evidence-chip", "EvidenceChip", "belegOeffnen"],
        "Demo-Band": ["Demo-Daten", "demo-banner", "demoBanner"],
        "Hinweistext": ["keine Anlageberatung"],
        "Kein Signal": ["Kein Signal", "keinSignal"],
        "keine Daten": ["keine Daten", "keineDaten", "EmptyValue"],
        "Datenvollstaendigkeit": ["ollstaendigkeit", "completeness"],
        "Gegenargument": ["dagegen spricht", "Gegenargument", "counterArgument"],
    }
    blob = ""
    for path in walk(root):
        blob += open(path, encoding="utf-8", errors="ignore").read()
    for label, alts in needles.items():
        if not any(a in blob for a in alts):
            rep.add(1, "funktionsverlust", "-",
                    f"'{label}' im Quelltext nicht mehr auffindbar — "
                    f"moeglicher Funktionsverlust durch den Umbau")


# --------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root", help="Wurzel des Frontend-Quelltexts, z. B. /app/frontend/src")
    ap.add_argument("--json", help="Bericht zusaetzlich als JSON ablegen")
    args = ap.parse_args()

    if not os.path.isdir(args.root):
        print(f"Verzeichnis nicht gefunden: {args.root}", file=sys.stderr)
        return 2

    rep = Report()
    check_contrast(rep)
    check_tokens(args.root, rep)
    check_raw_colors(args.root, rep)
    check_scales(args.root, rep)
    check_motion(args.root, rep)
    check_glass(args.root, rep)
    check_focus(args.root, rep)
    check_numbers(args.root, rep)
    check_language(args.root, rep)
    check_untouchables(args.root, rep)

    by_stufe = defaultdict(list)
    for i in rep.items:
        by_stufe[i["stufe"]].append(i)

    namen = {1: "BLOCKIEREND", 2: "VERSTAENDLICHKEIT", 3: "EINHEITLICHKEIT",
             4: "LEISTUNG", 5: "FEINSCHLIFF"}
    print("=" * 72)
    print("Kompass — Pruefung der Oberflaeche gegen DESIGN-SYSTEM.md")
    print("=" * 72)
    for stufe in sorted(by_stufe):
        items = by_stufe[stufe]
        print(f"\n### Stufe {stufe} — {namen[stufe]}  ({len(items)})")
        seen = defaultdict(int)
        for i in items:
            key = (i["kategorie"], i["befund"][:70])
            seen[key] += 1
        for i in items[:40]:
            print(f"  [{i['kategorie']:16s}] {i['ort']:44s} {i['befund']}")
        if len(items) > 40:
            print(f"  ... und {len(items) - 40} weitere")

    print("\n" + "-" * 72)
    for stufe in (1, 2, 3, 4, 5):
        print(f"  Stufe {stufe} ({namen[stufe]:18s}): {len(by_stufe[stufe])}")
    print("-" * 72)
    if rep.blocking:
        print(f"\nDURCHGEFALLEN — {len(rep.blocking)} blockierende Befunde.")
    elif rep.items:
        print("\nKeine blockierenden Befunde. Uebrige Stufen abarbeiten.")
    else:
        print("\nALLE PRUEFUNGEN BESTANDEN.")

    if args.json:
        with open(args.json, "w", encoding="utf-8") as fh:
            json.dump(rep.items, fh, ensure_ascii=False, indent=2)
        print(f"Bericht abgelegt: {args.json}")

    return 1 if rep.blocking else 0


if __name__ == "__main__":
    sys.exit(main())
