"use client";

import { ChunkyButton } from "../chunky-button";
import { SoundToggle } from "../sound-toggle";

/** เมนูพักเกม (สไตล์ Angry Birds) — เกมหยุดรับ input ระหว่างเปิด */
export function PauseMenu({
  open,
  onResume,
  onRestart,
  backHref,
  backLabel = "🗺️ แผนที่ด่าน",
}: {
  open: boolean;
  onResume: () => void;
  onRestart?: () => void;
  backHref: string;
  backLabel?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/70 p-6">
      <div className="w-full max-w-xs animate-pop rounded-4xl border-4 border-border bg-card p-6 text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-card-foreground">พักก่อน ⏸️</h2>
        <div className="mt-5 flex flex-col gap-3">
          <ChunkyButton onClick={onResume} variant="primary">
            ▶️ เล่นต่อ
          </ChunkyButton>
          {onRestart && (
            <ChunkyButton onClick={onRestart} variant="sunny">
              🔄 เริ่มใหม่
            </ChunkyButton>
          )}
          <ChunkyButton href={backHref} variant="white">
            {backLabel}
          </ChunkyButton>
          <div className="flex justify-center pt-1">
            <SoundToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
