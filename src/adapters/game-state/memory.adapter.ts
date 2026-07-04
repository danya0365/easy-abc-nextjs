import { ok, type Result } from "@/src/domain/shared/result";
import type {
  GameStateRepository,
  StarsByGame,
} from "@/src/domain/ports/game-state.port";

/** In-memory game-state adapter — ใช้ใน contract test */
export class MemoryGameStateAdapter implements GameStateRepository {
  constructor(private state: StarsByGame | null = null) {}

  async getMine(): Promise<Result<StarsByGame | null>> {
    return ok(this.state);
  }

  async saveMine(progress: StarsByGame): Promise<Result<void>> {
    this.state = progress;
    return ok(undefined);
  }
}
