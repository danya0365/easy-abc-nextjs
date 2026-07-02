import type { Metadata } from "next";
import { EnergyHud } from "@/src/presentation/components/energy-hud";
import { ModeGrid } from "@/src/presentation/components/mode-grid";

export const metadata: Metadata = {
  title: "เลือกโหมด",
};

export default function ModesPage() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-700 text-outline">
          เลือกโหมด
        </h1>
        <EnergyHud />
      </div>
      <ModeGrid />
    </div>
  );
}
