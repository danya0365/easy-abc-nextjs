"use client";

import { useSync } from "@/src/presentation/lib/use-sync";

/** ตัวเงียบ ๆ ที่รัน sync การซื้อจาก server เมื่อมี session — mount ครั้งเดียวใน root layout */
export function SyncGate() {
  useSync();
  return null;
}
