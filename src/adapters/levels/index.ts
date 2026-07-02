import { LEVELS_MASTER } from "@/src/data/levels.master";
import type { LevelRepository } from "@/src/domain/ports/level.port";
import { StaticLevelAdapter } from "./static.adapter";

export function createLevelRepo(): LevelRepository {
  return new StaticLevelAdapter(LEVELS_MASTER);
}
