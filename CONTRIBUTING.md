# Contributing to Peek LLM

## Exhibit contract

Each concept lives in its own lowercase kebab-case directory (for example `tokenization/`). The directory's `index.html` is the concept index, linking to every exhibit of that concept; each exhibit is an additional `.html` file with a specific lowercase kebab-case name (for example `tokenizer-playground.html`). Start exhibits from `templates/slides.html`, `templates/scroll.html`, or `templates/studio.html` (see Layout shells below), then maintain the complete experience directly in that one file. The hand-written HTML is both the source and the published artifact; do not create a separate source or distribution copy, and do not generate or bundle it from other files.

Each exhibit must include:

- a specific learning goal, stated visually rather than in a wall of text;
- one primary interaction on the first screen that changes something the learner can observe;
- animation that explains: state changes must be visible as motion, not just new values;
- replay, reset, keyboard, touch, and reduced-motion behavior where animation is used;
- a clear label for conceptual, computed, or model-derived data;
- a sources section with ordinary links to primary references;
- inline CSS, JavaScript, assets, data, and runtime dependencies;
- third-party library name, version, source, and license notices next to inlined code.

Do not use external scripts, stylesheets, modules, fonts, images, media, analytics, or other remote resources required by the core explanation or primary interaction.
Do not add package managers, build tools, bundlers, frontend frameworks, CSS generators, or generated exhibit artifacts. Repository checks may inspect exhibits but must not rewrite them.

## Size and dependencies

Keep each exhibit file under roughly 1 MB. Duplicating an embedded dataset or library across exhibits is expected and acceptable: every exhibit must stay a self-contained single HTML file, so never split shared dependencies into external files.

When an exhibit approaches the size limit, prefer in order:

1. a smaller alternative library, or a native browser API instead of a library;
2. data subsetting (the GPT-2 merge table in `tokenization/` is the model: 10,497 of 50,000 merges, chosen by usage frequency, with the method documented);
3. embedded compression — gzip the payload and decode it with the native `DecompressionStream` API;
4. a declared optional-network feature with an offline fallback (see Optional network features).

Libraries are inlined as classic-script (IIFE/UMD) builds in `data-peek-vendor` blocks; module imports are forbidden. If a library only ships ESM, a mechanical repackaging into a classic script is allowed when documented next to the vendor block. Check whether the library loads fonts, textures, or other resources at runtime — those must be inlined as `data:` URIs and documented the same way.

## Craft

Exhibits teach through images, motion, and play — text is only a signpost.

- Lead with the interaction: the first screen is the playground, not an introduction.
- Prefer animations, manipulable visuals, and small games over paragraphs. Keep prose to one-line signposts per section.
- Prefer real or model-derived data (clearly labeled) over invented toy data when it materially improves credibility; document how any embedded data was produced and filtered.
- Keep one consistent visual language: the same color should mean the same thing across sections of an exhibit.

## Layout shells and visual identity

Peek LLM has one visual identity — a "technical plate" language whose single source of truth is `templates/design-tokens.html` — and layout shells that share it. Do not fork the color system per exhibit; adapt hue usage, never the base palette.

The identity in brief: warm light paper, hairline rules instead of shadows, corner-bracket frames for stages and instrument readouts, small uppercase letterspaced labels, serif type (`--font-serif`) reserved for display headings, the brand wordmark, and `Fig.`-style captions, and monospace tabular numerals for data. UI, data, and prose stay at weight 600 or below; serif 700 is reserved for display headings and the brand wordmark. Hierarchy comes from family, size, color, and spacing, not from stacking heavier weights. `templates/design-tokens.html` doubles as the living style guide; consult it before inventing a new component.

### Tonal hierarchy

Treat contrast as a limited resource, especially in dense Studio side rails. Within a local panel or section, reserve `--ink` for the current focal item, active state, or key conclusion. Use `--ink-soft` for readings and emphasized supporting text, `--ink-subtle` for pane chrome and explanatory prose, and `--muted` for metadata. Do not give a pane heading, every statistic, and every bold phrase the highest contrast at the same time.

- Use weight 600 for a focal label or reading, 500 for dense data and metadata, and 400 for prose; do not solve hierarchy by making several adjacent elements bold.
- Prefer the semantic neutral tokens from `templates/design-tokens.html` over one-off black opacities. An exhibit may adapt their use to its content, but should not redefine the neutral hierarchy or base palette.
- Keep one primary focal cluster per local panel. Supporting labels, formulas, annotations, and explanatory copy should visibly recede without falling below readable contrast.
- Judge hierarchy in context at both the normal wide layout and a narrow layout. A value that works in isolation can still feel too heavy when repeated through an entire rail.

Templates are the floor, not the ceiling: they provide the contract skeleton, design tokens, and reusable mechanics (the slides deck controller, scroll reveal). They do not prescribe the exhibit's design — compose the experience freely for the concept, and treat the exhibits in `tokenization/` as the quality bar.

- **Slides** (`templates/slides.html`) is the default shell. Choose it when the concept tells a linear story that fits 4–8 screens of one idea each. It gives guided pacing, focused attention, and per-slide lifecycle hooks (`enter`/`leave`) for autoplaying animations.
- **Scroll** (`templates/scroll.html`) is the essay shell. Choose it when the content is dense, reference-like, or needs side-by-side comparison that benefits from free scrolling.
- **Studio** (`templates/studio.html`) is the workbench shell: a single screen with controls and explanation in side panels around a central stage (see `tokenization/tokenizer-studio.html` as the reference implementation). Choose it for state-rich simulations the learner keeps manipulating — decoding loops, attention maps, caches — where persistent controls and a permanent stage beat pagination. Keep the core usable without scrolling; internal panels may scroll independently.

A concept directory may offer the same exhibit in more than one shell (see `tokenization/`). Whichever shell you pick: no scrolling inside the slides shell, and no forced pagination inside the scroll or studio shells.

## Mathematics

Preserve non-trivial mathematical expressions in TeX/LaTeX syntax, for example in a nearby comment or `data-tex` attribute. Write static formulas directly as semantic MathML. When formulas must change interactively, inline only the renderer, CSS, and fonts required for offline operation.

Keep the source expression available for copying or inspection, emit accessible semantic output, and explain symbols, dimensions, and units near the formula. Do not use a screenshot or other raster image as the only representation of an equation.

## Styling

Use native CSS, custom properties, and browser layout primitives directly inside the exhibit's `<style>` element. Do not use Tailwind CSS, a CSS generator, a browser-side compiler, or any remote stylesheet.

## Maintainability

Keep first-party HTML, CSS, and JavaScript readable rather than minified, and organize styles, state, computation, rendering, interaction, reset, and initialization into clear sections when the exhibit is complex enough to benefit. Keep all exhibit content directly in the main document instead of using an `iframe` or nested HTML document. Prefer native SVG, Canvas, WebGL, WebGPU, MathML, and browser APIs over third-party code.

Inline a small third-party library only when it materially improves the explanation and the same result would be unreasonable to maintain with browser-native code. A library being technically allowed does not make it a default dependency. Put third-party CSS in its own `<style data-peek-vendor="library-name@version">` block in `head`, and put third-party JavaScript or embedded third-party datasets in their own `<script data-peek-vendor="name@version">` blocks after all first-party code. Record the canonical source and complete license notice next to each block. Do not modify library logic or dataset content; document any mechanical transformation (filtering, subsetting, or replacement of fonts, images, or other resources with inline `data:` URIs) next to the vendor block.

## Optional network features

Network access is allowed as an optional enhancement for uses such as live data or an online model. It must not be required for the core explanation or primary interaction.

An exhibit that contains authored network calls must:

- declare `<meta name="peek:network" content="optional">` in `<head>`;
- explain what will be requested and which service will receive the request before it occurs;
- let the learner knowingly initiate or enable the feature;
- provide a clear offline state or locally embedded fallback;
- avoid analytics, tracking, remote executable code, and automatic third-party requests on page load;
- never embed credentials. If learner-supplied credentials are unavoidable, keep them in memory only and explain where they are sent.

The validator does not treat dormant network APIs inside a declared vendor script as authored network behavior; invoking those APIs still requires the optional-network declaration and disclosure above.

## Review checklist

1. Open the file directly with a `file://` URL, keep the browser offline, and complete the core explanation and primary interaction.
2. Test keyboard navigation, touch-sized controls, a narrow viewport, and reduced motion. At wide and narrow layouts, confirm that each dense panel has a clear focal item and does not render all headings, readings, and emphasized prose at maximum contrast.
3. Verify that the animation and displayed numbers agree with the explanation.
4. If the exhibit has an optional network feature, test its disclosure, learner-controlled activation, success, failure, and offline fallback.
5. Confirm that the exhibit is the directly maintained source, contains no generated code from first-party tooling, and has no external runtime resources.
6. Run:

```bash
python3 scripts/check.py
python3 -m unittest discover -s tests
```

7. Keep concept changes, tooling changes, and unrelated cleanup in separate commits.

## Licensing

Contributed code is licensed under MIT. Original explanatory text and visual content are licensed under CC BY 4.0. Contributors must have permission to include every asset and must preserve the original license for inlined third-party code.
