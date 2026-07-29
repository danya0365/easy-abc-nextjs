// framework-free — repo cloud save ความคืบหน้า (ดาว) ต่อ user
import type { Result } from "../shared/result";
import type { StarsByLevel } from "../services/rules";

/** ดาวต่อด่าน แยก key ต่อเกม (key = gameId สำหรับ adventure, "event-{eventId}" สำหรับ event) */
export type StarsByGame = Record<string, StarsByLevel>;

export interface GameStateRepository {
  /** null = ยังไม่เคยบันทึก (ผู้ใช้ใหม่) */
  getMine(): Promise<Result<StarsByGame | null>>;
  saveMine(progress: StarsByGame): Promise<Result<void>>;
}
