import type { Metadata } from "next";
import { createWordRepo } from "@/src/adapters/words";
import { ModeGate } from "@/src/presentation/components/mode-gate";
import { ModeQuiz } from "@/src/presentation/components/game/mode-quiz";

export const metadata: Metadata = {
  title: "โหมดทายคำจากรูป",
};

export default async function QuizPage() {
  const bank = await createWordRepo().getBank();
  if (!bank.ok) {
    return <p className="p-8 text-center text-error">โหลดคำศัพท์ไม่สำเร็จ</p>;
  }

  return (
    <ModeGate mode="quiz">
      <ModeQuiz bank={bank.value} />
    </ModeGate>
  );
}
