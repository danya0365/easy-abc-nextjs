---
paths:
  - "app/**"
  - "src/**"
  - "test-contracts/**"
---

# Definition of Done — เช็คก่อนบอกว่า "เสร็จ" (ทุก session / ทุก AI)

> **กฎข้อเดียวที่สำคัญสุด:** ห้ามบอกพี่ว่างาน "เสร็จ" จนกว่าจะผ่าน checklist นี้ครบ —
> ไม่ว่าจะ session ไหน, AI ตัวไหน, มี persona Alphie หรือไม่. นี่คือมาตรฐานตายตัว ไม่ใช่ทางเลือก.
>
> ทำไมต้องเขียนไว้: โปรเจกต์นี้**ไม่มี pre-commit hook / CI** — ไม่มีอะไรรัน gate ให้อัตโนมัติ
> ถ้าไม่ยึด checklist นี้ AI จะ commit ของพังโดยไม่รู้ตัว

## ✅ Checklist ก่อนปิดงาน (เรียงตามลำดับ)

### 1. Gate เขียวครบ — **บังคับเสมอ**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```

ต้องเขียวทุกตัว (`next build` ไม่ lint/typecheck ให้ — ต้องรันแยกเอง)

### 2. Test ครอบของใหม่ — **บังคับเมื่อเพิ่ม/แก้ logic**

- `src/domain/` (rules, promptpay, ports) = ทุก branch ใหม่ต้องมี unit test ใน vitest
- adapter ใหม่ = ต้องผ่าน contract test เดิม (`test-contracts/`)
- ทุก behavior ใหม่ต้องมี test ยืนยัน — ไม่ใช่แค่ "คอมไพล์ผ่าน"

### 3. Verify บนจริง — **บังคับเมื่อแตะ user-facing flow**

ถ้างานแตะ flow ที่ผู้ใช้เห็น (หน้าเกม, ร้านค้า, ธีม, energy):

- `npm run dev` แล้วไล่ flow จริงบนเบราว์เซอร์ (viewport มือถือ 375px ด้วย) — ไม่ใช่แค่ curl
- เช็ค console ไม่มี hydration warning · localStorage persist ข้าม reload
- ⚠️ **ตรวจไม่ได้ (เช่น เสียง iOS, สแกน QR ด้วยแอปธนาคาร)** → **ห้ามเคลมว่า "พิสูจน์แล้ว"** —
  แจ้งพี่ตรงๆ ว่าอะไรตรวจแล้ว อะไรต้องให้พี่ช่วยเทสบนอุปกรณ์จริง

> งานที่ไม่แตะ user flow (refactor domain ล้วน, แก้ doc/memory) → ข้อ 3 ไม่บังคับ

### 4. Commit สะอาด

- conventional message (`feat:`/`fix:`/`docs:`/`chore:`…) · subject ไทยได้
- ปิดท้าย `Co-Authored-By:` ตามรุ่น AI ที่ทำงาน
- ไม่มี secret หลุด · งานใหญ่ → commit ทีละ increment ที่เขียว
- แตะ shop/pricing → เช็คว่าไม่เผลอเปลี่ยนพฤติกรรม auto-approve (ดู [[easy-abc-game-decisions]])

### 5. รายงานตรง (ห้าม overclaim)

บอกชัด: ผ่านอะไร / ข้ามอะไร / เหลืออะไร. ถ้า test fail หรือข้าม step ให้พูดตรง พร้อม output.
"เสร็จและพิสูจน์แล้ว" = ผ่านข้อ 1-3 จริงเท่านั้น.

## สรุปสั้น (จำ 1 บรรทัด)

> **gate เขียว → test ครอบของใหม่ → verify บนจริงถ้าแตะ user flow → commit สะอาด → รายงานตรง**
