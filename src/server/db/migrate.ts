// Auto-migrate ตอน deploy — รันโดย `vercel-build` script บน Vercel (env TURSO_* ตั้งในโปรเจกต์)
// ใช้ programmatic migrator ของ drizzle อ่านไฟล์ SQL ใน ./drizzle (ที่ commit ไว้) แล้ว apply เฉพาะที่ยังไม่ลง
// ข้ามถ้าไม่มี TURSO_DATABASE_URL (build local ที่ไม่ได้ตั้ง env — ป้องกันไปแตะ prod โดยไม่ตั้งใจ)
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./client";

async function main() {
  if (!process.env.TURSO_DATABASE_URL) {
    console.log("⏭️  ไม่มี TURSO_DATABASE_URL — ข้าม auto-migrate (local/dev)");
    return;
  }
  console.log("🗄️  กำลัง migrate ฐานข้อมูล Turso…");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ migrations applied");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ migration failed:", e);
    process.exit(1);
  });
