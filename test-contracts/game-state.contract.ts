import { describe, it, expect } from "vitest";
import type {
  GameStateRepository,
  StarsByGame,
} from "@/src/domain/ports/game-state.port";

const sample = (): StarsByGame => ({
  spell: { 1: 3, 2: 2 },
  "fill-front": { 1: 1 },
  "fill-back": {},
  "fill-middle": {},
});

/** Contract suite — adapter ทุกตัวของ GameStateRepository */
export function runGameStateContract(
  name: string,
  makeRepo: () => Promise<GameStateRepository>
) {
  describe(`GameStateRepository contract: ${name}`, () => {
    it("getMine เริ่มต้น = null (ผู้ใช้ใหม่)", async () => {
      const repo = await makeRepo();
      const r = await repo.getMine();
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value).toBeNull();
    });

    it("saveMine แล้ว getMine คืนค่าที่บันทึก", async () => {
      const repo = await makeRepo();
      const s = sample();
      const saved = await repo.saveMine(s);
      expect(saved.ok).toBe(true);
      const r = await repo.getMine();
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value).toEqual(s);
    });
  });
}
