import { TabBar } from "@/src/presentation/components/tab-bar";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* กันเนื้อหาโดน TabBar ทับ */}
      <main className="flex-1 pb-24">{children}</main>
      <TabBar />
    </div>
  );
}
