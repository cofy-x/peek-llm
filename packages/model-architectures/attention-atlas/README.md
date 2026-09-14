# Attention Atlas

An explorable 3D field guide comparing the original Transformer base model with DeepSeek-V4.1-Flash, grounded in their papers.

The [research notes](RESEARCH.md) define the scientific baseline; the [paper guide](docs/README.md) covers reproducible downloads.

## Experience brief

- **Premise:** inspect how attention, memory, and computation evolved between two encoder–decoder architectures.
- **Feeling:** a calm architectural study, with precise information appearing as the viewer looks closer.
- **Primary action:** select a physical block or use the component browser to unfold its internal computation and follow three animated stages.
- **Focal point:** a full-width, near-frontal architectural overview with external labels; opened mechanisms become the foreground while the surrounding towers recede.
- **States:** a complete architectural overview; one opened mechanism or two related mechanisms side by side; prefill/decode paths; a seven-stop guided tour with pause, manual steps, and completion.
- **Desktop:** compare both models on a shared stage and open field notes when needed. **Mobile:** begin with one model, open one mechanism at a time, and use the related-module button to compare. Explicitly enable 3D gestures to orbit without trapping normal page scrolling.
- **Constraints:** local procedural geometry, no model assets or remote fonts, instanced component details, capped pixel ratio, reduced-motion support, HTML component access, WebGL failure and context-loss recovery.

## Use

Run `make dev` and open `/model-architectures/attention-atlas`. Drag to orbit, scroll or use the plus/minus controls to zoom, and click a block to unfold it. Close module returns to the overview, where the expansion control increases component separation. The component browser exposes all 40 blocks without requiring pointer interaction. Field notes contain the paper explanation and an exact map of all 40 DeepSeek layers, including the two Engram locations.

Opened mechanisms show their internal operation: attention projects Q/K/V, scans an access matrix, and combines values; MoE routes to six experts plus a shared expert and merges their results; separate diagrams explain positions, embeddings, dense networks, residual streams, memory, vision, caches, and speculative decoding. In Compare view, related mechanisms open together by default. Each diagram labels its own computation stage. Toggle Paired view to focus on one module.

Use the three computation steps to inspect a stage and pause playback. Replay restarts the module, and the speed control selects 0.5×, 1×, or 2×. Pause preserves the current signal position. Attention heads and expert counts are labeled from the papers, while matrix cells, scores, routing weights, and token examples are illustrative.

Guided tour runs for about one minute with seven manual steps available. Pause stops token motion and automatic tour advancement. With reduced motion enabled, camera transitions and token animation are suppressed, and the tour advances manually. Escape closes sources or component focus and stops the tour.

The prefill view distinguishes encoder processing, global-KV projection, and retained decoder SWA replay. Decode follows both causal stacks. The context slider changes an illustrative workload and the **global KV only** estimate at the report's 890 bytes/token; it is not an inference benchmark or the original Transformer's context limit.

## Reading the schematic

The original model shows one representative encoder layer and one representative decoder layer, each repeated six times. The DeepSeek model groups repeated attention and MoE stages. Engram and mHC are summarized beside the backbone; the exact layer map and component descriptions explain their scope. Overview cells and sampled matrices are not literal tensor dimensions or a complete expert census. Lines show conceptual dependencies, not measured execution timing. Residual routes and every repeated cache edge are omitted from the overview for legibility.

[Research notes](RESEARCH.md) document verified topology, exact attention schedules, paper sections, and caveats. Paper PDFs can be opened from Sources and individual inspector cards. Run `make papers-download` from the repository root to download checksum-verified research copies into this package's Git-ignored `papers/` directory. The PDFs are not redistributed in the repository or website.

## Sources and attribution

- Vaswani et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762), 2017.
- DeepSeek-AI, [DeepSeek-V4.1-Flash technical report](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/resolve/main/DeepSeek_V41_Tech_Report.pdf), 2026.
- Layout and interaction inspiration: [Original Transformer vs DeepSeek, Peter Gostev](https://transformer-architecture.petergostev.chatgpt.site/). No code, paper figures, or assets from the reference site are included. All scene geometry, preview artwork, and interface illustrations are original procedural work.

The code and preview retain the [source attribution and MIT license](LICENSE-ORIGIN).

## Development

Use the repository [contribution guide](../../../CONTRIBUTING.md) for environment setup, commands, registration, and deployment. Run `make dev` and open `/model-architectures/attention-atlas`; production preview uses `/peek-llm/model-architectures/attention-atlas`.

- `src/architecture.ts` owns model topology and source metadata.
- `src/mechanisms.ts` owns mechanism stages and explanations.
- `src/module-internals.tsx` renders opened mechanisms.
- `src/scene.tsx` owns the 3D scene and camera behavior.
- `src/index.tsx` owns the interface and interaction state; `src/entry.tsx` exports the experience and imports its theme styles.
- [Preview artwork](preview.svg) is an independently maintained conceptual SVG cover. Edit it directly and retain its embedded attribution.

## Design and validation

Keep the overview near-frontal, with amber for the original Transformer and mint for DeepSeek. Place desktop labels outside the towers. Open modules into a large inspection area; recede surrounding geometry and hide overview labels to keep the active mechanism readable. Related mechanisms in Compare view retain their own stage labels.

Keep exact schedules data-driven across the overview, component browser, field notes, and layer map. Use instancing for repeated cells, share geometry and materials, cap pixel ratio, dispose owned resources, and keep React state updates out of render loops.

Run `make check` and the [review checklist](../../../CONTRIBUTING.md#review-checklist). Cover all 40 selectable components and three computation stages, paired views, the seven tour stops, and the exact DeepSeek layer map. Verify stable paused frames, replay, speed controls, Escape, and model switching. At mobile widths, verify normal canvas scrolling with gestures disabled, explicit gesture activation, related-module navigation, and readable notes. Check reduced motion and WebGL recovery.
