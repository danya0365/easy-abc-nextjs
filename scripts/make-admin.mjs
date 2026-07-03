// แต่งตั้ง admin คนแรก (bootstrap) — ต้อง login ด้วย Google อย่างน้อย 1 ครั้งก่อน
// ใช้: npm run db:make-admin -- you@example.com
// prod: ตั้ง TURSO_DATABASE_URL/TURSO_AUTH_TOKEN ก่อน (dev ใช้ ./dev.db อัตโนมัติ)
import { createClient } from "@libsql/client";

const email = process.argv[2];
if (!email) {
  console.error("usage: npm run db:make-admin -- you@example.com");
  process.exit(1);
}

const url = process.env.TURSO_DATABASE_URL ?? "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const client = createClient(authToken ? { url, authToken } : { url });

const r = await client.execute({
  sql: "update user set role = 'admin' where email = ?",
  args: [email],
});

if (r.rowsAffected > 0) {
  console.log(`✅ ตั้ง ${email} เป็น admin แล้ว`);
} else {
  console.error(
    `⚠️ ไม่พบ user อีเมล ${email} — ให้ login ด้วย Google 1 ครั้งก่อน แล้วรันใหม่`
  );
  process.exit(1);
}
