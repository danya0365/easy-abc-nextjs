// Zustand + persist — เก็บ template (ธีม) + dark ใน localStorage
// key "theme-storage" ต้องตรงกับ ThemeScript (กัน FOUC)
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeTemplate = "sky" | "candy" | "space";

export const THEME_TEMPLATES: ThemeTemplate[] = ["sky", "candy", "space"];
export const DEFAULT_TEMPLATE: ThemeTemplate = "sky";

/** ธีมที่ต้องซื้อ Bundle ก่อนถึงใช้ได้ */
export const PREMIUM_THEMES: ThemeTemplate[] = ["candy", "space"];

export const THEME_LABELS: Record<ThemeTemplate, { name: string; emoji: string }> = {
  sky: { name: "ท้องฟ้า", emoji: "☁️" },
  candy: { name: "ลูกกวาด", emoji: "🍭" },
  space: { name: "อวกาศ", emoji: "🚀" },
};

interface ThemeState {
  template: ThemeTemplate;
  dark: boolean;
  setTemplate: (template: ThemeTemplate) => void;
  toggleDark: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      template: DEFAULT_TEMPLATE,
      dark: false,
      setTemplate: (template) => set({ template }),
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      setDark: (dark) => set({ dark }),
    }),
    { name: "theme-storage", version: 1 }
  )
);
