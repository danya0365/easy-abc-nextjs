// ตั้งค่าเสียง — persist ลง localStorage
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  /** ปิดเสียงเอฟเฟกต์ (chimes) */
  sfxMuted: boolean;
  /** ปิดเสียงอ่านออกเสียง (TTS) */
  speechMuted: boolean;
  toggleSfx: () => void;
  toggleSpeech: () => void;
  /** mute รวม (ปุ่มลัดในเกม): ถ้ามีอันไหนเปิดอยู่ → ปิดหมด, ถ้าปิดหมดแล้ว → เปิดหมด */
  toggleAll: () => void;
  allMuted: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      sfxMuted: false,
      speechMuted: false,
      toggleSfx: () => set((s) => ({ sfxMuted: !s.sfxMuted })),
      toggleSpeech: () => set((s) => ({ speechMuted: !s.speechMuted })),
      toggleAll: () => {
        const muted = get().allMuted();
        set({ sfxMuted: !muted, speechMuted: !muted });
      },
      allMuted: () => get().sfxMuted && get().speechMuted,
    }),
    { name: "easy-abc-settings", version: 1 }
  )
);
