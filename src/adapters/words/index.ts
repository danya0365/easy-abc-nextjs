import { WORDS_MASTER, CATEGORIES_MASTER } from "@/src/data/words.master";
import type { WordBankRepository } from "@/src/domain/ports/word.port";
import { StaticWordAdapter } from "./static.adapter";

export function createWordRepo(): WordBankRepository {
  return new StaticWordAdapter(WORDS_MASTER, CATEGORIES_MASTER);
}
