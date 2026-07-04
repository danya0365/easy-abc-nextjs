import type { Metadata } from "next";
import { createWordRepo } from "@/src/adapters/words";
import { ModeGate } from "@/src/presentation/components/mode-gate";
import { ModeTimeAttack } from "@/src/presentation/components/game/mode-time-attack";

export const metadata: Metadata = {
  title: "โหมดจับเวลา",
};

export default async function TimeAttackPage() {
  const bank = await createWordRepo().getBank();
  if (!bank.ok) {
    return <p className="p-8 text-center text-error">โหลดคำศัพท์ไม่สำเร็จ</p>;
  }

  return (
    <ModeGate mode="time-attack">
      <ModeTimeAttack bank={bank.value} />
    </ModeGate>
  );
}
