import type { Metadata } from "next";
import { ChunkyButton } from "@/src/presentation/components/chunky-button";

export const metadata: Metadata = {
  title: "วิธีเล่น",
};

const STEPS = [
  {
    emoji: "👀",
    title: "1. ดูรูปภาพ",
    text: "ดูรูปแล้วนึกคำศัพท์ภาษาอังกฤษ เช่น รูปหมา = DOG",
  },
  {
    emoji: "👆",
    title: "2. แตะตัวอักษร",
    text: "แตะตัวอักษรในถาดเรียงให้ถูกลำดับ แตะช่องเพื่อเอาตัวอักษรคืนได้",
  },
  {
    emoji: "⭐",
    title: "3. เก็บดาวปลดด่าน",
    text: "สะกดถูกไม่พลาดได้ 3 ดาว! ผ่านด่านแล้วด่านต่อไปจะปลดล็อก",
  },
];

export default function HowToPlayPage() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-6 text-center">
      <h1 className="text-3xl font-bold text-brand-700 text-outline">
        วิธีเล่น
      </h1>
      <div className="mt-6 flex flex-col gap-4">
        {STEPS.map((s) => (
          <div
            key={s.title}
            className="rounded-4xl border-4 border-border bg-card p-6 shadow-[0_6px_0_var(--brand-200)]"
          >
            <div className="text-6xl">{s.emoji}</div>
            <h2 className="mt-2 text-2xl font-bold text-card-foreground">
              {s.title}
            </h2>
            <p className="mt-1 text-muted">{s.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-4xl border-4 border-border bg-card/80 p-5 text-left text-sm text-muted backdrop-blur">
        <p>
          🐣 <strong className="text-card-foreground">โหมดเติมตัวอักษร:</strong>{" "}
          นอกจากสะกดทั้งคำ ยังมีเกมเติมตัวที่หายไป — เติมข้างหน้า (
          <span className="font-heading font-bold">_AT</span>), เติมข้างหลัง (
          <span className="font-heading font-bold">CA_</span>) และเติมตรงกลาง (
          <span className="font-heading font-bold">H__E</span>) แต่ละเกมมีด่านและดาวของตัวเอง
        </p>
        <p className="mt-2">
          📚 <strong className="text-card-foreground">หมวดคำศัพท์:</strong>{" "}
          ก่อนเล่นจะให้เลือกหมวดก่อน (สัตว์ อาหาร ธรรมชาติ ฯลฯ หรือคละ) — คำในเกมจะเปลี่ยนตามหมวด
          ใช้ได้ทุกโหมด กดปุ่ม “เปลี่ยน” สลับหมวดได้ทุกเมื่อ ส่วนดาวเก็บรวมกันไม่หาย
        </p>
        <p className="mt-2">
          ⚡ <strong className="text-card-foreground">Energy:</strong> เริ่มด่านใหม่ใช้ 1 แท่ง
          (เล่นซ้ำด่านที่ผ่านแล้วฟรี!) เต็มเองทุก 5 นาที และเต็มหลอดฟรีทุกวันแรกที่เข้าเล่น
        </p>
        <p className="mt-2">
          🎁 <strong className="text-card-foreground">Premium:</strong> ปลดล็อกโหมดพิเศษ 4 โหมด
          ธีมใหม่ และ Energy ไม่จำกัด ในร้านค้า
        </p>
      </div>
      <ChunkyButton href="/modes" variant="sunny" size="lg" className="mt-8">
        เข้าใจแล้ว ไปเล่นเลย! 🎮
      </ChunkyButton>
    </div>
  );
}
