import { describe, it, expect } from "vitest";
import { buildPromptPayPayload, crc16 } from "./promptpay";

describe("crc16 (CRC-16/CCITT-FALSE)", () => {
  it('ค่าอ้างอิงมาตรฐาน: "123456789" → 29B1', () => {
    expect(crc16("123456789")).toBe("29B1");
  });
});

describe("buildPromptPayPayload", () => {
  it("โครง payload เบอร์โทร + ยอดเงิน ถูกต้องตามสเปค EMVCo", () => {
    const p = buildPromptPayPayload("0812345678", 49);
    expect(p.startsWith("000201")).toBe(true); // payload format
    expect(p).toContain("010212"); // dynamic (มียอด)
    // merchant info: AID + เบอร์แปลงเป็น 0066812345678
    expect(p).toContain("29370016A00000067701011101130066812345678");
    expect(p).toContain("5303764"); // THB
    expect(p).toContain("540549.00"); // ยอด 49.00
    expect(p).toContain("5802TH");
  });

  it("ไม่ใส่ยอด → QR static (010211) และไม่มี field 54", () => {
    const p = buildPromptPayPayload("0812345678");
    expect(p).toContain("010211");
    expect(p).not.toContain("5405");
  });

  it("CRC ท้าย payload ตรงกับที่คำนวณซ้ำ", () => {
    const p = buildPromptPayPayload("0899999999", 19);
    const body = p.slice(0, -4);
    expect(p.slice(-4)).toBe(crc16(body));
    expect(body.endsWith("6304")).toBe(true);
  });

  it("เลขบัตรประชาชน 13 หลัก → sub id 02", () => {
    const p = buildPromptPayPayload("1234567890123", 10);
    expect(p).toContain("02131234567890123");
  });
});
