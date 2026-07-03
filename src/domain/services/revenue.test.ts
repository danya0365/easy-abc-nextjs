import { describe, it, expect } from "vitest";
import { summarizeRevenue } from "./revenue";
import type { Order } from "../ports/purchase.port";

const order = (over: Partial<Order>): Order => ({
  id: "o",
  userId: "u",
  productId: "bundle",
  productName: "Bundle",
  amountThb: 49,
  status: "approved",
  createdAt: 0,
  approvedAt: 0,
  ...over,
});

describe("summarizeRevenue", () => {
  it("นับเฉพาะ approved เข้ายอดรวม", () => {
    const s = summarizeRevenue([
      order({ id: "a", status: "approved", amountThb: 49 }),
      order({ id: "b", status: "pending", amountThb: 19 }),
      order({ id: "c", status: "rejected", amountThb: 19 }),
    ]);
    expect(s.totalThb).toBe(49);
    expect(s.approvedCount).toBe(1);
    expect(s.pendingCount).toBe(1);
    expect(s.rejectedCount).toBe(1);
  });

  it("รวมยอดต่อ product + เรียงมากไปน้อย", () => {
    const s = summarizeRevenue([
      order({ id: "a", productId: "mode-quiz", productName: "ทายคำ", amountThb: 19 }),
      order({ id: "b", productId: "bundle", productName: "Bundle", amountThb: 49 }),
      order({ id: "c", productId: "mode-quiz", productName: "ทายคำ", amountThb: 19 }),
    ]);
    expect(s.totalThb).toBe(87);
    expect(s.byProduct[0].productId).toBe("bundle");
    expect(s.byProduct[0].totalThb).toBe(49);
    const quiz = s.byProduct.find((p) => p.productId === "mode-quiz")!;
    expect(quiz.count).toBe(2);
    expect(quiz.totalThb).toBe(38);
  });

  it("ว่าง = ศูนย์หมด", () => {
    const s = summarizeRevenue([]);
    expect(s.totalThb).toBe(0);
    expect(s.byProduct).toEqual([]);
  });
});
