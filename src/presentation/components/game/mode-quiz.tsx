"use client";

// โหมดทายคำจากรูป: ดูรูปเลือกคำถูกจาก 3 ตัวเลือก — รอบละ 10 ข้อ (ตอบครั้งแรกเท่านั้นที่นับ)

import { useEffect, useRef, useState } from "react";
import type { WordEntry } from "@/src/domain/ports/level.port";
import type { WordBank } from "@/src/domain/ports/word.port";
import { useCategoryPool } from "@/src/presentation/lib/use-category-pool";
import { pickQuizChoices, shuffle } from "@/src/presentation/lib/shuffle";
import { useStatsStore } from "@/src/presentation/stores/stats.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { sound } from "@/src/presentation/lib/sound";
import { WordImage } from "./word-image";
import { GameHeader } from "./game-header";
import { PauseMenu } from "./pause-menu";
import { ModeStart } from "./mode-start";
import { RoundResult } from "./round-result";

const QUESTIONS_PER_ROUND = 10;

type Phase = "start" | "playing" | "result";

export function ModeQuiz({ bank }: { bank: WordBank }) {
  const pool = useCategoryPool(bank);
  const mounted = useMounted();
  const best = useStatsStore((s) => s.bestQuiz);
  const report = useStatsStore((s) => s.report);

  const [phase, setPhase] = useState<Phase>("start");
  const [questions, setQuestions] = useState<WordEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<WordEntry[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  // สุ่มทั้งหมดเกิดใน event handler เท่านั้น (กัน hydration mismatch)
  const startRound = () => {
    // สุ่มคำถาม (วนซ้ำได้ถ้า pool < 10)
    const qs = shuffle(pool);
    const picked_qs =
      qs.length >= QUESTIONS_PER_ROUND
        ? qs.slice(0, QUESTIONS_PER_ROUND)
        : Array.from(
            { length: QUESTIONS_PER_ROUND },
            (_, i) => qs[i % qs.length]
          );
    setQuestions(picked_qs);
    setChoices(pickQuizChoices(picked_qs[0], pool));
    setPicked(null);
    setIndex(0);
    setScore(0);
    setPaused(false);
    setNewRecord(false);
    setPhase("playing");
  };

  const answer = (choice: WordEntry) => {
    if (picked || paused) return;
    const q = questions[index];
    const correct = choice.word === q.word;
    setPicked(choice.word);
    if (correct) {
      sound.correct();
      sound.speakWord(q.word);
      setScore((s) => s + 1);
    } else {
      sound.wrong();
    }
    timers.current.push(
      setTimeout(() => {
        if (index + 1 < QUESTIONS_PER_ROUND) {
          const next = index + 1;
          setChoices(pickQuizChoices(questions[next], pool));
          setPicked(null);
          setIndex(next);
        } else {
          const finalScore = score + (correct ? 1 : 0);
          setNewRecord(finalScore > best);
          report({ bestQuiz: finalScore });
          setPhase("result");
        }
      }, 1300)
    );
  };

  if (phase === "start") {
    return (
      <ModeStart
        emoji="🧩"
        name="ทายคำจากรูป"
        rules={`ดูรูปแล้วเลือกคำภาษาอังกฤษที่ถูกต้องจาก 3 ตัวเลือก รอบละ ${QUESTIONS_PER_ROUND} ข้อ`}
        bestLine={
          mounted && best > 0
            ? `สถิติของหนู: ${best}/${QUESTIONS_PER_ROUND} ข้อ`
            : undefined
        }
        onStart={startRound}
      />
    );
  }

  const q = questions[index];

  return (
    <div className="flex min-h-dvh flex-col pb-6">
      <GameHeader
        onPause={() => setPaused(true)}
        center={
          <p className="font-bold text-brand-700">
            🧩 ข้อ {index + 1}/{QUESTIONS_PER_ROUND} · ถูก {score}
          </p>
        }
      />

      {phase === "playing" && q && (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
          <WordImage key={q.word} entry={q} />
          <div className="flex w-full max-w-sm flex-col gap-3">
            {choices.map((c) => {
              const isPicked = picked === c.word;
              const isAnswer = c.word === q.word;
              const revealed = picked !== null;
              return (
                <button
                  key={c.word}
                  type="button"
                  disabled={revealed}
                  onClick={() => answer(c)}
                  className={`rounded-full border-4 border-border px-6 py-3 font-heading text-2xl font-bold shadow-[0_5px_0_var(--brand-200)] transition-all active:translate-y-0.5 ${
                    revealed && isAnswer
                      ? "animate-pop bg-success text-white"
                      : revealed && isPicked
                        ? "animate-shake bg-tile-1 text-white"
                        : "bg-card text-brand-600"
                  } ${revealed && !isAnswer && !isPicked ? "opacity-50" : ""}`}
                >
                  {c.word}
                </button>
              );
            })}
          </div>
        </div>
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
          emoji={score >= 8 ? "🏆" : "🧩"}
          title="จบรอบ!"
          lines={[
            `ตอบถูก ${score}/${QUESTIONS_PER_ROUND} ข้อ`,
            `สถิติที่ดีที่สุด: ${Math.max(best, score)}/${QUESTIONS_PER_ROUND}`,
          ]}
          newRecord={newRecord}
          onReplay={() => setPhase("start")}
        />
      )}
    </div>
  );
}
