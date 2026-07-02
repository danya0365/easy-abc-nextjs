# Versioning — Easy ABC

ระบบ Semantic Versioning แบบอิงฟีเจอร์ (feature-based SemVer): `MAJOR.MINOR.PATCH`

- **แหล่งเดียวของเลขเวอร์ชัน** = ฟิลด์ `version` ใน `package.json`
- ตอน build เลขถูกฝังเป็น `NEXT_PUBLIC_APP_VERSION` + `NEXT_PUBLIC_COMMIT_SHA` (ดู `next.config.ts`)
  และแสดงใน footer ผ่านคอมโพเนนต์ `AppVersion` เป็น `vX.Y.Z (sha)`
- **ไม่ต้องแก้เลขเวอร์ชันที่ไฟล์อื่นเลย**

## เกณฑ์ขยับเลข

| หลัก | ขยับเมื่อ | ตัวอย่าง |
|------|----------|---------|
| **PATCH** `1.0.x` | แก้บั๊ก, security, ปรับ UX/ถ้อยคำ/สไตล์, performance — ไม่มีฟีเจอร์ใหม่ | แก้ปุ่มกดไม่ติด, แก้คำผิด |
| **MINOR** `1.x.0` | ฟีเจอร์ใหม่ที่ผู้ใช้สังเกตได้ (backward-compatible) | เพิ่มโหมดเกมใหม่, เพิ่มด่าน |
| **MAJOR** `x.0.0` | เปลี่ยนใหญ่กระทบ workflow/โมเดลธุรกิจ หรือ redesign/breaking | รื้อระบบราคา, รื้อ UI ใหม่หมด |

คำถามตัดสิน: มีของใหม่ให้ผู้ใช้ใช้ไหม → MINOR · ทำของเดิมดีขึ้น/หายพัง → PATCH · ผู้ใช้ต้องปรับตัว → MAJOR

`1.0.0` = รุ่น production แรก (ก่อนหน้านั้นคือ `0.x`)

## ขั้นตอนออกรุ่น

1. commit งานฟีเจอร์ให้ working tree สะอาด
2. ย้ายรายการใน `CHANGELOG.md` จาก `[Unreleased]` → หัวข้อเวอร์ชันใหม่ + วันที่
3. รัน:
   ```bash
   npm run release:patch   # หรือ release:minor / release:major
   ```
   (bump + commit `chore(release): vX.Y.Z` + git tag ในคำสั่งเดียว — hook `version` ดึง CHANGELOG เข้า commit ให้เอง)
4. `git push --follow-tags`

**หมายเหตุ:** bump ตอน "ออกรุ่น" เท่านั้น ไม่ใช่ทุก commit — build ย่อยระบุได้จาก commit sha ใน footer
