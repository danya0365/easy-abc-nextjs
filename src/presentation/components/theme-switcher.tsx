"use client";

import {
  PREMIUM_THEMES,
  THEME_LABELS,
  THEME_TEMPLATES,
  useThemeStore,
} from "@/src/presentation/stores/theme.store";
import { useEntitlementStore } from "@/src/presentation/stores/entitlement.store";
import { useMounted } from "@/src/presentation/lib/use-mounted";
import Link from "next/link";

/** ตัวเลือกธีม (ของสำรอง — อยู่ในหน้าตั้งค่า) + toggle dark mode */
export function ThemeSwitcher() {
  const mounted = useMounted();
  const template = useThemeStore((s) => s.template);
  const dark = useThemeStore((s) => s.dark);
  const setTemplate = useThemeStore((s) => s.setTemplate);
  const toggleDark = useThemeStore((s) => s.toggleDark);
  const hasBundle = useEntitlementStore((s) => s.hasBundle());

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {THEME_TEMPLATES.map((t) => {
          const locked = PREMIUM_THEMES.includes(t) && !hasBundle;
          const active = template === t;
          const label = THEME_LABELS[t];
          if (locked) {
            return (
              <Link
                key={t}
                href="/shop"
                className="flex flex-col items-center gap-1 rounded-2xl border-4 border-border bg-muted-surface p-3 opacity-70"
              >
                <span className="text-2xl grayscale">{label.emoji}</span>
                <span className="text-xs font-bold text-muted">
                  {label.name} 🔒
                </span>
              </Link>
            );
          }
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTemplate(t)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-1 rounded-2xl border-4 p-3 transition-transform active:translate-y-0.5 ${
                active
                  ? "border-brand-500 bg-brand-50"
                  : "border-border bg-card"
              }`}
            >
              <span className="text-2xl">{label.emoji}</span>
              <span className="text-xs font-bold text-card-foreground">
                {label.name}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={toggleDark}
        aria-pressed={dark}
        className="flex items-center justify-between rounded-2xl border-4 border-border bg-card px-4 py-3"
      >
        <span className="font-bold text-card-foreground">
          {dark ? "🌙 โหมดกลางคืน" : "☀️ โหมดกลางวัน"}
        </span>
        <span
          className={`flex h-8 w-14 items-center rounded-full p-1 transition-colors ${
            dark ? "bg-brand-500" : "bg-muted-surface"
          }`}
        >
          <span
            className={`size-6 rounded-full bg-card shadow transition-transform ${
              dark ? "translate-x-6" : ""
            }`}
          />
        </span>
      </button>
    </div>
  );
}
