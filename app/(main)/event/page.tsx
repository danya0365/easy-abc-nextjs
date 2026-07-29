import type { Metadata } from "next";
import { createEventRepo } from "@/src/adapters/events";
import { EventList } from "@/src/presentation/components/event-list";

export const metadata: Metadata = {
  title: "กิจกรรมพิเศษ",
};

export default async function EventPage() {
  const result = await createEventRepo().getAll();
  if (!result.ok || result.value.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-6 text-center">
        <p className="text-4xl">🎪</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-700">
          กิจกรรมพิเศษ
        </h1>
        <p className="mt-2 text-muted">ไม่มีกิจกรรมในขณะนี้</p>
      </div>
    );
  }

  return <EventList events={result.value} />;
}
