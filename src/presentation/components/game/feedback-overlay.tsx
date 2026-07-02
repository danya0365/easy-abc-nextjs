"use client";

/** ป้ายฉลอง/ปลอบใจชั่วคราวระหว่างเล่น */
export function FeedbackOverlay({
  phase,
}: {
  phase: "loading" | "idle" | "correct" | "wrong";
}) {
  if (phase !== "correct" && phase !== "wrong") return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
      {phase === "correct" ? (
        <div className="animate-pop rounded-full border-4 border-border bg-success px-8 py-4 text-3xl font-bold text-white shadow-2xl">
          เก่งมาก! 🎉
        </div>
      ) : (
        <div className="animate-pop rounded-full border-4 border-border bg-tile-1 px-8 py-4 text-2xl font-bold text-white shadow-2xl">
          ลองใหม่นะ 💪
        </div>
      )}
    </div>
  );
}
