"use client";

import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Product } from "@/src/domain/ports/product.port";
import { buildPromptPayPayload } from "@/src/domain/services/promptpay";
import { createProductRepo } from "@/src/adapters/products";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { useSession, signIn } from "@/src/presentation/lib/auth-client";
import { recordPurchase } from "@/app/actions/purchase";
import { sound } from "@/src/presentation/lib/sound";
import { ChunkyButton } from "./chunky-button";

// ระยะเวลา "ตรวจสอบการชำระเงิน" (หลอกๆ ให้ดูน่าเชื่อ) — recordPurchase จริงรันไปพร้อมกัน
const VERIFY_MS = 6500;
const VERIFY_STEPS = [
  "เชื่อมต่อระบบชำระเงิน",
  "ตรวจสอบยอดเงินที่โอน",
  "ยืนยันการซื้อ",
];

// จำ "ตั้งใจจะยืนยันสินค้าไหน" ไว้ก่อนเด้ง Google — กลับมาแล้ว resume ให้อัตโนมัติไม่ต้องกดซ้ำ
const PENDING_KEY = "easy-abc-pending-purchase";
const PENDING_MAX_AGE_MS = 15 * 60 * 1000;

interface PendingPurchase {
  productId: string;
  ts: number;
}

/**
 * ร้านค้า: เลือกสินค้า → QR PromptPay → กดยืนยันว่าจ่ายแล้ว (ปุ่มเดียวเสมอ ไม่ต้อง login ก่อน)
 * ยังไม่ login → เด้ง Google ระหว่างยืนยัน แล้วกลับมาทำต่อให้อัตโนมัติ (login แค่ผูกบัญชี ไม่ใช่เงื่อนไขก่อนจ่าย)
 * จ่ายแล้ว = auto-approve ปลดล็อกทันที; admin เพิกถอนภายหลังได้ถ้าแจ้งเท็จ
 */
export function PurchasePanel() {
  const mounted = useMounted();
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [verifying, setVerifying] = useState<Product | null>(null);
  const [submitted, setSubmitted] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const owns = useEntitlementStore((s) => s.owns);
  const orders = useEntitlementStore((s) => s.orders);
  const upsertOrder = useEntitlementStore((s) => s.upsertOrder);

  const isPending = (id: string) =>
    orders.some((o) => o.productId === id && o.status === "pending");

  useEffect(() => {
    createProductRepo()
      .getAll()
      .then((r) => {
        if (r.ok) setProducts(r.value);
      });
  }, []);

  const confirmPaid = useCallback(async (p: Product) => {
    setError(null);
    setSelected(null);
    setVerifying(p);
    const [res] = await Promise.all([
      recordPurchase(p.id),
      new Promise<void>((resolve) => setTimeout(resolve, VERIFY_MS)),
    ]);
    setVerifying(null);
    if (!res.ok) {
      // ตรวจแล้วมีปัญหาจริง (เช่น session หลุด) → กลับไป QR พร้อม error ไม่แกล้งสำเร็จ
      setError(res.error);
      setSelected(p);
      return;
    }
    upsertOrder(res.value);
    setSubmitted(p);
    sound.win();
  }, [upsertOrder]);

  // กลับมาจาก Google (หรือมี session อยู่แล้วตอนเปิดหน้า) → สานต่อการซื้อที่ตั้งใจไว้ก่อนเด้ง login
  useEffect(() => {
    if (!session || products.length === 0) return;
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PENDING_KEY); // ลบทันทีกันยิงซ้ำ
    try {
      const pending: PendingPurchase = JSON.parse(raw);
      if (Date.now() - pending.ts > PENDING_MAX_AGE_MS) return; // เก่าเกินไป ไม่สานต่อ
      const product = products.find((p) => p.id === pending.productId);
      // setTimeout กัน setState ตรง ๆ ใน effect body (react-hooks v6)
      if (product) setTimeout(() => confirmPaid(product), 0);
    } catch {
      // parse พลาด → ทิ้งเงียบๆ
    }
  }, [session, products, confirmPaid]);

  const handleConfirmPaid = async (p: Product) => {
    if (!session) {
      // ยังไม่ login → จำไว้ก่อนเด้ง Google แล้วกลับมาสานต่อเองอัตโนมัติ (ไม่ต้องกดยืนยันซ้ำ)
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ productId: p.id, ts: Date.now() } satisfies PendingPurchase)
      );
      setBusy(true);
      await signIn.social({ provider: "google", callbackURL: "/shop" });
      return;
    }
    await confirmPaid(p);
  };

  const bundle = products.find((p) => p.kind === "bundle");
  const modes = products.filter((p) => p.kind === "mode");

  return (
    <div className="flex flex-col gap-4">
      {bundle && (
        <ProductCard
          product={bundle}
          owned={mounted && owns(bundle.id)}
          pending={mounted && isPending(bundle.id)}
          highlight
          onBuy={() => setSelected(bundle)}
        />
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {modes.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            owned={mounted && (owns(p.id) || owns("bundle"))}
            pending={mounted && isPending(p.id)}
            onBuy={() => setSelected(p)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted">
        ชำระผ่าน PromptPay — สแกน QR ด้วยแอปธนาคาร แล้วกดยืนยัน ปลดล็อกทันที
      </p>

      {/* Modal QR ชำระเงิน */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 p-6">
          <div className="w-full max-w-sm animate-pop rounded-4xl border-4 border-border bg-card p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-card-foreground">
              {selected.emoji} {selected.name}
            </h2>
            <p className="mt-1 font-heading text-3xl font-bold text-brand-500">
              {selected.priceThb} บาท
            </p>
            <div className="mx-auto mt-4 w-fit rounded-2xl border-4 border-brand-500 bg-white p-3">
              <QRCodeSVG
                value={buildPromptPayPayload(
                  selected.promptpayId,
                  selected.priceThb
                )}
                size={200}
                marginSize={1}
              />
            </div>
            <p className="mt-3 text-sm text-muted">
              สแกนด้วยแอปธนาคาร โอนแล้วกดปุ่มยืนยันด้านล่าง
              {!session && " (ถ้ายังไม่เข้าสู่ระบบ จะพาไปเข้าสู่ระบบด้วย Google ก่อนเพื่อผูกกับบัญชี)"}
            </p>
            {error && (
              <p className="mt-2 text-sm font-bold text-error">{error}</p>
            )}
            <div className="mt-4 flex flex-col gap-3">
              <ChunkyButton
                onClick={() => handleConfirmPaid(selected)}
                variant="primary"
                disabled={busy}
              >
                {busy ? "กำลังส่ง…" : "✅ ชำระเงินแล้ว — ยืนยัน"}
              </ChunkyButton>
              <ChunkyButton
                onClick={() => {
                  setSelected(null);
                  setError(null);
                }}
                variant="white"
                size="sm"
              >
                ยกเลิก
              </ChunkyButton>
            </div>
          </div>
        </div>
      )}

      {/* กำลังตรวจสอบการชำระเงิน (แอนิเมชันหลายสเต็ป) */}
      {verifying && <VerifyingModal product={verifying} />}

      {/* ซื้อสำเร็จ — ปลดล็อกทันที */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 p-6">
          <div className="w-full max-w-sm animate-pop rounded-4xl border-4 border-border bg-card p-6 text-center shadow-2xl">
            <div className="text-6xl">🎉</div>
            <h2 className="mt-2 text-2xl font-bold text-card-foreground">
              ปลดล็อกสำเร็จ!
            </h2>
            <p className="mt-1 text-muted">
              {submitted.emoji} {submitted.name} พร้อมใช้งานแล้ว
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <ChunkyButton href="/modes" variant="sunny">
                🎮 ไปเล่นเลย!
              </ChunkyButton>
              <ChunkyButton
                onClick={() => setSubmitted(null)}
                variant="white"
                size="sm"
              >
                ปิด
              </ChunkyButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** โมดัล "กำลังตรวจสอบการชำระเงิน" — ไล่ติ๊กทีละสเต็ป + progress bar ให้ดูเหมือนระบบตรวจจริง */
function VerifyingModal({ product }: { product: Product }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const per = VERIFY_MS / (VERIFY_STEPS.length + 1);
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, VERIFY_STEPS.length)),
      per
    );
    return () => clearInterval(id);
  }, []);

  const progress = Math.round((step / VERIFY_STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 p-6">
      <div className="w-full max-w-sm animate-pop rounded-4xl border-4 border-border bg-card p-6 text-center shadow-2xl">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-100">
          <span className="block size-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
        </div>
        <h2 className="mt-3 text-xl font-bold text-card-foreground">
          กำลังตรวจสอบการชำระเงิน
        </h2>
        <p className="mt-1 text-sm text-muted">
          {product.emoji} {product.name} — กรุณารอสักครู่ อย่าปิดหน้านี้
        </p>
        <ul className="mt-4 flex flex-col gap-2 text-left">
          {VERIFY_STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done
                      ? "bg-success text-white"
                      : active
                        ? "bg-accent-500 text-brand-800"
                        : "bg-muted-surface text-muted"
                  }`}
                >
                  {done ? "✓" : active ? "…" : ""}
                </span>
                <span
                  className={
                    done || active
                      ? "font-bold text-card-foreground"
                      : "text-muted"
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted-surface">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  owned,
  pending,
  highlight = false,
  onBuy,
}: {
  product: Product;
  owned: boolean;
  pending: boolean;
  highlight?: boolean;
  onBuy: () => void;
}) {
  return (
    <div
      className={`rounded-4xl border-4 border-border p-5 shadow-[0_6px_0_var(--brand-200)] ${
        highlight ? "bg-accent-100" : "bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl">{product.emoji}</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-card-foreground">
            {product.name}
            {highlight && (
              <span className="ml-2 rounded-full bg-tile-1 px-2 py-0.5 text-xs text-white">
                คุ้มสุด!
              </span>
            )}
          </h3>
          <p className="text-sm text-muted">{product.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-heading text-2xl font-bold text-brand-500">
          {product.priceThb}฿
        </span>
        {owned ? (
          <span className="rounded-full bg-success-surface px-4 py-2 font-bold text-success">
            ซื้อแล้ว ✓
          </span>
        ) : pending ? (
          <span className="rounded-full bg-warning-surface px-4 py-2 font-bold text-warning">
            ⏳ รออนุมัติ
          </span>
        ) : (
          <ChunkyButton
            onClick={onBuy}
            variant={highlight ? "sunny" : "primary"}
            size="sm"
          >
            ซื้อเลย
          </ChunkyButton>
        )}
      </div>
    </div>
  );
}
