# Contributing to Peek LLM

## Exhibit contract

Create exhibits under `exhibits/` with a lowercase kebab-case filename. Start from `templates/exhibit.html`, then keep the complete experience in that one file.

Each exhibit must include:

- a specific learning goal and a concise explanation of why the concept exists;
- one primary interaction that changes something the learner can observe;
- replay, reset, keyboard, touch, and reduced-motion behavior where animation is used;
- a clear label for conceptual, computed, or model-derived data;
- a sources section with ordinary links to primary references;
- inline CSS, JavaScript, assets, data, and runtime dependencies;
- third-party library name, version, source, and license notices next to inlined code.

Do not use external scripts, stylesheets, modules, fonts, images, media, API calls, analytics, or other runtime network requests.

## Review checklist

1. Open the file directly with a `file://` URL and complete every interaction.
2. Test keyboard navigation, touch-sized controls, a narrow viewport, and reduced motion.
3. Verify that the animation and displayed numbers agree with the explanation.
4. Run:

```bash
python3 scripts/check.py
python3 -m unittest discover -s tests
```

5. Keep concept changes, tooling changes, and unrelated cleanup in separate commits.

## Licensing

Contributed code is licensed under MIT. Original explanatory text and visual content are licensed under CC BY 4.0. Contributors must have permission to include every asset and must preserve the original license for inlined third-party code.
