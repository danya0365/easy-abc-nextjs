import Image from "next/image";
import { ChunkyButton } from "@/src/presentation/components/chunky-button";
import { AppVersion } from "@/src/presentation/components/app-version";

const FEATURES = [
  { emoji: "🔤", label: "จำตัวอักษร", color: "bg-tile-2" },
  { emoji: "📖", label: "สะกดคำ", color: "bg-tile-4" },
  { emoji: "⭐", label: "เก็บดาว", color: "bg-accent-500" },
  { emoji: "🧠", label: "พัฒนาทักษะ", color: "bg-tile-3" },
];

const TRUST = [
  { emoji: "🛡️", label: "ปลอดภัยสำหรับเด็ก" },
  { emoji: "⬇️", label: "ไม่ต้องดาวน์โหลด" },
  { emoji: "💻", label: "เล่นได้ทุกอุปกรณ์" },
  { emoji: "🌏", label: "เล่นได้ทุกที่ ทุกเวลา" },
];

const DECOR = [
  { emoji: "⭐", cls: "left-[8%] top-[6%] text-3xl animate-float" },
  { emoji: "✨", cls: "right-[10%] top-[9%] text-2xl animate-float-slow" },
  { emoji: "☁️", cls: "left-[4%] top-[28%] text-4xl animate-float-slow" },
  { emoji: "☁️", cls: "right-[6%] top-[34%] text-5xl animate-float" },
  { emoji: "🌟", cls: "left-[12%] bottom-[18%] text-2xl animate-float" },
  { emoji: "🏰", cls: "right-[8%] bottom-[12%] text-4xl animate-float-slow" },
];

export default function HomePage() {
  return (
    <div className="relative mx-auto flex max-w-lg flex-col items-center overflow-hidden px-6 pt-8 text-center">
      {DECOR.map((d, i) => (
        <span key={i} aria-hidden className={`pointer-events-none absolute select-none ${d.cls}`}>
          {d.emoji}
        </span>
      ))}

      <Image
        src="/easy-abc/logo.png"
        alt="Easy ABC — แพนด้ากับกระต่ายชูมือทักทายบนโลโก้"
        width={300}
        height={300}
        priority
        className="drop-shadow-xl"
      />

      <h1 className="mt-2 text-4xl font-bold text-tile-4 text-outline">
        เกมสะกดคำสำหรับเด็ก
      </h1>
      <p className="mt-3 rounded-full bg-tile-5 px-5 py-2 text-lg font-bold text-white shadow-md">
        เรียนรู้ผ่านการเล่น — <span className="text-accent-400">สนุก</span> ปลดด่าน{" "}
        <span className="text-accent-400">เก็บดาว!</span>
      </p>

      <ChunkyButton href="/modes" variant="sunny" size="lg" className="mt-8">
        🎮 เล่นเลย!
      </ChunkyButton>

      <div className="mt-8 grid w-full grid-cols-2 gap-3">
        {FEATURES.map((f) => (
          <div
            key={f.label}
            className={`flex items-center gap-2 rounded-full border-4 border-border ${f.color} px-4 py-2.5 font-bold text-white shadow-md`}
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-card text-lg">
              {f.emoji}
            </span>
            {f.label}
          </div>
        ))}
      </div>

      <div className="mt-8 w-full rounded-4xl border-4 border-border bg-card/85 p-5 shadow-xl backdrop-blur">
        <h2 className="text-xl font-bold text-card-foreground">
          🎁 Easy ABC Premium
        </h2>
        <p className="mt-1 text-sm text-muted">
          ปลดล็อกโหมดจับเวลา ฟังแล้วสะกด เล่นไม่จำกัด ทายคำจากรูป
          + ธีมพิเศษ + Energy ไม่จำกัด
        </p>
        <ChunkyButton href="/shop" variant="primary" size="sm" className="mt-3">
          ดูในร้านค้า →
        </ChunkyButton>
      </div>

      <div className="mt-8 flex w-full flex-wrap justify-center gap-2">
        {TRUST.map((t) => (
          <span
            key={t.label}
            className="flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1.5 text-sm font-semibold text-brand-700 backdrop-blur"
          >
            <span aria-hidden>{t.emoji}</span> {t.label}
          </span>
        ))}
      </div>

      <AppVersion className="mb-2 mt-8" />
    </div>
  );
}
