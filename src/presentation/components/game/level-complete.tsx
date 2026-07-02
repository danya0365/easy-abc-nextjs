"use client";

import { useEffect } from "react";
import type { Stars } from "@/src/domain/services/rules";
import { sound } from "@/src/presentation/lib/sound";
import { ChunkyButton } from "../chunky-button";
import { StarRow } from "../star-row";

/** จอจบด่าน (ผจญภัย): ดาว pop-in + เล่นซ้ำ/ด่านถัดไป/กลับแผนที่ */
export function LevelComplete({
  level,
  stars,
  maxLevel,
  bonusEnergy,
  onReplay,
  onNext,
}: {
  level: number;
  stars: Stars;
  maxLevel: number;
  /** ได้โบนัส ⚡ จาก 3 ดาวครั้งแรกไหม */
  bonusEnergy: boolean;
  onReplay: () => void;
  /** ไปด่านถัดไป (หัก energy ใน handler) */
  onNext: () => void;
}) {
  useEffect(() => {
    sound.win();
  }, []);

  const hasNext = level < maxLevel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/70 p-6">
      <div className="w-full max-w-sm animate-pop rounded-4xl border-4 border-border bg-card p-6 text-center shadow-2xl">
        <h2 className="text-4xl font-bold text-tile-4">ผ่านด่าน! 🎊</h2>
        <p className="mt-1 font-bold text-muted">ด่านที่ {level}</p>
        <StarRow stars={stars} size="lg" animate className="mt-4" />
        {stars === 3 && (
          <p className="mt-2 font-bold text-success">สุดยอด! ไม่พลาดเลย</p>
        )}
        {bonusEnergy && (
          <p className="mt-1 animate-pop text-sm font-bold text-energy">
            🎁 โบนัส 3 ดาวครั้งแรก +1 ⚡
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {hasNext ? (
            <ChunkyButton onClick={onNext} variant="sunny" size="lg">
              ด่านถัดไป →
            </ChunkyButton>
          ) : (
            <ChunkyButton href="/levels" variant="sunny" size="lg">
              🏆 เก่งที่สุด! กลับแผนที่
            </ChunkyButton>
          )}
          <ChunkyButton onClick={onReplay} variant="primary" size="sm">
            🔄 เล่นอีกครั้ง
          </ChunkyButton>
          <ChunkyButton href="/levels" variant="white" size="sm">
            🗺️ แผนที่ด่าน
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}
