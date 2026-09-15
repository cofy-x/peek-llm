import { visible } from "./tokenizer";
import { ribbonUnits, type RibbonToken } from "./ribbon-layout";
export function TokenRibbon({
  text,
  tokens,
  selected,
  onSelect,
  changed = new Set<number>(),
}: {
  text: string;
  tokens: RibbonToken[];
  selected: number | null;
  onSelect: (ordinal: number) => void;
  changed?: Set<number>;
}) {
  return (
    <div className="tw-ribbon" aria-label="Token boundaries in continuous text">
      {ribbonUnits(text, tokens).map((unit) => {
        const first = unit.tokens[0];
        if (!first) return null;
        if (unit.tokens.length === 1)
          return (
            <button
              key={unit.start}
              className="tw-ribbon-word"
              style={{ background: `var(--token-${first.ordinal % 5})` }}
              aria-pressed={selected === first.ordinal}
              data-changed={changed.has(first.ordinal)}
              onClick={() => onSelect(first.ordinal)}
              title={`Token ${first.ordinal + 1} · ID ${first.id}`}
              aria-label={`Token ${first.ordinal + 1}: ${visible(unit.text)}`}
            >
              {visible(unit.text)}
            </button>
          );
        const stops = unit.tokens
          .map((token) => {
            const a =
              ((Math.max(unit.start, token.start) - unit.start) /
                (unit.end - unit.start)) *
              100;
            const b =
              ((Math.min(unit.end, token.end) - unit.start) /
                (unit.end - unit.start)) *
              100;
            return `var(--token-${token.ordinal % 5}) ${a}% ${b}%`;
          })
          .join(",");
        return (
          <span
            key={unit.start}
            className="tw-ribbon-split"
            style={{
              background: `linear-gradient(90deg,${stops})`,
              minWidth: unit.tokens.length * 44,
            }}
          >
            <span aria-hidden="true">{visible(unit.text)}</span>
            <span className="tw-ribbon-hits">
              {unit.tokens.map((token) => (
                <button
                  key={token.ordinal}
                  style={{
                    flex:
                      Math.min(unit.end, token.end) -
                      Math.max(unit.start, token.start),
                  }}
                  aria-pressed={selected === token.ordinal}
                  data-changed={changed.has(token.ordinal)}
                  onClick={() => onSelect(token.ordinal)}
                  title={`Token ${token.ordinal + 1} · ID ${token.id} · shares this character`}
                  aria-label={`Token ${token.ordinal + 1}: bytes [${Math.max(unit.start, token.start)}, ${Math.min(unit.end, token.end)}) of ${unit.text}`}
                />
              ))}
            </span>
            <span className="tw-shared-count" aria-hidden="true">
              {unit.tokens.length} tokens
            </span>
          </span>
        );
      })}
    </div>
  );
}
