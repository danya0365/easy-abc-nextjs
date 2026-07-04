// สิทธิ์ที่ซื้อแล้ว — sync กับ server (ผูก identity) แทน auto-approve
// owns() = มี order สถานะ "approved" (admin อนุมัติแล้ว) เท่านั้น
// pending = แจ้งชำระแล้วรอ admin · orders เก็บ cache local + hydrate จาก server
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameModeId, ProductId } from "@/src/domain/ports/product.port";
import type { Order } from "@/src/domain/ports/purchase.port";
import { mergeOrders } from "@/src/domain/services/sync";

interface EntitlementState {
  orders: Order[];
  /** id ของ order ที่ถูกเพิกถอนและผู้ใช้กด "รับทราบ" แล้ว (ไม่เด้งแจ้งซ้ำ) */
  acknowledgedRejections: string[];
  /** merge order จาก server เข้ามา (ตอน login/กู้คืน) */
  hydrateFromServer: (serverOrders: Order[]) => void;
  /** เพิ่ม/อัปเดต order เดียว (ตอนเพิ่งแจ้งชำระ = pending) */
  upsertOrder: (order: Order) => void;
  /** ผู้ใช้กดรับทราบการถูกเพิกถอน (order ids) */
  acknowledgeRejection: (orderIds: string[]) => void;
  owns: (productId: ProductId) => boolean;
  hasMode: (mode: GameModeId) => boolean;
  hasBundle: () => boolean;
  /** Energy ไม่จำกัด (มากับ Bundle) */
  hasUnlimitedEnergy: () => boolean;
  /** order ที่รออนุมัติ (ไว้โชว์สถานะ) */
  pendingOrders: () => Order[];
  /** order ที่ถูกเพิกถอนและยังไม่รับทราบ (ไว้เด้งแจ้งเตือน) */
  unacknowledgedRejections: () => Order[];
}

type OldOrder = {
  id: string;
  productId: ProductId;
  productName: string;
  amountThb: number;
  approvedAt: number;
};

export const useEntitlementStore = create<EntitlementState>()(
  persist(
    (set, get) => ({
      orders: [],
      acknowledgedRejections: [],
      hydrateFromServer: (serverOrders) =>
        set((s) => ({ orders: mergeOrders(s.orders, serverOrders) })),
      upsertOrder: (order) =>
        set((s) => ({ orders: mergeOrders(s.orders, [order]) })),
      acknowledgeRejection: (orderIds) =>
        set((s) => ({
          acknowledgedRejections: [
            ...new Set([...s.acknowledgedRejections, ...orderIds]),
          ],
        })),
      owns: (productId) =>
        get().orders.some(
          (o) => o.productId === productId && o.status === "approved"
        ),
      hasMode: (mode) => {
        const { owns } = get();
        return owns("bundle") || owns(`mode-${mode}` as ProductId);
      },
      hasBundle: () => get().owns("bundle"),
      hasUnlimitedEnergy: () => get().owns("bundle"),
      pendingOrders: () => get().orders.filter((o) => o.status === "pending"),
      unacknowledgedRejections: () => {
        const { orders, acknowledgedRejections } = get();
        return orders.filter(
          (o) =>
            o.status === "rejected" && !acknowledgedRejections.includes(o.id)
        );
      },
    }),
    {
      name: "easy-abc-entitlement",
      version: 2,
      // v1 (auto-approve) → v2: order เดิมเป็น approved อยู่แล้ว ให้คงสิทธิ์ (grandfather)
      migrate: (persisted, version) => {
        if (version < 2) {
          const old = persisted as { orders?: OldOrder[] };
          const orders: Order[] = (old.orders ?? []).map((o) => ({
            id: o.id,
            userId: "",
            productId: o.productId,
            productName: o.productName,
            amountThb: o.amountThb,
            status: "approved",
            createdAt: o.approvedAt,
            approvedAt: o.approvedAt,
          }));
          return { orders } as unknown as EntitlementState;
        }
        return persisted as EntitlementState;
      },
    }
  )
);
