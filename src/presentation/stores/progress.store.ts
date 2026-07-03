// ความคืบหน้าโหมดผจญภัย (ดาวต่อด่าน แยก track ต่อเกม) — persist ลง localStorage
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Stars, StarsByLevel } from "@/src/domain/services/rules";
import type { AdventureGame } from "@/src/domain/services/mask";

export type StarsByGame = Record<AdventureGame, StarsByLevel>;

const emptyStars = (): StarsByGame => ({
  spell: {},
  "fill-front": {},
  "fill-back": {},
  "fill-middle": {},
});

interface ProgressState {
  starsByGame: StarsByGame;
  /** บันทึกแบบ best-of (ไม่ลดดาวที่เคยได้) — คืน true ถ้าเป็นสถิติใหม่ */
  saveStars: (game: AdventureGame, level: number, earned: Stars) => boolean;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      starsByGame: emptyStars(),
      saveStars: (game, level, earned) => {
        const current = get().starsByGame[game]?.[level] ?? 0;
        if (earned <= current) return false;
        set((s) => ({
          starsByGame: {
            ...s.starsByGame,
            [game]: { ...s.starsByGame[game], [level]: earned },
          },
        }));
        return true;
      },
      resetProgress: () => set({ starsByGame: emptyStars() }),
    }),
    {
      name: "easy-abc-progress",
      version: 2,
      // v1 เก็บ { stars } ของโหมดสะกดอย่างเดียว → ย้ายเข้า starsByGame.spell (ดาวเดิมไม่หาย)
      migrate: (persisted, version) => {
        if (version < 2) {
          const old = persisted as { stars?: StarsByLevel };
          return {
            starsByGame: { ...emptyStars(), spell: old?.stars ?? {} },
          };
        }
        return persisted as ProgressState;
      },
    }
  )
);
