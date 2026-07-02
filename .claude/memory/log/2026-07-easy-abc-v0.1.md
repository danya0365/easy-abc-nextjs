---
name: log-2026-07-easy-abc-v0-1
description: สถานะ build แรกของ Easy ABC (v0.1.0) + งานค้างที่ต้องทำต่อ (อ่านตอน resume งาน)
metadata:
  type: log
  status: active
  scope: global
---

# 2026-07 — Easy ABC v0.1 build แรกเสร็จ ✅

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
