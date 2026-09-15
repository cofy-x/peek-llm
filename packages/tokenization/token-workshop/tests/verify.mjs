import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tokenize, finalParts, ranks, label } from "../src/tokenizer.ts";
import { ribbonUnits, changedOrdinals } from "../src/ribbon-layout.ts";
const fixtures = JSON.parse(
  readFileSync(
    process.argv[2] ?? new URL("./fixtures.json", import.meta.url),
    "utf8",
  ),
);
const canonical = [...ranks]
  .sort((a, b) => a[1] - b[1])
  .map(
    ([bytes, rank]) =>
      `${Buffer.from(bytes.split(",").map(Number)).toString("base64")} ${rank}\n`,
  )
  .join("");
assert.equal(ranks.size, 100256);
assert.equal(
  createHash("sha256").update(canonical).digest("hex"),
  "223921b76ee99bde995b7ff738513eef100fb51d18c93597a113bcffe865b2a7",
);
for (const fixture of fixtures) {
  const pieces = tokenize(fixture.text);
  assert.deepEqual(
    pieces.map((piece) => piece.text),
    fixture.pieces,
    `Pre-split: ${JSON.stringify(fixture.text)}`,
  );
  assert.deepEqual(
    pieces.flatMap((piece) => finalParts(piece).map((part) => part.id)),
    fixture.ids,
    JSON.stringify(fixture.text),
  );
  assert.deepEqual(
    Buffer.concat(pieces.map((piece) => Buffer.from(piece.bytes))),
    Buffer.from(fixture.text),
  );
  for (const piece of pieces)
    for (const [index, frame] of piece.frames.entries()) {
      assert.equal(frame.parts[0].start, 0);
      assert.equal(frame.parts.at(-1).end, piece.bytes.length);
      for (const [i, part] of frame.parts.entries()) {
        assert.equal(
          part.id,
          ranks.get(piece.bytes.slice(part.start, part.end).join(",")),
        );
        if (i) assert.equal(frame.parts[i - 1].end, part.start);
      }
      if (index)
        assert.equal(
          frame.parts.length,
          piece.frames[index - 1].parts.length - 1,
        );
    }
}
assert.equal(label(new Uint8Array([0xf0, 0x9f])), "0x F0 9F");
assert.equal(label(new Uint8Array([32])), "·");
assert.equal(label(new Uint8Array([0xc2, 0xb7])), "\\u00b7");
console.log(
  `Verified official vocabulary hash, ${fixtures.length} fixtures, and every intermediate frame.`,
);

function tokensFor(text) {
  return tokenize(text).flatMap(piece => finalParts(piece).map(part => ({
    ...part, start: piece.start + part.start, end: piece.start + part.end,
  }))).map((token, ordinal) => ({ ...token, ordinal }));
}
for (const text of [...fixtures.map(fixture => fixture.text), "👩🏽‍💻", "e\u0301"]) {
  const units = ribbonUnits(text, tokensFor(text));
  assert.equal(units.map(unit => unit.text).join(""), text);
  let end = 0;
  for (const unit of units) {
    assert.equal(unit.start, end);
    assert.equal(unit.end - unit.start, Buffer.byteLength(unit.text));
    assert.ok(unit.tokens.length > 0);
    end = unit.end;
  }
  assert.equal(end, Buffer.byteLength(text));
}
assert.equal(ribbonUnits("👩🏽‍💻", tokensFor("👩🏽‍💻")).length, 1);
assert.deepEqual([...changedOrdinals(tokensFor("hello world"), tokensFor("hello  world"))], [1]);
assert.deepEqual([...changedOrdinals(tokensFor("hello world"), tokensFor("hello world"))], []);
console.log("Verified grapheme preservation, byte coverage, and shifted-suffix comparison.");
