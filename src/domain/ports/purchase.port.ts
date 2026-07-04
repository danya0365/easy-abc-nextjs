// framework-free — ห้าม import next/react/zustand/drizzle/better-auth
import type { Result } from "../shared/result";
import type { ProductId } from "./product.port";

export type OrderStatus = "pending" | "approved" | "rejected";

export interface Order {
  id: string;
  userId: string;
  productId: ProductId;
  productName: string;
  amountThb: number;
  status: OrderStatus;
  /** epoch ms ตอนสร้างคำสั่งซื้อ */
  createdAt: number;
  /** epoch ms ตอน admin อนุมัติ (null = ยังไม่อนุมัติ) */
  approvedAt: number | null;
  /** เหตุผลจาก admin (เช่น ตอนเพิกถอน) — โชว์ให้ผู้ใช้อ่าน */
  note?: string | null;
}

/** ข้อมูลที่ผู้ใช้ส่งตอนแจ้งชำระ (สถานะเริ่มต้น = pending เสมอ) */
export interface NewOrder {
  productId: ProductId;
  productName: string;
  amountThb: number;
}

/**
 * repo ฝั่งผู้ใช้ — ผูกกับ userId ตอนสร้าง (scope ตัวเอง กัน IDOR)
 * ⚠️ เลิก auto-approve: add() สร้าง order สถานะ pending รอ admin
 */
export interface PurchaseRepository {
  listMine(): Promise<Result<Order[]>>;
  add(order: NewOrder): Promise<Result<Order>>;
}
