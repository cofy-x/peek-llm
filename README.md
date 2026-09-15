# Peek LLM

**See how language models work. Open an exhibit, explore its mechanism.**

Peek LLM is an open-source collection of interactive visual explanations of language models. Each experience focuses on one question and lets you explore the mechanism through direct interaction, observable changes, and readable results.

[Live site](https://cofy-x.github.io/peek-llm/) · [中文说明](README.zh-CN.md) · [Contributing](CONTRIBUTING.md)

Every experience stands on its own. Its UI, data, and technology are chosen to serve its learning goal, using text, diagrams, spatial interaction, or replayable animation where they help understanding.

## Develop locally

Use Node.js 22+, pnpm 11.5.1, uv 0.11.25+, and Make. uv manages Python 3.12 and the local `.venv`:

```sh
make install
make dev
make check
make preview
```

`make help` lists commands; `make test-python` runs Python tests. `make check` (also `pnpm check`) runs HTML validation, Python and Node tests, lint, type checking, and a production build. `make build` builds without the full check suite; `make preview` serves `dist/`. Local commands do not publish.

## Project structure

| Location | Responsibility |
| --- | --- |
| `apps/portal/` | React home, navigation, client routes, and `src/experiences.mjs` registry |
| `packages/<topic>/<id>/` | Experience implementation, preview, data, tests, and research |
| `scripts/` | Validation, build helpers, license collection, and deployment checks |

Only registered, finished experiences enter the catalog and build. Public URLs are independent of source paths. The root owns the Node and Python toolchains and their lockfiles; generated `dist/`, dependencies, and research caches stay out of Git.

Experiences use modular source, with dependencies and static assets bundled with the site and loaded from the same origin. All experiences follow the [quality contract](CONTRIBUTING.md). Core functionality needs no backend, runtime CDN, remote fonts, or analytics; optional network features are disclosed and learner-initiated.

See [development and contribution guidance](CONTRIBUTING.md). GitHub Pages must use GitHub Actions and publish only `dist/`; authorized `main` pushes trigger the [deployment workflow](CONTRIBUTING.md#deployment).

## Experiences

Browse the [live collection](https://cofy-x.github.io/peek-llm/) for available experiences. Each experience keeps its controls, data sources, and research in its own documentation.

| Experience | Explore | Documentation |
| --- | --- | --- |
| [Attention Atlas](https://cofy-x.github.io/peek-llm/model-architectures/attention-atlas) | Original Transformer and DeepSeek V4.1 Flash through selectable modules, animated mechanisms, and a guided tour | [Guide](packages/model-architectures/attention-atlas/README.md) |
| [Token Workshop](https://cofy-x.github.io/peek-llm/tokenization/token-workshop) | Encode your text, inspect UTF-8 bytes, replay BPE merges, and compare token IDs | [Guide](packages/tokenization/token-workshop/README.md) |

## License

Code: [MIT](LICENSE). Original explanatory text and visuals: [CC BY 4.0](LICENSE-CONTENT). Third-party code and data retain their licenses; imported Atlas content retains its [original MIT license](packages/model-architectures/attention-atlas/LICENSE-ORIGIN).
