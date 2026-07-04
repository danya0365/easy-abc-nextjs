import { describe, it, expect } from "vitest";
import { mergeOrders, mergeProgress } from "./sync";
import type { Order } from "../ports/purchase.port";
import type { StarsByGame } from "../ports/game-state.port";

const emptyStars = (): StarsByGame => ({
  spell: {},
  "fill-front": {},
  "fill-back": {},
  "fill-middle": {},
});

const order = (over: Partial<Order>): Order => ({
  id: "o1",
  userId: "u1",
  productId: "bundle",
  productName: "Bundle",
  amountThb: 49,
  status: "pending",
  createdAt: 1000,
  approvedAt: null,
  ...over,
});

describe("mergeOrders", () => {
  it("union order คนละ id", () => {
    const merged = mergeOrders(
      [order({ id: "a" })],
      [order({ id: "b" })]
    );
    expect(merged.map((o) => o.id).sort()).toEqual(["a", "b"]);
  });

  it("id ซ้ำ: server เป็นเจ้าของความจริง (ทับ local)", () => {
    const merged = mergeOrders(
      [order({ id: "a", status: "approved", approvedAt: 1000 })],
      [order({ id: "a", status: "approved", approvedAt: 2000 })]
    );
    expect(merged).toHaveLength(1);
    expect(merged[0].approvedAt).toBe(2000);
  });

  it("admin เพิกถอน: server rejected ปลดล็อก local approved ได้", () => {
    const merged = mergeOrders(
      [order({ id: "a", status: "approved" })],
      [order({ id: "a", status: "rejected" })]
    );
    expect(merged[0].status).toBe("rejected");
  });

  it("เก็บ legacy local order (server ว่าง)", () => {
    const merged = mergeOrders([order({ id: "legacy", status: "approved" })], []);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe("legacy");
  });

  it("รวมว่าง = ว่าง", () => {
    expect(mergeOrders([], [])).toEqual([]);
  });
});

describe("mergeProgress", () => {
  it("best-of ต่อด่าน: เอาดาวสูงสุด", () => {
    const local = { ...emptyStars(), spell: { 1: 3, 2: 1 } as Record<number, 0 | 1 | 2 | 3> };
    const server = { ...emptyStars(), spell: { 2: 2, 3: 1 } as Record<number, 0 | 1 | 2 | 3> };
    const m = mergeProgress(local, server);
    expect(m.spell).toEqual({ 1: 3, 2: 2, 3: 1 });
  });

  it("server ดาวต่ำกว่าไม่ลดของ local", () => {
    const local = { ...emptyStars(), "fill-front": { 1: 3 } as Record<number, 0 | 1 | 2 | 3> };
    const server = { ...emptyStars(), "fill-front": { 1: 1 } as Record<number, 0 | 1 | 2 | 3> };
    const m = mergeProgress(local, server);
    expect(m["fill-front"][1]).toBe(3);
  });

  it("ครบทั้ง 4 เกมเสมอ", () => {
    const m = mergeProgress(emptyStars(), emptyStars());
    expect(Object.keys(m).sort()).toEqual(
      ["fill-back", "fill-front", "fill-middle", "spell"]
    );
  });
});
