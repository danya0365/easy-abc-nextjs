# Hexagonal Data-Access — โค้ด template เต็ม

ตัวอย่าง entity = `posts` · ปรับชื่อตาม entity จริง · path เป็น convention แนะนำ (ปรับได้)

## 1. Result type — `src/domain/shared/result.ts`

```ts
export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export function isOk<T, E>(r: Result<T, E>): r is { ok: true; value: T } {
  return r.ok;
}
```

## 2. Port (interface) — `src/domain/ports/post.port.ts`

```ts
// framework-free — ห้าม import @supabase/* / next / react
import type { Result } from "../shared/result";

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
}

/** Port — domain พึ่ง interface นี้ ไม่รู้จัก Supabase */
export interface PostRepository {
  getAll(): Promise<Result<Post[]>>;
  getById(id: string): Promise<Result<Post>>;
  create(input: { title: string; content: string }): Promise<Result<Post>>;
}

/** เมธอดเฉพาะ admin (RLS bypass → ต้องระบุ scope เอง) */
export interface AdminPostRepository extends PostRepository {
  getByUser(userId: string): Promise<Result<Post[]>>;
  deleteAny(id: string): Promise<Result<void>>;
}
```

## 3. Base adapter (logic ร่วม) — `src/adapters/posts/base.adapter.ts`

```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import { ok, err, type Result } from "@/domain/shared/result";
import type { Post, PostRepository } from "@/domain/ports/post.port";

const mapRow = (r: Record<string, unknown>): Post => ({
  id: r.id as string,
  authorId: r.author_id as string,
  title: r.title as string,
  content: r.content as string,
  createdAt: r.created_at as string,
});

export abstract class BasePostAdapter implements PostRepository {
  constructor(protected client: SupabaseClient) {}

  async getAll(): Promise<Result<Post[]>> {
    const { data, error } = await this.client
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return err(error.message);
    return ok(data.map(mapRow));
  }

  async getById(id: string): Promise<Result<Post>> {
    const { data, error } = await this.client.from("posts").select("*").eq("id", id).single();
    if (error) return err(error.message);
    return ok(mapRow(data));
  }

  abstract create(input: { title: string; content: string }): Promise<Result<Post>>;
}
```

## 4. User adapter (RLS) — `src/adapters/posts/user.adapter.ts`

```ts
import { ok, err, type Result } from "@/domain/shared/result";
import type { Post } from "@/domain/ports/post.port";
import { BasePostAdapter } from "./base.adapter";

export class UserPostAdapter extends BasePostAdapter {
  // ไม่รับ userId — RLS + JWT จัดการ "ตัวเอง" → กัน IDOR
  async create(input: { title: string; content: string }): Promise<Result<Post>> {
    const { data, error } = await this.client.from("posts").insert(input).select().single();
    if (error) return err(error.message);
    return ok(/* mapRow */ data as unknown as Post);
  }
}
```

## 5. Admin adapter (service-role) — `src/adapters/posts/admin.adapter.ts`

```ts
import { ok, err, type Result } from "@/domain/shared/result";
import type { AdminPostRepository, Post } from "@/domain/ports/post.port";
import { BasePostAdapter } from "./base.adapter";

// ⚠️ server-only — ห้าม import ในไฟล์ที่มี "use client"
export class AdminPostAdapter extends BasePostAdapter implements AdminPostRepository {
  async create(input: { title: string; content: string }): Promise<Result<Post>> {
    const { data, error } = await this.client.from("posts").insert(input).select().single();
    if (error) return err(error.message);
    return ok(data as unknown as Post);
  }
  // RLS bypass → ต้องรับ userId ชัดเจน
  async getByUser(userId: string): Promise<Result<Post[]>> {
    const { data, error } = await this.client.from("posts").select("*").eq("author_id", userId);
    if (error) return err(error.message);
    return ok(data as unknown as Post[]);
  }
  async deleteAny(id: string): Promise<Result<void>> {
    const { error } = await this.client.from("posts").delete().eq("id", id);
    if (error) return err(error.message);
    return ok(undefined);
  }
}
```

## 6. Factory + DI — `src/adapters/posts/index.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { UserPostAdapter } from "./user.adapter";
import { AdminPostAdapter } from "./admin.adapter";

// User: ใช้ใน Server Component / Server Action ที่มี cookie
export async function createUserPostRepo() {
  const store = await cookies();
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => store.getAll() } },
  );
  return new UserPostAdapter(client);
}

// Admin: server-only (service-role key)
export function createAdminPostRepo() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  return new AdminPostAdapter(client);
}
```

## 7. Contract test — `test-contracts/post.contract.ts`

```ts
import { describe, it, expect } from "vitest";
import type { PostRepository } from "@/domain/ports/post.port";

// suite เดียว — รันกับทุก adapter (memory + real)
export function runPostContract(name: string, makeRepo: () => Promise<PostRepository>) {
  describe(`PostRepository contract: ${name}`, () => {
    it("create → getById คืน Result.ok ค่าตรง", async () => {
      const repo = await makeRepo();
      const created = await repo.create({ title: "t", content: "c" });
      expect(created.ok).toBe(true);
      if (created.ok) {
        const got = await repo.getById(created.value.id);
        expect(got.ok && got.value.title).toBe("t");
      }
    });

    it("getById ไม่เจอ → Result.err (ไม่ throw)", async () => {
      const repo = await makeRepo();
      const got = await repo.getById("does-not-exist");
      expect(got.ok).toBe(false);
    });
  });
}
```

```ts
// posts.test.ts — เสียบทุก adapter เข้า suite เดียว
import { runPostContract } from "./post.contract";
import { MemoryPostAdapter } from "@/adapters/posts/memory.adapter";

runPostContract("memory", async () => new MemoryPostAdapter());
// runPostContract("supabase", async () => createUserPostRepo());  // ต้องมี env + DB จริง
```

## Enforcement (gate — เลือกตามโปรเจค)

`.dependency-cruiser.cjs`:
```js
{ name: "domain-pure", severity: "error",
  from: { path: "^src/domain" },
  to: { path: "node_modules/(react|next|@supabase)" } }
```

หรือ eslint flat:
```js
{ files: ["src/domain/**/*.ts"],
  rules: { "no-restricted-imports": ["error", { patterns: ["@supabase/*","next","next/*","react"] }] } }
```
