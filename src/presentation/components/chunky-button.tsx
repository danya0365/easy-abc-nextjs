import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "sunny" | "white" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-on-brand shadow-[0_6px_0_var(--brand-700)] active:shadow-[0_2px_0_var(--brand-700)]",
  sunny:
    "bg-accent-500 text-brand-800 shadow-[0_6px_0_var(--accent-600)] active:shadow-[0_2px_0_var(--accent-600)]",
  white:
    "bg-card text-brand-600 shadow-[0_6px_0_var(--brand-200)] active:shadow-[0_2px_0_var(--brand-200)]",
  danger:
    "bg-error text-on-brand shadow-[0_6px_0_rgb(0_0_0/0.25)] active:shadow-[0_2px_0_rgb(0_0_0/0.25)]",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-base min-h-11",
  md: "px-6 py-3 text-xl min-h-14",
  lg: "px-10 py-4 text-2xl min-h-16",
};

export interface ChunkyButtonProps {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/** ปุ่ม 3D ทรง chunky ขอบขาวหนาตามภาพโปรโมต — ใส่ href = Link, ใส่ onClick = button */
export function ChunkyButton({
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  children,
}: ChunkyButtonProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full border-4 border-border font-heading font-bold select-none transition-transform active:translate-y-1 ${
    VARIANTS[variant]
  } ${SIZES[size]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
