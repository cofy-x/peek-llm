#!/usr/bin/env python3
"""Validate Peek LLM's self-contained HTML contract using only the standard library."""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXHIBIT_FILENAME = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*\.html$")


class ExhibitParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.errors: list[str] = []
        self.authored_scripts: list[str] = []
        self.css_fragments: list[str] = []
        self.has_charset = False
        self.has_viewport = False
        self.has_description = False
        self.has_title = False
        self.has_markup_network = False
        self.lang = ""
        self.network_mode: str | None = None
        self._in_body = False
        self._in_head = False
        self._seen_vendor_script = False
        self._script_parts: list[str] | None = None
        self._script_is_vendor = False
        self._style_parts: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {name.lower(): value or "" for name, value in attrs}
        tag = tag.lower()
        is_vendor_script = tag == "script" and "data-peek-vendor" in values
        vendor = values.get("data-peek-vendor", "").strip()

        if self._seen_vendor_script and not is_vendor_script:
            self.errors.append("third-party scripts must be the final elements in body")

        if "data-peek-vendor" in values:
            if tag not in ("script", "style"):
                self.errors.append("data-peek-vendor is only valid on script or style")
            if not re.match(r"^.+@[^@]+$", vendor):
                self.errors.append("data-peek-vendor must name the library and version")

        if tag == "head":
            self._in_head = True
        if tag == "body":
            self._in_body = True
        if "data-peek-vendor" in values:
            if tag == "style" and not self._in_head:
                self.errors.append("third-party style blocks must be in head")
            if tag == "script" and not self._in_body:
                self.errors.append("third-party script blocks must be in body")
        if tag == "base":
            self.errors.append("base elements are forbidden; keep URLs local to this HTML")
        if values.get("ping", "").strip():
            self.errors.append("ping attributes are forbidden")

        if values.get("style", "").strip():
            self.css_fragments.append(values["style"])
        for name, value in values.items():
            if name.startswith("on") and value.strip():
                self.authored_scripts.append(value)
            if not name.startswith("on") and name != "style" and "url(" in value.lower():
                self.css_fragments.append(value)
            if name in ("href", "action", "formaction") and value.strip().lower().startswith("javascript:"):
                self.errors.append("javascript: URLs are forbidden")

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
            if values.get("name", "").lower() == "peek:network":
                if not self._in_head:
                    self.errors.append("peek:network metadata must be in head")
                if self.network_mode is not None:
                    self.errors.append("peek:network metadata must appear at most once")
                self.network_mode = values.get("content", "").strip().lower()
            if values.get("http-equiv", "").lower() == "refresh":
                self.errors.append("meta refresh is forbidden")

        if tag == "script":
            if values.get("type", "").strip().lower() == "importmap":
                self.errors.append("import maps are forbidden; keep code inline")
            if "src" in values:
                self.errors.append("external script src is forbidden")
            else:
                self._script_parts = []
                self._script_is_vendor = is_vendor_script
                if self._script_is_vendor:
                    self._seen_vendor_script = True

        if tag == "style":
            self._style_parts = []

        if tag == "iframe":
            self.errors.append("iframe elements are forbidden; keep content in the main document")

        if tag == "link":
            rel = values.get("rel", "").lower()
            href = values.get("href", "").strip().lower()
            if rel == "icon" and href.startswith("data:"):
                pass
            elif rel != "canonical":
                self.errors.append("linked resources are forbidden; inline them")

        if tag in ("form", "button", "input"):
            for attr in ("action", "formaction"):
                value = values.get(attr, "").strip()
                if value and not value.startswith("#"):
                    self.has_markup_network = True

        if tag in ("image", "feimage", "use"):
            href = (values.get("href") or values.get("xlink:href", "")).strip().lower()
            allowed = ("data:", "#") if tag == "use" else ("data:",)
            if href and not href.startswith(allowed):
                self.errors.append(f"{tag}[href] must reference an inline resource")

        if tag == "script":
            href = (values.get("href") or values.get("xlink:href", "")).strip()
            if href:
                self.errors.append("external script href is forbidden")

        for attr in ("src", "srcset", "poster", "data"):
            value = values.get(attr, "").strip().lower()
            if tag == "script" and attr == "src":
                continue
            if value and not value.startswith("data:"):
                self.errors.append(f"{tag}[{attr}] must be an inline data URI")

    def handle_data(self, data: str) -> None:
        if self._script_parts is not None:
            self._script_parts.append(data)
        if self._style_parts is not None:
            self._style_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "head":
            self._in_head = False
        if tag.lower() == "body":
            self._in_body = False
        if tag.lower() == "script" and self._script_parts is not None:
            if not self._script_is_vendor:
                self.authored_scripts.append("".join(self._script_parts))
            self._script_parts = None
            self._script_is_vendor = False
        if tag.lower() == "style" and self._style_parts is not None:
            self.css_fragments.append("".join(self._style_parts))
            self._style_parts = None


SCRIPT_PATTERNS = {
    "runtime fetch requires declared optional network access": r"\bfetch\s*\(",
    "XMLHttpRequest requires declared optional network access": r"\bXMLHttpRequest\b",
    "WebSocket requires declared optional network access": r"\bWebSocket\s*\(",
    "EventSource requires declared optional network access": r"\bEventSource\s*\(",
    "sendBeacon requires declared optional network access": r"\bsendBeacon\s*\(",
}

FORBIDDEN_SCRIPT_PATTERNS = {
    "module imports are forbidden; keep code in this HTML": r"\bimport\s*(?:\(|(?:[^;\n]*\bfrom\s*)?['\"])",
    "external worker scripts are forbidden; keep worker code inline": r"\b(?:new\s+)?(?:Worker|SharedWorker|importScripts)\s*\(\s*['\"](?!data:|blob:)",
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
    if parser.network_mode not in (None, "optional"):
        errors.append('peek:network content must be "optional"')
    if parser.has_markup_network and parser.network_mode != "optional":
        errors.append("form submission requires declared optional network access")

    css = "\n".join(parser.css_fragments)
    if re.search(r"@import\b", css, flags=re.IGNORECASE):
        errors.append("CSS @import is forbidden; keep styles inline")
    for match in re.finditer(r"url\(([^)]+)\)", css, flags=re.IGNORECASE):
        value = match.group(1).strip(" \t\r\n\"'").lower()
        if value and not value.startswith(("data:", "#")):
            errors.append("CSS url() resources must use inline data URIs")

    authored_script = "\n".join(parser.authored_scripts)
    for label, pattern in SCRIPT_PATTERNS.items():
        if parser.network_mode != "optional" and re.search(pattern, authored_script, flags=re.IGNORECASE):
            errors.append(label)
    for label, pattern in FORBIDDEN_SCRIPT_PATTERNS.items():
        if re.search(pattern, authored_script, flags=re.IGNORECASE):
            errors.append(label)

    return sorted(set(errors))


def valid_exhibit_filename(name: str) -> bool:
    return bool(EXHIBIT_FILENAME.fullmatch(name))


def html_files() -> list[Path]:
    files = sorted(ROOT.glob("*.html"))
    files.extend(sorted(ROOT.glob("*/*.html")))
    return [path for path in files if path.is_file()]


def is_exhibit(path: Path) -> bool:
    return path.parent != ROOT and path.parent != ROOT / "templates"


def main() -> int:
    failures = 0
    files = html_files()
    if not files:
        print("no HTML files found", file=sys.stderr)
        return 1

    for path in files:
        errors = validate_text(path.read_text(encoding="utf-8"))
        if is_exhibit(path) and not valid_exhibit_filename(path.name):
            errors.append("exhibit filename must use lowercase kebab-case")
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
