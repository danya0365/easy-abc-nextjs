// framework-free — ห้าม import next/react/zustand
import type { Result } from "../shared/result";
import type { WordEntry } from "./level.port";

export interface EventMeta {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** รายการคำศัพท์ของ event นี้ (flat list, ไม่มี level) */
  words: WordEntry[];
}

export interface EventRepository {
  getAll(): Promise<Result<EventMeta[]>>;
  getById(id: string): Promise<Result<EventMeta | null>>;
}
