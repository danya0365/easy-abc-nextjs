"use client";

// better-auth client — infer baseURL จาก window.location (dev+prod ใช้ได้เลย)
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [adminClient()],
});

export const { signIn, signOut, useSession } = authClient;
