import { eq } from "drizzle-orm";
import { ok, err, type Result } from "@/src/domain/shared/result";
import type {
  GameStateRepository,
  StarsByGame,
} from "@/src/domain/ports/game-state.port";
import { db } from "@/src/server/db/client";
import { gameState } from "@/src/server/db/schema";

/** cloud save ดาว — 1 แถวต่อ user (upsert JSON) — server-only */
export class TursoGameStateAdapter implements GameStateRepository {
  constructor(private userId: string) {}

  async getMine(): Promise<Result<StarsByGame | null>> {
    try {
      const rows = await db
        .select()
        .from(gameState)
        .where(eq(gameState.userId, this.userId))
        .limit(1);
      return ok(rows.length ? rows[0].progress : null);
    } catch (e) {
      return err(`getMine failed: ${String(e)}`);
    }
  }

  async saveMine(progress: StarsByGame): Promise<Result<void>> {
    try {
      await db
        .insert(gameState)
        .values({ userId: this.userId, progress, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: gameState.userId,
          set: { progress, updatedAt: new Date() },
        });
      return ok(undefined);
    } catch (e) {
      return err(`saveMine failed: ${String(e)}`);
    }
  }
}
