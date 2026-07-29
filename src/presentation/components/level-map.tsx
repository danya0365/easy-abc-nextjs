"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LevelConfig } from "@/src/domain/ports/level.port";
import {
  energyCostToStart,
  isLevelCompleted,
  isLevelUnlocked,
} from "@/src/domain/services/rules";
import type { AdventureGame } from "@/src/domain/services/mask";
import { useProgressStore } from "@/src/presentation/stores/progress.store";
import { useEnergyStore } from "@/src/presentation/stores/energy.store";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { getAdventure } from "@/src/presentation/lib/adventures";
import { LevelButton } from "./level-button";
import { EnergyEmptyModal } from "./energy-hud";

/** แผนที่ด่านซิกแซกจากล่างขึ้นบน (สไตล์ candy-crush ตามภาพโปรโมต) — ใช้ร่วมทุกเกมผจญภัย */
export function LevelMap({
  levels,
  game = "spell",
  baseRoute,
  trackKey,
}: {
  levels: LevelConfig[];
  game?: AdventureGame;
  /** custom route prefix แทน adventure.playRoute (ใช้สำหรับ Event) เช่น "/event/spelling-bee-alp-jr2-2026/spell" */
  baseRoute?: string;
  /** progress track key (ไม่ส่ง = ใช้ game ปกติ) */
  trackKey?: string;
}) {
  const router = useRouter();
  const mounted = useMounted();
  const starsByGame = useProgressStore((s) => s.starsByGame);
  const spend = useEnergyStore((s) => s.spend);
  const unlimited = useEntitlementStore((s) => s.hasUnlimitedEnergy());
  const [emptyOpen, setEmptyOpen] = useState(false);

  const adventure = getAdventure(game);
  const progressKey = trackKey ?? game;
  const stars = starsByGame[progressKey];
  const ALIGN = ["self-start", "self-center", "self-end", "self-center"];

  const handlePlay = (level: number) => {
    // หัก energy ตอนกดเริ่ม (เล่นซ้ำด่านที่ผ่านแล้วของเกมนี้ = ฟรี)
    const cost = energyCostToStart({
      kind: "adventure",
      level,
      stars,
      unlimited,
    });
    if (cost > 0 && !spend()) {
      setEmptyOpen(true);
      return;
    }
    const target = baseRoute
      ? `${baseRoute}/${level}`
      : adventure.playRoute(level);
    router.push(target);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-sm flex-col-reverse gap-6 px-8 py-4">
      {/* เส้นทางประ */}
      <div
        aria-hidden
        className="absolute inset-y-8 left-1/2 -translate-x-1/2 border-l-4 border-dashed border-card/70"
      />
      {levels.map((lv, i) => {
        const unlocked = mounted ? isLevelUnlocked(lv.level, stars) : lv.level === 1;
        const earned = mounted ? (stars[lv.level] ?? 0) : 0;
        return (
          <div key={lv.level} className={`relative z-10 ${ALIGN[i % ALIGN.length]}`}>
            <LevelButton
              level={lv.level}
              stars={earned}
              locked={!unlocked}
              onPlay={handlePlay}
            />
            {mounted && unlocked && !isLevelCompleted(lv.level, stars) && (
              <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-700">
                ⚡1
              </span>
            )}
          </div>
        );
      })}
      <EnergyEmptyModal open={emptyOpen} onClose={() => setEmptyOpen(false)} />
    </div>
  );
}
