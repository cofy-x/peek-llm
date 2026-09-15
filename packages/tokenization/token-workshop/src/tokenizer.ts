import vocabulary from "js-tiktoken/ranks/cl100k_base";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true });
// Unicode White_Space differs from JavaScript \s at U+0085 and U+FEFF.
// This ports the official pre-split expression, including scoped case folding.
const pattern =
  /'(?:[sSſdDmMtT]|[lL][lL]|[vV][eE]|[rR][eE])|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}| ?[^\p{White_Space}\p{L}\p{N}]+[\r\n]*|\p{White_Space}+(?![\s\S])|\p{White_Space}*[\r\n]|\p{White_Space}+(?!\P{White_Space})|\p{White_Space}/gu;
export const ranks = new Map<string, number>();
for (const line of vocabulary.bpe_ranks.split("\n").filter(Boolean)) {
  const [, offset, ...values] = line.split(" ");
  values.forEach((value, index) => {
    const bytes = Array.from(atob(value), (char) => char.charCodeAt(0));
    ranks.set(bytes.join(","), Number(offset) + index);
  });
}
export interface Part {
  start: number;
  end: number;
  id: number;
}
export interface Frame {
  parts: Part[];
  merged?: Part;
}
export interface Piece {
  text: string;
  start: number;
  bytes: Uint8Array;
  frames: Frame[];
}
export function visible(text: string): string {
  return text
    .replace(/·/g, "\\u00b7")
    .replace(/ /g, "·")
    .replace(/\n/g, "↵")
    .replace(/\r/g, "␍")
    .replace(/\t/g, "⇥")
    .replace(
      /[\p{Cc}\u00a0\u2028\u2029\ufeff]/gu,
      (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
    );
}
export function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) =>
    b.toString(16).padStart(2, "0").toUpperCase(),
  ).join(" ");
}
export function label(bytes: Uint8Array): string {
  try {
    return visible(decoder.decode(bytes));
  } catch {
    return `0x ${hex(bytes)}`;
  }
}
export function trace(bytes: Uint8Array): Frame[] {
  let parts = Array.from(bytes, (_byte, start) => ({
    start,
    end: start + 1,
    id: ranks.get(bytes.slice(start, start + 1).join(",")) ?? -1,
  }));
  const frames: Frame[] = [{ parts }];
  while (parts.length > 1) {
    let best = Infinity;
    let at = -1;
    for (let i = 0; i < parts.length - 1; i++) {
      const left = parts[i];
      const right = parts[i + 1];
      if (!left || !right) continue;
      const rank = ranks.get(bytes.slice(left.start, right.end).join(","));
      if (rank !== undefined && rank < best) {
        best = rank;
        at = i;
      }
    }
    if (at < 0) break;
    const left = parts[at];
    const right = parts[at + 1];
    if (!left || !right) break;
    const merged = { start: left.start, end: right.end, id: best };
    parts = [...parts.slice(0, at), merged, ...parts.slice(at + 2)];
    frames.push({ parts, merged });
  }
  return frames;
}
export function tokenize(text: string): Piece[] {
  let start = 0;
  return Array.from(text.matchAll(pattern), (match) => {
    const bytes = encoder.encode(match[0]);
    const piece = { text: match[0], start, bytes, frames: trace(bytes) };
    start += bytes.length;
    return piece;
  });
}
export function finalParts(piece: Piece): Part[] {
  return piece.frames.at(-1)?.parts ?? [];
}
export function characters(text: string) {
  let offset = 0;
  return Array.from(text, (char) => {
    const start = offset;
    offset += encoder.encode(char).length;
    return { char, start, end: offset };
  });
}
