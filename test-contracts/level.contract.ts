import { describe, it, expect } from "vitest";
import type { LevelRepository } from "@/src/domain/ports/level.port";

/** Contract suite — adapter ทุกตัวของ LevelRepository ต้องผ่านเหมือนกัน */
export function runLevelContract(
  name: string,
  makeRepo: () => Promise<LevelRepository>
) {
  describe(`LevelRepository contract: ${name}`, () => {
    it("getAll คืนด่านเรียงครบ และทุกด่านมีคำอย่างน้อย 1 คำ", async () => {
      const repo = await makeRepo();
      const r = await repo.getAll();
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.value.length).toBeGreaterThan(0);
        for (const lv of r.value) {
          expect(lv.words.length).toBeGreaterThan(0);
          expect(lv.decoys).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it("getByLevel เจอด่านที่มีจริง", async () => {
      const repo = await makeRepo();
      const r = await repo.getByLevel(1);
      expect(r.ok && r.value.level).toBe(1);
    });

    it("getByLevel ไม่เจอ → Result.err (ไม่ throw)", async () => {
      const repo = await makeRepo();
      const r = await repo.getByLevel(999);
      expect(r.ok).toBe(false);
    });
  });
}
