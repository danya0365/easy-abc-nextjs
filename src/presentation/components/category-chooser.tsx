"use client";

import { useRouter } from "next/navigation";
import type { CategoryChoice, CategoryMeta } from "@/src/domain/ports/word.port";
import { useCategoryStore } from "@/src/presentation/stores/category.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { sound } from "@/src/presentation/lib/sound";

/**
 * หน้าจอเลือกหมวด (การ์ดใหญ่) — ให้เด็กกดง่าย เลือกแล้วไปเล่นเลย
 * next = ปลายทางหลังเลือก (ค่าเริ่มต้น /modes)
 */
export function CategoryChooser({
  categories,
  next = "/modes",
}: {
  categories: CategoryMeta[];
  next?: string;
}) {
  const router = useRouter();
  const mounted = useMounted();
  const current = useCategoryStore((s) => s.category);
  const setCategory = useCategoryStore((s) => s.setCategory);

  const choices: { id: CategoryChoice; name: string; emoji: string }[] = [
    { id: "mixed", name: "คละทุกหมวด", emoji: "🎲" },
    ...categories,
  ];

  const pick = (id: CategoryChoice) => {
    setCategory(id);
    sound.tap();
    router.push(next);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {choices.map((c) => {
        const active = mounted && current === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => pick(c.id)}
            aria-pressed={active}
            className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-4xl border-4 p-3 transition-transform active:scale-95 ${
              active
                ? "border-brand-500 bg-brand-500 text-on-brand shadow-[0_6px_0_var(--brand-700)]"
                : "border-border bg-card text-card-foreground shadow-[0_6px_0_var(--brand-200)]"
            }`}
          >
            <span className="text-5xl">{c.emoji}</span>
            <span className="text-center text-sm font-bold leading-tight">
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
