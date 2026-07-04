// framework-free — ห้าม import next/react/zustand
// คลังคำศัพท์แยกตามหมวด (แยกออกจากโครงด่าน — ด่านเป็นแม่แบบความยาก)
import type { Result } from "../shared/result";
import type { WordEntry } from "./level.port";

export type WordCategory =
  | "animals"
  | "food"
  | "nature"
  | "home"
  | "vehicles"
  | "body";

export const WORD_CATEGORIES: WordCategory[] = [
  "animals",
  "food",
  "nature",
  "home",
  "vehicles",
  "body",
];

/** หมวดที่เลือกได้ใน UI — "mixed" = คละ (ชุดคำดั้งเดิม/ทั้งคลัง) */
export type CategoryChoice = WordCategory | "mixed";

export interface CategoryMeta {
  id: WordCategory;
  name: string;
  emoji: string;
}

/** คลังคำต่อหมวด — แต่ละหมวดควรมี ≥25 คำ (5 ด่าน × 5 คำ) */
export type WordBank = Record<WordCategory, WordEntry[]>;

export interface WordBankRepository {
  getBank(): Promise<Result<WordBank>>;
  getCategories(): Promise<Result<CategoryMeta[]>>;
}
