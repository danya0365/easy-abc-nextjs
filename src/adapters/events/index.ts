import { EVENTS_MASTER } from "@/src/data/events.master";
import type { EventRepository } from "@/src/domain/ports/event.port";
import { StaticEventAdapter } from "./static.adapter";

export function createEventRepo(): EventRepository {
  return new StaticEventAdapter(EVENTS_MASTER);
}
