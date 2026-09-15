import { useMemo, useState } from "react";
import {
  characters,
  finalParts,
  hex,
  label,
  tokenize,
  visible,
} from "./tokenizer";
import type { Piece } from "./tokenizer";
import { ByteMap, type Token } from "./byte-map";
import { TokenRibbon } from "./token-ribbon";
import { changedOrdinals } from "./ribbon-layout";
import { MergeReplay } from "./merge-replay";
import "./styles.css";
const initial = "Hello, 世界! 👋";
const decoder = new TextDecoder("utf-8", { fatal: true });
function describe(text: string, bytes: Uint8Array, token: Token) {
  try {
    decoder.decode(bytes.slice(token.start, token.end));
    return {
      value: label(bytes.slice(token.start, token.end)),
      partial: false,
    };
  } catch {
    return {
      value: visible(
        characters(text)
          .filter((char) => char.end > token.start && char.start < token.end)
          .map((char) => char.char)
          .join(""),
      ),
      partial: true,
    };
  }
}
function allTokens(text: string) {
  return tokenize(text)
    .flatMap((piece, pieceIndex) =>
      finalParts(piece).map((part) => ({
        ...part,
        start: piece.start + part.start,
        end: piece.start + part.end,
        pieceIndex,
      })),
    )
    .map((token, ordinal) => ({ ...token, ordinal }));
}
function BpeDisclosure({ piece }: { piece: Piece }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="tw-how"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        <span>Why was it split this way?</span>
        <span>Explore BPE →</span>
      </summary>
      {open && <MergeReplay piece={piece} />}
    </details>
  );
}
export default function TokenWorkshop() {
  const [text, setText] = useState(initial);
  const [before, setBefore] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [experiment, setExperiment] = useState<
    "space" | "chinese" | "emoji" | null
  >(null);
  const pieces = useMemo(() => tokenize(text), [text]);
  const tokens = useMemo(
    () =>
      pieces
        .flatMap((piece, pieceIndex) =>
          finalParts(piece).map((part) => ({
            ...part,
            start: part.start + piece.start,
            end: part.end + piece.start,
            pieceIndex,
          })),
        )
        .map((token, ordinal) => ({ ...token, ordinal })),
    [pieces],
  );
  const bytes = useMemo(() => new TextEncoder().encode(text), [text]);
  const previous = useMemo(
    () => (before === null ? [] : allTokens(before)),
    [before],
  );
  const token = selected === null ? undefined : tokens[selected];
  const display = token ? describe(text, bytes, token) : undefined;
  const piece = token ? pieces[token.pieceIndex] : undefined;
  const changed =
    before === null ? new Set<number>() : changedOrdinals(previous, tokens);
  function edit(value: string) {
    if (value === text) return;
    setBefore(text);
    setText(value);
    setSelected(null);
    setExperiment(null);
  }
  function run(kind: "space" | "chinese" | "emoji") {
    setExperiment(kind);
    if (kind === "space") {
      setBefore("hello world");
      setText("hello  world");
      setSelected(1);
    }
    if (kind === "chinese") {
      setBefore("Hello, world!");
      setText("你好，世界！");
      setSelected(null);
    }
    if (kind === "emoji") {
      setBefore(null);
      setText("👋");
      setSelected(0);
    }
  }
  return (
    <article className="tw">
      <header className="tw-header">
        <p className="tw-eyebrow">TOKEN WORKSHOP / CL100K_BASE</p>
        <h1>A token isn’t a word.</h1>
        <p>Change the text. Find the boundaries. Open what surprises you.</p>
      </header>
      <section className="tw-lab" aria-label="Text and token experiment">
        <div className="tw-editor-heading">
          <label htmlFor="tw-input">YOUR TEXT</label>
          <span>Stays in your browser · up to 256 UTF-16 units</span>
        </div>
        <textarea
          id="tw-input"
          rows={2}
          value={text}
          maxLength={256}
          onChange={(event) => edit(event.target.value)}
          spellCheck={false}
          aria-describedby="tw-input-help"
        />
        <div className="tw-experiments" aria-label="Guided experiments">
          <span>TRY AN EXAMPLE</span>
          <button onClick={() => run("space")}>+ Add a space</button>
          <button onClick={() => run("chinese")}>换 Try Chinese</button>
          <button onClick={() => run("emoji")}>👋 Open an emoji</button>
        </div>
        <div className="tw-results-heading">
          <h2>What the model receives</h2>
          <div className="tw-count" aria-live="polite">
            <strong>{tokens.length}</strong> tokens{" "}
            <span>
              from {Array.from(text).length} code point
              {Array.from(text).length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        <TokenRibbon
          text={text}
          tokens={tokens}
          selected={selected}
          onSelect={setSelected}
          changed={changed}
        />
        {!tokens.length && (
          <p className="tw-empty">
            Type something above to see its token boundaries.
          </p>
        )}
        <div id="tw-input-help" className="tw-notation">
          <ul className="tw-symbols" aria-label="Whitespace symbols">
            <li title="Space · U+0020 · UTF-8 byte 20"><span aria-hidden="true">·</span>Space</li>
            <li title="Newline · U+000A · UTF-8 byte 0A"><span aria-hidden="true">↵</span>Newline</li>
            <li title="Tab · U+0009 · UTF-8 byte 09"><span aria-hidden="true">⇥</span>Tab</li>
          </ul>
          <span className="tw-inspect-hint">
            Select a token to explore
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 3v13m-5-5 5 5 5-5" /></svg>
          </span>
        </div>
        <p className="tw-partial-note">
          Each character appears once. A divided underline means its bytes
          belong to several tokens; click a segment to unfold it.
        </p>
        {experiment && (
          <div className="tw-discovery" role="status">
            <span>NOTICE</span>
            <p>
              {experiment === "space" ? (
                <>
                  One extra space, one extra token. The first space becomes its
                  own token; the second stays attached to <code>world</code>.
                </>
              ) : experiment === "chinese" ? (
                <>
                  A similar greeting has a different token count. This tokenizer
                  does not assign one token to each Chinese character.
                </>
              ) : (
                <>
                  One visible emoji, <strong>{tokens.length} tokens</strong>.
                  Follow its four UTF-8 bytes below to see where they split.
                </>
              )}
            </p>
          </div>
        )}
        {before !== null && (
          <details
            className="tw-before"
            open={experiment === "space" || undefined}
          >
            <summary>
              Compare with before · {previous.length} → {tokens.length} tokens
            </summary>
            <p className="tw-before-text">{visible(before) || "(empty)"}</p>
            <p>
              Underlines in the current result mark the changed region; matching
              prefixes and suffixes keep their place in the comparison.
            </p>
          </details>
        )}
        {token && display && piece ? (
          <section
            className="tw-inspection"
            aria-label="Selected token inspection"
          >
            <div className="tw-inspection-heading">
              <div>
                <p className="tw-eyebrow">
                  TOKEN {token.ordinal + 1} / A CLOSER LOOK
                </p>
                <h2>
                  {display.partial
                    ? "A boundary inside a character."
                    : "These bytes belong together."}
                </h2>
              </div>
              <div className="tw-id">
                <span>VOCABULARY ID</span>
                <strong>{token.id}</strong>
              </div>
            </div>
            <p className="tw-insight">
              {display.partial ? (
                <>
                  This token contains only part of a highlighted character’s
                  UTF-8 encoding. The original character appears once below; its
                  bytes belong to separate tokens.
                </>
              ) : (
                <>
                  The highlighted text occupies {token.end - token.start} byte
                  {token.end - token.start === 1 ? "" : "s"}. This tokenizer
                  stores that byte sequence as vocabulary entry{" "}
                  <strong>{token.id}</strong>.
                </>
              )}
            </p>
            <ByteMap
              text={text}
              tokens={tokens}
              selected={token}
              onSelect={setSelected}
            />
            <div className="tw-readings">
              <span>
                <b>Selected bytes</b>
                <code>{hex(bytes.slice(token.start, token.end))}</code>
              </span>
              <span>
                <b>Input byte range</b>
                <code>
                  [{token.start}, {token.end})
                </code>
              </span>
              {bytes.slice(token.start, token.end).includes(32) && (
                <span>
                  <b>Contains a space</b>
                  <code>U+0020 · byte 20</code>
                </span>
              )}
            </div>
            <BpeDisclosure key={`${text}-${token.pieceIndex}`} piece={piece} />
          </section>
        ) : (
          <div className="tw-prompt">
            <span>↳</span>
            <p>
              Select any token above to connect it to the original text.
              <br />
              <small>
                Try “Open an emoji” to see a boundary inside a character.
              </small>
            </p>
          </div>
        )}
      </section>
      <details className="tw-sources">
        <summary><span>Sources & licenses</span><span className="tw-source-caption">References and how to read this exhibit</span></summary>
        <p>
          This exhibit uses the complete cl100k_base mergeable vocabulary from
          js-tiktoken 1.0.21 (MIT). It shows ordinary text encoding, without
          chat wrappers or special tokens. It does not represent every model’s
          tokenizer, estimate billing, or run a language model.
        </p>
        <p>
          The byte diagram shows computed byte boundaries. The replay applies
          the fixed vocabulary, not vocabulary training. IDs also serve as merge
          ranks in this encoding. Code-point counts are not user-perceived
          character counts.
        </p>
        <p>
          <a href="https://github.com/openai/tiktoken/blob/0.12.0/tiktoken/_educational.py">
            OpenAI BPE educational reference
          </a>{" "}
          ·{" "}
          <a href="https://github.com/openai/tiktoken/blob/0.12.0/tiktoken_ext/openai_public.py">
            Encoding definition and vocabulary hash
          </a>{" "}
          ·{" "}
          <a href="https://github.com/dqbd/tiktoken/tree/main/js">
            JavaScript implementation
          </a>{" "}
          ·{" "}
          <a href={`${import.meta.env.BASE_URL}THIRD-PARTY-NOTICES.txt`}>
            Runtime licenses
          </a>
        </p>
      </details>
    </article>
  );
}
