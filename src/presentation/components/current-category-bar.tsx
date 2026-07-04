"use client";

import Link from "next/link";
import type { CategoryMeta } from "@/src/domain/ports/word.port";
import { useCategoryStore } from "@/src/presentation/stores/category.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";

/** แถบเล็กบอกหมวดปัจจุบัน + ลิงก์เปลี่ยน (แทนที่ picker ตัวใหญ่ ให้ UI สะอาด) */
export function CurrentCategoryBar({
  categories,
}: {
  categories: CategoryMeta[];
}) {
  const mounted = useMounted();
  const category = useCategoryStore((s) => s.category);

  if (!mounted) return null;

  const meta =
    category === "mixed"
      ? { name: "คละทุกหมวด", emoji: "🎲" }
      : categories.find((c) => c.id === category);
  const label = meta ? `${meta.emoji} ${meta.name}` : "🎲 คละทุกหมวด";

  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl border-4 border-border bg-card/85 px-4 py-2 backdrop-blur">
      <span className="text-sm font-bold text-card-foreground">
        📚 หมวด: {label}
      </span>
      <Link
        href="/categories"
        className="text-sm font-bold text-brand-500 underline"
      >
        เปลี่ยน
      </Link>
    </div>
  );
}
