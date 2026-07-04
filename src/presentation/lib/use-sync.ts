"use client";

import { useEffect, useRef } from "react";
import { useSession } from "./auth-client";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useProgressStore } from "@/src/presentation/stores/progress.store";
import { listMyPurchases } from "@/app/actions/purchase";
import { pullProgress, pushProgress } from "@/app/actions/sync";

/**
 * sync กับ server เมื่อมี session:
 * - การซื้อ: pull → merge เข้า entitlement store (ถ้า admin เพิ่ง approve จะปลดล็อก)
 * - ดาว: pull → merge (best-of) → push ค่าที่รวมแล้วกลับ · เมื่อได้ดาวใหม่ push แบบ debounce
 * anonymous → ไม่ยุ่ง (local เฉย ๆ)
 */
export function useSync() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const hydrateFromServer = useEntitlementStore((s) => s.hydrateFromServer);
  const mergeFromServer = useProgressStore((s) => s.mergeFromServer);
  const starsByGame = useProgressStore((s) => s.starsByGame);

  const syncedRef = useRef(false);

  // pull ครั้งแรกตอนมี session: การซื้อ + ดาว แล้ว push ดาวที่ merge แล้วกลับ
  useEffect(() => {
    if (!userId) {
      syncedRef.current = false;
      return;
    }
    let cancelled = false;
    (async () => {
      const [purchases, progress] = await Promise.all([
        listMyPurchases(),
        pullProgress(),
      ]);
      if (cancelled) return;
      if (purchases.ok) hydrateFromServer(purchases.value);
      if (progress.ok) mergeFromServer(progress.value);
      // push ค่าที่ merge แล้ว (claim ดาว local ที่เล่นก่อน login ขึ้น server)
      const merged = useProgressStore.getState().starsByGame;
      await pushProgress(merged);
      if (!cancelled) syncedRef.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, hydrateFromServer, mergeFromServer]);

  // ได้ดาวใหม่หลัง sync แล้ว → push แบบ debounce (ไม่ push ทับ server ก่อน pull เสร็จ)
  useEffect(() => {
    if (!userId || !syncedRef.current) return;
    const t = setTimeout(() => {
      pushProgress(starsByGame);
    }, 1000);
    return () => clearTimeout(t);
  }, [starsByGame, userId]);
}
