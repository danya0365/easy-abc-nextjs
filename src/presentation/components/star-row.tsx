type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "text-lg",
  md: "text-3xl",
  lg: "text-6xl",
};

/** แถวดาว 0–3 ดวง — ดวงที่ได้เป็นทอง ดวงที่ไม่ได้เป็นเงา */
export function StarRow({
  stars,
  size = "md",
  animate = false,
  className = "",
}: {
  stars: number;
  size?: Size;
  animate?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-1 ${SIZES[size]} ${className}`}
      aria-label={`${stars} ดาว`}
    >
      {[0, 1, 2].map((i) => {
        const earned = i < stars;
        return (
          <span
            key={i}
            className={`drop-shadow ${earned ? "" : "opacity-30 grayscale"} ${
              animate && earned ? "animate-pop" : ""
            }`}
            style={animate && earned ? { animationDelay: `${i * 0.25}s` } : undefined}
          >
            ⭐
          </span>
        );
      })}
    </div>
  );
}
