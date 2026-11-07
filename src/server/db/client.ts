// libSQL client + Drizzle instance — server-only
// Node (next dev / next build / tsx): file:./dev.db ผ่าน @libsql/client
// Workers: native addon `libsql` ใช้ไม่ได้ — remote Turso ต้องเป็น @libsql/client/web
// OpenNext ตั้ง useWorkerdCondition ดังนั้น import "@libsql/client" บน Worker ก็ชี้ไปที่ web
import { createClient as createNodeClient } from "@libsql/client";
import { createClient as createWebClient } from "@libsql/client/web";
import type { Client, Config } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL ?? "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

function onCloudflareWorkers(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers"
  );
}

function createLibsqlClient(): Client {
  const config: Config = authToken ? { url, authToken } : { url };
  const fileDatabase = url.startsWith("file:");

  if (!fileDatabase) {
    return createWebClient(config);
  }

  if (onCloudflareWorkers()) {
    throw new Error(
      "Cloudflare Workers ไม่เปิดฐาน file: ได้ — ตั้ง TURSO_DATABASE_URL เป็น libsql:// หรือ https://",
    );
  }

  return createNodeClient(config);
}

const client = createLibsqlClient();

export const db = drizzle(client, { schema });
export type DB = typeof db;
