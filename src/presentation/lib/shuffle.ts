import type { WordEntry } from "@/src/domain/ports/level.port";

export interface Tile {
  id: string;
  letter: string;
}

/** Fisher-Yates — ⚠️ เรียกใน useEffect/handler เท่านั้น (กัน hydration mismatch) */
export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** สร้างถาด tile: ตัวอักษรของคำ + ตัวหลอกที่ไม่อยู่ในคำ แล้วสลับ */
export function buildTray(word: string, decoys: number): Tile[] {
  const letters = word.split("");
  const pool = ALPHABET.split("").filter((c) => !letters.includes(c));
  const decoyLetters = shuffle(pool).slice(0, decoys);
  const tiles = [
    ...letters.map((letter, i) => ({ id: `w${i}-${letter}`, letter })),
    ...decoyLetters.map((letter, i) => ({ id: `d${i}-${letter}`, letter })),
  ];
  return shuffle(tiles);
}

/** ตัวเลือกโหมด quiz: คำถูก 1 + คำหลอก (choiceCount-1) จาก pool แล้วสลับ */
export function pickQuizChoices(
  answer: WordEntry,
  pool: WordEntry[],
  choiceCount = 3
): WordEntry[] {
  const others = shuffle(pool.filter((w) => w.word !== answer.word)).slice(
    0,
    choiceCount - 1
  );
  return shuffle([answer, ...others]);
}
