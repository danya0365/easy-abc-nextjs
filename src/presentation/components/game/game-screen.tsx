"use client";

// โหมดผจญภัย (สะกดคำ/เติมตัวอักษร): เล่นทีละคำจนครบด่าน → คิดดาว → บันทึก best-of → ปลดด่านถัดไป

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LevelConfig, WordEntry } from "@/src/domain/ports/level.port";
import {
  computeStars,
  energyCostToStart,
  type Stars,
} from "@/src/domain/services/rules";
import { maskWord, type AdventureGame } from "@/src/domain/services/mask";
import { useProgressStore } from "@/src/presentation/stores/progress.store";
import { useEnergyStore } from "@/src/presentation/stores/energy.store";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useCategoryStore } from "@/src/presentation/stores/category.store";
import { getAdventure } from "@/src/presentation/lib/adventures";
import { sound } from "@/src/presentation/lib/sound";
import { SpellingRound } from "./spelling-round";
import { GameHeader } from "./game-header";
import { PauseMenu } from "./pause-menu";
import { LevelComplete } from "./level-complete";
import { EnergyEmptyModal } from "../energy-hud";

export function GameScreen({
  level,
  maxLevel,
  game = "spell",
  wordsByCategory,
  wordsOverride,
  nextRouteOverride,
  noSave,
  backHref,
  trackKey,
}: {
  level: LevelConfig;
  maxLevel: number;
  game?: AdventureGame;
  /** คำของด่านนี้แยกต่อหมวด (สไลซ์แล้ว) — ไม่ส่ง/หมวด "คละ" = ใช้ชุดคำดั้งเดิมใน level.words */
  wordsByCategory?: Record<string, WordEntry[]>;
  /** ใช้ชุดคำนี้แทน category/level.words (สำหรับ Event) */
  wordsOverride?: WordEntry[];
  /** custom route base สำหรับปุ่ม "ด่านถัดไป" (สำหรับ Event) */
  nextRouteOverride?: string;
  /** ไม่บันทึกดาว/ไม่ให้โบนัส energy (สำหรับ Event) */
  noSave?: boolean;
  /** custom back href สำหรับ PauseMenu + LevelComplete (สำหรับ Event) */
  backHref?: string;
  /** progress track key (ไม่ส่ง = ใช้ game ปกติ) */
  trackKey?: string;
}) {
  const router = useRouter();
  const [wordIndex, setWordIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [paused, setPaused] = useState(false);
  const [result, setResult] = useState<{
    stars: Stars;
    bonusEnergy: boolean;
  } | null>(null);
  const [emptyOpen, setEmptyOpen] = useState(false);
  // key สำหรับ reset ทั้งด่าน (เล่นอีกครั้ง)
  const [runId, setRunId] = useState(0);

  const saveStars = useProgressStore((s) => s.saveStars);
  const starsByGame = useProgressStore((s) => s.starsByGame);
  const spend = useEnergyStore((s) => s.spend);
  const gainEnergy = useEnergyStore((s) => s.gain);
  const unlimited = useEntitlementStore((s) => s.hasUnlimitedEnergy());

  const adventure = getAdventure(game);
  const progressKey = trackKey ?? game;
  const gameStars = starsByGame[progressKey];

  // ชุดคำตามหมวดที่เลือก (GameScreen อยู่ใต้ PlayGate ที่ guard mounted แล้ว — อ่าน store ได้ตรง ๆ)
  // wordsOverride ข้ามทุก logic (ใช้สำหรับ Event)
  const category = useCategoryStore((s) => s.category);
  const categoryWords =
    category && category !== "mixed" ? wordsByCategory?.[category] : undefined;
  const words = wordsOverride ?? (categoryWords?.length ? categoryWords : level.words);

  const entry = words[wordIndex];
  const total = words.length;

  const handleCorrect = () => {
    if (wordIndex + 1 < total) {
      setWordIndex(wordIndex + 1);
      return;
    }
    // จบด่าน
    const stars = computeStars(mistakes);
    // Event (noSave) = ข้ามบันทึกดาวและโบนัส energy
    if (noSave) {
      setResult({ stars, bonusEnergy: false });
      return;
    }
    const hadThreeBefore = (gameStars[level.level] ?? 0) === 3;
    saveStars(progressKey, level.level, stars);
    // โบนัส 3 ดาวครั้งแรกของด่าน (ต่อเกม) +1⚡
    const bonusEnergy = stars === 3 && !hadThreeBefore && !unlimited;
    if (bonusEnergy) {
      gainEnergy(1);
      sound.sparkle();
    }
    setResult({ stars, bonusEnergy });
  };

  const restart = () => {
    setWordIndex(0);
    setMistakes(0);
    setResult(null);
    setPaused(false);
    setRunId((r) => r + 1);
  };

  const handleReplay = () => {
    // เล่นซ้ำด่านที่เพิ่งผ่าน = ฟรีเสมอ (ผ่านแล้วแน่นอน)
    restart();
  };

  const handleNext = () => {
    const next = level.level + 1;
    // Event — ใช้ custom route ถ้ามี
    if (nextRouteOverride) {
      router.push(`/event/${nextRouteOverride}/${game}/${next}`);
      return;
    }
    const cost = energyCostToStart({
      kind: "adventure",
      level: next,
      stars: gameStars,
      unlimited,
    });
    if (cost > 0 && !spend()) {
      setEmptyOpen(true);
      return;
    }
    router.push(adventure.playRoute(next));
  };

  return (
    <div className="flex min-h-dvh flex-col pb-6">
      <GameHeader
        onPause={() => setPaused(true)}
        center={
          <div>
            <p className="font-bold text-brand-700">
              {adventure.emoji} {adventure.name} · {level.title} · คำที่{" "}
              {Math.min(wordIndex + 1, total)}/{total}
            </p>
            <div className="mt-1 flex justify-center gap-1">
              {words.map((_, i) => (
                <span
                  key={i}
                  className={`size-2.5 rounded-full ${
                    i < wordIndex
                      ? "bg-success"
                      : i === wordIndex
                        ? "bg-accent-500"
                        : "bg-card/60"
                  }`}
                />
              ))}
            </div>
          </div>
        }
      />

      <SpellingRound
        key={`${runId}-${wordIndex}-${entry.word}`}
        entry={entry}
        decoys={level.decoys}
        mask={maskWord(entry.word, game)}
        paused={paused || result !== null}
        onCorrect={handleCorrect}
        onWrong={() => setMistakes((m) => m + 1)}
      />

      <PauseMenu
        open={paused && !result}
        onResume={() => setPaused(false)}
        onRestart={restart}
        backHref={backHref ?? adventure.mapRoute}
      />

      {result && (
        <LevelComplete
          level={level.level}
          stars={result.stars}
          maxLevel={maxLevel}
          bonusEnergy={result.bonusEnergy}
          mapHref={backHref ?? adventure.mapRoute}
          onReplay={handleReplay}
          onNext={handleNext}
        />
      )}

      <EnergyEmptyModal open={emptyOpen} onClose={() => setEmptyOpen(false)} />
    </div>
  );
}
