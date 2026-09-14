# AGENTS.md

## Scope and task routing

Peek LLM is an independently maintained interactive knowledge website. Read the [project overview](README.md) and load only the guidance relevant to the task:

| Task | Authority |
| --- | --- |
| Product behavior, dependencies, data, or accessibility | [Contribution contract](CONTRIBUTING.md) and the owning experience README |
| Visual design | [Visual standards and runtime style ownership](CONTRIBUTING.md#layout-shells-and-visual-identity) |
| Source layout, registration, routing, or builds | [Development tools](CONTRIBUTING.md#development-tools) and [registration](CONTRIBUTING.md#adding-an-experience) |
| Plan or build a new experience | [Adding an experience](CONTRIBUTING.md#adding-an-experience) |
| Deploy or diagnose delivery | [Deployment procedure](CONTRIBUTING.md#deployment) |

## Working rules

- Keep the portal in `apps/portal/` and each experience in its owning `packages/<topic>/<id>/`. Client routes and lazy loaders come from `apps/portal/src/experiences.mjs`; keep one Portal HTML entry.
- Follow the contribution contract for modular experiences. Preserve scientific provenance and licenses; leave unrelated implementations unchanged. Start new experiences from learning goals, not historical page layouts or technology choices.
- Keep source, exact dependency versions, and the Node/Python lockfiles in this repository. Do not depend on sibling workspaces, hand-edit build output, commit credentials, or mark first-party code as vendor to bypass checks.
- Before handoff, run `pnpm check` for source/tooling changes. For changes limited to the Portal HTML entry, run `pnpm check:html`. Use the [review checklist](CONTRIBUTING.md#review-checklist) for affected behavior; documentation-only changes require link and consistency checks.
- Follow the [commit message convention](CONTRIBUTING.md#commit-messages) for every commit.
- Do not commit, push, tag, publish, or change external settings without explicit authorization. Deploy only the built `dist/`.

## Documentation ownership

README covers the product and quick start; CONTRIBUTING owns quality requirements and development, registration, creation, and deployment procedures. Keep experience-specific controls, data provenance, research, and licenses with the experience. Document current behavior, durable constraints, and repeatable procedures. Keep one authoritative location for each rule and link to it. Record temporary plans, test-run output, implementation history, and handoffs in tasks or PRs; remove obsolete instructions when behavior changes. Retain scientific provenance and license attribution. Inspect first-party sections selectively; treat vendor blocks as opaque unless the task concerns that dependency.
