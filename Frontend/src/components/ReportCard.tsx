import { useState } from 'react';
import { Link } from 'react-router';
import type { LostReport } from '../types';

interface ReportCardProps {
  report: LostReport;
}

export default function ReportCard({ report }: ReportCardProps) {
  const [imgError, setImgError] = useState(false);

  // แปลงวันที่ให้อ่านง่าย เช่น 20 พ.ย. 2026
  const formatThaiDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Link
      to={`/reports/${report.id}`}
      className="bg-[#fffffe] rounded-[24px] border border-black/30 p-2.5 flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group"
    >
      {/* กล่องรูปภาพด้านบน (ตาม report box.png) */}
      <div className="w-full h-44 rounded-[18px] bg-[#d5d5d5] overflow-hidden flex items-center justify-center relative">
        {report.imageUrl && !imgError ? (
          <img
            src={report.imageUrl}
            alt={report.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-white font-bold text-xl tracking-wide select-none drop-shadow-sm">
            PlaceHolder
          </span>
        )}

        {/* แท็กสถานะมุมบนขวา (LOST / FOUND) */}
        {report.status === 'FOUND' && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-md bg-green-600 text-white shadow">
            พบแล้ว
          </span>
        )}
      </div>

      {/* ข้อความด้านล่าง: ชื่อ และ วันแจ้งหาย */}
      <div className="pt-3 pb-1 px-1.5 flex flex-col justify-between">
        <h3
          className="font-bold text-base text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors"
          title={report.title}
        >
          {report.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium text-gray-700">วันแจ้งหาย:</span> {formatThaiDate(report.lostDate)}
        </p>
      </div>
    </Link>
  );
}
