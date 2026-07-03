// เสียบทุก adapter เข้า contract suite เดียวกัน
import { runLevelContract } from "./level.contract";
import { runProductContract } from "./product.contract";
import { runPurchaseContract } from "./purchase.contract";
import { runAdminPurchaseContract } from "./admin-purchase.contract";
import { runGameStateContract } from "./game-state.contract";
import { createLevelRepo } from "@/src/adapters/levels";
import { createProductRepo } from "@/src/adapters/products";
import { MemoryPurchaseAdapter } from "@/src/adapters/purchases/memory.adapter";
import { MemoryAdminPurchaseAdapter } from "@/src/adapters/purchases/admin-memory.adapter";
import { MemoryGameStateAdapter } from "@/src/adapters/game-state/memory.adapter";
import type { AdminOrder } from "@/src/domain/ports/admin-purchase.port";

runLevelContract("static", async () => createLevelRepo());
runProductContract("static", async () => createProductRepo());
// Turso adapter รัน contract จริงไม่ได้ (ต้องมี DB) — ทดสอบ memory adapter ที่มี logic เดียวกัน
runPurchaseContract("memory", async () => new MemoryPurchaseAdapter("u1"));

const seedAdminOrders = (): AdminOrder[] =>
  ["p1", "p2"].map((id) => ({
    id,
    userId: "u1",
    productId: "bundle",
    productName: "Bundle",
    amountThb: 49,
    status: "pending",
    createdAt: 0,
    approvedAt: null,
    userEmail: "u1@example.com",
    userName: "ผู้ใช้",
  }));
runAdminPurchaseContract(
  "memory",
  async () => new MemoryAdminPurchaseAdapter(seedAdminOrders())
);
runGameStateContract("memory", async () => new MemoryGameStateAdapter());
