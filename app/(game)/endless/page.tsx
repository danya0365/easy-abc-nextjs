import type { Metadata } from "next";
import { createWordRepo } from "@/src/adapters/words";
import { ModeGate } from "@/src/presentation/components/mode-gate";
import { ModeEndless } from "@/src/presentation/components/game/mode-endless";

export const metadata: Metadata = {
  title: "โหมดเล่นไม่จำกัด",
};

export default async function EndlessPage() {
  const bank = await createWordRepo().getBank();
  if (!bank.ok) {
    return <p className="p-8 text-center text-error">โหลดคำศัพท์ไม่สำเร็จ</p>;
  }

  return (
    <ModeGate mode="endless">
      <ModeEndless bank={bank.value} />
    </ModeGate>
  );
}
