# Token Workshop

An independent, locally computed exhibit answering: **what token IDs does a model receive from ordinary text?** Open `/tokenization/token-workshop` in development or `/peek-llm/tokenization/token-workshop` in production preview.

## Explore

The first screen places editable text immediately above its computed token boundaries and count. Guided experiments compare `hello world` with `hello  world`, try a Chinese greeting, or inspect the single emoji `👋`. Each experiment gives a concrete observation. Manual edits retain the preceding text for an optional comparison; short underline highlights mark the changed middle region after matching the common token-ID prefix and suffix. This is not a full sequence alignment.

The warm paper surface presents continuous colored text. Graphemes, including combined emoji, appear once even when their bytes span several tokens; proportional color bands and selectable underline segments show those boundaries. Selecting a segment unfolds its vocabulary ID, exact bytes, and a DOM/SVG alignment diagram immediately below the text. Each byte cell is selectable; brackets below mark token boundaries. Long selections scroll horizontally to preserve alignment.

The byte diagram is the primary mechanism view. This exhibit has no Three.js renderer or camera controls. Essential interactions use native buttons and readable text.

“Why was it split this way?” opens optional BPE replay for the selected pre-split piece. The current eligible adjacent pairs and their ranks are listed, with the next winner identified. Reset, Back, Play/Pause, Merge next, and the range input navigate the computed frames. Closing the disclosure stops and resets playback. No playback starts automatically; reduced motion removes the short merge highlight animation.

Sources and runtime licenses share one expandable section at the foot of the exhibit. The whitespace legend pairs each displayed symbol with its name.

Whitespace uses `·` for a space, `↵` for a newline, and `⇥` for a tab. A literal middle dot is escaped as `\u00b7` so it cannot be confused with a space marker. Original text preserves ordinary whitespace. Byte inspection identifies a space as U+0020 / hex `20`.

## Computation and scope

`src/tokenizer.ts` owns pre-splitting, UTF-8 mapping, vocabulary decoding, and immutable merge frames. `src/ribbon-layout.ts` and `src/token-ribbon.tsx` preserve graphemes in the text view, `src/byte-map.tsx` renders code-point/byte/token alignment, `src/merge-replay.tsx` presents BPE choices, and `src/entry.tsx` owns the experiments and selection. Styles belong to this package.

The vocabulary is the complete 100,256-entry **cl100k_base** mergeable vocabulary distributed in exactly pinned `js-tiktoken@1.0.21`. Only that vocabulary subpath is bundled. No runtime CDN, tokenizer API, model weights, or backend is used. The 256-unit input limit bounds synchronous computation and replay memory.

The pre-split pattern follows [OpenAI tiktoken 0.12.0](https://github.com/openai/tiktoken/blob/0.12.0/tiktoken_ext/openai_public.py). Its JavaScript translation explicitly uses Unicode White_Space rather than JavaScript `\s`, and preserves scoped contraction case folding. This avoids the upstream JavaScript pattern’s differing U+0085 and U+FEFF behavior. Replay follows the [educational BPE algorithm](https://github.com/openai/tiktoken/blob/0.12.0/tiktoken/_educational.py), applying an already trained vocabulary; it does not train one.

Special-token spellings are encoded as ordinary text. No chat wrappers or protocol tokens are inserted. Token counts therefore are not API billing estimates. This encoding is not claimed to represent all or the latest models. Vocabulary IDs are categorical; in this particular encoding, mergeable IDs also give merge priority. The diagram expresses byte order and membership, not semantic embeddings. Unicode code-point counts are distinct from grapheme counts.

Incomplete UTF-8 tokens display hexadecimal bytes instead of replacement glyphs. Whitespace markers and escaped controls are display notation, not mutations of the input. Byte ranges are half-open and zero-based.

## Provenance and licenses

- [Canonical vocabulary](https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken): SHA-256 `223921b76ee99bde995b7ff738513eef100fb51d18c93597a113bcffe865b2a7`.
- The test reconstructs canonical base64-token/rank lines from the installed compressed vocabulary, checks all 100,256 entries, and verifies that hash. No duplicate vocabulary file is stored here.
- [js-tiktoken](https://github.com/dqbd/tiktoken/tree/main/js) and tiktoken use MIT. The original license is retained in [LICENSE-TIKTOKEN](LICENSE-TIKTOKEN). Since the npm tarball omits its license file, the same upstream MIT text is retained in [the build license fallback](../../../scripts/licenses/js-tiktoken-1.0.21.txt) and included in runtime notices. Review this fallback on dependency upgrades.
- First-party implementation is covered by the repository MIT license; original explanatory text and preview artwork by CC BY 4.0.

## Verification

`pnpm check` runs vocabulary integrity checks, 17 compact independent official fixtures, replay continuity/coverage checks, and repository lint, type, Python, and production checks. The fixtures are about 2.2 KB and are not bundled. They cover empty input, multilingual text, code, whitespace, emoji, controls, contractions, and special-token spellings. Python is only authoring tooling.

Regenerate the fixed oracle using the root’s locked Python dependencies:

```sh
uv run --locked python packages/tokenization/token-workshop/scripts/fixtures.py
```

Generate a larger deterministic corpus into the ignored artifacts directory when changing computation:

```sh
mkdir -p artifacts/token-workshop
uv run --locked python packages/tokenization/token-workshop/scripts/fixtures.py --random-count 200 --output artifacts/token-workshop/fuzz.json
node --experimental-strip-types packages/tokenization/token-workshop/tests/verify.mjs artifacts/token-workshop/fuzz.json
```

Do not commit generated fuzz corpora. The small committed fixtures allow the routine Node test to run offline without loading Python or fetching vocabulary data.
