// ระบบ Energy (Candy Crush-inspired) — persist ลง localStorage
// กติกาทั้งหมดเป็น pure function ใน src/domain/services/rules.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyDailyGift,
  gainEnergy,
  MAX_ENERGY,
  regenEnergy,
  spendEnergy,
  type EnergyState,
} from "@/src/domain/services/rules";

interface EnergyStore extends EnergyState {
  /** regen ตามเวลา + ของขวัญรายวัน — เรียกตอน mount/interval; คืน true ถ้าได้ของขวัญวันใหม่ */
  sync: () => boolean;
  /** หัก 1 แท่ง (เรียกเฉพาะเมื่อ energyCostToStart คืน 1) — คืน false ถ้าไม่พอ */
  spend: () => boolean;
  /** โบนัส เช่น 3 ดาวครั้งแรก +1 */
  gain: (amount: number) => void;
}

export const useEnergyStore = create<EnergyStore>()(
  persist(
    (set, get) => ({
      energy: MAX_ENERGY,
      lastRegenAt: 0,
      lastDailyGiftDate: "",

      sync: () => {
        const now = Date.now();
        const cur: EnergyState = {
          energy: get().energy,
          lastRegenAt: get().lastRegenAt || now,
          lastDailyGiftDate: get().lastDailyGiftDate,
        };
        const gift = applyDailyGift(cur, now);
        const next = gift.gifted ? gift.state : regenEnergy(cur, now);
        set(next);
        return gift.gifted;
      },

      spend: () => {
        const now = Date.now();
        const cur = regenEnergy(get(), now);
        if (cur.energy <= 0) {
          set(cur);
          return false;
        }
        set(spendEnergy(cur, now));
        return true;
      },

      gain: (amount) => set(gainEnergy(get(), amount)),
    }),
    { name: "easy-abc-energy", version: 1 }
  )
);
