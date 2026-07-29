// Master data Event (static repo แทน DB) — เพิ่ม/แก้ event ที่นี่ที่เดียว
// ห้าม import ไฟล์นี้ตรงจาก UI — ให้เรียกผ่าน createEventRepo() เท่านั้น
import type { EventMeta } from "@/src/domain/ports/event.port";

export const EVENTS_MASTER: EventMeta[] = [
  {
    id: "spelling-bee-alp-jr2-2026",
    name: "Spelling Bee ALP JR2 2026",
    emoji: "🐝",
    description: "คำศัพท์ประกวดสะกดคำ ระดับ JR2 ปี 2026",
    words: [
      { word: "ZAP", emoji: "⚡", thai: "ไฟฟ้าช็อต" },
      { word: "RAT", emoji: "🐀", thai: "หนู" },
      { word: "BACK", emoji: "🔙", thai: "หลัง" },
      { word: "JAM", emoji: "🍯", thai: "แยม" },
      { word: "SAD", emoji: "😢", thai: "เศร้า" },
      { word: "RAG", emoji: "🧹", thai: "ผ้าขี้ริ้ว" },
      { word: "HAND", emoji: "✋", thai: "มือ" },
      { word: "KEG", emoji: "🛢️", thai: "ถังเบียร์" },
      { word: "NECK", emoji: "🦒", thai: "คอ" },
      { word: "DEN", emoji: "🏠", thai: "รัง/ถ้ำ" },
      { word: "RED", emoji: "🔴", thai: "สีแดง" },
      { word: "BELL", emoji: "🔔", thai: "กระดิ่ง" },
      { word: "WET", emoji: "💧", thai: "เปียก" },
      { word: "VET", emoji: "🏥", thai: "สัตวแพทย์" },
      { word: "BED", emoji: "🛏️", thai: "เตียง" },
      { word: "FISH", emoji: "🐟", thai: "ปลา" },
      { word: "ZIP", emoji: "🤐", thai: "ซิป" },
      { word: "FIN", emoji: "🦈", thai: "ครีบปลา" },
      { word: "CHIN", emoji: "🧔", thai: "คาง" },
      { word: "HID", emoji: "🙈", thai: "ซ่อน" },
      { word: "SOB", emoji: "😭", thai: "สะอื้น" },
      { word: "ROCK", emoji: "🪨", thai: "หิน" },
      { word: "COP", emoji: "👮", thai: "ตำรวจ" },
      { word: "SOCK", emoji: "🧦", thai: "ถุงเท้า" },
      { word: "LOG", emoji: "🪵", thai: "ท่อนไม้" },
      { word: "DUCK", emoji: "🦆", thai: "เป็ด" },
      { word: "BUD", emoji: "🌱", thai: "หน่อ/ดอกตูม" },
      { word: "RUN", emoji: "🏃", thai: "วิ่ง" },
      { word: "MUG", emoji: "☕", thai: "แก้วน้ำ" },
      { word: "LOCK", emoji: "🔒", thai: "กุญแจ" },
    ],
  },
];
