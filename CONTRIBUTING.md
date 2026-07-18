# Contributing to Peek LLM

## Exhibit contract

Create exhibits under `exhibits/` with a lowercase kebab-case filename. Start from `templates/exhibit.html`, then maintain the complete experience directly in that one file. The hand-written HTML is both the source and the published artifact; do not create a separate source or distribution copy, and do not generate or bundle it from other files.

Each exhibit must include:

- a specific learning goal and a concise explanation of why the concept exists;
- one primary interaction that changes something the learner can observe;
- replay, reset, keyboard, touch, and reduced-motion behavior where animation is used;
- a clear label for conceptual, computed, or model-derived data;
- a sources section with ordinary links to primary references;
- inline CSS, JavaScript, assets, data, and runtime dependencies;
- third-party library name, version, source, and license notices next to inlined code.

Do not use external scripts, stylesheets, modules, fonts, images, media, analytics, or other remote resources required by the core explanation or primary interaction.
Do not add package managers, build tools, bundlers, frontend frameworks, CSS generators, or generated exhibit artifacts. Repository checks may inspect exhibits but must not rewrite them.

## Mathematics

Preserve non-trivial mathematical expressions in TeX/LaTeX syntax, for example in a nearby comment or `data-tex` attribute. Write static formulas directly as semantic MathML. When formulas must change interactively, inline only the renderer, CSS, and fonts required for offline operation.

Keep the source expression available for copying or inspection, emit accessible semantic output, and explain symbols, dimensions, and units near the formula. Do not use a screenshot or other raster image as the only representation of an equation.

## Styling

Use native CSS, custom properties, and browser layout primitives directly inside the exhibit's `<style>` element. Do not use Tailwind CSS, a CSS generator, a browser-side compiler, or any remote stylesheet.

## Maintainability

Keep first-party HTML, CSS, and JavaScript readable rather than minified, and organize styles, state, computation, rendering, interaction, reset, and initialization into clear sections when the exhibit is complex enough to benefit. Keep all exhibit content directly in the main document instead of using an `iframe` or nested HTML document. Prefer native SVG, Canvas, WebGL, WebGPU, MathML, and browser APIs over third-party code.

Inline a small third-party library only when it materially improves the explanation and the same result would be unreasonable to maintain with browser-native code. A library being technically allowed does not make it a default dependency. Put third-party CSS in its own `<style data-peek-vendor="library-name@version">` block in `head`, and put third-party JavaScript in its own `<script data-peek-vendor="library-name@version">` block after all first-party code. Record the canonical source and complete license notice next to each block. Do not modify library logic; if fonts, images, or other resources must be replaced mechanically with inline `data:` URIs, document those changes next to the vendor block.

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
2. Test keyboard navigation, touch-sized controls, a narrow viewport, and reduced motion.
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
