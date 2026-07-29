import { ok } from "@/src/domain/shared/result";
import type { Result } from "@/src/domain/shared/result";
import type {
  EventMeta,
  EventRepository,
} from "@/src/domain/ports/event.port";

export class StaticEventAdapter implements EventRepository {
  constructor(private events: EventMeta[]) {}

  async getAll(): Promise<Result<EventMeta[]>> {
    return ok(this.events);
  }

  async getById(id: string): Promise<Result<EventMeta | null>> {
    return ok(this.events.find((e) => e.id === id) ?? null);
  }
}
