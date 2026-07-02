---
name: project-overview
description: Easy ABC คืออะไร, stack, สถาปัตยกรรม, จุดสำคัญของ repo (อ่านก่อนเริ่มงานทุกครั้ง หรือเมื่อสงสัยว่าอะไรอยู่ตรงไหน)
metadata:
  type: project
  status: active
  scope: global
---

# Easy ABC — Project Overview

**เกมสะกดคำภาษาอังกฤษสำหรับเด็ก** (UI ไทย) เล่นบนเว็บ ไม่ต้องดาวน์โหลด — build แรกเสร็จ 2026-07-02
**Requirement spec + เป้าหมายดีไซน์ = ภาพ `public/easy-abc/social-promote.png`** (ธีม sky ต้องคงลุคตามภาพนี้)

## Stack

Next.js 16.2.10 (App Router, Turbopack) · React 19 · Tailwind v4 (CSS-first `@theme`) ·
zustand 5 (persist ทุก store) · vitest · qrcode.react · ไม่มี DB/backend — ทุกอย่าง client-side + static data

## สถาปัตยกรรม (hexagonal — ดู `.claude/rules/code-standards.md`)

- `src/domain/` — pure TS ห้าม import framework (eslint gate บังคับ): ports, `Result<T>`, `services/rules.ts` (ดาว/unlock/energy), `services/promptpay.ts` (EMVCo payload + CRC16)
- `src/adapters/` — static adapters อ่าน master data (แทน DB, สลับ adapter จริงได้ภายหลัง)
- `src/data/` — master data: `levels.master.ts` (5 ด่าน × 5 คำ), `products.master.ts` (สินค้า IAP + PromptPay ID ⚠️ placeholder)
- `src/presentation/` — stores (progress/entitlement/energy/stats/settings/theme), lib (sound/shuffle/use-mounted), components (game engine = `game/spelling-round.tsx`)
- `app/(main)/` — มี TabBar 4 แท็บ: 🏠 `/` · 🎮 `/modes`+`/levels` · 🛒 `/shop` · ⚙️ `/settings`+`/how-to-play`
- `app/(game)/` — full screen: `/play/[level]` (ผจญภัย) + `/time-attack` `/listen` `/endless` `/quiz` (พรีเมียม)
- `app/styles/` — ระบบธีม gen-3: `index.css` → `theme.css` (var-only map) → `themes/{sky,candy,space}.css` (light+dark ครบ)

## ระบบเกม (สรุป — รายละเอียดใน [[easy-abc-game-decisions]])

- ผจญภัย 5 ด่าน ปลดตามดาว (best-of) · โหมดพรีเมียม 4 โหมดขายโหมดละ 19฿ + Bundle 49฿ (ทุกโหมด+ธีม candy/space+⚡∞)
- Energy ⚡10 regen 5 นาที เล่นซ้ำด่านผ่านแล้วฟรี — ออกแบบให้ไม่กดดัน
- IAP ผ่าน PromptPay QR **auto-approve by design** (ไม่มี verification — ผู้ใช้ยอมรับ)
- รูปคำศัพท์: fallback emoji จนกว่าพี่วางไฟล์จริงที่ `public/easy-abc/words/<word>.png`

## จุดสำคัญอื่น

- **Skills ที่ต้องยึด** อยู่ใน `.agents/skills/` (hexagonal-repo, semantic-theme, versioning) — อ่านก่อนแตะส่วนที่เกี่ยว
- **Next.js 16 มี breaking changes** — อ่าน `node_modules/next/dist/docs/` ก่อนเขียนโค้ด Next (จาก `AGENTS.md`)
- Versioning: เลขจาก `package.json` ที่เดียว → footer `vX.Y.Z (sha)` · bump ตอนออกรุ่นด้วย `npm run release:*` + อัปเดต `CHANGELOG.md`
- Gates: `npm run lint` + `npx tsc --noEmit` + `npm test` + `npm run build` — ดู `.claude/rules/definition-of-done.md`
