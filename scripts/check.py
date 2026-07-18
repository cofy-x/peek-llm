#!/usr/bin/env python3
"""Validate Peek LLM's self-contained HTML contract using only the standard library."""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCAN_DIRS = (ROOT / "exhibits", ROOT / "templates")
NETWORK_SCHEMES = ("http://", "https://", "//")


class ExhibitParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.errors: list[str] = []
        self.has_charset = False
        self.has_viewport = False
        self.has_description = False
        self.has_title = False
        self.lang = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {name.lower(): value or "" for name, value in attrs}
        tag = tag.lower()

        if tag == "html":
            self.lang = values.get("lang", "").strip()
        elif tag == "title":
            self.has_title = True
        elif tag == "meta":
            if values.get("charset", "").lower() == "utf-8":
                self.has_charset = True
            if values.get("name", "").lower() == "viewport":
                self.has_viewport = True
            if values.get("name", "").lower() == "description" and values.get("content", "").strip():
                self.has_description = True

        if tag == "script" and "src" in values:
            self.errors.append("external script src is forbidden")

        if tag == "link":
            rel = values.get("rel", "").lower()
            href = values.get("href", "").strip().lower()
            if rel == "icon" and href.startswith("data:"):
                pass
            elif rel != "canonical":
                self.errors.append("linked resources are forbidden; inline them")

        for attr in ("src", "srcset", "poster", "data"):
            value = values.get(attr, "").strip().lower()
            if value and not value.startswith(("data:", "#")):
                self.errors.append(f"{tag}[{attr}] must be an inline data URI")


SCRIPT_PATTERNS = {
    "runtime fetch is forbidden": r"\bfetch\s*\(",
    "XMLHttpRequest is forbidden": r"\bXMLHttpRequest\b",
    "WebSocket is forbidden": r"\bWebSocket\s*\(",
    "EventSource is forbidden": r"\bEventSource\s*\(",
    "external module import is forbidden": r"\bimport\s*(?:\([^)]*https?://|[^;\n]*\bfrom\s*['\"]https?://)",
}


def validate_text(text: str) -> list[str]:
    parser = ExhibitParser()
    parser.feed(text)
    errors = list(parser.errors)

    if not parser.lang:
        errors.append("html[lang] is required")
    if not parser.has_charset:
        errors.append("UTF-8 charset metadata is required")
    if not parser.has_viewport:
        errors.append("viewport metadata is required")
    if not parser.has_description:
        errors.append("description metadata is required")
    if not parser.has_title:
        errors.append("title is required")

    for match in re.finditer(r"url\(([^)]+)\)", text, flags=re.IGNORECASE):
        value = match.group(1).strip(" \t\r\n\"'").lower()
        if value and not value.startswith(("data:", "#")):
            errors.append("CSS url() resources must use inline data URIs")

    for label, pattern in SCRIPT_PATTERNS.items():
        if re.search(pattern, text, flags=re.IGNORECASE):
            errors.append(label)

    return sorted(set(errors))


def html_files() -> list[Path]:
    files = [ROOT / "index.html"]
    for directory in SCAN_DIRS:
        files.extend(sorted(directory.glob("*.html")))
    return [path for path in files if path.is_file()]


def main() -> int:
    failures = 0
    files = html_files()
    if not files:
        print("no HTML files found", file=sys.stderr)
        return 1

    for path in files:
        errors = validate_text(path.read_text(encoding="utf-8"))
        if errors:
            failures += 1
            print(f"{path.relative_to(ROOT)}:", file=sys.stderr)
            for error in errors:
                print(f"  - {error}", file=sys.stderr)
        else:
            print(f"ok: {path.relative_to(ROOT)}")

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
