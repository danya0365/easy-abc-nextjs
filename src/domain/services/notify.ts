// framework-free — ประกอบข้อความแจ้งเตือน (pure, ทดสอบได้) · การส่งจริงอยู่ src/server/notify
export interface PurchaseAlert {
  productName: string;
  amountThb: number;
  /** อีเมล/ชื่อผู้ซื้อ (ไว้ให้ admin ตรวจยอด) */
  buyer: string;
  orderId: string;
}

/** ข้อความแจ้งเตือน admin เมื่อมีการชำระเงินใหม่ */
export function formatPurchaseAlert(a: PurchaseAlert): string {
  return [
    "💰 มีการชำระเงินใหม่",
    `${a.productName} — ${a.amountThb}฿`,
    `ผู้ซื้อ: ${a.buyer}`,
    `เลขที่ #${a.orderId}`,
    "ตรวจยอด PromptPay แล้วเพิกถอนได้ถ้าเป็นการแจ้งเท็จ",
  ].join("\n");
}
