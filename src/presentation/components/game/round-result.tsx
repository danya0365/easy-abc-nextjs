"use client";

import { useEffect } from "react";
import { sound } from "@/src/presentation/lib/sound";
import { ChunkyButton } from "../chunky-button";

/** จอสรุปผลรอบโหมดพรีเมียม */
export function RoundResult({
  emoji,
  title,
  lines,
  newRecord = false,
  onReplay,
}: {
  emoji: string;
  title: string;
  lines: string[];
  newRecord?: boolean;
  onReplay: () => void;
}) {
  useEffect(() => {
    sound.win();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/70 p-6">
      <div className="w-full max-w-sm animate-pop rounded-4xl border-4 border-border bg-card p-6 text-center shadow-2xl">
        <div className="text-6xl">{emoji}</div>
        <h2 className="mt-2 text-3xl font-bold text-card-foreground">{title}</h2>
        {newRecord && (
          <p className="mt-1 animate-pop font-bold text-tile-4">
            🏆 สถิติใหม่!
          </p>
        )}
        <div className="mt-3 flex flex-col gap-1">
          {lines.map((l, i) => (
            <p key={i} className="font-bold text-muted">
              {l}
            </p>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <ChunkyButton onClick={onReplay} variant="sunny" size="lg">
            🔄 เล่นอีกรอบ
          </ChunkyButton>
          <ChunkyButton href="/modes" variant="white" size="sm">
            ← เลือกโหมดอื่น
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}
