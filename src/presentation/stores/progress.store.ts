// ความคืบหน้าโหมดผจญภัย (ดาวต่อด่าน) — persist ลง localStorage
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Stars, StarsByLevel } from "@/src/domain/services/rules";

interface ProgressState {
  stars: StarsByLevel;
  /** บันทึกแบบ best-of (ไม่ลดดาวที่เคยได้) — คืน true ถ้าเป็นสถิติใหม่ */
  saveStars: (level: number, earned: Stars) => boolean;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      stars: {},
      saveStars: (level, earned) => {
        const current = get().stars[level] ?? 0;
        if (earned <= current) return false;
        set((s) => ({ stars: { ...s.stars, [level]: earned } }));
        return true;
      },
      resetProgress: () => set({ stars: {} }),
    }),
    { name: "easy-abc-progress", version: 1 }
  )
);
