// framework-free — ห้าม import next/react/zustand
import type { Result } from "../shared/result";

export interface WordEntry {
  /** คำภาษาอังกฤษตัวพิมพ์ใหญ่ เช่น "DOG" */
  word: string;
  /** emoji fallback เมื่อยังไม่มีไฟล์รูป */
  emoji: string;
  /** คำแปลไทย */
  thai: string;
}

export interface LevelConfig {
  level: number;
  title: string;
  /** จำนวนตัวอักษรหลอกในถาด */
  decoys: number;
  words: WordEntry[];
}

export interface LevelRepository {
  getAll(): Promise<Result<LevelConfig[]>>;
  getByLevel(level: number): Promise<Result<LevelConfig>>;
}
