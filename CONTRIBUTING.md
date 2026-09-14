# Contributing to Peek LLM

## Exhibit contract

Each exhibit teaches a specific mechanism through observation, interaction, and replay. Prefer visual explanation to introductory prose. Label conceptual illustrations, computed examples, and model-derived data separately, and link to primary sources.

Each experience must be understandable independently. Use Attention Atlas as a quality benchmark for clarity, interaction, and visual craft, without requiring its layout or prior knowledge. Prefer 3D, spatial manipulation, and replayable mechanisms when these make relationships easier to understand. Choose readable DOM, SVG, or 2D views where they better serve text, numbers, or mobile interaction; visual effects must explain an observable mechanism.

Experiences use modular source. Dependencies and assets are bundled with the site and loaded from the same origin; core functionality does not depend on external runtime services.

Only completed, registered experiences are published. Follow [Adding an experience](#adding-an-experience) for source ownership and registration.

## Adding an experience

Start with the learner's question, primary interaction, observable outcome, and acceptance criteria in the task or issue. Choose UI, data, models, and technology to serve that goal. Verify data against primary sources and keep reproducible preparation, provenance, and licenses with its owning experience.

Implement `packages/<topic>/<id>/src/entry.tsx` with a default component export. Keep its data, preview, tests, and README in the same package. `apps/portal/index.html` remains the only HTML entry; the Portal owns navigation, route themes, loading states, and error recovery.

Register completed experiences in `apps/portal/src/experiences.mjs`, which supplies both the catalog and lazy routes. Include a unique id, explicit stable `/<topic>/<id>` path, display metadata, accessible preview, source path, lazy import, and justified runtime budget. Keep experience renderers out of the home page's imports. Restart the development server after changing the registry.

The Portal initial-load budget is 400 KB. Each experience budget includes the Portal and its complete runtime closure: JavaScript, CSS, assets, and license notices. `scripts/check-build.mjs` checks budgets and rejects unregistered output. Bundle runtime dependencies locally with full licenses in `THIRD-PARTY-NOTICES.txt`; the retained Fiber 9.6.1 license in `scripts/licenses/` needs review when upgrading.

Run `pnpm check` and the [review checklist](#review-checklist) before handoff, including direct visits, refresh, Back/Forward, loading failures, and the core interaction. Document completed behavior in the experience README; keep execution plans and handoffs in tasks or PRs.

## Development tools

See the [quick start](README.md#develop-locally) for setup and commands. Experiences require HTTP(S) and JavaScript; use `make dev` or `make preview`. The development route `/model-architectures/attention-atlas` becomes `/peek-llm/model-architectures/attention-atlas` in production preview. `pnpm check:html` checks the Portal HTML entry.

The root owns the Node and Python lockfiles. Python is authoring tooling, not a deployed runtime. Keep shared utilities in `scripts/` and experience-specific generators in `packages/<topic>/<id>/scripts/`; run them with `uv run --locked python path/to/script.py`. Resolve owned assets relative to `__file__`, expose explicit CLI arguments, and document outputs beside their owner.

Prefer the standard library; add required packages with `uv add 'name==version'` or `uv add --dev 'name==version'`, keeping `pyproject.toml` and `uv.lock` together. Use one root Python environment and keep `.venv/` untracked. Python tooling tests belong in `tests/` and run through `make test-python`; `pnpm test` discovers Node tooling and registered experience tests. `make papers-download` and `make papers-check` expose the Atlas research downloader and offline verification.

## Deployment

Publish only `dist/` through [Deploy Pages](.github/workflows/pages.yml). GitHub Pages Source must be GitHub Actions (`build_type: workflow`). An authorized push to `main` validates, builds, and deploys; local builds and PR checks do not publish.

Vite's production base and the router basename are `/peek-llm/`. The build copies `index.html` to `404.html` for client-route fallback. A direct route may receive HTTP 404 while the application still loads; development and preview servers provide normal SPA fallback.

Verify the published homepage, direct experience route, refresh, and navigation. Deployment checks compare published HTML, runtime notices, and initial/lazy assets with the build using SHA-256, and check JS/CSS MIME types. For mismatches, inspect the failed resource, Pages Source, and CDN propagation. External settings require explicit authorization.

## Size and dependencies

Use native browser capabilities where sufficient. Source dependencies require exact versions, a lockfile, and full runtime license notices. Register a justified budget covering the entry and transitive JavaScript, CSS, assets, and notices. Keep the home page independent of exhibit renderers; reduce dependencies, data, geometry, and draw calls before raising budgets.

Retain canonical sources, complete licenses, and explanations of mechanical transformations for third-party code and data. Experience budgets cover the complete bundled runtime, as defined in the registry.

## Craft

- Make the primary interaction discoverable on the first screen and give immediate, observable feedback.
- Use motion to explain state changes, with pause, replay/reset, and reduced-motion behavior. Paused scenes must remain stable after transitions settle.
- Design initial, intermediate, and maximum-density states. Keep the subject, comparison, controls, and conclusion visible; compress or group growing information before shrinking essential text.
- Use color consistently for semantic roles. Connectors must express actual relationships and avoid misleading crossings.
- Display raw values unambiguously: distinguish punctuation, whitespace, control characters, token identity, and position.
- Preserve real data and numerical meaning. Document source, version, dimensions, filtering, quantization, and licenses beside the owning data.

## Layout shells and visual identity

Use the product’s CSS custom properties for its visual identity: warm paper for ordinary pages, continuous dark surfaces for immersive scenes, hairline separators, small uppercase labels, serif display headings, and monospace readings. Adapt token usage rather than creating parallel palettes.

Use weights up to 600 for UI and prose; reserve serif 700 for display headings and the wordmark. Establish hierarchy through type family, size, spacing, and semantic neutral colors. Within a panel, reserve the strongest contrast for the focal item; metadata and supporting prose should recede while staying readable.

Keep navigation, title, and an immersive stage on a continuous background. Controls and long labels must fit their rails. Responsive design may reflow or simplify secondary content, but must preserve the core interaction and normal touch scrolling.

Choose layouts from the learning task and available screen space. A linear story, free-scrolling explanation, or persistent workbench are options, not prescribed shells. Keep experience-specific decisions in the owning README.

The runtime values live in [home.css](apps/portal/src/home.css) for the light Portal, [portal.css](apps/portal/src/portal.css) for dark route chrome, and each experience's styles. The startup shell in [index.html](apps/portal/index.html) must agree with the active route theme. Update the owning styles when changing a value; do not maintain a duplicate token stylesheet or depend on an external template.

| Role | Current product values |
| --- | --- |
| Light surface / primary text / muted text | `--bg: #efece4`, `--ink: #2e2b25`, `--muted: #716c5f` |
| Light accent / separator | `--accent: #7c4c1f`, `--line: rgba(46,43,37,.18)` |
| Scene surface / panel / separator | `--scene-bg: #0b141c`, `--scene-panel: #0d1a22`, `--scene-line: #23333d` |
| Scene text / muted text / accent | `--scene-text: #e3ebe9`, `--scene-muted: #8fa3af`, `--scene-accent: #97d8c6` |
| Typography | System sans-serif for UI, `--font-serif` for display headings, `--font-mono` for values |

These are current product baselines, not a requirement to copy a page layout. Use semantic roles consistently; explain selections with labels or outlines as well as color. Keep token boundaries, whitespace, and numerical values readable. For immersive scenes, carry the background through navigation, title, and stage. Keep keyboard focus visible, respect reduced motion, and preserve the primary interaction on mobile.

## Mathematics

Preserve TeX/LaTeX source for non-trivial expressions, such as in `data-tex` or a nearby comment. Use copyable, accessible MathML for static formulas; bundle any dynamic renderer locally. Use semantic prose for variables and code for tensor shapes or literal data. Explain symbols and units; screenshots must not be the only representation of mathematics.

## Maintainability

Keep first-party source readable and separate knowledge data, computation, state, rendering, and interaction as complexity requires. Use native CSS and custom properties; do not add Tailwind, generated CSS, browser-side compilers, or remote stylesheets. Keep content in the main document rather than an iframe.

Track source and necessary licensed runtime data; ignore generated output, dependencies, model weights, and research caches. Public development and data preparation must not depend on a private workspace. Share abstractions only when concrete consumers justify them.

## Optional network features

Core functionality must work without a backend, runtime CDN, remote fonts, analytics, or remote executable code. Loading same-origin bundled assets is ordinary delivery; citations are ordinary links.

Optional network features must declare `<meta name="peek:network" content="optional">`, explain the data and destination before use, require learner activation, and provide a useful fallback. Never embed credentials; learner-supplied credentials, if unavoidable, stay in memory. Dormant vendor APIs do not require a declaration, but invoking network behavior does.

## Review checklist

1. Run `pnpm check` for source or tooling changes; run `pnpm check:html` for changes limited to the Portal HTML entry. Documentation-only changes need link and consistency checks.
2. Test affected behavior in development and production preview, including the nested hosting prefix. Verify core behavior without third-party requests.
3. Check initial, intermediate, and maximum-density states, readable values, meaningful relationships, and agreement between animation and computation.
4. Verify keyboard access, visible focus, touch-sized controls, narrow/wide layouts, reduced motion, and truthful loading/failure states. For optional network features, check disclosure, consent, success, failure, and fallback.
5. For 3D, use desktop at least 1280 × 720 and mobile 390 × 844. Exercise selection, camera reset, zoom, pause/step/replay, touch scrolling, and WebGL failure/context recovery with readable explanatory content. Inspect console and network errors.
6. Verify sources, licenses, budget, publication registration, and data provenance. Follow the [deployment procedure](#deployment) for authorized releases.

## Commit messages

Use `type: concise description` or `type(scope): concise description` for every commit. Choose the type by the change: `feat` for new behavior, `fix` for bug fixes, `docs` for documentation, `refactor` for restructuring without behavior changes, `test` for tests, and `chore` for maintenance. Use imperative descriptions that explain the change.

Examples: `feat: add tokenization experience`, `fix: preserve whitespace in token inspection`, and `docs: clarify local development`.

## Licensing

Contributed code uses [MIT](LICENSE); original explanatory text and visuals use [CC BY 4.0](LICENSE-CONTENT). Contributors must have permission to distribute every asset and retain third-party licenses.
