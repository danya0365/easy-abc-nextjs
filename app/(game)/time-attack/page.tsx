import type { Metadata } from "next";
import { createLevelRepo } from "@/src/adapters/levels";
import { ModeGate } from "@/src/presentation/components/mode-gate";
import { ModeTimeAttack } from "@/src/presentation/components/game/mode-time-attack";

export const metadata: Metadata = {
  title: "โหมดจับเวลา",
};

export default async function TimeAttackPage() {
  const levels = await createLevelRepo().getAll();
  const pool = levels.ok ? levels.value.flatMap((l) => l.words) : [];

  return (
    <ModeGate mode="time-attack">
      <ModeTimeAttack pool={pool} />
    </ModeGate>
  );
}
