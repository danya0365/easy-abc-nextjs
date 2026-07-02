"use client";

// โหมดเล่นไม่จำกัด: สุ่มคำวนเรื่อย ๆ นับ streak — สถิติบันทึกทันทีทุกคำ

import { useState } from "react";
import type { WordEntry } from "@/src/domain/ports/level.port";
import { shuffle } from "@/src/presentation/lib/shuffle";
import { useStatsStore } from "@/src/presentation/stores/stats.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { SpellingRound } from "./spelling-round";
import { GameHeader } from "./game-header";
import { PauseMenu } from "./pause-menu";
import { ModeStart } from "./mode-start";

const DECOYS = 3;

type Phase = "start" | "playing";

export function ModeEndless({ pool }: { pool: WordEntry[] }) {
  const mounted = useMounted();
  const bestStreak = useStatsStore((s) => s.bestEndlessStreak);
  const totalWords = useStatsStore((s) => s.endlessTotalWords);
  const report = useStatsStore((s) => s.report);

  const [phase, setPhase] = useState<Phase>("start");
  const [queue, setQueue] = useState<WordEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [paused, setPaused] = useState(false);

  const startRound = () => {
    setQueue(shuffle(pool));
    setIndex(0);
    setStreak(0);
    setPaused(false);
    setPhase("playing");
  };

  const handleCorrect = () => {
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    // บันทึกสถิติทันที — ออกจากโหมดเมื่อไหร่ก็ไม่หาย
    report({ bestEndlessStreak: nextStreak, endlessTotalWords: 1 });
    const next = index + 1;
    if (next >= queue.length) {
      // ครบรอบ pool → สับใหม่เล่นต่อ
      setQueue(shuffle(pool));
      setIndex(0);
    } else {
      setIndex(next);
    }
  };

  if (phase === "start") {
    return (
      <ModeStart
        emoji="♾️"
        name="เล่นไม่จำกัด"
        rules="สุ่มคำจากทุกด่านเล่นเรื่อย ๆ ไม่มีหมด! ตอบถูกติดกันเพื่อทำ streak ให้ยาวที่สุด"
        bestLine={
          mounted && totalWords > 0
            ? `streak สูงสุด ${bestStreak} · สะสม ${totalWords} คำ`
            : undefined
        }
        onStart={startRound}
      />
    );
  }

  const entry = queue[index];

  return (
    <div className="flex min-h-dvh flex-col pb-6">
      <GameHeader
        onPause={() => setPaused(true)}
        center={
          <p className="font-bold text-brand-700">
            🔥 streak {streak}
            <span className="ml-2 text-sm text-brand-800">
              (สูงสุด {Math.max(bestStreak, streak)})
            </span>
          </p>
        }
      />

      {entry && (
        <SpellingRound
          key={`${index}-${entry.word}`}
          entry={entry}
          decoys={DECOYS}
          paused={paused}
          onCorrect={handleCorrect}
          onWrong={() => setStreak(0)}
        />
      )}

      <PauseMenu
        open={paused}
        onResume={() => setPaused(false)}
        onRestart={startRound}
        backHref="/modes"
        backLabel="🏁 จบรอบ · เลือกโหมด"
      />
    </div>
  );
}
