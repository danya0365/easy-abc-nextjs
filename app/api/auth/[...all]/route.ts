// better-auth route handler — จับทุก /api/auth/* (login, callback, session, sign-out)
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/src/server/auth";

export const { GET, POST } = toNextJsHandler(auth);
