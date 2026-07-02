// สิทธิ์ที่ซื้อแล้ว + ประวัติ order — persist ลง localStorage
// ⚠️ auto-approve โดยตั้งใจ: ไม่มีการตรวจสอบการชำระเงินฝั่ง server (ยอมรับความเสี่ยงแล้ว)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GameModeId,
  Product,
  ProductId,
} from "@/src/domain/ports/product.port";

export interface Order {
  id: string;
  productId: ProductId;
  productName: string;
  amountThb: number;
  approvedAt: number;
  status: "approved";
}

interface EntitlementState {
  orders: Order[];
  /** ยืนยันการซื้อทันที (auto-approve) */
  approve: (product: Product) => void;
  owns: (productId: ProductId) => boolean;
  hasMode: (mode: GameModeId) => boolean;
  hasBundle: () => boolean;
  /** Energy ไม่จำกัด (มากับ Bundle) */
  hasUnlimitedEnergy: () => boolean;
}

export const useEntitlementStore = create<EntitlementState>()(
  persist(
    (set, get) => ({
      orders: [],
      approve: (product) => {
        if (get().owns(product.id)) return;
        const order: Order = {
          id: `EA-${Date.now().toString(36).toUpperCase()}`,
          productId: product.id,
          productName: product.name,
          amountThb: product.priceThb,
          approvedAt: Date.now(),
          status: "approved",
        };
        set((s) => ({ orders: [...s.orders, order] }));
      },
      owns: (productId) =>
        get().orders.some((o) => o.productId === productId),
      hasMode: (mode) => {
        const { owns } = get();
        return owns("bundle") || owns(`mode-${mode}` as ProductId);
      },
      hasBundle: () => get().owns("bundle"),
      hasUnlimitedEnergy: () => get().owns("bundle"),
    }),
    { name: "easy-abc-entitlement", version: 1 }
  )
);
