// Master data สินค้า IAP (static repo แทน DB) — ราคา/เบอร์ PromptPay เป็น placeholder แก้ที่นี่ที่เดียว
// ห้าม import ไฟล์นี้ตรงจาก UI — ให้เรียกผ่าน createProductRepo() เท่านั้น
import type { Product } from "@/src/domain/ports/product.port";

/** ⚠️ PLACEHOLDER — เปลี่ยนเป็นเบอร์ PromptPay จริงก่อนขึ้น production */
export const PROMPTPAY_ID = "1960500086397";

export const PRODUCTS_MASTER: Product[] = [
  {
    id: "mode-time-attack",
    kind: "mode",
    modes: ["time-attack"],
    name: "โหมดจับเวลา",
    description: "สะกดให้ได้มากที่สุดใน 60 วินาที ทำสถิติให้สูงสุด!",
    emoji: "⏱️",
    priceThb: 19,
    promptpayId: PROMPTPAY_ID,
  },
  {
    id: "mode-listen",
    kind: "mode",
    modes: ["listen"],
    name: "โหมดฟังแล้วสะกด",
    description: "ไม่มีรูปช่วย! ฟังเสียงคำศัพท์แล้วสะกดให้ถูก",
    emoji: "🔊",
    priceThb: 19,
    promptpayId: PROMPTPAY_ID,
  },
  {
    id: "mode-endless",
    kind: "mode",
    modes: ["endless"],
    name: "โหมดเล่นไม่จำกัด",
    description: "สุ่มคำจากทุกด่านเล่นเรื่อย ๆ นับสถิติคำสะสม",
    emoji: "♾️",
    priceThb: 19,
    promptpayId: PROMPTPAY_ID,
  },
  {
    id: "mode-quiz",
    kind: "mode",
    modes: ["quiz"],
    name: "โหมดทายคำจากรูป",
    description: "ดูรูปแล้วเลือกคำที่ถูกจาก 3 ตัวเลือก เหมาะกับน้องเล็ก",
    emoji: "🧩",
    priceThb: 19,
    promptpayId: PROMPTPAY_ID,
  },
  {
    id: "bundle",
    kind: "bundle",
    modes: ["time-attack", "listen", "endless", "quiz"],
    name: "Easy ABC Premium",
    description:
      "ปลดล็อกทุกโหมด + ธีมพิเศษ Candy & Space + Energy ไม่จำกัด ⚡∞",
    emoji: "🎁",
    priceThb: 49,
    promptpayId: PROMPTPAY_ID,
  },
];
