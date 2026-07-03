import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createLevelRepo } from "@/src/adapters/levels";
import {
  FILL_SLUGS,
  gameFromSlug,
  getAdventure,
} from "@/src/presentation/lib/adventures";
import { PlayGate } from "@/src/presentation/components/play-gate";
import { GameScreen } from "@/src/presentation/components/game/game-screen";

export function generateStaticParams() {
  return FILL_SLUGS.flatMap((game) =>
    [1, 2, 3, 4, 5].map((l) => ({ game, level: String(l) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ game: string; level: string }>;
}): Promise<Metadata> {
  const { game: slug, level } = await params;
  const game = gameFromSlug(slug);
  if (!game) return {};
  return { title: `${getAdventure(game).name} ด่านที่ ${level}` };
}

export default async function FillPlayPage({
  params,
}: {
  params: Promise<{ game: string; level: string }>;
}) {
  const { game: slug, level } = await params;
  const game = gameFromSlug(slug);
  if (!game) notFound();
  const n = Number(level);
  if (!Number.isInteger(n)) notFound();

  const repo = createLevelRepo();
  const [config, all] = await Promise.all([repo.getByLevel(n), repo.getAll()]);
  if (!config.ok || !all.ok) notFound();

  return (
    <PlayGate level={n} game={game}>
      <GameScreen level={config.value} maxLevel={all.value.length} game={game} />
    </PlayGate>
  );
}
