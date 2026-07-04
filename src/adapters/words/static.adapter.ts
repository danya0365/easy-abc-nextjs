import { ok, type Result } from "@/src/domain/shared/result";
import type {
  CategoryMeta,
  WordBank,
  WordBankRepository,
} from "@/src/domain/ports/word.port";

/** Adapter อ่านคลังคำ master ในโปรเจกต์ (static repo แทน DB) */
export class StaticWordAdapter implements WordBankRepository {
  constructor(
    private bank: WordBank,
    private categories: CategoryMeta[]
  ) {}

  async getBank(): Promise<Result<WordBank>> {
    return ok(this.bank);
  }

  async getCategories(): Promise<Result<CategoryMeta[]>> {
    return ok(this.categories);
  }
}
