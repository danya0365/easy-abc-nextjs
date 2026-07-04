// framework-free — repo cloud save ความคืบหน้า (ดาว) ต่อ user
import type { Result } from "../shared/result";
import type { StarsByLevel } from "../services/rules";
import type { AdventureGame } from "../services/mask";

/** ดาวต่อด่าน แยกต่อเกมผจญภัย */
export type StarsByGame = Record<AdventureGame, StarsByLevel>;

export interface GameStateRepository {
  /** null = ยังไม่เคยบันทึก (ผู้ใช้ใหม่) */
  getMine(): Promise<Result<StarsByGame | null>>;
  saveMine(progress: StarsByGame): Promise<Result<void>>;
}
