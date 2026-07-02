# Monorepo Versioning — template เต็ม (pnpm + Turborepo)

สมมุติแอปที่ deploy = `apps/web` · ปรับ path ตามจริง

## 1. embed version เข้า build — `apps/web/next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version ?? "0.0.0",
    NEXT_PUBLIC_COMMIT_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_SHA ?? "dev",
  },
};

export default nextConfig;
```

> `npm_package_version` ถูก set ให้อัตโนมัติเมื่อรัน script ผ่าน pnpm **ใน package นั้น** (เช่น `cd apps/web && pnpm build`)
> ถ้า build ผ่าน turbo จาก root อาจไม่ได้ค่า → อ่านจาก `apps/web/package.json` ตรงๆ เป็น fallback:
> `import pkg from "./package.json" assert { type: "json" }` แล้วใช้ `pkg.version`

## 2. AppVersion footer — `apps/web/app/components/AppVersion.tsx`

```tsx
export function AppVersion() {
  const v = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";
  const sha = (process.env.NEXT_PUBLIC_COMMIT_SHA ?? "dev").slice(0, 7);
  return (
    <span className="text-xs text-muted">
      v{v} ({sha})
    </span>
  );
}
```
วางท้าย `layout.tsx` (footer) — แสดงทุกหน้า

## 3. release scripts — `apps/web/package.json`

```json
{
  "scripts": {
    "release:patch": "pnpm version patch -m \"chore(release): v%s\"",
    "release:minor": "pnpm version minor -m \"chore(release): v%s\"",
    "release:major": "pnpm version major -m \"chore(release): v%s\""
  }
}
```

`pnpm version <lvl>` ทำ 3 อย่างในคำสั่งเดียว: bump `version` → commit `chore(release): vX.Y.Z` → tag `vX.Y.Z`

### (ถ้าต้องการ) ดึง CHANGELOG เข้า commit เดียวกัน
เพิ่ม lifecycle hook ใน `apps/web/package.json`:
```json
{ "scripts": { "version": "git add ../../CHANGELOG.md" } }
```
⚠️ ทดสอบก่อนว่า pnpm ยิง hook `version` จริงในเครื่อง/CI ของคุณ — ถ้าไม่ยิง ให้ `git add` manual ใน flow

## 4. CHANGELOG.md (Keep a Changelog) — root ของ repo

```markdown
# Changelog

## [Unreleased]
### Added
- ...

## [1.1.0] - 2026-06-26
### Added
- ฟีเจอร์ X
```

## 5. Release flow (ทุกครั้งที่ deploy)

```bash
# 1) งานฟีเจอร์ commit เรียบร้อย + working tree สะอาด
# 2) ย้าย [Unreleased] -> หัวข้อเวอร์ชั่นใหม่ + วันที่ ใน CHANGELOG.md
# 3) bump (cd เข้าแอปก่อน!)
cd apps/web && pnpm release:minor      # 1.0.x -> 1.1.0
# 4) push พร้อม tag
git push --follow-tags
```

## Caveats (monorepo เฉพาะ)
- **cwd สำคัญ:** `pnpm version` bump package ที่ cwd อยู่ — รันที่ root จะ bump root (ผิด) → `cd apps/web` เสมอ
- **lifecycle hook:** pnpm รัน `preversion`/`version`/`postversion` ของ package นั้น (ไม่ใช่ root) — ตรวจว่ายิงจริง
- **Turborepo:** release เป็น side-effect (git commit/tag) — **อย่า** wrap ใน `turbo run` (cache + parallel ทำพัง) เรียก pnpm script ตรง
- **conventional commit:** `chore(release):` เข้ากับ commitlint conventional ที่หลายโปรเจคใช้
- ไม่ต้อง bump ทุก commit — รวมเป็นรุ่นแล้ว bump 1 ครั้ง · build ย่อยระบุด้วย commit sha ใน footer
- ถ้าจะ version หลาย package พร้อมกัน (publish libs) → พิจารณา Changesets แทน (เกินขอบเขต skill นี้)
