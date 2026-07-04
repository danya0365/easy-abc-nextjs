// framework-free — repo ฝั่ง admin (เห็น order ทุก user) สำหรับอนุมัติ/สรุปยอด
import type { Result } from "../shared/result";
import type { Order, OrderStatus } from "./purchase.port";

/** order + ข้อมูลผู้ซื้อ (ไว้โชว์ในหน้า admin) */
export interface AdminOrder extends Order {
  userEmail: string;
  userName: string;
}

/**
 * repo ฝั่ง admin — server-only, ต้อง guard ด้วย requireAdmin ก่อนเรียกเสมอ
 * รับ adminId ตอน approve/reject เพื่อบันทึกว่าใครอนุมัติ
 */
export interface AdminPurchaseRepository {
  listAll(): Promise<Result<AdminOrder[]>>;
  listByStatus(status: OrderStatus): Promise<Result<AdminOrder[]>>;
  approve(orderId: string, adminId: string): Promise<Result<Order>>;
  reject(orderId: string, adminId: string, note?: string): Promise<Result<Order>>;
}
