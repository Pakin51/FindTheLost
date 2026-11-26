import { ApiError } from "../../services/api";

/** แสดงข้อความ error จาก mutation (รวมรายละเอียด validation จาก Backend ถ้ามี) */
export default function ErrorNotice({ error }: { error: unknown }) {
  if (!error) return null;
  const message =
    error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
  const details = error instanceof ApiError ? error.details : [];

  return (
    <div
      role="alert"
      className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <p className="font-medium">{message}</p>
      {details.length > 0 && (
        <ul className="mt-1 list-disc pl-5 space-y-0.5">
          {details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
