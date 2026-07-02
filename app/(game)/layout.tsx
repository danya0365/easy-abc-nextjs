export default function GameLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // full screen: ไม่มี TabBar — ปุ่มกลับ/พักเกมอยู่ในหน้าจอเกมเอง
  return <div className="min-h-dvh">{children}</div>;
}
