"use client";

import type { ReactNode } from "react";
import { isLevelUnlocked } from "@/src/domain/services/rules";
import { useProgressStore } from "@/src/presentation/stores/progress.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { ChunkyButton } from "./chunky-button";

/**
 * ยามหน้าเล่นด่าน: เข้าผ่าน URL ตรงได้ แต่เช็คปลดล็อกจาก zustand ฝั่ง client
 * (ตั้งใจไม่ซีเรียสความปลอดภัย — local state เท่านั้น)
 */
export function PlayGate({
  level,
  children,
}: {
  level: number;
  children: ReactNode;
}) {
  const mounted = useMounted();
  const stars = useProgressStore((s) => s.stars);

  if (!mounted) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-4xl">
        <span className="animate-float">🐼</span>
      </div>
    );
  }

  if (!isLevelUnlocked(level, stars)) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div className="text-7xl">🔒</div>
        <h1 className="mt-4 text-3xl font-bold text-brand-700 text-outline">
          ด่านนี้ยังล็อกอยู่
        </h1>
        <p className="mt-2 text-lg text-brand-800">
          ต้องผ่านด่านที่ {level - 1} ก่อนนะ ถึงจะเล่นด่านที่ {level} ได้
        </p>
        <ChunkyButton href="/levels" variant="sunny" size="lg" className="mt-8">
          🗺️ กลับแผนที่ด่าน
        </ChunkyButton>
      </div>
    );
  }

  return <>{children}</>;
}
