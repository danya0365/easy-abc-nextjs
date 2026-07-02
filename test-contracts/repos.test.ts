// เสียบทุก adapter เข้า contract suite เดียวกัน
import { runLevelContract } from "./level.contract";
import { runProductContract } from "./product.contract";
import { createLevelRepo } from "@/src/adapters/levels";
import { createProductRepo } from "@/src/adapters/products";

runLevelContract("static", async () => createLevelRepo());
runProductContract("static", async () => createProductRepo());
