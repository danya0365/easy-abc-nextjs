// PromptPay QR payload (EMVCo merchant-presented mode) — pure, framework-free
// อ้างอิงสเปค EMVCo + Thai QR Payment Standard

const AID_PROMPTPAY = "A000000677010111";

/** TLV: id 2 หลัก + ความยาว 2 หลัก + ค่า */
const tlv = (id: string, value: string): string =>
  id + value.length.toString().padStart(2, "0") + value;

/** CRC16-CCITT (XModem: init 0xFFFF, poly 0x1021) คืน hex 4 ตัวพิมพ์ใหญ่ */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** แปลงเบอร์/ID เป็นรูปแบบ target ของ PromptPay */
function formatTarget(target: string): { subId: string; value: string } {
  const digits = target.replace(/\D/g, "");
  if (digits.length >= 15) return { subId: "03", value: digits }; // e-wallet
  if (digits.length === 13) return { subId: "02", value: digits }; // เลขบัตรประชาชน
  // เบอร์โทร: ตัด 0 นำหน้า เติมรหัสประเทศ 0066
  return { subId: "01", value: "0066" + digits.replace(/^0/, "") };
}

/**
 * สร้าง payload สำหรับ QR PromptPay
 * @param target เบอร์โทร (0812345678) / เลขบัตรประชาชน 13 หลัก / e-wallet 15 หลัก
 * @param amountThb ยอดเงินบาท (ใส่แล้วเป็น QR แบบ dynamic ครั้งเดียว)
 */
export function buildPromptPayPayload(
  target: string,
  amountThb?: number
): string {
  const { subId, value } = formatTarget(target);
  const merchantInfo = tlv("00", AID_PROMPTPAY) + tlv(subId, value);

  let payload =
    tlv("00", "01") + // payload format indicator
    tlv("01", amountThb != null ? "12" : "11") + // dynamic เมื่อระบุยอด
    tlv("29", merchantInfo) +
    tlv("53", "764") + // สกุลเงิน THB
    (amountThb != null ? tlv("54", amountThb.toFixed(2)) : "") +
    tlv("58", "TH");

  payload += "6304"; // CRC id + length ต้องรวมใน checksum
  return payload + crc16(payload);
}
