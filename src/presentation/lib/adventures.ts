import type { AdventureGame } from "@/src/domain/services/mask";

/** slug สั้นใน URL ของเกมเติมคำ (Next ห้าม /play/[level] ชนกับ /play/[game]/... จึงแยกเป็น /fill/) */
export type FillSlug = "front" | "back" | "middle";

export const FILL_SLUGS: FillSlug[] = ["front", "back", "middle"];

export function gameFromSlug(slug: string): AdventureGame | null {
  return FILL_SLUGS.includes(slug as FillSlug)
    ? (`fill-${slug}` as AdventureGame)
    : null;
}

export interface AdventureMeta {
  game: AdventureGame;
  name: string;
  emoji: string;
  /** ตัวอย่างโจทย์โชว์บนการ์ด เช่น "_AT" */
  sample: string;
  description: string;
  mapRoute: string;
  playRoute: (level: number) => string;
}

/** เกมผจญภัยทั้งหมด (ฟรี) — สะกดคำ + เติมตัวอักษร 3 แบบ */
export const ADVENTURES: AdventureMeta[] = [
  {
    game: "spell",
    name: "สะกดคำ",
    emoji: "🗺️",
    sample: "_ _ _",
    description: "ดูรูปแล้วสะกดทั้งคำ",
    mapRoute: "/levels",
    playRoute: (level) => `/play/${level}`,
  },
  {
    game: "fill-front",
    name: "เติมข้างหน้า",
    emoji: "🐣",
    sample: "_AT",
    description: "เติมตัวอักษรตัวแรกที่หายไป",
    mapRoute: "/levels/front",
    playRoute: (level) => `/fill/front/${level}`,
  },
  {
    game: "fill-back",
    name: "เติมข้างหลัง",
    emoji: "🐢",
    sample: "CA_",
    description: "เติมตัวอักษรตัวท้ายที่หายไป",
    mapRoute: "/levels/back",
    playRoute: (level) => `/fill/back/${level}`,
  },
  {
    game: "fill-middle",
    name: "เติมตรงกลาง",
    emoji: "🦉",
    sample: "H__E",
    description: "เห็นหัวกับท้าย เติมตรงกลางให้ครบ",
    mapRoute: "/levels/middle",
    playRoute: (level) => `/fill/middle/${level}`,
  },
];

export const getAdventure = (game: AdventureGame): AdventureMeta =>
  ADVENTURES.find((a) => a.game === game)!;
