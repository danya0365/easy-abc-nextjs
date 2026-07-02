"use client";

import { useState } from "react";
import type { WordEntry } from "@/src/domain/ports/level.port";

export const wordImageSrc = (w: WordEntry) =>
  `/easy-abc/words/${w.word.toLowerCase()}.png`;

/**
 * รูปคำศัพท์: ใช้ <img> ธรรมดาเพื่อ onError fallback เป็น emoji
 * (ไฟล์รูปจริงจะถูกเพิ่มทีหลังที่ public/easy-abc/words/<word>.png)
 * ⚠️ ผู้เรียกต้องใส่ key={entry.word} เพื่อ reset สถานะ error เมื่อเปลี่ยนคำ
 */
export function WordImage({ entry }: { entry: WordEntry }) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex size-40 items-center justify-center overflow-hidden rounded-4xl border-4 border-border bg-card shadow-xl sm:size-48">
        {errored ? (
          <span className="text-8xl" role="img" aria-label={entry.thai}>
            {entry.emoji}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={entry.word}
            src={wordImageSrc(entry)}
            alt={entry.thai}
            className="size-full object-contain"
            onError={() => setErrored(true)}
          />
        )}
      </div>
      <span className="mt-2 rounded-full bg-card/80 px-4 py-1 font-bold text-brand-700 backdrop-blur">
        {entry.thai}
      </span>
    </div>
  );
}
