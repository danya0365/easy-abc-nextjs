---
name: nextjs-hexagonal-repo
description: >
  Data-access แบบ hexagonal (ports & adapters) + Result<T> (ไม่ throw) + role-split
  (User RLS / Admin service-role) + contract test (describe.each). ใช้เมื่อต้องการชั้นเข้าถึงข้อมูล
  ที่ domain pure (เทสได้เต็ม), สลับ in-memory/Supabase ได้, แยก auth vs admin, หรือ harden RLS.
  เป็นวิวัฒนาการ testability-first ของ supabase-repo-pattern — repo ไม่ผูก page, คืน Result, ฉีดผ่าน DI
version: "1.0"
metadata:
  author: dan
  stack: next.js, supabase, typescript
  pattern: ports-adapters, role-split, result-type, contract-test
---

# Hexagonal Data-Access (ports + adapters + Result + role-split)

> **ต่างจาก `nextjs-supabase-repo-pattern`:** อันนั้น repo `throw` + ใช้ใน page ตรง · อันนี้ domain pure
> ผ่าน **port** + คืน **`Result<T>`** + ฉีดผ่าน DI + มี **contract test** → เทสได้เต็ม สลับ adapter ได้
> **ต่างจาก `nextjs-clean-arch-drizzle`:** อันนั้น Drizzle/Turso + use-case + DI container เต็มสูบ ·
> อันนี้โฟกัส **data-access layer** (port + 2 adapter role-split) เสียบเข้าโครงไหนก็ได้

## Core concept — แยก 3 เรื่องออกจากกัน

1. **Port (interface) อยู่ใน domain** — framework-free (ไม่ import supabase/react/next)
2. **Adapter implement port** — Supabase อยู่ในนี้เท่านั้น · role-split = 2 adapter ของ port เดียว
3. **คืน `Result<T>` ไม่ throw** — error เป็นค่า ไม่ใช่ exception (เทส/handle ง่าย)

```
src/domain/ports/<entity>.port.ts      interface (framework-free)
src/domain/shared/result.ts            Result<T> = {ok,value} | {ok,error} + ok()/err()
src/adapters/<entity>/
  user.adapter.ts                       auth client (anon+cookie) — RLS active
  admin.adapter.ts                      service-role client — RLS bypass (server-only)
  memory.adapter.ts                     in-memory (เทส/dev)
  index.ts                              factory + DI wiring
test-contracts/<entity>.contract.ts    describe.each → รัน suite เดียวกับทุก adapter
```

## กฎเหล็ก

1. **domain ห้าม import framework** — port เป็น interface เปล่า · บังคับด้วย dependency-cruiser หรือ
   eslint `no-restricted-imports` (ban `@supabase/*`, `next`, `react` ใน `src/domain/**`)
2. **ทิศ dependency:** `app → adapter → domain` (ห้ามย้อน) · page/server-action เรียก **port** ไม่ใช่ supabase client ตรง
3. **คืน `Result<T>`** — แปลง `{ data, error }` ของ Supabase → `ok/err` ที่ขอบ adapter (อย่าให้ error รั่วขึ้น domain)
   ```ts
   const { data, error } = await client.from("posts").select("*").eq("id", id).single();
   if (error) return err(error.message);
   return ok(mapRow(data));
   ```
4. **role-split** (ดูตาราง) — User adapter "รู้จักตัวเอง" ผ่าน JWT (ไม่รับ userId) · Admin รับ scope ชัด
5. **contract test** — adapter ทุกตัวผ่าน suite เดียวกัน (`describe.each([memory, real])`) → in-memory เร็ว + real ของจริงผ่านเหมือนกัน
6. **1 adapter = 1 entity/port** · logic ที่ user+admin ใช้ร่วม → abstract base (read-only เป็นหลัก)

## Role split (หัวใจ — security)

| | **User adapter** | **Admin adapter** |
| --- | --- | --- |
| client | `createServerClient` (anon + cookie/JWT) | `createClient` (service-role key) |
| RLS | **active** — รู้ "ตัวเอง" ผ่าน JWT | **bypass** |
| "self" method | **ห้ามรับ `userId`** (RLS จัดการ → กัน IDOR) | **ต้องรับ `userId`/scope ชัด** |
| ใช้ที่ไหน | server component / action ที่มี cookie | server-only (cron/webhook/admin) |
| key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `SUPABASE_SERVICE_ROLE_KEY` (**ห้าม**เข้า client bundle) |

> โค้ด template เต็ม (port, Result, user/admin/memory adapter, factory, contract test):
> [`references/HEXAGONAL_PATTERN.md`](./references/HEXAGONAL_PATTERN.md)

## เมื่อไหร่ใช้ skill นี้
- เพิ่ม entity/data-access ใหม่ที่อยากเทสเต็ม + สลับ backend ได้
- harden RLS / แยก auth vs admin / กัน service-role key รั่ว
- user พูดถึง "port/adapter/hexagonal/Result/contract test/role-split/auth vs admin"

## Checklist
- [ ] port อยู่ใน domain (interface เปล่า, ไม่ import framework — มี gate บังคับ)
- [ ] adapter คืน `Result<T>` (แปลง error ที่ขอบ ไม่ throw)
- [ ] role-split: User (ไม่รับ userId, RLS) / Admin (รับ userId, service-role server-only)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ไม่หลุดเข้า client
- [ ] contract test ผ่านทั้ง memory + real adapter
- [ ] app เรียกผ่าน port (ไม่มี supabase client ใน page/component ตรง)
