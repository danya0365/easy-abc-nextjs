---
name: log-2026-07-easy-abc-v0-1
description: สถานะ build แรกของ Easy ABC (v0.1.0) + งานค้างที่ต้องทำต่อ (อ่านตอน resume งาน)
metadata:
  type: log
  status: active
  scope: global
---

# 2026-07 — Easy ABC v0.1 build แรกเสร็จ ✅

**อัปเดต 2026-07-03 (backend ตัวแรก):** เพิ่ม **login Google (better-auth) + Turso/Drizzle + กู้คืนการซื้อ + cloud save ดาว + หน้า admin/dashboard รายได้** · **เปลี่ยน IAP จาก auto-approve → admin อนุมัติ** (order pending → admin approve ถึงปลดล็อก) — รายละเอียด+ข้อควรระวังทั้งหมดใน [ADR-0002](../decisions/0002-auth-and-admin-approve.md). ทำครบ 4 เฟส, gates เขียว (lint/tsc/vitest 48/build 42 หน้า), verify DB จริงบน `file:./dev.db` + guard 404. **ยังไม่ verify Google OAuth round-trip จริง** (ต้องมี creds — พี่จัด) · **ก่อน prod ต้องตั้ง env**: TURSO_*, GOOGLE_CLIENT_*, BETTER_AUTH_SECRET (ดู `.env.example`) + ตั้ง admin คนแรก `npm run db:make-admin -- email`

**อัปเดต 2026-07-03:** เพิ่มโหมดผจญภัย "เติมตัวอักษร" 3 เกมฟรี (fill-front/back/middle — กติกา mask อยู่ `src/domain/services/mask.ts` จุดเดียว, ดาวแยก track ต่อเกมใน progress store **v2 + migrate**, routes `/levels/[game]` + `/play/[game]/[level]`) · งาน **PWA ถูกยกเลิก** (แผนเคยออกแบบไว้: เขียน sw.js เองเพราะ Serwist ต้อง webpack/ชน Turbopack — ถ้ากลับมาทำดูแผนเก่าใน git history ได้) · PromptPay ID ใน products.master.ts พี่เปลี่ยนเป็นของจริงแล้ว

**สถานะ (2026-07-02):** เกมครบทุกส่วนตามแผน commit `cfa1ae0` (83 ไฟล์) —
ผจญภัย 5 ด่าน + โหมดพรีเมียม 4 โหมด + Energy + ร้านค้า PromptPay + ธีม 3 ตัว (light+dark) + TabBar/route groups
Gates เขียวหมด: eslint + tsc + vitest 21/21 + `npm run build` (prerender 18 หน้า) · ทุก route ตอบถูก (200/404)

## งานค้าง (ทำก่อน production)

1. **เปลี่ยน placeholder** ใน `src/data/products.master.ts`: PromptPay ID `0812345678` + ราคา
2. **วางรูปคำศัพท์จริง** 25 ไฟล์ที่ `public/easy-abc/words/<word>.png` (ตอนนี้ fallback emoji)
3. Verify บนอุปกรณ์จริง: เสียง TTS บน iOS (ต้องมี user gesture), สแกน QR ด้วยแอปธนาคารเช็คยอด, dark mode ตรวจตา
4. ตอนออกรุ่นแรก: ย้าย CHANGELOG `[Unreleased]` → เวอร์ชัน + `npm run release:minor` + `git push --follow-tags`

## Gotchas ตอนทำต่อ

- react-hooks v6 ห้าม setState ตรง ๆ ใน effect body — ดูแพทเทิร์นใน [[easy-abc-game-decisions]]
- สุ่ม (shuffle/tray/choices) ต้องเกิดใน effect/handler เท่านั้น กัน hydration mismatch
- แก้ metadata/หน้าใหม่แล้ว `.next/types` เพี้ยน → `rm -rf .next && npx next typegen`
