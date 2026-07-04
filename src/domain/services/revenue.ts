// สรุปรายได้ — pure function ทดสอบได้ (นับเฉพาะ order ที่ approved)
import type { Order } from "../ports/purchase.port";

export interface ProductRevenue {
  productId: string;
  productName: string;
  count: number;
  totalThb: number;
}

export interface RevenueSummary {
  totalThb: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  byProduct: ProductRevenue[];
}

export function summarizeRevenue(orders: Order[]): RevenueSummary {
  let totalThb = 0;
  let approvedCount = 0;
  let pendingCount = 0;
  let rejectedCount = 0;
  const byProduct = new Map<string, ProductRevenue>();

  for (const o of orders) {
    if (o.status === "pending") pendingCount++;
    else if (o.status === "rejected") rejectedCount++;
    else if (o.status === "approved") {
      approvedCount++;
      totalThb += o.amountThb;
      const cur = byProduct.get(o.productId);
      if (cur) {
        cur.count++;
        cur.totalThb += o.amountThb;
      } else {
        byProduct.set(o.productId, {
          productId: o.productId,
          productName: o.productName,
          count: 1,
          totalThb: o.amountThb,
        });
      }
    }
  }

  return {
    totalThb,
    approvedCount,
    pendingCount,
    rejectedCount,
    byProduct: [...byProduct.values()].sort((a, b) => b.totalThb - a.totalThb),
  };
}
