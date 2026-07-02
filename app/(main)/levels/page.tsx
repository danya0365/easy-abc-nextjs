import type { Metadata } from "next";
import { createLevelRepo } from "@/src/adapters/levels";
import { LevelMap } from "@/src/presentation/components/level-map";
import { EnergyHud } from "@/src/presentation/components/energy-hud";
import { SoundToggle } from "@/src/presentation/components/sound-toggle";

export const metadata: Metadata = {
  title: "เลือกด่าน",
};

export default async function LevelsPage() {
  const result = await createLevelRepo().getAll();
  if (!result.ok) {
    return (
      <p className="p-8 text-center text-error">
        โหลดข้อมูลด่านไม่สำเร็จ: {result.error}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 pt-6">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-700 text-outline">
          เลือกด่าน
        </h1>
        <div className="flex items-center gap-2">
          <EnergyHud />
          <SoundToggle />
        </div>
      </div>
      <p className="mb-4 text-center text-sm text-brand-800">
        🏰 ผ่านด่านเพื่อปลดด่านถัดไป — เก็บดาวให้ครบ 15 ดวง!
      </p>
      <LevelMap levels={result.value} />
    </div>
  );
}
