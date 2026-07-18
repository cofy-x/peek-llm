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
{head}</head><body>{body}<script>{script}</script>{tail}</body></html>"""


class SelfContainedContractTests(unittest.TestCase):
    def render(
        self, *, head: str = "", body: str = "", script: str = "", tail: str = ""
    ) -> list[str]:
        return peek_check.validate_text(BASE.format(head=head, body=body, script=script, tail=tail))

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

    def test_rejects_css_resource_in_style_attribute(self) -> None:
        errors = self.render(body='<div style="background:url(./image.png)"></div>')
        self.assertIn("CSS url() resources must use inline data URIs", errors)

    def test_rejects_css_import(self) -> None:
        errors = self.render(head='<style>@import "theme.css";</style>')
        self.assertIn("CSS @import is forbidden; keep styles inline", errors)

    def test_rejects_external_svg_image(self) -> None:
        errors = self.render(body='<svg><image href="https://example.com/image.svg"></image></svg>')
        self.assertIn("image[href] must reference an inline resource", errors)

    def test_rejects_external_svg_image_xlink(self) -> None:
        errors = self.render(body='<svg><image xlink:href="image.svg"></image></svg>')
        self.assertIn("image[href] must reference an inline resource", errors)

    def test_rejects_external_svg_paint_resource(self) -> None:
        errors = self.render(body='<svg><path fill="url(https://example.com/paint.svg#fill)"></path></svg>')
        self.assertIn("CSS url() resources must use inline data URIs", errors)

    def test_rejects_undeclared_runtime_fetch(self) -> None:
        errors = self.render(script="fetch('/data.json')")
        self.assertIn("runtime fetch requires declared optional network access", errors)

    def test_rejects_undeclared_runtime_fetch_in_event_handler(self) -> None:
        errors = self.render(body='<button onclick="fetch(\'/data.json\')">Load</button>')
        self.assertIn("runtime fetch requires declared optional network access", errors)

    def test_allows_declared_optional_runtime_fetch(self) -> None:
        errors = self.render(
            head='<meta name="peek:network" content="optional">',
            script="fetch('https://api.example/data.json')",
        )
        self.assertEqual(errors, [])

    def test_rejects_remote_module_even_with_optional_network(self) -> None:
        errors = self.render(
            head='<meta name="peek:network" content="optional">',
            script="import('https://cdn.example/module.js')",
        )
        self.assertIn("module imports are forbidden; keep code in this HTML", errors)

    def test_rejects_relative_module_import(self) -> None:
        errors = self.render(script="import helper from './helper.js'")
        self.assertIn("module imports are forbidden; keep code in this HTML", errors)

    def test_rejects_import_map(self) -> None:
        errors = self.render(body='<script type="importmap">{}</script>')
        self.assertIn("import maps are forbidden; keep code inline", errors)

    def test_rejects_unknown_network_mode(self) -> None:
        errors = self.render(head='<meta name="peek:network" content="required">')
        self.assertIn('peek:network content must be "optional"', errors)

    def test_ignores_dormant_network_api_in_declared_vendor_script(self) -> None:
        errors = self.render(
            tail='<script data-peek-vendor="example-lib@1.0.0">fetch("unused"); url("./unused")</script>'
        )
        self.assertEqual(errors, [])

    def test_requires_vendor_name_and_version(self) -> None:
        errors = self.render(tail='<script data-peek-vendor>void 0</script>')
        self.assertIn("data-peek-vendor must name the library and version", errors)

    def test_allows_declared_vendor_style_in_head(self) -> None:
        errors = self.render(
            head='<style data-peek-vendor="example-lib@1.0.0">.example{color:red}</style>'
        )
        self.assertEqual(errors, [])

    def test_rejects_vendor_style_outside_head(self) -> None:
        errors = self.render(
            body='<style data-peek-vendor="example-lib@1.0.0">.example{color:red}</style>'
        )
        self.assertIn("third-party style blocks must be in head", errors)

    def test_rejects_vendor_script_outside_body(self) -> None:
        errors = self.render(
            head='<script data-peek-vendor="example-lib@1.0.0">void 0</script>'
        )
        self.assertIn("third-party script blocks must be in body", errors)

    def test_requires_vendor_scripts_to_be_last(self) -> None:
        errors = self.render(
            body='<script data-peek-vendor="example-lib@1.0.0">void 0</script>'
        )
        self.assertIn("third-party scripts must be the final elements in body", errors)

    def test_requires_network_declaration_for_form_action(self) -> None:
        errors = self.render(body='<form action="https://api.example/submit"></form>')
        self.assertIn("form submission requires declared optional network access", errors)

    def test_rejects_base_element(self) -> None:
        errors = self.render(head='<base href="https://example.com/">')
        self.assertIn("base elements are forbidden; keep URLs local to this HTML", errors)

    def test_rejects_meta_refresh(self) -> None:
        errors = self.render(head='<meta http-equiv="refresh" content="0; https://example.com">')
        self.assertIn("meta refresh is forbidden", errors)

    def test_rejects_svg_external_script_href(self) -> None:
        errors = self.render(body='<svg><script href="https://cdn.example/lib.js"></script></svg>')
        self.assertIn("external script href is forbidden", errors)

    def test_rejects_inline_iframe_document(self) -> None:
        errors = self.render(body='<iframe srcdoc="&lt;p&gt;nested&lt;/p&gt;"></iframe>')
        self.assertIn("iframe elements are forbidden; keep content in the main document", errors)

    def test_validates_exhibit_filenames(self) -> None:
        self.assertTrue(peek_check.valid_exhibit_filename("kv-cache.html"))
        self.assertFalse(peek_check.valid_exhibit_filename("KV Cache.html"))

    def test_requires_metadata(self) -> None:
        errors = peek_check.validate_text("<!doctype html><html><head></head><body></body></html>")
        self.assertIn("html[lang] is required", errors)
        self.assertIn("description metadata is required", errors)


if __name__ == "__main__":
    unittest.main()
