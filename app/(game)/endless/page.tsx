import type { Metadata } from "next";
import { createLevelRepo } from "@/src/adapters/levels";
import { ModeGate } from "@/src/presentation/components/mode-gate";
import { ModeEndless } from "@/src/presentation/components/game/mode-endless";

export const metadata: Metadata = {
  title: "โหมดเล่นไม่จำกัด",
};

export default async function EndlessPage() {
  const levels = await createLevelRepo().getAll();
  const pool = levels.ok ? levels.value.flatMap((l) => l.words) : [];

  return (
    <ModeGate mode="endless">
      <ModeEndless pool={pool} />
    </ModeGate>
  );
}
