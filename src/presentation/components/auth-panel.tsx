"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "@/src/presentation/lib/auth-client";
import { ChunkyButton } from "./chunky-button";

// แผงบัญชี — login Google, แสดงชื่อ/อีเมล, ออกจากระบบ
// (ปุ่ม "กู้คืนการซื้อ" + ลิงก์ admin จะเพิ่มในเฟสถัดไป)
export function AuthPanel() {
  const { data: session, isPending } = useSession();
  const [busy, setBusy] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  if (isPending) {
    return <p className="text-sm text-muted">กำลังโหลด…</p>;
  }

  if (!session) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">
          เข้าสู่ระบบเพื่อเก็บการซื้อและความคืบหน้าไว้กับบัญชี — เปลี่ยนเครื่องก็ไม่หาย
        </p>
        <ChunkyButton
          variant="white"
          size="sm"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await signIn.social({ provider: "google", callbackURL: "/settings" });
          }}
        >
          {busy ? "กำลังพาไป Google…" : "เข้าสู่ระบบด้วย Google"}
        </ChunkyButton>

        {showEmail ? (
          <form
            className="mt-1 flex flex-col gap-2 rounded-2xl bg-muted-surface p-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setLoginError(null);
              const res = await signIn.email({
                email: emailInput,
                password: passwordInput,
              });
              setBusy(false);
              if (res.error)
                setLoginError(res.error.message ?? "เข้าสู่ระบบไม่สำเร็จ");
            }}
          >
            <p className="text-xs text-muted">สำหรับผู้ดูแล (เข้าด้วยอีเมล)</p>
            <input
              type="email"
              required
              placeholder="อีเมล"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="rounded-xl border-2 border-border bg-card px-3 py-2 text-sm text-card-foreground"
            />
            <input
              type="password"
              required
              placeholder="รหัสผ่าน"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="rounded-xl border-2 border-border bg-card px-3 py-2 text-sm text-card-foreground"
            />
            {loginError && (
              <p className="text-xs font-bold text-error">{loginError}</p>
            )}
            <ChunkyButton type="submit" variant="primary" size="sm" disabled={busy}>
              {busy ? "กำลังเข้า…" : "เข้าสู่ระบบ"}
            </ChunkyButton>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowEmail(true)}
            className="text-center text-xs text-muted underline"
          >
            ผู้ดูแล: เข้าสู่ระบบด้วยอีเมล
          </button>
        )}
      </div>
    );
  }

  const { name, email, image } = session.user;
  const role = (session.user as { role?: string | null }).role;
  const admin = !!role && role.split(",").includes("admin");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="size-11 rounded-full border-2 border-border"
          />
        ) : (
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-100 text-xl">
            🐼
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-bold text-card-foreground">{name}</p>
          <p className="truncate text-sm text-muted">{email}</p>
        </div>
      </div>
      {admin && (
        <ChunkyButton href="/admin" variant="sunny" size="sm">
          🛠️ แผงผู้ดูแล
        </ChunkyButton>
      )}
      <ChunkyButton
        variant="white"
        size="sm"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await signOut();
          setBusy(false);
        }}
      >
        ออกจากระบบ
      </ChunkyButton>
    </div>
  );
}
