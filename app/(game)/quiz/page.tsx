import type { Metadata } from "next";
import { createLevelRepo } from "@/src/adapters/levels";
import { ModeGate } from "@/src/presentation/components/mode-gate";
import { ModeQuiz } from "@/src/presentation/components/game/mode-quiz";

export const metadata: Metadata = {
  title: "โหมดทายคำจากรูป",
};

export default async function QuizPage() {
  const levels = await createLevelRepo().getAll();
  const pool = levels.ok ? levels.value.flatMap((l) => l.words) : [];

  return (
    <ModeGate mode="quiz">
      <ModeQuiz pool={pool} />
    </ModeGate>
  );
}
