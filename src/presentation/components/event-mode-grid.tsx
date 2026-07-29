"use client";

import Link from "next/link";
import type { EventMeta } from "@/src/domain/ports/event.port";
import { maskWord, ADVENTURE_GAMES } from "@/src/domain/services/mask";
import { getAdventure } from "@/src/presentation/lib/adventures";
import { ChunkyButton } from "./chunky-button";

/** หน้ารูปแบบเกมของ Event — เลือกว่าเล่นเติมหน้า/หลัง/กลาง/สะกด */
export function EventModeGrid({ event }: { event: EventMeta }) {
  // ตัวอย่าง mask จากคำแรกของ event
  const firstWord = event.words[0]?.word ?? "";

  return (
    <div className="mx-auto max-w-lg px-5 pt-6">
      <div className="mb-2 flex items-center gap-3">
        <span className="text-5xl">{event.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold text-brand-700 text-outline">
            {event.name}
          </h1>
          <p className="text-sm text-muted">{event.description}</p>
        </div>
      </div>

      <h2 className="mt-6 text-lg font-bold text-brand-800">
        🎮 เลือกรูปแบบการเล่น
      </h2>
      <p className="text-sm text-muted">
        เล่น {event.words.length} คำศัพท์ของกิจกรรมนี้
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {ADVENTURE_GAMES.map((game) => {
          const adv = getAdventure(game);
          const hidden = firstWord
            ? maskWord(firstWord, game)
                .map((h, i) => (h ? "_" : firstWord[i]))
                .join(" ")
            : adv.sample;

          return (
            <Link
              key={game}
              href={`/event/${event.id}/${game}`}
              className={`flex flex-col items-center gap-1 rounded-3xl border-4 border-border p-4 text-center shadow-[0_6px_0_var(--brand-700)] transition-transform active:translate-y-1 ${
                game === "spell" ? "bg-brand-500" : "bg-brand-400"
              }`}
            >
              <span className="text-4xl">{adv.emoji}</span>
              <h3 className="font-bold text-on-brand">{adv.name}</h3>
              {firstWord && (
                <span className="rounded-full bg-card px-3 py-0.5 font-heading text-sm font-bold tracking-widest text-brand-600">
                  {hidden}
                </span>
              )}
              <p className="text-xs text-on-brand opacity-90">
                {adv.description}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <ChunkyButton href="/event" variant="white">
          ← กลับไปรายการ Event
        </ChunkyButton>
      </div>
    </div>
  );
}
