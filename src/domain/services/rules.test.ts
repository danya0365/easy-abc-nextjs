import { describe, it, expect } from "vitest";
import {
  computeStars,
  isLevelUnlocked,
  regenEnergy,
  applyDailyGift,
  spendEnergy,
  gainEnergy,
  msToNextEnergy,
  energyCostToStart,
  MAX_ENERGY,
  REGEN_MS,
  type EnergyState,
} from "./rules";

describe("computeStars", () => {
  it("ผิด 0–1 = 3⭐, 2–4 = 2⭐, 5+ = 1⭐", () => {
    expect(computeStars(0)).toBe(3);
    expect(computeStars(1)).toBe(3);
    expect(computeStars(2)).toBe(2);
    expect(computeStars(4)).toBe(2);
    expect(computeStars(5)).toBe(1);
    expect(computeStars(99)).toBe(1);
  });
});

describe("isLevelUnlocked", () => {
  it("ด่าน 1 เปิดเสมอ ด่านถัดไปต้องผ่านด่านก่อนหน้า", () => {
    expect(isLevelUnlocked(1, {})).toBe(true);
    expect(isLevelUnlocked(2, {})).toBe(false);
    expect(isLevelUnlocked(2, { 1: 1 })).toBe(true);
    expect(isLevelUnlocked(3, { 1: 3 })).toBe(false);
    expect(isLevelUnlocked(3, { 1: 3, 2: 2 })).toBe(true);
  });
});

const t0 = 1_750_000_000_000;
const state = (over: Partial<EnergyState> = {}): EnergyState => ({
  energy: 5,
  lastRegenAt: t0,
  lastDailyGiftDate: "2026-07-01",
  ...over,
});

describe("energy", () => {
  it("regen +1 ทุก 5 นาที ไม่เกิน MAX", () => {
    expect(regenEnergy(state(), t0 + REGEN_MS - 1).energy).toBe(5);
    expect(regenEnergy(state(), t0 + REGEN_MS).energy).toBe(6);
    expect(regenEnergy(state(), t0 + 3 * REGEN_MS).energy).toBe(8);
    expect(regenEnergy(state(), t0 + 100 * REGEN_MS).energy).toBe(MAX_ENERGY);
  });

  it("regen เลื่อนฐานเวลาตามที่เติมจริง (เศษเวลาไม่หาย)", () => {
    const s = regenEnergy(state(), t0 + REGEN_MS + 1000);
    expect(s.energy).toBe(6);
    expect(s.lastRegenAt).toBe(t0 + REGEN_MS);
  });

  it("spend หัก 1 และไม่ติดลบ", () => {
    expect(spendEnergy(state(), t0).energy).toBe(4);
    expect(spendEnergy(state({ energy: 0 }), t0).energy).toBe(0);
  });

  it("spend ตอนเต็มหลอด → เริ่มนับ regen ใหม่จากตอนนั้น", () => {
    const s = spendEnergy(state({ energy: MAX_ENERGY }), t0 + 999);
    expect(s.energy).toBe(MAX_ENERGY - 1);
    expect(s.lastRegenAt).toBe(t0 + 999);
  });

  it("gain ไม่เกิน MAX", () => {
    expect(gainEnergy(state({ energy: 9 }), 5).energy).toBe(MAX_ENERGY);
  });

  it("ของขวัญรายวัน: วันใหม่เต็มหลอด วันเดิมไม่ให้ซ้ำ", () => {
    const day2 = applyDailyGift(state({ energy: 2 }), t0); // 2026-06-15 ≠ 2026-07-01
    expect(day2.gifted).toBe(true);
    expect(day2.state.energy).toBe(MAX_ENERGY);
    const again = applyDailyGift(day2.state, t0 + 1000);
    expect(again.gifted).toBe(false);
  });

  it("msToNextEnergy นับถอยหลังถูก และเต็มแล้วเป็น 0", () => {
    expect(msToNextEnergy(state(), t0 + 1000)).toBe(REGEN_MS - 1000);
    expect(msToNextEnergy(state({ energy: MAX_ENERGY }), t0)).toBe(0);
  });

  it("energyCostToStart: เล่นซ้ำด่านที่ผ่านแล้วฟรี, Bundle ฟรีหมด", () => {
    expect(
      energyCostToStart({ kind: "adventure", level: 1, stars: { 1: 2 }, unlimited: false })
    ).toBe(0);
    expect(
      energyCostToStart({ kind: "adventure", level: 2, stars: { 1: 2 }, unlimited: false })
    ).toBe(1);
    expect(energyCostToStart({ kind: "premium", unlimited: false })).toBe(1);
    expect(energyCostToStart({ kind: "premium", unlimited: true })).toBe(0);
  });
});
