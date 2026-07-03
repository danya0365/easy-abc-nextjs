"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/src/server/auth";
import { isAdmin } from "@/src/server/is-admin";
import { ok, err, type Result } from "@/src/domain/shared/result";
import type { Order } from "@/src/domain/ports/purchase.port";
import { createAdminPurchaseRepo } from "@/src/adapters/purchases";

async function requireAdminId(): Promise<Result<string>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) return err("ไม่มีสิทธิ์ผู้ดูแล");
  return ok(session!.user.id);
}

export async function approveOrder(orderId: string): Promise<Result<Order>> {
  const admin = await requireAdminId();
  if (!admin.ok) return admin;
  const res = await createAdminPurchaseRepo().approve(orderId, admin.value);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return res;
}

export async function rejectOrder(
  orderId: string,
  note?: string
): Promise<Result<Order>> {
  const admin = await requireAdminId();
  if (!admin.ok) return admin;
  const res = await createAdminPurchaseRepo().reject(orderId, admin.value, note);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return res;
}
