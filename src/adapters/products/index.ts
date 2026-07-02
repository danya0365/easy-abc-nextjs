import { PRODUCTS_MASTER } from "@/src/data/products.master";
import type { ProductRepository } from "@/src/domain/ports/product.port";
import { StaticProductAdapter } from "./static.adapter";

export function createProductRepo(): ProductRepository {
  return new StaticProductAdapter(PRODUCTS_MASTER);
}
