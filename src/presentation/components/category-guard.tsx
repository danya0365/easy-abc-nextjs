"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/src/presentation/stores/category.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";

/**
 * ยังไม่เลือกหมวด (null) → เด้งไปหน้าเลือกหมวดก่อน (ครั้งแรกที่เข้า /modes)
 * เลือกแล้ว → แสดงเนื้อหาปกติ
 */
export function CategoryGuard({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const router = useRouter();
  const category = useCategoryStore((s) => s.category);
  const needsPick = mounted && category === null;

  useEffect(() => {
    if (needsPick) router.replace("/categories");
  }, [needsPick, router]);

  if (!mounted || category === null) {
    return (
      <p className="p-10 text-center text-muted">กำลังพาไปเลือกหมวดคำศัพท์…</p>
    );
  }

  return <>{children}</>;
}
