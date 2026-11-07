import { execSync } from "child_process";
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const getCommitSha = () => {
  try {
    return (
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.WORKERS_CI_COMMIT_SHA ||
      execSync("git rev-parse HEAD").toString().trim()
    );
  } catch {
    return "";
  }
};

const nextConfig: NextConfig = {
  // ห้ามเปิด cacheComponents / partialPrefetching — OpenNext บน Workers พังกับชุดนี้
  // และห้ามใส่ `export const instant` ใน route
  cacheComponents: false,
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || "0.1.0",
    NEXT_PUBLIC_COMMIT_SHA: getCommitSha(),
  },
  // @libsql/client อยู่ใน default serverExternalPackages ของ Next อยู่แล้ว
  // ระบุซ้ำให้เห็นว่า Worker ต้องให้ OpenNext resolve ผ่าน workerd condition (web)
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;

// next dev เท่านั้น — ฟังก์ชันนี้ไม่ทำงานตอน next build
initOpenNextCloudflareForDev();
