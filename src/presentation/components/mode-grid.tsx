"use client";

import Link from "next/link";
import { PREMIUM_MODES } from "@/src/presentation/lib/modes";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useProgressStore } from "@/src/presentation/stores/progress.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { StarRow } from "./star-row";

/** ตารางเลือกโหมด: ผจญภัยเด่นสุด + โหมดพรีเมียม (ล็อกจนกว่าซื้อ) */
export function ModeGrid() {
  const mounted = useMounted();
  const hasMode = useEntitlementStore((s) => s.hasMode);
  const stars = useProgressStore((s) => s.stars);
  const totalStars = mounted
    ? Object.values(stars).reduce<number>((a, b) => a + b, 0)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ผจญภัย — โหมดหลักฟรี */}
      <Link
        href="/levels"
        className="block rounded-4xl border-4 border-border bg-brand-500 p-5 text-on-brand shadow-[0_8px_0_var(--brand-700)] transition-transform active:translate-y-1 active:shadow-[0_3px_0_var(--brand-700)]"
      >
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-card text-4xl shadow-inner">
            🗺️
          </span>
          <div className="flex-1 text-left">
            <h2 className="text-2xl font-bold">ผจญภัย</h2>
            <p className="text-sm opacity-90">
              ตะลุยด่าน 1–5 สะกดคำ เก็บดาวให้ครบ!
            </p>
          </div>
          <div className="text-right">
            <StarRow stars={3} size="sm" />
            <p className="mt-1 text-sm font-bold">{totalStars}/15 ⭐</p>
          </div>
        </div>
      </Link>

      {/* โหมดพรีเมียม */}
      <div className="grid grid-cols-2 gap-3">
        {PREMIUM_MODES.map((m) => {
          const owned = mounted && hasMode(m.id);
          return (
            <Link
              key={m.id}
              href={owned ? m.route : "/shop"}
              className={`relative flex flex-col items-center gap-1 rounded-3xl border-4 border-border p-4 text-center shadow-[0_6px_0_var(--brand-200)] transition-transform active:translate-y-1 ${
                owned ? "bg-card" : "bg-card/70"
              }`}
            >
              {!owned && (
                <span className="absolute right-2 top-2 rounded-full bg-locked px-2 py-0.5 text-xs font-bold text-white">
                  🔒
                </span>
              )}
              <span className={`text-4xl ${owned ? "" : "grayscale opacity-70"}`}>
                {m.emoji}
              </span>
              <h3 className="font-bold text-card-foreground">{m.name}</h3>
              <p className="text-xs text-muted">{m.description}</p>
              {!owned && (
                <span className="mt-1 rounded-full bg-accent-500 px-3 py-0.5 text-xs font-bold text-brand-800">
                  ปลดล็อกในร้านค้า
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
