import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createEventRepo } from "@/src/adapters/events";
import { createEventLevels } from "@/src/domain/services/event-levels";
import { ADVENTURE_GAMES } from "@/src/domain/services/mask";
import type { AdventureGame } from "@/src/domain/services/mask";
import { LevelMap } from "@/src/presentation/components/level-map";
import { ChunkyButton } from "@/src/presentation/components/chunky-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; game: string }>;
}): Promise<Metadata> {
  const { id, game } = await params;
  if (!ADVENTURE_GAMES.includes(game as AdventureGame)) return {};
  const result = await createEventRepo().getById(id);
  if (!result.ok || !result.value) return {};
  return { title: `${result.value.name}` };
}

export default async function EventLevelMapPage({
  params,
}: {
  params: Promise<{ id: string; game: string }>;
}) {
  const { id, game } = await params;
  if (!ADVENTURE_GAMES.includes(game as AdventureGame)) notFound();

  const eventResult = await createEventRepo().getById(id);
  if (!eventResult.ok || !eventResult.value) notFound();
  const event = eventResult.value;

  // แบ่งคำศัพท์เป็น levels (5 คำ/level)
  const levels = createEventLevels(event.words);

  return (
    <div className="mx-auto max-w-lg px-5 pt-6">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-700 text-outline">
          {event.emoji} {event.name}
        </h1>
      </div>
      <LevelMap
        levels={levels}
        game={game as AdventureGame}
        baseRoute={`/event/${id}/${game}`}
      />
      <div className="mt-4 flex justify-center">
        <ChunkyButton href={`/event/${id}`} variant="white" size="sm">
          ← เลือกรูปแบบอื่น
        </ChunkyButton>
      </div>
    </div>
  );
}
