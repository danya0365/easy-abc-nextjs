import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/src/server/auth";
import { isAdmin } from "@/src/server/is-admin";

// แชร์ root layout (ธีม/ฟอนต์/bg) — เพิ่มแค่ chrome ผู้ดูแล
// guard: ไม่ใช่ admin → 404 (ไม่บอกใบ้ว่ามีหน้านี้อยู่)
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) notFound();

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-5 py-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-700 text-outline">
          🛠️ แผงผู้ดูแล
        </h1>
        <nav className="flex items-center gap-2 text-sm font-bold">
          <Link
            href="/admin"
            className="rounded-full bg-card px-3 py-1.5 text-brand-600"
          >
            รายได้
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-full bg-card px-3 py-1.5 text-brand-600"
          >
            คำสั่งซื้อ
          </Link>
          <Link
            href="/"
            className="rounded-full bg-muted-surface px-3 py-1.5 text-muted"
          >
            กลับแอป
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
