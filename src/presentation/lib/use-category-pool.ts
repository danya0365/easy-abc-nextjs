"use client";

import { useMemo } from "react";
import type { WordEntry } from "@/src/domain/ports/level.port";
import type { WordBank } from "@/src/domain/ports/word.port";
import { flattenBank } from "@/src/domain/services/word-bank";
import { useCategoryStore } from "@/src/presentation/stores/category.store";

/**
 * pool คำศัพท์ตามหมวดที่ผู้เล่นเลือก — "คละ" = ทั้งคลังทุกหมวด
 * ⚠️ เรียกใต้ gate ที่ guard useMounted แล้วเท่านั้น (ModeGate/PlayGate) กัน hydration mismatch
 */
export function useCategoryPool(bank: WordBank): WordEntry[] {
  const category = useCategoryStore((s) => s.category);
  return useMemo(
    () =>
      category && category !== "mixed"
        ? (bank[category] ?? [])
        : flattenBank(bank),
    [bank, category]
  );
}
