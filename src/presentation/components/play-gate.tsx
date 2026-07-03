"use client";

import type { ReactNode } from "react";
import { isLevelUnlocked } from "@/src/domain/services/rules";
import type { AdventureGame } from "@/src/domain/services/mask";
import { useProgressStore } from "@/src/presentation/stores/progress.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { getAdventure } from "@/src/presentation/lib/adventures";
import { ChunkyButton } from "./chunky-button";

/**
 * ยามหน้าเล่นด่าน: เข้าผ่าน URL ตรงได้ แต่เช็คปลดล็อกจาก zustand ฝั่ง client
 * (ตั้งใจไม่ซีเรียสความปลอดภัย — local state เท่านั้น) — ดาวแยก track ต่อเกม
 */
export function PlayGate({
  level,
  game = "spell",
  children,
}: {
  level: number;
  game?: AdventureGame;
  children: ReactNode;
}) {
  const mounted = useMounted();
  const starsByGame = useProgressStore((s) => s.starsByGame);
  const adventure = getAdventure(game);

  if (!mounted) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-4xl">
        <span className="animate-float">🐼</span>
      </div>
    );
  }

  if (!isLevelUnlocked(level, starsByGame[game])) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div className="text-7xl">🔒</div>
        <h1 className="mt-4 text-3xl font-bold text-brand-700 text-outline">
          ด่านนี้ยังล็อกอยู่
        </h1>
        <p className="mt-2 text-lg text-brand-800">
          ต้องผ่านด่านที่ {level - 1} ของ{adventure.name}ก่อนนะ
          ถึงจะเล่นด่านที่ {level} ได้
        </p>
        <ChunkyButton
          href={adventure.mapRoute}
          variant="sunny"
          size="lg"
          className="mt-8"
        >
          🗺️ กลับแผนที่ด่าน
        </ChunkyButton>
      </div>
    );
  }

  return <>{children}</>;
}
