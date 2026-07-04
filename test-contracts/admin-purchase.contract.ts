import { describe, it, expect } from "vitest";
import type { AdminPurchaseRepository } from "@/src/domain/ports/admin-purchase.port";

/** Contract suite — adapter ฝั่ง admin (seed 2 order pending id p1,p2) */
export function runAdminPurchaseContract(
  name: string,
  makeRepo: () => Promise<AdminPurchaseRepository>
) {
  describe(`AdminPurchaseRepository contract: ${name}`, () => {
    it("listAll เห็น order ทั้งหมด", async () => {
      const repo = await makeRepo();
      const r = await repo.listAll();
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value.length).toBe(2);
    });

    it("listByStatus กรองตามสถานะ", async () => {
      const repo = await makeRepo();
      const r = await repo.listByStatus("pending");
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value.every((o) => o.status === "pending")).toBe(true);
    });

    it("approve เปลี่ยนสถานะเป็น approved + ตั้ง approvedAt", async () => {
      const repo = await makeRepo();
      const r = await repo.approve("p1", "admin1");
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.value.status).toBe("approved");
        expect(r.value.approvedAt).not.toBeNull();
      }
      const after = await repo.listByStatus("approved");
      if (after.ok) expect(after.value.some((o) => o.id === "p1")).toBe(true);
    });

    it("reject เปลี่ยนสถานะเป็น rejected", async () => {
      const repo = await makeRepo();
      const r = await repo.reject("p2", "admin1", "ยอดไม่เข้า");
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value.status).toBe("rejected");
    });

    it("approve order ที่ไม่มี → err (ไม่ throw)", async () => {
      const repo = await makeRepo();
      const r = await repo.approve("nope", "admin1");
      expect(r.ok).toBe(false);
    });
  });
}
