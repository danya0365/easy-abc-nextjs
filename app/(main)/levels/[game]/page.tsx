import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createLevelRepo } from "@/src/adapters/levels";
import {
  FILL_SLUGS,
  gameFromSlug,
  getAdventure,
} from "@/src/presentation/lib/adventures";
import { LevelMap } from "@/src/presentation/components/level-map";
import { EnergyHud } from "@/src/presentation/components/energy-hud";
import { SoundToggle } from "@/src/presentation/components/sound-toggle";

export function generateStaticParams() {
  return FILL_SLUGS.map((game) => ({ game }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ game: string }>;
}): Promise<Metadata> {
  const { game: slug } = await params;
  const game = gameFromSlug(slug);
  if (!game) return {};
  return { title: `เลือกด่าน — ${getAdventure(game).name}` };
}

export default async function FillLevelsPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: slug } = await params;
  const game = gameFromSlug(slug);
  if (!game) notFound();

  const result = await createLevelRepo().getAll();
  if (!result.ok) {
    return (
      <p className="p-8 text-center text-error">
        โหลดข้อมูลด่านไม่สำเร็จ: {result.error}
      </p>
    );
  }

  const adventure = getAdventure(game);

  return (
    <div className="mx-auto max-w-lg px-5 pt-6">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-700 text-outline">
          {adventure.emoji} {adventure.name}
        </h1>
        <div className="flex items-center gap-2">
          <EnergyHud />
          <SoundToggle />
        </div>
      </div>
      <p className="mb-4 text-center text-sm text-brand-800">
        {adventure.description} — ตัวอย่าง{" "}
        <span className="font-heading font-bold tracking-widest">
          {adventure.sample}
        </span>{" "}
        · ผ่านด่านเพื่อปลดด่านถัดไป!
      </p>
      <LevelMap levels={result.value} game={game} />
    </div>
  );
}
