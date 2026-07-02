import { ChunkyButton } from "@/src/presentation/components/chunky-button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="animate-float text-8xl">🐼❓</div>
      <h1 className="mt-4 text-4xl font-bold text-brand-700 text-outline">
        อุ๊ปส์! หลงทางแล้ว
      </h1>
      <p className="mt-2 text-lg text-brand-800">
        น้องแพนด้าหาหน้านี้ไม่เจอ ลองกลับไปหน้าแรกกันเถอะ
      </p>
      <ChunkyButton href="/" variant="sunny" size="lg" className="mt-8">
        🏠 กลับหน้าแรก
      </ChunkyButton>
    </div>
  );
}
