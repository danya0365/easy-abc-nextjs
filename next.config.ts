import { execSync } from "child_process";
import type { NextConfig } from "next";

const getCommitSha = () => {
  try {
    return (
      process.env.WORKERS_CI_COMMIT_SHA ||
      execSync("git rev-parse HEAD").toString().trim()
    );
  } catch {
    return "";
  }
};

const nextConfig: NextConfig = {
  // ห้ามเปิด cacheComponents / partialPrefetching / `export const instant` — ค้างบน workerd
  cacheComponents: false,
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || "0.1.0",
    NEXT_PUBLIC_COMMIT_SHA: getCommitSha(),
  },
};

export default nextConfig;
