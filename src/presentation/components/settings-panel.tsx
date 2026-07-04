"use client";

import { useState } from "react";
import Link from "next/link";
import { useSettingsStore } from "@/src/presentation/stores/settings.store";
import { useProgressStore } from "@/src/presentation/stores/progress.store";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useStatsStore } from "@/src/presentation/stores/stats.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { ThemeSwitcher } from "./theme-switcher";
import { ChunkyButton } from "./chunky-button";
import { AppVersion } from "./app-version";
import { AuthPanel } from "./auth-panel";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-4xl border-4 border-border bg-card/85 p-5 backdrop-blur">
      <h2 className="mb-3 text-lg font-bold text-card-foreground">{title}</h2>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className="flex w-full items-center justify-between rounded-2xl bg-muted-surface px-4 py-3"
    >
      <span className="font-bold text-card-foreground">{label}</span>
      <span
        className={`flex h-8 w-14 items-center rounded-full p-1 transition-colors ${
          on ? "bg-success" : "bg-locked"
        }`}
      >
        <span
          className={`size-6 rounded-full bg-card shadow transition-transform ${
            on ? "translate-x-6" : ""
          }`}
        />
      </span>
    </button>
  );
}

export function SettingsPanel() {
  const mounted = useMounted();
  const sfxMuted = useSettingsStore((s) => s.sfxMuted);
  const speechMuted = useSettingsStore((s) => s.speechMuted);
  const toggleSfx = useSettingsStore((s) => s.toggleSfx);
  const toggleSpeech = useSettingsStore((s) => s.toggleSpeech);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const resetStats = useStatsStore((s) => s.resetStats);
  const orders = useEntitlementStore((s) => s.orders);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4">
      <Section title="👤 บัญชี">
        <AuthPanel />
      </Section>

      <Section title="🔊 เสียง">
        <div className="flex flex-col gap-2">
          <ToggleRow
            label="เสียงเอฟเฟกต์"
            on={!sfxMuted}
            onToggle={toggleSfx}
          />
          <ToggleRow
            label="เสียงอ่านออกเสียง (อังกฤษ)"
            on={!speechMuted}
            onToggle={toggleSpeech}
          />
        </div>
      </Section>

      <Section title="🎨 ธีม">
        <ThemeSwitcher />
      </Section>

      <Section title="🧾 การซื้อของฉัน">
        {orders.length === 0 ? (
          <p className="text-sm text-muted">
            ยังไม่มีรายการซื้อ —{" "}
            <Link href="/shop" className="font-bold text-brand-500 underline">
              ไปดูร้านค้า
            </Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {orders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between rounded-2xl bg-muted-surface px-4 py-2 text-sm"
              >
                <span className="font-bold text-card-foreground">
                  {o.productName}
                </span>
                <span className="text-muted">
                  {o.amountThb}฿ ·{" "}
                  {new Date(o.createdAt).toLocaleDateString("th-TH")} ·{" "}
                  {o.status === "approved" ? (
                    <span className="text-success">อนุมัติแล้ว</span>
                  ) : o.status === "pending" ? (
                    <span className="text-warning">รออนุมัติ</span>
                  ) : (
                    <span className="text-error">ถูกปฏิเสธ</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="📖 อื่น ๆ">
        <ChunkyButton href="/how-to-play" variant="white" size="sm">
          วิธีเล่น
        </ChunkyButton>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href="/terms" className="font-bold text-brand-500 underline">
            ข้อกำหนดการใช้งาน
          </Link>
          <Link href="/privacy" className="font-bold text-brand-500 underline">
            นโยบายความเป็นส่วนตัว
          </Link>
        </div>
      </Section>

      <Section title="🗑️ ล้างความคืบหน้า">
        <p className="mb-3 text-sm text-muted">
          ลบดาวและสถิติทั้งหมด (การซื้อจะไม่หายไป)
        </p>
        {confirmReset ? (
          <div className="flex flex-col gap-2">
            <p className="font-bold text-error">แน่ใจนะ? ดาวทั้งหมดจะหายไป!</p>
            <div className="flex gap-2">
              <ChunkyButton
                onClick={() => {
                  resetProgress();
                  resetStats();
                  setConfirmReset(false);
                }}
                variant="danger"
                size="sm"
              >
                ยืนยัน ล้างเลย
              </ChunkyButton>
              <ChunkyButton
                onClick={() => setConfirmReset(false)}
                variant="white"
                size="sm"
              >
                ยกเลิก
              </ChunkyButton>
            </div>
          </div>
        ) : (
          <ChunkyButton
            onClick={() => setConfirmReset(true)}
            variant="danger"
            size="sm"
          >
            ล้างความคืบหน้า
          </ChunkyButton>
        )}
      </Section>

      <AppVersion />
    </div>
  );
}
