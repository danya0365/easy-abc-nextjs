import type { GameStateRepository } from "@/src/domain/ports/game-state.port";
import { TursoGameStateAdapter } from "./turso.adapter";

/** repo cloud save ดาว — ส่ง userId ที่ได้จาก session (server-only) */
export function createGameStateRepo(userId: string): GameStateRepository {
  return new TursoGameStateAdapter(userId);
}
