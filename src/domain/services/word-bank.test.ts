import { describe, it, expect } from "vitest";
import {
  sortByLength,
  wordsForLevel,
  flattenBank,
  representativeWord,
  representativeWords,
} from "./word-bank";
import type { WordEntry } from "../ports/level.port";
import type { WordBank } from "../ports/word.port";

const w = (word: string): WordEntry => ({ word, emoji: "🔤", thai: word });

// คลัง 25 คำ ความยาว 3-6 (เหมือนหมวดจริง)
const pool25: WordEntry[] = [
  ...["CAT", "DOG", "PIG", "COW", "HEN"].map(w), // 3
  ...["FISH", "BIRD", "DUCK", "FROG", "BEAR"].map(w), // 4
  ...["HORSE", "TIGER", "ZEBRA", "SHEEP", "SNAKE"].map(w), // 5
  ...["MOUSE", "PANDA", "WHALE", "SHARK", "KOALA"].map(w), // 5
  ...["RABBIT", "MONKEY", "TURTLE", "SPIDER", "DONKEY"].map(w), // 6
];

describe("sortByLength", () => {
  it("เรียงสั้น→ยาว และ A-Z เมื่อยาวเท่ากัน (deterministic)", () => {
    const sorted = sortByLength([w("ZEBRA"), w("CAT"), w("ANT"), w("FISH")]);
    expect(sorted.map((x) => x.word)).toEqual(["ANT", "CAT", "FISH", "ZEBRA"]);
  });

  it("ไม่แก้ array เดิม", () => {
    const input = [w("ZEBRA"), w("CAT")];
    sortByLength(input);
    expect(input[0].word).toBe("ZEBRA");
  });
});

describe("wordsForLevel", () => {
  it("ด่าน 1 = 5 คำสั้นสุด", () => {
    const words = wordsForLevel(pool25, 1);
    expect(words).toHaveLength(5);
    expect(words.every((x) => x.word.length === 3)).toBe(true);
  });

  it("ด่าน 5 = 5 คำยาวสุด", () => {
    const words = wordsForLevel(pool25, 5);
    expect(words.every((x) => x.word.length === 6)).toBe(true);
  });

  it("ความยากไม่ลด: ความยาวเฉลี่ยด่านถัดไป ≥ ด่านก่อน", () => {
    const avg = (n: number) =>
      wordsForLevel(pool25, n).reduce((s, x) => s + x.word.length, 0) / 5;
    for (let n = 2; n <= 5; n++) expect(avg(n)).toBeGreaterThanOrEqual(avg(n - 1));
  });

  it("คลังบาง (22 คำ) → ด่าน 5 เลื่อนหน้าต่างชนท้าย ได้ 5 คำเสมอ", () => {
    const thin = pool25.slice(0, 22);
    const words = wordsForLevel(thin, 5);
    expect(words).toHaveLength(5);
    // ต้องเป็น 5 คำท้ายสุดของคลังที่เรียงแล้ว
    expect(words.map((x) => x.word)).toEqual(
      sortByLength(thin).slice(17).map((x) => x.word)
    );
  });
});

describe("representativeWord", () => {
  it("เลือกคำสั้นสุด เสมอกันเอาตัวแรก (insertion order)", () => {
    const rep = representativeWord([w("HORSE"), w("CAT"), w("DOG"), w("FISH")]);
    expect(rep?.word).toBe("CAT");
  });

  it("คลังว่าง → null", () => {
    expect(representativeWord([])).toBeNull();
  });
});

describe("representativeWords", () => {
  it("ได้คำสั้นสุด N คำ ไม่ซ้ำ คงลำดับในคลัง", () => {
    const reps = representativeWords(
      [w("CAT"), w("DOG"), w("PIG"), w("COW"), w("HORSE")],
      4
    );
    expect(reps.map((r) => r.word)).toEqual(["CAT", "DOG", "PIG", "COW"]);
  });

  it("คลังเล็กกว่า count → ได้เท่าที่มี", () => {
    expect(representativeWords([w("CAT"), w("DOG")], 4)).toHaveLength(2);
  });
});

describe("flattenBank", () => {
  it("รวมทุกหมวด + หมวดที่ไม่มีไม่พัง", () => {
    const bank = {
      animals: [w("CAT")],
      food: [w("EGG")],
      nature: [],
      home: [w("BED")],
      vehicles: [],
      body: [w("ARM")],
    } as WordBank;
    expect(flattenBank(bank).map((x) => x.word).sort()).toEqual([
      "ARM",
      "BED",
      "CAT",
      "EGG",
    ]);
  });
});
