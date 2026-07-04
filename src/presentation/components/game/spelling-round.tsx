"use client";

// แกนกลางเกมสะกดคำ 1 คำ — ใช้ร่วมทุกโหมด (ผจญภัย/จับเวลา/ฟังแล้วสะกด/ไม่จำกัด)
// state machine: loading → idle ⇄ (แตะ tile) → checking → correct | wrong → idle

import { useCallback, useEffect, useRef, useState } from "react";
import type { WordEntry } from "@/src/domain/ports/level.port";
import { buildTray, type Tile } from "@/src/presentation/lib/shuffle";
import { sound } from "@/src/presentation/lib/sound";
import { WordImage } from "./word-image";
import { FeedbackOverlay } from "./feedback-overlay";

type Phase = "loading" | "idle" | "correct" | "wrong";

const TILE_COLORS = [
  "text-tile-1",
  "text-tile-2",
  "text-tile-3",
  "text-tile-4",
  "text-tile-5",
];

export function SpellingRound({
  entry,
  decoys,
  mask,
  showImage = true,
  listenMode = false,
  paused = false,
  onCorrect,
  onWrong,
}: {
  entry: WordEntry;
  decoys: number;
  /** ตำแหน่งที่ซ่อน (true = ผู้เล่นต้องเติม) — ไม่ส่ง = ซ่อนทุกตัว (โหมดสะกดเต็มคำ) */
  mask?: boolean[];
  /** false = โหมดฟังแล้วสะกด (ซ่อนรูป) */
  showImage?: boolean;
  /** แสดงปุ่มฟังเสียงคำซ้ำ */
  listenMode?: boolean;
  /** หยุดรับ input (ตอนเปิด PauseMenu) */
  paused?: boolean;
  onCorrect: () => void;
  onWrong?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [tray, setTray] = useState<Tile[]>([]);
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const letters = entry.word.split("");
  const hidden = mask ?? new Array(letters.length).fill(true);

  // คำยาว (6 ตัวอักษร = ยาวสุดในคลังคำ) ย่อช่องลงเล็กน้อยกันตกบรรทัดบนจอมือถือ
  const compact = letters.length >= 6;
  const slotSize = compact ? "size-12 sm:size-16" : "size-14 sm:size-16";
  const slotText = compact ? "text-2xl sm:text-4xl" : "text-3xl sm:text-4xl";

  // สร้างถาดใหม่เมื่อเปลี่ยนคำ — สุ่มหลัง hydrate เสมอ (setTimeout กัน hydration mismatch
  // และกัน setState ตรง ๆ ใน effect body)
  useEffect(() => {
    const setup = setTimeout(() => {
      const all = entry.word.split("");
      const hiddenLetters = all.filter(
        (_, i) => (mask ?? all.map(() => true))[i]
      );
      // tray มีเฉพาะตัวที่ต้องเติม + ตัวหลอกที่ไม่อยู่ในคำ
      setTray(buildTray(hiddenLetters, decoys, all));
      setSlots(new Array(entry.word.length).fill(null));
      setPhase("idle");
      if (listenMode) sound.speakWord(entry.word);
    }, 0);
    const t = timers.current;
    return () => {
      clearTimeout(setup);
      t.forEach(clearTimeout);
    };
    // mask ขึ้นกับ entry.word เสมอ (คำเปลี่ยน mask เปลี่ยน) — ใช้ word เป็น dep พอ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.word, decoys, listenMode]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const usedTileIds = new Set(slots.filter(Boolean) as string[]);

  const tapTile = (tile: Tile) => {
    if (phase !== "idle" || paused || usedTileIds.has(tile.id)) return;
    // หาช่องว่างช่องแรกเฉพาะตำแหน่งที่ซ่อน (ช่อง given เติมไม่ได้)
    const firstEmpty = slots.findIndex((s, i) => hidden[i] && s === null);
    if (firstEmpty === -1) return;
    sound.tap();
    sound.speakLetter(tile.letter);
    const next = [...slots];
    next[firstEmpty] = tile.id;
    setSlots(next);

    // ช่องซ่อนเต็มครบ → ตรวจ (เทียบตัวอักษร ไม่ใช่ tile id — รองรับตัวซ้ำ เช่น EGG)
    const allFilled = next.every((s, i) => !hidden[i] || s !== null);
    if (allFilled) {
      const attempt = next
        .map((id, i) =>
          hidden[i] ? (tray.find((t) => t.id === id)?.letter ?? "") : letters[i]
        )
        .join("");
      if (attempt === entry.word) {
        setPhase("correct");
        sound.correct();
        later(() => sound.speakWord(entry.word), 250);
        later(onCorrect, 1400);
      } else {
        setPhase("wrong");
        sound.wrong();
        onWrong?.();
        later(() => {
          setSlots(new Array(entry.word.length).fill(null));
          setPhase("idle");
        }, 800);
      }
    }
  };

  const tapSlot = (index: number) => {
    if (phase !== "idle" || paused || !hidden[index] || !slots[index]) return;
    sound.tap();
    const next = [...slots];
    next[index] = null;
    setSlots(next);
  };

  if (phase === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center text-4xl">
        <span className="animate-float">🐼</span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-4">
      {showImage ? (
        <WordImage entry={entry} />
      ) : (
        <button
          type="button"
          onClick={() => sound.speakWord(entry.word)}
          className="flex size-40 flex-col items-center justify-center gap-2 rounded-4xl border-4 border-border bg-card shadow-xl transition-transform active:scale-95 sm:size-48"
        >
          <span className="text-7xl">🔊</span>
          <span className="text-sm font-bold text-muted">แตะเพื่อฟังอีกครั้ง</span>
        </button>
      )}

      {/* ช่องเติมตัวอักษร */}
      <div
        className={`flex flex-nowrap justify-center gap-2 overflow-x-auto ${
          phase === "wrong" ? "animate-shake" : ""
        }`}
      >
        {slots.map((tileId, i) => {
          // ช่อง given: โชว์ตัวอักษรตายตัว แตะไม่ได้ (โหมดเติมคำ)
          if (!hidden[i]) {
            return (
              <span
                key={i}
                aria-label={`ตัวอักษร ${letters[i]} (ให้มาแล้ว)`}
                className={`flex ${slotSize} items-center justify-center rounded-2xl border-4 border-border/60 bg-muted-surface font-heading ${slotText} font-bold text-muted ${
                  phase === "correct" ? "animate-pop" : ""
                }`}
                style={
                  phase === "correct" ? { animationDelay: `${i * 0.06}s` } : undefined
                }
              >
                {letters[i]}
              </span>
            );
          }
          const letter = tileId
            ? tray.find((t) => t.id === tileId)?.letter
            : null;
          return (
            <button
              key={i}
              type="button"
              onClick={() => tapSlot(i)}
              aria-label={letter ? `เอา ${letter} ออก` : `ช่องที่ ${i + 1}`}
              className={`flex ${slotSize} items-center justify-center rounded-2xl border-4 font-heading ${slotText} font-bold transition-all ${
                letter
                  ? `border-border bg-card ${TILE_COLORS[i % TILE_COLORS.length]} ${
                      phase === "correct" ? "animate-pop" : ""
                    }`
                  : "border-card/70 bg-card/40"
              }`}
              style={phase === "correct" ? { animationDelay: `${i * 0.06}s` } : undefined}
            >
              {letter ?? ""}
            </button>
          );
        })}
      </div>

      {/* ถาดตัวอักษร */}
      <div className="flex max-w-md flex-wrap justify-center gap-2 rounded-4xl border-4 border-border bg-tile-3/25 p-4">
        {tray.map((tile, i) => {
          const used = usedTileIds.has(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              disabled={used}
              onClick={() => tapTile(tile)}
              aria-label={`ตัวอักษร ${tile.letter}`}
              className={`flex size-14 items-center justify-center rounded-2xl border-4 border-border bg-card font-heading text-3xl font-bold shadow-[0_4px_0_var(--brand-200)] transition-all active:translate-y-0.5 sm:size-16 sm:text-4xl ${
                TILE_COLORS[i % TILE_COLORS.length]
              } ${used ? "invisible" : ""}`}
            >
              {tile.letter}
            </button>
          );
        })}
      </div>

      <FeedbackOverlay phase={phase} />
    </div>
  );
}
