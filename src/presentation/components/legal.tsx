import Link from "next/link";
import type { ReactNode } from "react";

// ⚠️ แก้อีเมลติดต่อ/วันที่ให้ตรงจริงก่อนใช้งาน (ใช้เป็นลิงก์ภายนอก เช่น Google consent screen)
export const SUPPORT_EMAIL = "support@easy-ai.online";
export const LEGAL_UPDATED = "3 กรกฎาคม 2569";
export const APP_NAME = "Easy ABC";

/** โครงหน้าเอกสารกฎหมาย — public, อ่านง่าย, ใช้ธีม/token เดียวกับแอป */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-8">
      <Link
        href="/"
        className="text-sm font-bold text-brand-600 hover:underline"
      >
        ← กลับหน้าแรก
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-brand-700 text-outline">
        {title}
      </h1>
      <p className="mt-1 text-sm text-muted">
        ปรับปรุงล่าสุด {LEGAL_UPDATED}
      </p>
      <div className="mt-6 flex flex-col gap-6">{children}</div>
      <p className="mt-10 text-sm text-muted">
        มีคำถาม ติดต่อเราได้ที่{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-bold text-brand-600 hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>
      </p>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-bold text-card-foreground">{heading}</h2>
      <div className="flex flex-col gap-2 leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1 pl-5">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
