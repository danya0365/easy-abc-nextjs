import type { Metadata } from "next";
import { SettingsPanel } from "@/src/presentation/components/settings-panel";

export const metadata: Metadata = {
  title: "ตั้งค่า",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-6">
      <h1 className="mb-5 text-3xl font-bold text-brand-700 text-outline">
        ⚙️ ตั้งค่า
      </h1>
      <SettingsPanel />
    </div>
  );
}
