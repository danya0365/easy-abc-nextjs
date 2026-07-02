// Master data ด่านผจญภัย (static repo แทน DB) — แก้/เพิ่มด่านที่นี่ที่เดียว
// ห้าม import ไฟล์นี้ตรงจาก UI — ให้เรียกผ่าน createLevelRepo() เท่านั้น
import type { LevelConfig } from "@/src/domain/ports/level.port";

export const LEVELS_MASTER: LevelConfig[] = [
  {
    level: 1,
    title: "ด่านที่ 1",
    decoys: 2,
    words: [
      { word: "DOG", emoji: "🐶", thai: "หมา" },
      { word: "CAT", emoji: "🐱", thai: "แมว" },
      { word: "SUN", emoji: "☀️", thai: "พระอาทิตย์" },
      { word: "BEE", emoji: "🐝", thai: "ผึ้ง" },
      { word: "EGG", emoji: "🥚", thai: "ไข่" },
    ],
  },
  {
    level: 2,
    title: "ด่านที่ 2",
    decoys: 2,
    words: [
      { word: "FISH", emoji: "🐟", thai: "ปลา" },
      { word: "BIRD", emoji: "🐦", thai: "นก" },
      { word: "CAKE", emoji: "🍰", thai: "เค้ก" },
      { word: "MILK", emoji: "🥛", thai: "นม" },
      { word: "STAR", emoji: "⭐", thai: "ดาว" },
    ],
  },
  {
    level: 3,
    title: "ด่านที่ 3",
    decoys: 3,
    words: [
      { word: "FROG", emoji: "🐸", thai: "กบ" },
      { word: "DUCK", emoji: "🦆", thai: "เป็ด" },
      { word: "BEAR", emoji: "🐻", thai: "หมี" },
      { word: "MOON", emoji: "🌙", thai: "พระจันทร์" },
      { word: "TREE", emoji: "🌳", thai: "ต้นไม้" },
    ],
  },
  {
    level: 4,
    title: "ด่านที่ 4",
    decoys: 3,
    words: [
      { word: "APPLE", emoji: "🍎", thai: "แอปเปิล" },
      { word: "HORSE", emoji: "🐴", thai: "ม้า" },
      { word: "HOUSE", emoji: "🏠", thai: "บ้าน" },
      { word: "TIGER", emoji: "🐯", thai: "เสือ" },
      { word: "BREAD", emoji: "🍞", thai: "ขนมปัง" },
    ],
  },
  {
    level: 5,
    title: "ด่านที่ 5",
    decoys: 4,
    words: [
      { word: "RABBIT", emoji: "🐰", thai: "กระต่าย" },
      { word: "MONKEY", emoji: "🐵", thai: "ลิง" },
      { word: "FLOWER", emoji: "🌸", thai: "ดอกไม้" },
      { word: "BANANA", emoji: "🍌", thai: "กล้วย" },
      { word: "ROCKET", emoji: "🚀", thai: "จรวด" },
    ],
  },
];
