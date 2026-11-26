import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/** Layout หลัก: Navbar ด้านบน + Sidebar ซ้าย + พื้นที่เนื้อหา (<Outlet /> แสดงหน้าตาม route) */
export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col font-sans">
      <Navbar />

      <div className="w-full px-4 md:px-6 flex gap-6 mt-4">
        <Sidebar />

        {/* พื้นที่แสดงผลเนื้อหาหลัก: จัดกึ่งกลางจอ */}
        <main className="flex-1 min-w-0 pt-2">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>

        {/* ตัวถ่วงฝั่งขวา กว้างเท่า Sidebar เพื่อให้เนื้อหาอยู่กลางจอพอดี */}
        <div className="hidden xl:block w-52 shrink-0" aria-hidden />
      </div>
    </div>
  );
}
