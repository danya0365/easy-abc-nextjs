---
name: adr-0002-auth-and-admin-approve
description: ADR — เพิ่ม backend ตัวแรก (better-auth Google + admin email/password + Turso/Drizzle) + IAP login ก่อนซื้อ/auto-approve ทันที/admin เพิกถอนได้ + หน้า admin/dashboard (อ่านเมื่อแตะ auth/shop/admin/DB/migration)
metadata: 
  node_type: memory
  type: decision
  status: active
  scope: global
  originSessionId: 20efbc22-f9c4-45aa-a7a9-7c465c848062
---

# ADR-0002: Login + Admin-Approved Purchase + Cloud Save

**วันที่:** 2026-07-03 · **สถานะ:** accepted + implemented (v0.2 dev)

## บริบท

v0.1 เป็น client-only ล้วน — การซื้อ/ดาวอยู่ localStorage ไม่มี identity → ล้าง localStorage/เปลี่ยนเครื่อง = ของหาย
และ IAP เป็น auto-approve (กดยืนยัน = ปลดล็อกทันที) พี่ต้องการกู้คืนการซื้อข้ามเครื่อง และเพราะตอนนี้รู้ identity แล้ว
จึงให้ **admin อนุมัติการซื้อ** + มีหน้า admin และ dashboard สรุปรายได้

## การตัดสินใจ

1. **Backend ตัวแรก**: better-auth + admin plugin · **ผู้เล่นทั่วไป login Google** · **admin login email+password** (เปิด `emailAndPassword`) — seed admin ด้วย `npm run db:seed` (สร้างผ่าน better-auth API ให้ hash ถูก + ตั้ง role) admin login ได้ทันทีไม่ต้องพึ่ง Google · Turso (libSQL) ผ่าน Drizzle ORM · **migration-based** (drizzle-kit `generate`→ไฟล์ SQL commit ลง `drizzle/`, `migrate` apply)
2. **login ก่อนซื้อ + auto-approve ทันที + admin เพิกถอนได้** (ตัดสินใจสุดท้าย — เคยคิดแบบ pending→admin approve แต่พี่เลือก auto ปลดล็อกไม่ให้ผู้ใช้รอ): กดยืนยัน ต้อง login → order `approved` ทันที ปลดล็อกเลย · admin กด "ปิดพรีเมียม" เพิกถอน (approved→rejected) ถ้าเจอแจ้งเท็จ · entitlement นับเฉพาะ approved · **ไม่มี auto-verify สลิป/เงิน**
3. **Sync = การซื้อ + ดาว** (พลังงาน/สถิติ/ธีม/เสียง คง local) · orders merge = **server เป็นเจ้าของความจริง** (ทับ local ตาม id → การเพิกถอนของ admin propagate ลง client จริง), ดาว = best-of ต่อด่าน — pure fn ใน `src/domain/services/sync.ts` (ทดสอบแล้ว)
4. **login เฉพาะตอนซื้อ/กู้คืน** — เล่นฟรี anonymous ได้เหมือนเดิม · sync ทำงานเมื่อมี session (`SyncGate` ใน root layout → `useSync`)
5. **หน้า admin แชร์ app shell**: route group `app/(admin)/` สืบทอด root layout เดิม (ธีม/tokens) · guard ใน layout ด้วย role (non-admin → `notFound()` = 404) · แต่งตั้ง admin คนแรกด้วย `npm run db:make-admin -- email`
6. **สถาปัตย์คงกรอบ hexagonal**: DB/auth อยู่ `src/server/` + `src/adapters/` เท่านั้น · ports ใหม่ (`purchase`/`admin-purchase`/`game-state`) เป็น pure domain · adapter มี memory (contract test) + turso (จริง) · eslint gate ของ domain ขยายให้ห้าม `better-auth`/`drizzle-orm`/`@libsql/*` ด้วย

## โครงไฟล์สำคัญ

- `src/server/db/{client,schema}.ts` + `drizzle.config.ts` + `drizzle/` · `src/server/{auth,is-admin}.ts` · `app/api/auth/[...all]/route.ts`
- `app/actions/{purchase,admin,sync}.ts` (server actions, validate session ทุกตัว) · `app/(admin)/…`
- `src/domain/ports/{purchase,admin-purchase,game-state}.port.ts` · `src/domain/services/{sync,revenue}.ts`
- `src/adapters/purchases/*` (user + admin) · `src/adapters/game-state/*` · store `entitlement`(v2, approved-only) + `progress`(mergeFromServer)

## เหตุผล

- ผูกการซื้อกับ identity = กู้คืนข้ามเครื่องได้จริง · admin อนุมัติ = คุมรายได้/กันแจ้งมั่ว · merge monotonic = ไม่ต้องมี logic แก้ conflict
- คงกรอบ hexagonal เดิม → domain ยังบริสุทธิ์/ทดสอบได้, adapter สลับ memory↔turso ได้

## ผลที่ตามมา / ข้อควรระวัง

- ⚠️ **ต้องมี secrets ก่อนใช้จริง** (พี่จัดเอง): Turso URL+token, Google OAuth client (redirect `${APP_URL}/api/auth/callback/google`), `BETTER_AUTH_SECRET` — ดู `.env.example` · dev ใช้ `file:./dev.db` แทน Turso ได้
- **Auto-migrate ตอน deploy**: `vercel-build` script รัน `tsx src/server/db/migrate.ts` (programmatic migrator อ่าน `drizzle/`) ก่อน `next build` → Vercel migrate ให้อัตโนมัติทุก deploy · ข้ามถ้าไม่มี `TURSO_DATABASE_URL` (build local ปลอดภัย) · ถ้า Vercel ไม่รัน `vercel-build` ให้ตั้ง Build Command = `npm run vercel-build`
- ⚠️ **schema auth ต้องตรงกับ `@better-auth/cli generate` เป๊ะ** (timestamp_ms ไม่ใช่ timestamp) — แก้ auth options แล้ว sync `schema.ts` + gen migration ใหม่
- ⚠️ **UX แลก**: ผู้เล่นต้องรอ admin อนุมัติ ไม่ปลดทันที (โชว์ "⏳ รออนุมัติ")
- ✅ **admin path พิสูจน์ครบ end-to-end**: seed → login email/password → session role=admin → เข้า `/admin` ผ่าน (200), ไม่มี session → 404 · ⚠️ ยังไม่ได้ทดสอบ Google OAuth round-trip จริง (ต้องมี creds — เป็น path ผู้เล่นทั่วไป)
- turso adapter รัน contract ใน vitest ไม่ได้ (ไม่มี DB) → contract ทดสอบ memory adapter, turso ตรวจมือด้วย `file:./dev.db`
