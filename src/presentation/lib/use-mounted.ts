"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * กัน hydration mismatch: SSR + first render ได้ false,
 * ค่าจริงจาก persist store ค่อยแสดงหลัง hydrate (client ได้ true)
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
