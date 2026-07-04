import { eq } from "drizzle-orm";
import { ok, err, type Result } from "@/src/domain/shared/result";
import type {
  NewOrder,
  Order,
  PurchaseRepository,
} from "@/src/domain/ports/purchase.port";
import type { ProductId } from "@/src/domain/ports/product.port";
import { db } from "@/src/server/db/client";
import { purchase } from "@/src/server/db/schema";

type Row = typeof purchase.$inferSelect;

export function rowToOrder(r: Row): Order {
  return {
    id: r.id,
    userId: r.userId,
    productId: r.productId as ProductId,
    productName: r.productName,
    amountThb: r.amountThb,
    status: r.status,
    createdAt: r.createdAt.getTime(),
    approvedAt: r.approvedAt ? r.approvedAt.getTime() : null,
    note: r.note,
  };
}

/** repo ฝั่งผู้ใช้ — scope ด้วย userId ที่ verify จาก session แล้ว (server-only) */
export class TursoPurchaseAdapter implements PurchaseRepository {
  constructor(private userId: string) {}

  async listMine(): Promise<Result<Order[]>> {
    try {
      const rows = await db
        .select()
        .from(purchase)
        .where(eq(purchase.userId, this.userId));
      return ok(rows.map(rowToOrder));
    } catch (e) {
      return err(`listMine failed: ${String(e)}`);
    }
  }

  async add(order: NewOrder): Promise<Result<Order>> {
    try {
      // auto-approve: ปลดล็อกทันที ไม่ให้ผู้ใช้รอ · admin เพิกถอนทีหลังได้ถ้าแจ้งเท็จ
      const now = new Date();
      const row = {
        id: `EA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        userId: this.userId,
        productId: order.productId,
        productName: order.productName,
        amountThb: order.amountThb,
        status: "approved" as const,
        createdAt: now,
        approvedAt: now,
        approvedBy: null,
        note: null,
      };
      await db.insert(purchase).values(row);
      return ok(rowToOrder(row));
    } catch (e) {
      return err(`add failed: ${String(e)}`);
    }
  }
}
