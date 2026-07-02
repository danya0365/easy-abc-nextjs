import { ok, err, type Result } from "@/src/domain/shared/result";
import type {
  Product,
  ProductRepository,
} from "@/src/domain/ports/product.port";

/** Adapter อ่าน master data ในโปรเจกต์ (static repo แทน DB) */
export class StaticProductAdapter implements ProductRepository {
  constructor(private products: Product[]) {}

  async getAll(): Promise<Result<Product[]>> {
    return ok(this.products);
  }

  async getById(id: string): Promise<Result<Product>> {
    const found = this.products.find((p) => p.id === id);
    if (!found) return err(`product ${id} not found`);
    return ok(found);
  }
}
