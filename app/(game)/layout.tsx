export default function GameLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // full screen: ไม่มี TabBar — ปุ่มกลับ/พักเกมอยู่ในหน้าจอเกมเอง
  // select-none + prevent context menu: ป้องกันตอนเล่นเกมแล้วกดค้างขึ้นเมนู copy/paste
  return (
    <div
      className="min-h-dvh select-none"
      style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
