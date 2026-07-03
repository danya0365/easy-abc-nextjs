# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [1.0.0] - 2026-07-03

รุ่น production แรก 🎉 — รวมระบบ login (Google + admin email/password), IAP auto-approve + admin เพิกถอน, cloud save (การซื้อ + ดาว), หน้า admin + dashboard รายได้ (จาก 0.2.0) พร้อมใช้งานจริง

### Fixed

- theme store: เพิ่ม `migrate` กัน rehydrate error เมื่อมี state ธีมเวอร์ชันเก่าค้างใน localStorage (normalize `template`/`dark` ให้ค่าถูกเสมอ)

## [0.2.0] - 2026-07-03

### Added

- **ระบบล็อกอิน + กู้คืนการซื้อ + cloud save** (backend ตัวแรก): เข้าสู่ระบบด้วย Google (better-auth) เก็บ user/การซื้อ/ดาว ลง Turso (libSQL) ผ่าน Drizzle — เปลี่ยนเครื่องแล้วการซื้อ/ดาวตามไปด้วย
- **หน้าผู้ดูแล (admin)** + Dashboard สรุปรายได้: จัดการคำสั่งซื้อ (เพิกถอน/คืนสิทธิ์), สรุปยอดรวม/ตามสินค้า/ล่าสุด — ใช้ app shell/ธีมเดียวกับเกม, guard ด้วย role (non-admin → 404) · seed admin ที่ login ได้ทันที (`npm run db:seed`)
- แจ้งเตือนเมื่อถูกเพิกถอนการซื้อ: modal เด้งครั้งเดียว (บอกเหตุผลจากผู้ดูแล + ปุ่มชำระอีกครั้ง) ค้างจนกด"รับทราบ" — บันทึกลง persist ไม่เด้งซ้ำ
- ระบบ migration ฐานข้อมูล (drizzle-kit `generate`/`migrate`) + script `db:make-admin` / `db:seed` (admin ที่ login ได้ทันที)
- โหมดผจญภัย "เติมตัวอักษรที่หายไป" 3 เกม (ฟรี): เติมข้างหน้า `_AT` / เติมข้างหลัง `CA_` / เติมตรงกลาง `H__E` — แต่ละเกมมีแผนที่ด่าน 1–5 + ดาวแยก track ใช้ระบบ Energy เดิม

- เกมสะกดคำ Easy ABC เวอร์ชันแรก: โหมดผจญภัย 5 ด่าน + ระบบดาว
- โหมดพรีเมียม: จับเวลา, ฟังแล้วสะกด, เล่นไม่จำกัด, ทายคำจากรูป
- ระบบ Energy แบบ auto-restore + ของขวัญรายวัน
- ร้านค้า in-app purchase ผ่าน PromptPay QR (auto-approve)
- ระบบธีม 3 ธีม (sky/candy/space) + dark mode
- หน้าตั้งค่า, วิธีเล่น, TabBar 4 แท็บ

### Changed

- **IAP: ต้อง login ก่อนซื้อ + auto-approve ทันที + admin เพิกถอนได้**: กด "ชำระเงินแล้ว" (ต้อง login) ปลดล็อกทันทีไม่ต้องรอ · ถ้าตรวจเจอแจ้งชำระเท็จ admin กด "ปิดพรีเมียม" เพิกถอนสิทธิ์ผู้ใช้คนนั้นได้ (server เป็นเจ้าของความจริง — เพิกถอนแล้ว sync ลง client ปลดล็อกจริง)

### Fixed
