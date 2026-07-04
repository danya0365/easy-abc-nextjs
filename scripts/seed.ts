// Seed ข้อมูลตั้งต้น — ใช้ได้ทั้ง local (dev.db) และ prod (ตั้ง TURSO_* ก่อนรัน)
// สร้าง "admin ที่ login ได้ทันที" ด้วย email+password (ผ่าน better-auth เพื่อ hash ถูก) + ตั้ง role=admin
// ผู้เล่นทั่วไปใช้ Google login (ไม่ต้อง seed)
//
// ใช้:  npm run db:seed
// ตั้งค่าได้ผ่าน env: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
// prod:  TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed
import { eq } from "drizzle-orm";
import { auth } from "../src/server/auth";
import { db } from "../src/server/db/client";
import { user } from "../src/server/db/schema";

const email = process.env.ADMIN_EMAIL ?? "admin@easy-abc.local";
const password = process.env.ADMIN_PASSWORD ?? "changeme1234";
const name = process.env.ADMIN_NAME ?? "ผู้ดูแล Easy ABC";

async function main() {
  if (password.length < 8) {
    console.error("❌ ADMIN_PASSWORD ต้องยาว ≥ 8 ตัวอักษร");
    process.exit(1);
  }
  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      `⚠️  ใช้รหัสผ่าน default (${password}) — prod ควรตั้ง ADMIN_PASSWORD เอง`
    );
  }

  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing.length === 0) {
    // สร้าง credential user ผ่าน better-auth (hash password ให้อัตโนมัติ)
    await auth.api.signUpEmail({ body: { email, password, name } });
    console.log(`✅ สร้าง admin: ${email}`);
  } else {
    console.log(`ℹ️  มี user ${email} อยู่แล้ว — ข้ามการสร้าง`);
  }

  // ตั้ง role=admin (idempotent)
  await db.update(user).set({ role: "admin" }).where(eq(user.email, email));
  console.log(`✅ ตั้ง role=admin ให้ ${email} แล้ว`);
  console.log(`\n🔑 login admin ด้วย: ${email} / รหัสผ่านที่ตั้งไว้`);

  process.exit(0);
}

main().catch((e) => {
  console.error("❌ seed ล้มเหลว:", e?.message ?? e);
  process.exit(1);
});
