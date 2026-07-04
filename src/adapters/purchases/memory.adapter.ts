import { ok, type Result } from "@/src/domain/shared/result";
import type {
  NewOrder,
  Order,
  PurchaseRepository,
} from "@/src/domain/ports/purchase.port";

/**
 * In-memory adapter — ใช้ใน contract test (node, ไม่มี DB)
 * รับ store ร่วมได้ เพื่อทดสอบว่า user คนละคนไม่เห็น order กัน
 */
export class MemoryPurchaseAdapter implements PurchaseRepository {
  constructor(
    private userId: string,
    private store: Order[] = []
  ) {}

  async listMine(): Promise<Result<Order[]>> {
    return ok(this.store.filter((o) => o.userId === this.userId));
  }

  async add(order: NewOrder): Promise<Result<Order>> {
    // auto-approve ทันที (admin เพิกถอนได้ทีหลัง)
    const created: Order = {
      id: `EA-${(this.store.length + 1).toString().padStart(4, "0")}`,
      userId: this.userId,
      productId: order.productId,
      productName: order.productName,
      amountThb: order.amountThb,
      status: "approved",
      createdAt: 0,
      approvedAt: 0,
    };
    this.store.push(created);
    return ok(created);
  }
}
