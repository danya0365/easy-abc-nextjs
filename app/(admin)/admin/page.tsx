import type { Metadata } from "next";
import { createAdminPurchaseRepo } from "@/src/adapters/purchases";
import { summarizeRevenue } from "@/src/domain/services/revenue";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "สรุปรายได้ — ผู้ดูแล" };

const baht = (n: number) => `${n.toLocaleString("th-TH")}฿`;

function StatCard({
  label,
  value,
  tone = "card",
}: {
  label: string;
  value: string;
  tone?: "card" | "success" | "warning";
}) {
  const bg =
    tone === "success"
      ? "bg-success-surface"
      : tone === "warning"
        ? "bg-warning-surface"
        : "bg-card";
  return (
    <div className={`rounded-3xl border-4 border-border ${bg} p-4`}>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-card-foreground">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const res = await createAdminPurchaseRepo().listAll();
  const orders = res.ok ? res.value : [];
  const s = summarizeRevenue(orders);
  const recent = orders.slice(0, 8);

  return (
    <div className="flex flex-col gap-5">
      {!res.ok && (
        <p className="rounded-2xl bg-error-surface p-3 text-error">
          โหลดข้อมูลไม่สำเร็จ: {res.error}
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="รายได้รวม" value={baht(s.totalThb)} tone="success" />
        <StatCard label="ซื้อสำเร็จ" value={`${s.approvedCount}`} />
        <StatCard
          label="ถูกเพิกถอน"
          value={`${s.rejectedCount}`}
          tone="warning"
        />
      </div>

      <section className="rounded-3xl border-4 border-border bg-card p-5">
        <h2 className="mb-3 text-lg font-bold text-card-foreground">
          รายได้ตามสินค้า
        </h2>
        {s.byProduct.length === 0 ? (
          <p className="text-sm text-muted">ยังไม่มีรายได้ที่อนุมัติ</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {s.byProduct.map((p) => (
              <li
                key={p.productId}
                className="flex items-center justify-between rounded-2xl bg-muted-surface px-4 py-2"
              >
                <span className="font-bold text-card-foreground">
                  {p.productName}{" "}
                  <span className="text-sm font-normal text-muted">
                    ×{p.count}
                  </span>
                </span>
                <span className="font-heading font-bold text-brand-600">
                  {baht(p.totalThb)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border-4 border-border bg-card p-5">
        <h2 className="mb-3 text-lg font-bold text-card-foreground">
          คำสั่งซื้อล่าสุด
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted">ยังไม่มีคำสั่งซื้อ</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {recent.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-2 rounded-2xl bg-muted-surface px-4 py-2"
              >
                <span className="min-w-0">
                  <span className="block truncate font-bold text-card-foreground">
                    {o.productName}
                  </span>
                  <span className="block truncate text-muted">
                    {o.userEmail || o.userName || o.userId}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-bold text-brand-600">
                    {baht(o.amountThb)}
                  </span>
                  <StatusBadge status={o.status} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return <span className="text-xs text-success">อนุมัติ</span>;
  if (status === "pending")
    return <span className="text-xs text-warning">รออนุมัติ</span>;
  return <span className="text-xs text-error">ปฏิเสธ</span>;
}
