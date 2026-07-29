// เกมผจญภัย 4 แบบ + กติกาซ่อนตัวอักษร (pure, framework-free)
// แก้ความยาก/รูปแบบการซ่อน → แก้ที่ maskWord จุดเดียว

export type AdventureGame = "spell" | "fill-front" | "fill-back" | "fill-middle";

export const ADVENTURE_GAMES: AdventureGame[] = [
  "fill-front",
  "fill-back",
  "fill-middle",
  "spell",
];

export const FILL_GAMES: AdventureGame[] = [
  "fill-front",
  "fill-back",
  "fill-middle",
];

export function isFillGame(value: string): value is AdventureGame {
  return (FILL_GAMES as string[]).includes(value);
}

/**
 * บอกว่าตัวอักษรตำแหน่งไหน "ถูกซ่อน" (true = ผู้เล่นต้องเติมเอง)
 * - spell: ซ่อนทุกตัว (สะกดทั้งคำ)
 * - fill-front: ซ่อนตัวแรก 1 ตัว — `_ A T` → CAT
 * - fill-back: ซ่อนตัวท้าย 1 ตัว — `C A _` → CAT
 * - fill-middle: โชว์หัว+ท้าย ซ่อนตรงกลางทั้งหมด — `H _ _ _ E` → HOUSE
 */
export function maskWord(word: string, game: AdventureGame): boolean[] {
  const n = word.length;
  switch (game) {
    case "spell":
      return new Array(n).fill(true);
    case "fill-front":
      return word.split("").map((_, i) => i === 0);
    case "fill-back":
      return word.split("").map((_, i) => i === n - 1);
    case "fill-middle":
      return word.split("").map((_, i) => i > 0 && i < n - 1);
  }
}
