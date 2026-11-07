import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// dummy incremental cache (ค่า default) — แอปไม่มี ISR / "use cache"
// ห้ามเปิด cacheComponents, partialPrefetching, หรือ `export const instant`
export default defineCloudflareConfig();
