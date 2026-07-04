// ส่ง LINE push แจ้ง admin เมื่อมีการชำระเงิน (LINE Messaging API) — server-only
// fail-safe: ไม่มี token / API พลาด → log แล้วเงียบ ไม่ทำให้การซื้อพัง
import {
  formatPurchaseAlert,
  type PurchaseAlert,
} from "@/src/domain/services/notify";

const PUSH_URL = "https://api.line.me/v2/bot/message/push";
// ผู้รับแจ้งเตือน (LINE user id ของ admin) — override ด้วย env ได้
const DEFAULT_ADMIN_USER_ID = "Ua61429b9c6633b3a272a295c11eae58d";

export async function pushPurchaseAlert(alert: PurchaseAlert): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    console.warn("[LINE] ไม่มี LINE_CHANNEL_ACCESS_TOKEN — ข้ามการแจ้งเตือน");
    return;
  }
  const to = process.env.LINE_ADMIN_USER_ID ?? DEFAULT_ADMIN_USER_ID;

  try {
    const res = await fetch(PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to,
        messages: [{ type: "text", text: formatPurchaseAlert(alert) }],
      }),
    });
    if (!res.ok) {
      console.error(
        "[LINE] push ล้มเหลว",
        res.status,
        await res.text().catch(() => "")
      );
    }
  } catch (e) {
    console.error("[LINE] push error", e);
  }
}
