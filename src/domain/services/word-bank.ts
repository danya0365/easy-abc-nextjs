// pure functions เลือกคำจากคลังตามหมวด/ด่าน — ความยากไต่ตามความยาวคำอัตโนมัติ
import type { WordEntry } from "../ports/level.port";
import type { WordBank } from "../ports/word.port";
import { WORD_CATEGORIES } from "../ports/word.port";

export const WORDS_PER_LEVEL = 5;

/**
 * เรียงคำจากสั้น → ยาว (ยาวเท่ากันเรียง A-Z ให้ deterministic ไม่ชน hydration)
 */
export function sortByLength(pool: WordEntry[]): WordEntry[] {
  return [...pool].sort(
    (a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word)
  );
}

/**
 * คำของด่านที่ n จากคลังหมวดนั้น: หน้าต่างละ 5 คำไล่จากคำสั้นสุด
 * ด่าน 1 = 5 คำสั้นสุด … ด่าน 5 = 5 คำยาวสุด
 * คลังบาง (คำไม่ถึง level*5) → เลื่อนหน้าต่างชนท้าย (ได้ 5 คำเสมอถ้าคลัง ≥5)
 */
export function wordsForLevel(pool: WordEntry[], level: number): WordEntry[] {
  const sorted = sortByLength(pool);
  const start = Math.min(
    (level - 1) * WORDS_PER_LEVEL,
    Math.max(0, sorted.length - WORDS_PER_LEVEL)
  );
  return sorted.slice(start, start + WORDS_PER_LEVEL);
}

/** รวมทุกหมวดเป็น pool เดียว (ใช้กับ "คละ" ในโหมดพรีเมียม) */
export function flattenBank(bank: WordBank): WordEntry[] {
  return WORD_CATEGORIES.flatMap((c) => bank[c] ?? []);
}

/**
 * คำตัวแทนของหมวด (ไว้โชว์เป็นตัวอย่าง/ไอคอนบนการ์ด) — คำสั้นสุด, เสมอกันเอาตัวแรก (insertion order)
 * คำสั้นแสดงบนการ์ดเล็กได้สวย + เป็นคำที่จำง่าย
 */
export function representativeWord(pool: WordEntry[]): WordEntry | null {
  if (pool.length === 0) return null;
  return pool.reduce(
    (best, w) => (w.word.length < best.word.length ? w : best),
    pool[0]
  );
}

/**
 * คำตัวแทนหลายคำ (ไอคอนไม่ซ้ำต่อการ์ด) — คำสั้นสุด `count` คำ, เสมอกันคงลำดับในคลัง (stable)
 */
export function representativeWords(
  pool: WordEntry[],
  count: number
): WordEntry[] {
  return [...pool]
    .sort((a, b) => a.word.length - b.word.length)
    .slice(0, count);
}

/** คำของด่านที่ n แยกครบทุกหมวด (server เตรียมส่งให้ GameScreen เลือกตามหมวดที่ผู้เล่นตั้งไว้) */
export function levelWordsByCategory(
  bank: WordBank,
  level: number
): Record<string, WordEntry[]> {
  return Object.fromEntries(
    WORD_CATEGORIES.map((c) => [c, wordsForLevel(bank[c] ?? [], level)])
  );
}
