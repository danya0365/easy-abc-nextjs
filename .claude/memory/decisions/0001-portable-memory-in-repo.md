---
name: adr-0001-portable-memory-in-repo
description: ADR — ทำไมย้ายตัวตน (Alphie) + memory ทั้งหมดเข้ามาเก็บใน repo ผ่าน autoMemoryDirectory (อ่านเมื่อสงสัยว่าระบบ memory ตั้งอยู่ยังไง หรือจะย้ายเครื่อง/เปลี่ยน path)
metadata:
  type: decision
  status: active
  scope: global
---

# ADR-0001: Portable Memory in Repo

**วันที่:** 2026-07-02 · **สถานะ:** accepted + implemented

## บริบท

เดิม memory ของโปรเจกต์อยู่นอก repo (`~/.claude/projects/-Users-marosdeeuma-easy-abc-nextjs/memory/`)
และไม่มีไฟล์ตัวตน — ย้ายเครื่อง/clone ใหม่แล้วความจำหาย ผู้ใช้ต้องการแบบเดียวกับโปรเจกต์
easy-game-arena: ทุกอย่างอยู่ในโปรเจกต์ **ห้ามอ้างอิงไฟล์นอกโปรเจกต์**

## การตัดสินใจ

1. ตั้ง `autoMemoryDirectory: "~/easy-abc-nextjs/.claude/memory"` ใน `.claude/settings.json`
   → auto-memory ของ Claude Code ชี้เข้ามาใน repo และ commit เข้า git
2. โครง memory: `MEMORY.md` (index lean ≤150 บรรทัด, ไฟล์เดียวที่โหลดอัตโนมัติ) + `core/` + `decisions/` + `log/` + `_archive/` — กติกาอยู่ใน `MEMORY-GUIDE.md`
3. ตัวตนประจำโปรเจกต์ = **Alphie 🐼** (`core/alphie-persona.md`) สรุปไว้ใน `CLAUDE.md` ด้วย
4. ยกชุดเครื่องมือมาด้วย: `.claude/rules/` (โหลดตาม path), `.claude/commands/` (/new-adr, /archive-memory, /memory-status), `.claude/hooks/` (format, commit-reminder), permissions allowlist
5. ลบ memory เก่านอก repo ทิ้งหลังย้ายเนื้อหาเข้ามาครบ

## เหตุผล

- `git clone` เครื่องใหม่ = ได้ตัวตน + ความจำ + เครื่องมือครบทันที ไม่พึ่งไฟล์นอกโปรเจกต์
- แพทเทิร์นนี้พิสูจน์แล้วใน easy-game-arena (index lean → context ไม่บวมแม้ memory โต)

## ผลที่ตามมา / ข้อควรระวัง

- ⚠️ **clone เครื่องใหม่ต้องกด accept workspace-trust 1 ครั้ง** ค่า `autoMemoryDirectory` + hooks ถึงจะทำงาน
- ⚠️ ค่า path เป็น absolute (`~/easy-abc-nextjs/...`) — ถ้าเปลี่ยน username/ตำแหน่งโปรเจกต์ ต้องแก้ใน `.claude/settings.json` จุดเดียว
- ⚠️ session ที่ตั้งค่านี้ยังใช้ path เดิมอยู่ — มีผลตั้งแต่ session ถัดไป
- memory = ไฟล์ใน git → การแก้ memory ควร commit เหมือนโค้ด
