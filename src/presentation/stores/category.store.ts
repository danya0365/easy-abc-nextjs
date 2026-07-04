// หมวดคำศัพท์ที่เลือก — มีผลทุกโหมด · null = ยังไม่เลือก (เด้งไปหน้าเลือกก่อนเข้า /modes)
// "mixed" = เลือกแบบคละ (คำจากทุกหมวด) · ดาว/ปลดด่านไม่ผูกกับหมวด
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WORD_CATEGORIES } from "@/src/domain/ports/word.port";
import type { CategoryChoice } from "@/src/domain/ports/word.port";

interface CategoryState {
  category: CategoryChoice | null;
  setCategory: (category: CategoryChoice) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      category: null,
      setCategory: (category) => set({ category }),
    }),
    {
      name: "easy-abc-category",
      version: 1,
      // normalize ค่าเก่า/เพี้ยน — ค่าที่ไม่รู้จักกลับเป็น null (ให้ไปเลือกใหม่)
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<CategoryState>;
        const valid =
          p.category === "mixed" ||
          WORD_CATEGORIES.includes(p.category as never);
        return { category: valid ? p.category! : null } as CategoryState;
      },
    }
  )
);
