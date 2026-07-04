"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminOrder } from "@/src/domain/ports/admin-purchase.port";
import { approveOrder, rejectOrder } from "@/app/actions/admin";
import { ChunkyButton } from "@/src/presentation/components/chunky-button";

// จัดการคำสั่งซื้อ — auto-approve แล้ว; admin เพิกถอน (ปิดพรีเมียม) / คืนสิทธิ์ ได้
export function OrderApproval({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <p className="rounded-3xl border-4 border-border bg-card p-6 text-center text-muted">
        ยังไม่มีคำสั่งซื้อ
      </p>
    );
  }

  const run = async (
    id: string,
    fn: () => Promise<{ ok: boolean; error?: string }>
  ) => {
    setBusyId(id);
    setError(null);
    const res = await fn();
    setBusyId(null);
    if (!res.ok) {
      setError(res.error ?? "ทำรายการไม่สำเร็จ");
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="rounded-2xl bg-error-surface p-3 text-error">{error}</p>
      )}
      {orders.map((o) => (
        <div
          key={o.id}
          className="rounded-3xl border-4 border-border bg-card p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-card-foreground">{o.productName}</p>
              <p className="truncate text-sm text-muted">
                {o.userEmail || o.userName || o.userId}
              </p>
              <p className="text-xs text-muted">
                {new Date(o.createdAt).toLocaleString("th-TH")} · #{o.id}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="block font-heading text-2xl font-bold text-brand-600">
                {o.amountThb}฿
              </span>
              <StatusBadge status={o.status} />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {o.status === "approved" ? (
              <ChunkyButton
                size="sm"
                variant="danger"
                disabled={busyId === o.id}
                onClick={() => run(o.id, () => rejectOrder(o.id))}
              >
                {busyId === o.id ? "…" : "🚫 ปิดพรีเมียม (แจ้งเท็จ)"}
              </ChunkyButton>
            ) : (
              <ChunkyButton
                size="sm"
                variant="primary"
                disabled={busyId === o.id}
                onClick={() => run(o.id, () => approveOrder(o.id))}
              >
                {busyId === o.id ? "…" : "↩️ คืนสิทธิ์"}
              </ChunkyButton>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return (
      <span className="text-xs font-bold text-success">✓ ปลดล็อกแล้ว</span>
    );
  if (status === "pending")
    return <span className="text-xs font-bold text-warning">รอดำเนินการ</span>;
  return <span className="text-xs font-bold text-error">🚫 ถูกปิด</span>;
}
