"use client";

import type { ReactNode } from "react";
import { SoundToggle } from "../sound-toggle";

/** แถบบนของหน้าเกม (full screen): ⏸ ซ้าย · เนื้อหากลาง · เสียงขวา */
export function GameHeader({
  onPause,
  center,
}: {
  onPause: () => void;
  center: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 pt-4">
      <button
        type="button"
        onClick={onPause}
        aria-label="พักเกม"
        className="flex size-12 items-center justify-center rounded-full border-4 border-border bg-card text-xl shadow-[0_4px_0_var(--brand-200)] active:translate-y-0.5"
      >
        ⏸️
      </button>
      <div className="flex-1 text-center">{center}</div>
      <SoundToggle />
    </header>
  );
}
