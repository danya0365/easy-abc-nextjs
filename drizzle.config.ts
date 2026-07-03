import { defineConfig } from "drizzle-kit";

// dev: ไม่ตั้ง env → migrate/push ลงไฟล์ ./dev.db · prod: ตั้ง TURSO_* แล้วรัน db:migrate
export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? "file:./dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
