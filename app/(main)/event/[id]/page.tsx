import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createEventRepo } from "@/src/adapters/events";
import { EventModeGrid } from "@/src/presentation/components/event-mode-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await createEventRepo().getById(id);
  if (!result.ok || !result.value) return {};
  return { title: result.value.name };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await createEventRepo().getById(id);
  if (!result.ok || !result.value) notFound();

  return <EventModeGrid event={result.value} />;
}
