"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "หน้าแรก", emoji: "🏠", also: [] as string[] },
  { href: "/modes", label: "เล่น", emoji: "🎮", also: ["/levels"] },
  { href: "/shop", label: "ร้านค้า", emoji: "🛒", also: [] },
  { href: "/settings", label: "ตั้งค่า", emoji: "⚙️", also: ["/how-to-play"] },
];

/** TabBar ล่าง 4 แท็บ (เฉพาะ route group (main)) */
export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-border bg-card pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgb(0_0_0/0.1)]"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href) ||
                tab.also.some((a) => pathname.startsWith(a));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 font-bold transition-colors ${
                active ? "text-brand-500" : "text-muted"
              }`}
            >
              <span
                className={`text-2xl transition-transform ${active ? "scale-125" : ""}`}
                aria-hidden
              >
                {tab.emoji}
              </span>
              <span className="text-xs">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
