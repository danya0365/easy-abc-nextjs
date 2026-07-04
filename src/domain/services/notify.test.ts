import { describe, it, expect } from "vitest";
import { formatPurchaseAlert } from "./notify";

describe("formatPurchaseAlert", () => {
  it("มีข้อมูลครบ: สินค้า/ยอด/ผู้ซื้อ/เลขที่", () => {
    const msg = formatPurchaseAlert({
      productName: "Easy ABC Premium",
      amountThb: 49,
      buyer: "parent@example.com",
      orderId: "EA-AB12",
    });
    expect(msg).toContain("Easy ABC Premium");
    expect(msg).toContain("49฿");
    expect(msg).toContain("parent@example.com");
    expect(msg).toContain("EA-AB12");
    expect(msg).toContain("💰");
  });
});
