import { characters, hex, visible } from "./tokenizer";
import type { Part } from "./tokenizer";

export interface Token extends Part {
  pieceIndex: number;
  ordinal: number;
}
export function ByteMap({
  text,
  tokens,
  selected,
  onSelect,
}: {
  text: string;
  tokens: Token[];
  selected: Token;
  onSelect: (ordinal: number) => void;
}) {
  const bytes = new TextEncoder().encode(text);
  const chars = characters(text);
  const overlapping = chars.filter(
    (char) => char.end > selected.start && char.start < selected.end,
  );
  const start = overlapping[0]?.start ?? selected.start;
  const end = overlapping.at(-1)?.end ?? selected.end;
  // The full selected character span is retained; horizontal scroll preserves byte alignment.
  const related = tokens.filter(
    (token) => token.end > start && token.start < end,
  );
  const width = Math.max(300, (end - start) * 44);
  return (
    <div className="tw-byte-map">
      <p className="tw-map-hint">
        Read down: original characters → UTF-8 bytes → token boundaries.
      </p>
      <div
        className="tw-map-scroll"
        tabIndex={0}
        role="region"
        aria-label="Character and byte alignment, scroll horizontally for long selections"
      >
        <div className="tw-map-content" style={{ width }}>
          <div
            className="tw-character-row"
            style={{ gridTemplateColumns: `repeat(${end - start},1fr)` }}
          >
            {overlapping.map((char) => (
              <span
                key={char.start}
                style={{
                  gridColumn: `${char.start - start + 1} / ${char.end - start + 1}`,
                }}
                title={`Input bytes [${char.start}, ${char.end})`}
              >
                {visible(char.char)}
              </span>
            ))}
          </div>
          <svg
            className="tw-map-lines"
            viewBox={`0 0 ${width} 28`}
            aria-hidden="true"
          >
            {overlapping.flatMap((char) =>
              Array.from({ length: char.end - char.start }, (_, i) => {
                const at = char.start + i;
                return (
                  <path
                    key={at}
                    d={`M ${(((char.start + char.end) / 2 - start) / (end - start)) * width} 0 L ${((at - start + 0.5) / (end - start)) * width} 28`}
                    className={
                      at >= selected.start && at < selected.end
                        ? "selected"
                        : ""
                    }
                  />
                );
              }),
            )}
          </svg>
          <div
            className="tw-byte-row"
            style={{ gridTemplateColumns: `repeat(${end - start},1fr)` }}
          >
            {Array.from(bytes.slice(start, end), (byte, i) => {
              const at = start + i;
              const owner = tokens.find(
                (token) => token.start <= at && token.end > at,
              );
              return (
                <button
                  key={at}
                  aria-pressed={owner?.ordinal === selected.ordinal}
                  onClick={() => {
                    if (owner) onSelect(owner.ordinal);
                  }}
                  title={`Input byte ${at}: ${hex(new Uint8Array([byte]))}`}
                >
                  <span>{hex(new Uint8Array([byte]))}</span>
                  <small>{at}</small>
                </button>
              );
            })}
          </div>
          <div
            className="tw-boundary-row"
            style={{ gridTemplateColumns: `repeat(${end - start},1fr)` }}
          >
            {related.map((token) => (
              <button
                key={token.ordinal}
                aria-pressed={token.ordinal === selected.ordinal}
                onClick={() => onSelect(token.ordinal)}
                style={{
                  gridColumn: `${Math.max(start, token.start) - start + 1} / ${Math.min(end, token.end) - start + 1}`,
                }}
                title={`Token ${token.ordinal + 1}, ID ${token.id}, full byte range [${token.start}, ${token.end})`}
              >
                <span>#{token.id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="tw-muted">
        Hex values above; byte offsets below. Brackets mark token boundaries. A
        token may extend beyond this character view.
      </p>
    </div>
  );
}
