import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { MapPin } from 'lucide-react';
import { getMyClues } from '../services/api';
import type { MyClue } from '../types';

const CATEGORY_LABEL = { PERSON: 'คนหาย', PET: 'สัตว์หาย', ITEM: 'สิ่งของหาย' } as const;
const STATUS_LABEL = { LOST: 'กำลังตามหา', FOUND: 'พบแล้ว' } as const;

// TODO: เปลี่ยนเป็น user ปัจจุบันของคุณ (จาก context / state ที่เก็บตอน login หรือ dropdown เลือก user)
const CURRENT_USER_ID = 19;

export default function HistoryPage() {
  const { data: clues = [], isLoading, isError } = useQuery<MyClue[]>({
    queryKey: ['my-clues', CURRENT_USER_ID],
    queryFn: () => getMyClues(CURRENT_USER_ID),
  });

  if (isLoading) return <p className="text-gray-500">กำลังโหลด...</p>;
  if (isError) return <p className="text-red-600">โหลดประวัติไม่สำเร็จ</p>;

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-extrabold mb-6">ประวัติการแจ้งเบาะแส</h1>

      {clues.length === 0 ? (
        <p className="text-gray-500">คุณยังไม่เคยแจ้งเบาะแสให้เคสใดเลย</p>
      ) : (
        <ul className="space-y-4">
          {clues.map((clue) => (
            <li key={clue.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    to={`/reports/${clue.report.id}`}
                    className="font-semibold text-[#1a1a1a] hover:underline"
                  >
                    {clue.report.title}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {CATEGORY_LABEL[clue.report.category]} · {STATUS_LABEL[clue.report.status]}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(clue.createdAt).toLocaleString('th-TH')}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-700">{clue.message}</p>
              {clue.location && (
                <p className="mt-1 text-xs text-gray-500 inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden />
                  <span>{clue.location}</span>
                </p>
              )}
              {clue.imageUrl && (
                <img src={clue.imageUrl} alt="" className="mt-3 h-32 rounded-lg object-cover" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}