import { describe, it, expect } from "vitest";
import type { ProductRepository } from "@/src/domain/ports/product.port";

/** Contract suite — adapter ทุกตัวของ ProductRepository ต้องผ่านเหมือนกัน */
export function runProductContract(
  name: string,
  makeRepo: () => Promise<ProductRepository>
) {
  describe(`ProductRepository contract: ${name}`, () => {
    it("getAll มีสินค้า และทุกชิ้นมีราคา/PromptPay ID", async () => {
      const repo = await makeRepo();
      const r = await repo.getAll();
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.value.length).toBeGreaterThan(0);
        for (const p of r.value) {
          expect(p.priceThb).toBeGreaterThan(0);
          expect(p.promptpayId.length).toBeGreaterThan(0);
        }
      }
    });

    it("มี bundle ที่ครอบคลุมทุกโหมดของสินค้า kind=mode", async () => {
      const repo = await makeRepo();
      const r = await repo.getAll();
      expect(r.ok).toBe(true);
      if (r.ok) {
        const bundle = r.value.find((p) => p.kind === "bundle");
        const modeProducts = r.value.filter((p) => p.kind === "mode");
        expect(bundle).toBeDefined();
        for (const m of modeProducts) {
          for (const mode of m.modes) {
            expect(bundle!.modes).toContain(mode);
          }
        }
      }
    });

    it("getById ไม่เจอ → Result.err (ไม่ throw)", async () => {
      const repo = await makeRepo();
      const r = await repo.getById("does-not-exist");
      expect(r.ok).toBe(false);
    });
  });
}
