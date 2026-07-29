"use client";

import Link from "next/link";
import type { EventMeta } from "@/src/domain/ports/event.port";
import { ChunkyButton } from "./chunky-button";

/** หน้ารายการ Event — แสดงการ์ด event ให้เลือก */
export function EventList({ events }: { events: EventMeta[] }) {
  return (
    <div className="mx-auto max-w-lg px-5 pt-6">
      <h1 className="text-3xl font-bold text-brand-700 text-outline">
        🎪 กิจกรรมพิเศษ
      </h1>
      <p className="mt-2 text-sm text-muted">
        กิจกรรมจำกัดเวลา เล่นคำศัพท์เฉพาะกิจกรรม
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {events.map((ev) => (
          <Link
            key={ev.id}
            href={`/event/${ev.id}`}
            className="flex items-center gap-4 rounded-3xl border-4 border-border bg-card p-4 shadow-[0_6px_0_var(--brand-200)] transition-transform active:translate-y-1"
          >
            <span className="text-5xl">{ev.emoji}</span>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-card-foreground">
                {ev.name}
              </h2>
              <p className="text-sm text-muted">{ev.description}</p>
              <p className="mt-1 text-xs text-accent-500">
                {ev.words.length} คำ
              </p>
            </div>
            <span className="text-2xl">▶️</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <ChunkyButton href="/modes" variant="white">
          ← กลับไปหน้าโหมด
        </ChunkyButton>
      </div>
    </div>
  );
}
