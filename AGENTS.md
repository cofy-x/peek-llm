# AGENTS.md

## Repository purpose

Peek LLM is a public collection of interactive visual explanations for large language model concepts. Each exhibit is maintained directly as the same self-contained HTML file that readers open, save, and share.

## Layout

Each concept has its own kebab-case directory (for example `tokenization/`) containing an `index.html` concept index plus one HTML file per exhibit. The repository root holds the site home page, the exhibit templates under `templates/`, and contributor checks under `scripts/` and `tests/`.

## Choosing a shell

Before implementing an exhibit, evaluate which layout shell fits the concept, following the full rules in `CONTRIBUTING.md` (Layout shells and visual identity):

- **Slides** (`templates/slides.html`) — default. A linear story in 4–8 screens of one idea each.
- **Scroll** (`templates/scroll.html`) — dense, reference-like content that needs free scrolling and comparison.
- **Studio** (`templates/studio.html`) — a single-screen workbench (side panels + central stage) for state-rich simulations the learner keeps manipulating; `tokenization/tokenizer-studio.html` is the reference implementation.

All shells share the single warm-paper light visual identity defined in `templates/design-tokens.html`. Templates are the floor (contract skeleton, tokens, mechanics), never the ceiling — design each exhibit freely for its concept. A concept may offer the same content in more than one shell, as `tokenization/` does.

## Start here

1. Read `README.md` for the product contract.
2. Read `CONTRIBUTING.md` before adding or changing an exhibit.
3. When inspecting an exhibit, read first-party sections selectively and skip vendor blocks unless the task directly concerns that dependency.
4. Run `python3 scripts/check.py` and `python3 -m unittest discover -s tests` before committing.

## Hard rules

- Each exhibit is one `.html` file containing all CSS, JavaScript, images, fonts, data, and runtime libraries.
- The hand-maintained HTML is both the source and the published artifact. Do not create a separate source tree, distribution copy, package setup, build tool, bundler, frontend framework, CSS generator, or generated exhibit file.
- Keep each exhibit under roughly 1 MB and always self-contained: never split shared datasets or libraries into external files. Handle size with a smaller library, data subsetting, embedded compression (`DecompressionStream`), or a declared optional-network feature — in that order.
- The core explanation and primary interaction must work through `file://` without CDNs, package installation, build steps, backends, remote assets, or analytics.
- Optional network features are allowed only when they are declared, clearly explained before use, initiated with the learner's knowledge, and have an offline fallback. Never embed credentials or load remote executable code.
- Ordinary external citation links are allowed; remote resources required to render or operate the offline core are not.
- Preserve TeX/LaTeX source for mathematical expressions. Write static formulas directly as accessible MathML; inline an offline renderer only when interactive formulas require one. Do not use equation screenshots as the only representation.
- Use native CSS, custom properties, and browser layout primitives. Do not use Tailwind CSS, browser-side CSS compilers, or generated stylesheets.
- Prefer native browser capabilities over third-party code. Inline a small library only when it materially improves the explanation and a native implementation would be unreasonable to maintain; preserve its name, exact version, canonical source, and complete license notice.
- Keep first-party HTML, CSS, and JavaScript readable and organized by responsibility, with all exhibit content directly in the main document rather than an `iframe` or nested HTML document. Put third-party CSS in separate `<style data-peek-vendor>` blocks in `head`, and third-party JavaScript or embedded third-party datasets in `<script data-peek-vendor>` blocks after all first-party code. Do not change library logic or data content; clearly document any mechanical transformation (filtering, subsetting, or conversion of fonts, images, and other assets to inline `data:` URIs) next to the vendor block.
- Clearly distinguish conceptual illustrations, computed examples, and model-derived data or traces.
- Keep pages keyboard-operable, touch-friendly, responsive, and compatible with `prefers-reduced-motion`.
