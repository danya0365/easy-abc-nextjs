// framework-free — ห้าม import next/react/zustand
import type { Result } from "../shared/result";

export type GameModeId = "time-attack" | "listen" | "endless" | "quiz";

export type ProductId =
  | "mode-time-attack"
  | "mode-listen"
  | "mode-endless"
  | "mode-quiz"
  | "bundle";

export interface Product {
  id: ProductId;
  kind: "mode" | "bundle";
  /** โหมดที่ปลดล็อก (bundle = ทุกโหมด) */
  modes: GameModeId[];
  name: string;
  description: string;
  emoji: string;
  priceThb: number;
  /** เบอร์/ID PromptPay ผู้รับเงิน */
  promptpayId: string;
}

export interface ProductRepository {
  getAll(): Promise<Result<Product[]>>;
  getById(id: string): Promise<Result<Product>>;
}
