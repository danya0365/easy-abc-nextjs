"use server";

import { headers } from "next/headers";
import { auth } from "@/src/server/auth";
import { ok, err, type Result } from "@/src/domain/shared/result";
import type { StarsByGame } from "@/src/domain/ports/game-state.port";
import { createGameStateRepo } from "@/src/adapters/game-state";

async function currentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

/** ดึงดาวจาก server (null = ยังไม่เคยบันทึก) */
export async function pullProgress(): Promise<Result<StarsByGame | null>> {
  const userId = await currentUserId();
  if (!userId) return ok(null);
  return createGameStateRepo(userId).getMine();
}

/** บันทึกดาวขึ้น server (ต้อง login) */
export async function pushProgress(
  progress: StarsByGame
): Promise<Result<void>> {
  const userId = await currentUserId();
  if (!userId) return err("unauthenticated");
  return createGameStateRepo(userId).saveMine(progress);
}
