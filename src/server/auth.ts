// better-auth — Google social login + admin plugin (role/ban) — server-only
// อ่าน BETTER_AUTH_SECRET / BETTER_AUTH_URL จาก env อัตโนมัติ (ตั้งใน .env.local / Vercel)
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "./db/client";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  // email+password: หลัก ๆ ไว้ให้ admin login ได้ทันที (seed มาแล้ว) — ผู้เล่นทั่วไปใช้ Google
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  plugins: [admin()],
});

export type Session = typeof auth.$Infer.Session;
