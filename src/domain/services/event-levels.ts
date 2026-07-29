// แบ่งคำศัพท์ flat list ออกเป็น levels (5 คำ/level) สำหรับ Event
// reuse รูปแบบ LevelConfig ให้ LevelMap + GameScreen ใช้ได้เลย
import type { LevelConfig, WordEntry } from "../ports/level.port";

export const WORDS_PER_LEVEL = 5;

/** แบ่งคำ flat list เป็น LevelConfig[] (เรียงจากสั้น→ยาว) */
export function createEventLevels(words: WordEntry[]): LevelConfig[] {
  // เรียงจากสั้น→ยาว (เหมือน adventure ปกติ)
  const sorted = [...words].sort(
    (a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word)
  );

  const levels: LevelConfig[] = [];
  for (let i = 0; i < sorted.length; i += WORDS_PER_LEVEL) {
    const chunk = sorted.slice(i, i + WORDS_PER_LEVEL);
    // level สุดท้ายอาจมีน้อยกว่า 5 คำ → ปกติดี
    levels.push({
      level: levels.length + 1,
      title: `ชุดที่ ${levels.length + 1}`,
      decoys: 3,
      words: chunk,
    });
  }

  return levels;
}
