// สถิติโหมดพรีเมียม — persist ลง localStorage
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StatsState {
  /** คะแนนสูงสุดโหมดจับเวลา (จำนวนคำใน 60 วิ) */
  bestTimeAttack: number;
  /** streak ตอบถูกติดกันสูงสุดโหมด endless */
  bestEndlessStreak: number;
  /** คำสะสมทั้งหมดโหมด endless */
  endlessTotalWords: number;
  /** คะแนนสูงสุดโหมด quiz (เต็ม 10) */
  bestQuiz: number;
  /** คะแนนสูงสุดโหมดฟังแล้วสะกด (จำนวนคำต่อรอบ 5 คำ) */
  bestListen: number;
  report: (patch: Partial<Omit<StatsState, "report" | "resetStats">>) => void;
  resetStats: () => void;
}

const initial = {
  bestTimeAttack: 0,
  bestEndlessStreak: 0,
  endlessTotalWords: 0,
  bestQuiz: 0,
  bestListen: 0,
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      ...initial,
      // เก็บแบบ best-of ยกเว้น endlessTotalWords ที่สะสมเพิ่ม
      report: (patch) => {
        const s = get();
        set({
          bestTimeAttack: Math.max(s.bestTimeAttack, patch.bestTimeAttack ?? 0),
          bestEndlessStreak: Math.max(
            s.bestEndlessStreak,
            patch.bestEndlessStreak ?? 0
          ),
          endlessTotalWords:
            s.endlessTotalWords + (patch.endlessTotalWords ?? 0),
          bestQuiz: Math.max(s.bestQuiz, patch.bestQuiz ?? 0),
          bestListen: Math.max(s.bestListen, patch.bestListen ?? 0),
        });
      },
      resetStats: () => set(initial),
    }),
    { name: "easy-abc-stats", version: 1 }
  )
);
