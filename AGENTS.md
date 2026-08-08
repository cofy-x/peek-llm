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

All shells share the single "technical plate" visual identity defined in `templates/design-tokens.html` (warm paper, hairline rules, serif display type, UI/data/prose weights ≤ 600, and serif 700 reserved for display headings and the brand wordmark). Templates are the floor (contract skeleton, tokens, mechanics), never the ceiling — design each exhibit freely for its concept. A concept may offer the same content in more than one shell, as `tokenization/` does.

## Task routing

Load only the context required for the task:

| Task | Required context |
| :--- | :--- |
| Change public product behavior or content | Read the product contract in `README.md`, the relevant sections of `CONTRIBUTING.md`, and the target exhibit's first-party sections. |
| Make a visual change | Also read `templates/design-tokens.html` and the relevant shell template. For Studio work, use `templates/studio.html` as the visual authority and `tokenization/tokenizer-studio.html` only as a layout and interaction reference. |
| Change dependencies, embedded data, or optional network behavior | Also read the Size and dependencies, Maintainability, and Optional network features sections of `CONTRIBUTING.md`, plus any relevant data-pipeline documentation. |
| Review or hand off an exhibit change | Follow the Review checklist in `CONTRIBUTING.md`; run `python3 scripts/check.py` and `python3 -m unittest discover -s tests` after the change and before handoff or commit. |

When inspecting an exhibit, read first-party sections selectively and treat vendor blocks as opaque unless the task directly concerns that dependency.

## Visual-change guardrails

- Use the semantic neutral hierarchy in `templates/design-tokens.html`; do not invent per-page grayscale systems or copy arbitrary opacity values from another exhibit.
- In each dense panel, identify one focal item or cluster that may use full `--ink`. Let readings, pane chrome, explanatory prose, and metadata recede through the shared tokens and the 600/500/400 weight roles.
- Review the initial, representative intermediate, and terminal or maximum-density states in both wide and narrow layouts. Keep the current subject, primary comparison, and terminal conclusion visible without clipping.
- Keep every control inside its rail: side rails have fixed widths, so multi-button rows, sliders, and readouts must fit the available content width (rail width minus padding and gaps) at the widest label, the longest value, and uppercase text-transform. A rail that grows a horizontal scrollbar is a defect; shrink padding or letter-spacing, regroup the controls, or shorten labels — never let the overflow ship.
- Give growing collections an explicit density strategy. Prefer semantic compression, grouping, or aggregation of repeated history before shrinking meaningful content or making horizontal scrolling the primary way to discover the current state.
- Use connectors, arrows, paths, and overlays that imply data relationships, direction, or flow only when that meaning helps the learner and is clear from placement, labels, or a legend. This restriction does not apply to structural layout chrome such as panels and frame borders. Do not let relationship marks cross text, controls, nodes, or data cells in a way that suggests an unintended flow.
- Present raw strings and selected data values unambiguously. Visually distinguish punctuation, whitespace, control characters, and special tokens; keep item identity separate from position, type, state, and other metadata when concatenation could be misread.
- Put reusable visual tokens and components in `templates/design-tokens.html` or the relevant shell template, reusable authoring and review policy in `CONTRIBUTING.md`, and page-specific treatments in the exhibit.

## Hard rules

- Each exhibit is one `.html` file containing all CSS, JavaScript, images, fonts, data, and runtime libraries.
- The hand-maintained HTML is both the source and the published artifact. Do not create a separate source tree, distribution copy, package setup, build tool, bundler, frontend framework, CSS generator, or generated exhibit file.
- Keep each exhibit under roughly 1 MB and always self-contained: never split shared datasets or libraries into external files. Handle size with a smaller library, data subsetting, embedded compression (`DecompressionStream`), or a declared optional-network feature — in that order.
- The core explanation and primary interaction must work through `file://` without CDNs, package installation, build steps, backends, remote assets, or analytics.
- Optional network features are allowed only when they are declared, clearly explained before use, initiated with the learner's knowledge, and have an offline fallback. Never embed credentials or load remote executable code.
- Ordinary external citation links are allowed; remote resources required to render or operate the offline core are not.
- Follow the Mathematics contract in `CONTRIBUTING.md`: preserve TeX/LaTeX source, write static formulas as accessible MathML, and use an inlined offline renderer only when dynamic formulas require one. Do not use equation screenshots as the only representation.
- Use native CSS, custom properties, and browser layout primitives. Do not use Tailwind CSS, browser-side CSS compilers, or generated stylesheets.
- Prefer native browser capabilities over third-party code. Inline a small library only when it materially improves the explanation and a native implementation would be unreasonable to maintain; preserve its name, exact version, canonical source, and complete license notice.
- Keep first-party HTML, CSS, and JavaScript readable and organized by responsibility, with all exhibit content directly in the main document rather than an `iframe` or nested HTML document. Put third-party CSS in separate `<style data-peek-vendor>` blocks in `head`, and third-party JavaScript or embedded third-party datasets in `<script data-peek-vendor>` blocks after all first-party code. Do not change library logic or data content; clearly document any mechanical transformation (filtering, subsetting, or conversion of fonts, images, and other assets to inline `data:` URIs) next to the vendor block.
- Clearly distinguish conceptual illustrations, computed examples, and model-derived data or traces.
- Keep pages keyboard-operable, touch-friendly, responsive, and compatible with `prefers-reduced-motion`.
