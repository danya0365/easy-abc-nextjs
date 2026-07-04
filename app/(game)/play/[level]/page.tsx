import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createLevelRepo } from "@/src/adapters/levels";
import { createWordRepo } from "@/src/adapters/words";
import { levelWordsByCategory } from "@/src/domain/services/word-bank";
import { PlayGate } from "@/src/presentation/components/play-gate";
import { GameScreen } from "@/src/presentation/components/game/game-screen";

export function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((l) => ({ level: String(l) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  return { title: `ด่านที่ ${level}` };
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const n = Number(level);
  if (!Number.isInteger(n)) notFound();

  const repo = createLevelRepo();
  const [config, all, bank] = await Promise.all([
    repo.getByLevel(n),
    repo.getAll(),
    createWordRepo().getBank(),
  ]);
  if (!config.ok || !all.ok) notFound();

  return (
    <PlayGate level={n}>
      <GameScreen
        level={config.value}
        maxLevel={all.value.length}
        wordsByCategory={
          bank.ok ? levelWordsByCategory(bank.value, n) : undefined
        }
      />
    </PlayGate>
  );
}
