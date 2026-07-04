import type { Metadata } from "next";
import { createWordRepo } from "@/src/adapters/words";
import { CategoryChooser } from "@/src/presentation/components/category-chooser";

export const metadata: Metadata = {
  title: "เลือกหมวดคำศัพท์",
};

export default async function CategoriesPage() {
  const categories = await createWordRepo().getCategories();

  return (
    <div className="mx-auto max-w-lg px-5 pt-6">
      <h1 className="text-center text-3xl font-bold text-brand-700 text-outline">
        เลือกหมวดคำศัพท์
      </h1>
      <p className="mb-5 mt-1 text-center text-sm text-brand-800">
        อยากเล่นคำแนวไหน? แตะเลือกได้เลย! เปลี่ยนทีหลังก็ได้นะ 🐼
      </p>
      {categories.ok ? (
        <CategoryChooser categories={categories.value} />
      ) : (
        <p className="text-center text-error">โหลดหมวดไม่สำเร็จ</p>
      )}
    </div>
  );
}
