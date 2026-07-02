---
name: nextjs-monorepo-versioning
description: >
  ระบบ versioning แบบ feature-based SemVer สำหรับ monorepo (pnpm + Turborepo). version แหล่งเดียว =
  package.json ของ "แอปที่ deploy" ไหลเข้า footer พร้อม commit sha ผ่าน build env. ใช้เมื่อตั้ง/ออกรุ่น,
  ทำ footer เวอร์ชั่น, ตัดสิน PATCH/MINOR/MAJOR, หรือ tag release ใน workspace. เป็นฉบับ monorepo ของ
  nextjs-versioning (ที่คิดสำหรับ single-app + npm) — ปรับ pnpm + Turborepo + เลือก canonical package
version: "1.0"
metadata:
  author: dan
  stack: next.js, pnpm, turborepo, git
  pattern: feature-semver, monorepo-release
---

# Monorepo Versioning (feature-based SemVer + pnpm/Turborepo)

> **ต่างจาก `nextjs-versioning`:** อันนั้นคิดสำหรับ single Next.js app + `npm version` · อันนี้สำหรับ
> **monorepo (pnpm + Turborepo)** — version อยู่ที่ package ที่ deploy, ระวัง `pnpm version` cwd + lifecycle hook + turbo

## หลักคิด
- **version แหล่งเดียว = `package.json` ของแอปที่ deploy** (เช่น `apps/web`) · root `package.json` เป็น
  private orchestrator ไม่ใช่ version จริง · package ลูกอื่น (ui/sdk/…) ไม่ต้อง version แยก (เว้นจะ publish เป็น lib)
- ฝัง version + commit sha เข้า build → footer `vX.Y.Z (sha)` — **ไม่ต้องแก้เลขที่ไฟล์อื่น**
- bump ตอน **"ออกรุ่น"** ไม่ใช่ทุก commit (build ย่อยระบุด้วย sha)

## เกณฑ์ขยับเลข
| หลัก | ขยับเมื่อ | ตัวอย่าง |
| --- | --- | --- |
| **PATCH** `1.0.x` | แก้บั๊ก/security/UX/style/perf — ไม่มีฟีเจอร์ใหม่ | แก้ปุ่มกดไม่ติด, ปรับสี |
| **MINOR** `1.x.0` | ฟีเจอร์ใหม่ที่ผู้ใช้สังเกตได้ (backward-compatible) | เพิ่มหน้า/ระบบใหม่ |
| **MAJOR** `x.0.0` | เปลี่ยนใหญ่กระทบ workflow / redesign / breaking | รื้อ UI/โมเดลใหม่ |

หลักสั้น: ของใหม่ให้ผู้ใช้? → MINOR · ทำของเดิมดีขึ้น/หายพัง? → PATCH · ต้องปรับตัว? → MAJOR
(`0.x` = ก่อน production จริง)

## Setup (ครั้งเดียว)
1. **embed version เข้า build** — `apps/web/next.config.ts` ใส่ `env.NEXT_PUBLIC_APP_VERSION` จาก
   `process.env.npm_package_version` + `NEXT_PUBLIC_COMMIT_SHA` จาก git/CI
2. **AppVersion footer** — component อ่าน 2 env → `vX.Y.Z (sha สั้น)` วางท้าย layout
3. **release scripts** ใน **`apps/web/package.json`** (⚠️ pnpm ไม่ใช่ npm):
   `release:patch|minor|major` = `pnpm version <lvl> -m "chore(release): v%s"`
4. **CHANGELOG.md** (Keep a Changelog + `[Unreleased]`)

> โค้ด template เต็ม (next.config, footer, scripts, CHANGELOG, caveats): [`references/MONOREPO_VERSIONING.md`](./references/MONOREPO_VERSIONING.md)

## Release (ทุกครั้งที่ deploy)
1. commit งานฟีเจอร์ให้ working tree สะอาด
2. ย้าย `[Unreleased]` → หัวข้อเวอร์ชั่นใหม่ + วันที่ ใน CHANGELOG
3. `cd apps/web && pnpm release:minor` (หรือ patch/major) → bump + commit + tag ในคำสั่งเดียว
4. `git push --follow-tags` → build prod ฝังเลขใหม่ลง footer เอง

## ⚠️ Monorepo gotchas (จุดต่างที่ทำให้พลาด)
- **pnpm ≠ npm:** `pnpm version` ทำงานบน package ที่ cwd อยู่ → **ต้อง `cd` เข้าแอปก่อน** (ไม่งั้นโดน root)
- **lifecycle hook:** ตรวจว่า `version`/`postversion` hook ของ package นั้นยิงจริง ถ้าจะ `git add CHANGELOG.md` อัตโนมัติ
- **Turborepo:** อย่าใส่ release ใน `turbo run` (มี side-effect git/tag) — เรียก pnpm script ตรงในแอป
- working tree ต้องสะอาดก่อน bump (`pnpm version` error ถ้ามีไฟล์ค้าง)
- ถ้า CI ใช้ conventional-commit lint อยู่แล้ว → `chore(release):` ผ่านพอดี

## เมื่อไหร่ใช้ skill นี้
- ตั้งระบบ version/footer ใน monorepo ครั้งแรก · จะออกรุ่น/tag · ถาม "ควรเป็นเวอร์ชั่นเท่าไหร่"
- user พูดถึง "version/release/changelog/bump/tag" ในโปรเจคที่เป็น pnpm/Turborepo workspace
