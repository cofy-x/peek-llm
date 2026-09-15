/** Graphemes stay intact even when their UTF-8 bytes belong to multiple tokens. */
export interface RibbonToken {
  start: number;
  end: number;
  id: number;
  ordinal: number;
}
export interface RibbonUnit {
  text: string;
  start: number;
  end: number;
  tokens: RibbonToken[];
}
export function ribbonUnits(text: string, tokens: RibbonToken[]): RibbonUnit[] {
  const units: RibbonUnit[] = [];
  const encoder = new TextEncoder();
  let start = 0;
  for (const { segment } of new Intl.Segmenter("en", {
    granularity: "grapheme",
  }).segment(text)) {
    const end = start + encoder.encode(segment).length;
    const owners = tokens.filter(
      (token) => token.end > start && token.start < end,
    );
    const previous = units.at(-1);
    if (
      owners.length === 1 &&
      previous?.tokens.length === 1 &&
      previous.tokens[0]?.ordinal === owners[0]?.ordinal
    ) {
      previous.text += segment;
      previous.end = end;
    } else units.push({ text: segment, start, end, tokens: owners });
    start = end;
  }
  return units;
}
/** Keep unchanged suffixes quiet when one insertion shifts subsequent tokens. */
export function changedOrdinals(
  before: RibbonToken[],
  after: RibbonToken[],
): Set<number> {
  let left = 0;
  while (
    left < before.length &&
    left < after.length &&
    before[left]?.id === after[left]?.id
  )
    left++;
  let rightBefore = before.length - 1;
  let rightAfter = after.length - 1;
  while (
    rightBefore >= left &&
    rightAfter >= left &&
    before[rightBefore]?.id === after[rightAfter]?.id
  ) {
    rightBefore--;
    rightAfter--;
  }
  return new Set(
    after.slice(left, rightAfter + 1).map((token) => token.ordinal),
  );
}
