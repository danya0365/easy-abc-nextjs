"use client";

import { useRouter } from "next/navigation";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { ChunkyButton } from "./chunky-button";

/**
 * แจ้งเตือนเมื่อ admin เพิกถอนการซื้อ (แจ้งชำระเท็จ) — เด้งครั้งเดียวต่อ order
 * ค้างจนกว่าผู้ใช้จะกด "รับทราบ" (บันทึกลง persist → ไม่เด้งซ้ำ)
 */
export function RejectionNotice() {
  const mounted = useMounted();
  const router = useRouter();
  const rejected = useEntitlementStore((s) => s.orders).filter(
    (o) => o.status === "rejected"
  );
  const acknowledged = useEntitlementStore((s) => s.acknowledgedRejections);
  const acknowledgeRejection = useEntitlementStore(
    (s) => s.acknowledgeRejection
  );

  if (!mounted) return null;

  const pending = rejected.filter((o) => !acknowledged.includes(o.id));
  if (pending.length === 0) return null;

  const ids = pending.map((o) => o.id);
  const names = [...new Set(pending.map((o) => o.productName))].join(", ");
  const note = pending.find((o) => o.note)?.note;

  const ack = () => acknowledgeRejection(ids);
  const payAgain = () => {
    ack();
    router.push("/shop");
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-900/70 p-6"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="rejection-title"
    >
      <div className="w-full max-w-sm animate-pop rounded-4xl border-4 border-border bg-card p-6 text-center shadow-2xl">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-warning-surface text-4xl">
          💳
        </div>
        <h2
          id="rejection-title"
          className="mt-3 text-xl font-bold text-card-foreground"
        >
          การชำระเงินยังไม่สำเร็จ
        </h2>
        <p className="mt-2 text-sm text-muted">
          ผู้ดูแลตรวจสอบแล้วไม่พบยอดชำระสำหรับ{" "}
          <span className="font-bold text-card-foreground">{names}</span>{" "}
          จึงปิดสิทธิ์พรีเมียมไว้ก่อน หากต้องการใช้งานต่อ กรุณาชำระเงินอีกครั้ง
        </p>
        {note && (
          <p className="mt-3 rounded-2xl bg-muted-surface px-4 py-2 text-sm text-muted">
            หมายเหตุจากผู้ดูแล: {note}
          </p>
        )}
        <div className="mt-5 flex flex-col gap-2">
          <ChunkyButton onClick={payAgain} variant="primary">
            💳 ชำระเงินอีกครั้ง
          </ChunkyButton>
          <ChunkyButton onClick={ack} variant="white" size="sm">
            รับทราบ
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}
