// pure merge functions สำหรับ sync local ↔ server (ทดสอบได้ ไม่ผูก framework)
import type { Order } from "../ports/purchase.port";
import type { StarsByGame } from "../ports/game-state.port";
import type { Stars, StarsByLevel } from "./rules";
import { ADVENTURE_GAMES } from "./mask";

/**
 * รวม order local + server แบบ union ตาม id
 * - id ซ้ำ: **server เป็นเจ้าของความจริงเสมอ** (ทับ local) — เพื่อให้การเพิกถอนของ admin
 *   (approved → rejected) ลงมาปลดล็อกฝั่ง client ได้จริง
 * - id ที่มีแต่ local (เช่น legacy ก่อน login) → เก็บไว้
 */
export function mergeOrders(local: Order[], server: Order[]): Order[] {
  const byId = new Map<string, Order>();
  for (const o of local) byId.set(o.id, o);
  for (const o of server) byId.set(o.id, o); // server ทับ local
  return [...byId.values()];
}

/**
 * รวมดาว local + server แบบ best-of ต่อ (เกม, ด่าน) — เอาค่าสูงสุด
 * ไม่มี conflict เพราะดาวเพิ่มขึ้นทางเดียว (best-of)
 */
export function mergeProgress(
  local: StarsByGame,
  server: StarsByGame
): StarsByGame {
  const out = {} as StarsByGame;
  for (const game of ADVENTURE_GAMES) {
    const l = local[game] ?? {};
    const s = server[game] ?? {};
    const merged: StarsByLevel = { ...l };
    for (const [lv, stars] of Object.entries(s)) {
      const level = Number(lv);
      const best = Math.max(merged[level] ?? 0, stars) as Stars;
      merged[level] = best;
    }
    out[game] = merged;
  }
  return out;
}

