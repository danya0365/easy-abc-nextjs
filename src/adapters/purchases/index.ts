import type { PurchaseRepository } from "@/src/domain/ports/purchase.port";
import type { AdminPurchaseRepository } from "@/src/domain/ports/admin-purchase.port";
import { TursoPurchaseAdapter } from "./turso.adapter";
import { AdminTursoPurchaseAdapter } from "./admin-turso.adapter";

/** repo การซื้อฝั่งผู้ใช้ — ส่ง userId ที่ได้จาก session (server-only) */
export function createPurchaseRepo(userId: string): PurchaseRepository {
  return new TursoPurchaseAdapter(userId);
}

/** repo ฝั่ง admin — server-only, ต้อง guard ด้วย requireAdmin ก่อนเรียก */
export function createAdminPurchaseRepo(): AdminPurchaseRepository {
  return new AdminTursoPurchaseAdapter();
}
