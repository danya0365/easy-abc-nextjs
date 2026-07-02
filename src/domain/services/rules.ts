// กติกาเกมทั้งหมด (pure, framework-free) — ดาว / ปลดล็อกด่าน / Energy

export type Stars = 0 | 1 | 2 | 3;
export type StarsByLevel = Record<number, Stars>;

// ---------- ดาว ----------

/** ผิด 0–1 = 3⭐ · 2–4 = 2⭐ · 5+ = 1⭐ (ผ่านด่านได้อย่างน้อย 1 ดาวเสมอ) */
export function computeStars(mistakes: number): Stars {
  if (mistakes <= 1) return 3;
  if (mistakes <= 4) return 2;
  return 1;
}

// ---------- ปลดล็อกด่าน ----------

/** ด่าน 1 เปิดเสมอ ด่านถัดไปต้องผ่านด่านก่อนหน้า (≥1 ดาว) */
export function isLevelUnlocked(level: number, stars: StarsByLevel): boolean {
  return level === 1 || (stars[level - 1] ?? 0) >= 1;
}

export function isLevelCompleted(level: number, stars: StarsByLevel): boolean {
  return (stars[level] ?? 0) >= 1;
}

// ---------- Energy (Candy Crush-inspired แบบไม่กดดัน) ----------

export const MAX_ENERGY = 10;
export const REGEN_MINUTES = 5;
export const REGEN_MS = REGEN_MINUTES * 60 * 1000;

export interface EnergyState {
  energy: number;
  /** timestamp (ms) ฐานของการ regen แท่งถัดไป */
  lastRegenAt: number;
  /** วันที่ (YYYY-MM-DD ตามเวลาท้องถิ่น) ที่รับของขวัญรายวันล่าสุด */
  lastDailyGiftDate: string;
}

export function localDateKey(now: number): string {
  const d = new Date(now);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** เติม energy ตามเวลาที่ผ่านไป (+1 ทุก REGEN_MINUTES นาที, สูงสุด MAX_ENERGY) */
export function regenEnergy(state: EnergyState, now: number): EnergyState {
  if (state.energy >= MAX_ENERGY) {
    return { ...state, energy: MAX_ENERGY, lastRegenAt: now };
  }
  const elapsed = Math.max(0, now - state.lastRegenAt);
  const gained = Math.floor(elapsed / REGEN_MS);
  if (gained <= 0) return state;
  const energy = Math.min(MAX_ENERGY, state.energy + gained);
  return {
    ...state,
    energy,
    // ถ้าเต็มแล้วรีเซ็ตฐานเป็น now, ไม่งั้นเลื่อนฐานตามที่เติมไปจริง
    lastRegenAt: energy >= MAX_ENERGY ? now : state.lastRegenAt + gained * REGEN_MS,
  };
}

/** ของขวัญรายวัน: เปิดแอปครั้งแรกของวัน → เต็มหลอด */
export function applyDailyGift(
  state: EnergyState,
  now: number
): { state: EnergyState; gifted: boolean } {
  const today = localDateKey(now);
  if (state.lastDailyGiftDate === today) return { state, gifted: false };
  return {
    state: {
      energy: MAX_ENERGY,
      lastRegenAt: now,
      lastDailyGiftDate: today,
    },
    gifted: true,
  };
}

/** หัก energy 1 แท่ง (เมื่อเริ่มด่านใหม่ที่ยังไม่ผ่าน / เริ่มรอบโหมดพรีเมียม) */
export function spendEnergy(state: EnergyState, now: number): EnergyState {
  const s = regenEnergy(state, now);
  if (s.energy <= 0) return s;
  return {
    ...s,
    // เริ่มนับ regen จากตอนที่หลุดจากเต็มหลอด
    lastRegenAt: s.energy >= MAX_ENERGY ? now : s.lastRegenAt,
    energy: s.energy - 1,
  };
}

/** โบนัส energy (เช่น 3 ดาวครั้งแรกของด่าน +1) */
export function gainEnergy(state: EnergyState, amount: number): EnergyState {
  return { ...state, energy: Math.min(MAX_ENERGY, state.energy + amount) };
}

/** ms ที่เหลือจนกว่าจะได้ energy แท่งถัดไป (0 = เต็มแล้ว) */
export function msToNextEnergy(state: EnergyState, now: number): number {
  const s = regenEnergy(state, now);
  if (s.energy >= MAX_ENERGY) return 0;
  return Math.max(0, s.lastRegenAt + REGEN_MS - now);
}

/**
 * ต้องหัก energy ไหมเมื่อเริ่มเล่น
 * - ด่านผจญภัยที่เคยผ่านแล้ว = เล่นซ้ำฟรี (กันเครียด)
 * - ด่านใหม่ / รอบโหมดพรีเมียม = หัก 1 (ยกเว้นมี energy ไม่จำกัดจาก Bundle)
 */
export function energyCostToStart(opts: {
  kind: "adventure" | "premium";
  level?: number;
  stars?: StarsByLevel;
  unlimited: boolean;
}): 0 | 1 {
  if (opts.unlimited) return 0;
  if (
    opts.kind === "adventure" &&
    opts.level != null &&
    isLevelCompleted(opts.level, opts.stars ?? {})
  ) {
    return 0;
  }
  return 1;
}
