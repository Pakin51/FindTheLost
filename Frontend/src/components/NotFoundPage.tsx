import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-8 bg-white/70 rounded-3xl border border-gray-200 text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-2">ไม่พบหน้าที่ต้องการ</h2>
      <Link to="/" className="mt-2 text-sm font-medium text-blue-700 hover:underline">
        กลับหน้า Dashboard
      </Link>
    </div>
  );
}
