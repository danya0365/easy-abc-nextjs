import type { Metadata } from "next";
import { createLevelRepo } from "@/src/adapters/levels";
import { ModeGate } from "@/src/presentation/components/mode-gate";
import { ModeListen } from "@/src/presentation/components/game/mode-listen";

export const metadata: Metadata = {
  title: "โหมดฟังแล้วสะกด",
};

export default async function ListenPage() {
  const levels = await createLevelRepo().getAll();
  const pool = levels.ok ? levels.value.flatMap((l) => l.words) : [];

  return (
    <ModeGate mode="listen">
      <ModeListen pool={pool} />
    </ModeGate>
  );
}
