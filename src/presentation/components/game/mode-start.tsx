"use client";

import { useState } from "react";
import { useEnergyStore } from "@/src/presentation/stores/energy.store";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { ChunkyButton } from "../chunky-button";
import { EnergyEmptyModal } from "../energy-hud";

/** จอเริ่มรอบโหมดพรีเมียม — หัก ⚡1 ใน handler (Bundle = ฟรี) */
export function ModeStart({
  emoji,
  name,
  rules,
  bestLine,
  onStart,
}: {
  emoji: string;
  name: string;
  rules: string;
  bestLine?: string;
  onStart: () => void;
}) {
  const spend = useEnergyStore((s) => s.spend);
  const unlimited = useEntitlementStore((s) => s.hasUnlimitedEnergy());
  const [emptyOpen, setEmptyOpen] = useState(false);

  const start = () => {
    if (!unlimited && !spend()) {
      setEmptyOpen(true);
      return;
    }
    onStart();
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="animate-float text-8xl">{emoji}</div>
      <h1 className="mt-4 text-4xl font-bold text-brand-700 text-outline">
        โหมด{name}
      </h1>
      <p className="mt-3 max-w-sm text-lg text-brand-800">{rules}</p>
      {bestLine && (
        <p className="mt-2 rounded-full bg-card/80 px-4 py-1.5 font-bold text-brand-700 backdrop-blur">
          🏆 {bestLine}
        </p>
      )}
      <ChunkyButton onClick={start} variant="sunny" size="lg" className="mt-8">
        เริ่มเล่น! {unlimited ? "⚡∞" : "(⚡1)"}
      </ChunkyButton>
      <ChunkyButton href="/modes" variant="white" size="sm" className="mt-3">
        ← กลับไปเลือกโหมด
      </ChunkyButton>
      <EnergyEmptyModal open={emptyOpen} onClose={() => setEmptyOpen(false)} />
    </div>
  );
}
