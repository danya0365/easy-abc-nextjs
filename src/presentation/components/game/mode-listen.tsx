"use client";

// โหมดฟังแล้วสะกด: ไม่มีรูป ฟังเสียง TTS แล้วสะกด — รอบละ 5 คำ

import { useState } from "react";
import type { WordEntry } from "@/src/domain/ports/level.port";
import { shuffle } from "@/src/presentation/lib/shuffle";
import { useStatsStore } from "@/src/presentation/stores/stats.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { SpellingRound } from "./spelling-round";
import { GameHeader } from "./game-header";
import { PauseMenu } from "./pause-menu";
import { ModeStart } from "./mode-start";
import { RoundResult } from "./round-result";

const WORDS_PER_ROUND = 5;
const DECOYS = 3;

type Phase = "start" | "playing" | "result";

export function ModeListen({ pool }: { pool: WordEntry[] }) {
  const mounted = useMounted();
  const best = useStatsStore((s) => s.bestListen);
  const report = useStatsStore((s) => s.report);

  const [phase, setPhase] = useState<Phase>("start");
  const [queue, setQueue] = useState<WordEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const [madeMistake, setMadeMistake] = useState(false);
  const [paused, setPaused] = useState(false);
  const [newRecord, setNewRecord] = useState(false);

  const startRound = () => {
    setQueue(shuffle(pool).slice(0, WORDS_PER_ROUND));
    setIndex(0);
    setPerfect(0);
    setMadeMistake(false);
    setPaused(false);
    setNewRecord(false);
    setPhase("playing");
  };

  const handleCorrect = () => {
    const nextPerfect = perfect + (madeMistake ? 0 : 1);
    setPerfect(nextPerfect);
    setMadeMistake(false);
    if (index + 1 < WORDS_PER_ROUND) {
      setIndex(index + 1);
    } else {
      setNewRecord(nextPerfect > best);
      report({ bestListen: nextPerfect });
      setPhase("result");
    }
  };

  if (phase === "start") {
    return (
      <ModeStart
        emoji="🔊"
        name="ฟังแล้วสะกด"
        rules={`ไม่มีรูปช่วยนะ! ฟังเสียงคำศัพท์แล้วสะกดให้ถูก รอบละ ${WORDS_PER_ROUND} คำ (แตะปุ่มลำโพงฟังซ้ำได้)`}
        bestLine={
          mounted && best > 0
            ? `สถิติของหนู: ${best}/${WORDS_PER_ROUND} คำแบบไม่พลาด`
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
            🔊 คำที่ {index + 1}/{WORDS_PER_ROUND} · ไม่พลาด {perfect}
          </p>
        }
      />

      {phase === "playing" && entry && (
        <SpellingRound
          key={index}
          entry={entry}
          decoys={DECOYS}
          showImage={false}
          listenMode
          paused={paused}
          onCorrect={handleCorrect}
          onWrong={() => setMadeMistake(true)}
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
          emoji="🔊"
          title="จบรอบ!"
          lines={[
            `สะกดแบบไม่พลาด ${perfect}/${WORDS_PER_ROUND} คำ`,
            `สถิติที่ดีที่สุด: ${Math.max(best, perfect)}/${WORDS_PER_ROUND}`,
          ]}
          newRecord={newRecord}
          onReplay={() => setPhase("start")}
        />
      )}
    </div>
  );
}
