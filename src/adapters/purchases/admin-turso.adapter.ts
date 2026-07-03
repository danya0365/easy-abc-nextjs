import { desc, eq } from "drizzle-orm";
import { ok, err, type Result } from "@/src/domain/shared/result";
import type { Order, OrderStatus } from "@/src/domain/ports/purchase.port";
import type {
  AdminOrder,
  AdminPurchaseRepository,
} from "@/src/domain/ports/admin-purchase.port";
import type { ProductId } from "@/src/domain/ports/product.port";
import { db } from "@/src/server/db/client";
import { purchase, user } from "@/src/server/db/schema";

type JoinRow = {
  p: typeof purchase.$inferSelect;
  email: string | null;
  name: string | null;
};

function toAdminOrder(r: JoinRow): AdminOrder {
  return {
    id: r.p.id,
    userId: r.p.userId,
    productId: r.p.productId as ProductId,
    productName: r.p.productName,
    amountThb: r.p.amountThb,
    status: r.p.status,
    createdAt: r.p.createdAt.getTime(),
    approvedAt: r.p.approvedAt ? r.p.approvedAt.getTime() : null,
    note: r.p.note,
    userEmail: r.email ?? "",
    userName: r.name ?? "",
  };
}

/** repo ฝั่ง admin — server-only, ต้อง guard ด้วย requireAdmin ก่อนเรียก */
export class AdminTursoPurchaseAdapter implements AdminPurchaseRepository {
  private baseQuery() {
    return db
      .select({ p: purchase, email: user.email, name: user.name })
      .from(purchase)
      .leftJoin(user, eq(purchase.userId, user.id))
      .orderBy(desc(purchase.createdAt));
  }

  async listAll(): Promise<Result<AdminOrder[]>> {
    try {
      const rows = await this.baseQuery();
      return ok(rows.map(toAdminOrder));
    } catch (e) {
      return err(`listAll failed: ${String(e)}`);
    }
  }

  async listByStatus(status: OrderStatus): Promise<Result<AdminOrder[]>> {
    try {
      const rows = (await this.baseQuery()).filter((r) => r.p.status === status);
      return ok(rows.map(toAdminOrder));
    } catch (e) {
      return err(`listByStatus failed: ${String(e)}`);
    }
  }

  async approve(orderId: string, adminId: string): Promise<Result<Order>> {
    return this.setStatus(orderId, "approved", adminId, null);
  }

  async reject(
    orderId: string,
    adminId: string,
    note?: string
  ): Promise<Result<Order>> {
    return this.setStatus(orderId, "rejected", adminId, note ?? null);
  }

  private async setStatus(
    orderId: string,
    status: OrderStatus,
    adminId: string,
    note: string | null
  ): Promise<Result<Order>> {
    try {
      const approvedAt = status === "approved" ? new Date() : null;
      const updated = await db
        .update(purchase)
        .set({ status, approvedAt, approvedBy: adminId, note })
        .where(eq(purchase.id, orderId))
        .returning();
      if (updated.length === 0) return err(`order ${orderId} not found`);
      const r = updated[0];
      return ok({
        id: r.id,
        userId: r.userId,
        productId: r.productId as ProductId,
        productName: r.productName,
        amountThb: r.amountThb,
        status: r.status,
        createdAt: r.createdAt.getTime(),
        approvedAt: r.approvedAt ? r.approvedAt.getTime() : null,
        note: r.note,
      });
    } catch (e) {
      return err(`setStatus failed: ${String(e)}`);
    }
  }
}
