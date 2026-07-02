"use client";

// โหมดจับเวลา: สะกดให้มากที่สุดใน 60 วินาที

import { useEffect, useRef, useState } from "react";
import type { WordEntry } from "@/src/domain/ports/level.port";
import { shuffle } from "@/src/presentation/lib/shuffle";
import { useStatsStore } from "@/src/presentation/stores/stats.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { SpellingRound } from "./spelling-round";
import { GameHeader } from "./game-header";
import { PauseMenu } from "./pause-menu";
import { ModeStart } from "./mode-start";
import { RoundResult } from "./round-result";

const ROUND_SECONDS = 60;
const DECOYS = 3;

type Phase = "start" | "playing" | "result";

export function ModeTimeAttack({ pool }: { pool: WordEntry[] }) {
  const mounted = useMounted();
  const best = useStatsStore((s) => s.bestTimeAttack);
  const report = useStatsStore((s) => s.report);

  const [phase, setPhase] = useState<Phase>("start");
  const [queue, setQueue] = useState<WordEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [paused, setPaused] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  // refs สำหรับอ่านค่าใน interval callback (สรุปผลเมื่อหมดเวลา)
  const timeRef = useRef(ROUND_SECONDS);
  const scoreRef = useRef(0);

  // นาฬิกาถอยหลัง + สรุปผลตอนหมดเวลา (ทั้งหมดใน interval callback — lint-safe)
  useEffect(() => {
    if (phase !== "playing" || paused) return;
    const t = setInterval(() => {
      timeRef.current -= 1;
      setTimeLeft(timeRef.current);
      if (timeRef.current <= 0) {
        clearInterval(t);
        const finalScore = scoreRef.current;
        setNewRecord(finalScore > best);
        report({ bestTimeAttack: finalScore });
        setPhase("result");
      }
    }, 1000);
    return () => clearInterval(t);
  }, [phase, paused, best, report]);

  const startRound = () => {
    setQueue(shuffle(pool));
    setIndex(0);
    setScore(0);
    scoreRef.current = 0;
    timeRef.current = ROUND_SECONDS;
    setTimeLeft(ROUND_SECONDS);
    setPaused(false);
    setNewRecord(false);
    setPhase("playing");
  };

  if (phase === "start") {
    return (
      <ModeStart
        emoji="⏱️"
        name="จับเวลา"
        rules={`สะกดคำให้ได้มากที่สุดใน ${ROUND_SECONDS} วินาที ผิดได้ไม่หักคะแนน สู้ ๆ!`}
        bestLine={mounted && best > 0 ? `สถิติของหนู: ${best} คำ` : undefined}
        onStart={startRound}
      />
    );
  }

  const entry = queue[index % queue.length];

  return (
    <div className="flex min-h-dvh flex-col pb-6">
      <GameHeader
        onPause={() => setPaused(true)}
        center={
          <div className="flex items-center justify-center gap-4 font-bold">
            <span
              className={`rounded-full border-4 border-border px-4 py-1 font-heading text-xl tabular-nums ${
                timeLeft <= 10
                  ? "animate-pop bg-tile-1 text-white"
                  : "bg-card text-brand-700"
              }`}
            >
              ⏱️ {timeLeft}
            </span>
            <span className="rounded-full border-4 border-border bg-card px-4 py-1 font-heading text-xl text-brand-700">
              ✅ {score}
            </span>
          </div>
        }
      />

      {phase === "playing" && entry && (
        <SpellingRound
          key={index}
          entry={entry}
          decoys={DECOYS}
          paused={paused || timeLeft <= 0}
          onCorrect={() => {
            scoreRef.current += 1;
            setScore(scoreRef.current);
            setIndex((i) => i + 1);
          }}
        />
      )}

      <PauseMenu
        open={paused && phase === "playing"}
        onResume={() => setPaused(false)}
        onRestart={startRound}
        backHref="/modes"
        backLabel="🎮 เลือกโหมด"
      />

      {phase === "result" && (
        <RoundResult
          emoji="⏱️"
          title="หมดเวลา!"
          lines={[
            `สะกดได้ ${score} คำ`,
            `สถิติที่ดีที่สุด: ${Math.max(best, score)} คำ`,
          ]}
          newRecord={newRecord}
          onReplay={() => setPhase("start")}
        />
      )}
    </div>
  );
}
