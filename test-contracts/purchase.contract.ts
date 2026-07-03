import { describe, it, expect } from "vitest";
import type { PurchaseRepository } from "@/src/domain/ports/purchase.port";

/** Contract suite — adapter ทุกตัวของ PurchaseRepository ต้องผ่านเหมือนกัน */
export function runPurchaseContract(
  name: string,
  makeRepo: () => Promise<PurchaseRepository>
) {
  describe(`PurchaseRepository contract: ${name}`, () => {
    it("เริ่มต้น listMine ว่าง", async () => {
      const repo = await makeRepo();
      const r = await repo.listMine();
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value).toEqual([]);
    });

    it("add สร้าง order สถานะ approved ทันที (auto-approve)", async () => {
      const repo = await makeRepo();
      const r = await repo.add({
        productId: "bundle",
        productName: "Bundle",
        amountThb: 49,
      });
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.value.status).toBe("approved");
        expect(r.value.approvedAt).not.toBeNull();
        expect(r.value.productId).toBe("bundle");
        expect(r.value.id.length).toBeGreaterThan(0);
      }
    });

    it("listMine คืน order ที่ add ไป", async () => {
      const repo = await makeRepo();
      await repo.add({
        productId: "mode-quiz",
        productName: "ทายคำ",
        amountThb: 19,
      });
      const r = await repo.listMine();
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.value).toHaveLength(1);
        expect(r.value[0].productId).toBe("mode-quiz");
      }
    });
  });
}
