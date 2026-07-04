import type { Metadata } from "next";
import { createWordRepo } from "@/src/adapters/words";
import { ModeGate } from "@/src/presentation/components/mode-gate";
import { ModeListen } from "@/src/presentation/components/game/mode-listen";

export const metadata: Metadata = {
  title: "โหมดฟังแล้วสะกด",
};

export default async function ListenPage() {
  const bank = await createWordRepo().getBank();
  if (!bank.ok) {
    return <p className="p-8 text-center text-error">โหลดคำศัพท์ไม่สำเร็จ</p>;
  }

  return (
    <ModeGate mode="listen">
      <ModeListen bank={bank.value} />
    </ModeGate>
  );
}
