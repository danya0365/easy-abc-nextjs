// จุดเดียวที่ตัดสินว่าใครเป็น admin — สลับ logic ได้ที่นี่ (role มาจาก better-auth admin plugin)
// server-only: ใช้ใน server action / (admin) layout เพื่อ guard
type SessionLike = { user?: { role?: string | null } | null } | null | undefined;

export function isAdmin(session: SessionLike): boolean {
  const role = session?.user?.role;
  return !!role && role.split(",").includes("admin");
}
