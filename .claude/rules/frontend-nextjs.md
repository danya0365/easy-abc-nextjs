---
paths:
  - "app/**"
  - "src/presentation/**"
---

# Frontend Rules — Next.js (Easy ABC)

> โหลดตอนแตะ UI · มาตรฐาน CSS/token/test ดู [code-standards](code-standards.md)

## ⚠️ Next.js 16 — อ่านก่อนเขียน

- **เวอร์ชันนี้มี breaking changes จากที่คุ้นเคย** — อ่าน guide ใน `node_modules/next/dist/docs/`
  ก่อนเขียนโค้ด Next เสมอ อย่าเดาจากความจำ (กฎนี้มาจาก `AGENTS.md`)
- `params`/`searchParams` เป็น **Promise** ต้อง `await` (ดู `app/(game)/play/[level]/page.tsx`)
- `useRouter` มาจาก `next/navigation` (ไม่ใช่ `next/router`) · ไม่มี `next lint` แล้ว (ใช้ `npm run lint`)
- Turbopack เป็น default · แก้หน้าใหม่แล้ว type เพี้ยน → `rm -rf .next && npx next typegen`

## Route groups (ตกลงแล้ว — ห้ามย้ายหน้าออกนอก group โดยไม่คุยก่อน)

- `app/(main)/` = มี **TabBar 4 แท็บ** (`src/presentation/components/tab-bar.tsx`):
  🏠 `/` · 🎮 `/modes` (+`/levels`) · 🛒 `/shop` · ⚙️ `/settings` (+`/how-to-play`)
  — layout ใส่ `pb-24` กัน TabBar ทับเนื้อหา
- `app/(game)/` = **full screen ไม่มี TabBar**: `/play/[level]` + `/time-attack` `/listen` `/endless` `/quiz`
  — ปุ่ม ⏸ เปิด PauseMenu (ห้ามให้เด็กหลุดกลางด่านโดยไม่ตั้งใจ)
- หน้า page.tsx = server component (metadata + โหลด data ผ่าน repo factory) → render client component

## โครงหน้าเกม (reuse ก่อนสร้างใหม่)

- **engine กลาง = `game/spelling-round.tsx`** (สะกด 1 คำ: tray/slots/ถูก-ผิด/เสียง) — โหมดใหม่ให้ห่อ
  engine นี้ ไม่เขียน logic สะกดซ้ำ · ตรวจถูก/ผิดเทียบ**ตัวอักษร** ไม่ใช่ tile id (รองรับ EGG/BEE)
- โหมดพรีเมียม: `ModeGate` (เช็ค entitlement) + `ModeStart` (หัก ⚡ ใน handler) + `RoundResult`
- ด่านผจญภัย: `PlayGate` (เช็คปลดล็อกจาก zustand — เข้า URL ตรงได้แต่เล่นไม่ได้ถ้ายังล็อก)
- รูปคำ: `WordImage` — `<img>` + onError → emoji fallback · **ผู้เรียกต้องใส่ `key={entry.word}`**

## Zustand stores (`src/presentation/stores/` — persist ทุกตัว)

`progress` (ดาว best-of) · `entitlement` (orders/hasMode — auto-approve by design ห้ามแก้เอง) ·
`energy` (sync/spend/gain — กติกาอยู่ domain) · `stats` (best scores) · `settings` (sfx/speech แยกกัน) ·
`theme` (key `"theme-storage"` ต้องตรงกับ ThemeScript ใน layout)

## UX เด็ก (เลนส์หลักของ Alphie)

- touch target ≥56px · ตัวหนังสือใหญ่ · feedback ทันทีทุกแตะ (เสียง+animation)
- ผิดแล้ว**ปลอบ** ("ลองใหม่นะ 💪") ไม่ลงโทษ · energy หมด = modal ปลอบใจ+countdown ไม่ใช่กำแพงจ่ายเงิน
- ธีม sky (default) ต้องคงลุคภาพ `public/easy-abc/social-promote.png`
