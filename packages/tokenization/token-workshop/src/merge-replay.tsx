import { useEffect, useState } from "react";
import { hex, label, ranks, visible, type Piece } from "./tokenizer";
export function MergeReplay({ piece }: { piece: Piece }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = piece.frames[step] ?? piece.frames[0];
  const total = piece.frames.length - 1;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step >= total) setPlaying(false);
      else setStep(step + 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [playing, step, total]);
  if (!frame) return null;
  const candidates = frame.parts.slice(0, -1).flatMap((left, i) => {
    const right = frame.parts[i + 1];
    if (!right) return [];
    const rank = ranks.get(piece.bytes.slice(left.start, right.end).join(","));
    return rank === undefined
      ? []
      : [{ start: left.start, end: right.end, rank }];
  });
  const winner = candidates.reduce<(typeof candidates)[number] | undefined>(
    (best, item) => (!best || item.rank < best.rank ? item : best),
    undefined,
  );
  function move(value: number) {
    setPlaying(false);
    setStep(value);
  }
  return (
    <div className="tw-replay">
      <p>
        Replay the pre-split piece{" "}
        <strong className="tw-code">{visible(piece.text)}</strong>. A fixed
        pattern splits text first; BPE never merges across those boundaries.
      </p>
      <div className="tw-replay-controls">
        <button onClick={() => move(0)}>Reset</button>
        <button disabled={step === 0} onClick={() => move(step - 1)}>
          ← Back
        </button>
        <button
          disabled={!total}
          onClick={() => {
            if (step === total) setStep(0);
            setPlaying(!playing);
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button disabled={step === total} onClick={() => move(step + 1)}>
          Merge next →
        </button>
        <span>
          {step} / {total} merges
        </span>
      </div>
      <input
        aria-label="BPE merge step"
        type="range"
        min={0}
        max={total}
        value={step}
        onChange={(event) => move(Number(event.target.value))}
      />
      <div className="tw-merge-groups" aria-label="Current BPE groups">
        {frame.parts.map((part) => (
          <span
            key={`${part.start}-${part.end}`}
            className={frame.merged?.start === part.start ? "just-merged" : ""}
            data-next={
              winner && part.start >= winner.start && part.end <= winner.end
            }
            title={`Bytes: ${hex(piece.bytes.slice(part.start, part.end))}`}
          >
            <b>{label(piece.bytes.slice(part.start, part.end))}</b>
            <small>#{part.id}</small>
          </span>
        ))}
      </div>
      <p className="tw-next-merge" aria-live="polite">
        {winner ? (
          <>
            Next: join bytes [{winner.start}, {winner.end}) using rank{" "}
            <strong>{winner.rank}</strong>, the lowest eligible rank. Equal
            ranks are resolved left first.
          </>
        ) : (
          <>
            No eligible adjacent pairs remain. These {frame.parts.length} groups
            are the final tokens for this piece.
          </>
        )}
      </p>
      {candidates.length > 0 && (
        <div className="tw-candidates">
          <table>
            <caption>Eligible adjacent pairs at this step</caption>
            <thead>
              <tr>
                <th>Combined bytes (hex)</th>
                <th>Rank</th>
                <th>Choice</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((item) => (
                <tr
                  key={item.start}
                  className={item === winner ? "chosen" : ""}
                >
                  <td>{hex(piece.bytes.slice(item.start, item.end))}</td>
                  <td>{item.rank}</td>
                  <td>{item === winner ? "Next merge" : "Wait"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="tw-muted">
        This applies an already trained vocabulary. Rank is a fixed merge
        priority, not the frequency of a pair in your sentence. All ranges here
        are relative to this piece.
      </p>
    </div>
  );
}
