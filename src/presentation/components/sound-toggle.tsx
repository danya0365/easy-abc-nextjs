"use client";

import { useSettingsStore } from "@/src/presentation/stores/settings.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";

/** ปุ่ม mute รวม (เอฟเฟกต์ + เสียงอ่าน) */
export function SoundToggle({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const sfxMuted = useSettingsStore((s) => s.sfxMuted);
  const speechMuted = useSettingsStore((s) => s.speechMuted);
  const toggleAll = useSettingsStore((s) => s.toggleAll);
  const muted = mounted && sfxMuted && speechMuted;

  return (
    <button
      type="button"
      onClick={toggleAll}
      aria-label={muted ? "เปิดเสียง" : "ปิดเสียง"}
      className={`flex size-12 items-center justify-center rounded-full border-4 border-border bg-card text-2xl shadow-[0_4px_0_var(--brand-200)] active:translate-y-0.5 active:shadow-[0_2px_0_var(--brand-200)] ${className}`}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
