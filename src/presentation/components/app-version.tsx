export function useAppVersion() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0";
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || "";
  const shortSha = commitSha.slice(0, 7);
  const displayVersion = shortSha ? `v${version} (${shortSha})` : `v${version}`;
  return { version, commitSha, shortSha, displayVersion };
}

export function AppVersion({ className = "" }: { className?: string }) {
  const { displayVersion } = useAppVersion();
  return (
    <p
      className={`text-center text-[11px] text-muted print:hidden ${className}`}
    >
      Easy ABC {displayVersion}
    </p>
  );
}
