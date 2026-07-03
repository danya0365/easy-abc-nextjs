import type { Metadata } from "next";
import { createAdminPurchaseRepo } from "@/src/adapters/purchases";
import { OrderApproval } from "@/src/presentation/components/admin/order-approval";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "จัดการคำสั่งซื้อ — ผู้ดูแล" };

export default async function AdminOrdersPage() {
  const res = await createAdminPurchaseRepo().listAll();
  const orders = res.ok ? res.value : [];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        การซื้อปลดล็อกอัตโนมัติทันที — ถ้าตรวจแล้วเป็นการแจ้งชำระเท็จ กด “ปิดพรีเมียม”
        เพื่อเพิกถอนสิทธิ์ของผู้ใช้คนนั้น
      </p>
      {!res.ok && (
        <p className="rounded-2xl bg-error-surface p-3 text-error">
          โหลดข้อมูลไม่สำเร็จ: {res.error}
        </p>
      )}
      <OrderApproval orders={orders} />
    </div>
  );
}
