import type { Metadata } from "next";
import { createWordRepo } from "@/src/adapters/words";
import { WORD_CATEGORIES } from "@/src/domain/ports/word.port";
import type { WordCategory } from "@/src/domain/ports/word.port";
import type { WordEntry } from "@/src/domain/ports/level.port";
import { representativeWords } from "@/src/domain/services/word-bank";
import { ADVENTURES } from "@/src/presentation/lib/adventures";
import { EnergyHud } from "@/src/presentation/components/energy-hud";
import { ModeGrid } from "@/src/presentation/components/mode-grid";
import { CategoryGuard } from "@/src/presentation/components/category-guard";
import { CurrentCategoryBar } from "@/src/presentation/components/current-category-bar";

export const metadata: Metadata = {
  title: "เลือกโหมด",
};

export default async function ModesPage() {
  const [categories, bank] = await Promise.all([
    createWordRepo().getCategories(),
    createWordRepo().getBank(),
  ]);

  // คำตัวแทนต่อหมวด (คำละใบ ไอคอนไม่ซ้ำ) → การ์ดผจญภัยโชว์ตัวอย่างตามหมวดที่เลือก
  const sampleWords: Partial<Record<WordCategory, WordEntry[]>> = {};
  if (bank.ok) {
    for (const c of WORD_CATEGORIES) {
      const reps = representativeWords(bank.value[c], ADVENTURES.length);
      if (reps.length) sampleWords[c] = reps;
    }
  }

  return (
    <CategoryGuard>
      <div className="mx-auto max-w-lg px-5 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-brand-700 text-outline">
            เลือกโหมด
          </h1>
          <EnergyHud />
        </div>
        {categories.ok && <CurrentCategoryBar categories={categories.value} />}
        <ModeGrid sampleWords={sampleWords} />
      </div>
    </CategoryGuard>
  );
}
