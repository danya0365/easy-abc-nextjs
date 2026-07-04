// libSQL client + Drizzle instance — server-only
// dev: fallback เป็นไฟล์ ./dev.db (ไม่ต้องมี Turso cloud) · prod: ตั้ง env TURSO_*
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL ?? "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient(authToken ? { url, authToken } : { url });

export const db = drizzle(client, { schema });
export type DB = typeof db;
