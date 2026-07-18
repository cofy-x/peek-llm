# AGENTS.md

## Repository purpose

Peek LLM is a public collection of interactive visual explanations for large language model concepts. Every exhibit is a self-contained HTML document that works offline without a build step or runtime dependency.

## Start here

1. Read `README.md` for the product contract.
2. Read `CONTRIBUTING.md` before adding or changing an exhibit.
3. Run `python3 scripts/check.py` and `python3 -m unittest discover -s tests` before committing.

## Hard rules

- Each exhibit is one `.html` file containing all CSS, JavaScript, images, fonts, data, and runtime libraries.
- Do not add CDN resources, package managers, build tools, generated bundles, backends, analytics, or network-dependent runtime behavior.
- Ordinary external citation links are allowed; resources required to render or operate the page are not.
- Preserve license notices for every inlined third-party dependency.
- Clearly distinguish conceptual illustrations, computed examples, and real model traces.
- Keep pages keyboard-operable, touch-friendly, responsive, and compatible with `prefers-reduced-motion`.
- Public content belongs in this repository; private planning, credentials, and release operations belong in `peek-hangar`.
- Do not commit, push, change Pages settings, or modify external services without explicit user authorization.
