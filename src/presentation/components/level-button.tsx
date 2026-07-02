"use client";

import { StarRow } from "./star-row";

const LEVEL_COLORS = [
  "bg-tile-5 shadow-[0_6px_0_rgb(0_0_0/0.25)]", // ด่าน 1 ม่วง (ตามภาพโปรโมต)
  "bg-tile-3 shadow-[0_6px_0_rgb(0_0_0/0.25)]", // ด่าน 2 เขียว
  "bg-tile-1 shadow-[0_6px_0_rgb(0_0_0/0.25)]", // ด่าน 3 แดง
  "bg-accent-500 shadow-[0_6px_0_var(--accent-600)]", // ด่าน 4 เหลือง
  "bg-tile-4 shadow-[0_6px_0_rgb(0_0_0/0.25)]", // ด่าน 5 ชมพู
];

export function LevelButton({
  level,
  stars,
  locked,
  onPlay,
}: {
  level: number;
  stars: number;
  locked: boolean;
  onPlay: (level: number) => void;
}) {
  const color = LEVEL_COLORS[(level - 1) % LEVEL_COLORS.length];
  return (
    <div className="flex flex-col items-center">
      <StarRow stars={locked ? 0 : stars} size="sm" className="mb-1" />
      <button
        type="button"
        disabled={locked}
        aria-label={locked ? `ด่านที่ ${level} (ล็อกอยู่)` : `เล่นด่านที่ ${level}`}
        onClick={() => onPlay(level)}
        className={`flex size-20 items-center justify-center rounded-full border-4 border-border font-heading text-4xl font-bold text-white transition-transform active:translate-y-1 ${
          locked ? "bg-locked grayscale" : color
        }`}
      >
        {locked ? "🔒" : level}
      </button>
    </div>
  );
}
