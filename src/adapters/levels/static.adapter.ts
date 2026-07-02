import { ok, err, type Result } from "@/src/domain/shared/result";
import type {
  LevelConfig,
  LevelRepository,
} from "@/src/domain/ports/level.port";

/** Adapter อ่าน master data ในโปรเจกต์ (static repo แทน DB) */
export class StaticLevelAdapter implements LevelRepository {
  constructor(private levels: LevelConfig[]) {}

  async getAll(): Promise<Result<LevelConfig[]>> {
    return ok(this.levels);
  }

  async getByLevel(level: number): Promise<Result<LevelConfig>> {
    const found = this.levels.find((l) => l.level === level);
    if (!found) return err(`level ${level} not found`);
    return ok(found);
  }
}
