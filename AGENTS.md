# AGENTS.md

## Repository purpose

Peek LLM is a public collection of interactive visual explanations for large language model concepts. Each exhibit is maintained directly as the same self-contained HTML file that readers open, save, and share.

## Start here

1. Read `README.md` for the product contract.
2. Read `CONTRIBUTING.md` before adding or changing an exhibit.
3. When inspecting an exhibit, read first-party sections selectively and skip vendor blocks unless the task directly concerns that dependency.
4. Run `python3 scripts/check.py` and `python3 -m unittest discover -s tests` before committing.

## Hard rules

- Each exhibit is one `.html` file containing all CSS, JavaScript, images, fonts, data, and runtime libraries.
- The hand-maintained HTML is both the source and the published artifact. Do not create a separate source tree, distribution copy, package setup, build tool, bundler, frontend framework, CSS generator, or generated exhibit file.
- The core explanation and primary interaction must work through `file://` without CDNs, package installation, build steps, backends, remote assets, or analytics.
- Optional network features are allowed only when they are declared, clearly explained before use, initiated with the learner's knowledge, and have an offline fallback. Never embed credentials or load remote executable code.
- Ordinary external citation links are allowed; remote resources required to render or operate the offline core are not.
- Preserve TeX/LaTeX source for mathematical expressions. Write static formulas directly as accessible MathML; inline an offline renderer only when interactive formulas require one. Do not use equation screenshots as the only representation.
- Use native CSS, custom properties, and browser layout primitives. Do not use Tailwind CSS, browser-side CSS compilers, or generated stylesheets.
- Prefer native browser capabilities over third-party code. Inline a small library only when it materially improves the explanation and a native implementation would be unreasonable to maintain; preserve its name, exact version, canonical source, and complete license notice.
- Keep first-party HTML, CSS, and JavaScript readable and organized by responsibility, with all exhibit content directly in the main document rather than an `iframe` or nested HTML document. Put third-party CSS in separate `<style data-peek-vendor>` blocks in `head`, and third-party JavaScript in `<script data-peek-vendor>` blocks after all first-party code. Do not change library logic; clearly document any mechanical replacement needed to convert fonts, images, or other assets to inline `data:` URIs.
- Clearly distinguish conceptual illustrations, computed examples, and model-derived data or traces.
- Keep pages keyboard-operable, touch-friendly, responsive, and compatible with `prefers-reduced-motion`.
