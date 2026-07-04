import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Gate: domain ต้อง framework-free (hexagonal skill)
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "next",
            "next/*",
            "react",
            "react-dom",
            "zustand",
            "zustand/*",
            "better-auth",
            "better-auth/*",
            "drizzle-orm",
            "drizzle-orm/*",
            "@libsql/*",
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Skill reference files — ไม่ใช่โค้ดของแอป
    ".agents/**",
  ]),
]);

export default eslintConfig;
