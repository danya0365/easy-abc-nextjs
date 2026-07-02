"use client";

import { useEffect, useState } from "react";
import { MAX_ENERGY, msToNextEnergy } from "@/src/domain/services/rules";
import { useEnergyStore } from "@/src/presentation/stores/energy.store";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { sound } from "@/src/presentation/lib/sound";
import { ChunkyButton } from "./chunky-button";

function fmt(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function readRemain(): number {
  const s = useEnergyStore.getState();
  return msToNextEnergy(
    {
      energy: s.energy,
      lastRegenAt: s.lastRegenAt,
      lastDailyGiftDate: s.lastDailyGiftDate,
    },
    Date.now()
  );
}

/** HUD ⚡ n/10 + countdown แท่งถัดไป (Bundle = ∞) — sync regen + ของขวัญรายวัน */
export function EnergyHud({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const energy = useEnergyStore((s) => s.energy);
  const sync = useEnergyStore((s) => s.sync);
  const unlimited = useEntitlementStore((s) => s.hasUnlimitedEnergy());
  const [remain, setRemain] = useState<number | null>(null);
  const [gift, setGift] = useState(false);

  useEffect(() => {
    let giftTimer: ReturnType<typeof setTimeout> | undefined;
    const update = (first: boolean) => {
      const gifted = sync();
      setRemain(readRemain());
      if (first && gifted) {
        setGift(true);
        sound.sparkle();
        giftTimer = setTimeout(() => setGift(false), 4000);
      }
    };
    // setTimeout(0) แทนการ setState ตรง ๆ ใน effect body (lint-safe)
    const t0 = setTimeout(() => update(true), 0);
    const t = setInterval(() => update(false), 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
      if (giftTimer) clearTimeout(giftTimer);
    };
  }, [sync]);

  if (!mounted) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-full border-4 border-border bg-card px-4 py-1.5 shadow-[0_4px_0_var(--brand-200)]">
        <span className="text-xl" aria-hidden>
          ⚡
        </span>
        {unlimited ? (
          <span className="font-heading text-xl font-bold text-energy">∞</span>
        ) : (
          <span className="font-heading text-lg font-bold text-card-foreground">
            {energy}/{MAX_ENERGY}
            {remain !== null && remain > 0 && (
              <span className="ml-2 text-sm font-normal text-muted tabular-nums">
                +1 ใน {fmt(remain)}
              </span>
            )}
          </span>
        )}
      </div>
      {gift && (
        <div className="absolute left-1/2 top-full z-40 mt-2 -translate-x-1/2 animate-pop whitespace-nowrap rounded-2xl border-4 border-border bg-accent-500 px-4 py-2 font-bold text-brand-800 shadow-lg">
          🎁 ของขวัญวันใหม่! Energy เต็มหลอด
        </div>
      )}
    </div>
  );
}

/** Modal ตอน energy หมด — ปลอบใจ ไม่กดดัน */
export function EnergyEmptyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [remain, setRemain] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => setRemain(readRemain());
    const t0 = setTimeout(update, 0);
    const t = setInterval(update, 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 p-6">
      <div className="w-full max-w-sm animate-pop rounded-4xl border-4 border-border bg-card p-6 text-center shadow-2xl">
        <div className="text-6xl">🥱⚡</div>
        <h2 className="mt-2 text-2xl font-bold text-card-foreground">
          Energy หมดแล้ว
        </h2>
        <p className="mt-2 text-muted">
          พักสายตาแป๊บนึงนะ เดี๋ยวก็กลับมาเล่นได้!
          {remain !== null && remain > 0 && (
            <>
              <br />
              แท่งถัดไปอีก{" "}
              <strong className="tabular-nums text-card-foreground">
                {fmt(remain)}
              </strong>{" "}
              นาที
            </>
          )}
          <br />
          <span className="text-sm">
            (เล่นซ้ำด่านที่เคยผ่านแล้วได้เสมอ ไม่ใช้ Energy)
          </span>
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <ChunkyButton href="/shop" variant="sunny">
            🎁 Premium = Energy ไม่จำกัด
          </ChunkyButton>
          <ChunkyButton onClick={onClose} variant="white">
            โอเค รอได้!
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}
