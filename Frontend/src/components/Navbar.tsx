import { Link } from "react-router";
import { Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-[#fffffe] border-b border-gray-200/80 px-4 md:px-6 py-3">
      {/* 3 คอลัมน์: โลโก้ชิดซ้าย | ช่องค้นหากลางจอ | โปรไฟล์ชิดขวา */}
      <div className="grid grid-cols-[1fr_minmax(0,36rem)_1fr] items-center gap-4">
        {/* โลโก้ / ชื่อเว็บ ทางซ้าย (กดเพื่อกลับหน้า Dashboard) */}
        <h1 className="justify-self-start text-xl font-bold tracking-tight text-[#1a1a1a]">
          <Link
            to="/"
            title="กลับหน้า Dashboard"
            className="cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            FindTheLost
          </Link>
        </h1>

        {/* แถบค้นหาตรงกลาง (UI ตาม Mockup) */}
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            readOnly
            placeholder="ค้นหา..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#f0f8ff] text-gray-700 rounded-full border border-transparent focus:outline-none focus:border-blue-300 transition-colors cursor-text"
          />
        </div>

        {/* ปุ่ม Profile ขวาสุด (คลิกได้) */}
        <div className="flex items-center justify-self-end">
          <button
            type="button"
            title="เข้าสู่ระบบ / โปรไฟล์"
            onClick={() => {}}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-900 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
