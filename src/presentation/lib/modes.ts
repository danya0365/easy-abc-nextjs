import type { GameModeId, ProductId } from "@/src/domain/ports/product.port";

export interface ModeMeta {
  id: GameModeId;
  route: string;
  productId: ProductId;
  name: string;
  emoji: string;
  description: string;
}

/** โหมดพรีเมียมทั้งหมด (ผจญภัยเป็นโหมดฟรี แยกแสดงต่างหาก) */
export const PREMIUM_MODES: ModeMeta[] = [
  {
    id: "time-attack",
    route: "/time-attack",
    productId: "mode-time-attack",
    name: "จับเวลา",
    emoji: "⏱️",
    description: "สะกดให้มากที่สุดใน 60 วินาที",
  },
  {
    id: "listen",
    route: "/listen",
    productId: "mode-listen",
    name: "ฟังแล้วสะกด",
    emoji: "🔊",
    description: "ไม่มีรูปช่วย ฟังเสียงแล้วสะกด",
  },
  {
    id: "endless",
    route: "/endless",
    productId: "mode-endless",
    name: "เล่นไม่จำกัด",
    emoji: "♾️",
    description: "สุ่มคำทุกด่าน เล่นเรื่อย ๆ",
  },
  {
    id: "quiz",
    route: "/quiz",
    productId: "mode-quiz",
    name: "ทายคำจากรูป",
    emoji: "🧩",
    description: "ดูรูปเลือกคำถูก เหมาะน้องเล็ก",
  },
];
