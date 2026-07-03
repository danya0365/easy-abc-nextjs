import { describe, it, expect } from "vitest";
import { isFillGame, maskWord } from "./mask";

/** helper: แปลง mask เป็นภาพ "_AT" (ตัวซ่อน = _) */
const render = (word: string, mask: boolean[]) =>
  word
    .split("")
    .map((c, i) => (mask[i] ? "_" : c))
    .join("");

describe("maskWord", () => {
  it("spell ซ่อนทุกตัว", () => {
    expect(render("CAT", maskWord("CAT", "spell"))).toBe("___");
    expect(render("RABBIT", maskWord("RABBIT", "spell"))).toBe("______");
  });

  it("fill-front ซ่อนตัวแรก 1 ตัว (_AT → CAT)", () => {
    expect(render("CAT", maskWord("CAT", "fill-front"))).toBe("_AT");
    expect(render("HOUSE", maskWord("HOUSE", "fill-front"))).toBe("_OUSE");
    expect(render("RABBIT", maskWord("RABBIT", "fill-front"))).toBe("_ABBIT");
  });

  it("fill-back ซ่อนตัวท้าย 1 ตัว (CA_ → CAT)", () => {
    expect(render("CAT", maskWord("CAT", "fill-back"))).toBe("CA_");
    expect(render("HOUSE", maskWord("HOUSE", "fill-back"))).toBe("HOUS_");
    expect(render("RABBIT", maskWord("RABBIT", "fill-back"))).toBe("RABBI_");
  });

  it("fill-middle โชว์หัว-ท้าย ซ่อนตรงกลางทั้งหมด (H___E → HOUSE)", () => {
    expect(render("CAT", maskWord("CAT", "fill-middle"))).toBe("C_T");
    expect(render("FISH", maskWord("FISH", "fill-middle"))).toBe("F__H");
    expect(render("HOUSE", maskWord("HOUSE", "fill-middle"))).toBe("H___E");
    expect(render("RABBIT", maskWord("RABBIT", "fill-middle"))).toBe("R____T");
  });

  it("จำนวนช่องซ่อนถูกต้อง (จำนวน tile ที่ต้องเติม)", () => {
    expect(maskWord("HOUSE", "fill-front").filter(Boolean)).toHaveLength(1);
    expect(maskWord("HOUSE", "fill-back").filter(Boolean)).toHaveLength(1);
    expect(maskWord("HOUSE", "fill-middle").filter(Boolean)).toHaveLength(3);
    expect(maskWord("HOUSE", "spell").filter(Boolean)).toHaveLength(5);
  });
});

describe("isFillGame", () => {
  it("รับเฉพาะเกมเติมคำ 3 แบบ", () => {
    expect(isFillGame("fill-front")).toBe(true);
    expect(isFillGame("fill-back")).toBe(true);
    expect(isFillGame("fill-middle")).toBe(true);
    expect(isFillGame("spell")).toBe(false);
    expect(isFillGame("xyz")).toBe(false);
  });
});
