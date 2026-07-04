"use server";

import { headers } from "next/headers";
import { auth } from "@/src/server/auth";
import { ok, err, type Result } from "@/src/domain/shared/result";
import type { Order } from "@/src/domain/ports/purchase.port";
import { createPurchaseRepo } from "@/src/adapters/purchases";
import { createProductRepo } from "@/src/adapters/products";
import { pushPurchaseAlert } from "@/src/server/notify/line";

async function currentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

/**
 * แจ้งชำระเงิน → สร้าง order สถานะ approved ทันที (auto-approve ปลดล็อกเลย ไม่ให้รอ)
 * ต้อง login ก่อน (ผูก identity ไว้ให้ admin เพิกถอนได้ถ้าเจอแจ้งเท็จ)
 * สำเร็จแล้วยิง LINE push แจ้ง admin (fail-safe — แจ้งพลาดไม่ทำให้การซื้อพัง)
 */
export async function recordPurchase(
  productId: string
): Promise<Result<Order>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return err("ต้องเข้าสู่ระบบก่อนซื้อ");

  const productRes = await createProductRepo().getById(productId);
  if (!productRes.ok) return err("ไม่พบสินค้านี้");
  const p = productRes.value;

  const added = await createPurchaseRepo(session.user.id).add({
    productId: p.id,
    productName: p.name,
    amountThb: p.priceThb,
  });

  if (added.ok) {
    await pushPurchaseAlert({
      productName: p.name,
      amountThb: p.priceThb,
      buyer: session.user.email ?? session.user.name ?? session.user.id,
      orderId: added.value.id,
    });
  }

  return added;
}

/** ดึงคำสั่งซื้อของผู้ใช้ปัจจุบัน (ใช้ตอน sync/กู้คืน) */
export async function listMyPurchases(): Promise<Result<Order[]>> {
  const userId = await currentUserId();
  if (!userId) return ok([]);
  return createPurchaseRepo(userId).listMine();
}
