import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createEventRepo } from "@/src/adapters/events";
import { createEventLevels } from "@/src/domain/services/event-levels";
import { ADVENTURE_GAMES } from "@/src/domain/services/mask";
import type { AdventureGame } from "@/src/domain/services/mask";
import { GameScreen } from "@/src/presentation/components/game/game-screen";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; game: string; level: string }>;
}): Promise<Metadata> {
  const { game } = await params;
  if (!ADVENTURE_GAMES.includes(game as AdventureGame)) return {};
  return { title: "กิจกรรม" };
}

export default async function EventPlayPage({
  params,
}: {
  params: Promise<{ id: string; game: string; level: string }>;
}) {
  const { id, game, level } = await params;
  if (!ADVENTURE_GAMES.includes(game as AdventureGame)) notFound();
  const g = game as AdventureGame;

  const n = Number(level);
  if (!Number.isInteger(n)) notFound();

  const eventResult = await createEventRepo().getById(id);
  if (!eventResult.ok || !eventResult.value) notFound();
  const event = eventResult.value;

  // สร้าง level config จาก event words
  const levels = createEventLevels(event.words);
  const lc = levels[n - 1];
  if (!lc) notFound();

  return (
    <GameScreen
      level={lc}
      maxLevel={levels.length}
      game={g}
      nextRouteOverride={id}
      backHref={`/event/${id}/${game}`}
      noSave
    />
  );
}
