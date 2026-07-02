import type { Metadata } from "next";
import { PurchasePanel } from "@/src/presentation/components/purchase-panel";

export const metadata: Metadata = {
  title: "ร้านค้า",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-6">
      <h1 className="mb-1 text-3xl font-bold text-brand-700 text-outline">
        🛒 ร้านค้า
      </h1>
      <p className="mb-5 text-sm text-brand-800">
        ซื้อครั้งเดียว ใช้ได้ตลอด — ไม่มีค่าใช้จ่ายรายเดือน
      </p>
      <PurchasePanel />
    </div>
  );
}
