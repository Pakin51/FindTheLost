import type { Category } from "../../types";

export const CATEGORY_LABEL: Record<Category, string> = {
  PERSON: "คนหาย",
  PET: "สัตว์เลี้ยงหาย",
  ITEM: "สิ่งของหาย",
};

export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** แปลง ISO string เป็นรูปแบบที่ <input type="datetime-local"> ใช้ (เวลาท้องถิ่น) */
export function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export const inputClass =
  "w-full px-3 py-2 text-sm rounded-xl border border-blue-100 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 disabled:opacity-60";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white hover:bg-black transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
