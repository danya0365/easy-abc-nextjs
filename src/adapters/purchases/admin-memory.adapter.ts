import { ok, err, type Result } from "@/src/domain/shared/result";
import type { Order, OrderStatus } from "@/src/domain/ports/purchase.port";
import type {
  AdminOrder,
  AdminPurchaseRepository,
} from "@/src/domain/ports/admin-purchase.port";

/** In-memory admin adapter — ใช้ใน contract test */
export class MemoryAdminPurchaseAdapter implements AdminPurchaseRepository {
  constructor(private store: AdminOrder[] = []) {}

  async listAll(): Promise<Result<AdminOrder[]>> {
    return ok([...this.store]);
  }

  async listByStatus(status: OrderStatus): Promise<Result<AdminOrder[]>> {
    return ok(this.store.filter((o) => o.status === status));
  }

  async approve(orderId: string): Promise<Result<Order>> {
    return this.setStatus(orderId, "approved");
  }

  async reject(orderId: string): Promise<Result<Order>> {
    return this.setStatus(orderId, "rejected");
  }

  private setStatus(orderId: string, status: OrderStatus): Result<Order> {
    const o = this.store.find((x) => x.id === orderId);
    if (!o) return err(`order ${orderId} not found`);
    o.status = status;
    o.approvedAt = status === "approved" ? 1 : null;
    return ok(o);
  }
}
