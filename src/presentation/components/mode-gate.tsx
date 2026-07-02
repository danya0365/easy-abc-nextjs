"use client";

import type { ReactNode } from "react";
import type { GameModeId } from "@/src/domain/ports/product.port";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { PREMIUM_MODES } from "@/src/presentation/lib/modes";
import { ChunkyButton } from "./chunky-button";

/** ยามโหมดพรีเมียม: ยังไม่ซื้อ → จอแนะนำ + ปุ่มไปร้านค้า (เช็ค client-side เท่านั้น by design) */
export function ModeGate({
  mode,
  children,
}: {
  mode: GameModeId;
  children: ReactNode;
}) {
  const mounted = useMounted();
  const hasMode = useEntitlementStore((s) => s.hasMode);
  const meta = PREMIUM_MODES.find((m) => m.id === mode);

  if (!mounted) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-4xl">
        <span className="animate-float">🐼</span>
      </div>
    );
  }

  if (!hasMode(mode)) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div className="text-7xl">{meta?.emoji} 🔒</div>
        <h1 className="mt-4 text-3xl font-bold text-brand-700 text-outline">
          โหมด{meta?.name}
        </h1>
        <p className="mt-2 text-lg text-brand-800">{meta?.description}</p>
        <p className="mt-1 text-brand-800">
          ปลดล็อกโหมดนี้ได้ในร้านค้า หรือซื้อ Premium ครั้งเดียวได้ครบทุกโหมด!
        </p>
        <ChunkyButton href="/shop" variant="sunny" size="lg" className="mt-8">
          🛒 ไปร้านค้า
        </ChunkyButton>
        <ChunkyButton href="/modes" variant="white" size="sm" className="mt-3">
          ← กลับไปเลือกโหมด
        </ChunkyButton>
      </div>
    );
  }

  return <>{children}</>;
}
