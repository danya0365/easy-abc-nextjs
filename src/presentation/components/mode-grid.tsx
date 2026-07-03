"use client";

import Link from "next/link";
import { PREMIUM_MODES } from "@/src/presentation/lib/modes";
import { ADVENTURES } from "@/src/presentation/lib/adventures";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useProgressStore } from "@/src/presentation/stores/progress.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";

const MAX_STARS_PER_GAME = 15; // 5 ด่าน × 3 ดาว

/** ตารางเลือกโหมด: ผจญภัย 4 เกม (ฟรี) + โหมดพรีเมียม (ล็อกจนกว่าซื้อ) */
export function ModeGrid() {
  const mounted = useMounted();
  const hasMode = useEntitlementStore((s) => s.hasMode);
  const starsByGame = useProgressStore((s) => s.starsByGame);

  const totalOf = (game: (typeof ADVENTURES)[number]["game"]) =>
    mounted
      ? Object.values(starsByGame[game]).reduce<number>((a, b) => a + b, 0)
      : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ผจญภัย — โหมดหลักฟรี 4 เกม */}
      <h2 className="text-lg font-bold text-brand-800">🗺️ ผจญภัย (ฟรี)</h2>
      <div className="grid grid-cols-2 gap-3">
        {ADVENTURES.map((a) => (
          <Link
            key={a.game}
            href={a.mapRoute}
            className={`flex flex-col items-center gap-1 rounded-3xl border-4 border-border p-4 text-center shadow-[0_6px_0_var(--brand-700)] transition-transform active:translate-y-1 ${
              a.game === "spell" ? "bg-brand-500" : "bg-brand-400"
            }`}
          >
            <span className="text-4xl">{a.emoji}</span>
            <h3 className="font-bold text-on-brand">{a.name}</h3>
            <span className="rounded-full bg-card px-3 py-0.5 font-heading text-sm font-bold tracking-widest text-brand-600">
              {a.sample}
            </span>
            <p className="text-xs text-on-brand opacity-90">{a.description}</p>
            <span className="mt-1 text-sm font-bold text-on-brand">
              ⭐ {totalOf(a.game)}/{MAX_STARS_PER_GAME}
            </span>
          </Link>
        ))}
      </div>

      {/* โหมดพรีเมียม */}
      <h2 className="mt-2 text-lg font-bold text-brand-800">✨ โหมดพิเศษ</h2>
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
