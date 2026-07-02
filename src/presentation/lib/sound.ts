// เสียงทั้งหมดของเกม — ไม่มีไฟล์เสียง
// - เสียงอ่าน: Web Speech API (en-US)
// - เอฟเฟกต์: Web Audio API (สังเคราะห์ oscillator)
// เรียกจาก event handler / effect เท่านั้น (autoplay policy + hydration)
import { useSettingsStore } from "@/src/presentation/stores/settings.store";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function sfxMuted() {
  return useSettingsStore.getState().sfxMuted;
}
function speechMuted() {
  return useSettingsStore.getState().speechMuted;
}

/** เล่นโน้ตต่อเนื่อง [freq, startSec, durSec][] */
function playNotes(
  notes: [number, number, number][],
  type: OscillatorType = "sine",
  volume = 0.2
) {
  if (sfxMuted()) return;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime;
  for (const [freq, start, dur] of notes) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, t0 + start);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + start + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0 + start);
    osc.stop(t0 + start + dur + 0.05);
  }
}

export const sound = {
  /** ป๊อกเบา ๆ ตอนวาง tile */
  tap() {
    playNotes([[660, 0, 0.08]], "triangle", 0.12);
  },
  /** ถูก: โน้ตขึ้น C5→E5 */
  correct() {
    playNotes(
      [
        [523.25, 0, 0.15],
        [659.25, 0.12, 0.25],
      ],
      "sine",
      0.25
    );
  },
  /** ผิด: บัซต่ำสั้น */
  wrong() {
    playNotes([[150, 0, 0.2]], "square", 0.12);
  },
  /** ชนะด่าน: อาร์เปจโจ C-E-G-C */
  win() {
    playNotes(
      [
        [523.25, 0, 0.18],
        [659.25, 0.14, 0.18],
        [783.99, 0.28, 0.18],
        [1046.5, 0.42, 0.4],
      ],
      "sine",
      0.25
    );
  },
  /** ได้ energy / ของขวัญ */
  sparkle() {
    playNotes(
      [
        [880, 0, 0.1],
        [1174.66, 0.09, 0.18],
      ],
      "triangle",
      0.18
    );
  },

  speakLetter(letter: string) {
    this.speak(letter, 0.9);
  },
  speakWord(word: string) {
    this.speak(word, 0.8);
  },
  speak(text: string, rate = 0.85) {
    if (speechMuted()) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("en"));
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  },
};
