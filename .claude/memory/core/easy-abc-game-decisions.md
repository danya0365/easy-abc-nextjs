---
name: easy-abc-game-decisions
description: การตัดสินใจสำคัญของเกม Easy ABC ที่ไม่อยู่ในโค้ด — IAP auto-approve by design, PromptPay placeholder, กติกา Energy, skills ที่ต้องยึด (อ่านก่อนแตะ shop/energy/ธีม/ด่าน)
metadata:
  type: project
  status: active
  scope: global
---

โปรเจกต์ easy-abc-nextjs คือเกมสะกดคำสำหรับเด็ก (สร้างเสร็จรอบแรก 2026-07-02) โดยใช้ภาพ `public/easy-abc/social-promote.png` เป็น requirement spec และเป้าหมายดีไซน์ UI

การตัดสินใจจากผู้ใช้ที่ต้องรักษาไว้:

- **IAP auto-approve โดยตั้งใจ** — กด "ชำระเงินแล้ว" = อนุมัติทันที ไม่ตรวจ slip/backend ผู้ใช้ยอมรับความเสี่ยง จะทำ verification ทีหลัง ห้าม "แก้ให้ปลอดภัย" เองโดยไม่ถาม
- **PromptPay ID `0812345678` + ราคาทั้งหมดใน `src/data/products.master.ts` เป็น placeholder** — ต้องเปลี่ยนก่อนขึ้น production จริง
- การเช็คสิทธิ์ทั้งหมด (ปลดด่าน/โหมด/energy) เป็น client-side zustand เท่านั้น — ผู้ใช้บอกชัดว่า "ไม่ซีเรียสความปลอดภัย"
- Energy: max 10, regen 1/5นาที, เล่นซ้ำด่านที่ผ่านแล้วฟรี, 3 ดาวครั้งแรก +1, daily gift เต็มหลอด, Bundle = ∞ — ออกแบบให้ "ไม่เครียด ไม่ใช่เกมบังคับเติม" (แรงบันดาลใจ Candy Crush)
- รูปคำศัพท์จริงยังไม่มี — ผู้ใช้จะเตรียมไฟล์มาวางที่ `public/easy-abc/words/<word>.png` เอง ระหว่างนี้ fallback เป็น emoji
- โปรเจกต์ต้องยึด skills ใน `.agents/skills/`: hexagonal repo (domain ห้าม import framework — มี eslint gate), semantic theme gen-3 (ห้าม hardcode สีใน className), versioning (bump ตอนออกรุ่นเท่านั้น ผ่าน `npm run release:*`)
- ธีม candy/space ปลดล็อกด้วย Bundle · ThemeSwitcher อยู่หน้า /settings เท่านั้น (ของสำรอง) · ธีม sky ต้องคงลุคตามภาพโปรโมต

Gotcha เทคนิค: eslint-config-next ใช้ react-hooks v6 ที่ห้าม setState ตรง ๆ ใน effect body — แพทเทิร์นที่ใช้แก้: `useSyncExternalStore` ใน `src/presentation/lib/use-mounted.ts`, setTimeout(0)/interval callback สำหรับ state ที่ต้องตั้งหลัง mount (ดู `spelling-round.tsx`, `energy-hud.tsx`)
