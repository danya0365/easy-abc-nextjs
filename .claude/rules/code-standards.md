---
paths:
  - "app/**"
  - "src/**"
---

# Code Standards — Easy ABC (บังคับด้วย automated gate)

> โหลดตอนแตะโค้ดจริง · ปรัชญา: **กฎที่ tool บังคับแล้ว ไม่ต้องท่องจำ — รู้ว่ามี gate อะไร + รันยังไง ก็พอ**
> 🚦 **ก่อนบอกว่า "เสร็จ" ต้องผ่าน [Definition of Done](definition-of-done.md)** (อ่านทุกครั้งก่อนปิดงาน)

## Gates (ทุกตัวต้องเขียวก่อนปิดงาน)

| คำสั่ง             | gate                                            |
| ------------------ | ----------------------------------------------- |
| `npm run lint`     | ESLint flat — รวม gate ห้าม framework ใน domain |
| `npx tsc --noEmit` | typecheck (next build ไม่ lint/typecheck แทน)   |
| `npm test`         | vitest — unit (rules/promptpay) + contract test |
| `npm run build`    | build + prerender ครบทุก route                  |

## เสา 1 — Hexagonal boundaries (บังคับ: eslint no-restricted-imports)

- `src/domain/**` = **pure TS** ห้าม import next/react/zustand — ports + `Result<T>` + pure services
- ทิศ dependency: **app → adapters → domain** (ห้ามย้อน) · UI เรียก master data ผ่าน factory
  (`createLevelRepo()`/`createProductRepo()`) เท่านั้น **ห้าม import `src/data/*.master.ts` ตรง**
- error = คืน `Result<T>` (`{ok:true,value}|{ok:false,error}`) ไม่ throw ใน flow ปกติ
- adapter ใหม่ต้องผ่าน contract test เดิม (`test-contracts/*.contract.ts` — `describe.each`)
- แพทเทิร์นเต็ม: `.agents/skills/nextjs-hexagonal-repo/`

## เสา 2 — Semantic theme gen-3 (ห้าม hardcode สี)

- **ห้าม hardcode สีใน className** (`bg-[#...]`) — ใช้ token utilities เสมอ:
  `bg-background/card text-foreground/muted border-border` · brand ramp `brand-{50..900}` ·
  `text-on-brand` · `accent-{100..600}` · status `success/warning/error(+-surface)`
- **game tokens** (ประกาศต่อธีม): `tile-1..5`, `star`, `locked`, `energy`, `bg-top/bg-bottom` (`.bg-sky-scene`)
- ค่า hex อยู่ `app/styles/themes/*.css` เท่านั้น · `app/styles/theme.css` = `@theme inline` var()-only
- ทุกธีมต้องมี **light + dark block ครบ** + ตั้ง `--on-brand` เมื่อ brand-500 กลายเป็นสีอ่อนใน dark
- แพทเทิร์นเต็ม: `.agents/skills/nextjs-semantic-theme/`

## เสา 3 — Client-state conventions

- state ทั้งหมด = zustand persist ใน `src/presentation/stores/` — กติกาเกม (ดาว/unlock/energy) เป็น
  pure function ใน `src/domain/services/rules.ts` store แค่เรียกใช้
- **กัน hydration mismatch:** สุ่ม (`shuffle`/`buildTray`) เฉพาะใน effect/handler · UI ที่ต่างตาม
  persist state ให้ guard ด้วย `useMounted()` (`src/presentation/lib/use-mounted.ts`)
- ⚠️ react-hooks v6 (มากับ eslint-config-next): **ห้าม setState ตรง ๆ ใน effect body** —
  ใช้ `useSyncExternalStore` / setTimeout(0) / interval callback (ดูตัวอย่าง `spelling-round.tsx`, `energy-hud.tsx`)
- เสียงเรียกเฉพาะใน handler/effect (`src/presentation/lib/sound.ts`) — AudioContext สร้าง lazy ใน user gesture

## เสา 4 — Doc/Decision

- กฎใหม่ที่ตกลงกัน → เติมที่นี่ + memory ที่เกี่ยว · ตัดสินใจใหญ่ → ADR (`/new-adr`)
- การตัดสินใจที่ห้ามลืม (IAP auto-approve, placeholder, energy) → `.claude/memory/core/easy-abc-game-decisions.md`
