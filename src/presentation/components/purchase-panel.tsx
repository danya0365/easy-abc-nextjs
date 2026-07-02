"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Product } from "@/src/domain/ports/product.port";
import { buildPromptPayPayload } from "@/src/domain/services/promptpay";
import { createProductRepo } from "@/src/adapters/products";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import { sound } from "@/src/presentation/lib/sound";
import { ChunkyButton } from "./chunky-button";

/**
 * ร้านค้า: เลือกสินค้า → QR PromptPay → กดยืนยัน = อนุมัติทันที
 * ⚠️ auto-approve โดยตั้งใจ ไม่มีการตรวจสอบการชำระเงิน (ยอมรับความเสี่ยงแล้ว)
 */
export function PurchasePanel() {
  const mounted = useMounted();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [justBought, setJustBought] = useState<Product | null>(null);
  const owns = useEntitlementStore((s) => s.owns);
  const approve = useEntitlementStore((s) => s.approve);

  useEffect(() => {
    createProductRepo()
      .getAll()
      .then((r) => {
        if (r.ok) setProducts(r.value);
      });
  }, []);

  const confirmPaid = (p: Product) => {
    approve(p);
    setSelected(null);
    setJustBought(p);
    sound.win();
  };

  const bundle = products.find((p) => p.kind === "bundle");
  const modes = products.filter((p) => p.kind === "mode");

  return (
    <div className="flex flex-col gap-4">
      {/* Bundle เด่นสุด */}
      {bundle && (
        <ProductCard
          product={bundle}
          owned={mounted && owns(bundle.id)}
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
            onBuy={() => setSelected(p)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted">
        ชำระผ่าน PromptPay — สแกน QR ด้วยแอปธนาคาร แล้วกดยืนยันได้เลย
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
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <ChunkyButton onClick={() => confirmPaid(selected)} variant="primary">
                ✅ ชำระเงินแล้ว — ยืนยัน
              </ChunkyButton>
              <ChunkyButton onClick={() => setSelected(null)} variant="white" size="sm">
                ยกเลิก
              </ChunkyButton>
            </div>
          </div>
        </div>
      )}

      {/* ซื้อสำเร็จ */}
      {justBought && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 p-6">
          <div className="w-full max-w-sm animate-pop rounded-4xl border-4 border-border bg-card p-6 text-center shadow-2xl">
            <div className="text-6xl">🎉</div>
            <h2 className="mt-2 text-2xl font-bold text-card-foreground">
              ปลดล็อกสำเร็จ!
            </h2>
            <p className="mt-1 text-muted">
              {justBought.emoji} {justBought.name} พร้อมใช้งานแล้ว
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <ChunkyButton href="/modes" variant="sunny">
                🎮 ไปเล่นเลย!
              </ChunkyButton>
              <ChunkyButton
                onClick={() => setJustBought(null)}
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

function ProductCard({
  product,
  owned,
  highlight = false,
  onBuy,
}: {
  product: Product;
  owned: boolean;
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
        ) : (
          <ChunkyButton onClick={onBuy} variant={highlight ? "sunny" : "primary"} size="sm">
            ซื้อเลย
          </ChunkyButton>
        )}
      </div>
    </div>
  );
}
