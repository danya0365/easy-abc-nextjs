import { describe, it, expect } from "vitest";
import type { WordBankRepository } from "@/src/domain/ports/word.port";
import { WORD_CATEGORIES } from "@/src/domain/ports/word.port";

/** Contract suite — adapter ทุกตัวของ WordBankRepository ต้องผ่านเหมือนกัน */
export function runWordContract(
  name: string,
  makeRepo: () => Promise<WordBankRepository>
) {
  describe(`WordBankRepository contract: ${name}`, () => {
    it("ทุกหมวดมีคำ ≥ 20 คำ (พอเล่น 5 ด่าน แบบหน้าต่างเลื่อน)", async () => {
      const repo = await makeRepo();
      const r = await repo.getBank();
      expect(r.ok).toBe(true);
      if (!r.ok) return;
      for (const cat of WORD_CATEGORIES) {
        expect(r.value[cat].length, `หมวด ${cat}`).toBeGreaterThanOrEqual(20);
      }
    });

    it("ทุกคำ: ตัวพิมพ์ใหญ่ A-Z ยาว 3-6 + มี emoji + คำแปลไทย", async () => {
      const repo = await makeRepo();
      const r = await repo.getBank();
      if (!r.ok) return;
      for (const cat of WORD_CATEGORIES) {
        for (const w of r.value[cat]) {
          expect(w.word, `${cat}/${w.word}`).toMatch(/^[A-Z]{3,6}$/);
          expect(w.emoji.length, `${cat}/${w.word} emoji`).toBeGreaterThan(0);
          expect(w.thai.length, `${cat}/${w.word} thai`).toBeGreaterThan(0);
        }
      }
    });

    it("ไม่มีคำซ้ำภายในหมวดเดียวกัน", async () => {
      const repo = await makeRepo();
      const r = await repo.getBank();
      if (!r.ok) return;
      for (const cat of WORD_CATEGORIES) {
        const words = r.value[cat].map((w) => w.word);
        expect(new Set(words).size, `หมวด ${cat}`).toBe(words.length);
      }
    });

    it("getCategories ครบทุกหมวดของ bank + มีชื่อไทย/emoji", async () => {
      const repo = await makeRepo();
      const r = await repo.getCategories();
      expect(r.ok).toBe(true);
      if (!r.ok) return;
      expect(r.value.map((c) => c.id).sort()).toEqual(
        [...WORD_CATEGORIES].sort()
      );
      for (const c of r.value) {
        expect(c.name.length).toBeGreaterThan(0);
        expect(c.emoji.length).toBeGreaterThan(0);
      }
    });
  });
}
