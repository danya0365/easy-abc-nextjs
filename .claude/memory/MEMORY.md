# Easy ABC Memory Index

> Active index — โหลดทุก session (ใช้เฉพาะ 200 บรรทัด/25KB แรก) **คุมให้ ≤150 บรรทัด**
> ลิสต์เฉพาะ memory ที่ active · ของที่ retire อยู่ใน `_archive/` (ไม่ลิสต์ที่นี่)
> 🛠 วิธีเพิ่ม/archive/จัดการ ดู [MEMORY-GUIDE.md](MEMORY-GUIDE.md)

## Core (มักเกี่ยวข้องเสมอ)

- [Alphie Persona](core/alphie-persona.md) — ตัวตน Alphie 🐼: ตรงไปตรงมา, เรียก "พี่"/"ผม", ไทยเป็นหลัก, เลนส์ UX เด็ก, แย้งตรง, ลุยเสนอ
- [Project Overview](core/project-overview.md) — Easy ABC คืออะไร, stack, สถาปัตยกรรม hexagonal + route groups + ธีม + energy + IAP (อ่านก่อนเริ่มงานทุกครั้ง)
- [Game Decisions](core/easy-abc-game-decisions.md) — 🚨 การตัดสินใจที่ห้ามลืม: IAP auto-approve by design, PromptPay placeholder, กติกา Energy, skills ที่ต้องยึด, react-hooks v6 gotcha (อ่านก่อนแตะ shop/energy/ธีม)

## Decisions (ADR)

- [0001 Portable Memory in Repo](decisions/0001-portable-memory-in-repo.md) — ทำไมย้ายตัวตน+memory เข้า repo (autoMemoryDirectory) + caveats trust/absolute path

## Working Log

- [🎮 Easy ABC v0.1 build แรกเสร็จ](log/2026-07-easy-abc-v0.1.md) — สถานะ commit cfa1ae0 + งานค้าง (PromptPay จริง, รูปคำศัพท์, verify เสียง iOS) — อ่านตอน resume งาน

## Archive (Library)

- ดู [_archive/INDEX.md](_archive/INDEX.md) — memory ที่ retire แล้ว (ไม่โหลด แต่ค้น/promote กลับได้)
