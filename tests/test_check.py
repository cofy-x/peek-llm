from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "check.py"
SPEC = importlib.util.spec_from_file_location("peek_check", SCRIPT)
assert SPEC and SPEC.loader
peek_check = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(peek_check)


BASE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Test exhibit"><title>Test</title>
{head}</head><body>{body}<script>{script}</script></body></html>"""


class SelfContainedContractTests(unittest.TestCase):
    def render(self, *, head: str = "", body: str = "", script: str = "") -> list[str]:
        return peek_check.validate_text(BASE.format(head=head, body=body, script=script))

    def test_allows_external_citation_anchor(self) -> None:
        errors = self.render(body='<a href="https://example.com/paper">Paper</a>')
        self.assertEqual(errors, [])

    def test_rejects_external_script(self) -> None:
        errors = self.render(head='<script src="https://cdn.example/lib.js"></script>')
        self.assertIn("external script src is forbidden", errors)

    def test_rejects_external_stylesheet(self) -> None:
        errors = self.render(head='<link rel="stylesheet" href="https://cdn.example/site.css">')
        self.assertIn("linked resources are forbidden; inline them", errors)

    def test_allows_inline_favicon(self) -> None:
        errors = self.render(head='<link rel="icon" href="data:image/svg+xml,%3Csvg%3E%3C/svg%3E">')
        self.assertEqual(errors, [])

    def test_rejects_external_image(self) -> None:
        errors = self.render(body='<img src="https://example.com/image.png" alt="">')
        self.assertIn("img[src] must be an inline data URI", errors)

    def test_allows_data_uri_image(self) -> None:
        errors = self.render(body='<img src="data:image/svg+xml,%3Csvg%3E%3C/svg%3E" alt="">')
        self.assertEqual(errors, [])

    def test_rejects_css_resource(self) -> None:
        errors = self.render(head="<style>body{background:url('./image.png')}</style>")
        self.assertIn("CSS url() resources must use inline data URIs", errors)

    def test_rejects_runtime_fetch(self) -> None:
        errors = self.render(script="fetch('/data.json')")
        self.assertIn("runtime fetch is forbidden", errors)

    def test_requires_metadata(self) -> None:
        errors = peek_check.validate_text("<!doctype html><html><head></head><body></body></html>")
        self.assertIn("html[lang] is required", errors)
        self.assertIn("description metadata is required", errors)


if __name__ == "__main__":
    unittest.main()
