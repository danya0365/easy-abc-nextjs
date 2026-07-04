---
name: easy-abc-game-decisions
description: "การตัดสินใจสำคัญของเกม Easy ABC ที่ไม่อยู่ในโค้ด — IAP admin-approve (เลิก auto-approve แล้ว), login/backend, PromptPay placeholder, กติกา Energy, skills ที่ต้องยึด (อ่านก่อนแตะ shop/energy/ธีม/ด่าน/auth)"
metadata: 
  node_type: memory
  type: project
  status: active
  scope: global
  originSessionId: 20efbc22-f9c4-45aa-a7a9-7c465c848062
---

โปรเจกต์ easy-abc-nextjs คือเกมสะกดคำสำหรับเด็ก (สร้างเสร็จรอบแรก 2026-07-02) โดยใช้ภาพ `public/easy-abc/social-promote.png` เป็น requirement spec และเป้าหมายดีไซน์ UI

การตัดสินใจจากผู้ใช้ที่ต้องรักษาไว้:

- **IAP = login ก่อนซื้อ + auto-approve ทันที + admin เพิกถอนได้** (2026-07-03 ตามคำสั่งพี่ — ดู [ADR-0002](../decisions/0002-auth-and-admin-approve.md)) — กด "ชำระเงินแล้ว" ต้อง **login ก่อน** (ผูก identity) → order `approved` ทันที ปลดล็อกเลยไม่ต้องรอ · ถ้าเจอแจ้งเท็จ **admin กด "ปิดพรีเมียม" เพิกถอน** (approved→rejected) · entitlement นับเฉพาะ `approved` · `mergeOrders` = **server เป็นเจ้าของความจริง** (เพิกถอนถึง propagate ลง client) · **ไม่มี auto-verify สลิป/เงิน** — ห้ามเพิ่มเองโดยไม่ถาม
- **PromptPay ID ใน `src/data/products.master.ts`** พี่เปลี่ยนเป็นของจริงแล้ว (`1960500086397`) · ราคายังเป็น placeholder ปรับได้
- **สิทธิ์การซื้อ = server (Turso) ผูก userId** แล้ว (กู้คืนข้ามเครื่องได้) · ปลดด่าน/โหมด/energy ฝั่ง client ยัง fakeable ได้ (พี่บอก "ไม่ซีเรียสความปลอดภัย") · admin guard = role ใน better-auth (server-side จริง)
- Energy: max 10, regen 1/5นาที, เล่นซ้ำด่านที่ผ่านแล้วฟรี, 3 ดาวครั้งแรก +1, daily gift เต็มหลอด, Bundle = ∞ — ออกแบบให้ "ไม่เครียด ไม่ใช่เกมบังคับเติม" (แรงบันดาลใจ Candy Crush)
- รูปคำศัพท์จริงยังไม่มี — ผู้ใช้จะเตรียมไฟล์มาวางที่ `public/easy-abc/words/<word>.png` เอง ระหว่างนี้ fallback เป็น emoji
- โปรเจกต์ต้องยึด skills ใน `.agents/skills/`: hexagonal repo (domain ห้าม import framework — มี eslint gate), semantic theme gen-3 (ห้าม hardcode สีใน className), versioning (bump ตอนออกรุ่นเท่านั้น ผ่าน `npm run release:*`)
- ธีม candy/space ปลดล็อกด้วย Bundle · ThemeSwitcher อยู่หน้า /settings เท่านั้น (ของสำรอง) · ธีม sky ต้องคงลุคตามภาพโปรโมต

Gotcha เทคนิค: eslint-config-next ใช้ react-hooks v6 ที่ห้าม setState ตรง ๆ ใน effect body — แพทเทิร์นที่ใช้แก้: `useSyncExternalStore` ใน `src/presentation/lib/use-mounted.ts`, setTimeout(0)/interval callback สำหรับ state ที่ต้องตั้งหลัง mount (ดู `spelling-round.tsx`, `energy-hud.tsx`)
